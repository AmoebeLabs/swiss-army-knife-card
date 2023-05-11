import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import Utils from './utils';
import BaseTool from './base-tool';

/** ****************************************************************************
  * RectangleTool class
  *
  * Summary.
  *
  */

export default class RectangleTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_RECTANGLE_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        width: 50,
        height: 50,
        rx: 0,
      },
      classes: {
        tool: {
          'sak-rectangle': true,
          hover: true,
        },
        rectangle: {
          'sak-rectangle__rectangle': true,
        },
      },
      styles: {
        rectangle: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_RECTANGLE_CONFIG, argConfig), argPos);
    this.svg.rx = argConfig.position.rx ? Utils.calculateSvgDimension(argConfig.position.rx) : 0;

    this.classes.rectangle = {};
    this.styles.rectangle = {};

    if (this.dev.debug) console.log('RectangleTool constructor config, svg', this.toolId, this.config, this.svg);
  }

  /** *****************************************************************************
  * RectangleTool::value()
  *
  * Summary.
  * Receive new state data for the entity this rectangle is linked to. Called from set hass;
  *
  */
  set value(state) {
    super.value = state;
  }

  /** *****************************************************************************
  * RectangleTool::_renderRectangle()
  *
  * Summary.
  * Renders the circle using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the circle
  *
  */

  _renderRectangle() {
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.rectangle);

    return svg`
      <rect class="${classMap(this.classes.rectangle)}"
        x="${this.svg.x}" y="${this.svg.y}" width="${this.svg.width}" height="${this.svg.height}" rx="${this.svg.rx}"
        style="${styleMap(this.styles.rectangle)}"/>
      `;
  }

  /** *****************************************************************************
  * RectangleTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <g id="rectangle-${this.toolId}" class="${classMap(this.classes.tool)}" transform-origin="${this.svg.cx}px ${this.svg.cy}px"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderRectangle()}
      </g>
    `;
  }
} // END of class
