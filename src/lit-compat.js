/* eslint-disable import-x/no-relative-packages */
// import { classMap as originalClassMap } from 'lit/directives/class-map.js';
// import { styleMap as originalStyleMap } from 'lit/directives/style-map.js';
import { classMap as originalClassMap } from '../node_modules/lit/directives/class-map.js';
import { styleMap as originalStyleMap } from '../node_modules/lit/directives/style-map.js';

export const classMap = (o) => originalClassMap(o || {});
export const styleMap = (o) => originalStyleMap(o || {});
