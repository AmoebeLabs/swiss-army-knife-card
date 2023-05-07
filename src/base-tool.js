import { fireEvent } from 'custom-card-helpers';

import Merge from './merge';
import Utils from './utils';
import Templates from './templates';
import Colors from './colors';

/** ***************************************************************************
  * BaseTool class
  *
  * Summary.
  *
  */

export default class BaseTool {
  constructor(argToolset, argConfig, argPos) {
    this.toolId = Math.random().toString(36).substr(2, 9);
    this.toolset = argToolset;
    this._card = this.toolset._card;
    this.config = argConfig;

    this.dev = { ...this._card.dev };

    // The position is the absolute position of the GROUP within the svg viewport.
    // The tool is positioned relative to this origin. A tool is always relative
    // to a 200x200 default svg viewport. A (50,50) position of the tool
    // centers the tool on the absolute position of the GROUP!
    this.toolsetPos = argPos;

    // Get SVG coordinates.
    this.svg = {};

    this.svg.cx = Utils.calculateSvgCoordinate(argConfig.position.cx, 0);
    this.svg.cy = Utils.calculateSvgCoordinate(argConfig.position.cy, 0);

    this.svg.height = argConfig.position.height ? Utils.calculateSvgDimension(argConfig.position.height) : 0;
    this.svg.width = argConfig.position.width ? Utils.calculateSvgDimension(argConfig.position.width) : 0;

    this.svg.x = (this.svg.cx) - (this.svg.width / 2);
    this.svg.y = (this.svg.cy) - (this.svg.height / 2);

    this.classes = {};
    this.classes.card = {};
    this.classes.toolset = {};
    this.classes.tool = {};

    this.styles = {};
    this.styles.card = {};
    this.styles.toolset = {};
    this.styles.tool = {};

    // Setup animation class and style and force initial processing by setting changed to true
    this.animationClass = {};
    this.animationClassHasChanged = true;

    this.animationStyle = {};
    this.animationStyleHasChanged = true;

    // Process basic color stuff.
    if (!this.config?.show?.style) {
      if (!this.config.show) this.config.show = {};
      this.config.show.style = 'default';
    }
    // Get colorstops and make a key/value store...
    this.colorStops = {};
    if ((this.config.colorstops) && (this.config.colorstops.colors)) {
      Object.keys(this.config.colorstops.colors).forEach((key) => {
        this.colorStops[key] = this.config.colorstops.colors[key];
      });
    }

    if ((this.config.show.style === 'colorstop') && (this.config?.colorstops.colors)) {
      this.sortedColorStops = Object.keys(this.config.colorstops.colors).map((n) => Number(n)).sort((a, b) => a - b);
    }

    this.csnew = {};
    if ((this.config.csnew) && (this.config.csnew.colors)) {
      this.config.csnew.colors.forEach((item, i) => {
        this.csnew[item.stop] = this.config.csnew.colors[i];
      });

      this.sortedcsnew = Object.keys(this.csnew).map((n) => Number(n)).sort((a, b) => a - b);
    }
  }

  /** *****************************************************************************
  * BaseTool::textEllipsis()
  *
  * Summary.
  * Very simple form of ellipsis, which is not supported by SVG.
  * Cutoff text at number of characters and add '...'.
  * This does NOT take into account the actual width of a character!
  *
  */
  textEllipsis(argText, argEllipsis) {
    if ((argEllipsis) && (argEllipsis < argText.length)) {
      return argText.slice(0, argEllipsis - 1).concat('...');
    } else {
      return argText;
    }
  }

  defaultEntityIndex() {
    if (!this.default) {
      this.default = {};
      if (this.config.hasOwnProperty('entity_indexes')) {
        this.default.entity_index = this.config.entity_indexes[0].entity_index;
      } else {
        // Must have entity_index! If not, just crash!
        this.default.entity_index = this.config.entity_index;
      }
    }
    return this.default.entity_index;
  }

