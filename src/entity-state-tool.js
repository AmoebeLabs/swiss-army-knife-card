import { svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit-html/directives/style-map.js';

import { selectUnit } from '@formatjs/intl-utils';
import Merge from './merge';
import BaseTool from './base-tool';

import { formatNumber, getDefaultFormatOptions } from './frontend_mods/format_number';
import {
  formatDate,
  formatDateMonth,
  formatDateMonthYear,
  formatDateShort,
  formatDateNumeric,
  formatDateWeekday,
  formatDateWeekdayDay,
  formatDateWeekdayShort,
 } from './frontend_mods/datetime/format_date';
 import {
  formatTime,
  formatTime24h,
  formatTimeWeekday,
  formatTimeWithSeconds,
} from './frontend_mods/datetime/format_time';
import {
  formatDateTime,
  formatDateTimeNumeric,
  formatDateTimeWithSeconds,
  formatShortDateTime,
  formatShortDateTimeWithYear,
} from './frontend_mods/datetime/format_date_time';
import { formatDuration } from './frontend_mods/datetime/duration';
import { computeDomain } from './frontend_mods/common/entity/compute_domain';
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

  static testTimeDate = false;

  // EntityStateTool::value
  set value(state) {
    super.value = state;
  }

  formatStateString(inState, entityConfig) {
    const lang = this._card._hass.selectedLanguage || this._card._hass.language;
    let locale = {};
    locale.language = lang;

    if (['relative', 'total',
         'datetime', 'datetime-short', 'datetime-short_with-year', 'datetime_seconds', 'datetime-numeric',
         'date', 'date_month', 'date_month_year', 'date-short', 'date-numeric', 'date_weekday', 'date_weekday_day', 'date_weekday-short',
         'time', 'time-24h', 'time-24h_date-short', 'time_weekday', 'time_seconds'].includes(entityConfig.format)) {
      const timestamp = new Date(inState);
      if (!(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
        return inState;
      }

      // if (!EntityStateTool.testTimeDate) {
      //   EntityStateTool.testTimeDate = true;
      //   console.log('datetime', formatDateTime(timestamp, locale));
      //   console.log('datetime-numeric', formatDateTimeNumeric(timestamp, locale));
      //   console.log('date', formatDate(timestamp, locale));
      //   console.log('date_month', formatDateMonth(timestamp, locale));
      //   console.log('date_month_year', formatDateMonthYear(timestamp, locale));
      //   console.log('date-short', formatDateShort(timestamp, locale));
      //   console.log('date-numeric', formatDateNumeric(timestamp, locale));
      //   console.log('date_weekday', formatDateWeekday(timestamp, locale));
      //   console.log('date_weekday-short', formatDateWeekdayShort(timestamp, locale));
      //   console.log('date_weekday_day', formatDateWeekdayDay(timestamp, locale));
      //   console.log('time', formatTime(timestamp, locale));
      //   console.log('time-24h', formatTime24h(timestamp, locale));
      //   console.log('time_weekday', formatTimeWeekday(timestamp, locale));
      //   console.log('time_seconds', formatTimeWithSeconds(timestamp, locale));
      // }

      let retValue;
      // return date/time according to formatting...
      switch (entityConfig.format) {
        case 'relative':
          // eslint-disable-next-line no-case-declarations
          const diff = selectUnit(timestamp, new Date());
          retValue = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }).format(diff.value, diff.unit);
          break;
        case 'total':
        case 'precision':
          retValue = 'Not Yet Supported';
          break;
        case 'datetime':
          retValue = formatDateTime(timestamp, locale);
          break;
        case 'datetime-short':
          retValue = formatShortDateTime(timestamp, locale);
          break;
        case 'datetime-short_with-year':
          retValue = formatShortDateTimeWithYear(timestamp, locale);
          break;
        case 'datetime_seconds':
          retValue = formatDateTimeWithSeconds(timestamp, locale);
          break;
        case 'datetime-numeric':
          retValue = formatDateTimeNumeric(timestamp, locale);
          break;
        case 'date':
          retValue = formatDate(timestamp, locale);
          // retValue = new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'numeric', day: 'numeric' }).format(timestamp);
          break;
        case 'date_month':
          retValue = formatDateMonth(timestamp, locale);
          break;
        case 'date_month_year':
          retValue = formatDateMonthYear(timestamp, locale);
          break;
        case 'date-short':
          retValue = formatDateShort(timestamp, locale);
          break;
        case 'date-numeric':
          retValue = formatDateNumeric(timestamp, locale);
          break;
        case 'date_weekday':
          retValue = formatDateWeekday(timestamp, locale);
          break;
        case 'date_weekday-short':
          retValue = formatDateWeekdayShort(timestamp, locale);
          break;
        case 'date_weekday_day':
          retValue = formatDateWeekdayDay(timestamp, locale);
          break;
        case 'time':
          retValue = formatTime(timestamp, locale);
          // retValue = new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(timestamp);
          break;
        case 'time-24h':
          retValue = formatTime24h(timestamp);
          break;
        case 'time-24h_date-short':
          // eslint-disable-next-line no-case-declarations
          const diff2 = selectUnit(timestamp, new Date());
          if (['second', 'minute', 'hour'].includes(diff2.unit)) {
            retValue = formatTime24h(timestamp);
          } else {
            retValue = formatDateShort(timestamp, locale);
          }
          break;
          case 'time_weekday':
          retValue = formatTimeWeekday(timestamp, locale);
          break;
        case 'time_seconds':
          retValue = formatTimeWithSeconds(timestamp, locale);
          break;
        default:
      }
      return retValue;
    }

    if (isNaN(parseFloat(inState)) || !isFinite(inState)) {
      return inState;
    }
    if (entityConfig.format === 'brightness' || entityConfig.format === 'brightness_pct') {
      return `${Math.round((inState / 255) * 100)} %`;
    }
    if (entityConfig.format === 'duration') {
      return formatDuration(inState, 's');
    }
  }

  _renderState() {
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.state);

    let inState = this._stateValue;

    const stateObj = this._card.entities[this.defaultEntityIndex()];
    if (stateObj === undefined) return svg``;
    if ([undefined, 'undefined'].includes(inState)) { return svg``; }
    if (inState === undefined) return svg``;

    // Need entities, not states to get platform, translation_key, etc.!!!!!
    const entity = this._card._hass.entities[stateObj.entity_id];
    const entity2 = this._card._hass.states[stateObj.entity_id];

    const entityConfig = this._card.config.entities[this.defaultEntityIndex()];
    const domain = computeDomain(this._card.entities[this.defaultEntityIndex()].entity_id);

    const localeTag = this.config.locale_tag ? this.config.locale_tag + inState.toLowerCase() : undefined;

    // HACK
    if ((entityConfig.format !== undefined) && (typeof inState !== 'undefined')) {
        inState = this.formatStateString(inState, entityConfig);
    }

    if ((inState) && isNaN(inState)
     && !entityConfig.secondary_info
      // && !this._card.config.entities[this.defaultEntityIndex()].attribute) {
      || entityConfig.attribute) {
      inState = (localeTag && this._card._hass.localize(localeTag))
        || (entity?.translation_key
            && this._card._hass.localize(
            `component.${entity.platform}.entity.${domain}.${entity.translation_key}.state.${inState}`,
          ))
        // Return device class translation
        || (entity2?.attributes?.device_class
            && this._card._hass.localize(
            `component.${domain}.entity_component.${entity2.attributes.device_class}.state.${inState}`,
          ))
        // Return default translation
        || this._card._hass.localize(`component.${domain}.entity_component._.state.${inState}`)
        // We don't know! Return the raw state.
        || inState;
      inState = this.textEllipsis(inState, this.config?.show?.ellipsis);
    }
    if (['undefined', 'unknown', 'unavailable', '-ua-'].includes(inState)) {
      inState = this._card._hass.localize(`state.default.${inState}`);
    }

    if (!isNaN(inState)) {
      let options = {};
      options = getDefaultFormatOptions(inState, options);
      if (this._card.config.entities[this.defaultEntityIndex()].decimals !== undefined) {
        options.maximumFractionDigits = this._card.config.entities[this.defaultEntityIndex()].decimals;
        options.minimumFractionDigits = options.maximumFractionDigits;
      }
      let renderNumber = formatNumber(inState, this._card._hass.locale, options);
      inState = renderNumber;
    }
    return svg`
      <tspan class="${classMap(this.classes.state)}" x="${this.svg.x}" y="${this.svg.y}"
        style="${styleMap(this.styles.state)}">
        ${this.config?.text?.before ? this.config.text.before : ''}${inState}${this.config?.text?.after ? this.config.text.after : ''}</tspan>
    `;
  }

  _renderUom() {
    if ((this.config.show.uom === 'none') || (typeof this._stateValue === 'undefined')) {
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
    if (true || (computeDomain(this._card.entities[this.defaultEntityIndex()].entity_id) === 'sensor')) {
      return svg`
    <svg overflow="visible" id="state-${this.toolId}"
      class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}">
        <text @click=${(e) => this.handleTapEvent(e, this.config)}>
          ${this._renderState()}
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
