import{LitElement,html,css,svg,unsafeCSS}from"https://unpkg.com/lit-element@2.5.1/lit-element.js?module";import{unsafeSVG}from"https://unpkg.com/lit-html@1/directives/unsafe-svg.js?module";import{ifDefined}from"https://unpkg.com/lit-html@1/directives/if-defined?module";import{styleMap}from"https://unpkg.com/lit-html@1/directives/style-map.js?module";import{classMap}from"https://unpkg.com/lit-html@1/directives/class-map.js?module";import{selectUnit}from"https://unpkg.com/@formatjs/intl-utils@3.8.4/lib/index.js?module";import{fireEvent,stateIcon}from"https://unpkg.com/custom-card-helpers@1.8.0/dist/index.m.js?module";import*as SvgInjector from"/local/community/swiss-army-knife-card/SVGInjector.min.js?module";console.info(`%c   SWISS-ARMY-KNIFE-CARD   
%c  Public Release Candidate 
%c     Version 1.0.0-rc.3    `,"color: yellow; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray","color: white; font-weight: bold; background: dimgray");const SCALE_DIMENSIONS=2,SVG_DEFAULT_DIMENSIONS=200*SCALE_DIMENSIONS,SVG_DEFAULT_DIMENSIONS_HALF=SVG_DEFAULT_DIMENSIONS/2,SVG_VIEW_BOX=SVG_DEFAULT_DIMENSIONS,FONT_SIZE=SVG_DEFAULT_DIMENSIONS/100,clamp=(t,s,e)=>Math.min(Math.max(s,t),e),round=(t,s,e)=>Math.abs(s-t)>Math.abs(e-s)?e:t,angle360=(t,s,e)=>t<0||e<0?s+360:s,range=(t,s)=>Math.abs(t-s);class Merge{static mergeDeep(...t){const a=t=>t&&"object"==typeof t;return t.reduce((i,o)=>(Object.keys(o).forEach(t=>{var s=i[t],e=o[t];Array.isArray(s)&&Array.isArray(e)?i[t]=s.concat(...e):a(s)&&a(e)?i[t]=this.mergeDeep(s,e):i[t]=e}),i),{})}}class Utils{static calculateValueBetween(t,s,e){return!isNaN(e)&&e?(Math.min(Math.max(e,t),s)-t)/(s-t):0}static calculateSvgCoordinate(t,s){return t/100*SVG_DEFAULT_DIMENSIONS+(s-SVG_DEFAULT_DIMENSIONS_HALF)}static calculateSvgDimension(t){return t/100*SVG_DEFAULT_DIMENSIONS}static getLovelace(){var t,s=document.querySelector("home-assistant");return(s=(s=(s=(s=(s=(s=(s=(s=s&&s.shadowRoot)&&s.querySelector("home-assistant-main"))&&s.shadowRoot)&&s.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"))&&s.shadowRoot||s)&&s.querySelector("ha-panel-lovelace"))&&s.shadowRoot)&&s.querySelector("hui-root"))?((t=s.lovelace).current_view=s.___curView,t):null}}class Templates{static replaceVariables3(t,s){if(!t&&!s.template.defaults)return s[s.template.type];let e=t?.slice(0)??[],o=(s.template.defaults&&(e=e.concat(s.template.defaults)),JSON.stringify(s[s.template.type]));return e.forEach(t=>{var s,e,i=Object.keys(t)[0],t=Object.values(t)[0];"number"!=typeof t&&"boolean"!=typeof t||(e=new RegExp(`"\\[\\[${i}\\]\\]"`,"gm"),o=o.replace(e,t)),o="object"==typeof t?(e=new RegExp(`"\\[\\[${i}\\]\\]"`,"gm"),s=JSON.stringify(t),o.replace(e,s)):(e=new RegExp(`\\[\\[${i}\\]\\]`,"gm"),o.replace(e,t))}),JSON.parse(o)}static getJsTemplateOrValueConfig(s,e){var t;return e&&(["number","boolean","bigint","symbol"].includes(typeof e)?e:"object"==typeof e?(Object.keys(e).forEach(t=>{e[t]=Templates.getJsTemplateOrValueConfig(s,e[t])}),e):"[[[["===(t=e.trim()).substring(0,4)&&"]]]]"===t.slice(-4)?Templates.evaluateJsTemplateConfig(s,t.slice(4,-4)):e)}static evaluateJsTemplateConfig(t,s){try{return new Function("tool_config","'use strict'; "+s).call(this,t)}catch(t){throw t.name="Sak-evaluateJsTemplateConfig-Error",t}}static evaluateJsTemplate(t,s,e){try{return new Function("state","states","entity","user","hass","tool_config","entity_config","'use strict'; "+e).call(this,s,t._card._hass.states,t.config.hasOwnProperty("entity_index")?t._card.entities[t.config.entity_index]:void 0,t._card._hass.user,t._card._hass,t.config,t.config.hasOwnProperty("entity_index")?t._card.config.entities[t.config.entity_index]:void 0)}catch(t){throw t.name="Sak-evaluateJsTemplate-Error",t}}static getJsTemplateOrValue(s,e,i){var t;return i&&(["number","boolean","bigint","symbol"].includes(typeof i)?i:"object"==typeof i?(Object.keys(i).forEach(t=>{i[t]=Templates.getJsTemplateOrValue(s,e,i[t])}),i):"[[["===(t=i.trim()).substring(0,3)&&"]]]"===t.slice(-3)?Templates.evaluateJsTemplate(s,e,t.slice(3,-3)):i)}}class Toolset{constructor(t,s){this.toolsetId=Math.random().toString(36).substr(2,9),this._card=t,this.dev={...this._card.dev},this.dev.performance&&console.time("--\x3e "+this.toolsetId+" PERFORMANCE Toolset::constructor"),this.config=s,this.tools=[],this.svg={},this.svg.cx=Utils.calculateSvgCoordinate(s.position.cx,SVG_DEFAULT_DIMENSIONS_HALF),this.svg.cy=Utils.calculateSvgCoordinate(s.position.cy,SVG_DEFAULT_DIMENSIONS_HALF),this.svg.x=this.svg.cx-SVG_DEFAULT_DIMENSIONS_HALF,this.svg.y=this.svg.cy-SVG_DEFAULT_DIMENSIONS_HALF,this.transform={},this.transform.scale={},this.transform.scale.x=this.transform.scale.y=1,this.transform.rotate={},this.transform.rotate.x=this.transform.rotate.y=0,this.transform.skew={},this.transform.skew.x=this.transform.skew.y=0,this.config.position.scale&&(this.transform.scale.x=this.transform.scale.y=this.config.position.scale),this.config.position.rotate&&(this.transform.rotate.x=this.transform.rotate.y=this.config.position.rotate),this.transform.scale.x=this.config.position.scale_x||this.config.position.scale||1,this.transform.scale.y=this.config.position.scale_y||this.config.position.scale||1,this.transform.rotate.x=this.config.position.rotate_x||this.config.position.rotate||0,this.transform.rotate.y=this.config.position.rotate_y||this.config.position.rotate||0,this.dev.debug&&console.log("Toolset::constructor config/svg",this.toolsetId,this.config,this.svg);const i={area:EntityAreaTool,circslider:CircularSliderTool,badge:BadgeTool,bar:SparklineBarChartTool,circle:CircleTool,ellipse:EllipseTool,horseshoe:HorseshoeTool,icon:EntityIconTool,line:LineTool,name:EntityNameTool,rectangle:RectangleTool,rectex:RectangleToolEx,regpoly:RegPolyTool,segarc:SegmentedArcTool,state:EntityStateTool,slider:RangeSliderTool,switch:SwitchTool,text:TextTool,usersvg:UserSvgTool};this.config.tools.map(t=>{var s={...t},e={cx:0*SVG_DEFAULT_DIMENSIONS,cy:0*SVG_DEFAULT_DIMENSIONS,scale:this.config.position.scale||1};this.dev.debug&&console.log("Toolset::constructor toolConfig",this.toolsetId,s,e),t.disabled||(s=new i[t.type](this,s,e),this._card.entityHistory.needed|="bar"==t.type,this.tools.push({type:t.type,index:t.id,tool:s}))}),this.dev.performance&&console.timeEnd("--\x3e "+this.toolsetId+" PERFORMANCE Toolset::constructor")}updateValues(){this.dev.performance&&console.time("--\x3e "+this.toolsetId+" PERFORMANCE Toolset::updateValues"),this.tools&&this.tools.map((s,t)=>{if(s.tool.config.hasOwnProperty("entity_index")&&(this.dev.debug&&console.log("Toolset::updateValues",s,t),s.tool.value=this._card.attributesStr[s.tool.config.entity_index]||this._card.secondaryInfoStr[s.tool.config.entity_index]||this._card.entitiesStr[s.tool.config.entity_index]),s.tool.config.hasOwnProperty("entity_indexes")){var e={};for(let t=0;t<s.tool.config.entity_indexes.length;++t)e[t]=this._card.attributesStr[s.tool.config.entity_indexes[t]]||this._card.secondaryInfoStr[s.tool.config.entity_indexes[t]]||this._card.entitiesStr[s.tool.config.entity_indexes[t]];s.tool.values=e}}),this.dev.performance&&console.timeEnd("--\x3e "+this.toolsetId+" PERFORMANCE Toolset::updateValues")}connectedCallback(){this.dev.performance&&console.time("--\x3e "+this.toolsetId+" PERFORMANCE Toolset::connectedCallback"),this.dev.debug&&console.log("*****Event - connectedCallback",this.toolsetId,(new Date).getTime()),this.dev.performance&&console.timeEnd("--\x3e "+this.toolsetId+" PERFORMANCE Toolset::connectedCallback")}disconnectedCallback(){this.dev.performance&&console.time("--\x3e "+this.cardId+" PERFORMANCE Toolset::disconnectedCallback"),this.dev.debug&&console.log("*****Event - disconnectedCallback",this.toolsetId,(new Date).getTime()),this.dev.performance&&console.timeEnd("--\x3e "+this.cardId+" PERFORMANCE Toolset::disconnectedCallback")}firstUpdated(e){this.dev.debug&&console.log("*****Event - Toolset::firstUpdated",this.toolsetId,(new Date).getTime()),this.tools&&this.tools.map((t,s)=>{"function"==typeof t.tool.firstUpdated&&t.tool.firstUpdated(e)})}updated(e){this.dev.debug&&console.log("*****Event - Updated",this.toolsetId,(new Date).getTime()),this.tools&&this.tools.map((t,s)=>{"function"==typeof t.tool.updated&&t.tool.updated(e)})}renderToolset(){this.dev.debug&&console.log("*****Event - renderToolset",this.toolsetId,(new Date).getTime());var t=this.tools.map(t=>svg`
          ${t.tool.render()}
      `);return svg`${t}`}render(){return this._card.isSafari||this._card.iOS?svg`
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
      `:svg`
        <g id="toolset-${this.toolsetId}" class="toolset__group-outer"
           transform="rotate(${this.transform.rotate.x}) scale(${this.transform.scale.x}, ${this.transform.scale.y})"
           style="transform-origin:center; transform-box:fill-box;">
          <svg style="overflow:visible;">
            <g class="toolset__group" transform="translate(${this.svg.cx}, ${this.svg.cy})">
              ${this.renderToolset()}
            </g>
            </svg>
        </g>
      `}}class BaseTool{constructor(t,s,e){this.toolId=Math.random().toString(36).substr(2,9),this.toolset=t,this._card=this.toolset._card,this.config=s,this.dev={...this._card.dev},this.toolsetPos=e,this.svg={},this.svg.cx=Utils.calculateSvgCoordinate(s.position.cx,0),this.svg.cy=Utils.calculateSvgCoordinate(s.position.cy,0),this.svg.height=s.position.height?Utils.calculateSvgDimension(s.position.height):0,this.svg.width=s.position.width?Utils.calculateSvgDimension(s.position.width):0,this.svg.x=this.svg.cx-this.svg.width/2,this.svg.y=this.svg.cy-this.svg.height/2,this.classes={},this.classes.card={},this.classes.toolset={},this.classes.tool={},this.styles={},this.styles.card={},this.styles.toolset={},this.styles.tool={},this.animationClass={},this.animationClassHasChanged=!0,this.animationStyle={},this.animationStyleHasChanged=!0,this.config?.show?.style||(this.config.show||(this.config.show={}),this.config.show.style="default"),this.colorStops={},this.config.colorstops&&this.config.colorstops.colors&&Object.keys(this.config.colorstops.colors).forEach(t=>{this.colorStops[t]=this.config.colorstops.colors[t]}),"colorstop"==this.config.show.style&&this.config?.colorstops.colors&&(this.sortedColorStops=Object.keys(this.config.colorstops.colors).map(t=>Number(t)).sort((t,s)=>t-s)),this.csnew={},this.config.csnew&&this.config.csnew.colors&&(this.config.csnew.colors.forEach((t,s)=>{this.csnew[t.stop]=this.config.csnew.colors[s]}),this.sortedcsnew=Object.keys(this.csnew).map(t=>Number(t)).sort((t,s)=>t-s))}textEllipsis(t,s){return s&&s<t.length?t.slice(0,s-1).concat("..."):t}set value(t){let s=t;if(this.dev.debug&&console.log("BaseTool set value(state)",s),void 0!==s&&this._stateValue?.toLowerCase()===s.toLowerCase())return!1;this.derivedEntity=null,this.config.derived_entity&&(this.derivedEntity=Templates.getJsTemplateOrValue(this,t,Merge.mergeDeep(this.config.derived_entity)),s=this.derivedEntity.state?.toString()),this._stateValuePrev=this._stateValue||s,this._stateValue=s;var e=!(this._stateValueIsDirty=!0);return this.activeAnimation=null,this.config.animations&&Object.keys(this.config.animations).map(t=>{var t=JSON.parse(JSON.stringify(this.config.animations[t])),s=Templates.getJsTemplateOrValue(this,this._stateValue,Merge.mergeDeep(t));if(e)return!0;switch(s.operator||"=="){case"==":e=void 0===this._stateValue?void 0===s.state||"undefined"===s.state.toLowerCase():this._stateValue.toLowerCase()==s.state.toLowerCase();break;case"!=":e=void 0===this._stateValue?"undefined"!=s.state.toLowerCase():this._stateValue.toLowerCase()!=s.state.toLowerCase();break;case">":void 0!==this._stateValue&&(e=Number(this._stateValue.toLowerCase())>Number(s.state.toLowerCase()));break;case"<":void 0!==this._stateValue&&(e=Number(this._stateValue.toLowerCase())<Number(s.state.toLowerCase()));break;case">=":void 0!==this._stateValue&&(e=Number(this._stateValue.toLowerCase())>=Number(s.state.toLowerCase()));break;case"<=":void 0!==this._stateValue&&(e=Number(this._stateValue.toLowerCase())<=Number(s.state.toLowerCase()));break;default:e=!1}if(this.dev.debug&&console.log("BaseTool, animation, match, value, config, operator",e,this._stateValue,s.state,s.operator),!e)return!0;this.animationClass&&s.reuse||(this.animationClass={}),s.classes&&(this.animationClass=Merge.mergeDeep(this.animationClass,s.classes)),this.animationStyle&&s.reuse||(this.animationStyle={}),s.styles&&(this.animationStyle=Merge.mergeDeep(this.animationStyle,s.styles)),this.animationStyleHasChanged=!0,this.item=s,this.activeAnimation=s}),!0}EnableHoverForInteraction(){var t=this.config.hasOwnProperty("entity_index")||this.config?.user_actions?.tap_action;this.classes.tool.hover=t}MergeAnimationStyleIfChanged(t){this.animationStyleHasChanged&&(this.animationStyleHasChanged=!1,this.styles=t?Merge.mergeDeep(t,this.config.styles,this.animationStyle):Merge.mergeDeep(this.config.styles,this.animationStyle),this.styles.card)&&0!=Object.keys(this.styles.card).length&&(this._card.styles.card=Merge.mergeDeep(this.styles.card))}MergeAnimationClassIfChanged(t){this.animationClassHasChanged=!0,this.animationClassHasChanged&&(this.animationClassHasChanged=!1,this.classes=t?Merge.mergeDeep(t,this.config.classes,this.animationClass):Merge.mergeDeep(this.config.classes,this.animationClass))}MergeColorFromState(t){var s;this.config.hasOwnProperty("entity_index")&&""!=(s=this.getColorFromState(this._stateValue))&&(t.fill=this.config[this.config.show.style].fill?s:"",t.stroke=this.config[this.config.show.style].stroke?s:"")}MergeColorFromState2(t,s){var e;this.config.hasOwnProperty("entity_index")&&(e=this.config[this.config.show.style].fill?this.getColorFromState2(this._stateValue,s,"fill"):"",s=this.config[this.config.show.style].stroke?this.getColorFromState2(this._stateValue,s,"stroke"):"",""!=e&&(t.fill=e),""!=s)&&(t.stroke=s)}getColorFromState(t){var s="";switch(this.config.show.style){case"default":break;case"fixedcolor":s=this.config.color;break;case"colorstop":case"colorstops":case"colorstopgradient":s=this._card._calculateColor(t,this.colorStops,"colorstopgradient"===this.config.show.style);break;case"minmaxgradient":s=this._card._calculateColor(t,this.colorStopsMinMax,!0)}return s}getColorFromState2(t,s,e){var i="";switch(this.config.show.style){case"colorstop":case"colorstops":case"colorstopgradient":i=this._card._calculateColor2(t,this.csnew,s,e,"colorstopgradient"===this.config.show.style);break;case"minmaxgradient":i=this._card._calculateColor2(t,this.colorStopsMinMax,s,e,!0)}return i}_processTapEvent(s,e,t,i,o,a){let r;if(i){fireEvent(s,"haptic",i.haptic||"medium"),this.dev.debug&&console.log("_processTapEvent",t,i,o,a);for(let t=0;t<i.actions.length;t++)switch(i.actions[t].action){case"more-info":void 0!==o&&((r=new Event("hass-more-info",{composed:!0})).detail={entityId:o},s.dispatchEvent(r));break;case"navigate":if(!i.actions[t].navigation_path)return;window.history.pushState(null,"",i.actions[t].navigation_path),(r=new Event("location-changed",{composed:!0})).detail={replace:!1},window.dispatchEvent(r);break;case"call-service":if(!i.actions[t].service)return;var[n,h]=i.actions[t].service.split(".",2),l={...i.actions[t].service_data};l.entity_id||(l.entity_id=o),i.actions[t].parameter&&(l[i.actions[t].parameter]=a),e.callService(n,h,l)}}}handleTapEvent(t,s){t.stopPropagation(),t.preventDefault();let e;(e=s.hasOwnProperty("entity_index")&&!s.user_actions?{haptic:"light",actions:[{action:"more-info"}]}:s.user_actions?.tap_action)&&this._processTapEvent(this._card,this._card._hass,this.config,e,this._card.config.hasOwnProperty("entities")?this._card.config.entities[s.entity_index]?.entity:void 0,void 0)}}class CircularSliderTool extends BaseTool{constructor(t,s,e){switch(super(t,Merge.mergeDeep({position:{cx:50,cy:50,radius:45,start_angle:30,end_angle:230,track:{width:2},active:{width:4},thumb:{height:10,width:10,radius:5},capture:{height:25,width:25,radius:25},label:{placement:"none",cx:10,cy:10}},show:{uom:"end",active:!1},classes:{tool:{"sak-circslider":!0,hover:!0},capture:{"sak-circslider__capture":!0,hover:!0},active:{"sak-circslider__active":!0},track:{"sak-circslider__track":!0},thumb:{"sak-circslider__thumb":!0,hover:!0},label:{"sak-circslider__value":!0},uom:{"sak-circslider__uom":!0}},styles:{tool:{},active:{},capture:{},track:{},thumb:{},label:{},uom:{}},scale:{min:0,max:100,step:1}},s),e),this.svg.radius=Utils.calculateSvgDimension(this.config.position.radius),this.arc={},this.arc.startAngle=this.config.position.start_angle,this.arc.endAngle=this.config.position.end_angle,this.arc.size=range(this.config.position.end_angle,this.config.position.start_angle),this.arc.clockwise=this.config.position.end_angle>this.config.position.start_angle,this.arc.direction=this.arc.clockwise?1:-1,this.arc.pathLength=2*this.arc.size/360*Math.PI*this.svg.radius,this.arc.arcLength=2*Math.PI*this.svg.radius,this.arc.startAngle360=angle360(this.arc.startAngle,this.arc.startAngle,this.arc.endAngle),this.arc.endAngle360=angle360(this.arc.startAngle,this.arc.endAngle,this.arc.endAngle),this.arc.startAngleSvgPoint=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,this.arc.startAngle360),this.arc.endAngleSvgPoint=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,this.arc.endAngle360),this.arc.scaleDasharray=2*this.arc.size/360*Math.PI*this.svg.radius,this.arc.dashOffset=this.arc.clockwise?0:-this.arc.scaleDasharray-this.arc.arcLength,this.arc.currentAngle=this.arc.startAngle,this.svg.startAngle=this.config.position.start_angle,this.svg.endAngle=this.config.position.end_angle,this.svg.diffAngle=this.config.position.end_angle-this.config.position.start_angle,this.svg.pathLength=2*this.arc.size/360*Math.PI*this.svg.radius,this.svg.circleLength=2*Math.PI*this.svg.radius,this.svg.label={},this.config.position.label.placement){case"position":this.svg.label.cx=Utils.calculateSvgCoordinate(this.config.position.label.cx,0),this.svg.label.cy=Utils.calculateSvgCoordinate(this.config.position.label.cy,0);break;case"thumb":this.svg.label.cx=this.svg.cx,this.svg.label.cy=this.svg.cy;break;case"none":break;default:throw console.error("CircularSliderTool - constructor: invalid label placement [none, position, thumb] = ",this.config.position.label.placement),Error("CircularSliderTool::constructor - invalid label placement [none, position, thumb] = ",this.config.position.label.placement)}this.svg.track={},this.svg.track.width=Utils.calculateSvgDimension(this.config.position.track.width),this.svg.active={},this.svg.active.width=Utils.calculateSvgDimension(this.config.position.active.width),this.svg.thumb={},this.svg.thumb.width=Utils.calculateSvgDimension(this.config.position.thumb.width),this.svg.thumb.height=Utils.calculateSvgDimension(this.config.position.thumb.height),this.svg.thumb.radius=Utils.calculateSvgDimension(this.config.position.thumb.radius),this.svg.thumb.cx=this.svg.cx,this.svg.thumb.cy=this.svg.cy,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2,this.svg.capture={},this.svg.capture.width=Utils.calculateSvgDimension(Math.max(this.config.position.capture.width,1.2*this.config.position.thumb.width)),this.svg.capture.height=Utils.calculateSvgDimension(Math.max(this.config.position.capture.height,1.2*this.config.position.thumb.height)),this.svg.capture.radius=Utils.calculateSvgDimension(this.config.position.capture.radius),this.svg.capture.x1=this.svg.cx-this.svg.capture.width/2,this.svg.capture.y1=this.svg.cy-this.svg.capture.height/2,this.svg.rotate={},this.svg.rotate.degrees=this.arc.clockwise?-90+this.arc.startAngle:this.arc.endAngle360-90,this.svg.rotate.cx=this.svg.cx,this.svg.rotate.cy=this.svg.cy,this.classes.track={},this.classes.active={},this.classes.thumb={},this.classes.label={},this.classes.uom={},this.styles.track={},this.styles.active={},this.styles.thumb={},this.styles.label={},this.styles.uom={},this.svg.scale={},this.svg.scale.min=this.config.scale.min,this.svg.scale.max=this.config.scale.max,this.svg.scale.center=Math.abs(this.svg.scale.max-this.svg.scale.min)/2+this.svg.scale.min,this.svg.scale.svgPointMin=this.sliderValueToPoint(this.svg.scale.min),this.svg.scale.svgPointMax=this.sliderValueToPoint(this.svg.scale.max),this.svg.scale.svgPointCenter=this.sliderValueToPoint(this.svg.scale.center),this.svg.scale.step=this.config.scale.step,this.rid=null,this.thumbPos=this.sliderValueToPoint(this.config.scale.min),this.svg.thumb.x1=this.thumbPos.x-this.svg.thumb.width/2,this.svg.thumb.y1=this.thumbPos.y-this.svg.thumb.height/2,this.svg.capture.x1=this.thumbPos.x-this.svg.capture.width/2,this.svg.capture.y1=this.thumbPos.y-this.svg.capture.height/2,this.dev.debug&&console.log("CircularSliderTool::constructor",this.config,this.svg)}pointToAngle360(t,s,e){s=-Math.atan2(t.y-s.y,s.x-t.x)/(Math.PI/180);return(s+=-90)<0&&(s+=360),this.arc.clockwise&&s<this.arc.startAngle360&&(s+=360),this.arc.clockwise||s<this.arc.endAngle360&&(s+=360),s}isAngle360InBetween(t){t=this.arc.clockwise?t>=this.arc.startAngle360&&t<=this.arc.endAngle360:t<=this.arc.startAngle360&&t>=this.arc.endAngle360;return!!t}polarToCartesian(t,s,e,i,o){o=(o-90)*Math.PI/180;return{x:t+e*Math.cos(o),y:s+i*Math.sin(o)}}pointToSliderValue(t){let s,e;var i={},t=(i.x=this.svg.cx,i.y=this.svg.cy,this.pointToAngle360(t,i,!0)),i=this.myAngle,o=this.isAngle360InBetween(t);return o&&(this.myAngle=t,this.arc.currentAngle=i=t),this.arc.currentAngle=i,this.arc.clockwise&&(e=(i-this.arc.startAngle360)/this.arc.size),this.arc.clockwise||(e=(this.arc.startAngle360-i)/this.arc.size),s=(this.config.scale.max-this.config.scale.min)*e+this.config.scale.min,s=Math.round(s/this.svg.scale.step)*this.svg.scale.step,s=Math.max(Math.min(this.config.scale.max,s),this.config.scale.min),this.arc.currentAngle=i,this.dragging&&!o&&(s=round(this.svg.scale.min,s,this.svg.scale.max),this.m=this.sliderValueToPoint(s)),s}sliderValueToPoint(t){let s=Utils.calculateValueBetween(this.config.scale.min,this.config.scale.max,t);Number.isNaN(s)&&(s=0);let e;(e=this.arc.clockwise?this.arc.size*s+this.arc.startAngle360:this.arc.size*(1-s)+this.arc.endAngle360)<0&&(e+=360);t=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,e);return this.arc.currentAngle=e,t}updateValue(t){this._value=this.pointToSliderValue(t);Math.abs(0)<.01&&this.rid&&(window.cancelAnimationFrame(this.rid),this.rid=null)}updateThumb(t){var s;this.dragging&&(this.thumbPos=this.sliderValueToPoint(this._value),this.svg.thumb.x1=this.thumbPos.x-this.svg.thumb.width/2,this.svg.thumb.y1=this.thumbPos.y-this.svg.thumb.height/2,this.svg.capture.x1=this.thumbPos.x-this.svg.capture.width/2,this.svg.capture.y1=this.thumbPos.y-this.svg.capture.height/2,s=`rotate(${this.arc.currentAngle} ${this.svg.capture.width/2} ${this.svg.capture.height/2})`,this.elements.thumb.setAttribute("transform",s),this.elements.thumbGroup.setAttribute("x",this.svg.capture.x1),this.elements.thumbGroup.setAttribute("y",this.svg.capture.y1)),this.updateLabel(t)}updateActiveTrack(t){var s=this.config.scale.min||0,e=this.config.scale.max||100,s=this._card._calculateValueBetween(s,e,this.labelValue),e=(s=Number.isNaN(s)?0:s)*this.svg.pathLength;this.dashArray=e+" "+this.svg.circleLength,this.dragging&&this.elements.activeTrack.setAttribute("stroke-dasharray",this.dashArray)}updateLabel(t){this.dev.debug&&console.log("SLIDER - updateLabel start",t,this.config.position.orientation);var s=this._card.config.entities[this.config.entity_index].decimals||0,e=10**s;this.labelValue2=(Math.round(this.pointToSliderValue(t)*e)/e).toFixed(s),"none"!=this.config.position.label.placement&&(this.elements.label.textContent=this.labelValue2)}mouseEventToPoint(t){var s=this.elements.svg.createSVGPoint(),t=(s.x=(t.touches?t.touches[0]:t).clientX,s.y=(t.touches?t.touches[0]:t).clientY,this.elements.svg.getScreenCTM().inverse());return s=s.matrixTransform(t)}callDragService(){void 0!==this.labelValue2&&(this.labelValuePrev!=this.labelValue2&&(this.labelValuePrev=this.labelValue2,this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions.tap_action,this._card.config.entities[this.config.entity_index]?.entity,this.labelValue2)),this.dragging)&&(this.timeOutId=setTimeout(()=>this.callDragService(),this.config.user_actions.drag_action.update_interval))}callTapService(){void 0!==this.labelValue2&&this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions?.tap_action,this._card.config.entities[this.config.entity_index]?.entity,this.labelValue2)}firstUpdated(t){function s(){this.rid=window.requestAnimationFrame(s),this.updateValue(this.m),this.updateThumb(this.m),this.updateActiveTrack(this.m)}this.labelValue=this._stateValue,this.dev.debug&&console.log("circslider - firstUpdated"),this.elements={},this.elements.svg=this._card.shadowRoot.getElementById("circslider-".concat(this.toolId)),this.elements.track=this.elements.svg.querySelector("#track"),this.elements.activeTrack=this.elements.svg.querySelector("#active-track"),this.elements.capture=this.elements.svg.querySelector("#capture"),this.elements.thumbGroup=this.elements.svg.querySelector("#thumb-group"),this.elements.thumb=this.elements.svg.querySelector("#thumb"),this.elements.label=this.elements.svg.querySelector("#label tspan"),this.dev.debug&&console.log("circslider - firstUpdated svg = ",this.elements.svg,"activeTrack=",this.elements.activeTrack,"thumb=",this.elements.thumb,"label=",this.elements.label,"text=",this.elements.text);const e=()=>{var t=range(this.svg.scale.max,this.labelValue)<=this.rangeMax,s=range(this.svg.scale.min,this.labelValue)<=this.rangeMin,e=!(!s||!this.diffMax),i=!(!t||!this.diffMin);e?(this.labelValue=this.svg.scale.max,this.m=this.sliderValueToPoint(this.labelValue),this.rangeMax=this.svg.scale.max/10,this.rangeMin=range(this.svg.scale.max,this.svg.scale.min+this.svg.scale.max/5)):i?(this.labelValue=this.svg.scale.min,this.m=this.sliderValueToPoint(this.labelValue),this.rangeMax=range(this.svg.scale.min,this.svg.scale.max-this.svg.scale.max/5),this.rangeMin=this.svg.scale.max/10):(this.diffMax=t,this.diffMin=s,this.rangeMin=this.svg.scale.max/5,this.rangeMax=this.svg.scale.max/5)};var i=t=>{t.preventDefault(),this.dragging=!0,window.addEventListener("pointermove",a,!1),window.addEventListener("pointerup",o,!1),this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(0<this.config.user_actions.drag_action.update_interval?this.timeOutId=setTimeout(()=>this.callDragService(),this.config.user_actions.drag_action.update_interval):this.timeOutId=null),this.m=this.mouseEventToPoint(t),this.labelValue=this.pointToSliderValue(this.m),e(),this.dev.debug&&console.log("pointerDOWN",Math.round(100*this.m.x)/100),s.call(this)};const o=t=>{t.preventDefault(),this.dev.debug&&console.log("pointerUP"),window.removeEventListener("pointermove",a,!1),window.removeEventListener("pointerup",o,!1),window.removeEventListener("mousemove",a,!1),window.removeEventListener("touchmove",a,!1),window.removeEventListener("mouseup",o,!1),window.removeEventListener("touchend",o,!1),this.labelValuePrev=this.labelValue,this.dragging?(this.dragging=!1,clearTimeout(this.timeOutId),this.timeOutId=null,this.target=0,this.labelValue2=this.labelValue,s.call(this),this.callTapService()):e()},a=t=>{t.preventDefault(),this.dragging&&(this.m=this.mouseEventToPoint(t),this.labelValue=this.pointToSliderValue(this.m),e(),s.call(this))};this.elements.thumbGroup.addEventListener("touchstart",i,!1),this.elements.thumbGroup.addEventListener("mousedown",i,!1),this.elements.svg.addEventListener("wheel",t=>{t.preventDefault(),clearTimeout(this.wheelTimeOutId),this.dragging=!0,this.wheelTimeOutId=setTimeout(()=>{clearTimeout(this.timeOutId),this.timeOutId=null,this.labelValue2=this.labelValue,this.dragging=!1,this.callTapService()},500),this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(0<this.config.user_actions.drag_action.update_interval?this.timeOutId=setTimeout(()=>this.callDragService(),this.config.user_actions.drag_action.update_interval):this.timeOutId=null);t=+this.labelValue+(t.altKey?10*this.svg.scale.step:this.svg.scale.step)*Math.sign(t.deltaY);this.labelValue=clamp(this.svg.scale.min,t,this.svg.scale.max),this.m=this.sliderValueToPoint(this.labelValue),this.pointToSliderValue(this.m),s.call(this),this.labelValue2=this.labelValue},!1)}set value(t){var s,e,t=super.value=t;return this.dragging||(this.labelValue=this._stateValue),this.dragging||(e=this.config.scale.min||0,s=this.config.scale.max||100,e=Math.min(this._card._calculateValueBetween(e,s,this._stateValue),1),s=(e=Number.isNaN(e)?0:e)*this.svg.pathLength,this.dashArray=s+" "+this.svg.circleLength,e=this.sliderValueToPoint(this._stateValue),this.svg.thumb.x1=e.x-this.svg.thumb.width/2,this.svg.thumb.y1=e.y-this.svg.thumb.height/2,this.svg.capture.x1=e.x-this.svg.capture.width/2,this.svg.capture.y1=e.y-this.svg.capture.height/2),t}_renderUom(){var t,s,e,i;return"none"===this.config.show.uom?svg``:(this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.uom),s=.5,e="em",2==(i=(t=this.styles.label["font-size"]).match(/\D+|\d*\.?\d+/g)).length?(s=.6*Number(i[0]),e=i[1]):console.error("Cannot determine font-size for state/unit",t),t={"font-size":s+e},this.styles.uom=Merge.mergeDeep(this.config.styles.uom,t),i=this._card._buildUom(this.derivedEntity,this._card.entities[this.config.entity_index],this._card.config.entities[this.config.entity_index]),"end"===this.config.show.uom?svg`
          <tspan class="${classMap(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ${i}</tspan>
        `:"bottom"===this.config.show.uom?svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="1.5em"
            style="${styleMap(this.styles.uom)}">
            ${i}</tspan>
        `:"top"===this.config.show.uom?svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="-1.5em"
            style="${styleMap(this.styles.uom)}">
            ${i}</tspan>
        `:svg`
          <tspan class="${classMap(this.classes.uom)}"  dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ERR</tspan>
        `)}_renderCircSlider(){return this.MergeAnimationClassIfChanged(),this.MergeColorFromState(),this.MergeAnimationStyleIfChanged(),this.renderValue=this._stateValue,this.dragging?this.renderValue=this.labelValue2:this.elements?.label&&(this.elements.label.textContent=this.renderValue),svg`
      <g id="circslider__group-inner" class="circslider__group-inner">

        <circle id="track" class="sak-circslider__track" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          style="${styleMap(this.styles.track)}"
          stroke-dasharray="${this.arc.scaleDasharray} ${this.arc.arcLength}"
          stroke-dashoffset="${this.arc.dashOffset}"
          stroke-width="${this.svg.track.width}"
          transform="rotate(${this.svg.rotate.degrees} ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        <circle id="active-track" class="sak-circslider__active" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          fill="${this.config.fill||"rgba(0, 0, 0, 0)"}"
          style="${styleMap(this.styles.active)}"
          stroke-dasharray="${this.dashArray}"
          stroke-dashoffset="${this.arc.dashOffset}"
          stroke-width="${this.svg.active.width}"
          transform="rotate(${this.svg.rotate.degrees} ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        ${function(){return svg`
        <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}" style="filter:url(#sak-drop-1);overflow:visible;">
          <g style="transform-origin:center;transform-box: fill-box;" >
          <g id="thumb" transform="rotate(${this.arc.currentAngle} ${this.svg.capture.width/2} ${this.svg.capture.height/2})">

            <rect id="capture" class="${classMap(this.classes.capture)}" x="0" y="0"
              width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}" 
              style="${styleMap(this.styles.capture)}" 
            />

            <rect id="rect-thumb" class="${classMap(this.classes.thumb)}" x="${(this.svg.capture.width-this.svg.thumb.width)/2}" y="${(this.svg.capture.height-this.svg.thumb.height)/2}"
              width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
              style="${styleMap(this.styles.thumb)}"
            />

            </g>
            </g>
        </g>
      `}.call(this)}
        ${function(t){return"thumb"==this.config.position.label.placement&&t?svg`
      <text id="label">
        <tspan class="${classMap(this.classes.label)}" x="${this.svg.label.cx}" y="${this.svg.label.cy}" style="${styleMap(this.styles.label)}">
        ${this.renderValue}</tspan>
        ${this._renderUom()}
        </text>
        `:"position"!=this.config.position.label.placement||t?void 0:svg`
          <text id="label" style="transform-origin:center;transform-box: fill-box;">
            <tspan class="${classMap(this.classes.label)}" data-placement="position" x="${this.svg.label.cx}" y="${this.svg.label.cy}"
            style="${styleMap(this.styles.label)}">${this.renderValue||""}</tspan>
            ${this.renderValue?this._renderUom():""}
          </text>
          `}.call(this,!1)}
      </g>

    `}render(){return svg`
      <svg xmlns="http://www.w3.org/2000/svg" id="circslider-${this.toolId}" class="circslider__group-outer" overflow="visible"
        touch-action="none" style="touch-action:none;"
      >
        ${this._renderCircSlider()}

      </svg>
    `}}class RangeSliderTool extends BaseTool{constructor(t,s,e){switch(super(t,Merge.mergeDeep({descr:"none",position:{cx:50,cy:50,orientation:"horizontal",active:{width:0,height:0,radius:0},track:{width:16,height:7,radius:3.5},thumb:{width:9,height:9,radius:4.5,offset:4.5},label:{placement:"none"}},show:{uom:"end",active:!1},classes:{tool:{"sak-slider":!0,hover:!0},capture:{"sak-slider__capture":!0},active:{"sak-slider__active":!0},track:{"sak-slider__track":!0},thumb:{"sak-slider__thumb":!0},label:{"sak-slider__value":!0},uom:{"sak-slider__uom":!0}},styles:{tool:{},capture:{},active:{},track:{},thumb:{},label:{},uom:{}}},s),e),this.svg.activeTrack={},this.svg.activeTrack.radius=Utils.calculateSvgDimension(this.config.position.active.radius),this.svg.activeTrack.height=Utils.calculateSvgDimension(this.config.position.active.height),this.svg.activeTrack.width=Utils.calculateSvgDimension(this.config.position.active.width),this.svg.track={},this.svg.track.radius=Utils.calculateSvgDimension(this.config.position.track.radius),this.svg.thumb={},this.svg.thumb.radius=Utils.calculateSvgDimension(this.config.position.thumb.radius),this.svg.thumb.offset=Utils.calculateSvgDimension(this.config.position.thumb.offset),this.svg.capture={},this.svg.label={},this.config.position.orientation){case"horizontal":case"vertical":this.svg.capture.width=Utils.calculateSvgDimension(this.config.position.capture.width||1.1*this.config.position.track.width),this.svg.capture.height=Utils.calculateSvgDimension(this.config.position.capture.height||3*this.config.position.thumb.height),this.svg.track.width=Utils.calculateSvgDimension(this.config.position.track.width),this.svg.track.height=Utils.calculateSvgDimension(this.config.position.track.height),this.svg.thumb.width=Utils.calculateSvgDimension(this.config.position.thumb.width),this.svg.thumb.height=Utils.calculateSvgDimension(this.config.position.thumb.height),this.svg.capture.x1=this.svg.cx-this.svg.capture.width/2,this.svg.capture.y1=this.svg.cy-this.svg.capture.height/2,this.svg.track.x1=this.svg.cx-this.svg.track.width/2,this.svg.track.y1=this.svg.cy-this.svg.track.height/2,this.svg.activeTrack.x1="horizontal"==this.config.position.orientation?this.svg.track.x1:this.svg.cx-this.svg.activeTrack.width/2,this.svg.activeTrack.y1=this.svg.cy-this.svg.activeTrack.height/2,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2;break;default:throw console.error("RangeSliderTool - constructor: invalid orientation [vertical, horizontal] = ",this.config.position.orientation),Error("RangeSliderTool::constructor - invalid orientation [vertical, horizontal] = ",this.config.position.orientation)}switch("vertical"===this.config.position.orientation&&(this.svg.track.y2=this.svg.cy+this.svg.track.height/2,this.svg.activeTrack.y2=this.svg.track.y2),this.config.position.label.placement){case"position":this.svg.label.cx=Utils.calculateSvgCoordinate(this.config.position.label.cx,0),this.svg.label.cy=Utils.calculateSvgCoordinate(this.config.position.label.cy,0);break;case"thumb":this.svg.label.cx=this.svg.cx,this.svg.label.cy=this.svg.cy;break;case"none":break;default:throw console.error("RangeSliderTool - constructor: invalid label placement [none, position, thumb] = ",this.config.position.label.placement),Error("RangeSliderTool::constructor - invalid label placement [none, position, thumb] = ",this.config.position.label.placement)}this.classes.capture={},this.classes.track={},this.classes.thumb={},this.classes.label={},this.classes.uom={},this.styles.capture={},this.styles.track={},this.styles.thumb={},this.styles.label={},this.styles.uom={},this.svg.scale={},this.svg.scale.min=this.valueToSvg(this,this.config.scale.min),this.svg.scale.max=this.valueToSvg(this,this.config.scale.max),this.svg.scale.step=this.config.scale.step,this.dev.debug&&console.log("RangeSliderTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}svgCoordinateToSliderValue(t,s){var e;let i;switch(t.config.position.orientation){case"horizontal":var o=s.x-t.svg.track.x1-this.svg.thumb.width/2;i=o/(t.svg.track.width-this.svg.thumb.width);break;case"vertical":o=t.svg.track.y2-this.svg.thumb.height/2-s.y;i=o/(t.svg.track.height-this.svg.thumb.height)}return e=(t.config.scale.max-t.config.scale.min)*i+t.config.scale.min,e=Math.round(e/this.svg.scale.step)*this.svg.scale.step,Math.max(Math.min(this.config.scale.max,e),this.config.scale.min)}valueToSvg(t,s){var e;return"horizontal"==t.config.position.orientation?(e=Utils.calculateValueBetween(t.config.scale.min,t.config.scale.max,s)*(t.svg.track.width-this.svg.thumb.width),t.svg.track.x1+this.svg.thumb.width/2+e):"vertical"==t.config.position.orientation?(e=Utils.calculateValueBetween(t.config.scale.min,t.config.scale.max,s)*(t.svg.track.height-this.svg.thumb.height),t.svg.track.y2-this.svg.thumb.height/2-e):void 0}updateValue(t,s){this._value=this.svgCoordinateToSliderValue(t,s);Math.abs(0)<.01&&this.rid&&(window.cancelAnimationFrame(this.rid),this.rid=null)}updateThumb(t,s){switch(t.config.position.orientation){default:case"horizontal":this.config.position.label.placement,this.dragging?(e="thumb"==this.config.position.label.placement?-50:0,e=`translate(${s.x-this.svg.cx}px , ${e}px)`,t.elements.thumbGroup.style.transform=e):t.elements.thumbGroup.style.transform=`translate(${s.x-this.svg.cx}px, 0px)`;break;case"vertical":var e;this.dragging?(e=`translate(${"thumb"==this.config.position.label.placement?-50:0}px, ${s.y-this.svg.cy}px)`,t.elements.thumbGroup.style.transform=e):t.elements.thumbGroup.style.transform=`translate(0px, ${s.y-this.svg.cy}px)`}t.updateLabel(t,s)}updateActiveTrack(t,s){if(t.config.show.active)switch(t.config.position.orientation){default:case"horizontal":this.dragging&&t.elements.activeTrack.setAttribute("width",Math.abs(this.svg.activeTrack.x1-s.x+this.svg.cx));break;case"vertical":this.dragging&&(t.elements.activeTrack.setAttribute("y",s.y-this.svg.cy),t.elements.activeTrack.setAttribute("height",Math.abs(t.svg.activeTrack.y2-s.y+this.svg.cx)))}}updateLabel(t,s){this.dev.debug&&console.log("SLIDER - updateLabel start",s,t.config.position.orientation);var e=this._card.config.entities[this.config.entity_index].decimals||0,i=10**e;t.labelValue2=(Math.round(t.svgCoordinateToSliderValue(t,s)*i)/i).toFixed(e),"none"!=this.config.position.label.placement&&(t.elements.label.textContent=t.labelValue2)}mouseEventToPoint(t){var s=this.elements.svg.createSVGPoint(),t=(s.x=(t.touches?t.touches[0]:t).clientX,s.y=(t.touches?t.touches[0]:t).clientY,this.elements.svg.getScreenCTM().inverse());return s=s.matrixTransform(t)}callDragService(){void 0!==this.labelValue2&&(this.labelValuePrev!=this.labelValue2&&(this.labelValuePrev=this.labelValue2,this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions.tap_action,this._card.config.entities[this.config.entity_index]?.entity,this.labelValue2)),this.dragging)&&(this.timeOutId=setTimeout(()=>this.callDragService(),this.config.user_actions.drag_action.update_interval))}callTapService(){void 0!==this.labelValue2&&this.labelValuePrev!=this.labelValue2&&(this.labelValuePrev=this.labelValue2,this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions?.tap_action,this._card.config.entities[this.config.entity_index]?.entity,this.labelValue2))}firstUpdated(t){function i(){this.rid=window.requestAnimationFrame(i),this.updateValue(this,this.m),this.updateThumb(this,this.m),this.updateActiveTrack(this,this.m)}function s(t){t.preventDefault(),window.addEventListener("pointermove",a.bind(this),!1),window.addEventListener("pointerup",o.bind(this),!1);var s=this.mouseEventToPoint(t),e=this.svg.thumb.x1+this.svg.thumb.cx;s.x>e-10&&s.x<e+this.svg.thumb.width+10?(fireEvent(window,"haptic","heavy"),this.dragging=!0,this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(0<this.config.user_actions.drag_action.update_interval?this.timeOutId=setTimeout(()=>this.callDragService(),this.config.user_actions.drag_action.update_interval):this.timeOutId=null),this.m=this.mouseEventToPoint(t),"horizontal"==this.config.position.orientation?this.m.x=Math.round(this.m.x/this.svg.scale.step)*this.svg.scale.step:this.m.y=Math.round(this.m.y/this.svg.scale.step)*this.svg.scale.step,this.dev.debug&&console.log("pointerDOWN",Math.round(100*this.m.x)/100),i.call(this)):fireEvent(window,"haptic","error")}function o(t){t.preventDefault(),window.removeEventListener("pointermove",a.bind(this),!1),window.removeEventListener("pointerup",o.bind(this),!1),window.removeEventListener("mousemove",a.bind(this),!1),window.removeEventListener("touchmove",a.bind(this),!1),window.removeEventListener("mouseup",o.bind(this),!1),window.removeEventListener("touchend",o.bind(this),!1),this.dragging&&(this.dragging=!1,clearTimeout(this.timeOutId),this.target=0,this.dev.debug&&console.log("pointerUP"),i.call(this),this.callTapService())}function a(t){let s;if(t.preventDefault(),this.dragging){switch(this.m=this.mouseEventToPoint(t),this.config.position.orientation){case"horizontal":s=this.svgCoordinateToSliderValue(this,this.m),this.m.x=this.valueToSvg(this,s),this.m.x=Math.max(this.svg.scale.min,Math.min(this.m.x,this.svg.scale.max)),this.m.x=Math.round(this.m.x/this.svg.scale.step)*this.svg.scale.step;break;case"vertical":s=this.svgCoordinateToSliderValue(this,this.m),this.m.y=this.valueToSvg(this,s),this.m.y=Math.round(this.m.y/this.svg.scale.step)*this.svg.scale.step}i.call(this)}}this.labelValue=this._stateValue,this.dev.debug&&console.log("slider - firstUpdated"),this.elements={},this.elements.svg=this._card.shadowRoot.getElementById("rangeslider-".concat(this.toolId)),this.elements.capture=this.elements.svg.querySelector("#capture"),this.elements.track=this.elements.svg.querySelector("#rs-track"),this.elements.activeTrack=this.elements.svg.querySelector("#active-track"),this.elements.thumbGroup=this.elements.svg.querySelector("#rs-thumb-group"),this.elements.thumb=this.elements.svg.querySelector("#rs-thumb"),this.elements.label=this.elements.svg.querySelector("#rs-label tspan"),this.dev.debug&&console.log("slider - firstUpdated svg = ",this.elements.svg,"path=",this.elements.path,"thumb=",this.elements.thumb,"label=",this.elements.label,"text=",this.elements.text),this.elements.svg.addEventListener("touchstart",s.bind(this),!1),this.elements.svg.addEventListener("mousedown",s.bind(this),!1)}set value(t){t=super.value=t;return this.dragging||(this.labelValue=this._stateValue),t}_renderUom(){var t,s,e,i;return"none"===this.config.show.uom?svg``:(this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.uom),s=.5,e="em",2==(i=(t=this.styles.label["font-size"]).match(/\D+|\d*\.?\d+/g)).length?(s=.6*Number(i[0]),e=i[1]):console.error("Cannot determine font-size for state/unit",t),t={"font-size":s+e},this.styles.uom=Merge.mergeDeep(this.config.styles.uom,t),i=this._card._buildUom(this.derivedEntity,this._card.entities[this.config.entity_index],this._card.config.entities[this.config.entity_index]),"end"===this.config.show.uom?svg`
          <tspan class="${classMap(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ${i}</tspan>
        `:"bottom"===this.config.show.uom?svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="1.5em"
            style="${styleMap(this.styles.uom)}">
            ${i}</tspan>
        `:"top"===this.config.show.uom?svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="-1.5em"
            style="${styleMap(this.styles.uom)}">
            ${i}</tspan>
        `:svg`
          <tspan class="${classMap(this.classes.uom)}"  dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ERRR</tspan>
        `)}_renderRangeSlider(){this.dev.debug&&console.log("slider - _renderRangeSlider"),this.MergeAnimationClassIfChanged(),this.MergeColorFromState(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(),this.renderValue=this._stateValue,this.dragging?this.renderValue=this.labelValue2:this.elements?.label&&(this.elements.label.textContent=this.renderValue);let t,s;switch(this.config.position.label.placement){case"none":this.styles.label.display="none",this.styles.uom.display="none";break;case"position":t="horizontal"==this.config.position.orientation?this.valueToSvg(this,Number(this.renderValue))-this.svg.cx:0,s="vertical"==this.config.position.orientation?this.valueToSvg(this,Number(this.renderValue))-this.svg.cy:0;break;case"thumb":t="horizontal"==this.config.position.orientation?-this.svg.label.cx+this.valueToSvg(this,Number(this.renderValue)):0,s="vertical"==this.config.position.orientation?this.valueToSvg(this,Number(this.renderValue)):0,this.dragging&&("horizontal"==this.config.position.orientation?s-=50:t-=50);break;default:console.error("_renderRangeSlider(), invalid label placement",this.config.position.label.placement)}function e(t){return"thumb"==this.config.position.label.placement&&t?svg`
      <text id="rs-label">
        <tspan class="${classMap(this.classes.label)}" x="${this.svg.label.cx}" y="${this.svg.label.cy}" style="${styleMap(this.styles.label)}">
        ${this.renderValue}</tspan>
        ${this._renderUom()}
        </text>
        `:"position"!=this.config.position.label.placement||t?void 0:svg`
          <text id="rs-label" style="transform-origin:center;transform-box: fill-box;">
            <tspan class="${classMap(this.classes.label)}" data-placement="position" x="${this.svg.label.cx}" y="${this.svg.label.cy}"
            style="${styleMap(this.styles.label)}">${this.renderValue||""}</tspan>
            ${this.renderValue?this._renderUom():""}
          </text>
          `}this.svg.thumb.cx=t,this.svg.thumb.cy=s;var i=[];return i.push(svg`
      <rect id="capture" class="${classMap(this.classes.capture)}" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}"
      width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.track.radius}"          
      />

      <rect id="rs-track" class="${classMap(this.classes.track)}" x="${this.svg.track.x1}" y="${this.svg.track.y1}"
        width="${this.svg.track.width}" height="${this.svg.track.height}" rx="${this.svg.track.radius}"
        style="${styleMap(this.styles.track)}"
      />

      ${function(){return this.config.show.active?"horizontal"===this.config.position.orientation?svg`
          <rect id="active-track" class="${classMap(this.classes.active)}" x="${this.svg.activeTrack.x1}" y="${this.svg.activeTrack.y1}"
            width="${Math.abs(this.svg.thumb.x1-this.svg.activeTrack.x1+t+this.svg.thumb.width/2)}" height="${this.svg.activeTrack.height}" rx="${this.svg.activeTrack.radius}"
            style="${styleMap(this.styles.active)}" touch-action="none"
          />`:svg`
          <rect id="active-track" class="${classMap(this.classes.active)}" x="${this.svg.activeTrack.x1}" y="${s}"
            height="${Math.abs(this.svg.activeTrack.y1+s-this.svg.thumb.height)}" width="${this.svg.activeTrack.width}" rx="${this.svg.activeTrack.radius}"
            style="${styleMap(this.styles.active)}"
          />`:svg``}.call(this)}
      ${function(){return svg`
        <g id="rs-thumb-group" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}" style="transform:translate(${t}px, ${s}px);">
          <g style="transform-origin:center;transform-box: fill-box;">
            <rect id="rs-thumb" class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
              width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
              style="${styleMap(this.styles.thumb)}"
            />
            </g>
            ${e.call(this,!0)} 
        </g>
      `}.call(this)}
      ${e.call(this,!1)}


      `),i}render(){return svg`
      <svg xmlns="http://www.w3.org/2000/svg" id="rangeslider-${this.toolId}" overflow="visible"
        touch-action="none" style="touch-action:none; pointer-events:none;"
      >
        ${this._renderRangeSlider()}
      </svg>
    `}}class LineTool extends BaseTool{constructor(t,s,e){if(super(t,Merge.mergeDeep({position:{orientation:"vertical",length:"10",cx:"50",cy:"50"},classes:{tool:{"sak-line":!0,hover:!0},line:{"sak-line__line":!0}},styles:{tool:{},line:{}}},s),e),!["horizontal","vertical","fromto"].includes(this.config.position.orientation))throw Error("LineTool::constructor - invalid orientation [vertical, horizontal, fromto] = ",this.config.position.orientation);["horizontal","vertical"].includes(this.config.position.orientation)&&(this.svg.length=Utils.calculateSvgDimension(s.position.length)),"fromto"==this.config.position.orientation&&(this.svg.x1=Utils.calculateSvgCoordinate(s.position.x1,this.toolsetPos.cx),this.svg.y1=Utils.calculateSvgCoordinate(s.position.y1,this.toolsetPos.cy),this.svg.x2=Utils.calculateSvgCoordinate(s.position.x2,this.toolsetPos.cx),this.svg.y2=Utils.calculateSvgCoordinate(s.position.y2,this.toolsetPos.cy)),"vertical"==this.config.position.orientation?(this.svg.x1=this.svg.cx,this.svg.y1=this.svg.cy-this.svg.length/2,this.svg.x2=this.svg.cx,this.svg.y2=this.svg.cy+this.svg.length/2):"horizontal"==this.config.position.orientation?(this.svg.x1=this.svg.cx-this.svg.length/2,this.svg.y1=this.svg.cy,this.svg.x2=this.svg.cx+this.svg.length/2,this.svg.y2=this.svg.cy):this.config.position.orientation,this.classes.line={},this.styles.line={},this.dev.debug&&console.log("LineTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_renderLine(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.line),this.dev.debug&&console.log("_renderLine",this.config.position.orientation,this.svg.x1,this.svg.y1,this.svg.x2,this.svg.y2),svg`
      <line class="${classMap(this.classes.line)}"
        x1="${this.svg.x1}"
        y1="${this.svg.y1}"
        x2="${this.svg.x2}"
        y2="${this.svg.y2}"
        style="${styleMap(this.styles.line)}"/>
      `}render(){return svg`
      <g id="line-${this.toolId}" class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderLine()}
      </g>
    `}}class CircleTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({position:{cx:50,cy:50,radius:50},classes:{tool:{"sak-circle":!0,hover:!0},circle:{"sak-circle__circle":!0}},styles:{tool:{},circle:{}}},s),e),this.EnableHoverForInteraction(),this.svg.radius=Utils.calculateSvgDimension(s.position.radius),this.classes.circle={},this.styles.circle={},this.dev.debug&&console.log("CircleTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){return super.value=t}_renderCircle(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.circle),svg`
      <circle class="${classMap(this.classes.circle)}"
        cx="${this.svg.cx}"% cy="${this.svg.cy}"% r="${this.svg.radius}"
        style="${styleMap(this.styles.circle)}"
      </circle>

      `}render(){return svg`
      <g "" id="circle-${this.toolId}" class="${classMap(this.classes.tool)}" overflow="visible" transform-origin="${this.svg.cx} ${this.svg.cy}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderCircle()}
      </g>
    `}}class SwitchTool extends BaseTool{constructor(t,s,e){var i={position:{cx:50,cy:50,orientation:"horizontal",track:{width:16,height:7,radius:3.5},thumb:{width:9,height:9,radius:4.5,offset:4.5}},classes:{tool:{"sak-switch":!0,hover:!0},track:{"sak-switch__track":!0},thumb:{"sak-switch__thumb":!0}},styles:{tool:{},track:{},thumb:{}}};if(super(t,Merge.mergeDeep(i,s),e),!["horizontal","vertical"].includes(this.config.position.orientation))throw Error("SwitchTool::constructor - invalid orientation [vertical, horizontal] = ",this.config.position.orientation);switch(this.svg.track={},this.svg.track.radius=Utils.calculateSvgDimension(this.config.position.track.radius),this.svg.thumb={},this.svg.thumb.radius=Utils.calculateSvgDimension(this.config.position.thumb.radius),this.svg.thumb.offset=Utils.calculateSvgDimension(this.config.position.thumb.offset),this.config.position.orientation){default:case"horizontal":this.config=Merge.mergeDeep(i,{animations:[{state:"on",id:1,styles:{track:{fill:"var(--switch-checked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-checked-button-color)",transform:"translateX(4.5em)","pointer-events":"auto"}}},{state:"off",id:0,styles:{track:{fill:"var(--switch-unchecked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-unchecked-button-color)",transform:"translateX(-4.5em)","pointer-events":"auto"}}}]},s),this.svg.track.width=Utils.calculateSvgDimension(this.config.position.track.width),this.svg.track.height=Utils.calculateSvgDimension(this.config.position.track.height),this.svg.thumb.width=Utils.calculateSvgDimension(this.config.position.thumb.width),this.svg.thumb.height=Utils.calculateSvgDimension(this.config.position.thumb.height),this.svg.track.x1=this.svg.cx-this.svg.track.width/2,this.svg.track.y1=this.svg.cy-this.svg.track.height/2,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2;break;case"vertical":this.config=Merge.mergeDeep(i,{animations:[{state:"on",id:1,styles:{track:{fill:"var(--switch-checked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-checked-button-color)",transform:"translateY(-4.5em)","pointer-events":"auto"}}},{state:"off",id:0,styles:{track:{fill:"var(--switch-unchecked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-unchecked-button-color)",transform:"translateY(4.5em)","pointer-events":"auto"}}}]},s),this.svg.track.width=Utils.calculateSvgDimension(this.config.position.track.height),this.svg.track.height=Utils.calculateSvgDimension(this.config.position.track.width),this.svg.thumb.width=Utils.calculateSvgDimension(this.config.position.thumb.height),this.svg.thumb.height=Utils.calculateSvgDimension(this.config.position.thumb.width),this.svg.track.x1=this.svg.cx-this.svg.track.width/2,this.svg.track.y1=this.svg.cy-this.svg.track.height/2,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2}this.classes.track={},this.classes.thumb={},this.styles.track={},this.styles.thumb={},this.dev.debug&&console.log("SwitchTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){return super.value=t}_renderSwitch(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(this.styles),svg`
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
      `}render(){return svg`
      <g id="switch-${this.toolId}" class="${classMap(this.classes.tool)}" overflow="visible" transform-origin="${this.svg.cx} ${this.svg.cy}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderSwitch()}
      </g>
    `}}class RegPolyTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({position:{cx:50,cy:50,radius:50,side_count:6,side_skip:1,angle_offset:0},classes:{tool:{"sak-polygon":!0,hover:!0},regpoly:{"sak-polygon__regpoly":!0}},styles:{tool:{},regpoly:{}}},s),e),this.svg.radius=Utils.calculateSvgDimension(s.position.radius),this.classes.regpoly={},this.styles.regpoly={},this.dev.debug&&console.log("RegPolyTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){return super.value=t}_renderRegPoly(){return this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.regpoly),svg`
      <path class="${classMap(this.classes.regpoly)}"
        d="${function(t,s,e,i,o,a){for(var r=2*Math.PI/t,n=i+r,h="",l=0;l<t;l++)n+=s*r,h+=(0===l?"M":"L")+(o+~~(e*Math.cos(n)))+" "+(a+~~(e*Math.sin(n)))+" ",l*s%t==0&&0<l&&(n+=r,h+="M"+(o+~~(e*Math.cos(n)))+" "+(a+~~(e*Math.sin(n)))+" ");return h+="z"}(this.config.position.side_count,this.config.position.side_skip,this.svg.radius,this.config.position.angle_offset,this.svg.cx,this.svg.cy)}"
        style="${styleMap(this.styles.regpoly)}"
      />
      `}render(){return svg`
      <g "" id="regpoly-${this.toolId}" class="${classMap(this.classes.tool)}" transform-origin="${this.svg.cx} ${this.svg.cy}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderRegPoly()}
      </g>
    `}}class UserSvgTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({position:{cx:50,cy:50,height:50,width:50},styles:{usersvg:{},mask:{fill:"white"}}},s),e),this.images={},this.images=Object.assign({},...this.config.images),this.item={},this.item.image="default",this.injector={},this.injector.injectorOptions={evalScripts:"once",pngFallback:"assets/png"},this.injector.afterAllInjectionsFinishedCallback=function(t){}.bind(this),this.injector.perInjectionCallback=function(t){this.injector.svg=t}.bind(this),this.injector.injector=new SVGInjector(this.injector.injectorOptions),this.clipPath={},this.config.clip_path&&(this.svg.cp_cx=Utils.calculateSvgCoordinate(this.config.clip_path.position.cx||this.config.position.cx,0),this.svg.cp_cy=Utils.calculateSvgCoordinate(this.config.clip_path.position.cy||this.config.position.cy,0),this.svg.cp_height=Utils.calculateSvgDimension(this.config.clip_path.position.height||this.config.position.height),this.svg.cp_width=Utils.calculateSvgDimension(this.config.clip_path.position.width||this.config.position.width),t=Math.min(this.svg.cp_height,this.svg.cp_width)/2,this.svg.radiusTopLeft=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.clip_path.position.radius.top_left||this.config.clip_path.position.radius.left||this.config.clip_path.position.radius.top||this.config.clip_path.position.radius.all)))||0,this.svg.radiusTopRight=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.clip_path.position.radius.top_right||this.config.clip_path.position.radius.right||this.config.clip_path.position.radius.top||this.config.clip_path.position.radius.all)))||0,this.svg.radiusBottomLeft=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.clip_path.position.radius.bottom_left||this.config.clip_path.position.radius.left||this.config.clip_path.position.radius.bottom||this.config.clip_path.position.radius.all)))||0,this.svg.radiusBottomRight=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.clip_path.position.radius.bottom_right||this.config.clip_path.position.radius.right||this.config.clip_path.position.radius.bottom||this.config.clip_path.position.radius.all)))||0),this.dev.debug&&console.log("UserSvgTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){return super.value=t}updated(t){this.injector.elementsToInject=this._card.shadowRoot.querySelectorAll("svg[data-src]"),this.injector.elementsToInject=this._card.shadowRoot.getElementById("usersvg-".concat(this.toolId)).querySelectorAll("svg[data-src]:not(.injected-svg)"),0<this.injector.elementsToInject.length&&this.injector.injector.inject(this.injector.elementsToInject,this.injector.afterAllInjectionsFinishedCallback,this.injector.perInjectionCallback)}_renderUserSvg(){this.MergeAnimationStyleIfChanged();var t,s=Templates.getJsTemplateOrValue(this,this._stateValue,Merge.mergeDeep(this.images));return"none"===s[this.item.image]?svg``:(t="",this.config.clip_path&&(t=svg`
        <defs>
          <path  id="path-${this.toolId}"
            d="
              M ${this.svg.cp_cx+this.svg.radiusTopLeft+(this.svg.width-this.svg.cp_width)/2} ${this.svg.cp_cy+(this.svg.height-this.svg.cp_height)/2}
              h ${this.svg.cp_width-this.svg.radiusTopLeft-this.svg.radiusTopRight}
              a ${this.svg.radiusTopRight} ${this.svg.radiusTopRight} 0 0 1 ${this.svg.radiusTopRight} ${this.svg.radiusTopRight}
              v ${this.svg.cp_height-this.svg.radiusTopRight-this.svg.radiusBottomRight}
              a ${this.svg.radiusBottomRight} ${this.svg.radiusBottomRight} 0 0 1 -${this.svg.radiusBottomRight} ${this.svg.radiusBottomRight}
              h -${this.svg.cp_width-this.svg.radiusBottomRight-this.svg.radiusBottomLeft}
              a ${this.svg.radiusBottomLeft} ${this.svg.radiusBottomLeft} 0 0 1 -${this.svg.radiusBottomLeft} -${this.svg.radiusBottomLeft}
              v -${this.svg.cp_height-this.svg.radiusBottomLeft-this.svg.radiusTopLeft}
              a ${this.svg.radiusTopLeft} ${this.svg.radiusTopLeft}  0 0 1 ${this.svg.radiusTopLeft} -${this.svg.radiusTopLeft}
              ">
          </path>
          <clipPath id="clip-path-${this.toolId}">
            <use href="#path-${this.toolId}"/>
          </clipPath>
          <mask id="mask-${this.toolId}">
            <use href="#path-${this.toolId}" style="${styleMap(this.styles.mask)}"/>
          </mask>
        </defs>
        `),["png","jpg"].includes(s[this.item.image].substring(s[this.item.image].lastIndexOf(".")+1))?svg`
        <svg class="sak-usersvg__image" x="${this.svg.x}" y="${this.svg.y}" style="${styleMap(this.styles)}">
          "${t}"
          <image clip-path="url(#clip-path-${this.toolId})" mask="url(#mask-${this.toolId})" href="${s[this.item.image]}" height="${this.svg.height}" width="${this.svg.width}"/>
        </svg>
        `:svg`
        <svg class="sak-usersvg__image" data-some="${s[this.item.image]}" x="${this.svg.x}" y="${this.svg.y}" style="${styleMap(this.styles)}">
          "${t}"
          <image clip-path="url(#clip-path-${this.toolId})" mask="url(#mask-${this.toolId})" href="${s[this.item.image]}" height="${this.svg.height}" width="${this.svg.width}"/>
        </svg>
        `)}render(){return svg`
      <g id="usersvg-${this.toolId}" overflow="visible" transform-origin="${this.svg.cx} ${this.svg.cy}"
        style="${styleMap(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderUserSvg()}
      </g>
    `}}class RectangleTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({position:{cx:50,cy:50,width:50,height:50,rx:0},classes:{tool:{"sak-rectangle":!0,hover:!0},rectangle:{"sak-rectangle__rectangle":!0}},styles:{rectangle:{}}},s),e),this.svg.rx=s.position.rx?Utils.calculateSvgDimension(s.position.rx):0,this.classes.rectangle={},this.styles.rectangle={},this.dev.debug&&console.log("RectangleTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){return super.value=t}_renderRectangle(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.rectangle),svg`
      <rect class="${classMap(this.classes.rectangle)}"
        x="${this.svg.x}" y="${this.svg.y}" width="${this.svg.width}" height="${this.svg.height}" rx="${this.svg.rx}"
        style="${styleMap(this.styles.rectangle)}"/>
      `}render(){return svg`
      <g id="rectangle-${this.toolId}" class="${classMap(this.classes.tool)}" transform-origin="${this.svg.cx}px ${this.svg.cy}px"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderRectangle()}
      </g>
    `}}class RectangleToolEx extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({position:{cx:50,cy:50,width:50,height:50,radius:{all:0}},classes:{tool:{"sak-rectex":!0,hover:!0},rectex:{"sak-rectex__rectex":!0}},styles:{rectex:{}}},s),e),this.classes.rectex={},this.styles.rectex={};t=Math.min(this.svg.height,this.svg.width)/2,s=Utils.calculateSvgDimension(this.config.position.radius.all);this.svg.radiusTopLeft=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.position.radius.top_left||this.config.position.radius.left||this.config.position.radius.top||s)))||0,this.svg.radiusTopRight=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.position.radius.top_right||this.config.position.radius.right||this.config.position.radius.top||s)))||0,this.svg.radiusBottomLeft=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.position.radius.bottom_left||this.config.position.radius.left||this.config.position.radius.bottom||s)))||0,this.svg.radiusBottomRight=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.position.radius.bottom_right||this.config.position.radius.right||this.config.position.radius.bottom||s)))||0,this.dev.debug&&console.log("RectangleToolEx constructor config, svg",this.toolId,this.config,this.svg)}set value(t){return super.value=t}_renderRectangleEx(){this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(this.styles),this.MergeAnimationStyleIfChanged(),this.config.hasOwnProperty("csnew")?this.MergeColorFromState2(this.styles.rectex,"rectex"):this.MergeColorFromState(this.styles.rectex),this.counter||(this.counter=0),this.counter++;var t=svg`
      <g class="${classMap(this.classes.rectex)}" id="rectex-${this.toolId}">
        <path  d="
            M ${this.svg.x+this.svg.radiusTopLeft} ${this.svg.y}
            h ${this.svg.width-this.svg.radiusTopLeft-this.svg.radiusTopRight}
            q ${this.svg.radiusTopRight} 0 ${this.svg.radiusTopRight} ${this.svg.radiusTopRight}
            v ${this.svg.height-this.svg.radiusTopRight-this.svg.radiusBottomRight}
            q 0 ${this.svg.radiusBottomRight} -${this.svg.radiusBottomRight} ${this.svg.radiusBottomRight}
            h -${this.svg.width-this.svg.radiusBottomRight-this.svg.radiusBottomLeft}
            q -${this.svg.radiusBottomLeft} 0 -${this.svg.radiusBottomLeft} -${this.svg.radiusBottomLeft}
            v -${this.svg.height-this.svg.radiusBottomLeft-this.svg.radiusTopLeft}
            q 0 -${this.svg.radiusTopLeft} ${this.svg.radiusTopLeft} -${this.svg.radiusTopLeft}
            "
            counter="${this.counter}" 
            style="${styleMap(this.styles.rectex)}"/>
      </g>
      `;return svg`${t}`}render(){return svg`
      <g id="rectex-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderRectangleEx()}
      </g>
    `}}class EllipseTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({position:{cx:50,cy:50,radiusx:50,radiusy:25},classes:{tool:{"sak-ellipse":!0,hover:!0},ellipse:{"sak-ellipse__ellipse":!0}},styles:{ellipse:{}}},s),e),this.svg.radiusx=Utils.calculateSvgDimension(s.position.radiusx),this.svg.radiusy=Utils.calculateSvgDimension(s.position.radiusy),this.classes.ellipse={},this.styles.ellipse={},this.dev.debug&&console.log("EllipseTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_renderEllipse(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.ellipse),this.dev.debug&&console.log("EllipseTool - renderEllipse",this.svg.cx,this.svg.cy,this.svg.radiusx,this.svg.radiusy),svg`
      <ellipse class="${classMap(this.classes.ellipse)}"
        cx="${this.svg.cx}"% cy="${this.svg.cy}"%
        rx="${this.svg.radiusx}" ry="${this.svg.radiusy}"
        style="${styleMap(this.styles.ellipse)}"/>
      `}render(){return svg`
      <g id="ellipse-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderEllipse()}
      </g>
    `}}class EntityIconTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({classes:{tool:{"sak-icon":!0,hover:!0},icon:{"sak-icon__icon":!0}},styles:{icon:{}}},s),e),this.svg.iconSize=this.config.position.icon_size||3,this.svg.iconPixels=this.svg.iconSize*FONT_SIZE;t=this.config.position.align||"center",s="center"==t?.5:"start"==t?-1:1,e=400/this._card.viewBox.width;this.svg.xpx=this.svg.cx,this.svg.ypx=this.svg.cy,this._card.isSafari||this._card.iOS?(this.svg.iconSize=this.svg.iconSize*e,this.svg.xpx=this.svg.xpx*e-this.svg.iconPixels*s*e,this.svg.ypx=this.svg.ypx*e-.5*this.svg.iconPixels*e-.25*this.svg.iconPixels*e):(this.svg.xpx=this.svg.xpx-this.svg.iconPixels*s,this.svg.ypx=this.svg.ypx-.5*this.svg.iconPixels-.25*this.svg.iconPixels),this.classes.icon={},this.styles.icon={},this.dev.debug&&console.log("EntityIconTool constructor coords, dimensions, config",this.coords,this.dimensions,this.config)}_buildIcon(t,s,e){return this.activeAnimation?.icon||e||s?.icon||t?.attributes?.icon||stateIcon(t)}_renderIcon(){this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.icon);var t=this._buildIcon(this._card.entities[this.config.entity_index],this.config.hasOwnProperty("entity_index")?this._card.config.entities[this.config.entity_index]:void 0,this.config.icon),s=(this.svg.iconSize=this.config.position.icon_size||2,this.svg.iconPixels=this.svg.iconSize*FONT_SIZE,this.svg.iconSize=this.config.position.icon_size||2,this.svg.iconPixels=Utils.calculateSvgDimension(this.svg.iconSize),this.config.position.align||"center"),e="center"==s?.5:"start"==s?-1:1,i=400/this._card.viewBox.width;return this.svg.xpx=this.svg.cx,this.svg.ypx=this.svg.cy,this._card.isSafari||this._card.iOS?(this.svg.iconSize=this.svg.iconSize*i,this.svg.iconPixels=this.svg.iconPixels*i,this.svg.xpx=this.svg.xpx*i-this.svg.iconPixels*e*i,this.svg.ypx=this.svg.ypx*i-.9*this.svg.iconPixels*i,this.svg.xpx=this.svg.cx*i-this.svg.iconPixels*e*i,this.svg.ypx=this.svg.cy*i-this.svg.iconPixels*e*i):(this.svg.xpx=this.svg.cx-this.svg.iconPixels*e,this.svg.ypx=this.svg.cy-this.svg.iconPixels*e,this.dev.debug&&console.log("EntityIconTool::_renderIcon - svg values =",this.toolId,this.svg,this.config.cx,this.config.cy,s,e)),this.alternateColor||(this.alternateColor="rgba(0,0,0,0)"),SwissArmyKnifeCard.sakIconCache[t]?this.iconSvg=SwissArmyKnifeCard.sakIconCache[t]:(i=this._card.shadowRoot.getElementById("icon-".concat(this.toolId))?.shadowRoot?.querySelectorAll("*"),this.iconSvg=i?i[0]?.path:void 0,this.iconSvg&&(SwissArmyKnifeCard.sakIconCache[t]=this.iconSvg)),this.iconSvg?(this.svg.iconSize=this.config.position.icon_size||2,this.svg.iconPixels=Utils.calculateSvgDimension(this.svg.iconSize),this.svg.x1=this.svg.cx-this.svg.iconPixels/2,this.svg.y1=this.svg.cy-this.svg.iconPixels/2,this.svg.x1=this.svg.cx-.5*this.svg.iconPixels,this.svg.y1=this.svg.cy-.5*this.svg.iconPixels,s=this.svg.iconPixels/24,svg`
        <g id="icon-${this.toolId}" class="${classMap(this.classes.icon)}" style="${styleMap(this.styles.icon)}" x="${this.svg.x1}px" y="${this.svg.y1}px" transform-origin="${this.svg.cx} ${this.svg.cy}">
          <rect x="${this.svg.x1}" y="${this.svg.y1}" height="${this.svg.iconPixels}px" width="${this.svg.iconPixels}px" stroke-width="0px" fill="rgba(0,0,0,0)"></rect>
          <path d="${this.iconSvg}" transform="translate(${this.svg.x1},${this.svg.y1}) scale(${s})"></path>
        <g>
      `):svg`
        <foreignObject width="0px" height="0px" x="${this.svg.xpx}" y="${this.svg.ypx}" overflow="hidden">
          <body>
            <div class="div__icon, hover" xmlns="http://www.w3.org/1999/xhtml"
                style="line-height:${this.svg.iconPixels}px;position:relative;border-style:solid;border-width:0px;border-color:${this.alternateColor};fill:${this.alternateColor};color:${this.alternateColor};">
                <ha-icon icon=${t} id="icon-${this.toolId}"
                @animationstart=${t=>this._handleAnimationEvent(t,this)}
                @animationiteration=${t=>this._handleAnimationEvent(t,this)}
                style="animation: flash 0.15s 20;"></ha-icon>
            </div>
          </body>
        </foreignObject>
        `}_handleAnimationEvent(t,s){t.stopPropagation(),t.preventDefault(),s.iconSvg=this._card.shadowRoot.getElementById("icon-".concat(this.toolId))?.shadowRoot?.querySelectorAll("*")[0]?.path,s.iconSvg&&s._card.requestUpdate()}firstUpdated(t){}render(){return svg`
      <g "" id="icongrp-${this.toolId}" class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)} >

        ${this._renderIcon()}
      </g>
    `}}class BadgeTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({position:{cx:50,cy:50,width:100,height:25,radius:5,ratio:30,divider:30},classes:{tool:{"sak-badge":!0,hover:!0},left:{"sak-badge__left":!0},right:{"sak-badge__right":!0}},styles:{left:{},right:{}}},s),e),this.svg.radius=Utils.calculateSvgDimension(s.position.radius),this.svg.leftXpos=this.svg.x,this.svg.leftYpos=this.svg.y,this.svg.leftWidth=this.config.position.ratio/100*this.svg.width,this.svg.arrowSize=this.svg.height*this.config.position.divider/100/2,this.svg.divSize=this.svg.height*(100-this.config.position.divider)/100/2,this.svg.rightXpos=this.svg.x+this.svg.leftWidth,this.svg.rightYpos=this.svg.y,this.svg.rightWidth=(100-this.config.position.ratio)/100*this.svg.width,this.classes.left={},this.classes.right={},this.styles.left={},this.styles.right={},this.dev.debug&&console.log("BadgeTool constructor coords, dimensions",this.svg,this.config)}_renderBadge(){var t;return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),t=svg`
      <g  id="badge-${this.toolId}">
        <path class="${classMap(this.classes.right)}" d="
            M ${this.svg.rightXpos} ${this.svg.rightYpos}
            h ${this.svg.rightWidth-this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 ${this.svg.radius} ${this.svg.radius}
            v ${this.svg.height-2*this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 -${this.svg.radius} ${this.svg.radius}
            h -${this.svg.rightWidth-this.svg.radius}
            v -${this.svg.height-2*this.svg.radius}
            z
            "
            style="${styleMap(this.styles.right)}"/>

        <path class="${classMap(this.classes.left)}" d="
            M ${this.svg.leftXpos+this.svg.radius} ${this.svg.leftYpos}
            h ${this.svg.leftWidth-this.svg.radius}
            v ${this.svg.divSize}
            l ${this.svg.arrowSize} ${this.svg.arrowSize}
            l -${this.svg.arrowSize} ${this.svg.arrowSize}
            l 0 ${this.svg.divSize}
            h -${this.svg.leftWidth-this.svg.radius}
            a -${this.svg.radius} -${this.svg.radius} 0 0 1 -${this.svg.radius} -${this.svg.radius}
            v -${this.svg.height-2*this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 ${this.svg.radius} -${this.svg.radius}
            "
            style="${styleMap(this.styles.left)}"/>
      </g>
      `,svg`${t}`}render(){return svg`
      <g id="badge-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderBadge()}
      </g>
    `}}class EntityStateTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({show:{uom:"end"},classes:{tool:{"sak-state":!0,hover:!0},state:{"sak-state__value":!0},uom:{"sak-state__uom":!0}},styles:{state:{},uom:{}}},s),e),this.classes.state={},this.classes.uom={},this.styles.state={},this.styles.uom={},this.dev.debug&&console.log("EntityStateTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}set value(t){return super.value=t}_renderState(){this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.state);var t,s,e,i,o=this._stateValue;return o&&isNaN(o)&&(t=this._card.entities[this.config.entity_index],i=this._card._computeDomain(this._card.config.entities[this.config.entity_index].entity),s=this.config.locale_tag?this.config.locale_tag+o.toLowerCase():void 0,e=t.attributes?.device_class?`component.${i}.state.${t.attributes.device_class}.`+o:"--",i=`component.${i}.state._.`+o,o=s&&this._card.toLocale(s,o)||t.attributes?.device_class&&this._card.toLocale(e,o)||this._card.toLocale(i,o)||t.state,o=this.textEllipsis(o,this.config?.show?.ellipsis)),svg`
      <tspan class="${classMap(this.classes.state)}" x="${this.svg.x}" y="${this.svg.y}"
        style="${styleMap(this.styles.state)}">
        ${this.config?.text?.before?this.config.text.before:""}${o}${this.config?.text?.after?this.config.text.after:""}</tspan>
    `}_renderUom(){var t,s,e,i;return"none"===this.config.show.uom?svg``:(this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.uom),s=.5,e="em",2==(i=(t=this.styles.state["font-size"]).match(/\D+|\d*\.?\d+/g)).length?(s=.6*Number(i[0]),e=i[1]):console.error("Cannot determine font-size for state/unit",t),t={"font-size":s+e},this.styles.uom=Merge.mergeDeep(this.config.styles.uom,t),i=this._card._buildUom(this.derivedEntity,this._card.entities[this.config.entity_index],this._card.config.entities[this.config.entity_index]),"end"===this.config.show.uom?svg`
          <tspan class="${classMap(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ${i}</tspan>
        `:"bottom"===this.config.show.uom?svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.x}" dy="1.5em"
            style="${styleMap(this.styles.uom)}">
            ${i}</tspan>
        `:"top"===this.config.show.uom?svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.x}" dy="-1.5em"
            style="${styleMap(this.styles.uom)}">
            ${i}</tspan>
        `:svg``)}firstUpdated(t){}updated(t){}render(){return svg`
    <svg overflow="visible" id="state-${this.toolId}" class="${classMap(this.classes.tool)}">
        <text @click=${t=>this.handleTapEvent(t,this.config)}>
          ${this._renderState()}
          ${this._renderUom()}
        </text>
      </svg>
      `}}class EntityNameTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({classes:{tool:{"sak-name":!0,hover:!0},name:{"sak-name__name":!0}},styles:{tool:{},name:{}}},s),e),this._name={},this.classes.tool={},this.classes.name={},this.styles.name={},this.dev.debug&&console.log("EntityName constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_buildName(t,s){return this.activeAnimation?.name||s.name||t.attributes.friendly_name}_renderEntityName(){this.MergeAnimationClassIfChanged(),this.MergeColorFromState(this.styles.name),this.MergeAnimationStyleIfChanged();var t=this.textEllipsis(this._buildName(this._card.entities[this.config.entity_index],this._card.config.entities[this.config.entity_index]),this.config?.show?.ellipsis);return svg`
        <text>
          <tspan class="${classMap(this.classes.name)}" x="${this.svg.cx}" y="${this.svg.cy}" style="${styleMap(this.styles.name)}">${t}</tspan>
        </text>
      `}render(){return svg`
      <g id="name-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderEntityName()}
      </g>
    `}}class EntityAreaTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({classes:{tool:{},area:{"sak-area__area":!0,hover:!0}},styles:{tool:{},area:{}}},s),e),this.classes.area={},this.styles.area={},this.dev.debug&&console.log("EntityAreaTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_buildArea(t,s){return s.area||"?"}_renderEntityArea(){this.MergeAnimationClassIfChanged(),this.MergeColorFromState(this.styles.area),this.MergeAnimationStyleIfChanged();var t=this.textEllipsis(this._buildArea(this._card.entities[this.config.entity_index],this._card.config.entities[this.config.entity_index]),this.config?.show?.ellipsis);return svg`
        <text>
          <tspan class="${classMap(this.classes.area)}"
          x="${this.svg.cx}" y="${this.svg.cy}" style="${styleMap(this.styles.area)}">${t}</tspan>
        </text>
      `}render(){return svg`
      <g id="area-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderEntityArea()}
      </g>
    `}}class TextTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({classes:{tool:{"sak-text":!0},text:{"sak-text__text":!0,hover:!1}},styles:{tool:{},text:{}}},s),e),this.EnableHoverForInteraction(),this.text=this.config.text,this.styles.text={},this.dev.debug&&console.log("TextTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_renderText(){return this.MergeAnimationClassIfChanged(),this.MergeColorFromState(this.styles.text),this.MergeAnimationStyleIfChanged(),svg`
        <text>
          <tspan class="${classMap(this.classes.text)}" x="${this.svg.cx}" y="${this.svg.cy}" style="${styleMap(this.styles.text)}">${this.text}</tspan>
        </text>
      `}render(){return svg`
        <g id="text-${this.toolId}" class="${classMap(this.classes.tool)}"
          @click=${t=>this.handleTapEvent(t,this.config)}>
          ${this._renderText()}
        </g>
      `}}class HorseshoeTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({position:{cx:50,cy:50,radius:45},card_filter:"card--filter-none",horseshoe_scale:{min:0,max:100,width:3,color:"var(--primary-background-color)"},horseshoe_state:{width:6,color:"var(--primary-color)"},show:{horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"}},s),e),this.HORSESHOE_RADIUS_SIZE=.45*SVG_VIEW_BOX,this.TICKMARKS_RADIUS_SIZE=.43*SVG_VIEW_BOX,this.HORSESHOE_PATH_LENGTH=520/360*Math.PI*this.HORSESHOE_RADIUS_SIZE,this.config.entity_index=this.config.entity_index||0,this.svg.radius=Utils.calculateSvgDimension(this.config.position.radius),this.svg.radius_ticks=Utils.calculateSvgDimension(.95*this.config.position.radius),this.svg.horseshoe_scale={},this.svg.horseshoe_scale.width=Utils.calculateSvgDimension(this.config.horseshoe_scale.width),this.svg.horseshoe_state={},this.svg.horseshoe_state.width=Utils.calculateSvgDimension(this.config.horseshoe_state.width),this.svg.horseshoe_scale.dasharray=52/36*Math.PI*this.svg.radius,this.svg.rotate={},this.svg.rotate.degrees=-220,this.svg.rotate.cx=this.svg.cx,this.svg.rotate.cy=this.svg.cy,this.colorStops={},this.config.color_stops&&Object.keys(this.config.color_stops).forEach(t=>{this.colorStops[t]=this.config.color_stops[t]}),this.sortedStops=Object.keys(this.colorStops).map(t=>Number(t)).sort((t,s)=>t-s),this.colorStopsMinMax={},this.colorStopsMinMax[this.config.horseshoe_scale.min]=this.colorStops[this.sortedStops[0]],this.colorStopsMinMax[this.config.horseshoe_scale.max]=this.colorStops[this.sortedStops[this.sortedStops.length-1]],this.color0=this.colorStops[this.sortedStops[0]],this.color1=this.colorStops[this.sortedStops[this.sortedStops.length-1]],this.angleCoords={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},this.color1_offset="0%",this.dev.debug&&console.log("HorseshoeTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}set value(t){if(this._stateValue==t)return!1;this._stateValuePrev=this._stateValue||t,this._stateValue=t,this._stateValueIsDirty=!0;var s=this.config.horseshoe_scale.min||0,e=this.config.horseshoe_scale.max||100,s=Math.min(this._card._calculateValueBetween(s,e,t),1),e=s*this.HORSESHOE_PATH_LENGTH,i=10*this.HORSESHOE_RADIUS_SIZE,e=(this.dashArray=e+" "+i,this.config.show.horseshoe_style);return"fixed"==e?(this.stroke_color=this.config.horseshoe_state.color,this.color0=this.config.horseshoe_state.color,this.color1=this.config.horseshoe_state.color,this.color1_offset="0%"):"autominmax"==e?(i=this._card._calculateColor(t,this.colorStopsMinMax,!0),this.color0=i,this.color1=i,this.color1_offset="0%"):"colorstop"==e||"colorstopgradient"==e?(i=this._card._calculateColor(t,this.colorStops,"colorstopgradient"===e),this.color0=i,this.color1=i,this.color1_offset="0%"):"lineargradient"==e&&(i={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},this.color1_offset=Math.round(100*(1-s))+"%",this.angleCoords=i),this.dev.debug&&console.log("HorseshoeTool set value",this.cardId,t),!0}_renderTickMarks(){var t=this["config"];if(t.show.scale_tickmarks){for(var s,e=t.horseshoe_scale.color||"var(--primary-background-color)",i=t.horseshoe_scale.ticksize||(t.horseshoe_scale.max-t.horseshoe_scale.min)/10,o=t.horseshoe_scale.min%i,o=t.horseshoe_scale.min+(0==o?0:i-o),a=(o-t.horseshoe_scale.min)/(t.horseshoe_scale.max-t.horseshoe_scale.min)*260,r=(t.horseshoe_scale.max-o)/i,n=Math.floor(r),h=(260-a)/r,l=(Math.floor(n*i+o)<=t.horseshoe_scale.max&&n++,this.svg.horseshoe_scale.width?this.svg.horseshoe_scale.width/2:3),c=[],g=0;g<n;g++)s=a+(360-g*h-230)*Math.PI/180,c[g]=svg`
        <circle cx="${this.svg.cx-Math.sin(s)*this.svg.radius_ticks}"
                cy="${this.svg.cy-Math.cos(s)*this.svg.radius_ticks}" r="${l}"
                fill="${e}">
      `;return svg`${c}`}}_renderHorseShoe(){if(this.config.show.horseshoe)return svg`
      <g id="horseshoe__group-inner" class="horseshoe__group-inner">
        <circle id="horseshoe__scale" class="horseshoe__scale" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          fill="${this.fill||"rgba(0, 0, 0, 0)"}"
          stroke="${this.config.horseshoe_scale.color||"#000000"}"
          stroke-dasharray="${this.svg.horseshoe_scale.dasharray}"
          stroke-width="${this.svg.horseshoe_scale.width}"
          stroke-linecap="square"
          transform="rotate(-220 ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        <circle id="horseshoe__state__value" class="horseshoe__state__value" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          fill="${this.config.fill||"rgba(0, 0, 0, 0)"}"
          stroke="url('#horseshoe__gradient-${this.cardId}')"
          stroke-dasharray="${this.dashArray}"
          stroke-width="${this.svg.horseshoe_state.width}"
          stroke-linecap="square"
          transform="rotate(-220 ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        ${this._renderTickMarks()}
      </g>
    `}render(){return svg`
      <g "" id="horseshoe-${this.toolId}" class="horseshoe__group-outer"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderHorseShoe()}
      </g>

      <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
        <linearGradient gradientTransform="rotate(0)" id="horseshoe__gradient-${this.cardId}" x1="${this.angleCoords.x1}", y1="${this.angleCoords.y1}", x2="${this.angleCoords.x2}" y2="${this.angleCoords.y2}">
          <stop offset="${this.color1_offset}" stop-color="${this.color1}" />
          <stop offset="100%" stop-color="${this.color0}" />
        </linearGradient>
      </svg>

    `}}class SparklineBarChartTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({position:{cx:50,cy:50,height:25,width:25,margin:.5,orientation:"vertical"},hours:24,barhours:1,color:"var(--primary-color)",classes:{tool:{"sak-barchart":!0,hover:!0},bar:{},line:{"sak-barchart__line":!0,hover:!0}},styles:{tool:{},line:{},bar:{}},colorstops:[],show:{style:"fixedcolor"}},s),e),this.svg.margin=Utils.calculateSvgDimension(this.config.position.margin);t="vertical"==this.config.position.orientation?this.svg.width:this.svg.height;this.svg.barWidth=(t-(this.config.hours/this.config.barhours-1)*this.svg.margin)/(this.config.hours/this.config.barhours),this._data=[],this._bars=[],this._scale={},this._needsRendering=!1,this.classes.bar={},this.styles.tool={},this.styles.line={},this.stylesBar={},this.dev.debug&&console.log("SparkleBarChart constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}computeMinMax(){let e=this._series[0],i=this._series[0];for(let t=1,s=this._series.length;t<s;t++){var o=this._series[t];e=o<e?o:e,i=o>i?o:i}this._scale.min=e,this._scale.max=i,this._scale.size=i-e,this._scale.size=1.05*(i-e),this._scale.min=i-this._scale.size}set data(t){this._series=Object.assign(t),this.computeBars(),this._needsRendering=!0}set series(t){this._series=Object.assign(t),this.computeBars(),this._needsRendering=!0}hasSeries(){return this.config.entity_index}computeBars({_bars:e}=this){this.computeMinMax(),"minmaxgradient"===this.config.show.style&&(this.colorStopsMinMax={},this.colorStopsMinMax={[this._scale.min.toString()]:this.config.minmaxgradient.colors.min,[this._scale.max.toString()]:this.config.minmaxgradient.colors.max}),"vertical"==this.config.position.orientation?(this.dev.debug&&console.log("bar is vertical"),this._series.forEach((t,s)=>{e[s]||(e[s]={}),e[s].length=0==this._scale.size?0:(t-this._scale.min)/this._scale.size*this.svg.height,e[s].x1=this.svg.x+this.svg.barWidth/2+(this.svg.barWidth+this.svg.margin)*s,e[s].x2=e[s].x1,e[s].y1=this.svg.y+this.svg.height,e[s].y2=e[s].y1-this._bars[s].length,e[s].dataLength=this._bars[s].length})):"horizontal"==this.config.position.orientation?(this.dev.debug&&console.log("bar is horizontal"),this._data.forEach((t,s)=>{e[s]||(e[s]={}),e[s].length=0==this._scale.size?0:(t-this._scale.min)/this._scale.size*this.svg.width,e[s].y1=this.svg.y+this.svg.barWidth/2+(this.svg.barWidth+this.svg.margin)*s,e[s].y2=e[s].y1,e[s].x1=this.svg.x,e[s].x2=e[s].x1+this._bars[s].length,e[s].dataLength=this._bars[s].length})):this.dev.debug&&console.log("SparklineBarChartTool - unknown barchart orientation (horizontal or vertical)")}_renderBars({}=this){var e=[];if(0!=this._bars.length)return this.dev.debug&&console.log("_renderBars IN",this.toolId),this._bars.forEach((t,s)=>{this.dev.debug&&console.log("_renderBars - bars",t,s);t=this.getColorFromState(this._series[s]);this.stylesBar[s]||(this.stylesBar[s]={...this.config.styles.bar}),this._bars[s].y2||console.log("sparklebarchart y2 invalid",this._bars[s]),e.push(svg`
        <line id="line-segment-${this.toolId}-${s}" class="${classMap(this.config.classes.line)}"
                  style="${styleMap(this.stylesBar[s])}"
                  x1="${this._bars[s].x1}"
                  x2="${this._bars[s].x2}"
                  y1="${this._bars[s].y1}"
                  y2="${this._bars[s].y2}"
                  data-length="${this._bars[s].dataLength}"
                  stroke="${t}"
                  stroke-width="${this.svg.barWidth}"
                  />
        `)}),this.dev.debug&&console.log("_renderBars OUT",this.toolId),svg`${e}`}render(){return svg`
      <g id="barchart-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderBars()}
      </g>
    `}}class SegmentedArcTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({position:{cx:50,cy:50,radius:45,width:3,margin:1.5},color:"var(--primary-color)",classes:{tool:{},foreground:{},background:{}},styles:{foreground:{},background:{}},segments:{},colorstops:[],scale:{min:0,max:100,width:2,offset:-3.5},show:{style:"fixedcolor",scale:!1},isScale:!1,animation:{duration:1.5}},s),e),this.dev.performance&&console.time("--\x3e "+this.toolId+" PERFORMANCE SegmentedArcTool::constructor"),this.svg.radius=Utils.calculateSvgDimension(s.position.radius),this.svg.radiusX=Utils.calculateSvgDimension(s.position.radius_x||s.position.radius),this.svg.radiusY=Utils.calculateSvgDimension(s.position.radius_y||s.position.radius),this.svg.segments={},this.svg.segments.gap=Utils.calculateSvgDimension(this.config.segments.gap),this.svg.scale_offset=Utils.calculateSvgDimension(this.config.scale.offset),this._firstUpdatedCalled=!1,this._stateValue=null,this._stateValuePrev=null,this._stateValueIsDirty=!1,this._renderFrom=null,this._renderTo=null,this.rAFid=null,this.cancelAnimation=!1,this.arcId=null,this._cache=[],this._segmentAngles=[],this._segments={},this._arc={},this._arc.size=Math.abs(this.config.position.end_angle-this.config.position.start_angle),this._arc.clockwise=this.config.position.end_angle>this.config.position.start_angle,this._arc.direction=this._arc.clockwise?1:-1;if(this.config.segments.colorlist?.template&&(t=this.config.segments.colorlist,this._card.lovelace.config.sak_user_templates.templates[t.template.name])&&(this.dev.debug&&console.log("SegmentedArcTool::constructor - templates colorlist found",t.template.name),s=Templates.replaceVariables2(t.template.variables,this._card.lovelace.config.sak_user_templates.templates[t.template.name]),this.config.segments.colorlist=s),"fixedcolor"!=this.config.show.style)if("colorlist"==this.config.show.style){this._segments.count=this.config.segments.colorlist.colors.length,this._segments.size=this._arc.size/this._segments.count,this._segments.gap="undefined"!=this.config.segments.colorlist.gap?this.config.segments.colorlist.gap:1,this._segments.sizeList=[];for(var i=0;i<this._segments.count;i++)this._segments.sizeList[i]=this._segments.size;for(var o=0,i=0;i<this._segments.count;i++)this._segmentAngles[i]={boundsStart:this.config.position.start_angle+o*this._arc.direction,boundsEnd:this.config.position.start_angle+(o+this._segments.sizeList[i])*this._arc.direction,drawStart:this.config.position.start_angle+o*this._arc.direction+this._segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(o+this._segments.sizeList[i])*this._arc.direction-this._segments.gap*this._arc.direction},o+=this._segments.sizeList[i];this.dev.debug&&console.log("colorstuff - COLORLIST",this._segments,this._segmentAngles)}else if("colorstops"==this.config.show.style){this._segments.colorStops={},Object.keys(this.config.segments.colorstops.colors).forEach(t=>{t>=this.config.scale.min&&t<=this.config.scale.max&&(this._segments.colorStops[t]=this.config.segments.colorstops.colors[t])}),this._segments.sortedStops=Object.keys(this._segments.colorStops).map(t=>Number(t)).sort((t,s)=>t-s),void 0===this._segments.colorStops[this.config.scale.max]&&(this._segments.colorStops[this.config.scale.max]=this._segments.colorStops[this._segments.sortedStops[this._segments.sortedStops.length-1]],this._segments.sortedStops=Object.keys(this._segments.colorStops).map(t=>Number(t)).sort((t,s)=>t-s)),this._segments.count=this._segments.sortedStops.length-1,this._segments.gap="undefined"!=this.config.segments.colorstops.gap?this.config.segments.colorstops.gap:1;var a=this.config.scale.min,r=this.config.scale.max-this.config.scale.min;this._segments.sizeList=[];for(i=0;i<this._segments.count;i++){var n=this._segments.sortedStops[i+1]-a,n=(a+=n,n/r),n=n*this._arc.size;this._segments.sizeList[i]=n}for(o=0,i=0;i<this._segments.count;i++)this._segmentAngles[i]={boundsStart:this.config.position.start_angle+o*this._arc.direction,boundsEnd:this.config.position.start_angle+(o+this._segments.sizeList[i])*this._arc.direction,drawStart:this.config.position.start_angle+o*this._arc.direction+this._segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(o+this._segments.sizeList[i])*this._arc.direction-this._segments.gap*this._arc.direction},o+=this._segments.sizeList[i],this.dev.debug&&console.log("colorstuff - COLORSTOPS++ segments",o,this._segmentAngles[i]);this.dev.debug&&console.log("colorstuff - COLORSTOPS++",this._segments,this._segmentAngles,this._arc.direction,this._segments.count)}else this.config.show.style;if(this.config.isScale?this._stateValue=this.config.scale.max:this.config.show.scale?((t=Merge.mergeDeep(this.config)).id=t.id+"-scale",t.show.scale=!1,t.isScale=!0,t.position.width=this.config.scale.width,t.position.radius=this.config.position.radius-this.config.position.width/2+t.position.width/2+this.config.scale.offset,t.position.radius_x=(this.config.position.radius_x||this.config.position.radius)-this.config.position.width/2+t.position.width/2+this.config.scale.offset,t.position.radius_y=(this.config.position.radius_y||this.config.position.radius)-this.config.position.width/2+t.position.width/2+this.config.scale.offset,this._segmentedArcScale=new SegmentedArcTool(this,t,e)):this._segmentedArcScale=null,this.skipOriginal="colorstops"==this.config.show.style||"colorlist"==this.config.show.style,this.skipOriginal&&(this.config.isScale&&(this._stateValuePrev=this._stateValue),this._initialDraw=!1),this._arc.parts=Math.floor(this._arc.size/Math.abs(this.config.segments.dash)),this._arc.partsPartialSize=this._arc.size-this._arc.parts*this.config.segments.dash,this.skipOriginal)this._arc.parts=this._segmentAngles.length,this._arc.partsPartialSize=0;else{for(i=0;i<this._arc.parts;i++)this._segmentAngles[i]={boundsStart:this.config.position.start_angle+i*this.config.segments.dash*this._arc.direction,boundsEnd:this.config.position.start_angle+(i+1)*this.config.segments.dash*this._arc.direction,drawStart:this.config.position.start_angle+i*this.config.segments.dash*this._arc.direction+this.config.segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(i+1)*this.config.segments.dash*this._arc.direction-this.config.segments.gap*this._arc.direction};0<this._arc.partsPartialSize&&(this._segmentAngles[i]={boundsStart:this.config.position.start_angle+i*this.config.segments.dash*this._arc.direction,boundsEnd:this.config.position.start_angle+(i+0)*this.config.segments.dash*this._arc.direction+this._arc.partsPartialSize*this._arc.direction,drawStart:this.config.position.start_angle+i*this.config.segments.dash*this._arc.direction+this.config.segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(i+0)*this.config.segments.dash*this._arc.direction+this._arc.partsPartialSize*this._arc.direction-this.config.segments.gap*this._arc.direction})}this.starttime=null,this.dev.debug&&console.log("SegmentedArcTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config),this.dev.debug&&console.log("SegmentedArcTool - init",this.toolId,this.config.isScale,this._segmentAngles),this.dev.performance&&console.timeEnd("--\x3e "+this.toolId+" PERFORMANCE SegmentedArcTool::constructor")}get objectId(){return this.toolId}set value(t){return this.dev.debug&&console.log("SegmentedArcTool - set value IN"),!this.config.isScale&&this._stateValue!=t&&(super.value=t)}firstUpdated(t){this.dev.debug&&console.log("SegmentedArcTool - firstUpdated IN with _arcId/id",this._arcId,this.toolId,this.config.isScale),this._arcId=this._card.shadowRoot.getElementById("arc-".concat(this.toolId)),this._firstUpdatedCalled=!0,this._segmentedArcScale?.firstUpdated(t),this.skipOriginal&&(this.dev.debug&&console.log("RENDERNEW - firstUpdated IN with _arcId/id/isScale/scale/connected",this._arcId,this.toolId,this.config.isScale,this._segmentedArcScale,this._card.connected),this.config.isScale||(this._stateValuePrev=null),this._initialDraw=!0,this._card.requestUpdate())}updated(t){this.dev.debug&&console.log("SegmentedArcTool - updated IN")}render(){return this.dev.debug&&console.log("SegmentedArcTool RENDERNEW - Render IN"),svg`
      <g "" id="arc-${this.toolId}" class="arc">
        <g >
          ${this._renderSegments()}
          </g>
        ${this._renderScale()}
      </g>
    `}_renderScale(){if(this._segmentedArcScale)return this._segmentedArcScale.render()}_renderSegments(){if(this.skipOriginal){var d,u,s,v=this.svg.width,m=this.svg.radiusX,p=this.svg.radiusY,t=(this.dev.debug&&console.log("RENDERNEW - IN _arcId, firstUpdatedCalled",this._arcId,this._firstUpdatedCalled),Utils.calculateValueBetween(this.config.scale.min,this.config.scale.max,this._stateValue)),e=Utils.calculateValueBetween(this.config.scale.min,this.config.scale.max,this._stateValuePrev),i=(!this.dev.debug||this._stateValuePrev||console.log("*****UNDEFINED",this._stateValue,this._stateValuePrev,e),t!=e&&this.dev.debug&&console.log("RENDERNEW _renderSegments diff value old new",this.toolId,e,t),t=t*this._arc.size*this._arc.direction+this.config.position.start_angle,e=e*this._arc.size*this._arc.direction+this.config.position.start_angle,[]);if(!this.config.isScale)for(var o=0;o<this._segmentAngles.length;o++)d=this.buildArcPath(this._segmentAngles[o].drawStart,this._segmentAngles[o].drawEnd,this._arc.clockwise,this.svg.radiusX,this.svg.radiusY,this.svg.width),i.push(svg`<path id="arc-segment-bg-${this.toolId}-${o}" class="sak-segarc__background"
                              style="${styleMap(this.config.styles.background)}"
                              d="${d}"
                              />`);if(this._firstUpdatedCalled)this.dev.debug&&console.log("RENDERNEW _arcId DOES exist",this._arcId,this.toolId,this._firstUpdatedCalled),this._cache.forEach((t,s)=>{d=t,this.config.isScale&&(t=this.config.color,"colorlist"===this.config.show.style&&(t=this.config.segments.colorlist.colors[s]),"colorstops"===this.config.show.style&&(t=this._segments.colorStops[this._segments.sortedStops[s]]),this.styles.foreground[s]||(this.styles.foreground[s]=Merge.mergeDeep(this.config.styles.foreground)),this.styles.foreground[s].fill=t),i.push(svg`<path id="arc-segment-${this.toolId}-${s}" class="sak-segarc__foreground"
                            style="${styleMap(this.styles.foreground[s])}"
                            d="${d}"
                            />`)}),u={},1==(s=this)._card.connected&&this._renderTo!=this._stateValue&&(this._renderTo=this._stateValue,this.rAFid&&cancelAnimationFrame(this.rAFid),u.fromAngle=e,u.toAngle=t,u.runningAngle=e,u.duration=Math.min(Math.max(this._initialDraw?100:500,this._initialDraw?16:1e3*this.config.animation.duration),5e3),u.startTime=null,this.dev.debug&&console.log("RENDERNEW - tween",this.toolId,u),this.rAFid=requestAnimationFrame(function(t){!function s(t,e){var t=t||(new Date).getTime(),t=(u.startTime||(u.startTime=t,u.runningAngle=u.fromAngle),e.debug&&console.log("RENDERNEW - in animateSegmentsNEW",e.toolId,u),t-u.startTime),i=(u.progress=Math.min(t/u.duration,1),u.progress=(t=u.progress,Math.pow(--t,5)+1),e._arc.clockwise?u.toAngle>u.fromAngle:u.fromAngle>u.toAngle);u.frameAngle=u.fromAngle+(u.toAngle-u.fromAngle)*u.progress,-1==e._segmentAngles.findIndex((t,s)=>e._arc.clockwise?u.frameAngle<=t.boundsEnd&&u.frameAngle>=t.boundsStart:u.frameAngle<=t.boundsStart&&u.frameAngle>=t.boundsEnd)&&console.log("RENDERNEW animateSegments frameAngle not found",u,e._segmentAngles),g=e._segmentAngles.findIndex((t,s)=>e._arc.clockwise?u.runningAngle<=t.boundsEnd&&u.runningAngle>=t.boundsStart:u.runningAngle<=t.boundsStart&&u.runningAngle>=t.boundsEnd);do{var o=e._segmentAngles[g].drawStart,a=e._arc.clockwise?Math.min(e._segmentAngles[g].boundsEnd,u.frameAngle):Math.max(e._segmentAngles[g].boundsEnd,u.frameAngle),r=e._arc.clockwise?Math.min(e._segmentAngles[g].drawEnd,u.frameAngle):Math.max(e._segmentAngles[g].drawEnd,u.frameAngle),o=(d=e.buildArcPath(o,r,e._arc.clockwise,m,p,v),e.myarc||(e.myarc={}),e.as||(e.as={}),"arc-segment-".concat(e.toolId).concat("-").concat(g));if(e.as[g]||(e.as[g]=e._card.shadowRoot.getElementById(o)),r=e.as[g],e.myarc[g]=o,r&&(r.setAttribute("d",d),"colorlist"===e.config.show.style&&(r.style.fill=e.config.segments.colorlist.colors[g],e.styles.foreground[g].fill=e.config.segments.colorlist.colors[g]),e.config.show.lastcolor)){var n,o=e._arc.clockwise?e._segmentAngles[g].drawStart:e._segmentAngles[g].drawEnd,h=e._arc.clockwise?e._segmentAngles[g].drawEnd:e._segmentAngles[g].drawStart,h=Math.min(Math.max(0,(a-o)/(h-o)),1);if("colorstops"===e.config.show.style?n=e._card._getGradientValue(e._segments.colorStops[e._segments.sortedStops[g]],e._segments.colorStops[e._segments.sortedStops[g]],h):"colorlist"===e.config.show.style&&(n=e.config.segments.colorlist.colors[g]),e.styles.foreground[0].fill=n,e.as[0].style.fill=n,0<g)for(var l=g+1;l--;)e.styles.foreground[l].fill!=n&&(e.styles.foreground[l].fill=n,e.as[l].style.fill=n),e.styles.foreground[l].fill=n,e.as[l].style.fill=n}e._cache[g]=d,u.frameAngle!=a&&(a+=1e-6*e._arc.direction);var c=g,g=e._segmentAngles.findIndex((t,s)=>e._arc.clockwise?a<=t.boundsEnd&&a>=t.boundsStart:a<=t.boundsStart&&a>=t.boundsEnd)}while(i||c!=g&&(e.debug&&console.log("RENDERNEW movit - remove path",e.toolId,c),e._arc.clockwise,r.removeAttribute("d"),e._cache[c]=null),u.runningAngle=a,e.debug&&console.log("RENDERNEW - animation loop tween",e.toolId,u,g,c),u.runningAngle!=u.frameAngle);1!=u.progress?e.rAFid=requestAnimationFrame(function(t){s(t,e)}):(u.startTime=null,e.debug&&console.log("RENDERNEW - animation loop ENDING tween",e.toolId,u,g,c))}(t,s)}),this._initialDraw=!1);else{this.dev.debug&&console.log("RENDERNEW _arcId does NOT exist",this._arcId,this.toolId);for(var a=0;a<this._segmentAngles.length;a++){d=this.buildArcPath(this._segmentAngles[a].drawStart,this._segmentAngles[a].drawEnd,this._arc.clockwise,this.svg.radiusX,this.svg.radiusY,this.config.isScale?this.svg.width:0),this._cache[a]=d;var r=this.config.color;if("colorlist"===this.config.show.style&&(r=this.config.segments.colorlist.colors[a]),"colorstops"===this.config.show.style&&(r=this._segments.colorStops[this._segments.sortedStops[a]]),this.styles.foreground||(this.styles.foreground={}),this.styles.foreground[a]||(this.styles.foreground[a]=Merge.mergeDeep(this.config.styles.foreground)),this.styles.foreground[a].fill=r,this.config.show.lastcolor&&0<a)for(var n=a-1;n--;)this.styles.foreground[n].fill=r;i.push(svg`<path id="arc-segment-${this.toolId}-${a}" class="arc__segment"
                            style="${styleMap(this.styles.foreground[a])}"
                            d="${d}"
                            />`)}this.dev.debug&&console.log("RENDERNEW - svgItems",i,this._firstUpdatedCalled)}return svg`${i}`}}polarToCartesian(t,s,e,i,o){o=(o-90)*Math.PI/180;return{x:t+e*Math.cos(o),y:s+i*Math.sin(o)}}buildArcPath(t,s,e,i,o,a){var r=this.polarToCartesian(this.svg.cx,this.svg.cy,i,o,s),n=this.polarToCartesian(this.svg.cx,this.svg.cy,i,o,t),h=Math.abs(s-t)<=180?"0":"1",e=e?"0":"1",l=i-a,a=o-a,s=this.polarToCartesian(this.svg.cx,this.svg.cy,l,a,s),t=this.polarToCartesian(this.svg.cx,this.svg.cy,l,a,t);return["M",r.x,r.y,"A",i,o,0,h,e,n.x,n.y,"L",t.x,t.y,"A",l,a,0,h,"0"==e?"1":"0",s.x,s.y,"Z"].join(" ")}}class SwissArmyKnifeCard extends LitElement{constructor(){super(),this.connected=!1,this.cardId=Math.random().toString(36).substr(2,9),this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.secondaryInfoStr=[],this.viewBoxSize=SVG_VIEW_BOX,this.viewBox={width:SVG_VIEW_BOX,height:SVG_VIEW_BOX},this.toolsets=[],this.tools=[],this.styles={},this.styles.card={},this.entityHistory={},this.entityHistory.needed=!1,this.stateChanged=!0,this.entityHistory.updating=!1,this.entityHistory.update_interval=300,this.dev={},this.dev.debug=!1,this.dev.performance=!1,this.dev.m3=!1,this.configIsSet=!1,this.theme={},this.theme.modeChanged=!1,this.theme.darkMode=!1,this.isSafari=!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),this.iOS=(/iPad|iPhone|iPod/.test(navigator.userAgent)||"MacIntel"===navigator.platform&&1<navigator.maxTouchPoints)&&!window.MSStream,this.isSafari14=this.isSafari&&/Version\/14\.[^0-1]/.test(navigator.userAgent),this.isSafari15=this.isSafari&&/Version\/15\.[^0-1]/.test(navigator.userAgent),this.isSafari16=this.isSafari&&/Version\/16\.[^0-1]/.test(navigator.userAgent),this.lovelace=SwissArmyKnifeCard.lovelace,this.lovelace||console.error("card::constructor - Can't get Lovelace panel"),SwissArmyKnifeCard.sakIconCache||(SwissArmyKnifeCard.sakIconCache={}),SwissArmyKnifeCard.colorCache||(SwissArmyKnifeCard.colorCache=[]),this.dev.debug&&console.log("*****Event - card - constructor",this.cardId,(new Date).getTime())}static getSystemStyles(){return css`
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

    `}static getUserStyles(){return this.userContent="",SwissArmyKnifeCard.lovelace.config.sak_user_templates&&SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_css_definitions&&(this.userContent=SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_css_definitions.reduce((t,s)=>t+s.content,"")),css`${unsafeCSS(this.userContent)}`}static getSakStyles(){return this.sakContent="",SwissArmyKnifeCard.lovelace.config.sak_sys_templates&&SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_css_definitions&&(this.sakContent=SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_css_definitions.reduce((t,s)=>t+s.content,"")),css`${unsafeCSS(this.sakContent)}`}static getSakSvgDefinitions(){SwissArmyKnifeCard.lovelace.sakSvgContent=null;var t="";SwissArmyKnifeCard.lovelace.config.sak_sys_templates&&SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions&&(t=SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions.reduce((t,s)=>t+s.content,"")),SwissArmyKnifeCard.sakSvgContent=unsafeSVG(t)}static getUserSvgDefinitions(){SwissArmyKnifeCard.lovelace.userSvgContent=null;var t="";SwissArmyKnifeCard.lovelace.config.sak_user_templates&&SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_svg_definitions&&(t=SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_svg_definitions.reduce((t,s)=>t+s.content,"")),SwissArmyKnifeCard.userSvgContent=unsafeSVG(t)}static get styles(){if(console.log("SAK - get styles"),SwissArmyKnifeCard.lovelace||(SwissArmyKnifeCard.lovelace=Utils.getLovelace()),!SwissArmyKnifeCard.lovelace)throw console.error("SAK - Can't get reference to Lovelace"),Error("card::get styles - Can't get Lovelace panel");if(SwissArmyKnifeCard.lovelace.config.sak_sys_templates)return SwissArmyKnifeCard.lovelace.config.sak_user_templates||console.warning("SAK - User Templates reference NOT defined. Did you NOT include them?"),SwissArmyKnifeCard.getSakSvgDefinitions(),SwissArmyKnifeCard.getUserSvgDefinitions(),css`
      ${SwissArmyKnifeCard.getSystemStyles()}
      ${SwissArmyKnifeCard.getSakStyles()}
      ${SwissArmyKnifeCard.getUserStyles()}
    `;throw console.error("SAK - System Templates reference NOT defined."),Error("card::get styles - System Templates reference NOT defined!")}set hass(t){if(this.counter||(this.counter=0),this.counter++,t.themes.darkMode!=this.theme.darkMode&&(this.theme.darkMode=t.themes.darkMode,this.theme.modeChanged=!0),this.dev.debug&&console.log("*****Event - card::set hass",this.cardId,(new Date).getTime()),this._hass=t,this.connected||this.dev.debug&&console.log("set hass but NOT connected",this.cardId),this.config.entities){var s,i=!1,o=0,e=!1,a=!1;for(s of this.config.entities){if(this.entities[o]=t.states[this.config.entities[o].entity],void 0===this.entities[o])throw console.error("SAK - set hass, entity undefined: ",this.config.entities[o].entity),Error("Set hass, entity undefined: "+this.config.entities[o].entity);if(this.config.entities[o].secondary_info&&(e=!0,n=this.entities[o][this.config.entities[o].secondary_info],(n=this._buildSecondaryInfo(n,this.config.entities[o]))!=this.secondaryInfoStr[o])&&(this.secondaryInfoStr[o]=n,i=!0),this.config.entities[o].attribute){let t=this.config.entities[o].attribute,s="",e="";var r,n=this.config.entities[o].attribute.indexOf("["),h=this.config.entities[o].attribute.indexOf("."),l="";-1!=n?(t=this.config.entities[o].attribute.substr(0,n),r=(s=this.config.entities[o].attribute.substr(n,this.config.entities[o].attribute.length-n))[1],l=s.substr(4,s.length-4),e=this.entities[o].attributes[t][r][l]):-1!=h?(t=this.config.entities[o].attribute.substr(0,h),l=(s=this.config.entities[o].attribute.substr(n,this.config.entities[o].attribute.length-n)).substr(1,s.length-1),e=this.entities[o].attributes[t][l],console.log("set hass, attributes with map",this.config.entities[o].attribute,t,s)):e=this.entities[o].attributes[t],(r=this._buildState(e,this.config.entities[o]))!=this.attributesStr[o]&&(this.attributesStr[o]=r,i=!0),a=!0}a||e||((r=this._buildState(this.entities[o].state,this.config.entities[o]))!=this.entitiesStr[o]&&(this.entitiesStr[o]=r,i=!0),this.dev.debug&&console.log("set hass - attrSet=false",this.cardId,(new Date).getSeconds().toString()+"."+(new Date).getMilliseconds().toString(),r)),o++,e=a=!1}(i||this.theme.modeChanged)&&(this.toolsets&&this.toolsets.map((t,s)=>{t.updateValues()}),this.requestUpdate(),this.theme.modeChanged=!1,this.counter--)}}setConfig(t){if(this.dev.performance&&console.time("--\x3e "+this.cardId+" PERFORMANCE card::setConfig"),this.dev.debug&&console.log("*****Event - setConfig",this.cardId,(new Date).getTime()),(t=JSON.parse(JSON.stringify(t))).dev&&(this.dev={...this.dev,...t.dev}),this.dev.debug&&console.log("setConfig",this.cardId),!t.layout)throw Error("card::setConfig - No layout defined");if(t.entities){var s=this._computeDomain(t.entities[0].entity);if("sensor"!=s&&t.entities[0].attribute&&!isNaN(t.entities[0].attribute))throw Error("card::setConfig - First entity or attribute must be a numbered sensorvalue, but is NOT")}var s=Merge.mergeDeep(t),i=(this.config=s,this.toolset=[],this);function h(t,s){var e;return s?.template?((e=i.lovelace.config.sak_user_templates.templates[s.template.name])||console.error("Template not found...",s.template,e),e=Templates.replaceVariables3(s.template.variables,e),Merge.mergeDeep(e)):("template"==t&&console.log("findTemplate return key=template/value",t,void 0),s)}var t=JSON.stringify(this.config,h),l=JSON.parse(t).layout.toolsets;if(this.config.layout.template&&(this.config.layout=JSON.parse(t).layout),this.config.layout.toolsets.map((o,a)=>{var r=null,n=(this.toolsets||(this.toolsets=[]),!1),t=[],r=l[a].tools,s=(o.tools&&o.tools.map((e,i)=>{l[a].tools.map((t,s)=>{e.id==t.id&&(o.template&&(this.config.layout.toolsets[a].position&&(l[a].position=Merge.mergeDeep(this.config.layout.toolsets[a].position)),r[s]=Merge.mergeDeep(r[s],e),r[s]=JSON.parse(JSON.stringify(r[s],h)),n=!0),this.dev.debug)&&console.log("card::setConfig - got toolsetCfg toolid",e,i,t,s,e),l[a].tools[s]=Templates.getJsTemplateOrValueConfig(l[a].tools[s],Merge.mergeDeep(l[a].tools[s]))}),n||(t=t.concat(o.tools[i]))}),r=r.concat(t),o=l[a],new Toolset(this,o));this.toolsets.push(s)}),this.dev.m3&&(console.log("*** M3 - Checking for m3.yaml template to convert..."),this.lovelace.config.sak_user_templates.templates.m3)){var e,o,s=this.lovelace.config.sak_user_templates.templates.m3,a=(console.log("*** M3 - Found. Material 3 conversion starting..."),""),r="",n="",c="",g="",d="",u={},v={},m={};s.entities.map((t,s)=>{["ref.palette","sys.color","sys.color.light","sys.color.dark"].includes(t.category_id)&&!t.tags.includes("alias")&&(u[t.id]={value:t.value,tags:t.tags}),"ref.palette"===t.category_id&&(t.id,t.value,"md.ref.palette.primary40"===t.id&&(r=t.value),"md.ref.palette.primary80"===t.id&&(g=t.value),"md.ref.palette.neutral40"===t.id&&(n=t.value),"md.ref.palette.neutral80"===t.id)&&(d=t.value),"sys.color"===t.category_id&&(t.id,t.value),"sys.color.light"===t.category_id&&(t.id,t.value,"md.sys.color.surface.light"===t.id)&&(a=t.value),"sys.color.dark"===t.category_id&&(t.id,t.value,"md.sys.color.surface.dark"===t.id)&&(c=t.value)}),["primary","secondary","tertiary","error","neutral","neutral-variant"].forEach(s=>{[5,15,25,35,45,65,75,85].forEach(t=>{u["md.ref.palette."+s+t.toString()]={value:this._getGradientValue(u["md.ref.palette."+s+(t-5).toString()].value,u["md.ref.palette."+s+(t+5).toString()].value,.5),tags:[...u["md.ref.palette."+s+(t-5).toString()].tags]},u["md.ref.palette."+s+t.toString()].tags[3]=s+t.toString()}),u["md.ref.palette."+s+"7"]={value:this._getGradientValue(u["md.ref.palette."+s+"5"].value,u["md.ref.palette."+s+"10"].value,.5),tags:[...u["md.ref.palette."+s+"10"].tags]},u["md.ref.palette."+s+"7"].tags[3]=s+"7",u["md.ref.palette."+s+"92"]={value:this._getGradientValue(u["md.ref.palette."+s+"90"].value,u["md.ref.palette."+s+"95"].value,.5),tags:[...u["md.ref.palette."+s+"90"].tags]},u["md.ref.palette."+s+"92"].tags[3]=s+"92",u["md.ref.palette."+s+"97"]={value:this._getGradientValue(u["md.ref.palette."+s+"95"].value,u["md.ref.palette."+s+"99"].value,.5),tags:[...u["md.ref.palette."+s+"90"].tags]},u["md.ref.palette."+s+"97"].tags[3]=s+"97"});for([e,o]of Object.entries(u))v[e]="theme-"+o.tags[1]+"-"+o.tags[2]+"-"+o.tags[3]+": rgb("+p(o.value)+")",m[e]="theme-"+o.tags[1]+"-"+o.tags[2]+"-"+o.tags[3]+"-rgb: "+p(o.value);function p(t){var s={},t=(s.r=Math.round(parseInt(t.substr(1,2),16)),s.g=Math.round(parseInt(t.substr(3,2),16)),s.b=Math.round(parseInt(t.substr(5,2),16)),s.r+","+s.g+","+s.b);return t}function f(t,s,e,i,o){var a,r,n,h={},l={},c=(h.r=Math.round(parseInt(t.substr(1,2),16)),h.g=Math.round(parseInt(t.substr(3,2),16)),h.b=Math.round(parseInt(t.substr(5,2),16)),l.r=Math.round(parseInt(s.substr(1,2),16)),l.g=Math.round(parseInt(s.substr(3,2),16)),l.b=Math.round(parseInt(s.substr(5,2),16)),"");return e.forEach((t,s)=>{a=Math.round(t*l.r+(1-t)*h.r),r=Math.round(t*l.g+(1-t)*h.g),n=Math.round(t*l.b+(1-t)*h.b),c=(c+=i+(s+1).toString()+"-"+o+": rgb("+a+","+r+","+n+")\n")+(i+(s+1).toString())+"-"+o+"-rgb: "+a+","+r+","+n+"\n"}),c}var y,_,t=[.03,.05,.08,.11,.15,.19,.24,.29,.35,.4],s=[.05,.08,.11,.15,.19,.24,.29,.35,.4,.45],b=f(a,n,t,"  theme-ref-elevation-surface-neutral","light"),x=u["md.ref.palette.neutral-variant40"].value,x=f(a,x,t,"  theme-ref-elevation-surface-neutral-variant","light"),w=f(a,r,t,"  theme-ref-elevation-surface-primary","light"),S=u["md.ref.palette.secondary40"].value,S=f(a,S,t,"  theme-ref-elevation-surface-secondary","light"),$=u["md.ref.palette.tertiary40"].value,$=f(a,$,t,"  theme-ref-elevation-surface-tertiary","light"),k=u["md.ref.palette.error40"].value,k=f(a,k,t,"  theme-ref-elevation-surface-error","light"),t=f(c,d,s,"  theme-ref-elevation-surface-neutral","dark"),M=u["md.ref.palette.neutral-variant80"].value,M=f(c,M,s,"  theme-ref-elevation-surface-neutral-variant","dark"),T=f(c,g,s,"  theme-ref-elevation-surface-primary","dark"),I=u["md.ref.palette.secondary80"].value,I=f(c,I,s,"  theme-ref-elevation-surface-secondary","dark"),C=u["md.ref.palette.tertiary80"].value,C=f(c,C,s,"  theme-ref-elevation-surface-tertiary","dark"),E=u["md.ref.palette.error80"].value,E=f(c,E,s,"  theme-ref-elevation-surface-error","dark"),A="";for([y,_]of Object.entries(v))"theme-ref"==_.substring(0,9)&&(A=(A+="  "+_+"\n")+"  "+m[y]+"\n");console.log(b+x+w+S+$+k+t+M+T+I+C+E+A),console.log("*** M3 - Material 3 conversion DONE. You should copy the above output...")}this.aspectratio=(this.config.layout.aspectratio||this.config.aspectratio||"1/1").trim();s=this.aspectratio.split("/");this.viewBox||(this.viewBox={}),this.viewBox.width=s[0]*SVG_DEFAULT_DIMENSIONS,this.viewBox.height=s[1]*SVG_DEFAULT_DIMENSIONS,this.config.layout.styles?.card&&(this.styles.card=this.config.layout.styles.card),this.dev.debug&&console.log("Step 5: toolconfig, list of toolsets",this.toolsets),this.dev.debug&&console.log("debug - setConfig",this.cardId,this.config),this.dev.performance&&console.timeEnd("--\x3e "+this.cardId+" PERFORMANCE card::setConfig"),this.configIsSet=!0}connectedCallback(){this.dev.performance&&console.time("--\x3e "+this.cardId+" PERFORMANCE card::connectedCallback"),this.dev.debug&&console.log("*****Event - connectedCallback",this.cardId,(new Date).getTime()),this.connected=!0,super.connectedCallback(),this.entityHistory.update_interval&&(this.updateOnInterval(),clearInterval(this.interval),this.interval=setInterval(()=>this.updateOnInterval(),this._hass?1e3*this.entityHistory.update_interval:1e3)),this.dev.debug&&console.log("ConnectedCallback",this.cardId),this.requestUpdate(),this.dev.performance&&console.timeEnd("--\x3e "+this.cardId+" PERFORMANCE card::connectedCallback")}disconnectedCallback(){this.dev.performance&&console.time("--\x3e "+this.cardId+" PERFORMANCE card::disconnectedCallback"),this.dev.debug&&console.log("*****Event - disconnectedCallback",this.cardId,(new Date).getTime()),this.interval&&(clearInterval(this.interval),this.interval=0),super.disconnectedCallback(),this.dev.debug&&console.log("disconnectedCallback",this.cardId),this.connected=!1,this.dev.performance&&console.timeEnd("--\x3e "+this.cardId+" PERFORMANCE card::disconnectedCallback")}firstUpdated(e){this.dev.debug&&console.log("*****Event - card::firstUpdated",this.cardId,(new Date).getTime()),this.toolsets&&this.toolsets.map(async(t,s)=>{t.firstUpdated(e)})}updated(e){this.dev.debug&&console.log("*****Event - Updated",this.cardId,(new Date).getTime()),this.toolsets&&this.toolsets.map(async(t,s)=>{t.updated(e)})}render(){if(this.dev.performance&&console.time("--\x3e "+this.cardId+" PERFORMANCE card::render"),this.dev.debug&&console.log("*****Event - render",this.cardId,(new Date).getTime()),this.connected){var t;try{t=this.config.disable_card?html`
                  <div class="container" id="container">
                    ${this._renderSvg()}
                  </div>
                  `:html`
                  <ha-card style="${styleMap(this.styles.card)}">
                    <div class="container" id="container" 
                    >
                      ${this._renderSvg()}
                    </div>
                  </ha-card>
                  `}catch(t){console.error(t)}return this.dev.performance&&console.timeEnd("--\x3e "+this.cardId+" PERFORMANCE card::render"),t}this.dev.debug&&console.log("render but NOT connected",this.cardId,(new Date).getTime())}_renderSakSvgDefinitions(){return svg`
    ${SwissArmyKnifeCard.sakSvgContent}
    `}_renderUserSvgDefinitions(){return svg`
    ${SwissArmyKnifeCard.userSvgContent}
    `}themeIsDarkMode(){return 1==this.theme.darkMode}themeIsLightMode(){return 0==this.theme.darkMode}_RenderToolsets(){return this.dev.debug&&console.log("all the tools in renderTools",this.tools),svg`
              <g id="toolsets" class="toolsets__group"
              >
                ${this.toolsets.map(t=>t.render())}
              </g>

            <defs>
              ${this._renderSakSvgDefinitions()}
              ${this._renderUserSvgDefinitions()}
            </defs>
    `}_renderCardAttributes(){var s,e=[];this._attributes="";for(let t=0;t<this.entities.length;t++)s=this.attributesStr[t]||this.secondaryInfoStr[t]||this.entitiesStr[t],e.push(s);return this._attributes=e}_renderSvg(){var t=this.config.card_filter||"card--filter-none",s=[],e=(this._renderCardAttributes(),this._RenderToolsets());return s.push(svg`
      <svg id="rootsvg" xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
       class="${t}"
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
          ${e}
        </g>
    </svg>`),svg`${s}`}_buildUom(t,s,e){return t?.unit||e?.unit||s?.attributes.unit_of_measurement||""}toLocale(t,s="unknown"){var e=this._hass.selectedLanguage||this._hass.language,e=this._hass.resources[e];return e&&e[t]?e[t]:s}_buildState(t,s){var e,i;return isNaN(t)?"unavailable"===t?"-ua-":t:(e=Number(t),t=Math.sign(t),["0","-0"].includes(t)?t:void 0===s.decimals||Number.isNaN(s.decimals)||Number.isNaN(e)?"-1"==t?"-"+(Math.round(100*e)/100).toString():(Math.round(100*e)/100).toString():(i=10**s.decimals,"-1"==t?"-"+(Math.round(e*i)/i).toFixed(s.decimals).toString():(Math.round(e*i)/i).toFixed(s.decimals).toString()))}_buildSecondaryInfo(t,s){const e=t=>t<10?"0"+t:t;var i,o=this._hass.selectedLanguage||this._hass.language;if(["relative","total","date","time","datetime"].includes(s.format)){var a=new Date(t);if(!(a instanceof Date)||isNaN(a.getTime()))return t;switch(s.format){case"relative":var r=selectUnit(a,new Date),n=new Intl.RelativeTimeFormat(o,{numeric:"auto"}).format(r.value,r.unit);break;case"total":case"precision":n="Not Yet Supported";break;case"date":n=new Intl.DateTimeFormat(o,{year:"numeric",month:"numeric",day:"numeric"}).format(a);break;case"time":n=new Intl.DateTimeFormat(o,{hour:"numeric",minute:"numeric",second:"numeric"}).format(a);break;case"datetime":n=new Intl.DateTimeFormat(o,{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}).format(a)}return n}return isNaN(parseFloat(t))||!isFinite(t)?t:"brightness"===config.format?Math.round(t/255*100)+" %":"duration"===config.format?(s=t,t=Math.floor(s/3600),i=Math.floor(s%3600/60),s=Math.floor(s%3600%60),0<t?`${t}:${e(i)}:`+e(s):0<i?i+":"+e(s):0<s?""+s:null):void 0}_computeState(t,s){var e;return isNaN(t)?t:(t=Number(t),void 0===s||Number.isNaN(s)||Number.isNaN(t)?Math.round(100*t)/100:(e=10**s,(Math.round(t*e)/e).toFixed(s)))}_calculateColor(s,e,i){var o=Object.keys(e).map(t=>Number(t)).sort((t,s)=>t-s);let a,r,n;var h=o.length;if(s<=o[0])return e[o[0]];if(s>=o[h-1])return e[o[h-1]];for(let t=0;t<h-1;t++){var l=o[t],c=o[t+1];if(l<=s&&s<c){if([a,r]=[e[l],e[c]],!i)return a;n=this._calculateValueBetween(l,c,s);break}}return this._getGradientValue(a,r,n)}_calculateColor2(s,e,i,o,a){var r=Object.keys(e).map(t=>Number(t)).sort((t,s)=>t-s);let n,h,l;var c=r.length;if(s<=r[0])return e[r[0]];if(s>=r[c-1])return e[r[c-1]];for(let t=0;t<c-1;t++){var g=r[t],d=r[t+1];if(g<=s&&s<d){if([n,h]=[e[g].styles[i][o],e[d].styles[i][o]],!a)return n;l=this._calculateValueBetween(g,d,s);break}}return this._getGradientValue(n,h,l)}_calculateValueBetween(t,s,e){return(Math.min(Math.max(e,t),s)-t)/(s-t)}_getColorVariable(t){t=t.substr(4,t.length-5);return window.getComputedStyle(this).getPropertyValue(t)}_getGradientValue(t,s,e){var t=this._colorToRGBA(t),s=this._colorToRGBA(s),i=1-e,o=Math.floor(t[0]*i+s[0]*e),a=Math.floor(t[1]*i+s[1]*e),r=Math.floor(t[2]*i+s[2]*e),t=Math.floor(t[3]*i+s[3]*e);return"#"+this._padZero(o.toString(16))+this._padZero(a.toString(16))+this._padZero(r.toString(16))+this._padZero(t.toString(16))}_padZero(t){return(t=t.length<2?"0"+t:t).substr(0,2)}_computeDomain(t){return t.substr(0,t.indexOf("."))}_computeEntity(t){return t.substr(t.indexOf(".")+1)}_colorToRGBA(t){var s,e=SwissArmyKnifeCard.colorCache[t];return e||("var"===(e=t).substr(0,3).valueOf()&&(e=this._getColorVariable(t)),(s=document.createElement("canvas")).width=s.height=1,(s=s.getContext("2d")).clearRect(0,0,1,1),s.fillStyle=e,s.fillRect(0,0,1,1),e=[...s.getImageData(0,0,1,1).data],SwissArmyKnifeCard.colorCache[t]=e)}updateOnInterval(){this._hass?(this.stateChanged&&!this.entityHistory.updating&&this.updateData(),this.entityHistory.needed?(window.clearInterval(this.interval),this.interval=setInterval(()=>this.updateOnInterval(),1e3*this.entityHistory.update_interval)):this.interval&&(window.clearInterval(this.interval),this.interval=0)):this.dev.debug&&console.log("UpdateOnInterval - NO hass, returning")}async fetchRecent(t,s,e,i){let o="history/period";return s&&(o+="/"+s.toISOString()),o+="?filter_entity_id="+t,e&&(o+="&end_time="+e.toISOString()),i&&(o+="&skip_initial_state"),o+="&minimal_response",this._hass.callApi("GET",o)}async updateData({}=this){this.entityHistory.updating=!0,this.dev.debug&&console.log("card::updateData - ENTRY",this.cardId);let r=[];var n=0;this.toolsets.map((t,a)=>{t.tools.map((t,s)=>{var e,i,o;"bar"==t.type&&(e=new Date,(i=new Date).setHours(e.getHours()-t.tool.config.hours),o=this.config.entities[t.tool.config.entity_index].attribute||null,r[n]={tsidx:a,entityIndex:t.tool.config.entity_index,entityId:this.entities[t.tool.config.entity_index].entity_id,attrId:o,start:i,end:e,type:"bar",idx:s},n++)})}),this.dev.debug&&console.log("card::updateData - LENGTH",this.cardId,r.length,r),this.stateChanged=!1,this.dev.debug&&console.log("card::updateData, entityList from tools",r);try{var t=r.map((t,s)=>this.updateEntity(t,s,t.start,t.end));await Promise.all(t)}finally{this.entityHistory.updating=!1}}async updateEntity(s,t,e,i){var o=[];let a=await this.fetchRecent(s.entityId,e,i,!1);a[0]&&0<a[0].length&&(s.attrId&&(e=this.entities[s.entityIndex].attributes[this.config.entities[s.entityIndex].attribute],s.state=e),a=(a=a[0].filter(t=>s.attrId?!Number.isNaN(parseFloat(t.attributes[s.attrId])):!Number.isNaN(parseFloat(t.state)))).map(t=>({last_changed:t.last_changed,state:s.attrId?Number(t.attributes[s.attrId]):Number(t.state)}))),o=[...o,...a],this.uppdate(s,o)}uppdate(t,s){if(s){const r=(new Date).getTime();var i=24,o=2;"bar"==t.type&&(this.dev.debug&&console.log("entity.type == bar",t),i=this.toolsets[t.tsidx].tools[t.idx].tool.config.hours,o=this.toolsets[t.tsidx].tools[t.idx].tool.config.barhours);var e=s.reduce((t,s)=>{return t=t,s=s,e=(r-new Date(s.last_changed).getTime())/36e5/o-i/o,e=Math.floor(Math.abs(e)),t[e]||(t[e]=[]),t[e].push(s),t;var e},[]);if(e.length=Math.ceil(i/o),0!=Object.keys(e).length){s=Object.keys(e)[0];"0"!=s&&(e[0]=[],e[0].push(e[s][0]));for(var a=0;a<i/o;a++)e[a]||(e[a]=[],e[a].push(e[a-1][e[a-1].length-1]));s=(this.coords=e).map(t=>{return e="state",(t=t).reduce((t,s)=>t+Number(s[e]),0)/t.length;var e}),"bar"==t.type&&(this.toolsets[t.tsidx].tools[t.idx].tool.series=[...s]),this.requestUpdate()}}}getCardSize(){return 4}}customElements.define("swiss-army-knife-card",SwissArmyKnifeCard);