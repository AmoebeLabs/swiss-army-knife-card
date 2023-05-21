import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';
import { stateIcon } from 'custom-card-helpers';

import { FONT_SIZE } from './const';
import Merge from './merge';
import BaseTool from './base-tool';
import Utils from './utils';

/** ****************************************************************************
  * EntityIconTool class
  *
  * Summary.
  *
  */

export default class EntityIconTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_ICON_CONFIG = {
      classes: {
        tool: {
          'sak-icon': true,
          hover: true,
        },
        icon: {
          'sak-icon__icon': true,
        },
      },
      styles: {
        tool: {
        },
        icon: {
        },
      },
    };
    super(argToolset, Merge.mergeDeep(DEFAULT_ICON_CONFIG, argConfig), argPos);

    // from original
    // this.config.entity = this.config.entity ? this.config.entity : 0;

    // get icon size, and calculate the foreignObject position and size. This must match the icon size
    // 1em = FONT_SIZE pixels, so we can calculate the icon size, and x/y positions of the foreignObject
    // the viewport is 200x200, so we can calulate the offset.
    //
    // NOTE:
    // Safari doesn't use the svg viewport for rendering of the foreignObject, but the real clientsize.
    // So positioning an icon doesn't work correctly...

    this.svg.iconSize = this.config.position.icon_size ? this.config.position.icon_size : 3;
    this.svg.iconPixels = this.svg.iconSize * FONT_SIZE;

    const align = this.config.position.align ? this.config.position.align : 'center';
    const adjust = (align === 'center' ? 0.5 : (align === 'start' ? -1 : +1));

    const clientWidth = 400; // testing
    const correction = clientWidth / this._card.viewBox.width;

    this.svg.xpx = this.svg.cx;
    this.svg.ypx = this.svg.cy;

    if (((this._card.isSafari) || (this._card.iOS)) && (!this._card.isSafari16)) {
      this.svg.iconSize *= correction;

      this.svg.xpx = (this.svg.xpx * correction) - (this.svg.iconPixels * adjust * correction);
      this.svg.ypx = (this.svg.ypx * correction) - (this.svg.iconPixels * 0.5 * correction) - (this.svg.iconPixels * 0.25 * correction);// - (iconPixels * 0.25 / 1.86);
    } else {
      // Get x,y in viewbox dimensions and center with half of size of icon.
      // Adjust horizontal for aligning. Can be 1, 0.5 and -1
      // Adjust vertical for half of height... and correct for 0.25em textfont to align.
      this.svg.xpx -= (this.svg.iconPixels * adjust);
      this.svg.ypx = this.svg.ypx - (this.svg.iconPixels * 0.5) - (this.svg.iconPixels * 0.25);
    }
    this.classes.tool = {};
    this.classes.icon = {};

    this.styles.tool = {};
    this.styles.icon = {};

    if (this.dev.debug) console.log('EntityIconTool constructor coords, dimensions, config', this.coords, this.dimensions, this.config);
  }

  /** *****************************************************************************
  * EntityIconTool::static properties()
  *
  * Summary.
  * Declares the static class properties.
  * Needs eslint parserOptions ecmaVersion: 2022
  *
  * Replaces older style declarations in the constructor, such as
  *
  *  if (!EntityIconTool.sakIconCache) {
  *    EntityIconTool.sakIconCache = {};
  *  }
  *
  */
  static {
    EntityIconTool.sakIconCache = {};
  }

  /** *****************************************************************************
  * EntityIconTool::_buildIcon()
  *
  * Summary.
  * Builds the Icon specification name.
  *
  */
  _buildIcon(entityState, entityConfig, toolIcon) {
    return (
      this.activeAnimation?.icon // Icon from animation
      || toolIcon // Defined by tool
      || entityConfig?.icon // Defined by configuration
      || entityState?.attributes?.icon // Using entity icon
      || stateIcon(entityState) // Use card helper logic (2021.11.21)
    );
  }

  /** *****************************************************************************
  * EntityIconTool::_renderIcon()
  *
  * Summary.
  * Renders the icon using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the icon
  *
  * THIS IS THE ONE!!!!
  */

  _renderIcon() {
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.icon);

    const icon = this._buildIcon(
      this._card.entities[this.defaultEntityIndex()],
      (this.defaultEntityIndex() !== undefined) ? this._card.config.entities[this.defaultEntityIndex()] : undefined,
      this.config.icon,
    );

    // eslint-disable-next-line no-constant-condition
    if (true || (this.svg.xpx === 0)) {
      this.svg.iconSize = this.config.position.icon_size ? this.config.position.icon_size : 2;
      this.svg.iconPixels = this.svg.iconSize * FONT_SIZE;

      // NEW NEW NEW Use % for size of icon...
      this.svg.iconSize = this.config.position.icon_size ? this.config.position.icon_size : 2;
      this.svg.iconPixels = Utils.calculateSvgDimension(this.svg.iconSize);

      const align = this.config.position.align ? this.config.position.align : 'center';
      const adjust = (align === 'center' ? 0.5 : (align === 'start' ? -1 : +1));

      const clientWidth = 400;
      const correction = clientWidth / (this._card.viewBox.width);

      this.svg.xpx = this.svg.cx;// (x * this._card.viewBox.width);
      this.svg.ypx = this.svg.cy;// (y * this._card.viewBox.height);

      if (((this._card.isSafari) || (this._card.iOS)) && (!this._card.isSafari16)) {
        // correction = 1; //
        this.svg.iconSize *= correction;
        this.svg.iconPixels *= correction;

        this.svg.xpx = (this.svg.xpx * correction) - (this.svg.iconPixels * adjust * correction);
        this.svg.ypx = (this.svg.ypx * correction) - (this.svg.iconPixels * 0.9 * correction);
        // - (this.svg.iconPixels * 0.25 * correction);// - (iconPixels * 0.25 / 1.86);
        this.svg.xpx = (this.svg.cx * correction) - (this.svg.iconPixels * adjust * correction);
        this.svg.ypx = (this.svg.cy * correction) - (this.svg.iconPixels * adjust * correction);
      } else {
        // Get x,y in viewbox dimensions and center with half of size of icon.
        // Adjust horizontal for aligning. Can be 1, 0.5 and -1

        this.svg.xpx = this.svg.cx - (this.svg.iconPixels * adjust);
        this.svg.ypx = this.svg.cy - (this.svg.iconPixels * adjust);

        if (this.dev.debug) console.log('EntityIconTool::_renderIcon - svg values =', this.toolId, this.svg, this.config.cx, this.config.cy, align, adjust);
      }
    }

    if (!this.alternateColor) { this.alternateColor = 'rgba(0,0,0,0)'; }

    if (!EntityIconTool.sakIconCache[icon]) {
      const theQuery = this._card.shadowRoot.getElementById('icon-'.concat(this.toolId))?.shadowRoot?.querySelectorAll('*');
      if (theQuery) {
        this.iconSvg = theQuery[0]?.path;
      } else {
        this.iconSvg = undefined;
      }

      if (this.iconSvg) {
        EntityIconTool.sakIconCache[icon] = this.iconSvg;
        // console.log('EntityIconTool, cache - Store: ', icon);
      }
    } else {
      this.iconSvg = EntityIconTool.sakIconCache[icon];
      // console.log('EntityIconTool, cache - Fetch: ', icon);
    }

    let scale;

    // NTS@20201.12.24
    // Add (true) to force rendering the Safari like solution for icons.
    // After the above fix, it seems to work for both Chrome and Safari browsers.
    // That is nice. Now animations also work on Chrome...

    if (this.iconSvg) {
      // Use original size, not the corrected one!
      this.svg.iconSize = this.config.position.icon_size ? this.config.position.icon_size : 2;
      this.svg.iconPixels = Utils.calculateSvgDimension(this.svg.iconSize);

      this.svg.x1 = this.svg.cx - this.svg.iconPixels / 2;
      this.svg.y1 = this.svg.cy - this.svg.iconPixels / 2;
      this.svg.x1 = this.svg.cx - (this.svg.iconPixels * 0.5);
      this.svg.y1 = this.svg.cy - (this.svg.iconPixels * 0.5);

      scale = this.svg.iconPixels / 24;
      // scale = 1;
      // Icon is default drawn at 0,0. As there is no separate viewbox, a transform is required
      // to position the icon on its desired location.
      // Icon is also drawn in a default 24x24 viewbox. So scale the icon to the required size using scale()
      return svg`
        <g id="icon-${this.toolId}" class="${classMap(this.classes.icon)}" style="${styleMap(this.styles.icon)}" x="${this.svg.x1}px" y="${this.svg.y1}px" transform-origin="${this.svg.cx} ${this.svg.cy}">
          <rect x="${this.svg.x1}" y="${this.svg.y1}" height="${this.svg.iconPixels}px" width="${this.svg.iconPixels}px" stroke-width="0px" fill="rgba(0,0,0,0)"></rect>
          <path d="${this.iconSvg}" transform="translate(${this.svg.x1},${this.svg.y1}) scale(${scale})"></path>
        <g>
      `;
    } else {
      // Note @2022.06.26
      // overflow="hidden" is ignored by latest and greatest Safari 15.5. Wow. Nice! Good work!
      // So use a fill/color of rgba(0,0,0,0)...
      return svg`
        <foreignObject width="0px" height="0px" x="${this.svg.xpx}" y="${this.svg.ypx}" overflow="hidden">
          <body>
            <div class="div__icon, hover" xmlns="http://www.w3.org/1999/xhtml"
                style="line-height:${this.svg.iconPixels}px;position:relative;border-style:solid;border-width:0px;border-color:${this.alternateColor};fill:${this.alternateColor};color:${this.alternateColor};">
                <ha-icon icon=${icon} id="icon-${this.toolId}"
                @animationstart=${(e) => this._handleAnimationEvent(e, this)}
                @animationiteration=${(e) => this._handleAnimationEvent(e, this)}
                style="animation: flash 0.15s 20;"></ha-icon>
            </div>
          </body>
        </foreignObject>
        `;
    }
  }

  _handleAnimationEvent(argEvent, argThis) {
    argEvent.stopPropagation();
    argEvent.preventDefault();

    argThis.iconSvg = this._card.shadowRoot.getElementById('icon-'.concat(this.toolId))?.shadowRoot?.querySelectorAll('*')[0]?.path;
    if (argThis.iconSvg) {
      argThis._card.requestUpdate();
    }
  }

  // eslint-disable-next-line no-unused-vars
  firstUpdated(changedProperties) {

  }

  /** *****************************************************************************
  * EntityIconTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  * NTS:
  * Adding        <style> div { overflow: hidden;}</style>
  * to the <g group, clips the icon against the ha-card, ie the div.
  * however, on Safari, all icons are clipped, as if they don't fit the room given to be displayed.
  * a bug in rendering the Icon?? Only first time icon is clipped, then displayed normally if a data update
  * from hass is coming in.
  */

  render() {
    return svg`
      <g "" id="icongrp-${this.toolId}" class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)} >

        ${this._renderIcon()}
      </g>
    `;
  }
} // END of class
