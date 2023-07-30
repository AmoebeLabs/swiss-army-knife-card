import { svg } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map.js';

import { SVG_DEFAULT_DIMENSIONS, SVG_DEFAULT_DIMENSIONS_HALF } from './const';
import Utils from './utils';

import BadgeTool from './badge-tool';
import CircleTool from './circle-tool';
import CircularSliderTool from './circular-slider-tool';
import EllipseTool from './ellipse-tool';
import EntityAreaTool from './entity-area-tool';
import EntityIconTool from './entity-icon-tool';
import EntityNameTool from './entity-name-tool';
import EntityStateTool from './entity-state-tool';
import SparklineGraphTool from './sparkline-graph-tool';
import HorseshoeTool from './horseshoe-tool';
import LineTool from './line-tool';
import RangeSliderTool from './range-slider-tool';
import RectangleTool from './rectangle-tool';
import RectangleToolEx from './rectangle-ex-tool';
import RegPolyTool from './regular-polygon-tool';
import SegmentedArcTool from './segmented-arc-tool';
import SparklineBarChartTool from './sparkline-barchart-tool';
import SwitchTool from './switch-tool';
import TextTool from './text-tool';
import UserSvgTool from './user-svg-tool';
import Colors from './colors';

/** ***************************************************************************
  * Toolset class
  *
  * Summary.
  *
  */

export default class Toolset {
  constructor(argCard, argConfig) {
    this.toolsetId = Math.random().toString(36).substr(2, 9);
    this._card = argCard;
    this.dev = { ...this._card.dev };
    if (this.dev.performance) console.time(`--> ${this.toolsetId} PERFORMANCE Toolset::constructor`);

    this.config = argConfig;
    this.tools = [];

    this.palette = {};
    this.palette.light = {};
    this.palette.dark = {};

    if (this.config.palette) {
      const { paletteLight, paletteDark } = Colors.processPalette(this.config.palette);
      this.palette.light = paletteLight;
      this.palette.dark = paletteDark;
    }
    // Get SVG coordinates.
    this.svg = {};
    this.svg.cx = Utils.calculateSvgCoordinate(argConfig.position.cx, SVG_DEFAULT_DIMENSIONS_HALF);
    this.svg.cy = Utils.calculateSvgCoordinate(argConfig.position.cy, SVG_DEFAULT_DIMENSIONS_HALF);

    this.svg.x = (this.svg.cx) - (SVG_DEFAULT_DIMENSIONS_HALF);
    this.svg.y = (this.svg.cy) - (SVG_DEFAULT_DIMENSIONS_HALF);

    // Group scaling experiment. Calc translate values for SVG using the toolset scale value
    this.transform = {};
    this.transform.scale = {};
    // eslint-disable-next-line no-multi-assign
    this.transform.scale.x = this.transform.scale.y = 1;
    this.transform.rotate = {};
    // eslint-disable-next-line no-multi-assign
    this.transform.rotate.x = this.transform.rotate.y = 0;
    this.transform.skew = {};
    // eslint-disable-next-line no-multi-assign
    this.transform.skew.x = this.transform.skew.y = 0;

    if (this.config.position.scale) {
      // eslint-disable-next-line no-multi-assign
      this.transform.scale.x = this.transform.scale.y = this.config.position.scale;
    }
    if (this.config.position.rotate) {
      // eslint-disable-next-line no-multi-assign
      this.transform.rotate.x = this.transform.rotate.y = this.config.position.rotate;
    }

    this.transform.scale.x = this.config.position.scale_x || this.config.position.scale || 1;
    this.transform.scale.y = this.config.position.scale_y || this.config.position.scale || 1;

    this.transform.rotate.x = this.config.position.rotate_x || this.config.position.rotate || 0;
    this.transform.rotate.y = this.config.position.rotate_y || this.config.position.rotate || 0;

    if (this.dev.debug) console.log('Toolset::constructor config/svg', this.toolsetId, this.config, this.svg);

    // Create the tools configured in the toolset list.
    const toolsNew = {
      area: EntityAreaTool,
      circslider: CircularSliderTool,
      badge: BadgeTool,
      bar: SparklineBarChartTool,
      circle: CircleTool,
      ellipse: EllipseTool,
      sparkline: SparklineGraphTool,
      horseshoe: HorseshoeTool,
      icon: EntityIconTool,
      line: LineTool,
      name: EntityNameTool,
      rectangle: RectangleTool,
      rectex: RectangleToolEx,
      regpoly: RegPolyTool,
      segarc: SegmentedArcTool,
      state: EntityStateTool,
      slider: RangeSliderTool,
      switch: SwitchTool,
      text: TextTool,
      usersvg: UserSvgTool,
    };

    this.config.tools.map((toolConfig) => {
      const newConfig = { ...toolConfig };

      const newPos = {
        cx: 0 / 100 * SVG_DEFAULT_DIMENSIONS,
        cy: 0 / 100 * SVG_DEFAULT_DIMENSIONS,
        scale: this.config.position.scale ? this.config.position.scale : 1,
      };

      if (this.dev.debug) console.log('Toolset::constructor toolConfig', this.toolsetId, newConfig, newPos);

      if (!toolConfig.disabled) {
        const newTool = new toolsNew[toolConfig.type](this, newConfig, newPos);
        // eslint-disable-next-line no-bitwise
        this._card.entityHistory.needed |= (toolConfig.type === 'bar');
        // eslint-disable-next-line no-bitwise
        this._card.entityHistory.needed |= (toolConfig.type === 'sparkline');
        this.tools.push({ type: toolConfig.type, index: toolConfig.id, tool: newTool });
      }
      return true;
    });

    if (this.dev.performance) console.timeEnd(`--> ${this.toolsetId} PERFORMANCE Toolset::constructor`);
  }

