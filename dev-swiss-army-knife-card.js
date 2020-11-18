/*
*
* Card      : dev-swiss-army-knife-card.js
* Project   : Home Assistant
* Repository: https://github.com/AmoebeLabs/
*
* Author    : Mars @ AmoebeLabs.com
*
* License   : MIT
*
* -----
* Description:
*   The swiss army knife card.
*
* Refs:
*   - https://github.com/AmoebeLabs/swiss-army-knife
*
*******************************************************************************
*/

/*
===========
https://neumorphism.io/#efeeee
 
Background: light color, off-white...
- color: #efeeee,
- intensity 0.2. (higher -> sharper curves. Blur stuff???
- Distance is default 20 en Blur 2*distance in pixels...
- Lightsource is from left-top.

Flat:
-----
border-radius: 50px;
background: #efeeee;
box-shadow:  30px 30px 60px #bfbebe, 
             -30px -30px 60px #ffffff;

Concave:
-----
border-radius: 50px;
background: linear-gradient(145deg, #d7d6d6, #ffffff);
box-shadow:  30px 30px 60px #bfbebe, 
             -30px -30px 60px #ffffff;

Convex:
-----
border-radius: 50px;
background: linear-gradient(145deg, #ffffff, #d7d6d6);
box-shadow:  30px 30px 60px #bfbebe, 
             -30px -30px 60px #ffffff;
Pressed:
-----
border-radius: 50px;
background: #efeeee;
box-shadow: inset 30px 30px 60px #bfbebe, 
            inset -30px -30px 60px #ffffff;           

===========
Like the current cards. darkslategray/wheat. Not background, that is darker.
https://neumorphism.io/#525f62

Flat:
-----
border-radius: 50px;
background: #525f62;
box-shadow:  20px 20px 60px #465153, 
             -20px -20px 60px #5e6d71;

Concave:
-----
border-radius: 50px;
background: linear-gradient(145deg, #4a5658, #586669);
box-shadow:  20px 20px 60px #465153, 
             -20px -20px 60px #5e6d71;

Convex:
-----
border-radius: 50px;
background: linear-gradient(145deg, #586669, #4a5658);
box-shadow:  20px 20px 60px #465153, 
             -20px -20px 60px #5e6d71;
Pressed:
-----
border-radius: 50px;
background: #525f62;
box-shadow: inset 20px 20px 60px #465153, 
            inset -20px -20px 60px #5e6d71;

===========
Steelblue
https://neumorphism.io/#438499

Flat:
-----
border-radius: 50px;
background: #438499;
box-shadow:  20px 20px 40px #397082, 
             -20px -20px 40px #4d98b0;

Concave:
-----
border-radius: 50px;
background: linear-gradient(145deg, #3c778a, #488da4);
box-shadow:  20px 20px 40px #397082, 
             -20px -20px 40px #4d98b0;

Convex:
-----
border-radius: 50px;
background: linear-gradient(145deg, #488da4, #3c778a);
box-shadow:  20px 20px 40px #397082, 
             -20px -20px 40px #4d98b0;
Pressed:
-----
border-radius: 50px;
background: #438499;
box-shadow: inset 20px 20px 40px #397082, 
            inset -20px -20px 40px #4d98b0;   

===========

Darker Steelblue
https://neumorphism.io/#1E546B

mdc colors: https://material.io/resources/color/#!/?view.left=1&view.right=0&primary.color=1E546B&secondary.color=FFE082
Primary - 1e546b
P — Light - 4f8099
P — Dark - 002b40

Secondary - ffe082
S — Light - ffffb3
S — Dark - caae53
Flat:
-----
border-radius: 50px;
background: #1E546B;
box-shadow:  20px 20px 60px #1a475b, 
             -20px -20px 60px #23617b;

Concave:
-----
border-radius: 50px;
background: linear-gradient(145deg, #1b4c60, #205a72);
box-shadow:  20px 20px 60px #1a475b, 
             -20px -20px 60px #23617b;

Convex:
-----
border-radius: 50px;
background: linear-gradient(145deg, #205a72, #1b4c60);
box-shadow:  20px 20px 60px #1a475b, 
             -20px -20px 60px #23617b;
Pressed:
-----
border-radius: 50px;
background: #1E546B;
box-shadow: inset 20px 20px 60px #1a475b, 
            inset -20px -20px 60px #23617b;  

===========
Silver
https://neumorphism.io/#bec5b8

Flat:
-----
border-radius: 50px;
background: #bec5b8;
box-shadow:  20px 20px 40px #a2a79c, 
             -20px -20px 40px #dbe3d4;

Concave:
-----
border-radius: 50px;
background: linear-gradient(145deg, #abb1a6, #cbd3c5);
box-shadow:  20px 20px 40px #a2a79c, 
             -20px -20px 40px #dbe3d4;

Convex:
-----
border-radius: 50px;
background: linear-gradient(145deg, #cbd3c5, #abb1a6);
box-shadow:  20px 20px 40px #a2a79c, 
             -20px -20px 40px #dbe3d4;
Pressed:
-----
border-radius: 50px;
background: #bec5b8;
box-shadow: inset 20px 20px 40px #a2a79c, 
            inset -20px -20px 40px #dbe3d4; 

===========
Lightsteelblue
https://neumorphism.io/#bac8d3

Flat:
-----
border-radius: 50px;
background: #bac8d3;
box-shadow:  20px 20px 40px #9eaab3, 
             -20px -20px 40px #d6e6f3;

Concave:
-----
border-radius: 50px;
background: linear-gradient(145deg, #a7b4be, #c7d6e2);
box-shadow:  20px 20px 40px #9eaab3, 
             -20px -20px 40px #d6e6f3;

Convex:
-----
border-radius: 50px;
background: linear-gradient(145deg, #c7d6e2, #a7b4be);
box-shadow:  20px 20px 40px #9eaab3, 
             -20px -20px 40px #d6e6f3;
Pressed:
-----
border-radius: 50px;
background: #bac8d3;
box-shadow: inset 20px 20px 40px #9eaab3, 
            inset -20px -20px 40px #d6e6f3; 

===========
Wheat
https://neumorphism.io/#e5d7b9

Flat:
-----
border-radius: 50px;
background: #bac8d3;
box-shadow:  20px 20px 40px #9eaab3, 
             -20px -20px 40px #d6e6f3;

Concave:
-----
border-radius: 50px;
background: linear-gradient(145deg, #cec2a7, #f5e6c6);
box-shadow:  20px 20px 40px #c3b79d, 
             -20px -20px 40px #fff7d5;

Convex:
-----
border-radius: 50px;
background: linear-gradient(145deg, #f5e6c6, #cec2a7);
box-shadow:  20px 20px 40px #c3b79d, 
             -20px -20px 40px #fff7d5;
Pressed:
-----
border-radius: 50px;
background: #e5d7b9;
box-shadow: inset 20px 20px 40px #c3b79d, 
            inset -20px -20px 40px #fff7d5;

===========
Lightgray
https://neumorphism.io/#c8cfd4

Flat:
-----
border-radius: 50px;
background: #c8cfd4;
box-shadow:  20px 20px 40px #aab0b4, 
             -20px -20px 40px #e6eef4;

Concave:
-----
border-radius: 50px;
background: linear-gradient(145deg, #b4babf, #d6dde3);
box-shadow:  20px 20px 40px #aab0b4, 
             -20px -20px 40px #e6eef4;

Convex:
-----
border-radius: 50px;
background: linear-gradient(145deg, #d6dde3, #b4babf);
box-shadow:  20px 20px 40px #aab0b4, 
             -20px -20px 40px #e6eef4;
Pressed:
-----
border-radius: 50px;
background: #c8cfd4;
box-shadow: inset 20px 20px 40px #aab0b4, 
            inset -20px -20px 40px #e6eef4;

   
*/

/*jshint esversion: 9 */
/*jshint -W033 */
/*eslint no-undef: "console"*/

