import { svg } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import Merge from './merge';
import Utils from './utils';
import BaseTool from './base-tool';

const toFiniteNumber = (value, fallbackValue) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallbackValue;
};

const toSideCount = (value) => {
  const sideCount = Math.trunc(toFiniteNumber(value, 6));

  return Math.max(3, sideCount);
};

const normalizeSideSkip = (value, sideCount) => {
  let sideSkip = Math.trunc(toFiniteNumber(value, 1));

  if (sideSkip === 0) {
    return 1;
  }

  sideSkip %= sideCount;

  if (sideSkip < 0) {
    sideSkip += sideCount;
  }

  if (sideSkip === 0) {
    return 1;
  }

  return sideSkip;
};

const formatPathNumber = (value) => {
  const rounded = Math.round(value * 1000) / 1000;

  return Object.is(rounded, -0) ? 0 : rounded;
};

const generateRegPolyPath = (
  sideCountValue,
  sideSkipValue,
  radiusValue,
  angleOffsetValue,
  cxValue,
  cyValue,
) => {
  const sideCount = toSideCount(sideCountValue);
  const sideSkip = normalizeSideSkip(sideSkipValue, sideCount);
  const radius = toFiniteNumber(radiusValue, NaN);
  const angleOffset = toFiniteNumber(angleOffsetValue, 0);
  const cx = toFiniteNumber(cxValue, NaN);
  const cy = toFiniteNumber(cyValue, NaN);

  if (
    !Number.isFinite(radius)
    || !Number.isFinite(cx)
    || !Number.isFinite(cy)
    || radius <= 0
  ) {
    return '';
  }

  const baseAngle = (2 * Math.PI) / sideCount;
  const visited = new Array(sideCount).fill(false);
  let dAttr = '';

  for (let start = 0; start < sideCount; start += 1) {
    if (visited[start]) {
      // eslint-disable-next-line no-continue
      continue;
    }

    let vertex = start;
    let isFirstPoint = true;

    while (!visited[vertex]) {
      visited[vertex] = true;

      const angle = angleOffset + (vertex * baseAngle);
      const x = formatPathNumber(cx + (radius * Math.cos(angle)));
      const y = formatPathNumber(cy + (radius * Math.sin(angle)));

      dAttr += `${isFirstPoint ? 'M' : 'L'}${x} ${y} `;

      isFirstPoint = false;
      vertex = (vertex + sideSkip) % sideCount;
    }

    dAttr += 'Z ';
  }

  return dAttr.trim();
};

/** ****************************************************************************
 * RegPolyTool class
 *
 * Renders a regular polygon or star polygon.
 */

export default class RegPolyTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_REGPOLY_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        radius: 50,
        side_count: 6,
        side_skip: 1,
        angle_offset: 0,
      },
      classes: {
        tool: {
          'sak-polygon': true,
          hover: true,
        },
        regpoly: {
          'sak-polygon__regpoly': true,
        },
      },
      styles: {
        tool: {},
        regpoly: {},
      },
    };

    const config = Merge.mergeDeep(DEFAULT_REGPOLY_CONFIG, argConfig || {});

    super(argToolset, config, argPos);

    this.svg.radius = Utils.calculateSvgDimension(this.config.position.radius);

    this.classes.regpoly = {};
    this.styles.regpoly = {};

    this._regPolyPathKey = undefined;
    this._regPolyPath = '';

    this._handleClick = this._handleClick.bind(this);

    if (this.dev.debug) {
      console.log('RegPolyTool constructor config, svg', this.toolId, this.config, this.svg);
    }
  }

  /** *****************************************************************************
   * RegPolyTool::value()
   *
   * Receives new state data for the entity this polygon is linked to.
   */

  set value(state) {
    super.value = state;
  }

  _handleClick(event) {
    this.handleTapEvent(event, this.config);
  }

  _getRegPolyPath() {
    const position = this.config.position || {};

    const pathKey = [
      position.side_count,
      position.side_skip,
      position.angle_offset,
      this.svg.radius,
      this.svg.cx,
      this.svg.cy,
    ].join('|');

    if (pathKey !== this._regPolyPathKey) {
      this._regPolyPathKey = pathKey;
      this._regPolyPath = generateRegPolyPath(
        position.side_count,
        position.side_skip,
        this.svg.radius,
        position.angle_offset,
        this.svg.cx,
        this.svg.cy,
      );
    }

    return this._regPolyPath;
  }

  /** *****************************************************************************
   * RegPolyTool::_renderRegPoly()
   *
   * Renders the regular polygon using precalculated coordinates and dimensions.
   */

  _renderRegPoly() {
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.regpoly);

    const dAttr = this._getRegPolyPath();

    if (!dAttr) {
      return svg``;
    }

    return svg`
      <path
        class=${classMap(this.classes.regpoly)}
        d=${dAttr}
        style=${styleMap(this.styles.regpoly)}
      ></path>
    `;
  }

  /** *****************************************************************************
   * RegPolyTool::render()
   *
   * The render() function for this object.
   */

  render() {
    return svg`
      <g
        id=${`regpoly-${this.toolId}`}
        class=${classMap(this.classes.tool)}
        transform-origin=${`${this.svg.cx} ${this.svg.cy}`}
        style=${styleMap(this.styles.tool)}
        @click=${this._handleClick}
      >
        ${this._renderRegPoly()}
      </g>
    `;
  }
}
