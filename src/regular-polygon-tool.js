import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import Utils from './utils';
import BaseTool from './base-tool';

/** ****************************************************************************
  * RegPolyTool class
  *
  * Summary.
  *
  */

export default class RegPolyTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_REGPOLY_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        radius: 50,
        side_count: 6,
        side_skip: 1,
        angle_offset: 0,
      },
      classes: {
        tool: {
          'sak-polygon': true,
          hover: true,
        },
        regpoly: {
          'sak-polygon__regpoly': true,
        },
      },
      styles: {
        tool: {
        },
        regpoly: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_REGPOLY_CONFIG, argConfig), argPos);

    this.svg.radius = Utils.calculateSvgDimension(argConfig.position.radius);

    this.classes.regpoly = {};
    this.styles.regpoly = {};
    if (this.dev.debug) console.log('RegPolyTool constructor config, svg', this.toolId, this.config, this.svg);
  }

  /** *****************************************************************************
  * RegPolyTool::value()
  *
  * Summary.
  * Receive new state data for the entity this circle is linked to. Called from set hass;
  *
  */
  set value(state) {
    const changed = super.value = state;

    return changed;
  }

  /** *****************************************************************************
  * RegPolyTool::_renderRegPoly()
  *
  * Summary.
  * Renders the regular polygon using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the regular polygon
  *
  */

  _renderRegPoly() {
    const generatePoly = function (p, q, r, a, cx, cy) {
      const base_angle = 2 * Math.PI / p;
      let angle = a + base_angle;
      let x; let y; let
        d_attr = '';

      for (let i = 0; i < p; i++) {
        angle += q * base_angle;

        // Use ~~ as it is faster then Math.floor()
        x = cx + ~~(r * Math.cos(angle));
        y = cy + ~~(r * Math.sin(angle));

        d_attr
          += `${((i === 0) ? 'M' : 'L') + x} ${y} `;

        if (i * q % p === 0 && i > 0) {
          angle += base_angle;
          x = cx + ~~(r * Math.cos(angle));
          y = cy + ~~(r * Math.sin(angle));

          d_attr += `M${x} ${y} `;
        }
      }

      d_attr += 'z';
      return d_attr;
    };

    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.regpoly);

    return svg`
      <path class="${classMap(this.classes.regpoly)}"
        d="${generatePoly(this.config.position.side_count, this.config.position.side_skip, this.svg.radius, this.config.position.angle_offset, this.svg.cx, this.svg.cy)}"
        style="${styleMap(this.styles.regpoly)}"
      />
      `;
  }

  /** *****************************************************************************
  * RegPolyTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  //        @click=${e => this._card.handlePopup(e, this._card.entities[this.defaultEntityIndex()])} >

  render() {
    return svg`
      <g "" id="regpoly-${this.toolId}" class="${classMap(this.classes.tool)}" transform-origin="${this.svg.cx} ${this.svg.cy}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderRegPoly()}
      </g>
    `;
  }
} // END of class