import {
  LitElement, html, css, svg
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

import {
  unsafeHTML
} from "https://unpkg.com/lit-html/directives/unsafe-html.js?module";

import {
  unsafeSVG
} from "https://unpkg.com/lit-html/directives/unsafe-svg.js?module";

import 'https://cdn.skypack.dev/@ctrl/tinycolor';
//++ Consts ++++++++++

// Set sizes:
// If svg size is changed, change the font size accordingly.
// These two are related ;-)
const SCALE_DIMENSIONS = 2
const FONT_SIZE = 10 * SCALE_DIMENSIONS;
const SVG_DEFAULT_DIMENSIONS = 200 * SCALE_DIMENSIONS;
const SVG_VIEW_BOX = SVG_DEFAULT_DIMENSIONS;//200;

//--

//++ Class ++++++++++

// https://github.com/hoangnd25/cacheJS
// http://hoangnd.me/blog/cache-your-data-with-javascript-using-cachejs
// Voor caching van data... Deze gebruiken???

//=============================================================================
//=============================================================================
//=============================================================================

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

 /*******************************************************************************
  * Utils class
  *
  * Summary.
  *
  */

class Utils {

 /**
  * _calculateValueBetween()
  *
  * Summary.
  * Clips the val value between start and end, and returns the between value ;-)
  *
  * Note:
  * At start, state values are set to 'null' to make sure it has no value!
  * If such a value is detected, return 0(%) as the relative value.
  * In normal cases, this happens to be the _valuePrev, so 0% is ok!!!!
  */

  static calculateValueBetween(argStart, argEnd, argVal) {
    if (!argVal) return 0;
    return (Math.min(Math.max(argVal, argStart), argEnd) - argStart) / (argEnd - argStart);
  }

  // Calculate own (tool/tool) coordinates relative to centered toolset position.
  // Tool coordinates are %
  //
  // Group is 50,40. Say SVG is 200x200. Group is 100,80 within 200x200.
  // Tool is 10,50. 0.1 * 200 = 20 + (100 - 200/2) = 20 + 0.
  static calculateSvgCoordinate(argOwn, argToolset) {

    return (argOwn / 100) * (SVG_DEFAULT_DIMENSIONS)
            + (argToolset - SVG_DEFAULT_DIMENSIONS/2);
  }


  static calculateSvgDimension(argDimension) {
    return (argDimension / 100) * (SVG_DEFAULT_DIMENSIONS);
  }
}

 /*******************************************************************************
  * Templates class
  *
  * Summary.
  *
  */

class Templates {

 /*******************************************************************************
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

  static replaceVariables2(argVariables, argTemplate) {

    if (!argVariables && !argTemplate.defaults) {
      return argTemplate;
    }
    let variableArray = argVariables?.slice(0) ?? [];

    if (argTemplate.defaults) {
      variableArray = variableArray.concat(argTemplate.defaults);
    }

    let jsonConfig = JSON.stringify(argTemplate[argTemplate.type]);
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
    return JSON.parse(jsonConfig);
  }

}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

class Toolset {
  constructor(argCard, argConfig) {


    this.toolsetId = Math.random().toString(36).substr(2, 9);
    this._card = argCard;
    this.dev = {...this._card.dev};
    //this.dev.debug = this._card.config.dev.debug;
    if (this.dev.performance) console.time("--> "+ this.toolsetId + " PERFORMANCE Toolset::constructor");


    // The position is the absolute position of the GROUP within the svg viewport.
    // The tool is positioned relative to this origin. A tool is always relative
    // to a 200x200 default svg viewport. A (50,50) position of the tool
    // centers the tool on the absolute position of the GROUP!
    this.config = argConfig;
    this.tools=[];

    // Get SVG coordinates.
    this.svg = {};
    this.svg.cx = Utils.calculateSvgCoordinate(argConfig.position.cx, SVG_DEFAULT_DIMENSIONS/2);
    this.svg.cy = Utils.calculateSvgCoordinate(argConfig.position.cy, SVG_DEFAULT_DIMENSIONS/2);

    this.svg.x = (this.svg.cx) - (SVG_DEFAULT_DIMENSIONS / 2);
    this.svg.y = (this.svg.cy) - (SVG_DEFAULT_DIMENSIONS / 2);

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

    const toolsNew = {
      "area": EntityAreaTool,
      "badge": BadgeTool,
      "bar": SparklineBarChartTool,
      "circle": CircleTool,
      "ellipse": EllipseTool,
      "horseshoe": HorseshoeTool,
      "icon": EntityIconTool,
      "line": LineTool,
      "name": EntityNameTool,
      "rectangle": RectangleTool,
      "rectex": RectangleToolEx,
      "segarc": SegmentedArcTool,
      "state": EntityStateTool,
      "slider": RangeSliderTool,
			"usersvg": UserSvgTool,

    }

    this.config.tools.map(toolConfig => {
      var argConfig = {...toolConfig};

      var argPos = { cx: 0 / 100 * SVG_DEFAULT_DIMENSIONS,
                     cy: 0 / 100 * SVG_DEFAULT_DIMENSIONS,
                     scale: this.config.position.scale ? this.config.position.scale : 1 };


      if (this.dev.debug) console.log("Toolset::constructor toolConfig", this.toolsetId, argConfig, argPos);


      const newTool = new toolsNew[toolConfig.type](this._card, argConfig, argPos);
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
  updateValues() {
    if (this.tools) {
      this.tools.map((item, index) => {
        if (true || item.type == "segarc") {
          if (this.dev.debug) console.log('Toolset::updateValues', item, index);
          if ((item.tool.config.hasOwnProperty('entity_index')))
          {
            //if (this.dev.debug) console.log('Toolset::updateValues', typeof item.tool._stateValue);

            item.tool.value = this._card.attributesStr[item.tool.config.entity_index]
                                                ? this._card.attributesStr[item.tool.config.entity_index]
                                                : this._card.entitiesStr[item.tool.config.entity_index];
          }

        }
      });
    }
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

        //console.log("Toolset::firstUpdated, calling item/index", item, index);
        if (item.type == "segarc") {
          if (this.dev.debug) console.log('Toolset::firstUpdated - calling SegmentedArcTool firstUpdated');
          item.tool.firstUpdated(changedProperties);
          //this.tools[index].firstUpdated(changedProperties);
        }

        if (item.type == "slider") {
          if (this.dev.debug) console.log('Toolset::firstUpdated - calling Slider firstUpdated');
          item.tool.firstUpdated(changedProperties);
          //this.tools[index].firstUpdated(changedProperties);
        }

        if (item.type == "icon") {
          if (this.dev.debug) console.log('Toolset::firstUpdated - calling Icon firstUpdated');
          item.tool.firstUpdated(changedProperties);
          //console.log("called firstupdated on icon tool");
          //this.tools[index].firstUpdated(changedProperties);
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
  * The order of transformations are done from the childs perspective!!
  * So, the child (tools) gets positioned FIRST, and then scaled/rotated.
  */
//          transform="scale(${this.transform.scale.x}) rotate(${this.transform.rotate}deg)"
//        <svg x="${this.svg.x}" y="${this.svg.y}">

  // translate 0,0:
  // ipad: right top is on center of card. rest is on the left...
  // chrome: rotated perfectly in center...
  // ipad needs translate 100,-100 at end.
  // ipad needs translate 100,0 at begin (before scale and rotate)
  // wow. Chrome also shows the right scale/rotate when translate(100,0) is at start of transform!!!!
  //
  // No transform-origin="center" anymore. Safari can't handle this??????
  // Pff. translate is for both scale and rotate. Safari handles this different???????
  // With only scale(), translate =(14,14) for both!! NO, translate depends on scale????????
  //
  // Hint: transform-origin not working on safari. Use positions on rotate!!!!
  // https://stackoverflow.com/questions/57732067/css-transform-origin-not-working-for-svg-in-safari

  // translate (28,28)
  //
  // ${100 * this.transform.scale.x}, ${100 * this.transform.scale.x}
  // scale-0.7 translate 28,28. HOw is calculation. 200px size 200/0.7 * 10 ?????
  // NOpe. has also to do with the angle... sigh........
  //
  // scale 0.5 --> translate 50 50 ??? Rotate keeps working with these values. 30/45/90 degrees are all centered on both devices!!

  //          transform="translate(50,50) scale(${this.transform.scale.x}) rotate(${this.transform.rotate.x}, 100, 100)"
  // scale 0.5 translate 100,100
  // scale 0.7 translate 45 45 ???
  // snap er geen reet van (nog)...
  // scale 0.9 translate 10 10. 90% -> 180 pixels. 20 over. iedere kant de helft, dus 10 10
  // scale 0.7, 70% -> 140 pixels. 60 over. iedere kant 30, + helft? dan 45. Huh??
  // scale 0.4. 40% -> 80 pixels. 120 over. iedere kant 60. KOmt nu uit op 150 150 ??? Blijft onduidelijk hoor. 60/0.4 = 150. Toeval???
  //
  // denk dat scale nog moet meewerken in ruimte die over is om te compenseren. met 90% is 10 10 toevallig goed. moet dan 11 11 zijn natuurlijk...
  //
  // dus: pix = scale * 200. Dan pix = 200 - pix. pix = pix/2. pix = pix/scale.
  // pix = .4 * 200 = 80. pix = 200-80=120. pix=120/2 = 60. pix = 60/.4 = 150


  render() {

/*(
    this.transform.rotate.x = 0;
    this.transform.scale.x = this.transform.scale.y = 0.70;

    this.xlate = 0;
    this.xlate = this.transform.scale.x * SVG_DEFAULT_DIMENSIONS ;
    this.xlate = SVG_DEFAULT_DIMENSIONS - this.xlate;
    this.xlate = this.xlate / 2;
    this.xlate = this.xlate / this.transform.scale.x;

    this.xlatex = 0;
    this.xlatex = this.transform.scale.x * this._card.viewBox.width ;
    this.xlatex = this._card.viewBox.width - this.xlatex;
    this.xlatex = this.xlatex / 2;
    this.xlatex = this.xlatex / this.transform.scale.x;

    this.xlatey = 0;
    this.xlatey = this.transform.scale.y * this._card.viewBox.height ;
    this.xlatey = this._card.viewBox.height - this.xlatey;
    this.xlatey = this.xlatey / 2
    this.xlatey = this.xlatey / this.transform.scale.y;

    this.xlatex = this.svg.cx - (50/2);
    this.transform.rotate.x = 45;

    this.xlatex = this.xlatey = 0;
*/
    // voorbeeld
    // vierkant 20x30 op positie 100,40
    // scale 2 betekent vierkant 40,60 op positie 200,80. Die moet dus -100,-40 terug
    //
    // vierkant 20x30 op positie 100,40
    // scale 0.7 betekent vierkant 14,21 op positie 70,28. Die moet 30,12 terug.
    //
    // hoe kome je nu op die berekening?? Heeft niks met breedte/hoogte te maken blijkt.
    // scale gaat ook  niet vanuit middelpunt, maar vanuit linkerbovenkant.
    // scale gaat niet goed samen met rotate. wat gebeurt er dan afhankelijk van de hoek?? Moet je dan x en y wijzigen met sin/cos ofzo??

//    if (this.dev.debug) console.log("Toolset::render, xlate, x, y", this.xlate, this.xlatex, this.xlatey);
//        <g transform="translate(${this.svg.x}, ${this.svg.y})">
//          <g class="grp" transform="translate(${this.svg.x}, ${this.svg.y})">
//         transform="rotate(${this.transform.rotate.x}, ${200/2}, ${200/2}) scale(${this.transform.scale.x}) translate(${xlate},${xlate})"

//         transform="rotate(${this.transform.rotate.x}, ${this.svg.cx}, ${this.svg.cy}) scale(${this.transform.scale.x}) translate(${this.xlatex},${this.xlatey})"

//         transform="rotate(${this.transform.rotate.x}) scale(${this.transform.scale.x}) translate(${this.xlatex},${this.xlatey})"


    // Again, Apple proves that their browser just doens't follow the standards like other browsers.
    // Although some things seem to work, a combination of scale/rotate and Safari goes berserk.

    // So separate settings for Safari and any other browser...

    // Note:
    // Rotating a card can produce different results on several browsers.
    // A 1:1 card / toolset gives the same results, but other aspect ratio's may give different results.

    //# TODO:
    // Apply toolset styles to the svg styles.
    // One of the things can be a colorswatch, a filter, etc...

    if ((this._card.isSafari) || (this._card.iOS)) {
      //
      // Safari seems to ignore - although not always - the transform-box:fill-box setting.
      // - It needs the explicit center point when rotating. So this is added to the rotate() command.
      // - scale around center uses the "move object to 0,0 -> scale -> move object back to position" trick, where the second move takes scaling into account!
      // - Does not apply transforms from the child's point of view. Transform of toolset_position MUST take scaling of one level higher into account!
      //
      // Note: rotate is done around the defined center (cx,cy) of the toolsets position!
      //
//           style="transform-origin:center; transform-box:fill-box;">

/*           transform="
                      translate(-${this.svg.cx},-${this.svg.cy}) scale(${this.transform.scale.x}) translate(${this.svg.cx/this.transform.scale.x},${this.svg.cy/this.transform.scale.y})
                      rotate(${this.transform.rotate.x}, ${this.svg.cx}, ${this.svg.cy})
                      "
           style="transform-origin:center;">
*/
      // NTS:
      // Safari NEEDS the overflow:visible on the <svg> element, as it defaults to "svg:{overflow: hidden;}".
      // Other browsers don't need that, they default to: "svg:not(:root) {overflow: hidden;}"
      //
      // Without this setting, objects are cut-off or become invisible while scaled!
			
      return svg`
        <g id="toolset-${this.toolsetId}" class="toolset"
           transform="rotate(${this.transform.rotate.x}, ${this.svg.cx}, ${this.svg.cy})
                      scale(${this.transform.scale.x}, ${this.transform.scale.y})
                      "
           style="transform-origin:center;">
          <svg style="overflow:visible;">
            <g class="toolset_position" transform="translate(${this.svg.cx/this.transform.scale.x}, ${this.svg.cy/this.transform.scale.y})">
              ${this.renderToolset()}
            </g>
            </svg>
        </g>
      `;

    } else {
      //
      // Any other browser follows the standards:
      // - using transform-box:fill-box to make sure every transform is about the object itself!
      // - applying the rules seen from the child's point of view. So the transform on the toolset_position is NOT scaled, as the scaling is done one level higher.
      //
      // Note: rotate is done around the center of the bounding box. This might NOT be the toolsets center (cx,cy) position!
      //
      return svg`
        <g id="toolset-${this.toolsetId}" class="toolset"
           transform="rotate(${this.transform.rotate.x}) scale(${this.transform.scale.x}, ${this.transform.scale.y})"
           style="transform-origin:center; transform-box:fill-box;">
          <svg style="overflow:visible;">
            <g class="toolset_position" transform="translate(${this.svg.cx}, ${this.svg.cy})">
              ${this.renderToolset()}
            </g>
            </svg>
        </g>
      `;

    }
  }
} // END of class

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

class BaseTool {
  constructor(argCard, argConfig, argPos) {


    this.toolId = Math.random().toString(36).substr(2, 9);
    this._card = argCard;
    //console.time("--> "+ this.toolId + " PERFORMANCE BaseTool::constructor");

    this.dev = {...this._card.dev};

    // The position is the absolute position of the GROUP within the svg viewport.
    // The tool is positioned relative to this origin. A tool is always relative
    // to a 200x200 default svg viewport. A (50,50) position of the tool
    // centers the tool on the absolute position of the GROUP!
    this.toolsetPos = argPos;

    // Get SVG coordinates.
    this.svg = {};
    this.svg.cx = Utils.calculateSvgCoordinate(argConfig.cx, this.toolsetPos.cx);
    this.svg.cy = Utils.calculateSvgCoordinate(argConfig.cy, this.toolsetPos.cy);

    this.svg.cx = Utils.calculateSvgCoordinate(argConfig.cx, 0);
    this.svg.cy = Utils.calculateSvgCoordinate(argConfig.cy, 0);

    //this.dimensions = {};
    this.svg.height = argConfig.height ? Utils.calculateSvgDimension(argConfig.height) : 0;
    this.svg.width = argConfig.width ? Utils.calculateSvgDimension(argConfig.width) : 0;

    this.svg.x = (this.svg.cx) - (this.svg.width / 2);
    this.svg.y = (this.svg.cy) - (this.svg.height / 2);
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
    if (this._stateValue?.toLowerCase() == localState.toLowerCase()) return false;

    // testing calculated value
    if (this.config.custom_value) {
      const someValue = new Function('states', 'entity', 'user', 'hass', `'use strict'; ${this.config.custom_value.slice(4, -4)}`).call(
        this,
        this._card._hass.states,
        this._card.entities[this.config.entity_index],
        this._card._hass.user,
        this._card._hass,
      );
      //console.log("BaseTool::set value contains CUSTOM VALUE", this.config.custom_value, someValue);
      localState = someValue;
    }
    //console.log("BaseTool::set value contains localState", localState);

    this._stateValuePrev = this._stateValue || localState;
    this._stateValue = localState;
    this._stateValueIsDirty = true;
    //console.log("BaseTool::set value contains localState", localState, this._stateValuePrev, this._stateValue);

    // If animations defined, calculate style for current state.

    if (this._stateValue == 'undefined') return;
    if (typeof(this._stateValue) === 'undefined') return;

    var isMatch = false;
    if (this.config.animations) Object.keys(this.config.animations).map(animation => {
      const entityIndex = this.config.entity_index;
      var item = this.config.animations[animation];

      if (isMatch) return true;

      // #TODO:
      // Default is item.state. But can also be item.custom_field[x], so you can compare with custom value
      // Should index then not with item.state but item[custom_field[x]].toLowerCase() or similar...
      // Or above, with the mapping of tghe item using the name?????

      // Assume equals operator if not defined...
      //console.log("set value(state), state, statevalue, item", state, this._stateValue, item.state);
      var operator = item.operator ? item.operator : "=";
      switch(operator) {
        case "=":
          isMatch = this._stateValue.toLowerCase() == item.state.toLowerCase();
          break;
        case "!=":
          isMatch = this._stateValue.toLowerCase() != item.state.toLowerCase();
          break;
        case ">":
          isMatch = Number(this._stateValue.toLowerCase()) > Number(item.state.toLowerCase());
          break;
        case "<":
          isMatch = Number(this._stateValue.toLowerCase()) < Number(item.state.toLowerCase());
          break;
        case ">=":
          isMatch = Number(this._stateValue.toLowerCase()) >= Number(item.state.toLowerCase());
          break;
        case "<=":
          isMatch = Number(this._stateValue.toLowerCase()) <= Number(item.state.toLowerCase());
          break;
        default:
          // Unknown operator. Just do nothing and return;
          isMatch = false;
      }
      // if animation state not equals sensor state, return... Nothing to animate for this state...
      //if (this._stateValue.toLowerCase() != item.state.toLowerCase()) return;
      if (this.dev.debug) console.log('EntityStateTool, animation, match, value, config, operator', isMatch, this._stateValue, item.state, item.operator);
      if (!isMatch) return true;

      if (!this.animationStyle || !item.reuse) this.animationStyle = {};
      //this.animationStyle = Object.assign(this.animationStyle, ...item.styles);
      this.animationStyle = {...this.animationStyle, ...item.styles};
			
			// Can this work?????????????????
			this.item = item;
    });

    return true;

  }

}

 /*******************************************************************************
  * RangeSliderTool class
  *
  * Summary.
  *
  */

class RangeSliderTool extends BaseTool {
  constructor(argCard, argConfig, argPos) {


    const DEFAULT_SLIDER_CONFIG = {
        orientation: 'horizontal',
        length: 80,
        styles: {
          "slider": {
            "stroke-linecap": 'round;',
            "stroke": 'var(--primary-text-color);',
            "opacity": '1.0;',
            "stroke-width": '2;'
          },
        }
    }

    super(argCard, argConfig, argPos);

    this.config = {...DEFAULT_SLIDER_CONFIG};
    this.config = {...this.config, ...argConfig};

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_SLIDER_CONFIG.styles, ...this.config.styles};

    if (argConfig.show) this.config.show = Object.assign(...argConfig.show);
    this.config.show = {...DEFAULT_SLIDER_CONFIG.show, ...this.config.show};

    this.config.entity_index = this.config.entity_index ? this.config.entity_index : 0;

    this.svg.length = Utils.calculateSvgDimension(argConfig.length)

    this.svg.handle = {};
    this.svg.handle.width = Utils.calculateSvgDimension(argConfig.handle.width);
    this.svg.handle.height = Utils.calculateSvgDimension(argConfig.handle.height);
    this.svg.handle.popout = Utils.calculateSvgDimension(argConfig.handle.popout);

    // Define the bounding box for the pointer / touch events to get detected.

    if (this.config.orientation == 'vertical') {
      this.svg.x1 = this.svg.cx;
      this.svg.y1 = this.svg.cy - this.svg.length/2;
      this.svg.x2 = this.svg.cx;
      this.svg.y2 = this.svg.cy + this.svg.length/2;
      this.svg.width = this.svg.handle.width;
      this.svg.height = this.svg.length;
    } else {
      this.svg.x1 = this.svg.cx - this.svg.length/2;
      this.svg.y1 = this.svg.cy;
      this.svg.x2 = this.svg.cx + this.svg.length/2;
      this.svg.y2 = this.svg.cy;
      this.svg.width = this.svg.length;
      this.svg.height = this.svg.handle.height;
    }

    this.svg.scale = {};
    this.svg.scale.min = this.valueToSvg(this, this.config.scale.min);
    this.svg.scale.max = this.valueToSvg(this, this.config.scale.max);

  // Specific rangeslider stuff...
    this.elements = {};
    //this.config.handle.popout = 40;
    this.deformation = this.svg.handle.popout/4;
    this.target = this.svg.handle.popout;
    this._value = null;
    this.dragging = false;

    this.SVG_NS = "http://www.w3.org/2000/svg";
    this.SVG_XLINK = "http://www.w3.org/1999/xlink";
    this.rid = null;
    //this.m = { x: 100, y: this.svg.y + this.svg.handle.popoutt / 2 };
    this.m = { x: svg.x1, y: this.svg.y1};

    // hardcoded for testing.
    // value in box is in steps of 5. So 0..100 is 0,5, 10, etc..
    this.stepValue = 2;
    this.velocity = 10;
  //--

    if (this.dev.debug) console.log('RangeSliderTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  // svg coordinates to actual slider value
  svgToValue(argThis, m) {
    // svg is within viewbox / slider size
    // length is argThis.svg.length


    // is m.x in svg x1/x2 range. Then translate to actual value.
    // need scale.min / max...

    if (argThis.config.orientation == 'horizontal') {
      var xpos = m.x - argThis.svg.x1;
      var xposp = xpos / argThis.svg.length;
      var state = ((argThis.config.scale.max - argThis.config.scale.min) * xposp) + argThis.config.scale.min;
      //var state = Utils.calculateValueBetween(argThis.config.scale.min, argThis.config.scale.max, xposp);
      if (this.dev.debug) console.log ('SLIDER - svgToValue results)', xpos, xposp, state);
      return state;
    } else if (argThis.config.orientation == 'vertical') {
      // y is calculated from lower y value. So slider is from bottom to top...
      var ypos = argThis.svg.y2 - m.y;
      var yposp = ypos / argThis.svg.length;
      var state = ((argThis.config.scale.max - argThis.config.scale.min) * yposp) + argThis.config.scale.min;
      //var state = Utils.calculateValueBetween(argThis.configscale.min, argThis.configscale.max, yposp);
      if (this.dev.debug) console.log ('SLIDER - svgToValue results)', xpos, xposp, state);
      return state;
    }
  }

  valueToSvg(argValue) {

    if (this.config.orientation == 'horizontal') {
      var state = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, argValue);

      var xposp = state * this.svg.length;
      var xpos = this.svg.x1 + xposp;
      return xpos;
    } else if (this.config.orientation == 'vertical') {
      var state = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, argValue);

      var yposp = state * this.svg.length;
      var ypos = this.svg.y2 + yposp;
      return ypos;
    }
  }

  updateValue() {
    let dist = this.target - this._value;
    let vel = dist / this.velocity;
    this._value += vel;
    //improvement
    if (Math.abs(dist) < 0.01) {
      if (this.rid) {
        window.cancelAnimationFrame(this.rid);
        this.rid = null;
      }
    }
  }

  updatePath(argThis, m) {
    // HORIZONTAL
    if (argThis.config.orientation == 'horizontal') {
      //argThis.d = argThis.curvedPath(m.x, argThis.svg.y + argThis.svg.handle.popout / 1000, argThis.deformation, argThis._value);
      argThis.d = argThis.curvedPath(m.x, argThis.svg.y + argThis.svg.handle.height / 2, argThis.deformation, argThis._value);
      argThis.elements.path.setAttributeNS(null, "d", argThis.d);

      argThis.elements.thumb.setAttributeNS(null, "r", 1 + argThis._value / 3);
      argThis.elements.thumb.setAttributeNS(null, "cx", m.x);
    } //VERTICAL
    else if (argThis.config.orientation == 'vertical') {
//      argThis.d = argThis.curvedPath(m.x + argThis.svg.handle.width / 2, argThis.svg.y, argThis.deformation, argThis._value);
      argThis.d = argThis.curvedPath(argThis.svg.x + argThis.svg.handle.width / 2, m.y, argThis.deformation, argThis._value);
      argThis.elements.path.setAttributeNS(null, "d", argThis.d);
      argThis.elements.thumb.setAttributeNS(null, "r", 1 + argThis._value / 3);
      argThis.elements.thumb.setAttributeNS(null, "cy", m.y);
    }

    argThis.updateLabel(argThis, m);
    argThis.updateInput(m);
  }

  updateLabel(argThis, m) {
    if (this.dev.debug) console.log('SLIDER - updateLabel start', m, argThis.config.orientation);
    if (argThis.config.orientation == 'horizontal') {

      // The -30 is for correction width of box around label??????

      argThis.elements.label.setAttributeNS(
        null,
        "transform",
        `translate(${m.x - this.svg.handle.width/2},${argThis.svg.y /*- argThis.svg.handle.popout/100*/ - argThis._value}) scale(1)`
      );
      argThis.elements.text.textContent = Math.round(argThis.svgToValue(argThis, m));
      if (this.dev.debug) console.log('SLIDER - updateLabel horizontal', m, argThis.svgToValue(argThis, m));

    } else if (argThis.config.orientation == 'vertical') {
      argThis.elements.label.setAttributeNS(
        null,
        "transform",
        `translate(${argThis.svg.x /*- argThis.svg.handle.popout*/ - argThis._value}, ${m.y - this.svg.handle.height/2}) scale(1)`
      );

      argThis.elements.text.textContent = Math.round(argThis.svgToValue(argThis, m));
      if (this.dev.debug) console.log('SLIDER - updateLabel vertical', m, argThis.svgToValue(argThis, m));
    }
  }

  // What does this function do?? Need??
  // Is this the actual html input value that is set?? Guess so..
  updateInput(m) {
    //this.inputElement.value = Math.round(m.x);
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



  // HELPERS

   /*
   * Draw curved path with popout at centered & mouse position
   *
   * Horizontal:
   * - x = mouse position
   * - y = fixed y position of slider
   * - deform = deformation of Q control points
   * - popout = current value (using animation) of popout in -y direction
   *
   * Vertical:
   * - x = fixed x position of slider
   * - y = mouse position
   * - deform = deformation of Q control points
   * - popout = current value (using animation) of popout in -x direction
   *
   */
   curvedPath(argX, argY, argDeform, argPopout) {

    if (this.dev.debug) console.log("SLIDER - curvedPath, args", argX, argY, argDeform, argPopout);
    const offset = this.svg.y1;

    // HORIZONTAL
    if (this.config.orientation == 'horizontal') {
      // Coordinates are clipped between the start and end of the slider, svg.x1 and svg.x2
      var D = { cx: Math.max(this.svg.x1, Math.min(argX,                  this.svg.x2)), cy: argY - argPopout, r: 1 };
      var B = { cx: Math.max(this.svg.x1, Math.min(D.cx - argDeform,      this.svg.x2)), cy: argY,        r: 1 };
      var F = { cx: Math.max(this.svg.x1, Math.min(D.cx + argDeform,      this.svg.x2)), cy: argY,        r: 1 };
      var A = { cx: Math.max(this.svg.x1, Math.min(D.cx - 2 * argDeform,  this.svg.x2)), cy: argY,        r: 1 };
      var G = { cx: Math.max(this.svg.x1, Math.min(D.cx + 2 * argDeform,  this.svg.x2)), cy: argY,        r: 1 };

      var S = this.svg.x1;
      var U = argY;

      var T = this.svg.x2;
      var V = A.cy;
      V = argY;

    } // VERTICAL
    else if (this.config.orientation == 'vertical') {
      // Coordinates are clipped between the bottom and top of the slider, svg.y1 and svg.y2

      var D = { cy: Math.max(this.svg.y1, Math.min(argY,                  this.svg.y2)), cx: argX - argPopout, r: 1 };
      var B = { cy: Math.max(this.svg.y1, Math.min(D.cy - 1 * argDeform,  this.svg.y2)), cx: argX,        r: 1 };
      var F = { cy: Math.max(this.svg.y1, Math.min(D.cy + 1 * argDeform,  this.svg.y2)), cx: argX,          r: 1 };
      var A = { cy: Math.max(this.svg.y1, Math.min(D.cy - 2 * argDeform,  this.svg.y2)), cx: argX,        r: 1 };
      var G = { cy: Math.max(this.svg.y1, Math.min(D.cy + 2 * argDeform,  this.svg.y2)), cx: argX,        r: 1 };

      var S = this.svg.y1;
      var T = this.svg.y2;
      var U = argX;

      S = A.cx;
      U = this.svg.y1;

      T = argX;
      V = this.svg.y2;
      //T = 50;
      //V = 50;
    }
    let C = this.interpolatePoint(B, D, 1, 2);
    C.r = 1;
    let E = this.interpolatePoint(D, F, 1, 2);
    E.r = 1;

    // Draw the horizontal start slider, then the 3 Q curves, and the rest of the horizontal slider.
    return `M${S},${U} L${A.cx},${A.cy}
                Q${B.cx},${B.cy} ${C.cx},${C.cy}
                Q${D.cx},${D.cy} ${E.cx},${E.cy}
                Q${F.cx},${F.cy} ${G.cx},${G.cy}
                L${T},${V} L${S+1}, ${U+1}
  `;
  }

   interpolatePoint(a, b, i, n) {
    //point a
    //point b
    //line divided in n segments
    //find the i-th point

    if (this.config.orientation == 'horizontal') {
      var o = {
        cx: a.cx + (b.cx - a.cx) * (i / n),
        cy: a.cy + (b.cy - a.cy) * (i / n)
      }
    }
    else if (this.config.orientation == 'vertical') {
      var o = {
        cx: a.cx + (b.cx - a.cx) * (i / n),
        cy: a.cy + (b.cy - a.cy) * (i / n)
      }
    }
    return o;
  }

  firstUpdated(changedProperties)
  {
    const thisValue = this;

    function Frame() {
      thisValue.rid = window.requestAnimationFrame(Frame);
      thisValue.updateValue();
      thisValue.updatePath(thisValue, thisValue.m);
      //if (this.dev.debug) console.log('pointer in Frame', thisValue.m);
    }

    if (this.dev.debug) console.log('slider - firstUpdated');
    // #TODO
    // svg moet een svg object zijn, want er worden functies op uitgevoerd.
    // dus deze slider moet een eigen svg element krijgen...
    this.elements.svg = this._card.shadowRoot.getElementById("rangeslider-".concat(this.toolId));

//    this.svg = document.querySelector("svg");
    this.elements.path = this.elements.svg.querySelector("path");
    this.elements.thumb = this.elements.svg.querySelector("circle");
//    this.thumb = _2.querySelector("circle");

    if (true) {
      this.elements.label = this.elements.svg.querySelector("#_2 path#label-".concat(this.toolId));
      this.elements.text = this.elements.svg.querySelector("#_2 text textPath");
    } else {
      this.elements.label = this.elements.svg.querySelector("#_2 rect");
      this.elements.text = this.elements.svg.querySelector("#_2 text");
    }

    if (this.dev.debug) console.log('slider - firstUpdated svg = ', this.elements.svg, 'path=', this.elements.path, 'thumb=', this.elements.thumb, 'label=', this.elements.label, 'text=', this.elements.text);

//    this.inputElement = witness; ////


    this.elements.svg.addEventListener("pointerdown", e => {
      this.dragging = true;
      this.m = this.oMousePosSVG(e);
      //this.m.x = Math.round(this.m.x / this.stepValue) * this.stepValue;
      //if (this.dev.debug) console.clear();
      if (this.dev.debug) console.log('pointerDOWN',Math.round(this.m.x * 100) / 100);
      this.target = this.svg.handle.popout;
      Frame();
    });

    this.elements.svg.addEventListener("pointerup", () => {
      this.dragging = false;
      this.target = 0;
      if (this.dev.debug) console.log('pointerUP');
      Frame();
      //this.updatePath(m,deformation);
    });

    this.elements.svg.addEventListener("pointerout", () => {

      this.dragging = false;
      this.target = 0;
      if (this.dev.debug) console.log('pointerOUT');
      Frame();
    });

    this.elements.svg.addEventListener("pointermove", e => {
      if (this.dragging) {
        this.m = this.oMousePosSVG(e);

        // Clip pointer to scale.
        //this.m.x = Math.max(this.svg.scale.min, Math.min(this.m.x, this.svg.scale.max));
        //this.m.x = Math.round(this.m.x / this.stepValue) * this.stepValue;
        //this.m.x = Math.max(10, Math.min(this.m.x, 90.0));
        //this.m.x = Math.round(this.m.x / this.stepValue) * this.stepValue;

        //console.clear();
        if (this.dev.debug) console.log('pointerMOVE', this.m.x, Math.round(this.m.x * 100) / 100);
        this.target = this.svg.handle.popout;
        Frame();
      }
    });

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

    console.log('rangeslidertool, animation, set value', state);

    // What to do here??
    // We must know the domain or attribute to know what to do.
    // Light domain --> do something with brightness etc.

    // Or: in YAML: set translation range, 0..255 for brightness -> 0..100%.

    // for now: use external range for internal scale. No conversion for now. just testing

    return changed;
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

    // Get configuration styles as the default styles
    let configStyle = {...this.config.styles};

    // Get the runtime styles, caused by states & animation settings
    let stateStyle = {};
    //if (this._card.animations.lines[this.config.animation_id])
    //  stateStyle = Object.assign(stateStyle, this._card.animations.lines[this.config.animation_id]);

    // Merge the two, where the runtime styles may overwrite the statically configured styles
    configStyle = { ...configStyle, ...stateStyle};

    // Convert javascript records to plain text, without "{}" and "," between the styles.
    const configStyleStrSlider = JSON.stringify(configStyle.slider).slice(1, -1).replace(/"/g,"").replace(/,/g,"");
    const configStyleStrHandle = JSON.stringify(configStyle.handle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

    const toRender = []
    //toRender.push(html`<input type="range" id="witness" value="50" disabled style="display:none">`);

    // Calculate startOffset for text along path. Get it about centered along topside of rectangle...
    const startOffset = 100/2 * (this.svg.handle.width / ((this.svg.handle.width * 2) + (this.svg.handle.height * 2)));

//          <path d="M${this.svg.x1},${this.svg.y1} L${this.svg.x2},${this.svg.y1}" stroke="var(--theme-gradient-color-01)" stroke-width="5" fill="var(--theme-gradient-color-03)" pointer-events="none"

    toRender.push(svg`
        <g id="poep-${this.toolId}" >
          <rect x="${this.svg.x1}" y="${this.svg.y1}" width="${this.svg.width}" height="${this.svg.height}" style="fill: none" pointer-events="all"/>

          <path d="M1,1 L20,20" stroke="var(--theme-gradient-color-01)" stroke-width="5" fill="var(--theme-gradient-color-03)" pointer-events="none" stroke-linecap="round"/>
          <g id="_2" pointer-events="none">
            <path id="label-${this.toolId}" transform="translate(100,220) scale(5)"
              d="M 0 0 h ${this.svg.handle.width} v ${this.svg.handle.height} h -${this.svg.handle.width} v -${this.svg.handle.height}"
              style="fill: var(--theme-gradient-color-01); stroke: grey; stroke-width:2" style="${configStyleStrSlider}"/>

            <circle cx="${this.svg.x}" cy="${this.svg.y}" r="1" fill="none" pointer-events="none"/>

            <text text-anchor="middle" transform="translate(0,${this.svg.handle.height/4})" pointer-events="none" >
            <textPath startOffset="${startOffset}%" text-anchor="middle" alignment-baseline="middle" style="${configStyleStrHandle}" href="#label-${this.toolId}" pointer-events="none">
            50
            </textPath>
          </g>
        </g>
      `);
    return toRender;
  }

 /*******************************************************************************
  * RangeSliderTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
// viewbox="0,0,400,400"
    return svg`
      <svg  xmlns="http://www.w3.org/2000/svg" id="rangeslider-${this.toolId}" class="rangeslider" pointer-events="all"
      >
        ${this._renderRangeSlider()}
      </svg>
    `;

    return svg`
      <svg viewbox="-10,-100,400,400" id="rangeslider-${this.toolId}" class="rangeslider" pointer-events="all"
      >
        ${this._renderRangeSlider()}
      </svg>
    `;

    return svg`
      <g id="rangeslider-${this.toolId}" class="rangeslider"
        @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])} >
        ${this._renderRangeSlider()}
      </g>
    `;

  }
} // END of class


 /*******************************************************************************
  * LineTool class
  *
  * Summary.
  *
  */

class LineTool extends BaseTool {
  constructor(argCard, argConfig, argPos) {

    const DEFAULT_LINE_CONFIG = {
        orientation: 'vertical',
				length: '10',
        styles: {
          "stroke-linecap": 'round;',
          "stroke": 'var(--primary-text-color);',
          "opacity": '1.0;',
          "stroke-width": '2;'
        }
    }

    super(argCard, argConfig, argPos);

    this.config = {...DEFAULT_LINE_CONFIG};
    this.config = {...this.config, ...argConfig};

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_LINE_CONFIG.styles, ...this.config.styles};

    if (argConfig.show) this.config.show = Object.assign(...argConfig.show);
    this.config.show = {...DEFAULT_LINE_CONFIG.show, ...this.config.show};

    this.config.entity_index = this.config.entity_index ? this.config.entity_index : 0;

    if ((this.config.orientation == 'vertical') || (this.config.orientation == 'horizontal'))
        this.svg.length = Utils.calculateSvgDimension(argConfig.length);

    if (this.config.orientation == 'fromto') {
      this.svg.x1 = Utils.calculateSvgCoordinate(argConfig.x1, this.toolsetPos.cx);
      this.svg.y1 = Utils.calculateSvgCoordinate(argConfig.y1, this.toolsetPos.cy);
      this.svg.x2 = Utils.calculateSvgCoordinate(argConfig.x2, this.toolsetPos.cx);
      this.svg.y2 = Utils.calculateSvgCoordinate(argConfig.y2, this.toolsetPos.cy);
    }

    if (this.config.orientation == 'vertical') {
      this.svg.x1 = this.svg.cx;
      this.svg.y1 = this.svg.cy - this.svg.length/2;
      this.svg.x2 = this.svg.cx;
      this.svg.y2 = this.svg.cy + this.svg.length/2;
    } else if (this.config.orientation == 'horizontal') {
      this.svg.x1 = this.svg.cx - this.svg.length/2;
      this.svg.y1 = this.svg.cy;
      this.svg.x2 = this.svg.cx + this.svg.length/2;
      this.svg.y2 = this.svg.cy;
    } else if (this.config.orientation == 'fromto') {
      this.svg.x1 = this.svg.x1;
      this.svg.y1 = this.svg.y1;
      this.svg.x2 = this.svg.x2;
      this.svg.y2 = this.svg.y2;
    }
    if (this.dev.debug) console.log('LineTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

 /*******************************************************************************
  * LineTool::_renderLine()
  *
  * Summary.
  * Renders the line using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the line
  *
  */

  _renderLine() {

    // Get configuration styles as the default styles
    let configStyle = {...this.config.styles};

    // Get the runtime styles, caused by states & animation settings
/*
    let stateStyle = {};
    if (this._card.animations.lines[this.config.animation_id])
      stateStyle = Object.assign(stateStyle, this._card.animations.lines[this.config.animation_id]);
*/

    // Merge the two, where the runtime styles may overwrite the statically configured styles
    //configStyle = { ...configStyle, ...stateStyle};
    configStyle = { ...configStyle, ...this.animationStyle};

    // Convert javascript records to plain text, without "{}" and "," between the styles.
    const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

    if (this.dev.debug) console.log('_renderLine POEP', this.config.orientation, this.svg.x1, this.svg.y1, this.svg.x2, this.svg.y2);
    return svg`
      <line
        x1="${this.svg.x1}"
        y1="${this.svg.y1}"
        x2="${this.svg.x2}"
        y2="${this.svg.y2}"
        style="${configStyleStr}"/>
      `;
  }

 /*******************************************************************************
  * LineTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {

    return svg`
      <g id="line-${this.toolId}" class="line"
        @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])} >
        ${this._renderLine()}
      </g>
    `;

  }
} // END of class

 /*******************************************************************************
  * CircleTool class
  *
  * Summary.
  *
  */

class CircleTool extends BaseTool {
  constructor(argCard, argConfig, argPos) {

    const DEFAULT_CIRCLE_CONFIG = {
        cx: 50,
        cy: 50,
        radius: 50,

    }

    super(argCard, argConfig, argPos);

    this.config = {...DEFAULT_CIRCLE_CONFIG};
    this.config = {...this.config, ...argConfig};

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_CIRCLE_CONFIG.styles, ...this.config.styles};

    if (argConfig.show) this.config.show = Object.assign(...argConfig.show);
    this.config.show = {...DEFAULT_CIRCLE_CONFIG.show, ...this.config.show};

    this.config.entity_index = this.config.entity_index ? this.config.entity_index : 0;

    this.svg.radius = Utils.calculateSvgDimension(argConfig.radius)

    if (this.dev.debug) console.log('CircleTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
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

    // Get configuration styles as the default styles
    let configStyle = {...this.config.styles};

    // Get the runtime styles, caused by states & animation settings
    //let stateStyle = {};
    //if (this._card.animations.circles[this.config.animation_id])
    //  stateStyle = Object.assign(stateStyle, this._card.animations.circles[this.config.animation_id]);

    // Merge the two, where the runtime styles may overwrite the statically configured styles
    //configStyle = { ...configStyle, ...stateStyle, ...this.animationStyle};
    configStyle = { ...configStyle, ...this.animationStyle};

    // Convert javascript records to plain text, without "{}" and "," between the styles.
    const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

    return svg`
      <circle ""
        cx="${this.svg.cx}"% cy="${this.svg.cy}"% r="${this.svg.radius}"
        style="${configStyleStr}"/>
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

// We need transform-origin for animations. Works also on Safari. But why not working on safari for rotate etc.???
//        <g "" id="circle-${this.toolId}" class="circle" transform-origin="${this.svg.cx}px ${this.svg.cy}px"

    return svg`
      <g "" id="circle-${this.toolId}" class="circle" overflow="visible" transform-origin="${this.svg.cx} ${this.svg.cy}"
        @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])} >
        ${this._renderCircle()}
      </g>
    `;

  }
} // END of class

 /*******************************************************************************
  * UserSvgTool class, UserSvgTool::constructor
  *
  * Summary.
  *
  */

class UserSvgTool extends BaseTool {
  constructor(argCard, argConfig, argPos) {

    const DEFAULT_USERSVG_CONFIG = {
        cx: 50,
        cy: 50,
				height: 50,
				width: 50,
    }

    super(argCard, argConfig, argPos);

    this.config = {...DEFAULT_USERSVG_CONFIG};
    this.config = {...this.config, ...argConfig};

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_USERSVG_CONFIG.styles, ...this.config.styles};

    if (argConfig.show) this.config.show = Object.assign(...argConfig.show);
    this.config.show = {...DEFAULT_USERSVG_CONFIG.show, ...this.config.show};

    this.config.entity_index = this.config.entity_index ? this.config.entity_index : 0;

		// Check for external svg images. These are defined as <defs> to be used as a reference using <use>.
		// This makes animations possible by setting the image, which is implemented as a reference using <use href(#id in defs)>
		
		if (this.config.images) {
			this.image = this.config.images[0]["face1"];
		}

    this.images = {};
		this.images = Object.assign({}, ...this.config.images);

		this.item = {};
		this.item.image = "face1";
		// console.log("usersvg, images, image", this.images, this.item);
		
		
    if (this.dev.debug) console.log('UserSvgTool constructor coords, dimensions', this.svg, this.config);
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

  _renderUserSvg() {

    // Get configuration styles as the default styles
    let configStyle = {...this.config.styles};

    // Get the runtime styles, caused by states & animation settings
    //let stateStyle = {};
    //if (this._card.animations.circles[this.config.animation_id])
    //  stateStyle = Object.assign(stateStyle, this._card.animations.circles[this.config.animation_id]);

    // Merge the two, where the runtime styles may overwrite the statically configured styles
    //configStyle = { ...configStyle, ...stateStyle, ...this.animationStyle};
    configStyle = { ...configStyle, ...this.animationStyle};

    // Convert javascript records to plain text, without "{}" and "," between the styles.
    const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

		// let svgItems = [];
		// if (this.config.images) {
			// this.config.images.map((item, index) ==> {
				// svgItems.push(#HIERO
			// });
		// }

		// console.log("renderusersvg, images, image", this.images, this.item);
		return svg`
			<svg x="${this.svg.x}" y="${this.svg.y}">
				<image href="${this.images[this.item.image]}" height="${this.svg.height}" width="${this.svg.width}"/>
			</svg>
			`;

		// return svg`
			// <svg x="${this.svg.x}" y="${this.svg.y}">
				// <image href="/local/images/ic-face-1.svg" height="${this.svg.height}" width="${this.svg.width}"/>
			// </svg>
			// `;
				
    // return svg`
      // <svg height="100px" width="100px"
        // x="${this.svg.cx}"% y="${this.svg.cy}"%
					// <use href="${this.images[this.image]}"></use>
				// </svg>
      // `;
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
      <g "" id="circle-${this.toolId}" class="circle" overflow="visible" transform-origin="${this.svg.cx} ${this.svg.cy}"
        @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])} >
        ${this._renderUserSvg()}
      </g>
    `;

  }
} // END of class

 /*******************************************************************************
  * RectangleTool class
  *
  * Summary.
  *
  */

class RectangleTool extends BaseTool {
  constructor(argCard, argConfig, argPos) {

    const DEFAULT_RECTANGLE_CONFIG = {
        cx: 50,
        cy: 50,
        width: 50,
        height: 50,
        rx: 0,
        styles: {
          "stroke-linecap": 'round;',
          "stroke": 'var(--primary-text-color);',
          "opacity": '1.0;',
          "stroke-width": '2;',
          "fill": 'white',
        }
    }

    super(argCard, argConfig, argPos);

    this.config = {...DEFAULT_RECTANGLE_CONFIG};
    this.config = {...this.config, ...argConfig};

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_RECTANGLE_CONFIG.styles, ...this.config.styles};

    if (argConfig.show) this.config.show = {...argConfig.show};
    this.config.show = {...DEFAULT_RECTANGLE_CONFIG.show, ...this.config.show};

    this.config.entity_index = this.config.entity_index ? this.config.entity_index : 0;

    this.svg.rx = Utils.calculateSvgDimension(argConfig.rx)

    if (this.dev.debug) console.log('RectangleTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

 /*******************************************************************************
  * RectangleTool::value()
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
  * RectangleTool::_renderRectangle()
  *
  * Summary.
  * Renders the circle using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the circle
  *
  */

  _renderRectangle() {

    // Get configuration styles as the default styles
    let configStyle = {...this.config.styles};

    // Get the runtime styles, caused by states & animation settings
    //let stateStyle = {};
    //if (this._card.animations.circles[this.config.animation_id])
    //  stateStyle = Object.assign(stateStyle, this._card.animations.circles[this.config.animation_id]);

    // Merge the two, where the runtime styles may overwrite the statically configured styles
    //configStyle = { ...configStyle, ...stateStyle, ...this.animationStyle};
    configStyle = { ...configStyle, ...this.animationStyle};

    // Convert javascript records to plain text, without "{}" and "," between the styles.
    const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

    return svg`
      <rect ""
        x="${this.svg.x}" y="${this.svg.y}" width="${this.svg.width}" height="${this.svg.height}" rx="${this.svg.rx}"
        style="${configStyleStr}"/>
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
      <g "" id="rectangle-${this.toolId}" class="rectangle" transform-origin="${this.svg.cx}px ${this.svg.cy}px"
        @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])} >
        ${this._renderRectangle()}
      </g>
    `;

  }
} // END of class

 /*******************************************************************************
  * RectangleToolEx class
  *
  * Summary.
  *
  */

class RectangleToolEx extends BaseTool {
  constructor(argCard, argConfig, argPos) {

    const DEFAULT_RECTANGLEEX_CONFIG = {
        cx: 50,
        cy: 50,
        width: 50,
        height: 50,
        radius: {
          all: 0,
        },
        styles: {
          "stroke-linecap": 'round;',
          "stroke": 'var(--primary-text-color);',
          "opacity": '1.0;',
          "stroke-width": '0;',
          "fill": 'var(--primary-background-color)',
        }
    }
    super(argCard, argConfig, argPos);

    this.config = {...DEFAULT_RECTANGLEEX_CONFIG};
    this.config = {...this.config, ...argConfig};

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_RECTANGLEEX_CONFIG.styles, ...this.config.styles};

    if (argConfig.show) this.config.show = Object.assign(...argConfig.show);
    this.config.show = {...DEFAULT_RECTANGLEEX_CONFIG.show, ...this.config.show};

    // #TODO:
    // Verify max radius, or just let it go, and let the user handle that right value.
    // A q can be max height of rectangle, ie both corners added must be less than the height, but also less then the width...

    let maxRadius = Math.min(this.svg.height, this.svg.width) / 2;
    let radius = 0;
    radius = Utils.calculateSvgDimension(this.config.radius.all);
    this.svg.radiusTopLeft = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
                              this.config.radius.top_left || this.config.radius.left || this.config.radius.top || radius))) || 0;

    this.svg.radiusTopRight = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
                              this.config.radius.top_right || this.config.radius.right || this.config.radius.top || radius))) || 0;

    this.svg.radiusBottomLeft = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
                              this.config.radius.bottom_left || this.config.radius.left || this.config.radius.bottom || radius))) || 0;

    this.svg.radiusBottomRight = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
                              this.config.radius.bottom_right || this.config.radius.right || this.config.radius.bottom || radius))) || 0;

    if (this.dev.debug) console.log('RectangleToolEx constructor coords, dimensions', this.toolId, this.svg, this.config);
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

    var svgItems = [];

    // Get configuration styles as the default styles
    let configStyle = {...this.config.styles};

    configStyle = {...configStyle, ...this.animationStyle};

    // Convert javascript records to plain text, without "{}" and "," between the styles.
    const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

    svgItems = svg``;
    // ""
    // filter="url(#card--dropshadow-medium--opaque--sepia90)"

    svgItems = svg`
      <g "" id="rectex-${this.toolId}">
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
            style="${configStyleStr}"/>
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
      <g id="rectex-${this.toolId}" class="rectex"
        @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])} >
        ${this._renderRectangleEx()}
      </g>
    `;

  }
} // END of class

 /*******************************************************************************
  * EllipseTool class
  *
  * Summary.
  *
  */

class EllipseTool extends BaseTool {
  constructor(argCard, argConfig, argPos) {

    const DEFAULT_ELLIPSE_CONFIG = {
        cx: 50,
        cy: 50,
        radiusx: 50,
        radiusy: 25,
    }

    super(argCard, argConfig, argPos);

    this.config = {...DEFAULT_ELLIPSE_CONFIG};
    this.config = {...this.config, ...argConfig};

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_ELLIPSE_CONFIG.styles, ...this.config.styles};

    if (argConfig.show) this.config.show = Object.assign(...argConfig.show);
    this.config.show = {...DEFAULT_ELLIPSE_CONFIG.show, ...this.config.show};

    this.config.entity_index = this.config.entity_index ? this.config.entity_index : 0;

    this.svg.radiusx = Utils.calculateSvgDimension(argConfig.radiusx)
    this.svg.radiusy = Utils.calculateSvgDimension(argConfig.radiusy)

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

    // Get configuration styles as the default styles
    let configStyle = {...this.config.styles};

    // Get the runtime styles, caused by states & animation settings
    //let stateStyle = {};
    //if (this._card.animations.circles[this.config.animation_id])
    //  stateStyle = Object.assign(stateStyle, this._card.animations.circles[this.config.animation_id]);

    // Merge the two, where the runtime styles may overwrite the statically configured styles
    //configStyle = { ...configStyle, ...stateStyle};
    configStyle = { ...configStyle, ...this.animationStyle};

    // Convert javascript records to plain text, without "{}" and "," between the styles.
    const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");
    if (this.dev.debug) console.log('EllipseTool - renderEllipse', this.svg.cx, this.svg.cy, this.svg.radiusx, this.svg.radiusy);

    return svg`
      <ellipse ""
        cx="${this.svg.cx}"% cy="${this.svg.cy}"%
        rx="${this.svg.radiusx}" ry="${this.svg.radiusy}"
        style="${configStyleStr}"/>
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
      <g "" id="ellipse-${this.toolId}" class="ellipse"
        @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])} >
        ${this._renderEllipse()}
      </g>
    `;

  }
} // END of class


 /*******************************************************************************
  * EntityIconTool class
  *
  * Summary.
  *
  */

class EntityIconTool extends BaseTool {
  constructor(argCard, argConfig, argPos) {

    const DEFAULT_ICON_CONFIG = {
        styles: {
          "--mdc-icon-size": '100%;',
          "align-self": 'center;',
          "height": '100%;',
          "width": '100%;',
          "fill": 'var(--primary-text-color);',
          "color": 'var(--primary-text-color);',
        }
    }
    super(argCard, argConfig, argPos);

    this.config = {...DEFAULT_ICON_CONFIG};
    this.config = {...this.config, ...argConfig};

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_ICON_CONFIG.styles, ...this.config.styles};

    if (argConfig.show) this.config.show = Object.assign(...argConfig.show);
    this.config.show = {...DEFAULT_ICON_CONFIG.show, ...this.config.show};

    this.config.entity_index = this.config.entity_index ? this.config.entity_index : 0;

// from original
    this.config.entity = this.config.entity ? this.config.entity : 0;

    // get icon size, and calculate the foreignObject position and size. This must match the icon size
    // 1em = FONT_SIZE pixels, so we can calculate the icon size, and x/y positions of the foreignObject
    // the viewport is 200x200, so we can calulate the offset.
    //
    // NOTE:
    // Safari doesn't use the svg viewport for rendering of the foreignObject, but the real clientsize.
    // So positioning an icon doesn't work correctly...

    this.svg.iconSize = this.config.icon_size ? this.config.icon_size : 2;
    this.svg.iconPixels = this.svg.iconSize * FONT_SIZE;
    const x = this.config.cx ? this.config.cx / 100 : 0.5;
    const y = this.config.cy ? this.config.cy / 100 : 0.5;

    const align = this.config.align ? this.config.align : 'center';
    const adjust = (align == 'center' ? 0.5 : (align == 'start' ? -1 : +1));

  //  const parentClientWidth = this.parentElement.clientWidth;
    const clientWidth = this._card.clientWidth; // hard coded adjust for padding...
    const correction = clientWidth / this._card.viewBox.width;

    // icon is not calculated against viewbox, but against toolset pos
    //this.svg.xpx = (x * this._card.viewBox.width);
    //this.svg.ypx = (y * this._card.viewBox.height);

    this.svg.xpx = this.svg.cx;//(x * this._card.viewBox.width);
    this.svg.ypx = this.svg.cy;//(y * this._card.viewBox.height);


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

    if (this.dev.debug) console.log('EntityIconTool constructor coords, dimensions, config', this.coords, this.dimensions, this.config);
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

/*  _iconSvgTimeout() {
    this._card.requestUpdate();
    this.iconTimeoutPending = false;
  }
*/
  _renderIcon() {

    // Get configuration styles as the default styles
    let configStyle = {...this.config.styles};

    // Get the runtime styles, caused by states & animation settings
    //let stateStyle = {};
    //if (this._card.animations.icons[this.config.animation_id])
    //  stateStyle = Object.assign(stateStyle, this._card.animations.icons[this.config.animation_id]);

    // Merge the two, where the runtime styles may overwrite the statically configured styles
    //configStyle = { ...configStyle, ...stateStyle, ...this.animationStyle};
    configStyle = { ...configStyle, ...this.animationStyle};

    // Convert javascript records to plain text, without "{}" and "," between the styles.
    const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

    const icon = this._card._buildIcon(
      this._card.entities[this.config.entity_index], this._card.config.entities[this.config.entity_index]);

    if (true || (this.svg.xpx == 0)) {

      this.svg.iconSize = this.config.icon_size ? this.config.icon_size : 2;
      this.svg.iconPixels = this.svg.iconSize * FONT_SIZE;
      const x = this.config.cx ? this.config.cx / 100 : 0.5;
      const y = this.config.cy ? this.config.cy / 100 : 0.5;

      // NEW NEW NEW Use % for size of icon...
      this.svg.iconSize = this.config.icon_size ? this.config.icon_size : 2;
      this.svg.iconPixels = Utils.calculateSvgDimension(this.svg.iconSize);

      const align = this.config.align ? this.config.align : 'center';
      const adjust = (align == 'center' ? 0.5 : (align == 'start' ? -1 : +1));

    //  const parentClientWidth = this.parentElement.clientWidth;
      const clientWidth = this._card.clientWidth; // hard coded adjust for padding...
      var correction = clientWidth / (this._card.viewBox.width);
      var correctionRect = clientWidth / (this._card.viewBox.width + 50);

      // icon is not calculated against viewbox, but against toolset pos
      //this.svg.xpx = (x * this._card.viewBox.width);
      //this.svg.ypx = (y * this._card.viewBox.height);

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
    }

//        <foreignObject width="${this.svg.iconPixels}" height="${this.svg.iconPixels}" x="${this.svg.xpx}" y="${this.svg.ypx}">

//            <div class="div__icon" xmlns="http://www.w3.org/1999/xhtml" width="100%" height="100% !important">
//                <ha-icon .icon=${icon} style="${configStyleStr}";></ha-icon>
//            </div>

    // Safari stays a problem with icons. Using <img></img> seems to do something (sizes and position are different!!), but could it be that
    // I can get the svg path for the icon, and then render that path? Then the foreignObject can be abused (size to 0,0) to hold the svg for Safari, nothing else...

    //this.elements.haIcon = this._card.shadowRoot.getElementById("icon-".concat(this.toolId));
    // The inspector shows: ha-icon id=, shadow-root, ha-svg-icon, shadow-root, svg, path.
    // Or can we use the svg use keyword??????

    if (!this.alternateColor) {this.alternateColor = 'white'};
    //if (this.alternateColor == 'white') {this.alternateColor = 'black'} else {this.alternateColor = 'white'};
//        <rect width="${this.svg.iconPixels}" height="${this.svg.iconPixels}" x="${this.svg.xpx}" y="${this.svg.ypx}"
//        <rect width="${this.svg.iconPixels}px" height="${this.svg.iconPixels}px" x="${this.svg.cx - this.svg.iconPixels/2}" y="${(this.svg.cy - this.svg.iconPixels)*1.8}"
//          style="stroke-width:10;stroke:${this.alternateColor};fill:none"></rect>

    // NTS:
    // Keep using the em values for the iconSize, and NOT the pixels, as this gives weird extra scaling on Safari!!

    // #TODO:
    // Could it be possible to simply use this: https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
    // to get the Safari client coordiantes. Already used for clicks in slider, so use also for this stuff to place icon not on svg coordinates, but xlated to client coords??
    // Or are these the whole screen, and not the card size coordinates????

    //console.log("ICON NAME", icon);

    // NOTE: .icon changed to icon. Why has this worked?????

    //var iconSvg = null;

    if (!this.iconSvg) {
      this.iconSvg = this._card.shadowRoot.getElementById("icon-".concat(this.toolId))?.shadowRoot.querySelectorAll("*")[0]?.path;
      if (!this.iconSvg) {
        this._card.pleaseReRender();
//        if (!this.iconTimeoutPending) {
//          this.iconTimeoutPending = true;
//          setTimeout(
//              () => this._iconSvgTimeout(),
//              100);
//        } else {
      }
    }

//width="${this.svg.iconSize}em" height="${this.svg.iconSize}em"
//x="${this.svg.cx}" y="${this.svg.cy}

//        <svg viewbox="0, 0, 24, 24" preserveAspectRatio="xMidYMid meet" focusable="false" x="-200" height="50%"
//            <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="yellow" stroke-width="5" x="${this.svg.xpx}" y="${this.svg.ypx}"></rect>

//            <svg preserveAspectRatio="xMidYMid meet" focusable="false">
//        </svg>

    //var scale = this.svg.iconPixels / 24;


// Scaling experiment:
//            <path d="${this.iconSvg}" fill="red" transform="translate(${this.svg.x1},${this.svg.y1}) scale(${scale})"

    var scale = 1;

    if ((this._card.isSafari) || (this._card.iOS)) {
      if (this.iconSvg) {
        // Use original size, not the corrected one!
        this.svg.iconSize = this.config.icon_size ? this.config.icon_size : 2;
        this.svg.iconPixels = Utils.calculateSvgDimension(this.svg.iconSize);

        this.svg.x1 = this.svg.cx - this.svg.iconPixels / 2;
        this.svg.y1 = this.svg.cy - this.svg.iconPixels / 2;
        this.svg.x1 = this.svg.cx - (this.svg.iconPixels * 0.5);
        this.svg.y1 = this.svg.cy - (this.svg.iconPixels * 0.5);

        scale = this.svg.iconPixels / 24;
        // Icon is default drawn at 0,0. As there is no separate viewbox, a transform is required to position the icon on its desired location.
        // Icon is also drawn in a default 24x24 viewbox. So scale the icon to the required size using scale()
        return svg`
          <g id="icon-${this.toolId}"  style="${configStyleStr}" x="${this.svg.x1}px" y="${this.svg.y1}px" transform-origin="${this.svg.cx} ${this.svg.cy}">
            <rect x="${this.svg.x1}" y="${this.svg.y1}" height="${this.svg.iconPixels}px" width="${this.svg.iconPixels}px" stroke="yellow" stroke-width="0px" opacity="50%" fill="none"></rect>
            <path d="${this.iconSvg}" transform="translate(${this.svg.x1},${this.svg.y1}) scale(${scale})"></path>
          <g>
        `;
      } else {
        return svg`
          <foreignObject width="0px" height="0px" x="${this.svg.xpx}" y="${this.svg.ypx}" overflow="visible">
            <body>
              <div class="div__icon" xmlns="http://www.w3.org/1999/xhtml"
                  style="line-height:${this.svg.iconPixels}px;position:relative;border-style:solid;border-width:0px;border-color:${this.alternateColor};">
                  <ha-icon icon=${icon} id="icon-${this.toolId}" style="${configStyleStr}";></ha-icon>
              </div>
            </body>
          </foreignObject>
          `;
      }
    } else {
      return svg`
        <foreignObject width="${this.svg.iconPixels}px" height="${this.svg.iconPixels}px" x="${this.svg.xpx}" y="${this.svg.ypx}"
                        >
          <div class="div__icon" xmlns="http://www.w3.org/1999/xhtml"
                style="line-height:${this.svg.iconPixels}px;border-style:solid;border-width:0px;border-color:${this.alternateColor};">
            <ha-icon icon=${icon} id="icon-${this.toolId}" style="${configStyleStr}"></ha-icon>
          </div>
        </foreignObject>
        `;
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

    // this.viewbox contains the size of the viewbox.
    // svg translate uses hard values relative to the viewbox, not percentages
    // We have to recalculate x and y given viewbox dimensions and scale percentage
    // .5 scale is 50x and 100y on 2/1 grid for example
    // .5 * 200 = 100. and then 200/400 = 0.5. Thus 0.5 * 100 = 50
    // .5 * 200 = 100. and then 200/200 = 1. Thus 1 * 100 = 100
    //
    // Working calculation:
    // coords = 50, 90
    // scalex = 50 * scale
    // diffx = 50 - scalex
    // xlatex = diffx / scale
    //
    // same for xlatey!
    //
    // #TODO:
    // Rendering icon for Safari should take scale in account. Currently size is in pixels, so the
    // original is shown.
    // And for chrome: the shift in pixels should also be scaled. Not done yet. Icon is displayd lower
    // then should be, ie not centered...

    return svg`
      <g "" id="icongrp-${this.toolId}" class="svgicon" transform="scale(${this.toolsetPos.scale}) translate(${this.svg.xlateX} ${this.svg.xlateY})"
        @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])} >

        ${this._renderIcon()}
      </g>
    `;

  }
} // END of class

 /*******************************************************************************
  * BadgeTool class
  *
  * Summary.
  *
  */

class BadgeTool extends BaseTool {
  constructor(argCard, argConfig, argPos) {

    const DEFAULT_BADGE_CONFIG = {
      ratio: 30,
      divider: 30,
      styles: {
        left: {
          "stroke-width": '0;',
          "fill": 'grey;',
        },
        right: {
          "stroke-width": '0;',
          "fill": 'var(--theme-gradient-color-03);',
        }
      }
    }
    super(argCard, argConfig, argPos);

    this.config = {...DEFAULT_BADGE_CONFIG};
    this.config = {...this.config, ...argConfig};

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_BADGE_CONFIG.styles, ...this.config.styles};

    if (argConfig.show) this.config.show = Object.assign(...argConfig.show);
    this.config.show = {...DEFAULT_BADGE_CONFIG.show, ...this.config.show};

    // Coordinates from left and right part.
    this.svg.radius = 5;
    this.svg.leftXpos = this.svg.x;
    this.svg.leftYpos = this.svg.y;
    this.svg.leftWidth = (this.config.ratio / 100) * this.svg.width;
    this.svg.arrowSize = (this.svg.height * this.config.divider / 100) / 2;
    this.svg.divSize = (this.svg.height * (100 - this.config.divider) / 100) / 2;

    this.svg.rightXpos = this.svg.x + this.svg.leftWidth;
    this.svg.rightYpos = this.svg.y;
    this.svg.rightWidth = ((100 - this.config.ratio) / 100) * this.svg.width;

    if (this.dev.debug) console.log('BadgeTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
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

    // Get configuration styles as the default styles
    let configStyleLeft = this.config.styles.left ? {...this.config.styles.left} : '';
    let configStyleRight = this.config.styles.right ? {...this.config.styles.right} : '';

    // Convert javascript records to plain text, without "{}" and "," between the styles.
    const configStyleLeftStr = JSON.stringify(configStyleLeft).slice(1, -1).replace(/"/g,"").replace(/,/g,"");
    const configStyleRightStr = JSON.stringify(configStyleRight).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

    svgItems = svg`
      <g  id="badge-${this.toolId}">
        <path "" d="
            M ${this.svg.rightXpos} ${this.svg.rightYpos}
            h ${this.svg.rightWidth - this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 ${this.svg.radius} ${this.svg.radius}
            v ${this.svg.height - 2 * this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 -${this.svg.radius} ${this.svg.radius}
            h -${this.svg.rightWidth - this.svg.radius}
            v -${this.svg.height - 2 * this.svg.radius}
            z
            "
            style="${configStyleRightStr}"/>

        <path "" d="
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
            style="${configStyleLeftStr}"/>
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
      <g id="badge-${this.toolId}" class="badge"
        @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])} >
        ${this._renderBadge()}
      </g>
    `;

  }
} // END of class

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

 /*******************************************************************************
  * EntityStateTool class
  *
  * Summary.
  *
  */

class EntityStateTool extends BaseTool {
  constructor(argCard, argConfig, argPos) {
    const DEFAULT_STATE_CONFIG = {
    }
    super(argCard, argConfig, argPos);

    this.config = {...DEFAULT_STATE_CONFIG};
    this.config = {...this.config, ...argConfig};

    this._stateValueIsDirty = false;

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_STATE_CONFIG.styles, ...this.config.styles};

    if (argConfig.show) this.config.show = Object.assign(...argConfig.show);
    this.config.show = {...DEFAULT_STATE_CONFIG.show, ...this.config.show};

    if (this.dev.debug) console.log('EntityStateTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  set value(state) {

    var changed = super.value = state;

    return changed;
  }

  render() {

    // compute x,y or dx,dy positions. Spec none if not specified.
    //const x = item.cx ? item.cx : '';
    //const y = item.cy ? item.cy : '';
    //const dx = item.dx ? item.dx : '0';
    //const dy = item.dy ? item.dy : '0';
    const dx = '0';
    const dy = '0';

    // compute some styling elements if configured for this state item
    const STATE_STYLES = {
      "font-size": '2em;',
      "color": 'var(--primary-text-color);',
      "opacity": '1.0;',
      "text-anchor": 'middle;',
      "alignment-baseline": 'central;',
    }

    const UOM_STYLES = {
      "opacity": '0.7;'
    }

    // Get configuration styles as the default styles
    let configStyle = {...STATE_STYLES};
  //  if (item.styles) configStyle = Object.assign(configStyle, ...item.styles);
    if (this.config.styles) configStyle = {...configStyle, ...this.config.styles};

    // Get the runtime styles, caused by states & animation settings
    //let stateStyle = {};
    //if (this._card.animations.states[this.config.index])
    //  stateStyle = Object.assign(stateStyle, this._card.animations.states[this.config.index]);

    // Merge the two, where the runtime styles may overwrite the statically configured styles
    //configStyle = { ...configStyle, ...stateStyle, ...this.animationStyle};
    configStyle = { ...configStyle, ...this.animationStyle};

    // Convert javascript records to plain text, without "{}" and "," between the styles.
    const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

    // Get font-size of state in configStyle.
    // Split value and px/em; See: https://stackoverflow.com/questions/3370263/separate-integers-and-text-in-a-string
    // For floats and strings:
    //  - https://stackoverflow.com/questions/17374893/how-to-extract-floating-numbers-from-strings-in-javascript

    // 2019.09.12
    // https://stackoverflow.com/questions/40758143/regular-expression-to-split-double-and-integer-numbers-in-a-string
    // https://regex101.com/r/QYfDtB/1
    // regex \D+|\d*\.?\d+ (plus /g for global match)
    // in twee stukken, dus 1.27 en em;

    var fsuomStr = configStyle["font-size"];

    var fsuomValue = 0.5;
    var fsuomType = 'em;'
    const fsuomSplit = fsuomStr.match(/\D+|\d*\.?\d+/g);
    if (fsuomSplit.length == 2) {
      fsuomValue = Number(fsuomSplit[0]) * .6;
      fsuomType = fsuomSplit[1];
    }
    else console.error('Cannot determine font-size for state', fsuomStr);

    fsuomStr = { "font-size": fsuomValue + fsuomType};

    let uomStyle = {...configStyle, ...UOM_STYLES, ...fsuomStr};
    const uomStyleStr = JSON.stringify(uomStyle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

    const uom = this._card._buildUom(this._card.entities[this.config.entity_index], this._card.config.entities[this.config.entity_index]);

/*
    const state = (this._card.config.entities[this.config.entity_index].attribute &&
                  this._card.entities[this.config.entity_index].attributes[this._card.config.entities[this.config.entity_index].attribute])
                  ? this._card.attributesStr[this.config.entity_index]
                  : this._card.entitiesStr[this.config.entity_index];
*/
    const state = this._stateValue;

    if (this._card._computeDomain(this._card.entities[this.config.entity_index].entity_id) == 'sensor') {
      return svg`
        <text @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])}>
          <tspan class="state__value" x="${this.svg.x}" y="${this.svg.y}" dx="${dx}em" dy="${dy}em"
            style="${configStyleStr}">
            ${state}</tspan>
          <tspan class="state__uom" dx="-0.1em" dy="-0.45em"
            style="${uomStyleStr}">
            ${uom}</tspan>
        </text>
      `;
    } else {
      // Not a sensor. Might be any other domain. Unit can only be specified using the units: in the configuration.
      // Still check for using an attribute value for the domain...
      return svg`
        <text @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])}>
          <tspan class="state__value" x="${this.svg.x}" y="${this.svg.y}" dx="${dx}em" dy="${dy}em"
            style="${configStyleStr}">
            ${state}</tspan>
          <tspan class="state__uom" dx="-0.1em" dy="-0.45em"
            style="${uomStyleStr}">
            ${uom}</tspan>
        </text>
      `;
    }
  }
}
 /*******************************************************************************
  * EntityNameTool class
  *
  * Summary.
  *
  * #TODO
  * Migrate to BaseTool class. Not yet done. issue #2
  */

class EntityNameTool extends BaseTool {
  constructor(argCard, argConfig, argPos) {

    // See https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dominant-baseline
    // Can be:
    // - auto (above baseline)
    // - middle (centered in y pos)
    // - hanging (fully below baseline)
    // - mathematical (text below baseline, but upperpart not)
    // - text-top (above baseline)
    const DEFAULT_NAME_CONFIG = {
    }

    super(argCard, argConfig, argPos);

    this.config = {...DEFAULT_NAME_CONFIG};
    this.config = {...this.config, ...argConfig};

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_NAME_CONFIG.styles, ...this.config.styles};

    this._name = {};

    // Text is rendered in its own context. No need for SVG coordinates.

    if (this.dev.debug) console.log('EntityName constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
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

    // compute some styling elements if configured for this name item
    const ENTITY_NAME_STYLES = {
      "font-size": '1.5em;',
      "fill": 'var(--primary-text-color);',
      "opacity": '1.0;',
      "text-anchor": 'middle;',
      "alignment-baseline": 'central;',
    }

    // Get configuration styles as the default styles
    let configStyle = {...ENTITY_NAME_STYLES};
    //if (item.styles) configStyle = Object.assign(configStyle, ...item.styles);
    if (this.config.styles) configStyle = {...configStyle, ...this.config.styles};

    // Merge the two, where the runtime styles may overwrite the statically configured styles
    configStyle = { ...configStyle, ...this.animationStyle};

    // Convert javascript records to plain text, without "{}" and "," between the styles.
    const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

    const name = this._card._buildName(this._card.entities[this.config.entity_index], this._card.config.entities[this.config.entity_index]);

    return svg`
        <text>
          <tspan class="entity__name" x="${this.svg.cx}" y="${this.svg.cy}" style="${configStyleStr}">${name}</tspan>
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
      <g id="name-${this.toolId}" class="name"
        @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])} >
        ${this._renderEntityName()}
      </g>
    `;

  }
} // END of class


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

 /*******************************************************************************
  * EntityAreaTool class
  *
  * Summary.
  *
  * #TODO
  * - Convert to class using baseclass. Not yet done !!!!!!!!!!!!!!!!
  */

class EntityAreaTool extends BaseTool {
  constructor(argCard, argConfig, argPos) {

    const DEFAULT_AREA_CONFIG = {
    }

    super(argCard, argConfig, argPos);

    this.config = {...DEFAULT_AREA_CONFIG};
    this.config = {...this.config, ...argConfig};

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_AREA_CONFIG.styles, ...this.config.styles};

    //this._name = {};

    // Text is rendered in its own context. No need for SVG coordinates.

    if (this.dev.debug) console.log('EntityAreaTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
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

    // compute some styling elements if configured for this area item
    const ENTITY_AREA_STYLES = {
      "font-size": '1em;',
      "fill": 'var(--primary-text-color);',
      "opacity": '1.0;',
      "text-anchor": 'middle;',
      "alignment-baseline": 'central;',
    }

    // Get configuration styles as the default styles
    let configStyle = {...ENTITY_AREA_STYLES};
    //if (item.styles) configStyle = Object.assign(configStyle, ...item.styles);
    if (this.config.styles) configStyle = {...configStyle, ...this.config.styles};

    // Merge the two, where the runtime styles may overwrite the statically configured styles
    configStyle = { ...configStyle, ...this.animationStyle};

    // Convert javascript records to plain text, without "{}" and "," between the styles.
    const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

    const area = this._card._buildArea(this._card.entities[this.config.entity_index], this._card.config.entities[this.config.entity_index]);

    return svg`
        <text class="entity__area">
          <tspan class="entity__area" x="${this.svg.cx}" y="${this.svg.cy}" style="${configStyleStr}">${area}</tspan>
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
      <g id="area-${this.toolId}" class="area"
        @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])} >
        ${this._renderEntityArea()}
      </g>
    `;

  }
} // END of class

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

 /*******************************************************************************
  * HorseshoeTool class
  *
  * Summary.
  *
  */

class HorseshoeTool extends BaseTool {
    // Donut starts at -220 degrees and is 260 degrees in size.
    // zero degrees is at 3 o'clock.


  constructor(argCard, argConfig, argPos) {

    const DEFAULT_HORSESHOE_CONFIG = {
      cx: 50,
      cy: 50,
      radius: 45,
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
    }


    super(argCard, argConfig, argPos);

    // Next consts are now variable. Should be calculated!!!!!!
    this.HORSESHOE_RADIUS_SIZE = 0.45 * SVG_VIEW_BOX;
    this.TICKMARKS_RADIUS_SIZE = 0.43 * SVG_VIEW_BOX;
    this.HORSESHOE_PATH_LENGTH = 2 * 260/360 * Math.PI * this.HORSESHOE_RADIUS_SIZE;

    this.config = {...DEFAULT_HORSESHOE_CONFIG};
    this.config = {...this.config, ...argConfig};

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_HORSESHOE_CONFIG.styles, ...this.config.styles};

    //if (argConfig.show) this.config.show = Object.assign(...argConfig.show);
    this.config.show = {...DEFAULT_HORSESHOE_CONFIG.show, ...this.config.show};

    //if (argConfig.horseshoe_scale) this.config.horseshoe_scale = Object.assign(...argConfig.horseshoe_scale);
    this.config.horseshoe_scale = {...DEFAULT_HORSESHOE_CONFIG.horseshoe_scale, ...this.config.horseshoe_scale};

    if (argConfig.horseshoe_state) this.config.horseshoe_state = Object.assign(...argConfig.horseshoe_state);
    this.config.horseshoe_state = {...DEFAULT_HORSESHOE_CONFIG.horseshoe_state, ...this.config.horseshoe_state};

    this.config.entity_index = this.config.entity_index ? this.config.entity_index : 0;

    this.svg.radius = Utils.calculateSvgDimension(this.config.radius)
    this.svg.radius_ticks = Utils.calculateSvgDimension(0.95 * this.config.radius)

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
/*
        <circle cx="${50 + 50 - Math.sin(angle)*this.TICKMARKS_RADIUS_SIZE}"
                cy="${50 + 50 - Math.cos(angle)*this.TICKMARKS_RADIUS_SIZE}" r="${radius}"
                fill="${stroke}">
      `;
