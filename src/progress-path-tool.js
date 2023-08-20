import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import Utils from './utils';
import BaseTool from './base-tool';

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
        radius: 50,
      },
      classes: {
        tool: {
          'sak-path-progress': true,
          hover: true,
        },
        circle: {
          'sak-path-progress__progress': true,
        },
      },
      styles: {
        tool: {
        },
        circle: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_PATH_PROGRESS_CONFIG, argConfig), argPos);
    this.EnableHoverForInteraction();

    this.svg.radius = Utils.calculateSvgDimension(argConfig.position.radius);

    this.classes.tool = {};
    this.classes.ProgressPath = {};

    this.styles.tool = {};
    this.styles.ProgressPath = {};

    this.ticking = false;

    this.length = 100;
    this.myValue = 50;
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

  getPerpendicularAngle(percentage, percentagePlus) {
    const { x, y } = this.path.getPointAtLength(percentage);
    const { x: x2, y: y2 } = this.path.getPointAtLength(percentagePlus);
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

      this.target.setAttribute('transform', `translate(${ppa.x} ${ppa.y}) rotate(${ppa.angle})`);
      this.target2.setAttribute('transform', `translate(${ppa.x2} ${ppa.y2})`);

      if (currentTime > duration) {
        start = null;
        this.monster.classList.toggle('destroy');

        return setTimeout(
          () => {
            this.ticking = false;
            window.requestAnimationFrame(animate);
            this.monster.classList.toggle('destroy');
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

    console.log('renderPointer IN/OUT');
    this.progressPctPrev = this.progressPct || 0;
    this.progressPct = this.myValue / 100;
    this.progressDiff = this.progressPct - this.progressPctPrev;
    console.log('renderPointer progress', this.myValue, this.progressPctPrev, this.progressPct, this.progressDiff);

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

      const ppa = this.getPerpendicularAngle((100 - curValue) / 100 * (this.length),
        (100 - curValue) / 100 * (this.length + 1));
      // const ppa = this.getPerpendicularAngle(progress1 * this.length,
      //                                        progress1 * (this.length + 1));
      this.target.setAttribute('transform', `translate(${ppa.x} ${ppa.y}) rotate(${ppa.angle})`);
      if (false) this.progressPath.setAttribute('stroke-dashoffset', (curValue));

      if (progress < 1) {
        window.requestAnimationFrame(animateProgress);
      } else {
        startTime = null;
      }
    };

    const animate = (timestamp) => {
      if (!start) {
        start = timestamp;
      }
      this.ticking = true;

      const currentTime = timestamp - start;
      let someProgress = (currentTime / duration) * this.progressDiff;
      let percent = this.progressPctPrev + someProgress;
      progress1 = easeOut(currentTime / duration);
      const ppa = this.getPerpendicularAngle(percent * this.length,
                                             percent * (this.length + 1));
      // const ppa = this.getPerpendicularAngle(progress1 * this.length,
      //                                        progress1 * (this.length + 1));
      this.target.setAttribute('transform', `translate(${ppa.x} ${ppa.y}) rotate(${ppa.angle})`);

      if (currentTime > duration) {
        start = null;
        this.ticking = false;
        console.log('animate, stopping...');
      } else {
        console.log('animate, calling animate frame');
        window.requestAnimationFrame(animate);
      }
    };
    console.log('renderPointer, calling animate frame');
    window.requestAnimationFrame(animateProgress);
  }

  firstUpdated(changedProperties) {
    const myWindow = this._card.shadowRoot;

    this.path = myWindow.getElementById('motion-path');
    this.length = this.path.getTotalLength();

    if (this.config.progpath.show.path_type === 'pacman') {
      this.target = myWindow.getElementById('target');
      this.target2 = myWindow.getElementById('target2');

      this.monster = myWindow.getElementById('monster');
      this.pacman = myWindow.getElementById('pacman');
      this.renderPacman(Date.now());
    }
    if (this.config.progpath.show.path_type === 'rectangle') {
      this.target = myWindow.getElementById('target');
      this.target2 = myWindow.getElementById('target2');
      this.progressPath = myWindow.getElementById('progress-path');

      this.pacman = myWindow.getElementById('pacman');
      console.log('updated, targets', this.target, this.target2, this.monster, this.pacman);
      this.renderPointer(Date.now());
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

    let marker;
    switch (this.config.progpath.marker) {
      case 'drag-vertical':
        marker = svg`
          <!-- Marker - drag-vertical -->
          <g id=pacman9 class="sak-marker__marker--drag-vertical" transform="scale(3 3)">
            <svg viewBox="12 12 24 24" height="24" width="24" overflow="visible">
              <path fill="currentColor" d="M11 21H9V3H11V21M15 3H13V21H15V3Z">
              </path>
            </svg>      
          </g>
          `;
        break;

      case 'pan-vertical':
        marker = svg`
          <!-- Marker - pan-vertical -->
          <g id=pacman8 class="sak-marker__marker--pan-vertical" transform="scale(3 3)">
            <svg viewBox="12 12 24 24" height="24" width="24" overflow="visible">
              <path fill="currentColor" d="M12,2.5L8,7H16L12,2.5M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M8,17L12,21.5L16,17H8Z">
              </path>
            </svg>      
            </g>
          `;
        break;

      case 'dots-vertical':
        marker = svg`
          <!-- Marker - dots-vertical -->
          <g id=pacman7 class="sak-marker__marker--dots-vertical" transform="scale(3 3)">
            <svg viewBox="12 12 24 24" height="24" width="24" overflow="visible">
              <path fill="currentColor"
                d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,
                1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z">
              </path>
            </svg>      
          </g>      
          `;
        break;

      case 'circle-outline':
        marker = svg`
          <!-- Marker - circle-outline -->
          <g id=pacman6 class="sak-marker__marker--circle-outline" transform="scale(3 3)">
            <svg viewBox="12 12 24 24" height="24" width="24" overflow="visible">
              <path fill="currentColor" d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z">
              </path>
            </svg>      
          </g>
          `;
        break;

      case 'chevron-up':
        marker = svg`
          <!-- Marker - chevron-up -->
          <g id=pacman4 class="sak-marker__marker--chevron-up" transform="scale(3 3)">
            <svg viewBox="12 12 24 24" height="40" width="24" overflow="visible">
              <path fill="currentColor" d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z">
              </path>
            </svg>
          </g>
          `;
        break;

      case 'navigation':
        marker = svg`
          <!-- Marker - navigation -->
          <g id=pacman class="sak-marker__marker--navigation" transform="scale(2 2)">
            <svg viewBox="12 12 24 24" height="48" width="24" overflow="visible">
              <path fill="currentColor" d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z">
              </path>
            </svg>      
          </g>
          `;
        break;

      case 'menu-up':
        marker = svg`
          <!-- Marker - menu-up -->
          <g id=pacman4 class="sak-marker__marker--menu-up" transform="scale(3 3)">
            <svg viewBox="12 12 24 24" height="40" width="24" overflow="visible">
              <path fill="currentColor" d="M7,15L12,10L17,15H7Z">
              </path>
            </svg>
          </g>
          `;
        break;

      case 'arrow-up-bold-outline':
        marker = svg`
          <!-- Marker - arrow-up-bold-outline -->
          <g id=pacman3 class="sak-marker__marker--arrow-up-bold-outline" transform="scale(3 3)">
            <svg viewBox="12 12 24 24" height="54" width="24" overflow="visible">
              <path d="M16,13V21H8V13H2L12,3L22,13H16M7,11H10V19H14V11H17L12,6L7,11Z">
              </path>
            </svg>
          </g>        
          `;
        break;
      default:
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

    switch (startSide) {
      case 't':
        d = `M${this.svg.width / 2 + this.rectangle.start.position}, ${this.svg.height / 2 - height / 2}`;
        break;
      case 'r':
        d = `M${this.svg.width / 2 + width / 2}, ${this.svg.height / 2 + this.rectangle.start.position}`;
        break;
      case 'b':
        d = `M${this.svg.width / 2 + this.rectangle.start.position}, ${this.svg.height / 2 + height / 2}`;
        break;
      case 'l':
        d = `M${this.svg.width / 2 - width / 2}, ${this.svg.height / 2 - this.rectangle.start.position}`;
        break;
      default:
        break;
    }

    const sidesToDo = [];
    sidesToDo.t = [];
    sidesToDo.t.r = 'tr';
    sidesToDo.t.b = 'trb';
    sidesToDo.t.l = 'trbl';
    sidesToDo.t.t = 'trblt';
    sidesToDo.r = [];
    sidesToDo.r.b = 'rb';
    sidesToDo.r.l = 'rbl';
    sidesToDo.r.t = 'rblt';
    sidesToDo.r.r = 'rbltr';

    sidesToDo.b = [];
    sidesToDo.b.l = 'bl';
    sidesToDo.b.t = 'blt';
    sidesToDo.b.r = 'bltr';
    sidesToDo.b.b = 'bltrb';

    sidesToDo.l = [];
    sidesToDo.l.t = 'lt';
    sidesToDo.l.r = 'ltr';
    sidesToDo.l.b = 'ltrb';
    sidesToDo.l.l = 'ltrbl';

    let sideCount = sidesToDo[startSide][stopSide].length;
    for (let i = 0; i < sideCount; i++) {
      let currentSide = sidesToDo[startSide][stopSide][i];
      switch (currentSide) {
        case 't':
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
      const mypath = this._computeRectangularPath(this.svg.width, this.svg.height,
                          this.rectangle.radius.tl,
                          this.rectangle.radius.tr,
                          this.rectangle.radius.br,
                          this.rectangle.radius.bl);

      // const myPointerPath = computeRectangularPath(
      //   this.svg.width,
      //   this.svg.height,
      //   this.rectangle.radius.tl,
      //   this.rectangle.radius.tr,
      //   this.rectangle.radius.br,
      //   this.rectangle.radius.bl);

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
          stroke-dasharray: 2 10;
        }
        
        #pacman path {
          fill: var(--theme-sys-elevation-surface-neutral9);
          stroke: white;
          paint-order: stroke;
          stroke-width: 0.5em;
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
        </defs>
        <path id="background-path" d="${mypath}" fill="none"
              stroke="var(--theme-sys-elevation-surface-neutral1)" stroke-width="10em"/>
        <path id="motion-path" d="${mypath} pathLength="100"/>
        <path id="progress-path" d="${mypath}" pathLength="100"
          stroke-dasharray="100 100"
          stroke-dashoffset="100"
          fill="none" stroke="var(--primary-color)" stroke-width="10em"/>

        <path id="red-path" d="${mypath}" pathLength="100"
          stroke-dasharray="19.75 100"
          stroke-dashoffset="-80.25"
          fill="none" stroke="red" stroke-width="10em"/>
        <path id="yellow-path" d="${mypath}" pathLength="100"
          stroke-dasharray="19.5 100"
          stroke-dashoffset="-60.25"
          fill="none" stroke="yellow" stroke-width="10em"/>
        <path id="green-path" d="${mypath}" pathLength="100"
          stroke-dasharray="59.75 100"
          stroke-dashoffset="-0"
          fill="none" stroke="green" stroke-width="10em"/>

        <path id="pointer-path" d="${mypath} pathLength="100"
          fill="none" stroke="black" stroke-width="0em"/>

        <use id=target href="#pacman8"/>
        ${this.renderPointer()}
      </svg>
      `;
    }
  }
  // style="transition:stroke-dashoffset 5s ease-out;

  willUpdate(changedProperties) {
    console.log('willUpdate...');
  }

  shouldUpdate(changedProperties) {
    console.log('shouldUpdate...');
    // There is no willUpdate in this LIT version, so abuse shouldUpdate for
    // calculations prior to rendering this tool...
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.ProgressPath);

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
    console.log('render...');
    this.myValuePrev = this.myValue;
    this.myValue = Math.random() * 100;
    return svg`
      <g "" id="ProgressPath-${this.toolId}"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderProgressPath()}
      </g>
    `;
  }
} // END of class
