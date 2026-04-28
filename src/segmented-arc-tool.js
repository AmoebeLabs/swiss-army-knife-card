import { svg } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map.js';
import { classMap } from 'lit-html/directives/class-map.js';

import Merge from './merge';
import BaseTool from './base-tool';
import Utils from './utils';
import Templates from './templates';
import Colors from './colors';

/** *****************************************************************************
 * SegmentedArcTool class
 *
 * Summary.
 *
 */

export default class SegmentedArcTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_SEGARC_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        radius: 45,
        width: 3,
        margin: 1.5,
        start_angle: 0,
        end_angle: 360,
      },
      color: 'var(--primary-color)',
      classes: {
        tool: {
          'sak-segarc': true,
        },
        foreground: {},
        background: {},
      },
      styles: {
        tool: {},
        foreground: {},
        background: {},
      },
      segments: {
        dash: 10,
        gap: 1,
        colorlist: {
          colors: [],
          gap: 1,
        },
        colorstops: {
          colors: {},
          gap: 1,
        },
      },
      colorstops: [],
      scale: {
        min: 0,
        max: 100,
        width: 2,
        offset: -3.5,
      },
      show: {
        style: 'fixedcolor',
        scale: false,
      },
      isScale: false,
      animation: {
        duration: 1.5,
      },
    };

    const config = Merge.mergeDeep(DEFAULT_SEGARC_CONFIG, argConfig || {});

    super(argToolset, config, argPos);

    if (this.dev.performance) console.time(`--> ${this.toolId} PERFORMANCE SegmentedArcTool::constructor`);

    this.svg.radius = Utils.calculateSvgDimension(this.config.position.radius);
    this.svg.radiusX = Utils.calculateSvgDimension(
      this.config.position.radius_x || this.config.position.radius,
    );
    this.svg.radiusY = Utils.calculateSvgDimension(
      this.config.position.radius_y || this.config.position.radius,
    );

    this.svg.segments = {};
    this.svg.segments.gap = Utils.calculateSvgDimension(this.config.segments.gap);
    this.svg.scale_offset = Utils.calculateSvgDimension(this.config.scale.offset);

    this._firstUpdatedCalled = false;

    this._stateValue = null;
    this._stateValuePrev = null;
    this._stateValueIsDirty = false;
    this._renderFrom = null;
    this._renderTo = null;

    this.rAFid = null;
    this.cancelAnimation = false;

    this.arcId = null;

    this._cache = [];

    this._segmentAngles = [];
    this._segments = {};

    this._arc = {};
    this._arc.size = Math.abs(this.config.position.end_angle - this.config.position.start_angle);
    this._arc.clockwise = this.config.position.end_angle > this.config.position.start_angle;
    this._arc.direction = this._arc.clockwise ? 1 : -1;

    let tcolorlist = {};
    let colorlist = null;

    if (this.config.segments.colorlist?.template) {
      colorlist = this.config.segments.colorlist;

      if (this._card.lovelace.config.sak_user_templates.templates[colorlist.template.name]) {
        if (this.dev.debug) {
          console.log(
            'SegmentedArcTool::constructor - templates colorlist found',
            colorlist.template.name,
          );
        }

        tcolorlist = Templates.replaceVariables2(
          colorlist.template.variables,
          this._card.lovelace.config.sak_user_templates.templates[colorlist.template.name],
        );

        this.config.segments.colorlist = tcolorlist;
      }
    }

    if (this.config.show.style === 'fixedcolor') {
      // Original behavior.
    } else if (this.config.show.style === 'colorlist') {
      this._segments.count = this.config.segments.colorlist.colors.length;
      this._segments.size = this._arc.size / this._segments.count;

      this._segments.gap = this.config.segments.colorlist.gap;

      if (typeof this._segments.gap === 'undefined') {
        this._segments.gap = 1;
      }

      this._segments.sizeList = [];

      for (var i = 0; i < this._segments.count; i++) {
        this._segments.sizeList[i] = this._segments.size;
      }

      var segmentRunningSize = 0;

      for (var i = 0; i < this._segments.count; i++) {
        this._segmentAngles[i] = {
          boundsStart: this.config.position.start_angle + (segmentRunningSize * this._arc.direction),
          boundsEnd: this.config.position.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction),
          drawStart: this.config.position.start_angle + (segmentRunningSize * this._arc.direction) + (this._segments.gap * this._arc.direction),
          drawEnd: this.config.position.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction) - (this._segments.gap * this._arc.direction),
        };

        segmentRunningSize += this._segments.sizeList[i];
      }

      if (this.dev.debug) console.log('colorstuff - COLORLIST', this._segments, this._segmentAngles);
    } else if (this.config.show.style === 'colorstops') {
      this._segments.colorStops = {};

      Object.keys(this.config.segments.colorstops.colors).forEach((key) => {
        if (
          key >= this.config.scale.min
          && key <= this.config.scale.max
        ) {
          this._segments.colorStops[key] = this.config.segments.colorstops.colors[key];
        }
      });

      this._segments.sortedStops = Object.keys(this._segments.colorStops)
        .map((n) => Number(n))
        .sort((a, b) => a - b);

      if (typeof (this._segments.colorStops[this.config.scale.max]) === 'undefined') {
        this._segments.colorStops[this.config.scale.max] = this._segments.colorStops[
          this._segments.sortedStops[this._segments.sortedStops.length - 1]
        ];

        this._segments.sortedStops = Object.keys(this._segments.colorStops)
          .map((n) => Number(n))
          .sort((a, b) => a - b);
      }

      this._segments.count = this._segments.sortedStops.length - 1;

      this._segments.gap = this.config.segments.colorstops.gap;

      if (typeof this._segments.gap === 'undefined') {
        this._segments.gap = 1;
      }

      let runningColorStop = this.config.scale.min;
      const scaleRange = this.config.scale.max - this.config.scale.min;

      this._segments.sizeList = [];

      for (var i = 0; i < this._segments.count; i++) {
        const colorSize = this._segments.sortedStops[i + 1] - runningColorStop;

        runningColorStop += colorSize;

        const fraction = colorSize / scaleRange;
        const angleSize = fraction * this._arc.size;

        this._segments.sizeList[i] = angleSize;
      }

      var segmentRunningSize = 0;

      for (var i = 0; i < this._segments.count; i++) {
        this._segmentAngles[i] = {
          boundsStart: this.config.position.start_angle + (segmentRunningSize * this._arc.direction),
          boundsEnd: this.config.position.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction),
          drawStart: this.config.position.start_angle + (segmentRunningSize * this._arc.direction) + (this._segments.gap * this._arc.direction),
          drawEnd: this.config.position.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction) - (this._segments.gap * this._arc.direction),
        };

        segmentRunningSize += this._segments.sizeList[i];

        if (this.dev.debug) {
          console.log('colorstuff - COLORSTOPS++ segments', segmentRunningSize, this._segmentAngles[i]);
        }
      }

      if (this.dev.debug) {
        console.log(
          'colorstuff - COLORSTOPS++',
          this._segments,
          this._segmentAngles,
          this._arc.direction,
          this._segments.count,
        );
      }
    } else if (this.config.show.style === 'simplegradient') {
      // Original behavior.
    }

    if (this.config.isScale) {
      this._stateValue = this.config.scale.max;
    } else if (this.config.show.scale) {
      const scaleConfig = Merge.mergeDeep({}, this.config);

      scaleConfig.id += '-scale';

      scaleConfig.show.scale = false;
      scaleConfig.isScale = true;
      scaleConfig.position.width = this.config.scale.width;
      scaleConfig.position.radius = this.config.position.radius
        - (this.config.position.width / 2)
        + (scaleConfig.position.width / 2)
        + this.config.scale.offset;
      scaleConfig.position.radius_x = (this.config.position.radius_x || this.config.position.radius)
        - (this.config.position.width / 2)
        + (scaleConfig.position.width / 2)
        + this.config.scale.offset;
      scaleConfig.position.radius_y = (this.config.position.radius_y || this.config.position.radius)
        - (this.config.position.width / 2)
        + (scaleConfig.position.width / 2)
        + this.config.scale.offset;

      this._segmentedArcScale = new SegmentedArcTool(this, scaleConfig, argPos);
    } else {
      this._segmentedArcScale = null;
    }

    this.skipOriginal = (
      this.config.show.style === 'colorstops'
      || this.config.show.style === 'colorlist'
    );

    if (this.skipOriginal) {
      if (this.config.isScale) this._stateValuePrev = this._stateValue;
      this._initialDraw = false;
    }

    this._arc.parts = Math.floor(this._arc.size / Math.abs(this.config.segments.dash));
    this._arc.partsPartialSize = this._arc.size - (this._arc.parts * this.config.segments.dash);

    if (this.skipOriginal) {
      this._arc.parts = this._segmentAngles.length;
      this._arc.partsPartialSize = 0;
    } else {
      for (var i = 0; i < this._arc.parts; i++) {
        this._segmentAngles[i] = {
          boundsStart: this.config.position.start_angle + (i * this.config.segments.dash * this._arc.direction),
          boundsEnd: this.config.position.start_angle + ((i + 1) * this.config.segments.dash * this._arc.direction),
          drawStart: this.config.position.start_angle + (i * this.config.segments.dash * this._arc.direction) + (this.config.segments.gap * this._arc.direction),
          drawEnd: this.config.position.start_angle + ((i + 1) * this.config.segments.dash * this._arc.direction) - (this.config.segments.gap * this._arc.direction),
        };
      }

      if (this._arc.partsPartialSize > 0) {
        this._segmentAngles[i] = {
          boundsStart: this.config.position.start_angle + (i * this.config.segments.dash * this._arc.direction),
          boundsEnd: this.config.position.start_angle
            + ((i + 0) * this.config.segments.dash * this._arc.direction)
            + (this._arc.partsPartialSize * this._arc.direction),

          drawStart: this.config.position.start_angle
            + (i * this.config.segments.dash * this._arc.direction)
            + (this.config.segments.gap * this._arc.direction),
          drawEnd: this.config.position.start_angle
            + ((i + 0) * this.config.segments.dash * this._arc.direction)
            + (this._arc.partsPartialSize * this._arc.direction)
            - (this.config.segments.gap * this._arc.direction),
        };
      }
    }

    this.starttime = null;

    if (this.dev.debug) {
      console.log(
        'SegmentedArcTool constructor coords, dimensions',
        this.coords,
        this.dimensions,
        this.svg,
        this.config,
      );
    }

    if (this.dev.debug) {
      console.log(
        'SegmentedArcTool - init',
        this.toolId,
        this.config.isScale,
        this._segmentAngles,
      );
    }

    if (this.dev.performance) {
      console.timeEnd(`--> ${this.toolId} PERFORMANCE SegmentedArcTool::constructor`);
    }
  }

  get objectId() {
    return this.toolId;
  }

  set value(state) {
    if (this.dev.debug) console.log('SegmentedArcTool - set value IN');

    if (this.config.isScale) return false;
    if (this._stateValue === state) return false;

    const changed = super.value = state;

    return changed;
  }

  firstUpdated(changedProperties) {
    if (this.dev.debug) {
      console.log(
        'SegmentedArcTool - firstUpdated IN with _arcId/id',
        this._arcId,
        this.toolId,
        this.config.isScale,
      );
    }

    const root = this._card && this._card.shadowRoot;
    this._arcId = root ? root.getElementById('arc-'.concat(this.toolId)) : null;

    this._firstUpdatedCalled = true;

    this._segmentedArcScale?.firstUpdated(changedProperties);

    if (this.skipOriginal) {
      if (this.dev.debug) {
        console.log(
          'RENDERNEW - firstUpdated IN with _arcId/id/isScale/scale/connected',
          this._arcId,
          this.toolId,
          this.config.isScale,
          this._segmentedArcScale,
          this._card.connected,
        );
      }

      if (!this.config.isScale) this._stateValuePrev = null;
      this._initialDraw = true;
      this._card.requestUpdate();
    }
  }

  updated(changedProperties) {
    if (this.dev.debug) console.log('SegmentedArcTool - updated IN');
  }

  render() {
    if (this.dev.debug) console.log('SegmentedArcTool RENDERNEW - Render IN');

    return svg`
      <g id="arc-${this.toolId}"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
      >
        <g>
          ${this._renderSegments()}
        </g>
        ${this._renderScale()}
      </g>
    `;
  }

  _renderScale() {
    if (this._segmentedArcScale) {
      return this._segmentedArcScale.render();
    }

    return svg``;
  }

  _renderSegments() {
    if (this.skipOriginal) {
      let arcEnd;
      let arcEndPrev;
      const arcWidth = this.svg.width;
      const arcRadiusX = this.svg.radiusX;
      const arcRadiusY = this.svg.radiusY;

      let d;

      if (this.dev.debug) {
        console.log('RENDERNEW - IN _arcId, firstUpdatedCalled', this._arcId, this._firstUpdatedCalled);
      }

      const val = Utils.calculateValueBetween(
        this.config.scale.min,
        this.config.scale.max,
        this._stateValue,
      );
      const valPrev = Utils.calculateValueBetween(
        this.config.scale.min,
        this.config.scale.max,
        this._stateValuePrev,
      );

      if (this.dev.debug) {
        if (!this._stateValuePrev) {
          console.log('*****UNDEFINED', this._stateValue, this._stateValuePrev, valPrev);
        }
      }

      if (val !== valPrev) {
        if (this.dev.debug) {
          console.log('RENDERNEW _renderSegments diff value old new', this.toolId, valPrev, val);
        }
      }

      arcEnd = (val * this._arc.size * this._arc.direction) + this.config.position.start_angle;
      arcEndPrev = (valPrev * this._arc.size * this._arc.direction) + this.config.position.start_angle;

      const svgItems = [];

      if (!this.config.isScale) {
        for (let k = 0; k < this._segmentAngles.length; k++) {
          d = this.buildArcPath(
            this._segmentAngles[k].drawStart,
            this._segmentAngles[k].drawEnd,
            this._arc.clockwise,
            this.svg.radiusX,
            this.svg.radiusY,
            this.svg.width,
          );

          svgItems.push(svg`<path id="arc-segment-bg-${this.toolId}-${k}" class="sak-segarc__background"
                              style="${styleMap(this.config.styles.background)}"
                              d="${d}"
                              />`);
        }
      }

      if (this._firstUpdatedCalled) {
        if (this.dev.debug) {
          console.log('RENDERNEW _arcId DOES exist', this._arcId, this.toolId, this._firstUpdatedCalled);
        }

        this._cache.forEach((item, index) => {
          d = item;

          if (this.config.isScale) {
            let fill = this.config.color;

            if (this.config.show.style === 'colorlist') {
              fill = this.config.segments.colorlist.colors[index];
            }

            if (this.config.show.style === 'colorstops') {
              fill = this._segments.colorStops[this._segments.sortedStops[index]];
            }

            if (!this.styles.foreground[index]) {
              this.styles.foreground[index] = Merge.mergeDeep(this.config.styles.foreground);
            }

            this.styles.foreground[index].fill = fill;
          }

          svgItems.push(svg`<path id="arc-segment-${this.toolId}-${index}" class="sak-segarc__foreground"
                            style="${styleMap(this.styles.foreground[index])}"
                            d="${d}"
                            />`);
        });

        const tween = {};

        function animateSegmentsNEW(timestamp, thisTool) {
          // eslint-disable-next-line no-plusplus
          const easeOut = (progress) => --progress ** 5 + 1;

          let frameSegment;
          let runningSegment;

          var timestamp = timestamp || new Date().getTime();

          if (!tween.startTime) {
            tween.startTime = timestamp;
            tween.runningAngle = tween.fromAngle;
          }

          if (thisTool.dev && thisTool.dev.debug) {
            console.log('RENDERNEW - in animateSegmentsNEW', thisTool.toolId, tween);
          }

          const runtime = timestamp - tween.startTime;

          tween.progress = Math.min(runtime / tween.duration, 1);
          tween.progress = easeOut(tween.progress);

          const increase = (
            thisTool._arc.clockwise
              ? tween.toAngle > tween.fromAngle
              : tween.fromAngle > tween.toAngle
          );

          tween.frameAngle = tween.fromAngle + ((tween.toAngle - tween.fromAngle) * tween.progress);

          frameSegment = thisTool._segmentAngles.findIndex((currentValue) => (thisTool._arc.clockwise
            ? ((tween.frameAngle <= currentValue.boundsEnd) && (tween.frameAngle >= currentValue.boundsStart))
            : ((tween.frameAngle <= currentValue.boundsStart) && (tween.frameAngle >= currentValue.boundsEnd))));

          if (frameSegment === -1) {
            console.log('RENDERNEW animateSegments frameAngle not found', tween, thisTool._segmentAngles);
            console.log('config', thisTool.config);
          }

          runningSegment = thisTool._segmentAngles.findIndex((currentValue) => (thisTool._arc.clockwise
            ? ((tween.runningAngle <= currentValue.boundsEnd) && (tween.runningAngle >= currentValue.boundsStart))
            : ((tween.runningAngle <= currentValue.boundsStart) && (tween.runningAngle >= currentValue.boundsEnd))));

          if (runningSegment === -1) {
            if (thisTool.dev && thisTool.dev.debug) {
              console.log(
                'RENDERNEW animateSegments runningSegment not found',
                tween,
                thisTool._segmentAngles,
              );
            }

            tween.runningAngle = tween.frameAngle;
            return;
          }

          do {
            const aniStartAngle = thisTool._segmentAngles[runningSegment].drawStart;
            var runningSegmentAngle = thisTool._arc.clockwise
              ? Math.min(thisTool._segmentAngles[runningSegment].boundsEnd, tween.frameAngle)
              : Math.max(thisTool._segmentAngles[runningSegment].boundsEnd, tween.frameAngle);
            const aniEndAngle = thisTool._arc.clockwise
              ? Math.min(thisTool._segmentAngles[runningSegment].drawEnd, tween.frameAngle)
              : Math.max(thisTool._segmentAngles[runningSegment].drawEnd, tween.frameAngle);

            d = thisTool.buildArcPath(
              aniStartAngle,
              aniEndAngle,
              thisTool._arc.clockwise,
              arcRadiusX,
              arcRadiusY,
              arcWidth,
            );

            if (!thisTool.myarc) thisTool.myarc = {};
            if (!thisTool.as) thisTool.as = {};

            let as;
            const myarc = 'arc-segment-'.concat(thisTool.toolId).concat('-').concat(runningSegment);

            if (!thisTool.as[runningSegment]) {
              thisTool.as[runningSegment] = thisTool._card.shadowRoot.getElementById(myarc);
            }

            as = thisTool.as[runningSegment];

            thisTool.myarc[runningSegment] = myarc;

            if (as) {
              as.setAttribute('d', d);

              if (thisTool.config.show.style === 'colorlist') {
                as.style.fill = thisTool.config.segments.colorlist.colors[runningSegment];
                thisTool.styles.foreground[runningSegment].fill = thisTool.config.segments.colorlist.colors[runningSegment];
              }

              if (thisTool.config.show.lastcolor) {
                var fill;

                const boundsStart = thisTool._arc.clockwise
                  ? thisTool._segmentAngles[runningSegment].drawStart
                  : thisTool._segmentAngles[runningSegment].drawEnd;
                const boundsEnd = thisTool._arc.clockwise
                  ? thisTool._segmentAngles[runningSegment].drawEnd
                  : thisTool._segmentAngles[runningSegment].drawStart;
                const value = Math.min(Math.max(0, (runningSegmentAngle - boundsStart) / (boundsEnd - boundsStart)), 1);

                if (thisTool.config.show.style === 'colorstops') {
                  fill = Colors.getGradientValue(
                    thisTool._segments.colorStops[thisTool._segments.sortedStops[runningSegment]],
                    thisTool._segments.colorStops[thisTool._segments.sortedStops[runningSegment]],
                    value,
                  );
                } else if (thisTool.config.show.style === 'colorlist') {
                  fill = thisTool.config.segments.colorlist.colors[runningSegment];
                }

                thisTool.styles.foreground[0].fill = fill;
                thisTool.as[0].style.fill = fill;

                if (runningSegment > 0) {
                  for (let j = runningSegment; j >= 0; j--) {
                    if (thisTool.styles.foreground[j].fill !== fill) {
                      thisTool.styles.foreground[j].fill = fill;
                      thisTool.as[j].style.fill = fill;
                    }

                    thisTool.styles.foreground[j].fill = fill;
                    thisTool.as[j].style.fill = fill;
                  }
                }
              }
            }

            thisTool._cache[runningSegment] = d;

            if (tween.frameAngle !== runningSegmentAngle) {
              runningSegmentAngle += (0.000001 * thisTool._arc.direction);
            }

            var runningSegmentPrev = runningSegment;

            runningSegment = thisTool._segmentAngles.findIndex((currentValue) => (thisTool._arc.clockwise
              ? ((runningSegmentAngle <= currentValue.boundsEnd) && (runningSegmentAngle >= currentValue.boundsStart))
              : ((runningSegmentAngle <= currentValue.boundsStart) && (runningSegmentAngle >= currentValue.boundsEnd))));

            if (!increase && as) {
              if (runningSegmentPrev !== runningSegment) {
                if (thisTool.dev && thisTool.dev.debug) {
                  console.log('RENDERNEW movit - remove path', thisTool.toolId, runningSegmentPrev);
                }

                as.removeAttribute('d');
                thisTool._cache[runningSegmentPrev] = null;
              }
            }

            tween.runningAngle = runningSegmentAngle;

            if (thisTool.dev && thisTool.dev.debug) {
              console.log(
                'RENDERNEW - animation loop tween',
                thisTool.toolId,
                tween,
                runningSegment,
                runningSegmentPrev,
              );
            }
          } while (tween.runningAngle !== tween.frameAngle);

          if (tween.progress !== 1) {
            thisTool.rAFid = requestAnimationFrame((timestamp) => {
              animateSegmentsNEW(timestamp, thisTool);
            });
          } else {
            tween.startTime = null;

            if (thisTool.dev && thisTool.dev.debug) {
              console.log(
                'RENDERNEW - animation loop ENDING tween',
                thisTool.toolId,
                tween,
              );
            }
          }
        }

        const mySelf = this;

        if (
          this._card.connected === true
          && this._renderTo !== this._stateValue
        ) {
          this._renderTo = this._stateValue;

          if (this.rAFid) {
            cancelAnimationFrame(this.rAFid);
          }

          tween.fromAngle = arcEndPrev;
          tween.toAngle = arcEnd;
          tween.runningAngle = arcEndPrev;

          // eslint-disable-next-line no-constant-condition
          if (true || !(arcEnd === arcEndPrev)) {
            tween.duration = Math.min(
              Math.max(
                this._initialDraw ? 100 : 500,
                this._initialDraw ? 16 : this.config.animation.duration * 1000,
              ),
              5000,
            );

            tween.startTime = null;

            if (this.dev.debug) console.log('RENDERNEW - tween', this.toolId, tween);

            this.rAFid = requestAnimationFrame((timestamp) => {
              animateSegmentsNEW(timestamp, mySelf);
            });

            this._initialDraw = false;
          }
        }

        return svg`${svgItems}`;
      }
            if (this.dev.debug) {
        console.log('RENDERNEW _arcId does NOT exist', this._arcId, this.toolId);
      }

      for (let i = 0; i < this._segmentAngles.length; i++) {
        d = this.buildArcPath(
          this._segmentAngles[i].drawStart,
          this._segmentAngles[i].drawEnd,
          this._arc.clockwise,
          this.svg.radiusX,
          this.svg.radiusY,
          this.config.isScale ? this.svg.width : 0,
        );

        this._cache[i] = d;

        let fill = this.config.color;

        if (this.config.show.style === 'colorlist') {
          fill = this.config.segments.colorlist.colors[i];
        }

        if (this.config.show.style === 'colorstops') {
          fill = this._segments.colorStops[this._segments.sortedStops[i]];
        }

        if (!this.styles.foreground) {
          this.styles.foreground = {};
        }

        if (!this.styles.foreground[i]) {
          this.styles.foreground[i] = Merge.mergeDeep(this.config.styles.foreground);
        }

        this.styles.foreground[i].fill = fill;

        if (this.config.show.lastcolor) {
          if (i > 0) {
            for (let j = i - 1; j > 0; j--) {
              this.styles.foreground[j].fill = fill;
            }
          }
        }

        svgItems.push(svg`<path id="arc-segment-${this.toolId}-${i}" class="arc__segment"
                          style="${styleMap(this.styles.foreground[i])}"
                          d="${d}"
                          />`);
      }

      if (this.dev.debug) console.log('RENDERNEW - svgItems', svgItems, this._firstUpdatedCalled);

      return svg`${svgItems}`;
    }

    return svg``;
  }

  polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radiusX * Math.cos(angleInRadians)),
      y: centerY + (radiusY * Math.sin(angleInRadians)),
    };
  }

  buildArcPath(argStartAngle, argEndAngle, argClockwise, argRadiusX, argRadiusY, argWidth) {
    const start = this.polarToCartesian(this.svg.cx, this.svg.cy, argRadiusX, argRadiusY, argEndAngle);
    const end = this.polarToCartesian(this.svg.cx, this.svg.cy, argRadiusX, argRadiusY, argStartAngle);
    const largeArcFlag = Math.abs(argEndAngle - argStartAngle) <= 180 ? '0' : '1';

    const sweepFlag = argClockwise ? '0' : '1';

    const cutoutRadiusX = argRadiusX - argWidth;
    const cutoutRadiusY = argRadiusY - argWidth;
    const start2 = this.polarToCartesian(this.svg.cx, this.svg.cy, cutoutRadiusX, cutoutRadiusY, argEndAngle);
    const end2 = this.polarToCartesian(this.svg.cx, this.svg.cy, cutoutRadiusX, cutoutRadiusY, argStartAngle);

    const d = [
      'M', start.x, start.y,
      'A', argRadiusX, argRadiusY, 0, largeArcFlag, sweepFlag, end.x, end.y,
      'L', end2.x, end2.y,
      'A', cutoutRadiusX, cutoutRadiusY, 0, largeArcFlag, sweepFlag === '0' ? '1' : '0', start2.x, start2.y,
      'Z',
    ].join(' ');

    return d;
  }
}
