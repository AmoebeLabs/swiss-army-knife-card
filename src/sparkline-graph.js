import Colors from './colors';
import Utils from './utils';

export const X = 0;
export const Y = 1;
export const V = 2;
export const Y2 = 3;
export const RX = 4;
export const RY = 5;
// Margins
export const L = 0; // compatible with X
export const T = 1; // compatible with Y
export const R = 2;
export const B = 3;
export const ONE_HOUR = 1000 * 3600;

export const clockWidth = 20;

export default class SparklineGraph {
  constructor(width, height, margin, startOn, hours = 24, points = 1, aggregateFuncName = 'avg',
              groupBy = 'interval', smoothing = true, logarithmic = false,
              trafficLights = [], buckets = [], stateMap = [], config = {}) {
    this.aggregateFuncMap = {
      avg: this._average,
      median: this._median,
      max: this._maximum,
      min: this._minimum,
      first: this._first,
      last: this._last,
      sum: this._sum,
      delta: this._delta,
      diff: this._diff,
    };

    this.startOn = startOn;
    this.config = config;
    // Just trying to make sense for the graph drawing area
    //
    // @2023.07.02
    // What if there is a margin top/bottom and margin left/right. Then we would be able to create
    // anything that needs some offset for the actual drawing of the graph.
    // The only graph type that is relevant is the line/area graph.
    // - the area below the line goes to the bottom of the graph
    // - the line itself only upto the draw area of the graph, leaving space for the area fill
    // - See examples in Pinterest...
    //
    this.graphArea = {};
    this.graphArea.x = 0;
    this.graphArea.y = 0;
    this.graphArea.width = width - (2 * this.graphArea.x);
    this.graphArea.height = height - (2 * this.graphArea.y);

    this.drawArea = {};
    this.drawArea.x = margin.l;
    this.drawArea.y = margin.t;
    this.drawArea.top = margin.t;
    this.drawArea.bottom = margin.b;
    this.drawArea.width = width - (margin.l + margin.r);
    this.drawArea.height = height - (margin.t + margin.b);

    this._history = undefined;
    this.coords = [];
    this.width = width;
    this.height = height;
    this.margin = margin;
    // Testing
    this._max = 0;
    this._min = 0;
    this.points = points;
    this.hours = hours;
    this.aggregateFuncName = aggregateFuncName;
    this._calcPoint = this.aggregateFuncMap[aggregateFuncName] || this._average;
    this._smoothing = smoothing;
    this._logarithmic = logarithmic;
    this._groupBy = groupBy;
    this._endTime = 0;
    this.valuesPerBucket = 0;
    this.levelCount = 1;
    this.trafficLights = trafficLights;
    this.bucketss = buckets;
    this.stateMap = [...stateMap];
    this.clockWidth = Utils.calculateSvgDimension(this.config?.clock?.size || 5);
  }

  get max() { return this._max; }

  set max(max) { this._max = max; }

  get min() { return this._min; }

  set min(min) { this._min = min; }

  set history(data) { this._history = data; }

