import{svg}from"lit-element";import{classMap}from"lit-html/directives/class-map.js";import{styleMap}from"lit-html/directives/style-map.js";import Merge from"./merge";import BaseTool from"./base-tool";export default class EntityAreaTool extends BaseTool{constructor(s,t,e){super(s,Merge.mergeDeep({classes:{tool:{},area:{"sak-area__area":!0,hover:!0}},styles:{tool:{},area:{}}},t),e),this.classes.area={},this.styles.area={},this.dev.debug&&console.log("EntityAreaTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_buildArea(s,t){return t.area||"?"}_renderEntityArea(){this.MergeAnimationClassIfChanged(),this.MergeColorFromState(this.styles.area),this.MergeAnimationStyleIfChanged();var s=this.textEllipsis(this._buildArea(this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]),this.config?.show?.ellipsis);return svg`
        <text>
          <tspan class="${classMap(this.classes.area)}"
          x="${this.svg.cx}" y="${this.svg.cy}" style="${styleMap(this.styles.area)}">${s}</tspan>
        </text>
      `}render(){return svg`
      <g id="area-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${s=>this.handleTapEvent(s,this.config)}>
        ${this._renderEntityArea()}
      </g>
    `}}