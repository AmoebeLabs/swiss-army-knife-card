import{svg}from"lit-element";import{classMap}from"lit-html/directives/class-map.js";import{styleMap}from"lit-html/directives/style-map.js";import Merge from"./merge";import Utils from"./utils";import BaseTool from"./base-tool";import{angle360,range,round,clamp}from"./const";export default class CircularSliderTool extends BaseTool{constructor(t,s,i){switch(super(t,Merge.mergeDeep({position:{cx:50,cy:50,radius:45,start_angle:30,end_angle:230,track:{width:2},active:{width:4},thumb:{height:10,width:10,radius:5},capture:{height:25,width:25,radius:25},label:{placement:"none",cx:10,cy:10}},show:{uom:"end",active:!1},classes:{tool:{"sak-circslider":!0,hover:!0},capture:{"sak-circslider__capture":!0,hover:!0},active:{"sak-circslider__active":!0},track:{"sak-circslider__track":!0},thumb:{"sak-circslider__thumb":!0,hover:!0},label:{"sak-circslider__value":!0},uom:{"sak-circslider__uom":!0}},styles:{tool:{},active:{},capture:{},track:{},thumb:{},label:{},uom:{}},scale:{min:0,max:100,step:1}},s),i),this.svg.radius=Utils.calculateSvgDimension(this.config.position.radius),this.arc={},this.arc.startAngle=this.config.position.start_angle,this.arc.endAngle=this.config.position.end_angle,this.arc.size=range(this.config.position.end_angle,this.config.position.start_angle),this.arc.clockwise=this.config.position.end_angle>this.config.position.start_angle,this.arc.direction=this.arc.clockwise?1:-1,this.arc.pathLength=2*this.arc.size/360*Math.PI*this.svg.radius,this.arc.arcLength=2*Math.PI*this.svg.radius,this.arc.startAngle360=angle360(this.arc.startAngle,this.arc.startAngle,this.arc.endAngle),this.arc.endAngle360=angle360(this.arc.startAngle,this.arc.endAngle,this.arc.endAngle),this.arc.startAngleSvgPoint=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,this.arc.startAngle360),this.arc.endAngleSvgPoint=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,this.arc.endAngle360),this.arc.scaleDasharray=2*this.arc.size/360*Math.PI*this.svg.radius,this.arc.dashOffset=this.arc.clockwise?0:-this.arc.scaleDasharray-this.arc.arcLength,this.arc.currentAngle=this.arc.startAngle,this.svg.startAngle=this.config.position.start_angle,this.svg.endAngle=this.config.position.end_angle,this.svg.diffAngle=this.config.position.end_angle-this.config.position.start_angle,this.svg.pathLength=2*this.arc.size/360*Math.PI*this.svg.radius,this.svg.circleLength=2*Math.PI*this.svg.radius,this.svg.label={},this.config.position.label.placement){case"position":this.svg.label.cx=Utils.calculateSvgCoordinate(this.config.position.label.cx,0),this.svg.label.cy=Utils.calculateSvgCoordinate(this.config.position.label.cy,0);break;case"thumb":this.svg.label.cx=this.svg.cx,this.svg.label.cy=this.svg.cy;break;case"none":break;default:throw console.error("CircularSliderTool - constructor: invalid label placement [none, position, thumb] = ",this.config.position.label.placement),Error("CircularSliderTool::constructor - invalid label placement [none, position, thumb] = ",this.config.position.label.placement)}this.svg.track={},this.svg.track.width=Utils.calculateSvgDimension(this.config.position.track.width),this.svg.active={},this.svg.active.width=Utils.calculateSvgDimension(this.config.position.active.width),this.svg.thumb={},this.svg.thumb.width=Utils.calculateSvgDimension(this.config.position.thumb.width),this.svg.thumb.height=Utils.calculateSvgDimension(this.config.position.thumb.height),this.svg.thumb.radius=Utils.calculateSvgDimension(this.config.position.thumb.radius),this.svg.thumb.cx=this.svg.cx,this.svg.thumb.cy=this.svg.cy,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2,this.svg.capture={},this.svg.capture.width=Utils.calculateSvgDimension(Math.max(this.config.position.capture.width,1.2*this.config.position.thumb.width)),this.svg.capture.height=Utils.calculateSvgDimension(Math.max(this.config.position.capture.height,1.2*this.config.position.thumb.height)),this.svg.capture.radius=Utils.calculateSvgDimension(this.config.position.capture.radius),this.svg.capture.x1=this.svg.cx-this.svg.capture.width/2,this.svg.capture.y1=this.svg.cy-this.svg.capture.height/2,this.svg.rotate={},this.svg.rotate.degrees=this.arc.clockwise?-90+this.arc.startAngle:this.arc.endAngle360-90,this.svg.rotate.cx=this.svg.cx,this.svg.rotate.cy=this.svg.cy,this.classes.track={},this.classes.active={},this.classes.thumb={},this.classes.label={},this.classes.uom={},this.styles.track={},this.styles.active={},this.styles.thumb={},this.styles.label={},this.styles.uom={},this.svg.scale={},this.svg.scale.min=this.config.scale.min,this.svg.scale.max=this.config.scale.max,this.svg.scale.center=Math.abs(this.svg.scale.max-this.svg.scale.min)/2+this.svg.scale.min,this.svg.scale.svgPointMin=this.sliderValueToPoint(this.svg.scale.min),this.svg.scale.svgPointMax=this.sliderValueToPoint(this.svg.scale.max),this.svg.scale.svgPointCenter=this.sliderValueToPoint(this.svg.scale.center),this.svg.scale.step=this.config.scale.step,this.rid=null,this.thumbPos=this.sliderValueToPoint(this.config.scale.min),this.svg.thumb.x1=this.thumbPos.x-this.svg.thumb.width/2,this.svg.thumb.y1=this.thumbPos.y-this.svg.thumb.height/2,this.svg.capture.x1=this.thumbPos.x-this.svg.capture.width/2,this.svg.capture.y1=this.thumbPos.y-this.svg.capture.height/2,this.dev.debug&&console.log("CircularSliderTool::constructor",this.config,this.svg)}pointToAngle360(t,s,i){let e=-Math.atan2(t.y-s.y,s.x-t.x)/(Math.PI/180);return(e+=-90)<0&&(e+=360),this.arc.clockwise&&e<this.arc.startAngle360&&(e+=360),this.arc.clockwise||e<this.arc.endAngle360&&(e+=360),e}isAngle360InBetween(t){let s;return!!(s=this.arc.clockwise?t>=this.arc.startAngle360&&t<=this.arc.endAngle360:t<=this.arc.startAngle360&&t>=this.arc.endAngle360)}polarToCartesian(t,s,i,e,a){a=(a-90)*Math.PI/180;return{x:t+i*Math.cos(a),y:s+e*Math.sin(a)}}pointToSliderValue(t){let s,i;var e={},t=(e.x=this.svg.cx,e.y=this.svg.cy,this.pointToAngle360(t,e,!0));let a=this["myAngle"];e=this.isAngle360InBetween(t);return e&&(this.myAngle=t,a=t,this.arc.currentAngle=a),this.arc.currentAngle=a,this.arc.clockwise&&(i=(a-this.arc.startAngle360)/this.arc.size),this.arc.clockwise||(i=(this.arc.startAngle360-a)/this.arc.size),s=(this.config.scale.max-this.config.scale.min)*i+this.config.scale.min,s=Math.round(s/this.svg.scale.step)*this.svg.scale.step,s=Math.max(Math.min(this.config.scale.max,s),this.config.scale.min),this.arc.currentAngle=a,this.dragging&&!e&&(s=round(this.svg.scale.min,s,this.svg.scale.max),this.m=this.sliderValueToPoint(s)),s}sliderValueToPoint(t){let s=Utils.calculateValueBetween(this.config.scale.min,this.config.scale.max,t);isNaN(s)&&(s=0);let i;(i=this.arc.clockwise?this.arc.size*s+this.arc.startAngle360:this.arc.size*(1-s)+this.arc.endAngle360)<0&&(i+=360);t=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,i);return this.arc.currentAngle=i,t}updateValue(t){this._value=this.pointToSliderValue(t);Math.abs(0)<.01&&this.rid&&(window.cancelAnimationFrame(this.rid),this.rid=null)}updateThumb(t){var s;this.dragging&&(this.thumbPos=this.sliderValueToPoint(this._value),this.svg.thumb.x1=this.thumbPos.x-this.svg.thumb.width/2,this.svg.thumb.y1=this.thumbPos.y-this.svg.thumb.height/2,this.svg.capture.x1=this.thumbPos.x-this.svg.capture.width/2,this.svg.capture.y1=this.thumbPos.y-this.svg.capture.height/2,s=`rotate(${this.arc.currentAngle} ${this.svg.capture.width/2} ${this.svg.capture.height/2})`,this.elements.thumb.setAttribute("transform",s),this.elements.thumbGroup.setAttribute("x",this.svg.capture.x1),this.elements.thumbGroup.setAttribute("y",this.svg.capture.y1)),this.updateLabel(t)}updateActiveTrack(t){var s=this.config.scale.min||0,i=this.config.scale.max||100;let e=this._card._calculateValueBetween(s,i,this.labelValue);s=(e=isNaN(e)?0:e)*this.svg.pathLength;this.dashArray=s+" "+this.svg.circleLength,this.dragging&&this.elements.activeTrack.setAttribute("stroke-dasharray",this.dashArray)}updateLabel(t){this.dev.debug&&console.log("SLIDER - updateLabel start",t,this.config.position.orientation);var s=this._card.config.entities[this.defaultEntityIndex()].decimals||0,i=10**s;this.labelValue2=(Math.round(this.pointToSliderValue(t)*i)/i).toFixed(s),"none"!==this.config.position.label.placement&&(this.elements.label.textContent=this.labelValue2)}mouseEventToPoint(t){let s=this.elements.svg.createSVGPoint();s.x=(t.touches?t.touches[0]:t).clientX,s.y=(t.touches?t.touches[0]:t).clientY;t=this.elements.svg.getScreenCTM().inverse();return s=s.matrixTransform(t)}callDragService(){void 0!==this.labelValue2&&(this.labelValuePrev!==this.labelValue2&&(this.labelValuePrev=this.labelValue2,this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions.tap_action,this._card.config.entities[this.defaultEntityIndex()]?.entity,this.labelValue2)),this.dragging)&&(this.timeOutId=setTimeout(()=>this.callDragService(),this.config.user_actions.drag_action.update_interval))}callTapService(){void 0!==this.labelValue2&&this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions?.tap_action,this._card.config.entities[this.defaultEntityIndex()]?.entity,this.labelValue2)}firstUpdated(t){function s(){this.rid=window.requestAnimationFrame(s),this.updateValue(this.m),this.updateThumb(this.m),this.updateActiveTrack(this.m)}this.labelValue=this._stateValue,this.dev.debug&&console.log("circslider - firstUpdated"),this.elements={},this.elements.svg=this._card.shadowRoot.getElementById("circslider-".concat(this.toolId)),this.elements.track=this.elements.svg.querySelector("#track"),this.elements.activeTrack=this.elements.svg.querySelector("#active-track"),this.elements.capture=this.elements.svg.querySelector("#capture"),this.elements.thumbGroup=this.elements.svg.querySelector("#thumb-group"),this.elements.thumb=this.elements.svg.querySelector("#thumb"),this.elements.label=this.elements.svg.querySelector("#label tspan"),this.dev.debug&&console.log("circslider - firstUpdated svg = ",this.elements.svg,"activeTrack=",this.elements.activeTrack,"thumb=",this.elements.thumb,"label=",this.elements.label,"text=",this.elements.text);const i=()=>{var t=range(this.svg.scale.max,this.labelValue)<=this.rangeMax,s=range(this.svg.scale.min,this.labelValue)<=this.rangeMin,i=!(!s||!this.diffMax),e=!(!t||!this.diffMin);i?(this.labelValue=this.svg.scale.max,this.m=this.sliderValueToPoint(this.labelValue),this.rangeMax=this.svg.scale.max/10,this.rangeMin=range(this.svg.scale.max,this.svg.scale.min+this.svg.scale.max/5)):e?(this.labelValue=this.svg.scale.min,this.m=this.sliderValueToPoint(this.labelValue),this.rangeMax=range(this.svg.scale.min,this.svg.scale.max-this.svg.scale.max/5),this.rangeMin=this.svg.scale.max/10):(this.diffMax=t,this.diffMin=s,this.rangeMin=this.svg.scale.max/5,this.rangeMax=this.svg.scale.max/5)},e=t=>{t.preventDefault(),this.dragging&&(this.m=this.mouseEventToPoint(t),this.labelValue=this.pointToSliderValue(this.m),i(),s.call(this))};var a=t=>{t.preventDefault(),this.dragging=!0,window.addEventListener("pointermove",e,!1),window.addEventListener("pointerup",h,!1),this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(0<this.config.user_actions.drag_action.update_interval?this.timeOutId=setTimeout(()=>this.callDragService(),this.config.user_actions.drag_action.update_interval):this.timeOutId=null),this.m=this.mouseEventToPoint(t),this.labelValue=this.pointToSliderValue(this.m),i(),this.dev.debug&&console.log("pointerDOWN",Math.round(100*this.m.x)/100),s.call(this)};const h=t=>{t.preventDefault(),this.dev.debug&&console.log("pointerUP"),window.removeEventListener("pointermove",e,!1),window.removeEventListener("pointerup",h,!1),window.removeEventListener("mousemove",e,!1),window.removeEventListener("touchmove",e,!1),window.removeEventListener("mouseup",h,!1),window.removeEventListener("touchend",h,!1),this.labelValuePrev=this.labelValue,this.dragging?(this.dragging=!1,clearTimeout(this.timeOutId),this.timeOutId=null,this.target=0,this.labelValue2=this.labelValue,s.call(this),this.callTapService()):i()};this.elements.thumbGroup.addEventListener("touchstart",a,!1),this.elements.thumbGroup.addEventListener("mousedown",a,!1),this.elements.svg.addEventListener("wheel",t=>{t.preventDefault(),clearTimeout(this.wheelTimeOutId),this.dragging=!0,this.wheelTimeOutId=setTimeout(()=>{clearTimeout(this.timeOutId),this.timeOutId=null,this.labelValue2=this.labelValue,this.dragging=!1,this.callTapService()},500),this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(0<this.config.user_actions.drag_action.update_interval?this.timeOutId=setTimeout(()=>this.callDragService(),this.config.user_actions.drag_action.update_interval):this.timeOutId=null);t=+this.labelValue+(t.altKey?10*this.svg.scale.step:this.svg.scale.step)*Math.sign(t.deltaY);this.labelValue=clamp(this.svg.scale.min,t,this.svg.scale.max),this.m=this.sliderValueToPoint(this.labelValue),this.pointToSliderValue(this.m),s.call(this),this.labelValue2=this.labelValue},!1)}set value(s){if(super.value=s,this.dragging||(this.labelValue=this._stateValue),!this.dragging){var s=this.config.scale.min||0,i=this.config.scale.max||100;let t=Math.min(this._card._calculateValueBetween(s,i,this._stateValue),1);s=(t=isNaN(t)?0:t)*this.svg.pathLength,i=(this.dashArray=s+" "+this.svg.circleLength,this.sliderValueToPoint(this._stateValue));this.svg.thumb.x1=i.x-this.svg.thumb.width/2,this.svg.thumb.y1=i.y-this.svg.thumb.height/2,this.svg.capture.x1=i.x-this.svg.capture.width/2,this.svg.capture.y1=i.y-this.svg.capture.height/2}}set values(s){if(super.values=s,this.dragging||(this.labelValue=this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]),!this.dragging){var s=this.config.scale.min||0,i=this.config.scale.max||100;let t=Math.min(this._card._calculateValueBetween(s,i,this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]),1);s=(t=isNaN(t)?0:t)*this.svg.pathLength,i=(this.dashArray=s+" "+this.svg.circleLength,this.sliderValueToPoint(this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]));this.svg.thumb.x1=i.x-this.svg.thumb.width/2,this.svg.thumb.y1=i.y-this.svg.thumb.height/2,this.svg.capture.x1=i.x-this.svg.capture.width/2,this.svg.capture.y1=i.y-this.svg.capture.height/2}}_renderUom(){if("none"===this.config.show.uom)return svg``;{this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.uom);let t=this.styles.label["font-size"],s=.5,i="em";var e=t.match(/\D+|\d*\.?\d+/g),e=(2===e.length?(s=.6*Number(e[0]),i=e[1]):console.error("Cannot determine font-size for state/unit",t),t={"font-size":s+i},this.styles.uom=Merge.mergeDeep(this.config.styles.uom,t),this._card._buildUom(this.derivedEntity,this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]));return"end"===this.config.show.uom?svg`
          <tspan class="${classMap(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ${e}</tspan>
        `:"bottom"===this.config.show.uom?svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="1.5em"
            style="${styleMap(this.styles.uom)}">
            ${e}</tspan>
        `:"top"===this.config.show.uom?svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="-1.5em"
            style="${styleMap(this.styles.uom)}">
            ${e}</tspan>
        `:svg`
          <tspan class="${classMap(this.classes.uom)}"  dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ERR</tspan>
        `}}_renderCircSlider(){return this.MergeAnimationClassIfChanged(),this.MergeColorFromState(),this.MergeAnimationStyleIfChanged(),this.renderValue=this._stateValue,this.dragging?this.renderValue=this.labelValue2:this.elements?.label&&(this.elements.label.textContent=this.renderValue),svg`
      <g id="circslider__group-inner" class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}">

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
        ${function(t){return"thumb"===this.config.position.label.placement&&t?svg`
      <text id="label">
        <tspan class="${classMap(this.classes.label)}" x="${this.svg.label.cx}" y="${this.svg.label.cy}" style="${styleMap(this.styles.label)}">
        ${this.renderValue}</tspan>
        ${this._renderUom()}
        </text>
        `:"position"!==this.config.position.label.placement||t?void 0:svg`
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
    `}}