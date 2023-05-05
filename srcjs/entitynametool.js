import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import BaseTool from './basetool';

/** ****************************************************************************
  * EntityNameTool class
  *
  * Summary.
  *
  */

export default class EntityNameTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_NAME_CONFIG = {
      classes: {
        tool: {
          'sak-name': true,
          hover: true,
        },
        name: {
          'sak-name__name': true,
        },
      },
      styles: {
        tool: {
        },
        name: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_NAME_CONFIG, argConfig), argPos);

    this._name = {};
    // Init classes
    this.classes.tool = {};
    this.classes.name = {};

    // Init styles
    this.styles.name = {};
    if (this.dev.debug) console.log('EntityName constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  /** *****************************************************************************
  * EntityNameTool::_buildName()
  *
  * Summary.
  * Builds the Name string.
  *
  */

  _buildName(entityState, entityConfig) {
    return (
      this.activeAnimation?.name // Name from animation
      || entityConfig.name
      || entityState.attributes.friendly_name
    );
  }

  /** *****************************************************************************
  * EntityNameTool::_renderEntityName()
  *
  * Summary.
  * Renders the entity name using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the name
  *
  */

  _renderEntityName() {
    this.MergeAnimationClassIfChanged();
    this.MergeColorFromState(this.styles.name);
    this.MergeAnimationStyleIfChanged();

    const name = this.textEllipsis(
      this._buildName(
        this._card.entities[this.defaultEntityIndex()],
        this._card.config.entities[this.defaultEntityIndex()],
      ),
      this.config?.show?.ellipsis,
    );

    return svg`
        <text>
          <tspan class="${classMap(this.classes.name)}" x="${this.svg.cx}" y="${this.svg.cy}" style="${styleMap(this.styles.name)}">${name}</tspan>
        </text>
      `;
  }

  /** *****************************************************************************
  * EntityNameTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <g id="name-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderEntityName()}
      </g>
    `;
  }
} // END of class
