/** ****************************************************************************
  * Templates class
  *
  * Summary.
  *
  */

export default class Templates {
  /** ****************************************************************************
  * Templates::replaceVariables()
  *
  * Summary.
  * A toolset defines a template. This template is found and passed as argToolsetTemplate.
  * This is actually a set of tools, nothing else...
  * Also passed is the list of variables that should be replaced:
  * - The list defined in the toolset
  * - The defaults defined in the template itself, which are defined in the argToolsetTemplate
  *
  */

  static replaceVariables3(argVariables, argTemplate) {
    // If no variables specified, return template contents, not the first object, but the contents!
    // ie template.toolset or template.colorstops. The toolset and colorstops objects are removed...
    //
    // If not, one gets toolsets[1].toolset.position iso toolsets[1].position.
    //
    if (!argVariables && !argTemplate.template.defaults) {
      return argTemplate[argTemplate.template.type];
    }
    let variableArray = argVariables?.slice(0) ?? [];

    // Merge given variables and defaults...
    if (argTemplate.template.defaults) {
      variableArray = variableArray.concat(argTemplate.template.defaults);
    }

    let jsonConfig = JSON.stringify(argTemplate[argTemplate.template.type]);
    variableArray.forEach((variable) => {
      const key = Object.keys(variable)[0];
      const value = Object.values(variable)[0];
      if (typeof value === 'number' || typeof value === 'boolean') {
        const rxp2 = new RegExp(`"\\[\\[${key}\\]\\]"`, 'gm');
        jsonConfig = jsonConfig.replace(rxp2, value);
      }
      if (typeof value === 'object') {
        const rxp2 = new RegExp(`"\\[\\[${key}\\]\\]"`, 'gm');
        const valueString = JSON.stringify(value);
        jsonConfig = jsonConfig.replace(rxp2, valueString);
      } else {
        const rxp = new RegExp(`\\[\\[${key}\\]\\]`, 'gm');
        jsonConfig = jsonConfig.replace(rxp, value);
      }
    });

    return (JSON.parse(jsonConfig));
  }

  static getJsTemplateOrValueConfig(argTool, argValue) {
    // Check for 'undefined' or 'null'
    if (!argValue) return argValue;

    // Check for primitive data types
    if (['number', 'boolean', 'bigint', 'symbol'].includes(typeof argValue)) return argValue;

    // We might have an object.
    // Beware of the fact that this recursive function overwrites the argValue object,
    // so clone argValue if this is the tool configuration...
    if (typeof argValue === 'object') {
      Object.keys(argValue).forEach((key) => {
        argValue[key] = Templates.getJsTemplateOrValueConfig(argTool, argValue[key]);
      });
      return argValue;
    }

    // typeof should be a string now.
    // The string might be a Javascript template surrounded by [[[<js>]]], or just a string.
    const trimmedValue = argValue.trim();
    if (trimmedValue.substring(0, 4) === '[[[[' && trimmedValue.slice(-4) === ']]]]') {
      return Templates.evaluateJsTemplateConfig(argTool, trimmedValue.slice(4, -4));
    } else {
      // Just a plain string, return value.
      return argValue;
    }
  }

  static evaluateJsTemplateConfig(argTool, jsTemplate) {
    try {
      return new Function('tool_config', `'use strict'; ${jsTemplate}`).call(
        this,
        argTool,
      );
    } catch (e) {
      e.name = 'Sak-evaluateJsTemplateConfig-Error';
      throw e;
    }
  }
  /** *****************************************************************************
  * Templates::evaluateJsTemplate()
  *
  * Summary.
  * Runs the JavaScript template.
  *
  * The arguments passed to the function are:
  * - state, state of the current entity
  * - states, the full array of states provided by hass
  * - entity, the current entity and its configuration
  * - user, the currently logged in user
  * - hass, the hass object...
  * - tool_config, the YAML configuration of the current tool
  * - entity_config, the YAML configuration of configured entity in this tool
  *
  */

  static evaluateJsTemplate(argTool, state, jsTemplate) {
    try {
      return new Function('state', 'states', 'entity', 'user', 'hass', 'tool_config', 'entity_config', `'use strict'; ${jsTemplate}`).call(
        this,
        state,
        argTool._card._hass.states,
        argTool.config.hasOwnProperty('entity_index') ? argTool._card.entities[argTool.config.entity_index] : undefined,
        argTool._card._hass.user,
        argTool._card._hass,
        argTool.config,
        argTool.config.hasOwnProperty('entity_index') ? argTool._card.config.entities[argTool.config.entity_index] : undefined,
      );
    } catch (e) {
      e.name = 'Sak-evaluateJsTemplate-Error';
      throw e;
    }
  }

  /** *****************************************************************************
  * Templates::getJsTemplateOrValue()
  *
  * Summary.
  *
  * References:
  * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
  * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
  *
  */

  static getJsTemplateOrValue(argTool, argState, argValue) {
    // Check for 'undefined' or 'null'
    if (!argValue) return argValue;

    // Check for primitive data types
    if (['number', 'boolean', 'bigint', 'symbol'].includes(typeof argValue)) return argValue;

    // We might have an object.
    // Beware of the fact that this recursive function overwrites the argValue object,
    // so clone argValue if this is the tool configuration...
    if (typeof argValue === 'object') {
      Object.keys(argValue).forEach((key) => {
        argValue[key] = Templates.getJsTemplateOrValue(argTool, argState, argValue[key]);
      });
      return argValue;
    }

    // typeof should be a string now.
    // The string might be a Javascript template surrounded by [[[<js>]]], or just a string.
    const trimmedValue = argValue.trim();
    if (trimmedValue.substring(0, 3) === '[[[' && trimmedValue.slice(-3) === ']]]') {
      return Templates.evaluateJsTemplate(argTool, argState, trimmedValue.slice(3, -3));
    } else {
      // Just a plain string, return value.
      return argValue;
    }
  }
}
