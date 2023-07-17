import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import BaseTool from './base-tool';
import Utils from './utils';
import SparklineGraph, { X, Y, V } from './sparkline-graph';
import Colors from './colors';

const getTime = (date, extra, locale = 'en-US') => date.toLocaleString(locale, { hour: 'numeric', minute: 'numeric', ...extra });
const getMilli = (hours) => hours * 60 ** 2 * 10 ** 3;
const getFirstDefinedItem = (...collection) => collection.find((item) => typeof item !== 'undefined');
const DEFAULT_COLORS = [
  'var(--accent-color)',
  '#3498db',
  '#e74c3c',
  '#9b59b6',
  '#f1c40f',
  '#2ecc71',
  '#1abc9c',
  '#34495e',
  '#e67e22',
  '#7f8c8d',
  '#27ae60',
  '#2980b9',
  '#8e44ad',
];

/**
 * Starting from the given index, increment the index until an array element with a
 * "value" property is found
 *
 * @param {Array} stops
 * @param {number} startIndex
 * @returns {number}
 */
const findFirstValuedIndex = (stops, startIndex) => {
  for (let i = startIndex, l = stops.length; i < l; i += 1) {
    if (stops[i].value != null) {
      return i;
    }
  }
  throw new Error(
    'Error in threshold interpolation: could not find right-nearest valued stop. '
    + 'Do the first and last thresholds have a set "value"?',
  );
};

/**
 * Interpolates the "value" of each stop. Each stop can be a color string or an object of type
 * ```
 * {
 *   color: string
 *   value?: number | null
 * }
 * ```
 * And the values will be interpolated by the nearest valued stops.
 *
 * For example, given values `[ 0, null, null, 4, null, 3]`,
 * the interpolation will output `[ 0, 1.3333, 2.6667, 4, 3.5, 3 ]`
 *
 * Note that values will be interpolated ascending and descending.
 * All that's necessary is that the first and the last elements have values.
 *
 * @param {Array} stops
 * @returns {Array<{ color: string, value: number }>}
 */
const interpolateStops = (stops) => {
  if (!stops || !stops.length) {
    return stops;
  }
  if (stops[0].value == null || stops[stops.length - 1].value == null) {
    throw new Error('The first and last thresholds must have a set "value".\n See xyz manual');
  }

  let leftValuedIndex = 0;
  let rightValuedIndex = null;

  return stops.map((stop, stopIndex) => {
    if (stop.value != null) {
      leftValuedIndex = stopIndex;
      return { ...stop };
    }

    if (rightValuedIndex == null) {
      rightValuedIndex = findFirstValuedIndex(stops, stopIndex);
    } else if (stopIndex > rightValuedIndex) {
      leftValuedIndex = rightValuedIndex;
      rightValuedIndex = findFirstValuedIndex(stops, stopIndex);
    }

    // y = mx + b
    // m = dY/dX
    // x = index in question
    // b = left value

    const leftValue = stops[leftValuedIndex].value;
    const rightValue = stops[rightValuedIndex].value;
    const m = (rightValue - leftValue) / (rightValuedIndex - leftValuedIndex);
    return {
      color: typeof stop === 'string' ? stop : stop.color,
      value: m * stopIndex + leftValue,
    };
  });
};

const computeThresholds = (stops, type) => {
  const valuedStops = interpolateStops(stops);
  valuedStops.sort((a, b) => b.value - a.value);

  if (type === 'smooth') {
    return valuedStops;
  } else {
    const rect = [].concat(...valuedStops.map((stop, i) => ([stop, {
      value: stop.value - 0.0001,
      color: valuedStops[i + 1] ? valuedStops[i + 1].color : stop.color,
    }])));
    return rect;
  }
};

/** ****************************************************************************
  * SparklineBarChartTool class
  *
  * Summary.
  *
  */
