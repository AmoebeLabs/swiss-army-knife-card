/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const t="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,e=(t,e,s=null,i=null)=>{for(;e!==s;){const s=e.nextSibling;t.insertBefore(e,i),e=s}},s=(t,e,s=null)=>{for(;e!==s;){const s=e.nextSibling;t.removeChild(e),e=s}},i=`{{lit-${String(Math.random()).slice(2)}}}`,o=`\x3c!--${i}--\x3e`,a=new RegExp(`${i}|${o}`),n="$lit$";class r{constructor(t,e){this.parts=[],this.element=e;const s=[],o=[],r=document.createTreeWalker(e.content,133,null,!1);let l=0,g=-1,u=0;const{strings:m,values:{length:p}}=t;for(;u<p;){const t=r.nextNode();if(null!==t){if(g++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:s}=e;let i=0;for(let t=0;t<s;t++)h(e[t].name,n)&&i++;for(;i-- >0;){const e=m[u],s=d.exec(e)[2],i=s.toLowerCase()+n,o=t.getAttribute(i);t.removeAttribute(i);const r=o.split(a);this.parts.push({type:"attribute",index:g,name:s,strings:r}),u+=r.length-1}}"TEMPLATE"===t.tagName&&(o.push(t),r.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(i)>=0){const i=t.parentNode,o=e.split(a),r=o.length-1;for(let e=0;e<r;e++){let s,a=o[e];if(""===a)s=c();else{const t=d.exec(a);null!==t&&h(t[2],n)&&(a=a.slice(0,t.index)+t[1]+t[2].slice(0,-5)+t[3]),s=document.createTextNode(a)}i.insertBefore(s,t),this.parts.push({type:"node",index:++g})}""===o[r]?(i.insertBefore(c(),t),s.push(t)):t.data=o[r],u+=r}}else if(8===t.nodeType)if(t.data===i){const e=t.parentNode;null!==t.previousSibling&&g!==l||(g++,e.insertBefore(c(),t)),l=g,this.parts.push({type:"node",index:g}),null===t.nextSibling?t.data="":(s.push(t),g--),u++}else{let e=-1;for(;-1!==(e=t.data.indexOf(i,e+1));)this.parts.push({type:"node",index:-1}),u++}}else r.currentNode=o.pop()}for(const i of s)i.parentNode.removeChild(i)}}const h=(t,e)=>{const s=t.length-e.length;return s>=0&&t.slice(s)===e},l=t=>-1!==t.index,c=()=>document.createComment(""),d=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function g(t,e){const{element:{content:s},parts:i}=t,o=document.createTreeWalker(s,133,null,!1);let a=m(i),n=i[a],r=-1,h=0;const l=[];let c=null;for(;o.nextNode();){r++;const t=o.currentNode;for(t.previousSibling===c&&(c=null),e.has(t)&&(l.push(t),null===c&&(c=t)),null!==c&&h++;void 0!==n&&n.index===r;)n.index=null!==c?-1:n.index-h,a=m(i,a),n=i[a]}l.forEach((t=>t.parentNode.removeChild(t)))}const u=t=>{let e=11===t.nodeType?0:1;const s=document.createTreeWalker(t,133,null,!1);for(;s.nextNode();)e++;return e},m=(t,e=-1)=>{for(let s=e+1;s<t.length;s++){const e=t[s];if(l(e))return s}return-1};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const p=new WeakMap,v=t=>(...e)=>{const s=t(...e);return p.set(s,!0),s},f=t=>"function"==typeof t&&p.has(t),y={},_={};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class b{constructor(t,e,s){this.__parts=[],this.template=t,this.processor=e,this.options=s}update(t){let e=0;for(const s of this.__parts)void 0!==s&&s.setValue(t[e]),e++;for(const s of this.__parts)void 0!==s&&s.commit()}_clone(){const e=t?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),s=[],i=this.template.parts,o=document.createTreeWalker(e,133,null,!1);let a,n=0,r=0,h=o.nextNode();for(;n<i.length;)if(a=i[n],l(a)){for(;r<a.index;)r++,"TEMPLATE"===h.nodeName&&(s.push(h),o.currentNode=h.content),null===(h=o.nextNode())&&(o.currentNode=s.pop(),h=o.nextNode());if("node"===a.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(h.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(h,a.name,a.strings,this.options));n++}else this.__parts.push(void 0),n++;return t&&(document.adoptNode(e),customElements.upgrade(e)),e}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const x=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:t=>t}),w=` ${i} `;class S{constructor(t,e,s,i){this.strings=t,this.values=e,this.type=s,this.processor=i}getHTML(){const t=this.strings.length-1;let e="",s=!1;for(let a=0;a<t;a++){const t=this.strings[a],r=t.lastIndexOf("\x3c!--");s=(r>-1||s)&&-1===t.indexOf("--\x3e",r+1);const h=d.exec(t);e+=null===h?t+(s?w:o):t.substr(0,h.index)+h[1]+h[2]+n+h[3]+i}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");let e=this.getHTML();return void 0!==x&&(e=x.createHTML(e)),t.innerHTML=e,t}}class $ extends S{getHTML(){return`<svg>${super.getHTML()}</svg>`}getTemplateElement(){const t=super.getTemplateElement(),s=t.content,i=s.firstChild;return s.removeChild(i),e(s,i.firstChild),t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const k=t=>null===t||!("object"==typeof t||"function"==typeof t),E=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class C{constructor(t,e,s){this.dirty=!0,this.element=t,this.name=e,this.strings=s,this.parts=[];for(let i=0;i<s.length-1;i++)this.parts[i]=this._createPart()}_createPart(){return new T(this)}_getValue(){const t=this.strings,e=t.length-1,s=this.parts;if(1===e&&""===t[0]&&""===t[1]){const t=s[0].value;if("symbol"==typeof t)return String(t);if("string"==typeof t||!E(t))return t}let i="";for(let o=0;o<e;o++){i+=t[o];const e=s[o];if(void 0!==e){const t=e.value;if(k(t)||!E(t))i+="string"==typeof t?t:String(t);else for(const e of t)i+="string"==typeof e?e:String(e)}}return i+=t[e],i}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class T{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===y||k(t)&&t===this.value||(this.value=t,f(t)||(this.committer.dirty=!0))}commit(){for(;f(this.value);){const t=this.value;this.value=y,t(this)}this.value!==y&&this.committer.commit()}}class I{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(c()),this.endNode=t.appendChild(c())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=c()),t.__insert(this.endNode=c())}insertAfterPart(t){t.__insert(this.startNode=c()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(null===this.startNode.parentNode)return;for(;f(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=y,t(this)}const t=this.__pendingValue;t!==y&&(k(t)?t!==this.value&&this.__commitText(t):t instanceof S?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):E(t)?this.__commitIterable(t):t===_?(this.value=_,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,s="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=s:this.__commitNode(document.createTextNode(s)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof b&&this.value.template===e)this.value.update(t.values);else{const s=new b(e,t.processor,this.options),i=s._clone();s.update(t.values),this.__commitNode(i),this.value=s}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let s,i=0;for(const o of t)s=e[i],void 0===s&&(s=new I(this.options),e.push(s),0===i?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(o),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){s(this.startNode.parentNode,t.nextSibling,this.endNode)}}class A{constructor(t,e,s){if(this.value=void 0,this.__pendingValue=void 0,2!==s.length||""!==s[0]||""!==s[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=s}setValue(t){this.__pendingValue=t}commit(){for(;f(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=y,t(this)}if(this.__pendingValue===y)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=y}}class M extends C{constructor(t,e,s){super(t,e,s),this.single=2===s.length&&""===s[0]&&""===s[1]}_createPart(){return new V(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class V extends T{}let N=!1;(()=>{try{const t={get capture(){return N=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}})();class P{constructor(t,e,s){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=s,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;f(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=y,t(this)}if(this.__pendingValue===y)return;const t=this.__pendingValue,e=this.value,s=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),i=null!=t&&(null==e||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),i&&(this.__options=D(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=y}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const D=t=>t&&(N?{capture:t.capture,passive:t.passive,once:t.once}:t.capture)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */;function O(t){let e=R.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},R.set(t.type,e));let s=e.stringsArray.get(t.strings);if(void 0!==s)return s;const o=t.strings.join(i);return s=e.keyString.get(o),void 0===s&&(s=new r(t,t.getTemplateElement()),e.keyString.set(o,s)),e.stringsArray.set(t.strings,s),s}const R=new Map,L=new WeakMap;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const z=new
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class{handleAttributeExpressions(t,e,s,i){const o=e[0];if("."===o){return new M(t,e.slice(1),s).parts}if("@"===o)return[new P(t,e.slice(1),i.eventContext)];if("?"===o)return[new A(t,e.slice(1),s)];return new C(t,e,s).parts}handleTextExpression(t){return new I(t)}};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");const U=(t,...e)=>new S(t,e,"html",z),F=(t,...e)=>new $(t,e,"svg",z)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */,B=(t,e)=>`${t}--${e}`;let j=!0;void 0===window.ShadyCSS?j=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),j=!1);const q=t=>e=>{const s=B(e.type,t);let o=R.get(s);void 0===o&&(o={stringsArray:new WeakMap,keyString:new Map},R.set(s,o));let a=o.stringsArray.get(e.strings);if(void 0!==a)return a;const n=e.strings.join(i);if(a=o.keyString.get(n),void 0===a){const s=e.getTemplateElement();j&&window.ShadyCSS.prepareTemplateDom(s,t),a=new r(e,s),o.keyString.set(n,a)}return o.stringsArray.set(e.strings,a),a},H=["html","svg"],G=new Set,W=(t,e,s)=>{G.add(t);const i=s?s.element:document.createElement("template"),o=e.querySelectorAll("style"),{length:a}=o;if(0===a)return void window.ShadyCSS.prepareTemplateStyles(i,t);const n=document.createElement("style");for(let l=0;l<a;l++){const t=o[l];t.parentNode.removeChild(t),n.textContent+=t.textContent}(t=>{H.forEach((e=>{const s=R.get(B(e,t));void 0!==s&&s.keyString.forEach((t=>{const{element:{content:e}}=t,s=new Set;Array.from(e.querySelectorAll("style")).forEach((t=>{s.add(t)})),g(t,s)}))}))})(t);const r=i.content;s?function(t,e,s=null){const{element:{content:i},parts:o}=t;if(null==s)return void i.appendChild(e);const a=document.createTreeWalker(i,133,null,!1);let n=m(o),r=0,h=-1;for(;a.nextNode();)for(h++,a.currentNode===s&&(r=u(e),s.parentNode.insertBefore(e,s));-1!==n&&o[n].index===h;){if(r>0){for(;-1!==n;)o[n].index+=r,n=m(o,n);return}n=m(o,n)}}(s,n,r.firstChild):r.insertBefore(n,r.firstChild),window.ShadyCSS.prepareTemplateStyles(i,t);const h=r.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==h)e.insertBefore(h.cloneNode(!0),e.firstChild);else if(s){r.insertBefore(n,r.firstChild);const t=new Set;t.add(n),g(s,t)}};window.JSCompiler_renameProperty=(t,e)=>t;const J={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},Y=(t,e)=>e!==t&&(e==e||t==t),X={attribute:!0,type:String,converter:J,reflect:!1,hasChanged:Y},Z="finalized";class K extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach(((e,s)=>{const i=this._attributeNameForProperty(s,e);void 0!==i&&(this._attributeToPropertyMap.set(i,s),t.push(i))})),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach(((t,e)=>this._classProperties.set(e,t)))}}static createProperty(t,e=X){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const s="symbol"==typeof t?Symbol():`__${t}`,i=this.getPropertyDescriptor(t,s,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}static getPropertyDescriptor(t,e,s){return{get(){return this[e]},set(i){const o=this[t];this[e]=i,this.requestUpdateInternal(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||X}static finalize(){const t=Object.getPrototypeOf(this);if(t.hasOwnProperty(Z)||t.finalize(),this[Z]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const s of e)this.createProperty(s,t[s])}}static _attributeNameForProperty(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,s=Y){return s(t,e)}static _propertyValueFromAttribute(t,e){const s=e.type,i=e.converter||J,o="function"==typeof i?i:i.fromAttribute;return o?o(t,s):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const s=e.type,i=e.converter;return(i&&i.toAttribute||J.toAttribute)(t,s)}initialize(){this._updateState=0,this._updatePromise=new Promise((t=>this._enableUpdatingResolver=t)),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach(((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}}))}_applyInstanceProperties(){this._instanceProperties.forEach(((t,e)=>this[e]=t)),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,s){e!==s&&this._attributeToProperty(t,s)}_propertyToAttribute(t,e,s=X){const i=this.constructor,o=i._attributeNameForProperty(t,s);if(void 0!==o){const t=i._propertyValueToAttribute(e,s);if(void 0===t)return;this._updateState=8|this._updateState,null==t?this.removeAttribute(o):this.setAttribute(o,t),this._updateState=-9&this._updateState}}_attributeToProperty(t,e){if(8&this._updateState)return;const s=this.constructor,i=s._attributeToPropertyMap.get(t);if(void 0!==i){const t=s.getPropertyOptions(i);this._updateState=16|this._updateState,this[i]=s._propertyValueFromAttribute(e,t),this._updateState=-17&this._updateState}}requestUpdateInternal(t,e,s){let i=!0;if(void 0!==t){const o=this.constructor;s=s||o.getPropertyOptions(t),o._valueHasChanged(this[t],e,s.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==s.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,s))):i=!1}!this._hasRequestedUpdate&&i&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(It){}const t=this.performUpdate();return null!=t&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(It){throw t=!1,this._markUpdated(),It}t&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach(((t,e)=>this._propertyToAttribute(e,this[e],t))),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}}K[Z]=!0;
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const Q=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,tt=Symbol();class et{constructor(t,e){if(e!==tt)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(Q?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const st=t=>new et(String(t),tt),it=(t,...e)=>{const s=e.reduce(((e,s,i)=>e+(t=>{if(t instanceof et)return t.cssText;if("number"==typeof t)return t;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(s)+t[i+1]),t[0]);return new et(s,tt)};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");const ot={};class at extends K{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const t=this.getStyles();if(Array.isArray(t)){const e=(t,s)=>t.reduceRight(((t,s)=>Array.isArray(s)?e(s,t):(t.add(s),t)),s),s=e(t,new Set),i=[];s.forEach((t=>i.unshift(t))),this._styles=i}else this._styles=void 0===t?[]:[t];this._styles=this._styles.map((t=>{if(t instanceof CSSStyleSheet&&!Q){const e=Array.prototype.slice.call(t.cssRules).reduce(((t,e)=>t+e.cssText),"");return st(e)}return t}))}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?Q?this.renderRoot.adoptedStyleSheets=t.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map((t=>t.cssText)),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){const e=this.render();super.update(t),e!==ot&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach((t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)})))}render(){return ot}}at.finalized=!0,at.render=(t,e,i)=>{if(!i||"object"!=typeof i||!i.scopeName)throw new Error("The `scopeName` option is required.");const o=i.scopeName,a=L.has(e),n=j&&11===e.nodeType&&!!e.host,r=n&&!G.has(o),h=r?document.createDocumentFragment():e;if(((t,e,i)=>{let o=L.get(e);void 0===o&&(s(e,e.firstChild),L.set(e,o=new I(Object.assign({templateFactory:O},i))),o.appendInto(e)),o.setValue(t),o.commit()})(t,h,Object.assign({templateFactory:q(o)},i)),r){const t=L.get(h);L.delete(h);const i=t.value instanceof b?t.value.template:void 0;W(o,h,i),s(e,e.firstChild),e.appendChild(h),L.set(e,t)}!a&&n&&window.ShadyCSS.styleElement(e.host)},at.shadowRootOptions={mode:"open"};
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const nt=new WeakMap,rt=v((t=>e=>{if(!(e instanceof T)||e instanceof V||"style"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `styleMap` directive must be used in the style attribute and must be the only part in the attribute.");const{committer:s}=e,{style:i}=s.element;let o=nt.get(e);void 0===o&&(i.cssText=s.strings.join(" "),nt.set(e,o=new Set)),o.forEach((e=>{e in t||(o.delete(e),-1===e.indexOf("-")?i[e]=null:i.removeProperty(e))}));for(const a in t)o.add(a),-1===a.indexOf("-")?i[a]=t[a]:i.setProperty(a,t[a])})),ht=new WeakMap,lt=window.navigator.userAgent.indexOf("Trident/")>0,ct=v((t=>s=>{if(!(s instanceof I))throw new Error("unsafeSVG can only be used in text bindings");const i=ht.get(s);if(void 0!==i&&k(t)&&t===i.value&&s.value===i.fragment)return;const o=document.createElement("template"),a=o.content;let n;lt?(o.innerHTML=`<svg>${t}</svg>`,n=a.firstChild):(n=document.createElementNS("http://www.w3.org/2000/svg","svg"),a.appendChild(n),n.innerHTML=t),a.removeChild(n),e(a,n.firstChild);const r=document.importNode(a,!0);s.setValue(r),ht.set(s,{value:t,fragment:r})})),dt=new WeakMap,gt=v((t=>e=>{const s=dt.get(e);if(void 0===t&&e instanceof T){if(void 0!==s||!dt.has(e)){const t=e.committer.name;e.committer.element.removeAttribute(t)}}else t!==s&&e.setValue(t);dt.set(e,t)}));var ut=function(){return ut=Object.assign||function(t){for(var e,s=1,i=arguments.length;s<i;s++)for(var o in e=arguments[s])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t},ut.apply(this,arguments)};var mt={second:45,minute:45,hour:22,day:5},pt="2.4.5";const vt=400,ft=200,yt=vt,_t=(t,e,s)=>t<0||s<0?e+360:e,bt=(t,e)=>Math.abs(t-e);class xt{static mergeDeep(...t){const e=t=>t&&"object"==typeof t;return t.reduce(((t,s)=>(Object.keys(s).forEach((i=>{const o=t[i],a=s[i];Array.isArray(o)&&Array.isArray(a)?t[i]=o.concat(...a):e(o)&&e(a)?t[i]=this.mergeDeep(o,a):t[i]=a})),t)),{})}}class wt{static calculateValueBetween(t,e,s){return isNaN(s)?0:s?(Math.min(Math.max(s,t),e)-t)/(e-t):0}static calculateSvgCoordinate(t,e){return t/100*vt+(e-ft)}static calculateSvgDimension(t){return t/100*vt}static getLovelace(){let t=window.document.querySelector("home-assistant");if(t=t&&t.shadowRoot,t=t&&t.querySelector("home-assistant-main"),t=t&&t.shadowRoot,t=t&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),t=t&&t.shadowRoot||t,t=t&&t.querySelector("ha-panel-lovelace"),t=t&&t.shadowRoot,t=t&&t.querySelector("hui-root"),t){const e=t.lovelace;return e.current_view=t.___curView,e}return null}}class St{static replaceVariables3(t,e){if(!t&&!e.template.defaults)return e[e.template.type];let s=t?.slice(0)??[];e.template.defaults&&(s=s.concat(e.template.defaults));let i=JSON.stringify(e[e.template.type]);return s.forEach((t=>{const e=Object.keys(t)[0],s=Object.values(t)[0];if("number"==typeof s||"boolean"==typeof s){const t=new RegExp(`"\\[\\[${e}\\]\\]"`,"gm");i=i.replace(t,s)}if("object"==typeof s){const t=new RegExp(`"\\[\\[${e}\\]\\]"`,"gm"),o=JSON.stringify(s);i=i.replace(t,o)}else{const t=new RegExp(`\\[\\[${e}\\]\\]`,"gm");i=i.replace(t,s)}})),JSON.parse(i)}static getJsTemplateOrValueConfig(t,e){if(!e)return e;if(["number","boolean","bigint","symbol"].includes(typeof e))return e;if("object"==typeof e)return Object.keys(e).forEach((s=>{e[s]=St.getJsTemplateOrValueConfig(t,e[s])})),e;const s=e.trim();return"[[[["===s.substring(0,4)&&"]]]]"===s.slice(-4)?St.evaluateJsTemplateConfig(t,s.slice(4,-4)):e}static evaluateJsTemplateConfig(t,e){try{return new Function("tool_config",`'use strict'; ${e}`).call(this,t)}catch(It){throw It.name="Sak-evaluateJsTemplateConfig-Error",It}}static evaluateJsTemplate(t,e,s){try{return new Function("state","states","entity","user","hass","tool_config","entity_config",`'use strict'; ${s}`).call(this,e,t._card._hass.states,t.config.hasOwnProperty("entity_index")?t._card.entities[t.config.entity_index]:void 0,t._card._hass.user,t._card._hass,t.config,t.config.hasOwnProperty("entity_index")?t._card.config.entities[t.config.entity_index]:void 0)}catch(It){throw It.name="Sak-evaluateJsTemplate-Error",It}}static getJsTemplateOrValue(t,e,s){if(!s)return s;if(["number","boolean","bigint","symbol"].includes(typeof s))return s;if("object"==typeof s)return Object.keys(s).forEach((i=>{s[i]=St.getJsTemplateOrValue(t,e,s[i])})),s;const i=s.trim();return"[[["===i.substring(0,3)&&"]]]"===i.slice(-3)?St.evaluateJsTemplate(t,e,i.slice(3,-3)):s}}
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */class $t{constructor(t){this.classes=new Set,this.changed=!1,this.element=t;const e=(t.getAttribute("class")||"").split(/\s+/);for(const s of e)this.classes.add(s)}add(t){this.classes.add(t),this.changed=!0}remove(t){this.classes.delete(t),this.changed=!0}commit(){if(this.changed){let t="";this.classes.forEach((e=>t+=e+" ")),this.element.setAttribute("class",t)}}}const kt=new WeakMap,Et=v((t=>e=>{if(!(e instanceof T)||e instanceof V||"class"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `classMap` directive must be used in the `class` attribute and must be the only part in the attribute.");const{committer:s}=e,{element:i}=s;let o=kt.get(e);void 0===o&&(i.setAttribute("class",s.strings.join(" ")),kt.set(e,o=new Set));const a=i.classList||new $t(i);o.forEach((e=>{e in t||(a.remove(e),o.delete(e))}));for(const n in t){const e=t[n];e!=o.has(n)&&(e?(a.add(n),o.add(n)):(a.remove(n),o.delete(n)))}"function"==typeof a.commit&&a.commit()}));var Ct,Tt,It;(It=Ct||(Ct={})).language="language",It.system="system",It.comma_decimal="comma_decimal",It.decimal_comma="decimal_comma",It.space_comma="space_comma",It.none="none",function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Tt||(Tt={})),new Set(["fan","input_boolean","light","switch","group","automation"]);var At=function(t,e,s,i){i=i||{},s=null==s?{}:s;var o=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return o.detail=s,t.dispatchEvent(o),o};new Set(["call-service","divider","section","weblink","cast","select"]);var Mt={alert:"mdi:alert",automation:"mdi:playlist-play",calendar:"mdi:calendar",camera:"mdi:video",climate:"mdi:thermostat",configurator:"mdi:settings",conversation:"mdi:text-to-speech",device_tracker:"mdi:account",fan:"mdi:fan",group:"mdi:google-circles-communities",history_graph:"mdi:chart-line",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_boolean:"mdi:drawing",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",person:"mdi:account",plant:"mdi:flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:google-pages",script:"mdi:file-document",sensor:"mdi:eye",simple_alarm:"mdi:bell",sun:"mdi:white-balance-sunny",switch:"mdi:flash",timer:"mdi:timer",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",water_heater:"mdi:thermometer",weblink:"mdi:open-in-new"};function Vt(t,e){if(t in Mt)return Mt[t];switch(t){case"alarm_control_panel":switch(e){case"armed_home":return"mdi:bell-plus";case"armed_night":return"mdi:bell-sleep";case"disarmed":return"mdi:bell-outline";case"triggered":return"mdi:bell-ring";default:return"mdi:bell"}case"binary_sensor":return e&&"off"===e?"mdi:radiobox-blank":"mdi:checkbox-marked-circle";case"cover":return"closed"===e?"mdi:window-closed":"mdi:window-open";case"lock":return e&&"unlocked"===e?"mdi:lock-open":"mdi:lock";case"media_player":return e&&"off"!==e&&"idle"!==e?"mdi:cast-connected":"mdi:cast";case"zwave":switch(e){case"dead":return"mdi:emoticon-dead";case"sleeping":return"mdi:sleep";case"initializing":return"mdi:timer-sand";default:return"mdi:z-wave"}default:return console.warn("Unable to find icon for domain "+t+" ("+e+")"),"mdi:bookmark"}}var Nt={humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",temperature:"mdi:thermometer",pressure:"mdi:gauge",power:"mdi:flash",signal_strength:"mdi:wifi"},Pt={binary_sensor:function(t,e){var s="off"===t;switch(null==e?void 0:e.attributes.device_class){case"battery":return s?"mdi:battery":"mdi:battery-outline";case"battery_charging":return s?"mdi:battery":"mdi:battery-charging";case"cold":return s?"mdi:thermometer":"mdi:snowflake";case"connectivity":return s?"mdi:server-network-off":"mdi:server-network";case"door":return s?"mdi:door-closed":"mdi:door-open";case"garage_door":return s?"mdi:garage":"mdi:garage-open";case"power":case"plug":return s?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return s?"mdi:check-circle":"mdi:alert-circle";case"smoke":return s?"mdi:check-circle":"mdi:smoke";case"heat":return s?"mdi:thermometer":"mdi:fire";case"light":return s?"mdi:brightness-5":"mdi:brightness-7";case"lock":return s?"mdi:lock":"mdi:lock-open";case"moisture":return s?"mdi:water-off":"mdi:water";case"motion":return s?"mdi:walk":"mdi:run";case"occupancy":case"presence":return s?"mdi:home-outline":"mdi:home";case"opening":return s?"mdi:square":"mdi:square-outline";case"running":return s?"mdi:stop":"mdi:play";case"sound":return s?"mdi:music-note-off":"mdi:music-note";case"update":return s?"mdi:package":"mdi:package-up";case"vibration":return s?"mdi:crop-portrait":"mdi:vibrate";case"window":return s?"mdi:window-closed":"mdi:window-open";default:return s?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}},cover:function(t){var e="closed"!==t.state;switch(t.attributes.device_class){case"garage":return e?"mdi:garage-open":"mdi:garage";case"door":return e?"mdi:door-open":"mdi:door-closed";case"shutter":return e?"mdi:window-shutter-open":"mdi:window-shutter";case"blind":return e?"mdi:blinds-open":"mdi:blinds";case"window":return e?"mdi:window-open":"mdi:window-closed";default:return Vt("cover",t.state)}},sensor:function(t){var e=t.attributes.device_class;if(e&&e in Nt)return Nt[e];if("battery"===e){var s=Number(t.state);if(isNaN(s))return"mdi:battery-unknown";var i=10*Math.round(s/10);return i>=100?"mdi:battery":i<=0?"mdi:battery-alert":"hass:battery-"+i}var o=t.attributes.unit_of_measurement;return"°C"===o||"°F"===o?"mdi:thermometer":Vt("sensor")},input_datetime:function(t){return t.attributes.has_date?t.attributes.has_time?Vt("input_datetime"):"mdi:calendar":"mdi:clock"}};class Dt{static{Dt.colorCache={},Dt.element=void 0}static _prefixKeys(t){let e={};return Object.keys(t).forEach((s=>{const i=`--${s}`,o=String(t[s]);e[i]=`${o}`})),e}static processTheme(t){let e={},s={},i={},o={};const{modes:a,...n}=t;return a&&(s={...n,...a.dark},e={...n,...a.light}),i=Dt._prefixKeys(e),o=Dt._prefixKeys(s),{themeLight:i,themeDark:o}}static processPalette(t){let e={},s={},i={},o={},a={};return Object.values(t).forEach((t=>{const{modes:o,...a}=t;e={...e,...a},o&&(i={...i,...a,...o.dark},s={...s,...a,...o.light})})),o=Dt._prefixKeys(s),a=Dt._prefixKeys(i),{paletteLight:o,paletteDark:a}}static setElement(t){Dt.element=t}static calculateColor(t,e,s){const i=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let o,a,n;const r=i.length;if(t<=i[0])return e[i[0]];if(t>=i[r-1])return e[i[r-1]];for(let h=0;h<r-1;h++){const r=i[h],l=i[h+1];if(t>=r&&t<l){if([o,a]=[e[r],e[l]],!s)return o;n=Dt.calculateValueBetween(r,l,t);break}}return Dt.getGradientValue(o,a,n)}static calculateColor2(t,e,s,i,o){const a=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let n,r,h;const l=a.length;if(t<=a[0])return e[a[0]];if(t>=a[l-1])return e[a[l-1]];for(let c=0;c<l-1;c++){const l=a[c],d=a[c+1];if(t>=l&&t<d){if([n,r]=[e[l].styles[s][i],e[d].styles[s][i]],!o)return n;h=Dt.calculateValueBetween(l,d,t);break}}return Dt.getGradientValue(n,r,h)}static calculateValueBetween(t,e,s){return(Math.min(Math.max(s,t),e)-t)/(e-t)}static getColorVariable(t){const e=t.substr(4,t.length-5);return window.getComputedStyle(Dt.element).getPropertyValue(e)}static getGradientValue(t,e,s){const i=Dt.colorToRGBA(t),o=Dt.colorToRGBA(e),a=1-s,n=s,r=Math.floor(i[0]*a+o[0]*n),h=Math.floor(i[1]*a+o[1]*n),l=Math.floor(i[2]*a+o[2]*n),c=Math.floor(i[3]*a+o[3]*n);return`#${Dt.padZero(r.toString(16))}${Dt.padZero(h.toString(16))}${Dt.padZero(l.toString(16))}${Dt.padZero(c.toString(16))}`}static padZero(t){return t.length<2&&(t=`0${t}`),t.substr(0,2)}static colorToRGBA(t){const e=Dt.colorCache[t];if(e)return e;let s=t;"var"===t.substr(0,3).valueOf()&&(s=Dt.getColorVariable(t));const i=window.document.createElement("canvas");i.width=i.height=1;const o=i.getContext("2d");o.clearRect(0,0,1,1),o.fillStyle=s,o.fillRect(0,0,1,1);const a=[...o.getImageData(0,0,1,1).data];return Dt.colorCache[t]=a,a}}class Ot{constructor(t,e,s){this.toolId=Math.random().toString(36).substr(2,9),this.toolset=t,this._card=this.toolset._card,this.config=e,this.dev={...this._card.dev},this.toolsetPos=s,this.svg={},this.svg.cx=wt.calculateSvgCoordinate(e.position.cx,0),this.svg.cy=wt.calculateSvgCoordinate(e.position.cy,0),this.svg.height=e.position.height?wt.calculateSvgDimension(e.position.height):0,this.svg.width=e.position.width?wt.calculateSvgDimension(e.position.width):0,this.svg.x=this.svg.cx-this.svg.width/2,this.svg.y=this.svg.cy-this.svg.height/2,this.classes={},this.classes.card={},this.classes.toolset={},this.classes.tool={},this.styles={},this.styles.card={},this.styles.toolset={},this.styles.tool={},this.animationClass={},this.animationClassHasChanged=!0,this.animationStyle={},this.animationStyleHasChanged=!0,this.config?.show?.style||(this.config.show||(this.config.show={}),this.config.show.style="default"),this.colorStops={},this.config.colorstops&&this.config.colorstops.colors&&Object.keys(this.config.colorstops.colors).forEach((t=>{this.colorStops[t]=this.config.colorstops.colors[t]})),"colorstop"===this.config.show.style&&this.config?.colorstops.colors&&(this.sortedColorStops=Object.keys(this.config.colorstops.colors).map((t=>Number(t))).sort(((t,e)=>t-e))),this.csnew={},this.config.csnew&&this.config.csnew.colors&&(this.config.csnew.colors.forEach(((t,e)=>{this.csnew[t.stop]=this.config.csnew.colors[e]})),this.sortedcsnew=Object.keys(this.csnew).map((t=>Number(t))).sort(((t,e)=>t-e)))}textEllipsis(t,e){return e&&e<t.length?t.slice(0,e-1).concat("..."):t}defaultEntityIndex(){return this.default||(this.default={},this.config.hasOwnProperty("entity_indexes")?this.default.entity_index=this.config.entity_indexes[0].entity_index:this.default.entity_index=this.config.entity_index),this.default.entity_index}set value(t){let e=t;if(this.dev.debug&&console.log("BaseTool set value(state)",e),void 0!==e&&this._stateValue?.toLowerCase()===e.toLowerCase())return;this.derivedEntity=null,this.config.derived_entity&&(this.derivedEntity=St.getJsTemplateOrValue(this,t,xt.mergeDeep(this.config.derived_entity)),e=this.derivedEntity.state?.toString()),this._stateValuePrev=this._stateValue||e,this._stateValue=e,this._stateValueIsDirty=!0;let s=!1;this.activeAnimation=null,this.config.animations&&Object.keys(this.config.animations).map((t=>{const e=JSON.parse(JSON.stringify(this.config.animations[t])),i=St.getJsTemplateOrValue(this,this._stateValue,xt.mergeDeep(e));if(s)return!0;"unavailable"===i.state&&(i.state="-ua-");switch(i.operator?i.operator:"=="){case"==":s=void 0===this._stateValue?void 0===i.state||"undefined"===i.state.toLowerCase():this._stateValue.toLowerCase()===i.state.toLowerCase();break;case"!=":s=void 0===this._stateValue?"undefined"!==i.state.toLowerCase():this._stateValue.toLowerCase()!==i.state.toLowerCase();break;case">":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())>Number(i.state.toLowerCase()));break;case"<":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())<Number(i.state.toLowerCase()));break;case">=":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())>=Number(i.state.toLowerCase()));break;case"<=":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())<=Number(i.state.toLowerCase()));break;default:s=!1}return"-ua-"===i.state&&(i.state="unavailable"),this.dev.debug&&console.log("BaseTool, animation, match, value, config, operator",s,this._stateValue,i.state,i.operator),!s||(this.animationClass&&i.reuse||(this.animationClass={}),i.classes&&(this.animationClass=xt.mergeDeep(this.animationClass,i.classes)),this.animationStyle&&i.reuse||(this.animationStyle={}),i.styles&&(this.animationStyle=xt.mergeDeep(this.animationStyle,i.styles)),this.animationStyleHasChanged=!0,this.item=i,this.activeAnimation=i,s)}))}getEntityIndexFromAnimation(t){return t.hasOwnProperty("entity_index")?t.entity_index:this.config.hasOwnProperty("entity_index")?this.config.entity_index:this.config.entity_indexes?this.config.entity_indexes[0].entity_index:void 0}getIndexInEntityIndexes(t){return this.config.entity_indexes.findIndex((e=>e.entity_index===t))}stateIsMatch(t,e){let s;const i=JSON.parse(JSON.stringify(t)),o=St.getJsTemplateOrValue(this,e,xt.mergeDeep(i));switch(o.operator?o.operator:"=="){case"==":s=void 0===e?void 0===o.state||"undefined"===o.state.toLowerCase():e.toLowerCase()===o.state.toLowerCase();break;case"!=":s=void 0===e?void 0!==o.state||"undefined"!==o.state.toLowerCase():e.toLowerCase()!==o.state.toLowerCase();break;case">":void 0!==e&&(s=Number(e.toLowerCase())>Number(o.state.toLowerCase()));break;case"<":void 0!==e&&(s=Number(e.toLowerCase())<Number(o.state.toLowerCase()));break;case">=":void 0!==e&&(s=Number(e.toLowerCase())>=Number(o.state.toLowerCase()));break;case"<=":void 0!==e&&(s=Number(e.toLowerCase())<=Number(o.state.toLowerCase()));break;default:s=!1}return s}mergeAnimationData(t){this.animationClass&&t.reuse||(this.animationClass={}),t.classes&&(this.animationClass=xt.mergeDeep(this.animationClass,t.classes)),this.animationStyle&&t.reuse||(this.animationStyle={}),t.styles&&(this.animationStyle=xt.mergeDeep(this.animationStyle,t.styles)),this.animationStyleHasChanged=!0,this.item||(this.item={}),this.item=xt.mergeDeep(this.item,t),this.activeAnimation={...t}}set values(t){this._lastStateValues||(this._lastStateValues=[]),this._stateValues||(this._stateValues=[]);const e=[...t];this.dev.debug&&console.log("BaseTool set values(state)",e);for(let s=0;s<t.length;++s){void 0!==e[s]&&(this._stateValues[s]?.toLowerCase()===e[s].toLowerCase()||this.config.derived_entities&&(this.derivedEntities[s]=St.getJsTemplateOrValue(this,t[s],xt.mergeDeep(this.config.derived_entities[s])),e[s]=this.derivedEntities[s].state?.toString())),this._lastStateValues[s]=this._stateValues[s]||e[s],this._stateValues[s]=e[s],this._stateValueIsDirty=!0;let i=!1;this.activeAnimation=null,this.config.animations&&Object.keys(this.config.animations.map(((e,s)=>{const o=this.getIndexInEntityIndexes(this.getEntityIndexFromAnimation(e));return i=this.stateIsMatch(e,t[o]),!!i&&(this.mergeAnimationData(e),!0)})))}this._stateValue=this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())],this._stateValuePrev=this._lastStateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]}EnableHoverForInteraction(){const t=this.config.hasOwnProperty("entity_index")||this.config?.user_actions?.tap_action;this.classes.tool.hover=!!t}MergeAnimationStyleIfChanged(t){this.animationStyleHasChanged&&(this.animationStyleHasChanged=!1,this.styles=t?xt.mergeDeep(t,this.config.styles,this.animationStyle):xt.mergeDeep(this.config.styles,this.animationStyle),this.styles.card&&0!==Object.keys(this.styles.card).length&&(this._card.styles.card=xt.mergeDeep(this.styles.card)))}MergeAnimationClassIfChanged(t){this.animationClassHasChanged=!0,this.animationClassHasChanged&&(this.animationClassHasChanged=!1,this.classes=t?xt.mergeDeep(t,this.config.classes,this.animationClass):xt.mergeDeep(this.config.classes,this.animationClass))}MergeColorFromState(t){if(this.config.hasOwnProperty("entity_index")){const e=this.getColorFromState(this._stateValue);""!==e&&(t.fill=this.config[this.config.show.style].fill?e:"",t.stroke=this.config[this.config.show.style].stroke?e:"")}}MergeColorFromState2(t,e){if(this.config.hasOwnProperty("entity_index")){const s=this.config[this.config.show.style].fill?this.getColorFromState2(this._stateValue,e,"fill"):"",i=this.config[this.config.show.style].stroke?this.getColorFromState2(this._stateValue,e,"stroke"):"";""!==s&&(t.fill=s),""!==i&&(t.stroke=i)}}getColorFromState(t){let e="";switch(this.config.show.style){case"default":break;case"fixedcolor":e=this.config.color;break;case"colorstop":case"colorstops":case"colorstopgradient":e=Dt.calculateColor(t,this.colorStops,"colorstopgradient"===this.config.show.style);break;case"minmaxgradient":e=Dt.calculateColor(t,this.colorStopsMinMax,!0)}return e}getColorFromState2(t,e,s){let i="";switch(this.config.show.style){case"colorstop":case"colorstops":case"colorstopgradient":i=Dt.calculateColor2(t,this.csnew,e,s,"colorstopgradient"===this.config.show.style);break;case"minmaxgradient":i=Dt.calculateColor2(t,this.colorStopsMinMax,e,s,!0)}return i}_processTapEvent(t,e,s,i,o,a){let n;if(i){At(t,"haptic",i.haptic||"medium"),this.dev.debug&&console.log("_processTapEvent",s,i,o,a);for(let s=0;s<i.actions.length;s++)switch(i.actions[s].action){case"more-info":void 0!==o&&(n=new Event("hass-more-info",{composed:!0}),n.detail={entityId:o},t.dispatchEvent(n));break;case"navigate":if(!i.actions[s].navigation_path)return;window.history.pushState(null,"",i.actions[s].navigation_path),n=new Event("location-changed",{composed:!0}),n.detail={replace:!1},window.dispatchEvent(n);break;case"call-service":{if(!i.actions[s].service)return;const[t,n]=i.actions[s].service.split(".",2),r={...i.actions[s].service_data};r.entity_id||(r.entity_id=o),i.actions[s].parameter&&(r[i.actions[s].parameter]=a),e.callService(t,n,r);break}case"fire-dom-event":{const e={...i.actions[s]};n=new Event("ll-custom",{composed:!0,bubbles:!0}),n.detail=e,t.dispatchEvent(n);break}default:console.error("Unknown Event definition",i)}}}handleTapEvent(t,e){let s;t.stopPropagation(),t.preventDefault();let i=this.defaultEntityIndex();s=void 0===i||e.user_actions?e.user_actions?.tap_action:{haptic:"light",actions:[{action:"more-info"}]},s&&this._processTapEvent(this._card,this._card._hass,this.config,s,this._card.config.hasOwnProperty("entities")?this._card.config.entities[i]?.entity:void 0,void 0)}}class Rt extends Ot{constructor(t,e,s){super(t,xt.mergeDeep({position:{cx:50,cy:50,width:100,height:25,radius:5,ratio:30,divider:30},classes:{tool:{"sak-badge":!0,hover:!0},left:{"sak-badge__left":!0},right:{"sak-badge__right":!0}},styles:{tool:{},left:{},right:{}}},e),s),this.svg.radius=wt.calculateSvgDimension(e.position.radius),this.svg.leftXpos=this.svg.x,this.svg.leftYpos=this.svg.y,this.svg.leftWidth=this.config.position.ratio/100*this.svg.width,this.svg.arrowSize=this.svg.height*this.config.position.divider/100/2,this.svg.divSize=this.svg.height*(100-this.config.position.divider)/100/2,this.svg.rightXpos=this.svg.x+this.svg.leftWidth,this.svg.rightYpos=this.svg.y,this.svg.rightWidth=(100-this.config.position.ratio)/100*this.svg.width,this.classes.tool={},this.classes.left={},this.classes.right={},this.styles.tool={},this.styles.left={},this.styles.right={},this.dev.debug&&console.log("BadgeTool constructor coords, dimensions",this.svg,this.config)}_renderBadge(){let t=[];return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),t=F`
      <g  id="badge-${this.toolId}">
        <path class="${Et(this.classes.right)}" d="
            M ${this.svg.rightXpos} ${this.svg.rightYpos}
            h ${this.svg.rightWidth-this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 ${this.svg.radius} ${this.svg.radius}
            v ${this.svg.height-2*this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 -${this.svg.radius} ${this.svg.radius}
            h -${this.svg.rightWidth-this.svg.radius}
            v -${this.svg.height-2*this.svg.radius}
            z
            "
            style="${rt(this.styles.right)}"/>

        <path class="${Et(this.classes.left)}" d="
            M ${this.svg.leftXpos+this.svg.radius} ${this.svg.leftYpos}
            h ${this.svg.leftWidth-this.svg.radius}
            v ${this.svg.divSize}
            l ${this.svg.arrowSize} ${this.svg.arrowSize}
            l -${this.svg.arrowSize} ${this.svg.arrowSize}
            l 0 ${this.svg.divSize}
            h -${this.svg.leftWidth-this.svg.radius}
            a -${this.svg.radius} -${this.svg.radius} 0 0 1 -${this.svg.radius} -${this.svg.radius}
            v -${this.svg.height-2*this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 ${this.svg.radius} -${this.svg.radius}
            "
            style="${rt(this.styles.left)}"/>
      </g>
      `,F`${t}`}render(){return F`
      <g id="badge-${this.toolId}"
        class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderBadge()}
      </g>
    `}}class Lt extends Ot{constructor(t,e,s){super(t,xt.mergeDeep({position:{cx:50,cy:50,radius:50},classes:{tool:{"sak-circle":!0,hover:!0},circle:{"sak-circle__circle":!0}},styles:{tool:{},circle:{}}},e),s),this.EnableHoverForInteraction(),this.svg.radius=wt.calculateSvgDimension(e.position.radius),this.classes.tool={},this.classes.circle={},this.styles.tool={},this.styles.circle={},this.dev.debug&&console.log("CircleTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderCircle(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.circle),F`
      <circle class="${Et(this.classes.circle)}"
        cx="${this.svg.cx}"% cy="${this.svg.cy}"% r="${this.svg.radius}"
        style="${rt(this.styles.circle)}"
      </circle>

      `}render(){return this.styles.tool.overflow="visible",this.styles["transform-origin"]=`${this.svg.cx} ${this.svg.cy}`,F`
      <g "" id="circle-${this.toolId}"
        class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderCircle()}
      </g>
    `}}class zt extends Ot{constructor(t,e,s){switch(super(t,xt.mergeDeep({position:{cx:50,cy:50,radius:45,start_angle:30,end_angle:230,track:{width:2},active:{width:4},thumb:{height:10,width:10,radius:5},capture:{height:25,width:25,radius:25},label:{placement:"none",cx:10,cy:10}},show:{uom:"end",active:!1},classes:{tool:{"sak-circslider":!0,hover:!0},capture:{"sak-circslider__capture":!0,hover:!0},active:{"sak-circslider__active":!0},track:{"sak-circslider__track":!0},thumb:{"sak-circslider__thumb":!0,hover:!0},label:{"sak-circslider__value":!0},uom:{"sak-circslider__uom":!0}},styles:{tool:{},active:{},capture:{},track:{},thumb:{},label:{},uom:{}},scale:{min:0,max:100,step:1}},e),s),this.svg.radius=wt.calculateSvgDimension(this.config.position.radius),this.arc={},this.arc.startAngle=this.config.position.start_angle,this.arc.endAngle=this.config.position.end_angle,this.arc.size=bt(this.config.position.end_angle,this.config.position.start_angle),this.arc.clockwise=this.config.position.end_angle>this.config.position.start_angle,this.arc.direction=this.arc.clockwise?1:-1,this.arc.pathLength=2*this.arc.size/360*Math.PI*this.svg.radius,this.arc.arcLength=2*Math.PI*this.svg.radius,this.arc.startAngle360=_t(this.arc.startAngle,this.arc.startAngle,this.arc.endAngle),this.arc.endAngle360=_t(this.arc.startAngle,this.arc.endAngle,this.arc.endAngle),this.arc.startAngleSvgPoint=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,this.arc.startAngle360),this.arc.endAngleSvgPoint=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,this.arc.endAngle360),this.arc.scaleDasharray=2*this.arc.size/360*Math.PI*this.svg.radius,this.arc.dashOffset=this.arc.clockwise?0:-this.arc.scaleDasharray-this.arc.arcLength,this.arc.currentAngle=this.arc.startAngle,this.svg.startAngle=this.config.position.start_angle,this.svg.endAngle=this.config.position.end_angle,this.svg.diffAngle=this.config.position.end_angle-this.config.position.start_angle,this.svg.pathLength=2*this.arc.size/360*Math.PI*this.svg.radius,this.svg.circleLength=2*Math.PI*this.svg.radius,this.svg.label={},this.config.position.label.placement){case"position":this.svg.label.cx=wt.calculateSvgCoordinate(this.config.position.label.cx,0),this.svg.label.cy=wt.calculateSvgCoordinate(this.config.position.label.cy,0);break;case"thumb":this.svg.label.cx=this.svg.cx,this.svg.label.cy=this.svg.cy;break;case"none":break;default:throw console.error("CircularSliderTool - constructor: invalid label placement [none, position, thumb] = ",this.config.position.label.placement),Error("CircularSliderTool::constructor - invalid label placement [none, position, thumb] = ",this.config.position.label.placement)}this.svg.track={},this.svg.track.width=wt.calculateSvgDimension(this.config.position.track.width),this.svg.active={},this.svg.active.width=wt.calculateSvgDimension(this.config.position.active.width),this.svg.thumb={},this.svg.thumb.width=wt.calculateSvgDimension(this.config.position.thumb.width),this.svg.thumb.height=wt.calculateSvgDimension(this.config.position.thumb.height),this.svg.thumb.radius=wt.calculateSvgDimension(this.config.position.thumb.radius),this.svg.thumb.cx=this.svg.cx,this.svg.thumb.cy=this.svg.cy,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2,this.svg.capture={},this.svg.capture.width=wt.calculateSvgDimension(Math.max(this.config.position.capture.width,1.2*this.config.position.thumb.width)),this.svg.capture.height=wt.calculateSvgDimension(Math.max(this.config.position.capture.height,1.2*this.config.position.thumb.height)),this.svg.capture.radius=wt.calculateSvgDimension(this.config.position.capture.radius),this.svg.capture.x1=this.svg.cx-this.svg.capture.width/2,this.svg.capture.y1=this.svg.cy-this.svg.capture.height/2,this.svg.rotate={},this.svg.rotate.degrees=this.arc.clockwise?-90+this.arc.startAngle:this.arc.endAngle360-90,this.svg.rotate.cx=this.svg.cx,this.svg.rotate.cy=this.svg.cy,this.classes.track={},this.classes.active={},this.classes.thumb={},this.classes.label={},this.classes.uom={},this.styles.track={},this.styles.active={},this.styles.thumb={},this.styles.label={},this.styles.uom={},this.svg.scale={},this.svg.scale.min=this.config.scale.min,this.svg.scale.max=this.config.scale.max,this.svg.scale.center=Math.abs(this.svg.scale.max-this.svg.scale.min)/2+this.svg.scale.min,this.svg.scale.svgPointMin=this.sliderValueToPoint(this.svg.scale.min),this.svg.scale.svgPointMax=this.sliderValueToPoint(this.svg.scale.max),this.svg.scale.svgPointCenter=this.sliderValueToPoint(this.svg.scale.center),this.svg.scale.step=this.config.scale.step,this.rid=null,this.thumbPos=this.sliderValueToPoint(this.config.scale.min),this.svg.thumb.x1=this.thumbPos.x-this.svg.thumb.width/2,this.svg.thumb.y1=this.thumbPos.y-this.svg.thumb.height/2,this.svg.capture.x1=this.thumbPos.x-this.svg.capture.width/2,this.svg.capture.y1=this.thumbPos.y-this.svg.capture.height/2,this.dev.debug&&console.log("CircularSliderTool::constructor",this.config,this.svg)}pointToAngle360(t,e,s){let i=-Math.atan2(t.y-e.y,e.x-t.x)/(Math.PI/180);return i+=-90,i<0&&(i+=360),this.arc.clockwise&&i<this.arc.startAngle360&&(i+=360),this.arc.clockwise||i<this.arc.endAngle360&&(i+=360),i}isAngle360InBetween(t){let e;return e=this.arc.clockwise?t>=this.arc.startAngle360&&t<=this.arc.endAngle360:t<=this.arc.startAngle360&&t>=this.arc.endAngle360,!!e}polarToCartesian(t,e,s,i,o){const a=(o-90)*Math.PI/180;return{x:t+s*Math.cos(a),y:e+i*Math.sin(a)}}pointToSliderValue(t){let e,s;const i={};i.x=this.svg.cx,i.y=this.svg.cy;const o=this.pointToAngle360(t,i,!0);let{myAngle:a}=this;const n=this.isAngle360InBetween(o);var r,h,l;return n&&(this.myAngle=o,a=o,this.arc.currentAngle=a),this.arc.currentAngle=a,this.arc.clockwise&&(s=(a-this.arc.startAngle360)/this.arc.size),this.arc.clockwise||(s=(this.arc.startAngle360-a)/this.arc.size),e=(this.config.scale.max-this.config.scale.min)*s+this.config.scale.min,e=Math.round(e/this.svg.scale.step)*this.svg.scale.step,e=Math.max(Math.min(this.config.scale.max,e),this.config.scale.min),this.arc.currentAngle=a,this.dragging&&!n&&(r=this.svg.scale.min,h=e,l=this.svg.scale.max,e=Math.abs(h-r)>Math.abs(l-h)?l:r,this.m=this.sliderValueToPoint(e)),e}sliderValueToPoint(t){let e,s=wt.calculateValueBetween(this.config.scale.min,this.config.scale.max,t);isNaN(s)&&(s=0),e=this.arc.clockwise?this.arc.size*s+this.arc.startAngle360:this.arc.size*(1-s)+this.arc.endAngle360,e<0&&(e+=360);const i=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,e);return this.arc.currentAngle=e,i}updateValue(t){this._value=this.pointToSliderValue(t);Math.abs(0)<.01&&this.rid&&(window.cancelAnimationFrame(this.rid),this.rid=null)}updateThumb(t){if(this.dragging){this.thumbPos=this.sliderValueToPoint(this._value),this.svg.thumb.x1=this.thumbPos.x-this.svg.thumb.width/2,this.svg.thumb.y1=this.thumbPos.y-this.svg.thumb.height/2,this.svg.capture.x1=this.thumbPos.x-this.svg.capture.width/2,this.svg.capture.y1=this.thumbPos.y-this.svg.capture.height/2;const t=`rotate(${this.arc.currentAngle} ${this.svg.capture.width/2} ${this.svg.capture.height/2})`;this.elements.thumb.setAttribute("transform",t),this.elements.thumbGroup.setAttribute("x",this.svg.capture.x1),this.elements.thumbGroup.setAttribute("y",this.svg.capture.y1)}this.updateLabel(t)}updateActiveTrack(t){const e=this.config.scale.min||0,s=this.config.scale.max||100;let i=wt.calculateValueBetween(e,s,this.labelValue);isNaN(i)&&(i=0);const o=i*this.svg.pathLength;this.dashArray=`${o} ${this.svg.circleLength}`,this.dragging&&this.elements.activeTrack.setAttribute("stroke-dasharray",this.dashArray)}updateLabel(t){this.dev.debug&&console.log("SLIDER - updateLabel start",t,this.config.position.orientation);const e=this._card.config.entities[this.defaultEntityIndex()].decimals||0,s=10**e;this.labelValue2=(Math.round(this.pointToSliderValue(t)*s)/s).toFixed(e),"none"!==this.config.position.label.placement&&(this.elements.label.textContent=this.labelValue2)}mouseEventToPoint(t){let e=this.elements.svg.createSVGPoint();e.x=t.touches?t.touches[0].clientX:t.clientX,e.y=t.touches?t.touches[0].clientY:t.clientY;const s=this.elements.svg.getScreenCTM().inverse();return e=e.matrixTransform(s),e}callDragService(){void 0!==this.labelValue2&&(this.labelValuePrev!==this.labelValue2&&(this.labelValuePrev=this.labelValue2,this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions.tap_action,this._card.config.entities[this.defaultEntityIndex()]?.entity,this.labelValue2)),this.dragging&&(this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval)))}callTapService(){void 0!==this.labelValue2&&this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions?.tap_action,this._card.config.entities[this.defaultEntityIndex()]?.entity,this.labelValue2)}firstUpdated(t){function e(){this.rid=window.requestAnimationFrame(e),this.updateValue(this.m),this.updateThumb(this.m),this.updateActiveTrack(this.m)}this.labelValue=this._stateValue,this.dev.debug&&console.log("circslider - firstUpdated"),this.elements={},this.elements.svg=this._card.shadowRoot.getElementById("circslider-".concat(this.toolId)),this.elements.track=this.elements.svg.querySelector("#track"),this.elements.activeTrack=this.elements.svg.querySelector("#active-track"),this.elements.capture=this.elements.svg.querySelector("#capture"),this.elements.thumbGroup=this.elements.svg.querySelector("#thumb-group"),this.elements.thumb=this.elements.svg.querySelector("#thumb"),this.elements.label=this.elements.svg.querySelector("#label tspan"),this.dev.debug&&console.log("circslider - firstUpdated svg = ",this.elements.svg,"activeTrack=",this.elements.activeTrack,"thumb=",this.elements.thumb,"label=",this.elements.label,"text=",this.elements.text);const s=()=>{const t=bt(this.svg.scale.max,this.labelValue)<=this.rangeMax,e=bt(this.svg.scale.min,this.labelValue)<=this.rangeMin,s=!(!e||!this.diffMax),i=!(!t||!this.diffMin);s?(this.labelValue=this.svg.scale.max,this.m=this.sliderValueToPoint(this.labelValue),this.rangeMax=this.svg.scale.max/10,this.rangeMin=bt(this.svg.scale.max,this.svg.scale.min+this.svg.scale.max/5)):i?(this.labelValue=this.svg.scale.min,this.m=this.sliderValueToPoint(this.labelValue),this.rangeMax=bt(this.svg.scale.min,this.svg.scale.max-this.svg.scale.max/5),this.rangeMin=this.svg.scale.max/10):(this.diffMax=t,this.diffMin=e,this.rangeMin=this.svg.scale.max/5,this.rangeMax=this.svg.scale.max/5)},i=t=>{t.preventDefault(),this.dragging&&(this.m=this.mouseEventToPoint(t),this.labelValue=this.pointToSliderValue(this.m),s(),e.call(this))},o=t=>{t.preventDefault(),this.dragging=!0,window.addEventListener("pointermove",i,!1),window.addEventListener("pointerup",a,!1),this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(this.config.user_actions.drag_action.update_interval>0?this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval):this.timeOutId=null),this.m=this.mouseEventToPoint(t),this.labelValue=this.pointToSliderValue(this.m),s(),this.dev.debug&&console.log("pointerDOWN",Math.round(100*this.m.x)/100),e.call(this)},a=t=>{t.preventDefault(),this.dev.debug&&console.log("pointerUP"),window.removeEventListener("pointermove",i,!1),window.removeEventListener("pointerup",a,!1),window.removeEventListener("mousemove",i,!1),window.removeEventListener("touchmove",i,!1),window.removeEventListener("mouseup",a,!1),window.removeEventListener("touchend",a,!1),this.labelValuePrev=this.labelValue,this.dragging?(this.dragging=!1,clearTimeout(this.timeOutId),this.timeOutId=null,this.target=0,this.labelValue2=this.labelValue,e.call(this),this.callTapService()):s()};this.elements.thumbGroup.addEventListener("touchstart",o,!1),this.elements.thumbGroup.addEventListener("mousedown",o,!1),this.elements.svg.addEventListener("wheel",(t=>{t.preventDefault(),clearTimeout(this.wheelTimeOutId),this.dragging=!0,this.wheelTimeOutId=setTimeout((()=>{clearTimeout(this.timeOutId),this.timeOutId=null,this.labelValue2=this.labelValue,this.dragging=!1,this.callTapService()}),500),this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(this.config.user_actions.drag_action.update_interval>0?this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval):this.timeOutId=null);const s=+this.labelValue+ +(t.altKey?10*this.svg.scale.step:this.svg.scale.step)*Math.sign(t.deltaY);var i,o,a;this.labelValue=(i=this.svg.scale.min,o=s,a=this.svg.scale.max,Math.min(Math.max(o,i),a)),this.m=this.sliderValueToPoint(this.labelValue),this.pointToSliderValue(this.m),e.call(this),this.labelValue2=this.labelValue}),!1)}set value(t){if(super.value=t,this.dragging||(this.labelValue=this._stateValue),!this.dragging){const t=this.config.scale.min||0,e=this.config.scale.max||100;let s=Math.min(wt.calculateValueBetween(t,e,this._stateValue),1);isNaN(s)&&(s=0);const i=s*this.svg.pathLength;this.dashArray=`${i} ${this.svg.circleLength}`;const o=this.sliderValueToPoint(this._stateValue);this.svg.thumb.x1=o.x-this.svg.thumb.width/2,this.svg.thumb.y1=o.y-this.svg.thumb.height/2,this.svg.capture.x1=o.x-this.svg.capture.width/2,this.svg.capture.y1=o.y-this.svg.capture.height/2}}set values(t){if(super.values=t,this.dragging||(this.labelValue=this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]),!this.dragging){const t=this.config.scale.min||0,e=this.config.scale.max||100;let s=Math.min(wt.calculateValueBetween(t,e,this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]),1);isNaN(s)&&(s=0);const i=s*this.svg.pathLength;this.dashArray=`${i} ${this.svg.circleLength}`;const o=this.sliderValueToPoint(this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]);this.svg.thumb.x1=o.x-this.svg.thumb.width/2,this.svg.thumb.y1=o.y-this.svg.thumb.height/2,this.svg.capture.x1=o.x-this.svg.capture.width/2,this.svg.capture.y1=o.y-this.svg.capture.height/2}}_renderUom(){if("none"===this.config.show.uom)return F``;{this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.uom);let t=this.styles.label["font-size"],e=.5,s="em";const i=t.match(/\D+|\d*\.?\d+/g);2===i.length?(e=.6*Number(i[0]),s=i[1]):console.error("Cannot determine font-size for state/unit",t),t={"font-size":e+s},this.styles.uom=xt.mergeDeep(this.config.styles.uom,t);const o=this._card._buildUom(this.derivedEntity,this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]);return"end"===this.config.show.uom?F`
          <tspan class="${Et(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${rt(this.styles.uom)}">
            ${o}</tspan>
        `:"bottom"===this.config.show.uom?F`
          <tspan class="${Et(this.classes.uom)}" x="${this.svg.label.cx}" dy="1.5em"
            style="${rt(this.styles.uom)}">
            ${o}</tspan>
        `:"top"===this.config.show.uom?F`
          <tspan class="${Et(this.classes.uom)}" x="${this.svg.label.cx}" dy="-1.5em"
            style="${rt(this.styles.uom)}">
            ${o}</tspan>
        `:F`
          <tspan class="${Et(this.classes.uom)}"  dx="-0.1em" dy="-0.35em"
            style="${rt(this.styles.uom)}">
            ERR</tspan>
        `}}_renderCircSlider(){return this.MergeAnimationClassIfChanged(),this.MergeColorFromState(),this.MergeAnimationStyleIfChanged(),this.renderValue=this._stateValue,this.dragging?this.renderValue=this.labelValue2:this.elements?.label&&(this.elements.label.textContent=this.renderValue),F`
      <g id="circslider__group-inner" class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}">

        <circle id="track" class="sak-circslider__track" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          style="${rt(this.styles.track)}"
          stroke-dasharray="${this.arc.scaleDasharray} ${this.arc.arcLength}"
          stroke-dashoffset="${this.arc.dashOffset}"
          stroke-width="${this.svg.track.width}"
          transform="rotate(${this.svg.rotate.degrees} ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        <circle id="active-track" class="sak-circslider__active" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          fill="${this.config.fill||"rgba(0, 0, 0, 0)"}"
          style="${rt(this.styles.active)}"
          stroke-dasharray="${this.dashArray}"
          stroke-dashoffset="${this.arc.dashOffset}"
          stroke-width="${this.svg.active.width}"
          transform="rotate(${this.svg.rotate.degrees} ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        ${function(){return F`
        <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}" style="filter:url(#sak-drop-1);overflow:visible;">
          <g style="transform-origin:center;transform-box: fill-box;" >
          <g id="thumb" transform="rotate(${this.arc.currentAngle} ${this.svg.capture.width/2} ${this.svg.capture.height/2})">

            <rect id="capture" class="${Et(this.classes.capture)}" x="0" y="0"
              width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}" 
              style="${rt(this.styles.capture)}" 
            />

            <rect id="rect-thumb" class="${Et(this.classes.thumb)}" x="${(this.svg.capture.width-this.svg.thumb.width)/2}" y="${(this.svg.capture.height-this.svg.thumb.height)/2}"
              width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
              style="${rt(this.styles.thumb)}"
            />

            </g>
            </g>
        </g>
      `}.call(this)}
        ${function(t){return"thumb"===this.config.position.label.placement&&t?F`
      <text id="label">
        <tspan class="${Et(this.classes.label)}" x="${this.svg.label.cx}" y="${this.svg.label.cy}" style="${rt(this.styles.label)}">
        ${this.renderValue}</tspan>
        ${this._renderUom()}
        </text>
        `:"position"!==this.config.position.label.placement||t?void 0:F`
          <text id="label" style="transform-origin:center;transform-box: fill-box;">
            <tspan class="${Et(this.classes.label)}" data-placement="position" x="${this.svg.label.cx}" y="${this.svg.label.cy}"
            style="${rt(this.styles.label)}">${this.renderValue?this.renderValue:""}</tspan>
            ${this.renderValue?this._renderUom():""}
          </text>
          `}.call(this,!1)}
      </g>

    `}render(){return F`
      <svg xmlns="http://www.w3.org/2000/svg" id="circslider-${this.toolId}" class="circslider__group-outer" overflow="visible"
        touch-action="none" style="touch-action:none;"
      >
        ${this._renderCircSlider()}

      </svg>
    `}}class Ut extends Ot{constructor(t,e,s){super(t,xt.mergeDeep({position:{cx:50,cy:50,radiusx:50,radiusy:25},classes:{tool:{"sak-ellipse":!0,hover:!0},ellipse:{"sak-ellipse__ellipse":!0}},styles:{tool:{},ellipse:{}}},e),s),this.svg.radiusx=wt.calculateSvgDimension(e.position.radiusx),this.svg.radiusy=wt.calculateSvgDimension(e.position.radiusy),this.classes.tool={},this.classes.ellipse={},this.styles.tool={},this.styles.ellipse={},this.dev.debug&&console.log("EllipseTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_renderEllipse(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.ellipse),this.dev.debug&&console.log("EllipseTool - renderEllipse",this.svg.cx,this.svg.cy,this.svg.radiusx,this.svg.radiusy),F`
      <ellipse class="${Et(this.classes.ellipse)}"
        cx="${this.svg.cx}"% cy="${this.svg.cy}"%
        rx="${this.svg.radiusx}" ry="${this.svg.radiusy}"
        style="${rt(this.styles.ellipse)}"/>
      `}render(){return F`
      <g id="ellipse-${this.toolId}"
        class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderEllipse()}
      </g>
    `}}class Ft extends Ot{constructor(t,e,s){super(t,xt.mergeDeep({classes:{tool:{},area:{"sak-area__area":!0,hover:!0}},styles:{tool:{},area:{}}},e),s),this.classes.tool={},this.classes.area={},this.styles.tool={},this.styles.area={},this.dev.debug&&console.log("EntityAreaTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_buildArea(t,e){return e.area||"?"}_renderEntityArea(){this.MergeAnimationClassIfChanged(),this.MergeColorFromState(this.styles.area),this.MergeAnimationStyleIfChanged();const t=this.textEllipsis(this._buildArea(this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]),this.config?.show?.ellipsis);return F`
        <text>
          <tspan class="${Et(this.classes.area)}"
          x="${this.svg.cx}" y="${this.svg.cy}" style="${rt(this.styles.area)}">${t}</tspan>
        </text>
      `}render(){return F`
      <g id="area-${this.toolId}"
        class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderEntityArea()}
      </g>
    `}}class Bt extends Ot{constructor(t,e,s){super(t,xt.mergeDeep({classes:{tool:{"sak-icon":!0,hover:!0},icon:{"sak-icon__icon":!0}},styles:{tool:{},icon:{}}},e),s),this.svg.iconSize=this.config.position.icon_size?this.config.position.icon_size:3,this.svg.iconPixels=4*this.svg.iconSize;const i=this.config.position.align?this.config.position.align:"center",o="center"===i?.5:"start"===i?-1:1,a=400/this._card.viewBox.width;this.svg.xpx=this.svg.cx,this.svg.ypx=this.svg.cy,!this._card.isSafari&&!this._card.iOS||this._card.isSafari16?(this.svg.xpx-=this.svg.iconPixels*o,this.svg.ypx=this.svg.ypx-.5*this.svg.iconPixels-.25*this.svg.iconPixels):(this.svg.iconSize*=a,this.svg.xpx=this.svg.xpx*a-this.svg.iconPixels*o*a,this.svg.ypx=this.svg.ypx*a-.5*this.svg.iconPixels*a-.25*this.svg.iconPixels*a),this.classes.tool={},this.classes.icon={},this.styles.tool={},this.styles.icon={},this.dev.debug&&console.log("EntityIconTool constructor coords, dimensions, config",this.coords,this.dimensions,this.config)}static{Bt.sakIconCache={}}_buildIcon(t,e,s){return this.activeAnimation?.icon||s||e?.icon||t?.attributes?.icon||function(t){if(!t)return"mdi:bookmark";if(t.attributes.icon)return t.attributes.icon;var e=function(t){return t.substr(0,t.indexOf("."))}(t.entity_id);return e in Pt?Pt[e](t):Vt(e,t.state)}(t)}_renderIcon(){this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.icon);const t=this._buildIcon(this._card.entities[this.defaultEntityIndex()],void 0!==this.defaultEntityIndex()?this._card.config.entities[this.defaultEntityIndex()]:void 0,this.config.icon);{this.svg.iconSize=this.config.position.icon_size?this.config.position.icon_size:2,this.svg.iconPixels=4*this.svg.iconSize,this.svg.iconSize=this.config.position.icon_size?this.config.position.icon_size:2,this.svg.iconPixels=wt.calculateSvgDimension(this.svg.iconSize);const t=this.config.position.align?this.config.position.align:"center",e="center"===t?.5:"start"===t?-1:1,s=400/this._card.viewBox.width;this.svg.xpx=this.svg.cx,this.svg.ypx=this.svg.cy,!this._card.isSafari&&!this._card.iOS||this._card.isSafari16?(this.svg.xpx=this.svg.cx-this.svg.iconPixels*e,this.svg.ypx=this.svg.cy-this.svg.iconPixels*e,this.dev.debug&&console.log("EntityIconTool::_renderIcon - svg values =",this.toolId,this.svg,this.config.cx,this.config.cy,t,e)):(this.svg.iconSize*=s,this.svg.iconPixels*=s,this.svg.xpx=this.svg.xpx*s-this.svg.iconPixels*e*s,this.svg.ypx=this.svg.ypx*s-.9*this.svg.iconPixels*s,this.svg.xpx=this.svg.cx*s-this.svg.iconPixels*e*s,this.svg.ypx=this.svg.cy*s-this.svg.iconPixels*e*s)}if(this.alternateColor||(this.alternateColor="rgba(0,0,0,0)"),Bt.sakIconCache[t])this.iconSvg=Bt.sakIconCache[t];else{const e=this._card.shadowRoot.getElementById("icon-".concat(this.toolId))?.shadowRoot?.querySelectorAll("*");this.iconSvg=e?e[0]?.path:void 0,this.iconSvg&&(Bt.sakIconCache[t]=this.iconSvg)}let e;return this.iconSvg?(this.svg.iconSize=this.config.position.icon_size?this.config.position.icon_size:2,this.svg.iconPixels=wt.calculateSvgDimension(this.svg.iconSize),this.svg.x1=this.svg.cx-this.svg.iconPixels/2,this.svg.y1=this.svg.cy-this.svg.iconPixels/2,this.svg.x1=this.svg.cx-.5*this.svg.iconPixels,this.svg.y1=this.svg.cy-.5*this.svg.iconPixels,e=this.svg.iconPixels/24,F`
        <g id="icon-${this.toolId}" class="${Et(this.classes.icon)}" style="${rt(this.styles.icon)}" x="${this.svg.x1}px" y="${this.svg.y1}px" transform-origin="${this.svg.cx} ${this.svg.cy}">
          <rect x="${this.svg.x1}" y="${this.svg.y1}" height="${this.svg.iconPixels}px" width="${this.svg.iconPixels}px" stroke-width="0px" fill="rgba(0,0,0,0)"></rect>
          <path d="${this.iconSvg}" transform="translate(${this.svg.x1},${this.svg.y1}) scale(${e})"></path>
        <g>
      `):F`
        <foreignObject width="0px" height="0px" x="${this.svg.xpx}" y="${this.svg.ypx}" overflow="hidden">
          <body>
            <div class="div__icon, hover" xmlns="http://www.w3.org/1999/xhtml"
                style="line-height:${this.svg.iconPixels}px;position:relative;border-style:solid;border-width:0px;border-color:${this.alternateColor};fill:${this.alternateColor};color:${this.alternateColor};">
                <ha-icon icon=${t} id="icon-${this.toolId}"
                @animationstart=${t=>this._handleAnimationEvent(t,this)}
                @animationiteration=${t=>this._handleAnimationEvent(t,this)}
                style="animation: flash 0.15s 20;"></ha-icon>
            </div>
          </body>
        </foreignObject>
        `}_handleAnimationEvent(t,e){t.stopPropagation(),t.preventDefault(),e.iconSvg=this._card.shadowRoot.getElementById("icon-".concat(this.toolId))?.shadowRoot?.querySelectorAll("*")[0]?.path,e.iconSvg&&e._card.requestUpdate()}firstUpdated(t){}render(){return F`
      <g "" id="icongrp-${this.toolId}" class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)} >

        ${this._renderIcon()}
      </g>
    `}}class jt extends Ot{constructor(t,e,s){super(t,xt.mergeDeep({classes:{tool:{"sak-name":!0,hover:!0},name:{"sak-name__name":!0}},styles:{tool:{},name:{}}},e),s),this._name={},this.classes.tool={},this.classes.name={},this.styles.tool={},this.styles.name={},this.dev.debug&&console.log("EntityName constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_buildName(t,e){return this.activeAnimation?.name||e.name||t.attributes.friendly_name}_renderEntityName(){this.MergeAnimationClassIfChanged(),this.MergeColorFromState(this.styles.name),this.MergeAnimationStyleIfChanged();const t=this.textEllipsis(this._buildName(this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]),this.config?.show?.ellipsis);return F`
        <text>
          <tspan class="${Et(this.classes.name)}" x="${this.svg.cx}" y="${this.svg.cy}" style="${rt(this.styles.name)}">${t}</tspan>
        </text>
      `}render(){return F`
      <g id="name-${this.toolId}"
        class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderEntityName()}
      </g>
    `}}class qt extends Ot{constructor(t,e,s){super(t,xt.mergeDeep({show:{uom:"end"},classes:{tool:{"sak-state":!0,hover:!0},state:{"sak-state__value":!0},uom:{"sak-state__uom":!0}},styles:{tool:{},state:{},uom:{}}},e),s),this.classes.tool={},this.classes.state={},this.classes.uom={},this.styles.tool={},this.styles.state={},this.styles.uom={},this.dev.debug&&console.log("EntityStateTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}set value(t){super.value=t}_renderState(){this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.state);let t=this._stateValue;if(t&&isNaN(t)){const e=this._card.entities[this.defaultEntityIndex()],s=this._card._computeDomain(this._card.config.entities[this.defaultEntityIndex()].entity),i=this.config.locale_tag?this.config.locale_tag+t.toLowerCase():void 0,o=e.attributes?.device_class?`component.${s}.state.${e.attributes.device_class}.${t}`:"--",a=`component.${s}.state._.${t}`;t=i&&this._card.toLocale(i,t)||e.attributes?.device_class&&this._card.toLocale(o,t)||this._card.toLocale(a,t)||e.state,t=this.textEllipsis(t,this.config?.show?.ellipsis)}return F`
      <tspan class="${Et(this.classes.state)}" x="${this.svg.x}" y="${this.svg.y}"
        style="${rt(this.styles.state)}">
        ${this.config?.text?.before?this.config.text.before:""}${t}${this.config?.text?.after?this.config.text.after:""}</tspan>
    `}_renderUom(){if("none"===this.config.show.uom)return F``;{this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.uom);let t=this.styles.state["font-size"],e=.5,s="em";const i=t.match(/\D+|\d*\.?\d+/g);2===i.length?(e=.6*Number(i[0]),s=i[1]):console.error("Cannot determine font-size for state/unit",t),t={"font-size":e+s},this.styles.uom=xt.mergeDeep(this.config.styles.uom,this.styles.uom,t);const o=this._card._buildUom(this.derivedEntity,this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]);return"end"===this.config.show.uom?F`
          <tspan class="${Et(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${rt(this.styles.uom)}">
            ${o}</tspan>
        `:"bottom"===this.config.show.uom?F`
          <tspan class="${Et(this.classes.uom)}" x="${this.svg.x}" dy="1.5em"
            style="${rt(this.styles.uom)}">
            ${o}</tspan>
        `:"top"===this.config.show.uom?F`
          <tspan class="${Et(this.classes.uom)}" x="${this.svg.x}" dy="-1.5em"
            style="${rt(this.styles.uom)}">
            ${o}</tspan>
        `:F``}}firstUpdated(t){}updated(t){}render(){return F`
    <svg overflow="visible" id="state-${this.toolId}"
      class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}">
        <text @click=${t=>this.handleTapEvent(t,this.config)}>
          ${this._renderState()}
          ${this._renderUom()}
        </text>
      </svg>
      `}}class Ht extends Ot{constructor(t,e,s){super(t,xt.mergeDeep({position:{cx:50,cy:50,radius:45},card_filter:"card--filter-none",horseshoe_scale:{min:0,max:100,width:3,color:"var(--primary-background-color)"},horseshoe_state:{width:6,color:"var(--primary-color)"},show:{horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"}},e),s),this.HORSESHOE_RADIUS_SIZE=180,this.TICKMARKS_RADIUS_SIZE=172,this.HORSESHOE_PATH_LENGTH=520/360*Math.PI*this.HORSESHOE_RADIUS_SIZE,this.config.entity_index=this.config.entity_index?this.config.entity_index:0,this.svg.radius=wt.calculateSvgDimension(this.config.position.radius),this.svg.radius_ticks=wt.calculateSvgDimension(.95*this.config.position.radius),this.svg.horseshoe_scale={},this.svg.horseshoe_scale.width=wt.calculateSvgDimension(this.config.horseshoe_scale.width),this.svg.horseshoe_state={},this.svg.horseshoe_state.width=wt.calculateSvgDimension(this.config.horseshoe_state.width),this.svg.horseshoe_scale.dasharray=52/36*Math.PI*this.svg.radius,this.svg.rotate={},this.svg.rotate.degrees=-220,this.svg.rotate.cx=this.svg.cx,this.svg.rotate.cy=this.svg.cy,this.colorStops={},this.config.color_stops&&Object.keys(this.config.color_stops).forEach((t=>{this.colorStops[t]=this.config.color_stops[t]})),this.sortedStops=Object.keys(this.colorStops).map((t=>Number(t))).sort(((t,e)=>t-e)),this.colorStopsMinMax={},this.colorStopsMinMax[this.config.horseshoe_scale.min]=this.colorStops[this.sortedStops[0]],this.colorStopsMinMax[this.config.horseshoe_scale.max]=this.colorStops[this.sortedStops[this.sortedStops.length-1]],this.color0=this.colorStops[this.sortedStops[0]],this.color1=this.colorStops[this.sortedStops[this.sortedStops.length-1]],this.angleCoords={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},this.color1_offset="0%",this.dev.debug&&console.log("HorseshoeTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}set value(t){if(this._stateValue===t)return;this._stateValuePrev=this._stateValue||t,this._stateValue=t,this._stateValueIsDirty=!0;const e=this.config.horseshoe_scale.min||0,s=this.config.horseshoe_scale.max||100,i=Math.min(wt.calculateValueBetween(e,s,t),1),o=i*this.HORSESHOE_PATH_LENGTH,a=10*this.HORSESHOE_RADIUS_SIZE;this.dashArray=`${o} ${a}`;const n=this.config.show.horseshoe_style;if("fixed"===n)this.stroke_color=this.config.horseshoe_state.color,this.color0=this.config.horseshoe_state.color,this.color1=this.config.horseshoe_state.color,this.color1_offset="0%";else if("autominmax"===n){const e=Dt.calculateColor(t,this.colorStopsMinMax,!0);this.color0=e,this.color1=e,this.color1_offset="0%"}else if("colorstop"===n||"colorstopgradient"===n){const e=Dt.calculateColor(t,this.colorStops,"colorstopgradient"===n);this.color0=e,this.color1=e,this.color1_offset="0%"}else if("lineargradient"===n){const t={x1:"0%",y1:"0%",x2:"100%",y2:"0%"};this.color1_offset=`${Math.round(100*(1-i))}%`,this.angleCoords=t}this.dev.debug&&console.log("HorseshoeTool set value",this.cardId,t)}_renderTickMarks(){const{config:t}=this;if(!t.show.scale_tickmarks)return;const e=t.horseshoe_scale.color?t.horseshoe_scale.color:"var(--primary-background-color)",s=t.horseshoe_scale.ticksize?t.horseshoe_scale.ticksize:(t.horseshoe_scale.max-t.horseshoe_scale.min)/10,i=t.horseshoe_scale.min%s,o=t.horseshoe_scale.min+(0===i?0:s-i),a=(o-t.horseshoe_scale.min)/(t.horseshoe_scale.max-t.horseshoe_scale.min)*260,n=(t.horseshoe_scale.max-o)/s;let r=Math.floor(n);const h=(260-a)/n;Math.floor(r*s+o)<=t.horseshoe_scale.max&&(r+=1);const l=this.svg.horseshoe_scale.width?this.svg.horseshoe_scale.width/2:3;let c;const d=[];let g;for(g=0;g<r;g++)c=a+(360-g*h-230)*Math.PI/180,d[g]=F`
        <circle cx="${this.svg.cx-Math.sin(c)*this.svg.radius_ticks}"
                cy="${this.svg.cy-Math.cos(c)*this.svg.radius_ticks}" r="${l}"
                fill="${e}">
      `;return F`${d}`}_renderHorseShoe(){if(this.config.show.horseshoe)return F`
      <g id="horseshoe__group-inner" class="horseshoe__group-inner">
        <circle id="horseshoe__scale" class="horseshoe__scale" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          fill="${this.fill||"rgba(0, 0, 0, 0)"}"
          stroke="${this.config.horseshoe_scale.color||"#000000"}"
          stroke-dasharray="${this.svg.horseshoe_scale.dasharray}"
          stroke-width="${this.svg.horseshoe_scale.width}"
          stroke-linecap="square"
          transform="rotate(-220 ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        <circle id="horseshoe__state__value" class="horseshoe__state__value" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          fill="${this.config.fill||"rgba(0, 0, 0, 0)"}"
          stroke="url('#horseshoe__gradient-${this.cardId}')"
          stroke-dasharray="${this.dashArray}"
          stroke-width="${this.svg.horseshoe_state.width}"
          stroke-linecap="square"
          transform="rotate(-220 ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        ${this._renderTickMarks()}
      </g>
    `}render(){return F`
      <g "" id="horseshoe-${this.toolId}" class="horseshoe__group-outer"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderHorseShoe()}
      </g>

      <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
        <linearGradient gradientTransform="rotate(0)" id="horseshoe__gradient-${this.cardId}" x1="${this.angleCoords.x1}", y1="${this.angleCoords.y1}", x2="${this.angleCoords.x2}" y2="${this.angleCoords.y2}">
          <stop offset="${this.color1_offset}" stop-color="${this.color1}" />
          <stop offset="100%" stop-color="${this.color0}" />
        </linearGradient>
      </svg>

    `}}class Gt extends Ot{constructor(t,e,s){if(super(t,xt.mergeDeep({position:{orientation:"vertical",length:"10",cx:"50",cy:"50"},classes:{tool:{"sak-line":!0,hover:!0},line:{"sak-line__line":!0}},styles:{tool:{},line:{}}},e),s),!["horizontal","vertical","fromto"].includes(this.config.position.orientation))throw Error("LineTool::constructor - invalid orientation [vertical, horizontal, fromto] = ",this.config.position.orientation);["horizontal","vertical"].includes(this.config.position.orientation)&&(this.svg.length=wt.calculateSvgDimension(e.position.length)),"fromto"===this.config.position.orientation?(this.svg.x1=wt.calculateSvgCoordinate(e.position.x1,this.toolsetPos.cx),this.svg.y1=wt.calculateSvgCoordinate(e.position.y1,this.toolsetPos.cy),this.svg.x2=wt.calculateSvgCoordinate(e.position.x2,this.toolsetPos.cx),this.svg.y2=wt.calculateSvgCoordinate(e.position.y2,this.toolsetPos.cy)):"vertical"===this.config.position.orientation?(this.svg.x1=this.svg.cx,this.svg.y1=this.svg.cy-this.svg.length/2,this.svg.x2=this.svg.cx,this.svg.y2=this.svg.cy+this.svg.length/2):"horizontal"===this.config.position.orientation&&(this.svg.x1=this.svg.cx-this.svg.length/2,this.svg.y1=this.svg.cy,this.svg.x2=this.svg.cx+this.svg.length/2,this.svg.y2=this.svg.cy),this.classes.line={},this.styles.line={},this.dev.debug&&console.log("LineTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_renderLine(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.line),this.dev.debug&&console.log("_renderLine",this.config.position.orientation,this.svg.x1,this.svg.y1,this.svg.x2,this.svg.y2),F`
      <line class="${Et(this.classes.line)}"
        x1="${this.svg.x1}"
        y1="${this.svg.y1}"
        x2="${this.svg.x2}"
        y2="${this.svg.y2}"
        style="${rt(this.styles.line)}"/>
      `}render(){return F`
      <g id="line-${this.toolId}"
        class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderLine()}
      </g>
    `}}class Wt extends Ot{constructor(t,e,s){switch(super(t,xt.mergeDeep({descr:"none",position:{cx:50,cy:50,orientation:"horizontal",active:{width:0,height:0,radius:0},track:{width:16,height:7,radius:3.5},thumb:{width:9,height:9,radius:4.5,offset:4.5},label:{placement:"none"}},show:{uom:"end",active:!1},classes:{tool:{"sak-slider":!0,hover:!0},capture:{"sak-slider__capture":!0},active:{"sak-slider__active":!0},track:{"sak-slider__track":!0},thumb:{"sak-slider__thumb":!0},label:{"sak-slider__value":!0},uom:{"sak-slider__uom":!0}},styles:{tool:{},capture:{},active:{},track:{},thumb:{},label:{},uom:{}}},e),s),this.svg.activeTrack={},this.svg.activeTrack.radius=wt.calculateSvgDimension(this.config.position.active.radius),this.svg.activeTrack.height=wt.calculateSvgDimension(this.config.position.active.height),this.svg.activeTrack.width=wt.calculateSvgDimension(this.config.position.active.width),this.svg.track={},this.svg.track.radius=wt.calculateSvgDimension(this.config.position.track.radius),this.svg.thumb={},this.svg.thumb.radius=wt.calculateSvgDimension(this.config.position.thumb.radius),this.svg.thumb.offset=wt.calculateSvgDimension(this.config.position.thumb.offset),this.svg.capture={},this.svg.label={},this.config.position.orientation){case"horizontal":case"vertical":this.svg.capture.width=wt.calculateSvgDimension(this.config.position.capture.width||1.1*this.config.position.track.width),this.svg.capture.height=wt.calculateSvgDimension(this.config.position.capture.height||3*this.config.position.thumb.height),this.svg.track.width=wt.calculateSvgDimension(this.config.position.track.width),this.svg.track.height=wt.calculateSvgDimension(this.config.position.track.height),this.svg.thumb.width=wt.calculateSvgDimension(this.config.position.thumb.width),this.svg.thumb.height=wt.calculateSvgDimension(this.config.position.thumb.height),this.svg.capture.x1=this.svg.cx-this.svg.capture.width/2,this.svg.capture.y1=this.svg.cy-this.svg.capture.height/2,this.svg.track.x1=this.svg.cx-this.svg.track.width/2,this.svg.track.y1=this.svg.cy-this.svg.track.height/2,this.svg.activeTrack.x1="horizontal"===this.config.position.orientation?this.svg.track.x1:this.svg.cx-this.svg.activeTrack.width/2,this.svg.activeTrack.y1=this.svg.cy-this.svg.activeTrack.height/2,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2;break;default:throw console.error("RangeSliderTool - constructor: invalid orientation [vertical, horizontal] = ",this.config.position.orientation),Error("RangeSliderTool::constructor - invalid orientation [vertical, horizontal] = ",this.config.position.orientation)}if("vertical"===this.config.position.orientation)this.svg.track.y2=this.svg.cy+this.svg.track.height/2,this.svg.activeTrack.y2=this.svg.track.y2;switch(this.config.position.label.placement){case"position":this.svg.label.cx=wt.calculateSvgCoordinate(this.config.position.label.cx,0),this.svg.label.cy=wt.calculateSvgCoordinate(this.config.position.label.cy,0);break;case"thumb":this.svg.label.cx=this.svg.cx,this.svg.label.cy=this.svg.cy;break;case"none":break;default:throw console.error("RangeSliderTool - constructor: invalid label placement [none, position, thumb] = ",this.config.position.label.placement),Error("RangeSliderTool::constructor - invalid label placement [none, position, thumb] = ",this.config.position.label.placement)}this.classes.capture={},this.classes.track={},this.classes.thumb={},this.classes.label={},this.classes.uom={},this.styles.capture={},this.styles.track={},this.styles.thumb={},this.styles.label={},this.styles.uom={},this.svg.scale={},this.svg.scale.min=this.valueToSvg(this,this.config.scale.min),this.svg.scale.max=this.valueToSvg(this,this.config.scale.max),this.svg.scale.step=this.config.scale.step,this.dev.debug&&console.log("RangeSliderTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}svgCoordinateToSliderValue(t,e){let s,i,o,a;switch(t.config.position.orientation){case"horizontal":o=e.x-t.svg.track.x1-this.svg.thumb.width/2,i=o/(t.svg.track.width-this.svg.thumb.width);break;case"vertical":a=t.svg.track.y2-this.svg.thumb.height/2-e.y,i=a/(t.svg.track.height-this.svg.thumb.height)}return s=(t.config.scale.max-t.config.scale.min)*i+t.config.scale.min,s=Math.round(s/this.svg.scale.step)*this.svg.scale.step,s=Math.max(Math.min(this.config.scale.max,s),this.config.scale.min),s}valueToSvg(t,e){if("horizontal"===t.config.position.orientation){const s=wt.calculateValueBetween(t.config.scale.min,t.config.scale.max,e)*(t.svg.track.width-this.svg.thumb.width);return t.svg.track.x1+this.svg.thumb.width/2+s}if("vertical"===t.config.position.orientation){const s=wt.calculateValueBetween(t.config.scale.min,t.config.scale.max,e)*(t.svg.track.height-this.svg.thumb.height);return t.svg.track.y2-this.svg.thumb.height/2-s}}updateValue(t,e){this._value=this.svgCoordinateToSliderValue(t,e);Math.abs(0)<.01&&this.rid&&(window.cancelAnimationFrame(this.rid),this.rid=null)}updateThumb(t,e){switch(t.config.position.orientation){default:case"horizontal":if(this.config.position.label.placement,this.dragging){const s="thumb"===this.config.position.label.placement?-50:0,i=`translate(${e.x-this.svg.cx}px , ${s}px)`;t.elements.thumbGroup.style.transform=i}else t.elements.thumbGroup.style.transform=`translate(${e.x-this.svg.cx}px, 0px)`;break;case"vertical":if(this.dragging){const s=`translate(${"thumb"===this.config.position.label.placement?-50:0}px, ${e.y-this.svg.cy}px)`;t.elements.thumbGroup.style.transform=s}else t.elements.thumbGroup.style.transform=`translate(0px, ${e.y-this.svg.cy}px)`}t.updateLabel(t,e)}updateActiveTrack(t,e){if(t.config.show.active)switch(t.config.position.orientation){default:case"horizontal":this.dragging&&t.elements.activeTrack.setAttribute("width",Math.abs(this.svg.activeTrack.x1-e.x+this.svg.cx));break;case"vertical":this.dragging&&(t.elements.activeTrack.setAttribute("y",e.y-this.svg.cy),t.elements.activeTrack.setAttribute("height",Math.abs(t.svg.activeTrack.y2-e.y+this.svg.cx)))}}updateLabel(t,e){this.dev.debug&&console.log("SLIDER - updateLabel start",e,t.config.position.orientation);const s=this._card.config.entities[this.defaultEntityIndex()].decimals||0,i=10**s;t.labelValue2=(Math.round(t.svgCoordinateToSliderValue(t,e)*i)/i).toFixed(s),"none"!==this.config.position.label.placement&&(t.elements.label.textContent=t.labelValue2)}mouseEventToPoint(t){let e=this.elements.svg.createSVGPoint();e.x=t.touches?t.touches[0].clientX:t.clientX,e.y=t.touches?t.touches[0].clientY:t.clientY;const s=this.elements.svg.getScreenCTM().inverse();return e=e.matrixTransform(s),e}callDragService(){void 0!==this.labelValue2&&(this.labelValuePrev!==this.labelValue2&&(this.labelValuePrev=this.labelValue2,this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions.tap_action,this._card.config.entities[this.defaultEntityIndex()]?.entity,this.labelValue2)),this.dragging&&(this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval)))}callTapService(){void 0!==this.labelValue2&&this.labelValuePrev!==this.labelValue2&&(this.labelValuePrev=this.labelValue2,this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions?.tap_action,this._card.config.entities[this.defaultEntityIndex()]?.entity,this.labelValue2))}firstUpdated(t){function e(){this.rid=window.requestAnimationFrame(e),this.updateValue(this,this.m),this.updateThumb(this,this.m),this.updateActiveTrack(this,this.m)}function s(t){let s;if(t.preventDefault(),this.dragging){switch(this.m=this.mouseEventToPoint(t),this.config.position.orientation){case"horizontal":s=this.svgCoordinateToSliderValue(this,this.m),this.m.x=this.valueToSvg(this,s),this.m.x=Math.max(this.svg.scale.min,Math.min(this.m.x,this.svg.scale.max)),this.m.x=Math.round(this.m.x/this.svg.scale.step)*this.svg.scale.step;break;case"vertical":s=this.svgCoordinateToSliderValue(this,this.m),this.m.y=this.valueToSvg(this,s),this.m.y=Math.round(this.m.y/this.svg.scale.step)*this.svg.scale.step}e.call(this)}}function i(t){t.preventDefault(),window.addEventListener("pointermove",s.bind(this),!1),window.addEventListener("pointerup",o.bind(this),!1);const i=this.mouseEventToPoint(t),a=this.svg.thumb.x1+this.svg.thumb.cx;i.x>a-10&&i.x<a+this.svg.thumb.width+10?(At(window,"haptic","heavy"),this.dragging=!0,this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(this.config.user_actions.drag_action.update_interval>0?this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval):this.timeOutId=null),this.m=this.mouseEventToPoint(t),"horizontal"===this.config.position.orientation?this.m.x=Math.round(this.m.x/this.svg.scale.step)*this.svg.scale.step:this.m.y=Math.round(this.m.y/this.svg.scale.step)*this.svg.scale.step,this.dev.debug&&console.log("pointerDOWN",Math.round(100*this.m.x)/100),e.call(this)):At(window,"haptic","error")}function o(t){t.preventDefault(),window.removeEventListener("pointermove",s.bind(this),!1),window.removeEventListener("pointerup",o.bind(this),!1),window.removeEventListener("mousemove",s.bind(this),!1),window.removeEventListener("touchmove",s.bind(this),!1),window.removeEventListener("mouseup",o.bind(this),!1),window.removeEventListener("touchend",o.bind(this),!1),this.dragging&&(this.dragging=!1,clearTimeout(this.timeOutId),this.target=0,this.dev.debug&&console.log("pointerUP"),e.call(this),this.callTapService())}this.labelValue=this._stateValue,this.dev.debug&&console.log("slider - firstUpdated"),this.elements={},this.elements.svg=this._card.shadowRoot.getElementById("rangeslider-".concat(this.toolId)),this.elements.capture=this.elements.svg.querySelector("#capture"),this.elements.track=this.elements.svg.querySelector("#rs-track"),this.elements.activeTrack=this.elements.svg.querySelector("#active-track"),this.elements.thumbGroup=this.elements.svg.querySelector("#rs-thumb-group"),this.elements.thumb=this.elements.svg.querySelector("#rs-thumb"),this.elements.label=this.elements.svg.querySelector("#rs-label tspan"),this.dev.debug&&console.log("slider - firstUpdated svg = ",this.elements.svg,"path=",this.elements.path,"thumb=",this.elements.thumb,"label=",this.elements.label,"text=",this.elements.text),this.elements.svg.addEventListener("touchstart",i.bind(this),!1),this.elements.svg.addEventListener("mousedown",i.bind(this),!1)}set value(t){super.value=t,this.dragging||(this.labelValue=this._stateValue)}_renderUom(){if("none"===this.config.show.uom)return F``;{this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.uom);let t=this.styles.label["font-size"],e=.5,s="em";const i=t.match(/\D+|\d*\.?\d+/g);2===i.length?(e=.6*Number(i[0]),s=i[1]):console.error("Cannot determine font-size for state/unit",t),t={"font-size":e+s},this.styles.uom=xt.mergeDeep(this.config.styles.uom,t);const o=this._card._buildUom(this.derivedEntity,this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]);return"end"===this.config.show.uom?F`
          <tspan class="${Et(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${rt(this.styles.uom)}">
            ${o}</tspan>
        `:"bottom"===this.config.show.uom?F`
          <tspan class="${Et(this.classes.uom)}" x="${this.svg.label.cx}" dy="1.5em"
            style="${rt(this.styles.uom)}">
            ${o}</tspan>
        `:"top"===this.config.show.uom?F`
          <tspan class="${Et(this.classes.uom)}" x="${this.svg.label.cx}" dy="-1.5em"
            style="${rt(this.styles.uom)}">
            ${o}</tspan>
        `:F`
          <tspan class="${Et(this.classes.uom)}"  dx="-0.1em" dy="-0.35em"
            style="${rt(this.styles.uom)}">
            ERRR</tspan>
        `}}_renderRangeSlider(){let t,e;switch(this.dev.debug&&console.log("slider - _renderRangeSlider"),this.MergeAnimationClassIfChanged(),this.MergeColorFromState(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(),this.renderValue=this._stateValue,this.dragging?this.renderValue=this.labelValue2:this.elements?.label&&(this.elements.label.textContent=this.renderValue),this.config.position.label.placement){case"none":this.styles.label.display="none",this.styles.uom.display="none";break;case"position":t="horizontal"===this.config.position.orientation?this.valueToSvg(this,Number(this.renderValue))-this.svg.cx:0,e="vertical"===this.config.position.orientation?this.valueToSvg(this,Number(this.renderValue))-this.svg.cy:0;break;case"thumb":t="horizontal"===this.config.position.orientation?-this.svg.label.cx+this.valueToSvg(this,Number(this.renderValue)):0,e="vertical"===this.config.position.orientation?this.valueToSvg(this,Number(this.renderValue)):0,this.dragging&&("horizontal"===this.config.position.orientation?e-=50:t-=50);break;default:console.error("_renderRangeSlider(), invalid label placement",this.config.position.label.placement)}function s(t){return"thumb"===this.config.position.label.placement&&t?F`
      <text id="rs-label">
        <tspan class="${Et(this.classes.label)}" x="${this.svg.label.cx}" y="${this.svg.label.cy}" style="${rt(this.styles.label)}">
        ${this.renderValue}</tspan>
        ${this._renderUom()}
        </text>
        `:"position"!==this.config.position.label.placement||t?void 0:F`
          <text id="rs-label" style="transform-origin:center;transform-box: fill-box;">
            <tspan class="${Et(this.classes.label)}" data-placement="position" x="${this.svg.label.cx}" y="${this.svg.label.cy}"
            style="${rt(this.styles.label)}">${this.renderValue?this.renderValue:""}</tspan>
            ${this.renderValue?this._renderUom():""}
          </text>
          `}this.svg.thumb.cx=t,this.svg.thumb.cy=e;const i=[];return i.push(F`
      <rect id="capture" class="${Et(this.classes.capture)}" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}"
      width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.track.radius}"          
      />

      <rect id="rs-track" class="${Et(this.classes.track)}" x="${this.svg.track.x1}" y="${this.svg.track.y1}"
        width="${this.svg.track.width}" height="${this.svg.track.height}" rx="${this.svg.track.radius}"
        style="${rt(this.styles.track)}"
      />

      ${function(){return this.config.show.active?"horizontal"===this.config.position.orientation?F`
          <rect id="active-track" class="${Et(this.classes.active)}" x="${this.svg.activeTrack.x1}" y="${this.svg.activeTrack.y1}"
            width="${Math.abs(this.svg.thumb.x1-this.svg.activeTrack.x1+t+this.svg.thumb.width/2)}" height="${this.svg.activeTrack.height}" rx="${this.svg.activeTrack.radius}"
            style="${rt(this.styles.active)}" touch-action="none"
          />`:F`
          <rect id="active-track" class="${Et(this.classes.active)}" x="${this.svg.activeTrack.x1}" y="${e}"
            height="${Math.abs(this.svg.activeTrack.y1+e-this.svg.thumb.height)}" width="${this.svg.activeTrack.width}" rx="${this.svg.activeTrack.radius}"
            style="${rt(this.styles.active)}"
          />`:F``}.call(this)}
      ${function(){return F`
        <g id="rs-thumb-group" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}" style="transform:translate(${t}px, ${e}px);">
          <g style="transform-origin:center;transform-box: fill-box;">
            <rect id="rs-thumb" class="${Et(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
              width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
              style="${rt(this.styles.thumb)}"
            />
            </g>
            ${s.call(this,!0)} 
        </g>
      `}.call(this)}
      ${s.call(this,!1)}


      `),i}render(){return F`
      <svg xmlns="http://www.w3.org/2000/svg" id="rangeslider-${this.toolId}" overflow="visible"
        touch-action="none" style="touch-action:none; pointer-events:none;"
      >
        ${this._renderRangeSlider()}
      </svg>
    `}}class Jt extends Ot{constructor(t,e,s){super(t,xt.mergeDeep({position:{cx:50,cy:50,width:50,height:50,rx:0},classes:{tool:{"sak-rectangle":!0,hover:!0},rectangle:{"sak-rectangle__rectangle":!0}},styles:{rectangle:{}}},e),s),this.svg.rx=e.position.rx?wt.calculateSvgDimension(e.position.rx):0,this.classes.rectangle={},this.styles.rectangle={},this.dev.debug&&console.log("RectangleTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderRectangle(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.rectangle),F`
      <rect class="${Et(this.classes.rectangle)}"
        x="${this.svg.x}" y="${this.svg.y}" width="${this.svg.width}" height="${this.svg.height}" rx="${this.svg.rx}"
        style="${rt(this.styles.rectangle)}"/>
      `}render(){return F`
      <g id="rectangle-${this.toolId}" class="${Et(this.classes.tool)}" transform-origin="${this.svg.cx}px ${this.svg.cy}px"
        style="${rt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderRectangle()}
      </g>
    `}}class Yt extends Ot{constructor(t,e,s){super(t,xt.mergeDeep({position:{cx:50,cy:50,width:50,height:50,radius:{all:0}},classes:{tool:{"sak-rectex":!0,hover:!0},rectex:{"sak-rectex__rectex":!0}},styles:{tool:{},rectex:{}}},e),s),this.classes.tool={},this.classes.rectex={},this.styles.tool={},this.styles.rectex={};const i=Math.min(this.svg.height,this.svg.width)/2;let o=0;o=wt.calculateSvgDimension(this.config.position.radius.all),this.svg.radiusTopLeft=+Math.min(i,Math.max(0,wt.calculateSvgDimension(this.config.position.radius.top_left||this.config.position.radius.left||this.config.position.radius.top||o)))||0,this.svg.radiusTopRight=+Math.min(i,Math.max(0,wt.calculateSvgDimension(this.config.position.radius.top_right||this.config.position.radius.right||this.config.position.radius.top||o)))||0,this.svg.radiusBottomLeft=+Math.min(i,Math.max(0,wt.calculateSvgDimension(this.config.position.radius.bottom_left||this.config.position.radius.left||this.config.position.radius.bottom||o)))||0,this.svg.radiusBottomRight=+Math.min(i,Math.max(0,wt.calculateSvgDimension(this.config.position.radius.bottom_right||this.config.position.radius.right||this.config.position.radius.bottom||o)))||0,this.dev.debug&&console.log("RectangleToolEx constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderRectangleEx(){this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(this.styles),this.MergeAnimationStyleIfChanged(),this.config.hasOwnProperty("csnew")?this.MergeColorFromState2(this.styles.rectex,"rectex"):this.MergeColorFromState(this.styles.rectex),this.counter||(this.counter=0),this.counter+=1;const t=F`
      <g class="${Et(this.classes.rectex)}" id="rectex-${this.toolId}">
        <path  d="
            M ${this.svg.x+this.svg.radiusTopLeft} ${this.svg.y}
            h ${this.svg.width-this.svg.radiusTopLeft-this.svg.radiusTopRight}
            q ${this.svg.radiusTopRight} 0 ${this.svg.radiusTopRight} ${this.svg.radiusTopRight}
            v ${this.svg.height-this.svg.radiusTopRight-this.svg.radiusBottomRight}
            q 0 ${this.svg.radiusBottomRight} -${this.svg.radiusBottomRight} ${this.svg.radiusBottomRight}
            h -${this.svg.width-this.svg.radiusBottomRight-this.svg.radiusBottomLeft}
            q -${this.svg.radiusBottomLeft} 0 -${this.svg.radiusBottomLeft} -${this.svg.radiusBottomLeft}
            v -${this.svg.height-this.svg.radiusBottomLeft-this.svg.radiusTopLeft}
            q 0 -${this.svg.radiusTopLeft} ${this.svg.radiusTopLeft} -${this.svg.radiusTopLeft}
            "
            counter="${this.counter}" 
            style="${rt(this.styles.rectex)}"/>
      </g>
      `;return F`${t}`}render(){return F`
      <g id="rectex-${this.toolId}"
        class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderRectangleEx()}
      </g>
    `}}class Xt extends Ot{constructor(t,e,s){super(t,xt.mergeDeep({position:{cx:50,cy:50,radius:50,side_count:6,side_skip:1,angle_offset:0},classes:{tool:{"sak-polygon":!0,hover:!0},regpoly:{"sak-polygon__regpoly":!0}},styles:{tool:{},regpoly:{}}},e),s),this.svg.radius=wt.calculateSvgDimension(e.position.radius),this.classes.regpoly={},this.styles.regpoly={},this.dev.debug&&console.log("RegPolyTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderRegPoly(){return this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.regpoly),F`
      <path class="${Et(this.classes.regpoly)}"
        d="${function(t,e,s,i,o,a){const n=2*Math.PI/t;let r,h,l=i+n,c="";for(let d=0;d<t;d++)l+=e*n,r=o+~~(s*Math.cos(l)),h=a+~~(s*Math.sin(l)),c+=`${(0===d?"M":"L")+r} ${h} `,d*e%t==0&&d>0&&(l+=n,r=o+~~(s*Math.cos(l)),h=a+~~(s*Math.sin(l)),c+=`M${r} ${h} `);return c+="z",c}(this.config.position.side_count,this.config.position.side_skip,this.svg.radius,this.config.position.angle_offset,this.svg.cx,this.svg.cy)}"
        style="${rt(this.styles.regpoly)}"
      />
      `}render(){return F`
      <g "" id="regpoly-${this.toolId}" class="${Et(this.classes.tool)}" transform-origin="${this.svg.cx} ${this.svg.cy}"
        style="${rt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderRegPoly()}
      </g>
    `}}class Zt extends Ot{constructor(t,e,s){super(t,xt.mergeDeep({position:{cx:50,cy:50,radius:45,width:3,margin:1.5},color:"var(--primary-color)",classes:{tool:{"sak-segarc":!0},foreground:{},background:{}},styles:{tool:{},foreground:{},background:{}},segments:{},colorstops:[],scale:{min:0,max:100,width:2,offset:-3.5},show:{style:"fixedcolor",scale:!1},isScale:!1,animation:{duration:1.5}},e),s),this.dev.performance&&console.time(`--\x3e ${this.toolId} PERFORMANCE SegmentedArcTool::constructor`),this.svg.radius=wt.calculateSvgDimension(e.position.radius),this.svg.radiusX=wt.calculateSvgDimension(e.position.radius_x||e.position.radius),this.svg.radiusY=wt.calculateSvgDimension(e.position.radius_y||e.position.radius),this.svg.segments={},this.svg.segments.gap=wt.calculateSvgDimension(this.config.segments.gap),this.svg.scale_offset=wt.calculateSvgDimension(this.config.scale.offset),this._firstUpdatedCalled=!1,this._stateValue=null,this._stateValuePrev=null,this._stateValueIsDirty=!1,this._renderFrom=null,this._renderTo=null,this.rAFid=null,this.cancelAnimation=!1,this.arcId=null,this._cache=[],this._segmentAngles=[],this._segments={},this._arc={},this._arc.size=Math.abs(this.config.position.end_angle-this.config.position.start_angle),this._arc.clockwise=this.config.position.end_angle>this.config.position.start_angle,this._arc.direction=this._arc.clockwise?1:-1;let i={},o=null;if(this.config.segments.colorlist?.template&&(o=this.config.segments.colorlist,this._card.lovelace.config.sak_user_templates.templates[o.template.name]&&(this.dev.debug&&console.log("SegmentedArcTool::constructor - templates colorlist found",o.template.name),i=St.replaceVariables2(o.template.variables,this._card.lovelace.config.sak_user_templates.templates[o.template.name]),this.config.segments.colorlist=i)),"fixedcolor"===this.config.show.style);else if("colorlist"===this.config.show.style){this._segments.count=this.config.segments.colorlist.colors.length,this._segments.size=this._arc.size/this._segments.count,this._segments.gap="undefined"!==this.config.segments.colorlist.gap?this.config.segments.colorlist.gap:1,this._segments.sizeList=[];for(var a=0;a<this._segments.count;a++)this._segments.sizeList[a]=this._segments.size;var n=0;for(a=0;a<this._segments.count;a++)this._segmentAngles[a]={boundsStart:this.config.position.start_angle+n*this._arc.direction,boundsEnd:this.config.position.start_angle+(n+this._segments.sizeList[a])*this._arc.direction,drawStart:this.config.position.start_angle+n*this._arc.direction+this._segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(n+this._segments.sizeList[a])*this._arc.direction-this._segments.gap*this._arc.direction},n+=this._segments.sizeList[a];this.dev.debug&&console.log("colorstuff - COLORLIST",this._segments,this._segmentAngles)}else if("colorstops"===this.config.show.style){this._segments.colorStops={},Object.keys(this.config.segments.colorstops.colors).forEach((t=>{t>=this.config.scale.min&&t<=this.config.scale.max&&(this._segments.colorStops[t]=this.config.segments.colorstops.colors[t])})),this._segments.sortedStops=Object.keys(this._segments.colorStops).map((t=>Number(t))).sort(((t,e)=>t-e)),void 0===this._segments.colorStops[this.config.scale.max]&&(this._segments.colorStops[this.config.scale.max]=this._segments.colorStops[this._segments.sortedStops[this._segments.sortedStops.length-1]],this._segments.sortedStops=Object.keys(this._segments.colorStops).map((t=>Number(t))).sort(((t,e)=>t-e))),this._segments.count=this._segments.sortedStops.length-1,this._segments.gap="undefined"!==this.config.segments.colorstops.gap?this.config.segments.colorstops.gap:1;let t=this.config.scale.min;const e=this.config.scale.max-this.config.scale.min;this._segments.sizeList=[];for(a=0;a<this._segments.count;a++){const s=this._segments.sortedStops[a+1]-t;t+=s;const i=s/e*this._arc.size;this._segments.sizeList[a]=i}for(n=0,a=0;a<this._segments.count;a++)this._segmentAngles[a]={boundsStart:this.config.position.start_angle+n*this._arc.direction,boundsEnd:this.config.position.start_angle+(n+this._segments.sizeList[a])*this._arc.direction,drawStart:this.config.position.start_angle+n*this._arc.direction+this._segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(n+this._segments.sizeList[a])*this._arc.direction-this._segments.gap*this._arc.direction},n+=this._segments.sizeList[a],this.dev.debug&&console.log("colorstuff - COLORSTOPS++ segments",n,this._segmentAngles[a]);this.dev.debug&&console.log("colorstuff - COLORSTOPS++",this._segments,this._segmentAngles,this._arc.direction,this._segments.count)}else this.config.show.style;if(this.config.isScale)this._stateValue=this.config.scale.max;else if(this.config.show.scale){const t=xt.mergeDeep(this.config);t.id+="-scale",t.show.scale=!1,t.isScale=!0,t.position.width=this.config.scale.width,t.position.radius=this.config.position.radius-this.config.position.width/2+t.position.width/2+this.config.scale.offset,t.position.radius_x=(this.config.position.radius_x||this.config.position.radius)-this.config.position.width/2+t.position.width/2+this.config.scale.offset,t.position.radius_y=(this.config.position.radius_y||this.config.position.radius)-this.config.position.width/2+t.position.width/2+this.config.scale.offset,this._segmentedArcScale=new Zt(this,t,s)}else this._segmentedArcScale=null;if(this.skipOriginal="colorstops"===this.config.show.style||"colorlist"===this.config.show.style,this.skipOriginal&&(this.config.isScale&&(this._stateValuePrev=this._stateValue),this._initialDraw=!1),this._arc.parts=Math.floor(this._arc.size/Math.abs(this.config.segments.dash)),this._arc.partsPartialSize=this._arc.size-this._arc.parts*this.config.segments.dash,this.skipOriginal)this._arc.parts=this._segmentAngles.length,this._arc.partsPartialSize=0;else{for(a=0;a<this._arc.parts;a++)this._segmentAngles[a]={boundsStart:this.config.position.start_angle+a*this.config.segments.dash*this._arc.direction,boundsEnd:this.config.position.start_angle+(a+1)*this.config.segments.dash*this._arc.direction,drawStart:this.config.position.start_angle+a*this.config.segments.dash*this._arc.direction+this.config.segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(a+1)*this.config.segments.dash*this._arc.direction-this.config.segments.gap*this._arc.direction};this._arc.partsPartialSize>0&&(this._segmentAngles[a]={boundsStart:this.config.position.start_angle+a*this.config.segments.dash*this._arc.direction,boundsEnd:this.config.position.start_angle+(a+0)*this.config.segments.dash*this._arc.direction+this._arc.partsPartialSize*this._arc.direction,drawStart:this.config.position.start_angle+a*this.config.segments.dash*this._arc.direction+this.config.segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(a+0)*this.config.segments.dash*this._arc.direction+this._arc.partsPartialSize*this._arc.direction-this.config.segments.gap*this._arc.direction})}this.starttime=null,this.dev.debug&&console.log("SegmentedArcTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config),this.dev.debug&&console.log("SegmentedArcTool - init",this.toolId,this.config.isScale,this._segmentAngles),this.dev.performance&&console.timeEnd(`--\x3e ${this.toolId} PERFORMANCE SegmentedArcTool::constructor`)}get objectId(){return this.toolId}set value(t){if(this.dev.debug&&console.log("SegmentedArcTool - set value IN"),this.config.isScale)return!1;if(this._stateValue===t)return!1;return super.value=t}firstUpdated(t){this.dev.debug&&console.log("SegmentedArcTool - firstUpdated IN with _arcId/id",this._arcId,this.toolId,this.config.isScale),this._arcId=this._card.shadowRoot.getElementById("arc-".concat(this.toolId)),this._firstUpdatedCalled=!0,this._segmentedArcScale?.firstUpdated(t),this.skipOriginal&&(this.dev.debug&&console.log("RENDERNEW - firstUpdated IN with _arcId/id/isScale/scale/connected",this._arcId,this.toolId,this.config.isScale,this._segmentedArcScale,this._card.connected),this.config.isScale||(this._stateValuePrev=null),this._initialDraw=!0,this._card.requestUpdate())}updated(t){this.dev.debug&&console.log("SegmentedArcTool - updated IN")}render(){return this.dev.debug&&console.log("SegmentedArcTool RENDERNEW - Render IN"),F`
      <g "" id="arc-${this.toolId}"
        class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}"
      >
        <g >
          ${this._renderSegments()}
          </g>
        ${this._renderScale()}
      </g>
    `}_renderScale(){if(this._segmentedArcScale)return this._segmentedArcScale.render()}_renderSegments(){if(this.skipOriginal){let t,e;const s=this.svg.width,i=this.svg.radiusX,o=this.svg.radiusY;let a;this.dev.debug&&console.log("RENDERNEW - IN _arcId, firstUpdatedCalled",this._arcId,this._firstUpdatedCalled);const n=wt.calculateValueBetween(this.config.scale.min,this.config.scale.max,this._stateValue),r=wt.calculateValueBetween(this.config.scale.min,this.config.scale.max,this._stateValuePrev);this.dev.debug&&(this._stateValuePrev||console.log("*****UNDEFINED",this._stateValue,this._stateValuePrev,r)),n!==r&&this.dev.debug&&console.log("RENDERNEW _renderSegments diff value old new",this.toolId,r,n),t=n*this._arc.size*this._arc.direction+this.config.position.start_angle,e=r*this._arc.size*this._arc.direction+this.config.position.start_angle;const h=[];if(!this.config.isScale)for(let l=0;l<this._segmentAngles.length;l++)a=this.buildArcPath(this._segmentAngles[l].drawStart,this._segmentAngles[l].drawEnd,this._arc.clockwise,this.svg.radiusX,this.svg.radiusY,this.svg.width),h.push(F`<path id="arc-segment-bg-${this.toolId}-${l}" class="sak-segarc__background"
                              style="${rt(this.config.styles.background)}"
                              d="${a}"
                              />`);if(this._firstUpdatedCalled){this.dev.debug&&console.log("RENDERNEW _arcId DOES exist",this._arcId,this.toolId,this._firstUpdatedCalled),this._cache.forEach(((t,e)=>{if(a=t,this.config.isScale){let t=this.config.color;"colorlist"===this.config.show.style&&(t=this.config.segments.colorlist.colors[e]),"colorstops"===this.config.show.style&&(t=this._segments.colorStops[this._segments.sortedStops[e]]),this.styles.foreground[e]||(this.styles.foreground[e]=xt.mergeDeep(this.config.styles.foreground)),this.styles.foreground[e].fill=t}h.push(F`<path id="arc-segment-${this.toolId}-${e}" class="sak-segarc__foreground"
                            style="${rt(this.styles.foreground[e])}"
                            d="${a}"
                            />`)}));const c={};function d(t,e){let n,r;t=t||(new Date).getTime();c.startTime||(c.startTime=t,c.runningAngle=c.fromAngle),e.debug&&console.log("RENDERNEW - in animateSegmentsNEW",e.toolId,c);const h=t-c.startTime;var l;c.progress=Math.min(h/c.duration,1),c.progress=(l=c.progress,--l**5+1);const g=e._arc.clockwise?c.toAngle>c.fromAngle:c.fromAngle>c.toAngle;c.frameAngle=c.fromAngle+(c.toAngle-c.fromAngle)*c.progress,n=e._segmentAngles.findIndex(((t,s)=>e._arc.clockwise?c.frameAngle<=t.boundsEnd&&c.frameAngle>=t.boundsStart:c.frameAngle<=t.boundsStart&&c.frameAngle>=t.boundsEnd)),-1===n&&(console.log("RENDERNEW animateSegments frameAngle not found",c,e._segmentAngles),console.log("config",e.config)),r=e._segmentAngles.findIndex(((t,s)=>e._arc.clockwise?c.runningAngle<=t.boundsEnd&&c.runningAngle>=t.boundsStart:c.runningAngle<=t.boundsStart&&c.runningAngle>=t.boundsEnd));do{const t=e._segmentAngles[r].drawStart;var u=e._arc.clockwise?Math.min(e._segmentAngles[r].boundsEnd,c.frameAngle):Math.max(e._segmentAngles[r].boundsEnd,c.frameAngle);const n=e._arc.clockwise?Math.min(e._segmentAngles[r].drawEnd,c.frameAngle):Math.max(e._segmentAngles[r].drawEnd,c.frameAngle);let h;a=e.buildArcPath(t,n,e._arc.clockwise,i,o,s),e.myarc||(e.myarc={}),e.as||(e.as={});const l="arc-segment-".concat(e.toolId).concat("-").concat(r);if(e.as[r]||(e.as[r]=e._card.shadowRoot.getElementById(l)),h=e.as[r],e.myarc[r]=l,h&&(h.setAttribute("d",a),"colorlist"===e.config.show.style&&(h.style.fill=e.config.segments.colorlist.colors[r],e.styles.foreground[r].fill=e.config.segments.colorlist.colors[r]),e.config.show.lastcolor)){var m;const t=e._arc.clockwise?e._segmentAngles[r].drawStart:e._segmentAngles[r].drawEnd,s=e._arc.clockwise?e._segmentAngles[r].drawEnd:e._segmentAngles[r].drawStart,i=Math.min(Math.max(0,(u-t)/(s-t)),1);if("colorstops"===e.config.show.style?m=Dt.getGradientValue(e._segments.colorStops[e._segments.sortedStops[r]],e._segments.colorStops[e._segments.sortedStops[r]],i):"colorlist"===e.config.show.style&&(m=e.config.segments.colorlist.colors[r]),e.styles.foreground[0].fill=m,e.as[0].style.fill=m,r>0)for(let o=r;o>=0;o--)e.styles.foreground[o].fill!==m&&(e.styles.foreground[o].fill=m,e.as[o].style.fill=m),e.styles.foreground[o].fill=m,e.as[o].style.fill=m}e._cache[r]=a,c.frameAngle!==u&&(u+=1e-6*e._arc.direction);var p=r;r=e._segmentAngles.findIndex(((t,s)=>e._arc.clockwise?u<=t.boundsEnd&&u>=t.boundsStart:u<=t.boundsStart&&u>=t.boundsEnd)),g||p!==r&&(e.debug&&console.log("RENDERNEW movit - remove path",e.toolId,p),e._arc.clockwise,h.removeAttribute("d"),e._cache[p]=null),c.runningAngle=u,e.debug&&console.log("RENDERNEW - animation loop tween",e.toolId,c,r,p)}while(c.runningAngle!==c.frameAngle);1!==c.progress?e.rAFid=requestAnimationFrame((t=>{d(t,e)})):(c.startTime=null,e.debug&&console.log("RENDERNEW - animation loop ENDING tween",e.toolId,c,r,p))}const g=this;return!0===this._card.connected&&this._renderTo!==this._stateValue&&(this._renderTo=this._stateValue,this.rAFid&&cancelAnimationFrame(this.rAFid),c.fromAngle=e,c.toAngle=t,c.runningAngle=e,c.duration=Math.min(Math.max(this._initialDraw?100:500,this._initialDraw?16:1e3*this.config.animation.duration),5e3),c.startTime=null,this.dev.debug&&console.log("RENDERNEW - tween",this.toolId,c),this.rAFid=requestAnimationFrame((t=>{d(t,g)})),this._initialDraw=!1),F`${h}`}this.dev.debug&&console.log("RENDERNEW _arcId does NOT exist",this._arcId,this.toolId);for(let u=0;u<this._segmentAngles.length;u++){a=this.buildArcPath(this._segmentAngles[u].drawStart,this._segmentAngles[u].drawEnd,this._arc.clockwise,this.svg.radiusX,this.svg.radiusY,this.config.isScale?this.svg.width:0),this._cache[u]=a;let m=this.config.color;if("colorlist"===this.config.show.style&&(m=this.config.segments.colorlist.colors[u]),"colorstops"===this.config.show.style&&(m=this._segments.colorStops[this._segments.sortedStops[u]]),this.styles.foreground||(this.styles.foreground={}),this.styles.foreground[u]||(this.styles.foreground[u]=xt.mergeDeep(this.config.styles.foreground)),this.styles.foreground[u].fill=m,this.config.show.lastcolor&&u>0)for(let p=u-1;p>0;p--)this.styles.foreground[p].fill=m;h.push(F`<path id="arc-segment-${this.toolId}-${u}" class="arc__segment"
                            style="${rt(this.styles.foreground[u])}"
                            d="${a}"
                            />`)}return this.dev.debug&&console.log("RENDERNEW - svgItems",h,this._firstUpdatedCalled),F`${h}`}}polarToCartesian(t,e,s,i,o){const a=(o-90)*Math.PI/180;return{x:t+s*Math.cos(a),y:e+i*Math.sin(a)}}buildArcPath(t,e,s,i,o,a){const n=this.polarToCartesian(this.svg.cx,this.svg.cy,i,o,e),r=this.polarToCartesian(this.svg.cx,this.svg.cy,i,o,t),h=Math.abs(e-t)<=180?"0":"1",l=s?"0":"1",c=i-a,d=o-a,g=this.polarToCartesian(this.svg.cx,this.svg.cy,c,d,e),u=this.polarToCartesian(this.svg.cx,this.svg.cy,c,d,t);return["M",n.x,n.y,"A",i,o,0,h,l,r.x,r.y,"L",u.x,u.y,"A",c,d,0,h,"0"===l?"1":"0",g.x,g.y,"Z"].join(" ")}}class Kt extends Ot{constructor(t,e,s){super(t,xt.mergeDeep({position:{cx:50,cy:50,height:25,width:25,margin:.5,orientation:"vertical"},hours:24,barhours:1,color:"var(--primary-color)",classes:{tool:{"sak-barchart":!0,hover:!0},bar:{},line:{"sak-barchart__line":!0,hover:!0}},styles:{tool:{},line:{},bar:{}},colorstops:[],show:{style:"fixedcolor"}},e),s),this.svg.margin=wt.calculateSvgDimension(this.config.position.margin);const i="vertical"===this.config.position.orientation?this.svg.width:this.svg.height;this.svg.barWidth=(i-(this.config.hours/this.config.barhours-1)*this.svg.margin)/(this.config.hours/this.config.barhours),this._data=[],this._bars=[],this._scale={},this._needsRendering=!1,this.classes.tool={},this.classes.bar={},this.styles.tool={},this.styles.line={},this.stylesBar={},this.dev.debug&&console.log("SparkleBarChart constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}computeMinMax(){let t=this._series[0],e=this._series[0];for(let s=1,i=this._series.length;s<i;s++){const i=this._series[s];t=i<t?i:t,e=i>e?i:e}this._scale.min=t,this._scale.max=e,this._scale.size=e-t,this._scale.size=1.05*(e-t),this._scale.min=e-this._scale.size}set data(t){this._series=Object.assign(t),this.computeBars(),this._needsRendering=!0}set series(t){this._series=Object.assign(t),this.computeBars(),this._needsRendering=!0}hasSeries(){return this.defaultEntityIndex()}computeBars({_bars:t}=this){this.computeMinMax(),"minmaxgradient"===this.config.show.style&&(this.colorStopsMinMax={},this.colorStopsMinMax={[this._scale.min.toString()]:this.config.minmaxgradient.colors.min,[this._scale.max.toString()]:this.config.minmaxgradient.colors.max}),"vertical"===this.config.position.orientation?(this.dev.debug&&console.log("bar is vertical"),this._series.forEach(((e,s)=>{t[s]||(t[s]={}),t[s].length=0===this._scale.size?0:(e-this._scale.min)/this._scale.size*this.svg.height,t[s].x1=this.svg.x+this.svg.barWidth/2+(this.svg.barWidth+this.svg.margin)*s,t[s].x2=t[s].x1,t[s].y1=this.svg.y+this.svg.height,t[s].y2=t[s].y1-this._bars[s].length,t[s].dataLength=this._bars[s].length}))):"horizontal"===this.config.position.orientation?(this.dev.debug&&console.log("bar is horizontal"),this._data.forEach(((e,s)=>{t[s]||(t[s]={}),t[s].length=0===this._scale.size?0:(e-this._scale.min)/this._scale.size*this.svg.width,t[s].y1=this.svg.y+this.svg.barWidth/2+(this.svg.barWidth+this.svg.margin)*s,t[s].y2=t[s].y1,t[s].x1=this.svg.x,t[s].x2=t[s].x1+this._bars[s].length,t[s].dataLength=this._bars[s].length}))):this.dev.debug&&console.log("SparklineBarChartTool - unknown barchart orientation (horizontal or vertical)")}_renderBars(){const t=[];if(0!==this._bars.length)return this.dev.debug&&console.log("_renderBars IN",this.toolId),this._bars.forEach(((e,s)=>{this.dev.debug&&console.log("_renderBars - bars",e,s);const i=this.getColorFromState(this._series[s]);this.stylesBar[s]||(this.stylesBar[s]={...this.config.styles.bar}),this._bars[s].y2||console.log("sparklebarchart y2 invalid",this._bars[s]),t.push(F`
          <line id="line-segment-${this.toolId}-${s}" class="${Et(this.config.classes.line)}"
                    style="${rt(this.stylesBar[s])}"
                    x1="${this._bars[s].x1}"
                    x2="${this._bars[s].x2}"
                    y1="${this._bars[s].y1}"
                    y2="${this._bars[s].y2}"
                    data-length="${this._bars[s].dataLength}"
                    stroke="${i}"
                    stroke-width="${this.svg.barWidth}"
                    />
          `)})),this.dev.debug&&console.log("_renderBars OUT",this.toolId),F`${t}`}render(){return F`
        <g id="barchart-${this.toolId}"
          class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}"
          @click=${t=>this.handleTapEvent(t,this.config)}>
          ${this._renderBars()}
        </g>
      `}}class Qt extends Ot{constructor(t,e,s){const i={position:{cx:50,cy:50,orientation:"horizontal",track:{width:16,height:7,radius:3.5},thumb:{width:9,height:9,radius:4.5,offset:4.5}},classes:{tool:{"sak-switch":!0,hover:!0},track:{"sak-switch__track":!0},thumb:{"sak-switch__thumb":!0}},styles:{tool:{overflow:"visible"},track:{},thumb:{}}},o={animations:[{state:"on",id:1,styles:{track:{fill:"var(--switch-checked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-checked-button-color)",transform:"translateX(4.5em)","pointer-events":"auto"}}},{state:"off",id:0,styles:{track:{fill:"var(--switch-unchecked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-unchecked-button-color)",transform:"translateX(-4.5em)","pointer-events":"auto"}}}]},a={animations:[{state:"on",id:1,styles:{track:{fill:"var(--switch-checked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-checked-button-color)",transform:"translateY(-4.5em)","pointer-events":"auto"}}},{state:"off",id:0,styles:{track:{fill:"var(--switch-unchecked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-unchecked-button-color)",transform:"translateY(4.5em)","pointer-events":"auto"}}}]};if(super(t,xt.mergeDeep(i,e),s),!["horizontal","vertical"].includes(this.config.position.orientation))throw Error("SwitchTool::constructor - invalid orientation [vertical, horizontal] = ",this.config.position.orientation);switch(this.svg.track={},this.svg.track.radius=wt.calculateSvgDimension(this.config.position.track.radius),this.svg.thumb={},this.svg.thumb.radius=wt.calculateSvgDimension(this.config.position.thumb.radius),this.svg.thumb.offset=wt.calculateSvgDimension(this.config.position.thumb.offset),this.config.position.orientation){default:case"horizontal":this.config=xt.mergeDeep(i,o,e),this.svg.track.width=wt.calculateSvgDimension(this.config.position.track.width),this.svg.track.height=wt.calculateSvgDimension(this.config.position.track.height),this.svg.thumb.width=wt.calculateSvgDimension(this.config.position.thumb.width),this.svg.thumb.height=wt.calculateSvgDimension(this.config.position.thumb.height),this.svg.track.x1=this.svg.cx-this.svg.track.width/2,this.svg.track.y1=this.svg.cy-this.svg.track.height/2,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2;break;case"vertical":this.config=xt.mergeDeep(i,a,e),this.svg.track.width=wt.calculateSvgDimension(this.config.position.track.height),this.svg.track.height=wt.calculateSvgDimension(this.config.position.track.width),this.svg.thumb.width=wt.calculateSvgDimension(this.config.position.thumb.height),this.svg.thumb.height=wt.calculateSvgDimension(this.config.position.thumb.width),this.svg.track.x1=this.svg.cx-this.svg.track.width/2,this.svg.track.y1=this.svg.cy-this.svg.track.height/2,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2}this.classes.track={},this.classes.thumb={},this.styles.track={},this.styles.thumb={},this.dev.debug&&console.log("SwitchTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderSwitch(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(this.styles),F`
      <g>
        <rect class="${Et(this.classes.track)}" x="${this.svg.track.x1}" y="${this.svg.track.y1}"
          width="${this.svg.track.width}" height="${this.svg.track.height}" rx="${this.svg.track.radius}"
          style="${rt(this.styles.track)}"
        />
        <rect class="${Et(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
          width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
          style="${rt(this.styles.thumb)}"
        />
      </g>
      `}render(){return F`
      <g id="switch-${this.toolId}" transform-origin="${this.svg.cx} ${this.svg.cy}"
        class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderSwitch()}
      </g>
    `}}class te extends Ot{constructor(t,e,s){super(t,xt.mergeDeep({classes:{tool:{"sak-text":!0},text:{"sak-text__text":!0,hover:!1}},styles:{tool:{},text:{}}},e),s),this.EnableHoverForInteraction(),this.text=this.config.text,this.classes.tool={},this.classes.text={},this.styles.tool={},this.styles.text={},this.dev.debug&&console.log("TextTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_renderText(){return this.MergeAnimationClassIfChanged(),this.MergeColorFromState(this.styles.text),this.MergeAnimationStyleIfChanged(),F`
        <text>
          <tspan class="${Et(this.classes.text)}" x="${this.svg.cx}" y="${this.svg.cy}" style="${rt(this.styles.text)}">${this.text}</tspan>
        </text>
      `}render(){return F`
        <g id="text-${this.toolId}"
          class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}"
          @click=${t=>this.handleTapEvent(t,this.config)}>
          ${this._renderText()}
        </g>
      `}}function ee(t,e,s){if(s||2===arguments.length)for(var i,o=0,a=e.length;o<a;o++)!i&&o in e||(i||(i=Array.prototype.slice.call(e,0,o)),i[o]=e[o]);return t.concat(i||Array.prototype.slice.call(e))}
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */var se=/; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g,ie=/\\([\u000b\u0020-\u00ff])/g,oe=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/,ae=function(t){if(!t)throw new TypeError("argument string is required");var e="object"==typeof t?function(t){var e;"function"==typeof t.getHeader?e=t.getHeader("content-type"):"object"==typeof t.headers&&(e=t.headers&&t.headers["content-type"]);if("string"!=typeof e)throw new TypeError("content-type header is missing from object");return e}(t):t;if("string"!=typeof e)throw new TypeError("argument string is required to be a string");var s=e.indexOf(";"),i=-1!==s?e.slice(0,s).trim():e.trim();if(!oe.test(i))throw new TypeError("invalid media type");var o=new ne(i.toLowerCase());if(-1!==s){var a,n,r;for(se.lastIndex=s;n=se.exec(e);){if(n.index!==s)throw new TypeError("invalid parameter format");s+=n[0].length,a=n[1].toLowerCase(),34===(r=n[2]).charCodeAt(0)&&-1!==(r=r.slice(1,-1)).indexOf("\\")&&(r=r.replace(ie,"$1")),o.parameters[a]=r}if(s!==e.length)throw new TypeError("invalid parameter format")}return o};function ne(t){this.parameters=Object.create(null),this.type=t}var re=new Map,he=function(t){return t.cloneNode(!0)},le=function(){return"file:"===window.location.protocol},ce=function(t,e,s){var i=new XMLHttpRequest;i.onreadystatechange=function(){try{if(!/\.svg/i.test(t)&&2===i.readyState){var e=i.getResponseHeader("Content-Type");if(!e)throw new Error("Content type not found");var o=ae(e).type;if("image/svg+xml"!==o&&"text/plain"!==o)throw new Error("Invalid content type: ".concat(o))}if(4===i.readyState){if(404===i.status||null===i.responseXML)throw new Error(le()?"Note: SVG injection ajax calls do not work locally without adjusting security settings in your browser. Or consider using a local webserver.":"Unable to load SVG file: "+t);if(!(200===i.status||le()&&0===i.status))throw new Error("There was a problem injecting the SVG: "+i.status+" "+i.statusText);s(null,i)}}catch(a){if(i.abort(),!(a instanceof Error))throw a;s(a,i)}},i.open("GET",t),i.withCredentials=e,i.overrideMimeType&&i.overrideMimeType("text/xml"),i.send()},de={},ge=function(t,e){de[t]=de[t]||[],de[t].push(e)},ue=function(t,e,s){if(re.has(t)){var i=re.get(t);if(void 0===i)return void ge(t,s);if(i instanceof SVGSVGElement)return void s(null,he(i))}re.set(t,void 0),ge(t,s),ce(t,e,(function(e,s){var i;e?re.set(t,e):(null===(i=s.responseXML)||void 0===i?void 0:i.documentElement)instanceof SVGSVGElement&&re.set(t,s.responseXML.documentElement),function(t){for(var e=function(e,s){setTimeout((function(){if(Array.isArray(de[t])){var s=re.get(t),i=de[t][e];s instanceof SVGSVGElement&&i(null,he(s)),s instanceof Error&&i(s),e===de[t].length-1&&delete de[t]}}),0)},s=0,i=de[t].length;s<i;s++)e(s)}(t)}))},me=function(t,e,s){ce(t,e,(function(t,e){var i;t?s(t):(null===(i=e.responseXML)||void 0===i?void 0:i.documentElement)instanceof SVGSVGElement&&s(null,e.responseXML.documentElement)}))},pe=0,ve=[],fe={},ye="http://www.w3.org/1999/xlink",_e=function(t,e,s,i,o,a,n){var r=t.getAttribute("data-src")||t.getAttribute("src");if(r){if(-1!==ve.indexOf(t))return ve.splice(ve.indexOf(t),1),void(t=null);ve.push(t),t.setAttribute("src",""),(i?ue:me)(r,o,(function(i,o){if(!o)return ve.splice(ve.indexOf(t),1),t=null,void n(i);var h=t.getAttribute("id");h&&o.setAttribute("id",h);var l=t.getAttribute("title");l&&o.setAttribute("title",l);var c=t.getAttribute("width");c&&o.setAttribute("width",c);var d=t.getAttribute("height");d&&o.setAttribute("height",d);var g=Array.from(new Set(ee(ee(ee([],(o.getAttribute("class")||"").split(" "),!0),["injected-svg"],!1),(t.getAttribute("class")||"").split(" "),!0))).join(" ").trim();o.setAttribute("class",g);var u=t.getAttribute("style");u&&o.setAttribute("style",u),o.setAttribute("data-src",r);var m=[].filter.call(t.attributes,(function(t){return/^data-\w[\w-]*$/.test(t.name)}));if(Array.prototype.forEach.call(m,(function(t){t.name&&t.value&&o.setAttribute(t.name,t.value)})),s){var p,v,f,y,_,b={clipPath:["clip-path"],"color-profile":["color-profile"],cursor:["cursor"],filter:["filter"],linearGradient:["fill","stroke"],marker:["marker","marker-start","marker-mid","marker-end"],mask:["mask"],path:[],pattern:["fill","stroke"],radialGradient:["fill","stroke"]};Object.keys(b).forEach((function(t){p=t,f=b[t];for(var e=function(t,e){var s;y=v[t].id,_=y+"-"+ ++pe,Array.prototype.forEach.call(f,(function(t){for(var e=0,i=(s=o.querySelectorAll("["+t+'*="'+y+'"]')).length;e<i;e++){var a=s[e].getAttribute(t);a&&!a.match(new RegExp('url\\("?#'+y+'"?\\)'))||s[e].setAttribute(t,"url(#"+_+")")}}));for(var i=o.querySelectorAll("[*|href]"),a=[],n=0,r=i.length;n<r;n++){var h=i[n].getAttributeNS(ye,"href");h&&h.toString()==="#"+v[t].id&&a.push(i[n])}for(var l=0,c=a.length;l<c;l++)a[l].setAttributeNS(ye,"href","#"+_);v[t].id=_},s=0,i=(v=o.querySelectorAll(p+"[id]")).length;s<i;s++)e(s)}))}o.removeAttribute("xmlns:a");for(var x,w,S=o.querySelectorAll("script"),$=[],k=0,E=S.length;k<E;k++)(w=S[k].getAttribute("type"))&&"application/ecmascript"!==w&&"application/javascript"!==w&&"text/javascript"!==w||((x=S[k].innerText||S[k].textContent)&&$.push(x),o.removeChild(S[k]));if($.length>0&&("always"===e||"once"===e&&!fe[r])){for(var C=0,T=$.length;C<T;C++)new Function($[C])(window);fe[r]=!0}var I=o.querySelectorAll("style");if(Array.prototype.forEach.call(I,(function(t){t.textContent+=""})),o.setAttribute("xmlns","http://www.w3.org/2000/svg"),o.setAttribute("xmlns:xlink",ye),a(o),!t.parentNode)return ve.splice(ve.indexOf(t),1),t=null,void n(new Error("Parent node is null"));t.parentNode.replaceChild(o,t),ve.splice(ve.indexOf(t),1),t=null,n(null,o)}))}else n(new Error("Invalid data-src or src attribute"))};class be extends Ot{constructor(t,e,s){if(super(t,xt.mergeDeep({position:{cx:50,cy:50,height:50,width:50},options:{svginject:!0},styles:{usersvg:{},mask:{fill:"white"}}},e),s),this.images={},this.images=Object.assign({},...this.config.images),this.item={},this.item.image="default",this.imageCur="none",this.imagePrev="none",this.classes={},this.classes.tool={},this.classes.usersvg={},this.classes.mask={},this.styles={},this.styles.tool={},this.styles.usersvg={},this.styles.mask={},this.injector={},this.injector.svg=null,this.injector.cache=[],this.clipPath={},this.config.clip_path){this.svg.cp_cx=wt.calculateSvgCoordinate(this.config.clip_path.position.cx||this.config.position.cx,0),this.svg.cp_cy=wt.calculateSvgCoordinate(this.config.clip_path.position.cy||this.config.position.cy,0),this.svg.cp_height=wt.calculateSvgDimension(this.config.clip_path.position.height||this.config.position.height),this.svg.cp_width=wt.calculateSvgDimension(this.config.clip_path.position.width||this.config.position.width);const t=Math.min(this.svg.cp_height,this.svg.cp_width)/2;this.svg.radiusTopLeft=+Math.min(t,Math.max(0,wt.calculateSvgDimension(this.config.clip_path.position.radius.top_left||this.config.clip_path.position.radius.left||this.config.clip_path.position.radius.top||this.config.clip_path.position.radius.all)))||0,this.svg.radiusTopRight=+Math.min(t,Math.max(0,wt.calculateSvgDimension(this.config.clip_path.position.radius.top_right||this.config.clip_path.position.radius.right||this.config.clip_path.position.radius.top||this.config.clip_path.position.radius.all)))||0,this.svg.radiusBottomLeft=+Math.min(t,Math.max(0,wt.calculateSvgDimension(this.config.clip_path.position.radius.bottom_left||this.config.clip_path.position.radius.left||this.config.clip_path.position.radius.bottom||this.config.clip_path.position.radius.all)))||0,this.svg.radiusBottomRight=+Math.min(t,Math.max(0,wt.calculateSvgDimension(this.config.clip_path.position.radius.bottom_right||this.config.clip_path.position.radius.right||this.config.clip_path.position.radius.bottom||this.config.clip_path.position.radius.all)))||0}this.dev.debug&&console.log("UserSvgTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}updated(t){var e=this;this.config.options.svginject&&!this.injector.cache[this.imageCur]&&(this.injector.elementsToInject=this._card.shadowRoot.getElementById("usersvg-".concat(this.toolId)).querySelectorAll("svg[data-src]:not(.injected-svg)"),0!==this.injector.elementsToInject.length&&function(t,e){var s=void 0===e?{}:e,i=s.afterAll,o=void 0===i?function(){}:i,a=s.afterEach,n=void 0===a?function(){}:a,r=s.beforeEach,h=void 0===r?function(){}:r,l=s.cacheRequests,c=void 0===l||l,d=s.evalScripts,g=void 0===d?"never":d,u=s.httpRequestWithCredentials,m=void 0!==u&&u,p=s.renumerateIRIElements,v=void 0===p||p;if(t&&"length"in t)for(var f=0,y=0,_=t.length;y<_;y++)_e(t[y],g,v,c,m,h,(function(e,s){n(e,s),t&&"length"in t&&t.length===++f&&o(f)}));else t?_e(t,g,v,c,m,h,(function(e,s){n(e,s),o(1),t=null})):o(0)}(this.injector.elementsToInject,{afterAll(t){setTimeout((()=>{e._card.requestUpdate()}),0)},afterEach(t,s){if(t)throw t;e.injector.cache[e.imageCur]=s},beforeEach(t){t.removeAttribute("height"),t.removeAttribute("width")},cacheRequests:!1,evalScripts:"once",httpRequestWithCredentials:!1,renumerateIRIElements:!1}))}_renderUserSvg(){this.MergeAnimationStyleIfChanged();const t=St.getJsTemplateOrValue(this,this._stateValue,xt.mergeDeep(this.images));if(this.imagePrev=this.imageCur,this.imageCur=t[this.item.image],"none"===t[this.item.image])return F``;let e=this.injector.cache[this.imageCur],s=F``,i="",o="";return this.config.clip_path&&(i=`url(#clip-path-${this.toolId})`,o=`url(#mask-${this.toolId})`,s=F`
        <defs>
          <path  id="path-${this.toolId}"
            d="
              M ${this.svg.cp_cx+this.svg.radiusTopLeft+(this.svg.width-this.svg.cp_width)/2} ${this.svg.cp_cy+(this.svg.height-this.svg.cp_height)/2}
              h ${this.svg.cp_width-this.svg.radiusTopLeft-this.svg.radiusTopRight}
              a ${this.svg.radiusTopRight} ${this.svg.radiusTopRight} 0 0 1 ${this.svg.radiusTopRight} ${this.svg.radiusTopRight}
              v ${this.svg.cp_height-this.svg.radiusTopRight-this.svg.radiusBottomRight}
              a ${this.svg.radiusBottomRight} ${this.svg.radiusBottomRight} 0 0 1 -${this.svg.radiusBottomRight} ${this.svg.radiusBottomRight}
              h -${this.svg.cp_width-this.svg.radiusBottomRight-this.svg.radiusBottomLeft}
              a ${this.svg.radiusBottomLeft} ${this.svg.radiusBottomLeft} 0 0 1 -${this.svg.radiusBottomLeft} -${this.svg.radiusBottomLeft}
              v -${this.svg.cp_height-this.svg.radiusBottomLeft-this.svg.radiusTopLeft}
              a ${this.svg.radiusTopLeft} ${this.svg.radiusTopLeft}  0 0 1 ${this.svg.radiusTopLeft} -${this.svg.radiusTopLeft}
              ">
          </path>
          <clipPath id="clip-path-${this.toolId}">
            <use href="#path-${this.toolId}"/>
          </clipPath>
          <mask id="mask-${this.toolId}">
            <use href="#path-${this.toolId}" style="${rt(this.styles.mask)}"/>
          </mask>
        </defs>
        `),["png","jpg"].includes(t[this.item.image].substring(t[this.item.image].lastIndexOf(".")+1))?F`
        <svg class="sak-usersvg__image" x="${this.svg.x}" y="${this.svg.y}"
          style="${rt(this.styles.usersvg)}">
          "${s}"
          <image 
            clip-path="${i}" mask="${o}"
            href="${t[this.item.image]}"
            height="${this.svg.height}" width="${this.svg.width}"
          />
        </svg>
        `:e&&this.config.options.svginject?(e.classList.remove("hidden"),F`
        <svg x="${this.svg.x}" y="${this.svg.y}" style="${rt(this.styles.usersvg)}"
          height="${this.svg.height}" width="${this.svg.width}"
          clip-path="${i}"
          mask="${o}"
        >
          "${s}"
          ${e};
       </svg>
       `):F`
        <svg class="sak-usersvg__image ${this.config.options.svginject?"hidden":""}"
          data-id="usersvg-${this.toolId}" data-src="${t[this.item.image]}"
          x="${this.svg.x}" y="${this.svg.y}"
          style="${this.config.options.svginject?"":rt(this.styles.usersvg)}">
          "${s}"
          <image
            clip-path="${i}"
            mask="${o}"
            href="${t[this.item.image]}"
            height="${this.svg.height}" width="${this.svg.width}"
          />
        </svg>
      `}render(){return F`
      <g id="usersvg-${this.toolId}" overflow="visible"
        class="${Et(this.classes.tool)}" style="${rt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderUserSvg()}
      </g>
    `}}class xe{constructor(t,e){if(this.toolsetId=Math.random().toString(36).substr(2,9),this._card=t,this.dev={...this._card.dev},this.dev.performance&&console.time(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::constructor`),this.config=e,this.tools=[],this.palette={},this.palette.light={},this.palette.dark={},this.config.palette){const{paletteLight:t,paletteDark:e}=Dt.processPalette(this.config.palette);this.palette.light=t,this.palette.dark=e}this.svg={},this.svg.cx=wt.calculateSvgCoordinate(e.position.cx,ft),this.svg.cy=wt.calculateSvgCoordinate(e.position.cy,ft),this.svg.x=this.svg.cx-ft,this.svg.y=this.svg.cy-ft,this.transform={},this.transform.scale={},this.transform.scale.x=this.transform.scale.y=1,this.transform.rotate={},this.transform.rotate.x=this.transform.rotate.y=0,this.transform.skew={},this.transform.skew.x=this.transform.skew.y=0,this.config.position.scale&&(this.transform.scale.x=this.transform.scale.y=this.config.position.scale),this.config.position.rotate&&(this.transform.rotate.x=this.transform.rotate.y=this.config.position.rotate),this.transform.scale.x=this.config.position.scale_x||this.config.position.scale||1,this.transform.scale.y=this.config.position.scale_y||this.config.position.scale||1,this.transform.rotate.x=this.config.position.rotate_x||this.config.position.rotate||0,this.transform.rotate.y=this.config.position.rotate_y||this.config.position.rotate||0,this.dev.debug&&console.log("Toolset::constructor config/svg",this.toolsetId,this.config,this.svg);const s={area:Ft,circslider:zt,badge:Rt,bar:Kt,circle:Lt,ellipse:Ut,horseshoe:Ht,icon:Bt,line:Gt,name:jt,rectangle:Jt,rectex:Yt,regpoly:Xt,segarc:Zt,state:qt,slider:Wt,switch:Qt,text:te,usersvg:be};this.config.tools.map((t=>{const e={...t},i={cx:0,cy:0,scale:this.config.position.scale?this.config.position.scale:1};if(this.dev.debug&&console.log("Toolset::constructor toolConfig",this.toolsetId,e,i),!t.disabled){const o=new s[t.type](this,e,i);this._card.entityHistory.needed|="bar"===t.type,this.tools.push({type:t.type,index:t.id,tool:o})}return!0})),this.dev.performance&&console.timeEnd(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::constructor`)}updateValues(){this.dev.performance&&console.time(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::updateValues`),this.tools&&this.tools.map(((t,e)=>{if(t.tool.config.hasOwnProperty("entity_index")&&(this.dev.debug&&console.log("Toolset::updateValues",t,e),t.tool.value=this._card.attributesStr[t.tool.config.entity_index]?this._card.attributesStr[t.tool.config.entity_index]:this._card.secondaryInfoStr[t.tool.config.entity_index]?this._card.secondaryInfoStr[t.tool.config.entity_index]:this._card.entitiesStr[t.tool.config.entity_index]),t.tool.config.hasOwnProperty("entity_indexes")){const e=[];for(let s=0;s<t.tool.config.entity_indexes.length;++s)e[s]=this._card.attributesStr[t.tool.config.entity_indexes[s].entity_index]?this._card.attributesStr[t.tool.config.entity_indexes[s].entity_index]:this._card.secondaryInfoStr[t.tool.config.entity_indexes[s].entity_index]?this._card.secondaryInfoStr[t.tool.config.entity_indexes[s].entity_index]:this._card.entitiesStr[t.tool.config.entity_indexes[s].entity_index];t.tool.values=e}return!0})),this.dev.performance&&console.timeEnd(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::updateValues`)}connectedCallback(){this.dev.performance&&console.time(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::connectedCallback`),this.dev.debug&&console.log("*****Event - connectedCallback",this.toolsetId,(new Date).getTime()),this.dev.performance&&console.timeEnd(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::connectedCallback`)}disconnectedCallback(){this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE Toolset::disconnectedCallback`),this.dev.debug&&console.log("*****Event - disconnectedCallback",this.toolsetId,(new Date).getTime()),this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE Toolset::disconnectedCallback`)}firstUpdated(t){this.dev.debug&&console.log("*****Event - Toolset::firstUpdated",this.toolsetId,(new Date).getTime()),this.tools&&this.tools.map((e=>"function"==typeof e.tool.firstUpdated&&(e.tool.firstUpdated(t),!0)))}updated(t){this.dev.debug&&console.log("*****Event - Updated",this.toolsetId,(new Date).getTime()),this.tools&&this.tools.map((e=>"function"==typeof e.tool.updated&&(e.tool.updated(t),!0)))}renderToolset(){this.dev.debug&&console.log("*****Event - renderToolset",this.toolsetId,(new Date).getTime());const t=this.tools.map((t=>F`
          ${t.tool.render()}
      `));return F`${t}`}render(){return!this._card.isSafari&&!this._card.iOS||this._card.isSafari16?F`
        <g id="toolset-${this.toolsetId}" class="toolset__group-outer"
           transform="rotate(${this.transform.rotate.x}) scale(${this.transform.scale.x}, ${this.transform.scale.y})"
           style="transform-origin:center; transform-box:fill-box;">
          <svg style="overflow:visible;">
            <g class="toolset__group" transform="translate(${this.svg.cx}, ${this.svg.cy})"
            style="${rt(this._card.themeIsDarkMode()?this.palette.dark:this.palette.light)}"
            >
              ${this.renderToolset()}
            </g>
            </svg>
        </g>
      `:F`
        <g id="toolset-${this.toolsetId}" class="toolset__group-outer"
           transform="rotate(${this.transform.rotate.x}, ${this.svg.cx}, ${this.svg.cy})
                      scale(${this.transform.scale.x}, ${this.transform.scale.y})
                      "
           style="transform-origin:center; transform-box:fill-box;">
          <svg style="overflow:visible;">
            <g class="toolset__group" transform="translate(${this.svg.cx/this.transform.scale.x}, ${this.svg.cy/this.transform.scale.y})"
            style="${rt(this._card.themeIsDarkMode()?this.palette.dark:this.palette.light)}"
            >
              ${this.renderToolset()}
            </g>
            </svg>
        </g>
      `}}console.info(`%c  SWISS-ARMY-KNIFE-CARD  \n%c      Version ${pt}      `,"color: yellow; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray");class we extends at{constructor(){if(super(),this.connected=!1,Dt.setElement(this),this.cardId=Math.random().toString(36).substr(2,9),this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.secondaryInfoStr=[],this.viewBoxSize=yt,this.viewBox={width:yt,height:yt},this.toolsets=[],this.tools=[],this.styles={},this.styles.card={},this.styles.card.default={},this.styles.card.light={},this.styles.card.dark={},this.entityHistory={},this.entityHistory.needed=!1,this.stateChanged=!0,this.entityHistory.updating=!1,this.entityHistory.update_interval=300,this.dev={},this.dev.debug=!1,this.dev.performance=!1,this.dev.m3=!1,this.configIsSet=!1,this.theme={},this.theme.checked=!1,this.theme.isLoaded=!1,this.theme.modeChanged=!1,this.theme.darkMode=!1,this.theme.light={},this.theme.dark={},this.isSafari=!!window.navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),this.iOS=(/iPad|iPhone|iPod/.test(window.navigator.userAgent)||"MacIntel"===window.navigator.platform&&window.navigator.maxTouchPoints>1)&&!window.MSStream,this.isSafari14=this.isSafari&&/Version\/14\.[0-9]/.test(window.navigator.userAgent),this.isSafari15=this.isSafari&&/Version\/15\.[0-9]/.test(window.navigator.userAgent),this.isSafari16=this.isSafari&&/Version\/16\.[0-9]/.test(window.navigator.userAgent),this.isSafari16=this.isSafari&&/Version\/16\.[0-9]/.test(window.navigator.userAgent),this.isSafari14=this.isSafari14||/os 15.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.isSafari15=this.isSafari15||/os 14.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.isSafari16=this.isSafari16||/os 16.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.lovelace=we.lovelace,!this.lovelace)throw console.error("card::constructor - Can't get Lovelace panel"),Error("card::constructor - Can't get Lovelace panel");we.colorCache||(we.colorCache=[]),this.palette={},this.palette.light={},this.palette.dark={},this.dev.debug&&console.log("*****Event - card - constructor",this.cardId,(new Date).getTime())}static getSystemStyles(){return it`
      :host {
        cursor: default;
        font-size: ${4}px;
      }

      /* Default settings for the card */
      /* - default cursor */
      /* - SVG overflow is not displayed, ie cutoff by the card edges */
      ha-card {
        cursor: default;
        overflow: hidden;
        
        -webkit-touch-callout: none;  
      }
      
      /* For disabled parts of tools/toolsets */
      /* - No input */
      ha-card.disabled {
        pointer-events: none;
        cursor: default;
      }

      .disabled {
        pointer-events: none !important;
        cursor: default !important;
      }

      /* For 'active' tools/toolsets */
      /* - Show cursor as pointer */
      .hover {
        cursor: pointer;
      }

      /* For hidden tools/toolsets where state for instance is undefined */
      .hidden {
        opacity: 0;
        visibility: hidden;
        transition: visibility 0s 1s, opacity 0.5s linear;
      }

      focus {
        outline: none;
      }
      focus-visible {
        outline: 3px solid blanchedalmond; /* That'll show 'em */
      }
      
      
      @media (print), (prefers-reduced-motion: reduce) {
        .animated {
          animation-duration: 1ms !important;
          transition-duration: 1ms !important;
          animation-iteration-count: 1 !important;
        }
      }

      
      /* Set default host font-size to 10 pixels.
       * In that case 1em = 10 pixels = 1% of 100x100 matrix used
       */
      @media screen and (min-width: 467px) {
        :host {
        font-size: ${4}px;
        }
      }
      @media screen and (max-width: 466px) {
        :host {
        font-size: ${4}px;
        }
      }

      :host ha-card {
            padding: 0px 0px 0px 0px;
      }

      .container {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .labelContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 65%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
      }

      .ellipsis {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .state {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        max-width: 100%;
        min-width: 0px;
      }

      #label {
        display: flex;
        line-height: 1;
      }

      #label.bold {
        font-weight: bold;
      }

      #label, #name {
        margin: 3% 0;
      }

      .shadow {
        font-size: 30px;
        font-weight: 700;
        text-anchor: middle;
      }

      .card--dropshadow-5 {
        filter: drop-shadow(0 1px 0 #ccc)
               drop-shadow(0 2px 0 #c9c9c9)
               drop-shadow(0 3px 0 #bbb)
               drop-shadow(0 4px 0 #b9b9b9)
               drop-shadow(0 5px 0 #aaa)
               drop-shadow(0 6px 1px rgba(0,0,0,.1))
               drop-shadow(0 0 5px rgba(0,0,0,.1))
               drop-shadow(0 1px 3px rgba(0,0,0,.3))
               drop-shadow(0 3px 5px rgba(0,0,0,.2))
               drop-shadow(0 5px 10px rgba(0,0,0,.25))
               drop-shadow(0 10px 10px rgba(0,0,0,.2))
               drop-shadow(0 20px 20px rgba(0,0,0,.15));
      }
      .card--dropshadow-medium--opaque--sepia90 {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f22)
                drop-shadow(0.0em 0.07em 0px #b2a98f55)
                drop-shadow(0.0em 0.10em 0px #b2a98f88)
                drop-shadow(0px 0.6em 0.9em rgba(0,0,0,0.15))
                drop-shadow(0px 1.2em 0.15em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.5em rgba(0,0,0,0.1))
                sepia(90%);
      }

      .card--dropshadow-heavy--sepia90 {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f22)
                drop-shadow(0.0em 0.07em 0px #b2a98f55)
                drop-shadow(0.0em 0.10em 0px #b2a98f88)
                drop-shadow(0px 0.3em 0.45em rgba(0,0,0,0.5))
                drop-shadow(0px 0.6em 0.07em rgba(0,0,0,0.3))
                drop-shadow(0px 1.2em 1.25em rgba(0,0,0,1))
                drop-shadow(0px 1.8em 1.6em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.0em rgba(0,0,0,0.1))
                drop-shadow(0px 3.0em 2.5em rgba(0,0,0,0.1))
                sepia(90%);
      }

      .card--dropshadow-heavy {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f22)
                drop-shadow(0.0em 0.07em 0px #b2a98f55)
                drop-shadow(0.0em 0.10em 0px #b2a98f88)
                drop-shadow(0px 0.3em 0.45em rgba(0,0,0,0.5))
                drop-shadow(0px 0.6em 0.07em rgba(0,0,0,0.3))
                drop-shadow(0px 1.2em 1.25em rgba(0,0,0,1))
                drop-shadow(0px 1.8em 1.6em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.0em rgba(0,0,0,0.1))
                drop-shadow(0px 3.0em 2.5em rgba(0,0,0,0.1));
      }

      .card--dropshadow-medium--sepia90 {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f)
                drop-shadow(0.0em 0.15em 0px #b2a98f)
                drop-shadow(0.0em 0.15em 0px #b2a98f)
                drop-shadow(0px 0.6em 0.9em rgba(0,0,0,0.15))
                drop-shadow(0px 1.2em 0.15em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.5em rgba(0,0,0,0.1))
                sepia(90%);
      }

      .card--dropshadow-medium {
        filter: drop-shadow(0.0em 0.05em 0px #b2a98f)
                drop-shadow(0.0em 0.15em 0px #b2a98f)
                drop-shadow(0.0em 0.15em 0px #b2a98f)
                drop-shadow(0px 0.6em 0.9em rgba(0,0,0,0.15))
                drop-shadow(0px 1.2em 0.15em rgba(0,0,0,0.1))
                drop-shadow(0px 2.4em 2.5em rgba(0,0,0,0.1));
      }

      .card--dropshadow-light--sepia90 {
        filter: drop-shadow(0px 0.10em 0px #b2a98f)
                drop-shadow(0.1em 0.5em 0.2em rgba(0, 0, 0, .5))
                sepia(90%);
      }

      .card--dropshadow-light {
        filter: drop-shadow(0px 0.10em 0px #b2a98f)
                drop-shadow(0.1em 0.5em 0.2em rgba(0, 0, 0, .5));
      }

      .card--dropshadow-down-and-distant {
        filter: drop-shadow(0px 0.05em 0px #b2a98f)
                drop-shadow(0px 14px 10px rgba(0,0,0,0.15))
                drop-shadow(0px 24px 2px rgba(0,0,0,0.1))
                drop-shadow(0px 34px 30px rgba(0,0,0,0.1));
      }
      
      .card--filter-none {
      }

      .horseshoe__svg__group {
        transform: translateY(15%);
      }

    `}static getUserStyles(){return this.userContent="",we.lovelace.config.sak_user_templates&&we.lovelace.config.sak_user_templates.definitions.user_css_definitions&&(this.userContent=we.lovelace.config.sak_user_templates.definitions.user_css_definitions.reduce(((t,e)=>t+e.content),"")),it`${st(this.userContent)}`}static getSakStyles(){return this.sakContent="",we.lovelace.config.sak_sys_templates&&we.lovelace.config.sak_sys_templates.definitions.sak_css_definitions&&(this.sakContent=we.lovelace.config.sak_sys_templates.definitions.sak_css_definitions.reduce(((t,e)=>t+e.content),"")),it`${st(this.sakContent)}`}static getSakSvgDefinitions(){we.lovelace.sakSvgContent=null;let t="";we.lovelace.config.sak_sys_templates&&we.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions&&(t=we.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions.reduce(((t,e)=>t+e.content),"")),we.sakSvgContent=ct(t)}static getUserSvgDefinitions(){we.lovelace.userSvgContent=null;let t="";we.lovelace.config.sak_user_templates&&we.lovelace.config.sak_user_templates.definitions.user_svg_definitions&&(t=we.lovelace.config.sak_user_templates.definitions.user_svg_definitions.reduce(((t,e)=>t+e.content),"")),we.userSvgContent=ct(t)}static get styles(){if(we.lovelace||(we.lovelace=wt.getLovelace()),!we.lovelace)throw console.error("SAK - Can't get reference to Lovelace"),Error("card::get styles - Can't get Lovelace panel");if(!we.lovelace.config.sak_sys_templates)throw console.error(pt," - SAK - System Templates reference NOT defined."),Error(pt," - card::get styles - System Templates reference NOT defined!");return we.lovelace.config.sak_user_templates||console.warning(pt," - SAK - User Templates reference NOT defined. Did you NOT include them?"),we.getSakSvgDefinitions(),we.getUserSvgDefinitions(),it`
      ${we.getSystemStyles()}
      ${we.getSakStyles()}
      ${we.getUserStyles()}
    `}set hass(t){if(this.counter||(this.counter=0),this.counter+=1,this.theme.modeChanged=t.themes.darkMode!==this.theme.darkMode,this.theme.modeChanged&&(this.theme.darkMode=t.themes.darkMode),!this.theme.checked){if(this.theme.checked=!0,this.config.theme&&t.themes.themes[this.config.theme]){const{themeLight:e,themeDark:s}=Dt.processTheme(t.themes.themes[this.config.theme]);this.theme.light=e,this.theme.dark=s,this.theme.isLoaded=!0}this.styles.card.light={...this.styles.card.default,...this.theme.light,...this.palette.light},this.styles.card.dark={...this.styles.card.default,...this.theme.dark,...this.palette.dark}}if(this.dev.debug&&console.log("*****Event - card::set hass",this.cardId,(new Date).getTime()),this._hass=t,this.connected||this.dev.debug&&console.log("set hass but NOT connected",this.cardId),!this.config.entities)return;let e,s,i,o,a=!1,n=0,r=!1,h=!1;for(e of this.config.entities){if(this.entities[n]=t.states[this.config.entities[n].entity],void 0===this.entities[n]&&console.error("SAK - set hass, entity undefined: ",this.config.entities[n].entity),this.config.entities[n].secondary_info&&(r=!0,s=this.entities[n][this.config.entities[n].secondary_info],i=this._buildSecondaryInfo(s,this.config.entities[n]),i!==this.secondaryInfoStr[n]&&(this.secondaryInfoStr[n]=i,a=!0)),this.config.entities[n].attribute){let{attribute:t}=this.config.entities[n],e="",s="";const i=this.config.entities[n].attribute.indexOf("["),r=this.config.entities[n].attribute.indexOf(".");let l=0,c="";-1!==i?(t=this.config.entities[n].attribute.substr(0,i),e=this.config.entities[n].attribute.substr(i,this.config.entities[n].attribute.length-i),l=e[1],c=e.substr(4,e.length-4),s=this.entities[n].attributes[t][l][c]):-1!==r?(t=this.config.entities[n].attribute.substr(0,r),e=this.config.entities[n].attribute.substr(i,this.config.entities[n].attribute.length-i),c=e.substr(1,e.length-1),s=this.entities[n].attributes[t][c],console.log("set hass, attributes with map",this.config.entities[n].attribute,t,e)):s=this.entities[n].attributes[t],o=this._buildState(s,this.config.entities[n]),o!==this.attributesStr[n]&&(this.attributesStr[n]=o,a=!0),h=!0}h||r||(o=this._buildState(this.entities[n].state,this.config.entities[n]),o!==this.entitiesStr[n]&&(this.entitiesStr[n]=o,a=!0),this.dev.debug&&console.log("set hass - attrSet=false",this.cardId,`${(new Date).getSeconds().toString()}.${(new Date).getMilliseconds().toString()}`,o)),n+=1,h=!1,r=!1}(a||this.theme.modeChanged)&&(this.toolsets&&this.toolsets.map((t=>(t.updateValues(),!0))),this.requestUpdate(),this.theme.modeChanged=!1,this.counter-=1)}setConfig(t){if(this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE card::setConfig`),this.dev.debug&&console.log("*****Event - setConfig",this.cardId,(new Date).getTime()),(t=JSON.parse(JSON.stringify(t))).dev&&(this.dev={...this.dev,...t.dev}),this.dev.debug&&console.log("setConfig",this.cardId),!t.layout)throw Error("card::setConfig - No layout defined");if(t.entities){if("sensor"!==this._computeDomain(t.entities[0].entity)&&t.entities[0].attribute&&!isNaN(t.entities[0].attribute))throw Error("card::setConfig - First entity or attribute must be a numbered sensorvalue, but is NOT")}const e=xt.mergeDeep(t);this.config=e,this.toolset=[];const s=this;function i(t,e){if(e?.template){const t=s.lovelace.config.sak_user_templates.templates[e.template.name];t||console.error("Template not found...",e.template,t);const i=St.replaceVariables3(e.template.variables,t);return xt.mergeDeep(i)}return"template"===t?(console.log("findTemplate return key=template/value",t,void 0),e):e}const o=JSON.stringify(this.config,i);if(this.config.palette){this.config.palette=JSON.parse(o).palette;const{paletteLight:r,paletteDark:h}=Dt.processPalette(this.config.palette);this.palette.light=r,this.palette.dark=h}const a=JSON.parse(o).layout.toolsets;if(this.config.layout.template&&(this.config.layout=JSON.parse(o).layout),this.config.layout.toolsets.map(((t,e)=>{let s=null;this.toolsets||(this.toolsets=[]);{let o=!1,n=[];s=a[e].tools,t.tools&&t.tools.map(((r,h)=>(a[e].tools.map(((n,l)=>(r.id===n.id&&(t.template&&(this.config.layout.toolsets[e].position&&(a[e].position=xt.mergeDeep(this.config.layout.toolsets[e].position)),s[l]=xt.mergeDeep(s[l],r),s[l]=JSON.parse(JSON.stringify(s[l],i)),o=!0),this.dev.debug&&console.log("card::setConfig - got toolsetCfg toolid",r,h,n,l,r)),a[e].tools[l]=St.getJsTemplateOrValueConfig(a[e].tools[l],xt.mergeDeep(a[e].tools[l])),o))),o||(n=n.concat(t.tools[h])),o))),s=s.concat(n)}t=a[e];const o=new xe(this,t);return this.toolsets.push(o),!0})),this.dev.m3&&(console.log("*** M3 - Checking for m3.yaml template to convert..."),this.lovelace.config.sak_user_templates.templates.m3)){const{m3:l}=this.lovelace.config.sak_user_templates.templates;console.log("*** M3 - Found. Material 3 conversion starting...");let c="",d="",g="",u="",m="",p="",v="",f="",y="",_="";const b={},x={},w={};l.entities.map((t=>(["ref.palette","sys.color","sys.color.light","sys.color.dark"].includes(t.category_id)&&(t.tags.includes("alias")||(b[t.id]={value:t.value,tags:t.tags})),"ref.palette"===t.category_id&&(c+=`${t.id}: '${t.value}'\n`,"md.ref.palette.primary40"===t.id&&(p=t.value),"md.ref.palette.primary80"===t.id&&(y=t.value),"md.ref.palette.neutral40"===t.id&&(v=t.value),"md.ref.palette.neutral80"===t.id&&(_=t.value)),"sys.color"===t.category_id&&(d+=`${t.id}: '${t.value}'\n`),"sys.color.light"===t.category_id&&(g+=`${t.id}: '${t.value}'\n`,"md.sys.color.surface.light"===t.id&&(m=t.value)),"sys.color.dark"===t.category_id&&(u+=`${t.id}: '${t.value}'\n`,"md.sys.color.surface.dark"===t.id&&(f=t.value)),!0))),["primary","secondary","tertiary","error","neutral","neutral-variant"].forEach((t=>{[5,15,25,35,45,65,75,85].forEach((e=>{b[`md.ref.palette.${t}${e.toString()}`]={value:Dt.getGradientValue(b[`md.ref.palette.${t}${(e-5).toString()}`].value,b[`md.ref.palette.${t}${(e+5).toString()}`].value,.5),tags:[...b[`md.ref.palette.${t}${(e-5).toString()}`].tags]},b[`md.ref.palette.${t}${e.toString()}`].tags[3]=t+e.toString()})),b[`md.ref.palette.${t}7`]={value:Dt.getGradientValue(b[`md.ref.palette.${t}5`].value,b[`md.ref.palette.${t}10`].value,.5),tags:[...b[`md.ref.palette.${t}10`].tags]},b[`md.ref.palette.${t}7`].tags[3]=`${t}7`,b[`md.ref.palette.${t}92`]={value:Dt.getGradientValue(b[`md.ref.palette.${t}90`].value,b[`md.ref.palette.${t}95`].value,.5),tags:[...b[`md.ref.palette.${t}90`].tags]},b[`md.ref.palette.${t}92`].tags[3]=`${t}92`,b[`md.ref.palette.${t}97`]={value:Dt.getGradientValue(b[`md.ref.palette.${t}95`].value,b[`md.ref.palette.${t}99`].value,.5),tags:[...b[`md.ref.palette.${t}90`].tags]},b[`md.ref.palette.${t}97`].tags[3]=`${t}97`}));for(const[J,Y]of Object.entries(b))x[J]=`theme-${Y.tags[1]}-${Y.tags[2]}-${Y.tags[3]}: rgb(${S(Y.value)})`,w[J]=`theme-${Y.tags[1]}-${Y.tags[2]}-${Y.tags[3]}-rgb: ${S(Y.value)}`;function S(t){const e={};e.r=Math.round(parseInt(t.substr(1,2),16)),e.g=Math.round(parseInt(t.substr(3,2),16)),e.b=Math.round(parseInt(t.substr(5,2),16));return`${e.r},${e.g},${e.b}`}function $(t,e,s,i,o){const a={},n={};a.r=Math.round(parseInt(t.substr(1,2),16)),a.g=Math.round(parseInt(t.substr(3,2),16)),a.b=Math.round(parseInt(t.substr(5,2),16)),n.r=Math.round(parseInt(e.substr(1,2),16)),n.g=Math.round(parseInt(e.substr(3,2),16)),n.b=Math.round(parseInt(e.substr(5,2),16));let r,h,l,c="";return s.forEach(((t,e)=>{r=Math.round(t*n.r+(1-t)*a.r),h=Math.round(t*n.g+(1-t)*a.g),l=Math.round(t*n.b+(1-t)*a.b),c+=`${i+(e+1).toString()}-${o}: rgb(${r},${h},${l})\n`,c+=`${i+(e+1).toString()}-${o}-rgb: ${r},${h},${l}\n`})),c}const k=[.03,.05,.08,.11,.15,.19,.24,.29,.35,.4],E=[.05,.08,.11,.15,.19,.24,.29,.35,.4,.45],C=$(m,v,k,"  theme-ref-elevation-surface-neutral","light"),T=b["md.ref.palette.neutral-variant40"].value,I=$(m,T,k,"  theme-ref-elevation-surface-neutral-variant","light"),A=$(m,p,k,"  theme-ref-elevation-surface-primary","light"),M=b["md.ref.palette.secondary40"].value,V=$(m,M,k,"  theme-ref-elevation-surface-secondary","light"),N=b["md.ref.palette.tertiary40"].value,P=$(m,N,k,"  theme-ref-elevation-surface-tertiary","light"),D=b["md.ref.palette.error40"].value,O=$(m,D,k,"  theme-ref-elevation-surface-error","light"),R=$(f,_,E,"  theme-ref-elevation-surface-neutral","dark"),L=b["md.ref.palette.neutral-variant80"].value,z=$(f,L,E,"  theme-ref-elevation-surface-neutral-variant","dark"),U=$(f,y,E,"  theme-ref-elevation-surface-primary","dark"),F=b["md.ref.palette.secondary80"].value,B=$(f,F,E,"  theme-ref-elevation-surface-secondary","dark"),j=b["md.ref.palette.tertiary80"].value,q=$(f,j,E,"  theme-ref-elevation-surface-tertiary","dark"),H=b["md.ref.palette.error80"].value,G=$(f,H,E,"  theme-ref-elevation-surface-error","dark");let W="";for(const[X,Z]of Object.entries(x))"theme-ref"===Z.substring(0,9)&&(W+=`  ${Z}\n`,W+=`  ${w[X]}\n`);console.log(C+I+A+V+P+O+R+z+U+B+q+G+W),console.log("*** M3 - Material 3 conversion DONE. You should copy the above output...")}this.aspectratio=(this.config.layout.aspectratio||this.config.aspectratio||"1/1").trim();const n=this.aspectratio.split("/");this.viewBox||(this.viewBox={}),this.viewBox.width=n[0]*vt,this.viewBox.height=n[1]*vt,this.config.layout.styles?.card&&(this.styles.card.default=this.config.layout.styles.card),this.dev.debug&&console.log("Step 5: toolconfig, list of toolsets",this.toolsets),this.dev.debug&&console.log("debug - setConfig",this.cardId,this.config),this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE card::setConfig`),this.configIsSet=!0}connectedCallback(){this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE card::connectedCallback`),this.dev.debug&&console.log("*****Event - connectedCallback",this.cardId,(new Date).getTime()),this.connected=!0,super.connectedCallback(),this.entityHistory.update_interval&&(this.updateOnInterval(),clearInterval(this.interval),this.interval=setInterval((()=>this.updateOnInterval()),this._hass?1e3*this.entityHistory.update_interval:1e3)),this.dev.debug&&console.log("ConnectedCallback",this.cardId),this.requestUpdate(),this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE card::connectedCallback`)}disconnectedCallback(){this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE card::disconnectedCallback`),this.dev.debug&&console.log("*****Event - disconnectedCallback",this.cardId,(new Date).getTime()),this.interval&&(clearInterval(this.interval),this.interval=0),super.disconnectedCallback(),this.dev.debug&&console.log("disconnectedCallback",this.cardId),this.connected=!1,this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE card::disconnectedCallback`)}firstUpdated(t){this.dev.debug&&console.log("*****Event - card::firstUpdated",this.cardId,(new Date).getTime()),this.toolsets&&this.toolsets.map((async e=>(e.firstUpdated(t),!0)))}updated(t){this.dev.debug&&console.log("*****Event - Updated",this.cardId,(new Date).getTime()),this.toolsets&&this.toolsets.map((async e=>(e.updated(t),!0)))}render(){if(this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE card::render`),this.dev.debug&&console.log("*****Event - render",this.cardId,(new Date).getTime()),!this.connected)return void(this.dev.debug&&console.log("render but NOT connected",this.cardId,(new Date).getTime()));let t;try{t=this.config.disable_card?U`
                  <div class="container" id="container">
                    ${this._renderSvg()}
                  </div>
                  `:U`
                  <ha-card style="${rt(this.styles.card.default)}">
                    <div class="container" id="container" 
                    >
                      ${this._renderSvg()}
                    </div>
                  </ha-card>
                  `}catch(e){console.error(e)}return this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE card::render`),t}_renderSakSvgDefinitions(){return F`
    ${we.sakSvgContent}
    `}_renderUserSvgDefinitions(){return F`
    ${we.userSvgContent}
    `}themeIsDarkMode(){return!0===this.theme.darkMode}themeIsLightMode(){return!1===this.theme.darkMode}_RenderToolsets(){return this.dev.debug&&console.log("all the tools in renderTools",this.tools),F`
              <g id="toolsets" class="toolsets__group"
              >
                ${this.toolsets.map((t=>t.render()))}
              </g>

            <defs>
              ${this._renderSakSvgDefinitions()}
              ${this._renderUserSvgDefinitions()}
            </defs>
    `}_renderCardAttributes(){let t;const e=[];this._attributes="";for(let s=0;s<this.entities.length;s++)t=this.attributesStr[s]?this.attributesStr[s]:this.secondaryInfoStr[s]?this.secondaryInfoStr[s]:this.entitiesStr[s],e.push(t);return this._attributes=e,e}_renderSvg(){const t=this.config.card_filter?this.config.card_filter:"card--filter-none",e=[];this._renderCardAttributes();const s=this._RenderToolsets();return e.push(F`
      <svg id="rootsvg" xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
       class="${t}"
       style="${rt(this.themeIsDarkMode()?this.styles.card.dark:this.styles.card.light)}"
       data-entity-0="${this._attributes[0]}"
       data-entity-1="${gt(this._attributes[1])}"
       data-entity-2="${gt(this._attributes[2])}"
       data-entity-3="${gt(this._attributes[3])}"
       data-entity-4="${gt(this._attributes[4])}"
       data-entity-5="${gt(this._attributes[5])}"
       data-entity-6="${gt(this._attributes[6])}"
       data-entity-7="${gt(this._attributes[7])}"
       data-entity-8="${gt(this._attributes[8])}"
       data-entity-9="${gt(this._attributes[9])}"
       viewBox="0 0 ${this.viewBox.width} ${this.viewBox.height}"
      >
        <g style="${rt(this.config.layout?.styles?.toolsets)}">
          ${s}
        </g>
      </svg>`),F`${e}`}_buildUom(t,e,s){return t?.unit||s?.unit||e?.attributes.unit_of_measurement||""}toLocale(t,e="unknown"){const s=this._hass.selectedLanguage||this._hass.language,i=this._hass.resources[s];return i&&i[t]?i[t]:e}_buildState(t,e){if(isNaN(t))return"unavailable"===t?"-ua-":t;if("brightness"===e.format)return`${Math.round(t/255*100)}`;const s=Math.abs(Number(t)),i=Math.sign(t);if(void 0===e.decimals||Number.isNaN(e.decimals)||Number.isNaN(s))return(-1===i?"-":"")+(Math.round(100*s)/100).toString();const o=10**e.decimals;return(-1===i?"-":"")+(Math.round(s*o)/o).toFixed(e.decimals).toString()}_buildSecondaryInfo(t,e){const s=t=>t<10?`0${t}`:t;const i=this._hass.selectedLanguage||this._hass.language;if(["relative","total","date","time","datetime"].includes(e.format)){const s=new Date(t);if(!(s instanceof Date)||isNaN(s.getTime()))return t;let o;switch(e.format){case"relative":const t=function(t,e,s){void 0===e&&(e=Date.now()),void 0===s&&(s={});var i=ut(ut({},mt),s||{}),o=(+t-+e)/1e3;if(Math.abs(o)<i.second)return{value:Math.round(o),unit:"second"};var a=o/60;if(Math.abs(a)<i.minute)return{value:Math.round(a),unit:"minute"};var n=o/3600;if(Math.abs(n)<i.hour)return{value:Math.round(n),unit:"hour"};var r=o/86400;if(Math.abs(r)<i.day)return{value:Math.round(r),unit:"day"};var h=new Date(t),l=new Date(e),c=h.getFullYear()-l.getFullYear();if(Math.round(Math.abs(c))>0)return{value:Math.round(c),unit:"year"};var d=12*c+h.getMonth()-l.getMonth();if(Math.round(Math.abs(d))>0)return{value:Math.round(d),unit:"month"};var g=o/604800;return{value:Math.round(g),unit:"week"}}(s,new Date);o=new Intl.RelativeTimeFormat(i,{numeric:"auto"}).format(t.value,t.unit);break;case"total":case"precision":o="Not Yet Supported";break;case"date":o=new Intl.DateTimeFormat(i,{year:"numeric",month:"numeric",day:"numeric"}).format(s);break;case"time":o=new Intl.DateTimeFormat(i,{hour:"numeric",minute:"numeric",second:"numeric"}).format(s);break;case"datetime":o=new Intl.DateTimeFormat(i,{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}).format(s)}return o}return isNaN(parseFloat(t))||!isFinite(t)?t:"brightness"===e.format?`${Math.round(t/255*100)} %`:"duration"===e.format?function(t){const e=Math.floor(t/3600),i=Math.floor(t%3600/60),o=Math.floor(t%3600%60);return e>0?`${e}:${s(i)}:${s(o)}`:i>0?`${i}:${s(o)}`:o>0?`${o}`:null}(t):void 0}_computeState(t,e){if(isNaN(t))return console.log("computestate - NAN",t,e),t;const s=Number(t);if(void 0===e||isNaN(e)||isNaN(s))return Math.round(100*s)/100;const i=10**e;return(Math.round(s*i)/i).toFixed(e)}_computeDomain(t){return t.substr(0,t.indexOf("."))}_computeEntity(t){return t.substr(t.indexOf(".")+1)}updateOnInterval(){this._hass?(this.stateChanged&&!this.entityHistory.updating&&this.updateData(),this.entityHistory.needed?(window.clearInterval(this.interval),this.interval=setInterval((()=>this.updateOnInterval()),1e3*this.entityHistory.update_interval)):this.interval&&(window.clearInterval(this.interval),this.interval=0)):this.dev.debug&&console.log("UpdateOnInterval - NO hass, returning")}async fetchRecent(t,e,s,i){let o="history/period";return e&&(o+=`/${e.toISOString()}`),o+=`?filter_entity_id=${t}`,s&&(o+=`&end_time=${s.toISOString()}`),i&&(o+="&skip_initial_state"),o+="&minimal_response",this._hass.callApi("GET",o)}async updateData(){this.entityHistory.updating=!0,this.dev.debug&&console.log("card::updateData - ENTRY",this.cardId);const t=[];let e=0;this.toolsets.map(((s,i)=>(s.tools.map(((s,o)=>{if("bar"===s.type){const a=new Date,n=new Date;n.setHours(a.getHours()-s.tool.config.hours);const r=this.config.entities[s.tool.config.entity_index].attribute?this.config.entities[s.tool.config.entity_index].attribute:null;t[e]={tsidx:i,entityIndex:s.tool.config.entity_index,entityId:this.entities[s.tool.config.entity_index].entity_id,attrId:r,start:n,end:a,type:"bar",idx:o},e+=1}return!0})),!0))),this.dev.debug&&console.log("card::updateData - LENGTH",this.cardId,t.length,t),this.stateChanged=!1,this.dev.debug&&console.log("card::updateData, entityList from tools",t);try{const e=t.map(((t,e)=>this.updateEntity(t,e,t.start,t.end)));await Promise.all(e)}finally{this.entityHistory.updating=!1}}async updateEntity(t,e,s,i){let o=[];const a=s;let n,r=await this.fetchRecent(t.entityId,a,i,!1);r[0]&&r[0].length>0&&(t.attrId&&(n=this.entities[t.entityIndex].attributes[this.config.entities[t.entityIndex].attribute],t.state=n),r=r[0].filter((e=>t.attrId?!isNaN(parseFloat(e.attributes[t.attrId])):!isNaN(parseFloat(e.state)))),r=r.map((e=>({last_changed:e.last_changed,state:t.attrId?Number(e.attributes[t.attrId]):Number(e.state)})))),o=[...o,...r],this.uppdate(t,o)}uppdate(t,e){if(!e)return;const s=(new Date).getTime();let i=24,o=2;"bar"===t.type&&(this.dev.debug&&console.log("entity.type == bar",t),i=this.toolsets[t.tsidx].tools[t.idx].tool.config.hours,o=this.toolsets[t.tsidx].tools[t.idx].tool.config.barhours);const a=e.reduce(((t,e)=>((t,e)=>{const a=(s-new Date(e.last_changed).getTime())/36e5/o-i/o,n=Math.floor(Math.abs(a));return t[n]||(t[n]=[]),t[n].push(e),t})(t,e)),[]);if(a.length=Math.ceil(i/o),0===Object.keys(a).length)return;const n=Object.keys(a)[0];"0"!==n&&(a[0]=[],a[0].push(a[n][0]));for(let h=0;h<i/o;h++)a[h]||(a[h]=[],a[h].push(a[h-1][a[h-1].length-1]));this.coords=a;let r=[];r=[],r=a.map((t=>{return s="state",(e=t).reduce(((t,e)=>t+Number(e[s])),0)/e.length;var e,s})),"bar"===t.type&&(this.toolsets[t.tsidx].tools[t.idx].tool.series=[...r]),this.requestUpdate()}getCardSize(){return 4}}customElements.define("swiss-army-knife-card",we);