  /** *****************************************************************************
  * BaseTool::set value()
  *
  * Summary.
  * Receive new state data for the entity this is linked to. Called from set hass;
  *
  */
  set value(state) {
    let localState = state;

    if (this.dev.debug) console.log('BaseTool set value(state)', localState);
    if (typeof (localState) !== 'undefined') if (this._stateValue?.toLowerCase() === localState.toLowerCase()) return;

    this.derivedEntity = null;

    if (this.config.derived_entity) {
      this.derivedEntity = Templates.getJsTemplateOrValue(this, state, Merge.mergeDeep(this.config.derived_entity));

      localState = this.derivedEntity.state?.toString();
    }

    this._stateValuePrev = this._stateValue || localState;
    this._stateValue = localState;
    this._stateValueIsDirty = true;

    // If animations defined, calculate style for current state.

    // 2022.07.04 Temp disable this return, as animations should be able to process the 'undefined' state too!!!!
    // if (this._stateValue == undefined) return;
    // if (typeof(this._stateValue) === 'undefined') return;

    let isMatch = false;
    // #TODO:
    // Modify this loop using .find() orso. It now keeps returning true for all items in animations list.
    // It works, but can be more efficient ;-)

    this.activeAnimation = null;

    if (this.config.animations) Object.keys(this.config.animations).map((animation) => {
      // NEW!!!
      // Config more than 1 level deep is overwritten, so never changed after first evaluation. Stuff is overwritten???
      const tempConfig = JSON.parse(JSON.stringify(this.config.animations[animation]));

      const item = Templates.getJsTemplateOrValue(this, this._stateValue, Merge.mergeDeep(tempConfig));
      // var item = Templates.getJsTemplateOrValue(this, this._stateValue, Merge.mergeDeep(this.config.animations[animation]));

      if (isMatch) return true;

      // The state builder renames 'unavailable' to '-ua-'
      // Change this temporary in here to match this...
      if (item.state === 'unavailable') { item.state = '-ua-'; }

      // #TODO:
      // Default is item.state. But can also be item.custom_field[x], so you can compare with custom value
      // Should index then not with item.state but item[custom_field[x]].toLowerCase() or similar...
      // Or above, with the mapping of the item using the name?????

      // Assume equals operator if not defined...
      const operator = item.operator ? item.operator : '==';

      switch (operator) {
        case '==':
          if (typeof (this._stateValue) === 'undefined') {
            isMatch = (typeof item.state === 'undefined') || (item.state.toLowerCase() === 'undefined');
          } else {
            isMatch = this._stateValue.toLowerCase() === item.state.toLowerCase();
          }
          break;
        case '!=':
          if (typeof (this._stateValue) === 'undefined') {
            isMatch = (item.state.toLowerCase() !== 'undefined');
          } else {
            isMatch = this._stateValue.toLowerCase() !== item.state.toLowerCase();
          }
          break;
        case '>':
          if (typeof (this._stateValue) !== 'undefined')
            isMatch = Number(this._stateValue.toLowerCase()) > Number(item.state.toLowerCase());
          break;
        case '<':
          if (typeof (this._stateValue) !== 'undefined')
            isMatch = Number(this._stateValue.toLowerCase()) < Number(item.state.toLowerCase());
          break;
        case '>=':
          if (typeof (this._stateValue) !== 'undefined')
            isMatch = Number(this._stateValue.toLowerCase()) >= Number(item.state.toLowerCase());
          break;
        case '<=':
          if (typeof (this._stateValue) !== 'undefined') {
            isMatch = Number(this._stateValue.toLowerCase()) <= Number(item.state.toLowerCase());
          }
          break;
        default:
          // Unknown operator. Just do nothing and return;
          isMatch = false;
      }
      // Revert state
      if (item.state === '-ua-') { item.state = 'unavailable'; }

      if (this.dev.debug) console.log('BaseTool, animation, match, value, config, operator', isMatch, this._stateValue, item.state, item.operator);
      if (!isMatch) return true;

      if (!this.animationClass || !item.reuse) { this.animationClass = {}; }
      if (item.classes) {
        this.animationClass = Merge.mergeDeep(this.animationClass, item.classes);
      }

      if (!this.animationStyle || !item.reuse) this.animationStyle = {};
      if (item.styles) {
        this.animationStyle = Merge.mergeDeep(this.animationStyle, item.styles);
      }

      this.animationStyleHasChanged = true;

      // #TODO:
      // Store activeAnimation. Should be renamed, and used for more purposes, as via this method
      // you can override any value from within an animation, not just the css style settings.
      this.item = item;
      this.activeAnimation = item;

      return isMatch;
    });
  }

