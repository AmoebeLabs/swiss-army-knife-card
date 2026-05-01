import { svg } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import Merge from './merge';
import BaseTool from './base-tool';

/** ****************************************************************************
 * EntityAreaTool class
 *
 * Renders an entity area label as SVG text.
 */

export default class EntityAreaTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_AREA_CONFIG = {
      classes: {
        tool: {},
        area: {
          'sak-area__area': true,
          hover: true,
        },
      },
      styles: {
        tool: {},
        area: {},
      },
    };

    const config = Merge.mergeDeep(DEFAULT_AREA_CONFIG, argConfig ?? {});

    super(argToolset, config, argPos);

    // Runtime class/style maps.
    this.classes.tool = {};
    this.classes.area = {};

    this.styles.tool = {};
    this.styles.area = {};

    this._handleClick = this._handleClick.bind(this);

    if (this.dev.debug) {
      console.log(
        'EntityAreaTool constructor coords, dimensions',
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
   * EntityAreaTool::_buildArea()
   *
   * Builds the area string.
   */

  _buildArea(_entityState, entityConfig) {
    return entityConfig?.area ?? '?';
  }

  _getDefaultEntityContext() {
    const entityIndex = this.defaultEntityIndex();

    return {
      entityState: this._card?.entities?.[entityIndex],
      entityConfig: this._card?.config?.entities?.[entityIndex],
    };
  }

  /** *****************************************************************************
   * EntityAreaTool::_renderEntityArea()
   *
   * Renders the entity area using precalculated coordinates.
   */

  _renderEntityArea() {
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.area);

    const { entityState, entityConfig } = this._getDefaultEntityContext();

    const rawArea = this._buildArea(entityState, entityConfig);

    const area = this.textEllipsis(
      String(rawArea),
      this.config?.show?.ellipsis,
    );

    return svg`
      <text>
        <tspan
          class=${classMap(this.classes.area)}
          x=${this.svg.cx}
          y=${this.svg.cy}
          style=${styleMap(this.styles.area)}
        >
          ${area}
        </tspan>
      </text>
    `;
  }

  /** *****************************************************************************
   * EntityAreaTool::render()
   *
   * The render() function for this object.
   */

  render() {
    return svg`
      <g
        id=${`area-${this.toolId}`}
        class=${classMap(this.classes.tool)}
        style=${styleMap(this.styles.tool)}
        @click=${this._handleClick}
      >
        ${this._renderEntityArea()}
      </g>
    `;
  }
}
