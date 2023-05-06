import{fireEvent}from"custom-card-helpers";import Merge from"./merge";import Utils from"./utils";import Templates from"./templates";export default class BaseTool{constructor(t,e,s){this.toolId=Math.random().toString(36).substr(2,9),this.toolset=t,this._card=this.toolset._card,this.config=e,this.dev={...this._card.dev},this.toolsetPos=s,this.svg={},this.svg.cx=Utils.calculateSvgCoordinate(e.position.cx,0),this.svg.cy=Utils.calculateSvgCoordinate(e.position.cy,0),this.svg.height=e.position.height?Utils.calculateSvgDimension(e.position.height):0,this.svg.width=e.position.width?Utils.calculateSvgDimension(e.position.width):0,this.svg.x=this.svg.cx-this.svg.width/2,this.svg.y=this.svg.cy-this.svg.height/2,this.classes={},this.classes.card={},this.classes.toolset={},this.classes.tool={},this.styles={},this.styles.card={},this.styles.toolset={},this.styles.tool={},this.animationClass={},this.animationClassHasChanged=!0,this.animationStyle={},this.animationStyleHasChanged=!0,this.config?.show?.style||(this.config.show||(this.config.show={}),this.config.show.style="default"),this.colorStops={},this.config.colorstops&&this.config.colorstops.colors&&Object.keys(this.config.colorstops.colors).forEach(t=>{this.colorStops[t]=this.config.colorstops.colors[t]}),"colorstop"===this.config.show.style&&this.config?.colorstops.colors&&(this.sortedColorStops=Object.keys(this.config.colorstops.colors).map(t=>Number(t)).sort((t,e)=>t-e)),this.csnew={},this.config.csnew&&this.config.csnew.colors&&(this.config.csnew.colors.forEach((t,e)=>{this.csnew[t.stop]=this.config.csnew.colors[e]}),this.sortedcsnew=Object.keys(this.csnew).map(t=>Number(t)).sort((t,e)=>t-e))}textEllipsis(t,e){return e&&e<t.length?t.slice(0,e-1).concat("..."):t}defaultEntityIndex(){return this.default||(this.default={},this.config.hasOwnProperty("entity_indexes")?this.default.entity_index=this.config.entity_indexes[0].entity_index:this.default.entity_index=this.config.entity_index),this.default.entity_index}set value(t){let e=t;if(this.dev.debug&&console.log("BaseTool set value(state)",e),void 0===e||this._stateValue?.toLowerCase()!==e.toLowerCase()){this.derivedEntity=null,this.config.derived_entity&&(this.derivedEntity=Templates.getJsTemplateOrValue(this,t,Merge.mergeDeep(this.config.derived_entity)),e=this.derivedEntity.state?.toString()),this._stateValuePrev=this._stateValue||e,this._stateValue=e;let s=!(this._stateValueIsDirty=!0);this.activeAnimation=null,this.config.animations&&Object.keys(this.config.animations).map(t=>{var t=JSON.parse(JSON.stringify(this.config.animations[t])),e=Templates.getJsTemplateOrValue(this,this._stateValue,Merge.mergeDeep(t));if(s)return!0;switch(e.operator||"=="){case"==":s=void 0===this._stateValue?void 0===e.state||"undefined"===e.state.toLowerCase():this._stateValue.toLowerCase()===e.state.toLowerCase();break;case"!=":s=void 0===this._stateValue?"undefined"!==e.state.toLowerCase():this._stateValue.toLowerCase()!==e.state.toLowerCase();break;case">":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())>Number(e.state.toLowerCase()));break;case"<":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())<Number(e.state.toLowerCase()));break;case">=":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())>=Number(e.state.toLowerCase()));break;case"<=":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())<=Number(e.state.toLowerCase()));break;default:s=!1}return this.dev.debug&&console.log("BaseTool, animation, match, value, config, operator",s,this._stateValue,e.state,e.operator),!s||(this.animationClass&&e.reuse||(this.animationClass={}),e.classes&&(this.animationClass=Merge.mergeDeep(this.animationClass,e.classes)),this.animationStyle&&e.reuse||(this.animationStyle={}),e.styles&&(this.animationStyle=Merge.mergeDeep(this.animationStyle,e.styles)),this.animationStyleHasChanged=!0,this.item=e,this.activeAnimation=e,s)})}}getEntityIndexFromAnimation(t){return t.hasOwnProperty("entity_index")?t.entity_index:this.config.hasOwnProperty("entity_index")?this.config.entity_index:this.config.entity_indexes?this.config.entity_indexes[0].entity_index:void 0}getIndexInEntityIndexes(e){return this.config.entity_indexes.findIndex(t=>t.entity_index===e)}stateIsMatch(t,e){let s;var t=JSON.parse(JSON.stringify(t)),i=Templates.getJsTemplateOrValue(this,e,Merge.mergeDeep(t));switch(i.operator||"=="){case"==":s=void 0===e?void 0===i.state||"undefined"===i.state.toLowerCase():e.toLowerCase()===i.state.toLowerCase();break;case"!=":s=void 0===e?void 0!==i.state||"undefined"!==i.state.toLowerCase():e.toLowerCase()!==i.state.toLowerCase();break;case">":void 0!==e&&(s=Number(e.toLowerCase())>Number(i.state.toLowerCase()));break;case"<":void 0!==e&&(s=Number(e.toLowerCase())<Number(i.state.toLowerCase()));break;case">=":void 0!==e&&(s=Number(e.toLowerCase())>=Number(i.state.toLowerCase()));break;case"<=":void 0!==e&&(s=Number(e.toLowerCase())<=Number(i.state.toLowerCase()));break;default:s=!1}return s}mergeAnimationData(t){this.animationClass&&t.reuse||(this.animationClass={}),t.classes&&(this.animationClass=Merge.mergeDeep(this.animationClass,t.classes)),this.animationStyle&&t.reuse||(this.animationStyle={}),t.styles&&(this.animationStyle=Merge.mergeDeep(this.animationStyle,t.styles)),this.animationStyleHasChanged=!0,this.item||(this.item={}),this.item=Merge.mergeDeep(this.item,t),this.activeAnimation={...t}}set values(a){this._lastStateValues||(this._lastStateValues=[]),this._stateValues||(this._stateValues=[]);var e=[...a];this.dev.debug&&console.log("BaseTool set values(state)",e);for(let t=0;t<a.length;++t){void 0!==e[t]&&this._stateValues[t]?.toLowerCase()!==e[t].toLowerCase()&&this.config.derived_entities&&(this.derivedEntities[t]=Templates.getJsTemplateOrValue(this,a[t],Merge.mergeDeep(this.config.derived_entities[t])),e[t]=this.derivedEntities[t].state?.toString()),this._lastStateValues[t]=this._stateValues[t]||e[t],this._stateValues[t]=e[t];let i=!(this._stateValueIsDirty=!0);this.activeAnimation=null,this.config.animations&&Object.keys(this.config.animations.map((t,e)=>{var s=this.getIndexInEntityIndexes(this.getEntityIndexFromAnimation(t));return!!(i=this.stateIsMatch(t,a[s]))&&(this.mergeAnimationData(t),!0)}))}this._stateValue=this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())],this._stateValuePrev=this._lastStateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]}EnableHoverForInteraction(){var t=this.config.hasOwnProperty("entity_index")||this.config?.user_actions?.tap_action;this.classes.tool.hover=!!t}MergeAnimationStyleIfChanged(t){this.animationStyleHasChanged&&(this.animationStyleHasChanged=!1,this.styles=t?Merge.mergeDeep(t,this.config.styles,this.animationStyle):Merge.mergeDeep(this.config.styles,this.animationStyle),this.styles.card)&&0!==Object.keys(this.styles.card).length&&(this._card.styles.card=Merge.mergeDeep(this.styles.card))}MergeAnimationClassIfChanged(t){this.animationClassHasChanged=!0,this.animationClassHasChanged&&(this.animationClassHasChanged=!1,this.classes=t?Merge.mergeDeep(t,this.config.classes,this.animationClass):Merge.mergeDeep(this.config.classes,this.animationClass))}MergeColorFromState(t){var e;this.config.hasOwnProperty("entity_index")&&""!==(e=this.getColorFromState(this._stateValue))&&(t.fill=this.config[this.config.show.style].fill?e:"",t.stroke=this.config[this.config.show.style].stroke?e:"")}MergeColorFromState2(t,e){var s;this.config.hasOwnProperty("entity_index")&&(s=this.config[this.config.show.style].fill?this.getColorFromState2(this._stateValue,e,"fill"):"",e=this.config[this.config.show.style].stroke?this.getColorFromState2(this._stateValue,e,"stroke"):"",""!==s&&(t.fill=s),""!==e)&&(t.stroke=e)}getColorFromState(t){let e="";switch(this.config.show.style){case"default":break;case"fixedcolor":e=this.config.color;break;case"colorstop":case"colorstops":case"colorstopgradient":e=this._card._calculateColor(t,this.colorStops,"colorstopgradient"===this.config.show.style);break;case"minmaxgradient":e=this._card._calculateColor(t,this.colorStopsMinMax,!0)}return e}getColorFromState2(t,e,s){let i="";switch(this.config.show.style){case"colorstop":case"colorstops":case"colorstopgradient":i=this._card._calculateColor2(t,this.csnew,e,s,"colorstopgradient"===this.config.show.style);break;case"minmaxgradient":i=this._card._calculateColor2(t,this.colorStopsMinMax,e,s,!0)}return i}_processTapEvent(e,s,t,i,a,o){let n;if(i){fireEvent(e,"haptic",i.haptic||"medium"),this.dev.debug&&console.log("_processTapEvent",t,i,a,o);for(let t=0;t<i.actions.length;t++)switch(i.actions[t].action){case"more-info":void 0!==a&&((n=new Event("hass-more-info",{composed:!0})).detail={entityId:a},e.dispatchEvent(n));break;case"navigate":if(!i.actions[t].navigation_path)return;window.history.pushState(null,"",i.actions[t].navigation_path),(n=new Event("location-changed",{composed:!0})).detail={replace:!1},window.dispatchEvent(n);break;case"call-service":if(!i.actions[t].service)return;var[r,h]=i.actions[t].service.split(".",2),l={...i.actions[t].service_data};l.entity_id||(l.entity_id=a),i.actions[t].parameter&&(l[i.actions[t].parameter]=o),s.callService(r,h,l);break;default:console.error("Unknown Event definition",i)}}}handleTapEvent(t,e){t.stopPropagation(),t.preventDefault();let s;(s=e.hasOwnProperty("entity_index")&&!e.user_actions?{haptic:"light",actions:[{action:"more-info"}]}:e.user_actions?.tap_action)&&this._processTapEvent(this._card,this._card._hass,this.config,s,this._card.config.hasOwnProperty("entities")?this._card.config.entities[e.entity_index]?.entity:void 0,void 0)}}