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
      x_axis: {
        hours_to_show: 24,
        bins_per_hour: 0.5,
        group_by: 'interval',
        start_on: 'interval',
      },
      y_axis: {
        logarithmic: false,
        value_factor: 0,
        aggregate_func: 'avg',
        smoothing: true,
      },
      _hours_to_show: 24,
      _points_per_hour: 0.5,
      _bins_per_hour: 0.5,
      _group_by: 'interval',
      _start_on: 'interval',
      _logarithmic: false,
      _value_factor: 0,
      _aggregate_func: 'avg',
      value_buckets: 10,
      animate: true,
      hour24: false,
      font_size: 10,
      line_color: [...DEFAULT_COLORS],
      colorstops: [],
      colorstops_transition: 'smooth',
      line_width: 5,
      bar_spacing: 4,
      state_map: [],
      cache: true,
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

    this.classes.timeline = {};
    this.classes.timeline_graph = {};
    this.styles.timeline = {};
    this.styles.timeline_graph = {};

    this.classes.clock = {};
    this.classes.clock_graph = {};
    this.styles.clock = {};
    this.styles.clock_graph = {};

    // Helper lines stuff
    this.classes.helper_line1 = {};
    this.classes.helper_line2 = {};
    this.classes.helper_line3 = {};

    this.styles.helper_line1 = {};
    this.styles.helper_line2 = {};
    this.styles.helper_line3 = {};

    // eslint-disable-next-line dot-notation
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

    // Use full widt/height for config
    this.config.width = this.svg.width;
    this.config.height = this.svg.height;

    // Correct x/y pos with line_width to prevent cut-off
    this.svg.line_width = Utils.calculateSvgDimension(this.config.line_width);
    // this.svg.x = this.config.show.fill ? this.svg.x : this.svg.x + this.svg.line_width / 2;
    // this.svg.y += this.svg.line_width / 2;
    // this.svg.height -= this.svg.line_width;
    this.trafficLights = [];
    this.config.colorstops.map((value, index) => (
      this.trafficLights[index] = value.value
    ));

    this.buckets = [];
    this.config.colorstops.map((value, index) => {
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
      let rangeMax = this.config.colorstops[index + 1]?.value || Infinity;
      this.buckets[bucketIndex].value.push(value.value);
      this.buckets[bucketIndex].rangeMin.push(rangeMin);
      this.buckets[bucketIndex].rangeMax.push(rangeMax);
      return true;
    });

    this.config.colorstops = computeThresholds(
      this.config.colorstops,
      this.config.colorstops_transition,
    );

    this.clockWidth = Utils.calculateSvgDimension(this.config?.clock?.size || 5);
    // Graph settings
    this.svg.graph = {};
    this.svg.graph.height = this.svg.height - this.svg.margin.y * 0;
    this.svg.graph.width = this.svg.width - this.svg.margin.x * 0;

    this.config.state_map.forEach((state, i) => {
      // convert string values to objects
      if (typeof state === 'string') this.config.state_map[i] = { value: state, label: state };
      // make sure label is set
      this.config.state_map[i].label = this.config.state_map[i].label || this.config.state_map[i].value;
    });
    // Helper lines
    this.helperLines = [];
    if (typeof this.config.helper_lines === 'object') {
      let j = 0;
      let helpers = Object.keys(this.config.helper_lines);
      helpers.forEach((helperLine) => {
        this.helperLines[j] = {
          id: helperLine,
          zpos: this.config.helper_lines[helperLine]?.zpos || 'above',
          yshift: Utils.calculateSvgDimension(this.config.helper_lines[helperLine]?.yshift) || 0,
        };
        j += 1;
      });
    }
    // if (this.helperLines.length > 0)
    //   console.log('helperLines', this.helperLines);

    // Other lines test
    this.xLines = {};
    this.xLines.lines = [];
    if (typeof this.config.x_lines?.lines === 'object') {
      let j = 0;
      let helpers = this.config.x_lines.lines;
      helpers.forEach((helperLine) => {
        this.xLines.lines[j] = {
          id: helperLine.name,
          zpos: helperLine?.zpos || 'above',
          yshift: Utils.calculateSvgDimension(helperLine?.yshift) || 0,
        };
        j += 1;
      });
    }
    // if (this.xLines.lines.length > 0)
    //   console.log('xAxis.lines', this.xLines.lines);

    // this.xLines.numbers = {};
    if (typeof this.config.x_lines?.numbers === 'object') {
      this.xLines.numbers = { ...this.config.x_lines.numbers };
    }
    // if (this.xLines.numbers)
    //   console.log('xAxis.numbers', this.xLines.numbers);

    let { config } = this;

    // override points per hour to match group_by function
    // switch (this.config.x_axis.group_by) {
    //   case 'week':
    //     this.config.x_axis.bins_per_hour = 1 / (24 * 7);
    //     break;
    //   case 'date':
    //     this.config.x_axis.bins_per_hour = 1 / 24;
    //     break;
    //   case 'hour':
    //     this.config.x_axis.bins_per_hour = 1;
    //     break;
    //   case 'quarterhour':
    //     this.config.x_axis.bins_per_hour = 4;
    //     break;
    //   default:
    //     break;
    // }
    // From MGC
    // if (this.config.points_per_hour)
    //   this.config.x_axis.bins_per_hour = this.config.points_per_hour;
    this.Graph = [];
    this.Graph[0] = new SparklineGraph(
      this.svg.graph.width,
      this.svg.graph.height,
      this.svg.margin,
      this.config.x_axis.start_on,
      this.config.x_axis.hours_to_show,
      this.config.x_axis.bins_per_hour,
      this.config.y_axis.aggregate_func,
      this.config.x_axis.group_by,
      getFirstDefinedItem(
        this.config.y_axis.smoothing,
        !this._card.config.entities[this.defaultEntityIndex()].entity.startsWith('binary_sensor.'),
        // !entity.entity.startsWith('binary_sensor.'), // turn off for binary sensor by default
      ),
      this.config.y_axis.logarithmic,
      this.trafficLights,
      this.buckets,
      this.config.state_map,
      config,
    );
    // this.Graph[0] = new SparklineGraph(
    //   this.svg.graph.width,
    //   this.svg.graph.height,
    //   this.svg.margin,
    //   this.config.x_axis.start_on,
    //   this.config.x_axis.hours_to_show || this.config.hours_to_show,
    //   this.config.x_axis.bins_per_hour || this.config.points_per_hour,
    //   this.config.y_axis.aggregate_func || this.config.aggregate_func,
    //   this.config.y_axis.group_by || this.config.group_by,
    //   getFirstDefinedItem(
    //     this.config.smoothing,
    //     !this._card.config.entities[this.defaultEntityIndex()].entity.startsWith('binary_sensor.'),
    //     // !entity.entity.startsWith('binary_sensor.'), // turn off for binary sensor by default
    //   ),
    //   this.config.y_axis.logarithmic || this.config.y_axis.logarithmic,
    //   this.trafficLights,
    //   this.buckets,
    //   this.config.state_map,
    //   config,
    // );

    // this.Graph[0] = new SparklineGraph(
    //   this.svg.graph.width,
    //   this.svg.graph.height,
    //   this.svg.margin,
    //   this.config?.x_axis?.start_on,
    //   this.config?.x_axis?.hours_to_show || this.config.hours_to_show,
    //   this.config?.x_axis?.bins_per_hour || this.config.x_axis.bins_per_hour,
    //   this.config?.y_axis?.aggregate_func || this.config.aggregate_func,
    //   this.config?.y_axis?.group_by || this.config.group_by,
    //   getFirstDefinedItem(
    //     this.config.smoothing,
    //     !this._card.config.entities[this.defaultEntityIndex()].entity.startsWith('binary_sensor.'),
    //     // !entity.entity.startsWith('binary_sensor.'), // turn off for binary sensor by default
    //   ),
    //   this.config?.y_axis?.logarithmic || this.config.y_axis.logarithmic,
    //   this.trafficLights,
    //   this.buckets,
    //   this.config.state_map,
    //   config,
    // );

    // this.Graph[0] = new SparklineGraph(
    //     this.svg.graph.width,
    //     this.svg.graph.height,
    //     this.svg.margin,
    //     this.config?.start_on,
    //     this.config.hours_to_show,
    //     this.config.x_axis.bins_per_hour,
    //     this.config.aggregate_func,
    //     this.config.group_by,
    //     getFirstDefinedItem(
    //       this.config.smoothing,
    //       !this._card.config.entities[this.defaultEntityIndex()].entity.startsWith('binary_sensor.'),
    //       // !entity.entity.startsWith('binary_sensor.'), // turn off for binary sensor by default
    //     ),
    //     this.config.y_axis.logarithmic,
    //     this.trafficLights,
    //     this.buckets,
    //     this.config.state_map,
    //     config,
    // );
  }

  set value(state) {
    // console.log('GraphTool - set value IN', state);

    if (this._stateValue === state) return false;

    const changed = super.value = state;

    // Push realtime data into the history graph for fixed_value...
    // Maybe in future: history is fetched once, and then real time updates add
    // data to the existing history graph, and deletes old data points...
    if (this.config.y_axis.fixed_value === true) {
      let histState = state;
      const stateHistory = [{ state: histState }];
      this.series = stateHistory;
    }
    return changed;
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
      const last = states[states.length - 1];
      states = [last, last];
    }
    // HACK...
    this.seriesIndex = 0;
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
          if (config.colorstops.length > 0 && !this._card.config.entities[i].color)
            this.gradient[i] = this.Graph[i].computeGradient(
              config.colorstops, this.config.y_axis.logarithmic,
            );
        // +++++ Check for 'area' or 'line' graph type
        } else if (['area', 'line'].includes(config.show.graph)) {
          const line = this.Graph[i].getPath();
          if (this._card.config.entities[i].show_line !== false) this.line[i] = line;
        }

        // +++++ Check for 'area' graph type
        if (config.show.graph === 'area') {
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
        if (config.colorstops.length > 0 && !this._card.config.entities[i].color)
        this.gradient[i] = this.Graph[i].computeGradient(
          config.colorstops, this.config.y_axis.logarithmic,
        );

      this.line = [...this.line];
    }
    this.updating = false;
    if (this._firstUpdatedCalled) {
      this._firstUpdatedCalled = false;
    } else {
      this._firstUpdatedCalled = true;
    }
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

  // NOTE!!!!!!!!!!!!
  // Should this function return a record with:
  // - source value
  // - mapped value
  // - bucket value (or same as mapped value)
  // In that case the software can choose what to get, depending on the mode.
  // I think that that is more consistent than the current 'bin' implementation.
  // That one hides the source value, which is then is fetched again using reverse
  // lookup in the buckets to get the proper value for computing the color!
  // WOuld this work:
  // - .state = source value
  // - .mapped = mapped value
  // - .xlated = translated value, or bucket/bin. Or same as .mapped.
  // OR, if no mapping or else, use state as the resulting value.
  // - .state = translated value
  // - .sourceState = source state
  // if no .sourceState there, nothing translated. No extra memory and stuff
  processStateMap(history) {
    if (this.config.state_map?.length > 0) {
      history[0].forEach((item, index) => {
        if (this.config.state_map.length > 0)
        history[0][index].haState = item.state;
        this._convertState(item);
        history[0][index].state = item.state;
      });
    }
    if (this.config.y_axis?.use_value === 'bin') {
      history[0].forEach((item, index) => {
        let matchStep = -1;
        let matchBucket = 0;
        let match = false;
        match = false;
        for (let i = 0; i < this.buckets.length; i++) {
          // In which bucket...
          // Find matching bucket. Can be any of them defined
          matchBucket = 0;
          for (let j = 0; j < this.buckets[i].rangeMin.length; j++) {
            if (item.state >= this.buckets[i].rangeMin[j] && item.state < this.buckets[i].rangeMax[j]) {
              match = true;
              matchBucket = j;
              matchStep = i;
            }
          }
        }
        if (!match) {
          console.log('processStateMap - ILLEGAL value', item, index);
        }
        const newValue = this.buckets[matchStep].bucket;
        history[0][index].haState = item.state;
        history[0][index].state = newValue;
      });
    }
    if (this.config.y_axis.value_factor !== 0) {
      history[0].forEach((item, index) => {
        history[0][index].haState = item.state;
        history[0][index].state = item.state * this.config.y_axis.value_factor;
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
      config.y_axis.lower_bound,
      config.y_axis.upper_bound,
      this.bound,
      config.y_axis.min_bound_range,
    );

    this.boundSecondary = this.getBoundaries(
      this.secondaryYaxisSeries,
      config.y_axis.lower_bound_secondary,
      config.y_axis.upper_bound_secondary,
      this.boundSecondary,
      config.y_axis.min_bound_range_secondary,
    );
  }

  computeColor(inState, i) {
    const { colorstops, line_color } = this.config;
    const state = Number(inState) || 0;
    const threshold = {
      color: line_color[i] || line_color[0],
      ...colorstops.slice(-1)[0],
      ...colorstops.find((ele) => ele.value < state),
    };
    return this._card.config.entities[i].color || threshold.color;
  }

  intColor(inState, i) {
    const { colorstops, line_color } = this.config;
    const state = Number(inState) || 0;

    let intColor;
    if (colorstops.length > 0) {
      // HACK. Keep check for 'bar' !!!
      if (this.config.show.graph === 'bar') {
        const { color } = colorstops.find((ele) => ele.value < state)
          || colorstops.slice(-1)[0];
        intColor = color;
      } else {
        const index = colorstops.findIndex((ele) => ele.value < state);
        const c1 = colorstops[index];
        const c2 = colorstops[index - 1];
        if (c2) {
          const factor = (c2.value - inState) / (c2.value - c1.value);
          intColor = Colors.getGradientValue(c2.color, c1.color, factor);
        } else {
          intColor = index
            ? colorstops[colorstops.length - 1].color
            : colorstops[0].color;
        }
      }
    }

    return this._card.config.entities[i].color || intColor || line_color[i] || line_color[0];
    // return this.config.entities[i].color || intColor || line_color[i] || line_color[0];
  }

  getEndDate() {
    const date = new Date();
    switch (this.config.x_axis.group_by) {
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
    switch (this.config.x_axis.start_on) {
      case 'today':
        break;
      case 'yesterday':
        // date.setDate(date.getDate() - 1);
        date.setHours(0, 0, 0, 0);
        break;
      default:
        break;
    }
    return date;
  }

  setTooltip(entity, index, value, label = null) {
    const {
      bins_per_hour,
      hours_to_show,
      format,
    } = this.config.x_axis;
    const offset = hours_to_show < 1 && bins_per_hour < 1
      ? bins_per_hour * hours_to_show
      : 1 / bins_per_hour;

    const id = Math.abs(index + 1 - Math.ceil(hours_to_show * bins_per_hour));

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
  if (!fill) return;
  const fade = this.config.show.fill === 'fade';
  const init = this.length[i] || this._card.config.entities[i].show_line === false;
  // Check for zero crossing...
  const y_zero = (this.Graph[i]._min >= 0) ? 0
   : (Math.abs(this.Graph[i]._min) / ((this.Graph[i]._max - this.Graph[i]._min)) * 100);
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
  if (!line) return;

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
  }

  // What if single array of rects, and just color them with a nice animation, ie
  // animation on change of color. Should look nice...
  const bgRect = this.buckets.map((bucket, k) => {
    const piet = [];
    console.log('bgRect', bucket, k, trafficLight);
    return svg`
    <rect class='bg-level'
      x=${trafficLight.x + adjustX + this.svg.line_width / 2}
      y=${trafficLight.y[k] - 1 * trafficLight.height - this.svg.line_width / 1}
      height=${Math.max(0, trafficLight.height - 2 * adjustY - this.svg.line_width)}
      width=${Math.max(0, trafficLight.width - 2 * adjustX - this.svg.line_width)}
      fill="var(--theme-sys-elevation-surface-neutral4)"
      stroke="var(--theme-sys-elevation-surface-neutral4)"
      opacity="1"
      stroke-width="${this.svg.line_width ? this.svg.line_width : 0}"
      rx="50%">
    </rect>`;
  });

  const levelRect = trafficLight.value.map((single, j) => {
    const piet = [];
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
      rx="50%"
      @mouseover=${() => this.setTooltip(i, j, single)}
      @mouseout=${() => (this.tooltip = {})}>
    </rect>`;
  });

  return svg`
    ${bgRect}
    ${levelRect}
    `;
}

renderSvgTrafficLights(trafficLights, i) {
  if (!trafficLights) return;
  const color = this.computeColor(this._card.entities[i].state, i);
  const linesBelow = this.xLines.lines.map((helperLine) => {
    if (helperLine.zpos === 'below') {
      return [svg`
        <line class=${classMap(this.classes[helperLine.id])}) style="${styleMap(this.styles[helperLine.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        pathLength="240"
        >
        </line>
        `];
    } else return [''];
  });
  const linesAbove = this.xLines.lines.map((helperLine) => {
    // console.log('linesAbove', helperLine);
    if (helperLine.zpos === 'above') {
      return [svg`
        <line class="${classMap(this.classes[helperLine.id])}"
              style="${styleMap(this.styles[helperLine.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        pathLength="240"
        >
        </line>
        `];
    } else return [''];
  });
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
      ${linesBelow}
      ${trafficLights.map((trafficLight) => this.renderSvgTrafficLight(trafficLight, i))}
      ${linesAbove}
    </g>`;
}

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
  if (!line) return;
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
  if (!line) return;
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
  if (this.config.show.graph !== 'area') return;
  if (!fill) return;
  const svgFill = this.gradient[i]
    ? `url(#grad-${this.id}-${i})`
    : this.intColor(this._card.entities[i].state, i);
    const linesBelow = this.xLines.lines.map((helperLine) => {
      if (helperLine.zpos === 'below') {
        return [svg`
          <line class=${classMap(this.classes[helperLine.id])}) style="${styleMap(this.styles[helperLine.id])}"
          x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
          x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
          pathLength="240"
          >
          </line>
          `];
      } else return [''];
    });
    const linesAbove = this.xLines.lines.map((helperLine) => {
      // console.log('linesAbove', helperLine);
      if (helperLine.zpos === 'above') {
        return [svg`
          <line class="${classMap(this.classes[helperLine.id])}"
                style="${styleMap(this.styles[helperLine.id])}"
          x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
          x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
          pathLength="240"
          >
          </line>
          `];
      } else return [''];
    });

    return svg`
    ${linesBelow}
    <rect class='fill--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`fill-rect-${this.id}-${i}`}
      fill=${svgFill} height="100%" width="100%"
      mask=${`url(#fill-${this.id}-${i})`}
    />
    ${linesAbove}
    `;
}

renderSvgAreaMinMaxBackground(fill, i) {
  if (this.config.show.graph !== 'line') return;
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
  const fade = this.config.show.fill === 'fade';
  const maskNeg = `url(#fill-grad-mask-neg-${this.id}-${index}})`;
  const maskPos = `url(#fill-grad-mask-pos-${this.id}-${index}})`;
  const fillNeg = this.config.styles.bar_mask_below.fill;
  const fillPos = this.config.styles.bar_mask_above.fill;

  let size;
  if (this.config.square === true) {
    // Redistribute height
    size = Math.min(equalizer[0].width, equalizer[0].height);
    if (size < equalizer[0].height) {
      let spaceBetween = (this.svg.height - (this.config.value_buckets * size)) / (this.config.value_buckets - 1);

      let newEq = equalizer.map((equalizerPart, i) => {
        let eq = { ...equalizerPart };
        for (let j = 0; j < equalizerPart.y.length; j++) {
          eq.y[j] = this.svg.height - (j * (size + spaceBetween));
        }
        eq.width = size;
        eq.height = size;
        return eq;
      });
      equalizer = [...newEq];
    }
  }
  const paths = equalizer.map((equalizerPart, i) => {
    const equalizerPartRect = equalizerPart.value.map((single, j) => {
      const piet = [];
      const animation = this.config.animate
      ? svg`
        <animate attributeName='y'
          from=${this.svg.height} to=${equalizerPart.y[j] - 1 * equalizerPart.height - this.svg.line_width}
          begin='0s' dur='5s' fill='remove' restart='whenNotActive' repeatCount='1'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
      : '';
      // jj = j;
      return svg`
      <rect class='level'
        data-size=${size}
        x=${equalizerPart.x}
        y=${equalizerPart.y[j] - equalizerPart.height - this.svg.line_width / 100000}
        height=${Math.max(0, equalizerPart.height - this.svg.line_width)}
        width=${Math.max(0, equalizerPart.width - this.svg.line_width)}
        fill=${fade ? (equalizerPart.value > 0 ? fillPos : fillNeg) : 'white'}
        stroke=${fade ? (equalizerPart.value > 0 ? fillPos : fillNeg) : 'white'}
        stroke-width="${this.svg.line_width ? this.svg.line_width : 0}"
        rx="0%"
        style="transition: fill 5s ease;"
        @mouseover=${() => this.setTooltip(index, j, single)}
        @mouseout=${() => (this.tooltip = {})}>
        ${this._firstUpdatedCalled ? animation : ''}
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
  // const color = this.computeColor(bin.value, 0);
  const color = this.intColor(bin.value, 0);
  return svg`
  <path class="${classMap(this.classes.clock_graph)}"
        style="${styleMap(this.styles.clock_graph)}"
    d=${path}
    fill=${color}
    stroke=${color}
  >
  `;
}

renderSvgClockBackground(radius) {
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
  return svg`
    <path class="graph-clock--background"
      d="${d}"
      style="fill: var(--theme-sys-elevation-surface-neutral4); stroke-width: 0; opacity: 0.1;"
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
// Timeline could get:
// - background rect
// - centerline, to go line. Calculated from timeline.length and x coords to start from
// - helper line 1
// - helper line 2
// - with the two helper lines, user can make a sort of x-axis division stuff. Say 1 full
//   line from start to finish, and one line with a dasharray to make vertical dashes...
//   The two helper lines should have some offset from center to position them!
// - The helper lines should be generic for every graph, altough the clock will ignore them!
// - Add number helpers too? Again max 4? Relative and absolute? Relative this time with
//   calculations? That won't be hard to calculate/display just the hour. Not more!!
renderSvgTimeline(timeline, index) {
  if (!timeline) return;

  // console.log('rendertimeline, styles = ', this.styles.helper_line1);
  // if (this.config.y_axis?.use_value === 'bin') console.log('renderSvgTimeline, bin, timeline', timeline);
  const paths = timeline.map((timelinePart, i) => {
    // const color = this.computeColor(timelinePart.value, 0);
    // Should use different value for use_value: bin. In that case the index in the colorstop
    // should be used, ie reverse lookup. Not the start/end values of the stop itself, but the
    // bucket value!!
    let color;
    if (this.config.y_axis?.use_value === 'bin') {
      // If aggrerate func = avg, one might get fractions! Floor those!!
      // However, fraction is still calculated on height, so you can see that it was not in the same
      // bucket all the time. Should also color that one with intColor?? Ie show smoothing ??
      // In that case: if value is 0.3, calculate value in range?
      // rangeMin + rangeMin * fractionOf(value)
      const flooredValue = Math.floor(timelinePart.value);
      if (this.buckets[flooredValue]?.value) {
        const colorValue = this.buckets[flooredValue].value[0]
            + (this.buckets[flooredValue].rangeMax[0] - this.buckets[flooredValue].rangeMin[0]) * (timelinePart.value - flooredValue);
        // color = this.intColor(this.buckets[flooredValue].value[0], 0);
        color = this.intColor(colorValue, 0);
        // console.log('rendertimeline, color bin', this.buckets, timelinePart.value, this.buckets[flooredValue].value[0]);
      } else {
        // Weird stuff. What is that illegal value???
        console.log('rendertimeline, illegal value', timelinePart.value);
      }
    } else {
      color = this.intColor(timelinePart.value, 0);
    }

    const animation = this.config.animate
      ? svg`
        <animate attributeName='y' from=${this.svg.height} to=${timelinePart.y} dur='1s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
      : '';
    return svg` 
      <rect class=${classMap(this.classes.timeline_graph)}) style="${styleMap(this.styles.timeline_graph)}"
        x=${timelinePart.x} y=${timelinePart.y + (timelinePart.value > 0 ? +this.svg.line_width / 2 : -this.svg.line_width / 2)}
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
  // stroke="lightgray" stroke-dasharray="0.5, 119" stroke-width="${this.svg.graph.height}"

  const linesBelow = this.xLines.lines.map((helperLine) => {
    if (helperLine.zpos === 'below') {
      return [svg`
        <line class=${classMap(this.classes[helperLine.id])}) style="${styleMap(this.styles[helperLine.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        pathLength="240"
        >
        </line>
        `];
    } else return [''];
  });
  const linesAbove = this.xLines.lines.map((helperLine) => {
    // console.log('linesAbove', helperLine);
    if (helperLine.zpos === 'above') {
      return [svg`
        <line class="${classMap(this.classes[helperLine.id])}"
              style="${styleMap(this.styles[helperLine.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        pathLength="240"
        >
        </line>
        `];
    } else return [''];
  });
  // console.log('renderSvgTimeline, lines', this.helperLines, linesAbove, linesBelow);
  return svg`
    ${linesBelow}
    ${paths}
    ${linesAbove}
  `;
}
// pathLength=24"${this.svg.graph.width / 4}">

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