  /** *****************************************************************************
  * BaseTool::set values()
  *
  * Summary.
  * Receive new state data for the entity this is linked to. Called from set hass;
  *
  */

  getEntityIndexFromAnimation(animation) {
    // Check if animation has entity_index specified
    if (animation.hasOwnProperty('entity_index')) return animation.entity_index;

    // We need to get the default entity.
    // If entity_index defined use that one...
    if (this.config.hasOwnProperty('entity_index')) return this.config.entity_index;

    // If entity_indexes is defined, take the
    // first entity_index in the list as the default entity_index to use
    if (this.config.entity_indexes) return (this.config.entity_indexes[0].entity_index);
  }

  getIndexInEntityIndexes(entityIdx) {
    return this.config.entity_indexes.findIndex((element) => element.entity_index === entityIdx);
  }

  stateIsMatch(animation, state) {
    let isMatch;
    // NEW!!!
    // Config more than 1 level deep is overwritten, so never changed after first evaluation. Stuff is overwritten???
    const tempConfig = JSON.parse(JSON.stringify(animation));

    const item = Templates.getJsTemplateOrValue(this, state, Merge.mergeDeep(tempConfig));

    // Assume equals operator if not defined...
    const operator = item.operator ? item.operator : '==';

    switch (operator) {
      case '==':
        if (typeof (state) === 'undefined') {
          isMatch = (typeof item.state === 'undefined') || (item.state.toLowerCase() === 'undefined');
        } else {
          isMatch = state.toLowerCase() === item.state.toLowerCase();
        }
        break;
      case '!=':
        if (typeof (state) === 'undefined') {
          isMatch = (typeof item.state !== 'undefined') || (item.state.toLowerCase() !== 'undefined');
        } else {
          isMatch = state.toLowerCase() !== item.state.toLowerCase();
        }
        break;
      case '>':
        if (typeof (state) !== 'undefined')
          isMatch = Number(state.toLowerCase()) > Number(item.state.toLowerCase());
        break;
      case '<':
        if (typeof (state) !== 'undefined')
          isMatch = Number(state.toLowerCase()) < Number(item.state.toLowerCase());
        break;
      case '>=':
        if (typeof (state) !== 'undefined')
          isMatch = Number(state.toLowerCase()) >= Number(item.state.toLowerCase());
        break;
      case '<=':
        if (typeof (state) !== 'undefined')
          isMatch = Number(state.toLowerCase()) <= Number(item.state.toLowerCase());
        break;
      default:
        // Unknown operator. Just do nothing and return;
        isMatch = false;
    }
    return isMatch;
  }

  mergeAnimationData(animation) {
    if (!this.animationClass || !animation.reuse) this.animationClass = {};
    if (animation.classes) {
      this.animationClass = Merge.mergeDeep(this.animationClass, animation.classes);
    }

    if (!this.animationStyle || !animation.reuse) this.animationStyle = {};
    if (animation.styles) {
      this.animationStyle = Merge.mergeDeep(this.animationStyle, animation.styles);
    }

    this.animationStyleHasChanged = true;

    // With more than 1 matching state (more entities), we have to preserve some
    // extra data, such as setting the icon, name, area, etc. HOW?? Merge??

    if (!this.item) this.item = {};
    this.item = Merge.mergeDeep(this.item, animation);
    this.activeAnimation = { ...animation }; // Merge.mergeDeep(this.activeAnimation, animation);
  }

