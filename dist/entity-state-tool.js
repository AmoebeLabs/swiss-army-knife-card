import{svg}from"lit-element";import{classMap}from"lit-html/directives/class-map.js";import{styleMap}from"lit-html/directives/style-map.js";import Merge from"./merge";import BaseTool from"./base-tool";export default class EntityStateTool extends BaseTool{constructor(t,s,e){super(t,Merge.mergeDeep({show:{uom:"end"},classes:{tool:{"sak-state":!0,hover:!0},state:{"sak-state__value":!0},uom:{"sak-state__uom":!0}},styles:{state:{},uom:{}}},s),e),this.classes.state={},this.classes.uom={},this.styles.state={},this.styles.uom={},this.dev.debug&&console.log("EntityStateTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}set value(t){super.value=t}_renderState(){this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.state);let t=this._stateValue;var s,e,i,o;return t&&isNaN(t)&&(s=this._card.entities[this.defaultEntityIndex()],o=this._card._computeDomain(this._card.config.entities[this.defaultEntityIndex()].entity),e=this.config.locale_tag?this.config.locale_tag+t.toLowerCase():void 0,i=s.attributes?.device_class?`component.${o}.state.${s.attributes.device_class}.`+t:"--",o=`component.${o}.state._.`+t,t=e&&this._card.toLocale(e,t)||s.attributes?.device_class&&this._card.toLocale(i,t)||this._card.toLocale(o,t)||s.state,t=this.textEllipsis(t,this.config?.show?.ellipsis)),svg`
      <tspan class="${classMap(this.classes.state)}" x="${this.svg.x}" y="${this.svg.y}"
        style="${styleMap(this.styles.state)}">
        ${this.config?.text?.before?this.config.text.before:""}${t}${this.config?.text?.after?this.config.text.after:""}</tspan>
    `}_renderUom(){if("none"===this.config.show.uom)return svg``;{this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.uom);let t=this.styles.state["font-size"],s=.5,e="em";var i=t.match(/\D+|\d*\.?\d+/g),i=(2===i.length?(s=.6*Number(i[0]),e=i[1]):console.error("Cannot determine font-size for state/unit",t),t={"font-size":s+e},this.styles.uom=Merge.mergeDeep(this.config.styles.uom,t),this._card._buildUom(this.derivedEntity,this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]));return"end"===this.config.show.uom?svg`
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
        `:svg``}}firstUpdated(t){}updated(t){}render(){return svg`
    <svg overflow="visible" id="state-${this.toolId}" class="${classMap(this.classes.tool)}">
        <text @click=${t=>this.handleTapEvent(t,this.config)}>
          ${this._renderState()}
          ${this._renderUom()}
        </text>
      </svg>
      `}}