*/
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
      <g id="horseshoe__svg__group" class="horseshoe__svg__group">
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
      <g "" id="horseshoe-${this.toolId}" class="horseshoe"
        @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])} >
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

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

class SparklineBarChartTool extends BaseTool {
  constructor (argCard, argConfig, argPos) {

//       styles: { "stroke": 'var(--primary-color);',

    const DEFAULT_BARCHART_CONFIG = {
      cx: 50,
      cy: 50,
      height: 25,
      width: 25,
      margin: 0.5,
      hours: 24,
      barhours: 1,
      type: 'vertical',
      color: 'var(--primary-color)',
      styles: { 
                "stroke-linecap": 'round;',
                "stroke-linejoin": 'round;',
      },
      colorstops: [],
      show: {style: 'fixedcolor'}
    }

    super(argCard, argConfig, argPos);

    this.config = {...DEFAULT_BARCHART_CONFIG};
    this.config = {...this.config, ...argConfig};

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_BARCHART_CONFIG.styles, ...this.config.styles};

    //if (argConfig.show) this.config.show = Object.assign(...argConfig.show);
    this.config.show = {...DEFAULT_BARCHART_CONFIG.show, ...this.config.show};

    // Calculate real dimensions...
    this.svg.margin = Utils.calculateSvgDimension(this.config.margin);
    // #TODO: Nog check op style? voor hor anders dan vert???
    const theWidth = (this.config.orientation == 'vertical') ?  this.svg.width : this.svg.height;

