import{svg}from"lit-element";import{classMap}from"lit-html/directives/class-map.js";import{styleMap}from"lit-html/directives/style-map.js";import Merge from"./merge";import Utils from"./utils";import BaseTool from"./base-tool";export default class RegPolyTool extends BaseTool{constructor(s,t,o){super(s,Merge.mergeDeep({position:{cx:50,cy:50,radius:50,side_count:6,side_skip:1,angle_offset:0},classes:{tool:{"sak-polygon":!0,hover:!0},regpoly:{"sak-polygon__regpoly":!0}},styles:{tool:{},regpoly:{}}},t),o),this.svg.radius=Utils.calculateSvgDimension(t.position.radius),this.classes.regpoly={},this.styles.regpoly={},this.dev.debug&&console.log("RegPolyTool constructor config, svg",this.toolId,this.config,this.svg)}set value(s){super.value=s}_renderRegPoly(){return this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.regpoly),svg`
      <path class="${classMap(this.classes.regpoly)}"
        d="${function(t,o,e,s,i,l){var r,a,g=2*Math.PI/t;let n=s+g,c="";for(let s=0;s<t;s++)n+=o*g,r=i+~~(e*Math.cos(n)),a=l+~~(e*Math.sin(n)),c+=(0===s?"M":"L")+r+` ${a} `,s*o%t==0&&0<s&&(n+=g,r=i+~~(e*Math.cos(n)),a=l+~~(e*Math.sin(n)),c+=`M${r} ${a} `);return c+="z"}(this.config.position.side_count,this.config.position.side_skip,this.svg.radius,this.config.position.angle_offset,this.svg.cx,this.svg.cy)}"
        style="${styleMap(this.styles.regpoly)}"
      />
      `}render(){return svg`
      <g "" id="regpoly-${this.toolId}" class="${classMap(this.classes.tool)}" transform-origin="${this.svg.cx} ${this.svg.cy}"
        @click=${s=>this.handleTapEvent(s,this.config)}>
        ${this._renderRegPoly()}
      </g>
    `}}