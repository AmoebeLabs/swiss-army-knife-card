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
          scale: 'dashes', // or scale: dashes / colorstop / none / both? (colorstop + dashes)
          marker: 'navigation',
          colorstops: 'none',
        },
        background: {
          width: 8,
        },
        marker: {
          size: 10,
          offset: 0,
        },
        scale: {
          width: 8,
        },
        progress: {
          width: 8,
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

    this.svg.background = { width: Utils.calculateSvgDimension(this.config.progpath.background.width) };
    this.svg.marker = { offset: Utils.calculateSvgDimension(this.config.progpath.marker.offset) / 400 * 24 };
    this.classes.tool = {};
    this.classes.progress = {};
    this.classes.dashes_scale = {};
    this.classes.marker = {};

    this.styles.tool = {};
    this.styles.progress = {};
    this.styles.dashes_scale = {};
    this.styles.marker = {};
    // eslint-disable-next-line dot-notation
    // this.styles.dashes_scale['poep'] = 'pap';
    // console.log('init, dashes', this.styles);

    this.ticking = false;

    this.length = 100;
    this.myValue = 50;

    this.haveElements = false;
    this.elements = {};
    this.colorstops = {};
    this.colorstops.colors = [];
    this.colorstops.colors = computeThresholds(
      this.config.progpath.colorstops.colors,
      'smooth',
    );
    // console.log('colorstops', this.colorstops);
  }

  /** *****************************************************************************
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

  getPerpendicularAngle(percentage, percentagePlus) {
    const { x, y } = this.elements.path.getPointAtLength(percentage);
    const { x: x2, y: y2 } = this.elements.path.getPointAtLength(percentagePlus);
    const angle = Math.atan2(y - y2, x - x2);
    return {
      x,
      y,
      x2,
      y2,
      angle: 180 + ((angle) * 180 / Math.PI),
    };
  }

  renderPacman() {
    const duration = 10000;

    let start;

    const animate = (timestamp) => {
      if (this.ticking) {
        return;
      } else if (!start) {
        start = timestamp;
      }
      this.ticking = true;

      const currentTime = timestamp - start;
      const ppa = this.getPerpendicularAngle(currentTime / duration * this.length,
                                 currentTime / duration * (this.length + 1));

      this.elements.marker.setAttribute('transform', `translate(${ppa.x} ${ppa.y}) rotate(${ppa.angle})`);
      this.elements.target2.setAttribute('transform', `translate(${ppa.x2} ${ppa.y2})`);

      if (currentTime > duration) {
        start = null;
        this.elements.monster.classList.toggle('destroy');

        return setTimeout(
          () => {
            this.ticking = false;
            window.requestAnimationFrame(animate);
            this.elements.monster.classList.toggle('destroy');
          },
          500);
        }
        this.ticking = false;
        window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
  }

  renderPointer(timestamp) {
    // eslint-disable-next-line no-plusplus
    const easeOut = (progress) => --progress ** 5 + 1;

    // console.log('renderPointer IN/OUT');
    this.progressPctPrev = this.progressPct || 0;
    this.progressPct = this.myValue / 100;
    this.progressDiff = this.progressPct - this.progressPctPrev;
    // console.log('renderPointer progress', this.myValue, this.progressPctPrev, this.progressPct, this.progressDiff);

    const duration = 5000;
    let start;
    let progress1;
    let progress2;

    const startAngle = 45; // Start angle in degrees
    const stopAngle = 135; // Stop angle in degrees

    let startTime;
    const animationDuration = 5000;

    const animateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = easeOut(Math.min(1, (timestamp - startTime) / animationDuration));

      const valueRange = this.myValue - this.myValuePrev;
      let curValue = this.myValuePrev + (progress * valueRange);

      const stateRange = Number(this._stateValue) - Number(this._stateValuePrev);
      const curState = Number(this._stateValuePrev) + (progress * stateRange);

      const ppa = this.getPerpendicularAngle((100 - curValue) / 100 * (this.length),
        (100 - curValue) / 100 * (this.length + 1));
      // const ppa = this.getPerpendicularAngle(progress1 * this.length,
      //                                        progress1 * (this.length + 1));
      if ((this.config.progpath.show?.marker) && (this.config.progpath.show.marker !== 'none')) {
        this.elements.marker.setAttribute('transform', `translate(${ppa.x} ${ppa.y}) rotate(${ppa.angle})`);
        const color = this.computeColor(curState, 0);
        if (color) {
          this.elements.marker.style.fill = `${this.intColor(curState, 0)}`;
          this.styles.marker.fill = this.intColor(curState, 0);
        } else {
          console.log('illegal color', color);
        }
      }
      if ((this.config.progpath.show?.progress) && (this.config.progpath.show.progress === true))
        this.elements.progress.setAttribute('stroke-dashoffset', (curValue));
      if ((this.config.progpath.show?.mask) && (this.config.progpath.show.mask === true))
      this.elements.maskPath.setAttribute('stroke-dasharray', `${100 - curValue} 100`);

      if (progress < 1) {
        window.requestAnimationFrame(animateProgress);
      } else {
        startTime = null;
      }
    };

    // console.log('renderPointer, calling animate frame');
    window.requestAnimationFrame(animateProgress);
  }

  firstUpdated(changedProperties) {
    const myWindow = this._card.shadowRoot;
    this.haveElements = true;

    this.elements.path = myWindow.getElementById('motion-path');
    this.length = this.elements.path.getTotalLength();

    if (this.config.progpath.show.path_type === 'pacman') {
      this.elements.marker = myWindow.getElementById('marker');
      this.elements.target2 = myWindow.getElementById('target2');

      this.elements.monster = myWindow.getElementById('monster');
      this.elements.pacman = myWindow.getElementById('pacman');
      this.renderPacman(Date.now());
    }
    if (this.config.progpath.show.path_type === 'rectangle') {
      this.elements.marker = myWindow.getElementById('marker');
      // this.target2 = myWindow.getElementById('target2');
      this.elements.progress = myWindow.getElementById('progress-path');
      this.elements.progressMask = myWindow.getElementById('progress-maskpath');
      // this.elements.maskPath = this.elements.progressMask.querySelector("#88maskPath");
      this.elements.maskPath = myWindow.getElementById('88maskPath');

      this.elements.pathGroup = myWindow.getElementById('path-group');

      // this.pacman = myWindow.getElementById('pacman');
      // console.log('updated, targets', this.elements);
      this.renderPointer(Date.now());
      this._card.requestUpdate();
    }
  }

  /** *****************************************************************************
  * ProgressPath::_renderMarker()
  *
  * Summary.
  *
  */
  _renderMarker() {
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
    // this.styles.marker.fill = `${color}`;
    let marker;
    switch (this.config.progpath.show.marker) {
      case 'drag-vertical':
        marker = svg`
          <!-- Marker - drag-vertical -->
          <g id=marker class="sak-marker__marker--drag-vertical" transform="scale(3 3)">
            <svg viewBox="12 ${12 + viewBoxY} 24 24" overflow="visible"
            height="${this.config.progpath.marker.size}em" width="${this.config.progpath.marker.size}em"
            >
              <path fill="currentColor" d="M11 21H9V3H11V21M15 3H13V21H15V3Z">
              </path>
            </svg>      
          </g>
          `;
        break;

      case 'pan-vertical':
        marker = svg`
          <!-- Marker - pan-vertical -->
          <g id=marker class="sak-marker__marker--pan-vertical" transform="scale(3 3)">
            <svg viewBox="12 ${12 + viewBoxY} 24 24" overflow="visible"
            height="${this.config.progpath.marker.size}em" width="${this.config.progpath.marker.size}em"
            >
              <path fill="currentColor" d="M12,2.5L8,7H16L12,2.5M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M8,17L12,21.5L16,17H8Z">
              </path>
            </svg>      
            </g>
          `;
        break;

      case 'dots-vertical':
        // The svg ViewBox="x y w h" should be calculated:
        // the y is used to shift the marker inward (< 12) or outward (>12)
        //
        // If svg height/width are used to set the requested size, there is no need for scaling anymore,
        // hence the use id= is not required. A direct return of the group would work.
        // Reason: the animation sets a transform, and thus overwrites the scale stuff...
        //
        // De extra groep met h/w maakt alles ca 10x zo groot. Dan moet je weer scalen en een transform
        // origin en transform-box zetten om dit te laten werken.
        marker = svg`
          <!-- Marker - dots-vertical -->
          <defs>
            <g id=marker_dots-vertical class="sak-marker__marker--dots-vertical" transform="scale(1 1)">
              <svg viewBox="12 ${12 + viewBoxY} 24 24" overflow="visible"
              height="${this.config.progpath.marker.size}em" width="${this.config.progpath.marker.size}em"
              >
                <path fill="currentColor"
                  d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,
                  1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z">
                </path>
              </svg>      
            </g>      
          </defs>
          <g 
            >
            <use id=marker href=#marker_dots-vertical>
          </g>
          `;
        break;

      case 'circle':
        console.log('circle marker', this.styles);
        marker = svg`
          <!-- Marker - circle -->
          <g id=marker class="sak-marker__marker--circle"
            style="${styleMap(this.styles.marker)}"          
            >
            <svg viewBox="12 ${12 + viewBoxY} 24 24" overflow="visible"
            height="${this.config.progpath.marker.size}em" width="${this.config.progpath.marker.size}em"
            >
            <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
              style="${styleMap(this.styles.marker)}"
              >
            </path>
            </svg>      
          </g>
          `;
        break;

      case 'chevron-up':
        marker = svg`
          <!-- Marker - chevron-up -->
          <g id=marker class="sak-marker__marker--chevron-up" transform="scale(3 3)">
            <svg viewBox="12 ${12 + viewBoxY} 24 24" height="40" width="24" overflow="visible">
              <path fill="currentColor" d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z">
              </path>
            </svg>
          </g>
          `;
        break;

      case 'navigation':
        marker = svg`
          <!-- Marker - navigation -->
          <g id=marker class="sak-marker__marker--navigation" transform="scale(2 2)"
            style="${styleMap(this.styles.marker)}"
          >
            <svg viewBox="12 ${0 + viewBoxY} 24 24" overflow="visible"
              height="${this.config.progpath.marker.size}em" width="${this.config.progpath.marker.size}em">
              <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z">
              </path>
            </svg>      
          </g>
          `;
        break;

      case 'menu-up':
        marker = svg`
          <!-- Marker - menu-up -->
          <g id=marker class="sak-marker__marker--menu-up" transform="scale(3 3)">
            <svg viewBox="12 ${12 + viewBoxY} 24 24" height="40" width="24" overflow="visible">
              <path fill="currentColor" d="M7,15L12,10L17,15H7Z">
              </path>
            </svg>
          </g>
          `;
        break;

      case 'arrow-up-bold-outline':
        marker = svg`
          <!-- Marker - arrow-up-bold-outline -->
          <g id=marker class="sak-marker__marker--arrow-up-bold-outline" transform="scale(3 3)">
            <svg viewBox="12 ${0 + viewBoxY} 24 24" height="24" width="24" overflow="visible">
              <path d="M16,13V21H8V13H2L12,3L22,13H16M7,11H10V19H14V11H17L12,6L7,11Z">
              </path>
            </svg>
          </g>        
          `;
        break;
      default:
        marker = svg``;
        break;
    }
    return marker;
  }

  _computeRectangularPath = (width, height, tl, tr, br, bl) => {
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
    const startPos = this.rectangle.start.position;
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
    switch (startSide) {
      case 'top':
        d = `M${this.svg.width / 2 + startPos}, ${this.svg.height / 2 - height / 2}`;
        break;
      case 'right':
        d = `M${this.svg.width / 2 + width / 2}, ${this.svg.height / 2 + startPos}`;
        break;
      case 'bottom':
        d = `M${this.svg.width / 2 + startPos}, ${this.svg.height / 2 + height / 2}`;
        break;
      case 'left':
        d = `M${this.svg.width / 2 - width / 2}, ${this.svg.height / 2 - startPos}`;
        break;
      default:
        break;
    }

    // If start.position smaller than stop.position on SAME side, then only
    // use that side. So a kind of small rectangle, just one side...
    // set stop side to 'same', so table can use this!
    const sidesToDo = [];
    sidesToDo.top = [];
    sidesToDo.top.right = 'tr';
    sidesToDo.top.bottom = 'trb';
    sidesToDo.top.left = 'trbl';
    sidesToDo.top.top = sameSide ? 't' : 'trblt';
    sidesToDo.right = [];
    sidesToDo.right.bottom = 'rb';
    sidesToDo.right.left = 'rbl';
    sidesToDo.right.top = 'rblt';
    sidesToDo.right.right = sameSide ? 'r' : 'rbltr';

    sidesToDo.bottom = [];
    sidesToDo.bottom.left = 'bl';
    sidesToDo.bottom.top = 'blt';
    sidesToDo.bottom.right = 'bltr';
    sidesToDo.bottom.bottom = sameSide ? 'b' : 'bltrb';

    sidesToDo.left = [];
    sidesToDo.left.top = 'lt';
    sidesToDo.left.right = 'ltr';
    sidesToDo.left.bottom = 'ltrb';
    sidesToDo.left.left = sameSide ? 'l' : 'ltrbl';

    let sideCount = sidesToDo[startSide][stopSide].length;
    for (let i = 0; i < sideCount; i++) {
      let currentSide = sidesToDo[startSide][stopSide][i];
      switch (currentSide) {
        case 't':
          if (sideCount === 1) {
            top = this.rectangle.stop.position - this.rectangle.start.position;
            d += `
              h${top}
              `;
          } else if (i === sideCount - 1) {
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
          if (sideCount === 1) {
            right = this.rectangle.stop.position - this.rectangle.start.position;
            d += `
              h${right}
              `;
          } else if (i === sideCount - 1) {
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
          if (sideCount === 1) {
            bottom = this.rectangle.stop.position - this.rectangle.start.position;
            d += `
              h${bottom}
              `;
          } else if (i === sideCount - 1) {
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
          if (sideCount === 1) {
            left = this.rectangle.stop.position - this.rectangle.start.position;
            d += `
              h${left}
              `;
          } else if (i === sideCount - 1) {
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
        <path id="background-path" d="${this.svg.path}" fill="none"
        stroke="var(--theme-sys-elevation-surface-neutral1)"
        stroke-width="${this.svg.background.width}"/>
      `;
    } else return svg``;
  }

  /** *****************************************************************************
  * ProgressPath::_renderProgressPath()
  *
  * Summary.
  *
  */

  _renderProgressPath() {
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

    const computeRectanglePath = (width, height, tl, tr, br, bl) => {
        const top = width - tl - tr;
        const right = height - tr - br;
        const bottom = width - br - bl;
        const left = height - bl - tl;
        const d = `
            M${tl},0
            h${top}
            a${tr},${tr} 0 0 1 ${tr},${tr}
            v${right}
            a${br},${br} 0 0 1 -${br},${br}
            h-${bottom}
            a${bl},${bl} 0 0 1 -${bl},-${bl}
            v-${left}
            a${tl},${tl} 0 0 1 ${tl},-${tl}
            z
        `;
        return d;
      };
      this.svg.path = this._computeRectangularPath(this.svg.width, this.svg.height,
                          this.rectangle.radius.tl,
                          this.rectangle.radius.tr,
                          this.rectangle.radius.br,
                          this.rectangle.radius.bl);

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
        }
        
        #markerr pathh {
          fill: var(--primary-text-color);
          stroke: var(--primary-background-color);
          paint-order: stroke;
          stroke-width: 0.6em;
        }

        #pacman2 path {
          fill: #fcee21;
          animation: mouth 200ms infinite;
        }
        #eye {
          fill: #0c1419;
        }
        
      </style>
      <g id=pacman9 class="sak-marker__marker--drag-vertical" transform="scale(1 1)">
        <svg viewBox="12 24 24 24" height="48" width="48" overflow="visible">
        <path fill="currentColor" d="M11 21H9V3H11V21M15 3H13V21H15V3Z">
        </path>
        </svg>      
      </g>

      <g id=pacman8 class="sak-marker__marker--pan-vertical" transform="scale(3 3)">
        <svg viewBox="12 12 24 24" height="24" width="24" overflow="visible">
        <path fill="currentColor" d="M12,2.5L8,7H16L12,2.5M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M8,17L12,21.5L16,17H8Z">
        </path>
        </svg>      
      </g>
      <g id=pacman7 class="sak-marker__marker--dots-vertical" transform="scale(3 3)">
        <svg viewBox="12 12 24 24" height="24" width="24" overflow="visible">
          <path fill="currentColor"
           d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,
           1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z">
        </path>
        </svg>      
      </g>      
      <g id=pacman6 class="sak-marker__marker--circle-outline" transform="scale(3 3)">
        <svg viewBox="12 12 24 24" height="24" width="24" overflow="visible">
        <path fill="currentColor" d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z">
        </path>
        </svg>      
      </g>
      <g id=pacman4 class="sak-marker__marker--chevron-up" transform="scale(3 3)">
        <svg viewBox="12 12 24 24" height="40" width="24" overflow="visible">
          <path fill="currentColor" d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z">
        </path>
        </svg>
      </g>
      <g id=pacman class="sak-marker__marker--navigation" transform="scale(2 2)">
        <svg viewBox="12 12 24 24" height="48" width="24" overflow="visible">
          <path fill="currentColor" d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z">
        </path>
        </svg>      
      </g>

          <g id=pacman4 class="sak-marker__marker--menu-up" transform="scale( 3 3)">
            <svg viewBox="12 12 24 24" height="40" width="24" overflow="visible">
              <path fill="currentColor" d="M7,15L12,10L17,15H7Z">
              </path>
            </svg>
          </g>
          <g id=pacman3 class="sak-marker__marker--arrow-up-bold-outline" transform="scale(3 3)">
            <svg viewBox="12 12 24 24" height="54" width="24" overflow="visible">
              <path d="M16,13V21H8V13H2L12,3L22,13H16M7,11H10V19H14V11H17L12,6L7,11Z">
              </path>
            </svg>
          </g>
          <g id=pacman2>
            <svg viewBox="0 0 4 4" height="40" width="40" overflow="visible">
              <g>
                <path d="M2 0C2 1.104 1.104 2 0 2-0.88 2-1.628 1.432-1.895 0.642 0 0-1.895 0.642 0 0-1.884-0.673 0 0-1.884-0.673-1.607-1.446-0.868-2 0-2 1.104-2 2-1.104 2 0z"/>
                <circle cx="-0.5" cy="-1.1" r="0.3"/>
                </g>
            </svg>
          </g>
          <circle cx="-0.5" cy="-1.1" r="0.3"/>
          </g>
          <g id=monster scale="3 3">
            <path d="M-2 0a2 2 0 014 0v1.3a.7.7 0 01-1.35.25.7.7 0 01-1.3 0A.7.7 0 01-2 1.3V0z"/>
            <circle cx="-1" r=".5"/>
            <circle cx="-1.15" cy=".1" r=".25"/>
            <circle cx=".8" r=".5"/>
            <circle cx=".65" cy=".1" r=".25"/>
          </g>
          <!-- Progress Mask Render -->
          <mask id="progress-maskpath" maskUnits="userSpaceOnUse">
          <path id="88maskPath" d="${this.svg.path}" pathLength="100"
          stroke-dasharray="50 100"
          stroke-dashoffset="0"
          stroke-width="10em"
          stroke="white"
          fill="black" <!-- "#666" -->
          paint-order="stroke"
          />
        </mask>

        </defs>

        <path id="motion-path" d="${this.svg.path}" pathLength="100"/>
        ${this.renderBackgroundPath()}
        ${this.renderScale()}
        ${this.renderProgressPath()}

        <path id="pointer-path" d="${this.svg.path}" pathLength="100"
          fill="none" stroke="black" stroke-width="0em"/>

          <!--  <use id=target href="#pacman8"/> -->
        ${this._renderMarker()}
        ${this.renderPointer()}
      </svg>
      `;
    }
  }
//   <path id="red-path" d="${this.svg.path}" pathLength="100"
//   stroke-dasharray="19.75 100"
//   stroke-dashoffset="-80.25"
//   fill="none" stroke="red" stroke-width="0em"/>
// <path id="yellow-path" d="${this.svg.path}" pathLength="100"
//   stroke-dasharray="19.5 100"
//   stroke-dashoffset="-60.25"
//   fill="none" stroke="yellow" stroke-width="0em"/>
// <path id="green-path" d="${this.svg.path}" pathLength="100"
//   stroke-dasharray="59.75 100"
//   stroke-dashoffset="-0"
//   fill="none" stroke="green" stroke-width="0em"/>

  // style="transition:stroke-dashoffset 5s ease-out;

  renderProgressPath() {
    // if (!this.haveElements) return;

    if (this.config.progpath.show.progress) {
      // Make sure that dasharray settings are what we need: overwrite them
      // Do NOT set the dashoffset, as it overwrites the animation setting!
      this.styles.progress['stroke-dasharray'] = '100 100';
      this.styles.progress['stroke-width'] = `${this.config.progpath.progress.width}em`;

      return svg`
        <!-- ProgressPath Render -->
        <path id="progress-path" d="${this.svg.path}" pathLength="100"
          class="${classMap(this.classes.progress)}" style="${styleMap(this.styles.progress)}"
        />
      `;
    } else return svg``;
  }

  renderScale() {
    if (!this.haveElements) return;

    if ((this.config.progpath.show.scale === 'colorstops') && (this.config.progpath.colorstops)) {
      const gap = Utils.calculateSvgDimension(this.config.progpath.colorstops.gap || 0);
      let scale = { ...this.config.progpath.colorstops.scales.default };
      scale.range = scale.max - scale.min;
      let scaleParts = [...this.config.progpath.colorstops.colors];
      let min = scaleParts.findIndex((part) => scale.min < part.value);
      let max = scaleParts.findIndex((part) => part.value >= scale.max);

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
      // console.log('renderScale', scale, scaleParts, min, max);

      let paths = scaleParts.map((value, index) => {
        const fake = 1;
        if (value.range === 0) return svg``;
        return svg`
          <!-- Scale Part Render -->
          <path d="${this.svg.path}"
          stroke-dasharray="${value.range / scale.range * this.length - (index === 0 ? 0 : gap / 2)} ${this.length}"
          stroke-dashoffset="-${(value.value - scale.min) / scale.range * this.length + ((index === 0 ? 0 : gap / 2))}"
          fill="none" stroke="${value.color}"
          stroke-width="${this.config.progpath.scale.width}em"/>          
        `;

        return svg`
          <path d="${this.svg.path}" pathLength="100"
          stroke-dasharray="${value.range} 100"
          stroke-dashoffset="-${value.value}"
          fill="none" stroke="${value.color}" stroke-width="5em"/>          
        `;
      });
      // console.log('renderScale', scale, scaleParts, min, max, paths);
      return svg`
        <defs>
        <clipPath id="progress-clippathh" clipUnits="userSpaceOnUse">
          <path d="${this.svg.path}" pathLength="100"
          stroke-dasharry="50 100"
          stroke-width="8"
          />
        </clipPath>
      </defs>
      <!-- Scale Parts Group Render -->
      <g id="path-group" mask="url(#progress-maskpath)">
          ${paths};
        </g>
        `;
    } else if (this.config.progpath.show.scale === 'dashes') {
      // console.log('setting stroke', this.styles);
      this.styles.dashes_scale['stroke-width'] = `${this.config.progpath.scale.width}em`;
      return svg`
        <!-- Scale Dashes Render -->
        <path id="dashes-path" d="${this.svg.path}"
        class="${classMap(this.classes.dashes_scale)}" style="${styleMap(this.styles.dashes_scale)}"
        />
      `;

      return svg`
        <path id="dashes-path" d="${this.svg.path}" pathLength="100"
          class="${classMap(this.classes.dashes_scale)}" style="${styleMap(this.styles.dashes_scale)}"
        />
      `;
    } else return svg``;
    // return svg`
    //   <path id="green-path" d="${this.svg.path}" pathLength="100"
    //   stroke-dasharray="59.75 100"
    //   stroke-dashoffset="-0"
    //   fill="none" stroke="green" stroke-width="0em"/>
    // `;
  }

  willUpdate(changedProperties) {
    console.log('willUpdate...');
  }

  shouldUpdate(changedProperties) {
    // console.log('shouldUpdate...');
    // There is no willUpdate in this LIT version, so abuse shouldUpdate for
    // calculations prior to rendering this tool...
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    // this.MergeColorFromState(this.styles.progress);
    // this.renderScale();
    return true;
  }

  /** *****************************************************************************
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
} // END of class
