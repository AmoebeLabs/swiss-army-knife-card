import { svg } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

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
    // this.injector.cache = [];
    this.injector.cache = {};
    this.injector.pending = {};

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

  // updated(changedProperties) {
  //   var myThis = this;

  //   // No need to check SVG injection, if same image, and in cache
  //   if ((!this.config.options.svginject) || this.injector.cache[this.imageCur]) {
  //     return;
  //   }

  //   // temp hack...
  //   const elementsToInject = this._card.shadowRoot.getElementById(
  //     'usersvg-'.concat(this.toolId)).querySelectorAll('svg[data-src]:not(.injected-svg)');
  //   if (elementsToInject.length === 0) {
  //     return;
  //   }
  //   if (!this.injector.elementsToInject) {
  //     this.injector.elementsToInject = elementsToInject;
  //   }

  //     // this.injector.elementsToInject = this._card.shadowRoot.getElementById(
  //     // 'usersvg-'.concat(this.toolId)).querySelectorAll('svg[data-src]:not(.injected-svg)');
  //   console.log('updated SVG', this.injector);
  //   if (this.injector.elementsToInject.length !== 0) {
  //     SVGInjector(this.injector.elementsToInject, {
  //     afterAll(elementsLoaded) {
  //       // After all elements are loaded, request another render to allow the SVG to be
  //       // rendered at the right location and size from cache.
  //       //
  //       // If loading failed, the options.svginject is set to false, so image will be
  //       // rendered as external image, if possible!
  //       setTimeout(() => {
  //         myThis._card.requestUpdate();
  //       }, 0);
  //     },
  //     afterEach(err, svg) {
  //       if (err) {
  //         myThis.injector.error = err;
  //         myThis.config.options.svginject = false;
  //         throw err;
  //       } else {
  //         myThis.injector.error = '';
  //         myThis.injector.cache[myThis.imageCur] = svg;
  //       }
  //     },
  //     beforeEach(svg) {
  //       // Remove height and width attributes before injecting
  //       svg.removeAttribute('height');
  //       svg.removeAttribute('width');
  //     },
  //     cacheRequests: false,
  //     evalScripts: 'once',
  //     httpRequestWithCredentials: false,
  //     renumerateIRIElements: false,
  //     });
  //   }
  // }

