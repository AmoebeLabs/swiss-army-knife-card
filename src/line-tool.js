import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import Utils from './utils';
import BaseTool from './base-tool';

/** ****************************************************************************
  * LineTool class
  *
  * Summary.
  *
  */

export default class LineTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_LINE_CONFIG = {
      position: {
        orientation: 'vertical',
        length: '10',
        cx: '50',
        cy: '50',
      },
      classes: {
        tool: {
          'sak-line': true,
          hover: true,
        },
        line: {
          'sak-line__line': true,
        },
      },
      styles: {
        tool: {
        },
        line: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_LINE_CONFIG, argConfig), argPos);

    if (!['horizontal', 'vertical', 'fromto'].includes(this.config.position.orientation))
      throw Error('LineTool::constructor - invalid orientation [vertical, horizontal, fromto] = ', this.config.position.orientation);

    if (['horizontal', 'vertical'].includes(this.config.position.orientation))
      this.svg.length = Utils.calculateSvgDimension(argConfig.position.length);

    if (this.config.position.orientation === 'fromto') {
      this.svg.x1 = Utils.calculateSvgCoordinate(argConfig.position.x1, this.toolsetPos.cx);
      this.svg.y1 = Utils.calculateSvgCoordinate(argConfig.position.y1, this.toolsetPos.cy);
      this.svg.x2 = Utils.calculateSvgCoordinate(argConfig.position.x2, this.toolsetPos.cx);
      this.svg.y2 = Utils.calculateSvgCoordinate(argConfig.position.y2, this.toolsetPos.cy);
    }

    if (this.config.position.orientation === 'vertical') {
      this.svg.x1 = this.svg.cx;
      this.svg.y1 = this.svg.cy - this.svg.length / 2;
      this.svg.x2 = this.svg.cx;
      this.svg.y2 = this.svg.cy + this.svg.length / 2;
    } else if (this.config.position.orientation === 'horizontal') {
      this.svg.x1 = this.svg.cx - this.svg.length / 2;
      this.svg.y1 = this.svg.cy;
      this.svg.x2 = this.svg.cx + this.svg.length / 2;
      this.svg.y2 = this.svg.cy;
    } else if (this.config.position.orientation === 'fromto') {
    }

    this.classes.line = {};
    this.styles.line = {};

    if (this.dev.debug) console.log('LineTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  /** *****************************************************************************
  * LineTool::_renderLine()
  *
  * Summary.
  * Renders the line using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the line
  *
  * @returns  {svg} Rendered line
  *
  */

  _renderLine() {
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.line);

    if (this.dev.debug) console.log('_renderLine', this.config.position.orientation, this.svg.x1, this.svg.y1, this.svg.x2, this.svg.y2);
    return svg`
      <line class="${classMap(this.classes.line)}"
        x1="${this.svg.x1}"
        y1="${this.svg.y1}"
        x2="${this.svg.x2}"
        y2="${this.svg.y2}"
        style="${styleMap(this.styles.line)}"/>
      `;
  }

  /** *****************************************************************************
  * LineTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  * @returns  {svg} Rendered line group
  *
  */
  render() {
    return svg`
      <g id="line-${this.toolId}" class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderLine()}
      </g>
    `;
  }
} // END of class
