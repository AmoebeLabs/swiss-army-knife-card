import { svg } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import Utils from './utils';
import BaseTool from './base-tool';
import Templates from './templates';

/** ****************************************************************************
  * UserSvgTool class, UserSvgTool::constructor
  *
  * Summary.
  *
  */

export default class UserSvgTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_USERSVG_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        height: 50,
        width: 50,
      },
      styles: {
        usersvg: {
        },
        mask: {
          fill: 'white',
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_USERSVG_CONFIG, argConfig), argPos);

    this.images = {};
    this.images = Object.assign({}, ...this.config.images);

    // #TODO:
    // Select first key in k/v store. HOw??
    this.item = {};
    this.item.image = 'default';

    // https://github.com/flobacher/SVGInjector2
    // Note: in defs, url from gradient is changed, but NOT in the SVG fill=...

    // this.injector = {};
    // // Options
    // this.injector.injectorOptions = {
    //   evalScripts: 'once',
    //   pngFallback: 'assets/png',
    // };

    // this.injector.afterAllInjectionsFinishedCallback = function (totalSVGsInjected) {
    //   // Callback after all SVGs are injected
    //   // console.log('We injected ' + totalSVGsInjected + ' SVG(s)!');
    // };

    // this.injector.perInjectionCallback = function (svg) {
    //   // Callback after each SVG is injected
    //   this.injector.svg = svg;
    //   // console.log('SVG injected: ', svg, this.injector);
    // }.bind(this);

    // create injector configured by options
    // this.injector.injector = new SVGInjector(this.injector.injectorOptions);

    this.clipPath = {};

    if (this.config.clip_path) {
      this.svg.cp_cx = Utils.calculateSvgCoordinate(this.config.clip_path.position.cx || this.config.position.cx, 0);
      this.svg.cp_cy = Utils.calculateSvgCoordinate(this.config.clip_path.position.cy || this.config.position.cy, 0);
      this.svg.cp_height = Utils.calculateSvgDimension(this.config.clip_path.position.height || this.config.position.height);
      this.svg.cp_width = Utils.calculateSvgDimension(this.config.clip_path.position.width || this.config.position.width);

      const maxRadius = Math.min(this.svg.cp_height, this.svg.cp_width) / 2;

      this.svg.radiusTopLeft = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
        this.config.clip_path.position.radius.top_left || this.config.clip_path.position.radius.left
                                || this.config.clip_path.position.radius.top || this.config.clip_path.position.radius.all,
      ))) || 0;

      this.svg.radiusTopRight = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
        this.config.clip_path.position.radius.top_right || this.config.clip_path.position.radius.right
                                || this.config.clip_path.position.radius.top || this.config.clip_path.position.radius.all,
      ))) || 0;

      this.svg.radiusBottomLeft = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
        this.config.clip_path.position.radius.bottom_left || this.config.clip_path.position.radius.left
                                || this.config.clip_path.position.radius.bottom || this.config.clip_path.position.radius.all,
      ))) || 0;

      this.svg.radiusBottomRight = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
        this.config.clip_path.position.radius.bottom_right || this.config.clip_path.position.radius.right
                                || this.config.clip_path.position.radius.bottom || this.config.clip_path.position.radius.all,
      ))) || 0;
    }

    if (this.dev.debug) console.log('UserSvgTool constructor config, svg', this.toolId, this.config, this.svg);
  }

  /** *****************************************************************************
  * UserSvgTool::value()
  *
  * Summary.
  * Receive new state data for the entity this usersvg is linked to. Called from set hass;
  *
  */
  set value(state) {
    // eslint-disable-next-line no-multi-assign
    console.log('set value before, state=', state, this._stateValue, this._stateValuePrev);
    super.value = state;
    console.log('set value, after state=', state, this._stateValue, this._stateValuePrev);

    // return changed;
  }

  // eslint-disable-next-line no-unused-vars
  updated(changedProperties) {
    // this.injector.elementsToInject = this._card.shadowRoot.querySelectorAll('svg[data-src]');
    // // console.log("updated - ", this._card.shadowRoot.getElementById("usersvg-".concat(this.toolId)), this.injector.elementsToInject);

    // this.injector.elementsToInject = this._card.shadowRoot.getElementById('usersvg-'.concat(this.toolId)).querySelectorAll('svg[data-src]:not(.injected-svg)');

    // // Trigger the injection if there is something to inject...
    // if (this.injector.elementsToInject.length > 0)
    //   this.injector.injector.inject(
    //     this.injector.elementsToInject,
    //     this.injector.afterAllInjectionsFinishedCallback,
    //     this.injector.perInjectionCallback,
    //   );
  }

  /** *****************************************************************************
  * UserSvgTool::_renderUserSvg()
  *
  * Summary.
  * Renders the usersvg using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the usersvg
  *
  */

  _renderUserSvg() {
    this.MergeAnimationStyleIfChanged();

    const images = Templates.getJsTemplateOrValue(this, this._stateValue, Merge.mergeDeep(this.images));

    // if ((this.injector.svg) && (this.injector.image2.trim() === images[this.item.image].trim())) {
    // return svg`${this.injector.svg}`;
    // if (false) {
    // } else {
    if (images[this.item.image] === 'none')
      return svg``;

    let clipPath = '';
    if (this.config.clip_path) {
      clipPath = svg`
        <defs>
          <path  id="path-${this.toolId}"
            d="
              M ${this.svg.cp_cx + this.svg.radiusTopLeft + ((this.svg.width - this.svg.cp_width) / 2)} ${this.svg.cp_cy + ((this.svg.height - this.svg.cp_height) / 2)}
              h ${this.svg.cp_width - this.svg.radiusTopLeft - this.svg.radiusTopRight}
              a ${this.svg.radiusTopRight} ${this.svg.radiusTopRight} 0 0 1 ${this.svg.radiusTopRight} ${this.svg.radiusTopRight}
              v ${this.svg.cp_height - this.svg.radiusTopRight - this.svg.radiusBottomRight}
              a ${this.svg.radiusBottomRight} ${this.svg.radiusBottomRight} 0 0 1 -${this.svg.radiusBottomRight} ${this.svg.radiusBottomRight}
              h -${this.svg.cp_width - this.svg.radiusBottomRight - this.svg.radiusBottomLeft}
              a ${this.svg.radiusBottomLeft} ${this.svg.radiusBottomLeft} 0 0 1 -${this.svg.radiusBottomLeft} -${this.svg.radiusBottomLeft}
              v -${this.svg.cp_height - this.svg.radiusBottomLeft - this.svg.radiusTopLeft}
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
        `;
    }

    // If svg, use injector for rendering. If jpg or png, use default image renderer...
    if (['png', 'jpg'].includes((images[this.item.image].substring(images[this.item.image].lastIndexOf('.') + 1)))) {
      // Render jpg or png
      return svg`
        <svg class="sak-usersvg__image" x="${this.svg.x}" y="${this.svg.y}" style="${styleMap(this.styles)}">
          "${clipPath}"
          <image clip-path="url(#clip-path-${this.toolId})" mask="url(#mask-${this.toolId})" href="${images[this.item.image]}" height="${this.svg.height}" width="${this.svg.width}"/>
        </svg>
        `;
    } else {
      return svg`
        <svg class="sak-usersvg__image" data-some="${images[this.item.image]}" x="${this.svg.x}" y="${this.svg.y}" style="${styleMap(this.styles)}">
          "${clipPath}"
          <image clip-path="url(#clip-path-${this.toolId})" mask="url(#mask-${this.toolId})" href="${images[this.item.image]}" height="${this.svg.height}" width="${this.svg.width}"/>
        </svg>
        `;

      // It seems new stuff is NOT injected for some reason. Donno why. Cant find it. Simply NOT injected, although injector is called in updated...
      // 2022.07.24 For now, disable injector stuff...
      // return svg`
      // <svg id="image-one" data-src="${images[this.item.image]}" class="sak-usersvg__image" x="${this.svg.x}" y="${this.svg.y}"
      // style="${styleMap(this.styles.usersvg)}" height="${this.svg.height}" width="${this.svg.width}">
      // </svg>
      // `;
    }
    // }
  }

  /** *****************************************************************************
  * UserSvgTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <g id="usersvg-${this.toolId}" overflow="visible" transform-origin="${this.svg.cx} ${this.svg.cy}"
        style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderUserSvg()}
      </g>
    `;
  }
} // END of class
