/*
*
* Card      : swiss-army-knife-card.js
* Project   : Home Assistant
* Repository: https://github.com/AmoebeLabs/swiss-army-knife-card
*
* Author    : Mars @ AmoebeLabs.com
*
* License   : MIT
*
* -----
* Description:
*   The swiss army knife card, a versatile multi-tool custom card for
#   the one and only Home Assistant.
*
* Documentation Refs:
*   - https://swiss-army-knife-card-manual.amoebelabs.com/
*   - https://material3-themes-manual.amoebelabs.com/
*
*******************************************************************************
*/

// NTS @2021.10.31
// Check compatibility when upgrading lit stuff. Many versions have conflicts!
// Use compatible lit-* stuff, ie lit-element@2 and lit-html@1.
// Combining other versions may lead to incompatibility, and thus lots of errors and
// tools not working anymore!

import {
  LitElement, html, css, svg, unsafeCSS,
} from 'lit-element';

import { styleMap } from 'lit-html/directives/style-map.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { selectUnit } from '@formatjs/intl-utils';
import { version } from '../package.json';

import {
  SVG_DEFAULT_DIMENSIONS,
  SVG_VIEW_BOX,
  FONT_SIZE,
} from './const';

import Merge from './merge';
import Utils from './utils';
import Templates from './templates';
import Toolset from './toolset';

// Original injector is buggy. Use a patched version, and store this local...
// import * as SvgInjector from '../dist/SVGInjector.min.js'; // lgtm[js/unused-local-variable]