  update(history = undefined) {
    if (history) {
      this._history = history;
    }
    if (!this._history) return;
    if (this.history?.length === 0) return;

    this._updateEndTime();

    const histGroups = this._history.reduce((res, item) => this._reducer(res, item), []);

    // drop potential out of bound entry's except one
    if (histGroups[0] && histGroups[0].length) {
      histGroups[0] = [histGroups[0][histGroups[0].length - 1]];
    }

    // extend length to fill missing history.
    let requiredNumOfPoints;
    let date = new Date();
    date.getDate();
    // for now it is ok...
    if (this.startOn === 'today') {
      let hours = date.getHours() + date.getMinutes() / 60;
      requiredNumOfPoints = Math.ceil(hours * this.points);
    } else {
      requiredNumOfPoints = Math.ceil(this.hours * this.points);
    }
    histGroups.length = requiredNumOfPoints;

    if (this.startOn === 'yesterday') {
      console.log('update, yesterday, history = ', this.history, histGroups);
    }
    this.coords = this._calcPoints(histGroups);
    this.min = Math.min(...this.coords.map((item) => Number(item[V])));
    this.max = Math.max(...this.coords.map((item) => Number(item[V])));

    if ((this.config.show.graph === 'line') && (this.config.line?.show_minmax === true)) {
      // Just testing...
      // https://stackoverflow.com/questions/43576241/using-reduce-to-find-min-and-max-values
      const histGroupsMinMax = this._history.reduce((res, item) => this._reducerMinMax(res, item), []);

      // drop potential out of bound entry's except one
      if (histGroupsMinMax[0][0] && histGroupsMinMax[0][0].length) {
        histGroupsMinMax[0][0] = [histGroupsMinMax[0][0][histGroupsMinMax[0][0].length - 1]];
      }
      if (histGroupsMinMax[1][0] && histGroupsMinMax[1][0].length) {
        histGroupsMinMax[1][0] = [histGroupsMinMax[1][0][histGroupsMinMax[1][0].length - 1]];
      }

      // extend length to fill missing history
      // const requiredNumOfPoints = Math.ceil(this.hours * this.points);
      histGroupsMinMax[0].length = requiredNumOfPoints;
      histGroupsMinMax[1].length = requiredNumOfPoints;

      const histGroupsMin = [...histGroups];
      const histGroupsMax = [...histGroups];

      let prevFunction = this._calcPoint;
      this._calcPoint = this.aggregateFuncMap.min;
      this.coordsMin = [];
      this.coordsMin = this._calcPoints(histGroupsMin);
      this._calcPoint = this.aggregateFuncMap.max;
      this.coordsMax = [];
      this.coordsMax = this._calcPoints(histGroupsMax);
      this._calcPoint = prevFunction;

      // Adjust scale in this case...
      this.min = Math.min(...this.coordsMin.map((item) => Number(item[V])));
      this.max = Math.max(...this.coordsMax.map((item) => Number(item[V])));
    }
  }

  // This reducer calculates the min and max in a bucket. This is the REAL min and max
  // The other functions calculate the min and max from the function used (mostly avg)!!
  // This real min/max could be used to show the min/max graph on the background. Some filled
  // graph would be nice. That would mean we calculate each point (per bucket) and connect the
  // first point of the min/max array, and the last point of the min/max array.
  //
  // Array should be changed to [0][key], so we can pass the res[0] to some function to calculate
  // the resulting points. Must in that case also pass the function, ie max or min. Not the default
  // function, as that would give us (again) possible the avg...
  //
  // It could run with a single reducer, if using [0] for the buckets to calculate the function
  // and [1] for min, and [2] for max value in that bucket...

  _reducerMinMax(res, item) {
    const age = this._endTime - new Date(item.last_changed).getTime();
    const interval = (age / ONE_HOUR * this.points) - this.hours * this.points;
    const key = interval < 0 ? Math.floor(Math.abs(interval)) : 0;
    if (!res[0]) res[0] = [];
    if (!res[1]) res[1] = [];
    if (!res[0][key]) { res[0][key] = {}; res[1][key] = {}; }
    // Min value is always 0. So something goes wrong with Number I guess??
    // If item.state invalid, then returns 0 ???
    res[0][key].state = Math.min(res[0][key].state ? res[0][key].state : Number.POSITIVE_INFINITY, item.state);
    // Max seems to be OK!
    res[1][key].state = Math.max(res[1][key].state ? res[0][key].state : Number.NEGATIVE_INFINITY, item.state);
    return res;
  }

  _reducer(res, item) {
    const age = this._endTime - new Date(item.last_changed).getTime();
    const interval = (age / ONE_HOUR * this.points) - this.hours * this.points;
    const key = interval < 0 ? Math.floor(Math.abs(interval)) : 0;
    if (!res[key]) res[key] = [];
    res[key].push(item);
    return res;
  }