export default class SparklineGraphTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_GRAPH_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        height: 25,
        width: 25,
        margin: 0.5,
      },
      hours_to_show: 24,
      points_per_hour: 0.5,
      value_buckets: 10,
      animate: true,
      hour24: false,
      font_size: 10,
      aggregate_func: 'avg',
      group_by: 'interval',
      line_color: [...DEFAULT_COLORS],
      color_thresholds: [],
      color_thresholds_transition: 'smooth',
      line_width: 5,
      bar_spacing: 4,
      compress: true,
      smoothing: true,
      state_map: [],
      cache: true,
      value_factor: 0,
      color: 'var(--primary-color)',
      clock: {
        size: 5,
        line_width: 0,
        face: {
          hour_marks_count: 24,
        },
      },
      classes: {
        tool: {
          'sak-graph': true,
          hover: true,
        },
        bar: {
        },
        line: {
          'sak-graph__line': true,
          hover: true,
        },
        clock_face_day_night: {
          'sak-graph__clock-face_day-night': true,
        },
        clock_face_hour_marks: {
          'sak-graph__clock-face_hour-marks': true,
        },
        clock_face_hour_numbers: {
          'sak-graph__clock-face_hour-numbers': true,
        },
      },
      styles: {
        tool: {
        },
        line: {
        },
        bar: {
        },
        clock_face_day_night: {
        },
        clock_face_hour_marks: {
        },
        clock_face_hour_numbers: {
        },
        area_mask_above: {
          fill: 'url(#sak-graph-area-mask-tb-1)',
        },
        area_mask_below: {
          fill: 'url(#sak-graph-area-mask-bt-1)',
        },
        bar_mask_above: {
          fill: 'url(#sak-graph-bar-mask-tb-80)',
        },
        bar_mask_below: {
          fill: 'url(#sak-graph-bar-mask-bt-80)',
        },
      },
      colorstops: [],
      show: { style: 'fixedcolor' },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_GRAPH_CONFIG, argConfig), argPos);

    this.svg.margin = {};
    if (typeof this.config.position.margin === 'object') {
      this.svg.margin.t = Utils.calculateSvgDimension(this.config.position.margin?.t)
          || Utils.calculateSvgDimension(this.config.position.margin?.y);
      this.svg.margin.b = Utils.calculateSvgDimension(this.config.position.margin?.b)
          || Utils.calculateSvgDimension(this.config.position.margin?.y);
      this.svg.margin.r = Utils.calculateSvgDimension(this.config.position.margin?.r)
          || Utils.calculateSvgDimension(this.config.position.margin?.x);
      this.svg.margin.l = Utils.calculateSvgDimension(this.config.position.margin?.l)
          || Utils.calculateSvgDimension(this.config.position.margin?.x);
      this.svg.margin.x = this.svg.margin.l;
      this.svg.margin.y = this.svg.margin.t;
    } else {
      this.svg.margin.x = Utils.calculateSvgDimension(this.config.position.margin);
      this.svg.margin.y = this.svg.margin.x;
      this.svg.margin.t = this.svg.margin.x;
      this.svg.margin.r = this.svg.margin.x;
      this.svg.margin.b = this.svg.margin.x;
      this.svg.margin.l = this.svg.margin.x;
    }

    // Clock face stuff
    this.svg.clockface = {};
    if (this.config?.clock?.face) {
      if (this.config.clock.face?.show_day_night === true)
        this.svg.clockface.dayNightRadius = Utils.calculateSvgDimension(this.config.clock.face.day_night_radius);
      if (this.config.clock.face?.show_hour_marks === true)
        this.svg.clockface.hourMarksRadius = Utils.calculateSvgDimension(this.config.clock.face.hour_marks_radius);
      if (['absolute', 'relative'].includes(this.config.clock.face?.show_hour_numbers))
        this.svg.clockface.hourNumbersRadius = Utils.calculateSvgDimension(this.config.clock.face.hour_numbers_radius);
    }
    // const theWidth = (this.config.position.orientation === 'vertical') ? this.svg.width : this.svg.height;

    // this.svg.barWidth = (theWidth - (((this.config.hours / this.config.barhours) - 1)
    //                               * this.svg.margin)) / (this.config.hours / this.config.barhours);
    this._data = [];
    this._bars = [];
    this._scale = {};
    this._needsRendering = false;

    this.classes.tool = {};
    this.classes.bar = {};
    this.classes.clock_face_day_night = {};
    this.classes.clock_face_hour_marks = {};
    this.classes.clock_face_hour_numbers = {};

    this.styles.tool = {};
    this.styles.bar = {};
    this.styles.line = {};
    this.styles.clock_face_day_night = {};
    this.styles.clock_face_hour_marks = {};
    this.styles.clock_face_hour_numbers = {};
    this.stylesBar = {};

    this.seriesIndex = 0;

    this.id = this.toolId;
    // From MGC
    this.bound = [0, 0];
    this.boundSecondary = [0, 0];
    this.length = [];
    this.entity = [];
    this.line = [];
    this.lineMin = [];
    this.lineMax = [];
    this.bar = [];
    this.equalizer = [];
    this.trafficLight = [];
    this.abs = [];
    this.fill = [];
    this.fillMinMax = [];
    this.points = [];
    this.gradient = [];
    this.tooltip = {};
    this.updateQueue = [];
    this.updating = false;
    this.stateChanged = false;
    this.initial = true;
    this._md5Config = undefined;
    this.clock = [];
    this.timeline = [];

    // console.log('SparklineGraphTool::constructor', this.config, this.svg);
    // Use full widt/height for config
    this.config.width = this.svg.width;
    this.config.height = this.svg.height;

    // Correct x/y pos with line_width to prevent cut-off
    this.svg.line_width = Utils.calculateSvgDimension(this.config.line_width);
    // this.svg.x = this.config.show.fill ? this.svg.x : this.svg.x + this.svg.line_width / 2;
    // this.svg.y += this.svg.line_width / 2;
    // this.svg.height -= this.svg.line_width;
    this.trafficLights = [];
    this.config.color_thresholds.map((value, index) => (
      this.trafficLights[index] = value.value
    ));

    this.buckets = [];
    this.config.color_thresholds.map((value, index) => {
      let bucketIndex;
      bucketIndex = (value.bucket !== undefined) ? value.bucket : index;
      if (!this.buckets[bucketIndex]) {
        this.buckets[bucketIndex] = {};
        this.buckets[bucketIndex].value = [];
        this.buckets[bucketIndex].rangeMin = [];
        this.buckets[bucketIndex].rangeMax = [];
      }
      this.buckets[bucketIndex].bucket = bucketIndex;
      this.buckets[bucketIndex].color = value.color;
      // Assume right order from low to high and that next index is upper range
      //
      let rangeMin = value.value;
      let rangeMax = this.config.color_thresholds[index + 1]?.value || Infinity;
      this.buckets[bucketIndex].value.push(value.value);
      this.buckets[bucketIndex].rangeMin.push(rangeMin);
      this.buckets[bucketIndex].rangeMax.push(rangeMax);
      return true;
    });
    // console.log('SparklineGraphTool, buckets =', this.buckets);

    this.config.color_thresholds = computeThresholds(
      this.config.color_thresholds,
      this.config.color_thresholds_transition,
    );

    this.clockWidth = Utils.calculateSvgDimension(this.config?.clock?.size || 5);
    // Graph settings
    this.svg.graph = {};
    // this.svg.graph.height = this.svg.height - this.svg.line_width;
    // this.svg.graph.width = this.config.show.fill ? this.svg.width : this.svg.width - this.svg.line_width / 2;
    // Use margins. Don't correct height and width...
    this.svg.graph.height = this.svg.height - this.svg.margin.y * 0;
    this.svg.graph.width = this.svg.width - this.svg.margin.x * 0;

    this.config.state_map.forEach((state, i) => {
      // convert string values to objects
      if (typeof state === 'string') this.config.state_map[i] = { value: state, label: state };
      // make sure label is set
      this.config.state_map[i].label = this.config.state_map[i].label || this.config.state_map[i].value;
    });
    let { config } = this;

    // override points per hour to mach group_by function
    // switch (this.config.group_by) {
    //   case 'date':
    //     this.config.points_per_hour = 1 / 24;
    //     break;
    //   case 'hour':
    //     this.config.points_per_hour = 1;
    //     break;
    //   default:
    //     break;
    // }
    // From MGC
    this.Graph = [];
    this.Graph[0] = new SparklineGraph(
        this.svg.graph.width,
        this.svg.graph.height,
        // [0, 0],
        // [this.svg.margin.x, this.svg.margin.y],
        this.svg.margin,
        // [this.config.show.fill ? 0 : this.svg.line_width, this.svg.line_width],
        this.config?.today,
        this.config.hours_to_show,
        this.config.points_per_hour,
        this.config.aggregate_func,
        this.config.group_by,
        getFirstDefinedItem(
          this.config.smoothing,
          !this._card.config.entities[this.defaultEntityIndex()].entity.startsWith('binary_sensor.'),
          // !entity.entity.startsWith('binary_sensor.'), // turn off for binary sensor by default
        ),
        this.config.logarithmic,
        this.trafficLights,
        this.buckets,
        this.config.state_map,
        config,
    );
    // this.Graph = this.config.entity_indexes.map(
    //   // this.Graph = this.config.entity_indexes.map(
    //   (entity) => new SparklineGraph(
    //     this.svg.graph.width,
    //     this.svg.graph.height,
    //     // [0, 0],
    //     // [this.svg.margin.x, this.svg.margin.y],
    //     this.svg.margin,
    //     // [this.config.show.fill ? 0 : this.svg.line_width, this.svg.line_width],
    //     this.config.hours_to_show,
    //     this.config.points_per_hour,
    //     entity.aggregate_func || this.config.aggregate_func,
    //     this.config.group_by,
    //     getFirstDefinedItem(
    //       entity.smoothing,
    //       this.config.smoothing,
    //       !this._card.config.entities[entity.entity_index].entity.startsWith('binary_sensor.'),
    //       // !entity.entity.startsWith('binary_sensor.'), // turn off for binary sensor by default
    //     ),
    //     this.config.logarithmic,
    //     this.trafficLights,
    //   ),
    // );
    // console.log('in constructor, graph', this.Graph);

    if (this.dev.debug) console.log('SparklelineGraph constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  /** *****************************************************************************
    * SparklineBarChartTool::set series
    *
    * Summary.
    * Sets the timeseries for the barchart tool. Is an array of states.
    * If this is historical data, the caller has taken the time to create this.
    * This tool only displays the result...
    *
    */
  set data(states) {
    // Bit of an hack.
    // Use set data to set the index of the this.Graph[], ie which entity
    // is updating. This is the real entity_index...
    // this.seriesIndex = states;
  }

  set series(states) {
    if ((this.dev) && (this.dev.fakeData)) {
      // console.log('SparklineGraphTool::set series(states)', states);
      // How to fake the data...
      let y = 40;
      let z = 40;
      for (let i = 0; i < states.length; i++) {
        if (i < states.length / 2) z -= 4 * i;
        if (i > states.length / 2) z += 3 * i;
        states[i].state = z;
      }
    }
    if (this._card.config.entities[0].fixed_value === true) {
      // console.log('update, YUP, fixed value...');
      const last = states[states.length - 1];
      states = [last, last];
    }
    // Debug
    // console.log('set series, seriesindex ', this.seriesIndex);
    // HACK...
    this.seriesIndex = 0;
    // console.log('set series, update, graph type', this.config.show.graph);
    this.Graph[this.seriesIndex].update(states);
    // this.Graph[0].update(states);

    this.updateBounds();

    let { config } = this;
    if (config.show.graph) {
      let graphPos = 0;
      let entity = this._card.config.entities[this.defaultEntityIndex()];
      const i = 0;
      // this._card.entities.forEach((entity, i) => {
      // this.entity.forEach((entity, i) => {
      if (!entity || this.Graph[i].coords.length === 0) return;
        const bound = this._card.config.entities[i].y_axis === 'secondary' ? this.boundSecondary : this.bound;
        [this.Graph[i].min, this.Graph[i].max] = [bound[0], bound[1]];

        // Process each type of graph, including its options...
        const numVisible = this.visibleEntities.length;

        // +++++ Check for 'bar' graph type
        if (config.show.graph === 'bar') {
          this.bar[i] = this.Graph[i].getBars(graphPos, numVisible, config.bar_spacing);
          graphPos += 1;
          // Add the next 4 lines as a hack
          if (config.color_thresholds.length > 0 && !this._card.config.entities[i].color)
            this.gradient[i] = this.Graph[i].computeGradient(
              config.color_thresholds, this.config.logarithmic,
            );
        // +++++ Check for 'area' or 'line' graph type
        } else if (['area', 'line'].includes(config.show.graph)) {
          console.log('set series, checking area/line', config.show.graph);
          const line = this.Graph[i].getPath();
          if (this._card.config.entities[i].show_line !== false) this.line[i] = line;
        }

        // +++++ Check for 'area' graph type
        if (config.show.graph === 'area') {
          console.log('set series, checking area', config.show.graph);
          this.fill[i] = this.Graph[i].getFill(this.line[i]);
        }

        // +++++ Line might have set the minmax flag...
        if ((config?.line?.show_minmax)) {
          const lineMin = this.Graph[i].getPathMin();
          const lineMax = this.Graph[i].getPathMax();
          if (!this.lineMin) this.lineMin = [];
          if (!this.lineMax) this.lineMax = [];
          this.lineMin[i] = lineMin;
          this.lineMax[i] = lineMax;
          if (!this.fillMinMax) this.fillMinMax = [];
          this.fillMinMax[i] = this.Graph[i].getFillMinMax(lineMin, lineMax);
        }

        // +++++ Check for 'dots' graph type or if dots are enabled for area or line graph
        if ((config.show.graph === 'dots')
          || (config?.area?.show_dots === true)
          || (config?.line?.show_dots === true)) {
          this.points[i] = this.Graph[i].getPoints();

        // +++++ Check for 'equilizer' graph type
        } else if (this.config.show.graph === 'equalizer') {
          this.Graph[i].levelCount = this.config.value_buckets;
          this.Graph[i].valuesPerBucket = (this.Graph[i].max - this.Graph[i].min) / this.config.value_buckets;
          this.equalizer[i] = this.Graph[i].getEqualizer(0, this.visibleEntities.length, config.bar_spacing);

        // +++++ Check for 'trafficlight' graph type
        } else if (this.config.show.graph === 'trafficlight') {
          this.Graph[i].levelCount = this.config.value_buckets;
          this.Graph[i].valuesPerBucket = (this.Graph[i].max - this.Graph[i].min) / this.config.value_buckets;
          this.trafficLight[i] = this.Graph[i].getTrafficLights(0, this.visibleEntities.length, config.bar_spacing);

        // +++++ Check for 'number' graph type
        } else if (this.config.show.graph === 'clock') {
          this.clock[i] = this.Graph[i].getClock(0, this.visibleEntities.length, 0);
          this.Graph[i].clock = this.clock[i];

        // +++++ Check for 'number' graph type
        } else if (this.config.show.graph === 'timeline') {
          this.timeline[i] = this.Graph[i].getTimeline(0, this.visibleEntities.length, 0);
          this.Graph[i].timeline = this.timeline[i];
        }

        // Add the next 4 lines as a hack
        if (config.color_thresholds.length > 0 && !this._card.config.entities[i].color)
        this.gradient[i] = this.Graph[i].computeGradient(
          config.color_thresholds, this.config.logarithmic,
        );

        // HACK
        // Keep detection of 'bar', but also do compute the gradient

        // if (config.show.graph === 'bar') {
        //   const numVisible = this.visibleEntities.length;
        //   this.bar[i] = this.Graph[i].getBars(graphPos, numVisible, config.bar_spacing);
        //   graphPos += 1;
        //   // Add the next 4 lines as a hack
        //   if (config.color_thresholds.length > 0 && !this._card.config.entities[i].color)
        //     this.gradient[i] = this.Graph[i].computeGradient(
        //       config.color_thresholds, this.config.logarithmic,
        //     );
        // } else {
        //   const line = this.Graph[i].getPath();
        //   if (this._card.config.entities[i].show_line !== false) this.line[i] = line;
        //   if (config.show.fill
        //     && this._card.config.entities[i].show_fill !== false) this.fill[i] = this.Graph[i].getFill(line);
        //   if (config.show.points && (this._card.config.entities[i].show_points !== false)) {
        //     this.points[i] = this.Graph[i].getPoints();
        //   }
        //   if (config.color_thresholds.length > 0 && !this._card.config.entities[i].color)
        //     this.gradient[i] = this.Graph[i].computeGradient(
        //       config.color_thresholds, this.config.logarithmic,
        //     );
        //   // Just testing with min/max stuff to get path etc.
        //   const lineMin = this.Graph[i].getPathMin();
        //   const lineMax = this.Graph[i].getPathMax();
        //   if (!this.lineMin) this.lineMin = [];
        //   if (!this.lineMax) this.lineMax = [];
        //   this.lineMin[i] = lineMin;
        //   this.lineMax[i] = lineMax;
        //   if (!this.fillMinMax) this.fillMinMax = [];
        //   this.fillMinMax[i] = this.Graph[i].getFillMinMax(lineMin, lineMax);

        //   if (this.config.show.graph === 'equalizer') {
        //     this.Graph[i].levelCount = this.config.value_buckets;
        //     this.Graph[i].valuesPerBucket = (this.Graph[i].max - this.Graph[i].min) / this.config.value_buckets;
        //     this.equalizer[i] = this.Graph[i].getEqualizer(0, this.visibleEntities.length, config.bar_spacing);
        //     // console.log('equalizer, testing', this.equalizer[i], this.Graph[i].valuesPerBucket);
        //   }
        //   if (this.config.show.graph === 'trafficlight') {
        //     this.Graph[i].levelCount = this.config.value_buckets;
        //     this.Graph[i].valuesPerBucket = (this.Graph[i].max - this.Graph[i].min) / this.config.value_buckets;
        //     this.trafficLight[i] = this.Graph[i].getTrafficLights(0, this.visibleEntities.length, config.bar_spacing);
        //     // console.log('getTrafficLight', this.trafficLight[i], this.Graph[i].trafficLights);
        //   }
        //   if (this.config.show.graph === 'clock') {
        //     this.clock[i] = this.Graph[i].getClock(0, this.visibleEntities.length, 0);
        //     this.Graph[i].clock = this.clock[i];
        //   }
        //   if (this.config.show.graph === 'timeline') {
        //     this.timeline[i] = this.Graph[i].getTimeline(0, this.visibleEntities.length, 0);
        //     this.Graph[i].timeline = this.timeline[i];
        //   }
        // }
      // });
      this.line = [...this.line];
    }
    this.updating = false;
  }

  hasSeries() {
    return this.defaultEntityIndex();
  }

  _convertState(res) {
    const resultIndex = this.config.state_map.findIndex((s) => s.value === res.state);
    if (resultIndex === -1) {
      return;
    }

    res.state = resultIndex;
  }

  processStateMap(history) {
    if (this.config.state_map?.length > 0) {
      history[0].forEach((item, index) => {
        if (this.config.state_map.length > 0)
        // this._history[index].state = this._convertState(item);
        this._convertState(item);
        history[0][index].state = item.state;
      });
    }
  }

  get visibleEntities() {
    return [1];
    return this._card.config.entities.filter((entity) => entity.show_graph !== false);
  }

  get primaryYaxisEntities() {
    return this.visibleEntities.filter((entity) => entity.y_axis === undefined
      || entity.y_axis === 'primary');
  }

  get secondaryYaxisEntities() {
    return this.visibleEntities.filter((entity) => entity.y_axis === 'secondary');
  }

  get visibleLegends() {
    return this.visibleEntities.filter((entity) => entity.show_legend !== false);
  }

  get primaryYaxisSeries() {
    return this.primaryYaxisEntities.map((entity, index) => this.Graph[index]);
    // return this.primaryYaxisEntities.map((entity) => this.Graph[entity.index]);
  }

  get secondaryYaxisSeries() {
    return this.secondaryYaxisEntities.map((entity) => this.Graph[entity.index]);
  }

  getBoundary(type, series, configVal, fallback) {
    if (!(type in Math)) {
      throw new Error(`The type "${type}" is not present on the Math object`);
    }

    if (configVal === undefined) {
      return Math[type](...series.map((ele) => ele[type])) || fallback;
    }
    if (configVal[0] !== '~') {
      // fixed boundary
      return configVal;
    }
    // soft boundary (respecting out of range values)
    return Math[type](Number(configVal.substr(1)), ...series.map((ele) => ele[type]));
  }

  getBoundaries(series, min, max, fallback, minRange) {
    let boundary = [
      this.getBoundary('min', series, min, fallback[0], minRange),
      this.getBoundary('max', series, max, fallback[1], minRange),
    ];

    if (minRange) {
      const currentRange = Math.abs(boundary[0] - boundary[1]);
      const diff = parseFloat(minRange) - currentRange;

      // Doesn't matter if minBoundRange is NaN because this will be false if so
      if (diff > 0) {
        boundary = [
          boundary[0] - diff / 2,
          boundary[1] + diff / 2,
        ];
      }
    }

    return boundary;
  }

  updateBounds({ config } = this) {
    this.bound = this.getBoundaries(
      this.primaryYaxisSeries,
      config.lower_bound,
      config.upper_bound,
      this.bound,
      config.min_bound_range,
    );

    this.boundSecondary = this.getBoundaries(
      this.secondaryYaxisSeries,
      config.lower_bound_secondary,
      config.upper_bound_secondary,
      this.boundSecondary,
      config.min_bound_range_secondary,
    );
  }

  computeColor(inState, i) {
    const { color_thresholds, line_color } = this.config;
    const state = Number(inState) || 0;
    const threshold = {
      color: line_color[i] || line_color[0],
      ...color_thresholds.slice(-1)[0],
      ...color_thresholds.find((ele) => ele.value < state),
    };
    return this._card.config.entities[i].color || threshold.color;
  }

  intColor(inState, i) {
    const { color_thresholds, line_color } = this.config;
    const state = Number(inState) || 0;

    let intColor;
    if (color_thresholds.length > 0) {
      // HACK. Keep check for 'bar' !!!
      if (this.config.show.graph === 'bar') {
        const { color } = color_thresholds.find((ele) => ele.value < state)
          || color_thresholds.slice(-1)[0];
        intColor = color;
      } else {
        const index = color_thresholds.findIndex((ele) => ele.value < state);
        const c1 = color_thresholds[index];
        const c2 = color_thresholds[index - 1];
        if (c2) {
          const factor = (c2.value - inState) / (c2.value - c1.value);
          intColor = Colors.getGradientValue(c2.color, c1.color, factor);
        } else {
          intColor = index
            ? color_thresholds[color_thresholds.length - 1].color
            : color_thresholds[0].color;
        }
      }
    }

    return this._card.config.entities[i].color || intColor || line_color[i] || line_color[0];
    // return this.config.entities[i].color || intColor || line_color[i] || line_color[0];
  }

  getEndDate() {
    const date = new Date();
    switch (this.config.group_by) {
      case 'date':
        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0);
        break;
      case 'hour':
        date.setHours(date.getHours() + 1);
        date.setMinutes(0, 0);
        break;
      default:
        break;
    }
    return date;
  }

  setTooltip(entity, index, value, label = null) {
    const {
      points_per_hour,
      hours_to_show,
      format,
    } = this.config;
    const offset = hours_to_show < 1 && points_per_hour < 1
      ? points_per_hour * hours_to_show
      : 1 / points_per_hour;

    const id = Math.abs(index + 1 - Math.ceil(hours_to_show * points_per_hour));

    const now = this.getEndDate();

    const oneMinInHours = 1 / 60;
    now.setMilliseconds(now.getMilliseconds() - getMilli(offset * id + oneMinInHours));
    const end = getTime(now, format, this._card._hass.language);
    now.setMilliseconds(now.getMilliseconds() - getMilli(offset - oneMinInHours));
    const start = getTime(now, format, this._card._hass.language);

    this.tooltip = {
      value,
      id,
      entity,
      time: [start, end],
      index,
      label,
    };
  }

  renderSvgAreaMask(fill, i) {
  if (this.config.show.graph !== 'area') return;
  // if (this.config.show.graph === 'dots') return;
  if (!fill) return;
  const fade = this.config.show.fill === 'fade';
  const init = this.length[i] || this._card.config.entities[i].show_line === false;
  // Check for zero crossing...
  const y_zero = (this.Graph[i]._min >= 0) ? 0
   : (Math.abs(this.Graph[i]._min) / ((this.Graph[i]._max - this.Graph[i]._min)) * 100);
  // console.log('renderSvgAreaMask, y_zero', y_zero, this.Graph[i]._min, this.Graph[i]._max, this);
  return svg`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-pos-${this.id}-${i}`}>
        <rect width="100%" height="${100 - y_zero}%" fill=${this.config.styles.area_mask_above.fill}
         />
      </mask>
      <linearGradient id=${`fill-grad-neg-${this.id}-${i}`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-neg-${this.id}-${i}`}>
        <rect width="100%" y=${100 - y_zero}% height="${y_zero}%" fill=${this.config.styles.area_mask_below.fill}
         />
      </mask>
    </defs>

    <mask id=${`fill-${this.id}-${i}`}>
      <path class='fill'
        type=${this.config.show.fill}
        .id=${i} anim=${this.config.animate} ?init=${init}
        style="animation-delay: ${this.config.animate ? `${i * 0.5}s` : '0s'}"
        fill='white'
        mask=${fade ? `url(#fill-grad-mask-pos-${this.id}-${i})` : ''}
        d=${this.fill[i]}
      />
      ${this.Graph[i]._min < 0
        ? svg`<path class='fill'
            type=${this.config.show.fill}
            .id=${i} anim=${this.config.animate} ?init=${init}
            style="animation-delay: ${this.config.animate ? `${i * 0.5}s` : '0s'}"
            fill='white'
            mask=${fade ? `url(#fill-grad-mask-neg-${this.id}-${i})` : ''}
            d=${this.fill[i]}
          />`
        : ''
      }
    </mask>`;
}

renderSvgAreaMinMaxMask(fill, i) {
  if (this.config.show.graph !== 'line') return;
  if (!fill) return;
  const fade = this.config.show.fill === 'fade';
  const init = this.length[i] || this._card.config.entities[i].show_line === false;
  // Check for zero crossing...
  const y_zero = (this.Graph[i]._min >= 0) ? 0
   : (Math.abs(this.Graph[i]._min) / ((this.Graph[i]._max - this.Graph[i]._min)) * 100);
  // console.log('renderSvgAreaMask, y_zero', y_zero, this.Graph[i]._min, this.Graph[i]._max, this);
  return svg`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-pos-${this.id}-${i}`}>
        <rect width="100%" height="${100 - y_zero}%" fill=${this.config.styles.area_mask_above.fill}
         />
      </mask>
      <linearGradient id=${`fill-grad-neg-${this.id}-${i}`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-neg-${this.id}-${i}`}>
        <rect width="100%" y=${100 - y_zero}% height="${y_zero}%" fill=${this.config.styles.area_mask_below.fill}
         />
      </mask>
    </defs>

    <mask id=${`fillMinMax-${this.id}-${i}`}>
      <path class='fill'
        type=${this.config.show.fill}
        .id=${i} anim=${this.config.animate} ?init=${init}
        style="animation-delay: ${this.config.animate ? `${i * 0.5}s` : '0s'}"
        fill='#555555'
        mask=${fade ? `url(#fill-grad-mask-pos-${this.id}-${i})` : ''}
        d=${this.fillMinMax[i]}
      />
      ${this.Graph[i]._min < 0
        ? svg`<path class='fill'
            type=${this.config.show.fill}
            .id=${i} anim=${this.config.animate} ?init=${init}
            style="animation-delay: ${this.config.animate ? `${i * 0.5}s` : '0s'}"
            fill='#444444'
            mask=${fade ? `url(#fill-grad-mask-neg-${this.id}-${i})` : ''}
            d=${this.fillMinMax[i]}
          />`
        : ''
      }
    </mask>`;
}

renderSvgLineMask(line, i) {
  // if (this.config.show.graph !== 'line') return;
  // if (['dots', 'equalizer', 'trafficlight', 'clock'].includes(this.config.show.graph)) return;
  if (!line) return;

  const path = svg`
    <path
      class='line'
      .id=${i}
      anim=${this.config.animate} ?init=${this.length[i]}
      style="animation-delay: ${this.config.animate ? `${i * 0.5}s` : '0s'}"
      fill='none'
      stroke-dasharray=${this.length[i] || 'none'} stroke-dashoffset=${this.length[i] || 'none'}
      stroke=${'white'}
      stroke-width=${this.svg.line_width}
      d=${this.line[i]}
    />`;

  return svg`
    <mask id=${`line-${this.id}-${i}`}>
      ${path}
    </mask>
  `;
}

renderSvgLineMinMaxMask(line, i) {
  if (this.config.show.graph !== 'line') return;
  // if (['dots', 'equalizer', 'trafficlight', 'çlock'].includes(this.config.show.graph)) return;
  if (!line) return;

  console.log('renderSvgLineMinMaxMask', line, i);
  const path = svg`
    <path
      class='lineMinMax'
      .id=${i}
      anim=${this.config.animate} ?init=${this.length[i]}
      style="animation-delay: ${this.config.animate ? `${i * 0.5}s` : '0s'}"
      fill='none'
      stroke-dasharray=${this.length[i] || 'none'} stroke-dashoffset=${this.length[i] || 'none'}
      stroke=${'white'}
      stroke-width=${this.svg.line_width}
      d=${this.line[i]}
    />`;

  return svg`
    <mask id=${`lineMinMax-${this.id}-${i}`}>
      ${path}
    </mask>
  `;
}

renderSvgPoint(point, i) {
  const color = this.gradient[i] ? this.computeColor(point[V], i) : 'inherit';
  return svg`
    <circle
      class='line--point'
      ?inactive=${this.tooltip.index !== point[3]}
      style=${`--mcg-hover: ${color};`}
      stroke=${color}
      fill=${color}
      cx=${point[X]} cy=${point[Y]} r=${this.svg.line_width / 1.5}
      @mouseover=${() => this.setTooltip(i, point[3], point[V])}
      @mouseout=${() => (this.tooltip = {})}
    />
  `;
}

renderSvgPoints(points, i) {
  if (!points) return;
  const color = this.computeColor(this._card.entities[i].state, i);
  // const color = this.computeColor(this.entity[i].state, i);
  return svg`
    <g class='line--points'
      ?tooltip=${this.tooltip.entity === i}
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      ?init=${this.length[i]}
      anim=${this.config.animate && this.config.show.points !== 'hover'}
      style="animation-delay: ${this.config.animate ? `${i * 0.5 + 0.5}s` : '0s'}"
      fill=${color}
      stroke=${color}
      stroke-width=${this.svg.line_width / 2}>
      ${points.map((point) => this.renderSvgPoint(point, i))}
    </g>`;
}

renderSvgTrafficLight(trafficLight, i) {
  let adjustX = 0;
  let adjustY = 0;
  if (this.config.square === true) {
    const size = Math.min(trafficLight.width, trafficLight.height);
    adjustX = (trafficLight.width - size) / 2;
    adjustY = (trafficLight.height - size) / 2;
    // console.log('renderSvgTrafficLight, adjustX = ', adjustX, adjustY);
    // trafficLight.width = size;
    // trafficLight.height = size;
  }
  // console.log('renderSvgTrafficLight, arg trafficLight', trafficLight);
  const levelRect = trafficLight.value.map((single, j) => {
    // console.log('renderSvgTrafficLight, loop index', single, j);
    const piet = [];
    // const color = this.gradient[i] ? this.computeColor(trafficLight.value[j], i) : 'inherit';
    // Computecolor uses the gradient calculations, which use fractions to get the gradient
    // Adjust to get the right color bucket...
    // fill=${color}
    const color = this.computeColor(single + 0.001, 0);
    return svg`
    <rect class='level'
      x=${trafficLight.x + adjustX + this.svg.line_width / 2}
      y=${trafficLight.y[j] - 1 * trafficLight.height - this.svg.line_width / 1}
      height=${Math.max(0, trafficLight.height - 2 * adjustY - this.svg.line_width)}
      width=${Math.max(0, trafficLight.width - 2 * adjustX - this.svg.line_width)}
      fill=${color}
      stroke=${color}
      stroke-width="${this.svg.line_width ? this.svg.line_width : 0}"
      rx="10%"
      @mouseover=${() => this.setTooltip(i, j, single)}
      @mouseout=${() => (this.tooltip = {})}>
    </rect>`;
  });

  return svg`
    ${levelRect}`;
  const color = this.gradient[i] ? this.computeColor(trafficLight[V], i) : 'inherit';
  console.log('renderSvgTrafficLight', trafficLight, i, color);
  return svg`
    <circle
      class='traffic-light'
      ?inactive=${this.tooltip.index !== trafficLight[3]}
      style=${`--mcg-hover: ${color};`}
      stroke=${color}
      fill=${color}
      cx=${trafficLight[X]} cy=${trafficLight[Y]} r=${this.svg.line_width / 1.5}
      @mouseover=${() => this.setTooltip(i, trafficLight[3], trafficLight[V])}
      @mouseout=${() => (this.tooltip = {})}
    />
  `;
}

renderSvgTrafficLights(trafficLights, i) {
  if (!trafficLights) return;
  const color = this.computeColor(this._card.entities[i].state, i);
  // const color = this.computeColor(this.entity[i].state, i);
  return svg`
    <g class='traffic-lights'
      ?tooltip=${this.tooltip.entity === i}
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      ?init=${this.length[i]}
      anim=${this.config.animate && this.config.show.points !== 'hover'}
      style="animation-delay: ${this.config.animate ? `${i * 0.5 + 0.5}s` : '0s'}"
      fill=${color}
      stroke=${color}
      stroke-width=${this.svg.line_width / 2}>
      ${trafficLights.map((trafficLight) => this.renderSvgTrafficLight(trafficLight, i))}
    </g>`;
}
//       stroke-width=${this.svg.line_width / 2}>

renderSvgGradient(gradients) {
  if (!gradients) return;
  const items = gradients.map((gradient, i) => {
    if (!gradient) return;
    return svg`
      <linearGradient id=${`grad-${this.id}-${i}`} gradientTransform="rotate(90)">
        ${gradient.map((stop) => svg`
          <stop stop-color=${stop.color} offset=${`${stop.offset}%`} />
        `)}
      </linearGradient>`;
  });
  return svg`${items}`;
}

// Render the rectangle with the line color to be used.
// The line itself is a mask, that only shows the colors behind it using 'white'
// as the drawing (fill) color...
renderSvgLineBackground(line, i) {
  // Hack
  // if (this.config.show.graph !== 'line') return;
  // if (['dots', 'equalizer', 'trafficlight', 'clock'].includes(this.config.show.graph)) return;
  // console.log('render Graph, renderSvgLineBackground(line, i)', line, i);
  if (!line) return;
  console.log('renderSvgLineBackground, gradient', this.gradient[i]);
  const fill = this.gradient[i]
    ? `url(#grad-${this.id}-${i})`
    : this.computeColor(this._card.entities[i].state, i);
  return svg`
    <rect class='line--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`line-rect-${this.id}-${i}`}
      fill=${fill} height="100%" width="100%"
      mask=${`url(#line-${this.id}-${i})`}
    />`;
}

renderSvgLineMinMaxBackground(line, i) {
  // Hack
  if (this.config.show.graph !== 'line') return;
  // if (['dots', 'equalizer', 'trafficlight', 'clock'].includes(this.config.show.graph)) return;
  // console.log('render Graph, renderSvgLineBackground(line, i)', line, i);
  if (!line) return;
  console.log('renderSvgLineMinMaxBackground, gradient', this.gradient[i]);
  const fill = this.gradient[i]
    ? `url(#grad-${this.id}-${i})`
    : this.computeColor(this._card.entities[i].state, i);
  return svg`
    <rect class='line--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`line-rect-${this.id}-${i}`}
      fill=${fill} height="100%" width="100%"
      mask=${`url(#lineMinMax-${this.id}-${i})`}
    />`;
}

// Render the area below the line graph.
// Currently called the 'fill', but actually it should be named area, after
// sparkline area graph according to the mighty internet.
renderSvgAreaBackground(fill, i) {
  // console.log('render Graph, renderSvgAreaBackground(fill, i)', fill, i);
  if (this.config.show.graph !== 'area') return;
  // if (['dots', 'equalizer', 'trafficlight', 'clock'].includes(this.config.show.graph)) return;
  if (!fill) return;
  const svgFill = this.gradient[i]
    ? `url(#grad-${this.id}-${i})`
    : this.intColor(this._card.entities[i].state, i);
  return svg`
    <rect class='fill--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`fill-rect-${this.id}-${i}`}
      fill=${svgFill} height="100%" width="100%"
      mask=${`url(#fill-${this.id}-${i})`}
    />`;
}

renderSvgAreaMinMaxBackground(fill, i) {
  // console.log('render Graph, renderSvgAreaBackground(fill, i)', fill, i);
  if (this.config.show.graph !== 'line') return;
  // if (['dots', 'equalizer', 'trafficlight', 'clock'].includes(this.config.show.graph)) return;
  if (!fill) return;
  const svgFill = this.gradient[i]
    ? `url(#grad-${this.id}-${i})`
    : this.intColor(this._card.entities[i].state, i);
  return svg`
    <rect class='fill--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`fill-rect-${this.id}-${i}`}
      fill=${svgFill} height="100%" width="100%"
      mask=${`url(#fillMinMax-${this.id}-${i})`}
    />`;
}

renderSvgEqualizerMask(equalizer, index) {
  if (this.config.show.graph !== 'equalizer') return;

  if (!equalizer) return;
  // console.log('renderSvgEqualizerMask', equalizer);
  const fade = this.config.show.fill === 'fade';
  const maskNeg = `url(#fill-grad-mask-neg-${this.id}-${index}})`;
  const maskPos = `url(#fill-grad-mask-pos-${this.id}-${index}})`;
  // const fillNeg = `url(#fill-grad-neg-${this.id}-${index}`;
  // const fillPos = `url(#fill-grad-pos-${this.id}-${index}`;
  const fillNeg = this.config.styles.bar_mask_below.fill;
  const fillPos = this.config.styles.bar_mask_above.fill;

  const paths = equalizer.map((equalizerPart, i) => {
    // console.log('renderSvgEqualizerMask', i, level);
    const animation = this.config.animate
      ? svg`
        <animate attributeName='y' from=${this.svg.height} to=${equalizerPart.y} dur='1s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
      : '';
    if (this.config.square === true) {
      const size = Math.min(equalizerPart.width, equalizerPart.height);
      equalizerPart.width = size;
      equalizerPart.height = size;
    }
    const equalizerPartRect = equalizerPart.value.map((single, j) => {
      const piet = [];
      return svg`
      <rect class='level' x=${equalizerPart.x} y=${equalizerPart.y[j] - 1 * equalizerPart.height - this.svg.line_width / 1}
        height=${Math.max(0, equalizerPart.height - this.svg.line_width)} width=${equalizerPart.width}
        fill=${fade ? (equalizerPart.value > 0 ? fillPos : fillNeg) : 'white'}
        stroke=${fade ? (equalizerPart.value > 0 ? fillPos : fillNeg) : 'white'}
        stroke-width="${this.svg.line_width ? this.svg.line_width : 0}"
        rx="0%"
        @mouseover=${() => this.setTooltip(index, j, single)}
        @mouseout=${() => (this.tooltip = {})}>
        ${animation}
      </rect>`;
    });

    return svg`
      ${equalizerPartRect}`;
  });
  return svg`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='25%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='60%' stop-opacity='0.0'/>
      </linearGradient>
      <linearGradient id=${`fill-grad-neg-${this.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='40%' stop-opacity='0'/>
        <stop stop-color='white' offset='75%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='100%' stop-opacity='1.0'/>
      </linearGradient>

      <mask id=${`fill-grad-mask-pos-${this.id}-${index}`}>
        <rect width="100%" height="100%"}
      </mask>
    </defs>  
    <mask id=${`equalizer-bg-${this.id}-${index}`}>
      ${paths}
      mask = ${maskPos}
    </mask>
  `;
}

renderSvgBarsMask(bars, index) {
  if (this.config.show.graph !== 'bar') return;
  // if (this.config.show.graph === 'dots') return;

  if (!bars) return;
  const fade = this.config.show.fill === 'fade';
  const maskNeg = `url(#fill-grad-mask-neg-${this.id}-${index}})`;
  const maskPos = `url(#fill-grad-mask-pos-${this.id}-${index}})`;
  // const fillNeg = `url(#fill-grad-neg-${this.id}-${index}`;
  // const fillPos = `url(#fill-grad-pos-${this.id}-${index}`;
  const fillNeg = this.config.styles.bar_mask_below.fill;
  const fillPos = this.config.styles.bar_mask_above.fill;

  const paths = bars.map((bar, i) => {
    const animation = this.config.animate
      ? svg`
        <animate attributeName='y' from=${this.svg.height} to=${bar.y} dur='1s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
      : '';
    return svg` 

      <rect class='bar' x=${bar.x} y=${bar.y + (bar.value > 0 ? +this.svg.line_width / 2 : -this.svg.line_width / 2)}
        height=${Math.max(0, bar.height - this.svg.line_width / 1 - 0)} width=${bar.width}
        fill=${fade ? (bar.value > 0 ? fillPos : fillNeg) : 'white'}
        stroke=${fade ? (bar.value > 0 ? fillPos : fillNeg) : 'white'}
        stroke-width="${this.svg.line_width ? this.svg.line_width : 0}"
        @mouseover=${() => this.setTooltip(index, i, bar.value)}
        @mouseout=${() => (this.tooltip = {})}>
        ${animation}
      </rect>`;
  });
  return svg`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='25%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='60%' stop-opacity='0.0'/>
      </linearGradient>
      <linearGradient id=${`fill-grad-neg-${this.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='40%' stop-opacity='0'/>
        <stop stop-color='white' offset='75%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='100%' stop-opacity='1.0'/>
      </linearGradient>

      <mask id=${`fill-grad-mask-pos-${this.id}-${index}`}>
        <rect width="100%" height="100%"}
      </mask>
    </defs>  
    <mask id=${`bars-bg-${this.id}-${index}`}>
      ${paths}
      mask = ${maskPos}
    </mask>
  `;
}

renderSvgEqualizerBackground(equalizer, index) {
  if (this.config.show.graph !== 'equalizer') return;
  if (!equalizer) return;

  const fade = this.config.show.fill === 'fadenever';
  if (fade) {
  // Is in fact the rendering of the AreaMask... In this case the barsmask.
  // This is incomplete. Need rendering of the background itself too
  // So check AreaBackground too to be complete for the 'fade' functionality of the Area
    const init = this.length[index] || this._card.config.entities[index].show_line === false;
    const svgFill = this.gradient[index]
      ? `url(#grad-${this.id}-${index})`
      : this.intColor(this._card.entities[index].state, index);
    const fill = this.gradient[index]
      ? `url(#fill-grad${this.id}-${index})`
      : this.intColor(this._card.entities[index].state, index);

      // mask=${`url(#bars-bg-${this.id}-${index})`}

      return svg`
      <defs>
        <linearGradient id=${`fill-grad-${this.id}-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop stop-color='white' offset='0%' stop-opacity='1'/>
          <stop stop-color='white' offset='100%' stop-opacity='.1'/>
        </linearGradient>

        <mask id=${`fill-grad-mask-${this.id}-${index}`}>
          <rect width="100%" height="100%" fill=${`url(#fill-grad-${this.id}-${index})`}
        </mask>
      </defs>

      <g mask = ${`url(#fill-grad-mask-${this.id}-${index})`}>
        <rect class='equalizer--bg'
          ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
          id=${`equalizer-bg-${this.id}-${index}`}
          fill=${svgFill} height="100%" width="100%"
          mask=${`url(#equalizer-bg-${this.id}-${index})`}
        />
      /g>`;
  } else {
    const fill = this.gradient[index]
      ? `url(#grad-${this.id}-${index})`
      : this.computeColor(this._card.entities[index].state, index);
    // console.log('renderSvgBarsBackground', fill, this.gradient[index]);
      return svg`
      <rect class='equalizer--bg'
        ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
        id=${`equalizer-bg-${this.id}-${index}`}
        fill=${fill} height="100%" width="100%"
        mask=${`url(#equalizer-bg-${this.id}-${index})`}
      />`;
  }
}

renderSvgBarsBackground(bars, index) {
  if (this.config.show.graph !== 'bar') return;
  // if (this.config.show.graph === 'dots') return;
  if (!bars) return;

  const fade = this.config.show.fill === 'fadenever';
  if (fade) {
  // Is in fact the rendering of the AreaMask... In this case the barsmask.
  // This is incomplete. Need rendering of the background itself too
  // So check AreaBackground too to be complete for the 'fade' functionality of the Area
    const init = this.length[index] || this._card.config.entities[index].show_line === false;
    const svgFill = this.gradient[index]
      ? `url(#grad-${this.id}-${index})`
      : this.intColor(this._card.entities[index].state, index);
    const fill = this.gradient[index]
      ? `url(#fill-grad${this.id}-${index})`
      : this.intColor(this._card.entities[index].state, index);

      // mask=${`url(#bars-bg-${this.id}-${index})`}

      return svg`
      <defs>
        <linearGradient id=${`fill-grad-${this.id}-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop stop-color='white' offset='0%' stop-opacity='1'/>
          <stop stop-color='white' offset='100%' stop-opacity='.1'/>
        </linearGradient>

        <mask id=${`fill-grad-mask-${this.id}-${index}`}>
          <rect width="100%" height="100%" fill=${`url(#fill-grad-${this.id}-${index})`}
        </mask>
      </defs>

      <g mask = ${`url(#fill-grad-mask-${this.id}-${index})`}>
        <rect class='bars--bg'
          ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
          id=${`bars-bg-${this.id}-${index}`}
          fill=${svgFill} height="100%" width="100%"
          mask=${`url(#bars-bg-${this.id}-${index})`}
        />
      /g>`;
  } else {
    const fill = this.gradient[index]
      ? `url(#grad-${this.id}-${index})`
      : this.computeColor(this._card.entities[index].state, index);
    // console.log('renderSvgBarsBackground', fill, this.gradient[index]);
      return svg`
      <rect class='bars--bg'
        ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
        id=${`bars-bg-${this.id}-${index}`}
        fill=${fill} height="100%" width="100%"
        mask=${`url(#bars-bg-${this.id}-${index})`}
      />`;
  }
}

// This function to use for coloring the full bar depending on colorstop or color
// This depends on the style setting. Don't know which one at this point
renderSvgBars(bars, index) {
  // console.log('render Graph, renderSvgBars(bars, index)', bars, index);
  if (!bars) return;
  const items = bars.map((bar, i) => {
    const animation = this.config.animate
      ? svg`
        <animate attributeName='y' from=${this.svg.height} to=${bar.y} dur='1s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
      : '';
    const color = this.computeColor(bar.value, index);
    return svg` 
      <rect class='bar' x=${bar.x} y=${bar.y}
        height=${bar.height} width=${bar.width} fill=${color}
        @mouseover=${() => this.setTooltip(index, i, bar.value)}
        @mouseout=${() => (this.tooltip = {})}>
        ${animation}
      </rect>`;
  });
  return svg`<g class='bars' ?anim=${this.config.animate}>${items}</g>`;
}

renderSvgClockBin(bin, path, index) {
  const color = this.computeColor(bin.value, 0);
  // console.log('renderSvgClockPart', clockPart, 'path=', pathPart, index, color);
  return svg`
  <path d=${path}
    fill=${color}
    stroke=${color}
  >
  `;
}

renderSvgClockBackground(radius) {
  // const clockWidth = 20;
  const {
    start, end, start2, end2, largeArcFlag, sweepFlag,
  } = this.Graph[0]._calcClockCoords(0, 359.9, true, radius, radius, this.clockWidth);
  const radius2 = { x: radius - this.clockWidth, y: radius - this.clockWidth };

  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y,
    'L', end2.x, end2.y,
    'A', radius2.x, radius2.y, 0, largeArcFlag, sweepFlag === '0' ? '1' : '0', start2.x, start2.y,
    'Z',
  ].join(' ');
  console.log('renderSvgClockBackground, d', d, start, end, start2, end2, largeArcFlag, sweepFlag);
  return svg`
    <path class="graph-clock--background"
      d="${d}"
      style="fill: lightgray; stroke-width: 0; opacity: 0.1;"
    />
  `;
}

renderSvgClockFace(radius) {
  if (!this.config?.clock?.face) return svg``;
  const renderDayNight = () => (
    this.config.clock.face?.show_day_night === true
      ? svg`
          <circle pathLength="1"
          class="${classMap(this.classes.clock_face_day_night)}" style="${styleMap(this.styles.clock_face_day_night)}"
          r="${this.svg.clockface.dayNightRadius}" cx=${this.svg.width / 2} cy="${this.svg.height / 2}"
          />
        `
      : ''
  );
  const renderHourMarks = () => (
    this.config.clock.face?.show_hour_marks === true
      ? svg`
        <circle pathLength=${this.config.clock.face.hour_marks_count}
        class="${classMap(this.classes.clock_face_hour_marks)}" style="${styleMap(this.styles.clock_face_hour_marks)}"
        r="${this.svg.clockface.hourMarksRadius}" cx=${this.svg.width / 2} cy="${this.svg.height / 2}"
        />
       `
      : ''
  );
  // alignment-baseline not working on SVG group tag, so all on svg text
  const renderAbsoluteHourNumbers = () => (
    this.config.clock.face?.show_hour_numbers === 'absolute'
      ? svg`
        <g>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${this.svg.width / 2}" y="${(this.svg.height / 2) - (this.svg.clockface.hourNumbersRadius)}"
            >24</text>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${this.svg.width / 2}" y="${(this.svg.height / 2) + (this.svg.clockface.hourNumbersRadius)}"
            >12</text>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${(this.svg.width / 2) + (this.svg.clockface.hourNumbersRadius)}" y="${(this.svg.height / 2)}"
            >6</text>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${(this.svg.width / 2) - (this.svg.clockface.hourNumbersRadius)}" y="${(this.svg.height / 2)}"
            >18</text>
        </g>`
      : ''
  );
  // Note:
  // alignment-baseline not working on SVG group tag, so all on svg text
  const renderRelativeHourNumbers = () => (
    this.config.clock.face?.show_hour_numbers === 'relative'
      ? svg`
        <g>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${this.svg.width / 2}" y="${(this.svg.height / 2) - (this.svg.clockface.hourNumbersRadius)}"
            >0</text>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${this.svg.width / 2}" y="${(this.svg.height / 2) + (this.svg.clockface.hourNumbersRadius)}"
            >-12</text>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${(this.svg.width / 2) + (this.svg.clockface.hourNumbersRadius)}" y="${(this.svg.height / 2)}"
            >-18</text>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${(this.svg.width / 2) - (this.svg.clockface.hourNumbersRadius)}" y="${(this.svg.height / 2)}"
            >-6</text>

        </g>`
      : ''
  );

  return svg`
    ${renderDayNight()}
    ${renderHourMarks()}
    ${renderAbsoluteHourNumbers()}
    ${renderRelativeHourNumbers()}
  `;
}

// See here: https://pro.arcgis.com/en/pro-app/latest/help/analysis/geoprocessing/charts/data-clock.htm
// for nice naming conventions using ring, wedge and bin!
renderSvgClock(clock, index) {
  if (!clock) return;
  const clockPaths = this.Graph[index].getClockPaths();
  return svg`
    <g class='graph-clock'
      ?tooltip=${this.tooltip.entity === index}
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
      ?init=${this.length[index]}
      anim=${this.config.animate && this.config.show.points !== 'hover'}
      style="animation-delay: ${this.config.animate ? `${index * 0.5 + 0.5}s` : '0s'}"
      stroke-width=${this.svg.line_width / 2}>
      ${this.renderSvgClockBackground(this.svg.width / 2)}
      ${clock.map(((bin, i) => this.renderSvgClockBin(bin, clockPaths[i], i)))}
      ${this.renderSvgClockFace(this.svg.width / 2 - 2 * 20)}
    </g>`;
}

// Timeline is wrong name for this type of history graph...
// But what?
renderSvgTimeline(timeline, index) {
  if (!timeline) return;

  console.log('renderSvgTimeline, line width', this.config.line_width, this.svg.line_width);

  const paths = timeline.map((timelinePart, i) => {
    const color = this.computeColor(timelinePart.value, 0);
    const animation = this.config.animate
      ? svg`
        <animate attributeName='y' from=${this.svg.height} to=${timelinePart.y} dur='1s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
      : '';
    return svg` 

      <rect class='timeline' x=${timelinePart.x} y=${timelinePart.y + (timelinePart.value > 0 ? +this.svg.line_width / 2 : -this.svg.line_width / 2)}
        height=${Math.max(1, timelinePart.height - this.svg.line_width)}
        width=${Math.max(timelinePart.width - this.svg.line_width, 1)}
        fill=${color}
        stroke=${color}
        stroke-width="${this.svg.line_width ? this.svg.line_width : 0}"
        @mouseover=${() => this.setTooltip(index, i, timelinePart.value)}
        @mouseout=${() => (this.tooltip = {})}>
        ${animation}
      </rect>`;
  });
  return svg`
      ${paths}
  `;
}

renderSvg() {
  const height = this.svg.height - this.svg.margin.y * 0; // * 2;
  const width = this.svg.width - this.svg.margin.x * 0; // * 2;
  this.MergeAnimationClassIfChanged();
  this.MergeAnimationStyleIfChanged();

  return svg`
  <svg width="${this.svg.width}" height="${this.svg.height}" overflow="visible"
    x="${this.svg.x}" y="${this.svg.y}"
    >
    <g>
        <defs>
          ${this.renderSvgGradient(this.gradient)}
        </defs>
        <svg viewbox="0 0 ${this.svg.width} ${this.svg.height}"
         overflow="visible"
        >
        ${this.fill.map((fill, i) => this.renderSvgAreaMask(fill, i))}
        ${this.fill.map((fill, i) => this.renderSvgAreaBackground(fill, i))}
        ${this.fillMinMax.map((fill, i) => this.renderSvgAreaMinMaxMask(fill, i))}
        ${this.fillMinMax.map((fill, i) => this.renderSvgAreaMinMaxBackground(fill, i))}
        ${this.line.map((line, i) => this.renderSvgLineMask(line, i))}
        ${this.line.map((line, i) => this.renderSvgLineBackground(line, i))}
        ${this.bar.map((bars, i) => this.renderSvgBarsMask(bars, i))}
        ${this.bar.map((bars, i) => this.renderSvgBarsBackground(bars, i))}
        ${this.clock.map((clockPart, i) => this.renderSvgClock(clockPart, i))}
        ${this.equalizer.map((equalizer, i) => this.renderSvgEqualizerMask(equalizer, i))}
        ${this.equalizer.map((equalizer, i) => this.renderSvgEqualizerBackground(equalizer, i))}
        ${this.points.map((points, i) => this.renderSvgPoints(points, i))}
        ${this.timeline.map((timelinePart, i) => this.renderSvgTimeline(timelinePart, i))}
        ${this.trafficLight.map((trafficLights, i) => this.renderSvgTrafficLights(trafficLights, i))}
        </svg>
      </g>
    </svg>`;
}

  updated(changedProperties) {
    if (this.config.animate && changedProperties.has('line')) {
      if (this.length.length < this.entity.length) {
        this._card.shadowRoot.querySelectorAll('svg path.line').forEach((ele) => {
          this.length[ele.id] = ele.getTotalLength();
        });
        this.length = [...this.length];
      } else {
        this.length = Array(this.entity.length).fill('none');
      }
    }
  }

  /** *****************************************************************************
    * SparklineBarChartTool::render()
    *
    * Summary.
    * The actual render() function called by the card for each tool.
    *
    */
  render() {
    return svg`
        <g id="graph-${this.toolId}"
          class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
          @click=${(e) => this.handleTapEvent(e, this.config)}>
          ${this.renderSvg()}
        </g>
      `;
  }
}
