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
* Notes:
* - This is currently a single file, and should be split into smaller, more
*   manageable files with 1 file per class ;-)
*
*******************************************************************************
*/

// NTS @2021.10.31
// Check compatibility when upgrading lit stuff. Many versions have conflicts!
// Use compatible lit-* stuff, ie lit-element@2 and lit-html@1.
// Combining other versions may lead to incompatibility, and thus lots of errors and tools not working anymore!

import {
  LitElement, html, css, svg, unsafeCSS
} from "https://unpkg.com/lit-element@2.5.1/lit-element.js?module";

import {
  unsafeSVG
} from "https://unpkg.com/lit-html@1/directives/unsafe-svg.js?module";

import {ifDefined} from "https://unpkg.com/lit-html@1/directives/if-defined?module";

import { styleMap } from 'https://unpkg.com/lit-html@1/directives/style-map.js?module';
import { classMap } from 'https://unpkg.com/lit-html@1/directives/class-map.js?module';

import { selectUnit} from 'https://unpkg.com/@formatjs/intl-utils@3.8.4/lib/index.js?module';

import { fireEvent, stateIcon, getLovelace } from 'https://unpkg.com/custom-card-helpers@1.8.0/dist/index.m.js?module';

// Original injector is buggy. Use a patched version, and store this local...
import * as SvgInjector from '/local/community/swiss-army-knife-card/SVGInjector.min.js?module'; // lgtm[js/unused-local-variable]

console.info(
  `%c   SWISS-ARMY-KNIFE-CARD   \n%c  Public Release Candidate \n%c     Version 1.0.0-rc1     `,
  'color: yellow; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
  'color: white; font-weight: bold; background: dimgray',
);

// Set sizes:
// If svg size is changed, change the font size accordingly.
// These two are related ;-) For font-size, 1em = 1%
const SCALE_DIMENSIONS = 2
const SVG_DEFAULT_DIMENSIONS = 200 * SCALE_DIMENSIONS;
const SVG_DEFAULT_DIMENSIONS_HALF = SVG_DEFAULT_DIMENSIONS / 2;
const SVG_VIEW_BOX = SVG_DEFAULT_DIMENSIONS;
const FONT_SIZE = SVG_DEFAULT_DIMENSIONS / 100;

//++ Class ++++++++++

 /**
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation and filtering.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
  class Merge {

    static mergeDeep(...objects) {
      const isObject = (obj) => obj && typeof obj === 'object';
      return objects.reduce((prev, obj) => {
          Object.keys(obj).forEach(key => {
              const pVal = prev[key];
              const oVal = obj[key];
              if (Array.isArray(pVal) && Array.isArray(oVal)) {
                  /* eslint no-param-reassign: 0 */
                  // Only if pVal is empty???
                  
                  // #TODO:
                  // Should check for .id to match both arrays ?!?!?!?!
                  // Only concat if no ID or match found, otherwise mergeDeep ??
                  //
                  // concatenate and then reduce/merge the array based on id's if present??
                  //
                  prev[key] = pVal.concat(...oVal);
              }
              else if (isObject(pVal) && isObject(oVal)) {
                  prev[key] = this.mergeDeep(pVal, oVal);
              }
              else {
                  prev[key] = oVal;
              }
          });
          return prev;
      }, {});
    }
  }

 /**
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */
 
 /*****************************************************************************
  * Utils class
  *
  * Summary.
  *
  */

class Utils {

 /**
  * Utils::calculateValueBetween()
  *
  * Summary.
  * Clips the val value between start and end, and returns the between value ;-)
  * Returned value is a fractional value between 0 and 1.
  *
  * Note 1:
  * At start, state values are set to 'null' to make sure it has no value!
  * If such a value is detected, return 0(%) as the relative value.
  * In normal cases, this happens to be the _valuePrev, so 0% is ok!!!!
  *
  * Note 2:
  * !xyz checks for "", null, undefined, false and number 0
  * An extra check for NaN guards the result of this function ;-)
  */

  static calculateValueBetween(argStart, argEnd, argVal) {

    // Check for valid argVal values and return 0 if invalid.
    if (isNaN(argVal)) return 0;
    if (!argVal) return 0;

    // Valid argVal value: calculate fraction between 0 and 1
    return (Math.min(Math.max(argVal, argStart), argEnd) - argStart) / (argEnd - argStart);
  }

 /**
  * Utils::calculateSvgCoordinate()
  *
  * Summary.
  * Calculate own (tool/tool) coordinates relative to centered toolset position.
  * Tool coordinates are %
  *
  * Group is 50,40. Say SVG is 200x200. Group is 100,80 within 200x200.
  * Tool is 10,50. 0.1 * 200 = 20 + (100 - 200/2) = 20 + 0.
  */
  static calculateSvgCoordinate(argOwn, argToolset) {

    return (argOwn / 100) * (SVG_DEFAULT_DIMENSIONS)
            + (argToolset - SVG_DEFAULT_DIMENSIONS_HALF);
  }

 /**
  * Utils::calculateSvgDimension()
  *
  * Summary.
  * Translate tool dimension like length or width to actual SVG dimension.
  */

  static calculateSvgDimension(argDimension) {
    return (argDimension / 100) * (SVG_DEFAULT_DIMENSIONS);
  }
}

 /**
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

/******************************************************************************
  * Templates class
  *
  * Summary.
  *
  */

class Templates {

 /******************************************************************************
  * Templates::replaceVariables()
  *
  * Summary.
  * A toolset defines a template. This template is found and passed as argToolsetTemplate.
  * This is actually a set of tools, nothing else...
  * Also passed is the list of variables that should be replaced:
  * - The list defined in the toolset
  * - The defaults defined in the template itself, which are defined in the argToolsetTemplate
  *
  */

  static replaceVariables3(argVariables, argTemplate) {

    // If no variables specified, return template contents, so not the first object, but the contents!!!
    // ie template.toolset or template.colorstops. The toolset and colorstops objects are removed...
    //
    // If not, one gets toolsets[1].toolset.position iso toolsets[1].position.
    //
    if (!argVariables && !argTemplate.template.defaults) {
      return argTemplate[argTemplate.template.type];
    }
    let variableArray = argVariables?.slice(0) ?? [];

    // Merge given variables and defaults...
    if (argTemplate.template.defaults) {
      variableArray = variableArray.concat(argTemplate.template.defaults);
    }

    let jsonConfig = JSON.stringify(argTemplate[argTemplate.template.type]);
    variableArray.forEach(variable => {
      const key = Object.keys(variable)[0];
      const value = Object.values(variable)[0];
      if (typeof value === 'number' || typeof value === 'boolean') {
        const rxp2 = new RegExp(`"\\[\\[${key}\\]\\]"`, 'gm');
        jsonConfig = jsonConfig.replace(rxp2, value);
      }
      if (typeof value === 'object') {
        const rxp2 = new RegExp(`"\\[\\[${key}\\]\\]"`, 'gm');
        const valueString = JSON.stringify(value);
        jsonConfig = jsonConfig.replace(rxp2, valueString);
      } else {
        const rxp = new RegExp(`\\[\\[${key}\\]\\]`, 'gm');
        jsonConfig = jsonConfig.replace(rxp, value);
      }
    });

    return (JSON.parse(jsonConfig));
  }

 /*******************************************************************************
  * Templates::evaluateJsTemplate()
  *
  * Summary.
  * Runs the JavaScript template.
  *
  * The arguments passed to the function are:
  * - state, state of the current entity
  * - states, the full array of states provied by hass
  * - entity, the current entity and its configuration
  * - user, the currently logged in user
  * - hass, the hass object...
  *
  */

  static evaluateJsTemplate(argTool, state, jsTemplate) {
    try {
      return new Function('state', 'states', 'entity', 'user', 'hass', 'config', `'use strict'; ${jsTemplate}`).call(
        this,
        state,
        argTool._card._hass.states,
        argTool.config.entity_index ? argTool._card.entities[argTool.config.entity_index] : undefined,
        argTool._card._hass.user,
        argTool._card._hass,
        argTool.config,
      );
    } catch (e) {
      e.name = 'Sak-evaluateJsTemplate-Error';
      throw e;
    }
  }
 /*******************************************************************************
  * Templates::getJsTemplateOrValue()
  *
  * Summary.
  *
  * References:
  * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
  * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
  * 
  */
  
  static getJsTemplateOrValue(argTool, argState, argValue) {

    // Check for 'undefined' or 'null'
    if (!argValue) return argValue;

    // Check for primitive data types 
    if (['number', 'boolean', 'bigint', 'symbol'].includes(typeof argValue)) return argValue;

    // We might have an object.
    // Beware of the fact that this recursive function overwrites the argValue object,
    // so clone argValue if this is the tool configuration...
    if (typeof argValue === 'object') {
      Object.keys(argValue).forEach((key) => {
        argValue[key] = Templates.getJsTemplateOrValue(argTool, argState, argValue[key]);
      });
      return argValue;
    }

    // typeof should be a string now.
    // The string might be a Javascript template surrounded by [[[<js>]]], or just a string.
    const trimmedValue = argValue.trim();
    if (trimmedValue.substring(0, 3) === '[[[' && trimmedValue.slice(-3) === ']]]') {
      return Templates.evaluateJsTemplate(argTool, argState, trimmedValue.slice(3, -3));
    } else {
      // Just a plain string, return value.
      return argValue;
    }
  }
}
 /**
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /*****************************************************************************
  * Toolset class
  *
  * Summary.
  *
  */
  
class Toolset {
  constructor(argCard, argConfig) {

    this.toolsetId = Math.random().toString(36).substr(2, 9);
    this._card = argCard;
    this.dev = {...this._card.dev};
    if (this.dev.performance) console.time("--> "+ this.toolsetId + " PERFORMANCE Toolset::constructor");

    this.config = argConfig;
    this.tools=[];

    // Get SVG coordinates.
    this.svg = {};
    this.svg.cx = Utils.calculateSvgCoordinate(argConfig.position.cx, SVG_DEFAULT_DIMENSIONS_HALF);
    this.svg.cy = Utils.calculateSvgCoordinate(argConfig.position.cy, SVG_DEFAULT_DIMENSIONS_HALF);

    this.svg.x = (this.svg.cx) - (SVG_DEFAULT_DIMENSIONS_HALF);
    this.svg.y = (this.svg.cy) - (SVG_DEFAULT_DIMENSIONS_HALF);

    // Group scaling experiment. Calc translate values for SVG using the toolset scale value
    this.transform = {};
    this.transform.scale = {};
    this.transform.scale.x = this.transform.scale.y = 1;
    this.transform.rotate = {};
    this.transform.rotate.x = this.transform.rotate.y = 0;
    this.transform.skew = {};
    this.transform.skew.x = this.transform.skew.y = 0;

    if (this.config.position.scale) {
      this.transform.scale.x = this.transform.scale.y = this.config.position.scale;
    }
    if (this.config.position.rotate) {
      this.transform.rotate.x = this.transform.rotate.y = this.config.position.rotate;
    }

    this.transform.scale.x = this.config.position.scale_x || this.config.position.scale || 1;
    this.transform.scale.y = this.config.position.scale_y || this.config.position.scale || 1;

    this.transform.rotate.x = this.config.position.rotate_x || this.config.position.rotate || 0;
    this.transform.rotate.y = this.config.position.rotate_y || this.config.position.rotate || 0;

    if (this.dev.debug) console.log("Toolset::constructor config/svg", this.toolsetId, this.config, this.svg);

    // Create the tools configured in the toolset list.
    const toolsNew = {
      "area"      : EntityAreaTool,
      "badge"     : BadgeTool,
      "bar"       : SparklineBarChartTool,
      "circle"    : CircleTool,
      "ellipse"   : EllipseTool,
      "horseshoe" : HorseshoeTool,
      "icon"      : EntityIconTool,
      "line"      : LineTool,
      "name"      : EntityNameTool,
      "rectangle" : RectangleTool,
      "rectex"    : RectangleToolEx,
      "regpoly"   : RegPolyTool,
      "segarc"    : SegmentedArcTool,
      "state"     : EntityStateTool,
      "slider"    : RangeSliderTool,
      "switch"    : SwitchTool,
      "text"      : TextTool,
      "usersvg"   : UserSvgTool,
    };

    this.config.tools.map(toolConfig => {
      var argConfig = {...toolConfig};

      var argPos = { cx: 0 / 100 * SVG_DEFAULT_DIMENSIONS,
                     cy: 0 / 100 * SVG_DEFAULT_DIMENSIONS,
                     scale: this.config.position.scale ? this.config.position.scale : 1 };

      if (this.dev.debug) console.log("Toolset::constructor toolConfig", this.toolsetId, argConfig, argPos);

      const newTool = new toolsNew[toolConfig.type](this, argConfig, argPos);
      this._card.entityHistory.needed |= (toolConfig.type == 'bar');
      this.tools.push({type: toolConfig.type, index: toolConfig.id, tool: newTool});
    });

    if (this.dev.performance) console.timeEnd("--> "+ this.toolsetId + " PERFORMANCE Toolset::constructor");
  }

/*******************************************************************************
  * Toolset::updateValues()
  *
  * Summary.
  * Called from set hass to update values for tools
  *
  */
  