    this.svg.barWidth = (theWidth - (((this.config.hours / this.config.barhours) - 1) *
                                this.svg.margin)) / (this.config.hours / this.config.barhours);
    this._data = []; //new Array(this.hours).fill(0);
    this._bars = []; //new Array(this.hours).fill({});
    this._scale = {};
    this._needsRendering = false;

    // Get colorstops and make a key/value store...
    this.colorStops = {};
    if (this.config.colorstops) {
      Object.keys(this.config.colorstops).forEach((key) => {
        this.colorStops[key] = this.config.colorstops[key];
      });
    }

		if (this.config.show.style == 'colorstop') {
		  this.sortedColorStops = Object.keys(this.config.colorstops).map(n => Number(n)).sort((a, b) => a - b);
		}

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
			this.colorStopsMinMax = {[this._scale.min.toString()]: this.config.minmaxgradient.min,
															 [this._scale.max.toString()]: this.config.minmaxgradient.max};
		}

    // VERTICAL
    if (this.config.orientation == 'vertical') {
      if (this.dev.debug) console.log('bar is vertical');
      this._series.forEach((item, index) => {
        if (!_bars[index]) _bars[index] = {};
        _bars[index].length = ((item - this._scale.min) / (this._scale.size)) * this.svg.height;
        _bars[index].x1 = this.svg.x + this.svg.barWidth/2 + ((this.svg.barWidth + this.svg.margin) * index);
        _bars[index].x2 = _bars[index].x1;
        _bars[index].y1 = this.svg.y + this.svg.height;
        _bars[index].y2 = _bars[index].y1 - this._bars[index].length;
      });
      // HORIZONTAL
    } else if (this.config.orientation == 'horizontal') {
      if (this.dev.debug) console.log('bar is horizontal');
      this._data.forEach((item, index) => {
        if (!_bars[index]) _bars[index] = {};
        _bars[index].length = ((item - this._scale.min) / (this._scale.size)) * this.svg.width;
        _bars[index].y1 = this.svg.y + this.svg.barWidth/2 + ((this.svg.barWidth + this.svg.margin) * index);
        _bars[index].y2 = _bars[index].y1;
        _bars[index].x1 = this.svg.x;
        _bars[index].x2 = _bars[index].x1 + this._bars[index].length;
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
    // Get configuration styles as the default styles
    // Styles are already converted to an Object {}...
    let configStyle = {...this.config.styles};

    // Convert javascript records to plain text, without "{}" and "," between the styles.
    const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

		
    this._bars.forEach((item, index) => {
      if (this.dev.debug) console.log('_renderBars - bars', item, index);

			// Color the bar (stroke color of line) depending on given show.style config
			// #WIP:
			// Should become consistent with segarc, so
			// fixedcolor --> fixedcolor: color: value: ...
			// colorstop --> colorstop:...
			var stroke = '';
			switch (this.config.show.style) {
				case 'fixedcolor':
					stroke = this.config.color;
					break;
				case 'colorstop':
				case 'colorstops':
				case 'colorstopgradient':
					stroke = this._card._calculateColor(this._series[index], this.colorStops, (this.config.show.style === 'colorstopgradient'));
					break;
				case 'minmaxgradient':
					stroke = this._card._calculateColor(this._series[index], this.colorStopsMinMax, true);
					break;
			}

      svgItems.push(svg`
        <line id="line-segment-${this.toolId}-${index}" class="line__segment"
                  style="${configStyleStr}" stroke="${stroke}"
                  x1="${this._bars[index].x1}"
                  x2="${this._bars[index].x2}"
                  y1="${this._bars[index].y1}"
                  y2="${this._bars[index].y2}"
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

    //if (!this._needsRendering) return;

    return svg`
      <g "" id="barchart-${this.toolId}" class="barchart"
         @click=${e => this._card.handlePopup(e, this._card.entities[this.config.entity_index])} >
        ${this._renderBars()}
      </g>
    `;

  }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

 /*******************************************************************************
  * SegmentedArcTool class
  *
  * Summary.
  *
  */

class SegmentedArcTool extends BaseTool {
  constructor(argCard, argConfig, argPos) {

    const DEFAULT_SEGARC_CONFIG = {
      cx: 50,
      cy: 50,
      radius: 45,
      width: 3,
      margin: 1.5,
      color: 'var(--primary-color)',
      styles: { "stroke-linecap": 'round;',
                "fill": 'var(--primary-color);',
                "stroke": 'none;',
                "stroke-width": '0.5;',
                "fill-rule": 'evenodd;',
                "stroke-linejoin": 'round;'
      },
      styles_bg: {
                "stroke-linecap": 'round;',
                "fill": 'var(--primary-background-color);',
                "stroke-width": '0;',
                "fill-rule": 'evenodd;',
                "stroke-linejoin": 'round;'
      },
      segments: {"dash": 10, "gap":1 },
      colorstops: [],
      scale: {"min": 0, "max": 100, "width": 2, "offset": -5 },
      show: { "style": 'fixedcolor',
              "scale_offset": 0,
              "scale": false,
            },
      scale_offset: -4.5,
      isScale: false,
      animation: {"duration": 1.5 },
    }


    super(argCard, argConfig, argPos);

    if (this.dev.performance) console.time("--> "+ this.toolId + " PERFORMANCE SegmentedArcTool::constructor");

    this.config = {...DEFAULT_SEGARC_CONFIG};
    //console.log("segarc - scale fuckup config1", this.config);

    this.config = {...this.config, ...argConfig};
    //this.config = {...DEFAULT_SEGARC_CONFIG, ...argConfig};

    // Check for gap. Big enough?
    if (this.config.segments.gap > 0) {
      const minGap = this.config.radius * Math.PI / SVG_VIEW_BOX / 2;
      this.config.segments.gap = Math.max(minGap, this.config.segments.gap);
    }

    if (argConfig.styles) this.config.styles = {...argConfig.styles};
    this.config.styles = {...DEFAULT_SEGARC_CONFIG.styles, ...this.config.styles};
    this.config.styles_bg = {...DEFAULT_SEGARC_CONFIG.styles_bg, ...this.config.styles_bg};

    // #TODO
    // Next line generates an error: Found non-callable @@interator
    //if (argConfig.show) this.config.show = Object.assign(...argConfig.show);
    this.config.show = {...DEFAULT_SEGARC_CONFIG.show, ...this.config.show};
    //console.log("segarc - scale fuckup config2", this.config);

    // For certainty...
    this.config.scale = {...DEFAULT_SEGARC_CONFIG.scale, ...argConfig.scale};

    this.config.entity_index = this.config.entity_index ? this.config.entity_index : 0;

    this.svg.radius = Utils.calculateSvgDimension(argConfig.radius);
    this.svg.radiusX = Utils.calculateSvgDimension(argConfig.radius_x || argConfig.radius);
    this.svg.radiusY = Utils.calculateSvgDimension(argConfig.radius_y || argConfig.radius);

    this.svg.segments = {};
    // #TODO:
    // Get gap from colorlist, colorstop or something else. Not from the default segments gap.
    this.svg.segments.gap = Utils.calculateSvgDimension(this.config.segments.gap);
    //this.svg.segments.dash = Utils.calculateSvgDimension(this.config.segments.dash);
    this.svg.scale_offset = Utils.calculateSvgDimension(this.config.scale_offset);
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

    // Check for gap. Big enough?
    //const minGap = this.config.radius * Math.PI / SVG_VIEW_BOX / 2;
    //this.config.segments.gap = Math.max(minGap, this.config.segments.gap);

    //this.config.styles = {...DEFAULT_SEGARC_CONFIG.styles, ...this.config.styles};
    //this.config.styles_bg = {...DEFAULT_SEGARC_CONFIG.styles_bg, ...this.config.styles_bg};
    console.log("segarc - scale fuckup", this.config.scale, this.svg, DEFAULT_SEGARC_CONFIG.scale);
    // This arc is the scale belonging to another arc??

    this._segmentAngles = [];
    this._segments = {};

    // Precalculate segments with start and end angle!
    this._arc = {};
    this._arc.size = Math.abs(this.config.end_angle - this.config.start_angle);
    this._arc.clockwise = this.config.end_angle > this.config.start_angle;
    this._arc.direction = this._arc.clockwise ? 1 : -1;

    // 2020.10.13 (see issue #5)
    // Use different calculation for parts to support colorstops, colorlists and segment counts instead of the currently used dash (degrees) value
    //

    var tcolorlist = {};
    var colorlist = null;
    // New template testing for colorstops
    if (this.config.segments.colorlist?.template) {
        colorlist = this.config.segments.colorlist;
        if (this._card.lovelace.lovelace.config.sak_templates[colorlist.template.name]) {
          if (this.dev.debug) console.log('SegmentedArcTool::constructor - templates colorlist found', colorlist.template.name);
          tcolorlist = Templates.replaceVariables(colorlist.template.variables, this._card.lovelace.lovelace.config.sak_templates[colorlist.template.name]);
          this.config.segments.colorlist = tcolorlist;
        }
    }

    var tcolorstops = {};
    var colorstops = null;

    if (this.config.segments.colorstops?.template) {
        colorstops = this.config.segments.colorstops;
        if (this._card.lovelace.lovelace.config.sak_templates[colorstops.template.name]) {
          if (this.dev.debug) console.log('SegmentedArcTool::constructor - sak templates colorstops found', colorstops.template, this._card.lovelace.lovelace.config.sak_templates[colorstops.template.name]);
          tcolorstops = Templates.replaceVariables2(colorstops.template.variables, this._card.lovelace.lovelace.config.sak_templates[colorstops.template.name]);
          if (this.dev.debug) console.log('SegmentedArcTool::constructor - sak templates colorstops replaced', colorstops.template, tcolorstops);

          // #testing mergeDeep
          //colorstops = {...tcolorstops, ...colorstops};
          //colorstops = null;//.colors = null;
          colorstops = Merge.mergeDeep(tcolorstops/*, colorstops*/);
          console.log("merge colorstops", this.toolId, tcolorstops, colorstops);

          if (this.dev.debug) console.log('SegmentedArcTool::constructor - sak templates colorstops merged', colorstops);
          //this.config.segments.colorstops = {...colorstops};
          // #TODO:
          // Check if this is what is needed: only use template and ignore config for colorstops...
          this.config.segments.colorstops = Merge.mergeDeep(this.config.segments.colorstops, colorstops);
          this.config.segments.colorstops = Merge.mergeDeep(colorstops);

          // And this one?? Seems to work. tcolorstops is a new object, so assigning should be no problem. Easy??
          this.config.segments.colorstops = tcolorstops;
          console.log("merge colorstops config", this.toolId, this.config.segments);
          if (this.dev.debug) console.log('SegmentedArcTool::constructor - sak templates colorstops config', this.config.segments);
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
        this._segmentAngles[i] = {"boundsStart": this.config.start_angle + (segmentRunningSize * this._arc.direction),
                                  "boundsEnd": this.config.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction),
                                  "drawStart": this.config.start_angle + (segmentRunningSize * this._arc.direction) + (this._segments.gap * this._arc.direction),
                                  "drawEnd": this.config.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction) - (this._segments.gap * this._arc.direction)};
        segmentRunningSize += this._segments.sizeList[i];
      }

      if (this.dev.debug) console.log('colorstuff - COLORLIST', this._segments, this._segmentAngles);

    }
    // COLORSTOPS
    else if (this.config.show.style == 'colorstops') {
      // Get colorstops, remove outliers and make a key/value store...
      // console.log("colorstops", this.toolId, this.config.segments, this.config.segments.colorstops, this.config.segments.colorstops.colors);

      this._segments.colorStops = {};
      Object.keys(this.config.segments.colorstops.colors).forEach((key) => {
          if ((key >= this.config.scale.min) &&
              (key <= this.config.scale.max))
            this._segments.colorStops[key] = this.config.segments.colorstops.colors[key];

        });

      // Insert dummy stopcolor value for max value for easier lookup...
      this._segments.colorStops[this.config.scale.max] = 'black';

      this._segments.sortedStops = Object.keys(this._segments.colorStops).map(n => Number(n)).sort((a, b) => a - b);

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
        this._segmentAngles[i] = {"boundsStart": this.config.start_angle + (segmentRunningSize * this._arc.direction),
                                  "boundsEnd": this.config.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction),
                                  "drawStart": this.config.start_angle + (segmentRunningSize * this._arc.direction) + (this._segments.gap * this._arc.direction),
                                  "drawEnd": this.config.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction) - (this._segments.gap * this._arc.direction)};
        segmentRunningSize += this._segments.sizeList[i];
        if (this.dev.debug) console.log('colorstuff - COLORSTOPS++ segments', segmentRunningSize, this._segmentAngles[i]);
      }

      if (this.dev.debug) console.log('colorstuff - COLORSTOPS++', this._segments, this._segmentAngles, this._arc.direction, this._segments.count);
    }
    // SIMPLEGRADIENT
    else if (this.config.show.style == 'simplegradient') {
    }

    // Just dump to console for verifiation. Nothing is used yet of the new calculation method...

    if (this.config.isScale) {
      this._stateValue = this.config.scale.max;
      //this.config.show.scale = false;
    } else {

      // Nope. I'm the main arc. Check if a scale is defined and clone myself with some options...
      if (this.config.show.scale) {
        console.log("SegmentedArcTool - show scale", this.toolId, this.config.scale);
        //var scaleConfig = {...this.config};
        var scaleConfig = Merge.mergeDeep(this.config);
        scaleConfig.id = Number(scaleConfig.id) + 100;
        // scaleConfig.styles = {...this.config.styles};
        // scaleConfig.styles_bg = {...this.config.styles_bg};
        // scaleConfig.segments = {...this.config.segments};
        // scaleConfig.scale = {...this.config.scale};
        // scaleConfig.show = {...this.config.show};

        //console.log("scaleConfig", scaleConfig.scale,scaleConfig.show);
        // Cloning done. Now set specific scale options.
        scaleConfig.show.scale = false;
        scaleConfig.isScale = true;
        scaleConfig.width = this.config.scale.width; //1.5;
        scaleConfig.radius = this.config.radius - (this.config.width/2) + (scaleConfig.width/2) + (this.config.scale.offset);//(this.config.scale_offset);
        scaleConfig.radius_x = (this.config.radius_x || this.config.radius) - (this.config.width/2) + (scaleConfig.width/2) + (this.config.scale.offset);//(this.config.scale_offset);
        scaleConfig.radius_y = (this.config.radius_y || this.config.radius) - (this.config.width/2) + (scaleConfig.width/2) + (this.config.scale.offset);//(this.config.scale_offset);

        //this._segmentedArcScale = new SegmentedArc(this._card, scaleConfig);
        this._segmentedArcScale = new SegmentedArcTool(this._card, scaleConfig, argPos);
        const scaleId = this._segmentedArcScale.objectId;
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
        this._segmentAngles[i] = {"boundsStart": this.config.start_angle + (i * this.config.segments.dash * this._arc.direction),
                                  "boundsEnd": this.config.start_angle + ((i + 1) * this.config.segments.dash * this._arc.direction),
                                  "drawStart": this.config.start_angle + (i * this.config.segments.dash * this._arc.direction) + (this.config.segments.gap * this._arc.direction),
                                  "drawEnd": this.config.start_angle + ((i + 1) * this.config.segments.dash * this._arc.direction) - (this.config.segments.gap * this._arc.direction)};
      }
      if (this._arc.partsPartialSize > 0) {
        this._segmentAngles[i] = {"boundsStart": this.config.start_angle + (i * this.config.segments.dash * this._arc.direction),
                                  "boundsEnd": this.config.start_angle + ((i + 0) * this.config.segments.dash * this._arc.direction) +
                                          (this._arc.partsPartialSize * this._arc.direction),

                                  "drawStart": this.config.start_angle + (i * this.config.segments.dash * this._arc.direction) + (this.config.segments.gap * this._arc.direction),
                                  "drawEnd": this.config.start_angle + ((i + 0) * this.config.segments.dash * this._arc.direction) +
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

//    this._stateValuePrev = this._stateValue || state;
//    this._stateValue = state;
//    this._stateValueIsDirty = true;
    return true;
  }

  // SegmentedArcTool::firstUpdated
  // Me is updated. Get arc id for animations...
  firstUpdated(changedProperties)
  {
    if (this.dev.debug) console.log('SegmentedArcTool - firstUpdated IN with _arcId/id', this._arcId, this.toolId, this.config.isScale);
    this._arcId = this._card.shadowRoot.getElementById("arc-".concat(this.toolId));
    //const na = '';//this._arcId.querySelector();
    //const na = this._arcId.querySelector("arc-segment-".concat(this.Id).concat("-").concat(1));
    //const na2 = this._card.shadowRoot.getElementById("arc-segment-".concat(this.Id).concat("-").concat(0));

    this._firstUpdatedCalled = true;

    // Just a try.
    //
    // was this a bug. The scale was never called with updated. Hence always no arcId...
    this._segmentedArcScale?.firstUpdated(changedProperties);

    if (this.skipOriginal) {
      if (this.dev.debug) console.log('RENDERNEW - firstUpdated IN with _arcId/id/isScale/scale/connected', this._arcId, this.toolId, this.config.isScale, this._segmentedArcScale, this._card.connected);
      if (!this.config.isScale) this._stateValuePrev = null;
      this._initialDraw = true;
      // Huh? next call doesn't seem required to update / initiate animation???
      this._card.requestUpdate();
    }
  }

  // SegmentedArcTool::updated

  updated(changedProperties) {
    if (this.dev.debug) console.log('SegmentedArcTool - updated IN');
    // Element has updated. Now do the animation ???
    // let dateTime = new Date().getTime();
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

    //if (this.config.show.scale) this._segmentedArcScale.render();
  }

  _renderSegments() {

    // migrate to new solution to draw segmented arc...

    if (this.skipOriginal) {
      // Here we can rebuild all needed. Much will be the same I guess...

      // Added temp vars. animation doesn't work!!!!
      var arcStart = this.config.start_angle;
      var arcEnd = this.config.end_angle;
      var arcEndPrev = this.config.end_angle;
      //var arcWidth = this.config.width;
      var arcWidth = this.svg.width;

      var arcEndFull = this.config.end_angle;
      var arcClockwise = arcEnd > arcStart;
      var arcPart = this.config.segments.dash;
      var arcDivider = this.config.segments.gap;

      // #DONE: must use this.dimensions
      //var arcRadius = this.config.radius;
      var arcRadiusX = this.svg.radiusX;
      var arcRadiusY = this.svg.radiusY;


      if (this.dev.debug) console.log('RENDERNEW - IN _arcId, firstUpdatedCalled', this._arcId, this._firstUpdatedCalled);
      // calculate real end angle depending on value set in object and min/max scale
      var val = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, this._stateValue);
      var valPrev = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, this._stateValuePrev);
      if (this.dev.debug) if (!this._stateValuePrev) console.log('*****UNDEFINED', this._stateValue, this._stateValuePrev, valPrev);
      if (val != valPrev) if (this.dev.debug) console.log('RENDERNEW _renderSegments diff value old new', this.toolId, valPrev, val);

          arcEnd = (val * this._arc.size * this._arc.direction) + this.config.start_angle;
          arcEndPrev = (valPrev * this._arc.size * this._arc.direction) + this.config.start_angle;
      var arcSize = Math.abs(arcEnd - this.config.start_angle);
      var arcSizePrev = Math.abs(arcEndPrev - this.config.start_angle);

      // Styles are already converted to an Object {}...
      let configStyle = {...this.config.styles};
      const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

      // Draw background of segmented arc...
      let configStyleBg = {...this.config.styles_bg};
      const configStyleBgStr = JSON.stringify(configStyleBg).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

      var svgItems = [];

      // NO background needed for drawing scale...
      if (!this.config.isScale) {
        for (var k = 0; k < this._segmentAngles.length; k++) {
          d = this.buildArcPath(this._segmentAngles[k].drawStart, this._segmentAngles[k].drawEnd,
                                this._arc.clockwise, this.svg.radiusX, this.svg.radiusY, this.svg.width);

          svgItems.push(svg`<path id="arc-segment-bg-${this.toolId}-${k}" class="arc__segment"
                              style="${configStyleBgStr}"
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
          var fill = this.config.color;
          if (this.config.show.style =="colorlist") {
            fill = this.config.segments.colorlist.colors[index];
          }
          if (this.config.show.style =="colorstops") {
            fill = this._segments.colorStops[this._segments.sortedStops[index]];
          }

          //if (this.dev.debug) console.log('RENDERNEW _renderSegments - from cache', this.toolId, index, d);
          svgItems.push(svg`<path id="arc-segment-${this.toolId}-${index}" class="arc__segment"
                            style="${configStyleStr} fill: ${fill};;"
                            d="${d}"
                            />`);
        });

        var tween = {};

/*
With a very short animation duration, and small segments, only first segment is drawn.
It seems progress = 1 (ready), but runningAngle is 10.8 and frameAngle is 25.2, two segments ahead...
segment 1 - drawn, segment2 - not, segment3 - not. After new value, drawing starts at segment3...

{fromAngle: 0, toAngle: 25.200000000000003, runningAngle: 0, duration: 10, startTime: null}
duration: 10
frameAngle: 25.200000000000003
fromAngle: 0
progress: 1
runningAngle: 10.800000999999998
startTime: null
toAngle: 25.200000000000003
*/
        function animateSegmentsNEW(timestamp, thisTool){

            const easeOut = progress =>
              Math.pow(--progress, 5) + 1;

            var frameSegment;
            var runningSegment;

            var timestamp = timestamp || new Date().getTime()
            if (!tween.startTime) {
              tween.startTime = timestamp;
              tween.runningAngle = tween.fromAngle;
            }

            if (thisTool.debug) console.log('RENDERNEW - in animateSegmentsNEW', thisTool.toolId, tween);

            var runtime = timestamp - tween.startTime
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
              if (thisTool.debug) console.log('RENDERNEW animateSegments frameAngle not found', tween, thisTool._segmentAngles);
            }

            // Check where we actually are now. This might be in a different segment...
            runningSegment = thisTool._segmentAngles.findIndex((currentValue, index) =>
                thisTool._arc.clockwise
                ? ((tween.runningAngle <= currentValue.boundsEnd) && (tween.runningAngle >= currentValue.boundsStart))
                : ((tween.runningAngle <= currentValue.boundsStart) && (tween.runningAngle >= currentValue.boundsEnd)));

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

              let as;
              const myarc = "arc-segment-".concat(thisTool.toolId).concat("-").concat(runningSegment);
              as = thisTool._card.shadowRoot.getElementById(myarc);
              if (as) {
                var e = as.getAttribute("d");
                as.setAttribute("d", d);

                // We also have to set the style fill if the color stops and gradients are implemented
                // As we're using styles, attributes won't work. Must use as.style.fill = 'calculated color'
                // #TODO
                // Can't use gradients probably because of custom path. Conic-gradient would be fine.
                //
                // First try...
                if (thisTool.config.show.style =="colorlist") {
                  as.style.fill = thisTool.config.segments.colorlist.colors[runningSegment];
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

              frameSegment = thisTool._segmentAngles.findIndex((currentValue, index) =>
                thisTool._arc.clockwise
                ? ((tween.frameAngle <= currentValue.boundsEnd) && (tween.frameAngle >= currentValue.boundsStart))
                : ((tween.frameAngle <= currentValue.boundsStart) && (tween.frameAngle >= currentValue.boundsEnd)));

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
            // In a fast paced animation - say 10msec - multiple segments should be drawn, while tween.progress already has the value of 1.
            // This means only the first segment is drawn - due to the "&& (runningSegment == runningSegmentPrev)" test above.
            // To fix this:
            // - either remove that test (why was it there????)... Or
            // - add the line "|| (runningSegment != runningSegmentPrev)" to the if() below to make sure another animation frame is requested
            //   altough tween.progress == 1.
            if ((tween.progress != 1) /*|| (runningSegment != runningSegmentPrev)*/) {
                thisTool.rAFid = requestAnimationFrame(function(timestamp){
                    animateSegmentsNEW(timestamp, thisTool)
                })
            } else {
              tween.startTime = null;
              if (thisTool.debug) console.log('RENDERNEW - animation loop ENDING tween', thisTool.toolId, tween, runningSegment, runningSegmentPrev);
            }
        } // function animateSegmentsNEW

        var mySelf = this;
        var arcCur = arcEndPrev;

        // Check if values changed and we should animate to another target then previously rendered
        if ((val != valPrev) && (this._card.connected == true) && (this._renderTo != this._stateValue)) {
          this._renderTo = this._stateValue;
          //if (this.dev.debug) console.log('RENDERNEW val != valPrev', val, valPrev, 'prev/end/cur', arcEndPrev, arcEnd, arcCur);

          // If previous animation active, cancel this one before starting a new one...
          if (this.rAFid) {
            //if (this.dev.debug) console.log('RENDERNEW cancelling rAFid', this._card.cardId, this.toolId, 'rAFid', this.rAFid);
            cancelAnimationFrame(this.rAFid);
          }

          // Start new animation with calculated settings...
          // counter var not defined???
          //if (this.dev.debug) console.log('starting animationframe timer...', this._card.cardId, this.toolId, counter);
          tween.fromAngle = arcEndPrev;
          tween.toAngle = arcEnd;
          tween.runningAngle = arcEndPrev;
          // Render like an idiot the first time. Performs MUCH better @first load then having a zillion animations...
          // NOt so heavy on an average PC, but my iPad and iPhone need some more time for this!
          tween.duration = Math.min(Math.max(this._initialDraw ? 10 : 500, this._initialDraw ? 10 : this.config.animation.duration * 1000), 5000);
          tween.startTime = null;
          if (this.dev.debug) console.log('RENDERNEW - tween', this.toolId, tween);
          this._initialDraw = false;
          this.rAFid = requestAnimationFrame(function(timestamp){
                                              animateSegmentsNEW(timestamp, mySelf)
          })
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

          svgItems.push(svg`<path id="arc-segment-${this.toolId}-${i}" class="arc__segment"
                            style="${configStyleStr} fill: ${fill};"
                            d="${d}"
                            />`);
        }

        if (this.dev.debug) console.log('RENDERNEW - svgItems', svgItems, this._firstUpdatedCalled);
        return svg`${svgItems}`;

      }

    // END OF NEW METHOD OF RENDERING
    } else {
      var arcStart = this.config.start_angle;
      var arcEnd = this.config.end_angle;
      var arcEndPrev = this.config.end_angle;
      //var arcWidth = this.config.width;
      var arcWidth = this.svg.width;

      var arcEndFull = this.config.end_angle;
      var arcClockwise = arcEnd > arcStart;
      var arcPart = this.config.segments.dash;
      var arcDivider = this.config.segments.gap;

      // #DONE: must use this.dimensions
      //var arcRadius = this.config.radius;
      var arcRadiusX = this.svg.radiusX;
      var arcRadiusY = this.svg.radiusY;

      // calculate real end angle depending on value set in object and min/max scale
      var val = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, this._stateValue);
      var valPrev = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, this._stateValuePrev);
      if (val != valPrev) if (this.dev.debug) console.log('_renderSegments diff value old new', this.toolId, valPrev, val);

      var arcSizeFull = Math.abs(arcEndFull - arcStart);

      arcEnd = (val * arcSizeFull * this._arc.direction) + arcStart;
      arcEndPrev = (valPrev * arcSizeFull* this._arc.direction) + arcStart;

      // Styles are already converted to an Object {}...
      let configStyle = {...this.config.styles};
      const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

      let configStyleBg = {...this.config.styles_bg};
      const configStyleBgStr = JSON.stringify(configStyleBg).slice(1, -1).replace(/"/g,"").replace(/,/g,"");

      var arcSize = Math.abs(arcEnd - arcStart);
      var arcSizePrev = Math.abs(arcEndPrev - arcStart);

      // Calc diff in arc size. Can be positive and negative.
      // Then get stepsize. We draw in 20 steps.
      var arcSizeDiff = arcSizePrev - arcSize;
      var arcStepSize = arcSizeDiff / 50;
      var arcChangeClockwise = (arcSize > arcSizePrev) ? true : false;

      var svgItems = [];

      var fullParts = Math.floor(arcSize/Math.abs(arcPart));
      var fullPartsAll = Math.floor(arcSizeFull/Math.abs(arcPart));

      var d;

      // Count what's left of the arc. Start with the full size...

      var arcRest = arcSize;

      // Draw background of segmented arc...
      if (!this.config.isScale) {
        for (var k = 0; k < this._segmentAngles.length; k++) {
          d = this.buildArcPath(this._segmentAngles[k].drawStart, this._segmentAngles[k].drawEnd,
                                this._arc.clockwise, arcRadiusX, arcRadiusY, arcWidth);

          svgItems.push(svg`<path id="arc-segment-bg-${this.toolId}-${k}" class="arc__segment"
                              style="${configStyleBgStr}"
                              d="${d}"
                              />`);

        }
      }

      // Now draw the arc itself...
      var arcPartStart;
      var arcPartEnd;


      // Check if arcId does exist
      if (this._arcId != null) {
        if (this.dev.debug) console.log('_arcId does exist');

        // Render current from cache
        this._cache.forEach((item, index) => {
          d = item;
          //if (this.dev.debug) console.log('_renderSegments - from cache', this.toolId, index, d);
          svgItems.push(svg`<path id="arc-segment-${this.toolId}-${index}" class="arc__segment"
                            style="${configStyleStr};"
                            d="${d}"
                            />`);
        });

        var tween = {};

        function animateSegments(timestamp, thisTool){

            const easeOut = progress =>
              Math.pow(--progress, 5) + 1;

            var frameSegment;
            var runningSegment;

            var timestamp = timestamp || new Date().getTime()
            if (!tween.startTime) {
              tween.startTime = timestamp;
              tween.runningAngle = tween.fromAngle;
            }

            var runtime = timestamp - tween.startTime
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
              if (thisTool.debug) console.log('animateSegments frameAngle not found', tween, thisTool._segmentAngles);
            }

            // Check where we actually are now. This might be in a different segment...
            runningSegment = thisTool._segmentAngles.findIndex((currentValue, index) =>
                thisTool._arc.clockwise
                ? ((tween.runningAngle <= currentValue.boundsEnd) && (tween.runningAngle >= currentValue.boundsStart))
                : ((tween.runningAngle <= currentValue.boundsStart) && (tween.runningAngle >= currentValue.boundsEnd)));

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

              let as;
              const myarc = "arc-segment-".concat(thisTool.toolId).concat("-").concat(runningSegment);
              as = thisTool._card.shadowRoot.getElementById(myarc);
              if (as) {
                var e = as.getAttribute("d");
                as.setAttribute("d", d);

                // We also have to set the style fill if the color stops and gradients are implemented
                // As we're using styles, attributes won't work. Must use as.style.fill = 'calculated color'
                // #TODO
                // Can't use gradients probably because of custom path. Conic-gradient would be fine.
                //
                // First try...
                if (thisTool.config.show.style =="colorstops") {
                  as.style.fill = thisTool.config.colorstops[runningSegment];
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

              frameSegment = thisTool._segmentAngles.findIndex((currentValue, index) =>
                thisTool._arc.clockwise
                ? ((tween.frameAngle <= currentValue.boundsEnd) && (tween.frameAngle >= currentValue.boundsStart))
                : ((tween.frameAngle <= currentValue.boundsStart) && (tween.frameAngle >= currentValue.boundsEnd)));

              if (!increase) {
                if (runningSegmentPrev != runningSegment) {
                  if (thisTool.debug) console.log('movit - remove path', thisTool.toolId, runningSegmentPrev);
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
            } while ((tween.runningAngle != tween.frameAngle) && (runningSegment == runningSegmentPrev));

            if (tween.progress != 1) {
                thisTool.rAFid = requestAnimationFrame(function(timestamp){
                    animateSegments(timestamp, thisTool)
                })
            } else {
              tween.startTime = null;
            }
        } // function animateSegments

        var mySelf = this;
        var arcCur = arcEndPrev;

        // Check if values changed and we should animate to another target then previously rendered
        if ((val != valPrev) && (this._card.connected == true) && (this._renderTo != this._stateValue)) {
          this._renderTo = this._stateValue;
          if (this.dev.debug) console.log('val != valPrev', val, valPrev, 'prev/end/cur', arcEndPrev, arcEnd, arcCur);

          // If previous animation active, cancel this one before starting a new one...
          if (this.rAFid) {
            if (this.dev.debug) console.log('cancelling rAFid', this._card.cardId, this.toolId, 'rAFid', this.rAFid);
            cancelAnimationFrame(this.rAFid);
          }

          // Start new animation with calculated settings...
          // counter var not defined???
          //if (this.dev.debug) console.log('starting animationframe timer...', this._card.cardId, this.toolId, counter);
          tween.fromAngle = arcEndPrev;
          tween.toAngle = arcEnd;
          tween.runningAngle = arcEndPrev;
          tween.duration = Math.min(Math.max(500, this.config.animation.duration * 1000), 5000);
          tween.startTime = null;
          this.rAFid = requestAnimationFrame(function(timestamp){
                                              animateSegments(timestamp, mySelf)
          })
        }
        return svg`${svgItems}`;

      } else {
        // FIRST draw! Do IT!
        if (this.dev.debug) console.log('_arcId does NOT exist');

        for(var i = 0; i < fullParts; i++) {
          arcPartStart = this._segmentAngles[i].drawStart;
          arcPartEnd = this._segmentAngles[i].drawEnd;
          arcRest = arcRest - arcPart;

          d = this.buildArcPath(arcPartStart, arcPartEnd, arcClockwise, arcRadiusX, arcRadiusY, arcWidth);
          this._cache[i] = d;

          // extra, set color from colorlist as a test
          var fill = this.config.color;
          if (this.config.show.style =="colorstops") {
            fill = this.config.colorstops[i];
          }

          svgItems.push(svg`<path id="arc-segment-${this.toolId}-${i}" class="arc__segment"
                              style="${configStyleStr} fill: ${fill};"
                              d="${d}"
                              />`);
        }

        this.arcEnd = arcPartEnd;
        this.arcEndSegment = i;

        // Did we draw a single segment or not? If not, reset start & end to start...
        if (fullParts < 1) {
          arcPartStart = arcStart + (arcDivider * this._arc.direction);
          arcPartEnd = arcPartStart - (2 * arcDivider * this._arc.direction);
        }

        // If we have to draw the last partial arc, calculate size and draw it!

        if (arcRest > 0) {
          var lastPartStart = this._segmentAngles[i].drawStart;
          var lastPartEnd = this._segmentAngles[i].drawStart + (arcRest * this._arc.direction) - (arcDivider * this._arc.direction);
          d = this.buildArcPath(lastPartStart,
                        lastPartEnd,
                        arcClockwise,
                        arcRadiusX,
                        arcRadiusY,
                        arcWidth);

          this._cache[i] = d;
          svgItems.push(svg`<path id="arc-segment-${this.toolId}-${i}" class="arc__segment"
                            style="${configStyleStr}"
                            d="${d}"
                            />`);
          this.arcEnd = lastPartEnd;
          this.arcEndSegment = i;
          i += 1;
        }

        // create empty elements, so no problem in animation function. All path's exist...
        for (var j=i; j < fullPartsAll; j++) {
          arcPartStart = this._segmentAngles[j].drawStart;
          arcPartEnd = this._segmentAngles[j].drawStart;

          d = this.buildArcPath(arcPartStart,
                        arcPartStart,
                        arcClockwise,
                        arcRadiusX,
                        arcRadiusY,
                        0);
          this._cache[j] = d;
          svgItems.push(svg`<path id="arc-segment-${this.toolId}-${j}" class="arc__segment"
                            style="${configStyleStr}"
                            d="${d}"
                            />`);
        }


        return svg`${svgItems}`;
      }
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
   * NTS:
   * using in*** for arguments? Much clearer while reading the code
   * and the config thing should go to. Leftover from example...
   *
   */
  buildArcPath(argStartAngle, argEndAngle, argClockwise, argRadiusX, argRadiusY, argWidth) {

    var start = this.polarToCartesian(this.svg.cx, this.svg.cy, argRadiusX, argRadiusY, argEndAngle);
    var end = this.polarToCartesian(this.svg.cx, this.svg.cy, argRadiusX, argRadiusY, argStartAngle);
    var largeArcFlag = Math.abs(argEndAngle - argStartAngle) <= 180 ? "0" : "1";

    const sweepFlag = argClockwise ? "0": "1";

//    var cutoutRadius = argRadius - argWidth,
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

//=============================================================================
//=============================================================================
//=============================================================================

class devSwissArmyKnifeCard extends LitElement {
  constructor() {
    super();

    this.connected = false;

    // Get cardId for unique SVG gradient Id
    this.cardId = Math.random().toString(36).substr(2, 9);
    this.entities = [];
    this.entitiesStr = [];
    this.attributesStr = [];
    this.viewBoxSize = SVG_VIEW_BOX;
    this.viewBox = {"width": SVG_VIEW_BOX, "height": SVG_VIEW_BOX};

    // Create the lists for the toolsets and the tools
    // - toolsets contain a list of toolsets with tools
    // - tools contain the full list of tools!
    this.toolsets = [];
    this.tools = [];

		this.colorCache = [];
		
    // For history query interval updates.
    this.stateChanged = true;
    this.updating = false;
    this.update_interval = 300;

    // Development settings
    this.dev = {};
    this.dev.debug = false;
    this.dev.performance = false;
    this.dev.ts = true;

    this.configIsSet = false;

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

    // Get Lovelace panel.
    // - Used for color calculations
    // - Used to access the sak templates in the global Lovelace config

    const root = document.querySelector('home-assistant');
    const main = root.shadowRoot.querySelector('home-assistant-main');
    const drawer_layout = main.shadowRoot.querySelector('app-drawer-layout');
    const pages = drawer_layout.querySelector('partial-panel-resolver');
    this.lovelace = pages.querySelector('ha-panel-lovelace');

    if (!this.lovelace) console.error("card::constructor - Can't get Lovelace panel");

    if (this.dev.debug) console.log('*****Event - card - constructor', this.cardId, new Date().getTime());

    // Testing mergedeep.
    var obja = {a: 4, b: 5, c: 7, f: [{"1":"poep"},5,6,7]};
    var objb = {a: 44, d: 8, e: 9, f: [1,2,3,4]};

    // objb overwrites obja when duplicates
    var objm = Merge.mergeDeep(obja, objb);
    var objn = Merge.mergeDeep(objb, obja);
    console.log("testing mergedeep", obja, objb, objm, objn);
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
 /*******************************************************************************
  * card::styles()
  *
  * Summary.
  * Returns the static CSS styles for the lit-element
  *
  * Note:
  * - The BEM (http://getbem.com/naming/) naming style for CSS is used
  *   Of course, if no mistakes are made ;-)
  *
  */
  static get styles() {

    return css`
      :host {
        cursor: pointer;
        font-size: ${FONT_SIZE}px;
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

      @keyframes blinkingText {
        0%{   opacity: 0%;   }
        49%{  opacity: 0%;   }
        60%{  opacity: 100%; }
        99%{  opacity: 100%; }
        100%{ opacity: 0%;   }
      }

      @keyframes zoomOut {
        from {
          opacity: 1;
        }

        50% {
          opacity: 0;
          transform: scale3d(0.3, 0.3, 0.3);
        }

        to {
          opacity: 0;
        }
      }

      @keyframes bounce {
        from,
        20%,
        53%,
        80%,
        to {
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        transform: translate3d(0, 0, 0);
        }

        40%,
        43% {
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        transform: translate3d(0, -30px, 0);
        }

        70% {
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        transform: translate3d(0, -15px, 0);
        }

        90% {
        transform: translate3d(0, -4px, 0);
        }
      }

      @keyframes flash {
        from,
        50%,
        to {
        opacity: 1;
        }

        25%,
        75% {
        opacity: 0;
        }
      }

      @keyframes headShake {
        0% {
        transform: translateX(0);
        }

        6.5% {
        transform: translateX(-6px) rotateY(-9deg);
        }

        18.5% {
        transform: translateX(5px) rotateY(7deg);
        }

        31.5% {
        transform: translateX(-3px) rotateY(-5deg);
        }

        43.5% {
        transform: translateX(2px) rotateY(3deg);
        }

        50% {
        transform: translateX(0);
        }
      }

      @keyframes heartBeat {
        0% {
        transform: scale(1);
        }

        14% {
        transform: scale(1.3);
        }

        28% {
        transform: scale(1);
        }

        42% {
        transform: scale(1.3);
        }

        70% {
        transform: scale(1);
        }
      }

      @keyframes jello {
        from,
        11.1%,
        to {
        transform: translate3d(0, 0, 0);
        }

        22.2% {
        transform: skewX(-12.5deg) skewY(-12.5deg);
        }

        33.3% {
        transform: skewX(6.25deg) skewY(6.25deg);
        }

        44.4% {
        transform: skewX(-3.125deg) skewY(-3.125deg);
        }

        55.5% {
        transform: skewX(1.5625deg) skewY(1.5625deg);
        }

        66.6% {
        transform: skewX(-0.78125deg) skewY(-0.78125deg);
        }

        77.7% {
        transform: skewX(0.390625deg) skewY(0.390625deg);
        }

        88.8% {
        transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
        }
      }

      @keyframes pulse {
        from {
        transform: scale3d(1, 1, 1);
        }

        50% {
        transform: scale3d(1.05, 1.05, 1.05);
        }

        to {
        transform: scale3d(1, 1, 1);
        }
      }

      @keyframes rubberBand {
        from {
        transform: scale3d(1, 1, 1);
        }

        30% {
        transform: scale3d(1.25, 0.75, 1);
        }

        40% {
        transform: scale3d(0.75, 1.25, 1);
        }

        50% {
        transform: scale3d(1.15, 0.85, 1);
        }

        65% {
        transform: scale3d(0.95, 1.05, 1);
        }

        75% {
        transform: scale3d(1.05, 0.95, 1);
        }

        to {
        transform: scale3d(1, 1, 1);
        }
      }

      @keyframes shake {
        from,
        to {
        transform: translate3d(0, 0, 0);
        }

        10%,
        30%,
        50%,
        70%,
        90% {
        transform: translate3d(-10px, 0, 0);
        }

        20%,
        40%,
        60%,
        80% {
        transform: translate3d(10px, 0, 0);
        }
      }

      @keyframes swing {
        20% {
        transform: rotate3d(0, 0, 1, 15deg);
        }

        40% {
        transform: rotate3d(0, 0, 1, -10deg);
        }

        60% {
        transform: rotate3d(0, 0, 1, 5deg);
        }

        80% {
        transform: rotate3d(0, 0, 1, -5deg);
        }

        to {
        transform: rotate3d(0, 0, 1, 0deg);
        }
      }

      @keyframes tada {
        from {
        transform: scale3d(1, 1, 1);
        }
        10%,
        20% {
        transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
        }
        30%,
        50%,
        70%,
        90% {
        transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
        }
        40%,
        60%,
        80% {
        transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
        }
        to {
        transform: scale3d(1, 1, 1);
        }
      }


      @keyframes wobble {
        from {
        transform: translate3d(0, 0, 0);
        }
        15% {
        transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);
        }
        30% {
        transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);
        }
        45% {
        transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);
        }
        60% {
        transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);
        }
        75% {
        transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);
        }
        to {
        transform: translate3d(0, 0, 0);
        }
      }

      @keyframes spin {
        100% {
          -webkit-transform: -webkit-rotate(360deg);
          transform: rotate(360deg);
        }
      }

      @-webkit-keyframes spin {
        100% {
          -webkit-transform: -webkit-rotate(360deg);
          transform: rotate(360deg);
        }
      }

      @keyframes spin-stop {
        100% {
          -webkit-transform: -webkit-rotate(0deg);
          transform: rotate(0deg);
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

      .text {
        font-size: 100%;
      }

      #name {
      font-size: 80%;
      font-weight: 300;
      }

      .unit {
        font-size: 65%;
        font-weight: normal;
        opacity: 0.6;
        line-height: 2em;
        vertical-align: bottom;
        margin-left: 0.25rem;
      }

      .entity__area {
        position: absolute;
        top: 70%;
        font-size: 120%;
        opacity: 0.6;
        display: flex;
        line-height: 1;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 20%;
        flex-direction: column;
      }

      .nam {
        alignment-baseline: central;
        fill: var(--primary-text-color);
      }

      .state__uom {
        font-size: 20px;
        opacity: 0.7;
        margin: 0;
        fill : var(--primary-text-color);
      }

      .state__value {
        font-size: 3em;
        opacity: 1;
        fill : var(--primary-text-color);
        text-anchor: middle;
      }
      .entity__name {
        text-anchor: middle;
        overflow: hidden;
        opacity: 0.8;
        fill : var(--primary-text-color);
        font-size: 1.5em;
        /*text-transform: uppercase;*/
        letter-spacing: 0.1em;
      }

      .entity__area {
        font-size: 12px;
        opacity: 0.7;
        overflow: hidden;
        fill : var(--primary-text-color);
        text-anchor: middle;
        /*text-transform: uppercase;*/
        letter-spacing: 0.1em;
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
                drop-shadow(0px 14px 10px rgba(0,0,0,0.15)
                drop-shadow(0px 24px 2px rgba(0,0,0,0.1))
                drop-shadow(0px 34px 30px rgba(0,0,0,0.1));
      }
      .card--filter-none {
      }

      .horseshoe__svg__group {
        transform: translateY(15%);
      }

      .line__horizontal {
        stroke: var(--primary-text-color);
        opacity: 0.3;
        stroke-width: 2;
      }

      .line__vertical {
        stroke: var(--primary-text-color);
        opacity: 0.3;
        stroke-width: 2;
      }

      .svg__dot {
        fill: var(--primary-text-color);
        opacity: 0.5;
        align-self: center;
        transform-origin: 50% 50%;
      }

      .icon {
        align: center;
      }

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
    //console.time("--> "+ this.cardId + " PERFORMANCE card::hass");

    // Set ref to hass, use "_"for the name ;-)
    if (this.dev.debug) console.log('*****Event - set hass', this.cardId, new Date().getTime());
    this._hass = hass;

    if (!this.connected) {
      if (this.dev.debug) console.log('set hass but NOT connected', this.cardId);

    // 2020.02.10 Troubels with connectcallback late, so windows are not yet calculated. ie
    // things around icons go wrong...
    // what if return is here..
      //return;
    }

    var entityHasChanged = false;

    // Update state strings and check for changes.
    // Only if changed, continue and force render
    var value;
    var index = 0;
    var attrSet = false;
    var newStateStr;
    for (value of this.config.entities) {
      this.entities[index] = hass.states[this.config.entities[index].entity];

      // Get attribute state if specified and available
      if (this.config.entities[index].attribute) {
        if (this.entities[index].attributes[this.config.entities[index].attribute]) {
          newStateStr = this._buildState(this.entities[index].attributes[this.config.entities[index].attribute], this.config.entities[index]);
          if (newStateStr != this.attributesStr[index]) {
            this.attributesStr[index] = newStateStr;
            entityHasChanged = true;
          }
          attrSet = true;
          if (this.dev.debug) console.log("set hass - attrSet=true", this.cardId, new Date().getSeconds().toString() + '.'+ new Date().getMilliseconds().toString(), newStateStr);
        }
      }
      if (!attrSet) {
        newStateStr = this._buildState(this.entities[index].state, this.config.entities[index]);
        if (newStateStr != this.entitiesStr[index]) {
          this.entitiesStr[index] = newStateStr;
          entityHasChanged = true;
        }
        if (this.dev.debug) console.log("set hass - attrSet=false", this.cardId, new Date().getSeconds().toString() + '.'+ new Date().getMilliseconds().toString(), newStateStr);
      }

      index++;
      attrSet = false;
    }

    // #TODO
    // Temp disable this check, as in: don't return...
    if (!entityHasChanged) {
      //console.timeEnd("--> " + this.cardId + " PERFORMANCE card::hass");

      return;
    }

    // Check for animations linked to an entity or attribute.
    // Set the dynamic animation depending on the state.
    // If the card is rendered, the render() functions will take this dynamic animation into account.
    //
    // #TODO: Determine animation only if specific state or attribute has changed...


    // TODO for SAK:
    // Push animation to object. Let object handle the animation change and request a render.
    // Or has the isDirty flag, which is fetched from here.
    //
    // - if animation state is entity state
    //    - push or start animation for object/tool using animation id and entity index of some kind.
    //      must be connected somehow. is tat only via animation_index ???
    //    - this.tools[].animate(item (= animation, yes??))
    //
    // -  maybe tool.configureAnimation(animation);
    //  - tool.data = state;
    //  ==> tool will check for animation itself!
    //
    //  Then everything in one place. Much easier to maintain and check!!!!!
    //  - new tool(argCard, argPos);
    //  - tool.setConfig(argLayout);
    //  - tool.setAnimation(argAnimation);
    //  - tool.setValue(argValue / argState);
    //  - tool.setSeries(argSeries); // for history data bar charts
    //

    // NOTE:
    // Tool knows via this.config if entity_index and animation_index are specified.
    // So one can check this for EVERY object, and consequently push data into the tool.
    //
    // how is history done??? ie series data. Now only for barcharts, fixed.
    // if tool.needsSeries() then entityid = tool.entityId; -> fetch history from hass
    // if history received --> tool.setSeries(history);
    //

    if (this.dev.ts) {
      if (this.ts) {
        this.ts.map((item, index) => {
          item.updateValues();
        });
      }
    } else {

      // if (this.tools) {
        // this.tools.map((item, index) => {
          // if (true || item.type == "segarc") {
            // if (this.dev.debug) console.log('set hass - SegmentedArcTool found', item, index);
            // if ((item.tool.config.hasOwnProperty('entity_index')))
            // {
              // if (this.dev.debug) console.log('set hass - SegmentedArcTool set value', typeof item.tool.value);

              // item.tool.value = this.attributesStr[item.tool.config.entity_index]
                                                  // ? this.attributesStr[item.tool.config.entity_index]
                                                  // : this.entitiesStr[item.tool.config.entity_index];
            // }

          // }
        // });
      // }
    }

    // For now, always force update to render the card if any of the states or attributes have changed...
    if ((entityHasChanged) && (this.connected)) { this.requestUpdate();}
    //this.requestUpdate();

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
    config = JSON.parse(JSON.stringify(config))

    if (config.dev) this.dev = {...this.dev, ...config.dev};
    //this.dev.debug = config.dev?.debug ? config.dev.debug : false;
    //this.dev.performance = config.dev?.performance ? config.dev.performance : false;

    if (this.dev.debug) console.log('setConfig', this.cardId);

    if (this.configIsSet) {
      console.log("card::setConfig - already set, returning");
      if (this.dev.performance) console.timeEnd("--> " + this.cardId + " PERFORMANCE card::setConfig");
      return;
    }

    this.dimensions = "1/1";

    if (config.dimensions) this.dimensions = config.dimensions;
    // this.viewBox = aspectRatios.get(this.dimensions);

    var ar = config.dimensions.trim().split("/");
    if (!this.viewBox) this.viewBox = {};
    // console.log("AR = ", ar, config.dimensions, this.viewBox);
    this.viewBox.width = ar[0] * SVG_DEFAULT_DIMENSIONS;
    this.viewBox.height= ar[1] * SVG_DEFAULT_DIMENSIONS;

    if (!config.entities) {
      throw Error('card::setConfig - No entities defined');
    }
    if (!config.layout) {
      throw Error('card::setConfig - No layout defined');
    }

    if (!config.layout.toolsets) {
      throw Error('card::setConfig - No toolsets defined');
    }

    // Added at 2020.10.16
    //config.entities.map((entity, index) => {
    //  this.entities[index] = hass.states[entity];
    //});

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

    const newConfig = {
      texts: [],
      card_filter: 'card--filter-none',
      disable_card: false,
      ...config,
    }

    // Set default tap_action, if none given for an entity
    newConfig.entities.forEach((entity, i) => {
      if (!entity.tap_action) {
        newConfig.entities[i].tap_action = {action: 'more-info'};
      }
    }
    );

    // #TODO must be removed after removal of segmented arcs part below
    this.config = newConfig;

    // NEW for ts processing
    this.toolset = [];

    // const toolsNew = {
      // "area": EntityAreaTool,
      // "badge": BadgeTool,
      // "bar": SparklineBarChartTool,
      // "circle": CircleTool,
      // "ellipse": EllipseTool,
      // "horseshoe": HorseshoeTool,
      // "icon": EntityIconTool,
      // "line": LineTool,
      // "name": EntityNameTool,
      // "rectangle": RectangleTool,
      // "rectex": RectangleToolEx,
      // "segarc": SegmentedArcTool,
      // "state": EntityStateTool,
      // "slider": RangeSliderTool,
			// "usersvg": UserSvgTool,
    // }

    // #TODO 2020.10.14
    // - Merge templates into the toolsets (formerly groups) and tools (formerly tools)
    // - Create a list of toolsets with tools, rather than only a list of tools
    // - toolset == group
    // - tool    == tool
    //
    // So we get:
    // toolsets -> list of toolsets -> tools -> list of tools.
    // this.toolsets[].tools[].
    //

    // Maintain two lists of tools:
    // - A list with toolsets containing tools
    // - A list with all the tools for easey traversing all tools created

/*
    this.kvTemplates = [];
    if (this.config.templates) {
      this.config.templates.map((template, index) => {
        this.kvTemplates[template.template] = index;
      });
    }
    if (this.dev.debug) console.log('toolconfig, kvtemplates', this.kvTemplates);
*/
    this.config.layout.toolsets.map((toolsetCfg, toolidx) => {

      var argToolset = { config: toolsetCfg,
                          tools: []};
      var toolList = null;

/*
    if (this.config.segments.colorstops?.template) {
        colorstops = this.config.segments.colorstops;
        if (this._card.lovelace.lovelace.config.sak_templates[colorstops.template.name]) {
          console.log('lovelace sak templates colorstops found', colorstops.template, this._card.lovelace.lovelace.config.sak_templates[colorstops.template.name]);
          tcolorstops = Templates.replaceVariables2(colorstops.template.variables, this._card.lovelace.lovelace.config.sak_templates[colorstops.template.name]);
          console.log('lovelace sak templates colorstops replaced', colorstops.template, tcolorstops);
          colorstops = {...tcolorstops, ...colorstops};
          console.log('lovelace sak templates colorstops merged', colorstops);
          this.config.segments.colorstops = {...colorstops};
          console.log('lovelace sak templates colorstops config', this.config.segments);
        }
    }
*/
      if (this.dev.ts) {
        var toolsetCfgFromTemplate = null;

        if (!this.ts) this.ts = [];

        if (toolsetCfg.template) {
          if (this.dev.debug) console.log("card::setConfig - got toolsetCfg template", this.cardId, toolsetCfg, toolidx);

          if (this.lovelace.lovelace.config.sak_templates[toolsetCfg.template.name]) {
            if (this.dev.debug) console.log("card::setConfig - got toolsetCfg template found", this.cardId, toolsetCfg, toolidx);

            toolsetCfgFromTemplate = Templates.replaceVariables2(toolsetCfg.template.variables, this.lovelace.lovelace.config.sak_templates[toolsetCfg.template.name]);
            if (this.dev.debug) console.log("card::setConfig - got toolsetCfg replaced vars", this.cardId, toolsetCfgFromTemplate);
            toolsetCfgFromTemplate.position = this.config.layout.toolsets[toolidx].position ? this.config.layout.toolsets[toolidx].position : toolsetCfgFromTemplate.position;
            if (this.dev.debug) console.log("card::setConfig - got toolsetCfg replaced vars2", this.cardId, toolsetCfgFromTemplate);
            //this.config.layout.toolsets[toolidx].position = toolsetCfgFromTemplate.position;
            //this.config.layout.toolsets[toolidx].tools = [...toolsetCfgFromTemplate.tools];

            toolList = toolsetCfgFromTemplate.tools;

            // testing.. --> crashes. No deep merge/clone done!!!!!!
            //toolsetCfg = {...toolsetCfg, ...toolsetCfgFromTemplate};
            // #TODO: does this work???????????????????

            if (false) {
            // var newCfg1 = Merge.mergeDeep(toolsetCfg, toolsetCfgFromTemplate);
            // var newCfg2 = Merge.mergeDeep(toolsetCfgFromTemplate, toolsetCfg);
            // console.log("newCfg,mergeDeep) NOT", newCfg1, " yes--> Used ", newCfg2);
            // toolsetCfg = Merge.mergeDeep(toolsetCfgFromTemplate, toolsetCfg);
            // //toolsetCfg = Merge.mergeDeep(toolsetCfg, toolsetCfgFromTemplate);


            // // #TODO: merge not here, but later, after replacement of toolid in next loop.
            // // Merge everything, then replace the toolset tools with the template tools??
            // // Then we would merge everything, except the tools. That will be merged by Id below!!!!!

            // // Template overwrites default configuration.
            // toolsetCfg = Merge.mergeDeep(toolsetCfg, toolsetCfgFromTemplate);
            // toolsetCfg.tools = toolsetCfgFromTemplate.tools;

            } else {
            }

            var found = false;
            var toolAdd = [];
            var atIndex = null;

            // Check for empty tool list. This can be if template is used. Tools come from template, not from config...
            if (toolsetCfg.tools) {
              toolsetCfg.tools.map((tool, index) => {
                toolList.map((toolT, indexT) => {
                  if (tool.id == toolT.id) {
                    toolList[indexT] = {...toolList[indexT], ...tool};
                    // #TODO
                    // No deep cloning/merging is done??
                    //toolList[indexT].scale = {...toolList[indexT].scale, ...tool.scale};
                    found = true;
    //                atIndex = indexT;
                    if (this.dev.debug) console.log("card::setConfig - got toolsetCfg toolid", tool, index, toolT, indexT, tool);
                  }
                });
                if (!found) toolAdd = toolAdd.concat(toolsetCfg.tools[index]);
              });
            }
            //toolList = toolList.concat(toolsetCfg.tools);

            toolList = toolList.concat(toolAdd);
            if (this.dev.debug) console.log('card::setConfig - Step 2: templating, toolconfig', toolList);

            if (this.dev.debug) console.log('card::setConfigtool - toolsetCfg ENDRESULT before', toolList, this.config.layout.toolsets[toolidx]);
            if (this.config.layout.toolsets[toolidx].tools) this.config.layout.toolsets[toolidx].tools = [...toolList, ...this.config.layout.toolsets[toolidx].tools];
            if (this.dev.debug) console.log('card::setConfig - toolsetCfg ENDRESULT after', toolList, this.config.layout.toolsets[toolidx]);

            // #TODO:
            // does not help. So wht is the prblem with the scale. i dont'knowl.

            this.config.layout.toolsets[toolidx].scale = {...this.config.layout.toolsets[toolidx].scale, ...toolsetCfgFromTemplate.scale};
            toolsetCfg.scale = {...toolsetCfg.scale, ...toolsetCfgFromTemplate.scale};

            console.log("did apply template, so what is the scale", toolsetCfg, toolsetCfgFromTemplate);
          }
        } else {
          // We don't have a template to run, get list of tools and use that...
          toolList = toolsetCfg.tools;
        }

        // Create and push
        toolsetCfg.tools = toolList;
        const newToolset = new Toolset(this, toolsetCfg);

        this.ts.push(newToolset);
        //this.tools.push(newToolset);
      } else {
// =================================================================================== OLD
        // var toolsetCfgFromTemplate = null;

        // if (toolsetCfg.template) {
          // console.log("got toolsetCfg template", this.cardId, toolsetCfg, toolidx);

          // if (this.lovelace.lovelace.config.sak_templates[toolsetCfg.template.name]) {
            // console.log("got toolsetCfg template found", this.cardId, toolsetCfg, toolidx);

            // toolsetCfgFromTemplate = Templates.replaceVariables2(toolsetCfg.template.variables, this.lovelace.lovelace.config.sak_templates[toolsetCfg.template.name]);
            // console.log("got toolsetCfg replaced vars", this.cardId, toolsetCfgFromTemplate);
            // toolsetCfgFromTemplate.position = this.config.layout.toolsets[toolidx].position ? this.config.layout.toolsets[toolidx].position : toolsetCfgFromTemplate.position;
            // console.log("got toolsetCfg replaced vars2", this.cardId, toolsetCfgFromTemplate);
            // //this.config.layout.toolsets[toolidx].position = toolsetCfgFromTemplate.position;
            // //this.config.layout.toolsets[toolidx].tools = [...toolsetCfgFromTemplate.tools];

            // toolList = toolsetCfgFromTemplate.tools;


            // var found = false;
            // var toolAdd = [];
            // var atIndex = null;

            // // Check for empty tool list. This can be if template is used. Tools come from template, not from config...
            // if (toolsetCfg.tools) {
              // toolsetCfg.tools.map((tool, index) => {
                // toolList.map((toolT, indexT) => {
                  // if (tool.id == toolT.id) {
                    // toolList[indexT] = {...toolList[indexT], ...tool};
                    // found = true;
    // //                atIndex = indexT;
                    // console.log("got toolsetCfg toolid", tool, index, toolT, indexT, tool);
                  // }
                // });
                // if (!found) toolAdd = toolAdd.concat(toolsetCfg.tools[index]);
              // });
            // }
            // //toolList = toolList.concat(toolsetCfg.tools);

            // toolList = toolList.concat(toolAdd);
            // if (this.dev.debug) console.log('Step 2: templating, toolconfig', toolList);

            // console.log('toolsetCfg ENDRESULT before', toolList, this.config.layout.toolsets[toolidx]);
            // if (this.config.layout.toolsets[toolidx].tools) this.config.layout.toolsets[toolidx].tools = [...toolList, ...this.config.layout.toolsets[toolidx].tools];
            // console.log('toolsetCfg ENDRESULT after', toolList, this.config.layout.toolsets[toolidx]);

          // }
        // } else {
          // // We don't have a template to run, get list of tools and use that...
          // toolList = toolsetCfg.tools;
        // }

        // console.log("got toolsetCfg", this.cardId, toolList);

        // // Oke. NOw we have a toolsetCfg. Check if this one references a template
        // // and replace with given variables of current toolsetCfg.

  // /*
        // if (toolsetCfg.template) {
          // if (this.dev.debug) console.log('toolconfig, template defined in toolsetCfg', toolsetCfg.template, this.config.templates);
          // if (this.dev.debug) console.log('toolconfig, index template name', this.config.templates[this.kvTemplates[toolsetCfg.template]]);

          // if (this.config.templates[this.kvTemplates[toolsetCfg.template]]) {
            // if (this.dev.debug) console.log('toolconfig, template found in templates', toolsetCfg.template);
            // // Step 1: get template variables replaced by template defaults and given variables in toolset.
            // toolList = Templates.replaceVariables(toolsetCfg.variables, this.config.templates[this.kvTemplates[toolsetCfg.template]]);
            // if (this.dev.debug) console.log('Step 1: toolconfig, replacing template vars', toolList);
            // if (this.dev.debug) console.log('Step 1b: toolconfig, check toolsetCfg.tools', toolsetCfg);

            // // Step 2: merge toolConfig with rest of toolsetCfg configuration.
            // //         So you can override the template, or extend the template!

            // // More difficult than expected.
            // // We have to merge the tool definitions. This is an array, and we have to match the tools of course to merge them, and add new...
            // // HOW?

            // // We merge on tool id!!!!
            // // Merge two lists based on this id. If not found, concat, otherwise merge the tool values...

            // var found = false;
            // var toolAdd = [];
            // var atIndex = null;
            // toolsetCfg.tools.map((tool, index) => {
              // toolList.map((toolT, indexT) => {
                // if (tool.id == toolT.id) {
                  // toolList[indexT] = {...toolList[indexT], ...tool};
                  // found = true;
  // //                atIndex = indexT;
                // }
              // });
              // if (!found) toolAdd = toolAdd.concat(toolsetCfg.tools[index]);
            // });
            // //toolList = toolList.concat(toolsetCfg.tools);

            // toolList = toolList.concat(toolAdd);
            // if (this.dev.debug) console.log('Step 2: templating, toolconfig', toolList);
          // }
        // } else {
          // // We don't have a template to run, get list of tools and use that...
          // toolList = toolsetCfg.tools;
        // }
        // if (this.dev.debug) console.log('Step 3: outside test, toolconfig list', toolList);
  // */
        // toolList.map(toolConfig => {
  // //      toolsetCfg.tools?.map(toolConfig => {
          // // create toolsetCfg and push to this.toolsets list

          // // Use argPos for now. Should pass the toolsetCfg config to the tool
          // // #TODO
          // var argConfig = {...toolConfig};

          // var argPos = { cx: toolsetCfg.position.cx / 100 * SVG_DEFAULT_DIMENSIONS,
                         // cy: toolsetCfg.position.cy / 100 * SVG_DEFAULT_DIMENSIONS,
                         // scale: toolsetCfg.position.scale ? toolsetCfg.position.scale : 1 };
          // const newTool = new toolsNew[toolConfig.type](this, argConfig, argPos);
          // this.tools.push({type: toolConfig.type, index: toolConfig.id, tool: newTool});

          // argToolset.tools.push({type: toolConfig.type, index: toolConfig.id, tool: newTool});

        // });
        // this.toolsets.push(argToolset);
      } // end of else
    });
    if (this.dev.debug) console.log('Step 5: toolconfig, list of toolsets', this.toolsets);
  // Template test. 2020.09.30
  // Seems to work...
/*
  if (this.config.templates) {
    if (this.config.toolsets) {
      let tools = Templates.replaceVariables(this.config.toolsets[1].variables, this.config.templates[0]);
      if (this.dev.debug) console.log('template, tools are: ', tools);
    }
  }
*/
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

//    if (this._hass) {
      if (this.update_interval) {

      // Fix crash while set hass not yet called, and thus no access to entities!
        this.updateOnInterval();
        // #TODO, modify to total interval
        // Use fast interval at start, and normal interval after that, if _hass is defined...
        this.interval = setInterval(
          () => this.updateOnInterval(),
          this._hass ? this.update_interval * 1000 : 2000,
        );
      }
//    }
    if (this.dev.debug) console.log('ConnectedCallback', this.cardId);

    //var pathh = this.shadowRoot.getElementById("flash")?.shadowRoot.querySelectorAll("*")[0]?.path
    //console.log("connectedcallback ICON TESTING pathh", pathh, this.shadowRoot.getElementById("flash")?.shadowRoot.querySelectorAll("*"));

    //this.requestUpdate();
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
  *
  */
  firstUpdated(changedProperties) {

    if (this.dev.debug) console.log('*****Event - firstUpdated', this.cardId, new Date().getTime());

    if (this.config.dev.ts) {
      if (this.ts) {
        this.ts.map((item, index) => {
          item.firstUpdated(changedProperties);
        });
      }
    } else {

      // if (this.tools) {
        // this.tools.map((item, index) => {

          // //console.log("firstupdated, calling item/index", item, index);
          // if (item.type == "segarc") {
            // if (this.dev.debug) console.log('firstUpdated - calling SegmentedArcTool firstUpdated');
            // item.tool.firstUpdated(changedProperties);
            // //this.tools[index].firstUpdated(changedProperties);
          // }

          // if (item.type == "slider") {
            // if (this.dev.debug) console.log('firstUpdated - calling Slider firstUpdated');
            // item.tool.firstUpdated(changedProperties);
            // //this.tools[index].firstUpdated(changedProperties);
          // }

          // if (item.type == "icon") {
            // if (this.dev.debug) console.log('firstUpdated - calling Icon firstUpdated');
            // item.tool.firstUpdated(changedProperties);
            // //console.log("called firstupdated on icon tool");
            // //this.tools[index].firstUpdated(changedProperties);
          // }


        // });
      // }
    } // end of else

  }


 /*******************************************************************************
  * card::updated()
  *
  * Summary.
  *
  */
  updated(changedProperties) {

    if (this.dev.debug) console.log('*****Event - Updated', this.cardId, new Date().getTime());

    // #TODO
    // Add/check this for tool/tool list. They an implement the updated function/callback
/*    if (this.segmentedArcs)
    {
      this.segmentedArcs.map(item => {
        item.updated(changedProperties);
      })
    }
*/
  }

/*******************************************************************************
  * card::pleaseReRender()
  *
  */

  pleaseReRender() {

    if (this._reRenderCounter < 10) this._reRender = true;
  }

  _reRenderTimeout() {
    this._reRenderPending = false;
    this._reRender = false;
    this.requestUpdate();
    if (this.dev.debug) console.log("card::_reRenderTimeout CALLED", this.cardId, new Date().getTime());
  }

 /*******************************************************************************
  * card::render()
  *
  * Summary.
  * Renders the complete SVG based card according to the specified layout in which
  * the user can specify name, area, entities, lines and dots.
  * The horseshoe is rendered on the full card. This one can be moved a bit via CSS.
  *
  *
  * render ICON TESTING pathh lzwzmegla undefined undefined
  * render ICON TESTING pathh lzwzmegla undefined NodeList [ha-svg-icon]
  * render ICON TESTING pathh lzwzmegla M7,2V13H10V22L17,10H13L17,2H7Z NodeList [ha-svg-icon]
  */
  iconOnLoad(e, iconName) {
    console.log("icononload", this.cardId, e, iconName);

    var pathh = this.shadowRoot.getElementById("flash")?.shadowRoot.querySelectorAll("*")[0]?.path
    console.log("in icononload, icon testing, pathh", this.cardId, pathh, this.shadowRoot.getElementById("flash")?.shadowRoot.querySelectorAll("*"),
    this.shadowRoot.getElementById("flash")?.shadowRoot.querySelectorAll("*")[0]?.path);
  }

//  render({ config } = this) {
  render() {
    if (this.dev.performance) console.time("--> "+ this.cardId + " PERFORMANCE card::render");
    if (this.dev.debug) console.log('*****Event - render', this.cardId, new Date().getTime());

    if (!this.connected) {
      if (this.dev.debug) console.log('render but NOT connected', this.cardId, new Date().getTime());
      return;
    }

    // NEW for rerendering icons and stuff
    this._reRender = false;
    this._reRenderCounter = 0;

    var myHtml;

    if (this.config.disable_card) {
      myHtml = html`
                <div class="container" id="container">
                  ${this._renderSvg()}
                </div>
                `;
    } else {
      myHtml = html`
                <ha-card>
                  <div class="container" id="container">
                    ${this._renderSvg()}
                  </div>
                </ha-card>
                `;
    }
    // All cards have rendered, check if one of them needs another update in some time...

    if (this._reRender) {
      if (!this._reRenderPending) {
        this._reRenderPending = true;
        this._reRenderCounter++;
        setTimeout(
            () => this._reRenderTimeout(),
            16*16);
      }
    }
    if (this.dev.performance) console.timeEnd("--> "+ this.cardId + " PERFORMANCE card::render");

    return myHtml;
  }

/*      <ha-card
        @click=${e => this.handlePopup(e, this.entities[0])}
      >
*/
/*******************************************************************************
  * renderTickMarks()
  *
  * Summary.
  * Renders the tick marks on the scale.
  *
  */

  _renderTickMarks() {
    const { config, } = this;
    if (!config) return;
    if (!config.show) return;
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

    const radius = config.horseshoe_scale.width ? config.horseshoe_scale.width / 2 : 6/2;
    var angle;
    var scaleItems = [];

    // NTS:
    // Value of -230 is weird. Should be -220. Can't find why...
    var i;
    for (i = 0; i < steps; i++) {
      angle = startAngle + ((-230 + (360 - i*angleStepSize)) * Math.PI / 180);
      scaleItems[i] = svg`
        <circle cx="${50 + 50 - Math.sin(angle)*TICKMARKS_RADIUS_SIZE}"
                cy="${50 + 50 - Math.cos(angle)*TICKMARKS_RADIUS_SIZE}" r="${radius}"
                fill="${stroke}">
      `;
    }
    return svg`${scaleItems}`;
  }

  _RenderTools() {

if (this.dev.debug) console.log('all the tools in renderTools', this.tools);

//              ${this._renderIcons()}
// The clip-path below gives a 200x200 size if switching from views in safari. Not on chrome of course!!!!
// WHY ????????????????????????????????????????????????????
//              <g id="datatoolset" class="datatoolset" clip-path="url(#clip)">

// #TODO:
// For all objects to have a filter, and i mean composite objects, filter must be set by parent.
// In that case all objects are on same level, and don't show shadow's on each other if they are close to eachother.
// but then it seems sometimes IMPOSSIBle to set a filter on an individual object. WHY????????
// Not always. path filters do work...
//
//               <g id="datatoolset" class="datatoolset" filter="url(#nm-1)">

//                ${this._renderUserSvgs()}

    if (this.dev.ts) {
      return svg`
              <g id="datatoolset" class="datatoolset" filter="url(#nm-1)">
                ${this.ts.map(toolset => toolset.render())}
              </g>


              <defs>
              <!-- SVG inner shadow on rgba fill: https://codepen.io/salsita/pen/qBbmYMw -->

                <!-- Damien Jurado Poster Rebound: https://codepen.io/dylanbaumann/pen/wevMwB -->
                <filter id="is1" x="-50%" y="-50%" width="400%" height="400%">
                  <feComponentTransfer in=SourceAlpha>
                    <feFuncA type="table" tableValues="1 0" />
                  </feComponentTransfer>
                  <feGaussianBlur stdDeviation="1"/>
                  <feOffset dx="0" dy="1" result="offsetblur"/>
                  <feFlood flood-color="rgba(0, 0, 0, 0.3)" result="color"/>
                  <feComposite in2="offsetblur" operator="in"/>
                  <feComposite in2="SourceAlpha" operator="in" />
                  <feMerge>
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode />
                  </feMerge>
                </filter>

                <!-- SVG Inset Shadow: https://codepen.io/mattrosno/pen/zxpNwd -->
                <filter id="is2">
                  <!-- Shadow Offset -->
                  <feOffset
                    dx='1'
                    dy='1'
                  />

                  <!-- Shadow Blur -->
                  <feGaussianBlur
                    stdDeviation='0.5'
                    result='offset-blur'
                  />

                  <!-- Invert the drop shadow
                       to create an inner shadow -->
                  <feComposite
                    operator='out'
                    in='SourceGraphic'
                    in2='offset-blur'
                    result='inverse'
                  />

                  <!-- Color & Opacity -->
                  <feFlood
                    flood-color='black'
                    flood-opacity='0.4'
                    result='color'
                  />

                  <!-- Clip color inside shadow -->
                  <feComposite
                    operator='in'
                    in='color'
                    in2='inverse'
                    result='shadow'
                  />

                  <!-- Put shadow over original object -->
                  <feComposite
                    operator='over'
                    in='shadow'
                    in2='SourceGraphic'
                  />
                </filter>

                <rect id="cliprect" width="100%" height="100%" fill="none" stroke="none" rx="3" />
                <clipPath id="clip">
                  <use xlink:href="#cliprect"/>
                </clipPath>

                <marker viewBox="0 0 200 200" id="markerCircle" markerWidth="8" markerHeight="8" refX="5" refY="5">
                    <circle cx="5" cy="5" r="3" style="stroke: none; fill:currentColor;"/>
                </marker>

                <marker viewBox="0 0 200 200" id="markerArrow" markerWidth="13" markerHeight="13" refX="2" refY="6"
                       orient="auto">
                    <path d="M2,2 L2,11 L10,6 L2,2" style="fill: currentColor;" />
                </marker>

                <filter id="ds2" width="10" height="10">
                  <feDropShadow dx="2" dy="3" stdDeviation="0.5"/>
                </filter>

                <filter id="ds3" x="0" y="0" width="200%" height="200%">
                  <feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" />
                  <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
                  <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                </filter>

                <filter id="ds4" x="0" y="0" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1" />
                </filter>

                <filter id="ds-1" y="-50%" x="-50%" width="200%" height="400%">
                  <feDropShadow dx="0" dy="1.5" stdDeviation=".3"/>
                </filter>

                <!-- Neumorphic filter -->
                <!-- -->
                <!-- Light Shadow, #FFFFFF at 50%, x:-6, Y:-6, Blur:16 -->
                <!-- Dark Shadow: #d1cdc7 at 50%, x:6, y:6, Blur:16 -->
                <!-- Main Background: #efeeee -->
                <!-- Shape Background: #efeeee -->
                <!-- Optional Border: #fff at 20% Alpha -->
                <!-- Dark Shadow was: 0d2750 -->
                
                <filter id="is-1" x="-50%" y="-50%" width="200%" height="200%">
                  <feComponentTransfer in=SourceAlpha>
                    <feFuncA type="table" tableValues="1 0" />
                  </feComponentTransfer>
                  <feGaussianBlur stdDeviation="1"/>
                  <feOffset dx="2" dy="2" result="offsetblur"/>
                  <feFlood flood-color="#0d2750" flood-opacity="0.5" result="color"/>
                  <feComposite in2="offsetblur" operator="in"/>
                  <feComposite in2="SourceAlpha" operator="in" />
                  <feMerge>
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode />
                  </feMerge>
                </filter>

                <!-- Using feComposite in="offsetblur" operator="in" instead of in2 gives a -->
                <!-- much larger shadow area, much deeper! WHY?? -->
                
                <filter id="nm-2" x="-50%" y="-50%" width="200%" height="200%">
                  <feComponentTransfer in=SourceAlpha out=transfer>
                    <feFuncA type="table" tableValues="1 0" />
                  </feComponentTransfer>

                  <feGaussianBlur input="transfer" stdDeviation="5" result="blurdark"/>
                  <feOffset input="blurdark" dx="12" dy="12" result="offsetblurdark"/>
                  <feFlood input="offsetblurdark" flood-color="#d1cdc7" flood-opacity="0.4" result="colordark"/>

                  <feGaussianBlur input="transfer" stdDeviation="5" result="blurlight"/>
                  <feOffset input="blurlight" dx="-12" dy="-12" result="offsetblurlight"/>
                  <feFlood input="offsetblurlight" flood-color="white" flood-opacity="0.9" result="colorlight"/>

                  <feComposite in="offsetblurdark" operator="in"/>
                  <feComposite in="SourceAlpha" operator="in" />

                  <feMerge>
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode />
                  </feMerge>
                </filter>

                <filter id="filter-yoksel" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
                  <feFlood flood-color="#eeebe7" flood-opacity="0.7" x="0%" y="0%" width="100%" height="100%" result="flood2"/>
                  <feComposite in="flood2" in2="SourceAlpha" operator="out" x="0%" y="0%" width="100%" height="100%" result="composite5"/>
                  <feOffset dx="-9" dy="-7" x="0%" y="0%" width="100%" height="100%" in="composite5" result="offset1"/>
                  <feGaussianBlur stdDeviation="3 10" x="0%" y="0%" width="100%" height="100%" in="offset1" edgeMode="none" result="blur2"/>
                  <feComposite in="merge3" in2="SourceAlpha" operator="in" x="0%" y="0%" width="100%" height="100%" result="composite7"/>
                  <feFlood flood-color="#0f0f0f" flood-opacity="1" x="0%" y="0%" width="100%" height="100%" result="flood4"/>
                  <feComposite in="flood4" in2="SourceAlpha" operator="out" x="0%" y="0%" width="100%" height="100%" result="composite8"/>
                  <feOffset dx="6" dy="6" x="0%" y="0%" width="100%" height="100%" in="merge3" result="offset2"/>
                  <feGaussianBlur stdDeviation="3 10" x="0%" y="0%" width="100%" height="100%" in="offset2" edgeMode="none" result="blur3"/>
                  <feComposite in="blur3" in2="SourceAlpha" operator="in" x="0%" y="0%" width="100%" height="100%" result="composite9"/>
                  <feMerge x="0%" y="0%" width="100%" height="100%" result="merge3">
                        <feMergeNode in="SourceGraphic"/>
                    <feMergeNode in="composite7"/>
                    <feMergeNode in="composite9"/>
                    </feMerge>
                </filter>

                <!-- second try... -->
                <filter id="filter" x="-50%" y="-50%" width="240%" height="240%">
                  <feFlood flood-color="var(--cs-theme-shadow-lighter)" flood-opacity="0.8" result="flood2"/>
                  <feComposite in="flood2" in2="SourceAlpha" operator="out" result="composite5"/>
                  <feOffset dx="-12" dy="-12" in="composite5" result="offset1"/>
                  <feGaussianBlur stdDeviation="5" in="offset1" edgeMode="none" result="blur2"/>
                  <feComposite in="blur2" in2="SourceAlpha" operator="in"  result="composite7"/>

                  <!-- flood-color="#777777" -->
                  <feFlood flood-color="var(--cs-theme-shadow-darker)" flood-opacity="0.9" result="flood4"/>
                  <feComposite in="flood4" in2="SourceAlpha" operator="out" result="composite8"/>
                  <feOffset dx="6" dy="6" in="composite8" result="offset2"/>
                  <feGaussianBlur stdDeviation="15" in="offset2" edgeMode="none" result="blur3"/>
                  <feComposite in="blur3" in2="SourceAlpha" operator="in" result="composite9"/>

                  <feMerge result="merge3">
                    <feMergeNode in="SourceGraphic"/>
                    <feMergeNode in="composite7"/>
                    <feMergeNode in="composite9"/>
                    </feMerge>
                </filter>

                <filter id="bold" x="-50%" y="-50%" width="240%" height="240%">
                  <feFlood flood-color="#FFFFFF" flood-opacity="0.8" result="flood2"/>
                  <feComposite in="flood2" in2="SourceAlpha" operator="out" result="composite5"/>
                  <feOffset dx="12" dy="12" in="composite5" result="offset1"/>
                  <feGaussianBlur stdDeviation="5" in="offset1" edgeMode="none" result="blur2"/>
                  <feComposite in="blur2" in2="SourceAlpha" operator="in"  result="composite7"/>

                  <feFlood flood-color="#777777" flood-opacity="0.6" result="flood4"/>
                  <feComposite in="flood4" in2="SourceAlpha" operator="out" result="composite8"/>
                  <feOffset dx="-12" dy="-12" in="composite8" result="offset2"/>
                  <feGaussianBlur stdDeviation="15" in="offset2" edgeMode="none" result="blur3"/>
                  <feComposite in="blur3" in2="SourceAlpha" operator="in" result="composite9"/>

                  <feMerge result="merge3">
                    <feMergeNode in="SourceGraphic"/>
                    <feMergeNode in="composite7"/>
                    <feMergeNode in="composite9"/>
                    </feMerge>
                </filter>

                <filter id="filterss" x="-20%" y="-20%" width="140%" height="140%">
                  <feFlood flood-color="#eeebe7" flood-opacity="0.9" result="flood2"/>
                  <feComposite in="flood2" in2="SourceAlpha" operator="out" result="composite5"/>
                  <feOffset dx="-15" dy="-15" in="composite5" result="offset1"/>
                  <feGaussianBlur stdDeviation="5" in="offset1" edgeMode="none" result="blur2"/>
                  <feComposite in="blur2" in2="SourceAlpha" operator="in" result="composite7"/>

                  <feFlood flood-color="#0f0f0f" flood-opacity="1" result="flood4"/>
                  <feComposite in="flood4" in2="SourceAlpha" operator="out" result="composite8"/>
                  <feOffset dx="6" dy="6" in="composite8" result="offset2"/>
                  <feGaussianBlur stdDeviation="5" in="offset2" edgeMode="none" result="blur3"/>
                  <feComposite in="blur3" in2="SourceAlpha" operator="in" result="composite9"/>

                  <feMerge result="merge3">
                    <feMergeNode in="SourceGraphic"/>
                    <feMergeNode in="composite7"/>
                    <feMergeNode in="composite9"/>
                    </feMerge>
                </filter>

              <!-- flood-color="#d1cdc7" -->
              <!-- flood-color="#FFFFFF" -->
              <filter id="nm-1" x="-50%" y="-50%" width="300%" height="300%">
                <feDropShadow stdDeviation="5" in="SourceGraphic" dx="6" dy="6" flood-color="var(--cs-theme-shadow-darker)" flood-opacity="0.5" result="dropShadow"/>
                <feDropShadow stdDeviation="4.5" in="SourceGraphic" dx="-6" dy="-6" flood-color="var(--cs-theme-shadow-lighter)" flood-opacity="1" result="dropShadow1"/>
                <feMerge result="merge">
                  <feMergeNode in="dropShadow1"/>
                  <feMergeNode in="dropShadow"/>
                </feMerge>
              </filter>

              </defs>
      `;

    } else {

      // return svg`
              // <g id="datatoolset" class="datatoolset">
                // ${this.tools.map(tool => tool.tool.render())}
                // ${this._renderUserSvgs()}
              // </g>


              // <defs>
                // <rect id="cliprect" width="100%" height="100%" fill="none" stroke="none" rx="3" />
                // <clipPath id="clip">
                  // <use xlink:href="#cliprect"/>
                // </clipPath>

                // <marker viewBox="0 0 200 200" id="markerCircle" markerWidth="8" markerHeight="8" refX="5" refY="5">
                    // <circle cx="5" cy="5" r="3" style="stroke: none; fill:currentColor;"/>
                // </marker>

                // <marker viewBox="0 0 200 200" id="markerArrow" markerWidth="13" markerHeight="13" refX="2" refY="6"
                       // orient="auto">
                    // <path d="M2,2 L2,11 L10,6 L2,2" style="fill: currentColor;" />
                // </marker>

                // <filter id="ds2" width="10" height="10">
                  // <feDropShadow dx="2" dy="3" stdDeviation="0.5"/>
                // </filter>

                // <filter id="ds3" x="0" y="0" width="200%" height="200%">
                  // <feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" />
                  // <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
                  // <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                // </filter>

                // <filter id="ds4" x="0" y="0" width="200%" height="200%">
                  // <feGaussianBlur stdDeviation="1" />
                // </filter>

                // <filter id="ds" width="200%" height="200%">
                  // <feDropShadow dx="0" dy="1.5" stdDeviation=".3"/>
                // </filter>

              // </defs>
      // `;
    }
  }


/*******************************************************************************
  * _renderSvg()
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
  * 3.  Setting the height/width also to 200/200 (same as viewbox), the horseshoe is
  *     displayed correctly, but doesn't scale to the max space of the ha-card/viewport.
  *     It also is displayed at the start of the viewport. For a large horizontal
  *     card this is ok, but in other cases, the center position would be better...
  *     - use align-self: center on the svg ...or...
  *     - use align-items: center on the parent container of the svg.
  *
  */
  _renderSvg() {
    const { viewBoxSize, } = this;

    const cardFilter = this.config.card_filter ? this.config.card_filter : 'card--filter-none';

    const svgItems = [];
    
    // New #TODO:
    // Put each toolset in a so called render group which its own filter setting.
    // A toolset registers a render group while being configured/created.
    // Card loops through all render groups and renders them with given style settings.
    // Default rendergroup, if none given, is "rg-default"
    //
    svgItems.push(svg`<svg xmlns=http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
                  class="${cardFilter}"
                  viewBox="0 0 ${this.viewBox.width} ${this.viewBox.height}">
                  ${this._RenderTools()}`);

    return svg`${svgItems}`;
  }


  _renderUserSvg(item) {
    return svg`${unsafeSVG(item.data)}`;
  }

  _renderUserSvgs() {
    const {
      layout,
    } = this.config.layout; // was this.config.layout

    if (this.dev.debug) console.log('debug - _renderUserSvgs IN', this.config);
    if (!this.config.svgs) return;

    if (this.dev.debug) console.log('debug - _renderUserSvgs IN2');

    const svgItems = this.config.svgs.map(item => {

      return svg`
        <g>
          <line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
          <path d="m 0 0 h 50 v 10 l 5 5 l -5 5 l 0 10 h -50 z " stroke-width="2" stroke="#fff" fill="#aaa"/>
          ${unsafeSVG(item.data)}
        </g>
      `;
//this._renderUserSvg(item)}
    })

    if (this.dev.debug) console.log('debug - _renderUserSvgs OUT', svgItems);
    return svg`${svgItems}`;
  }

/*******************************************************************************
  * _handleClick()
  *
  * Summary.
  * Processes the mouse click of the user and dispatches the event to the
  * configure handler.
  * At this moment, only 'more-info' is used!
  *
  * Credits:
  * All credits to the mini-graph-card for this function.
  *
  */

  _handleClick(node, hass, config, actionConfig, entityId) {
    let e;
    // eslint-disable-next-line default-case
    switch (actionConfig.action) {
      case 'more-info': {
        e = new Event('hass-more-info', { composed: true });
        e.detail = { entityId };
        node.dispatchEvent(e);
        break;
      }
      case 'navigate': {
        if (!actionConfig.navigation_path) return;
        window.history.pushState(null, '', actionConfig.navigation_path);
        e = new Event('location-changed', { composed: true });
        e.detail = { replace: false };
        window.dispatchEvent(e);
        break;
      }
      case 'call-service': {
        if (!actionConfig.service) return;
        const [domain, service] = actionConfig.service.split('.', 2);
        const serviceData = { ...actionConfig.service_data };
        hass.callService(domain, service, serviceData);
      }
    }
  }

/*******************************************************************************
  * handlePopup()
  *
  * Summary.
  * Handles the first part of mouse click processing.
  * It stops propagation to the parent and processes the event.
  *
  * The action can be configured per entity. Look-up the entity, and handle the click
  * event for further processing.
  *
  * Credits:
  * Almost all credits to the mini-graph-card for this function.
  *
  */

  handlePopup(e, entity) {
    e.stopPropagation();

    this._handleClick(this, this._hass, this.config,
      this.config.entities[this.config.entities.findIndex(
        function(element, index, array){return element.entity == entity.entity_id})]
          .tap_action, entity.entity_id);
  }

/*******************************************************************************
  * _buildArea()
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
  * _buildName()
  *
  * Summary.
  * Builds the Name string.
  *
  */

  _buildName(entityState, entityConfig) {
    return (
      entityConfig.name
      || entityState.attributes.friendly_name
    );
  }

/*******************************************************************************
  * _buildIcon()
  *
  * Summary.
  * Builds the Icon specification name.
  *
  */
  _buildIcon(entityState, entityConfig) {
    return (
      entityConfig.icon
      || entityState.attributes.icon
    );
  }

 /*******************************************************************************
  * _buildUom()
  *
  * Summary.
  * Builds the Unit of Measurement string.
  *
  */

  _buildUom(entityState, entityConfig) {
    return (
      entityConfig.unit
      || entityState.attributes.unit_of_measurement
      || ''
    );
  }

/*******************************************************************************
  * _buildState()
  *
  * Summary.
  * Builds the State string.
  * If state is not a number, the state is returned AS IS, otherwise the state
  * is build according to the specified number of decimals.
  *
  */

  _buildState(inState, entityConfig) {
    if (isNaN(inState))
      return inState;

    const state = Number(inState);

    if (entityConfig.decimals === undefined || Number.isNaN(entityConfig.decimals) || Number.isNaN(state))
      return (Math.round(state * 100) / 100).toString();

    const x = 10 ** entityConfig.decimals;
    return (Math.round(state * x) / x).toFixed(entityConfig.decimals).toString();
  }


 /*******************************************************************************
  * _computeState()
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
  * _calculateColor()
  *
  * Summary.
  *
  */

  _calculateColor(argState, argStops, argIsGradient) {
    // console.log("calculateColor", argState, argStops, argIsGradient);
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
  * _calculateValueBetween()
  *
  * Summary.
  * Clips the argValue value between argStart and argEnd, and returns the between value ;-)
  *
  */

  _calculateValueBetween(argStart, argEnd, argValue) {
    return (Math.min(Math.max(argValue, argStart), argEnd) - argStart) / (argEnd - argStart);
  }

 /*******************************************************************************
  * _getColorVariable()
  *
  * Summary.
  * Get value of CSS color variable, specified as var(--color-value)
  * These variables are defined in the lovelace element so it appears...
  *
  */

  _getColorVariable(argColor) {
    const newColor = argColor.substr(4, argColor.length-5);

    if (!this.lovelace) {
      const root = document.querySelector('home-assistant');
      const main = root.shadowRoot.querySelector('home-assistant-main');
      const drawer_layout = main.shadowRoot.querySelector('app-drawer-layout');
      const pages = drawer_layout.querySelector('partial-panel-resolver');
      this.lovelace = pages.querySelector('ha-panel-lovelace');
    } else { }

    const returnColor = window.getComputedStyle(this.lovelace).getPropertyValue(newColor);
    return returnColor;
  }

 /*******************************************************************************
  * _getGradientValue()
  *
  * Summary.
  * Get gradient value of color as a result of a color_stop.
  * An RGBA value is calculated, so transparancy is possible...
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
  * _colorToRGBA()
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
    if (argColor in this.colorCache) {
      return this.colorCache[argColor];
    }

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

    this.colorCache[argColor] = outColor;
    return outColor;
  }

  updateOnInterval() {
    // Only update if hass is already set, this might be not the case the first few calls...
    if (!this._hass) {
      if (this.dev.debug) console.log("UpdateOnInterval - NO hass, returning");
      return;
    }
    if (this.stateChanged && !this.updating) {

      // 2020.10.24
      // Leave true, as multiple entities can be fetched. fetch every 5 minutes...
      //this.stateChanged = false;
      this.updateData();
    }
  }

  async fetchRecent(entityId, start, end, skipInitialState) {
    let url = 'history/period';
    if (start) url += `/${start.toISOString()}`;
    url += `?filter_entity_id=${entityId}`;
    if (end) url += `&end_time=${end.toISOString()}`;
    if (skipInitialState) url += '&skip_initial_state';

    // console.log('fetchRecent - call is', entityId, start, end, skipInitialState, url);
    return this._hass.callApi('GET', url);
  }

  async updateData({ config } = this) {
    this.updating = true;

    if (this.dev.debug) console.log("card::updateData - ENTRY", this.cardId);

    // We have a list of objects that might need some history update
    // Create list to fetch.
//    let entityList = [{}];
    let entityList = [];
    var j = 0;

    // #TODO
    // Lookup in this.tools for bars, or better tools that need history...
    // get that entity_index for that object
    // add to list...
    if (this.dev.ts) {
      this.ts.map((toolset, k) => {
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
    }

    if (this.dev.debug) console.log("card::updateData - LENGTH", this.cardId, entityList.length, entityList);

    // #TODO
    // Quick hack to block updates if entrylist is empty
    this.stateChanged = false;

    // this.tools.map((item, i) => {
      // if (item.type == "bar") {
        // const end = new Date();
        // const start = new Date();
        // start.setHours(end.getHours() - item.tool.config.hours);
        // const attr = this.config.entities[item.tool.config.entity_index].attribute ? this.config.entities[item.tool.config.entity_index].attribute : null;

        // entityList[j] = ({"entityIndex": item.tool.config.entity_index, "entityId": this.entities[item.tool.config.entity_index].entity_id, "attrId": attr, "start": start, "end": end, "type": "bar", "idx": i});
        // j++;
      // }
    // });
    if (this.dev.debug) console.log('card::updateData, entityList from tools', entityList);

    try {
//      const promise = this.config.layout.vbars.map((item, i) => this.updateEntity(item, entity, i, start, end));
      const promise = entityList.map((item, i) => this.updateEntity(item, i, item.start, item.end));
      await Promise.all(promise);
    } finally {
      this.updating = false;

      // 2020.10.24
      // why not updating? Should call here??
      //this.requestUpdate();
    }
  }
  async updateEntity(entity, index, initStart, end) {

    let stateHistory = [];
    let start = initStart;
    let skipInitialState = false;

//    this.entities[item.entity_index].entity_id)

    // Get history for this entity and/or attribute.
    let newStateHistory = await this.fetchRecent(entity.entityId, start, end, skipInitialState);

    // Now we have some history, check if it has valid data and filter out either the entity state or
    // the entity attribute. Ain't that nice!

    let theState = entity.state;
    if (newStateHistory[0] && newStateHistory[0].length > 0) {
      if (entity.attrId) {
        theState = this.entities[entity.entityIndex].attributes[this.config.entities[entity.entityIndex].attribute];
        entity.state = theState;
      }
      newStateHistory = newStateHistory[0].filter(item => entity.attrId ? !Number.isNaN(parseFloat(item.attributes[entity.attrId])) : !Number.isNaN(parseFloat(item.state)));

//      newStateHistory = newStateHistory[0].filter(item => !Number.isNaN(parseFloat(item.state)));
      newStateHistory = newStateHistory.map(item => ({
        last_changed: item.last_changed,
        state: entity.attrId ? Number(item.attributes[entity.attrId]) : Number(item.state)
//        state: 16
      }));
      //newStateHistory = newStateHistory.filter(item => !Number.isNaN(parseFloat(item.state)));

    }

    stateHistory = [...stateHistory, ...newStateHistory];

    // this.hours=24;
    // this.points=1;

    this.uppdate(entity, stateHistory);
    return;
  }

  uppdate(entity, hist) {
    if (!hist) return;

    const getMin = (arr, val) => arr.reduce((min, p) => (
          Number(p[val]) < Number(min[val]) ? p : min
          ), arr[0]);

    const getAvg = (arr, val) => arr.reduce((sum, p) => (
      sum + Number(p[val])
    ), 0) / arr.length;

    const now = new Date().getTime();

    var hours = 24;
    var barhours = 2;

    if (entity.type == 'bar') {
      if (this.dev.debug) console.log('entity.type == bar', entity);

      if (this.dev.ts) {
        hours = this.ts[entity.tsidx].tools[entity.idx].tool.config.hours;
        barhours = this.ts[entity.tsidx].tools[entity.idx].tool.config.barhours;
      } else {
        // hours = this.tools[entity.idx].tool.config.hours;
        // barhours = this.tools[entity.idx].tool.config.barhours;
      }
    }

    if (entity.type == 'hbars') {
      hours = this.hbars[entity.idx].config.hours;
      barhours = this.hbars[entity.idx].config.barhours;
    }

    if (entity.type == 'vbars') {
      hours = this.vbars[entity.idx].config.hours;
      barhours = this.vbars[entity.idx].config.barhours;
    }


    const reduce = (res, item) => {
      const age = now - new Date(item.last_changed).getTime();
//      const interval = (age / (1000 * 3600) * this.points) - this.hours * this.points;
      const interval = (age / (1000 * 3600) / barhours) - (hours / barhours);
      const key = Math.floor(Math.abs(interval));
      if (!res[key]) res[key] = [];
      res[key].push(item);
      return res;
    }
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
      coords[0].push(coords[firstInterval[0]][1]);
    }

    for(var i = 0; i < (hours / barhours); i++) {
      if (!coords[i]) {
        coords[i] = [];
        coords[i].push(coords[i-1][coords[i-1].length-1])
      }
    }

    //this.coords = this._calcPoints(coords);
    this.coords = coords;
		// #TODO @2020.11.15:
		// Nothing is using these calculated min/max values?!?!?!?!?!?!
    //this.min = Math.min(...this.coords.map(item => Math.min(...item.map(item2 => (item2.state)))));
    //this.max = Math.max(...this.coords.map(item => Math.max(...item.map(item2 => (item2.state)))));

    var theData = [];
    theData = [];
//    theData = coords.map(item => item.reduce((ave, current, index, arr) => ave + current.state));
    theData = coords.map(item => getAvg(item, 'state'));

    // now push data into object...
    if (this.dev.ts) {
      if (entity.type == 'bar') {
        this.ts[entity.tsidx].tools[entity.idx].tool.series = [...theData];
      }
    } else {
      // if (entity.type == 'bar') {
        // this.tools[entity.idx].tool.series = [...theData];
      // }
    }

    // Request a rerender of the card after receiving new data
    this.requestUpdate();

  }

  getCardSize() {
    return (4);
  }
}

customElements.define('dev-swiss-army-knife-card', devSwissArmyKnifeCard);
