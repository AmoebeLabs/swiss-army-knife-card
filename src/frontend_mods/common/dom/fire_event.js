/**
 * Dispatches a custom event with an optional detail value.
 *
 * @param {string} type Name of event type.
 * @param {*=} detail Detail value containing event-specific
 *   payload.
 * @param {{ bubbles: (boolean|undefined),
*           cancelable: (boolean|undefined),
*           composed: (boolean|undefined) }=}
*  options Object specifying options.  These may include:
*  `bubbles` (boolean, defaults to `true`),
*  `cancelable` (boolean, defaults to false), and
*  `node` on which to fire the event (HTMLElement, defaults to `this`).
* @return {Event} The new event that was fired.
*/
// eslint-disable-next-line import/prefer-default-export
export const fireEvent = (node, type, detail, options) => {
 options = options || {};
 // @ts-ignore
 detail = detail === null || detail === undefined ? {} : detail;
 const event = new Event(type, {
   bubbles: options.bubbles === undefined ? true : options.bubbles,
   cancelable: Boolean(options.cancelable),
   composed: options.composed === undefined ? true : options.composed,
 });
 event.detail = detail;
 node.dispatchEvent(event);
 return event;
};