  // #TODO:
  // Update only the changed entity_index, not all indexes. Now ALL tools are updated...
  updateValues() {
    if (this.dev.performance) console.time("--> "+ this.toolsetId + " PERFORMANCE Toolset::updateValues");
    if (this.tools) {
      this.tools.map((item, index) => {
        if (true || item.type == "segarc") {
          // if (this.dev.debug) console.log('Toolset::updateValues', item, index);
          if ((item.tool.config.hasOwnProperty('entity_index')))
          {
            if (this.dev.debug) console.log('Toolset::updateValues', item, index);
            //if (this.dev.debug) console.log('Toolset::updateValues', typeof item.tool._stateValue);

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

          // #TODO @2021.11.22
          // Future extension to use multiple entity indexes (array of entity_index values) for animation/styling...
          // NOT used yet...
          if ((item.tool.config.hasOwnProperty('entity_indexes')))
          {
            // Update list of entities in single record and pass that to the tool
            // The first entity is used as the state, additional entities can help with animations,
            // (used for formatting classes/styles) or can be used in a derived entity 
            
            var valueList = {};
            for (let index = 0; index < item.tool.config.entity_indexes.length; ++index) {
              valueList[index] = this._card.attributesStr[item.tool.config.entity_indexes[index]]
                                                ? this._card.attributesStr[item.tool.config.entity_indexes[index]]
                                                : this._card.secondaryInfoStr[item.tool.config.entity_indexes[index]]
                                                ? this._card.secondaryInfoStr[item.tool.config.entity_indexes[index]]
                                                : this._card.entitiesStr[item.tool.config.entity_indexes[index]];
            }
            
            item.tool.values = valueList;
          }
        }
      });
    }
    if (this.dev.performance) console.timeEnd("--> "+ this.toolsetId + " PERFORMANCE Toolset::updateValues");
  }
/*******************************************************************************
  * Toolset::connectedCallback()
  *
  * Summary.
  *
  */
  connectedCallback() {
    if (this.dev.performance) console.time("--> " + this.toolsetId + " PERFORMANCE Toolset::connectedCallback");

    if (this.dev.debug) console.log('*****Event - connectedCallback', this.toolsetId, new Date().getTime());
    if (this.dev.performance) console.timeEnd("--> " + this.toolsetId + " PERFORMANCE Toolset::connectedCallback");
  }

 /*******************************************************************************
  * Toolset::disconnectedCallback()
  *
  * Summary.
  *
  */
  disconnectedCallback() {
    if (this.dev.performance) console.time("--> " + this.cardId + " PERFORMANCE Toolset::disconnectedCallback");

    if (this.dev.debug) console.log('*****Event - disconnectedCallback', this.toolsetId, new Date().getTime());
    if (this.dev.performance) console.timeEnd("--> " + this.cardId + " PERFORMANCE Toolset::disconnectedCallback");
  }

 /*******************************************************************************
  * Toolset::firstUpdated()
  *
  * Summary.
  *
  */
  firstUpdated(changedProperties) {

    if (this.dev.debug) console.log('*****Event - Toolset::firstUpdated', this.toolsetId, new Date().getTime());

    if (this.tools) {
      this.tools.map((item, index) => {

        if (item.type == "segarc") {
          if (this.dev.debug) console.log('Toolset::firstUpdated - calling SegmentedArcTool firstUpdated');
          item.tool.firstUpdated(changedProperties);
        }

        if (item.type == "slider") {
          if (this.dev.debug) console.log('Toolset::firstUpdated - calling Slider firstUpdated');
          item.tool.firstUpdated(changedProperties);
        }

        if (item.type == "slider2") {
          if (this.dev.debug) console.log('Toolset::firstUpdated - calling Slider firstUpdated');
          item.tool.firstUpdated(changedProperties);
        }

        if (item.type == "icon") {
          if (this.dev.debug) console.log('Toolset::firstUpdated - calling Icon firstUpdated');
          item.tool.firstUpdated(changedProperties);
        }

        if (item.type == "state") {
          if (this.dev.debug) console.log('Toolset::firstUpdated - calling State firstUpdated');
          item.tool.firstUpdated(changedProperties);
        }
      });
    }
  }


 /*******************************************************************************
  * Toolset::updated()
  *
  * Summary.
  *
  */
  updated(changedProperties) {

    if (this.dev.debug) console.log('*****Event - Updated', this.toolsetId, new Date().getTime());

    if (this.tools) {
      this.tools.map((item, index) => {

        if (item.type == "state") {
          if (this.dev.debug) console.log('Toolset::updated - calling State firstUpdated');
          item.tool.updated(changedProperties);
        }

        if (item.type == "usersvg") {
          if (this.dev.debug) console.log('Toolset::updated - calling Usersvg firstUpdated');
          item.tool.updated(changedProperties);
        }

      });
    }
  }

 /*******************************************************************************
  * Toolset::renderToolset()
  *
  * Summary.
  *
  */
  renderToolset() {

    if (this.dev.debug) console.log('*****Event - renderToolset', this.toolsetId, new Date().getTime());

    const svgItems = this.tools.map(item => {
      return svg`
          ${item.tool.render()}
      `;
    })
    return svg`${svgItems}`;
  }

 /*******************************************************************************
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

    if ((this._card.isSafari) || (this._card.iOS)) {
      //
      // Render path for Safari:
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
            <g class="toolset__group" transform="translate(${this.svg.cx/this.transform.scale.x}, ${this.svg.cy/this.transform.scale.y})">
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
            <g class="toolset__group" transform="translate(${this.svg.cx}, ${this.svg.cy})">
              ${this.renderToolset()}
            </g>
            </svg>
        </g>
      `;

    }
  }
} // END of class

 /**
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /*****************************************************************************
  * BaseTool class
  *
  * Summary.
  *
  */

class BaseTool {
  constructor(argToolset, argConfig, argPos) {


    this.toolId = Math.random().toString(36).substr(2, 9);
    this.toolset = argToolset;
    this._card = this.toolset._card;
    this.config = argConfig;

    this.dev = {...this._card.dev};

    // The position is the absolute position of the GROUP within the svg viewport.
    // The tool is positioned relative to this origin. A tool is always relative
    // to a 200x200 default svg viewport. A (50,50) position of the tool
    // centers the tool on the absolute position of the GROUP!
    this.toolsetPos = argPos;

    // Get SVG coordinates.
    this.svg = {};

    this.svg.cx = Utils.calculateSvgCoordinate(argConfig.position.cx, 0);
    this.svg.cy = Utils.calculateSvgCoordinate(argConfig.position.cy, 0);

    this.svg.height = argConfig.position.height ? Utils.calculateSvgDimension(argConfig.position.height) : 0;
    this.svg.width = argConfig.position.width ? Utils.calculateSvgDimension(argConfig.position.width) : 0;

    this.svg.x = (this.svg.cx) - (this.svg.width / 2);
    this.svg.y = (this.svg.cy) - (this.svg.height / 2);
    
    this.classes = {};
    this.classes.card = {};
    this.classes.toolset = {};
    this.classes.tool = {};

    this.styles = {};
    this.styles.card = {};
    this.styles.toolset = {};
    this.styles.tool = {};

    // Setup animation class and style and force initial processing by setting changed to true
    this.animationClass = {};
    this.animationClassHasChanged = true;

    this.animationStyle = {};
    this.animationStyleHasChanged = true;
    
    // Process basic color stuff.
    if (!this.config?.show?.style) {
      if (!this.config.show)
        this.config.show = {};
      this.config.show.style = 'default';
    }
    //Get colorstops and make a key/value store...
    this.colorStops = {};
    if ((this.config.colorstops) && (this.config.colorstops.colors)) {
      Object.keys(this.config.colorstops.colors).forEach((key) => {
        this.colorStops[key] = this.config.colorstops.colors[key];
      });
    }

    if ((this.config.show.style == 'colorstop') && (this.config?.colorstops.colors)) {
      this.sortedColorStops = Object.keys(this.config.colorstops.colors).map(n => Number(n)).sort((a, b) => a - b);
    }

    this.csnew = {};
    if ((this.config.csnew) && (this.config.csnew.colors)) {
      this.config.csnew.colors.forEach((item, i) => {
        this.csnew[item.stop] = this.config.csnew.colors[i];
      });

    this.sortedcsnew = Object.keys(this.csnew).map(n => Number(n)).sort((a, b) => a - b);
    }
  }

 /*******************************************************************************
  * BaseTool::set value()
  *
  * Summary.
  * Receive new state data for the entity this is linked to. Called from set hass;
  *
  */
  set value(state) {

    let localState = state;

    if (this.dev.debug) console.log('BaseTool set value(state)', localState);
    if (typeof(localState) != 'undefined') if (this._stateValue?.toLowerCase() === localState.toLowerCase()) return false;

    this.derivedEntity = null;
    
    if (this.config.derived_entity) {
      this.derivedEntity = Templates.getJsTemplateOrValue(this, state, Merge.mergeDeep(this.config.derived_entity));
      
      localState = this.derivedEntity.state?.toString();
    }

    this._stateValuePrev = this._stateValue || localState;
    this._stateValue = localState;
    this._stateValueIsDirty = true;

    // If animations defined, calculate style for current state.

    // 2022.07.04 Temp disable this return, as animations should be able to process the 'undefined' state too!!!!
    // if (this._stateValue == undefined) return;
    // if (typeof(this._stateValue) === 'undefined') return;

    var isMatch = false;
    // #TODO:
    // Modify this loop using .find() orso. It now keeps returning true for all items in animations list.
    // It works, but can be more efficient ;-)
    
    this.activeAnimation = null;

    if (this.config.animations) Object.keys(this.config.animations).map(animation => {
      
      var item = Templates.getJsTemplateOrValue(this, this._stateValue, Merge.mergeDeep(this.config.animations[animation]));
      
      if (isMatch) return true;

      // #TODO:
      // Default is item.state. But can also be item.custom_field[x], so you can compare with custom value
      // Should index then not with item.state but item[custom_field[x]].toLowerCase() or similar...
      // Or above, with the mapping of the item using the name?????

      // Assume equals operator if not defined...
      var operator = item.operator ? item.operator : "==";

      switch(operator) {
        case "==":
          if (typeof(this._stateValue) === 'undefined') {
            isMatch = (item.state.toLowerCase() === "undefined");
          } else {
            isMatch = this._stateValue.toLowerCase() == item.state.toLowerCase();
          }
          break;
        case "!=":
          if (typeof(this._stateValue) === 'undefined') {
            isMatch = (item.state.toLowerCase() != 'undefined');
          } else {
            isMatch = this._stateValue.toLowerCase() != item.state.toLowerCase();
          }
          break;
        case ">":
          if (typeof(this._stateValue) != 'undefined')
            isMatch = Number(this._stateValue.toLowerCase()) > Number(item.state.toLowerCase());
          break;
        case "<":
          if (typeof(this._stateValue) != 'undefined')
            isMatch = Number(this._stateValue.toLowerCase()) < Number(item.state.toLowerCase());
          break;
        case ">=":
          if (typeof(this._stateValue) != 'undefined')
            isMatch = Number(this._stateValue.toLowerCase()) >= Number(item.state.toLowerCase());
          break;
        case "<=":
          if (typeof(this._stateValue) != 'undefined')
            isMatch = Number(this._stateValue.toLowerCase()) <= Number(item.state.toLowerCase());
          break;
        default:
          // Unknown operator. Just do nothing and return;
          isMatch = false;
      }
      if (this.dev.debug) console.log('BaseTool, animation, match, value, config, operator', isMatch, this._stateValue, item.state, item.operator);
      if (!isMatch) return true;

      if (!this.animationClass || !item.reuse) this.animationClass = {};
      if (item.classes) {
        this.animationClass = Merge.mergeDeep(this.animationClass, item.classes);
      }

      if (!this.animationStyle || !item.reuse) this.animationStyle = {};
      if (item.styles) {
        this.animationStyle = Merge.mergeDeep(this.animationStyle, item.styles);
      }

      this.animationStyleHasChanged = true;

      // #TODO:
      // Store activeAnimation. Should be renamed, and used for more purposes, as via this method
      // you can override any value from within an animation, not just the css style settings.
      this.item = item;
      this.activeAnimation = item;
    });

    return true;
  }

  EnableHoverForInteraction()

  {
    const hover = (this.config.hasOwnProperty('entity_index') || (this.config?.user_actions?.tap_action));
    this.classes.tool.hover = hover;
  }

 /*******************************************************************************
  * BaseTool::MergeAnimationStyleIfChanged()
  *
  * Summary.
  * Merge changed animationStyle with configured static styles.
  *
  */
  MergeAnimationStyleIfChanged(argDefaultStyles) {

    if (this.animationStyleHasChanged) {
      this.animationStyleHasChanged = false;
      if (argDefaultStyles) {
        this.styles = Merge.mergeDeep(argDefaultStyles, this.config.styles, this.animationStyle);
      } else {
        this.styles = Merge.mergeDeep(this.config.styles, this.animationStyle);
      }
      
      if (this.styles.card) {
        if (Object.keys(this.styles.card).length != 0) {
          this._card.styles.card = Merge.mergeDeep(this.styles.card);
        }
      }
    }
  }

 /*******************************************************************************
  * BaseTool::MergeAnimationClassIfChanged()
  *
  * Summary.
  * Merge changed animationclass with configured static styles.
  *
  */
  MergeAnimationClassIfChanged(argDefaultClasses) {

    // Hack
    // @TODO This setting is still required for some reason. So this change is not detected...
    this.animationClassHasChanged = true;
    
    if (this.animationClassHasChanged) {
      this.animationClassHasChanged = false;
      if (argDefaultClasses) {
        this.classes = Merge.mergeDeep(argDefaultClasses, this.config.classes, this.animationClass);
      } else {
        this.classes = Merge.mergeDeep(this.config.classes, this.animationClass);
      }
    }
  }

 /*******************************************************************************
  * BaseTool::MergeColorFromState()
  *
  * Summary.
  * Merge color depending on state into colorStyle
  *
  */

  MergeColorFromState(argStyleMap) {
    
    if (this.config.hasOwnProperty('entity_index')) {
      const color = this.getColorFromState(this._stateValue);
      if (color != '') {
        this.config[this.config.show.style].fill ? argStyleMap['fill'] = color : '';
        this.config[this.config.show.style].stroke ? argStyleMap['stroke'] = color : '';
      }
    }
  }

 /*******************************************************************************
  * BaseTool::MergeColorFromState2()
  *
  * Summary.
  * Merge color depending on state into colorStyle
  *
  */

  MergeColorFromState2(argStyleMap, argPart) {
    
    if (this.config.hasOwnProperty('entity_index')) {
      const fillColor = this.config[this.config.show.style].fill ? this.getColorFromState2(this._stateValue, argPart, 'fill') : '';
      const strokeColor = this.config[this.config.show.style].stroke ? this.getColorFromState2(this._stateValue, argPart, 'stroke') : '';
      if (fillColor != '') {
        argStyleMap['fill'] = fillColor;
      }
      if (strokeColor != '') {
        argStyleMap['stroke'] = strokeColor;
      }
    }
  }

 /*******************************************************************************
  * BaseTool::getColorFromState()
  *
  * Summary.
  * Get color from colorstop or gradient depending on state.
  *
  */
  getColorFromState(argValue) {

    var color = '';
    switch (this.config.show.style) {
      case 'default':
        break;
      case 'fixedcolor':
        color = this.config.color;
        break;
      case 'colorstop':
      case 'colorstops':
      case 'colorstopgradient':
        color = this._card._calculateColor(argValue, this.colorStops, (this.config.show.style === 'colorstopgradient'));
        break;
      case 'minmaxgradient':
        color = this._card._calculateColor(argValue, this.colorStopsMinMax, true);
        break;
    }
    return color;
  }

 /*******************************************************************************
  * BaseTool::getColorFromState2()
  *
  * Summary.
  * Get color from colorstop or gradient depending on state.
  *
  */
  getColorFromState2(argValue, argPart, argProperty) {

    var color = '';
    switch (this.config.show.style) {
      case 'colorstop':
      case 'colorstops':
      case 'colorstopgradient':
        color = this._card._calculateColor2(argValue, this.csnew, argPart, argProperty, (this.config.show.style === 'colorstopgradient'));
        break;
      case 'minmaxgradient':
        color = this._card._calculateColor2(argValue, this.colorStopsMinMax, argPart, argProperty, true);
        break;
    }
    return color;
  }

/*******************************************************************************
  * BaseTool::_processTapEvent()
  *
  * Summary.
  * Processes the mouse click of the user and dispatches the event to the
  * configure handler.
  *
  */

  _processTapEvent(node, hass, config, actionConfig, entityId, parameterValue) {
    let e;

    if (!actionConfig) return;
    fireEvent(node, "haptic", actionConfig.haptic || 'medium');

    if (this.dev.debug) console.log('_processTapEvent', config, actionConfig, entityId, parameterValue);
    for (let i = 0; i < actionConfig.actions.length; i++) {
      switch (actionConfig.actions[i].action) {
        case 'more-info': {
          if (typeof entityId != 'undefined') {
            e = new Event('hass-more-info', { composed: true });
            e.detail = { entityId };
            node.dispatchEvent(e);
          }
          break;
        }
        case 'navigate': {
          if (!actionConfig.actions[i].navigation_path) return;
          window.history.pushState(null, '', actionConfig.actions[i].navigation_path);
          e = new Event('location-changed', { composed: true });
          e.detail = { replace: false };
          window.dispatchEvent(e);
          break;
        }
        case 'call-service': {
          if (!actionConfig.actions[i].service) return;
          const [domain, service] = actionConfig.actions[i].service.split('.', 2);
          let serviceData = { ...actionConfig.actions[i].service_data };
          
          // Fill with current entity_id if none given
          if (!serviceData.entity_id) {
            serviceData.entity_id = entityId;
          }
          // If parameter defined, add this one with the parameterValue
          if (actionConfig.actions[i].parameter) {
            serviceData[actionConfig.actions[i].parameter] = parameterValue;
          }
          hass.callService(domain, service, serviceData);
        }
      }
    }
  }

/*******************************************************************************
  * BaseTool::handleTapEvent()
  *
  * Summary.
  * Handles the first part of mouse click processing.
  * It stops propagation to the parent and processes the event.
  *
  * The action can be configured per tool.
  *
  */

  handleTapEvent(argEvent, argToolConfig) {
    argEvent.stopPropagation();
    argEvent.preventDefault();

    let tapConfig;
    // If no user_actions defined, AND there is an entity_index,
    // define a default 'more-info' tap action
    if (argToolConfig.hasOwnProperty('entity_index') && (!argToolConfig.user_actions)) {
      tapConfig = { haptic: 'light',
                    actions: [{
                      action: 'more-info'
                    }]
      };
    } else {
      tapConfig = argToolConfig.user_actions?.tap_action;
    }

    if (!tapConfig) return;

    this._processTapEvent(this._card,
                          this._card._hass,
                          this.config,
                          tapConfig,
                          this._card.config.hasOwnProperty('entities')
                              ? this._card.config.entities[argToolConfig.entity_index]?.entity
                              : undefined,
                          undefined);
  }

} //-- CLASS

 /**
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */
 
 /*****************************************************************************
  * RangeSliderTool class
  *
  * Summary.
  *
  */

class RangeSliderTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_RANGESLIDER_CONFIG = {
        descr: 'none',
        position: {
          cx: 50,
          cy: 50,
          orientation: 'horizontal',
          active: {
            width: 0,
            height: 0,
            radius: 0,
          },
          track: {
            width: 16,
            height: 7,
            radius: 3.5,
          },
          thumb: {
            width: 9,
            height: 9,
            radius: 4.5,
            offset: 4.5,
          },
          label: {
            placement: 'none',
          },
        },
        show: {
          uom: 'end',
          active: false,
        },
        classes: {
          tool: {
            "sak-slider": true,
            "hover": true,
          },
          capture: {
            "sak-slider__capture": true,
          },
          active: {
            "sak-slider__active": true,
          },
          track: {
            "sak-slider__track": true,
          },
          thumb: {
            "sak-slider__thumb": true,
          },
          label: {
            "sak-slider__value": true,
          },
          uom: {
            "sak-slider__uom": true,
          }
        },
        styles: {
          tool: {
          },
          capture: {
          },
          active: {
          },
          track: {
          },
          thumb: {
          },
          label: {
          },
          uom: {
          }
        }
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_RANGESLIDER_CONFIG, argConfig), argPos);

    this.svg.activeTrack = {};
    this.svg.activeTrack.radius = Utils.calculateSvgDimension(this.config.position.active.radius);
    this.svg.activeTrack.height = Utils.calculateSvgDimension(this.config.position.active.height);
    this.svg.activeTrack.width = Utils.calculateSvgDimension(this.config.position.active.width);
    
    this.svg.track = {};
    this.svg.track.radius = Utils.calculateSvgDimension(this.config.position.track.radius);
    
    this.svg.thumb = {};
    this.svg.thumb.radius = Utils.calculateSvgDimension(this.config.position.thumb.radius);
    this.svg.thumb.offset = Utils.calculateSvgDimension(this.config.position.thumb.offset);

    this.svg.capture = {};

    this.svg.label = {};
    
    switch (this.config.position.orientation) {
      case 'horizontal':
      case 'vertical':
        this.svg.capture.width = Utils.calculateSvgDimension(this.config.position.capture.width || 1.1 * this.config.position.track.width);
        this.svg.capture.height = Utils.calculateSvgDimension(this.config.position.capture.height || 3 * this.config.position.thumb.height);

        this.svg.track.width = Utils.calculateSvgDimension(this.config.position.track.width);
        this.svg.track.height = Utils.calculateSvgDimension(this.config.position.track.height);

        this.svg.thumb.width = Utils.calculateSvgDimension(this.config.position.thumb.width);
        this.svg.thumb.height = Utils.calculateSvgDimension(this.config.position.thumb.height);

        // x1, y1 = topleft corner
        this.svg.capture.x1 = this.svg.cx - this.svg.capture.width/2;
        this.svg.capture.y1 = this.svg.cy - this.svg.capture.height/2;

        // x1, y1 = topleft corner
        this.svg.track.x1 = this.svg.cx - this.svg.track.width/2;
        this.svg.track.y1 = this.svg.cy - this.svg.track.height/2;

        // x1, y1 = topleft corner
        this.svg.activeTrack.x1 = (this.config.position.orientation == 'horizontal') ? this.svg.track.x1 : this.svg.cx - this.svg.activeTrack.width/2;
        this.svg.activeTrack.y1 = this.svg.cy - this.svg.activeTrack.height/2;
        // this.svg.activeTrack.x1 = this.svg.track.x1;

        this.svg.thumb.x1 = this.svg.cx - this.svg.thumb.width/2;
        this.svg.thumb.y1 = this.svg.cy - this.svg.thumb.height/2;
        break;

      default:
        console.error('RangeSliderTool - constructor: invalid orientation [vertical, horizontal] = ', this.config.position.orientation);
        throw Error('RangeSliderTool::constructor - invalid orientation [vertical, horizontal] = ', this.config.position.orientation);
    }

    switch (this.config.position.orientation) {
      case 'vertical':
        this.svg.track.y2 = this.svg.cy + this.svg.track.height/2;
        this.svg.activeTrack.y2 = this.svg.track.y2;
      break;
    }
    switch (this.config.position.label.placement) {
      case 'position':
        this.svg.label.cx = Utils.calculateSvgCoordinate(this.config.position.label.cx, 0);
        this.svg.label.cy = Utils.calculateSvgCoordinate(this.config.position.label.cy, 0);
        break;
        
      case 'thumb':
        this.svg.label.cx = this.svg.cx;
        this.svg.label.cy = this.svg.cy;
        break;
      
      case 'none':
        break;

      default:
        console.error('RangeSliderTool - constructor: invalid label placement [none, position, thumb] = ', this.config.position.label.placement);
        throw Error('RangeSliderTool::constructor - invalid label placement [none, position, thumb] = ', this.config.position.label.placement);
    }
    
    // Init classes
    this.classes.capture = {};
    this.classes.track = {};
    this.classes.thumb = {};
    this.classes.label = {};
    this.classes.uom = {};

    // Init styles
    this.styles.capture = {};
    this.styles.track = {};
    this.styles.thumb = {};
    this.styles.label = {};
    this.styles.uom = {};

    // Init scale
    this.svg.scale = {};
    this.svg.scale.min = this.valueToSvg(this, this.config.scale.min);
    this.svg.scale.max = this.valueToSvg(this, this.config.scale.max);
    this.svg.scale.step = this.config.scale.step;

