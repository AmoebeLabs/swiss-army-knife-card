import Colors from './colors';

export const X = 0;
export const Y = 1;
export const V = 2;
export const Y2 = 3;
export const ONE_HOUR = 1000 * 3600;

export default class SparklineGraph {
  constructor(width, height, margin, hours = 24, points = 1, aggregateFuncName = 'avg', groupBy = 'interval', smoothing = true, logarithmic = false) {
    const aggregateFuncMap = {
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

    // Grrr. Getting sick and tired of that margin stuff. I changed something, and now it is difficult
    // to get it working again...
    // this.widthOuter = width;
    // this.heightOuter = height;
    // this.widthInner = width - margin[X] * 2;
    // this.heightInner = height - margin[Y] * 4;

    // NOTE!!!!!!!!!!!!!!!
    // Should also correct height for the line_width. That is unknown yet. In that case, the
    // height also changes depending on the line. Margin should take this all into account...
    // Hmmmmmm.

    // Just trying to make sense for the graph drawing area
    this.graphArea = {};
    this.graphArea.x = 0;
    this.graphArea.y = 0;
    this.graphArea.width = width - (2 * this.graphArea.x);
    this.graphArea.height = height - (2 * this.graphArea.y);

    this.drawArea = {};
    this.drawArea.x = margin[X];
    this.drawArea.y = margin[Y];
    this.drawArea.width = width - (2 * this.drawArea.x);
    this.drawArea.height = height - (2 * this.drawArea.y);

    this._history = undefined;
    this.coords = [];
    this.width = width - margin[X] * 2;
    this.height = height - margin[Y] * 2;
    this.margin = margin;
    // Testing
    this._max = 0;
    this._min = 0;
    this.points = points;
    this.hours = hours;
    this.aggregateFuncName = aggregateFuncName;
    this._calcPoint = aggregateFuncMap[aggregateFuncName] || this._average;
    this._smoothing = smoothing;
    this._logarithmic = logarithmic;
    this._groupBy = groupBy;
    this._endTime = 0;
  }

  get max() { return this._max; }

  set max(max) { this._max = max; }

  get min() { return this._min; }

  set min(min) { this._min = min; }

  set history(data) { this._history = data; }

  update(history = undefined) {
    // console.log('Graph::update', history);
    if (history) {
      this._history = history;
    }
    if (!this._history) return;
    this._updateEndTime();

    const histGroups = this._history.reduce((res, item) => this._reducer(res, item), []);

    // drop potential out of bound entry's except one
    if (histGroups[0] && histGroups[0].length) {
      histGroups[0] = [histGroups[0][histGroups[0].length - 1]];
    }

    // extend length to fill missing history
    const requiredNumOfPoints = Math.ceil(this.hours * this.points);
    histGroups.length = requiredNumOfPoints;

    this.coords = this._calcPoints(histGroups);
    this.min = Math.min(...this.coords.map((item) => Number(item[V])));
    this.max = Math.max(...this.coords.map((item) => Number(item[V])));
    // console.log('Graph::update end', this.coords, this.min, this.max);
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
    let xRatio = this.width / (this.hours * this.points - 1);
    xRatio = Number.isFinite(xRatio) ? xRatio : this.width;

    const first = history.filter(Boolean)[0];
    let last = [this._calcPoint(first), this._lastValue(first)];
    const getCoords = (item, i) => {
      // Getting double margin, so remove this one?
      // the shift to the right is both for points and the line graph
      // Weird, but with margin removed, line and dots are OK.
      //
      // Margin is already applied elsewhere orso?? Where ????
      // 2023.06.22
      // const x = xRatio * i; // + this.margin[X];
      const x = (xRatio * i) + this.drawArea.x;
      if (item)
        last = [this._calcPoint(item), this._lastValue(item)];
      return coords.push([x, 0, item ? last[0] : last[1]]);
    };

    for (let i = 0; i < history.length; i += 1)
      getCoords(history[i], i);

    return coords;
  }

  // How to account for negative values?
  // Say: min = -10, max = 30, height = 100
  // yratio = (60 - -40) / 100 = 1
  // val = -5
  // coordY = 100 - ((-5 - -10) / 1) + 0 = 90 / 1 = 90. bar is 100-90 = 10 in height.
  // Height however should be 10 or -10. Maybe / 0,5, so 20 or -20. (below 0)
  //
  // yratio = (100 - 0) / 100 = 1
  // val = 5
  // coordY = 100 - ((5 - 0) / 1) + 0 = 90 / 1 = 90. Bar is 100-90 = 10 in height.
  //
  // Height is ok. But depending on negative this.min, the bar should be drawn
  // in reverse, ie coordY is the BOTTOM of the bar (top = 0 - this.min), where in other
  // situations coordY is the TOP of the bar (bottom = this.min)
  _calcY(coords) {
    // account for logarithmic graph
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;

    const yRatio = ((max - min) / (this.drawArea.height)) || 1; // - this.margin[Y] * 100)) || 1;
    const coords2 = coords.map((coord) => {
      const val = this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V];

      // NO. Y should be the point. Not the top or bottom. Always the value to point.
      // The rendering should then take action: a dot is a dot on the Y. But an area
      // should check for negative value, and so for a bar...
      const offset = (min < 0) ? Math.abs(min) : 0;
      const val0 = (val > 0)
        ? (val - Math.max(0, min))
        : 0;

      const coord0 = this.drawArea.height + this.drawArea.y - val0 / yRatio;

      const coordY2 = (val > 0)
        ? this.drawArea.height + this.drawArea.y * 1 - (offset / yRatio) - ((val - Math.max(0, min)) / yRatio) // - this.margin[Y] * 2
        : this.drawArea.height + this.drawArea.y * 1 - ((0 - min) / yRatio);// - this.margin[Y] * 4;
      // const coordY = this.height - ((val - Math.max(0, min)) / yRatio) + this.margin[Y] * 2;

      // if negative value
      // y0 = (point at y zero). Very simple...
      // max / (max - min) as the 0-1 value for y0 value
      // if max = 40, min = -20. then y0 = (40 / (40 --20)) = 2/3 = 0,6666
      // so that height is 2/3 / yRatio. That is the height, ie coordy0

      // const coordY = this.drawArea.height - ((val - (min)) / yRatio); // - this.margin[Y] * 2;
      const coordY = this.drawArea.height + this.drawArea.y * 1 - ((val - (min)) / yRatio); // - this.margin[Y] * 2;

      if (this.margin[Y] !== 0)
        console.log('calcY, val, Y = ', val, coordY, coordY2);

      // The actual coordinate also is wrong in some cases...
      // console.log('coordY, coordY2', coordY, coord[V], y_2, min, max, yRatio);
      return [coord[X], coordY, coord[V], coordY2];
    });
    console.log('calcY', this.drawArea.height, this.drawArea.width, coords2);
    return coords2;
  }

