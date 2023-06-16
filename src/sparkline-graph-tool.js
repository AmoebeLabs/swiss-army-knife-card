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
      animate: false,
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
      classes: {
        tool: {
          'sak-barchart': true,
          hover: true,
        },
        bar: {
        },
        line: {
          'sak-barchart__line': true,
          hover: true,
        },
      },
      styles: {
        tool: {
        },
        line: {
        },
        bar: {
        },
      },
      colorstops: [],
      show: { style: 'fixedcolor' },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_GRAPH_CONFIG, argConfig), argPos);

    this.svg.margin = Utils.calculateSvgDimension(this.config.position.margin);
    const theWidth = (this.config.position.orientation === 'vertical') ? this.svg.width : this.svg.height;

    this.svg.barWidth = (theWidth - (((this.config.hours / this.config.barhours) - 1)
                                  * this.svg.margin)) / (this.config.hours / this.config.barhours);
    this._data = [];
    this._bars = [];
    this._scale = {};
    this._needsRendering = false;

    this.classes.tool = {};
    this.classes.bar = {};

    this.styles.tool = {};
    this.styles.line = {};
    this.stylesBar = {};

    this.id = this.toolId;
    // From MGC
    this.bound = [0, 0];
    this.boundSecondary = [0, 0];
    this.length = [];
    this.entity = [];
    this.line = [];
    this.bar = [];
    this.abs = [];
    this.fill = [];
    this.points = [];
    this.gradient = [];
    this.tooltip = {};
    this.updateQueue = [];
    this.updating = false;
    this.stateChanged = false;
    this.initial = true;
    this._md5Config = undefined;

    console.log('SparklineGraphTool::constructor', this.config, this.svg);
    // Use full widt/height for config
    this.config.width = this.svg.width;
    this.config.height = this.svg.height;

    // Correct x/y pos with line_width to prevent cut-off
    this.svg.line_width = Utils.calculateSvgDimension(this.config.line_width);
    // this.svg.x = this.config.show.fill ? this.svg.x : this.svg.x + this.svg.line_width / 2;
    // this.svg.y += this.svg.line_width / 2;
    // this.svg.height -= this.svg.line_width;
    this.config.color_thresholds = computeThresholds(
      this.config.color_thresholds,
      this.config.color_thresholds_transition,
    );
    // Graph settings
    this.svg.graph = {};
    this.svg.graph.height = this.svg.height - this.svg.line_width;
    this.svg.graph.width = this.config.show.fill ? this.svg.width : this.svg.width - this.svg.line_width / 2;
   // From MGC
    this.Graph = this.config.entity_indexes.map(
      (entity) => new SparklineGraph(
        this.svg.graph.width,
        this.svg.graph.height,
        // [0, 0, 0],
        [this.config.show.fill ? 0 : this.config.line_width, this.config.line_width],
        this.config.hours_to_show,
        this.config.points_per_hour,
        entity.aggregate_func || this.config.aggregate_func,
        this.config.group_by,
        getFirstDefinedItem(
          entity.smoothing,
          this.config.smoothing,
          !this._card.config.entities[entity.entity_index].entity.startsWith('binary_sensor.'),
          // !entity.entity.startsWith('binary_sensor.'), // turn off for binary sensor by default
        ),
        this.config.logarithmic,
      ),
    );
    console.log('in constructor, graph', this.Graph);

    if (this.dev.debug) console.log('SparklelineGraph constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  // getFirstDefinedItem(...collection) {
  //   return collection.find((item) => typeof item !== 'undefined');
  // }

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
    // this._series = Object.assign(states);
    // this.computeBars();
    // this._needsRendering = true;
  }

  set series(states) {
    // this._series = Object.assign(states);
    // this.computeBars();
    // this._needsRendering = true;
    // console.log('SparklineGraphTool::set series(states)', states);
    this.Graph[0].update(states);

    this.updateBounds();

    let { config } = this;
    if (config.show.graph) {
      let graphPos = 0;
      this._card.entities.forEach((entity, i) => {
      // this.entity.forEach((entity, i) => {
      if (!entity || this.Graph[i].coords.length === 0) return;
        const bound = this._card.config.entities[i].y_axis === 'secondary' ? this.boundSecondary : this.bound;
        [this.Graph[i].min, this.Graph[i].max] = [bound[0], bound[1]];
        if (config.show.graph === 'bar') {
          const numVisible = this.visibleEntities.length;
          this.bar[i] = this.Graph[i].getBars(graphPos, numVisible, config.bar_spacing);
          graphPos += 1;
        } else {
          const line = this.Graph[i].getPath();
          if (this._card.config.entities[i].show_line !== false) this.line[i] = line;
          if (config.show.fill
            && this._card.config.entities[i].show_fill !== false) this.fill[i] = this.Graph[i].getFill(line);
          if (config.show.points && (this._card.config.entities[i].show_points !== false)) {
            this.points[i] = this.Graph[i].getPoints();
          }
          if (config.color_thresholds.length > 0 && !this._card.config.entities[i].color)
            this.gradient[i] = this.Graph[i].computeGradient(
              config.color_thresholds, this.config.logarithmic,
            );
        }
      });
      this.line = [...this.line];
    }
    this.updating = false;
  }

  hasSeries() {
    return this.defaultEntityIndex();
  }

  get visibleEntities() {
    console.log('visibleEntities', this._card.config.entities.filter((entity) => entity.show_graph !== false));
    return this._card.config.entities.filter((entity) => entity.show_graph !== false);
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
    console.log('YaxisSERIES', this.primaryYaxisEntities.map((entity, index) => this.Graph[index]));
    return this.primaryYaxisEntities.map((entity, index) => this.Graph[index]);
    return this.primaryYaxisEntities.map((entity) => this.Graph[entity.index]);
  }

  get secondaryYaxisSeries() {
    return this.secondaryYaxisEntities.map((entity) => this.Graph[entity.index]);
  }

  getBoundary(type, series, configVal, fallback) {
    if (!(type in Math)) {
      throw new Error(`The type "${type}" is not present on the Math object`);
    }

    if (configVal === undefined) {
      // dynamic boundary depending on values
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
    return this.config.entities[i].color || intColor || line_color[i] || line_color[0];
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

  renderSvgFill(fill, i) {
  if (this.config.show.graph !== 'line') return;
  if (!fill) return;
  const fade = this.config.show.fill === 'fade';
  const init = this.length[i] || this._card.config.entities[i].show_line === false;
  return svg`
    <defs>
      <linearGradient id=${`fill-grad-${this.id}-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='.10'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-${this.id}-${i}`}>
        <rect width="100%" height="100%" fill=${`url(#fill-grad-${this.id}-${i})`} />
      </mask>
    </defs>
    <mask id=${`fill-${this.id}-${i}`}>
      <path class='fill'
        type=${this.config.show.fill}
        .id=${i} anim=${this.config.animate} ?init=${init}
        style="animation-delay: ${this.config.animate ? `${i * 0.5}s` : '0s'}"
        fill='white'
        mask=${fade ? `url(#fill-grad-mask-${this.id}-${i})` : ''}
        d=${this.fill[i]}
      />
    </mask>`;
}

renderSvgLine(line, i) {
  // console.log('render Graph, renderSvgLine(line, i)', line, i);
  // if (this.config.show.graph !== 'line') return;
  if (!line) return;

  const path = svg`
    <path
      class='graph_line'
      .id=${i}
      anim=${this.config.animate} ?init=${this.length[i]}
      style="animation-delay: ${this.config.animate ? `${i * 0.5}s` : '0s'}"
      fill='none'
      stroke-dasharray=${this.length[i] || 'none'} stroke-dashoffset=${this.length[i] || 'none'}
      stroke=${'white'}
      stroke-width=${this.config.line_width}
      d=${this.line[i]}
    />`;

  return svg`
    <mask id=${`line-${this.id}-${i}`}>
      ${path}
    </mask>
  `;
}

renderSvgPoint(point, i) {
  const color = this.gradient[i] ? this.computeColor(point[V], i) : 'inherit';
  return svg`
    <circle
      class='graph_line--point'
      ?inactive=${this.tooltip.index !== point[3]}
      style=${`--mcg-hover: ${color};`}
      stroke=${color}
      fill=${color}
      cx=${point[X]} cy=${point[Y]} r=${this.config.line_width}
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
    <g class='graph_line--points'
      ?tooltip=${this.tooltip.entity === i}
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      ?init=${this.length[i]}
      anim=${this.config.animate && this.config.show.points !== 'hover'}
      style="animation-delay: ${this.config.animate ? `${i * 0.5 + 0.5}s` : '0s'}"
      fill=${color}
      stroke=${color}
      stroke-width=${this.config.line_width / 2}>
      ${points.map((point) => this.renderSvgPoint(point, i))}
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

renderSvgLineRect(line, i) {
  // Hack
  return;
  // console.log('render Graph, renderSvgLineRect(line, i)', line, i);
  if (!line) return;
  const fill = this.gradient[i]
    ? `url(#grad-${this.id}-${i})`
    : this.computeColor(this._card.entities[i].state, i);
  return svg`
    <rect class='graph_line--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`line-rect-${this.id}-${i}`}
      fill=${fill} height="100%" width="100%"
      mask=${`url(#line-${this.id}-${i})`}
    />`;
}

// Render the area below the line graph.
// Currently called the 'fill', but actually it should be named area, after
// sparkline area graph according to the mighty internet.
renderSvgFillRect(fill, i) {
  // console.log('render Graph, renderSvgFillRect(fill, i)', fill, i);
  if (!fill) return;
  const svgFill = this.gradient[i]
    ? `url(#grad-${this.id}-${i})`
    : this.intColor(this._card.entities[i].state, i);
  return svg`
    <rect class='graph_area-fill--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`area-fill-rect-${this.id}-${i}`}
      fill=${svgFill} height="100%" width="100%"
      mask=${`url(#fill-${this.id}-${i})`}
    />`;
}

renderSvgBars(bars, index) {
  // console.log('render Graph, renderSvgBars(bars, index)', bars, index);
  if (!bars) return;
  const items = bars.map((bar, i) => {
    const animation = this.config.animate
      ? svg`
        <animate attributeName='y' from=${this.config.height} to=${bar.y} dur='1s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
      : '';
    const color = this.computeColor(bar.value, index);
    return svg` 
      <rect class='graph_bar' x=${bar.x} y=${bar.y}
        height=${bar.height} width=${bar.width} fill=${color}
        @mouseover=${() => this.setTooltip(index, i, bar.value)}
        @mouseout=${() => (this.tooltip = {})}>
        ${animation}
      </rect>`;
  });
  return svg`<g class='bars' ?anim=${this.config.animate}>${items}</g>`;
}

    // <svg width='100%' height=${height !== 0 ? '100%' : 0} viewBox='0 0 500 ${height}'

renderSvg() {
  // console.log('render Graph, renderSvg()', this.fill, this.line, this.bar, this.points, this.config.height, this.config.width);
  const { height } = this.config;
  const { width } = this.config;

  // <svg width='100%' height='100%' viewBox='0 0 400 400'
  return svg`
  <svg width="${width}" height="${height}"
  x="${this.svg.x}" y="${this.svg.y}">
    <g>
        <defs>
          ${this.renderSvgGradient(this.gradient)}
        </defs>
        ${this.fill.map((fill, i) => this.renderSvgFill(fill, i))}
        ${this.fill.map((fill, i) => this.renderSvgFillRect(fill, i))}
        ${this.line.map((line, i) => this.renderSvgLine(line, i))}
        ${this.line.map((line, i) => this.renderSvgLineRect(line, i))}
        ${this.bar.map((bars, i) => this.renderSvgBars(bars, i))}
      </g>
      ${this.points.map((points, i) => this.renderSvgPoints(points, i))}
    </svg>`;

    return svg`
    <svg width=${width} height=${height !== 0 ? '100%' : 0} viewBox='0 0 ${width} ${height}'
      x="${this.svg.x}" y="${this.svg.y}"
      @click=${(e) => e.stopPropagation()}>
      <g>
        <defs>
          ${this.renderSvgGradient(this.gradient)}
        </defs>
        ${this.fill.map((fill, i) => this.renderSvgFill(fill, i))}
        ${this.fill.map((fill, i) => this.renderSvgFillRect(fill, i))}
        ${this.line.map((line, i) => this.renderSvgLine(line, i))}
        ${this.line.map((line, i) => this.renderSvgLineRect(line, i))}
        ${this.bar.map((bars, i) => this.renderSvgBars(bars, i))}
      </g>
      ${this.points.map((points, i) => this.renderSvgPoints(points, i))}
    </svg>`;
}

  updated(changedProperties) {
    console.log('graph - updated');
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
    // console.log('render Graph called');
    return svg`
        <g id="graph-${this.toolId}"
          class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
          @click=${(e) => this.handleTapEvent(e, this.config)}>
          ${this.renderSvg()}
        </g>
      `;
  }
}
