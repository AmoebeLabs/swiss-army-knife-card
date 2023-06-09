import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import Utils from './utils';
import BaseTool from './base-tool';
// eslint-disable-next-line object-curly-newline
import { angle360, range, round, clamp } from './const';

/** ****************************************************************************
  * CircularSliderTool::constructor class
  *
  * Summary.
  *
  */

export default class CircularSliderTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_ARCSLIDER_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        radius: 45,
        start_angle: 30,
        end_angle: 230,
        track: {
          width: 2,
        },
        active: {
          width: 4,
        },
        thumb: {
          height: 10,
          width: 10,
          radius: 5,
        },
        capture: {
          height: 25,
          width: 25,
          radius: 25,
        },
        label: {
          placement: 'none',
          cx: 10,
          cy: 10,
        },
      },
      show: {
        uom: 'end',
        active: false,
      },
      classes: {
        tool: {
          'sak-circslider': true,
          hover: true,
        },
        capture: {
          'sak-circslider__capture': true,
          hover: true,
        },
        active: {
          'sak-circslider__active': true,
        },
        track: {
          'sak-circslider__track': true,
        },
        thumb: {
          'sak-circslider__thumb': true,
          hover: true,
        },
        label: {
          'sak-circslider__value': true,
        },
        uom: {
          'sak-circslider__uom': true,
        },
      },
      styles: {
        tool: {
        },
        active: {
        },
        capture: {
        },
        track: {
        },
        thumb: {
        },
        label: {
        },
        uom: {
        },
      },
      scale: {
        min: 0,
        max: 100,
        step: 1,
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_ARCSLIDER_CONFIG, argConfig), argPos);

    this.svg.radius = Utils.calculateSvgDimension(this.config.position.radius);

    // Init arc settings
    this.arc = {};
    this.arc.startAngle = this.config.position.start_angle;
    this.arc.endAngle = this.config.position.end_angle;
    this.arc.size = range(this.config.position.end_angle, this.config.position.start_angle);
    this.arc.clockwise = this.config.position.end_angle > this.config.position.start_angle;
    this.arc.direction = this.arc.clockwise ? 1 : -1;
    this.arc.pathLength = 2 * this.arc.size / 360 * Math.PI * this.svg.radius;
    this.arc.arcLength = 2 * Math.PI * this.svg.radius;

    this.arc.startAngle360 = angle360(this.arc.startAngle, this.arc.startAngle, this.arc.endAngle);
    this.arc.endAngle360 = angle360(this.arc.startAngle, this.arc.endAngle, this.arc.endAngle);

    this.arc.startAngleSvgPoint = this.polarToCartesian(this.svg.cx, this.svg.cy, this.svg.radius, this.svg.radius, this.arc.startAngle360);
    this.arc.endAngleSvgPoint = this.polarToCartesian(this.svg.cx, this.svg.cy, this.svg.radius, this.svg.radius, this.arc.endAngle360);

    this.arc.scaleDasharray = 2 * this.arc.size / 360 * Math.PI * this.svg.radius;
    this.arc.dashOffset = this.arc.clockwise ? 0 : -this.arc.scaleDasharray - this.arc.arcLength;

    this.arc.currentAngle = this.arc.startAngle;

    this.svg.startAngle = this.config.position.start_angle;
    this.svg.endAngle = this.config.position.end_angle;
    this.svg.diffAngle = (this.config.position.end_angle - this.config.position.start_angle);

    // this.svg.pathLength = 2 * 260/360 * Math.PI * this.svg.radius;
    this.svg.pathLength = 2 * this.arc.size / 360 * Math.PI * this.svg.radius;
    this.svg.circleLength = 2 * Math.PI * this.svg.radius;

    this.svg.label = {};
    switch (this.config.position.label.placement) {
      case 'position':
        this.svg.label.cx = Utils.calculateSvgCoordinate(this.config.position.label.cx, 0);
        this.svg.label.cy = Utils.calculateSvgCoordinate(this.config.position.label.cy, 0);
        break;

      case 'thumb':
        this.svg.label.cx = this.svg.cx;
        this.svg.label.cy = this.svg.cy;
        break;

      case 'none':
        break;

      default:
        console.error('CircularSliderTool - constructor: invalid label placement [none, position, thumb] = ', this.config.position.label.placement);
        throw Error('CircularSliderTool::constructor - invalid label placement [none, position, thumb] = ', this.config.position.label.placement);
    }

    this.svg.track = {};
    this.svg.track.width = Utils.calculateSvgDimension(this.config.position.track.width);
    this.svg.active = {};
    this.svg.active.width = Utils.calculateSvgDimension(this.config.position.active.width);
    this.svg.thumb = {};
    this.svg.thumb.width = Utils.calculateSvgDimension(this.config.position.thumb.width);
    this.svg.thumb.height = Utils.calculateSvgDimension(this.config.position.thumb.height);
    this.svg.thumb.radius = Utils.calculateSvgDimension(this.config.position.thumb.radius);
    this.svg.thumb.cx = this.svg.cx;
    this.svg.thumb.cy = this.svg.cy;
    this.svg.thumb.x1 = this.svg.cx - this.svg.thumb.width / 2;
    this.svg.thumb.y1 = this.svg.cy - this.svg.thumb.height / 2;

    // This should be a moving capture element, larger than the thumb!!
    this.svg.capture = {};
    this.svg.capture.width = Utils.calculateSvgDimension(Math.max(this.config.position.capture.width, this.config.position.thumb.width * 1.2));
    this.svg.capture.height = Utils.calculateSvgDimension(Math.max(this.config.position.capture.height, this.config.position.thumb.height * 1.2));
    this.svg.capture.radius = Utils.calculateSvgDimension(this.config.position.capture.radius);
    this.svg.capture.x1 = this.svg.cx - this.svg.capture.width / 2;
    this.svg.capture.y1 = this.svg.cy - this.svg.capture.height / 2;

    // The CircularSliderTool is rotated around its svg base point. This is NOT the center of the circle!
    // Adjust x and y positions within the svg viewport to re-center the circle after rotating
    this.svg.rotate = {};
    this.svg.rotate.degrees = this.arc.clockwise ? (-90 + this.arc.startAngle) : (this.arc.endAngle360 - 90);
    this.svg.rotate.cx = this.svg.cx;
    this.svg.rotate.cy = this.svg.cy;

    // Init classes
    this.classes.track = {};
    this.classes.active = {};
    this.classes.thumb = {};
    this.classes.label = {};
    this.classes.uom = {};

    // Init styles
    this.styles.track = {};
    this.styles.active = {};
    this.styles.thumb = {};
    this.styles.label = {};
    this.styles.uom = {};

    // Init scale
    this.svg.scale = {};
    this.svg.scale.min = this.config.scale.min;
    this.svg.scale.max = this.config.scale.max;
    // this.svg.scale.min = myScale.min;
    // this.svg.scale.max = myScale.max;

    this.svg.scale.center = Math.abs(this.svg.scale.max - this.svg.scale.min) / 2 + this.svg.scale.min;
    this.svg.scale.svgPointMin = this.sliderValueToPoint(this.svg.scale.min);
    this.svg.scale.svgPointMax = this.sliderValueToPoint(this.svg.scale.max);
    this.svg.scale.svgPointCenter = this.sliderValueToPoint(this.svg.scale.center);
    this.svg.scale.step = this.config.scale.step;

    this.rid = null;

    // Hmmm. Does not help on safari to get the refresh ok. After data change, everything is ok!!
    this.thumbPos = this.sliderValueToPoint(this.config.scale.min);
    this.svg.thumb.x1 = this.thumbPos.x - this.svg.thumb.width / 2;
    this.svg.thumb.y1 = this.thumbPos.y - this.svg.thumb.height / 2;

    this.svg.capture.x1 = this.thumbPos.x - this.svg.capture.width / 2;
    this.svg.capture.y1 = this.thumbPos.y - this.svg.capture.height / 2;

    if (this.dev.debug) console.log('CircularSliderTool::constructor', this.config, this.svg);
  }

  // From roundSlider... https://github.com/soundar24/roundSlider/blob/master/src/roundslider.js

  // eslint-disable-next-line no-unused-vars
  pointToAngle360(point, center, isDrag) {
    const radian = Math.atan2(point.y - center.y, center.x - point.x);
    let angle = (-radian / (Math.PI / 180));
    // the angle value between -180 to 180.. so convert to a 360 angle
    angle += -90;

    if (angle < 0) angle += 360;

    // With this addition, the clockwise stuff, including passing 0 works. but anti clockwise stopped working!!
    if (this.arc.clockwise) if (angle < this.arc.startAngle360) angle += 360;

    // Yep. Should add another to get this working...
    if (!this.arc.clockwise) if (angle < this.arc.endAngle360) angle += 360;

    return angle;
  }

  isAngle360InBetween(argAngle) {
    let inBetween;
    if (this.arc.clockwise) {
      inBetween = ((argAngle >= this.arc.startAngle360) && (argAngle <= this.arc.endAngle360));
    } else {
      inBetween = ((argAngle <= this.arc.startAngle360) && (argAngle >= this.arc.endAngle360));
    }
    return !!inBetween;
  }

  polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radiusX * Math.cos(angleInRadians)),
      y: centerY + (radiusY * Math.sin(angleInRadians)),
    };
  }

  // SVGPoint deprecated. Use DOMPoint!!
  // DOMPoint.fromPoint(); ??? Or just keep using SVGPoint...
  pointToSliderValue(m) {
    let state;
    let scalePos;

    const center = {};
    center.x = this.svg.cx;
    center.y = this.svg.cy;
    const newAngle = this.pointToAngle360(m, center, true);
    let { myAngle } = this;

    const inBetween = this.isAngle360InBetween(newAngle);
    if (inBetween) {
      this.myAngle = newAngle;
      myAngle = newAngle;
      this.arc.currentAngle = myAngle;
    }

    this.arc.currentAngle = myAngle;
    if (this.arc.clockwise) scalePos = (myAngle - this.arc.startAngle360) / this.arc.size;
    if (!this.arc.clockwise) scalePos = (this.arc.startAngle360 - myAngle) / this.arc.size;

    state = ((this.config.scale.max - this.config.scale.min) * scalePos) + this.config.scale.min;
    state = Math.round(state / this.svg.scale.step) * this.svg.scale.step;
    state = Math.max(Math.min(this.config.scale.max, state), this.config.scale.min);

    this.arc.currentAngle = myAngle;

    if ((this.dragging) && (!inBetween)) {
      // Clip to max or min value
      state = round(this.svg.scale.min, state, this.svg.scale.max);
      this.m = this.sliderValueToPoint(state);
    }

    return state;
  }

  sliderValueToPoint(argValue) {
    let state = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, argValue);
    if (isNaN(state)) state = 0;
    let angle;
    if (this.arc.clockwise) {
      angle = (this.arc.size * state) + this.arc.startAngle360;
    } else {
      angle = (this.arc.size * (1 - state)) + this.arc.endAngle360;
    }

    if (angle < 0) angle += 360;
    const svgPoint = this.polarToCartesian(this.svg.cx, this.svg.cy, this.svg.radius, this.svg.radius, angle);

    this.arc.currentAngle = angle;

    return svgPoint;
  }

  updateValue(m) {
    this._value = this.pointToSliderValue(m);
    // set dist to 0 to cancel animation frame
    const dist = 0;
    // improvement
    if (Math.abs(dist) < 0.01) {
      if (this.rid) {
        window.cancelAnimationFrame(this.rid);
        this.rid = null;
      }
    }
  }

  updateThumb(m) {
    if (this.dragging) {
      this.thumbPos = this.sliderValueToPoint(this._value);
      this.svg.thumb.x1 = this.thumbPos.x - this.svg.thumb.width / 2;
      this.svg.thumb.y1 = this.thumbPos.y - this.svg.thumb.height / 2;

      this.svg.capture.x1 = this.thumbPos.x - this.svg.capture.width / 2;
      this.svg.capture.y1 = this.thumbPos.y - this.svg.capture.height / 2;

      const rotateStr = `rotate(${this.arc.currentAngle} ${this.svg.capture.width / 2} ${this.svg.capture.height / 2})`;
      this.elements.thumb.setAttribute('transform', rotateStr);

      this.elements.thumbGroup.setAttribute('x', this.svg.capture.x1);
      this.elements.thumbGroup.setAttribute('y', this.svg.capture.y1);
    }

    this.updateLabel(m);
  }

  // eslint-disable-next-line no-unused-vars
  updateActiveTrack(m) {
    const min = this.config.scale.min || 0;
    const max = this.config.scale.max || 100;
    let val = Utils.calculateValueBetween(min, max, this.labelValue);
    if (isNaN(val)) val = 0;
    const score = val * this.svg.pathLength;
    this.dashArray = `${score} ${this.svg.circleLength}`;

    if (this.dragging) {
      this.elements.activeTrack.setAttribute('stroke-dasharray', this.dashArray);
    }
  }

  updateLabel(m) {
    if (this.dev.debug) console.log('SLIDER - updateLabel start', m, this.config.position.orientation);

    // const dec = (this._card.config.entities[this.config.entity_index].decimals || 0);
    const dec = (this._card.config.entities[this.defaultEntityIndex()].decimals || 0);

    const x = 10 ** dec;
    this.labelValue2 = (Math.round(this.pointToSliderValue(m) * x) / x).toFixed(dec);
    console.log('updateLabel, labelvalue ', this.labelValue2);
    if (this.config.position.label.placement !== 'none') {
      this.elements.label.textContent = this.labelValue2;
    }
  }

  /*
  * mouseEventToPoint
  *
  * Translate mouse/touch client window coordinates to SVG window coordinates
  *
  */
  mouseEventToPoint(e) {
    let p = this.elements.svg.createSVGPoint();
    p.x = e.touches ? e.touches[0].clientX : e.clientX;
    p.y = e.touches ? e.touches[0].clientY : e.clientY;
    const ctm = this.elements.svg.getScreenCTM().inverse();
    p = p.matrixTransform(ctm);
    return p;
  }

  callDragService() {
    if (typeof this.labelValue2 === 'undefined') return;

    if (this.labelValuePrev !== this.labelValue2) {
      this.labelValuePrev = this.labelValue2;

      this._processTapEvent(
        this._card,
        this._card._hass,
        this.config,
        this.config.user_actions.tap_action,
        this._card.config.entities[this.defaultEntityIndex()]?.entity,
        this.labelValue2,
      );
    }
    if (this.dragging)
      this.timeOutId = setTimeout(() => this.callDragService(), this.config.user_actions.drag_action.update_interval);
  }

  callTapService() {
    if (typeof this.labelValue2 === 'undefined') return;

    this._processTapEvent(
      this._card,
      this._card._hass,
      this.config,
      this.config.user_actions?.tap_action,
      this._card.config.entities[this.defaultEntityIndex()]?.entity,
      this.labelValue2,
    );
  }

  // eslint-disable-next-line no-unused-vars
  firstUpdated(changedProperties) {
    this.labelValue = this._stateValue;

    function FrameArc() {
      this.rid = window.requestAnimationFrame(FrameArc);
      this.updateValue(this.m);
      this.updateThumb(this.m);
      this.updateActiveTrack(this.m);
    }

    if (this.dev.debug) console.log('circslider - firstUpdated');
    this.elements = {};
    this.elements.svg = this._card.shadowRoot.getElementById('circslider-'.concat(this.toolId));
    this.elements.track = this.elements.svg.querySelector('#track');
    this.elements.activeTrack = this.elements.svg.querySelector('#active-track');
    this.elements.capture = this.elements.svg.querySelector('#capture');
    this.elements.thumbGroup = this.elements.svg.querySelector('#thumb-group');
    this.elements.thumb = this.elements.svg.querySelector('#thumb');
    this.elements.label = this.elements.svg.querySelector('#label tspan');

    if (this.dev.debug) console.log('circslider - firstUpdated svg = ',
      this.elements.svg, 'activeTrack=', this.elements.activeTrack,
      'thumb=', this.elements.thumb, 'label=', this.elements.label, 'text=', this.elements.text,
    );

    const protectBorderPassing = () => {
      const diffMax = range(this.svg.scale.max, this.labelValue) <= this.rangeMax;
      const diffMin = range(this.svg.scale.min, this.labelValue) <= this.rangeMin;

      // passing borders from max to min...
      const fromMaxToMin = !!(diffMin && this.diffMax);
      const fromMinToMax = !!(diffMax && this.diffMin);
      if (fromMaxToMin) {
        this.labelValue = this.svg.scale.max;
        this.m = this.sliderValueToPoint(this.labelValue);
        this.rangeMax = this.svg.scale.max / 10;
        this.rangeMin = range(this.svg.scale.max, this.svg.scale.min + (this.svg.scale.max / 5));
      } else if (fromMinToMax) {
        this.labelValue = this.svg.scale.min;
        this.m = this.sliderValueToPoint(this.labelValue);
        this.rangeMax = range(this.svg.scale.min, this.svg.scale.max - (this.svg.scale.max / 5));
        this.rangeMin = this.svg.scale.max / 10;
      } else {
        this.diffMax = diffMax;
        this.diffMin = diffMin;
        this.rangeMin = (this.svg.scale.max / 5);
        this.rangeMax = (this.svg.scale.max / 5);
      }
    };

    const pointerMove = (e) => {
      e.preventDefault();

      if (this.dragging) {
        this.m = this.mouseEventToPoint(e);
        this.labelValue = this.pointToSliderValue(this.m);

        protectBorderPassing();

        FrameArc.call(this);
      }
    };

    const pointerDown = (e) => {
      e.preventDefault();

      // User is dragging the thumb of the slider!
      this.dragging = true;

      // NEW:
      // We use mouse stuff for pointerdown, but have to use pointer stuff to make sliding work on Safari. Why??
      window.addEventListener('pointermove', pointerMove, false);
      // eslint-disable-next-line no-use-before-define
      window.addEventListener('pointerup', pointerUp, false);

      // const mousePos = this.mouseEventToPoint(e);
      // console.log("pointerdown", mousePos, this.svg.thumb, this.m);

      // Check for drag_action. If none specified, or update_interval = 0, don't update while dragging...

      if ((this.config.user_actions?.drag_action) && (this.config.user_actions?.drag_action.update_interval)) {
        if (this.config.user_actions.drag_action.update_interval > 0) {
          this.timeOutId = setTimeout(() => this.callDragService(), this.config.user_actions.drag_action.update_interval);
        } else {
          this.timeOutId = null;
        }
      }
      this.m = this.mouseEventToPoint(e);
      this.labelValue = this.pointToSliderValue(this.m);

      protectBorderPassing();

      if (this.dev.debug) console.log('pointerDOWN', Math.round(this.m.x * 100) / 100);
      FrameArc.call(this);
    };

    const pointerUp = (e) => {
      e.preventDefault();
      if (this.dev.debug) console.log('pointerUP');

      window.removeEventListener('pointermove', pointerMove, false);
      window.removeEventListener('pointerup', pointerUp, false);

      window.removeEventListener('mousemove', pointerMove, false);
      window.removeEventListener('touchmove', pointerMove, false);
      window.removeEventListener('mouseup', pointerUp, false);
      window.removeEventListener('touchend', pointerUp, false);

      this.labelValuePrev = this.labelValue;

      // If we were not dragging, do check for passing border stuff!

      if (!this.dragging) {
        protectBorderPassing();
        return;
      }

      this.dragging = false;
      clearTimeout(this.timeOutId);
      this.timeOutId = null;
      this.target = 0;
      this.labelValue2 = this.labelValue;

      FrameArc.call(this);
      this.callTapService();
    };

    const mouseWheel = (e) => {
      e.preventDefault();

      clearTimeout(this.wheelTimeOutId);
      this.dragging = true;
      this.wheelTimeOutId = setTimeout(() => {
        clearTimeout(this.timeOutId);
        this.timeOutId = null;
        this.labelValue2 = this.labelValue;
        this.dragging = false;
        this.callTapService();
      }, 500);

      if ((this.config.user_actions?.drag_action) && (this.config.user_actions?.drag_action.update_interval)) {
        if (this.config.user_actions.drag_action.update_interval > 0) {
          this.timeOutId = setTimeout(() => this.callDragService(), this.config.user_actions.drag_action.update_interval);
        } else {
          this.timeOutId = null;
        }
      }
      const newValue = +this.labelValue + +((e.altKey ? 10 * this.svg.scale.step : this.svg.scale.step) * Math.sign(e.deltaY));

      this.labelValue = clamp(this.svg.scale.min, newValue, this.svg.scale.max);
      this.m = this.sliderValueToPoint(this.labelValue);
      this.pointToSliderValue(this.m);

      FrameArc.call(this);

      this.labelValue2 = this.labelValue;
    };
    this.elements.thumbGroup.addEventListener('touchstart', pointerDown, false);
    this.elements.thumbGroup.addEventListener('mousedown', pointerDown, false);

    this.elements.svg.addEventListener('wheel', mouseWheel, false);
  }
  /** *****************************************************************************
  * CircularSliderTool::value()
  *
  * Summary.
  * Sets the value of the CircularSliderTool. Value updated via set hass.
  * Calculate CircularSliderTool settings & colors depending on config and new value.
  *
  */

  set value(state) {
    super.value = state;
    if (!this.dragging) this.labelValue = this._stateValue;

    // Calculate the size of the arc to fill the dasharray with this
    // value. It will fill the CircularSliderTool relative to the state and min/max
    // values given in the configuration.

    if (!this.dragging) {
      const min = this.config.scale.min || 0;
      const max = this.config.scale.max || 100;
      let val = Math.min(Utils.calculateValueBetween(min, max, this._stateValue), 1);

      // Don't display anything, that is NO track, thumb to start...
      if (isNaN(val)) val = 0;
      const score = val * this.svg.pathLength;
      this.dashArray = `${score} ${this.svg.circleLength}`;

      const thumbPos = this.sliderValueToPoint(this._stateValue);
      this.svg.thumb.x1 = thumbPos.x - this.svg.thumb.width / 2;
      this.svg.thumb.y1 = thumbPos.y - this.svg.thumb.height / 2;

      this.svg.capture.x1 = thumbPos.x - this.svg.capture.width / 2;
      this.svg.capture.y1 = thumbPos.y - this.svg.capture.height / 2;
    }
  }

  set values(states) {
    super.values = states;
    if (!this.dragging) this.labelValue = this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())];

    // Calculate the size of the arc to fill the dasharray with this
    // value. It will fill the CircularSliderTool relative to the state and min/max
    // values given in the configuration.

    if (!this.dragging) {
      const min = this.config.scale.min || 0;
      const max = this.config.scale.max || 100;
      let val = Math.min(Utils.calculateValueBetween(min, max, this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]), 1);

      // Don't display anything, that is NO track, thumb to start...
      if (isNaN(val)) val = 0;
      const score = val * this.svg.pathLength;
      this.dashArray = `${score} ${this.svg.circleLength}`;

      const thumbPos = this.sliderValueToPoint(this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]);
      this.svg.thumb.x1 = thumbPos.x - this.svg.thumb.width / 2;
      this.svg.thumb.y1 = thumbPos.y - this.svg.thumb.height / 2;

      this.svg.capture.x1 = thumbPos.x - this.svg.capture.width / 2;
      this.svg.capture.y1 = thumbPos.y - this.svg.capture.height / 2;
    }
  }

  _renderUom() {
    if (this.config.show.uom === 'none') {
      return svg``;
    } else {
      this.MergeAnimationStyleIfChanged();
      this.MergeColorFromState(this.styles.uom);

      let fsuomStr = this.styles.label['font-size'];

      let fsuomValue = 0.5;
      let fsuomType = 'em';
      const fsuomSplit = fsuomStr.match(/\D+|\d*\.?\d+/g);
      if (fsuomSplit.length === 2) {
        fsuomValue = Number(fsuomSplit[0]) * 0.6;
        fsuomType = fsuomSplit[1];
      } else console.error('Cannot determine font-size for state/unit', fsuomStr);

      fsuomStr = { 'font-size': fsuomValue + fsuomType };

      this.styles.uom = Merge.mergeDeep(this.config.styles.uom, fsuomStr);

      const uom = this._card._buildUom(this.derivedEntity, this._card.entities[this.defaultEntityIndex()], this._card.config.entities[this.defaultEntityIndex()]);

      // Check for location of uom. end = next to state, bottom = below state ;-), etc.
      if (this.config.show.uom === 'end') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else if (this.config.show.uom === 'bottom') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="1.5em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else if (this.config.show.uom === 'top') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="-1.5em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else {
        return svg`
          <tspan class="${classMap(this.classes.uom)}"  dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ERR</tspan>
        `;
      }
    }
  }

  /** *****************************************************************************
  * CircularSliderTool::_renderCircSlider()
  *
  * Summary.
  * Renders the CircularSliderTool
  *
  * Description.
  * The horseshoes are rendered in a viewbox of 200x200 (SVG_VIEW_BOX).
  * Both are centered with a radius of 45%, ie 200*0.45 = 90.
  *
  * The horseshoes are rotated 220 degrees and are 2 * 26/36 * Math.PI * r in size
  * There you get your value of 408.4070449,180 ;-)
  */

  _renderCircSlider() {
    this.MergeAnimationClassIfChanged();
    this.MergeColorFromState();
    this.MergeAnimationStyleIfChanged();

    // this.MergeColorFromState();
    this.renderValue = this._stateValue;
    // if (this.renderValue === undefined) this.renderValue = 'undefined';
    if (this.dragging) {
      this.renderValue = this.labelValue2;
    } else if (this.elements?.label) this.elements.label.textContent = (this.renderValue === 'undefined') ? '' : this.renderValue;

    function renderLabel(argGroup) {
      if ((this.config.position.label.placement === 'thumb') && argGroup) {
        return svg`
      <text id="label">
        <tspan class="${classMap(this.classes.label)}" x="${this.svg.label.cx}" y="${this.svg.label.cy}" style="${styleMap(this.styles.label)}">
        ${typeof this.renderValue === 'undefined' ? '' : this.renderValue}</tspan>
        ${typeof this.renderValue === 'undefined' ? '' : this._renderUom()}
        </text>
        `;
      }

      if ((this.config.position.label.placement === 'position') && !argGroup) {
        return svg`
          <text id="label" style="transform-origin:center;transform-box: fill-box;">
            <tspan class="${classMap(this.classes.label)}" data-placement="position" x="${this.svg.label.cx}" y="${this.svg.label.cy}"
            style="${styleMap(this.styles.label)}">
            ${typeof this.renderValue === 'undefined' ? '' : this.renderValue}</tspan>
            ${typeof this.renderValue === 'undefined' ? '' : this._renderUom()}
          </text>
          `;
      }
    }
    // ${this.renderValue === 'undefined' ? 'pp' : 'nu' this.renderValue}</tspan>

    function renderThumbGroup() {
      // Original version but with SVG.
      // Works in both Chrome and Safari 15.5. But rotate is only on rect... NOT on group!!!!
      //              transform="rotate(${this.arc.currentAngle} ${this.svg.thumb.cx} ${this.svg.thumb.cy})"
      // This one works ...
      return svg`
        <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}" style="filter:url(#sak-drop-1);overflow:visible;">
          <g style="transform-origin:center;transform-box: fill-box;" >
          <g id="thumb" transform="rotate(${this.arc.currentAngle} ${this.svg.capture.width / 2} ${this.svg.capture.height / 2})">

            <rect id="capture" class="${classMap(this.classes.capture)}" x="0" y="0"
              width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}" 
              style="${styleMap(this.styles.capture)}" 
            />

            <rect id="rect-thumb" class="${classMap(this.classes.thumb)}" x="${(this.svg.capture.width - this.svg.thumb.width) / 2}" y="${(this.svg.capture.height - this.svg.thumb.height) / 2}"
              width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
              style="${styleMap(this.styles.thumb)}"
            />

            </g>
            </g>
        </g>
      `;

      // Original version but with SVG.
      // Works in both Chrome and Safari 15.5. But rotate is only on rect... NOT on group!!!!
      //              transform="rotate(${this.arc.currentAngle} ${this.svg.thumb.cx} ${this.svg.thumb.cy})"
      // This one works ... BUT...
      // Now again not after refresh on safari. Ok after udpate. Change is using a style for rotate(xxdeg), instead of transform=rotate()...
      // Works on Safari, not on Chrome. Only change is no extra group level...
      // return svg`
      // <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}">
      // <g style="transform-origin:center;transform-box:fill-box;" transform="rotate(${this.arc.currentAngle} ${this.svg.capture.width/2} ${this.svg.capture.height/2})">
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${(this.svg.capture.width - this.svg.thumb.width)/2}" y="${(this.svg.capture.height - this.svg.thumb.height)/2}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"
      // />

      // <rect id="capture" class="${classMap(this.classes.capture)}" x="0" y="0"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </g>
      // `;

      // Original version but with SVG.
      // Works in both Chrome and Safari 15.5. But rotate is only on rect... NOT on group!!!!
      //              transform="rotate(${this.arc.currentAngle} ${this.svg.thumb.cx} ${this.svg.thumb.cy})"
      // return svg`
      // <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}">
      // <g style="transform-origin:center;transform-box: fill-box;">

      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${(this.svg.capture.width - this.svg.thumb.width)/2}" y="${(this.svg.capture.height - this.svg.thumb.height)/2}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"
      // transform="rotate(${this.arc.currentAngle} 0 0)"
      // />

      // <rect id="capture" class="${classMap(this.classes.capture)}" x="0" y="0"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </g>
      // `;

      // WIP!!!!!!!!!!!
      // Now without tests for Safari and 15.1...
      // Same behaviour in safari: first refresh wrong, then after data ok.
      // return svg`
      // <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}" height="${this.svg.capture.height}" width="${this.svg.capture.width}"
      // style="transform-box: fill-box;">
      // <g style="transform-origin:center;transform-box: fill-box;"
      // transform="rotate(${this.arc.currentAngle})"
      // >
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${(this.svg.capture.width - this.svg.thumb.width)/2}" y="${(this.svg.capture.height - this.svg.thumb.height)/2}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"

      // />
      // <rect id="capture" class="${classMap(this.classes.capture)}" x="0" y="0"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </svg>
      // `;

      // Original version. Working on Chrome and Safari 15.5, NOT on Safari 15.1.
      // But I want grouping to rotate and move all the components, so should be changed anyway...
      // return svg`
      // <g id="thumb-group" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}">
      // <g style="transform-origin:center;transform-box: fill-box;">
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"
      // transform="rotate(${this.arc.currentAngle} ${this.svg.thumb.cx} ${this.svg.thumb.cy})"
      // />
      // <rect id="capture" class="${classMap(this.classes.capture)}" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </g>
      // `;

      // WIP!!!!!!!!!!!
      // This one works on Safari 15.5 and Chrome, but on Safari not on initial refresh, but after data update...
      // Seems the other way around compared to the solution below for 15.1 etc.
      // return svg`
      // <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}" height="${this.svg.capture.height}" width="${this.svg.capture.width}"
      // style="transform-box: fill-box;">
      // <g style="transform-origin:center;transform-box: fill-box;"
      // transform="rotate(${this.arc.currentAngle} ${this._card.isSafari ? (this._card.isSafari15 ? "" : this.svg.capture.width/2) : " 0"}
      // ${this._card.isSafari ? (this._card.isSafari15 ? "" : this.svg.capture.height/2) : " 0"})"
      // >
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${(this.svg.capture.width - this.svg.thumb.width)/2}" y="${(this.svg.capture.height - this.svg.thumb.height)/2}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"

      // />
      // <rect id="capture" class="${classMap(this.classes.capture)}" x="0" y="0"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </svg>
      // `;

      // This version working in all browsers, but has no rotate... So logical...
      // return svg`
      // <g id="thumb-group" style="transform-origin:center;transform-box: fill-box;"  >
      // <g transform="rotate(${this.arc.currentAngle} ${this.svg.cx} ${this.svg.cy})" transform-box="fill-box"
      // >
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"
      // />
      // <rect id="capture" class="${classMap(this.classes.capture)}" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </g>
      // `;

      // This version works on Safari 14, but NOT on Safari 15 and Chrome. The thumb has weird locations...
      // Uses an SVG to position stuff. Rest is relative positions in SVG...
      // Rotate is from center of SVG...
      //
      // Works on Safari 15.5 after refresh, but not when data changes. WHY???????????????????
      // Something seems to ruin stuff when data comes in...
      // return svg`
      // <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}" >
      // <g style="transform-origin:center;transform-box: fill-box;"
      // transform="rotate(${this.arc.currentAngle} ${this.svg.capture.width/2} ${this.svg.capture.height/2})">
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${(this.svg.capture.width - this.svg.thumb.width)/2}" y="${(this.svg.capture.height - this.svg.thumb.height)/2}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"

      // />
      // <rect id="capture" class="${classMap(this.classes.capture)}" x="0" y="0"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </svg>
      // `;

      // Original version. Working on Chrome and Safari 15.5, NOT on Safari 15.1.
      // But I want grouping to rotate and move all the components, so should be changed anyway...
      // return svg`
      // <g id="thumb-group" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}">
      // <g style="transform-origin:center;transform-box: fill-box;">
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"
      // transform="rotate(${this.arc.currentAngle} ${this.svg.thumb.cx} ${this.svg.thumb.cy})"
      // />
      // <rect id="capture" class="${classMap(this.classes.capture)}" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </g>
      // `;

      // return svg`
      // <g id="thumb-group" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}" style="transform:translate(${cx}px, ${cy}px);">
      // <g style="transform-origin:center;transform-box: fill-box;">
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"
      // />
      // </g>
      // ${renderLabel.call(this, true)}
      // </g>
      // `;
    }

    return svg`
      <g id="circslider__group-inner" class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}">

        <circle id="track" class="sak-circslider__track" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          style="${styleMap(this.styles.track)}"
          stroke-dasharray="${this.arc.scaleDasharray} ${this.arc.arcLength}"
          stroke-dashoffset="${this.arc.dashOffset}"
          stroke-width="${this.svg.track.width}"
          transform="rotate(${this.svg.rotate.degrees} ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        <circle id="active-track" class="sak-circslider__active" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          fill="${this.config.fill || 'rgba(0, 0, 0, 0)'}"
          style="${styleMap(this.styles.active)}"
          stroke-dasharray="${this.dashArray}"
          stroke-dashoffset="${this.arc.dashOffset}"
          stroke-width="${this.svg.active.width}"
          transform="rotate(${this.svg.rotate.degrees} ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        ${renderThumbGroup.call(this)}
        ${renderLabel.call(this, false)}
      </g>

    `;
  }

  /** *****************************************************************************
  * CircularSliderTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" id="circslider-${this.toolId}" class="circslider__group-outer" overflow="visible"
        touch-action="none" style="touch-action:none;"
      >
        ${this._renderCircSlider()}

      </svg>
    `;
  }
} // END of class