    if (this.dev.debug) console.log('RangeSliderTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

 /*******************************************************************************
  * RangeSliderTool::svgCoordinateToSliderValue()
  *
  * Summary.
  * @returns {slider value} Translated svg coordinate to actual slider value
  *
  */

  svgCoordinateToSliderValue(argThis, m) {

    let state;
    let scalePos;
    
    switch (argThis.config.position.orientation) {
      case 'horizontal':
        var xpos = m.x - argThis.svg.track.x1 - this.svg.thumb.width/2;
        scalePos = xpos / (argThis.svg.track.width - this.svg.thumb.width);
        break;

      case 'vertical':
        // y is calculated from lower y value. So slider is from bottom to top...
        var ypos = argThis.svg.track.y2  - this.svg.thumb.height/2 - m.y;
        scalePos = ypos / (argThis.svg.track.height - this.svg.thumb.height);
        break;
    }
    state = ((argThis.config.scale.max - argThis.config.scale.min) * scalePos) + argThis.config.scale.min;
    state = Math.round(state / this.svg.scale.step) * this.svg.scale.step;
    state = Math.max(Math.min(this.config.scale.max, state), this.config.scale.min);

    return state;
  }

  valueToSvg(argThis, argValue) {

    if (argThis.config.position.orientation == 'horizontal') {
      let state = Utils.calculateValueBetween(argThis.config.scale.min, argThis.config.scale.max, argValue);

      var xposp = state * (argThis.svg.track.width - this.svg.thumb.width);
      var xpos = argThis.svg.track.x1 + this.svg.thumb.width/2 + xposp;
      return xpos;
    } else if (argThis.config.position.orientation == 'vertical') {
      let state = Utils.calculateValueBetween(argThis.config.scale.min, argThis.config.scale.max, argValue);

      var yposp = state * (argThis.svg.track.height - this.svg.thumb.height);
      var ypos = argThis.svg.track.y2 - this.svg.thumb.height/2 - yposp;
      return ypos;
    }
  }

  updateValue(argThis, m) {

    this._value = this.svgCoordinateToSliderValue(argThis, m);
    // set dist to 0 to cancel animation frame
    let dist = 0;
    //improvement
    if (Math.abs(dist) < 0.01) {
      if (this.rid) {
        window.cancelAnimationFrame(this.rid);
        this.rid = null;
      }
    }
  }

  updateThumb(argThis, m) {

    switch (argThis.config.position.orientation) {
      default:
      case 'horizontal':
        if (this.config.position.label.placement == 'thumb') {
        }

        if (this.dragging) {
          const yUp = (this.config.position.label.placement == 'thumb') ? -50 : 0;
          const yUpStr = `translate(${m.x - this.svg.cx}px , ${yUp}px)`;

          argThis.elements.thumbGroup.style.transform = yUpStr;
        } else {
          argThis.elements.thumbGroup.style.transform = `translate(${m.x - this.svg.cx}px, ${0}px)`;
        }
        break;

      case 'vertical':
        if (this.dragging) {
          const xUp = (this.config.position.label.placement == 'thumb') ? -50 : 0;
          const xUpStr = `translate(${xUp}px, ${m.y - this.svg.cy}px)`;
          argThis.elements.thumbGroup.style.transform = xUpStr;
        } else {
          argThis.elements.thumbGroup.style.transform = `translate(${0}px, ${m.y - this.svg.cy}px)`;
        }
        break;
    }

    argThis.updateLabel(argThis, m);
  }

  updateActiveTrack(argThis, m) {

    if (!argThis.config.show.active) return;
    
    switch (argThis.config.position.orientation) {
      default:
      case 'horizontal':
        if (this.dragging) {
          argThis.elements.activeTrack.setAttribute("width", Math.abs(this.svg.activeTrack.x1 - m.x + this.svg.cx));
        }
        break;

      case 'vertical':
        if (this.dragging) {
          argThis.elements.activeTrack.setAttribute("y", m.y - this.svg.cy);
          argThis.elements.activeTrack.setAttribute("height", Math.abs(argThis.svg.activeTrack.y2 - m.y + this.svg.cx));
        }
        break;
    }
  }
  
  updateLabel(argThis, m) {
    if (this.dev.debug) console.log('SLIDER - updateLabel start', m, argThis.config.position.orientation);

    const dec = (this._card.config.entities[this.config.entity_index].decimals || 0);
    const x = 10 ** dec;
    argThis.labelValue2 = (Math.round(argThis.svgCoordinateToSliderValue(argThis, m) * x) / x).toFixed(dec);

    if (this.config.position.label.placement != 'none') {
      argThis.elements.label.textContent = argThis.labelValue2;
    }
  }

  /*
  * oMousePosSVG
  *
  * Translate mouse/touch client window coordinates to SVG window coordinates
  *
  */
  oMousePosSVG(e) {
    var p = this.elements.svg.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    var ctm = this.elements.svg.getScreenCTM().inverse();
    var p = p.matrixTransform(ctm);
    return p;
  }

  callDragService()
  {
    if (typeof this.labelValue2 == 'undefined') return;
    
    if (this.labelValuePrev != this.labelValue2) {
      this.labelValuePrev = this.labelValue2;

    this._processTapEvent(this._card,
                          this._card._hass,
                          this.config,
                          this.config.user_actions.tap_action,
                          this._card.config.entities[this.config.entity_index]?.entity,
                          this.labelValue2);

    }
    if (this.dragging)
      this.timeOutId = setTimeout(() => this.callDragService(), this.config.user_actions.drag_action.update_interval);
  }

  callTapService()
  {
    if (typeof this.labelValue2 == 'undefined') return;
    
    if (this.labelValuePrev != this.labelValue2) {
      this.labelValuePrev = this.labelValue2;

    this._processTapEvent(this._card,
                          this._card._hass,
                          this.config,
                          this.config.user_actions?.tap_action,
                          this._card.config.entities[this.config.entity_index]?.entity,
                          this.labelValue2);
                          
    }
  }
  
  firstUpdated(changedProperties)
  {
    const thisValue = this;
    this.labelValue = this._stateValue;

    function Frame() {
      thisValue.rid = window.requestAnimationFrame(Frame);
      thisValue.updateValue(thisValue, thisValue.m);
      thisValue.updateThumb(thisValue, thisValue.m);
      thisValue.updateActiveTrack(thisValue, thisValue.m);
    }

    function Frame2() {
      this.rid = window.requestAnimationFrame(Frame2);
      this.updateValue(this, this.m);
      this.updateThumb(this, this.m);
      this.updateActiveTrack(this, this.m);
    }

    if (this.dev.debug) console.log('slider - firstUpdated');
    this.elements = {};
    this.elements.svg = this._card.shadowRoot.getElementById("rangeslider-".concat(this.toolId));
    this.elements.capture = this.elements.svg.querySelector("#capture");
    this.elements.track = this.elements.svg.querySelector("#rs-track");
    this.elements.activeTrack = this.elements.svg.querySelector("#active-track");
    this.elements.thumbGroup = this.elements.svg.querySelector("#rs-thumb-group");
    this.elements.thumb = this.elements.svg.querySelector("#rs-thumb");
    this.elements.label = this.elements.svg.querySelector("#rs-label tspan");

    if (this.dev.debug) console.log('slider - firstUpdated svg = ', this.elements.svg, 'path=', this.elements.path, 'thumb=', this.elements.thumb, 'label=', this.elements.label, 'text=', this.elements.text);

    this.elements.svg.addEventListener("pointerdown", e => {
      e.preventDefault();
      e.stopPropagation();
      
      const mousePos = this.oMousePosSVG(e);
      // console.log("pointerdown", mousePos, this.svg.thumb, this.m);
      var thumbPos = (this.svg.thumb.x1 + this.svg.thumb.cx);
      if ((mousePos.x > (thumbPos - 10)) && (mousePos.x < (thumbPos + this.svg.thumb.width + 10))) {
        // console.log("pointerdown, mousePos IS within x-width of thumb!!");
        fireEvent(window, 'haptic', 'success');
      } else {
        // console.log("pointerdown, mousePos NOT within x-width of thumb!!");
        fireEvent(window, 'haptic', 'error');
        return;
      }
      
      // User is dragging the thumb of the slider!
      this.dragging = true;
      
      // Check for drag_action. If none specified, or update_interval = 0, don't update while dragging...
      
      if ((this.config.user_actions?.drag_action) && (this.config.user_actions?.drag_action.update_interval)) {
        if (this.config.user_actions.drag_action.update_interval > 0) {
          this.timeOutId = setTimeout(() => this.callDragService(), this.config.user_actions.drag_action.update_interval);
        } else {
          this.timeOutId = null;
        }
      }
      this.m = this.oMousePosSVG(e);
      
      // WHY again not working for Safari/iPad!!!!!
      // Capture on Safari needs about 0.5 sec for the glass to kick in and then capturing works... No idea why...
      // if ((!this.elements.capture.hasPointerCapture(e.pointerId)) ) {//&& !(this._card.isSafari || this._card.iOS)) {
        this.elements.capture.setPointerCapture(e.pointerId);
      // }
      if (this.config.position.orientation == 'horizontal') {
        this.m.x =  (Math.round(this.m.x / this.svg.scale.step) * this.svg.scale.step);
      } else {
        this.m.y = (Math.round(this.m.y / this.svg.scale.step) * this.svg.scale.step);
      }
      if (this.dev.debug) console.log('pointerDOWN',Math.round(this.m.x * 100) / 100);
      // Frame();
      Frame2.call(this);
    }, {capture: true, passive: false});

    this.elements.svg.addEventListener("pointerup", e => {
      e.preventDefault();
      e.stopPropagation();

      if (!this.dragging) return;

      this.dragging = false;
      clearTimeout(this.timeOutId);
      this.target = 0;
      // if ((this.elements.capture.hasPointerCapture(e.pointerId)) ) {//&& !(this._card.isSafari || this._card.iOS)) {
        this.elements.capture.releasePointerCapture(e.pointerId);
      // }
      if (this.dev.debug) console.log('pointerUP');
      Frame2.call(this);
      this.callTapService();
    }, {capture: true, passive: false});

    this.elements.svg.addEventListener("pointermove", e => {
      let scaleValue;

      e.preventDefault();
      e.stopPropagation();

      if (this.dragging) {
        this.m = this.oMousePosSVG(e);

        switch (this.config.position.orientation) {
          case 'horizontal':
            scaleValue = this.svgCoordinateToSliderValue(this, this.m);
            this.m.x = this.valueToSvg(this, scaleValue);
            this.m.x = Math.max(this.svg.scale.min, Math.min(this.m.x, this.svg.scale.max));
            this.m.x = (Math.round(this.m.x / this.svg.scale.step) * this.svg.scale.step);
            break;

          case 'vertical':
            scaleValue = this.svgCoordinateToSliderValue(this, this.m);
            this.m.y = this.valueToSvg(this, scaleValue);
            this.m.y = (Math.round(this.m.y / this.svg.scale.step) * this.svg.scale.step);
            break;
        }
        Frame2.call(this);
      }
    }, {capture: true, passive: false});

  }

/*******************************************************************************
  * RangeSliderTool::value()
  *
  * Summary.
  * Receive new state data for the entity this rangeslider is linked to. Called from set hass;
  * Sets the brightness value of the slider. This is a value 0..255. We display %, so translate
  *
  */
  set value(state) {
    var changed = super.value = state;
    if (!this.dragging) this.labelValue = this._stateValue;
    return changed;
  }
  
  _renderUom() {

    if (this.config.show.uom === 'none') {
      return svg``;
    } else {
      this.MergeAnimationStyleIfChanged();
      this.MergeColorFromState(this.styles.uom);
      
      var fsuomStr = this.styles.label["font-size"];

      var fsuomValue = 0.5;
      var fsuomType = 'em';
      const fsuomSplit = fsuomStr.match(/\D+|\d*\.?\d+/g);
      if (fsuomSplit.length == 2) {
        fsuomValue = Number(fsuomSplit[0]) * .6;
        fsuomType = fsuomSplit[1];
      }
      else console.error('Cannot determine font-size for state/unit', fsuomStr);

      fsuomStr = { "font-size": fsuomValue + fsuomType};

      this.styles.uom = Merge.mergeDeep(this.config.styles.uom, fsuomStr);

      const uom = this._card._buildUom(this.derivedEntity, this._card.entities[this.config.entity_index], this._card.config.entities[this.config.entity_index]);

      // Check for location of uom. end = next to state, bottom = below state ;-), etc.
      if (this.config.show.uom === 'end') {

        if ((this.svg.label.cx == 0) || (this.svg.label.cy == 0)) {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ERR</tspan>
        `;
        }
        else {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
        }
      } else if (this.config.show.uom === 'bottom') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="1.5em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else if (this.config.show.uom === 'top') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="-1.5em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;

      } else {
        return svg`
          <tspan class="${classMap(this.classes.uom)}"  dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ERR</tspan>
        `;
      }
    }
  }

 /*******************************************************************************
  * RangeSliderTool::_renderRangeSlider()
  *
  * Summary.
  * Renders the range slider
  *
  */

  _renderRangeSlider() {

    if (this.dev.debug) console.log('slider - _renderRangeSlider');

    this.MergeAnimationClassIfChanged();
    this.MergeColorFromState(this.styles);
    this.MergeAnimationStyleIfChanged(this.styles);
    this.MergeColorFromState(this.styles);

    this.renderValue = this._stateValue;
    if (this.dragging) {
      this.renderValue = this.labelValue2;
    } else {
      if (this.elements?.label) this.elements.label.textContent = this.renderValue;
    }
    
    // Calculate cx and cy: the relative move of the thumb from the center of the track
    let cx, cy;
    switch (this.config.position.label.placement) {
      case 'none':
        this.styles.label["display"] = 'none';
        this.styles.uom["display"] = 'none';
        break;
      case 'position':
        cx = (this.config.position.orientation == 'horizontal'
          ? this.valueToSvg(this, Number(this.renderValue)) - this.svg.cx
          : 0);
        cy = (this.config.position.orientation == 'vertical'
          ? this.valueToSvg(this, Number(this.renderValue)) - this.svg.cy
          : 0);
        break;

      case 'thumb':
        cx = (this.config.position.orientation == 'horizontal'
          ? -this.svg.label.cx + this.valueToSvg(this, Number(this.renderValue))
          : 0);
        cy = (this.config.position.orientation == 'vertical'
          ? this.valueToSvg(this, Number(this.renderValue))
          : 0);
        if (this.dragging) (this.config.position.orientation == 'horizontal') ? cy -= 50 : cx -=50;
        break;
        
        default:
          console.error('_renderRangeSlider(), invalid label placement', this.config.position.label.placement);
    }
    this.svg.thumb.cx = cx;
    this.svg.thumb.cy = cy;
    
    function renderActiveTrack() {
      if (!this.config.show.active) return svg``;
      
      if (this.config.position.orientation === 'horizontal') {
        return svg`
          <rect id="active-track" class="${classMap(this.classes.active)}" x="${this.svg.activeTrack.x1}" y="${this.svg.activeTrack.y1}"
            width="${Math.abs(this.svg.thumb.x1 - this.svg.activeTrack.x1 + cx + this.svg.thumb.width/2)}" height="${this.svg.activeTrack.height}" rx="${this.svg.activeTrack.radius}"
            style="${styleMap(this.styles.active)}" touch-action="none"
          />`;
      } else {
        return svg`
          <rect id="active-track" class="${classMap(this.classes.active)}" x="${this.svg.activeTrack.x1}" y="${cy}"
            height="${Math.abs(this.svg.activeTrack.y1 + cy - this.svg.thumb.height)}" width="${this.svg.activeTrack.width}" rx="${this.svg.activeTrack.radius}"
            style="${styleMap(this.styles.active)}"
          />`;
      }
    }
    
    function renderThumbGroup() {
      return svg`
        <g id="rs-thumb-group" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}" style="transform:translate(${cx}px, ${cy}px);">
          <g style="transform-origin:center;transform-box: fill-box;">
            <rect id="rs-thumb" class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
              width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
              style="${styleMap(this.styles.thumb)}"
            />
            </g>
            ${renderLabel.call(this, true)} 
        </g>
      `;
    }
    
    function renderLabel(argGroup) {
      if ((this.config.position.label.placement == 'thumb') && argGroup) {

        return svg`
      <text id="rs-label">
        <tspan class="${classMap(this.classes.label)}" x="${this.svg.label.cx}" y="${this.svg.label.cy}" style="${styleMap(this.styles.label)}">
        ${this.renderValue}</tspan>
        ${this._renderUom()}
        </text>
        `;
      }

      if ((this.config.position.label.placement == 'position') && !argGroup) {
        return svg`
          <text id="rs-label" style="transform-origin:center;transform-box: fill-box;">
            <tspan class="${classMap(this.classes.label)}" data-placement="position" x="${this.svg.label.cx}" y="${this.svg.label.cy}"
            style="${styleMap(this.styles.label)}">${this.renderValue ? this.renderValue : ''}</tspan>
            ${this.renderValue ? this._renderUom() : ''}
          </text>
          `;
      }
    }
    
    const svgItems = [];
    svgItems.push(svg`
      <rect id="capture" class="${classMap(this.classes.capture)}" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}"
      width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.track.radius}"          
      />

      <rect id="rs-track" class="${classMap(this.classes.track)}" x="${this.svg.track.x1}" y="${this.svg.track.y1}"
        width="${this.svg.track.width}" height="${this.svg.track.height}" rx="${this.svg.track.radius}"
        style="${styleMap(this.styles.track)}"
      />

      ${renderActiveTrack.call(this)}
      ${renderThumbGroup.call(this)}
      ${renderLabel.call(this, false)}


      `
    );

    return svgItems;
  }

 /*******************************************************************************
  * RangeSliderTool::render()
  *
  * Summary.
  * The render() function for this object. The conversion of pointer events need
  * an SVG as grouping object!
  *
  * NOTE:
  * It is imperative that the style overflow=visible is set on the svg.
  * The weird thing is that if using an svg as grouping object, AND a class, the overflow=visible
  * seems to be ignored by both chrome and safari. If the overflow=visible is directly set as style,
  * the setting works.
  *
  * Works on svg with direct styling:
  * ---
  *  return svg`
  *    <svg xmlns="http://www.w3.org/2000/svg" id="rangeslider-${this.toolId}"
  *      pointer-events="all" overflow="visible"
  *    >
  *      ${this._renderRangeSlider()}
  *    </svg>
  *  `;
  *
  * Does NOT work on svg with class styling:
  * ---
  *  return svg`
  *    <svg xmlns="http://www.w3.org/2000/svg" id="rangeslider-${this.toolId}" class="${classMap(this.classes.tool)}"
  *    >
  *      ${this._renderRangeSlider()}
  *    </svg>
  *  `;
  * where the class has the overflow=visible setting...
  *
  */
  render() {

    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" id="rangeslider-${this.toolId}" overflow="visible"
        touch-action="none" style="touch-action:none; pointer-events:none;"
      >
        ${this._renderRangeSlider()}
      </svg>
    `;
  }
} // END of class

 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */
 
 /******************************************************************************
  * LineTool class
  *
  * Summary.
  *
  */

class LineTool extends BaseTool {
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
          "sak-line": true,
          "hover": true,
        },
        line: {
          "sak-line__line": true,
        }
      },
      styles: {
        tool: {
        },
        line: {
        }
      }
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_LINE_CONFIG, argConfig), argPos);

    if (!["horizontal", "vertical", "fromto"].includes(this.config.position.orientation))
        throw Error('LineTool::constructor - invalid orientation [vertical, horizontal, fromto] = ', this.config.position.orientation);

    if (["horizontal", "vertical"].includes(this.config.position.orientation))
        this.svg.length = Utils.calculateSvgDimension(argConfig.position.length);

    if (this.config.position.orientation == 'fromto') {
      this.svg.x1 = Utils.calculateSvgCoordinate(argConfig.position.x1, this.toolsetPos.cx);
      this.svg.y1 = Utils.calculateSvgCoordinate(argConfig.position.y1, this.toolsetPos.cy);
      this.svg.x2 = Utils.calculateSvgCoordinate(argConfig.position.x2, this.toolsetPos.cx);
      this.svg.y2 = Utils.calculateSvgCoordinate(argConfig.position.y2, this.toolsetPos.cy);
    }

    if (this.config.position.orientation == 'vertical') {
      this.svg.x1 = this.svg.cx;
      this.svg.y1 = this.svg.cy - this.svg.length/2;
      this.svg.x2 = this.svg.cx;
      this.svg.y2 = this.svg.cy + this.svg.length/2;
    } else if (this.config.position.orientation == 'horizontal') {
      this.svg.x1 = this.svg.cx - this.svg.length/2;
      this.svg.y1 = this.svg.cy;
      this.svg.x2 = this.svg.cx + this.svg.length/2;
      this.svg.y2 = this.svg.cy;
    } else if (this.config.position.orientation == 'fromto') {
    }
    
    this.classes.line = {};
    this.styles.line = {};
    
    if (this.dev.debug) console.log('LineTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

 /*******************************************************************************
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

 /*******************************************************************************
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
        @click=${e => this.handleTapEvent(e, this.config)}>
        ${this._renderLine()}
      </g>
    `;

  }
} // END of class

 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /******************************************************************************
  * CircleTool class
  *
  * Summary.
  *
  */

class CircleTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_CIRCLE_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        radius: 50,
      },
      classes: {
        tool: {
          "sak-circle": true,
          "hover": true,
        },
        circle: {
          "sak-circle__circle": true,
        }
      },
      styles: {
        tool: {
        },
        circle: {
        }
      }
    }

    super(argToolset, Merge.mergeDeep(DEFAULT_CIRCLE_CONFIG, argConfig), argPos);
    this.EnableHoverForInteraction();

    this.svg.radius = Utils.calculateSvgDimension(argConfig.position.radius)
    
    this.classes.circle = {};
    this.styles.circle = {};
    if (this.dev.debug) console.log('CircleTool constructor config, svg', this.toolId, this.config, this.svg);
  }

 /*******************************************************************************
  * CircleTool::value()
  *
  * Summary.
  * Receive new state data for the entity this circle is linked to. Called from set hass;
  *
  */
  set value(state) {
    var changed = super.value = state;

    return changed;
  }

 /*******************************************************************************
  * CircleTool::_renderCircle()
  *
  * Summary.
  * Renders the circle using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the circle
  *
  */

  _renderCircle() {

    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.circle);

    return svg`
      <circle class="${classMap(this.classes.circle)}"
        cx="${this.svg.cx}"% cy="${this.svg.cy}"% r="${this.svg.radius}"
        style="${styleMap(this.styles.circle)}"
      </circle>

      `;
  }

 /*******************************************************************************
  * CircleTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */

  render() {

    return svg`
      <g "" id="circle-${this.toolId}" class="${classMap(this.classes.tool)}" overflow="visible" transform-origin="${this.svg.cx} ${this.svg.cy}"
        @click=${e => this.handleTapEvent(e, this.config)}>
        ${this._renderCircle()}
      </g>
    `;

  }
} // END of class

 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /******************************************************************************
  * SwitchTool class
  *
  * Summary.
  *
  *
  * NTS:
  * - .mdc-switch__native-control uses:
  *     - width: 68px, 17em
  *     - height: 48px, 12em
  * - and if checked (.mdc-switch--checked):
  *     - transform: translateX(-20px)
  *
  * .mdc-switch.mdc-switch--checked .mdc-switch__thumb {
  *  background-color: var(--switch-checked-button-color);
  *  border-color: var(--switch-checked-button-color);
  * 
  */

class SwitchTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_SWITCH_CONFIG = {
        position: {
          cx: 50,
          cy: 50,
          orientation: 'horizontal',
          track: {
            width: 16,
            height: 7,
            radius: 3.5,
          },
          thumb: {
            width: 9,
            height: 9,
            radius: 4.5,
            offset: 4.5,
          },
        },
        classes: {
          tool: {
            "sak-switch": true,
            "hover": true,
          },
          track: {
            "sak-switch__track": true,
          },
          thumb: {
            "sak-switch__thumb": true,
          }
        },
        styles: {
          tool: {
          },
          track: {
          },
          thumb: {
          }
        }
    };

    const HORIZONTAL_SWITCH_CONFIG = {
        animations: [
          {
            state: 'on',
            id: 1,
            styles: {
              track: {
                fill: 'var(--switch-checked-track-color)',
                "pointer-events": 'auto',
              },
              thumb: {
                fill: 'var(--switch-checked-button-color)',
                transform: 'translateX(4.5em)',
                "pointer-events": 'auto',
              },
            },
          },
          {
            state: 'off',
            id: 0,
            styles: {
              track: {
                fill: 'var(--switch-unchecked-track-color)',
                "pointer-events": 'auto',
              },
              thumb: {
                transform: 'translateX(-4.5em)',
                "pointer-events": 'auto',
              },
            }
          }
        ],
    };

    const VERTICAL_SWITCH_CONFIG = {
        animations: [
          {
            state: 'on',
            id: 1,
            styles: {
              track: {
                fill: 'var(--switch-checked-track-color)',
                "pointer-events": 'auto',
              },
              thumb: {
                fill: 'var(--switch-checked-button-color)',
                transform: 'translateY(-4.5em)',
                "pointer-events": 'auto',
              },
            },
          },
          {
            state: 'off',
            id: 0,
            styles: {
              track: {
                fill: 'var(--switch-unchecked-track-color)',
                "pointer-events": 'auto',
              },
              thumb: {
                transform: 'translateY(4.5em)',
                "pointer-events": 'auto',
              },
            }
          }
        ],
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_SWITCH_CONFIG, argConfig), argPos);

    if (!["horizontal", "vertical"].includes(this.config.position.orientation))
        throw Error('SwitchTool::constructor - invalid orientation [vertical, horizontal] = ', this.config.position.orientation);
      
    this.svg.track = {};
    this.svg.track.radius = Utils.calculateSvgDimension(this.config.position.track.radius);
    
    this.svg.thumb = {};
    this.svg.thumb.radius = Utils.calculateSvgDimension(this.config.position.thumb.radius);
    this.svg.thumb.offset = Utils.calculateSvgDimension(this.config.position.thumb.offset);

    switch (this.config.position.orientation) {
      default:
      case 'horizontal':
        this.config = Merge.mergeDeep(DEFAULT_SWITCH_CONFIG, HORIZONTAL_SWITCH_CONFIG, argConfig);

        this.svg.track.width = Utils.calculateSvgDimension(this.config.position.track.width);
        this.svg.track.height = Utils.calculateSvgDimension(this.config.position.track.height);
        this.svg.thumb.width = Utils.calculateSvgDimension(this.config.position.thumb.width);
        this.svg.thumb.height = Utils.calculateSvgDimension(this.config.position.thumb.height);

        this.svg.track.x1 = this.svg.cx - this.svg.track.width/2;
        this.svg.track.y1 = this.svg.cy - this.svg.track.height/2;

        this.svg.thumb.x1 = this.svg.cx - this.svg.thumb.width/2;
        this.svg.thumb.y1 = this.svg.cy - this.svg.thumb.height/2;
        break;

      case 'vertical':
        this.config = Merge.mergeDeep(DEFAULT_SWITCH_CONFIG, VERTICAL_SWITCH_CONFIG, argConfig);

        this.svg.track.width = Utils.calculateSvgDimension(this.config.position.track.height);
        this.svg.track.height = Utils.calculateSvgDimension(this.config.position.track.width);
        this.svg.thumb.width = Utils.calculateSvgDimension(this.config.position.thumb.height);
        this.svg.thumb.height = Utils.calculateSvgDimension(this.config.position.thumb.width);

        this.svg.track.x1 = this.svg.cx - this.svg.track.width/2;
        this.svg.track.y1 = this.svg.cy - this.svg.track.height/2;

        this.svg.thumb.x1 = this.svg.cx - this.svg.thumb.width/2;
        this.svg.thumb.y1 = this.svg.cy - this.svg.thumb.height/2;
        break;
    }

    this.classes.track = {};
    this.classes.thumb = {};

    this.styles.track = {};
    this.styles.thumb = {};
    if (this.dev.debug) console.log('SwitchTool constructor config, svg', this.toolId, this.config, this.svg);
  }

 /*******************************************************************************
  * SwitchTool::value()
  *
  * Summary.
  * Receive new state data for the entity this switch is linked to. Called from set hass;
  *
  */
  set value(state) {
    var changed = super.value = state;

    return changed;
  }

 /**
  * SwitchTool::_renderSwitch()
  *
  * Summary.
  * Renders the switch using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the switch
  *
  */

  _renderSwitch() {

    this.MergeAnimationClassIfChanged();
    // this.MergeColorFromState(this.styles);
    this.MergeAnimationStyleIfChanged();

    return svg`
      <g>
        <rect class="${classMap(this.classes.track)}" x="${this.svg.track.x1}" y="${this.svg.track.y1}"
          width="${this.svg.track.width}" height="${this.svg.track.height}" rx="${this.svg.track.radius}"
          style="${styleMap(this.styles.track)}"
        />
        <rect class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
          width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
          style="${styleMap(this.styles.thumb)}"
        />
      </g>
      `;
  }

 /*******************************************************************************
  * SwitchTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  * https://codepen.io/joegaffey/pen/vrVZaN
  *
  */

  render() {

    return svg`
      <g id="switch-${this.toolId}" class="${classMap(this.classes.tool)}" overflow="visible" transform-origin="${this.svg.cx} ${this.svg.cy}"
        @click=${e => this.handleTapEvent(e, this.config)}>
        ${this._renderSwitch()}
      </g>
    `;

  }
} // END of class

 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /******************************************************************************
  * RegPolyTool class
  *
  * Summary.
  *
  */

