/*******************************************************************************
  * RangeSliderTool class
  *
  * Summary.
  *
  */

class RangeSliderTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {

    const DEFAULT_SLIDER_CONFIG = {
        position: {
          orientation: 'horizontal',
          length: 80,
        },
        styles: {
          slider: {
            "stroke-linecap": 'round',
            "stroke": 'var(--primary-text-color)',
            "opacity": '1.0',
            "stroke-width": '2',
          },
        }
    }

    super(argToolset, Merge.mergeDeep(DEFAULT_SLIDER_CONFIG, argConfig), argPos);

    this.svg.length = Utils.calculateSvgDimension(argConfig.position.length)

    this.svg.handle = {};
    this.svg.handle.width = Utils.calculateSvgDimension(argConfig.handle.width);
    this.svg.handle.height = Utils.calculateSvgDimension(argConfig.handle.height);
    this.svg.handle.popout = Utils.calculateSvgDimension(argConfig.handle.popout);

    // Define the bounding box for the pointer / touch events to get detected.

    if (this.config.position.orientation == 'vertical') {
      this.svg.x1 = this.svg.cx;
      this.svg.y1 = this.svg.cy - this.svg.length/2;
      this.svg.x2 = this.svg.cx;
      this.svg.y2 = this.svg.cy + this.svg.length/2;
      this.svg.width = this.svg.handle.width;
      this.svg.height = this.svg.length;
    } else {
      this.svg.x1 = this.svg.cx - this.svg.length/2;
      this.svg.y1 = this.svg.cy;
      this.svg.x2 = this.svg.cx + this.svg.length/2;
      this.svg.y2 = this.svg.cy;
      this.svg.width = this.svg.length;
      this.svg.height = this.svg.handle.height;
    }

    this.svg.scale = {};
    this.svg.scale.min = this.valueToSvg(this, this.config.scale.min);
    this.svg.scale.max = this.valueToSvg(this, this.config.scale.max);

  // Specific rangeslider stuff...
    this.elements = {};
    //this.config.handle.popout = 40;
    this.deformation = this.svg.handle.popout/4;
    this.target = this.svg.handle.popout;
    this._value = null;
    this.dragging = false;

    this.SVG_NS = "http://www.w3.org/2000/svg";
    this.SVG_XLINK = "http://www.w3.org/1999/xlink";
    this.rid = null;
    //this.m = { x: 100, y: this.svg.y + this.svg.handle.popoutt / 2 };
    this.m = { x: svg.x1, y: this.svg.y1};

    // hardcoded for testing.
    // value in box is in steps of 5. So 0..100 is 0,5, 10, etc..
    this.stepValue = 2;
    this.velocity = 10;
  //--