  set values(states) {
    if (!this._lastStateValues) this._lastStateValues = [];
    if (!this._stateValues) this._stateValues = [];

    const localStates = [...states];

    if (this.dev.debug) console.log('BaseTool set values(state)', localStates);

    // Loop through all values...
    // var state;
    for (let index = 0; index < states.length; ++index) {
      // state = states[index];

      // eslint-disable-next-line no-empty
      if (typeof (localStates[index]) !== 'undefined') if (this._stateValues[index]?.toLowerCase() === localStates[index].toLowerCase()) {} else {
        // State has changed, process...

        // eslint-disable-next-line no-lonely-if
        if (this.config.derived_entities) {
          this.derivedEntities[index] = Templates.getJsTemplateOrValue(this, states[index], Merge.mergeDeep(this.config.derived_entities[index]));

          localStates[index] = this.derivedEntities[index].state?.toString();
        }
      }

      this._lastStateValues[index] = this._stateValues[index] || localStates[index];
      this._stateValues[index] = localStates[index];
      this._stateValueIsDirty = true;

      let isMatch = false;

      this.activeAnimation = null;

      // eslint-disable-next-line no-loop-func, no-unused-vars
      if (this.config.animations) Object.keys(this.config.animations.map((aniKey, aniValue) => {
        const statesIndex = this.getIndexInEntityIndexes(this.getEntityIndexFromAnimation(aniKey));
        isMatch = this.stateIsMatch(aniKey, states[statesIndex]);

        //        console.log("set values, animations", aniKey, aniValue, statesIndex, isMatch, states);

        if (isMatch) {
          this.mergeAnimationData(aniKey);
          return true;
        } else {
          return false;
        }
      }));
    }
    this._stateValue = this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())];
    this._stateValuePrev = this._lastStateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())];
  }

  EnableHoverForInteraction() {
    const hover = (this.config.hasOwnProperty('entity_index') || (this.config?.user_actions?.tap_action));
    this.classes.tool.hover = !!hover;
  }

  /** *****************************************************************************
  * BaseTool::MergeAnimationStyleIfChanged()
  *
  * Summary.
  * Merge changed animationStyle with configured static styles.
  *
  */
  MergeAnimationStyleIfChanged(argDefaultStyles) {
    if (this.animationStyleHasChanged) {
      this.animationStyleHasChanged = false;
      if (argDefaultStyles) {
        this.styles = Merge.mergeDeep(argDefaultStyles, this.config.styles, this.animationStyle);
      } else {
        this.styles = Merge.mergeDeep(this.config.styles, this.animationStyle);
      }

      if (this.styles.card) {
        if (Object.keys(this.styles.card).length !== 0) {
          this._card.styles.card = Merge.mergeDeep(this.styles.card);
        }
      }
    }
  }

  /** *****************************************************************************
  * BaseTool::MergeAnimationClassIfChanged()
  *
  * Summary.
  * Merge changed animationclass with configured static styles.
  *
  */
  MergeAnimationClassIfChanged(argDefaultClasses) {
    // Hack
    // @TODO This setting is still required for some reason. So this change is not detected...
    this.animationClassHasChanged = true;

    if (this.animationClassHasChanged) {
      this.animationClassHasChanged = false;
      if (argDefaultClasses) {
        this.classes = Merge.mergeDeep(argDefaultClasses, this.config.classes, this.animationClass);
      } else {
        this.classes = Merge.mergeDeep(this.config.classes, this.animationClass);
      }
    }
  }

  /** *****************************************************************************
  * BaseTool::MergeColorFromState()
  *
  * Summary.
  * Merge color depending on state into colorStyle
  *
  */

  MergeColorFromState(argStyleMap) {
    if (this.config.hasOwnProperty('entity_index')) {
      const color = this.getColorFromState(this._stateValue);
      if (color !== '') {
        argStyleMap.fill = this.config[this.config.show.style].fill ? color : '';
        argStyleMap.stroke = this.config[this.config.show.style].stroke ? color : '';

        // this.config[this.config.show.style].fill ? argStyleMap['fill'] = color : '';
        // this.config[this.config.show.style].stroke ? argStyleMap['stroke'] = color : '';
      }
    }
  }

  /** *****************************************************************************
  * BaseTool::MergeColorFromState2()
  *
  * Summary.
  * Merge color depending on state into colorStyle
  *
  */

  MergeColorFromState2(argStyleMap, argPart) {
    if (this.config.hasOwnProperty('entity_index')) {
      const fillColor = this.config[this.config.show.style].fill ? this.getColorFromState2(this._stateValue, argPart, 'fill') : '';
      const strokeColor = this.config[this.config.show.style].stroke ? this.getColorFromState2(this._stateValue, argPart, 'stroke') : '';
      if (fillColor !== '') {
        argStyleMap.fill = fillColor;
      }
      if (strokeColor !== '') {
        argStyleMap.stroke = strokeColor;
      }
    }
  }

  /** *****************************************************************************
  * BaseTool::getColorFromState()
  *
  * Summary.
  * Get color from colorstop or gradient depending on state.
  *
  */
  getColorFromState(argValue) {
    let color = '';
    switch (this.config.show.style) {
      case 'default':
        break;
      case 'fixedcolor':
        color = this.config.color;
        break;
      case 'colorstop':
      case 'colorstops':
      case 'colorstopgradient':
        color = Colors.calculateColor(argValue, this.colorStops, (this.config.show.style === 'colorstopgradient'));
        break;
      case 'minmaxgradient':
        color = Colors.calculateColor(argValue, this.colorStopsMinMax, true);
        break;
      default:
    }
    return color;
  }

  /** *****************************************************************************
  * BaseTool::getColorFromState2()
  *
  * Summary.
  * Get color from colorstop or gradient depending on state.
  *
  */
  getColorFromState2(argValue, argPart, argProperty) {
    let color = '';
    switch (this.config.show.style) {
      case 'colorstop':
      case 'colorstops':
      case 'colorstopgradient':
        color = Colors.calculateColor2(argValue, this.csnew, argPart, argProperty, (this.config.show.style === 'colorstopgradient'));
        break;
      case 'minmaxgradient':
        color = Colors.calculateColor2(argValue, this.colorStopsMinMax, argPart, argProperty, true);
        break;
      default:
    }
    return color;
  }

  /** *****************************************************************************
  * BaseTool::_processTapEvent()
  *
  * Summary.
  * Processes the mouse click of the user and dispatches the event to the
  * configure handler.
  *
  */

  _processTapEvent(node, hass, config, actionConfig, entityId, parameterValue) {
    let e;

    if (!actionConfig) return;
    fireEvent(node, 'haptic', actionConfig.haptic || 'medium');

    if (this.dev.debug) console.log('_processTapEvent', config, actionConfig, entityId, parameterValue);
    for (let i = 0; i < actionConfig.actions.length; i++) {
      switch (actionConfig.actions[i].action) {
        case 'more-info': {
          if (typeof entityId !== 'undefined') {
            e = new Event('hass-more-info', { composed: true });
            e.detail = { entityId };
            node.dispatchEvent(e);
          }
          break;
        }
        case 'navigate': {
          if (!actionConfig.actions[i].navigation_path) return;
          window.history.pushState(null, '', actionConfig.actions[i].navigation_path);
          e = new Event('location-changed', { composed: true });
          e.detail = { replace: false };
          window.dispatchEvent(e);
          break;
        }
        case 'call-service': {
          if (!actionConfig.actions[i].service) return;
          const [domain, service] = actionConfig.actions[i].service.split('.', 2);
          const serviceData = { ...actionConfig.actions[i].service_data };

          // Fill with current entity_id if none given
          if (!serviceData.entity_id) {
            serviceData.entity_id = entityId;
          }
          // If parameter defined, add this one with the parameterValue
          if (actionConfig.actions[i].parameter) {
            serviceData[actionConfig.actions[i].parameter] = parameterValue;
          }
          hass.callService(domain, service, serviceData);
          break;
        }
        default: {
          console.error('Unknown Event definition', actionConfig);
        }
      }
    }
  }

  /** *****************************************************************************
  * BaseTool::handleTapEvent()
  *
  * Summary.
  * Handles the first part of mouse click processing.
  * It stops propagation to the parent and processes the event.
  *
  * The action can be configured per tool.
  *
  */

  handleTapEvent(argEvent, argToolConfig) {
    argEvent.stopPropagation();
    argEvent.preventDefault();

    let tapConfig;
    // If no user_actions defined, AND there is an entity_index,
    // define a default 'more-info' tap action
    if (argToolConfig.hasOwnProperty('entity_index') && (!argToolConfig.user_actions)) {
      tapConfig = {
        haptic: 'light',
        actions: [{
          action: 'more-info',
        }],
      };
    } else {
      tapConfig = argToolConfig.user_actions?.tap_action;
    }

    if (!tapConfig) return;

    this._processTapEvent(
      this._card,
      this._card._hass,
      this.config,
      tapConfig,
      this._card.config.hasOwnProperty('entities')
        ? this._card.config.entities[argToolConfig.entity_index]?.entity
        : undefined,
      undefined,
    );
  }
} // -- CLASS