updated() {
  // SVG injection is optional. If disabled, the normal external image fallback is used.
  if (!this.config.options.svginject) return;

  // Nothing to inject if there is no current image or if the image is explicitly disabled.
  if (!this.imageCur || this.imageCur === 'none') return;

  // If this SVG was already injected and cached, no new injection is needed.
  if (this.injector.cache[this.imageCur]) return;

  // Prevent multiple async SVGInjector runs for the same image.
  // Without this guard, Lit may render again while injection is still running,
  // causing multiple injectors to compete for the same placeholder node.
  if (this.injector.pending[this.imageCur]) return;

  // Find the current root element for this tool in the latest Lit-rendered DOM.
  // Never reuse a previously stored DOM reference here, because Lit may have
  // replaced that node during a later render.
  const root = this._card.shadowRoot.getElementById(`usersvg-${this.toolId}`);
  if (!root) return;

  // Find the current placeholder SVG that still needs to be injected.
  // The data-src must match the current image, otherwise an older placeholder
  // from a previous render/image state could be injected by mistake.
  const elementToInject = [...root.querySelectorAll('svg[data-src]:not(.injected-svg)')]
    .find((el) => el.dataset.src === this.imageCur);

  // No valid placeholder found in the current DOM.
  if (!elementToInject) return;

  // SVGInjector replaces the placeholder via its parent node.
  // If the placeholder was already removed by a Lit render, injection would fail
  // with "Parent node is null", so bail out early.
  if (!elementToInject.parentNode) return;

  // Store the image key at the moment injection starts.
  // this.imageCur may change before the async SVGInjector callback finishes.
  const imageKey = this.imageCur;

  // Mark this image as currently being injected.
  this.injector.pending[imageKey] = true;

  SVGInjector([elementToInject], {
    beforeEach(svg) {
      // Let the outer wrapper control the final size.
      // Keeping fixed width/height attributes from the source SVG can interfere
      // with scaling and positioning inside the card.
      svg.removeAttribute('height');
      svg.removeAttribute('width');
    },

    afterEach: (err, injectedSvg) => {
      // Injection is finished for this image, successful or not.
      delete this.injector.pending[imageKey];

      if (err) {
        // Store the error and disable SVG injection for this tool.
        // A following render will fall back to the normal external image path.
        this.injector.error = err;
        this.config.options.svginject = false;
        this._card.requestUpdate();
        return;
      }

      this.injector.error = '';

      // The placeholder was initially rendered as hidden to avoid showing a
      // half-loaded or wrongly positioned SVG. Once SVGInjector has replaced it
      // with the real inline SVG, it can safely be made visible.
      injectedSvg.classList.remove('hidden');

      // Do not cache the live DOM node that SVGInjector inserted.
      // A DOM node can only exist in one place at a time. Lit may move or remove
      // it during later renders. Cache a deep clone instead and clone it again
      // when rendering from cache.
      this.injector.cache[imageKey] = injectedSvg.cloneNode(true);
    },

    afterAll: () => {
      // Trigger a new render so _renderUserSvg() can switch from the temporary
      // hidden placeholder to the cached inline SVG.
      this._card.requestUpdate();
    },

    cacheRequests: false,
    evalScripts: 'once',
    httpRequestWithCredentials: false,
    renumerateIRIElements: false,
  });
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
    let clipPath = svg``;
    // Construct both urls. Firefox can't handle undefined clip paths and masks: it starts to
    // clip images by itself ;-). Of course, that is not what we want!
    let clipPathUrl = '';
    let maskUrl = '';

    if (this.config.clip_path) {
      clipPathUrl = `url(#clip-path-${this.toolId})`;
      maskUrl = `url(#mask-${this.toolId})`;
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

    const dotPosition = images[this.item.image].lastIndexOf('.');
    const imageExtension = images[this.item.image]
                            .substring(dotPosition === -1 ? Infinity : dotPosition + 1);

    // Use default external image renderer if not an SVG extension
    // Image can be any jpg, png or other image like via the HA /api/ (person image)
    if (imageExtension !== 'svg') {
      return svg`
        <svg class="sak-usersvg__image" x="${this.svg.x}" y="${this.svg.y}"
          style="${styleMap(this.styles.usersvg)}">
          "${clipPath}"
          <image 
            clip-path="${clipPathUrl}" mask="${maskUrl}"
            href="${images[this.item.image]}"
            height="${this.svg.height}" width="${this.svg.width}"
          />
        </svg>
        `;
    // Must be svg. Render for the first time, if not in cache...
    // Render injected SVG's as invisible (add hidden class while injecting) and
    // remove that class when rendering from cache...
    } else if ((!cachedSvg) || (!this.config.options.svginject)) {
      return svg`
        <svg class="sak-usersvg__image ${this.config.options.svginject ? 'hidden' : ''}"
          data-id="usersvg-${this.toolId}" data-src="${images[this.item.image]}"
          x="${this.svg.x}" y="${this.svg.y}"
          style="${this.config.options.svginject ? '' : styleMap(this.styles.usersvg)}">
          "${clipPath}"
          <image
            clip-path="${clipPathUrl}"
            mask="${maskUrl}"
            href="${images[this.item.image]}"
            height="${this.svg.height}" width="${this.svg.width}"
          />
        </svg>
      `;
    // Render from cache and pass clip path and mask as reference...
    // Remove hidden class that prevented weird initial renderings
    // } else {

    //   cachedSvg.classList.remove('hidden');
    //   return svg`
    //     <svg x="${this.svg.x}" y="${this.svg.y}" style="${styleMap(this.styles.usersvg)}"
    //       height="${this.svg.height}" width="${this.svg.width}"
    //       clip-path="${clipPathUrl}"
    //       mask="${maskUrl}"
    //     >
    //       ${clipPath}
    //       ${cachedSvg};
    //    </svg>
    //    `;
    // }
    } else {
      const svgNode = cachedSvg.cloneNode(true);
      svgNode.classList.remove('hidden');

      return svg`
        <svg
          x="${this.svg.x}"
          y="${this.svg.y}"
          style="${styleMap(this.styles.usersvg)}"
          height="${this.svg.height}"
          width="${this.svg.width}"
          clip-path="${clipPathUrl}"
          mask="${maskUrl}"
        >
          ${clipPath}
          ${svgNode}
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
      <g id="usersvg-${this.toolId}" overflow="visible"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderUserSvg()}
      </g>
    `;
  }
} // END of class
