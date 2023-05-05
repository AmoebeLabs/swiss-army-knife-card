import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import BaseTool from './base-tool';

/** ****************************************************************************
  * TextTool class
  *
  * Summary.
  *
  */

export default class TextTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_TEXT_CONFIG = {
      classes: {
        tool: {
          'sak-text': true,
        },
        text: {
          'sak-text__text': true,
          hover: false,
        },
      },
      styles: {
        tool: {
        },
        text: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_TEXT_CONFIG, argConfig), argPos);

    this.EnableHoverForInteraction();
    this.text = this.config.text;
    this.styles.text = {};
    if (this.dev.debug) console.log('TextTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  /** *****************************************************************************
  * TextTool::_renderText()
  *
  * Summary.
  * Renders the text using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the text
  *
  */

  _renderText() {
    this.MergeAnimationClassIfChanged();
    this.MergeColorFromState(this.styles.text);
    this.MergeAnimationStyleIfChanged();

    return svg`
        <text>
          <tspan class="${classMap(this.classes.text)}" x="${this.svg.cx}" y="${this.svg.cy}" style="${styleMap(this.styles.text)}">${this.text}</tspan>
        </text>
      `;
  }

  /** *****************************************************************************
  * TextTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
        <g id="text-${this.toolId}" class="${classMap(this.classes.tool)}"
          @click=${(e) => this.handleTapEvent(e, this.config)}>
          ${this._renderText()}
        </g>
      `;
  }
} // END of class