    if (this.dev.debug) console.log('RangeSliderTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  // svg coordinates to actual slider value
  svgCoordinateToSliderValue(argThis, m) {
    // svg is within viewbox / slider size
    // length is argThis.svg.length


    // is m.x in svg x1/x2 range. Then translate to actual value.
    // need scale.min / max...

    if (argThis.config.position.orientation == 'horizontal') {
      var xpos = m.x - argThis.svg.x1;
      var xposp = xpos / argThis.svg.length;
      let state = ((argThis.config.scale.max - argThis.config.scale.min) * xposp) + argThis.config.scale.min;
      //var state = Utils.calculateValueBetween(argThis.config.scale.min, argThis.config.scale.max, xposp);
      if (this.dev.debug) console.log ('SLIDER - svgCoordinateToSliderValue results)', xpos, xposp, state);
      return state;
    } else if (argThis.config.position.orientation == 'vertical') {
      // y is calculated from lower y value. So slider is from bottom to top...
      var ypos = argThis.svg.y2 - m.y;
      var yposp = ypos / argThis.svg.length;
      let state = ((argThis.config.scale.max - argThis.config.scale.min) * yposp) + argThis.config.scale.min;
      //var state = Utils.calculateValueBetween(argThis.configscale.min, argThis.configscale.max, yposp);
      if (this.dev.debug) console.log ('SLIDER - svgCoordinateToSliderValue results)', xpos, xposp, state);
      return state;
    }
  }

  valueToSvg(argThis, argValue) {

    if (this.config.position.orientation == 'horizontal') {
      let state = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, argValue);

      var xposp = state * this.svg.length;
      var xpos = this.svg.x1 + xposp;
      return xpos;
    } else if (this.config.position.orientation == 'vertical') {
      let state = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, argValue);

      var yposp = state * this.svg.length;
      var ypos = this.svg.y2 + yposp;
      return ypos;
    }
  }

  updateValue() {
    let dist = this.target - this._value;
    let vel = dist / this.velocity;
    this._value += vel;
    //improvement
    if (Math.abs(dist) < 0.01) {
      if (this.rid) {
        window.cancelAnimationFrame(this.rid);
        this.rid = null;
      }
    }
  }

  updatePath(argThis, m) {
    // HORIZONTAL
    if (argThis.config.position.orientation == 'horizontal') {
      //argThis.d = argThis.curvedPath(m.x, argThis.svg.y + argThis.svg.handle.popout / 1000, argThis.deformation, argThis._value);
      argThis.d = argThis.curvedPath(m.x, argThis.svg.y + argThis.svg.handle.height / 2, argThis.deformation, argThis._value);
      argThis.elements.path.setAttributeNS(null, "d", argThis.d);

      argThis.elements.thumb.setAttributeNS(null, "r", 1 + argThis._value / 3);
      argThis.elements.thumb.setAttributeNS(null, "cx", m.x);
    } //VERTICAL
    else if (argThis.config.position.orientation == 'vertical') {
//      argThis.d = argThis.curvedPath(m.x + argThis.svg.handle.width / 2, argThis.svg.y, argThis.deformation, argThis._value);
      argThis.d = argThis.curvedPath(argThis.svg.x + argThis.svg.handle.width / 2, m.y, argThis.deformation, argThis._value);
      argThis.elements.path.setAttributeNS(null, "d", argThis.d);
      argThis.elements.thumb.setAttributeNS(null, "r", 1 + argThis._value / 3);
      argThis.elements.thumb.setAttributeNS(null, "cy", m.y);
    }

    argThis.updateLabel(argThis, m);
    argThis.updateInput(m);
  }

  updateLabel(argThis, m) {
    if (this.dev.debug) console.log('SLIDER - updateLabel start', m, argThis.config.position.orientation);
    if (argThis.config.position.orientation == 'horizontal') {

      // The -30 is for correction width of box around label??????

      argThis.elements.label.setAttributeNS(
        null,
        "transform",
        `translate(${m.x - this.svg.handle.width/2},${argThis.svg.y /*- argThis.svg.handle.popout/100*/ - argThis._value}) scale(1)`
      );
      argThis.elements.text.textContent = Math.round(argThis.svgCoordinateToSliderValue(argThis, m));
      if (this.dev.debug) console.log('SLIDER - updateLabel horizontal', m, argThis.svgCoordinateToSliderValue(argThis, m));

    } else if (argThis.config.position.orientation == 'vertical') {
      argThis.elements.label.setAttributeNS(
        null,
        "transform",
        `translate(${argThis.svg.x /*- argThis.svg.handle.popout*/ - argThis._value}, ${m.y - this.svg.handle.height/2}) scale(1)`
      );

      argThis.elements.text.textContent = Math.round(argThis.svgCoordinateToSliderValue(argThis, m));
      if (this.dev.debug) console.log('SLIDER - updateLabel vertical', m, argThis.svgCoordinateToSliderValue(argThis, m));
    }
  }

  // What does this function do?? Need??
  // Is this the actual html input value that is set?? Guess so..
  updateInput(m) {
    //this.inputElement.value = Math.round(m.x);
  }

  /*
  * oMousePosSVG
  *
  * Translate mouse/touch client window coordinates to SVG window coordinates
  *
  */
  oMousePosSVG(e) {
    var p = this.elements.svg.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    var ctm = this.elements.svg.getScreenCTM().inverse();
    var p = p.matrixTransform(ctm);
    return p;
  }

  // HELPERS

   /*
   * Draw curved path with popout at centered & mouse position
   *
   * Horizontal:
   * - x = mouse position
   * - y = fixed y position of slider
   * - deform = deformation of Q control points
   * - popout = current value (using animation) of popout in -y direction
   *
   * Vertical:
   * - x = fixed x position of slider
   * - y = mouse position
   * - deform = deformation of Q control points
   * - popout = current value (using animation) of popout in -x direction
   *
   */
   curvedPath(argX, argY, argDeform, argPopout) {

    if (this.dev.debug) console.log("SLIDER - curvedPath, args", argX, argY, argDeform, argPopout);
    // const offset = this.svg.y1;

    // HORIZONTAL
    if (this.config.position.orientation == 'horizontal') {
      // Coordinates are clipped between the start and end of the slider, svg.x1 and svg.x2
      var D = { cx: Math.max(this.svg.x1, Math.min(argX,                  this.svg.x2)), cy: argY - argPopout, r: 1 };
      var B = { cx: Math.max(this.svg.x1, Math.min(D.cx - argDeform,      this.svg.x2)), cy: argY,        r: 1 };
      var F = { cx: Math.max(this.svg.x1, Math.min(D.cx + argDeform,      this.svg.x2)), cy: argY,        r: 1 };
      var A = { cx: Math.max(this.svg.x1, Math.min(D.cx - 2 * argDeform,  this.svg.x2)), cy: argY,        r: 1 };
      var G = { cx: Math.max(this.svg.x1, Math.min(D.cx + 2 * argDeform,  this.svg.x2)), cy: argY,        r: 1 };

      var S = this.svg.x1;
      var U = argY;

      var T = this.svg.x2;
      var V = A.cy;
      V = argY;

    } // VERTICAL
    else if (this.config.position.orientation == 'vertical') {
      // Coordinates are clipped between the bottom and top of the slider, svg.y1 and svg.y2

      var D = { cy: Math.max(this.svg.y1, Math.min(argY,                  this.svg.y2)), cx: argX - argPopout, r: 1 };
      var B = { cy: Math.max(this.svg.y1, Math.min(D.cy - 1 * argDeform,  this.svg.y2)), cx: argX,        r: 1 };
      var F = { cy: Math.max(this.svg.y1, Math.min(D.cy + 1 * argDeform,  this.svg.y2)), cx: argX,          r: 1 };
      var A = { cy: Math.max(this.svg.y1, Math.min(D.cy - 2 * argDeform,  this.svg.y2)), cx: argX,        r: 1 };
      var G = { cy: Math.max(this.svg.y1, Math.min(D.cy + 2 * argDeform,  this.svg.y2)), cx: argX,        r: 1 };

      var S = this.svg.y1;
      var T = this.svg.y2;
      var U = argX;

      S = A.cx;
      U = this.svg.y1;

      T = argX;
      V = this.svg.y2;
      //T = 50;
      //V = 50;
    }
    let C = this.interpolatePoint(B, D, 1, 2);
    C.r = 1;
    let E = this.interpolatePoint(D, F, 1, 2);
    E.r = 1;

    // Draw the horizontal start slider, then the 3 Q curves, and the rest of the horizontal slider.
    return `M${S},${U} L${A.cx},${A.cy}
                Q${B.cx},${B.cy} ${C.cx},${C.cy}
                Q${D.cx},${D.cy} ${E.cx},${E.cy}
                Q${F.cx},${F.cy} ${G.cx},${G.cy}
                L${T},${V} L${S+1}, ${U+1}
  `;
  }

   interpolatePoint(a, b, i, n) {
    //point a
    //point b
    //line divided in n segments
    //find the i-th point

    if (this.config.position.orientation == 'horizontal') {
      var o = {
        cx: a.cx + (b.cx - a.cx) * (i / n),
        cy: a.cy + (b.cy - a.cy) * (i / n)
      }
    }
    else if (this.config.position.orientation == 'vertical') {
      var o = {
        cx: a.cx + (b.cx - a.cx) * (i / n),
        cy: a.cy + (b.cy - a.cy) * (i / n)
      }
    }
    return o;
  }

  firstUpdated(changedProperties)
  {
    const thisValue = this;

    function Frame() {
      thisValue.rid = window.requestAnimationFrame(Frame);
      thisValue.updateValue();
      thisValue.updatePath(thisValue, thisValue.m);
      //if (this.dev.debug) console.log('pointer in Frame', thisValue.m);
    }

    if (this.dev.debug) console.log('slider - firstUpdated');
    // #TODO
    // svg moet een svg object zijn, want er worden functies op uitgevoerd.
    // dus deze slider moet een eigen svg element krijgen...
    this.elements.svg = this._card.shadowRoot.getElementById("rangeslider-".concat(this.toolId));

//    this.svg = document.querySelector("svg");
    this.elements.path = this.elements.svg.querySelector("path");
    this.elements.thumb = this.elements.svg.querySelector("circle");
//    this.thumb = _2.querySelector("circle");

    if (true) {
      this.elements.label = this.elements.svg.querySelector("#_2 path#label-".concat(this.toolId));
      this.elements.text = this.elements.svg.querySelector("#_2 text textPath");
    } else {
      this.elements.label = this.elements.svg.querySelector("#_2 rect");
      this.elements.text = this.elements.svg.querySelector("#_2 text");
    }

    if (this.dev.debug) console.log('slider - firstUpdated svg = ', this.elements.svg, 'path=', this.elements.path, 'thumb=', this.elements.thumb, 'label=', this.elements.label, 'text=', this.elements.text);

//    this.inputElement = witness; ////


    this.elements.svg.addEventListener("pointerdown", e => {
      this.dragging = true;

      this.m = this.oMousePosSVG(e);
      //this.m.x = Math.round(this.m.x / this.stepValue) * this.stepValue;
      //if (this.dev.debug) console.clear();
      if (this.dev.debug) console.log('pointerDOWN',Math.round(this.m.x * 100) / 100);
      this.target = this.svg.handle.popout;
      Frame();
    });

    this.elements.svg.addEventListener("pointerup", () => {
      this.dragging = false;
      this.target = 0;
      if (this.dev.debug) console.log('pointerUP');
      Frame();
      //this.updatePath(m,deformation);
    });

    this.elements.svg.addEventListener("pointerout", () => {

      this.dragging = false;
      this.target = 0;
      if (this.dev.debug) console.log('pointerOUT');
      Frame();
    });

    this.elements.svg.addEventListener("pointermove", e => {
      if (this.dragging) {
        this.m = this.oMousePosSVG(e);

        // Clip pointer to scale.
        //this.m.x = Math.max(this.svg.scale.min, Math.min(this.m.x, this.svg.scale.max));
        //this.m.x = Math.round(this.m.x / this.stepValue) * this.stepValue;
        //this.m.x = Math.max(10, Math.min(this.m.x, 90.0));
        //this.m.x = Math.round(this.m.x / this.stepValue) * this.stepValue;

        //console.clear();
        if (this.dev.debug) console.log('pointerMOVE', this.m.x, Math.round(this.m.x * 100) / 100);
        this.target = this.svg.handle.popout;
        Frame();
      }
    });

  }

