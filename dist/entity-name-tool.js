import{svg}from"lit-element";import{classMap}from"lit-html/directives/class-map.js";import{styleMap}from"lit-html/directives/style-map.js";import Merge from"./merge";import BaseTool from"./base-tool";export default class EntityNameTool extends BaseTool{constructor(s,t,e){super(s,Merge.mergeDeep({classes:{tool:{"sak-name":!0,hover:!0},name:{"sak-name__name":!0}},styles:{tool:{},name:{}}},t),e),this._name={},this.classes.tool={},this.classes.name={},this.styles.name={},this.dev.debug&&console.log("EntityName constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_buildName(s,t){return this.activeAnimation?.name||t.name||s.attributes.friendly_name}_renderEntityName(){this.MergeAnimationClassIfChanged(),this.MergeColorFromState(this.styles.name),this.MergeAnimationStyleIfChanged();var s=this.textEllipsis(this._buildName(this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]),this.config?.show?.ellipsis);return svg`
        <text>
          <tspan class="${classMap(this.classes.name)}" x="${this.svg.cx}" y="${this.svg.cy}" style="${styleMap(this.styles.name)}">${s}</tspan>
        </text>
      `}render(){return svg`
      <g id="name-${this.toolId}" class="${classMap(this.classes.tool)}"
        @click=${s=>this.handleTapEvent(s,this.config)}>
        ${this._renderEntityName()}
      </g>
    `}}