  /** *****************************************************************************
  * Toolset::updateValues()
  *
  * Summary.
  * Called from set hass to update values for tools
  *
  */

  // #TODO:
  // Update only the changed entity_index, not all indexes. Now ALL tools are updated...
  updateValues() {
    if (this.dev.performance) console.time(`--> ${this.toolsetId} PERFORMANCE Toolset::updateValues`);
    if (this.tools) {
      this.tools.map((item, index) => {
        // eslint-disable-next-line no-constant-condition
        if (true || item.type === 'segarc') {
          if ((item.tool.config.hasOwnProperty('entity_index'))) {
            if (this.dev.debug) console.log('Toolset::updateValues', item, index);
            // if (this.dev.debug) console.log('Toolset::updateValues', typeof item.tool._stateValue);

            // #IDEA @2021.11.20
            // What if for attribute and secondaryinfo the entity state itself is also passsed automatically
            // In that case that state is always present and can be used in animations by default.
            // No need to pass an extra entity_index.
            // A tool using the light brightness can also use the state (on/off) in that case for styling.
            //
            // Test can be done on 'state', 'attr', or 'secinfo' for default entity_index.
            //
            // Should pass a record in here orso as value { state : xx, attr: yy }

            item.tool.value = this._card.attributesStr[item.tool.config.entity_index]
              ? this._card.attributesStr[item.tool.config.entity_index]
              : this._card.secondaryInfoStr[item.tool.config.entity_index]
                ? this._card.secondaryInfoStr[item.tool.config.entity_index]
                : this._card.entitiesStr[item.tool.config.entity_index];
          }

          // Check for multiple entities specified, and pass them to the tool
          if ((item.tool.config.hasOwnProperty('entity_indexes'))) {
            // Update list of entities in single record and pass that to the tool
            // The first entity is used as the state, additional entities can help with animations,
            // (used for formatting classes/styles) or can be used in a derived entity

            const valueList = [];
            for (let i = 0; i < item.tool.config.entity_indexes.length; ++i) {
              valueList[i] = this._card.attributesStr[item.tool.config.entity_indexes[i].entity_index]
                ? this._card.attributesStr[item.tool.config.entity_indexes[i].entity_index]
                : this._card.secondaryInfoStr[item.tool.config.entity_indexes[i].entity_index]
                  ? this._card.secondaryInfoStr[item.tool.config.entity_indexes[i].entity_index]
                  : this._card.entitiesStr[item.tool.config.entity_indexes[i].entity_index];
            }

            item.tool.values = valueList;
          }
        }
        return true;
      });
    }
    if (this.dev.performance) console.timeEnd(`--> ${this.toolsetId} PERFORMANCE Toolset::updateValues`);
  }

  /** *****************************************************************************
  * Toolset::connectedCallback()
  *
  * Summary.
  *
  */
  connectedCallback() {
    if (this.dev.performance) console.time(`--> ${this.toolsetId} PERFORMANCE Toolset::connectedCallback`);

    if (this.dev.debug) console.log('*****Event - connectedCallback', this.toolsetId, new Date().getTime());
    if (this.dev.performance) console.timeEnd(`--> ${this.toolsetId} PERFORMANCE Toolset::connectedCallback`);
  }

  /** *****************************************************************************
  * Toolset::disconnectedCallback()
  *
  * Summary.
  *
  */
  disconnectedCallback() {
    if (this.dev.performance) console.time(`--> ${this.cardId} PERFORMANCE Toolset::disconnectedCallback`);

    if (this.dev.debug) console.log('*****Event - disconnectedCallback', this.toolsetId, new Date().getTime());
    if (this.dev.performance) console.timeEnd(`--> ${this.cardId} PERFORMANCE Toolset::disconnectedCallback`);
  }

