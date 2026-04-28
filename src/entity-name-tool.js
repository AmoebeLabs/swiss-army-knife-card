import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import BaseTool from './base-tool';

/** ****************************************************************************
 * EntityNameTool class
 *
 * Renders an entity name as SVG text.
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
        tool: {},
        name: {},
      },
    };

    const config = Merge.mergeDeep(DEFAULT_NAME_CONFIG, argConfig ?? {});

    super(argToolset, config, argPos);

    // Runtime class/style maps.
    this.classes.tool = {};
    this.classes.name = {};

    this.styles.tool = {};
    this.styles.name = {};

    this._handleClick = this._handleClick.bind(this);

    if (this.dev.debug) {
      console.log(
        'EntityName constructor coords, dimensions',
        this.coords,
        this.dimensions,
        this.svg,
        this.config,
      );
    }
  }

  _handleClick(event) {
    this.handleTapEvent(event, this.config);
  }

  /** *****************************************************************************
   * EntityNameTool::_buildName()
   *
   * Builds the name string.
   */

  _buildName(entityState, entityConfig) {
    return (
      this.activeAnimation?.name
      ?? entityConfig?.name
      ?? entityState?.attributes?.friendly_name
      ?? entityState?.entity_id
      ?? '?'
    );
  }

  _getDefaultEntityContext() {
    const entityIndex = this.defaultEntityIndex();

    return {
      entityState: this._card?.entities?.[entityIndex],
      entityConfig: this._card?.config?.entities?.[entityIndex],
    };
  }

  /** *****************************************************************************
   * EntityNameTool::_renderEntityName()
   *
   * Renders the entity name using precalculated coordinates.
   */

  _renderEntityName() {
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.name);

    const { entityState, entityConfig } = this._getDefaultEntityContext();

    const name = this.textEllipsis(
      String(this._buildName(entityState, entityConfig)),
      this.config?.show?.ellipsis,
    );

    return svg`
      <text>
        <tspan
          class=${classMap(this.classes.name)}
          x=${this.svg.cx}
          y=${this.svg.cy}
          style=${styleMap(this.styles.name)}
        >
          ${name}
        </tspan>
      </text>
    `;
  }

  /** *****************************************************************************
   * EntityNameTool::render()
   *
   * The render() function for this object.
   */

  render() {
    return svg`
      <g
        id=${`name-${this.toolId}`}
        class=${classMap(this.classes.tool)}
        style=${styleMap(this.styles.tool)}
        @click=${this._handleClick}
      >
        ${this._renderEntityName()}
      </g>
    `;
  }
}
