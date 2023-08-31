import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import Utils from './utils';
import BaseTool from './base-tool';
import Colors from './colors';

const DEFAULT_COLORS = [
  'var(--theme-sys-color-primary)',
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
  try {
    valuedStops.sort((a, b) => b.value - a.value);
  } catch (error) {
    console.log('computeThresholds, error', error, valuedStops);
  }

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
  * ProgressPath class
  *
  * Summary.
  *
  */

export default class ProgressPathTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_PATH_PROGRESS_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        width: 80,
        height: 80,
      },
      progpath: {
        show: {
          path_type: 'rectangle',
          progress: true,
          track: 'dashes', // or scale: dashes / colorstop / none / both? (colorstop + dashes)
          marker: 'navigation',
          colorstops: 'none',
          scale: false,
        },
        background: {
          width: 8,
        },
        circle: {
          direction: 'cw',
        },
        marker: {
          size: 10,
          offset: 0,
          color: {
            animate: false,
            smooth: false,
          },
          attach_to: 'circumference',
          flip: false,
        },
        scale: {
          offset: 0,
        },
        track: {
          width: 8,
        },
        progress: {
          width: 8,
          color: {
            smooth: false,
          },
        },
        line_color: [...DEFAULT_COLORS],
        colorstops: {
          colors: [],
        },
      },
      classes: {
        tool: {
          'sak-path-progress': true,
          hover: true,
        },
        background: {
        },
        progpath: {
          'sak-path-progress__progress': true,
        },
        dashes_scale: {
        },
        progress: {
        },
        marker: {
        },
      },
      styles: {
        tool: {
        },
        background: {
          stroke: 'var(--theme-sys-elevation-surface-neutral3)',
          fill: 'none',
        },
        progpath: {
        },
        dashes_scale: {
        },
        progress: {
          fill: 'none',
          stroke: 'var(--primary-color)',
        },
        marker: {
        },
      },
    };
    super(argToolset, Merge.mergeDeep(DEFAULT_PATH_PROGRESS_CONFIG, argConfig), argPos);
    this.EnableHoverForInteraction();

    this.svg.radius = Utils.calculateSvgDimension(argConfig.position.radius);
    this.svg.path = svg``;
    this.svg.scalePath = svg``;

    this.svg.background = { width: Utils.calculateSvgDimension(this.config.progpath.background.width) };
    this.svg.marker = { offset: Utils.calculateSvgDimension(this.config.progpath.marker.offset) / 400 * 24 };
    this.classes.tool = {};
    this.classes.background = {};
    this.classes.progress = {};
    this.classes.dashes_scale = {};
    this.classes.marker = {};

    this.styles.tool = {};
    this.styles.background = {};
    this.styles.progress = {};
    this.styles.dashes_scale = {};
    this.styles.marker = {};

    this.svg.cx = this.svg.width / 2;
    this.svg.cy = this.svg.height / 2;

    this.configureBackground();
    // Configure possible path types
    this.configurePathTypeRectangle();
    this.configurePathTypeCircle();
    this.configurePathTypeLine();
    this.configurePathTypeUser();

    // Initialize list of available markers
    this.configureMarkerList();

    // Configure scale. Only for circle and line types
    // Scale for rectangle does not seem to work. So disabled
    this.configureScale();

    this.ticking = false;

    this.length = 100;
    this.scaleLength = 100;
    this.myValue = 50;

    this.haveElements = false;
    this.elements = {};
    this.colorstops = {};
    this.colorstops.colors = [];
    this.colorstops.colors = computeThresholds(
      this.config.progpath.colorstops.colors,
      'smooth',
    );
    this.spiral = [];
  }

  configureScale() {
    this.scale = {};
    if (['circle', 'line'].includes(this.config.progpath.show.path_type)) {
      if (this.config.progpath.show.scale !== 'none') {
        if ((this.config.progpath.show.scale === 'colorstops') && (this.config.progpath.colorstops)) {
          this.scale.gap = Utils.calculateSvgDimension(this.config.progpath.colorstops.gap || 0);
        } else this.scale.gap = 0;
        if (this.config.progpath.show.path_type === 'circle') {
          this.scale = { ...this.scale, ...this.circle };
          this.scale.radiusX += Utils.calculateSvgDimension(this.config.progpath.scale.offset);
          this.scale.radiusY += Utils.calculateSvgDimension(this.config.progpath.scale.offset);

          this.scale.gap *= this.scale.radiusX / this.circle.radiusX;

          // Configuration has been translated from the circle. Now get scale
          this.svg.scalePath = this._computeCirclePath(this.scale);
        }
        if (this.config.progpath.show.path_type === 'line') {
          this.scale = { ...this.scale, ...this.line };
          this.scale.cy -= Utils.calculateSvgDimension(this.config.progpath.scale.offset);
          this.svg.scalePath = this._computeLinePath(this.scale);
        }
      }
    }
  }

  configureBackground() {
    this.styles.background['stroke-width'] = this.svg.background.width;
    // eslint-disable-next-line dot-notation
    this.styles.background['stroke'] = 'var(--theme-sys-elevation-surface-neutral3)';
    // eslint-disable-next-line dot-notation
    this.styles.background['fill'] = 'none';
    console.log('configureBackground', this.styles.background, this.classes.background);
  }

  configurePathTypeRectangle() {
    if (this.config.progpath.show.path_type === 'rectangle') {
      this.rectangle = {};
      this.rectangle.start = {};
      this.rectangle.start.position = Utils.calculateSvgDimension(this.config.progpath.rectangle.start?.position) / 1 || 0;
      this.rectangle.stop = {};
      this.rectangle.stop.position = Utils.calculateSvgDimension(this.config.progpath.rectangle.stop?.position) / 1 || 0;
      this.rectangle.radius = {};
      this.rectangle.radius.tl = Utils.calculateSvgDimension(this.config.progpath.rectangle.radius?.tl || 0) / 1;
      this.rectangle.radius.tr = Utils.calculateSvgDimension(this.config.progpath.rectangle.radius?.tr || 0) / 1;
      this.rectangle.radius.bl = Utils.calculateSvgDimension(this.config.progpath.rectangle.radius?.bl || 0) / 1;
      this.rectangle.radius.br = Utils.calculateSvgDimension(this.config.progpath.rectangle.radius?.br || 0) / 1;

      // Configuration has been translated. Now compute the rectangle path from that configuration
      this.svg.path = this._computeRectanglePath(
        this.svg.width,
        this.svg.height,
        this.rectangle.radius.tl,
        this.rectangle.radius.tr,
        this.rectangle.radius.br,
        this.rectangle.radius.bl);
    }
    this.track = { ...this.rectangle };
  }

  configurePathTypeCircle() {
    if (this.config.progpath.show.path_type === 'circle') {
      this.circle = {};
      // this.circle.radius = {};
      this.svg.cx = this.svg.width / 2;
      this.svg.cy = this.svg.height / 2;
      this.circle.radiusX = this.svg.width / 2;
      this.circle.radiusY = this.svg.height / 2;
      this.circle.isCW = this.config.progpath.circle.direction === 'cw';
      this.circle.direction = this.config.progpath.circle.direction;
      this.circle.startAngle = this.config.progpath.circle.start_angle;
      this.circle.stopAngle = this.config.progpath.circle.stop_angle;

      this.direction = this.config.progpath.circle.direction;

      this.track = { ...this.circle };

      // Configuration has been translated. Now compute the rectangle path from that configuration
      this.svg.path = this._computeCirclePath(this.circle);
    }
  }

  configurePathTypeUser() {
    if (this.config.progpath.show.path_type === 'user') {
      this.user = {};

      // Configuration has been translated. Now compute the cirle/oval path from that configuration
      this.svg.path = this._computeUserPath();
    }
  }

  configurePathTypeLine() {
    if (this.config.progpath.show.path_type === 'line') {
      this.line = {};
      this.line.cx = this.svg.width / 2;
      this.line.cy = this.svg.height / 2;
      this.line.x = Utils.calculateSvgDimension(this.config.progpath.line.margin.left);
      this.line.width = this.svg.width - Utils.calculateSvgDimension(
        this.config.progpath.line.margin.left + this.config.progpath.line.margin.right);
      this.track = { ...this.line };

      // Configuration has been translated. Now compute the lineair path from that configuration
      this.svg.path = this._computeLinePath(this.line);
    }
  }

  configurePathTypeBar() {
    if (this.config.progpath.show.path_type === 'bar') {
      this.bar = {};
      this.track = { ...this.bar };

      // Configuration has been translated. Now compute the lineair path from that configuration
      this.svg.path = this._computeBarPath(this.config.progpath.bar);
    }
  }

  configureMarkerList() {
    this.markerConfigurations = new Map();
    this.markerConfigurations
      .set('drag-vertical', {
        viewBox: {
          x: 12, y: 12, width: 24, height: 24,
        },
        path: 'M11 21H9V3H11V21M15 3H13V21H15V3Z',
      })
      .set('pan-vertical', {
        viewBox: {
          x: 12, y: 12, width: 24, height: 24,
        },
        path: 'M12,2.5L8,7H16L12,2.5M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M8,17L12,21.5L16,17H8Z',
      })
      .set('dots-vertical', {
        viewBox: {
          x: 12, y: 12, width: 24, height: 24,
        },
        path: 'M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,'
              + '12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z',
      })
      .set('circle', {
        viewBox: {
          x: 12, y: 12, width: 24, height: 24,
        },
        path: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
      })
      .set('chevron-up', {
        viewBox: {
          x: 12, y: 0, width: 24, height: 24,
        },
        path: 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z',
      })
      .set('menu-up', {
        viewBox: {
          x: 12, y: 0, width: 24, height: 24,
        },
        path: 'M7,15L12,10L17,15H7Z',
      })
      .set('arrow-up-bold-outline', {
        viewBox: {
          x: 12, y: 0, width: 24, height: 24,
        },
        path: 'M16,13V21H8V13H2L12,3L22,13H16M7,11H10V19H14V11H17L12,6L7,11Z',
      })
      .set('sak-clock-hand-simple', {
        viewBox: {
          x: 12, y: 19, width: 24, height: 24,
        },
        path: 'M13.388,15.288c1.498,0.57 2.564,2.02 2.564,3.718c0,2.194 -1.782,3.976 -3.976,3.976c-2.194,-0 -3.976,'
        + '-1.782 -3.976,-3.976c0,-1.698 1.066,-3.148 2.564,-3.718l-0,-12.901c-0,-0.78 0.633,-1.413 1.412,-1.413c0.78,0 1.412,0.633 1.412,1.413l0,12.901Z',
      })
      .set('sak-clock-hand-ring', {
        viewBox: {
          x: 12, y: 20, width: 24, height: 24,
        },
        path: 'M13.04,16.665c1.412,0.45 2.436,1.774 2.436,3.335c0,1.932 -1.568,3.5 -3.5,3.5c-1.932,-0 -3.5,-1.568 -3.5,'
        + '-3.5c0,-1.575 1.043,-2.909 2.475,-3.347l0,-14.609c0,-0.576 0.468,-1.044 1.044,-1.044c0.577,0 1.045,0.468 1.045,'
        + '1.044l-0,14.621Zm-1.064,1.574c-0.972,0 -1.76,0.789 -1.76,1.761c-0,0.972 0.788,1.761 1.76,1.761c0.972,-0 1.761,-0.789 1.761,-1.761c-0,-0.972 -0.789,-1.761 -1.761,-1.761Z',
      })
      .set('sak-clock-hand-ring-small', {
        viewBox: {
          x: 12, y: 20, width: 24, height: 24,
        },
        path: 'M12.495,17.045c1.409,0.246 2.481,1.476 2.481,2.955c0,1.656 -1.344,3 -3,3c-1.656,0 -3,-1.344 -3,-3c0,-1.492 1.092,'
        + '-2.731 2.519,-2.962l0,-15.538c0,-0.276 0.224,-0.5 0.5,-0.5c0.276,0 0.5,0.224 0.5,0.5l0,15.545Zm-0.519,1.446c-0.833,'
        + '-0 -1.509,0.676 -1.509,1.509c0,0.833 0.676,1.509 1.509,1.509c0.833,0 1.509,-0.676 1.509,-1.509c0,-0.833 -0.676,-1.509 -1.509,-1.509Z',
      })
      .set('navigation', {
        viewBox: {
          x: 12, y: 0, width: 24, height: 24,
        },
        path: 'M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z',
      });
  }

 /* *****************************************************************************
  * ProgressPath::value()
  *
  * Summary.
  * Receive new state data for the entity this circle is linked to. Called from set hass;
  *
  */
  set value(state) {
    super.value = state;
  }

  computeColor(inState, i) {
    const { line_color } = this.config.progpath;
    // const { colorstops } = this.colorstops;
    const colorstops = { ...this.colorstops };
    const state = Number(inState) || 0;
    if (colorstops.colors.length === 0) return line_color[i] || line_color[0];
    const threshold = {
      color: line_color[i] || line_color[0],
      ...colorstops.colors.slice(-1)[0],
      ...colorstops.colors.find((ele) => ele.value < state),
    };
    return this._card.config.entities[i].color || threshold.color;
  }

  intColor(inState, i) {
    const { line_color } = this.config.progpath;
    // const { colorstops } = this.colorstops;
    const colorstops = { ...this.colorstops };
    const state = Number(inState) || 0;

    let intColor;
    if (colorstops.colors.length > 0) {
      // HACK. Keep check for 'bar' !!!
      if (this.config.progpath.show?.chart_type === 'bar') {
        const { color } = colorstops.colors.find((ele) => ele.value < state)
          || colorstops.colors.slice(-1)[0];
        intColor = color;
      } else {
        const index = colorstops.colors.findIndex((ele) => ele.value < state);
        const c1 = colorstops.colors[index];
        const c2 = colorstops.colors[index - 1];
        if (c2) {
          const factor = (c2.value - inState) / (c2.value - c1.value);
          intColor = Colors.getGradientValue(c2.color, c1.color, factor);
        } else {
          intColor = index
            ? colorstops.colors[colorstops.colors.length - 1].color
            : colorstops.colors[0].color;
        }
      }
    }

    return this._card.config.entities[i].color || intColor || line_color[i] || line_color[0];
  }

 /* *****************************************************************************
  * ProgressPath::getPerpendicularAngleAtLength()
  *
  * Summary.
  * Get perpendicular angle and point at given length.
  * Two lengths are passed to make the calculation.
  *
  * Note:
  * for clockwise, the arc betwen percentage and percentagePlus is calculated.
  * If counterclockwise, the arc between percentagePlus and percentage should be
  * calculated. Should the caller do that, or this function?
  *
  * Flip should be used to position the pointer at inside/outside of progress path.
  * However, that does not work for circle: the pointer is simply 180 degress into
  * the wrong direction...
  * If flip is reversed, than everything works for ccw circles...
  */

  getPerpendicularAngleAtLength(percentage, percentagePlus, direction = 'cw', flip = false) {
    const { x, y } = this.elements.path.getPointAtLength(percentage);
    const { x: x2, y: y2 } = this.elements.path.getPointAtLength(percentagePlus);
    const angle = Math.atan2(y - y2, x - x2);
    return {
      x,
      y,
      x2,
      y2,
      angle: (direction === 'cw' ? 0 : 180) + (flip ? 0 : 180) + ((angle) * 180 / Math.PI),
    };
  }

  renderAnimateProgress(timestamp) {
    // eslint-disable-next-line no-plusplus
    const easeOut = (progress) => --progress ** 5 + 1;
    const easeOutElastic = (x) => {
      let a;
        return x === 0
      ? 0
      : x === 1
      ? 1
      : 2 ** (-10 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
      };

    // console.log('renderAnimateProgress IN/OUT');
    this.progressPctPrev = this.progressPct || 0;
    this.progressPct = this.myValue / 100;
    this.progressDiff = this.progressPct - this.progressPctPrev;
    // console.log('renderAnimateProgress progress', this.myValue, this.progressPctPrev, this.progressPct, this.progressDiff);

    const duration = 5000;
    let start;
    const { show } = this.config.progpath;

    let startTime;
    let prevColor;
    const animationDuration = 5000;

    const animateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = easeOut(Math.min(1, (timestamp - startTime) / animationDuration));

      const valueRange = this.myValue - this.myValuePrev;
      let curValue = this.myValuePrev + (progress * valueRange);

      const stateRange = Number(this._stateValue) - Number(this._stateValuePrev);
      const curState = Number(this._stateValuePrev) + (progress * stateRange);

      const ppa = this.getPerpendicularAngleAtLength((100 - curValue) / 100 * (this.length),
        (100 - curValue) / 100 * (this.length + 1), this.direction, this.flip);
      if ((show?.marker) && (show.marker !== 'none')) {
        if (this.config.progpath.marker.attach_to === 'center') {
          this.elements.marker.setAttribute('transform', `translate(${this.svg.cx} ${this.svg.cy}) rotate(${ppa.angle})`);
        } else {
          this.elements.marker.setAttribute('transform', `translate(${ppa.x} ${ppa.y}) rotate(${ppa.angle})`);
        }
        if (this.config.progpath.marker.color.animate !== 'none') {
          const color = this.config.progpath.marker.color.smooth
                          ? this.intColor(curState, 0)
                          : this.computeColor(curState, 0);
          if (color !== prevColor) {
            if (color) {
              if (['both', 'interior'].includes(this.config.progpath.marker.color.animate)) {
                this.elements.markerPath.style.fill = color;
                this.styles.marker.fill = color;
              }
              if (['both', 'outline'].includes(this.config.progpath.marker.color.animate)) {
                this.elements.markerPath.style.stroke = color;
                this.styles.marker.stroke = color;
              }
            } else {
              console.log('illegal color', color);
            }
          }
          prevColor = color;
        }
      }
      if ((show?.progress) && (show.progress === true)) {
        this.elements.progress.setAttribute('stroke-dashoffset', (curValue));
        const color = this.config.progpath.progress.color.smooth
                        ? this.intColor(curState, 0)
                        : this.computeColor(curState, 0);
        if (color !== prevColor) {
          this.elements.progress.style.stroke = color;
          this.styles.progress.stroke = color;
        } else if (!color) {
          console.log('illegal color', color);
        }
        prevColor = color;
      }
      if ((show?.mask) && (show.mask === true))
      this.elements.maskPath.setAttribute('stroke-dasharray', `${100 - curValue} 100`);

      if (progress < 1) {
        window.requestAnimationFrame(animateProgress);
      } else {
        startTime = null;
        prevColor = null;
      }
    };

    window.requestAnimationFrame(animateProgress);
  }

  firstUpdated(changedProperties) {
    const myWindow = this._card.shadowRoot;
    this.haveElements = true;

    this.elements.path = myWindow.getElementById('motion-path');
    this.length = this.elements.path.getTotalLength();
    this.elements.scale = myWindow.getElementById('scale-path');
    this.scaleLength = this.elements.scale.getTotalLength();

    if (['rectangle', 'line', 'circle'].includes(this.config.progpath.show.path_type)) {
      this.elements.marker = myWindow.getElementById('marker');
      this.elements.markerPath = myWindow.getElementById('markerPath');
      this.elements.progress = myWindow.getElementById('progress-path');
      this.elements.progressMask = myWindow.getElementById('progress-maskpath');
      this.elements.maskPath = myWindow.getElementById('88maskPath');
      this.elements.pathGroup = myWindow.getElementById('path-group');
      this.renderAnimateProgress(Date.now());
      this._card.requestUpdate();
    }
  }

 /* *****************************************************************************
  * ProgressPath::renderMarkerSvg()
  *
  * Summary.
  * Get marker drawable. Maybe user can also supply drawable...
  *
  */
  renderMarkerSvg() {
    // Need some variables for:
    // - type of marker
    // - size of marker
    // - shift of marker (should add to height of svg to make that happen...)
    //   can only shift downward!!! Not upward!!
    //   YUP. can do. Change value of y of viewBox to some position. Then you can
    //   shift up and down the svg... no need to change the height!!
    //   Anything outside the center (12, 12 for standard 24x24 icon) will shift:
    //   - larger value will shift outward, smaller value inward...
    const viewBoxY = this.svg.marker.offset;
    const color = this.intColor(this._stateValue, 0);
    let markerConfig = this.markerConfigurations.get(this.config.progpath.show.marker);
    let marker;

    if (markerConfig) {
      marker = svg`
        <g id=marker class="sak-marker__marker--${this.config.progpath.show.marker}">
          <svg viewBox="${markerConfig.viewBox.x} ${markerConfig.viewBox.y + viewBoxY} ${markerConfig.viewBox.width} ${markerConfig.viewBox.height}" overflow="visible"
            height="${this.config.progpath.marker.size}em" width="${this.config.progpath.marker.size}em"
          >
            <path id=markerPath d="${markerConfig.path}"
            style="${styleMap(this.styles.marker)}"
            >
            </path>
          </svg>      
        </g>
        `;
      return marker;
    } else return svg``;
  }

  _computeBarPath() {

  }

  polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radiusX * Math.cos(angleInRadians)),
      y: centerY + (radiusY * Math.sin(angleInRadians)),
    };
  }

  // If width = 0, then single path! Otherwise double path
  computeArcPath(argStartAngle, argEndAngle, argClockwise, argRadiusX, argRadiusY, argWidth) {
    const start = this.polarToCartesian(this.svg.cx, this.svg.cy, argRadiusX, argRadiusY, argStartAngle);
    const end = this.polarToCartesian(this.svg.cx, this.svg.cy, argRadiusX, argRadiusY, argEndAngle);
    const largeArcFlag = argClockwise
                          ? Math.abs(argStartAngle - argEndAngle) <= 180 ? '0' : '1'
                          : Math.abs(argEndAngle - argStartAngle) > 180 ? '0' : '1';

    const sweepFlag = argClockwise ? '1' : '0';
    let d;
    if (argWidth !== 0) {
      const cutoutRadiusX = argRadiusX - argWidth;
      const cutoutRadiusY = argRadiusY - argWidth;
      const start2 = this.polarToCartesian(this.svg.cx, this.svg.cy, cutoutRadiusX, cutoutRadiusY, argEndAngle);
      const end2 = this.polarToCartesian(this.svg.cx, this.svg.cy, cutoutRadiusX, cutoutRadiusY, argStartAngle);

      d = [
        'M', start.x, start.y,
        'A', argRadiusX, argRadiusY, 0, largeArcFlag, sweepFlag, end.x, end.y,
        'L', end2.x, end2.y,
        'A', cutoutRadiusX, cutoutRadiusY, 0, largeArcFlag, sweepFlag === '0' ? '1' : '0', start2.x, start2.y,
        'Z',
      ].join(' ');
    } else {
      d = [
        'M', start.x, start.y,
        'A', argRadiusX, argRadiusY, 0, largeArcFlag, sweepFlag, end.x, end.y,
      ].join(' ');
    }
    return d;
  }

  _computeCirclePath(circle) {
    return (this.computeArcPath(circle.startAngle, circle.stopAngle, circle.isCW,
                                circle.radiusX, circle.radiusY, 0));
  }

  _computeLinePath(line) {
    return (`M${line.x},${line.cy} h${line.width}`);
  }

  _computeUserPath() {

  }

  _computeRectanglePath = (width, height, tl, tr, br, bl) => {
    let top;
    let right;
    let bottom;
    let bottom2;
    let left;
    let d;
    const startSide = this.config.progpath.rectangle.start.side;
    const stopSide = this.config.progpath.rectangle.stop.side;

    const sameSide = (startSide === stopSide)
        && (this.rectangle.start.position > this.rectangle.stop.position);
    // const startPos = sameSide ? this.rectangle.stop.position : this.rectangle.start.position;
    // const startPos = this.rectangle.start.position;
    // console.log('compute, same, start', sameSide, startPos, startSide, stopSide);

    switch (startSide) {
      case 'top':
        d = `M${this.svg.width / 2 + this.rectangle.start.position}, ${this.svg.height / 2 - height / 2}`;
        break;
      case 'right':
        d = `M${this.svg.width / 2 + width / 2}, ${this.svg.height / 2 + this.rectangle.start.position}`;
        break;
      case 'bottom':
        d = `M${this.svg.width / 2 + this.rectangle.start.position}, ${this.svg.height / 2 + height / 2}`;
        break;
      case 'left':
        d = `M${this.svg.width / 2 - width / 2}, ${this.svg.height / 2 - this.rectangle.start.position}`;
        break;
      default:
        break;
    }
    // switch (startSide) {
    //   case 'top':
    //     d = `M${this.svg.width / 2 + startPos}, ${this.svg.height / 2 - height / 2}`;
    //     break;
    //   case 'right':
    //     d = `M${this.svg.width / 2 + width / 2}, ${this.svg.height / 2 + startPos}`;
    //     break;
    //   case 'bottom':
    //     d = `M${this.svg.width / 2 + startPos}, ${this.svg.height / 2 + height / 2}`;
    //     break;
    //   case 'left':
    //     d = `M${this.svg.width / 2 - width / 2}, ${this.svg.height / 2 - startPos}`;
    //     break;
    //   default:
    //     break;
    // }

    // If start.position smaller than stop.position on SAME side, then only
    // use that side. So a kind of small rectangle, just one side...
    // set stop side to 'same', so table can use this!
    const sidesToDo = [];
    sidesToDo.top = [];
    sidesToDo.top.right = 'tr';
    sidesToDo.top.bottom = 'trb';
    sidesToDo.top.left = 'trbl';
    // sidesToDo.top.top = sameSide ? 't' : 'trblt';
    sidesToDo.top.top = 'trblt';
    sidesToDo.right = [];
    sidesToDo.right.bottom = 'rb';
    sidesToDo.right.left = 'rbl';
    sidesToDo.right.top = 'rblt';
    // sidesToDo.right.right = sameSide ? 'r' : 'rbltr';
    sidesToDo.right.right = 'rbltr';

    sidesToDo.bottom = [];
    sidesToDo.bottom.left = 'bl';
    sidesToDo.bottom.top = 'blt';
    sidesToDo.bottom.right = 'bltr';
    // sidesToDo.bottom.bottom = sameSide ? 'b' : 'bltrb';
    sidesToDo.bottom.bottom = 'bltrb';

    sidesToDo.left = [];
    sidesToDo.left.top = 'lt';
    sidesToDo.left.right = 'ltr';
    sidesToDo.left.bottom = 'ltrb';
    // sidesToDo.left.left = sameSide ? 'l' : 'ltrbl';
    sidesToDo.left.left = 'ltrbl';

    let sideCount = sidesToDo[startSide][stopSide].length;
    for (let i = 0; i < sideCount; i++) {
      let currentSide = sidesToDo[startSide][stopSide][i];
      switch (currentSide) {
        case 't':
          // if (sideCount === 1) {
          //   top = this.rectangle.stop.position - this.rectangle.start.position;
          //   d += `
          //     h${top}
          //     `;
          // } else
          if (i === sideCount - 1) {
            top = width / 2 + this.rectangle.stop.position - tl;
            d += `
              h${top}
              `;
          } else {
            top = i === 0
                   ? width / 2 - this.rectangle.start.position - tr
                   : width - tl - tr;
            d += `
              h${top}
              a${tr},${tr} 0 0 1 ${tr},${tr}
            `;
          }
          break;
        case 'r':
          // if (sideCount === 1) {
          //   right = this.rectangle.stop.position - this.rectangle.start.position;
          //   d += `
          //     h${right}
          //     `;
          // } else
          if (i === sideCount - 1) {
            right = height / 2 - this.rectangle.stop.position - tr;
            d += `
              v${right}
              `;
          } else {
            right = i === 0
                      ? height / 2 - this.rectangle.start.position - br
                      : height - tr - br;
            d += `
              v${right}
              a${br},${br} 0 0 1 -${br},${br}
            `;
          }
          break;
        case 'b':
          // if (sideCount === 1) {
          //   bottom = this.rectangle.stop.position - this.rectangle.start.position;
          //   d += `
          //     h${bottom}
          //     `;
          // } else
          if (i === sideCount - 1) {
            bottom = width / 2 - this.rectangle.stop.position - br;
            d += `
              h-${bottom}
              `;
          } else {
            bottom = i === 0
                      ? width / 2 + this.rectangle.start.position - bl
                      : width - bl - br;
            d += `
              h-${bottom}
              a${bl},${bl} 0 0 1 -${bl},-${bl}
            `;
          }
          break;
        case 'l':
          // if (sideCount === 1) {
          //   left = this.rectangle.stop.position - this.rectangle.start.position;
          //   d += `
          //     h${left}
          //     `;
          // } else
          if (i === sideCount - 1) {
            left = height / 2 + this.rectangle.stop.position - bl;
            d += `
              v-${left}
              `;
          } else {
            left = i === 0
                    ? height / 2 - this.rectangle.start.position - tl
                    : height - bl - tl;
            d += `
              v-${left}
              a${tl},${tl} 0 0 1 ${tl},-${tl}
            `;
          }
          break;
        default:
          break;
      }
    }
    return d;
  };

  renderBackgroundPath() {
    if (!this.haveElements) return;
    if (this.config.progpath.show.background === true) {
      return svg`
        <!-- BackgroundPath Render -->
        <path id="background-path" d="${this.svg.path}"
          stroke-width="${this.svg.background.width}"
          style="${styleMap(this.styles.background)}"
        />
      `;
    } else return svg``;
  }

  calculateSpiral(number) {
    let j = 0;
    const widthVariation = 100;
    const heightVariation = 300;
    this.spiral = [{}];

    // Default is 180. Is a half turn 12.5 ?? So approx 190 in this case?
    for (let it = 12; it < 190; it++) {
      this.spiral[it] = {};
      this.spiral[it].x = (1 * 200) + 120 + widthVariation * Math.cos((5) * it * 0.02827);
      this.spiral[it].y = 320 + heightVariation * Math.sin((1 + number) * it * 0.02827);
      this.spiral[it].r = Math.max(5, Math.min(50, it * 0.1));
    }
  }

  // Nice spiral stuff
  // Usefull ??? No idea ;-)
  // short spirals and/or nice ones:
  // - 3333
  // - 4444
  // - 6667
  // - 8889
  //
  // Note:
  // This spiral causes a battery drain on iPhone and iPad (1% / minute).
  // It does not depend on color changes. It seems the many overlapping elements
  // are the culprit for the Safari SVG engine, as even with a static color, the
  // battery drain (and backside of iPhone getting warm) is there!
  renderSpiral() {
    // return svg``;
    if (this.spiral.length === 0) this.calculateSpiral(4444);
    // return svg``;
    let svgCircles = [];
    let j = 0;
    const widthVariation = 100;
    const heightVariation = 300;
    const start = 0;
    const list = [3333, 4444, 6667, 8889];

    for (let it = 12; it < 190; it++) {
      let circle = this.spiral[it];
      let svgCircle = svg`
        <circle cx=${circle.x} cy=${circle.y} r=${circle.r}
          fill="green"
          stroke-width="0"
          />`;
      svgCircles.push(svgCircle);
    }

    // fill="rgb(0, ${it * 1.4}, 0)"
    // style="transition:fill 5s ease;"

    return svg`
      <svg x="10px" y="10px" overflow="visible" viewBox="550 150 640 240"
        width="${this.svg.width / 1.5}" height="${240 / 640 * this.svg.width}" >
        ${svgCircles};
      </svg>
      `;
  }

 /* *****************************************************************************
  * ProgressPath::_renderProgressPath()
  *
  * Summary.
  *
  */

  _renderProgressPath() {
    if (['line', 'rectangle', 'circle'].includes(this.config.progpath.show.path_type)) {
      // this.svg.path = 'M736.08,389.48C690.17,577.19,508.06,702.61,313,674,147.31,649.7,32.7,495.69,57,330,76.44,197.45,199.65,105.76,332.2,125.2c106,15.55,179.39,114.12,163.84,220.16A155.25,155.25,0,0,1,319.91,476.43a124.2,124.2,0,0,1-104.86-140.9,99.37,99.37,0,0,1,112.73-83.89,79.49,79.49,0,0,1,67.11,90.18,63.6,63.6,0,0,1-72.15,53.69A50.88,50.88,0,0,1,282,361.56';

      return svg`
      <svg width="${this.svg.width}" height="${this.svg.height}" overflow="visible"
        x="${this.svg.x}" y="${this.svg.y}" viewbox="0 0 ${this.svg.width} ${this.svg.height}"
        >
        <defs>
          <style>
          #motion-path {
            fill: none;
            stroke: var(--theme-sys-elevation-surface-neutral9);
            stroke-width: 0em;
            stroke-dasharray: 4 20;
          }
          #dashes-path {
            fill: none;
            stroke: var(--theme-sys-elevation-surface-neutral9);
            stroke-width: 6em;
            stroke-dasharray: 4 20;
            stroke-dashoffset: 4;
          }
          #dashes-path2 {
            fill: none;
            stroke: var(--theme-sys-elevation-surface-neutral9);
            stroke-width: 6em;
            stroke-dasharray: 20 4;
            stroke-dashoffset: 10;
          }
          
          #markerr pathh {
            fill: var(--primary-text-color);
            stroke: var(--primary-background-color);
            paint-order: stroke;
            stroke-width: 0.6em;
          }
          </style>
          <!-- Progress Mask Render -->
          <defs>
            <marker id="roundClip2" viewBox="-1 -1 2 2" markerWidth="1" orient="auto">
              <circle r="1" fill="white" stroke-width="0"/>
            </marker>
          <marker id="roundClippp" viewBox="-00 -00 100 100" markerWidth="1"
            orient="auto" refX="50" refY="50">
            <path d="M0,50 a50,50 0 0,1 0,100" fill="white"/>
          </marker>
          <marker
            id="arrowClippp"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="3"
            markerHeight="2"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 5 z" fill="gray" />
          </marker>           
          </defs>
          <mask id="progress-maskpath" maskUnits="userSpaceOnUse"
                marker-start="url(#arrowClip)"
                marker-end="url(#arrowClip)" >
            <path id="88maskPath" d="${this.svg.path}" pathLength="100"
              stroke-dasharray="100 100"
              stroke-dashoffset="0"
              stroke-width="10em"
              stroke="white"
              fill="black" <!-- "#666" -->
              paint-order="stroke"
            />
          </mask>
        </defs>

        <path id="motion-path" d="${this.svg.path}" pathLength="100"/>
        <path id="scale-path" d="${this.svg.scalePath}" fill="none"/>
        ${this.renderBackgroundPath()}
        ${this.renderScale()}
        ${this.renderTrack()}
        ${this.renderProgressPath()}
        <!--  <use id=target href="#pacman8"/> -->
        ${this.renderMarkerSvg()}
        ${this.renderAnimateProgress()}
      </svg>
      `;
    }
  }

  renderProgressPath() {
    if (this.config.progpath.show.progress) {
      // Make sure that dasharray settings are what we need: overwrite them
      // Do NOT set the dashoffset, as it overwrites the animation setting!
      this.styles.progress['stroke-dasharray'] = '100 100';
      this.styles.progress['stroke-width'] = `${this.config.progpath.progress.width}em`;

      return svg`
        <!-- ProgressPath Render -->
        <defs>
          <marker id="round2" viewBox="-1 -1 2 2" markerWidth="1" orient="auto">
              <circle r="1" fill="var(--theme-sys-color-primary)"/>
          </marker>
          <marker id="rounddd" viewBox="-00 -00 100 100" markerWidth="1" orient="0" refX="50" refY="50">
          <path d="M0,50 a1,1 1 0,0 100,0"/>
          </marker>
          <!-- A marker to be used as an arrowhead -->
          <marker
            id="arrowww"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="3"
            markerHeight="2"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 5 z" />
          </marker>          
        </defs>
        <path id="progress-path" d="${this.svg.path}" pathLength="100"
          class="${classMap(this.classes.progress)}" style="${styleMap(this.styles.progress)}"
          marker-start="url(#arrow)" marker-end="url(#arrow)"
        />
      `;
    } else return svg``;
  }

  // #TODO:
  // Check for same parts for renderTrack...

  renderScale() {
    if (!this.haveElements) return;

    if ((this.config.progpath.show.scale === 'colorstops') && (this.config.progpath.colorstops)) {
      const gap = this.scale.gap;
      let scale = { ...this.config.progpath.colorstops.scales.default };
      scale.range = scale.max - scale.min;
      let scaleParts = [...this.config.progpath.colorstops.colors];
      let min = scaleParts.findIndex((part) => scale.min < part.value);
      let max = scaleParts.findIndex((part) => part.value >= scale.max);

      console.log('renderScale, gaps', gap, this.scale);
      if (min !== -1) {
        // Should remove entries below
        let removedParts = scaleParts.splice(0, min - 1);
        scaleParts[0].value = scale.min;
      }
      if (max === -1) {
        // Add myself to end of list
        scaleParts[scaleParts.length] = { value: scale.max };
      } else {
        let removedParts = scaleParts.splice(max, scaleParts.length - max);
        scaleParts[scaleParts.length] = {
          value: scale.max,
          color: removedParts[0].color,
        };
      }
      scaleParts.forEach((value, index, array) => value.range = index < array.length - 1 ? array[index + 1].value - value.value : 0);

      let value = scaleParts[0];
      let scaleWidth = Utils.calculateSvgDimension(this.config.progpath.scale.width);
      let maskGap = (scaleWidth * 0.25 + gap / 2);
      maskGap = scaleWidth / 1;
      // Was gap * 2.75 or whatever
      let maskBegin = svg`
          <defs>
          <clipPath id="cut-off-bottom">
            <rect x="0" y="0" width="100" height="50" />
          </clipPath>
          <clipPath id="half5">
            <rect x="-0.1" y="-1" width="1.1" height="2" />
          </clipPath>
          <marker id="half-circle" viewbox="0 0 100 100" markerWidth="1"
            orient="auto-start-reverse" refX="50"refY="50"
            <circle cx="50" cy="50" r="50" fill="white" clip-path="url(#cut-off-bottom)" />
          </marker>
          <marker id="round5" viewBox="-1 -1 2 2" markerWidth="1" orient="auto-start-reverse">
              <circle r="1" fill="white" clip-path="url(#half5)"/>
          </marker>
          <marker id="cccircle" viewbox="0 0 100 100" markerWidth="50"
            orient="auto" refX="50"refY="50"
            <circle cx="50" cy="50" r="100" fill="white"/>
          </marker>
          <marker id="roundMask" viewBox="-00 -00 100 100" markerWidth="1"
            orient="auto-start-reverse" refX="50" refY="50">
            <path d="M 0 100 A 50 50 0 0 0 100 0" fill="white"/>
          </marker>
          <mask id="myclip" maskUnits="userSpaceOnUse">
            <path id="99maskPath" d="${this.svg.scalePath}"
            stroke-dasharray="${((value.range / scale.range * this.scaleLength))} ${this.scaleLength}"
            stroke-dashoffset="-${(value.value - scale.min) / scale.range * this.scaleLength}"
            fill="black" stroke="white"
            stroke-width="${this.config.progpath.scale.width}em"
            stroke-linecap="none"
            marker-start="url(#round5)"
          />
          </mask>
          </defs>
          `;
      value = scaleParts[scaleParts.length - 2];
      scaleWidth = Utils.calculateSvgDimension(this.config.progpath.scale.width);
      maskGap = (scaleWidth * 0.25 + gap / 2);
      maskGap = scaleWidth / 1;
      // Was gap * 2.75 or whatever
      let maskEnd = svg`
          <defs>
          <clipPath id="cut-off-bottom">
            <rect x="0" y="0" width="100" height="50" />
          </clipPath>
          <clipPath id="half5">
            <rect x="-0.1" y="-1" width="1.1" height="2" />
          </clipPath>
          <marker id="half-circle" viewbox="0 0 100 100" markerWidth="1"
            orient="auto-start-reverse" refX="50"refY="50"
            <circle cx="50" cy="50" r="50" fill="white" clip-path="url(#cut-off-bottom)" />
          </marker>
          <marker id="round5" viewBox="-1 -1 2 2" markerWidth="1" orient="auto-start-reverse">
              <circle r="1" fill="white" clip-path="url(#half5)"/>
          </marker>
          <marker id="cccircle" viewbox="0 0 100 100" markerWidth="50"
            orient="auto" refX="50"refY="50"
            <circle cx="50" cy="50" r="100" fill="white"/>
          </marker>
          <marker id="roundMask" viewBox="-00 -00 100 100" markerWidth="1"
            orient="auto-start-reverse" refX="50" refY="50">
            <path d="M 0 100 A 50 50 0 0 0 100 0" fill="white"/>
          </marker>
          </mask>
          <mask id="mycliplast" maskUnits="userSpaceOnUse">
            <path id="99maskPath" d="${this.svg.scalePath}"
            stroke-dasharray="${((value.range / scale.range * this.scaleLength))} ${this.scaleLength}"
            stroke-dashoffset="-${(value.value - scale.min) / scale.range * this.scaleLength + (gap / 2)}"
            fill="black" stroke="white"
            stroke-width="${this.config.progpath.scale.width}em"
            stroke-linecap="none"
            marker-end="url(#round5)"
          />
          </defs>
          `;
      let paths = scaleParts.map((value, index, array) => {
        const fake = 1;
        const firstOrLast = ((index === 0) || (index === array.length - 1) || (array[Math.min(array.length - 1, index + 1)].range === 0));
        console.log('scaleParts mapping', value, index);
        if (value.range === 0) return svg``;
        return svg`
          <!-- Scale Part Render -->
          <path d="${this.svg.scalePath}"
          stroke-dasharray="${value.range / scale.range * this.scaleLength - (index === 0 ? 0 : gap / 2)} ${this.scaleLength}"
          stroke-dashoffset="-${(value.value - scale.min) / scale.range * this.scaleLength + ((index === 0 ? 0 : gap / 2))}"
          fill="none" stroke="${value.color}"
          stroke-width="${this.config.progpath.scale.width}em"
          stroke-linecap="${firstOrLast ? 'round' : 'none'}"
          marker-start="${index === 0 ? 'url(#rrroundd)' : 'none'}"
          mask="${index === 0 ? 'url(#myclip)' : firstOrLast ? 'url(#mycliplast)' : 'none'}"
          />          
        `;
      });
      // console.log('renderTrack', scale, trackParts, min, max, paths);
      let width = Utils.calculateSvgDimension(this.config.progpath.scale.width);
      let startHalfCircle = svg`
        <g >
          <path d="M${this.scale.x + 0.5 - width * 0.75},${this.scale.cy - width * 0.25} a1,1 1 0,0 ${width},0"
          fill="darkgreen" style="transform-origin:center;transform-box:fill-box;rotate:90deg;"/>
        </g>
        `;
        let endHalfCircle = svg`
        <g >
          <path d="M${this.scale.x + this.scale.width - 0.5 - width * 0.25},${this.scale.cy - width * 0.25} a1,1 1 0,0 ${width},0"
          fill="red" style="transform-origin:center;transform-box:fill-box;rotate:-90deg;"/>
        </g>
        `;

      let startHalfCirclee = svg`
        <svg viewBox="-00 -00 100 100" height="${this.config.progpath.scale.width}em"
          x="${this.scale.x}" y="${this.scale.cy}" rotate="-90deg">
          <path d="M0,50 a1,1 1 0,0 100,0" fill="red"/>
        </svg>
        `;

      return svg`
        <defs>
        <marker id="roundddd" viewBox="-1 -1 2 2" markerWidth="1" orient="auto">
          <circle r="1" fill="black" stroke-width="0"/>
        </marker>

        </defs>
      <!-- Scale Parts Group Render -->
      <g id="scale-group" fill="none">
          ${maskBegin}
          ${maskEnd}
          ${paths};
        </g>
        `;
    } else if (this.config.progpath.show.track === 'dashes') {
      // console.log('setting stroke', this.styles);
      this.styles.dashes_scale['stroke-width'] = `${this.config.progpath.track.width}em`;
      return svg`
        <!-- Track Dashes Render -->
        <path id="dashes-path" d="${this.svg.scalePath}"
        class="${classMap(this.classes.dashes_scale)}" style="${styleMap(this.styles.dashes_scale)}"
        />
      `;
    } else return svg``;
  }

  renderTrack() {
    if (!this.haveElements) return;

    if ((this.config.progpath.show.track === 'colorstops') && (this.config.progpath.colorstops)) {
      const gap = Utils.calculateSvgDimension(this.config.progpath.colorstops.gap || 0);
      let scale = { ...this.config.progpath.colorstops.scales.default };
      scale.range = scale.max - scale.min;
      let trackParts = [...this.config.progpath.colorstops.colors];
      let min = trackParts.findIndex((part) => scale.min < part.value);
      let max = trackParts.findIndex((part) => part.value >= scale.max);

      if (min !== -1) {
        // Should remove entries below
        let removedParts = trackParts.splice(0, min - 1);
        trackParts[0].value = scale.min;
      }
      if (max === -1) {
        // Add myself to end of list
        trackParts[trackParts.length] = { value: scale.max };
      } else {
        let removedParts = trackParts.splice(max, trackParts.length - max);
        trackParts[trackParts.length] = {
          value: scale.max,
          color: removedParts[0].color,
        };
      }
      trackParts.forEach((value, index, array) => value.range = index < array.length - 1 ? array[index + 1].value - value.value : 0);

      let paths = trackParts.map((value, index) => {
        const fake = 1;
        if (value.range === 0) return svg``;
        return svg`
          <!-- Track Part Render -->
          <path d="${this.svg.path}"
          stroke-dasharray="${value.range / scale.range * this.length - (index === 0 ? 0 : gap / 2)} ${this.length}"
          stroke-dashoffset="-${(value.value - scale.min) / scale.range * this.length + ((index === 0 ? 0 : gap / 2))}"
          fill="none" stroke="${value.color}"
          stroke-width="${this.config.progpath.track.width}em"
          marker-start="${index === 0 ? 'url(#round)' : 'none'}"
          />          
        `;
      });
      // console.log('renderTrack', scale, trackParts, min, max, paths);
      let width = Utils.calculateSvgDimension(this.config.progpath.track.width);
      let startHalfCircle = svg`
        <g >
          <path d="M${this.track.x + 0.5 - width * 0.75},${this.track.cy - width * 0.25} a1,1 1 0,0 ${width},0"
          fill="darkgreen" style="transform-origin:center;transform-box:fill-box;rotate:90deg;"/>
        </g>
        `;
        let endHalfCircle = svg`
        <g >
          <path d="M${this.scale.x + this.scale.width - 0.5 - width * 0.25},${this.scale.cy - width * 0.25} a1,1 1 0,0 ${width},0"
          fill="red" style="transform-origin:center;transform-box:fill-box;rotate:-90deg;"/>
        </g>
        `;
      return svg`
        <defs>
        <clipPath id="progress-clippathh" clipUnits="userSpaceOnUse">
          <path d="${this.svg.path}" pathLength="100"
          stroke-dasharry="50 100"
          stroke-width="8"
          />
        </clipPath>
        <marker id="rounddd" viewBox="-1 -1 2 2" markerWidth="1" orient="auto">
          <circle r="1" fill="black" stroke-width="0"/>
        </marker>

        </defs>
      <!-- Scale Parts Group Render -->
      <g id="path-group" mask="url(#progress-maskpath)">
        ${paths};
    </g>
        `;
    } else if (this.config.progpath.show.track === 'dashes') {
      // console.log('setting stroke', this.styles);
      this.styles.dashes_scale['stroke-width'] = `${this.config.progpath.track.width}em`;
      return svg`
        <!-- Track Dashes Render -->
        <path id="dashes-path" d="${this.svg.path}"
        class="${classMap(this.classes.dashes_scale)}" style="${styleMap(this.styles.dashes_scale)}"
        />
      `;
    } else return svg``;
  }

  shouldUpdate(changedProperties) {
    // There is no willUpdate in this LIT version, so abuse shouldUpdate for
    // calculations prior to rendering this tool...
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.progress);
    return true;
  }

 /* *****************************************************************************
  * ProgressPath::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */

  render() {
    // console.log('render...');
    if (this._card.dev.real) {
      // For now, scale to 0..100 range!
      console.log('rendering with real values...', this._stateValue, this._stateValuePrev);
      let max = this.config.progpath.colorstops.scales.default.max;
      this.myValuePrev = 100 - Math.max(Math.min(100, this._stateValuePrev / max * 100), 0);
      this.myValue = 100 - Math.max(Math.min(200, this._stateValue / max * 100), 0);

      // this.myValuePrev = Number(this._stateValuePrev) || 0;
      // this.myValue = Number(this._stateValue);
    } else {
      this.myValuePrev = this.myValue;
      this.myValue = Math.random() * 100;
    }
    return svg`
      <g "" id="ProgressPath-${this.toolId}"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderProgressPath()}
      </g>
    `;
  }
  // ${this.renderSpiral()}
} // END of class
