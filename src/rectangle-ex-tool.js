import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import Utils from './utils';
import BaseTool from './base-tool';

/** ****************************************************************************
  * RectangleToolEx class
  *
  * Summary.
  *
  */

export default class RectangleToolEx extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_RECTANGLEEX_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        width: 50,
        height: 50,
        radius: {
          all: 0,
        },
      },
      classes: {
        tool: {
          'sak-rectex': true,
          hover: true,
        },
        rectex: {
          'sak-rectex__rectex': true,
        },
      },
      styles: {
        rectex: {
        },
      },
    };
    super(argToolset, Merge.mergeDeep(DEFAULT_RECTANGLEEX_CONFIG, argConfig), argPos);

    this.classes.rectex = {};
    this.styles.rectex = {};

    // #TODO:
    // Verify max radius, or just let it go, and let the user handle that right value.
    // A q can be max height of rectangle, ie both corners added must be less than the height, but also less then the width...

    const maxRadius = Math.min(this.svg.height, this.svg.width) / 2;
    let radius = 0;
    radius = Utils.calculateSvgDimension(this.config.position.radius.all);
    this.svg.radiusTopLeft = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
      this.config.position.radius.top_left || this.config.position.radius.left || this.config.position.radius.top || radius,
    ))) || 0;

    this.svg.radiusTopRight = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
      this.config.position.radius.top_right || this.config.position.radius.right || this.config.position.radius.top || radius,
    ))) || 0;

    this.svg.radiusBottomLeft = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
      this.config.position.radius.bottom_left || this.config.position.radius.left || this.config.position.radius.bottom || radius,
    ))) || 0;

    this.svg.radiusBottomRight = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
      this.config.position.radius.bottom_right || this.config.position.radius.right || this.config.position.radius.bottom || radius,
    ))) || 0;

    if (this.dev.debug) console.log('RectangleToolEx constructor config, svg', this.toolId, this.config, this.svg);
  }

  /** *****************************************************************************
  * RectangleToolEx::value()
  *
  */
  set value(state) {
    super.value = state;
  }

  /** *****************************************************************************
  * RectangleToolEx::_renderRectangleEx()
  *
  * Summary.
  * Renders the rectangle using lines and bezier curves with precalculated coordinates and dimensions.
  *
  * Refs for creating the path online:
  * - https://mavo.io/demos/svgpath/
  *
  */

  _renderRectangleEx() {
    this.MergeAnimationClassIfChanged();

    // WIP
    this.MergeAnimationStyleIfChanged(this.styles);
    this.MergeAnimationStyleIfChanged();
    if (this.config.hasOwnProperty('csnew')) {
      this.MergeColorFromState2(this.styles.rectex, 'rectex');
    } else {
      this.MergeColorFromState(this.styles.rectex);
    }

    if (!this.counter) { this.counter = 0; }
    this.counter += 1;

    const svgItems = svg`
      <g class="${classMap(this.classes.rectex)}" id="rectex-${this.toolId}">
        <path  d="
            M ${this.svg.x + this.svg.radiusTopLeft} ${this.svg.y}
            h ${this.svg.width - this.svg.radiusTopLeft - this.svg.radiusTopRight}
            q ${this.svg.radiusTopRight} 0 ${this.svg.radiusTopRight} ${this.svg.radiusTopRight}
            v ${this.svg.height - this.svg.radiusTopRight - this.svg.radiusBottomRight}
            q 0 ${this.svg.radiusBottomRight} -${this.svg.radiusBottomRight} ${this.svg.radiusBottomRight}
            h -${this.svg.width - this.svg.radiusBottomRight - this.svg.radiusBottomLeft}
            q -${this.svg.radiusBottomLeft} 0 -${this.svg.radiusBottomLeft} -${this.svg.radiusBottomLeft}
            v -${this.svg.height - this.svg.radiusBottomLeft - this.svg.radiusTopLeft}
            q 0 -${this.svg.radiusTopLeft} ${this.svg.radiusTopLeft} -${this.svg.radiusTopLeft}
            "
            counter="${this.counter}" 
            style="${styleMap(this.styles.rectex)}"/>
      </g>
      `;
    return svg`${svgItems}`;
  }

  /** *****************************************************************************
  * RectangleToolEx::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <g id="rectex-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderRectangleEx()}
      </g>
    `;
  }
} // END of class