/*******************************************************************************
  * RangeSliderTool::value()
  *
  * Summary.
  * Receive new state data for the entity this rangeslider is linked to. Called from set hass;
  * Sets the brightness value of the slider. This is a value 0..255. We display %, so translate
  *
  */
  set value(state) {
    var changed = super.value = state;

    // console.log('rangeslidertool, animation, set value', state);

    // What to do here??
    // We must know the domain or attribute to know what to do.
    // Light domain --> do something with brightness etc.

    // Or: in YAML: set translation range, 0..255 for brightness -> 0..100%.

    // for now: use external range for internal scale. No conversion for now. just testing

    return changed;
  }

 /*******************************************************************************
  * RangeSliderTool::_renderRangeSlider()
  *
  * Summary.
  * Renders the range slider
  *
  */

  _renderRangeSlider() {

    if (this.dev.debug) console.log('slider - _renderRangeSlider');

    let configStyle = Merge.mergeDeep(this.config.styles);

    configStyle.handle['text-anchor'] = 'middle';
    configStyle.handle['alignment-baseline'] = 'middle';
    
    const toRender = []
    //toRender.push(html`<input type="range" id="witness" value="50" disabled style="display:none">`);

    // Calculate startOffset for text along path. Get it about centered along topside of rectangle...
    const startOffset = 100/2 * (this.svg.handle.width / ((this.svg.handle.width * 2) + (this.svg.handle.height * 2)));

//          <path d="M${this.svg.x1},${this.svg.y1} L${this.svg.x2},${this.svg.y1}" stroke="var(--theme-gradient-color-01)" stroke-width="5" fill="var(--theme-gradient-color-03)" pointer-events="none"

    toRender.push(svg`
        <g id="poep-${this.toolId}" >
          <rect x="${this.svg.x1}" y="${this.svg.y1}" width="${this.svg.width}" height="${this.svg.height}" style="fill: none" pointer-events="all"/>

          <path d="M1,1 L20,20" stroke="var(--theme-gradient-color-01)" stroke-width="5" fill="var(--theme-gradient-color-03)" pointer-events="none" stroke-linecap="round"/>
          <g id="_2" pointer-events="none">
            <path id="label-${this.toolId}" transform="translate(100,220) scale(5)"
              d="M 0 0 h ${this.svg.handle.width} v ${this.svg.handle.height} h -${this.svg.handle.width} v -${this.svg.handle.height}"
              style="${styleMap(configStyle.slider)}"/>

            <circle cx="${this.svg.x}" cy="${this.svg.y}" r="1" fill="none" pointer-events="none"/>

            <text text-anchor="middle" transform="translate(0,${this.svg.handle.height/4})" pointer-events="none" >
            <textPath startOffset="${startOffset}%" style="${styleMap(configStyle.handle)}" href="#label-${this.toolId}" pointer-events="none">
            50
            </textPath>
          </g>
        </g>
      `);
    return toRender;
  }

 /*******************************************************************************
  * RangeSliderTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <svg  xmlns="http://www.w3.org/2000/svg" id="rangeslider-${this.toolId}" class="rangeslider" pointer-events="all"
      >
        ${this._renderRangeSlider()}
      </svg>
    `;

    // return svg`
      // <svg viewbox="-10,-100,400,400" id="rangeslider-${this.toolId}" class="rangeslider" pointer-events="all"
      // >
        // ${this._renderRangeSlider()}
      // </svg>
    // `;

    // return svg`
      // <g id="rangeslider-${this.toolId}" class="rangeslider"
        // @click=${e => this._card.handleEvent(e, this._card.config.entities[this.config.entity_index])}>
        // ${this._renderRangeSlider()}
      // </g>
    // `;

  }
} // END of class