  /** *****************************************************************************
  * Toolset::firstUpdated()
  *
  * Summary.
  *
  */
  firstUpdated(changedProperties) {
    if (this.dev.debug) console.log('*****Event - Toolset::firstUpdated', this.toolsetId, new Date().getTime());

    if (this.tools) {
      this.tools.map((item) => {
        if (typeof item.tool.firstUpdated === 'function') {
          item.tool.firstUpdated(changedProperties);
          return true;
        }
        return false;
      });
    }
  }

  /** *****************************************************************************
  * Toolset::updated()
  *
  * Summary.
  *
  */
  updated(changedProperties) {
    if (this.dev.debug) console.log('*****Event - Updated', this.toolsetId, new Date().getTime());

    if (this.tools) {
      this.tools.map((item) => {
        if (typeof item.tool.updated === 'function') {
          item.tool.updated(changedProperties);
          return true;
        }
        return false;
      });
    }
  }

  /** *****************************************************************************
  * Toolset::renderToolset()
  *
  * Summary.
  *
  */
  renderToolset() {
    if (this.dev.debug) console.log('*****Event - renderToolset', this.toolsetId, new Date().getTime());

    const svgItems = this.tools.map((item) => svg`
          ${item.tool.render()}
      `);
    return svg`${svgItems}`;
  }

  /** *****************************************************************************
  * Toolset::render()
  *
  * Summary.
  * The render() function for this toolset renders all the tools within this set.
  *
  * Important notes:
  * - the toolset position is set on the svg. That one accepts x,y
  * - scaling, rotating and skewing (and translating) is done on the parent group.
  *
  * The order of transformations are done from the child's perspective!!
  * So, the child (tools) gets positioned FIRST, and then scaled/rotated.
  *
  * See comments for different render paths for Apple/Safari and any other browser...
  *
  */

  render() {
    // Note:
    // Rotating a card can produce different results on several browsers.
    // A 1:1 card / toolset gives the same results, but other aspect ratio's may give different results.

    if (((this._card.isSafari) || (this._card.iOS)) && (!this._card.isSafari16)) {
      //
      // Render path for Safari if not Safari 16:
      //
      // Safari seems to ignore - although not always - the transform-box:fill-box setting.
      // - It needs the explicit center point when rotating. So this is added to the rotate() command.
      // - scale around center uses the "move object to 0,0 -> scale -> move object back to position" trick,
      //   where the second move takes scaling into account!
      // - Does not apply transforms from the child's point of view.
      //   Transform of toolset_position MUST take scaling of one level higher into account!
      //
      // Note: rotate is done around the defined center (cx,cy) of the toolsets position!
      //
      // More:
      // - Safari NEEDS the overflow:visible on the <svg> element, as it defaults to "svg:{overflow: hidden;}".
      //   Other browsers don't need that, they default to: "svg:not(:root) {overflow: hidden;}"
      //
      //   Without this setting, objects are cut-off or become invisible while scaled!

      return svg`
        <g id="toolset-${this.toolsetId}" class="toolset__group-outer"
           transform="rotate(${this.transform.rotate.x}, ${this.svg.cx}, ${this.svg.cy})
                      scale(${this.transform.scale.x}, ${this.transform.scale.y})
                      "
           style="transform-origin:center; transform-box:fill-box;">
          <svg style="overflow:visible;">
            <g class="toolset__group" transform="translate(${this.svg.cx / this.transform.scale.x}, ${this.svg.cy / this.transform.scale.y})"
            style="${styleMap(this._card.themeIsDarkMode()
              ? this.palette.dark
              : this.palette.light)}"
            >
              ${this.renderToolset()}
            </g>
            </svg>
        </g>
      `;
    } else {
      //
      // Render path for ANY other browser that usually follows the standards:
      //
      // - use transform-box:fill-box to make sure every transform is about the object itself!
      // - applying the rules seen from the child's point of view.
      //   So the transform on the toolset_position is NOT scaled, as the scaling is done one level higher.
      //
      // Note: rotate is done around the center of the bounding box. This might NOT be the toolsets center (cx,cy) position!
      //
      return svg`
        <g id="toolset-${this.toolsetId}" class="toolset__group-outer"
           transform="rotate(${this.transform.rotate.x}) scale(${this.transform.scale.x}, ${this.transform.scale.y})"
           style="transform-origin:center; transform-box:fill-box;">
          <svg style="overflow:visible;">
            <g class="toolset__group" transform="translate(${this.svg.cx}, ${this.svg.cy})"
            style="${styleMap(this._card.themeIsDarkMode()
              ? this.palette.dark
              : this.palette.light)}"
            >
              ${this.renderToolset()}
            </g>
            </svg>
        </g>
      `;
    }
  }
} // END of class
