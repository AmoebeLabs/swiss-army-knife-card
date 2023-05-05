import{svg}from"lit-element";import{classMap}from"lit-html/directives/class-map.js";import{styleMap}from"lit-html/directives/style-map.js";import Merge from"./merge";import BaseTool from"./basetool";export default class HorseshoeTool extends BaseTool{constructor(s,o,t){super(s,Merge.mergeDeep({position:{cx:50,cy:50,radius:45},card_filter:"card--filter-none",horseshoe_scale:{min:0,max:100,width:3,color:"var(--primary-background-color)"},horseshoe_state:{width:6,color:"var(--primary-color)"},show:{horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"}},o),t),this.HORSESHOE_RADIUS_SIZE=.45*SVG_VIEW_BOX,this.TICKMARKS_RADIUS_SIZE=.43*SVG_VIEW_BOX,this.HORSESHOE_PATH_LENGTH=520/360*Math.PI*this.HORSESHOE_RADIUS_SIZE,this.config.entity_index=this.config.entity_index||0,this.svg.radius=Utils.calculateSvgDimension(this.config.position.radius),this.svg.radius_ticks=Utils.calculateSvgDimension(.95*this.config.position.radius),this.svg.horseshoe_scale={},this.svg.horseshoe_scale.width=Utils.calculateSvgDimension(this.config.horseshoe_scale.width),this.svg.horseshoe_state={},this.svg.horseshoe_state.width=Utils.calculateSvgDimension(this.config.horseshoe_state.width),this.svg.horseshoe_scale.dasharray=52/36*Math.PI*this.svg.radius,this.svg.rotate={},this.svg.rotate.degrees=-220,this.svg.rotate.cx=this.svg.cx,this.svg.rotate.cy=this.svg.cy,this.colorStops={},this.config.color_stops&&Object.keys(this.config.color_stops).forEach(s=>{this.colorStops[s]=this.config.color_stops[s]}),this.sortedStops=Object.keys(this.colorStops).map(s=>Number(s)).sort((s,o)=>s-o),this.colorStopsMinMax={},this.colorStopsMinMax[this.config.horseshoe_scale.min]=this.colorStops[this.sortedStops[0]],this.colorStopsMinMax[this.config.horseshoe_scale.max]=this.colorStops[this.sortedStops[this.sortedStops.length-1]],this.color0=this.colorStops[this.sortedStops[0]],this.color1=this.colorStops[this.sortedStops[this.sortedStops.length-1]],this.angleCoords={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},this.color1_offset="0%",this.dev.debug&&console.log("HorseshoeTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}set value(s){if(this._stateValue===s)return!1;this._stateValuePrev=this._stateValue||s,this._stateValue=s,this._stateValueIsDirty=!0;var o=this.config.horseshoe_scale.min||0,t=this.config.horseshoe_scale.max||100,o=Math.min(this._card._calculateValueBetween(o,t,s),1),t=o*this.HORSESHOE_PATH_LENGTH,e=10*this.HORSESHOE_RADIUS_SIZE,t=(this.dashArray=t+" "+e,this.config.show.horseshoe_style);return"fixed"===t?(this.stroke_color=this.config.horseshoe_state.color,this.color0=this.config.horseshoe_state.color,this.color1=this.config.horseshoe_state.color,this.color1_offset="0%"):"autominmax"===t?(e=this._card._calculateColor(s,this.colorStopsMinMax,!0),this.color0=e,this.color1=e,this.color1_offset="0%"):"colorstop"===t||"colorstopgradient"===t?(e=this._card._calculateColor(s,this.colorStops,"colorstopgradient"===t),this.color0=e,this.color1=e,this.color1_offset="0%"):"lineargradient"===t&&(e={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},this.color1_offset=Math.round(100*(1-o))+"%",this.angleCoords=e),this.dev.debug&&console.log("HorseshoeTool set value",this.cardId,s),!0}_renderTickMarks(){var t=this["config"];if(t.show.scale_tickmarks){var e=t.horseshoe_scale.color||"var(--primary-background-color)",i=t.horseshoe_scale.ticksize||(t.horseshoe_scale.max-t.horseshoe_scale.min)/10,r=t.horseshoe_scale.min%i,r=t.horseshoe_scale.min+(0==r?0:i-r),h=(r-t.horseshoe_scale.min)/(t.horseshoe_scale.max-t.horseshoe_scale.min)*260,a=(t.horseshoe_scale.max-r)/i;let s=Math.floor(a);var c,l=(260-h)/a,n=(Math.floor(s*i+r)<=t.horseshoe_scale.max&&(s+=1),this.svg.horseshoe_scale.width?this.svg.horseshoe_scale.width/2:3),_=[];let o;for(o=0;o<s;o++)c=h+(360-o*l-230)*Math.PI/180,_[o]=svg`
        <circle cx="${this.svg.cx-Math.sin(c)*this.svg.radius_ticks}"
                cy="${this.svg.cy-Math.cos(c)*this.svg.radius_ticks}" r="${n}"
                fill="${e}">
      `;return svg`${_}`}}_renderHorseShoe(){if(this.config.show.horseshoe)return svg`
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
        @click=${s=>this.handleTapEvent(s,this.config)}>
        ${this._renderHorseShoe()}
      </g>

      <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
        <linearGradient gradientTransform="rotate(0)" id="horseshoe__gradient-${this.cardId}" x1="${this.angleCoords.x1}", y1="${this.angleCoords.y1}", x2="${this.angleCoords.x2}" y2="${this.angleCoords.y2}">
          <stop offset="${this.color1_offset}" stop-color="${this.color1}" />
          <stop offset="100%" stop-color="${this.color0}" />
        </linearGradient>
      </svg>

    `}}