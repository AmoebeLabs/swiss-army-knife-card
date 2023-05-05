import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import BaseTool from './basetool';
import Utils from './utils';

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
      },
      color: 'var(--primary-color)',
      classes: {
        tool: {
        },
        foreground: {
        },
        background: {
        },
      },
      styles: {
        foreground: {
        },
        background: {
        },
      },
      segments: {},
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

    super(argToolset, Merge.mergeDeep(DEFAULT_SEGARC_CONFIG, argConfig), argPos);

    if (this.dev.performance) console.time(`--> ${this.toolId} PERFORMANCE SegmentedArcTool::constructor`);

    this.svg.radius = Utils.calculateSvgDimension(argConfig.position.radius);
    this.svg.radiusX = Utils.calculateSvgDimension(argConfig.position.radius_x || argConfig.position.radius);
    this.svg.radiusY = Utils.calculateSvgDimension(argConfig.position.radius_y || argConfig.position.radius);

    this.svg.segments = {};
    // #TODO:
    // Get gap from colorlist, colorstop or something else. Not from the default segments gap.
    this.svg.segments.gap = Utils.calculateSvgDimension(this.config.segments.gap);
    this.svg.scale_offset = Utils.calculateSvgDimension(this.config.scale.offset);

    // Added for confusion???????
    this._firstUpdatedCalled = false;

    // Remember the values to be able to render from/to
    this._stateValue = null;
    this._stateValuePrev = null;
    this._stateValueIsDirty = false;
    this._renderFrom = null;
    this._renderTo = null;

    this.rAFid = null;
    this.cancelAnimation = false;

    this.arcId = null;

    // Cache path (d= value) of segments drawn in map by segment index (counter). Simple array.
    this._cache = [];

    this._segmentAngles = [];
    this._segments = {};

    // Precalculate segments with start and end angle!
    this._arc = {};
    this._arc.size = Math.abs(this.config.position.end_angle - this.config.position.start_angle);
    this._arc.clockwise = this.config.position.end_angle > this.config.position.start_angle;
    this._arc.direction = this._arc.clockwise ? 1 : -1;

    let tcolorlist = {};
    let colorlist = null;
    // New template testing for colorstops
    if (this.config.segments.colorlist?.template) {
      colorlist = this.config.segments.colorlist;
      if (this._card.lovelace.config.sak_user_templates.templates[colorlist.template.name]) {
        if (this.dev.debug) console.log('SegmentedArcTool::constructor - templates colorlist found', colorlist.template.name);
        tcolorlist = Templates.replaceVariables2(colorlist.template.variables, this._card.lovelace.config.sak_user_templates.templates[colorlist.template.name]);
        this.config.segments.colorlist = tcolorlist;
      }
    }

    // FIXEDCOLOR
    if (this.config.show.style === 'fixedcolor') {

    // COLORLIST
    } else if (this.config.show.style === 'colorlist') {
      // Get number of segments, and their size in degrees.
      this._segments.count = this.config.segments.colorlist.colors.length;
      this._segments.size = this._arc.size / this._segments.count;
      this._segments.gap = (this.config.segments.colorlist.gap !== 'undefined') ? this.config.segments.colorlist.gap : 1;
      this._segments.sizeList = [];
      for (var i = 0; i < this._segments.count; i++) {
        this._segments.sizeList[i] = this._segments.size;
      }

      // Use a running total for the size of the segments...
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

    // COLORSTOPS
    } else if (this.config.show.style === 'colorstops') {
      // Get colorstops, remove outliers and make a key/value store...

      this._segments.colorStops = {};
      Object.keys(this.config.segments.colorstops.colors).forEach((key) => {
        if ((key >= this.config.scale.min)
              && (key <= this.config.scale.max))
          this._segments.colorStops[key] = this.config.segments.colorstops.colors[key];
      });

      this._segments.sortedStops = Object.keys(this._segments.colorStops).map((n) => Number(n)).sort((a, b) => a - b);

      // Insert extra stopcolor for max scale if not defined. Otherwise color calculations won't work as expected...
      if (typeof (this._segments.colorStops[this.config.scale.max]) === 'undefined') {
        this._segments.colorStops[this.config.scale.max] = this._segments.colorStops[this._segments.sortedStops[this._segments.sortedStops.length - 1]];
        this._segments.sortedStops = Object.keys(this._segments.colorStops).map((n) => Number(n)).sort((a, b) => a - b);
      }

      this._segments.count = this._segments.sortedStops.length - 1;
      this._segments.gap = this.config.segments.colorstops.gap !== 'undefined' ? this.config.segments.colorstops.gap : 1;

      // Now depending on the colorstops and min/max values, calculate the size of each segment relative to the total arc size.
      // First color in the list starts from Min!

      let runningColorStop = this.config.scale.min;
      const scaleRange = this.config.scale.max - this.config.scale.min;
      this._segments.sizeList = [];
      for (var i = 0; i < this._segments.count; i++) {
        const colorSize = this._segments.sortedStops[i + 1] - runningColorStop;
        runningColorStop += colorSize;
        // Calculate fraction [0..1] of colorSize of min/max scale range
        const fraction = colorSize / scaleRange;
        const angleSize = fraction * this._arc.size;
        this._segments.sizeList[i] = angleSize;
      }

      // Use a running total for the size of the segments...
      var segmentRunningSize = 0;
      for (var i = 0; i < this._segments.count; i++) {
        this._segmentAngles[i] = {
          boundsStart: this.config.position.start_angle + (segmentRunningSize * this._arc.direction),
          boundsEnd: this.config.position.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction),
          drawStart: this.config.position.start_angle + (segmentRunningSize * this._arc.direction) + (this._segments.gap * this._arc.direction),
          drawEnd: this.config.position.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction) - (this._segments.gap * this._arc.direction),
        };
        segmentRunningSize += this._segments.sizeList[i];
        if (this.dev.debug) console.log('colorstuff - COLORSTOPS++ segments', segmentRunningSize, this._segmentAngles[i]);
      }

      if (this.dev.debug) console.log('colorstuff - COLORSTOPS++', this._segments, this._segmentAngles, this._arc.direction, this._segments.count);

    // SIMPLEGRADIENT
    } else if (this.config.show.style === 'simplegradient') {
    }

    // Just dump to console for verification. Nothing is used yet of the new calculation method...

    if (this.config.isScale) {
      this._stateValue = this.config.scale.max;
      // this.config.show.scale = false;
    } else {
      // Nope. I'm the main arc. Check if a scale is defined and clone myself with some options...
      if (this.config.show.scale) {
        const scaleConfig = Merge.mergeDeep(this.config);
        scaleConfig.id += '-scale';

        // Cloning done. Now set specific scale options.
        scaleConfig.show.scale = false;
        scaleConfig.isScale = true;
        scaleConfig.position.width = this.config.scale.width;
        scaleConfig.position.radius = this.config.position.radius - (this.config.position.width / 2) + (scaleConfig.position.width / 2) + (this.config.scale.offset);
        scaleConfig.position.radius_x = ((this.config.position.radius_x || this.config.position.radius)) - (this.config.position.width / 2) + (scaleConfig.position.width / 2) + (this.config.scale.offset);
        scaleConfig.position.radius_y = ((this.config.position.radius_y || this.config.position.radius)) - (this.config.position.width / 2) + (scaleConfig.position.width / 2) + (this.config.scale.offset);

        this._segmentedArcScale = new SegmentedArcTool(this, scaleConfig, argPos);
      } else {
        this._segmentedArcScale = null;
      }
    }

    // testing. use below two lines and sckip the calculation of the segmentAngles. Those are done above with different calculation...
    this.skipOriginal = ((this.config.show.style === 'colorstops') || (this.config.show.style === 'colorlist'));

    // Set scale to new value. Never changes of course!!
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
          boundsEnd: this.config.position.start_angle + ((i + 0) * this.config.segments.dash * this._arc.direction)
                                          + (this._arc.partsPartialSize * this._arc.direction),

          drawStart: this.config.position.start_angle + (i * this.config.segments.dash * this._arc.direction) + (this.config.segments.gap * this._arc.direction),
          drawEnd: this.config.position.start_angle + ((i + 0) * this.config.segments.dash * this._arc.direction)
                                          + (this._arc.partsPartialSize * this._arc.direction) - (this.config.segments.gap * this._arc.direction),
        };
      }
    }

    this.starttime = null;

    if (this.dev.debug) console.log('SegmentedArcTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
    if (this.dev.debug) console.log('SegmentedArcTool - init', this.toolId, this.config.isScale, this._segmentAngles);

    if (this.dev.performance) console.timeEnd(`--> ${this.toolId} PERFORMANCE SegmentedArcTool::constructor`);
  }

  // SegmentedArcTool::objectId
  get objectId() {
    return this.toolId;
  }

  // SegmentedArcTool::value
  set value(state) {
    if (this.dev.debug) console.log('SegmentedArcTool - set value IN');

    if (this.config.isScale) return false;

    if (this._stateValue === state) return false;

    const changed = super.value = state;

    return changed;
  }

  // SegmentedArcTool::firstUpdated
  // Me is updated. Get arc id for animations...
  firstUpdated(changedProperties) {
    if (this.dev.debug) console.log('SegmentedArcTool - firstUpdated IN with _arcId/id', this._arcId, this.toolId, this.config.isScale);
    this._arcId = this._card.shadowRoot.getElementById('arc-'.concat(this.toolId));

    this._firstUpdatedCalled = true;

    // Just a try.
    //
    // was this a bug. The scale was never called with updated. Hence always no arcId...
    this._segmentedArcScale?.firstUpdated(changedProperties);

    if (this.skipOriginal) {
      if (this.dev.debug) console.log('RENDERNEW - firstUpdated IN with _arcId/id/isScale/scale/connected', this._arcId, this.toolId, this.config.isScale, this._segmentedArcScale, this._card.connected);
      if (!this.config.isScale) this._stateValuePrev = null;
      this._initialDraw = true;
      this._card.requestUpdate();
    }
  }

  // SegmentedArcTool::updated

  updated(changedProperties) {
    if (this.dev.debug) console.log('SegmentedArcTool - updated IN');
  }

  // SegmentedArcTool::render

  render() {
    if (this.dev.debug) console.log('SegmentedArcTool RENDERNEW - Render IN');
    return svg`
      <g "" id="arc-${this.toolId}" class="arc">
        <g >
          ${this._renderSegments()}
          </g>
        ${this._renderScale()}
      </g>
    `;
  }

  _renderScale() {
    if (this._segmentedArcScale) return this._segmentedArcScale.render();
  }

  _renderSegments() {
    // migrate to new solution to draw segmented arc...

    if (this.skipOriginal) {
      // Here we can rebuild all needed. Much will be the same I guess...

      let arcEnd;
      let arcEndPrev;
      const arcWidth = this.svg.width;
      const arcRadiusX = this.svg.radiusX;
      const arcRadiusY = this.svg.radiusY;

      let d;

      if (this.dev.debug) console.log('RENDERNEW - IN _arcId, firstUpdatedCalled', this._arcId, this._firstUpdatedCalled);
      // calculate real end angle depending on value set in object and min/max scale
      const val = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, this._stateValue);
      const valPrev = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, this._stateValuePrev);
      if (this.dev.debug) if (!this._stateValuePrev) console.log('*****UNDEFINED', this._stateValue, this._stateValuePrev, valPrev);
      if (val !== valPrev) if (this.dev.debug) console.log('RENDERNEW _renderSegments diff value old new', this.toolId, valPrev, val);

      arcEnd = (val * this._arc.size * this._arc.direction) + this.config.position.start_angle;
      arcEndPrev = (valPrev * this._arc.size * this._arc.direction) + this.config.position.start_angle;

      const svgItems = [];

      // NO background needed for drawing scale...
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

      // Check if arcId does exist
      if (this._firstUpdatedCalled) {
        //      if ((this._arcId)) {
        if (this.dev.debug) console.log('RENDERNEW _arcId DOES exist', this._arcId, this.toolId, this._firstUpdatedCalled);

        // Render current from cache
        this._cache.forEach((item, index) => {
          d = item;

          // extra, set color from colorlist as a test
          if (this.config.isScale) {
            let fill = this.config.color;
            if (this.config.show.style === 'colorlist') {
              fill = this.config.segments.colorlist.colors[index];
            }
            if (this.config.show.style === 'colorstops') {
              fill = this._segments.colorStops[this._segments.sortedStops[index]];
              // stroke = this.config.segments.colorstops.stroke ? this._segments.colorStops[this._segments.sortedStops[index]] : '';
            }

            if (!this.styles.foreground[index]) {
              this.styles.foreground[index] = Merge.mergeDeep(this.config.styles.foreground);
            }

            this.styles.foreground[index].fill = fill;
            // this.styles.foreground[index]['stroke'] = stroke;
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

          if (thisTool.debug) console.log('RENDERNEW - in animateSegmentsNEW', thisTool.toolId, tween);

          const runtime = timestamp - tween.startTime;
          tween.progress = Math.min(runtime / tween.duration, 1);
          tween.progress = easeOut(tween.progress);

          const increase = ((thisTool._arc.clockwise)
            ? (tween.toAngle > tween.fromAngle) : (tween.fromAngle > tween.toAngle));

          // Calculate where the animation angle should be now in this animation frame: angle and segment.
          tween.frameAngle = tween.fromAngle + ((tween.toAngle - tween.fromAngle) * tween.progress);
          frameSegment = thisTool._segmentAngles.findIndex((currentValue, index) => (thisTool._arc.clockwise
            ? ((tween.frameAngle <= currentValue.boundsEnd) && (tween.frameAngle >= currentValue.boundsStart))
            : ((tween.frameAngle <= currentValue.boundsStart) && (tween.frameAngle >= currentValue.boundsEnd))));

          if (frameSegment === -1) {
            /* if (thisTool.debug) */ console.log('RENDERNEW animateSegments frameAngle not found', tween, thisTool._segmentAngles);
            console.log('config', thisTool.config);
          }

          // Check where we actually are now. This might be in a different segment...
          runningSegment = thisTool._segmentAngles.findIndex((currentValue, index) => (thisTool._arc.clockwise
            ? ((tween.runningAngle <= currentValue.boundsEnd) && (tween.runningAngle >= currentValue.boundsStart))
            : ((tween.runningAngle <= currentValue.boundsStart) && (tween.runningAngle >= currentValue.boundsEnd))));

          // Weird stuff. runningSegment is sometimes -1. Ie not FOUND !! WTF??
          // if (runningSegment == -1) runningSegment = 0;

          // Do render segments until the animation angle is at the requested animation frame angle.
          do {
            const aniStartAngle = thisTool._segmentAngles[runningSegment].drawStart;
            var runningSegmentAngle = thisTool._arc.clockwise
              ? Math.min(thisTool._segmentAngles[runningSegment].boundsEnd, tween.frameAngle)
              : Math.max(thisTool._segmentAngles[runningSegment].boundsEnd, tween.frameAngle);
            const aniEndAngle = thisTool._arc.clockwise
              ? Math.min(thisTool._segmentAngles[runningSegment].drawEnd, tween.frameAngle)
              : Math.max(thisTool._segmentAngles[runningSegment].drawEnd, tween.frameAngle);
              // First phase. Just draw and ignore segments...
            d = thisTool.buildArcPath(aniStartAngle, aniEndAngle, thisTool._arc.clockwise, arcRadiusX, arcRadiusY, arcWidth);

            if (!thisTool.myarc) thisTool.myarc = {};
            if (!thisTool.as) thisTool.as = {};

            let as;
            const myarc = 'arc-segment-'.concat(thisTool.toolId).concat('-').concat(runningSegment);
            // as = thisTool._card.shadowRoot.getElementById(myarc);
            if (!thisTool.as[runningSegment])
              thisTool.as[runningSegment] = thisTool._card.shadowRoot.getElementById(myarc);
            as = thisTool.as[runningSegment];
            // Extra. Remember id's and references
            // Quick hack...
            thisTool.myarc[runningSegment] = myarc;
            // thisTool.as[runningSegment] = as;

            if (as) {
              // var e = as.getAttribute("d");
              as.setAttribute('d', d);

              // We also have to set the style fill if the color stops and gradients are implemented
              // As we're using styles, attributes won't work. Must use as.style.fill = 'calculated color'
              // #TODO
              // Can't use gradients probably because of custom path. Conic-gradient would be fine.
              //
              // First try...
              if (thisTool.config.show.style === 'colorlist') {
                as.style.fill = thisTool.config.segments.colorlist.colors[runningSegment];
                thisTool.styles.foreground[runningSegment].fill = thisTool.config.segments.colorlist.colors[runningSegment];
              }
              // #WIP
              // Testing 'lastcolor'
              if (thisTool.config.show.lastcolor) {
                var fill;

                const boundsStart = thisTool._arc.clockwise
                  ? (thisTool._segmentAngles[runningSegment].drawStart)
                  : (thisTool._segmentAngles[runningSegment].drawEnd);
                const boundsEnd = thisTool._arc.clockwise
                  ? (thisTool._segmentAngles[runningSegment].drawEnd)
                  : (thisTool._segmentAngles[runningSegment].drawStart);
                const value = Math.min(Math.max(0, (runningSegmentAngle - boundsStart) / (boundsEnd - boundsStart)), 1);
                // 2022.07.03 Fixing lastcolor for true stop
                if (thisTool.config.show.style === 'colorstops') {
                  fill = thisTool._card._getGradientValue(
                    thisTool._segments.colorStops[thisTool._segments.sortedStops[runningSegment]],
                    thisTool._segments.colorStops[thisTool._segments.sortedStops[runningSegment]],
                    value,
                  );
                } else {
                  // 2022.07.12 Fix bug as this is no colorstops, but a colorlist!!!!
                  if (thisTool.config.show.style === 'colorlist') {
                    fill = thisTool.config.segments.colorlist.colors[runningSegment];
                  }
                }

                thisTool.styles.foreground[0].fill = fill;
                thisTool.as[0].style.fill = fill;

                if (runningSegment > 0) {
                  for (let j = runningSegment; j >= 0; j--) { // +1
                    if (thisTool.styles.foreground[j].fill !== fill) {
                      thisTool.styles.foreground[j].fill = fill;
                      thisTool.as[j].style.fill = fill;
                    }
                    thisTool.styles.foreground[j].fill = fill;
                    thisTool.as[j].style.fill = fill;
                  }
                } else {
                }
              }
            }
            thisTool._cache[runningSegment] = d;

            // If at end of animation, don't do the add to force going to next segment
            if (tween.frameAngle !== runningSegmentAngle) {
              runningSegmentAngle += (0.000001 * thisTool._arc.direction);
            }

            var runningSegmentPrev = runningSegment;
            runningSegment = thisTool._segmentAngles.findIndex((currentValue, index) => (thisTool._arc.clockwise
              ? ((runningSegmentAngle <= currentValue.boundsEnd) && (runningSegmentAngle >= currentValue.boundsStart))
              : ((runningSegmentAngle <= currentValue.boundsStart) && (runningSegmentAngle >= currentValue.boundsEnd))));

            if (!increase) {
              if (runningSegmentPrev !== runningSegment) {
                if (thisTool.debug) console.log('RENDERNEW movit - remove path', thisTool.toolId, runningSegmentPrev);
                if (thisTool._arc.clockwise) {
                  as.removeAttribute('d');
                  thisTool._cache[runningSegmentPrev] = null;
                } else {
                  as.removeAttribute('d');
                  thisTool._cache[runningSegmentPrev] = null;
                }
              }
            }
            tween.runningAngle = runningSegmentAngle;
            if (thisTool.debug) console.log('RENDERNEW - animation loop tween', thisTool.toolId, tween, runningSegment, runningSegmentPrev);
          } while ((tween.runningAngle !== tween.frameAngle) /* && (runningSegment == runningSegmentPrev) */);

          // NTS @ 2020.10.14
          // In a fast paced animation - say 10msec - multiple segments should be drawn,
          //   while tween.progress already has the value of 1.
          // This means only the first segment is drawn - due to the "&& (runningSegment == runningSegmentPrev)" test above.
          // To fix this:
          // - either remove that test (why was it there????)... Or
          // - add the line "|| (runningSegment != runningSegmentPrev)" to the if() below to make sure another animation frame is requested
          //   although tween.progress == 1.
          if ((tween.progress !== 1) /* || (runningSegment != runningSegmentPrev) */) {
            thisTool.rAFid = requestAnimationFrame((timestamp) => {
              animateSegmentsNEW(timestamp, thisTool);
            });
          } else {
            tween.startTime = null;
            if (thisTool.debug) console.log('RENDERNEW - animation loop ENDING tween', thisTool.toolId, tween, runningSegment, runningSegmentPrev);
          }
        } // function animateSegmentsNEW

        const mySelf = this;
        // 2021.10.31
        // Edge case where brightness percentage is set to undefined (attribute is gone) if light is set to off.
        // Now if light is switched on again, the brightness is set to old value, and val and valPrev are the same again, so NO drawing!!!!!
        //
        // Remove test for val/valPrev...

        // Check if values changed and we should animate to another target then previously rendered
        if (/* (val != valPrev) && */ (this._card.connected === true) && (this._renderTo !== this._stateValue)) {
        // if ( (val != valPrev) && (this._card.connected == true) && (this._renderTo != this._stateValue)) {
          this._renderTo = this._stateValue;
          // if (this.dev.debug) console.log('RENDERNEW val != valPrev', val, valPrev, 'prev/end/cur', arcEndPrev, arcEnd, arcCur);

          // If previous animation active, cancel this one before starting a new one...
          if (this.rAFid) {
            // if (this.dev.debug) console.log('RENDERNEW canceling rAFid', this._card.cardId, this.toolId, 'rAFid', this.rAFid);
            cancelAnimationFrame(this.rAFid);
          }

          // Start new animation with calculated settings...
          // counter var not defined???
          // if (this.dev.debug) console.log('starting animationframe timer...', this._card.cardId, this.toolId, counter);
          tween.fromAngle = arcEndPrev;
          tween.toAngle = arcEnd;
          tween.runningAngle = arcEndPrev;

          // @2021.10.31
          // Handle edge case where - for some reason - arcEnd and arcEndPrev are equal.
          // Do NOT render anything in this case to prevent errors...

          // The check is removed temporarily. Brightness is again not shown for light. Still the same problem...

          if (true || !(arcEnd === arcEndPrev)) {
            // Render like an idiot the first time. Performs MUCH better @first load then having a zillion animations...
            // NOt so heavy on an average PC, but my iPad and iPhone need some more time for this!

            tween.duration = Math.min(Math.max(this._initialDraw ? 100 : 500, this._initialDraw ? 16 : this.config.animation.duration * 1000), 5000);
            tween.startTime = null;
            if (this.dev.debug) console.log('RENDERNEW - tween', this.toolId, tween);
            // this._initialDraw = false;
            this.rAFid = requestAnimationFrame((timestamp) => {
              animateSegmentsNEW(timestamp, mySelf);
            });
            this._initialDraw = false;
          }
        }

        return svg`${svgItems}`;
      } else {
        // Initial FIRST draw.
        // What if we 'abuse' the animation to do this, and we just create empty elements.
        // Then we don't have to do difficult things.
        // Just set some values to 0 and 'force' a full animation...
        //
        // Hmm. Stuff is not yet rendered, so DOM objects don't exist yet. How can we abuse the
        // animation function to do the drawing then??
        // --> Can use firstUpdated perhaps?? That was the first render, then do the first actual draw??
        //

        if (this.dev.debug) console.log('RENDERNEW _arcId does NOT exist', this._arcId, this.toolId);

        // Create empty elements, so no problem in animation function. All path's exist...
        // An empty element has a width of 0!
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

          // extra, set color from colorlist as a test
          let fill = this.config.color;
          if (this.config.show.style === 'colorlist') {
            fill = this.config.segments.colorlist.colors[i];
          }
          if (this.config.show.style === 'colorstops') {
            fill = this._segments.colorStops[this._segments.sortedStops[i]];
          }
          //                            style="${styleMap(this.config.styles.foreground)} fill: ${fill};"
          if (!this.styles.foreground) {
            this.styles.foreground = {};
          }
          if (!this.styles.foreground[i]) {
            this.styles.foreground[i] = Merge.mergeDeep(this.config.styles.foreground);
          }
          this.styles.foreground[i].fill = fill;

          // #WIP
          // Testing 'lastcolor'
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

    // END OF NEW METHOD OF RENDERING
    } else {
    }
  }

  polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radiusX * Math.cos(angleInRadians)),
      y: centerY + (radiusY * Math.sin(angleInRadians)),
    };
  }

  /*
   *
   * start = 10, end = 30, clockwise -> size is 20
   * start = 10, end = 30, anticlockwise -> size is (360 - 20) = 340
   *
   *
   */
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
} // END of class
