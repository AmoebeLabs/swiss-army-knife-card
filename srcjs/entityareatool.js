import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import BaseTool from './basetool';

/** ****************************************************************************
  * EntityAreaTool class
  *
  * Summary.
  *
  */

export default class EntityAreaTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_AREA_CONFIG = {
      classes: {
        tool: {
        },
        area: {
          'sak-area__area': true,
          hover: true,
        },
      },
      styles: {
        tool: {
        },
        area: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_AREA_CONFIG, argConfig), argPos);

    // Text is rendered in its own context. No need for SVG coordinates.
    this.classes.area = {};
    this.styles.area = {};
    if (this.dev.debug) console.log('EntityAreaTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  /** *****************************************************************************
  * EntityAreaTool::_buildArea()
  *
  * Summary.
  * Builds the Area string.
  *
  */

  _buildArea(entityState, entityConfig) {
    return (
      entityConfig.area
      || '?'
    );
  }

  /** *****************************************************************************
  * EntityAreaTool::_renderEntityArea()
  *
  * Summary.
  * Renders the entity area using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the area
  *
  */

  _renderEntityArea() {
    this.MergeAnimationClassIfChanged();
    this.MergeColorFromState(this.styles.area);
    this.MergeAnimationStyleIfChanged();

    const area = this.textEllipsis(
      this._buildArea(
        this._card.entities[this.defaultEntityIndex()],
        this._card.config.entities[this.defaultEntityIndex()],
      ),
      this.config?.show?.ellipsis,
    );

    return svg`
        <text>
          <tspan class="${classMap(this.classes.area)}"
          x="${this.svg.cx}" y="${this.svg.cy}" style="${styleMap(this.styles.area)}">${area}</tspan>
        </text>
      `;
  }

  /** *****************************************************************************
  * EntityAreaTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <g id="area-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderEntityArea()}
      </g>
    `;
  }
} // END of class
