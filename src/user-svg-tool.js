import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { SVGInjector } from '@tanem/svg-injector';

import Merge from './merge';
import Utils from './utils';
import BaseTool from './base-tool';
import Templates from './templates';

/** ****************************************************************************
  * UserSvgTool class, UserSvgTool::constructor
  *
  * Summary.
  * The UserSvg tool can load and display .png, .jpg and .svg images
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
      options: {
        svginject: true,
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

    this.item = {};
    this.item.image = 'default';
    // Remember the SVG image to load, as we cache those SVG files
    this.imageCur = 'none';
    this.imagePrev = 'none';

    this.classes = {};
    this.classes.tool = {};
    this.classes.usersvg = {};
    this.classes.mask = {};

    this.styles = {};
    this.styles.tool = {};
    this.styles.usersvg = {};
    this.styles.mask = {};

    this.injector = {};
    this.injector.svg = null;
    this.injector.cache = [];

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
    super.value = state;
  }

  /**
   * Summary.
   * Use firstUpdated(). updated() gives a loop of updates of the SVG if more than one SVG
   * is defined in the card: things start to blink, as each SVG is removed/rendered in a loop
   * so it seems. Either a bug in the Injector, or the UserSvg tool...
   *
   * @param {()} changedProperties
   * @returns
   */
  // eslint-disable-next-line no-unused-vars
  updated(changedProperties) {
    var myThis = this;

    // No need to check SVG injection, if same image, and in cache
    if ((!this.config.options.svginject) || this.injector.cache[this.imageCur]) {
      return;
    }

    this.injector.elementsToInject = this._card.shadowRoot.getElementById(
      'usersvg-'.concat(this.toolId)).querySelectorAll('svg[data-src]:not(.injected-svg)');
    if (this.injector.elementsToInject.length !== 0) {
      SVGInjector(this.injector.elementsToInject, {
      afterAll(elementsLoaded) {
        // Request async update of card if all SVG files are loaded using async http request
        setTimeout(() => { myThis._card.requestUpdate(); }, 0);
      },
      afterEach(err, svg) {
        if (err) {
          throw err;
        }
        myThis.injector.cache[myThis.imageCur] = svg;
      },
      beforeEach(svg) {
        // Remove height and width attributes before injecting
        svg.removeAttribute('height');
        svg.removeAttribute('width');
      },
      cacheRequests: false,
      evalScripts: 'once',
      httpRequestWithCredentials: false,
      renumerateIRIElements: false,
      });
    }
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
    this.imagePrev = this.imageCur;
    this.imageCur = images[this.item.image];

    // Render nothing if no image found
    if (images[this.item.image] === 'none')
      return svg``;

    let cachedSvg = this.injector.cache[this.imageCur];

    // construct clip path if specified
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

    // If jpg or png, use default image renderer...
    if (['png', 'jpg'].includes((images[this.item.image].substring(images[this.item.image].lastIndexOf('.') + 1)))) {
      // Render jpg or png
      return svg`
        <svg class="sak-usersvg__image" x="${this.svg.x}" y="${this.svg.y}"
          style="${styleMap(this.styles.usersvg)}">
          "${clipPath}"
          <image clip-path="url(#clip-path-${this.toolId})" mask="url(#mask-${this.toolId})"
            href="${images[this.item.image]}"
            height="${this.svg.height}" width="${this.svg.width}"
          />
        </svg>
        `;
    // Must be svg. Render for the first time, if not in cache...
    } else if ((!cachedSvg) || (!this.config.options.svginject)) {
      return svg`
        <svg class="sak-usersvg__image"
          data-id="usersvg-${this.toolId}" data-src="${images[this.item.image]}"
          x="${this.svg.x}" y="${this.svg.y}"
          style="${styleMap(this.styles.usersvg)}">
          "${clipPath}"
          <image clip-path="url(#clip-path-${this.toolId})" mask="url(#mask-${this.toolId})"
            href="${images[this.item.image]}"
            height="${this.svg.height}" width="${this.svg.width}"
          />
        </svg>
      `;
    // Render from cache and pass clip path and mask as reference...
    } else {
      return svg`
        <svg x="${this.svg.x}" y="${this.svg.y}" style="${styleMap(this.styles.usersvg)}"
          height="${this.svg.height}" width="${this.svg.width}"
          clip-path="url(#clip-path-${this.toolId})" mask="url(#mask-${this.toolId})">
          "${clipPath}"
          ${cachedSvg};
       </svg>
       `;
    }
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
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderUserSvg()}
      </g>
    `;
  }
} // END of class
