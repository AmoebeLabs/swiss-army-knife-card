import{svg}from"lit-element";import{styleMap}from"lit-html/directives/style-map.js";import Merge from"./merge";import Utils from"./utils";import BaseTool from"./base-tool";import Templates from"./templates";export default class UserSvgTool extends BaseTool{constructor(t,i,s){super(t,Merge.mergeDeep({position:{cx:50,cy:50,height:50,width:50},styles:{usersvg:{},mask:{fill:"white"}}},i),s),this.images={},this.images=Object.assign({},...this.config.images),this.item={},this.item.image="default",this.injector={},this.injector.injectorOptions={evalScripts:"once",pngFallback:"assets/png"},this.injector.afterAllInjectionsFinishedCallback=function(t){},this.injector.perInjectionCallback=function(t){this.injector.svg=t}.bind(this),this.clipPath={},this.config.clip_path&&(this.svg.cp_cx=Utils.calculateSvgCoordinate(this.config.clip_path.position.cx||this.config.position.cx,0),this.svg.cp_cy=Utils.calculateSvgCoordinate(this.config.clip_path.position.cy||this.config.position.cy,0),this.svg.cp_height=Utils.calculateSvgDimension(this.config.clip_path.position.height||this.config.position.height),this.svg.cp_width=Utils.calculateSvgDimension(this.config.clip_path.position.width||this.config.position.width),t=Math.min(this.svg.cp_height,this.svg.cp_width)/2,this.svg.radiusTopLeft=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.clip_path.position.radius.top_left||this.config.clip_path.position.radius.left||this.config.clip_path.position.radius.top||this.config.clip_path.position.radius.all)))||0,this.svg.radiusTopRight=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.clip_path.position.radius.top_right||this.config.clip_path.position.radius.right||this.config.clip_path.position.radius.top||this.config.clip_path.position.radius.all)))||0,this.svg.radiusBottomLeft=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.clip_path.position.radius.bottom_left||this.config.clip_path.position.radius.left||this.config.clip_path.position.radius.bottom||this.config.clip_path.position.radius.all)))||0,this.svg.radiusBottomRight=+Math.min(t,Math.max(0,Utils.calculateSvgDimension(this.config.clip_path.position.radius.bottom_right||this.config.clip_path.position.radius.right||this.config.clip_path.position.radius.bottom||this.config.clip_path.position.radius.all)))||0),this.dev.debug&&console.log("UserSvgTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){return super.value=t}updated(t){this.injector.elementsToInject=this._card.shadowRoot.querySelectorAll("svg[data-src]"),this.injector.elementsToInject=this._card.shadowRoot.getElementById("usersvg-".concat(this.toolId)).querySelectorAll("svg[data-src]:not(.injected-svg)"),0<this.injector.elementsToInject.length&&this.injector.injector.inject(this.injector.elementsToInject,this.injector.afterAllInjectionsFinishedCallback,this.injector.perInjectionCallback)}_renderUserSvg(){this.MergeAnimationStyleIfChanged();var t=Templates.getJsTemplateOrValue(this,this._stateValue,Merge.mergeDeep(this.images));if("none"===t[this.item.image])return svg``;let i="";return this.config.clip_path&&(i=svg`
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
        `),["png","jpg"].includes(t[this.item.image].substring(t[this.item.image].lastIndexOf(".")+1))?svg`
        <svg class="sak-usersvg__image" x="${this.svg.x}" y="${this.svg.y}" style="${styleMap(this.styles)}">
          "${i}"
          <image clip-path="url(#clip-path-${this.toolId})" mask="url(#mask-${this.toolId})" href="${t[this.item.image]}" height="${this.svg.height}" width="${this.svg.width}"/>
        </svg>
        `:svg`
        <svg class="sak-usersvg__image" data-some="${t[this.item.image]}" x="${this.svg.x}" y="${this.svg.y}" style="${styleMap(this.styles)}">
          "${i}"
          <image clip-path="url(#clip-path-${this.toolId})" mask="url(#mask-${this.toolId})" href="${t[this.item.image]}" height="${this.svg.height}" width="${this.svg.width}"/>
        </svg>
        `}render(){return svg`
      <g id="usersvg-${this.toolId}" overflow="visible" transform-origin="${this.svg.cx} ${this.svg.cy}"
        style="${styleMap(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderUserSvg()}
      </g>
    `}}