class RegPolyTool extends BaseTool {
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
          "sak-polygon": true,
          "hover": true,
        },
        regpoly: {
          "sak-polygon__regpoly": true,
        }
      },
      styles: {
        tool: {
        },
        regpoly: {
        }
      }
    }

    super(argToolset, Merge.mergeDeep(DEFAULT_REGPOLY_CONFIG, argConfig), argPos);

    this.svg.radius = Utils.calculateSvgDimension(argConfig.position.radius)

    this.classes.regpoly = {};
    this.styles.regpoly = {};
    if (this.dev.debug) console.log('RegPolyTool constructor config, svg', this.toolId, this.config, this.svg);
  }

 /*******************************************************************************
  * RegPolyTool::value()
  *
  * Summary.
  * Receive new state data for the entity this circle is linked to. Called from set hass;
  *
  */
  set value(state) {
    var changed = super.value = state;

    return changed;
  }


 /*******************************************************************************
  * RegPolyTool::_renderRegPoly()
  *
  * Summary.
  * Renders the regular polygon using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the regular polygon
  *
  */

  _renderRegPoly() {

    var generatePoly = function(p, q, r, a, cx, cy) {
      var base_angle = 2 * Math.PI / p, 
          angle = a + base_angle, 
          x, y, d_attr = '';
      
      for(var i = 0; i < p; i++) {
        
        angle += q * base_angle;
        
        x = cx + ~~(r * Math.cos(angle));
        y = cy + ~~(r * Math.sin(angle));
        
        d_attr += 
          ((i === 0)?'M':'L') + x + ' ' + y + ' ';
        
        if(i * q % p === 0 && i > 0) {
          angle += base_angle;
          x = cx + ~~(r * Math.cos(angle));
          y = cy + ~~(r * Math.sin(angle));
          
          d_attr += 'M' + x + ' ' + y + ' ';
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

 /*******************************************************************************
  * RegPolyTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
//        @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])} >

  render() {

    return svg`
      <g "" id="regpoly-${this.toolId}" class="${classMap(this.classes.tool)}" transform-origin="${this.svg.cx} ${this.svg.cy}"
        @click=${e => this.handleTapEvent(e, this.config)}>
        ${this._renderRegPoly()}
      </g>
    `;

  }
} // END of class

 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /******************************************************************************
  * UserSvgTool class, UserSvgTool::constructor
  *
  * Summary.
  *
  */

class UserSvgTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_USERSVG_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        height: 50,
        width: 50,
      },
      styles: {
        usersvg: {
        }
      }
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_USERSVG_CONFIG, argConfig), argPos);

    this.images = {};
    this.images = Object.assign({}, ...this.config.images);

    // #TODO:
    // Select first key in k/v store. HOw??
    this.item = {};
    this.item.image = "default";

    // https://github.com/flobacher/SVGInjector2
    // Note: in defs, url from gradient is changed, but NOT in the SVG fill=...
    
    this.injector = {};
    // Options
    this.injector.injectorOptions = {
      evalScripts: 'once',
      pngFallback: 'assets/png'
    };

    this.injector.afterAllInjectionsFinishedCallback = function (totalSVGsInjected) {
      // Callback after all SVGs are injected
      // console.log('We injected ' + totalSVGsInjected + ' SVG(s)!');
    }.bind(this);

    this.injector.perInjectionCallback = function (svg) {
      // Callback after each SVG is injected
      this.injector.svg = svg;
      // console.log('SVG injected: ' + svg);
    }.bind(this);

    // create injector configured by options
    this.injector.injector = new SVGInjector(this.injector.injectorOptions);


    if (this.dev.debug) console.log('UserSvgTool constructor config, svg', this.toolId, this.config, this.svg);
  }

 /*******************************************************************************
  * UserSvgTool::value()
  *
  * Summary.
  * Receive new state data for the entity this usersvg is linked to. Called from set hass;
  *
  */
  set value(state) {
    var changed = super.value = state;

    return changed;
  }

 /*******************************************************************************
  * UserSvgTool::_renderUserSvg()
  *
  * Summary.
  * Renders the usersvg using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the usersvg
  *
  */

  updated(changedProperties) {
    this.injector.elementsToInject = this._card.shadowRoot.querySelectorAll('svg[data-src]');
    // console.log("updated - ", this._card.shadowRoot.getElementById("usersvg-".concat(this.toolId)));
    
    this.injector.elementsToInject = this._card.shadowRoot.getElementById("usersvg-".concat(this.toolId)).querySelectorAll('svg[data-src]:not(.injected-svg)');
    // console.log("updated - elements...", this.injector.elementsToInject);

    // Trigger the injection if there is something to inject...
    if (this.injector.elementsToInject.length > 0)
      this.injector.injector.inject(
        this.injector.elementsToInject,
        this.injector.afterAllInjectionsFinishedCallback,
        this.injector.perInjectionCallback
      );    
  }

  _renderUserSvg() {

    
    this.MergeAnimationStyleIfChanged();

    if (this.injector.svg) {
      // console.log("re-using injected svg...");
      return svg`${this.injector.svg}`;
    } else {
      return svg`
        <svg id="image-one" data-src="${this.images[this.item.image]}" class="sak-usersvg__image" x="${this.svg.x}" y="${this.svg.y}" style="${styleMap(this.styles.usersvg)}" height="${this.svg.height}" width="${this.svg.width}">
        </svg>
        `;
    }
  }
 /*******************************************************************************
  * UserSvgTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {

    return svg`
      <g id="usersvg-${this.toolId}" overflow="visible" transform-origin="${this.svg.cx} ${this.svg.cy}"
        @click=${e => this.handleTapEvent(e, this.config)}>
        ${this._renderUserSvg()}
      </g>
    `;
  }
} // END of class

 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /******************************************************************************
  * RectangleTool class
  *
  * Summary.
  *
  */

class RectangleTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_RECTANGLE_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        width: 50,
        height: 50,
        rx: 0,
      }, 
      classes: {
        tool: {
          "sak-rectangle": true,
          "hover": true,
        },
        rectangle: {
          "sak-rectangle__rectangle": true,
        }
      },
      styles: {
        rectangle: {
        }
      }
    }

    super(argToolset, Merge.mergeDeep(DEFAULT_RECTANGLE_CONFIG, argConfig), argPos);
    this.svg.rx = argConfig.position.rx ? Utils.calculateSvgDimension(argConfig.position.rx) : 0;

    this.classes.rectangle = {};
    this.styles.rectangle = {};

    if (this.dev.debug) console.log('RectangleTool constructor config, svg', this.toolId, this.config, this.svg);
  }

 /*******************************************************************************
  * RectangleTool::value()
  *
  * Summary.
  * Receive new state data for the entity this rectangle is linked to. Called from set hass;
  *
  */
  set value(state) {
    var changed = super.value = state;

    return changed;
  }

 /*******************************************************************************
  * RectangleTool::_renderRectangle()
  *
  * Summary.
  * Renders the circle using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the circle
  *
  */

  _renderRectangle() {

    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.rectangle);

    return svg`
      <rect class="${classMap(this.classes.rectangle)}"
        x="${this.svg.x}" y="${this.svg.y}" width="${this.svg.width}" height="${this.svg.height}" rx="${this.svg.rx}"
        style="${styleMap(this.styles.rectangle)}"/>
      `;
  }

 /*******************************************************************************
  * RectangleTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {

    return svg`
      <g id="rectangle-${this.toolId}" class="${classMap(this.classes.tool)}" transform-origin="${this.svg.cx}px ${this.svg.cy}px"
        @click=${e => this.handleTapEvent(e, this.config)}>
        ${this._renderRectangle()}
      </g>
    `;

  }
} // END of class

 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /******************************************************************************
  * RectangleToolEx class
  *
  * Summary.
  *
  */

class RectangleToolEx extends BaseTool {
  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_RECTANGLEEX_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        width: 50,
        height: 50,
        radius: {
          all: 0,
        },
      },
      classes: {
        tool: {
          "sak-rectex": true,
          "hover": true,
        },
        rectex: {
          "sak-rectex__rectex": true,
        }
      },
      styles: {
        rectex: {
        }
      }
    };
    super(argToolset, Merge.mergeDeep(DEFAULT_RECTANGLEEX_CONFIG, argConfig), argPos);

    this.classes.rectex = {};
    this.styles.rectex = {};
    
    // #TODO:
    // Verify max radius, or just let it go, and let the user handle that right value.
    // A q can be max height of rectangle, ie both corners added must be less than the height, but also less then the width...

    let maxRadius = Math.min(this.svg.height, this.svg.width) / 2;
    let radius = 0;
    radius = Utils.calculateSvgDimension(this.config.position.radius.all);
    this.svg.radiusTopLeft = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
                              this.config.position.radius.top_left || this.config.position.radius.left || this.config.position.radius.top || radius))) || 0;

    this.svg.radiusTopRight = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
                              this.config.position.radius.top_right || this.config.position.radius.right || this.config.position.radius.top || radius))) || 0;

    this.svg.radiusBottomLeft = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
                              this.config.position.radius.bottom_left || this.config.position.radius.left || this.config.position.radius.bottom || radius))) || 0;

    this.svg.radiusBottomRight = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
                              this.config.position.radius.bottom_right || this.config.position.radius.right || this.config.position.radius.bottom || radius))) || 0;

    if (this.dev.debug) console.log('RectangleToolEx constructor config, svg', this.toolId, this.config, this.svg);
  }

 /*******************************************************************************
  * RectangleToolEx::value()
  *
  */
  set value(state) {
    var changed = super.value = state;

    return changed;
  }

 /*******************************************************************************
  * RectangleToolEx::_renderRectangleEx()
  *
  * Summary.
  * Renders the rectangle using lines and bezier curves with precalculated coordinates and dimensions.
  *
  * Refs for creating the path online:
  * - https://mavo.io/demos/svgpath/
  *
  */

  _renderRectangleEx() {

    this.MergeAnimationClassIfChanged();

    // WIP
    this.MergeAnimationStyleIfChanged(this.styles);
    this.MergeAnimationStyleIfChanged();
    if (this.config.hasOwnProperty('csnew')) {
      this.MergeColorFromState2(this.styles.rectex, 'rectex');
    } else {
      this.MergeColorFromState(this.styles.rectex);
    }

    if (!this.counter) {this.counter=0}
    this.counter++;

    const svgItems = svg`
      <g class="${classMap(this.classes.rectex)}" id="rectex-${this.toolId}">
        <path  d="
            M ${this.svg.x + this.svg.radiusTopLeft} ${this.svg.y}
            h ${this.svg.width - this.svg.radiusTopLeft - this.svg.radiusTopRight}
            q ${this.svg.radiusTopRight} 0 ${this.svg.radiusTopRight} ${this.svg.radiusTopRight}
            v ${this.svg.height - this.svg.radiusTopRight - this.svg.radiusBottomRight}
            q 0 ${this.svg.radiusBottomRight} -${this.svg.radiusBottomRight} ${this.svg.radiusBottomRight}
            h -${this.svg.width - this.svg.radiusBottomRight - this.svg.radiusBottomLeft}
            q -${this.svg.radiusBottomLeft} 0 -${this.svg.radiusBottomLeft} -${this.svg.radiusBottomLeft}
            v -${this.svg.height - this.svg.radiusBottomLeft - this.svg.radiusTopLeft}
            q 0 -${this.svg.radiusTopLeft} ${this.svg.radiusTopLeft} -${this.svg.radiusTopLeft}
            "
            counter="${this.counter}" 
            style="${styleMap(this.styles.rectex)}"/>
      </g>
      `;
    return svg`${svgItems}`;
  }

 /*******************************************************************************
  * RectangleToolEx::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {

    return svg`
      <g id="rectex-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${e => this.handleTapEvent(e, this.config)}>
        ${this._renderRectangleEx()}
      </g>
    `;

  }
} // END of class

 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /******************************************************************************
  * EllipseTool class
  *
  * Summary.
  *
  */

class EllipseTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_ELLIPSE_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        radiusx: 50,
        radiusy: 25,
      },
      classes: {
        tool: {
          "sak-ellipse": true,
          "hover": true,
        },
        ellipse: {
          "sak-ellipse__ellipse": true,
        }
      },
      styles: {
        ellipse: {
        }
      }
    }

    super(argToolset, Merge.mergeDeep(DEFAULT_ELLIPSE_CONFIG, argConfig), argPos);

    this.svg.radiusx = Utils.calculateSvgDimension(argConfig.position.radiusx)
    this.svg.radiusy = Utils.calculateSvgDimension(argConfig.position.radiusy)

    this.classes.ellipse = {};
    this.styles.ellipse = {};

    if (this.dev.debug) console.log('EllipseTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

 /*******************************************************************************
  * EllipseTool::_renderEllipse()
  *
  * Summary.
  * Renders the ellipse using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the ellipse
  *
  */

  _renderEllipse() {

    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.ellipse);

    if (this.dev.debug) console.log('EllipseTool - renderEllipse', this.svg.cx, this.svg.cy, this.svg.radiusx, this.svg.radiusy);

    return svg`
      <ellipse class="${classMap(this.classes.ellipse)}"
        cx="${this.svg.cx}"% cy="${this.svg.cy}"%
        rx="${this.svg.radiusx}" ry="${this.svg.radiusy}"
        style="${styleMap(this.styles.ellipse)}"/>
      `;
  }

 /*******************************************************************************
  * EllipseTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {

    return svg`
      <g id="ellipse-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${e => this.handleTapEvent(e, this.config)}>
        ${this._renderEllipse()}
      </g>
    `;

  }
} // END of class


 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /******************************************************************************
  * EntityIconTool class
  *
  * Summary.
  *
  */

class EntityIconTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_ICON_CONFIG = {
      classes: {
        tool: {
          "sak-icon": true,
          "hover": true,
        },
        icon: {
          "sak-icon__icon": true,
        }
      },
      styles: {
        icon: {
        }
      }
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
    const adjust = (align == 'center' ? 0.5 : (align == 'start' ? -1 : +1));

    const clientWidth = 400; // testing
    const correction = clientWidth / this._card.viewBox.width;

    this.svg.xpx = this.svg.cx;
    this.svg.ypx = this.svg.cy;


    if ((this._card.isSafari) || (this._card.iOS)) {
      this.svg.iconSize = this.svg.iconSize * correction;

      this.svg.xpx = (this.svg.xpx * correction) - (this.svg.iconPixels * adjust * correction);
      this.svg.ypx = (this.svg.ypx * correction) - (this.svg.iconPixels * 0.5 * correction) - (this.svg.iconPixels * 0.25 * correction);// - (iconPixels * 0.25 / 1.86);
    } else {
      // Get x,y in viewbox dimensions and center with half of size of icon.
      // Adjust horizontal for aligning. Can be 1, 0.5 and -1
      // Adjust vertical for half of height... and correct for 0.25em textfont to align.
      this.svg.xpx = this.svg.xpx - (this.svg.iconPixels * adjust);
      this.svg.ypx = this.svg.ypx - (this.svg.iconPixels * 0.5) - (this.svg.iconPixels * 0.25);
    }
    this.classes.icon = {};
    this.styles.icon = {};
    if (this.dev.debug) console.log('EntityIconTool constructor coords, dimensions, config', this.coords, this.dimensions, this.config);
  }

 /*******************************************************************************
  * EntityIconTool::_buildIcon()
  *
  * Summary.
  * Builds the Icon specification name.
  *
  */
  _buildIcon(entityState, entityConfig, toolIcon) {

    return (
         this.activeAnimation?.icon           // Icon from animation
      || toolIcon                             // Defined by tool
      || entityConfig?.icon                   // Defined by configuration
      || entityState?.attributes?.icon        // Using entity icon
      || stateIcon(entityState)               // Use card helper logic (2021.11.21)
      );
  }


 /*******************************************************************************
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
      this._card.entities[this.config.entity_index],
      this.config.hasOwnProperty('entity_index') ? this._card.config.entities[this.config.entity_index] : undefined,
      this.config.icon);

    if (true || (this.svg.xpx == 0)) {

      this.svg.iconSize = this.config.position.icon_size ? this.config.position.icon_size : 2;
      this.svg.iconPixels = this.svg.iconSize * FONT_SIZE;

      // NEW NEW NEW Use % for size of icon...
      this.svg.iconSize = this.config.position.icon_size ? this.config.position.icon_size : 2;
      this.svg.iconPixels = Utils.calculateSvgDimension(this.svg.iconSize);

      const align = this.config.position.align ? this.config.position.align : 'center';
      const adjust = (align == 'center' ? 0.5 : (align == 'start' ? -1 : +1));

      const clientWidth = 400;
      var correction = clientWidth / (this._card.viewBox.width);

      this.svg.xpx = this.svg.cx;//(x * this._card.viewBox.width);
      this.svg.ypx = this.svg.cy;//(y * this._card.viewBox.height);

      if (/*true &&*/ ((this._card.isSafari) || (this._card.iOS))) {
        //correction = 1; // 
        this.svg.iconSize = this.svg.iconSize * correction;
        this.svg.iconPixels = this.svg.iconPixels * correction;

        this.svg.xpx = (this.svg.xpx * correction) - (this.svg.iconPixels * adjust * correction);
        this.svg.ypx = (this.svg.ypx * correction) - (this.svg.iconPixels * 0.9 * correction);
                        //- (this.svg.iconPixels * 0.25 * correction);// - (iconPixels * 0.25 / 1.86);
        this.svg.xpx = (this.svg.cx  * correction) - (this.svg.iconPixels * adjust * correction);
        this.svg.ypx = (this.svg.cy  * correction) - (this.svg.iconPixels * adjust * correction);

      } else {
        // Get x,y in viewbox dimensions and center with half of size of icon.
        // Adjust horizontal for aligning. Can be 1, 0.5 and -1

        this.svg.xpx = this.svg.cx - (this.svg.iconPixels * adjust);
        this.svg.ypx = this.svg.cy - (this.svg.iconPixels * adjust);

        if (this.dev.debug) console.log("EntityIconTool::_renderIcon - svg values =", this.toolId, this.svg, this.config.cx, this.config.cy, align, adjust);

      }
    };

    if (!this.alternateColor) {this.alternateColor = 'rgba(0,0,0,0)';}

    if (!SwissArmyKnifeCard.sakIconCache[icon]) {
      var theQuery = this._card.shadowRoot.getElementById("icon-".concat(this.toolId))?.shadowRoot?.querySelectorAll("*");
      if (theQuery) {
        this.iconSvg = theQuery[0]?.path;
      } else {
        this.iconSvg = undefined;
      }

      if (!this.iconSvg) {
      } else {
        SwissArmyKnifeCard.sakIconCache[icon] = this.iconSvg;
      }
    } else {
      this.iconSvg = SwissArmyKnifeCard.sakIconCache[icon];
    }
    
    var scale;

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
                @animationstart=${e => this._handleAnimationEvent(e, this)}
                @animationiteration=${e => this._handleAnimationEvent(e, this)}
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

    argThis.iconSvg = this._card.shadowRoot.getElementById("icon-".concat(this.toolId))?.shadowRoot?.querySelectorAll("*")[0]?.path;
    if (argThis.iconSvg) {
      argThis._card.requestUpdate();
    } else {
    }
  }
  
  firstUpdated(changedProperties) {

  }

 /*******************************************************************************
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
      <g "" id="icongrp-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${e => this.handleTapEvent(e, this.config)} >

        ${this._renderIcon()}
      </g>
    `;
  }
} // END of class

 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /******************************************************************************
  * BadgeTool class
  *
  * Summary.
  *
  */

class BadgeTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_BADGE_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        width: 100,
        height: 25,
        radius: 5,
        ratio: 30,
        divider: 30,
      },
      classes: {
        tool: {
          "sak-badge": true,
          "hover": true,
        },
        left: {
          "sak-badge__left": true,
        },
        right: {
          "sak-badge__right": true,
        }
      },
      styles: {
        left: {
        },
        right: {
        }
      }
    };
    super(argToolset, Merge.mergeDeep(DEFAULT_BADGE_CONFIG, argConfig), argPos);

    // Coordinates from left and right part.
    this.svg.radius = Utils.calculateSvgDimension(argConfig.position.radius);
    this.svg.leftXpos = this.svg.x;
    this.svg.leftYpos = this.svg.y;
    this.svg.leftWidth = (this.config.position.ratio / 100) * this.svg.width;
    this.svg.arrowSize = (this.svg.height * this.config.position.divider / 100) / 2;
    this.svg.divSize = (this.svg.height * (100 - this.config.position.divider) / 100) / 2;

    this.svg.rightXpos = this.svg.x + this.svg.leftWidth;
    this.svg.rightYpos = this.svg.y;
    this.svg.rightWidth = ((100 - this.config.position.ratio) / 100) * this.svg.width;

    this.classes.left = {};
    this.classes.right = {};
    this.styles.left = {};
    this.styles.right = {};
    if (this.dev.debug) console.log('BadgeTool constructor coords, dimensions', this.svg, this.config);
  }

 /*******************************************************************************
  * BadgeTool::_renderBadge()
  *
  * Summary.
  * Renders the badge using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the badge
  *
  * Refs for creating the path online:
  * - https://mavo.io/demos/svgpath/
  *
  */

  _renderBadge() {

    var svgItems = [];

    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();

    svgItems = svg`
      <g  id="badge-${this.toolId}">
        <path class="${classMap(this.classes.right)}" d="
            M ${this.svg.rightXpos} ${this.svg.rightYpos}
            h ${this.svg.rightWidth - this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 ${this.svg.radius} ${this.svg.radius}
            v ${this.svg.height - 2 * this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 -${this.svg.radius} ${this.svg.radius}
            h -${this.svg.rightWidth - this.svg.radius}
            v -${this.svg.height - 2 * this.svg.radius}
            z
            "
            style="${styleMap(this.styles.right)}"/>

        <path class="${classMap(this.classes.left)}" d="
            M ${this.svg.leftXpos + this.svg.radius} ${this.svg.leftYpos}
            h ${this.svg.leftWidth - this.svg.radius}
            v ${this.svg.divSize}
            l ${this.svg.arrowSize} ${this.svg.arrowSize}
            l -${this.svg.arrowSize} ${this.svg.arrowSize}
            l 0 ${this.svg.divSize}
            h -${this.svg.leftWidth - this.svg.radius}
            a -${this.svg.radius} -${this.svg.radius} 0 0 1 -${this.svg.radius} -${this.svg.radius}
            v -${this.svg.height - 2 * this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 ${this.svg.radius} -${this.svg.radius}
            "
            style="${styleMap(this.styles.left)}"/>
      </g>
      `;

    return svg`${svgItems}`;
  }

 /*******************************************************************************
  * BadgeTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {

    return svg`
      <g id="badge-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${e => this.handleTapEvent(e, this.config)}>
        ${this._renderBadge()}
      </g>
    `;

  }
} // END of class

 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /******************************************************************************
  * EntityStateTool class
  *
  * Summary.
  *
  */

class EntityStateTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_STATE_CONFIG = {
      show: { uom: 'end' },
      classes: {
        tool: {
          "sak-state": true,
          "hover": true,
        },
        state: {
          "sak-state__value": true,
        },
        uom: {
          "sak-state__uom": true,
        }
      },
      styles: {
        state: {
        },
        uom: {
        }
      }
    }
    super(argToolset, Merge.mergeDeep(DEFAULT_STATE_CONFIG, argConfig), argPos);

    this.classes.state = {};
    this.classes.uom = {};

    this.styles.state = {};
    this.styles.uom = {};
    if (this.dev.debug) console.log('EntityStateTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  // EntityStateTool::value
  set value(state) {

    var changed = super.value = state;

    return changed;
  }

  _renderState() {

    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.state);

    var inState = this._stateValue;
    if ((inState) && isNaN(inState)) {
      const localeTag = this.config.locale_tag || 'component.' + this._card._computeDomain(this._card.config.entities[this.config.entity_index].entity) + '.state._.'
      inState = this._card.toLocale(localeTag + inState.toLowerCase(), inState);
    }
    
    return svg`
      <tspan class="${classMap(this.classes.state)}" x="${this.svg.x}" y="${this.svg.y}"
        style="${styleMap(this.styles.state)}">
        ${this.config?.text?.before ? this.config.text.before : ''}${inState}${this.config?.text?.after ? this.config.text.after : ''}</tspan>
    `;
  }
  
  _renderUom() {

    if (this.config.show.uom === 'none') {
      return svg``;
    } else {
      this.MergeAnimationStyleIfChanged();
      this.MergeColorFromState(this.styles.uom);
      
      var fsuomStr = this.styles.state["font-size"];

      var fsuomValue = 0.5;
      var fsuomType = 'em';
      const fsuomSplit = fsuomStr.match(/\D+|\d*\.?\d+/g);
      if (fsuomSplit.length == 2) {
        fsuomValue = Number(fsuomSplit[0]) * .6;
        fsuomType = fsuomSplit[1];
      }
      else console.error('Cannot determine font-size for state/unit', fsuomStr);

      fsuomStr = { "font-size": fsuomValue + fsuomType};

      this.styles.uom = Merge.mergeDeep(this.config.styles.uom, fsuomStr);

      const uom = this._card._buildUom(this.derivedEntity, this._card.entities[this.config.entity_index], this._card.config.entities[this.config.entity_index]);

      // Check for location of uom. end = next to state, bottom = below state ;-), etc.
      if (this.config.show.uom === 'end') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else if (this.config.show.uom === 'bottom') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.x}" dy="1.5em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else if (this.config.show.uom === 'top') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.x}" dy="-1.5em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;

      } else {
        return svg``;
      }
    }
  }

  firstUpdated(changedProperties) {
  }

 
  updated(changedProperties) {
  }
  
  render() {

    if (true || (this._card._computeDomain(this._card.entities[this.config.entity_index].entity_id) == 'sensor')) {
      return svg`
    <svg overflow="visible" id="state-${this.toolId}" class="${classMap(this.classes.tool)}">
        <text @click=${e => this.handleTapEvent(e, this.config)}>
          ${this._renderState()}
          ${this._renderUom()}
        </text>
      </svg>
      `;
    } else {
      // Not a sensor. Might be any other domain. Unit can only be specified using the units: in the configuration.
      // Still check for using an attribute value for the domain...
      return svg`
        <text 
        @click=${e => this.handleTapEvent(e, this.config)}>
          <tspan class="state__value" x="${this.svg.x}" y="${this.svg.y}" dx="${dx}em" dy="${dy}em"
            style="${configStyleStr}">
            ${state}</tspan>
          <tspan class="state__uom" dx="-0.1em" dy="-0.45em"
            style="${uomStyleStr}">
            ${uom}</tspan>
        </text>
      `;
    }
  } // render()
}

 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /******************************************************************************
  * EntityNameTool class
  *
  * Summary.
  *
  */

class EntityNameTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_NAME_CONFIG = {
      classes: {
        tool: {
          "sak-name": true,
          "hover": true,
        },
        name: {
          "sak-name__name": true,
        }
      },
      styles: {
        tool: {
        },
        name: {
        }
      }
    }

    super(argToolset, Merge.mergeDeep(DEFAULT_NAME_CONFIG, argConfig), argPos);
    
    this._name = {};
    // Init classes
    this.classes.tool = {};
    this.classes.name = {};

    // Init styles
    this.styles.name = {};
    if (this.dev.debug) console.log('EntityName constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

/*******************************************************************************
  * EntityNameTool::_buildName()
  *
  * Summary.
  * Builds the Name string.
  *
  */

  _buildName(entityState, entityConfig) {
    return (
         this.activeAnimation?.name             // Name from animation
      || entityConfig.name
      || entityState.attributes.friendly_name
    );
  }


 /*******************************************************************************
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

    const name = this._buildName(this._card.entities[this.config.entity_index],
                                 this._card.config.entities[this.config.entity_index]);

    return svg`
        <text>
          <tspan class="${classMap(this.classes.name)}" x="${this.svg.cx}" y="${this.svg.cy}" style="${styleMap(this.styles.name)}">${name}</tspan>
        </text>
      `;
  }

 /*******************************************************************************
  * EntityNameTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {

    return svg`
      <g id="name-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${e => this.handleTapEvent(e, this.config)}>
        ${this._renderEntityName()}
      </g>
    `;

  }
} // END of class


 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /******************************************************************************
  * EntityAreaTool class
  *
  * Summary.
  *
  */

class EntityAreaTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_AREA_CONFIG = {
      classes: {
        tool: {
        },
        area: {
          "sak-area__area": true,
          "hover": true,
        }
      },
      styles: {
        tool: {
        },
        area: {
        }
      }
    }

    super(argToolset, Merge.mergeDeep(DEFAULT_AREA_CONFIG, argConfig), argPos);

    // Text is rendered in its own context. No need for SVG coordinates.
    this.classes.area = {};
    this.styles.area = {};
    if (this.dev.debug) console.log('EntityAreaTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

/*******************************************************************************
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

 /*******************************************************************************
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

    const area = this._buildArea(this._card.entities[this.config.entity_index],
                                 this._card.config.entities[this.config.entity_index]);

    return svg`
        <text>
          <tspan class="${classMap(this.classes.area)}"
          x="${this.svg.cx}" y="${this.svg.cy}" style="${styleMap(this.styles.area)}">${area}</tspan>
        </text>
      `;
  }

 /*******************************************************************************
  * EntityAreaTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {

    return svg`
      <g id="area-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${e => this.handleTapEvent(e, this.config)}>
        ${this._renderEntityArea()}
      </g>
    `;

  }
} // END of class

 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /******************************************************************************
  * TextTool class
  *
  * Summary.
  *
  */

class TextTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_TEXT_CONFIG = {
      classes: {
        tool: {
          "sak-text": true,
        },
        text: {
          "sak-text__text": true,
          "hover": false,
        }
      },
      styles: {
        tool: {
        },
        text: {
        }
      }
    }

    super(argToolset, Merge.mergeDeep(DEFAULT_TEXT_CONFIG, argConfig), argPos);

    this.EnableHoverForInteraction();
    this.text = this.config.text;
    this.styles.text = {};
    if (this.dev.debug) console.log('TextTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

 /*******************************************************************************
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

 /*******************************************************************************
  * TextTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
      return svg`
        <g id="text-${this.toolId}" class="${classMap(this.classes.tool)}"
          @click=${e => this.handleTapEvent(e, this.config)}>
          ${this._renderText()}
        </g>
      `;

  }
} // END of class


 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /******************************************************************************
  * HorseshoeTool class
  *
  * Summary.
  *
  */

class HorseshoeTool extends BaseTool {
    // Donut starts at -220 degrees and is 260 degrees in size.
    // zero degrees is at 3 o'clock.


  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_HORSESHOE_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        radius: 45,
      },
      card_filter: 'card--filter-none',
      horseshoe_scale: {  min: 0,
                  max: 100,
                  width: 3,
                  color: 'var(--primary-background-color)'},
      horseshoe_state: {  width: 6,
                  color: 'var(--primary-color)'},
      show: {horseshoe: true,
             scale_tickmarks: false,
             horseshoe_style: 'fixed'}
    };


    super(argToolset, Merge.mergeDeep(DEFAULT_HORSESHOE_CONFIG, argConfig), argPos);

    // Next consts are now variable. Should be calculated!!!!!!
    this.HORSESHOE_RADIUS_SIZE = 0.45 * SVG_VIEW_BOX;
    this.TICKMARKS_RADIUS_SIZE = 0.43 * SVG_VIEW_BOX;
    this.HORSESHOE_PATH_LENGTH = 2 * 260/360 * Math.PI * this.HORSESHOE_RADIUS_SIZE;

    // this.config = {...DEFAULT_HORSESHOE_CONFIG};
    // this.config = {...this.config, ...argConfig};

    // if (argConfig.styles) this.config.styles = {...argConfig.styles};
    // this.config.styles = {...DEFAULT_HORSESHOE_CONFIG.styles, ...this.config.styles};

    // //if (argConfig.show) this.config.show = Object.assign(...argConfig.show);
    // this.config.show = {...DEFAULT_HORSESHOE_CONFIG.show, ...this.config.show};

    // //if (argConfig.horseshoe_scale) this.config.horseshoe_scale = Object.assign(...argConfig.horseshoe_scale);
    // this.config.horseshoe_scale = {...DEFAULT_HORSESHOE_CONFIG.horseshoe_scale, ...this.config.horseshoe_scale};

    // // if (argConfig.horseshoe_state) this.config.horseshoe_state = Object.assign(...argConfig.horseshoe_state);
    // this.config.horseshoe_state = {...DEFAULT_HORSESHOE_CONFIG.horseshoe_state, ...this.config.horseshoe_state};

    this.config.entity_index = this.config.entity_index ? this.config.entity_index : 0;

    this.svg.radius = Utils.calculateSvgDimension(this.config.position.radius);
    this.svg.radius_ticks = Utils.calculateSvgDimension(0.95 * this.config.position.radius);

    this.svg.horseshoe_scale = {};
    this.svg.horseshoe_scale.width = Utils.calculateSvgDimension(this.config.horseshoe_scale.width);
    this.svg.horseshoe_state = {};
    this.svg.horseshoe_state.width = Utils.calculateSvgDimension(this.config.horseshoe_state.width);
    this.svg.horseshoe_scale.dasharray = 2 * 26/36 * Math.PI * this.svg.radius;

    // The horseshoe is rotated around its svg base point. This is NOT the center of the circle!
    // Adjust x and y positions within the svg viewport to re-center the circle after rotating
    this.svg.rotate = {};
    this.svg.rotate.degrees = -220;
    this.svg.rotate.shiftX = this.svg.cx;
    this.svg.rotate.shiftY = this.svg.cy;

    // Get colorstops and make a key/value store...
    this.colorStops = {};
    if (this.config.color_stops) {
      Object.keys(this.config.color_stops).forEach((key) => {
        this.colorStops[key] = this.config.color_stops[key];
      });
    }

    this.sortedStops = Object.keys(this.colorStops).map(n => Number(n)).sort((a, b) => a - b);

    // Create a colorStopsMinMax list for autominmax color determination
    this.colorStopsMinMax = {};
    this.colorStopsMinMax[this.config.horseshoe_scale.min] = this.colorStops[this.sortedStops[0]];
    this.colorStopsMinMax[this.config.horseshoe_scale.max] = this.colorStops[this.sortedStops[(this.sortedStops.length)-1]];

    // Now set the color0 and color1 for the gradient used in the horseshoe to the colors
    // Use default for now!!
    this.color0 = this.colorStops[this.sortedStops[0]];
    this.color1 = this.colorStops[this.sortedStops[(this.sortedStops.length)-1]];

    this.angleCoords = {'x1' : '0%', 'y1' : '0%', 'x2': '100%', 'y2' : '0%'};
    //this.angleCoords = angleCoords;
    this.color1_offset = '0%';

    //====================
    // End setConfig part.

    if (this.dev.debug) console.log('HorseshoeTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

 /*******************************************************************************
  * HorseshoeTool::value()
  *
  * Summary.
  * Sets the value of the horseshoe. Value updated via set hass.
  * Calculate horseshoe settings & colors depening on config and new value.
  *
  */

  set value(state) {
    if (this._stateValue == state) return false;

    this._stateValuePrev = this._stateValue || state;
    this._stateValue = state;
    this._stateValueIsDirty = true;

    // Calculate the size of the arc to fill the dasharray with this
    // value. It will fill the horseshoe relative to the state and min/max
    // values given in the configuration.

    const min = this.config.horseshoe_scale.min || 0;
    const max = this.config.horseshoe_scale.max || 100;
    const val = Math.min(this._card._calculateValueBetween(min, max, state), 1);
    const score = val * this.HORSESHOE_PATH_LENGTH;
    const total = 10 * this.HORSESHOE_RADIUS_SIZE;
    this.dashArray = `${score} ${total}`;

    // We must draw the horseshoe. Depending on the stroke settings, we draw a fixed color, gradient, autominmax or colorstop
    // #TODO: only if state or attribute has changed.

    const strokeStyle = this.config.show.horseshoe_style;

    if (strokeStyle == 'fixed') {
      this.stroke_color = this.config.horseshoe_state.color;
      this.color0 = this.config.horseshoe_state.color;
      this.color1 = this.config.horseshoe_state.color;
      this.color1_offset = '0%';
      //  We could set the circle attributes, but we do it with a variable as we are using a gradient
      //  to display the horseshoe circle .. <horseshoe circle>.setAttribute('stroke', stroke);
    }
    else if (strokeStyle == 'autominmax') {
      // Use color0 and color1 for autoranging the color of the horseshoe
      const stroke = this._card._calculateColor(state, this.colorStopsMinMax, true);

      // We now use a gradient for the horseshoe, using two colors
      // Set these colors to the colorstop color...
      this.color0 = stroke;
      this.color1 = stroke;
      this.color1_offset = '0%';
    }
    else if (strokeStyle == 'colorstop' || strokeStyle == 'colorstopgradient') {
      const stroke = this._card._calculateColor(state, this.colorStops, strokeStyle === 'colorstopgradient');

      // We now use a gradient for the horseshoe, using two colors
      // Set these colors to the colorstop color...
      this.color0 = stroke;
      this.color1 = stroke;
      this.color1_offset = '0%';
    }
    else if (strokeStyle == 'lineargradient') {
      // This has taken a lot of time to get a satisfying result, and it appeared much simpler than anticipated.
      // I don't understand it, but for a circle, a gradient from left/right with adjusted stop is enough ?!?!?!
      // No calculations to adjust the angle of the gradient, or rotating the gradient itself.
      // Weird, but it works. Not a 100% match, but it is good enough for now...

      // According to stackoverflow, these calculations / adjustments would be needed, but it isn't ;-)
      // Added from https://stackoverflow.com/questions/9025678/how-to-get-a-rotated-linear-gradient-svg-for-use-as-a-background-image
      const angleCoords = {'x1' : '0%', 'y1' : '0%', 'x2': '100%', 'y2' : '0%'};
      this.color1_offset = `${Math.round((1-val)*100)}%`;

      this.angleCoords = angleCoords;
    }
    if (this.dev.debug) console.log('HorseshoeTool set value', this.cardId, state);

    return true;
  }

 /*******************************************************************************
  * HorseshoeTool::_renderTickMarks()
  *
  * Summary.
  * Renders the tick marks on the scale.
  *
  */

  _renderTickMarks() {
    const { config, } = this;
    //if (!config) return;
    //if (!config.show) return;
    if (!config.show.scale_tickmarks) return;

    const stroke = config.horseshoe_scale.color ? config.horseshoe_scale.color : 'var(--primary-background-color)';
    const tickSize = config.horseshoe_scale.ticksize ? config.horseshoe_scale.ticksize
                    : (config.horseshoe_scale.max - config.horseshoe_scale.min) / 10;

    // fullScale is 260 degrees. Hard coded for now...
    const fullScale = 260;
    const remainder = config.horseshoe_scale.min % tickSize;
    const startTickValue = config.horseshoe_scale.min + (remainder == 0 ? 0 : (tickSize - remainder));
    const startAngle = ((startTickValue - config.horseshoe_scale.min) /
                        (config.horseshoe_scale.max - config.horseshoe_scale.min)) * fullScale;
    var tickSteps = ((config.horseshoe_scale.max - startTickValue) / tickSize);

    // new
    var steps = Math.floor(tickSteps);
    const angleStepSize = (fullScale - startAngle) / tickSteps;

    // If steps exactly match the max. value/range, add extra step for that max value.
    if ((Math.floor(((steps) * tickSize) + startTickValue)) <= (config.horseshoe_scale.max)) {steps++;}

    const radius = this.svg.horseshoe_scale.width ? this.svg.horseshoe_scale.width / 2 : 6/2;
    var angle;
    var scaleItems = [];

    // NTS:
    // Value of -230 is weird. Should be -220. Can't find why...
    var i;
    for (i = 0; i < steps; i++) {
      angle = startAngle + ((-230 + (360 - i*angleStepSize)) * Math.PI / 180);
      scaleItems[i] = svg`
        <circle cx="${this.svg.cx - Math.sin(angle)*this.svg.radius_ticks}"
                cy="${this.svg.cy - Math.cos(angle)*this.svg.radius_ticks}" r="${radius}"
                fill="${stroke}">
      `;
    }
    return svg`${scaleItems}`;
  }

 /*******************************************************************************
  * HorseshoeTool::_renderHorseShoe()
  *
  * Summary.
  * Renders the horseshoe group.
  *
  * Description.
  * The horseshoes are rendered in a viewbox of 200x200 (SVG_VIEW_BOX).
  * Both are centered with a radius of 45%, ie 200*0.45 = 90.
  *
  * The foreground horseshoe is always rendered as a gradient with two colors.
  *
  * The horseshoes are rotated 220 degrees and are 2 * 26/36 * Math.PI * r in size
  * There you get your value of 408.4070449,180 ;-)
  */

  _renderHorseShoe() {

  if (!this.config.show.horseshoe) return;

  return svg`
      <g id="horseshoe__group-inner" class="horseshoe__group-inner">
        <circle id="horseshoe__scale" class="horseshoe__scale" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          fill="${this.fill || 'rgba(0, 0, 0, 0)'}"
          stroke="${this.config.horseshoe_scale.color || '#000000'}"
          stroke-dasharray="${this.svg.horseshoe_scale.dasharray}"
          stroke-width="${this.svg.horseshoe_scale.width}"
          stroke-linecap="square"
          transform="rotate(-220 ${this.svg.rotate.shiftX} ${this.svg.rotate.shiftY})"/>

        <circle id="horseshoe__state__value" class="horseshoe__state__value" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          fill="${this.config.fill || 'rgba(0, 0, 0, 0)'}"
          stroke="url('#horseshoe__gradient-${this.cardId}')"
          stroke-dasharray="${this.dashArray}"
          stroke-width="${this.svg.horseshoe_state.width}"
          stroke-linecap="square"
          transform="rotate(-220 ${this.svg.rotate.shiftX} ${this.svg.rotate.shiftY})"/>

        ${this._renderTickMarks()}
      </g>
    `;
  }
 /*******************************************************************************
  * HorseshoeTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {

    return svg`
      <g "" id="horseshoe-${this.toolId}" class="horseshoe__group-outer"
        @click=${e => this.handleTapEvent(e, this.config)}>
        ${this._renderHorseShoe()}
      </g>

      <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
        <linearGradient gradientTransform="rotate(0)" id="horseshoe__gradient-${this.cardId}" x1="${this.angleCoords.x1}", y1="${this.angleCoords.y1}", x2="${this.angleCoords.x2}" y2="${this.angleCoords.y2}">
          <stop offset="${this.color1_offset}" stop-color="${this.color1}" />
          <stop offset="100%" stop-color="${this.color0}" />
        </linearGradient>
      </svg>

    `;

  }
} // END of class

 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

class SparklineBarChartTool extends BaseTool {
  constructor (argToolset, argConfig, argPos) {

    const DEFAULT_BARCHART_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        height: 25,
        width: 25,
        margin: 0.5,
        orientation: 'vertical',
      },
      hours: 24,
      barhours: 1,
      color: 'var(--primary-color)',
      classes: {
        tool: {
          "sak-barchart": true,
          "hover": true,
        },
        bar: {
        },
        line: {
          "sak-barchart__line": true,
          "hover": true,
        }
      },
      styles: {
        tool: {
        },
        line: {
        },
        bar: {
        }
      },
      colorstops: [],
      show: {style: 'fixedcolor'}
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_BARCHART_CONFIG, argConfig), argPos);
    
    this.svg.margin = Utils.calculateSvgDimension(this.config.position.margin);
    const theWidth = (this.config.position.orientation == 'vertical') ?  this.svg.width : this.svg.height;

    this.svg.barWidth = (theWidth - (((this.config.hours / this.config.barhours) - 1) *
                                this.svg.margin)) / (this.config.hours / this.config.barhours);
    this._data = [];
    this._bars = [];
    this._scale = {};
    this._needsRendering = false;

    this.classes.bar = {};
    
    this.styles.tool = {};
    this.styles.line = {};
    this.stylesBar = {};
    
    if (this.dev.debug) console.log('SparkleBarChart constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

 /*******************************************************************************
  * SparklineBarChartTool::computeMinMax()
  *
  * Summary.
  * Compute min/max values of bars to scale them to the maximum amount.
  *
  */
  computeMinMax() {
    let min = this._series[0], max = this._series[0];

    for (let i = 1, len=this._series.length; i < len; i++) {
      let v = this._series[i];
      min = (v < min) ? v : min;
      max = (v > max) ? v : max;
    }
    this._scale.min = min;
    this._scale.max = max;
    this._scale.size = (max - min);

    // 2020.11.05
    // Add 5% to the size of the scale and adjust the minimum value displayed.
    // So every bar is displayed, instead of the min value having a bar length of zero!
    this._scale.size = (max - min) * 1.05;
    this._scale.min = max - this._scale.size;

  }

 /*******************************************************************************
  * SparklineBarChartTool::set series
  *
  * Summary.
  * Sets the timeseries for the barchart tool. Is an array of states.
  * If this is historical data, the caller has taken the time to create this.
  * This tool only displays the result...
  *
  */
  set data(states) {
    this._series = Object.assign(states);
    this.computeBars();
    this._needsRendering = true;
  }

  set series(states) {
    this._series = Object.assign(states);
    this.computeBars();
    this._needsRendering = true;
  }

  hasSeries() {
    return this.config.entity_index;
  }

 /*******************************************************************************
  * SparklineBarChartTool::computeBars()
  *
  * Summary.
  * Compute start and end of bars for easy rendering.
  *
  */
  computeBars({ _bars } = this) {

    this.computeMinMax();

    if (this.config.show.style === 'minmaxgradient') {
      this.colorStopsMinMax = {};
      this.colorStopsMinMax = {[this._scale.min.toString()]: this.config.minmaxgradient.colors.min,
                               [this._scale.max.toString()]: this.config.minmaxgradient.colors.max};
    }

    // VERTICAL
    if (this.config.position.orientation == 'vertical') {
      if (this.dev.debug) console.log('bar is vertical');
      this._series.forEach((item, index) => {
        if (!_bars[index]) _bars[index] = {};
        _bars[index].length = (this._scale.size == 0) ? 0 : ((item - this._scale.min) / (this._scale.size)) * this.svg.height;
        _bars[index].x1 = this.svg.x + this.svg.barWidth/2 + ((this.svg.barWidth + this.svg.margin) * index);
        _bars[index].x2 = _bars[index].x1;
        _bars[index].y1 = this.svg.y + this.svg.height;
        _bars[index].y2 = _bars[index].y1 - this._bars[index].length;
        _bars[index].dataLength = this._bars[index].length;
      });
      // HORIZONTAL
    } else if (this.config.position.orientation == 'horizontal') {
      if (this.dev.debug) console.log('bar is horizontal');
      this._data.forEach((item, index) => {
        if (!_bars[index]) _bars[index] = {};
        // if (!item || isNaN(item)) item = this._scale.min;
        _bars[index].length = (this._scale.size == 0) ? 0 : ((item - this._scale.min) / (this._scale.size)) * this.svg.width;
        _bars[index].y1 = this.svg.y + this.svg.barWidth/2 + ((this.svg.barWidth + this.svg.margin) * index);
        _bars[index].y2 = _bars[index].y1;
        _bars[index].x1 = this.svg.x;
        _bars[index].x2 = _bars[index].x1 + this._bars[index].length;
        _bars[index].dataLength = this._bars[index].length;
      });
    } else {
      if (this.dev.debug) console.log("SparklineBarChartTool - unknown barchart orientation (horizontal or vertical)");
    }
  }

 /*******************************************************************************
  * SparklineBarChartTool::_renderBars()
  *
  * Summary.
  * Render all the bars. Number of bars depend on hours and barhours settings.
  *
  */
  _renderBars({ _bars } = this) {

    var svgItems = [];

    if (this._bars.length == 0) return;

    if (this.dev.debug) console.log('_renderBars IN', this.toolId);
    
    this._bars.forEach((item, index) => {
      if (this.dev.debug) console.log('_renderBars - bars', item, index);

      const stroke = this.getColorFromState(this._series[index]);

      if (!this.stylesBar[index])
        this.stylesBar[index] = {...this.config.styles.bar};

      // NOTE @ 2021.10.27
      // Lijkt dat this.classes niet gevuld wordt. geen merge enzo. is dat een bug?
      // Nu tijdelijk opgelost door this.config te gebruiken, maar hoort niet natuurlijk als je kijkt
      // naar de andere tools...
      
      // Safeguard...
      if (!(this._bars[index].y2)) console.log('sparklebarchart y2 invalid', this._bars[index]);
      svgItems.push(svg`
        <line id="line-segment-${this.toolId}-${index}" class="${classMap(this.config.classes.line)}"
                  style="${styleMap(this.stylesBar[index])}"
                  x1="${this._bars[index].x1}"
                  x2="${this._bars[index].x2}"
                  y1="${this._bars[index].y1}"
                  y2="${this._bars[index].y2}"
                  data-length="${this._bars[index].dataLength}"
                  stroke="${stroke}"
                  stroke-width="${this.svg.barWidth}"
                  />
        `);
    });
    if (this.dev.debug) console.log('_renderBars OUT', this.toolId);

    return svg`${svgItems}`;
  }

 /*******************************************************************************
  * SparklineBarChartTool::render()
  *
  * Summary.
  * The actual render() function called by the card for each tool.
  *
  */
  render() {

    return svg`
      <g id="barchart-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${e => this.handleTapEvent(e, this.config)}>
        ${this._renderBars()}
      </g>
    `;

  }
}

 /**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

 /*******************************************************************************
  * SegmentedArcTool class
  *
  * Summary.
  *
  */

class SegmentedArcTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_SEGARC_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        radius: 45,
        width: 3,
        margin: 1.5,
      },
      color: 'var(--primary-color)',
      classes: { 
        tool: {
        },
        foreground: {
        },
        background: {
        },
      },
      styles: { 
        foreground: {
        },
        background: {
        },
      },
      segments: {},
      colorstops: [],
      scale: {
        "min": 0,
        "max": 100,
        "width": 2,
        "offset": -3.5
      },
      show: {
        "style": 'fixedcolor',
        "scale": false,
      },
      isScale: false,
      animation: {
        "duration": 1.5,
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_SEGARC_CONFIG, argConfig), argPos);

    if (this.dev.performance) console.time("--> "+ this.toolId + " PERFORMANCE SegmentedArcTool::constructor");

    this.svg.radius = Utils.calculateSvgDimension(argConfig.position.radius);
    this.svg.radiusX = Utils.calculateSvgDimension(argConfig.position.radius_x || argConfig.position.radius);
    this.svg.radiusY = Utils.calculateSvgDimension(argConfig.position.radius_y || argConfig.position.radius);

    this.svg.segments = {};
    // #TODO:
    // Get gap from colorlist, colorstop or something else. Not from the default segments gap.
    this.svg.segments.gap = Utils.calculateSvgDimension(this.config.segments.gap);
    this.svg.scale_offset = Utils.calculateSvgDimension(this.config.scale.offset);


    // Added for confusion???????
    this._firstUpdatedCalled = false;

    // Remember the values to be able to render from/to
    this._stateValue = null;
    this._stateValuePrev = null;
    this._stateValueIsDirty = false;
    this._renderFrom = null;
    this._renderTo = null;

    this.rAFid = null;
    this.cancelAnimation = false;

    this.arcId = null;

    // Cache path (d= value) of segments drawn in map by segment index (counter). Simple array.
    this._cache = [];

    this._segmentAngles = [];
    this._segments = {};

    // Precalculate segments with start and end angle!
    this._arc = {};
    this._arc.size = Math.abs(this.config.position.end_angle - this.config.position.start_angle);
    this._arc.clockwise = this.config.position.end_angle > this.config.position.start_angle;
    this._arc.direction = this._arc.clockwise ? 1 : -1;

    var tcolorlist = {};
    var colorlist = null;
    // New template testing for colorstops
    if (this.config.segments.colorlist?.template) {
        colorlist = this.config.segments.colorlist;
        if (this._card.lovelace.config.sak_user_templates.templates[colorlist.template.name]) {
          if (this.dev.debug) console.log('SegmentedArcTool::constructor - templates colorlist found', colorlist.template.name);
          tcolorlist = Templates.replaceVariables2(colorlist.template.variables, this._card.lovelace.config.sak_user_templates.templates[colorlist.template.name]);
          this.config.segments.colorlist = tcolorlist;
        }
    }

    // FIXEDCOLOR
    if (this.config.show.style == 'fixedcolor') {
    }
    // COLORLIST
    else if (this.config.show.style == 'colorlist') {
      // Get number of segments, and their size in degrees.
      this._segments.count = this.config.segments.colorlist.colors.length;
      this._segments.size = this._arc.size / this._segments.count;
      this._segments.gap = (this.config.segments.colorlist.gap != 'undefined') ? this.config.segments.colorlist.gap : 1;
      this._segments.sizeList = [];
      for (var i = 0; i < this._segments.count; i++) {
        this._segments.sizeList[i] = this._segments.size;
      }

      // Use a running total for the size of the segments...
      var segmentRunningSize = 0;
      for (var i = 0; i < this._segments.count; i++) {
        this._segmentAngles[i] = {"boundsStart": this.config.position.start_angle + (segmentRunningSize * this._arc.direction),
                                  "boundsEnd": this.config.position.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction),
                                  "drawStart": this.config.position.start_angle + (segmentRunningSize * this._arc.direction) + (this._segments.gap * this._arc.direction),
                                  "drawEnd": this.config.position.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction) - (this._segments.gap * this._arc.direction)};
        segmentRunningSize += this._segments.sizeList[i];
      }

      if (this.dev.debug) console.log('colorstuff - COLORLIST', this._segments, this._segmentAngles);

    }
    // COLORSTOPS
    else if (this.config.show.style == 'colorstops') {
      // Get colorstops, remove outliers and make a key/value store...

      this._segments.colorStops = {};
      Object.keys(this.config.segments.colorstops.colors).forEach((key) => {
          if ((key >= this.config.scale.min) &&
              (key <= this.config.scale.max))
            this._segments.colorStops[key] = this.config.segments.colorstops.colors[key];

        });

      this._segments.sortedStops = Object.keys(this._segments.colorStops).map(n => Number(n)).sort((a, b) => a - b);

      // Insert extra stopcolor for max scale if not defined. Otherwise color calculations won't work as expected...
      if (typeof(this._segments.colorStops[this.config.scale.max]) == 'undefined') {
        this._segments.colorStops[this.config.scale.max] = this._segments.colorStops[this._segments.sortedStops[this._segments.sortedStops.length - 1]];
        this._segments.sortedStops = Object.keys(this._segments.colorStops).map(n => Number(n)).sort((a, b) => a - b);
      }

      this._segments.count = this._segments.sortedStops.length - 1;
      this._segments.gap = this.config.segments.colorstops.gap != 'undefined' ? this.config.segments.colorstops.gap : 1;

      // Now depending on the colorstops and min/max values, calculate the size of each segment relative to the total arc size.
      // First color in the list starts from Min!

      var runningColorStop = this.config.scale.min;
      var scaleRange = this.config.scale.max - this.config.scale.min;
      this._segments.sizeList = [];
      for (var i = 0; i < this._segments.count; i++) {
        var colorSize = this._segments.sortedStops[i + 1] - runningColorStop;
        runningColorStop += colorSize;
        // Calculate fraction [0..1] of colorSize of min/max scale range
        const fraction = colorSize / scaleRange;
        const angleSize = fraction * this._arc.size;
        this._segments.sizeList[i] = angleSize;
      }

      // Use a running total for the size of the segments...
      var segmentRunningSize = 0;
      for (var i = 0; i < this._segments.count; i++) {
        this._segmentAngles[i] = {"boundsStart": this.config.position.start_angle + (segmentRunningSize * this._arc.direction),
                                  "boundsEnd": this.config.position.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction),
                                  "drawStart": this.config.position.start_angle + (segmentRunningSize * this._arc.direction) + (this._segments.gap * this._arc.direction),
                                  "drawEnd": this.config.position.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction) - (this._segments.gap * this._arc.direction)};
        segmentRunningSize += this._segments.sizeList[i];
        if (this.dev.debug) console.log('colorstuff - COLORSTOPS++ segments', segmentRunningSize, this._segmentAngles[i]);
      }

      if (this.dev.debug) console.log('colorstuff - COLORSTOPS++', this._segments, this._segmentAngles, this._arc.direction, this._segments.count);
    }
    // SIMPLEGRADIENT
    else if (this.config.show.style == 'simplegradient') {
    }

    // Just dump to console for verification. Nothing is used yet of the new calculation method...

    if (this.config.isScale) {
      this._stateValue = this.config.scale.max;
      //this.config.show.scale = false;
    } else {

      // Nope. I'm the main arc. Check if a scale is defined and clone myself with some options...
      if (this.config.show.scale) {
        var scaleConfig = Merge.mergeDeep(this.config);
        scaleConfig.id = scaleConfig.id + '-scale';
        
        // Cloning done. Now set specific scale options.
        scaleConfig.show.scale = false;
        scaleConfig.isScale = true;
        scaleConfig.position.width = this.config.scale.width;
        scaleConfig.position.radius = this.config.position.radius - (this.config.position.width/2) + (scaleConfig.position.width/2) + (this.config.scale.offset);
        scaleConfig.position.radius_x = ((this.config.position.radius_x || this.config.position.radius)) - (this.config.position.width/2) + (scaleConfig.position.width/2) + (this.config.scale.offset);
        scaleConfig.position.radius_y = ((this.config.position.radius_y || this.config.position.radius)) - (this.config.position.width/2) + (scaleConfig.position.width/2) + (this.config.scale.offset);

        this._segmentedArcScale = new SegmentedArcTool(this, scaleConfig, argPos);
      } else {
        this._segmentedArcScale = null;
      }
    }


    // testing. use below two lines and sckip the calculation of the segmentAngles. Those are done above with different calculation...
    this.skipOriginal = ((this.config.show.style == 'colorstops') || (this.config.show.style == 'colorlist'));
    
    // Set scale to new value. Never changes of course!!
    if (this.skipOriginal) {
      if (this.config.isScale) this._stateValuePrev = this._stateValue;
      this._initialDraw = false;

    }

    this._arc.parts = Math.floor(this._arc.size / Math.abs(this.config.segments.dash));
    this._arc.partsPartialSize = this._arc.size - (this._arc.parts * this.config.segments.dash);

    if (this.skipOriginal) {
      this._arc.parts = this._segmentAngles.length;
      this._arc.partsPartialSize = 0;
    }
    else {
      for (var i=0; i< this._arc.parts; i++) {
        this._segmentAngles[i] = {"boundsStart": this.config.position.start_angle + (i * this.config.segments.dash * this._arc.direction),
                                  "boundsEnd": this.config.position.start_angle + ((i + 1) * this.config.segments.dash * this._arc.direction),
                                  "drawStart": this.config.position.start_angle + (i * this.config.segments.dash * this._arc.direction) + (this.config.segments.gap * this._arc.direction),
                                  "drawEnd": this.config.position.start_angle + ((i + 1) * this.config.segments.dash * this._arc.direction) - (this.config.segments.gap * this._arc.direction)};
      }
      if (this._arc.partsPartialSize > 0) {
        this._segmentAngles[i] = {"boundsStart": this.config.position.start_angle + (i * this.config.segments.dash * this._arc.direction),
                                  "boundsEnd": this.config.position.start_angle + ((i + 0) * this.config.segments.dash * this._arc.direction) +
                                          (this._arc.partsPartialSize * this._arc.direction),

                                  "drawStart": this.config.position.start_angle + (i * this.config.segments.dash * this._arc.direction) + (this.config.segments.gap * this._arc.direction),
                                  "drawEnd": this.config.position.start_angle + ((i + 0) * this.config.segments.dash * this._arc.direction) +
                                          (this._arc.partsPartialSize * this._arc.direction) - (this.config.segments.gap * this._arc.direction)};
      }
    }

    this.starttime = null;

    if (this.dev.debug) console.log('SegmentedArcTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
    if (this.dev.debug) console.log('SegmentedArcTool - init', this.toolId, this.config.isScale, this._segmentAngles);

    if (this.dev.performance) console.timeEnd("--> "+ this.toolId + " PERFORMANCE SegmentedArcTool::constructor");
  }

  // SegmentedArcTool::objectId
  get objectId() {
    return this.toolId;
  }

  // SegmentedArcTool::value
  set value(state) {
    if (this.dev.debug) console.log('SegmentedArcTool - set value IN');

    if (this.config.isScale) return false;

    if (this._stateValue == state) return false;

    var changed = super.value = state;

    return changed;
  }

  // SegmentedArcTool::firstUpdated
  // Me is updated. Get arc id for animations...
  firstUpdated(changedProperties)
  {
    if (this.dev.debug) console.log('SegmentedArcTool - firstUpdated IN with _arcId/id', this._arcId, this.toolId, this.config.isScale);
    this._arcId = this._card.shadowRoot.getElementById("arc-".concat(this.toolId));

    this._firstUpdatedCalled = true;

    // Just a try.
    //
    // was this a bug. The scale was never called with updated. Hence always no arcId...
    this._segmentedArcScale?.firstUpdated(changedProperties);

    if (this.skipOriginal) {
      if (this.dev.debug) console.log('RENDERNEW - firstUpdated IN with _arcId/id/isScale/scale/connected', this._arcId, this.toolId, this.config.isScale, this._segmentedArcScale, this._card.connected);
      if (!this.config.isScale) this._stateValuePrev = null;
      this._initialDraw = true;
      this._card.requestUpdate();
    }
  }

  // SegmentedArcTool::updated

  updated(changedProperties) {
    if (this.dev.debug) console.log('SegmentedArcTool - updated IN');
  }

  // SegmentedArcTool::render

  render() {

    if (this.dev.debug) console.log('SegmentedArcTool RENDERNEW - Render IN');
    return svg`
      <g "" id="arc-${this.toolId}" class="arc">
        <g >
          ${this._renderSegments()}
          </g>
        ${this._renderScale()}
      </g>
    `;
  }

  _renderScale() {
    if (this._segmentedArcScale) return this._segmentedArcScale.render();
  }

  _renderSegments() {

    // migrate to new solution to draw segmented arc...

    if (this.skipOriginal) {
      // Here we can rebuild all needed. Much will be the same I guess...

      var arcEnd;
      var arcEndPrev;
      var arcWidth = this.svg.width;
      var arcRadiusX = this.svg.radiusX;
      var arcRadiusY = this.svg.radiusY;

      var d;

      if (this.dev.debug) console.log('RENDERNEW - IN _arcId, firstUpdatedCalled', this._arcId, this._firstUpdatedCalled);
      // calculate real end angle depending on value set in object and min/max scale
      var val = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, this._stateValue);
      var valPrev = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, this._stateValuePrev);
      if (this.dev.debug) if (!this._stateValuePrev) console.log('*****UNDEFINED', this._stateValue, this._stateValuePrev, valPrev);
      if (val != valPrev) if (this.dev.debug) console.log('RENDERNEW _renderSegments diff value old new', this.toolId, valPrev, val);

          arcEnd = (val * this._arc.size * this._arc.direction) + this.config.position.start_angle;
          arcEndPrev = (valPrev * this._arc.size * this._arc.direction) + this.config.position.start_angle;

      var svgItems = [];

      // NO background needed for drawing scale...
      if (!this.config.isScale) {
        for (var k = 0; k < this._segmentAngles.length; k++) {
          d = this.buildArcPath(this._segmentAngles[k].drawStart, this._segmentAngles[k].drawEnd,
                                this._arc.clockwise, this.svg.radiusX, this.svg.radiusY, this.svg.width);

          svgItems.push(svg`<path id="arc-segment-bg-${this.toolId}-${k}" class="sak-segarc__background"
                              style="${styleMap(this.config.styles.background)}"
                              d="${d}"
                              />`);

        }
      }

      // Check if arcId does exist
      if (this._firstUpdatedCalled) {
//      if ((this._arcId)) {
        if (this.dev.debug) console.log('RENDERNEW _arcId DOES exist', this._arcId, this.toolId, this._firstUpdatedCalled);

        // Render current from cache
        this._cache.forEach((item, index) => {
          d = item;

          // extra, set color from colorlist as a test
          if (this.config.isScale) {
            var fill = this.config.color;
            if (this.config.show.style =="colorlist") {
              fill = this.config.segments.colorlist.colors[index];
            }
            if (this.config.show.style =="colorstops") {
              fill = this._segments.colorStops[this._segments.sortedStops[index]];
              // stroke = this.config.segments.colorstops.stroke ? this._segments.colorStops[this._segments.sortedStops[index]] : '';
            }

            if (!this.styles.foreground[index]) {
              this.styles.foreground[index] = Merge.mergeDeep(this.config.styles.foreground);
            }
            
            this.styles.foreground[index]['fill'] = fill;
            // this.styles.foreground[index]['stroke'] = stroke;
          }

          svgItems.push(svg`<path id="arc-segment-${this.toolId}-${index}" class="sak-segarc__foreground"
                            style="${styleMap(this.styles.foreground[index])}"
                            d="${d}"
                            />`);
        });

        var tween = {};

        function animateSegmentsNEW(timestamp, thisTool){

            const easeOut = progress =>
              Math.pow(--progress, 5) + 1;

            var frameSegment;
            var runningSegment;

            var timestamp = timestamp || new Date().getTime();
            if (!tween.startTime) {
              tween.startTime = timestamp;
              tween.runningAngle = tween.fromAngle;
            }

            if (thisTool.debug) console.log('RENDERNEW - in animateSegmentsNEW', thisTool.toolId, tween);

            var runtime = timestamp - tween.startTime;
            tween.progress = Math.min(runtime / tween.duration, 1);
            tween.progress = easeOut(tween.progress);

            const increase = ((thisTool._arc.clockwise)
                              ? (tween.toAngle > tween.fromAngle) : (tween.fromAngle > tween.toAngle));

            // Calculate where the animation angle should be now in this animation frame: angle and segment.
            tween.frameAngle = tween.fromAngle + ((tween.toAngle - tween.fromAngle) * tween.progress);
            frameSegment = thisTool._segmentAngles.findIndex((currentValue, index) =>
                thisTool._arc.clockwise
                ? ((tween.frameAngle <= currentValue.boundsEnd) && (tween.frameAngle >= currentValue.boundsStart))
                : ((tween.frameAngle <= currentValue.boundsStart) && (tween.frameAngle >= currentValue.boundsEnd)));

            if (frameSegment == -1) {
              /*if (thisTool.debug)*/ console.log('RENDERNEW animateSegments frameAngle not found', tween, thisTool._segmentAngles);
            }

            // Check where we actually are now. This might be in a different segment...
            runningSegment = thisTool._segmentAngles.findIndex((currentValue, index) =>
                thisTool._arc.clockwise
                ? ((tween.runningAngle <= currentValue.boundsEnd) && (tween.runningAngle >= currentValue.boundsStart))
                : ((tween.runningAngle <= currentValue.boundsStart) && (tween.runningAngle >= currentValue.boundsEnd)));

            // Weird stuff. runningSegment is sometimes -1. Ie not FOUND !! WTF??
            // if (runningSegment == -1) runningSegment = 0;

            // Do render segments until the animation angle is at the requested animation frame angle.
            do {

              var aniStartAngle = thisTool._segmentAngles[runningSegment].drawStart;
              var runningSegmentAngle = thisTool._arc.clockwise
                                        ? Math.min(thisTool._segmentAngles[runningSegment].boundsEnd, tween.frameAngle)
                                        : Math.max(thisTool._segmentAngles[runningSegment].boundsEnd, tween.frameAngle);
              var aniEndAngle = thisTool._arc.clockwise
                                  ? Math.min(thisTool._segmentAngles[runningSegment].drawEnd, tween.frameAngle)
                                  : Math.max(thisTool._segmentAngles[runningSegment].drawEnd, tween.frameAngle);
              // First phase. Just draw and ignore segments...
              d = thisTool.buildArcPath(aniStartAngle, aniEndAngle, thisTool._arc.clockwise, arcRadiusX, arcRadiusY, arcWidth);

              if (!thisTool.myarc) thisTool.myarc = {};
              if (!thisTool.as) thisTool.as = {};

              let as;
              const myarc = "arc-segment-".concat(thisTool.toolId).concat("-").concat(runningSegment);
              // as = thisTool._card.shadowRoot.getElementById(myarc);
              if (!thisTool.as[runningSegment])
                thisTool.as[runningSegment] = thisTool._card.shadowRoot.getElementById(myarc);
              as = thisTool.as[runningSegment];
              // Extra. Remember id's and references
              // Quick hack...
              thisTool.myarc[runningSegment] = myarc;
              // thisTool.as[runningSegment] = as;
              
              if (as) {
                // var e = as.getAttribute("d");
                as.setAttribute("d", d);

                // We also have to set the style fill if the color stops and gradients are implemented
                // As we're using styles, attributes won't work. Must use as.style.fill = 'calculated color'
                // #TODO
                // Can't use gradients probably because of custom path. Conic-gradient would be fine.
                //
                // First try...
                if (thisTool.config.show.style =="colorlist") {
                  as.style.fill = thisTool.config.segments.colorlist.colors[runningSegment];
                  thisTool.styles.foreground[runningSegment]['fill'] = thisTool.config.segments.colorlist.colors[runningSegment];
                }
                // #WIP
                // Testing 'lastcolor'
                if (thisTool.config.show.lastcolor) {
                  var fill;

                  var boundsStart = thisTool._arc.clockwise
                                ? (thisTool._segmentAngles[runningSegment].drawStart)
                                : (thisTool._segmentAngles[runningSegment].drawEnd);
                  var boundsEnd = thisTool._arc.clockwise
                                ? (thisTool._segmentAngles[runningSegment].drawEnd)
                                : (thisTool._segmentAngles[runningSegment].drawStart);
                  var value = Math.min(Math.max(0, (runningSegmentAngle - boundsStart) / (boundsEnd - boundsStart)), 1);
                  // 2022.07.03 Fixing lastcolor for true stop
                  if (thisTool.config.show.style == 'colorstops') {
                    fill = thisTool._card._getGradientValue(thisTool._segments.colorStops[thisTool._segments.sortedStops[runningSegment]],
                                           thisTool._segments.colorStops[thisTool._segments.sortedStops[runningSegment]],
                                           value);
                  } else {
                    fill = thisTool._card._getGradientValue(thisTool._segments.colorStops[thisTool._segments.sortedStops[runningSegment]],
                                           thisTool._segments.colorStops[thisTool._segments.sortedStops[runningSegment+1]],
                                           value);
                  }
                  thisTool.styles.foreground[0]['fill'] = fill;
                  thisTool.as[0].style.fill = fill;

                  if (runningSegment > 0) {
                    // #LGTM: This expression has no effect.
                    //        I have no clue. This is a loop that works well, so what about this expression then?
                    for (var j=runningSegment+1; j--; j>=0) { // lgtm[js/useless-expression]
                      if (thisTool.styles.foreground[j]['fill'] != fill) {
                        thisTool.styles.foreground[j]['fill'] = fill;
                        thisTool.as[j].style.fill = fill;
                      }
                        thisTool.styles.foreground[j]['fill'] = fill;
                        thisTool.as[j].style.fill = fill;
                    }
                  } else {
                  }
                }

              }
              thisTool._cache[runningSegment] = d;

              // If at end of animation, don't do the add to force going to next segment
              if (tween.frameAngle != runningSegmentAngle) {
                runningSegmentAngle = runningSegmentAngle + (0.000001 * thisTool._arc.direction);
              }

              var runningSegmentPrev = runningSegment;
              runningSegment = thisTool._segmentAngles.findIndex((currentValue, index) =>
                thisTool._arc.clockwise
                ? ((runningSegmentAngle <= currentValue.boundsEnd) && (runningSegmentAngle >= currentValue.boundsStart))
                : ((runningSegmentAngle <= currentValue.boundsStart) && (runningSegmentAngle >= currentValue.boundsEnd)));

              if (!increase) {
                if (runningSegmentPrev != runningSegment) {
                  if (thisTool.debug) console.log('RENDERNEW movit - remove path', thisTool.toolId, runningSegmentPrev);
                  if (thisTool._arc.clockwise) {
                    as.removeAttribute("d");
                    thisTool._cache[runningSegmentPrev] = null;
                  } else {
                    as.removeAttribute("d");
                    thisTool._cache[runningSegmentPrev] = null;
                  }
                }
              }
              tween.runningAngle = runningSegmentAngle;
              if (thisTool.debug) console.log('RENDERNEW - animation loop tween', thisTool.toolId, tween, runningSegment, runningSegmentPrev);
            } while ((tween.runningAngle != tween.frameAngle) /* && (runningSegment == runningSegmentPrev)*/);

            // NTS @ 2020.10.14
            // In a fast paced animation - say 10msec - multiple segments should be drawn, 
            //   while tween.progress already has the value of 1.
            // This means only the first segment is drawn - due to the "&& (runningSegment == runningSegmentPrev)" test above.
            // To fix this:
            // - either remove that test (why was it there????)... Or
            // - add the line "|| (runningSegment != runningSegmentPrev)" to the if() below to make sure another animation frame is requested
            //   although tween.progress == 1.
            if ((tween.progress != 1) /*|| (runningSegment != runningSegmentPrev)*/) {
                thisTool.rAFid = requestAnimationFrame(function(timestamp){
                    animateSegmentsNEW(timestamp, thisTool)
                });
            } else {
              tween.startTime = null;
              if (thisTool.debug) console.log('RENDERNEW - animation loop ENDING tween', thisTool.toolId, tween, runningSegment, runningSegmentPrev);
            }
        } // function animateSegmentsNEW

        var mySelf = this;
        // 2021.10.31
        // Edge case where brightness percentage is set to undefined (attribute is gone) if light is set to off.
        // Now if light is switched on again, the brightness is set to old value, and val and valPrev are the same again, so NO drawing!!!!!
        //
        // Remove test for val/valPrev...
        
        // Check if values changed and we should animate to another target then previously rendered
        if ( /*(val != valPrev) &&*/ (this._card.connected == true) && (this._renderTo != this._stateValue)) {
        // if ( (val != valPrev) && (this._card.connected == true) && (this._renderTo != this._stateValue)) {
          this._renderTo = this._stateValue;
          //if (this.dev.debug) console.log('RENDERNEW val != valPrev', val, valPrev, 'prev/end/cur', arcEndPrev, arcEnd, arcCur);

          // If previous animation active, cancel this one before starting a new one...
          if (this.rAFid) {
            //if (this.dev.debug) console.log('RENDERNEW canceling rAFid', this._card.cardId, this.toolId, 'rAFid', this.rAFid);
            cancelAnimationFrame(this.rAFid);
          }

          // Start new animation with calculated settings...
          // counter var not defined???
          //if (this.dev.debug) console.log('starting animationframe timer...', this._card.cardId, this.toolId, counter);
          tween.fromAngle = arcEndPrev;
          tween.toAngle = arcEnd;
          tween.runningAngle = arcEndPrev;
          
          // @2021.10.31
          // Handle edge case where - for some reason - arcEnd and arcEndPrev are equal.
          // Do NOT render anything in this case to prevent errors...
          
          // The check is removed temporarily. Brightness is again not shown for light. Still the same problem...

          if (true || !(arcEnd == arcEndPrev)) {
            // Render like an idiot the first time. Performs MUCH better @first load then having a zillion animations...
            // NOt so heavy on an average PC, but my iPad and iPhone need some more time for this!

            tween.duration = Math.min(Math.max(this._initialDraw ? 100 : 500, this._initialDraw ? 16 : this.config.animation.duration * 1000), 5000);
            tween.startTime = null;
            if (this.dev.debug) console.log('RENDERNEW - tween', this.toolId, tween);
            // this._initialDraw = false;
            this.rAFid = requestAnimationFrame(function(timestamp){
                                                animateSegmentsNEW(timestamp, mySelf)
                                              });
            this._initialDraw = false;
          }
        }


        return svg`${svgItems}`;


      } else {
        // Initial FIRST draw.
        // What if we 'abuse' the animation to do this, and we just create empty elements.
        // Then we don't have to do difficult things.
        // Just set some values to 0 and 'force' a full animation...
        //
        // Hmm. Stuff is not yet rendered, so DOM objects don't exist yet. How can we abuse the
        // animation function to do the drawing then??
        // --> Can use firstUpdated perhaps?? That was the first render, then do the first actual draw??
        //

        if (this.dev.debug) console.log('RENDERNEW _arcId does NOT exist', this._arcId, this.toolId);

        // Create empty elements, so no problem in animation function. All path's exist...
        // An empty element has a width of 0!
        for (var i=0; i < this._segmentAngles.length; i++) {
          d = this.buildArcPath(this._segmentAngles[i].drawStart, this._segmentAngles[i].drawEnd,
                                this._arc.clockwise, this.svg.radiusX, this.svg.radiusY, this.config.isScale ? this.svg.width : 0);

          this._cache[i] = d;

          // extra, set color from colorlist as a test
          var fill = this.config.color;
          if (this.config.show.style =="colorlist") {
            fill = this.config.segments.colorlist.colors[i];
          }
          if (this.config.show.style =="colorstops") {
            fill = this._segments.colorStops[this._segments.sortedStops[i]];
          }
//                            style="${styleMap(this.config.styles.foreground)} fill: ${fill};"
          if (!this.styles.foreground) {
            this.styles.foreground = {};
          };
          if (!this.styles.foreground[i]) {
            this.styles.foreground[i] = Merge.mergeDeep(this.config.styles.foreground);
          };
          this.styles.foreground[i]['fill'] = fill;
          
          // #WIP
          // Testing 'lastcolor'
          if (this.config.show.lastcolor) {
            if (i > 0) {
              // #LGTM: This expression has no effect.
              for (var j=i-1; j--; j>0) { // lgtm[js/useless-expression]
                this.styles.foreground[j]['fill'] = fill;
              }
            }
          }

          svgItems.push(svg`<path id="arc-segment-${this.toolId}-${i}" class="arc__segment"
                            style="${styleMap(this.styles.foreground[i])}"
                            d="${d}"
                            />`);
        }

        if (this.dev.debug) console.log('RENDERNEW - svgItems', svgItems, this._firstUpdatedCalled);
        return svg`${svgItems}`;

      }

    // END OF NEW METHOD OF RENDERING
    } else {
    }
  }


  polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radiusX * Math.cos(angleInRadians)),
      y: centerY + (radiusY * Math.sin(angleInRadians))
    }
  }

  /*
   *
   * start = 10, end = 30, clockwise -> size is 20
   * start = 10, end = 30, anticlockwise -> size is (360 - 20) = 340
   *
   *
   */
  buildArcPath(argStartAngle, argEndAngle, argClockwise, argRadiusX, argRadiusY, argWidth) {

    var start = this.polarToCartesian(this.svg.cx, this.svg.cy, argRadiusX, argRadiusY, argEndAngle);
    var end = this.polarToCartesian(this.svg.cx, this.svg.cy, argRadiusX, argRadiusY, argStartAngle);
    var largeArcFlag = Math.abs(argEndAngle - argStartAngle) <= 180 ? "0" : "1";

    const sweepFlag = argClockwise ? "0": "1";

    var cutoutRadiusX = argRadiusX - argWidth,
      cutoutRadiusY = argRadiusY - argWidth,
      start2 = this.polarToCartesian(this.svg.cx, this.svg.cy, cutoutRadiusX, cutoutRadiusY, argEndAngle),
      end2 = this.polarToCartesian(this.svg.cx, this.svg.cy, cutoutRadiusX, cutoutRadiusY, argStartAngle),

    d = [
      "M", start.x, start.y,
      "A", argRadiusX, argRadiusY, 0, largeArcFlag, sweepFlag, end.x, end.y,
      "L", end2.x, end2.y,
      "A", cutoutRadiusX, cutoutRadiusY, 0, largeArcFlag, sweepFlag == "0" ? "1": "0", start2.x, start2.y,
      "Z",
    ].join(" ");
    return d;
  }
} // END of class

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
    this.viewBox = {"width": SVG_VIEW_BOX, "height": SVG_VIEW_BOX};

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
    // Detection from: http://jsfiddle.net/jlubean/dL5cLjxt/
    //
    // this.isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    // this.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // See: https://javascriptio.com/view/10924/detect-if-device-is-ios
    // After iOS 13 you should detect iOS devices like this, since iPad will not be detected as iOS devices
    // by old ways (due to new "desktop" options, enabled by default)

    this.isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    this.iOS = (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
                !window.MSStream;

    this.lovelace = SwissArmyKnifeCard.lovelace;
    
    if (!this.lovelace) console.error("card::constructor - Can't get Lovelace panel");

    if (!SwissArmyKnifeCard.sakIconCache) {
      SwissArmyKnifeCard.sakIconCache = {};
    }
    if (!SwissArmyKnifeCard.colorCache) {
      SwissArmyKnifeCard.colorCache = [];
    }

    if (this.dev.debug) console.log('*****Event - card - constructor', this.cardId, new Date().getTime());
  }

 /*******************************************************************************
  * Summary.
  * Implements the properties method
  *
  */