  getPoints() {
    let { coords } = this;
    if (coords.length === 1) {
      coords[1] = [this.width + this.margin[X], 0, coords[0][V]];
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
      coords[1] = [this.width + this.margin[X], 0, coords[0][V]];
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

  getFill2(path) {
    const height = this.height + this.margin[Y] * 4;
    let fill = path;
    fill += ` L ${this.width - this.margin[X] * 2}, ${height}`;
    fill += ` L ${this.coords[0][X]}, ${height} z`;
    return fill;
  }

  getFill(path) {
    // We got the fill, ie the line path. Now make it connect on the y_zero axis
    // We need a different height...
    // const y_zero = (this._min >= 0) ? this.height + this.margin[Y] * 4
    // : this.height + this.margin[Y] * 4 + 1 - ((Math.abs(this._min) / ((this._max - this._min)) * this.height));

    const y_zero = (this._min >= 0) ? this.height
    : this.height + 0 - ((Math.abs(this._min) / ((this._max - this._min)) * this.height));

    // const height = this.height + this.margin[Y] * 4;
    // const height = y_zero + this.margin[Y] * 4; // * 4;

    // Using * 1, the y does not stretch upto the lower y of the graph (you see the margin).
    // Using * 2, the y does stretch upto the lower y of the graph (you don't see a margin)
    // Now: what should it be...
    //
    const height = y_zero + this.drawArea.y * 1.5; // Should be this.svg.line_width;
    let fill = path;
    // fill += ` L ${this.width + this.margin[X]}, ${height}`;
    fill += ` L ${this.width + this.drawArea.x}, ${height}`;
    // fill += ` L ${this.width + 0}, ${height}`;
    fill += ` L ${this.coords[0][X]}, ${height} z`;
    return fill;
  }

  // IT seems that getBars() should account for negative values, as this function calculates
  // the x, y, height and width of the bar that is displayed as an SVG rect.
  // if this.min < 0
  // y = coord[Y] + this.min
  // height = this.height - .. etc. These things are difficult for me. Math sucks...
  //
  getBars(position, total, spacing = 4) {
    // console.log('getBars', position, total, spacing, this.coords);
    const coords = this._calcY(this.coords);
    // Each bar has spacing on the right side. And manually on the left side.
    // Remove start spacing, and remove end spacing by adding spacing to width
    // Now the bar has the full width, as it should be!!!!!!
    // const xRatio = ((this.width - spacing) / Math.ceil(this.hours * this.points)) / total;
    const xRatio = ((this.drawArea.width + spacing) / Math.ceil(this.hours * this.points)) / total;
    const yRatio = ((this._max - this._min) / this.drawArea.height) || 1;
    const offset = this._min < 0 ? (Math.abs(this._min)) / yRatio : 0;
    // console.log('getBars, xRatio etc.', xRatio, this.width, spacing, this.hours, this.points);

    // 2023.06.22
    // calc is wrong if margin > 0. question is why, and if the Y2 coord is wrong or not.
    // in that case, the other function should be changed...

    coords.map((coord, i) => {
      const x = (xRatio * i * total) + (xRatio * position) + this.drawArea.x;
      const y = this._min > 0 ? coord[Y] : coord[Y2];
      // const height = coord[V] > 0 ? this.drawArea.height - offset - coord[Y] : coord[Y] - coord[Y2];
      const height = coord[V] > 0 ? this._min < 0 ? coord[V] / yRatio : coord[Y] - coord[Y2] : (coord[V] - this._min) / yRatio;
      const width = xRatio - spacing;
      const value = coord[V];
      if (this.margin[Y] > 0) console.log('coords.mapping, i', i, 'x=', Math.round(x),
         'y=', Math.round(y), 'height=', Math.round(height),
         'width=', Math.round(width), 'val=', Math.round(value));
      return true;
    });

    return coords.map((coord, i) => ({
      x: (xRatio * i * total) + (xRatio * position) + this.drawArea.x, // Remove start spacing + spacing,
      y: this._min > 0 ? coord[Y] : coord[Y2],
      // height: coord[V] > 0 ? this.drawArea.height - offset - coord[Y] : coord[Y] - coord[Y2],
      // height: coord[V] > 0 ? this.height - offset - coord[Y] + this.margin[Y] * 4 : coord[Y] - coord[Y2] + this.margin[Y] * 4,

      // Works, but with only positive values, bars are too long, upto zero!
      // height: coord[V] > 0 coord[V] / yRatio : ) : coord[Y] - coord[Y2],
      height: coord[V] > 0 ? (this._min < 0 ? coord[V] / yRatio : (coord[V] - this._min) / yRatio)
                           : coord[Y] - coord[Y2],
      width: xRatio - spacing,
      value: coord[V],
    }));
    return coords.map((coord, i) => ({
      x: (xRatio * i * total) + (xRatio * position) + spacing,
      y: coord[Y],
      height: this.height - coord[Y] + this.margin[Y] * 4,
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
