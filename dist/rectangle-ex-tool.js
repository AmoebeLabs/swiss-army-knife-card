import{svg}from"lit-element";import{classMap}from"lit-html/directives/class-map.js";import{styleMap}from"lit-html/directives/style-map.js";import Merge from"./merge";import Utils from"./utils";import BaseTool from"./base-tool";export default class RectangleToolEx extends BaseTool{constructor(t,s,i){super(t,Merge.mergeDeep({position:{cx:50,cy:50,width:50,height:50,radius:{all:0}},classes:{tool:{"sak-rectex":!0,hover:!0},rectex:{"sak-rectex__rectex":!0}},styles:{rectex:{}}},s),i),this.classes.rectex={},this.styles.rectex={};t=Math.min(this.svg.height,this.svg.width)/2,s=Utils.calculateSvgDimension(this.config.position.radius.all);this.svg.radiusTopLeft=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.position.radius.top_left||this.config.position.radius.left||this.config.position.radius.top||s)))||0,this.svg.radiusTopRight=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.position.radius.top_right||this.config.position.radius.right||this.config.position.radius.top||s)))||0,this.svg.radiusBottomLeft=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.position.radius.bottom_left||this.config.position.radius.left||this.config.position.radius.bottom||s)))||0,this.svg.radiusBottomRight=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.position.radius.bottom_right||this.config.position.radius.right||this.config.position.radius.bottom||s)))||0,this.dev.debug&&console.log("RectangleToolEx constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderRectangleEx(){this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(this.styles),this.MergeAnimationStyleIfChanged(),this.config.hasOwnProperty("csnew")?this.MergeColorFromState2(this.styles.rectex,"rectex"):this.MergeColorFromState(this.styles.rectex),this.counter||(this.counter=0),this.counter+=1;var t=svg`
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
    `}}