/*
  static get properties() {
    return {
      hass: {},
      config: {},
      states: [],
      statesStr: [],

      dashArray: String,
      color1_offset: String,
      color0: String,
      color1: String,
      angleCoords: Object
    }
  }
*/
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
  
 /*******************************************************************************
  * card::getUserStyles()
  *
  * Summary.
  * Returns the user defined CSS styles for the card in sak_user_templates config
  * section in lovelace configuration.
  *
  */

  static getUserStyles() {

    this.userContent = "";
    
    if ((SwissArmyKnifeCard.lovelace.config.sak_user_templates) &&
        (SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_css_definitions)) {
      this.userContent = SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_css_definitions.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.content;
      }, "");
    }
    
    return css`${unsafeCSS(this.userContent)}`;
  }


  static getSakStyles() {

    this.sakContent = "";
    
    if ((SwissArmyKnifeCard.lovelace.config.sak_sys_templates) &&
        (SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_css_definitions)) {
      this.sakContent = SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_css_definitions.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.content;
      }, "");
    }
    
    return css`${unsafeCSS(this.sakContent)}`;
  }

  static getSakSvgDefinitions() {

    SwissArmyKnifeCard.lovelace.sakSvgContent = null;
    var sakSvgContent = "";
    
    if ((SwissArmyKnifeCard.lovelace.config.sak_sys_templates) &&
        (SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions)) {
      sakSvgContent = SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.content;
      }, "");
    }
    // Cache result for later use in other cards
    SwissArmyKnifeCard.sakSvgContent = unsafeSVG(sakSvgContent);
  }

  static getUserSvgDefinitions() {

    SwissArmyKnifeCard.lovelace.userSvgContent = null;
    var userSvgContent = "";
    
    if ((SwissArmyKnifeCard.lovelace.config.sak_user_templates) &&
        (SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_svg_definitions)) {
      userSvgContent = SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_svg_definitions.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.content;
      }, "");
    }
    // Cache result for later use other cards
    SwissArmyKnifeCard.userSvgContent = unsafeSVG(userSvgContent);
  }

 /*******************************************************************************
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

    if (!SwissArmyKnifeCard.lovelace) SwissArmyKnifeCard.lovelace = getLovelace();

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

 /*******************************************************************************
  * card::set hass()
  *
  * Summary.
  * Updates hass data for the card
  *
  */

  set hass(hass) {
    if (!this.counter) this.counter = 0;
    this.counter++;

    // Check for theme mode and theme mode change...
    if (hass.themes.darkMode != this.theme.darkMode) {
      this.theme.darkMode = hass.themes.darkMode;
      this.theme.modeChanged = true;
    };
    
    // Set ref to hass, use "_"for the name ;-)
    if (this.dev.debug) console.log('*****Event - card::set hass', this.cardId, new Date().getTime());
    this._hass = hass;

    if (!this.connected) {
      if (this.dev.debug) console.log('set hass but NOT connected', this.cardId);

    // 2020.02.10 Troubles with connectcallback late, so windows are not yet calculated. ie
    // things around icons go wrong...
    // what if return is here..
      //return;
    } else {
      // #WIP
      // this.requestUpdate();
    }

    if (!this.config.entities) {
      return;
    }
    
    var entityHasChanged = false;

    // Update state strings and check for changes.
    // Only if changed, continue and force render
    var value;
    var index = 0;

    var secInfoSet = false;
    var newSecInfoState;
    var newSecInfoStateStr;

    var attrSet = false;
    var newStateStr;
    for (value of this.config.entities) {
      this.entities[index] = hass.states[this.config.entities[index].entity];

      // Get secondary info state if specified and available
      if (this.config.entities[index].secondary_info) {
        secInfoSet = true;
        newSecInfoState = this.entities[index][this.config.entities[index].secondary_info];
        newSecInfoStateStr = this._buildSecondaryInfo(newSecInfoState, this.config.entities[index]);

        if (newSecInfoStateStr != this.secondaryInfoStr[index]) {
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

        let attribute = this.config.entities[index].attribute;
        let attrMore = '';
        let attributeState = '';

        var arrayPos = this.config.entities[index].attribute.indexOf("[");
        var dotPos = this.config.entities[index].attribute.indexOf(".");
        var arrayIdx = 0;
        var arrayMap = '';
        
        if (arrayPos != -1) {
          // We have an array. Split...
          attribute = this.config.entities[index].attribute.substr(0, arrayPos);
          attrMore = this.config.entities[index].attribute.substr(arrayPos, this.config.entities[index].attribute.length - arrayPos);
          
          // Just hack, assume single digit index...
          arrayIdx = attrMore[1];
          arrayMap = attrMore.substr(4, attrMore.length - 4);
          
          // Fetch state
          attributeState = this.entities[index].attributes[attribute][arrayIdx][arrayMap];
          // console.log('set hass, attributes with array/map', this.config.entities[index].attribute, attribute, attrMore, arrayIdx, arrayMap, attributeState);
          
        } else if (dotPos != -1) {
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

        if (true) {//(typeof attributeState != 'undefined') {
          newStateStr = this._buildState(attributeState, this.config.entities[index]);
          if (newStateStr != this.attributesStr[index]) {
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
        if (newStateStr != this.entitiesStr[index]) {
          this.entitiesStr[index] = newStateStr;
          entityHasChanged = true;
        } else {
        }
        if (this.dev.debug) console.log("set hass - attrSet=false", this.cardId, new Date().getSeconds().toString() + '.'+ new Date().getMilliseconds().toString(), newStateStr);
      }

      index++;
      attrSet = false;
      secInfoSet = false;
    }

    if ((!entityHasChanged) && (!this.theme.modeChanged)) {
      //console.timeEnd("--> " + this.cardId + " PERFORMANCE card::hass");

      return;
    }

    // Either one of the entities has changed, or the theme mode. So update all toolsets with new data.
    if (this.toolsets) {
      this.toolsets.map((item, index) => {
        item.updateValues();
      });
    }

    // Always request update to render the card if any of the states, attributes or theme mode have changed...
    
    this.requestUpdate();

    // An update has been requested to recalculate / redraw the tools, so reset theme mode changed
    this.theme.modeChanged = false;
    
    this.counter--;

    //console.timeEnd("--> " + this.cardId + " PERFORMANCE card::hass");
  }

 /*******************************************************************************
  * card::setConfig()
  *
  * Summary.
  * Sets/Updates the card configuration. Rarely called if the doc is right
  *
  */

  setConfig(config) {
    if (this.dev.performance) console.time("--> " + this.cardId + " PERFORMANCE card::setConfig");

    if (this.dev.debug) console.log('*****Event - setConfig', this.cardId, new Date().getTime());
    config = JSON.parse(JSON.stringify(config));

    if (config.dev) this.dev = {...this.dev, ...config.dev};

    if (this.dev.debug) console.log('setConfig', this.cardId);

    this.aspectratio = config.aspectratio || "1/1";
    
    var ar = config.aspectratio.trim().split("/");
    if (!this.viewBox) this.viewBox = {};
    this.viewBox.width = ar[0] * SVG_DEFAULT_DIMENSIONS;
    this.viewBox.height= ar[1] * SVG_DEFAULT_DIMENSIONS;

    if (!config.layout) {
      throw Error('card::setConfig - No layout defined');
    }

    if (!config.layout.toolsets) {
      throw Error('card::setConfig - No toolsets defined');
    }

    // testing
    if (config.entities) {
      const newdomain = this._computeDomain(config.entities[0].entity);
      if (newdomain != 'sensor') {
        // If not a sensor, check if attribute is a number. If so, continue, otherwise Error...
        if (config.entities[0].attribute && !isNaN(config.entities[0].attribute)) {
          throw Error('card::setConfig - First entity or attribute must be a numbered sensorvalue, but is NOT');
        }
      }
    }

    // #TODO
    // @2020.11.24 new instead of previous lines.
    const newConfig = Merge.mergeDeep(config);
    
    // #TODO must be removed after removal of segmented arcs part below
    this.config = newConfig;

    // NEW for ts processing
    this.toolset = [];

    var thisMe = this;
    function findTemplate(key, value) {
      // Filtering out properties
      // console.log("findTemplate, key=", key, "value=", value);
      if (value.template) {
        const template = thisMe.lovelace.config.sak_user_templates.templates[value.template.name];
          var replacedValue = Templates.replaceVariables3(value.template.variables, template);
          // Hmm. cannot add .template var. object is not extensible...
          // replacedValue.template = 'replaced';
          var secondValue = Merge.mergeDeep(replacedValue);
          secondValue.from_template = 'replaced';

        return secondValue;
      }
      if (key == 'template') {
        // Template is gone via replace!!!! No template anymore, as there is no merge done.
        console.log("findTemplate return key=template/value", key, undefined);
        
        return value;
      }
      // console.log("findTemplate return key/value", key, value);
      return value;
    }

    
    var cfg = JSON.stringify(this.config.layout.toolsets, findTemplate);
    var cfgobj = JSON.parse(cfg);

    this.config.layout.toolsets.map((toolsetCfg, toolidx) => {

      var toolList = null;

      if (!this.toolsets) this.toolsets = [];

      if (true) {
        
        var found = false;
        var toolAdd = [];

        toolList = cfgobj[toolidx].tools;
        // Check for empty tool list. This can be if template is used. Tools come from template, not from config...
        if (toolsetCfg.tools) {
          toolsetCfg.tools.map((tool, index) => {
            cfgobj[toolidx].tools.map((toolT, indexT) => {
              if (tool.id == toolT.id) {
                
                if (toolsetCfg.template) {
                  if (this.config.layout.toolsets[toolidx].position)
                    cfgobj[toolidx].position = Merge.mergeDeep(this.config.layout.toolsets[toolidx].position);

                  toolList[indexT] = Merge.mergeDeep(toolList[indexT], tool);
                  
                  // After merging/replacing. We might get some template definitions back!!!!!!
                  toolList[indexT] = JSON.parse(JSON.stringify(toolList[indexT], findTemplate));
                
                found = true;
                }
                if (this.dev.debug) console.log("card::setConfig - got toolsetCfg toolid", tool, index, toolT, indexT, tool);
              }
            });
            if (!found) toolAdd = toolAdd.concat(toolsetCfg.tools[index]);
          });
        }
        toolList = toolList.concat(toolAdd);
      }

      // Testing new template replace stuff...
      if (true) {
        toolsetCfg = cfgobj[toolidx];
      }
      const newToolset = new Toolset(this, toolsetCfg);

      this.toolsets.push(newToolset);
    });

    // Special case. Abuse card for m3 conversion to output
    if (this.dev.m3) {
      console.log("*** M3 - Checking for m3.yaml template to convert...");
      
      if (this.lovelace.config.sak_user_templates.templates.m3) {
        var m3 = this.lovelace.config.sak_user_templates.templates.m3;
        
        console.log("*** M3 - Found. Material 3 conversion starting...");
        var palette = "";
        var colordefault = "";
        var colorlight = "";
        var colordark = "";
        
        var surfacelight = "";
        var primarylight = "";
        var neutrallight = "";

        var surfacedark = "";
        var primarydark = "";
        var neutraldark = "";

        var colorEntities = {};
        var cssNames = {};
        var cssNamesRgb = {};
        
        m3.entities.map((entity, index) => {
          if (['ref.palette', 'sys.color', 'sys.color.light', 'sys.color.dark'].includes(entity.category_id)) {
            if (!entity.tags.includes('alias')) {
            colorEntities[entity.id] = {'value' : entity.value, 'tags' : entity.tags};
            };
          };

          if (entity.category_id === "ref.palette") {
            palette += entity.id + ": '" + entity.value + "'\n";
            
            // test for primary light color...
            if (entity.id === "md.ref.palette.primary40") {
              primarylight = entity.value;
            }
            // test for primary dark color...
            if (entity.id === "md.ref.palette.primary80") {
              primarydark = entity.value;
            }

            // test for neutral light color...
            if (entity.id === "md.ref.palette.neutral40") {
              neutrallight = entity.value;
            }
            // test for neutral light color...
            if (entity.id === "md.ref.palette.neutral80") {
              neutraldark = entity.value;
            }

          }
          
          if (entity.category_id === "sys.color") {
            colordefault += entity.id + ": '" + entity.value + "'\n";
          }

          if (entity.category_id === "sys.color.light") {
            colorlight += entity.id + ": '" + entity.value + "'\n";
          
            // test for surface light color...
            if (entity.id === "md.sys.color.surface.light") {
              surfacelight = entity.value;
            }
          }

          if (entity.category_id === "sys.color.dark") {
            colordark += entity.id + ": '" + entity.value + "'\n";

            // test for surface light color...
            if (entity.id === "md.sys.color.surface.dark") {
              surfacedark = entity.value;
            }
          }
        });
        
        ['primary', 'secondary', 'tertiary', 'error', 'neutral', 'neutral-variant'].forEach((palette) => {
          [5, 15, 25, 35, 45, 65, 75, 85].forEach((step) => {
            
            colorEntities['md.ref.palette.' + palette + step.toString()] = {
              value: this._getGradientValue(colorEntities['md.ref.palette.' + palette + (step - 5).toString()].value,
                                            colorEntities['md.ref.palette.' + palette + (step + 5).toString()].value, 0.5),
              tags: [...colorEntities['md.ref.palette.' + palette + (step - 5).toString()].tags]
            };
            colorEntities['md.ref.palette.' + palette + step.toString()].tags[3] = palette + step.toString();
                                                                              
          });
          colorEntities['md.ref.palette.' + palette + '7'] = {
            value: this._getGradientValue(colorEntities['md.ref.palette.' + palette + '5'].value,
                                          colorEntities['md.ref.palette.' + palette + '10'].value, 0.5),
            tags: [...colorEntities['md.ref.palette.' + palette + '10'].tags]
          };
          colorEntities['md.ref.palette.' + palette + '7'].tags[3] = palette + '7';

          colorEntities['md.ref.palette.' + palette + '92'] = {
            value: this._getGradientValue(colorEntities['md.ref.palette.' + palette + '90'].value,
                                          colorEntities['md.ref.palette.' + palette + '95'].value, 0.5),
            tags: [...colorEntities['md.ref.palette.' + palette + '90'].tags]
          };
          colorEntities['md.ref.palette.' + palette + '92'].tags[3] = palette + '92';

          colorEntities['md.ref.palette.' + palette + '97'] = {
            value: this._getGradientValue(colorEntities['md.ref.palette.' + palette + '95'].value,
                                          colorEntities['md.ref.palette.' + palette + '99'].value, 0.5),
            tags: [...colorEntities['md.ref.palette.' + palette + '90'].tags]
          };
          colorEntities['md.ref.palette.' + palette + '97'].tags[3] = palette + '97';
        });

        for (const [index, entity] of Object.entries(colorEntities)) {
          cssNames[index] = "theme-" + entity.tags[1] + "-"  + entity.tags[2] + "-" + entity.tags[3] + ": rgb(" + hex2rgb(entity.value) + ")";
          cssNamesRgb[index] = "theme-" + entity.tags[1] + "-"  + entity.tags[2] + "-" + entity.tags[3] + "-rgb: " +  hex2rgb(entity.value);
        };
       
        // https://filosophy.org/code/online-tool-to-lighten-color-without-alpha-channel/


        function hex2rgb(hexColor) {
          var rgbCol = {};

          rgbCol.r = Math.round(parseInt(hexColor.substr(1,2), 16));
          rgbCol.g = Math.round(parseInt(hexColor.substr(3,2), 16));
          rgbCol.b = Math.round(parseInt(hexColor.substr(5,2), 16));
          
          // const cssRgbColor = "rgb(" + rgbCol.r + "," + rgbCol.g + "," + rgbCol.b + ")";
          const cssRgbColor = rgbCol.r + "," + rgbCol.g + "," + rgbCol.b;
          return cssRgbColor;
        }

        function getSurfaces(surfaceColor, paletteColor, opacities, cssName, mode) {
          var bgCol = {};
          var fgCol = {};

          bgCol.r = Math.round(parseInt(surfaceColor.substr(1,2), 16));
          bgCol.g = Math.round(parseInt(surfaceColor.substr(3,2), 16));
          bgCol.b = Math.round(parseInt(surfaceColor.substr(5,2), 16));
          
          fgCol.r = Math.round(parseInt(paletteColor.substr(1,2), 16));
          fgCol.g = Math.round(parseInt(paletteColor.substr(3,2), 16));
          fgCol.b = Math.round(parseInt(paletteColor.substr(5,2), 16));
          
          var surfaceColors = '';
          var r,g,b;
          opacities.forEach((opacity, index) => {
            r = Math.round(opacity * fgCol.r + (1 - opacity) * bgCol.r);
            g = Math.round(opacity * fgCol.g + (1 - opacity) * bgCol.g);
            b = Math.round(opacity * fgCol.b + (1 - opacity) * bgCol.b);
            
            surfaceColors += cssName + (index+1).toString() + "-" + mode + ": rgb(" + r + "," + g + "," + b + ")\n";
            surfaceColors += cssName + (index+1).toString() + "-" + mode + "-rgb: " + r + "," + g + "," + b + "\n";
          });
          
          return surfaceColors;
        }
        
        // Generate surfaces for dark and light...
        var opacitysurfacelight = [0.03, 0.05, 0.08, 0.11, 0.15, 0.19, 0.24, 0.29, 0.35, 0.4];
        var opacitysurfacedark = [0.05, 0.08, 0.11, 0.15, 0.19, 0.24, 0.29, 0.35, 0.40, 0.45];

        var surfacenL = getSurfaces(surfacelight, neutrallight, opacitysurfacelight, "  theme-ref-elevation-surface-neutral", "light");

        var neutralvariantlight = colorEntities["md.ref.palette.neutral-variant40"].value;
        var surfacenvL = getSurfaces(surfacelight, neutralvariantlight, opacitysurfacelight, "  theme-ref-elevation-surface-neutral-variant", "light");

        var surfacepL = getSurfaces(surfacelight, primarylight, opacitysurfacelight, "  theme-ref-elevation-surface-primary", "light");

        var secondarylight = colorEntities["md.ref.palette.secondary40"].value;
        var surfacesL = getSurfaces(surfacelight, secondarylight, opacitysurfacelight, "  theme-ref-elevation-surface-secondary", "light");

        var tertiarylight = colorEntities["md.ref.palette.tertiary40"].value;
        var surfacetL = getSurfaces(surfacelight, tertiarylight, opacitysurfacelight, "  theme-ref-elevation-surface-tertiary", "light");

        var errorlight = colorEntities["md.ref.palette.error40"].value;
        var surfaceeL = getSurfaces(surfacelight, errorlight, opacitysurfacelight, "  theme-ref-elevation-surface-error", "light");


        // DARK
        var surfacenD = getSurfaces(surfacedark, neutraldark, opacitysurfacedark, "  theme-ref-elevation-surface-neutral", "dark");

        var neutralvariantdark = colorEntities["md.ref.palette.neutral-variant80"].value;
        var surfacenvD = getSurfaces(surfacedark, neutralvariantdark, opacitysurfacedark, "  theme-ref-elevation-surface-neutral-variant", "dark");

        var surfacepD = getSurfaces(surfacedark, primarydark, opacitysurfacedark, "  theme-ref-elevation-surface-primary", "dark");

        var secondarydark = colorEntities["md.ref.palette.secondary80"].value;
        var surfacesD = getSurfaces(surfacedark, secondarydark, opacitysurfacedark, "  theme-ref-elevation-surface-secondary", "dark");

        var tertiarydark = colorEntities["md.ref.palette.tertiary80"].value;
        var surfacetD = getSurfaces(surfacedark, tertiarydark, opacitysurfacedark, "  theme-ref-elevation-surface-tertiary", "dark");

        var errordark = colorEntities["md.ref.palette.error80"].value;
        var surfaceeD = getSurfaces(surfacedark, errordark, opacitysurfacedark, "  theme-ref-elevation-surface-error", "dark");

        var themeDefs = "";
        for (const [index, cssName] of Object.entries(cssNames)) { // lgtm[js/unused-local-variable]
          if (cssName.substring(0,9) == 'theme-ref') {
            themeDefs += "  " + cssName + "\n";
            themeDefs += "  " + cssNamesRgb[index] + "\n";
          }
        };
        // Dump full theme contents to console.
        // User should copy this content into the theme definition YAML file.
        console.log(surfacenL + surfacenvL + surfacepL + surfacesL + surfacetL + surfaceeL +
                    surfacenD + surfacenvD + surfacepD + surfacesD + surfacetD + surfaceeD +
                    themeDefs);

        console.log("*** M3 - Material 3 conversion DONE. You should copy the above output...");
      }
    }

    if (this.dev.debug) console.log('Step 5: toolconfig, list of toolsets', this.toolsets);
    if (this.dev.debug) console.log('debug - setConfig', this.cardId, this.config);
    if (this.dev.performance) console.timeEnd("--> " + this.cardId + " PERFORMANCE card::setConfig");

    this.configIsSet = true;
  }

 /*******************************************************************************
  * card::connectedCallback()
  *
  * Summary.
  *
  */
  connectedCallback() {
    if (this.dev.performance) console.time("--> " + this.cardId + " PERFORMANCE card::connectedCallback");

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
    if (this.dev.performance) console.timeEnd("--> " + this.cardId + " PERFORMANCE card::connectedCallback");
  }

 /*******************************************************************************
  * card::disconnectedCallback()
  *
  * Summary.
  *
  */
  disconnectedCallback() {
    if (this.dev.performance) console.time("--> " + this.cardId + " PERFORMANCE card::disconnectedCallback");

    if (this.dev.debug) console.log('*****Event - disconnectedCallback', this.cardId, new Date().getTime());
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = 0;
    }
    super.disconnectedCallback();
    if (this.dev.debug) console.log('disconnectedCallback', this.cardId);
    this.connected = false;
    if (this.dev.performance) console.timeEnd("--> " + this.cardId + " PERFORMANCE card::disconnectedCallback");
  }

 /*******************************************************************************
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
      this.toolsets.map( async (item, index) => {
        item.firstUpdated(changedProperties);
      });
    }
  }

 /*******************************************************************************
  * card::updated()
  *
  * Summary.
  *
  */
  updated(changedProperties) {

    if (this.dev.debug) console.log('*****Event - Updated', this.cardId, new Date().getTime());

    if (this.toolsets) {
      this.toolsets.map( async (item, index) => {
        item.updated(changedProperties);
      });
    }
  }

 /*******************************************************************************
  * card::render()
  *
  * Summary.
  * Renders the complete SVG based card according to the specified layout.
  *
  * render ICON TESTING pathh lzwzmegla undefined undefined
  * render ICON TESTING pathh lzwzmegla undefined NodeList [ha-svg-icon]
  * render ICON TESTING pathh lzwzmegla M7,2V13H10V22L17,10H13L17,2H7Z NodeList [ha-svg-icon]
  */

  render() {

    if (this.dev.performance) console.time("--> "+ this.cardId + " PERFORMANCE card::render");
    if (this.dev.debug) console.log('*****Event - render', this.cardId, new Date().getTime());

    if (!this.connected) {
      if (this.dev.debug) console.log('render but NOT connected', this.cardId, new Date().getTime());
      return;
    }

    var myHtml;

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
    if (this.dev.performance) console.timeEnd("--> "+ this.cardId + " PERFORMANCE card::render");

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
    return (this.theme.darkMode == true);
  }
  
  themeIsLightMode() {
    return (this.theme.darkMode == false);
  }
  
/*******************************************************************************
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
                ${this.toolsets.map(toolset => toolset.render())}
              </g>

            <defs>
              ${this._renderSakSvgDefinitions()}
              ${this._renderUserSvgDefinitions()}
            </defs>
    `;
  }


/*******************************************************************************
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

    var entityValue;
    var attributes = [];
    
    this._attributes = "";

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

 /*******************************************************************************
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
  
/*******************************************************************************
  * card::_buildState()
  *
  * Summary.
  * Builds the State string.
  * If state is not a number, the state is returned AS IS, otherwise the state
  * is build according to the specified number of decimals.
  *
  * NOTE:
  * - a number value of "-0" is translated to "0". The sign is gone...
  */

  _buildState(inState, entityConfig) {

    // console.log('_buildState', inState, entityConfig)
    
    if (isNaN(inState)) {
      if (inState === 'unavailable') return '-ua-';
      return inState;
    }

    const state = Number(inState);
    const sign = Math.sign(inState);

    if (entityConfig.decimals === undefined || Number.isNaN(entityConfig.decimals) || Number.isNaN(state))
      return (sign == "-0" ? "-" + (Math.round(state * 100) / 100).toString() : (Math.round(state * 100) / 100).toString());

    const x = 10 ** entityConfig.decimals;
    return (sign == "-0" ? "-" + (Math.round(state * x) / x).toFixed(entityConfig.decimals).toString() :
                                 (Math.round(state * x) / x).toFixed(entityConfig.decimals).toString());
  }


/*******************************************************************************
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
        return "" + s;
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

      var retValue;
      // return date/time according to formatting...
      switch (entityConfig.format) {
        case 'relative':
          const diff = selectUnit(timestamp, new Date());
          retValue = new Intl.RelativeTimeFormat(lang, { numeric: "auto" }).format(diff.value, diff.unit);
          break;
        case 'total':
        case 'precision':
          retValue = 'Not Yet Supported';
          break;
        case 'date':
          retValue = new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'numeric', day: 'numeric'}).format(timestamp);
          break;
        case 'time':
          retValue = new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: 'numeric', second: 'numeric'}).format(timestamp);
          break;
        case 'datetime':
          retValue = new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'}).format(timestamp);
          break;
      }
      return retValue;
    }

    if (isNaN(parseFloat(inSecInfoState)) || !isFinite(inSecInfoState)) {
        return inSecInfoState;
    }
    if (config.format === 'brightness') {
        return `${Math.round((inSecInfoState / 255) * 100)} %`;
    }
    if (config.format === 'duration') {
        return secondsToDuration(inSecInfoState);
    }
  }

 /*******************************************************************************
  * card::_computeState()
  *
  * Summary.
  *
  */

  _computeState(inState, dec) {

    if (isNaN(inState))
      return inState;

    const state = Number(inState);

    if (dec === undefined || Number.isNaN(dec) || Number.isNaN(state))
      return Math.round(state * 100) / 100;

    const x = 10 ** dec;
    return (Math.round(state * x) / x).toFixed(dec);
  }

 /*******************************************************************************
  * card::_calculateColor()
  *
  * Summary.
  *
  * #TODO:
  * replace by TinyColor library? Is that possible/feasible??
  *
  */

  _calculateColor(argState, argStops, argIsGradient) {
    const sortedStops = Object.keys(argStops).map(n => Number(n)).sort((a, b) => a - b);

    let start, end, val;
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

/*******************************************************************************
  * card::_calculateColor2()
  *
  * Summary.
  *
  * #TODO:
  * replace by TinyColor library? Is that possible/feasible??
  *
  */

  _calculateColor2(argState, argStops, argPart, argProperty, argIsGradient) {
    const sortedStops = Object.keys(argStops).map(n => Number(n)).sort((a, b) => a - b);

    let start, end, val;
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

 /*******************************************************************************
  * card::_calculateValueBetween()
  *
  * Summary.
  * Clips the argValue value between argStart and argEnd, and returns the between value ;-)
  *
  */

  _calculateValueBetween(argStart, argEnd, argValue) {
    return (Math.min(Math.max(argValue, argStart), argEnd) - argStart) / (argEnd - argStart);
  }

 /*******************************************************************************
  * card::_getColorVariable()
  *
  * Summary.
  * Get value of CSS color variable, specified as var(--color-value)
  * These variables are defined in the Lovelace element so it appears...
  *
  */

  _getColorVariable(argColor) {
    const newColor = argColor.substr(4, argColor.length-5);

    const returnColor = window.getComputedStyle(this).getPropertyValue(newColor);
    return returnColor;
  }

 /*******************************************************************************
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

 /*******************************************************************************
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
    let retColor = SwissArmyKnifeCard.colorCache[argColor];
    if (retColor) return retColor;

    var theColor = argColor;
    // Check for 'var' colors
    let a0 = argColor.substr(0,3);
    if (a0.valueOf() === 'var') {
      theColor = this._getColorVariable(argColor);
    }

    // Get color from canvas. This always returns an rgba() value...
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = theColor;
    ctx.fillRect(0, 0, 1, 1);
    const outColor = [ ...ctx.getImageData(0, 0, 1, 1).data ];

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
      if (this.dev.debug) console.log("UpdateOnInterval - NO hass, returning");
      return;
    }
    if (this.stateChanged && !this.entityHistory.updating) {

      // 2020.10.24
      // Leave true, as multiple entities can be fetched. fetch every 5 minutes...
      //this.stateChanged = false;
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
          this.entityHistory.update_interval * 1000);
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

  async updateData({ config } = this) {
    this.entityHistory.updating = true;

    if (this.dev.debug) console.log("card::updateData - ENTRY", this.cardId);

    // We have a list of objects that might need some history update
    // Create list to fetch.
    let entityList = [];
    var j = 0;

    // #TODO
    // Lookup in this.tools for bars, or better tools that need history...
    // get that entity_index for that object
    // add to list...
    this.toolsets.map((toolset, k) => {
      toolset.tools.map((item, i) => {
        if (item.type == "bar") {
          const end = new Date();
          const start = new Date();
          start.setHours(end.getHours() - item.tool.config.hours);
          const attr = this.config.entities[item.tool.config.entity_index].attribute ? this.config.entities[item.tool.config.entity_index].attribute : null;

          entityList[j] = ({"tsidx": k, "entityIndex": item.tool.config.entity_index, "entityId": this.entities[item.tool.config.entity_index].entity_id, "attrId": attr, "start": start, "end": end, "type": "bar", "idx": i});
          j++;
        }
      });
    });

    if (this.dev.debug) console.log("card::updateData - LENGTH", this.cardId, entityList.length, entityList);

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
    let start = initStart;
    let skipInitialState = false;

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
      newStateHistory = newStateHistory[0].filter(item => entity.attrId ? !Number.isNaN(parseFloat(item.attributes[entity.attrId])) : !Number.isNaN(parseFloat(item.state)));

      newStateHistory = newStateHistory.map(item => ({
        last_changed: item.last_changed,
        state: entity.attrId ? Number(item.attributes[entity.attrId]) : Number(item.state)
      }));

    }

    stateHistory = [...stateHistory, ...newStateHistory];

    this.uppdate(entity, stateHistory);
    return;
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

    var hours = 24;
    var barhours = 2;

    if (entity.type == 'bar') {
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
    if (Object.keys(coords).length == 0) {
      return;
    }

    // That STUPID STUPID Math.min/max can't handle empty arrays which are put into it below
    // so add some data to the array, and everything works!!!!!!

    // check if first interval contains data, if not find first in interval and use first entry as value...

    var firstInterval = Object.keys(coords)[0];
    if (firstInterval != '0') {
      // first index doesn't contain data.
      coords[0] = [];
      
      coords[0].push(coords[firstInterval][0]);
    }

    for(var i = 0; i < (hours / barhours); i++) {
      if (!coords[i]) {
        coords[i] = [];
        coords[i].push(coords[i-1][coords[i-1].length-1]);
      }
    }
    this.coords = coords;
    var theData = [];
    theData = [];
    theData = coords.map(item => getAvg(item, 'state'));

    // now push data into object...
    if (entity.type == 'bar') {
      this.toolsets[entity.tsidx].tools[entity.idx].tool.series = [...theData];
    }

    // Request a rerender of the card after receiving new data
    this.requestUpdate();
  }

 /*******************************************************************************
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