  _calcPoints(history) {
    const coords = [];
    let xRatio = this.drawArea.width / (this.hours * this.points - 1);
    xRatio = Number.isFinite(xRatio) ? xRatio : this.drawArea.width;

    const first = history.filter(Boolean)[0];
    let last = [this._calcPoint(first), this._lastValue(first)];
    const getCoords = (item, i) => {
      const x = (xRatio * i) + this.drawArea.x;
      if (item)
        last = [this._calcPoint(item), this._lastValue(item)];
      return coords.push([x, 0, item ? last[0] : last[1]]);
    };

    for (let i = 0; i < history.length; i += 1)
      getCoords(history[i], i);

    return coords;
  }

  _calcY(coords) {
    // account for logarithmic graph
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;

    const yRatio = ((max - min) / (this.drawArea.height)) || 1;
    const coords2 = coords.map((coord) => {
      const val = this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V];

      const offset = (min < 0) ? Math.abs(min) : 0;
      const val0 = (val > 0)
        ? (val - Math.max(0, min))
        : 0;

      const coord0 = this.drawArea.height + this.drawArea.y - val0 / yRatio;

      const coordY2 = (val > 0)
        ? this.drawArea.height + this.drawArea.y * 1 - (offset / yRatio) - ((val - Math.max(0, min)) / yRatio) // - this.margin.y * 2
        : this.drawArea.height + this.drawArea.y * 1 - ((0 - min) / yRatio);// - this.margin.y * 4;
      const coordY = this.drawArea.height + this.drawArea.y * 1 - ((val - (min)) / yRatio); // - this.margin.y * 2;

      return [coord[X], coordY, coord[V], coordY2];
    });
    return coords2;
  }

  _calcLevelY(coord) {
    // account for logarithmic graph
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;

    const yRatio = ((max - min) / (this.drawArea.height)) || 1;
    const offset = (min < 0) ? Math.abs(min) : 0;
    let yStack = [];
    // should be reduce or something... to return an array...
    const coordYs = coord[V].forEach((val, index) => {
      const coordY = (val >= 0)
        ? this.drawArea.height + this.drawArea.y * 1 - (1 * offset / yRatio) - ((val - Math.max(0, min)) / yRatio) // - this.margin.y * 2
        : this.drawArea.height + this.drawArea.y * 1 - ((0 - val) / yRatio);
      yStack.push(coordY);
      return yStack;
    });
    return yStack;
  }

  getPoints() {
    let { coords } = this;
    if (coords.length === 1) {
      coords[1] = [this.width + this.margin.x, 0, coords[0][V]];
    }
    coords = this._calcY(this.coords);
    let next; let Z;
    let last = coords[0];
    coords.shift();
    const coords2 = coords.map((point, i) => {
      next = point;
      Z = this._smoothing ? this._midPoint(last[X], last[Y], next[X], next[Y]) : next;
      const sum = this._smoothing ? (next[V] + last[V]) / 2 : next[V];
      last = next;
      return [Z[X], Z[Y], sum, i + 1];
    });
    return coords2;
  }

  getPath() {
    let { coords } = this;
    if (coords.length === 1) {
      coords[1] = [this.width + this.margin.x, 0, coords[0][V]];
    }
    coords = this._calcY(this.coords);
    let next; let Z;
    let path = '';
    let last = coords[0];
    path += `M${last[X]},${last[Y]}`;

    coords.forEach((point) => {
      next = point;
      Z = this._smoothing ? this._midPoint(last[X], last[Y], next[X], next[Y]) : next;
      path += ` ${Z[X]},${Z[Y]}`;
      path += ` Q ${next[X]},${next[Y]}`;
      last = next;
    });
    path += ` ${next[X]},${next[Y]}`;
    return path;
  }

  getPathMin() {
    let { coordsMin } = this;
    if (coordsMin.length === 1) {
      coordsMin[1] = [this.width + this.margin.x, 0, coordsMin[0][V]];
    }
    coordsMin = this._calcY(this.coordsMin);
    let next; let Z;
    let path = '';
    let last = coordsMin[0];
    path += `M${last[X]},${last[Y]}`;

    coordsMin.forEach((point) => {
      next = point;
      Z = next;
      path += ` ${Z[X]},${Z[Y]}`;
      path += ` Q ${next[X]},${next[Y]}`;
      last = next;
    });
    path += ` ${next[X]},${next[Y]}`;
    return path;
  }

  // Get this in reverse...
  getPathMax() {
    let { coordsMax } = this;
    if (coordsMax.length === 1) {
      coordsMax[1] = [this.width + this.margin.x, 0, coordsMax[0][V]];
    }
    coordsMax = this._calcY(this.coordsMax);
    let next; let Z;
    let path = '';
    // let last = coordsMax[0];
    let last = coordsMax[coordsMax.length - 1];
    // path += `M${last[X]},${last[Y]}`;

    coordsMax.reverse().forEach((point, index, points) => {
      next = point;
      Z = next;
      path += ` ${Z[X]},${Z[Y]}`;
      path += ` Q ${next[X]},${next[Y]}`;
      last = next;
    });
    path += ` ${next[X]},${next[Y]}`;
    path += `M${last[X]},${last[Y]}`;
    return path;
  }

  computeGradient(thresholds, logarithmic) {
    const scale = logarithmic
      ? Math.log10(Math.max(1, this._max)) - Math.log10(Math.max(1, this._min))
      : this._max - this._min;

    return thresholds.map((stop, index, arr) => {
      let color;
      if (stop.value > this._max && arr[index + 1]) {
        const factor = (this._max - arr[index + 1].value) / (stop.value - arr[index + 1].value);
        // color = interpolateColor(arr[index + 1].color, stop.color, factor);
        color = Colors.getGradientValue(arr[index + 1].color, stop.color, factor);
      } else if (stop.value < this._min && arr[index - 1]) {
        const factor = (arr[index - 1].value - this._min) / (arr[index - 1].value - stop.value);
        color = Colors.getGradientValue(arr[index - 1].color, stop.color, factor);
        // color = interpolateColor(arr[index - 1].color, stop.color, factor);
      }
      let offset;
      if (scale <= 0) {
        offset = 0;
      } else if (logarithmic) {
        offset = (Math.log10(Math.max(1, this._max))
          - Math.log10(Math.max(1, stop.value)))
          * (100 / scale);
      } else {
        offset = (this._max - stop.value) * (100 / scale);
      }
      return {
        color: color || stop.color,
        offset,
      };
    });
  }

  // #TODO. Is not right...
  // Weird stuff...
  getFillMinMax(pathMin, pathMax) {
    let fill = pathMin;
    fill += ` L ${this.coordsMax[this.coordsMax.length - 1][X]},
                ${this.coordsMax[this.coordsMax.length - 1][Y]}`;
    fill += pathMax;
    fill += ' z';
    return fill;
  }

  getFill(path) {
    const y_zero = (this._min >= 0) ? this.height
    : this.height + 0 - ((Math.abs(this._min) / ((this._max - this._min)) * this.height));
    const height = y_zero + this.drawArea.y * 1.5; // Should be this.svg.line_width;
    let fill = path;
    // fill += ` L ${this.drawArea.width + this.drawArea.x}, ${height}`;
    // fill += ` L ${this.coords[0][X]}, ${height} z`;
    fill += ` L ${this.coords[this.coords.length - 1][X] + this.drawArea.x}, ${height}`;
    fill += ` L ${this.coords[0][X]}, ${height} z`;
    return fill;
  }

  polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radiusX * Math.cos(angleInRadians)),
      y: centerY + (radiusY * Math.sin(angleInRadians)),
    };
  }

  _calcClockCoords(argStartAngle, argEndAngle, argClockwise, argRadiusX, argRadiusY, argWidth) {
    const cx = this.drawArea.x + this.drawArea.width / 2;
    const cy = this.drawArea.y + this.drawArea.height / 2;
    const start = this.polarToCartesian(cx, cy, argRadiusX, argRadiusY, argEndAngle);
    const end = this.polarToCartesian(cx, cy, argRadiusX, argRadiusY, argStartAngle);
    const largeArcFlag = Math.abs(argEndAngle - argStartAngle) <= 180 ? '0' : '1';

    const sweepFlag = argClockwise ? '0' : '1';

    const cutoutRadiusX = argRadiusX - argWidth;
    const cutoutRadiusY = argRadiusY - argWidth;
    const start2 = this.polarToCartesian(cx, cy, cutoutRadiusX, cutoutRadiusY, argEndAngle);
    const end2 = this.polarToCartesian(cx, cy, cutoutRadiusX, cutoutRadiusY, argStartAngle);
    return {
      start, end, start2, end2, largeArcFlag, sweepFlag,
    };
  }

  _calcClock(coords) {
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;
    const segments = this.hours * this.points;
    const angleSize = 360 / segments;
    const startAngle = 0;
    let runningAngle = startAngle;
    const clockWise = true;
    const wRatio = ((max - min) / this.clockWidth);

    const coords2 = coords.map((coord) => {
      const piet = 9;
      const coordY = 8;
      const coordY2 = 2;
      let ringWidth;
      let radius;
      if (this.config.show?.variant === 'sunburst') {
        ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / wRatio;
        radius = this.drawArea.width / 2 - this.clockWidth + ringWidth;
      } else {
        ringWidth = this.clockWidth;
        radius = this.drawArea.width / 2;
      }
      let newX = [];
      let newY = [];
      let radiusX = [];
      let radiusY = [];
      const {
        start, end, start2, end2, largeArcFlag, sweepFlag,
      } = this._calcClockCoords(
        runningAngle, runningAngle + angleSize, clockWise,
        radius, radius, ringWidth);
      runningAngle += angleSize;
      newX.push(start.x, end.x, start2.x, end2.x);
      newY.push(start.y, end.y, start2.y, end2.y);
      radiusX.push(this.drawArea.width / 2, this.drawArea.width / 2 - this.clockWidth);
      radiusY.push(this.drawArea.height / 2, this.drawArea.height / 2 - this.clockWidth);
      return [newX, newY, coord[V], 0, radiusX, radiusY, largeArcFlag, sweepFlag];
    });
    return coords2;
  }

  getClock(position, total, spacing = 4) {
    const clockCoords = this._calcClock(this.coords);

    return clockCoords.map((coord, i) => ({
      start: { x: coord[X][0], y: coord[Y][0] },
      end: { x: coord[X][1], y: coord[Y][1] },
      start2: { x: coord[X][2], y: coord[Y][2] },
      end2: { x: coord[X][3], y: coord[Y][3] },
      radius: { x: coord[RX][0], y: coord[RY][0] },
      radius2: { x: coord[RX][1], y: coord[RY][1] },
      largeArcFlag: coord[6],
      sweepFlag: coord[7],
      value: coord[V],
    }));
  }

  getClockPaths() {
    const clockPaths = this.clock.map((segment, index) => {
      const d = [
        'M', segment.start.x, segment.start.y,
        'A', segment.radius.x, segment.radius.y, 0, segment.largeArcFlag, segment.sweepFlag, segment.end.x, segment.end.y,
        'L', segment.end2.x, segment.end2.y,
        'A', segment.radius2.x, segment.radius2.y, 0, segment.largeArcFlag, segment.sweepFlag === '0' ? '1' : '0', segment.start2.x, segment.start2.y,
        'Z',
      ].join(' ');
      return d;
    });
    return clockPaths;
  }

  getTimeline(position, total, spacing = 4) {
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;

    const coords = this.coords;
    const xRatio = ((this.drawArea.width + spacing) / Math.ceil(this.hours * this.points)) / total;
    const yRatio = ((max - min) / this.drawArea.height) || 1;

    const bucketHeight = (this.drawArea.height - (this.bucketss.length * 0)) / this.bucketss.length;

    if (this.config.show.variant === 'audio') {
      return coords.map((coord, i) => ({
        x: (xRatio * i * total) + (xRatio * position) + this.drawArea.x,
        y: this.drawArea.height / 2 - (((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / yRatio / 2), // * bucketHeight / 2), // 0,
        height: ((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / yRatio, // * bucketHeight,
        width: xRatio - spacing,
        value: coord[V],
      }));
    } else {
      return coords.map((coord, i) => ({
        x: (xRatio * i * total) + (xRatio * position) + this.drawArea.x,
        y: 0,
        height: this.drawArea.height,
        width: xRatio - spacing,
        value: coord[V],
      }));
    }
  }

  // Get array of levels. Just levels which draw a little bar at each level once reached
  getEqualizer(position, total, spacing = 4) {
    const xRatio = ((this.drawArea.width + spacing) / Math.ceil(this.hours * this.points)) / total;
    const yRatio = ((this._max - this._min) / this.drawArea.height) || 1;
    const offset = this._min < 0 ? (Math.abs(this._min)) / yRatio : 0;

    // Calculate height of each level rectangle
    // we have drawarea.height. We have steprange and spacing.
    // height / steprange = max height rectangle. Minus spacing = height??
    const levelHeight = (this.drawArea.height - (this.levelCount * spacing)) / this.levelCount;

    let stepRange;
    let equalizerCoords = this.coords.map((coord, i) => {
      let newCoord = [];
      const stepMax = Math.trunc(coord[V] / this.valuesPerBucket);
      const stepMin = Math.trunc(this._min / this.valuesPerBucket);
      stepRange = (stepMax - stepMin);

      newCoord[X] = coord[X];
      newCoord[Y] = [];
      newCoord[V] = [];
      for (let i = 0; i < stepRange; i++) {
        newCoord[V][i] = this._min + (i * this.valuesPerBucket);
      }
      newCoord[Y] = this._calcLevelY(newCoord);
      return newCoord;
    });
    return equalizerCoords.map((coord, i) => ({
      x: (xRatio * i * total) + (xRatio * position) + this.drawArea.x, // Remove start spacing + spacing,
      y: coord[Y],
      height: levelHeight, // 1 * (stepRange + 1) / yRatio, // 10, // (yRatio - spacing) / this.levels, // (this.max - this.min) / this.levelCount / yRatio, // coord[V] > 0 ? (this._min < 0 ? coord[V] / yRatio : (coord[V] - this._min) / yRatio)
                          // : coord[Y] - coord[Y2],
      width: xRatio - spacing,
      // value: levelCoords[V],
      value: coord[V],
    }));
  }

  getTrafficLights(position, total, spacing = 4) {
    const xRatio = ((this.drawArea.width + spacing) / Math.ceil(this.hours * this.points)) / total;
    const bucketHeight = (this.drawArea.height - (this.bucketss.length * spacing)) / this.bucketss.length;

    let stepRange;
    let levelCoords = this.coords.map((coord, i) => {
      let newCoord = [];
      const stepMax = this.bucketss.length;
      const stepMin = 0;
      stepRange = (stepMax - stepMin);

      newCoord[X] = coord[X];
      newCoord[Y] = [];
      newCoord[V] = [];
      // Check for buckets, and ranges min/max...
      // i is the bucket index!
      let matchStep = -1;
      let matchBucket = 0;
      let match = false;
      // #TODO
      // Both loops can be in one loop, using else if not (yet) in bucket. There MUST be a bucket
      // Is the assumption... Or leave it this way, and assume there might be NO bucket...
      for (let i = 0; i < stepRange; i++) {
        // In which bucket...
        // Find matching bucket. Can be any of them defined
        match = false;
        matchBucket = 0;
        for (let j = 0; j < this.bucketss[i].rangeMin.length; j++) {
          if (coord[V] >= this.bucketss[i].rangeMin[j] && coord[V] < this.bucketss[i].rangeMax[j]) {
            match = true;
            matchBucket = j;
            matchStep = i;
          }
        }
      }

      // We have the matching index
      for (let i = 0; i <= matchStep; i++) {
        newCoord[V][i] = this.bucketss[i].length > matchBucket ? this.bucketss[i].rangeMin[matchBucket] : this.bucketss[i].rangeMin[0];
        newCoord[Y][i] = this.drawArea.height - i * (bucketHeight + spacing);
      }
      return newCoord;
    });
    return levelCoords.map((coord, i) => ({
      x: (xRatio * i * total) + (xRatio * position) + this.drawArea.x, // Remove start spacing + spacing,
      y: coord[Y],
      height: bucketHeight,
      width: xRatio - spacing,
      value: coord[V],
    }));
  }

  getBars(position, total, spacing = 4) {
    const coords = this._calcY(this.coords);
    const xRatio = ((this.drawArea.width + spacing) / Math.ceil(this.hours * this.points)) / total;
    const yRatio = ((this._max - this._min) / this.drawArea.height) || 1;
    const offset = this._min < 0 ? (Math.abs(this._min)) / yRatio : 0;

    return coords.map((coord, i) => ({
      x: (xRatio * i * total) + (xRatio * position) + this.drawArea.x, // Remove start spacing + spacing,
      y: this._min > 0 ? coord[Y] : coord[Y2],
      height: coord[V] > 0 ? (this._min < 0 ? coord[V] / yRatio : (coord[V] - this._min) / yRatio)
                           : coord[Y] - coord[Y2],
      width: xRatio - spacing,
      value: coord[V],
    }));
  }

  _midPoint(Ax, Ay, Bx, By) {
    const Zx = (Ax - Bx) / 2 + Bx;
    const Zy = (Ay - By) / 2 + By;
    return [Zx, Zy];
  }

  _average(items) {
    return items.reduce((sum, entry) => (sum + parseFloat(entry.state)), 0) / items.length;
  }

  _median(items) {
    const itemsDup = [...items].sort((a, b) => parseFloat(a) - parseFloat(b));
    const mid = Math.floor((itemsDup.length - 1) / 2);
    if (itemsDup.length % 2 === 1)
      return parseFloat(itemsDup[mid].state);
    return (parseFloat(itemsDup[mid].state) + parseFloat(itemsDup[mid + 1].state)) / 2;
  }

  _maximum(items) {
    return Math.max(...items.map((item) => item.state));
  }

  _minimum(items) {
    return Math.min(...items.map((item) => item.state));
  }

  _first(items) {
    return parseFloat(items[0].state);
  }

  _last(items) {
    return parseFloat(items[items.length - 1].state);
  }

  _sum(items) {
    return items.reduce((sum, entry) => sum + parseFloat(entry.state), 0);
  }

  _delta(items) {
    return this._maximum(items) - this._minimum(items);
  }

  _diff(items) {
    return this._last(items) - this._first(items);
  }

  _lastValue(items) {
    if (['delta', 'diff'].includes(this.aggregateFuncName)) {
      return 0;
    } else {
      return parseFloat(items[items.length - 1].state) || 0;
    }
  }

  _updateEndTime() {
    this._endTime = new Date();
    if (this.startOn === 'yesterday') {
      // #TODO:
      // Should account for hours_to_show. Maybe user wants to show the past 48 hours.
      // Now I assume it is just yesterday, ie hours_to_show === 24
      this._endTime.setHours(0, 0, 0, 0);
    } else {
      switch (this._groupBy) {
        case 'month':
          this._endTime.setMonth(this._endTime.getMonth() + 1);
          this._endTime.setDate(1);
          break;
        case 'date':
          this._endTime.setDate(this._endTime.getDate() + 1);
          this._endTime.setHours(0, 0, 0, 0);
          break;
        case 'hour':
          this._endTime.setHours(this._endTime.getHours() + 1);
          this._endTime.setMinutes(0, 0, 0);
          break;
        default:
          break;
      }
    }
  }
}