console.info(
  `%c  SWISS-ARMY-KNIFE-CARD  \n%c      Version ${version}      `,
  'color: yellow; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// https://github.com/d3/d3-selection/blob/master/src/selection/data.js
//

/**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

class SwissArmyKnifeCard extends LitElement {
  // card::constructor
  constructor() {
    super();

    this.connected = false;

    // Get cardId for unique SVG gradient Id
    this.cardId = Math.random().toString(36).substr(2, 9);
    this.entities = [];
    this.entitiesStr = [];
    this.attributesStr = [];
    this.secondaryInfoStr = [];
    this.viewBoxSize = SVG_VIEW_BOX;
    this.viewBox = { width: SVG_VIEW_BOX, height: SVG_VIEW_BOX };

    // Create the lists for the toolsets and the tools
    // - toolsets contain a list of toolsets with tools
    // - tools contain the full list of tools!
    this.toolsets = [];
    this.tools = [];

    // 2022.01.24
    // Add card styles functionality
    this.styles = {};
    this.styles.card = {};

    // For history query interval updates.
    this.entityHistory = {};
    this.entityHistory.needed = false;
    this.stateChanged = true;
    this.entityHistory.updating = false;
    this.entityHistory.update_interval = 300;
    // console.log("SAK Constructor,", this.entityHistory);

    // Development settings
    this.dev = {};
    this.dev.debug = false;
    this.dev.performance = false;
    this.dev.m3 = false;

    this.configIsSet = false;

    // Theme mode support
    this.theme = {};
    this.theme.modeChanged = false;
    this.theme.darkMode = false;

    // Safari is the new IE.
    // Check for iOS / iPadOS / Safari to be able to work around some 'features'
    // Some bugs are already 9 years old, and not fixed yet by Apple!
    //
    // However: there is a new SVG engine on its way that might be released in 2023.
    // That should fix a lot of problems, adhere to standards, allow for hardware
    // acceleration and mixing HTML - through the foreignObject - with SVG!
    //
    // The first small fixes are in 16.2-16.4, which is why I have to check for
    // Safari 16, as that version can use the same renderpath as Chrome and Firefox!! WOW!!
    //
    // Detection from: http://jsfiddle.net/jlubean/dL5cLjxt/
    //
    // this.isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    // this.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // See: https://javascriptio.com/view/10924/detect-if-device-is-ios
    // After iOS 13 you should detect iOS devices like this, since iPad will not be detected as iOS devices
    // by old ways (due to new "desktop" options, enabled by default)

    // eslint-disable-next-line no-useless-escape
    this.isSafari = !!window.navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    this.iOS = (/iPad|iPhone|iPod/.test(window.navigator.userAgent)
                || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1))
                && !window.MSStream;
    this.isSafari14 = this.isSafari && /Version\/14\.[0-9]/.test(window.navigator.userAgent);
    this.isSafari15 = this.isSafari && /Version\/15\.[0-9]/.test(window.navigator.userAgent);
    this.isSafari16 = this.isSafari && /Version\/16\.[0-9]/.test(window.navigator.userAgent);
    this.isSafari16 = this.isSafari && /Version\/16\.[0-9]/.test(window.navigator.userAgent);

    // The iOS app does not use a standard agent string...
    // See: https://github.com/home-assistant/iOS/blob/master/Sources/Shared/API/HAAPI.swift
    // It contains strings like "like Safari" and "OS 14_2", and "iOS 14.2.0"

    this.isSafari14 = this.isSafari14 || /os 15.*like safari/.test(window.navigator.userAgent.toLowerCase());
    this.isSafari15 = this.isSafari15 || /os 14.*like safari/.test(window.navigator.userAgent.toLowerCase());
    this.isSafari16 = this.isSafari16 || /os 16.*like safari/.test(window.navigator.userAgent.toLowerCase());

    this.lovelace = SwissArmyKnifeCard.lovelace;

    if (!this.lovelace) {
      console.error("card::constructor - Can't get Lovelace panel");
      throw Error("card::constructor - Can't get Lovelace panel");
    }

    if (!SwissArmyKnifeCard.colorCache) {
      SwissArmyKnifeCard.colorCache = [];
    }

    if (this.dev.debug) console.log('*****Event - card - constructor', this.cardId, new Date().getTime());
  }

  static getSystemStyles() {
    return css`
      :host {
        cursor: default;
        font-size: ${FONT_SIZE}px;
      }

      /* Default settings for the card */
      /* - default cursor */
      /* - SVG overflow is not displayed, ie cutoff by the card edges */
      ha-card {
        cursor: default;
        overflow: hidden;
        
        -webkit-touch-callout: none;  
      }
      
      /* For disabled parts of tools/toolsets */
      /* - No input */
      ha-card.disabled {
        pointer-events: none;
        cursor: default;
      }

      .disabled {
        pointer-events: none !important;
        cursor: default !important;
      }

      /* For 'active' tools/toolsets */
      /* - Show cursor as pointer */
      .hover {
        cursor: pointer;
      }

      /* For hidden tools/toolsets where state for instance is undefined */
      .hidden {
        opacity: 0;
        visibility: hidden;
        transition: visibility 0s 1s, opacity 0.5s linear;
      }

      focus {
        outline: none;
      }
      focus-visible {
        outline: 3px solid blanchedalmond; /* That'll show 'em */
      }
      
      
      @media (print), (prefers-reduced-motion: reduce) {
        .animated {
          animation-duration: 1ms !important;
          transition-duration: 1ms !important;
          animation-iteration-count: 1 !important;
        }
      }

      
      /* Set default host font-size to 10 pixels.
       * In that case 1em = 10 pixels = 1% of 100x100 matrix used
       */
      @media screen and (min-width: 467px) {
        :host {
        font-size: ${FONT_SIZE}px;
        }
      }
      @media screen and (max-width: 466px) {
        :host {
        font-size: ${FONT_SIZE}px;
        }
      }

      :host ha-card {
            padding: 0px 0px 0px 0px;
      }

      .container {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .labelContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 65%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
      }

      .ellipsis {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .state {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        max-width: 100%;
        min-width: 0px;
      }

      #label {
        display: flex;
        line-height: 1;
      }

      #label.bold {
        font-weight: bold;
      }

      #label, #name {
        margin: 3% 0;
      }

      .shadow {
        font-size: 30px;
        font-weight: 700;
        text-anchor: middle;
      }

      .card--dropshadow-5 {
        filter: drop-shadow(0 1px 0 #ccc)
               drop-shadow(0 2px 0 #c9c9c9)
               drop-shadow(0 3px 0 #bbb)
               drop-shadow(0 4px 0 #b9b9b9)
               drop-shadow(0 5px 0 #aaa)
               drop-shadow(0 6px 1px rgba(0,0,0,.1))
               drop-shadow(0 0 5px rgba(0,0,0,.1))
               drop-shadow(0 1px 3px rgba(0,0,0,.3))
               drop-shadow(0 3px 5px rgba(0,0,0,.2))
               drop-shadow(0 5px 10px rgba(0,0,0,.25))
               drop-shadow(0 10px 10px rgba(0,0,0,.2))
               drop-shadow(0 20px 20px rgba(0,0,0,.15));
      }
      .card--dropshadow-medium--opaque--sepia90 {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f22)
                drop-shadow(0.0em 0.07em 0px #b2a98f55)
                drop-shadow(0.0em 0.10em 0px #b2a98f88)
                drop-shadow(0px 0.6em 0.9em rgba(0,0,0,0.15))
                drop-shadow(0px 1.2em 0.15em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.5em rgba(0,0,0,0.1))
                sepia(90%);
      }

      .card--dropshadow-heavy--sepia90 {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f22)
                drop-shadow(0.0em 0.07em 0px #b2a98f55)
                drop-shadow(0.0em 0.10em 0px #b2a98f88)
                drop-shadow(0px 0.3em 0.45em rgba(0,0,0,0.5))
                drop-shadow(0px 0.6em 0.07em rgba(0,0,0,0.3))
                drop-shadow(0px 1.2em 1.25em rgba(0,0,0,1))
                drop-shadow(0px 1.8em 1.6em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.0em rgba(0,0,0,0.1))
                drop-shadow(0px 3.0em 2.5em rgba(0,0,0,0.1))
                sepia(90%);
      }

      .card--dropshadow-heavy {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f22)
                drop-shadow(0.0em 0.07em 0px #b2a98f55)
                drop-shadow(0.0em 0.10em 0px #b2a98f88)
                drop-shadow(0px 0.3em 0.45em rgba(0,0,0,0.5))
                drop-shadow(0px 0.6em 0.07em rgba(0,0,0,0.3))
                drop-shadow(0px 1.2em 1.25em rgba(0,0,0,1))
                drop-shadow(0px 1.8em 1.6em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.0em rgba(0,0,0,0.1))
                drop-shadow(0px 3.0em 2.5em rgba(0,0,0,0.1));
      }

      .card--dropshadow-medium--sepia90 {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f)
                drop-shadow(0.0em 0.15em 0px #b2a98f)
                drop-shadow(0.0em 0.15em 0px #b2a98f)
                drop-shadow(0px 0.6em 0.9em rgba(0,0,0,0.15))
                drop-shadow(0px 1.2em 0.15em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.5em rgba(0,0,0,0.1))
                sepia(90%);
      }

      .card--dropshadow-medium {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f)
                drop-shadow(0.0em 0.15em 0px #b2a98f)
                drop-shadow(0.0em 0.15em 0px #b2a98f)
                drop-shadow(0px 0.6em 0.9em rgba(0,0,0,0.15))
                drop-shadow(0px 1.2em 0.15em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.5em rgba(0,0,0,0.1));
      }

      .card--dropshadow-light--sepia90 {
        filter: drop-shadow(0px 0.10em 0px #b2a98f)
                drop-shadow(0.1em 0.5em 0.2em rgba(0, 0, 0, .5))
                sepia(90%);
      }

      .card--dropshadow-light {
        filter: drop-shadow(0px 0.10em 0px #b2a98f)
                drop-shadow(0.1em 0.5em 0.2em rgba(0, 0, 0, .5));
      }

      .card--dropshadow-down-and-distant {
        filter: drop-shadow(0px 0.05em 0px #b2a98f)
                drop-shadow(0px 14px 10px rgba(0,0,0,0.15))
                drop-shadow(0px 24px 2px rgba(0,0,0,0.1))
                drop-shadow(0px 34px 30px rgba(0,0,0,0.1));
      }
      
      .card--filter-none {
      }

      .horseshoe__svg__group {
        transform: translateY(15%);
      }

    `;
  }

  /** *****************************************************************************
  * card::getUserStyles()
  *
  * Summary.
  * Returns the user defined CSS styles for the card in sak_user_templates config
  * section in lovelace configuration.
  *
  */

  static getUserStyles() {
    this.userContent = '';

    if ((SwissArmyKnifeCard.lovelace.config.sak_user_templates)
        && (SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_css_definitions)) {
      this.userContent = SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_css_definitions.reduce((accumulator, currentValue) => accumulator + currentValue.content, '');
    }

    return css`${unsafeCSS(this.userContent)}`;
  }

  static getSakStyles() {
    this.sakContent = '';

    if ((SwissArmyKnifeCard.lovelace.config.sak_sys_templates)
        && (SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_css_definitions)) {
      this.sakContent = SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_css_definitions.reduce((accumulator, currentValue) => accumulator + currentValue.content, '');
    }

    return css`${unsafeCSS(this.sakContent)}`;
  }

  static getSakSvgDefinitions() {
    SwissArmyKnifeCard.lovelace.sakSvgContent = null;
    let sakSvgContent = '';

    if ((SwissArmyKnifeCard.lovelace.config.sak_sys_templates)
        && (SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions)) {
      sakSvgContent = SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions.reduce((accumulator, currentValue) => accumulator + currentValue.content, '');
    }
    // Cache result for later use in other cards
    SwissArmyKnifeCard.sakSvgContent = unsafeSVG(sakSvgContent);
  }

  static getUserSvgDefinitions() {
    SwissArmyKnifeCard.lovelace.userSvgContent = null;
    let userSvgContent = '';

    if ((SwissArmyKnifeCard.lovelace.config.sak_user_templates)
        && (SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_svg_definitions)) {
      userSvgContent = SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_svg_definitions.reduce((accumulator, currentValue) => accumulator + currentValue.content, '');
    }
    // Cache result for later use other cards
    SwissArmyKnifeCard.userSvgContent = unsafeSVG(userSvgContent);
  }

  /** *****************************************************************************
  * card::get styles()
  *
  * Summary.
  * Returns the static CSS styles for the lit-element
  *
  * Note:
  * - The BEM (http://getbem.com/naming/) naming style for CSS is used
  *   Of course, if no mistakes are made ;-)
  *
  * Note2:
  * - get styles is a static function and is called ONCE at initialization.
  *   So, we need to get lovelace here...
  */
  static get styles() {
    // console.log('SAK - get styles');
    if (!SwissArmyKnifeCard.lovelace) SwissArmyKnifeCard.lovelace = Utils.getLovelace();

    if (!SwissArmyKnifeCard.lovelace) {
      console.error("SAK - Can't get reference to Lovelace");
      throw Error("card::get styles - Can't get Lovelace panel");
    }
    if (!SwissArmyKnifeCard.lovelace.config.sak_sys_templates) {
      console.error('SAK - System Templates reference NOT defined.');
      throw Error('card::get styles - System Templates reference NOT defined!');
    }
    if (!SwissArmyKnifeCard.lovelace.config.sak_user_templates) {
      console.warning('SAK - User Templates reference NOT defined. Did you NOT include them?');
    }

    // #TESTING
    // Testing dark/light mode support for future functionality
    // const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    // console.log('get styles', darkModeMediaQuery);
    // darkModeMediaQuery.addListener((e) => {
    // const darkModeOn = e.matches;
    // console.log(`Dark mode is ${darkModeOn ? '🌒 on' : '☀️ off'}.`);
    // });
    // console.log('get styles 2', darkModeMediaQuery);

    // Get - only ONCE - the external SVG definitions for both SAK and UserSvgTool
    // These definitions are cached into the static class of the card
    //
    // Note: If you change a view, and do a refresh (F5) everything is loaded.
    // But after that: HA asks you to refresh the page --> BAM, all Lovelace
    // cached data is gone. So we need a check/reload in a card...

    SwissArmyKnifeCard.getSakSvgDefinitions();
    SwissArmyKnifeCard.getUserSvgDefinitions();

    return css`
      ${SwissArmyKnifeCard.getSystemStyles()}
      ${SwissArmyKnifeCard.getSakStyles()}
      ${SwissArmyKnifeCard.getUserStyles()}
    `;
  }

  /** *****************************************************************************
  * card::set hass()
  *
  * Summary.
  * Updates hass data for the card
  *
  */

  set hass(hass) {
    if (!this.counter) this.counter = 0;
    this.counter += 1;

    // Check for theme mode and theme mode change...
    if (hass.themes.darkMode !== this.theme.darkMode) {
      this.theme.darkMode = hass.themes.darkMode;
      this.theme.modeChanged = true;
    }

    // Set ref to hass, use "_"for the name ;-)
    if (this.dev.debug) console.log('*****Event - card::set hass', this.cardId, new Date().getTime());
    this._hass = hass;

    if (!this.connected) {
      if (this.dev.debug) console.log('set hass but NOT connected', this.cardId);

    // 2020.02.10 Troubles with connectcallback late, so windows are not yet calculated. ie
    // things around icons go wrong...
    // what if return is here..
      // return;
    } else {
      // #WIP
      // this.requestUpdate();
    }

    if (!this.config.entities) {
      return;
    }

    let entityHasChanged = false;

    // Update state strings and check for changes.
    // Only if changed, continue and force render
    let value;
    let index = 0;

    let secInfoSet = false;
    let newSecInfoState;
    let newSecInfoStateStr;

    let attrSet = false;
    let newStateStr;
    // eslint-disable-next-line no-restricted-syntax, no-unused-vars
    for (value of this.config.entities) {
      this.entities[index] = hass.states[this.config.entities[index].entity];

      if (this.entities[index] === undefined) {
        console.error('SAK - set hass, entity undefined: ', this.config.entities[index].entity);
        // Temp disable throw Error(`Set hass, entity undefined: ${this.config.entities[index].entity}`);
      }

      // Get secondary info state if specified and available
      if (this.config.entities[index].secondary_info) {
        secInfoSet = true;
        newSecInfoState = this.entities[index][this.config.entities[index].secondary_info];
        newSecInfoStateStr = this._buildSecondaryInfo(newSecInfoState, this.config.entities[index]);

        if (newSecInfoStateStr !== this.secondaryInfoStr[index]) {
          this.secondaryInfoStr[index] = newSecInfoStateStr;
          entityHasChanged = true;
        }
      }

      // Get attribute state if specified and available
      if (this.config.entities[index].attribute) {
        // #WIP:
        // Check for indexed or mapped attributes, like weather forecast (array of 5 days with a map containing attributes)....
        //
        // states['weather.home'].attributes['forecast'][0].detailed_description
        // attribute: forecast[0].condition
        //

        let { attribute } = this.config.entities[index];
        let attrMore = '';
        let attributeState = '';

        const arrayPos = this.config.entities[index].attribute.indexOf('[');
        const dotPos = this.config.entities[index].attribute.indexOf('.');
        let arrayIdx = 0;
        let arrayMap = '';

        if (arrayPos !== -1) {
          // We have an array. Split...
          attribute = this.config.entities[index].attribute.substr(0, arrayPos);
          attrMore = this.config.entities[index].attribute.substr(arrayPos, this.config.entities[index].attribute.length - arrayPos);

          // Just hack, assume single digit index...
          arrayIdx = attrMore[1];
          arrayMap = attrMore.substr(4, attrMore.length - 4);

          // Fetch state
          attributeState = this.entities[index].attributes[attribute][arrayIdx][arrayMap];
          // console.log('set hass, attributes with array/map', this.config.entities[index].attribute, attribute, attrMore, arrayIdx, arrayMap, attributeState);
        } else if (dotPos !== -1) {
          // We have a map. Split...
          attribute = this.config.entities[index].attribute.substr(0, dotPos);
          attrMore = this.config.entities[index].attribute.substr(arrayPos, this.config.entities[index].attribute.length - arrayPos);
          arrayMap = attrMore.substr(1, attrMore.length - 1);

          // Fetch state
          attributeState = this.entities[index].attributes[attribute][arrayMap];

          console.log('set hass, attributes with map', this.config.entities[index].attribute, attribute, attrMore);
        } else {
          // default attribute handling...
          attributeState = this.entities[index].attributes[attribute];
        }

        // eslint-disable-next-line no-constant-condition
        if (true) { // (typeof attributeState != 'undefined') {
          newStateStr = this._buildState(attributeState, this.config.entities[index]);
          if (newStateStr !== this.attributesStr[index]) {
            this.attributesStr[index] = newStateStr;
            entityHasChanged = true;
          }
          attrSet = true;
        }
        // 2021.10.30
        // Due to change in light percentage, check for undefined.
        // If bulb is off, NO percentage is given anymore, so is probably 'undefined'.
        // Any tool should still react to a percentage going from a valid value to undefined!
      }
      if ((!attrSet) && (!secInfoSet)) {
        newStateStr = this._buildState(this.entities[index].state, this.config.entities[index]);
        if (newStateStr !== this.entitiesStr[index]) {
          this.entitiesStr[index] = newStateStr;
          entityHasChanged = true;
        }
        if (this.dev.debug) console.log('set hass - attrSet=false', this.cardId, `${new Date().getSeconds().toString()}.${new Date().getMilliseconds().toString()}`, newStateStr);
      }

      index += 1;
      attrSet = false;
      secInfoSet = false;
    }

    if ((!entityHasChanged) && (!this.theme.modeChanged)) {
      // console.timeEnd("--> " + this.cardId + " PERFORMANCE card::hass");

      return;
    }

    // Either one of the entities has changed, or the theme mode. So update all toolsets with new data.
    if (this.toolsets) {
      this.toolsets.map((item) => {
        item.updateValues();
        return true;
      });
    }

    // Always request update to render the card if any of the states, attributes or theme mode have changed...

    this.requestUpdate();

    // An update has been requested to recalculate / redraw the tools, so reset theme mode changed
    this.theme.modeChanged = false;

    this.counter -= 1;

    // console.timeEnd("--> " + this.cardId + " PERFORMANCE card::hass");
  }

  /** *****************************************************************************
  * card::setConfig()
  *
  * Summary.
  * Sets/Updates the card configuration. Rarely called if the doc is right
  *
  */

  setConfig(config) {
    if (this.dev.performance) console.time(`--> ${this.cardId} PERFORMANCE card::setConfig`);

    if (this.dev.debug) console.log('*****Event - setConfig', this.cardId, new Date().getTime());
    config = JSON.parse(JSON.stringify(config));

    if (config.dev) this.dev = { ...this.dev, ...config.dev };

    if (this.dev.debug) console.log('setConfig', this.cardId);

    if (!config.layout) {
      throw Error('card::setConfig - No layout defined');
    }

    // Temp disable for layout template check...
    // if (!config.layout.toolsets) {
    // throw Error('card::setConfig - No toolsets defined');
    // }

    // testing
    if (config.entities) {
      const newdomain = this._computeDomain(config.entities[0].entity);
      if (newdomain !== 'sensor') {
        // If not a sensor, check if attribute is a number. If so, continue, otherwise Error...
        if (config.entities[0].attribute && !isNaN(config.entities[0].attribute)) {
          throw Error('card::setConfig - First entity or attribute must be a numbered sensorvalue, but is NOT');
        }
      }
    }

    // Copy config, as we must have write access to replace templates!
    const newConfig = Merge.mergeDeep(config);

    // #TODO must be removed after removal of segmented arcs part below
    this.config = newConfig;

    // NEW for ts processing
    this.toolset = [];

    const thisMe = this;
    function findTemplate(key, value) {
      // Filtering out properties
      // console.log("findTemplate, key=", key, "value=", value);
      if (value?.template) {
        const template = thisMe.lovelace.config.sak_user_templates.templates[value.template.name];
        if (!template) {
          console.error('Template not found...', value.template, template);
        }

        const replacedValue = Templates.replaceVariables3(value.template.variables, template);
        // Hmm. cannot add .template var. object is not extensible...
        // replacedValue.template = 'replaced';
        const secondValue = Merge.mergeDeep(replacedValue);
        // secondValue.from_template = 'replaced';

        return secondValue;
      }
      if (key === 'template') {
        // Template is gone via replace!!!! No template anymore, as there is no merge done.
        console.log('findTemplate return key=template/value', key, undefined);

        return value;
      }
      // console.log("findTemplate return key/value", key, value);
      return value;
    }

    // Find & Replace template definitions. This also supports layout templates
    const cfg = JSON.stringify(this.config, findTemplate);

    // To further process toolset templates, get reference to toolsets
    const cfgobj = JSON.parse(cfg).layout.toolsets;

    // Set layout template if found
    if (this.config.layout.template) {
      this.config.layout = JSON.parse(cfg).layout;
    }

    // Continue to check & replace partial toolset templates and overrides
    this.config.layout.toolsets.map((toolsetCfg, toolidx) => {
      let toolList = null;

      if (!this.toolsets) this.toolsets = [];

      // eslint-disable-next-line no-constant-condition
      if (true) {
        let found = false;
        let toolAdd = [];

        toolList = cfgobj[toolidx].tools;
        // Check for empty tool list. This can be if template is used. Tools come from template, not from config...
        if (toolsetCfg.tools) {
          toolsetCfg.tools.map((tool, index) => {
            cfgobj[toolidx].tools.map((toolT, indexT) => {
              if (tool.id === toolT.id) {
                if (toolsetCfg.template) {
                  if (this.config.layout.toolsets[toolidx].position)
                    cfgobj[toolidx].position = Merge.mergeDeep(this.config.layout.toolsets[toolidx].position);

                  toolList[indexT] = Merge.mergeDeep(toolList[indexT], tool);

                  // After merging/replacing. We might get some template definitions back!!!!!!
                  toolList[indexT] = JSON.parse(JSON.stringify(toolList[indexT], findTemplate));

                  found = true;
                }
                if (this.dev.debug) console.log('card::setConfig - got toolsetCfg toolid', tool, index, toolT, indexT, tool);
              }
              cfgobj[toolidx].tools[indexT] = Templates.getJsTemplateOrValueConfig(cfgobj[toolidx].tools[indexT], Merge.mergeDeep(cfgobj[toolidx].tools[indexT]));
              return found;
            });
            if (!found) toolAdd = toolAdd.concat(toolsetCfg.tools[index]);
            return found;
          });
        }
        toolList = toolList.concat(toolAdd);
      }

      toolsetCfg = cfgobj[toolidx];
      const newToolset = new Toolset(this, toolsetCfg);
      this.toolsets.push(newToolset);
      return true;
    });

    // Special case. Abuse card for m3 conversion to output
    if (this.dev.m3) {
      console.log('*** M3 - Checking for m3.yaml template to convert...');

      if (this.lovelace.config.sak_user_templates.templates.m3) {
        const { m3 } = this.lovelace.config.sak_user_templates.templates;

        console.log('*** M3 - Found. Material 3 conversion starting...');
        // These variables are used of course, but eslint thinks they are NOT.
        // If I remove them, eslint complains about undefined variables...
        // eslint-disable-next-line no-unused-vars
        let palette = '';
        // eslint-disable-next-line no-unused-vars
        let colordefault = '';
        // eslint-disable-next-line no-unused-vars
        let colorlight = '';
        // eslint-disable-next-line no-unused-vars
        let colordark = '';

        let surfacelight = '';
        let primarylight = '';
        let neutrallight = '';

        let surfacedark = '';
        let primarydark = '';
        let neutraldark = '';

        const colorEntities = {};
        const cssNames = {};
        const cssNamesRgb = {};

        m3.entities.map((entity) => {
          if (['ref.palette', 'sys.color', 'sys.color.light', 'sys.color.dark'].includes(entity.category_id)) {
            if (!entity.tags.includes('alias')) {
              colorEntities[entity.id] = { value: entity.value, tags: entity.tags };
            }
          }

          if (entity.category_id === 'ref.palette') {
            palette += `${entity.id}: '${entity.value}'\n`;

            // test for primary light color...
            if (entity.id === 'md.ref.palette.primary40') {
              primarylight = entity.value;
            }
            // test for primary dark color...
            if (entity.id === 'md.ref.palette.primary80') {
              primarydark = entity.value;
            }

            // test for neutral light color...
            if (entity.id === 'md.ref.palette.neutral40') {
              neutrallight = entity.value;
            }
            // test for neutral light color...
            if (entity.id === 'md.ref.palette.neutral80') {
              neutraldark = entity.value;
            }
          }

          if (entity.category_id === 'sys.color') {
            colordefault += `${entity.id}: '${entity.value}'\n`;
          }

          if (entity.category_id === 'sys.color.light') {
            colorlight += `${entity.id}: '${entity.value}'\n`;

            // test for surface light color...
            if (entity.id === 'md.sys.color.surface.light') {
              surfacelight = entity.value;
            }
          }

          if (entity.category_id === 'sys.color.dark') {
            colordark += `${entity.id}: '${entity.value}'\n`;

            // test for surface light color...
            if (entity.id === 'md.sys.color.surface.dark') {
              surfacedark = entity.value;
            }
          }
          return true;
        });

        ['primary', 'secondary', 'tertiary', 'error', 'neutral', 'neutral-variant'].forEach((paletteName) => {
          [5, 15, 25, 35, 45, 65, 75, 85].forEach((step) => {
            colorEntities[`md.ref.palette.${paletteName}${step.toString()}`] = {
              value: this._getGradientValue(
                colorEntities[`md.ref.palette.${paletteName}${(step - 5).toString()}`].value,
                colorEntities[`md.ref.palette.${paletteName}${(step + 5).toString()}`].value,
                0.5,
              ),
              tags: [...colorEntities[`md.ref.palette.${paletteName}${(step - 5).toString()}`].tags],
            };
            colorEntities[`md.ref.palette.${paletteName}${step.toString()}`].tags[3] = paletteName + step.toString();
          });
          colorEntities[`md.ref.palette.${paletteName}7`] = {
            value: this._getGradientValue(
              colorEntities[`md.ref.palette.${paletteName}5`].value,
              colorEntities[`md.ref.palette.${paletteName}10`].value,
              0.5,
            ),
            tags: [...colorEntities[`md.ref.palette.${paletteName}10`].tags],
          };
          colorEntities[`md.ref.palette.${paletteName}7`].tags[3] = `${paletteName}7`;

          colorEntities[`md.ref.palette.${paletteName}92`] = {
            value: this._getGradientValue(
              colorEntities[`md.ref.palette.${paletteName}90`].value,
              colorEntities[`md.ref.palette.${paletteName}95`].value,
              0.5,
            ),
            tags: [...colorEntities[`md.ref.palette.${paletteName}90`].tags],
          };
          colorEntities[`md.ref.palette.${paletteName}92`].tags[3] = `${paletteName}92`;

          colorEntities[`md.ref.palette.${paletteName}97`] = {
            value: this._getGradientValue(
              colorEntities[`md.ref.palette.${paletteName}95`].value,
              colorEntities[`md.ref.palette.${paletteName}99`].value,
              0.5,
            ),
            tags: [...colorEntities[`md.ref.palette.${paletteName}90`].tags],
          };
          colorEntities[`md.ref.palette.${paletteName}97`].tags[3] = `${paletteName}97`;
        });

        // eslint-disable-next-line no-restricted-syntax
        for (const [index, entity] of Object.entries(colorEntities)) {
          // eslint-disable-next-line no-use-before-define
          cssNames[index] = `theme-${entity.tags[1]}-${entity.tags[2]}-${entity.tags[3]}: rgb(${hex2rgb(entity.value)})`;
          // eslint-disable-next-line no-use-before-define
          cssNamesRgb[index] = `theme-${entity.tags[1]}-${entity.tags[2]}-${entity.tags[3]}-rgb: ${hex2rgb(entity.value)}`;
        }

        // https://filosophy.org/code/online-tool-to-lighten-color-without-alpha-channel/

        // eslint-disable-next-line no-inner-declarations
        function hex2rgb(hexColor) {
          const rgbCol = {};

          rgbCol.r = Math.round(parseInt(hexColor.substr(1, 2), 16));
          rgbCol.g = Math.round(parseInt(hexColor.substr(3, 2), 16));
          rgbCol.b = Math.round(parseInt(hexColor.substr(5, 2), 16));

          // const cssRgbColor = "rgb(" + rgbCol.r + "," + rgbCol.g + "," + rgbCol.b + ")";
          const cssRgbColor = `${rgbCol.r},${rgbCol.g},${rgbCol.b}`;
          return cssRgbColor;
        }

        // eslint-disable-next-line no-inner-declarations
        function getSurfaces(surfaceColor, paletteColor, opacities, cssName, mode) {
          const bgCol = {};
          const fgCol = {};

          bgCol.r = Math.round(parseInt(surfaceColor.substr(1, 2), 16));
          bgCol.g = Math.round(parseInt(surfaceColor.substr(3, 2), 16));
          bgCol.b = Math.round(parseInt(surfaceColor.substr(5, 2), 16));

          fgCol.r = Math.round(parseInt(paletteColor.substr(1, 2), 16));
          fgCol.g = Math.round(parseInt(paletteColor.substr(3, 2), 16));
          fgCol.b = Math.round(parseInt(paletteColor.substr(5, 2), 16));

          let surfaceColors = '';
          let r; let g; let b;
          opacities.forEach((opacity, index) => {
            r = Math.round(opacity * fgCol.r + (1 - opacity) * bgCol.r);
            g = Math.round(opacity * fgCol.g + (1 - opacity) * bgCol.g);
            b = Math.round(opacity * fgCol.b + (1 - opacity) * bgCol.b);

            surfaceColors += `${cssName + (index + 1).toString()}-${mode}: rgb(${r},${g},${b})\n`;
            surfaceColors += `${cssName + (index + 1).toString()}-${mode}-rgb: ${r},${g},${b}\n`;
          });

          return surfaceColors;
        }

        // Generate surfaces for dark and light...
        const opacitysurfacelight = [0.03, 0.05, 0.08, 0.11, 0.15, 0.19, 0.24, 0.29, 0.35, 0.4];
        const opacitysurfacedark = [0.05, 0.08, 0.11, 0.15, 0.19, 0.24, 0.29, 0.35, 0.40, 0.45];

        const surfacenL = getSurfaces(surfacelight, neutrallight, opacitysurfacelight, '  theme-ref-elevation-surface-neutral', 'light');

        const neutralvariantlight = colorEntities['md.ref.palette.neutral-variant40'].value;
        const surfacenvL = getSurfaces(surfacelight, neutralvariantlight, opacitysurfacelight, '  theme-ref-elevation-surface-neutral-variant', 'light');

        const surfacepL = getSurfaces(surfacelight, primarylight, opacitysurfacelight, '  theme-ref-elevation-surface-primary', 'light');

        const secondarylight = colorEntities['md.ref.palette.secondary40'].value;
        const surfacesL = getSurfaces(surfacelight, secondarylight, opacitysurfacelight, '  theme-ref-elevation-surface-secondary', 'light');

        const tertiarylight = colorEntities['md.ref.palette.tertiary40'].value;
        const surfacetL = getSurfaces(surfacelight, tertiarylight, opacitysurfacelight, '  theme-ref-elevation-surface-tertiary', 'light');

        const errorlight = colorEntities['md.ref.palette.error40'].value;
        const surfaceeL = getSurfaces(surfacelight, errorlight, opacitysurfacelight, '  theme-ref-elevation-surface-error', 'light');

        // DARK
        const surfacenD = getSurfaces(surfacedark, neutraldark, opacitysurfacedark, '  theme-ref-elevation-surface-neutral', 'dark');

        const neutralvariantdark = colorEntities['md.ref.palette.neutral-variant80'].value;
        const surfacenvD = getSurfaces(surfacedark, neutralvariantdark, opacitysurfacedark, '  theme-ref-elevation-surface-neutral-variant', 'dark');

        const surfacepD = getSurfaces(surfacedark, primarydark, opacitysurfacedark, '  theme-ref-elevation-surface-primary', 'dark');

        const secondarydark = colorEntities['md.ref.palette.secondary80'].value;
        const surfacesD = getSurfaces(surfacedark, secondarydark, opacitysurfacedark, '  theme-ref-elevation-surface-secondary', 'dark');

        const tertiarydark = colorEntities['md.ref.palette.tertiary80'].value;
        const surfacetD = getSurfaces(surfacedark, tertiarydark, opacitysurfacedark, '  theme-ref-elevation-surface-tertiary', 'dark');

        const errordark = colorEntities['md.ref.palette.error80'].value;
        const surfaceeD = getSurfaces(surfacedark, errordark, opacitysurfacedark, '  theme-ref-elevation-surface-error', 'dark');

        let themeDefs = '';
        // eslint-disable-next-line no-restricted-syntax
        for (const [index, cssName] of Object.entries(cssNames)) { // lgtm[js/unused-local-variable]
          if (cssName.substring(0, 9) === 'theme-ref') {
            themeDefs += `  ${cssName}\n`;
            themeDefs += `  ${cssNamesRgb[index]}\n`;
          }
        }
        // Dump full theme contents to console.
        // User should copy this content into the theme definition YAML file.
        console.log(surfacenL + surfacenvL + surfacepL + surfacesL + surfacetL + surfaceeL
                    + surfacenD + surfacenvD + surfacepD + surfacesD + surfacetD + surfaceeD
                    + themeDefs);

        console.log('*** M3 - Material 3 conversion DONE. You should copy the above output...');
      }
    }

    // Get aspectratio. This can be defined at card level or layout level
    this.aspectratio = (this.config.layout.aspectratio || this.config.aspectratio || '1/1').trim();

    const ar = this.aspectratio.split('/');
    if (!this.viewBox) this.viewBox = {};
    this.viewBox.width = ar[0] * SVG_DEFAULT_DIMENSIONS;
    this.viewBox.height = ar[1] * SVG_DEFAULT_DIMENSIONS;

    if (this.config.layout.styles?.card) {
      this.styles.card = this.config.layout.styles.card;
    }

    if (this.dev.debug) console.log('Step 5: toolconfig, list of toolsets', this.toolsets);
    if (this.dev.debug) console.log('debug - setConfig', this.cardId, this.config);
    if (this.dev.performance) console.timeEnd(`--> ${this.cardId} PERFORMANCE card::setConfig`);

    this.configIsSet = true;
  }

  /** *****************************************************************************
  * card::connectedCallback()
  *
  * Summary.
  *
  */
  connectedCallback() {
    if (this.dev.performance) console.time(`--> ${this.cardId} PERFORMANCE card::connectedCallback`);

    if (this.dev.debug) console.log('*****Event - connectedCallback', this.cardId, new Date().getTime());
    this.connected = true;
    super.connectedCallback();

    if (this.entityHistory.update_interval) {
      // Fix crash while set hass not yet called, and thus no access to entities!
      this.updateOnInterval();
      // #TODO, modify to total interval
      // Use fast interval at start, and normal interval after that, if _hass is defined...
      clearInterval(this.interval);
      this.interval = setInterval(
        () => this.updateOnInterval(),
        this._hass ? this.entityHistory.update_interval * 1000 : 1000,
      );
    }
    if (this.dev.debug) console.log('ConnectedCallback', this.cardId);

    // MUST request updates again, as no card is displayed otherwise as long as there is no data coming in...
    this.requestUpdate();
    if (this.dev.performance) console.timeEnd(`--> ${this.cardId} PERFORMANCE card::connectedCallback`);
  }

  /** *****************************************************************************
  * card::disconnectedCallback()
  *
  * Summary.
  *
  */
  disconnectedCallback() {
    if (this.dev.performance) console.time(`--> ${this.cardId} PERFORMANCE card::disconnectedCallback`);

    if (this.dev.debug) console.log('*****Event - disconnectedCallback', this.cardId, new Date().getTime());
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = 0;
    }
    super.disconnectedCallback();
    if (this.dev.debug) console.log('disconnectedCallback', this.cardId);
    this.connected = false;
    if (this.dev.performance) console.timeEnd(`--> ${this.cardId} PERFORMANCE card::disconnectedCallback`);
  }

  /** *****************************************************************************
  * card::firstUpdated()
  *
  * Summary.
  * firstUpdated fires after the first time the card hs been updated using its render method,
  * but before the browser has had a chance to paint.
  *
  */

  firstUpdated(changedProperties) {
    if (this.dev.debug) console.log('*****Event - card::firstUpdated', this.cardId, new Date().getTime());

    if (this.toolsets) {
      this.toolsets.map(async (item) => {
        item.firstUpdated(changedProperties);
        return true;
      });
    }
  }

  /** *****************************************************************************
  * card::updated()
  *
  * Summary.
  *
  */
  updated(changedProperties) {
    if (this.dev.debug) console.log('*****Event - Updated', this.cardId, new Date().getTime());

    if (this.toolsets) {
      this.toolsets.map(async (item) => {
        item.updated(changedProperties);
        return true;
      });
    }
  }

  /** *****************************************************************************
  * card::render()
  *
  * Summary.
  * Renders the complete SVG based card according to the specified layout.
  *
  * render ICON TESTING pathh lzwzmegla undefined undefined
  * render ICON TESTING pathh lzwzmegla undefined NodeList [ha-svg-icon]
  * render ICON TESTING pathh lzwzmegla M7,2V13H10V22L17,10H13L17,2H7Z NodeList [ha-svg-icon]
  */

  render() {
    if (this.dev.performance) console.time(`--> ${this.cardId} PERFORMANCE card::render`);
    if (this.dev.debug) console.log('*****Event - render', this.cardId, new Date().getTime());

    if (!this.connected) {
      if (this.dev.debug) console.log('render but NOT connected', this.cardId, new Date().getTime());
      return;
    }

    let myHtml;

    try {
      if (this.config.disable_card) {
        myHtml = html`
                  <div class="container" id="container">
                    ${this._renderSvg()}
                  </div>
                  `;
      } else {
        myHtml = html`
                  <ha-card style="${styleMap(this.styles.card)}">
                    <div class="container" id="container" 
                    >
                      ${this._renderSvg()}
                    </div>
                  </ha-card>
                  `;
      }
    } catch (error) {
      console.error(error);
    }
    if (this.dev.performance) console.timeEnd(`--> ${this.cardId} PERFORMANCE card::render`);

    return myHtml;
  }

  _renderSakSvgDefinitions() {
    return svg`
    ${SwissArmyKnifeCard.sakSvgContent}
    `;
  }

  _renderUserSvgDefinitions() {
    return svg`
    ${SwissArmyKnifeCard.userSvgContent}
    `;
  }

  themeIsDarkMode() {
    return (this.theme.darkMode === true);
  }

  themeIsLightMode() {
    return (this.theme.darkMode === false);
  }

  /** *****************************************************************************
  * card::_RenderToolsets()
  *
  * Summary.
  * Renders the toolsets
  *
  */

  _RenderToolsets() {
    if (this.dev.debug) console.log('all the tools in renderTools', this.tools);

    return svg`
              <g id="toolsets" class="toolsets__group"
              >
                ${this.toolsets.map((toolset) => toolset.render())}
              </g>

            <defs>
              ${this._renderSakSvgDefinitions()}
              ${this._renderUserSvgDefinitions()}
            </defs>
    `;
  }

  /** *****************************************************************************
  * card::_renderSvg()
  *
  * Summary.
  * Renders the SVG
  *
  * NTS:
  * If height and width given for svg it equals the viewbox. The card is not scaled
  * anymore to the full dimensions of the card given by hass/lovelace.
  * Card or svg is also placed default at start of viewport (not box), and can be
  * placed at start, center or end of viewport (Use align-self to center it).
  *
  * 1.  If height and width are ommitted, the ha-card/viewport is forced to the x/y
  *     aspect ratio of the viewbox, ie 1:1. EXACTLY WHAT WE WANT!
  * 2.  If height and width are set to 100%, the viewport (or ha-card) forces the
  *     aspect-ratio on the svg. Although GetCardSize is set to 4, it seems the
  *     height is forced to 150px, so part of the viewbox/svg is not shown or
  *     out of proportion!
  *
  */

  _renderCardAttributes() {
    let entityValue;
    const attributes = [];

    this._attributes = '';

    for (let i = 0; i < this.entities.length; i++) {
      entityValue = this.attributesStr[i]
        ? this.attributesStr[i]
        : this.secondaryInfoStr[i]
          ? this.secondaryInfoStr[i]
          : this.entitiesStr[i];
      attributes.push(entityValue);
    }
    this._attributes = attributes;
    return attributes;
  }

  _renderSvg() {
    const cardFilter = this.config.card_filter ? this.config.card_filter : 'card--filter-none';

    const svgItems = [];

    // The extra group is required for Safari to have filters work and updates are rendered.
    // If group omitted, some cards do update, and some not!!!! Don't ask why!
    // style="${styleMap(this.styles.card)}"

    this._renderCardAttributes();

    // @2022.01.26 Timing / Ordering problem:
    // - the _RenderToolsets() function renders tools, which build the this.styles/this.classes maps.
    // - However: this means that higher styles won't render until the next render, ie this.styles.card
    //   won't render, as this variable is already cached as it seems by Polymer.
    // - This is also the case for this.styles.tools/toolsets: they also don't work!
    //
    // Fix for card styles: render toolsets first, and then push the svg data!!

    const toolsetsSvg = this._RenderToolsets();

    svgItems.push(svg`
      <svg id="rootsvg" xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
       class="${cardFilter}"
       style="${styleMap(this.styles.card)}"
       data-entity-0="${this._attributes[0]}"
       data-entity-1="${ifDefined(this._attributes[1])}"
       data-entity-2="${ifDefined(this._attributes[2])}"
       data-entity-3="${ifDefined(this._attributes[3])}"
       data-entity-4="${ifDefined(this._attributes[4])}"
       data-entity-5="${ifDefined(this._attributes[5])}"
       data-entity-6="${ifDefined(this._attributes[6])}"
       data-entity-7="${ifDefined(this._attributes[7])}"
       data-entity-8="${ifDefined(this._attributes[8])}"
       data-entity-9="${ifDefined(this._attributes[9])}"
       viewBox="0 0 ${this.viewBox.width} ${this.viewBox.height}"
      >
        <g style="${styleMap(this.config.layout?.styles?.toolsets)}">
          ${toolsetsSvg}
        </g>
    </svg>`);

    return svg`${svgItems}`;
  }

  /** *****************************************************************************
  * card::_buildUom()
  *
  * Summary.
  * Builds the Unit of Measurement string.
  *
  */

  _buildUom(derivedEntity, entityState, entityConfig) {
    return (
      derivedEntity?.unit
      || entityConfig?.unit
      || entityState?.attributes.unit_of_measurement
      || ''
    );
  }

  toLocale(string, fallback = 'unknown') {
    const lang = this._hass.selectedLanguage || this._hass.language;
    const resources = this._hass.resources[lang];
    return (resources && resources[string] ? resources[string] : fallback);
  }

  /** *****************************************************************************
  * card::_buildState()
  *
  * Summary.
  * Builds the State string.
  * If state is not a number, the state is returned AS IS, otherwise the state
  * is build according to the specified number of decimals.
  *
  * NOTE:
  * - a number value of "-0" is translated to "0". The sign is gone...
  *
  * IMPORTANT NOTE:
  * - do NOT replace isNaN() by Number.isNaN(). They are INCOMPATIBLE !!!!!!!!!
  */

  _buildState(inState, entityConfig) {
    // if (typeof inState !== 'number') {
    if (isNaN(inState)) {
      if (inState === 'unavailable') return '-ua-';
      return inState;
    }

    if (entityConfig.format === 'brightness') {
      return `${Math.round((inState / 255) * 100)}`;
    }

    const state = Math.abs(Number(inState));
    const sign = Math.sign(inState);

    if (['0', '-0'].includes(sign)) return sign;

    if (entityConfig.decimals === undefined || Number.isNaN(entityConfig.decimals) || Number.isNaN(state))
      return (sign === '-1' ? `-${(Math.round(state * 100) / 100).toString()}` : (Math.round(state * 100) / 100).toString());

    const x = 10 ** entityConfig.decimals;
    return (sign === '-1' ? `-${(Math.round(state * x) / x).toFixed(entityConfig.decimals).toString()}`
      : (Math.round(state * x) / x).toFixed(entityConfig.decimals).toString());
  }

  /** *****************************************************************************
  * card::_buildSecondaryInfo()
  *
  * Summary.
  * Builds the SecondaryInfo string.
  *
  */

  _buildSecondaryInfo(inSecInfoState, entityConfig) {
    const leftPad = (num) => (num < 10 ? `0${num}` : num);

    function secondsToDuration(d) {
      const h = Math.floor(d / 3600);
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);

      if (h > 0) {
        return `${h}:${leftPad(m)}:${leftPad(s)}`;
      }
      if (m > 0) {
        return `${m}:${leftPad(s)}`;
      }
      if (s > 0) {
        return `${s}`;
      }
      return null;
    }

    const lang = this._hass.selectedLanguage || this._hass.language;

    // this.polyfill(lang);

    if (['relative', 'total', 'date', 'time', 'datetime'].includes(entityConfig.format)) {
      const timestamp = new Date(inSecInfoState);
      if (!(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
        return inSecInfoState;
      }

      let retValue;
      // return date/time according to formatting...
      switch (entityConfig.format) {
        case 'relative':
          // eslint-disable-next-line no-case-declarations
          const diff = selectUnit(timestamp, new Date());
          retValue = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }).format(diff.value, diff.unit);
          break;
        case 'total':
        case 'precision':
          retValue = 'Not Yet Supported';
          break;
        case 'date':
          retValue = new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'numeric', day: 'numeric' }).format(timestamp);
          break;
        case 'time':
          retValue = new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(timestamp);
          break;
        case 'datetime':
          retValue = new Intl.DateTimeFormat(lang, {
            year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
          }).format(timestamp);
          break;
        default:
      }
      return retValue;
    }

    if (isNaN(parseFloat(inSecInfoState)) || !isFinite(inSecInfoState)) {
      return inSecInfoState;
    }
    if (entityConfig.format === 'brightness') {
      return `${Math.round((inSecInfoState / 255) * 100)} %`;
    }
    if (entityConfig.format === 'duration') {
      return secondsToDuration(inSecInfoState);
    }
  }

  /** *****************************************************************************
  * card::_computeState()
  *
  * Summary.
  *
  */

  _computeState(inState, dec) {
    if (isNaN(inState)) {
      console.log('computestate - NAN', inState, dec);
      return inState;
    }

    const state = Number(inState);

    if (dec === undefined || isNaN(dec) || isNaN(state)) {
      return Math.round(state * 100) / 100;
    }

    const x = 10 ** dec;
    return (Math.round(state * x) / x).toFixed(dec);
  }

  /** *****************************************************************************
  * card::_calculateColor()
  *
  * Summary.
  *
  * #TODO:
  * replace by TinyColor library? Is that possible/feasible??
  *
  */

  _calculateColor(argState, argStops, argIsGradient) {
    const sortedStops = Object.keys(argStops).map((n) => Number(n)).sort((a, b) => a - b);

    let start; let end; let
      val;
    const l = sortedStops.length;

    if (argState <= sortedStops[0]) {
      return argStops[sortedStops[0]];
    } else if (argState >= sortedStops[l - 1]) {
      return argStops[sortedStops[l - 1]];
    } else {
      for (let i = 0; i < l - 1; i++) {
        const s1 = sortedStops[i];
        const s2 = sortedStops[i + 1];
        if (argState >= s1 && argState < s2) {
          [start, end] = [argStops[s1], argStops[s2]];
          if (!argIsGradient) {
            return start;
          }
          val = this._calculateValueBetween(s1, s2, argState);
          break;
        }
      }
    }
    return this._getGradientValue(start, end, val);
  }

  /** *****************************************************************************
  * card::_calculateColor2()
  *
  * Summary.
  *
  * #TODO:
  * replace by TinyColor library? Is that possible/feasible??
  *
  */

  _calculateColor2(argState, argStops, argPart, argProperty, argIsGradient) {
    const sortedStops = Object.keys(argStops).map((n) => Number(n)).sort((a, b) => a - b);

    let start; let end; let
      val;
    const l = sortedStops.length;

    if (argState <= sortedStops[0]) {
      return argStops[sortedStops[0]];
    } else if (argState >= sortedStops[l - 1]) {
      return argStops[sortedStops[l - 1]];
    } else {
      for (let i = 0; i < l - 1; i++) {
        const s1 = sortedStops[i];
        const s2 = sortedStops[i + 1];
        if (argState >= s1 && argState < s2) {
          // console.log('calculateColor2 ', argStops[s1], argStops[s2]);
          [start, end] = [argStops[s1].styles[argPart][argProperty], argStops[s2].styles[argPart][argProperty]];
          if (!argIsGradient) {
            return start;
          }
          val = this._calculateValueBetween(s1, s2, argState);
          break;
        }
      }
    }
    return this._getGradientValue(start, end, val);
  }

  /** *****************************************************************************
  * card::_calculateValueBetween()
  *
  * Summary.
  * Clips the argValue value between argStart and argEnd, and returns the between value ;-)
  *
  * Returns NaN if argValue is undefined
  *
  * NOTE: Rename to valueToPercentage ??
  */

  _calculateValueBetween(argStart, argEnd, argValue) {
    return (Math.min(Math.max(argValue, argStart), argEnd) - argStart) / (argEnd - argStart);
  }

  /** *****************************************************************************
  * card::_getColorVariable()
  *
  * Summary.
  * Get value of CSS color variable, specified as var(--color-value)
  * These variables are defined in the Lovelace element so it appears...
  *
  */

  _getColorVariable(argColor) {
    const newColor = argColor.substr(4, argColor.length - 5);

    const returnColor = window.getComputedStyle(this).getPropertyValue(newColor);
    return returnColor;
  }

  /** *****************************************************************************
  * card::_getGradientValue()
  *
  * Summary.
  * Get gradient value of color as a result of a color_stop.
  * An RGBA value is calculated, so transparency is possible...
  *
  * The colors (colorA and colorB) can be specified as:
  * - a css variable, var(--color-value)
  * - a hex value, #fff or #ffffff
  * - an rgb() or rgba() value
  * - a hsl() or hsla() value
  * - a named css color value, such as white.
  *
  */

  _getGradientValue(argColorA, argColorB, argValue) {
    const resultColorA = this._colorToRGBA(argColorA);
    const resultColorB = this._colorToRGBA(argColorB);

    // We have a rgba() color array from cache or canvas.
    // Calculate color in between, and return #hex value as a result.
    //

    const v1 = 1 - argValue;
    const v2 = argValue;
    const rDec = Math.floor((resultColorA[0] * v1) + (resultColorB[0] * v2));
    const gDec = Math.floor((resultColorA[1] * v1) + (resultColorB[1] * v2));
    const bDec = Math.floor((resultColorA[2] * v1) + (resultColorB[2] * v2));
    const aDec = Math.floor((resultColorA[3] * v1) + (resultColorB[3] * v2));

    // And convert full RRGGBBAA value to #hex.
    const rHex = this._padZero(rDec.toString(16));
    const gHex = this._padZero(gDec.toString(16));
    const bHex = this._padZero(bDec.toString(16));
    const aHex = this._padZero(aDec.toString(16));

    return `#${rHex}${gHex}${bHex}${aHex}`;
  }

  _padZero(argValue) {
    if (argValue.length < 2) {
      argValue = `0${argValue}`;
    }
    return argValue.substr(0, 2);
  }

  _computeDomain(entityId) {
    return entityId.substr(0, entityId.indexOf('.'));
  }

  _computeEntity(entityId) {
    return entityId.substr(entityId.indexOf('.') + 1);
  }

  /** *****************************************************************************
  * card::_colorToRGBA()
  *
  * Summary.
  * Get RGBA color value of argColor.
  *
  * The argColor can be specified as:
  * - a css variable, var(--color-value)
  * - a hex value, #fff or #ffffff
  * - an rgb() or rgba() value
  * - a hsl() or hsla() value
  * - a named css color value, such as white.
  *
  */

  _colorToRGBA(argColor) {
    // return color if found in colorCache...
    const retColor = SwissArmyKnifeCard.colorCache[argColor];
    if (retColor) return retColor;

    let theColor = argColor;
    // Check for 'var' colors
    const a0 = argColor.substr(0, 3);
    if (a0.valueOf() === 'var') {
      theColor = this._getColorVariable(argColor);
    }

    // Get color from canvas. This always returns an rgba() value...
    const canvas = window.document.createElement('canvas');
    // eslint-disable-next-line no-multi-assign
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = theColor;
    ctx.fillRect(0, 0, 1, 1);
    const outColor = [...ctx.getImageData(0, 0, 1, 1).data];

    SwissArmyKnifeCard.colorCache[argColor] = outColor;

    return outColor;
  }

  // 2022.01.25 #TODO
  // Reset interval to 5 minutes: is now short I think after connectedCallback().
  // Only if _hass exists / is set --> set to 5 minutes!
  //
  // BUG: If no history entity, the interval check keeps running. Initially set to 2000ms, and
  // keeps running with that interval. If history present, interval is larger ????????
  //
  // There is no check yet, if history is requested. That is the only reason to have this
  // interval active!
  updateOnInterval() {
    // Only update if hass is already set, this might be not the case the first few calls...
    // console.log("updateOnInterval -> check...");
    if (!this._hass) {
      if (this.dev.debug) console.log('UpdateOnInterval - NO hass, returning');
      return;
    }
    if (this.stateChanged && !this.entityHistory.updating) {
      // 2020.10.24
      // Leave true, as multiple entities can be fetched. fetch every 5 minutes...
      // this.stateChanged = false;
      this.updateData();
      // console.log("*RC* updateOnInterval -> updateData", this.entityHistory);
    }

    if (!this.entityHistory.needed) {
      // console.log("*RC* updateOnInterval -> stop timer", this.entityHistory, this.interval);
      if (this.interval) {
        window.clearInterval(this.interval);
        this.interval = 0;
      }
    } else {
      window.clearInterval(this.interval);
      this.interval = setInterval(
        () => this.updateOnInterval(),
        // 5 * 1000);
        this.entityHistory.update_interval * 1000,
      );
      // console.log("*RC* updateOnInterval -> start timer", this.entityHistory, this.interval);
    }
  }

  async fetchRecent(entityId, start, end, skipInitialState) {
    let url = 'history/period';
    if (start) url += `/${start.toISOString()}`;
    url += `?filter_entity_id=${entityId}`;
    if (end) url += `&end_time=${end.toISOString()}`;
    if (skipInitialState) url += '&skip_initial_state';
    url += '&minimal_response';

    // console.log('fetchRecent - call is', entityId, start, end, skipInitialState, url);
    return this._hass.callApi('GET', url);
  }

  // async updateData({ config } = this) {
  async updateData() {
    this.entityHistory.updating = true;

    if (this.dev.debug) console.log('card::updateData - ENTRY', this.cardId);

    // We have a list of objects that might need some history update
    // Create list to fetch.
    const entityList = [];
    let j = 0;

    // #TODO
    // Lookup in this.tools for bars, or better tools that need history...
    // get that entity_index for that object
    // add to list...
    this.toolsets.map((toolset, k) => {
      toolset.tools.map((item, i) => {
        if (item.type === 'bar') {
          const end = new Date();
          const start = new Date();
          start.setHours(end.getHours() - item.tool.config.hours);
          const attr = this.config.entities[item.tool.config.entity_index].attribute ? this.config.entities[item.tool.config.entity_index].attribute : null;

          entityList[j] = ({
            tsidx: k, entityIndex: item.tool.config.entity_index, entityId: this.entities[item.tool.config.entity_index].entity_id, attrId: attr, start, end, type: 'bar', idx: i,
          });
          j += 1;
        }
        return true;
      });
      return true;
    });

    if (this.dev.debug) console.log('card::updateData - LENGTH', this.cardId, entityList.length, entityList);

    // #TODO
    // Quick hack to block updates if entrylist is empty
    this.stateChanged = false;

    if (this.dev.debug) console.log('card::updateData, entityList from tools', entityList);

    try {
      //      const promise = this.config.layout.vbars.map((item, i) => this.updateEntity(item, entity, i, start, end));
      const promise = entityList.map((item, i) => this.updateEntity(item, i, item.start, item.end));
      await Promise.all(promise);
    } finally {
      this.entityHistory.updating = false;
    }
  }

  async updateEntity(entity, index, initStart, end) {
    let stateHistory = [];
    const start = initStart;
    const skipInitialState = false;

    // Get history for this entity and/or attribute.
    let newStateHistory = await this.fetchRecent(entity.entityId, start, end, skipInitialState);

    // Now we have some history, check if it has valid data and filter out either the entity state or
    // the entity attribute. Ain't that nice!

    let theState;

    if (newStateHistory[0] && newStateHistory[0].length > 0) {
      if (entity.attrId) {
        theState = this.entities[entity.entityIndex].attributes[this.config.entities[entity.entityIndex].attribute];
        entity.state = theState;
      }
      newStateHistory = newStateHistory[0].filter((item) => (entity.attrId ? !isNaN(parseFloat(item.attributes[entity.attrId])) : !isNaN(parseFloat(item.state))));

      newStateHistory = newStateHistory.map((item) => ({
        last_changed: item.last_changed,
        state: entity.attrId ? Number(item.attributes[entity.attrId]) : Number(item.state),
      }));
    }

    stateHistory = [...stateHistory, ...newStateHistory];

    this.uppdate(entity, stateHistory);
  }

  uppdate(entity, hist) {
    if (!hist) return;

    // #LGTM: Unused variable getMin.
    // Keep this one for later use!!!!!!!!!!!!!!!!!
    // const getMin = (arr, val) => arr.reduce((min, p) => (
    // Number(p[val]) < Number(min[val]) ? p : min
    // ), arr[0]);

    const getAvg = (arr, val) => arr.reduce((sum, p) => (
      sum + Number(p[val])
    ), 0) / arr.length;

    const now = new Date().getTime();

    let hours = 24;
    let barhours = 2;

    if (entity.type === 'bar') {
      if (this.dev.debug) console.log('entity.type == bar', entity);

      hours = this.toolsets[entity.tsidx].tools[entity.idx].tool.config.hours;
      barhours = this.toolsets[entity.tsidx].tools[entity.idx].tool.config.barhours;
    }

    const reduce = (res, item) => {
      const age = now - new Date(item.last_changed).getTime();
      const interval = (age / (1000 * 3600) / barhours) - (hours / barhours);
      const key = Math.floor(Math.abs(interval));
      if (!res[key]) res[key] = [];
      res[key].push(item);
      return res;
    };
    const coords = hist.reduce((res, item) => reduce(res, item), []);
    coords.length = Math.ceil(hours / barhours);

    // If no intervals found, return...
    if (Object.keys(coords).length === 0) {
      return;
    }

    // That STUPID STUPID Math.min/max can't handle empty arrays which are put into it below
    // so add some data to the array, and everything works!!!!!!

    // check if first interval contains data, if not find first in interval and use first entry as value...

    const firstInterval = Object.keys(coords)[0];
    if (firstInterval !== '0') {
      // first index doesn't contain data.
      coords[0] = [];

      coords[0].push(coords[firstInterval][0]);
    }

    for (let i = 0; i < (hours / barhours); i++) {
      if (!coords[i]) {
        coords[i] = [];
        coords[i].push(coords[i - 1][coords[i - 1].length - 1]);
      }
    }
    this.coords = coords;
    let theData = [];
    theData = [];
    theData = coords.map((item) => getAvg(item, 'state'));

    // now push data into object...
    if (entity.type === 'bar') {
      this.toolsets[entity.tsidx].tools[entity.idx].tool.series = [...theData];
    }

    // Request a rerender of the card after receiving new data
    this.requestUpdate();
  }

  /** *****************************************************************************
  * card::getCardSize()
  *
  * Summary.
  * Return a fixed value of 4 as the height.
  *
  */

  getCardSize() {
    return (4);
  }
}

/**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

// Define the custom Swiss Army Knife card, so Lovelace / Lit can find the custom element!
customElements.define('swiss-army-knife-card', SwissArmyKnifeCard);
