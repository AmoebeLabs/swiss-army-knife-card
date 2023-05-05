import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import BaseTool from './basetool';

/** ****************************************************************************
  * EntityStateTool class
  *
  * Summary.
  *
  */

export default class EntityStateTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_STATE_CONFIG = {
      show: { uom: 'end' },
      classes: {
        tool: {
          'sak-state': true,
          hover: true,
        },
        state: {
          'sak-state__value': true,
        },
        uom: {
          'sak-state__uom': true,
        },
      },
      styles: {
        state: {
        },
        uom: {
        },
      },
    };
    super(argToolset, Merge.mergeDeep(DEFAULT_STATE_CONFIG, argConfig), argPos);

    this.classes.state = {};
    this.classes.uom = {};

    this.styles.state = {};
    this.styles.uom = {};
    if (this.dev.debug) console.log('EntityStateTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  // EntityStateTool::value
  set value(state) {
    const changed = super.value = state;

    return changed;
  }

  _renderState() {
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.state);

    // var inState = this._stateValue?.toLowerCase();
    let inState = this._stateValue;

    if ((inState) && isNaN(inState)) {
      // const stateObj = this._card.config.entities[this.defaultEntityIndex()].entity;
      const stateObj = this._card.entities[this.defaultEntityIndex()];
      const domain = this._card._computeDomain(this._card.config.entities[this.defaultEntityIndex()].entity);

      const localeTag = this.config.locale_tag ? this.config.locale_tag + inState.toLowerCase() : undefined;
      const localeTag1 = stateObj.attributes?.device_class ? `component.${domain}.state.${stateObj.attributes.device_class}.${inState}` : '--';
      const localeTag2 = `component.${domain}.state._.${inState}`;

      inState = (localeTag && this._card.toLocale(localeTag, inState))
          || (stateObj.attributes?.device_class
          && this._card.toLocale(localeTag1, inState))
          || this._card.toLocale(localeTag2, inState)
          || stateObj.state;

      inState = this.textEllipsis(inState, this.config?.show?.ellipsis);
    }

    return svg`
      <tspan class="${classMap(this.classes.state)}" x="${this.svg.x}" y="${this.svg.y}"
        style="${styleMap(this.styles.state)}">
        ${this.config?.text?.before ? this.config.text.before : ''}${inState}${this.config?.text?.after ? this.config.text.after : ''}</tspan>
    `;
  }

  _renderUom() {
    if (this.config.show.uom === 'none') {
      return svg``;
    } else {
      this.MergeAnimationStyleIfChanged();
      this.MergeColorFromState(this.styles.uom);

      let fsuomStr = this.styles.state['font-size'];

      let fsuomValue = 0.5;
      let fsuomType = 'em';
      const fsuomSplit = fsuomStr.match(/\D+|\d*\.?\d+/g);
      if (fsuomSplit.length === 2) {
        fsuomValue = Number(fsuomSplit[0]) * 0.6;
        fsuomType = fsuomSplit[1];
      } else console.error('Cannot determine font-size for state/unit', fsuomStr);

      fsuomStr = { 'font-size': fsuomValue + fsuomType };

      this.styles.uom = Merge.mergeDeep(this.config.styles.uom, fsuomStr);

      const uom = this._card._buildUom(this.derivedEntity, this._card.entities[this.defaultEntityIndex()], this._card.config.entities[this.defaultEntityIndex()]);

      // Check for location of uom. end = next to state, bottom = below state ;-), etc.
      if (this.config.show.uom === 'end') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else if (this.config.show.uom === 'bottom') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.x}" dy="1.5em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else if (this.config.show.uom === 'top') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.x}" dy="-1.5em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else {
        return svg``;
      }
    }
  }

  firstUpdated(changedProperties) {
  }

  updated(changedProperties) {
  }

  render() {
    if (true || (this._card._computeDomain(this._card.entities[this.defaultEntityIndex()].entity_id) === 'sensor')) {
      return svg`
    <svg overflow="visible" id="state-${this.toolId}" class="${classMap(this.classes.tool)}">
        <text @click=${(e) => this.handleTapEvent(e, this.config)}>
          ${this._renderState()}
          ${this._renderUom()}
        </text>
      </svg>
      `;
    } else {
      // Not a sensor. Might be any other domain. Unit can only be specified using the units: in the configuration.
      // Still check for using an attribute value for the domain...
      return svg`
        <text 
        @click=${(e) => this.handleTapEvent(e, this.config)}>
          <tspan class="state__value" x="${this.svg.x}" y="${this.svg.y}" dx="${dx}em" dy="${dy}em"
            style="${configStyleStr}">
            ${state}</tspan>
          <tspan class="state__uom" dx="-0.1em" dy="-0.45em"
            style="${uomStyleStr}">
            ${uom}</tspan>
        </text>
      `;
    }
  } // render()
}
