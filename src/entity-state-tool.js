import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import Merge from './merge';
import BaseTool from './base-tool';

import { formatNumber, isNumericState } from './frontend_mods/format_number';

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
        tool: {
        },
        state: {
        },
        uom: {
        },
      },
    };
    super(argToolset, Merge.mergeDeep(DEFAULT_STATE_CONFIG, argConfig), argPos);

    this.classes.tool = {};
    this.classes.state = {};
    this.classes.uom = {};

    this.styles.tool = {};
    this.styles.state = {};
    this.styles.uom = {};
    if (this.dev.debug) console.log('EntityStateTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  // EntityStateTool::value
  set value(state) {
    super.value = state;
  }

  _renderStateNew() {
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.state);

    // console.log('in renderstatenew');
    // var inState = this._stateValue?.toLowerCase();
    let inState = this._stateValue;

    const stateObj = this._card.entities[this.defaultEntityIndex()];
    if (stateObj === undefined) return svg``;

    // For testing, not anyting else
    // Seems to work. All . are , at least, and a . is inserted for 1000.
    if (isNumericState(stateObj)) {
      let renderNumber = formatNumber(inState, this._card._hass.locale, {});
      console.log('renderNumber = ', inState, renderNumber);
    }

    // Need entities, not states to get platform, translation_key, etc.!!!!!
    const entity = this._card._hass.entities[stateObj.entity_id];

    // console.log('renderstatenew, stateobj', stateObj, inState);
    // const domain = this._card.entities[this.defaultEntityIndex()]?.entity
    // ? this._card._computeDomain(this._card.entities[this.defaultEntityIndex()].entity) : undefined;
    const domain = this._card._computeDomain(this._card.entities[this.defaultEntityIndex()].entity_id);
    // const platform = this._card._hass.entities[stateObj.entity_id]?.platform;
    // const xlationKey = this._card._hass.entities[stateObj.entity_id]?.translation_key;

    if (!this._card.config.entities[this.defaultEntityIndex()].secondary_info) {
      // true || domain !== 'sensor')
      // console.log('sensor, language', this._card._hass.language);
      // const renderState = (stateObj.attributes.device_class
      //     && this._card._hass.localize(`component.${domain}.state.${stateObj.attributes.device_class}.${inState}`))
      //     || this._card._hass.localize(`component.${platform}.entity.${domain}.${xlationKey}.state.${inState}`)
      //     || this._card._hass.localize(`component.${domain}.entity_component._.state.${inState}`)
      //     || inState;

      const myLocale = this._card.toLocale(`component.${domain}.entity_component._.state.${inState}`, inState);
      // console.log('_renderStateNew, inState, renderState', domain,
      // stateObj.attributes.device_class, inState, renderState, myLocale, stateObj,
      // `component.${platform}.entity.${domain}.${xlationKey}.state.${inState}`);
    }
    // Bij AQI staat platform "airvisual" en translation_key "pollutant_level". Die zag ik ook
    // bij de resources staan als veld ertussen ergens.
    // dit staat dus op sensor.u_s_air_pollution_level.platform / .translation_key
    if ((inState) && isNaN(inState)
     && !this._card.config.entities[this.defaultEntityIndex()].secondary_info
      && !this._card.config.entities[this.defaultEntityIndex()].attribute) {
        // const stateObj = this._card.config.entities[this.defaultEntityIndex()].entity;
      // const stateObj = this._card.entities[this.defaultEntityIndex()];
      // const domain = this._card._computeDomain(this._card.config.entities[this.defaultEntityIndex()].entity);

      const localeTag = this.config.locale_tag ? this.config.locale_tag + inState.toLowerCase() : undefined;
      // const localeTag1 = stateObj.attributes?.device_class
      //   ? `component.${domain}.state.${stateObj.attributes.device_class}.${inState}` : '--';

      // const localeTag2 = `component.${domain}.entity_component._.state.${inState}`;
      // const localeTag3 = `component.${platform}.entity.${domain}.${xlationKey}.state.${inState}`;
      // const localeTag4 = stateObj.attributes?.device_class
      //   ? `component.${domain}.entity_component.${stateObj.attributes.device_class}.state.${inState}` : '--';
      // const attribute = this._card.config.entities[this.defaultEntityIndex()]?.attribute;
      // const localeTag5 = attribute
      //   ? `component.${domain}.entity_component._.state_attributes.${attribute}.state.${inState}` : undefined;

      // console.log('localeTag', inState, this._card.toLocale(localeTag, inState));
      // // console.log('localeTag1', inState, this._card.toLocale(localeTag1, inState));
      // console.log('localeTag2', inState, this._card.toLocale(localeTag2, inState));
      // console.log('localeTag3', inState, this._card.toLocale(localeTag3, inState));

      // console.log('-localeTag', inState, this._card._hass.localize(localeTag), localeTag);
      // // console.log('-localeTag1', inState, this._card._hass.localize(localeTag1));
      // console.log('-localeTag2', inState, this._card._hass.localize(localeTag2), localeTag2);
      // console.log('-localeTag3', inState, this._card._hass.localize(localeTag3), localeTag3);
      // console.log('-localeTag4', inState, this._card._hass.localize(localeTag4), localeTag4);
      // console.log('-localeTag5', inState, this._card._hass.localize(localeTag5), localeTag5);

      // er zijn er nog meer. Attributen, en dingen als battery als binary sensor...
      //
      // component.binary_sensor.entity_component.battery.state.off : "Normaal"
      // component.climate.entity_component._.state_attributes.fan_mode.state.auto :  "Automatisch"

      // inState = (localeTag && this._card._hass.localize(localeTag))
      //     || this._card._hass.localize(localeTag3)
      //     || (stateObj.attributes?.device_class && this._card._hass.localize(localeTag4))
      //     || this._card._hass.localize(localeTag2)
      //     || attribute && this._card._hass.localize(localeTag5)
      //     || this._card._hass.localize(localeTag4)
      //     // || stateObj.state;
      //     || inState;

      inState = false // (localeTag && this._card._hass.localize(localeTag))
        || (entity?.translation_key
            && this._card._hass.localize(
            `component.${entity.platform}.entity.${domain}.${entity.translation_key}.state.${inState}`,
          ))
        // Return device class translation
        || (entity.attributes?.device_class
            && this._card._hass.localize(
            `component.${domain}.entity_component.${entity.attributes.device_class}.state.${inState}`,
          ))
        // Return default translation
        || this._card._hass.localize(`component.${domain}.entity_component._.state.${inState}`)
        // We don't know! Return the raw state.
        || inState;
      // inState = (localeTag && this._card.toLocale(localeTag, inState))
      // || this._card.toLocale(localeTag3, inState)
      // || (stateObj.attributes?.device_class
      //     && this._card.toLocale(localeTag1, inState))
      //     || this._card.toLocale(localeTag2, inState)
      //     || stateObj.state;

      // console.log('last inState = ', inState);

      inState = this.textEllipsis(inState, this.config?.show?.ellipsis);
    }
    if (['undefined', 'unknown', 'unavailable', '-ua-'].includes(inState)) {
      if (inState === '-ua-') inState = 'unavailable';
      inState = this._card._hass.localize(`state.default.${inState}`);
    }

    return svg`
      <tspan class="${classMap(this.classes.state)}" x="${this.svg.x}" y="${this.svg.y}"
        style="${styleMap(this.styles.state)}">
        ${this.config?.text?.before ? this.config.text.before : ''}${inState}${this.config?.text?.after ? this.config.text.after : ''}</tspan>
    `;
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
      this.MergeAnimationClassIfChanged();
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

      this.styles.uom = Merge.mergeDeep(this.config.styles.uom, this.styles.uom, fsuomStr);

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

  // eslint-disable-next-line no-unused-vars
  firstUpdated(changedProperties) {
  }

  // eslint-disable-next-line no-unused-vars
  updated(changedProperties) {
  }

  render() {
    // eslint-disable-next-line no-constant-condition
    if (true || (this._card._computeDomain(this._card.entities[this.defaultEntityIndex()].entity_id) === 'sensor')) {
      return svg`
    <svg overflow="visible" id="state-${this.toolId}"
      class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}">
        <text @click=${(e) => this.handleTapEvent(e, this.config)}>
          ${this._renderStateNew()}
          ${this._renderUom()}
        </text>
      </svg>
      `;
    } else {
      // Not a sensor. Might be any other domain. Unit can only be specified using the units: in the configuration.
      // Still check for using an attribute value for the domain...
      // return svg`
      //   <text
      //   @click=${(e) => this.handleTapEvent(e, this.config)}>
      //     <tspan class="state__value" x="${this.svg.x}" y="${this.svg.y}" dx="${dx}em" dy="${dy}em"
      //       style="${configStyleStr}">
      //       ${state}</tspan>
      //     <tspan class="state__uom" dx="-0.1em" dy="-0.45em"
      //       style="${uomStyleStr}">
      //       ${uom}</tspan>
      //   </text>
      // `;
    }
  } // render()
}
