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
const t="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,e=(t,e,s=null,i=null)=>{for(;e!==s;){const s=e.nextSibling;t.insertBefore(e,i),e=s}},s=(t,e,s=null)=>{for(;e!==s;){const s=e.nextSibling;t.removeChild(e),e=s}},i=`{{lit-${String(Math.random()).slice(2)}}}`,o=`\x3c!--${i}--\x3e`,a=new RegExp(`${i}|${o}`),r="$lit$";class n{constructor(t,e){this.parts=[],this.element=e;const s=[],o=[],n=document.createTreeWalker(e.content,133,null,!1);let l=0,g=-1,u=0;const{strings:m,values:{length:p}}=t;for(;u<p;){const t=n.nextNode();if(null!==t){if(g++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:s}=e;let i=0;for(let t=0;t<s;t++)h(e[t].name,r)&&i++;for(;i-- >0;){const e=m[u],s=d.exec(e)[2],i=s.toLowerCase()+r,o=t.getAttribute(i);t.removeAttribute(i);const n=o.split(a);this.parts.push({type:"attribute",index:g,name:s,strings:n}),u+=n.length-1}}"TEMPLATE"===t.tagName&&(o.push(t),n.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(i)>=0){const i=t.parentNode,o=e.split(a),n=o.length-1;for(let e=0;e<n;e++){let s,a=o[e];if(""===a)s=c();else{const t=d.exec(a);null!==t&&h(t[2],r)&&(a=a.slice(0,t.index)+t[1]+t[2].slice(0,-5)+t[3]),s=document.createTextNode(a)}i.insertBefore(s,t),this.parts.push({type:"node",index:++g})}""===o[n]?(i.insertBefore(c(),t),s.push(t)):t.data=o[n],u+=n}}else if(8===t.nodeType)if(t.data===i){const e=t.parentNode;null!==t.previousSibling&&g!==l||(g++,e.insertBefore(c(),t)),l=g,this.parts.push({type:"node",index:g}),null===t.nextSibling?t.data="":(s.push(t),g--),u++}else{let e=-1;for(;-1!==(e=t.data.indexOf(i,e+1));)this.parts.push({type:"node",index:-1}),u++}}else n.currentNode=o.pop()}for(const i of s)i.parentNode.removeChild(i)}}const h=(t,e)=>{const s=t.length-e.length;return s>=0&&t.slice(s)===e},l=t=>-1!==t.index,c=()=>document.createComment(""),d=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function g(t,e){const{element:{content:s},parts:i}=t,o=document.createTreeWalker(s,133,null,!1);let a=m(i),r=i[a],n=-1,h=0;const l=[];let c=null;for(;o.nextNode();){n++;const t=o.currentNode;for(t.previousSibling===c&&(c=null),e.has(t)&&(l.push(t),null===c&&(c=t)),null!==c&&h++;void 0!==r&&r.index===n;)r.index=null!==c?-1:r.index-h,a=m(i,a),r=i[a]}l.forEach((t=>t.parentNode.removeChild(t)))}const u=t=>{let e=11===t.nodeType?0:1;const s=document.createTreeWalker(t,133,null,!1);for(;s.nextNode();)e++;return e},m=(t,e=-1)=>{for(let s=e+1;s<t.length;s++){const e=t[s];if(l(e))return s}return-1};
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
const p=new WeakMap,f=t=>(...e)=>{const s=t(...e);return p.set(s,!0),s},v=t=>"function"==typeof t&&p.has(t),y={},_={};
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
class b{constructor(t,e,s){this.__parts=[],this.template=t,this.processor=e,this.options=s}update(t){let e=0;for(const s of this.__parts)void 0!==s&&s.setValue(t[e]),e++;for(const s of this.__parts)void 0!==s&&s.commit()}_clone(){const e=t?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),s=[],i=this.template.parts,o=document.createTreeWalker(e,133,null,!1);let a,r=0,n=0,h=o.nextNode();for(;r<i.length;)if(a=i[r],l(a)){for(;n<a.index;)n++,"TEMPLATE"===h.nodeName&&(s.push(h),o.currentNode=h.content),null===(h=o.nextNode())&&(o.currentNode=s.pop(),h=o.nextNode());if("node"===a.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(h.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(h,a.name,a.strings,this.options));r++}else this.__parts.push(void 0),r++;return t&&(document.adoptNode(e),customElements.upgrade(e)),e}}
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
 */const w=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:t=>t}),x=` ${i} `;class ${constructor(t,e,s,i){this.strings=t,this.values=e,this.type=s,this.processor=i}getHTML(){const t=this.strings.length-1;let e="",s=!1;for(let a=0;a<t;a++){const t=this.strings[a],n=t.lastIndexOf("\x3c!--");s=(n>-1||s)&&-1===t.indexOf("--\x3e",n+1);const h=d.exec(t);e+=null===h?t+(s?x:o):t.substr(0,h.index)+h[1]+h[2]+r+h[3]+i}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");let e=this.getHTML();return void 0!==w&&(e=w.createHTML(e)),t.innerHTML=e,t}}class S extends ${getHTML(){return`<svg>${super.getHTML()}</svg>`}getTemplateElement(){const t=super.getTemplateElement(),s=t.content,i=s.firstChild;return s.removeChild(i),e(s,i.firstChild),t}}
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
 */const k=t=>null===t||!("object"==typeof t||"function"==typeof t),E=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class T{constructor(t,e,s){this.dirty=!0,this.element=t,this.name=e,this.strings=s,this.parts=[];for(let i=0;i<s.length-1;i++)this.parts[i]=this._createPart()}_createPart(){return new C(this)}_getValue(){const t=this.strings,e=t.length-1,s=this.parts;if(1===e&&""===t[0]&&""===t[1]){const t=s[0].value;if("symbol"==typeof t)return String(t);if("string"==typeof t||!E(t))return t}let i="";for(let o=0;o<e;o++){i+=t[o];const e=s[o];if(void 0!==e){const t=e.value;if(k(t)||!E(t))i+="string"==typeof t?t:String(t);else for(const e of t)i+="string"==typeof e?e:String(e)}}return i+=t[e],i}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class C{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===y||k(t)&&t===this.value||(this.value=t,v(t)||(this.committer.dirty=!0))}commit(){for(;v(this.value);){const t=this.value;this.value=y,t(this)}this.value!==y&&this.committer.commit()}}class M{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(c()),this.endNode=t.appendChild(c())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=c()),t.__insert(this.endNode=c())}insertAfterPart(t){t.__insert(this.startNode=c()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(null===this.startNode.parentNode)return;for(;v(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=y,t(this)}const t=this.__pendingValue;t!==y&&(k(t)?t!==this.value&&this.__commitText(t):t instanceof $?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):E(t)?this.__commitIterable(t):t===_?(this.value=_,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,s="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=s:this.__commitNode(document.createTextNode(s)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof b&&this.value.template===e)this.value.update(t.values);else{const s=new b(e,t.processor,this.options),i=s._clone();s.update(t.values),this.__commitNode(i),this.value=s}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let s,i=0;for(const o of t)s=e[i],void 0===s&&(s=new M(this.options),e.push(s),0===i?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(o),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){s(this.startNode.parentNode,t.nextSibling,this.endNode)}}class I{constructor(t,e,s){if(this.value=void 0,this.__pendingValue=void 0,2!==s.length||""!==s[0]||""!==s[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=s}setValue(t){this.__pendingValue=t}commit(){for(;v(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=y,t(this)}if(this.__pendingValue===y)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=y}}class A extends T{constructor(t,e,s){super(t,e,s),this.single=2===s.length&&""===s[0]&&""===s[1]}_createPart(){return new V(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class V extends C{}let N=!1;(()=>{try{const t={get capture(){return N=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}})();class D{constructor(t,e,s){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=s,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;v(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=y,t(this)}if(this.__pendingValue===y)return;const t=this.__pendingValue,e=this.value,s=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),i=null!=t&&(null==e||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),i&&(this.__options=P(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=y}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const P=t=>t&&(N?{capture:t.capture,passive:t.passive,once:t.once}:t.capture)
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
 */;function O(t){let e=R.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},R.set(t.type,e));let s=e.stringsArray.get(t.strings);if(void 0!==s)return s;const o=t.strings.join(i);return s=e.keyString.get(o),void 0===s&&(s=new n(t,t.getTemplateElement()),e.keyString.set(o,s)),e.stringsArray.set(t.strings,s),s}const R=new Map,L=new WeakMap;
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
 */const F=new
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
class{handleAttributeExpressions(t,e,s,i){const o=e[0];if("."===o){return new A(t,e.slice(1),s).parts}if("@"===o)return[new D(t,e.slice(1),i.eventContext)];if("?"===o)return[new I(t,e.slice(1),s)];return new T(t,e,s).parts}handleTextExpression(t){return new M(t)}};
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
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");const z=(t,...e)=>new $(t,e,"html",F),B=(t,...e)=>new S(t,e,"svg",F)
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
 */,U=(t,e)=>`${t}--${e}`;let j=!0;void 0===window.ShadyCSS?j=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),j=!1);const G=t=>e=>{const s=U(e.type,t);let o=R.get(s);void 0===o&&(o={stringsArray:new WeakMap,keyString:new Map},R.set(s,o));let a=o.stringsArray.get(e.strings);if(void 0!==a)return a;const r=e.strings.join(i);if(a=o.keyString.get(r),void 0===a){const s=e.getTemplateElement();j&&window.ShadyCSS.prepareTemplateDom(s,t),a=new n(e,s),o.keyString.set(r,a)}return o.stringsArray.set(e.strings,a),a},H=["html","svg"],q=new Set,W=(t,e,s)=>{q.add(t);const i=s?s.element:document.createElement("template"),o=e.querySelectorAll("style"),{length:a}=o;if(0===a)return void window.ShadyCSS.prepareTemplateStyles(i,t);const r=document.createElement("style");for(let l=0;l<a;l++){const t=o[l];t.parentNode.removeChild(t),r.textContent+=t.textContent}(t=>{H.forEach((e=>{const s=R.get(U(e,t));void 0!==s&&s.keyString.forEach((t=>{const{element:{content:e}}=t,s=new Set;Array.from(e.querySelectorAll("style")).forEach((t=>{s.add(t)})),g(t,s)}))}))})(t);const n=i.content;s?function(t,e,s=null){const{element:{content:i},parts:o}=t;if(null==s)return void i.appendChild(e);const a=document.createTreeWalker(i,133,null,!1);let r=m(o),n=0,h=-1;for(;a.nextNode();)for(h++,a.currentNode===s&&(n=u(e),s.parentNode.insertBefore(e,s));-1!==r&&o[r].index===h;){if(n>0){for(;-1!==r;)o[r].index+=n,r=m(o,r);return}r=m(o,r)}}(s,r,n.firstChild):n.insertBefore(r,n.firstChild),window.ShadyCSS.prepareTemplateStyles(i,t);const h=n.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==h)e.insertBefore(h.cloneNode(!0),e.firstChild);else if(s){n.insertBefore(r,n.firstChild);const t=new Set;t.add(r),g(s,t)}};window.JSCompiler_renameProperty=(t,e)=>t;const Y={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},J=(t,e)=>e!==t&&(e==e||t==t),X={attribute:!0,type:String,converter:Y,reflect:!1,hasChanged:J},Z="finalized";class K extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach(((e,s)=>{const i=this._attributeNameForProperty(s,e);void 0!==i&&(this._attributeToPropertyMap.set(i,s),t.push(i))})),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach(((t,e)=>this._classProperties.set(e,t)))}}static createProperty(t,e=X){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const s="symbol"==typeof t?Symbol():`__${t}`,i=this.getPropertyDescriptor(t,s,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}static getPropertyDescriptor(t,e,s){return{get(){return this[e]},set(i){const o=this[t];this[e]=i,this.requestUpdateInternal(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||X}static finalize(){const t=Object.getPrototypeOf(this);if(t.hasOwnProperty(Z)||t.finalize(),this[Z]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const s of e)this.createProperty(s,t[s])}}static _attributeNameForProperty(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,s=J){return s(t,e)}static _propertyValueFromAttribute(t,e){const s=e.type,i=e.converter||Y,o="function"==typeof i?i:i.fromAttribute;return o?o(t,s):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const s=e.type,i=e.converter;return(i&&i.toAttribute||Y.toAttribute)(t,s)}initialize(){this._updateState=0,this._updatePromise=new Promise((t=>this._enableUpdatingResolver=t)),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach(((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}}))}_applyInstanceProperties(){this._instanceProperties.forEach(((t,e)=>this[e]=t)),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,s){e!==s&&this._attributeToProperty(t,s)}_propertyToAttribute(t,e,s=X){const i=this.constructor,o=i._attributeNameForProperty(t,s);if(void 0!==o){const t=i._propertyValueToAttribute(e,s);if(void 0===t)return;this._updateState=8|this._updateState,null==t?this.removeAttribute(o):this.setAttribute(o,t),this._updateState=-9&this._updateState}}_attributeToProperty(t,e){if(8&this._updateState)return;const s=this.constructor,i=s._attributeToPropertyMap.get(t);if(void 0!==i){const t=s.getPropertyOptions(i);this._updateState=16|this._updateState,this[i]=s._propertyValueFromAttribute(e,t),this._updateState=-17&this._updateState}}requestUpdateInternal(t,e,s){let i=!0;if(void 0!==t){const o=this.constructor;s=s||o.getPropertyOptions(t),o._valueHasChanged(this[t],e,s.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==s.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,s))):i=!1}!this._hasRequestedUpdate&&i&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(e){}const t=this.performUpdate();return null!=t&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(s){throw t=!1,this._markUpdated(),s}t&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach(((t,e)=>this._propertyToAttribute(e,this[e],t))),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}}K[Z]=!0;
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
(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");const ot={};class at extends K{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const t=this.getStyles();if(Array.isArray(t)){const e=(t,s)=>t.reduceRight(((t,s)=>Array.isArray(s)?e(s,t):(t.add(s),t)),s),s=e(t,new Set),i=[];s.forEach((t=>i.unshift(t))),this._styles=i}else this._styles=void 0===t?[]:[t];this._styles=this._styles.map((t=>{if(t instanceof CSSStyleSheet&&!Q){const e=Array.prototype.slice.call(t.cssRules).reduce(((t,e)=>t+e.cssText),"");return st(e)}return t}))}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?Q?this.renderRoot.adoptedStyleSheets=t.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map((t=>t.cssText)),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){const e=this.render();super.update(t),e!==ot&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach((t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)})))}render(){return ot}}at.finalized=!0,at.render=(t,e,i)=>{if(!i||"object"!=typeof i||!i.scopeName)throw new Error("The `scopeName` option is required.");const o=i.scopeName,a=L.has(e),r=j&&11===e.nodeType&&!!e.host,n=r&&!q.has(o),h=n?document.createDocumentFragment():e;if(((t,e,i)=>{let o=L.get(e);void 0===o&&(s(e,e.firstChild),L.set(e,o=new M(Object.assign({templateFactory:O},i))),o.appendInto(e)),o.setValue(t),o.commit()})(t,h,Object.assign({templateFactory:G(o)},i)),n){const t=L.get(h);L.delete(h);const i=t.value instanceof b?t.value.template:void 0;W(o,h,i),s(e,e.firstChild),e.appendChild(h),L.set(e,t)}!a&&r&&window.ShadyCSS.styleElement(e.host)},at.shadowRootOptions={mode:"open"};
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
const rt=new WeakMap,nt=f((t=>e=>{if(!(e instanceof C)||e instanceof V||"style"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `styleMap` directive must be used in the style attribute and must be the only part in the attribute.");const{committer:s}=e,{style:i}=s.element;let o=rt.get(e);void 0===o&&(i.cssText=s.strings.join(" "),rt.set(e,o=new Set)),o.forEach((e=>{e in t||(o.delete(e),-1===e.indexOf("-")?i[e]=null:i.removeProperty(e))}));for(const a in t)o.add(a),-1===a.indexOf("-")?i[a]=t[a]:i.setProperty(a,t[a])})),ht=new WeakMap,lt=window.navigator.userAgent.indexOf("Trident/")>0,ct=f((t=>s=>{if(!(s instanceof M))throw new Error("unsafeSVG can only be used in text bindings");const i=ht.get(s);if(void 0!==i&&k(t)&&t===i.value&&s.value===i.fragment)return;const o=document.createElement("template"),a=o.content;let r;lt?(o.innerHTML=`<svg>${t}</svg>`,r=a.firstChild):(r=document.createElementNS("http://www.w3.org/2000/svg","svg"),a.appendChild(r),r.innerHTML=t),a.removeChild(r),e(a,r.firstChild);const n=document.importNode(a,!0);s.setValue(n),ht.set(s,{value:t,fragment:n})})),dt=new WeakMap,gt=f((t=>e=>{const s=dt.get(e);if(void 0===t&&e instanceof C){if(void 0!==s||!dt.has(e)){const t=e.committer.name;e.committer.element.removeAttribute(t)}}else t!==s&&e.setValue(t);dt.set(e,t)}));var ut="2.5.1";const mt=400,pt=200,ft=mt,vt=(t,e,s)=>t<0||s<0?e+360:e,yt=(t,e)=>Math.abs(t-e);class _t{static mergeDeep(...t){const e=t=>t&&"object"==typeof t;return t.reduce(((t,s)=>(Object.keys(s).forEach((i=>{const o=t[i],a=s[i];Array.isArray(o)&&Array.isArray(a)?t[i]=o.concat(...a):e(o)&&e(a)?t[i]=this.mergeDeep(o,a):t[i]=a})),t)),{})}}class bt{static calculateValueBetween(t,e,s){return isNaN(s)?0:s?(Math.min(Math.max(s,t),e)-t)/(e-t):0}static calculateSvgCoordinate(t,e){return t/100*mt+(e-pt)}static calculateSvgDimension(t){return t/100*mt}static getLovelace(){let t=window.document.querySelector("home-assistant");if(t=t&&t.shadowRoot,t=t&&t.querySelector("home-assistant-main"),t=t&&t.shadowRoot,t=t&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),t=t&&t.shadowRoot||t,t=t&&t.querySelector("ha-panel-lovelace"),t=t&&t.shadowRoot,t=t&&t.querySelector("hui-root"),t){const e=t.lovelace;return e.current_view=t.___curView,e}return null}}class wt{static replaceVariables3(t,e){if(!t&&!e.template.defaults)return e[e.template.type];let s=t?.slice(0)??[];e.template.defaults&&(s=s.concat(e.template.defaults));let i=JSON.stringify(e[e.template.type]);return s.forEach((t=>{const e=Object.keys(t)[0],s=Object.values(t)[0];if("number"==typeof s||"boolean"==typeof s){const t=new RegExp(`"\\[\\[${e}\\]\\]"`,"gm");i=i.replace(t,s)}if("object"==typeof s){const t=new RegExp(`"\\[\\[${e}\\]\\]"`,"gm"),o=JSON.stringify(s);i=i.replace(t,o)}else{const t=new RegExp(`\\[\\[${e}\\]\\]`,"gm");i=i.replace(t,s)}})),JSON.parse(i)}static getJsTemplateOrValueConfig(t,e){if(!e)return e;if(["number","boolean","bigint","symbol"].includes(typeof e))return e;if("object"==typeof e)return Object.keys(e).forEach((s=>{e[s]=wt.getJsTemplateOrValueConfig(t,e[s])})),e;const s=e.trim();return"[[[["===s.substring(0,4)&&"]]]]"===s.slice(-4)?wt.evaluateJsTemplateConfig(t,s.slice(4,-4)):e}static evaluateJsTemplateConfig(t,e){try{return new Function("tool_config",`'use strict'; ${e}`).call(this,t)}catch(s){throw s.name="Sak-evaluateJsTemplateConfig-Error",s}}static evaluateJsTemplate(t,e,s){try{return new Function("state","states","entity","user","hass","tool_config","entity_config",`'use strict'; ${s}`).call(this,e,t._card._hass.states,t.config.hasOwnProperty("entity_index")?t._card.entities[t.config.entity_index]:void 0,t._card._hass.user,t._card._hass,t.config,t.config.hasOwnProperty("entity_index")?t._card.config.entities[t.config.entity_index]:void 0)}catch(i){throw i.name="Sak-evaluateJsTemplate-Error",i}}static getJsTemplateOrValue(t,e,s){if(!s)return s;if(["number","boolean","bigint","symbol"].includes(typeof s))return s;if("object"==typeof s)return Object.keys(s).forEach((i=>{s[i]=wt.getJsTemplateOrValue(t,e,s[i])})),s;const i=s.trim();return"[[["===i.substring(0,3)&&"]]]"===i.slice(-3)?wt.evaluateJsTemplate(t,e,i.slice(3,-3)):s}}
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
 */class xt{constructor(t){this.classes=new Set,this.changed=!1,this.element=t;const e=(t.getAttribute("class")||"").split(/\s+/);for(const s of e)this.classes.add(s)}add(t){this.classes.add(t),this.changed=!0}remove(t){this.classes.delete(t),this.changed=!0}commit(){if(this.changed){let t="";this.classes.forEach((e=>t+=e+" ")),this.element.setAttribute("class",t)}}}const $t=new WeakMap,St=f((t=>e=>{if(!(e instanceof C)||e instanceof V||"class"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `classMap` directive must be used in the `class` attribute and must be the only part in the attribute.");const{committer:s}=e,{element:i}=s;let o=$t.get(e);void 0===o&&(i.setAttribute("class",s.strings.join(" ")),$t.set(e,o=new Set));const a=i.classList||new xt(i);o.forEach((e=>{e in t||(a.remove(e),o.delete(e))}));for(const r in t){const e=t[r];e!=o.has(r)&&(e?(a.add(r),o.add(r)):(a.remove(r),o.delete(r)))}"function"==typeof a.commit&&a.commit()})),kt=(t,e,s,i)=>{i=i||{},s=null==s?{}:s;const o=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return o.detail=s,t.dispatchEvent(o),o};class Et{static{Et.colorCache={},Et.element=void 0}static _prefixKeys(t){let e={};return Object.keys(t).forEach((s=>{const i=`--${s}`,o=String(t[s]);e[i]=`${o}`})),e}static processTheme(t){let e={},s={},i={},o={};const{modes:a,...r}=t;return a&&(s={...r,...a.dark},e={...r,...a.light}),i=Et._prefixKeys(e),o=Et._prefixKeys(s),{themeLight:i,themeDark:o}}static processPalette(t){let e={},s={},i={},o={},a={};return Object.values(t).forEach((t=>{const{modes:o,...a}=t;e={...e,...a},o&&(i={...i,...a,...o.dark},s={...s,...a,...o.light})})),o=Et._prefixKeys(s),a=Et._prefixKeys(i),{paletteLight:o,paletteDark:a}}static setElement(t){Et.element=t}static calculateColor(t,e,s){const i=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let o,a,r;const n=i.length;if(t<=i[0])return e[i[0]];if(t>=i[n-1])return e[i[n-1]];for(let h=0;h<n-1;h++){const n=i[h],l=i[h+1];if(t>=n&&t<l){if([o,a]=[e[n],e[l]],!s)return o;r=Et.calculateValueBetween(n,l,t);break}}return Et.getGradientValue(o,a,r)}static calculateColor2(t,e,s,i,o){const a=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let r,n,h;const l=a.length;if(t<=a[0])return e[a[0]];if(t>=a[l-1])return e[a[l-1]];for(let c=0;c<l-1;c++){const l=a[c],d=a[c+1];if(t>=l&&t<d){if([r,n]=[e[l].styles[s][i],e[d].styles[s][i]],!o)return r;h=Et.calculateValueBetween(l,d,t);break}}return Et.getGradientValue(r,n,h)}static calculateValueBetween(t,e,s){return(Math.min(Math.max(s,t),e)-t)/(e-t)}static getColorVariable(t){const e=t.substr(4,t.length-5);return window.getComputedStyle(Et.element).getPropertyValue(e)}static getGradientValue(t,e,s){const i=Et.colorToRGBA(t),o=Et.colorToRGBA(e),a=1-s,r=s,n=Math.floor(i[0]*a+o[0]*r),h=Math.floor(i[1]*a+o[1]*r),l=Math.floor(i[2]*a+o[2]*r),c=Math.floor(i[3]*a+o[3]*r);return`#${Et.padZero(n.toString(16))}${Et.padZero(h.toString(16))}${Et.padZero(l.toString(16))}${Et.padZero(c.toString(16))}`}static padZero(t){return t.length<2&&(t=`0${t}`),t.substr(0,2)}static colorToRGBA(t){const e=Et.colorCache[t];if(e)return e;let s=t;"var"===t.substr(0,3).valueOf()&&(s=Et.getColorVariable(t));const i=window.document.createElement("canvas");i.width=i.height=1;const o=i.getContext("2d");o.clearRect(0,0,1,1),o.fillStyle=s,o.fillRect(0,0,1,1);const a=[...o.getImageData(0,0,1,1).data];return Et.colorCache[t]=a,a}static hslToRgb(t){const e=t.h/360,s=t.s/100,i=t.l/100;let o,a,r;if(0===s)o=a=r=i;else{function n(t,e,s){return s<0&&(s+=1),s>1&&(s-=1),s<1/6?t+6*(e-t)*s:s<.5?e:s<2/3?t+(e-t)*(2/3-s)*6:t}const h=i<.5?i*(1+s):i+s-i*s,l=2*i-h;o=n(l,h,e+1/3),a=n(l,h,e),r=n(l,h,e-1/3)}return o*=255,a*=255,r*=255,{r:o,g:a,b:r}}}class Tt{constructor(t,e,s){this.toolId=Math.random().toString(36).substr(2,9),this.toolset=t,this._card=this.toolset._card,this.config=e,this.dev={...this._card.dev},this.toolsetPos=s,this.svg={},this.svg.cx=bt.calculateSvgCoordinate(e.position.cx,0),this.svg.cy=bt.calculateSvgCoordinate(e.position.cy,0),this.svg.height=e.position.height?bt.calculateSvgDimension(e.position.height):0,this.svg.width=e.position.width?bt.calculateSvgDimension(e.position.width):0,this.svg.x=this.svg.cx-this.svg.width/2,this.svg.y=this.svg.cy-this.svg.height/2,this.classes={},this.classes.card={},this.classes.toolset={},this.classes.tool={},this.styles={},this.styles.card={},this.styles.toolset={},this.styles.tool={},this.animationClass={},this.animationClassHasChanged=!0,this.animationStyle={},this.animationStyleHasChanged=!0,this.config?.show?.style||(this.config.show||(this.config.show={}),this.config.show.style="default"),this.colorStops={},this.config.colorstops&&this.config.colorstops.colors&&Object.keys(this.config.colorstops.colors).forEach((t=>{this.colorStops[t]=this.config.colorstops.colors[t]})),"colorstop"===this.config.show.style&&this.config?.colorstops.colors&&(this.sortedColorStops=Object.keys(this.config.colorstops.colors).map((t=>Number(t))).sort(((t,e)=>t-e))),this.csnew={},this.config.csnew&&this.config.csnew.colors&&(this.config.csnew.colors.forEach(((t,e)=>{this.csnew[t.stop]=this.config.csnew.colors[e]})),this.sortedcsnew=Object.keys(this.csnew).map((t=>Number(t))).sort(((t,e)=>t-e)))}textEllipsis(t,e){return e&&e<t.length?t.slice(0,e-1).concat("..."):t}defaultEntityIndex(){return this.default||(this.default={},this.config.hasOwnProperty("entity_indexes")?this.default.entity_index=this.config.entity_indexes[0].entity_index:this.default.entity_index=this.config.entity_index),this.default.entity_index}set value(t){let e=t;this.dev.debug&&console.log("BaseTool set value(state)",e);try{if("undefined"!==e&&void 0!==e&&this._stateValue?.toString().toLowerCase()===e.toString().toLowerCase())return}catch(i){console.log("catching something",i,t,this.config)}this.derivedEntity=null,this.config.derived_entity&&(this.derivedEntity=wt.getJsTemplateOrValue(this,t,_t.mergeDeep(this.config.derived_entity)),e=this.derivedEntity.state?.toString()),this._stateValuePrev=this._stateValue||e,this._stateValue=e,this._stateValueIsDirty=!0;let s=!1;this.activeAnimation=null,this.config.animations&&Object.keys(this.config.animations).map((t=>{const e=JSON.parse(JSON.stringify(this.config.animations[t])),i=wt.getJsTemplateOrValue(this,this._stateValue,_t.mergeDeep(e));if(s)return!0;switch(i.operator?i.operator:"=="){case"==":s=void 0===this._stateValue?void 0===i.state||"undefined"===i.state.toLowerCase():this._stateValue.toLowerCase()===i.state.toLowerCase();break;case"!=":s=void 0===this._stateValue?"undefined"!==i.state.toLowerCase():this._stateValue.toLowerCase()!==i.state.toLowerCase();break;case">":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())>Number(i.state.toLowerCase()));break;case"<":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())<Number(i.state.toLowerCase()));break;case">=":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())>=Number(i.state.toLowerCase()));break;case"<=":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())<=Number(i.state.toLowerCase()));break;default:s=!1}return this.dev.debug&&console.log("BaseTool, animation, match, value, config, operator",s,this._stateValue,i.state,i.operator),!s||(this.animationClass&&i.reuse||(this.animationClass={}),i.classes&&(this.animationClass=_t.mergeDeep(this.animationClass,i.classes)),this.animationStyle&&i.reuse||(this.animationStyle={}),i.styles&&(this.animationStyle=_t.mergeDeep(this.animationStyle,i.styles)),this.animationStyleHasChanged=!0,this.item=i,this.activeAnimation=i,s)}))}getEntityIndexFromAnimation(t){return t.hasOwnProperty("entity_index")?t.entity_index:this.config.hasOwnProperty("entity_index")?this.config.entity_index:this.config.entity_indexes?this.config.entity_indexes[0].entity_index:void 0}getIndexInEntityIndexes(t){return this.config.entity_indexes.findIndex((e=>e.entity_index===t))}stateIsMatch(t,e){let s;const i=JSON.parse(JSON.stringify(t)),o=wt.getJsTemplateOrValue(this,e,_t.mergeDeep(i));switch(o.operator?o.operator:"=="){case"==":s=void 0===e?void 0===o.state||"undefined"===o.state.toLowerCase():e.toLowerCase()===o.state.toLowerCase();break;case"!=":s=void 0===e?void 0!==o.state||"undefined"!==o.state.toLowerCase():e.toLowerCase()!==o.state.toLowerCase();break;case">":void 0!==e&&(s=Number(e.toLowerCase())>Number(o.state.toLowerCase()));break;case"<":void 0!==e&&(s=Number(e.toLowerCase())<Number(o.state.toLowerCase()));break;case">=":void 0!==e&&(s=Number(e.toLowerCase())>=Number(o.state.toLowerCase()));break;case"<=":void 0!==e&&(s=Number(e.toLowerCase())<=Number(o.state.toLowerCase()));break;default:s=!1}return s}mergeAnimationData(t){this.animationClass&&t.reuse||(this.animationClass={}),t.classes&&(this.animationClass=_t.mergeDeep(this.animationClass,t.classes)),this.animationStyle&&t.reuse||(this.animationStyle={}),t.styles&&(this.animationStyle=_t.mergeDeep(this.animationStyle,t.styles)),this.animationStyleHasChanged=!0,this.item||(this.item={}),this.item=_t.mergeDeep(this.item,t),this.activeAnimation={...t}}set values(t){this._lastStateValues||(this._lastStateValues=[]),this._stateValues||(this._stateValues=[]);const e=[...t];this.dev.debug&&console.log("BaseTool set values(state)",e);for(let s=0;s<t.length;++s){void 0!==e[s]&&(this._stateValues[s]?.toLowerCase()===e[s].toLowerCase()||this.config.derived_entities&&(this.derivedEntities[s]=wt.getJsTemplateOrValue(this,t[s],_t.mergeDeep(this.config.derived_entities[s])),e[s]=this.derivedEntities[s].state?.toString())),this._lastStateValues[s]=this._stateValues[s]||e[s],this._stateValues[s]=e[s],this._stateValueIsDirty=!0;let i=!1;this.activeAnimation=null,this.config.animations&&Object.keys(this.config.animations.map(((e,s)=>{const o=this.getIndexInEntityIndexes(this.getEntityIndexFromAnimation(e));return i=this.stateIsMatch(e,t[o]),!!i&&(this.mergeAnimationData(e),!0)})))}this._stateValue=this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())],this._stateValuePrev=this._lastStateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]}EnableHoverForInteraction(){const t=this.config.hasOwnProperty("entity_index")||this.config?.user_actions?.tap_action;this.classes.tool.hover=!!t}MergeAnimationStyleIfChanged(t){this.animationStyleHasChanged&&(this.animationStyleHasChanged=!1,this.styles=t?_t.mergeDeep(t,this.config.styles,this.animationStyle):_t.mergeDeep(this.config.styles,this.animationStyle),this.styles.card&&0!==Object.keys(this.styles.card).length&&(this._card.styles.card=_t.mergeDeep(this.styles.card)))}MergeAnimationClassIfChanged(t){this.animationClassHasChanged=!0,this.animationClassHasChanged&&(this.animationClassHasChanged=!1,this.classes=t?_t.mergeDeep(t,this.config.classes,this.animationClass):_t.mergeDeep(this.config.classes,this.animationClass))}MergeColorFromState(t){if(this.config.hasOwnProperty("entity_index")){const e=this.getColorFromState(this._stateValue);""!==e&&(t.fill=this.config[this.config.show.style].fill?e:"",t.stroke=this.config[this.config.show.style].stroke?e:"")}}MergeColorFromState2(t,e){if(this.config.hasOwnProperty("entity_index")){const s=this.config[this.config.show.style].fill?this.getColorFromState2(this._stateValue,e,"fill"):"",i=this.config[this.config.show.style].stroke?this.getColorFromState2(this._stateValue,e,"stroke"):"";""!==s&&(t.fill=s),""!==i&&(t.stroke=i)}}getColorFromState(t){let e="";switch(this.config.show.style){case"default":break;case"fixedcolor":e=this.config.color;break;case"colorstop":case"colorstops":case"colorstopgradient":e=Et.calculateColor(t,this.colorStops,"colorstopgradient"===this.config.show.style);break;case"minmaxgradient":e=Et.calculateColor(t,this.colorStopsMinMax,!0)}return e}getColorFromState2(t,e,s){let i="";switch(this.config.show.style){case"colorstop":case"colorstops":case"colorstopgradient":i=Et.calculateColor2(t,this.csnew,e,s,"colorstopgradient"===this.config.show.style);break;case"minmaxgradient":i=Et.calculateColor2(t,this.colorStopsMinMax,e,s,!0)}return i}_processTapEvent(t,e,s,i,o,a){let r;if(i){kt(t,"haptic",i.haptic||"medium"),this.dev.debug&&console.log("_processTapEvent",s,i,o,a);for(let s=0;s<i.actions.length;s++)switch(i.actions[s].action){case"more-info":void 0!==o&&(r=new Event("hass-more-info",{composed:!0}),r.detail={entityId:o},t.dispatchEvent(r));break;case"navigate":if(!i.actions[s].navigation_path)return;window.history.pushState(null,"",i.actions[s].navigation_path),r=new Event("location-changed",{composed:!0}),r.detail={replace:!1},window.dispatchEvent(r);break;case"call-service":{if(!i.actions[s].service)return;const[t,r]=i.actions[s].service.split(".",2),n={...i.actions[s].service_data};n.entity_id||(n.entity_id=o),i.actions[s].parameter&&(n[i.actions[s].parameter]=a),e.callService(t,r,n);break}case"fire-dom-event":{const e={...i.actions[s]};r=new Event("ll-custom",{composed:!0,bubbles:!0}),r.detail=e,t.dispatchEvent(r);break}default:console.error("Unknown Event definition",i)}}}handleTapEvent(t,e){let s;t.stopPropagation(),t.preventDefault();let i=this.defaultEntityIndex();s=void 0===i||e.user_actions?e.user_actions?.tap_action:{haptic:"light",actions:[{action:"more-info"}]},s&&this._processTapEvent(this._card,this._card._hass,this.config,s,this._card.config.hasOwnProperty("entities")?this._card.config.entities[i]?.entity:void 0,void 0)}}class Ct extends Tt{constructor(t,e,s){super(t,_t.mergeDeep({position:{cx:50,cy:50,width:100,height:25,radius:5,ratio:30,divider:30},classes:{tool:{"sak-badge":!0,hover:!0},left:{"sak-badge__left":!0},right:{"sak-badge__right":!0}},styles:{tool:{},left:{},right:{}}},e),s),this.svg.radius=bt.calculateSvgDimension(e.position.radius),this.svg.leftXpos=this.svg.x,this.svg.leftYpos=this.svg.y,this.svg.leftWidth=this.config.position.ratio/100*this.svg.width,this.svg.arrowSize=this.svg.height*this.config.position.divider/100/2,this.svg.divSize=this.svg.height*(100-this.config.position.divider)/100/2,this.svg.rightXpos=this.svg.x+this.svg.leftWidth,this.svg.rightYpos=this.svg.y,this.svg.rightWidth=(100-this.config.position.ratio)/100*this.svg.width,this.classes.tool={},this.classes.left={},this.classes.right={},this.styles.tool={},this.styles.left={},this.styles.right={},this.dev.debug&&console.log("BadgeTool constructor coords, dimensions",this.svg,this.config)}_renderBadge(){let t=[];return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),t=B`
      <g  id="badge-${this.toolId}">
        <path class="${St(this.classes.right)}" d="
            M ${this.svg.rightXpos} ${this.svg.rightYpos}
            h ${this.svg.rightWidth-this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 ${this.svg.radius} ${this.svg.radius}
            v ${this.svg.height-2*this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 -${this.svg.radius} ${this.svg.radius}
            h -${this.svg.rightWidth-this.svg.radius}
            v -${this.svg.height-2*this.svg.radius}
            z
            "
            style="${nt(this.styles.right)}"/>

        <path class="${St(this.classes.left)}" d="
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
            style="${nt(this.styles.left)}"/>
      </g>
      `,B`${t}`}render(){return B`
      <g id="badge-${this.toolId}"
        class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderBadge()}
      </g>
    `}}class Mt extends Tt{constructor(t,e,s){super(t,_t.mergeDeep({position:{cx:50,cy:50,radius:50},classes:{tool:{"sak-circle":!0,hover:!0},circle:{"sak-circle__circle":!0}},styles:{tool:{},circle:{}}},e),s),this.EnableHoverForInteraction(),this.svg.radius=bt.calculateSvgDimension(e.position.radius),this.classes.tool={},this.classes.circle={},this.styles.tool={},this.styles.circle={},this.dev.debug&&console.log("CircleTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderCircle(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.circle),B`
      <circle class="${St(this.classes.circle)}"
        cx="${this.svg.cx}"% cy="${this.svg.cy}"% r="${this.svg.radius}"
        style="${nt(this.styles.circle)}"
      </circle>

      `}render(){return this.styles.tool.overflow="visible",this.styles["transform-origin"]=`${this.svg.cx} ${this.svg.cy}`,B`
      <g "" id="circle-${this.toolId}"
        class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderCircle()}
      </g>
    `}}class It extends Tt{constructor(t,e,s){switch(super(t,_t.mergeDeep({position:{cx:50,cy:50,radius:45,start_angle:30,end_angle:230,track:{width:2},active:{width:4},thumb:{height:10,width:10,radius:5},capture:{height:25,width:25,radius:25},label:{placement:"none",cx:10,cy:10}},show:{uom:"end",active:!1},classes:{tool:{"sak-circslider":!0,hover:!0},capture:{"sak-circslider__capture":!0,hover:!0},active:{"sak-circslider__active":!0},track:{"sak-circslider__track":!0},thumb:{"sak-circslider__thumb":!0,hover:!0},label:{"sak-circslider__value":!0},uom:{"sak-circslider__uom":!0}},styles:{tool:{},active:{},capture:{},track:{},thumb:{},label:{},uom:{}},scale:{min:0,max:100,step:1}},e),s),this.svg.radius=bt.calculateSvgDimension(this.config.position.radius),this.arc={},this.arc.startAngle=this.config.position.start_angle,this.arc.endAngle=this.config.position.end_angle,this.arc.size=yt(this.config.position.end_angle,this.config.position.start_angle),this.arc.clockwise=this.config.position.end_angle>this.config.position.start_angle,this.arc.direction=this.arc.clockwise?1:-1,this.arc.pathLength=2*this.arc.size/360*Math.PI*this.svg.radius,this.arc.arcLength=2*Math.PI*this.svg.radius,this.arc.startAngle360=vt(this.arc.startAngle,this.arc.startAngle,this.arc.endAngle),this.arc.endAngle360=vt(this.arc.startAngle,this.arc.endAngle,this.arc.endAngle),this.arc.startAngleSvgPoint=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,this.arc.startAngle360),this.arc.endAngleSvgPoint=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,this.arc.endAngle360),this.arc.scaleDasharray=2*this.arc.size/360*Math.PI*this.svg.radius,this.arc.dashOffset=this.arc.clockwise?0:-this.arc.scaleDasharray-this.arc.arcLength,this.arc.currentAngle=this.arc.startAngle,this.svg.startAngle=this.config.position.start_angle,this.svg.endAngle=this.config.position.end_angle,this.svg.diffAngle=this.config.position.end_angle-this.config.position.start_angle,this.svg.pathLength=2*this.arc.size/360*Math.PI*this.svg.radius,this.svg.circleLength=2*Math.PI*this.svg.radius,this.svg.label={},this.config.position.label.placement){case"position":this.svg.label.cx=bt.calculateSvgCoordinate(this.config.position.label.cx,0),this.svg.label.cy=bt.calculateSvgCoordinate(this.config.position.label.cy,0);break;case"thumb":this.svg.label.cx=this.svg.cx,this.svg.label.cy=this.svg.cy;break;case"none":break;default:throw console.error("CircularSliderTool - constructor: invalid label placement [none, position, thumb] = ",this.config.position.label.placement),Error("CircularSliderTool::constructor - invalid label placement [none, position, thumb] = ",this.config.position.label.placement)}this.svg.track={},this.svg.track.width=bt.calculateSvgDimension(this.config.position.track.width),this.svg.active={},this.svg.active.width=bt.calculateSvgDimension(this.config.position.active.width),this.svg.thumb={},this.svg.thumb.width=bt.calculateSvgDimension(this.config.position.thumb.width),this.svg.thumb.height=bt.calculateSvgDimension(this.config.position.thumb.height),this.svg.thumb.radius=bt.calculateSvgDimension(this.config.position.thumb.radius),this.svg.thumb.cx=this.svg.cx,this.svg.thumb.cy=this.svg.cy,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2,this.svg.capture={},this.svg.capture.width=bt.calculateSvgDimension(Math.max(this.config.position.capture.width,1.2*this.config.position.thumb.width)),this.svg.capture.height=bt.calculateSvgDimension(Math.max(this.config.position.capture.height,1.2*this.config.position.thumb.height)),this.svg.capture.radius=bt.calculateSvgDimension(this.config.position.capture.radius),this.svg.capture.x1=this.svg.cx-this.svg.capture.width/2,this.svg.capture.y1=this.svg.cy-this.svg.capture.height/2,this.svg.rotate={},this.svg.rotate.degrees=this.arc.clockwise?-90+this.arc.startAngle:this.arc.endAngle360-90,this.svg.rotate.cx=this.svg.cx,this.svg.rotate.cy=this.svg.cy,this.classes.track={},this.classes.active={},this.classes.thumb={},this.classes.label={},this.classes.uom={},this.styles.track={},this.styles.active={},this.styles.thumb={},this.styles.label={},this.styles.uom={},this.svg.scale={},this.svg.scale.min=this.config.scale.min,this.svg.scale.max=this.config.scale.max,this.svg.scale.center=Math.abs(this.svg.scale.max-this.svg.scale.min)/2+this.svg.scale.min,this.svg.scale.svgPointMin=this.sliderValueToPoint(this.svg.scale.min),this.svg.scale.svgPointMax=this.sliderValueToPoint(this.svg.scale.max),this.svg.scale.svgPointCenter=this.sliderValueToPoint(this.svg.scale.center),this.svg.scale.step=this.config.scale.step,this.rid=null,this.thumbPos=this.sliderValueToPoint(this.config.scale.min),this.svg.thumb.x1=this.thumbPos.x-this.svg.thumb.width/2,this.svg.thumb.y1=this.thumbPos.y-this.svg.thumb.height/2,this.svg.capture.x1=this.thumbPos.x-this.svg.capture.width/2,this.svg.capture.y1=this.thumbPos.y-this.svg.capture.height/2,this.dev.debug&&console.log("CircularSliderTool::constructor",this.config,this.svg)}pointToAngle360(t,e,s){let i=-Math.atan2(t.y-e.y,e.x-t.x)/(Math.PI/180);return i+=-90,i<0&&(i+=360),this.arc.clockwise&&i<this.arc.startAngle360&&(i+=360),this.arc.clockwise||i<this.arc.endAngle360&&(i+=360),i}isAngle360InBetween(t){let e;return e=this.arc.clockwise?t>=this.arc.startAngle360&&t<=this.arc.endAngle360:t<=this.arc.startAngle360&&t>=this.arc.endAngle360,!!e}polarToCartesian(t,e,s,i,o){const a=(o-90)*Math.PI/180;return{x:t+s*Math.cos(a),y:e+i*Math.sin(a)}}pointToSliderValue(t){let e,s;const i={};i.x=this.svg.cx,i.y=this.svg.cy;const o=this.pointToAngle360(t,i,!0);let{myAngle:a}=this;const r=this.isAngle360InBetween(o);var n,h,l;return r&&(this.myAngle=o,a=o,this.arc.currentAngle=a),this.arc.currentAngle=a,this.arc.clockwise&&(s=(a-this.arc.startAngle360)/this.arc.size),this.arc.clockwise||(s=(this.arc.startAngle360-a)/this.arc.size),e=(this.config.scale.max-this.config.scale.min)*s+this.config.scale.min,e=Math.round(e/this.svg.scale.step)*this.svg.scale.step,e=Math.max(Math.min(this.config.scale.max,e),this.config.scale.min),this.arc.currentAngle=a,this.dragging&&!r&&(n=this.svg.scale.min,h=e,l=this.svg.scale.max,e=Math.abs(h-n)>Math.abs(l-h)?l:n,this.m=this.sliderValueToPoint(e)),e}sliderValueToPoint(t){let e,s=bt.calculateValueBetween(this.config.scale.min,this.config.scale.max,t);isNaN(s)&&(s=0),e=this.arc.clockwise?this.arc.size*s+this.arc.startAngle360:this.arc.size*(1-s)+this.arc.endAngle360,e<0&&(e+=360);const i=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,e);return this.arc.currentAngle=e,i}updateValue(t){this._value=this.pointToSliderValue(t);Math.abs(0)<.01&&this.rid&&(window.cancelAnimationFrame(this.rid),this.rid=null)}updateThumb(t){if(this.dragging){this.thumbPos=this.sliderValueToPoint(this._value),this.svg.thumb.x1=this.thumbPos.x-this.svg.thumb.width/2,this.svg.thumb.y1=this.thumbPos.y-this.svg.thumb.height/2,this.svg.capture.x1=this.thumbPos.x-this.svg.capture.width/2,this.svg.capture.y1=this.thumbPos.y-this.svg.capture.height/2;const t=`rotate(${this.arc.currentAngle} ${this.svg.capture.width/2} ${this.svg.capture.height/2})`;this.elements.thumb.setAttribute("transform",t),this.elements.thumbGroup.setAttribute("x",this.svg.capture.x1),this.elements.thumbGroup.setAttribute("y",this.svg.capture.y1)}this.updateLabel(t)}updateActiveTrack(t){const e=this.config.scale.min||0,s=this.config.scale.max||100;let i=bt.calculateValueBetween(e,s,this.labelValue);isNaN(i)&&(i=0);const o=i*this.svg.pathLength;this.dashArray=`${o} ${this.svg.circleLength}`,this.dragging&&this.elements.activeTrack.setAttribute("stroke-dasharray",this.dashArray)}updateLabel(t){this.dev.debug&&console.log("SLIDER - updateLabel start",t,this.config.position.orientation);const e=this._card.config.entities[this.defaultEntityIndex()].decimals||0,s=10**e;this.labelValue2=(Math.round(this.pointToSliderValue(t)*s)/s).toFixed(e),console.log("updateLabel, labelvalue ",this.labelValue2),"none"!==this.config.position.label.placement&&(this.elements.label.textContent=this.labelValue2)}mouseEventToPoint(t){let e=this.elements.svg.createSVGPoint();e.x=t.touches?t.touches[0].clientX:t.clientX,e.y=t.touches?t.touches[0].clientY:t.clientY;const s=this.elements.svg.getScreenCTM().inverse();return e=e.matrixTransform(s),e}callDragService(){void 0!==this.labelValue2&&(this.labelValuePrev!==this.labelValue2&&(this.labelValuePrev=this.labelValue2,this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions.tap_action,this._card.config.entities[this.defaultEntityIndex()]?.entity,this.labelValue2)),this.dragging&&(this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval)))}callTapService(){void 0!==this.labelValue2&&this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions?.tap_action,this._card.config.entities[this.defaultEntityIndex()]?.entity,this.labelValue2)}firstUpdated(t){function e(){this.rid=window.requestAnimationFrame(e),this.updateValue(this.m),this.updateThumb(this.m),this.updateActiveTrack(this.m)}this.labelValue=this._stateValue,this.dev.debug&&console.log("circslider - firstUpdated"),this.elements={},this.elements.svg=this._card.shadowRoot.getElementById("circslider-".concat(this.toolId)),this.elements.track=this.elements.svg.querySelector("#track"),this.elements.activeTrack=this.elements.svg.querySelector("#active-track"),this.elements.capture=this.elements.svg.querySelector("#capture"),this.elements.thumbGroup=this.elements.svg.querySelector("#thumb-group"),this.elements.thumb=this.elements.svg.querySelector("#thumb"),this.elements.label=this.elements.svg.querySelector("#label tspan"),this.dev.debug&&console.log("circslider - firstUpdated svg = ",this.elements.svg,"activeTrack=",this.elements.activeTrack,"thumb=",this.elements.thumb,"label=",this.elements.label,"text=",this.elements.text);const s=()=>{const t=yt(this.svg.scale.max,this.labelValue)<=this.rangeMax,e=yt(this.svg.scale.min,this.labelValue)<=this.rangeMin,s=!(!e||!this.diffMax),i=!(!t||!this.diffMin);s?(this.labelValue=this.svg.scale.max,this.m=this.sliderValueToPoint(this.labelValue),this.rangeMax=this.svg.scale.max/10,this.rangeMin=yt(this.svg.scale.max,this.svg.scale.min+this.svg.scale.max/5)):i?(this.labelValue=this.svg.scale.min,this.m=this.sliderValueToPoint(this.labelValue),this.rangeMax=yt(this.svg.scale.min,this.svg.scale.max-this.svg.scale.max/5),this.rangeMin=this.svg.scale.max/10):(this.diffMax=t,this.diffMin=e,this.rangeMin=this.svg.scale.max/5,this.rangeMax=this.svg.scale.max/5)},i=t=>{t.preventDefault(),this.dragging&&(this.m=this.mouseEventToPoint(t),this.labelValue=this.pointToSliderValue(this.m),s(),e.call(this))},o=t=>{t.preventDefault(),this.dragging=!0,window.addEventListener("pointermove",i,!1),window.addEventListener("pointerup",a,!1),this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(this.config.user_actions.drag_action.update_interval>0?this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval):this.timeOutId=null),this.m=this.mouseEventToPoint(t),this.labelValue=this.pointToSliderValue(this.m),s(),this.dev.debug&&console.log("pointerDOWN",Math.round(100*this.m.x)/100),e.call(this)},a=t=>{t.preventDefault(),this.dev.debug&&console.log("pointerUP"),window.removeEventListener("pointermove",i,!1),window.removeEventListener("pointerup",a,!1),window.removeEventListener("mousemove",i,!1),window.removeEventListener("touchmove",i,!1),window.removeEventListener("mouseup",a,!1),window.removeEventListener("touchend",a,!1),this.labelValuePrev=this.labelValue,this.dragging?(this.dragging=!1,clearTimeout(this.timeOutId),this.timeOutId=null,this.target=0,this.labelValue2=this.labelValue,e.call(this),this.callTapService()):s()};this.elements.thumbGroup.addEventListener("touchstart",o,!1),this.elements.thumbGroup.addEventListener("mousedown",o,!1),this.elements.svg.addEventListener("wheel",(t=>{t.preventDefault(),clearTimeout(this.wheelTimeOutId),this.dragging=!0,this.wheelTimeOutId=setTimeout((()=>{clearTimeout(this.timeOutId),this.timeOutId=null,this.labelValue2=this.labelValue,this.dragging=!1,this.callTapService()}),500),this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(this.config.user_actions.drag_action.update_interval>0?this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval):this.timeOutId=null);const s=+this.labelValue+ +(t.altKey?10*this.svg.scale.step:this.svg.scale.step)*Math.sign(t.deltaY);var i,o,a;this.labelValue=(i=this.svg.scale.min,o=s,a=this.svg.scale.max,Math.min(Math.max(o,i),a)),this.m=this.sliderValueToPoint(this.labelValue),this.pointToSliderValue(this.m),e.call(this),this.labelValue2=this.labelValue}),!1)}set value(t){if(super.value=t,this.dragging||(this.labelValue=this._stateValue),!this.dragging){const t=this.config.scale.min||0,e=this.config.scale.max||100;let s=Math.min(bt.calculateValueBetween(t,e,this._stateValue),1);isNaN(s)&&(s=0);const i=s*this.svg.pathLength;this.dashArray=`${i} ${this.svg.circleLength}`;const o=this.sliderValueToPoint(this._stateValue);this.svg.thumb.x1=o.x-this.svg.thumb.width/2,this.svg.thumb.y1=o.y-this.svg.thumb.height/2,this.svg.capture.x1=o.x-this.svg.capture.width/2,this.svg.capture.y1=o.y-this.svg.capture.height/2}}set values(t){if(super.values=t,this.dragging||(this.labelValue=this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]),!this.dragging){const t=this.config.scale.min||0,e=this.config.scale.max||100;let s=Math.min(bt.calculateValueBetween(t,e,this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]),1);isNaN(s)&&(s=0);const i=s*this.svg.pathLength;this.dashArray=`${i} ${this.svg.circleLength}`;const o=this.sliderValueToPoint(this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]);this.svg.thumb.x1=o.x-this.svg.thumb.width/2,this.svg.thumb.y1=o.y-this.svg.thumb.height/2,this.svg.capture.x1=o.x-this.svg.capture.width/2,this.svg.capture.y1=o.y-this.svg.capture.height/2}}_renderUom(){if("none"===this.config.show.uom)return B``;{this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.uom);let t=this.styles.label["font-size"],e=.5,s="em";const i=t.match(/\D+|\d*\.?\d+/g);2===i.length?(e=.6*Number(i[0]),s=i[1]):console.error("Cannot determine font-size for state/unit",t),t={"font-size":e+s},this.styles.uom=_t.mergeDeep(this.config.styles.uom,t);const o=this._card._buildUom(this.derivedEntity,this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]);return"end"===this.config.show.uom?B`
          <tspan class="${St(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${nt(this.styles.uom)}">
            ${o}</tspan>
        `:"bottom"===this.config.show.uom?B`
          <tspan class="${St(this.classes.uom)}" x="${this.svg.label.cx}" dy="1.5em"
            style="${nt(this.styles.uom)}">
            ${o}</tspan>
        `:"top"===this.config.show.uom?B`
          <tspan class="${St(this.classes.uom)}" x="${this.svg.label.cx}" dy="-1.5em"
            style="${nt(this.styles.uom)}">
            ${o}</tspan>
        `:B`
          <tspan class="${St(this.classes.uom)}"  dx="-0.1em" dy="-0.35em"
            style="${nt(this.styles.uom)}">
            ERR</tspan>
        `}}_renderCircSlider(){return this.MergeAnimationClassIfChanged(),this.MergeColorFromState(),this.MergeAnimationStyleIfChanged(),this.renderValue=this._stateValue,this.dragging?this.renderValue=this.labelValue2:this.elements?.label&&(this.elements.label.textContent="undefined"===this.renderValue?"":this.renderValue),B`
      <g id="circslider__group-inner" class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}">

        <circle id="track" class="sak-circslider__track" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          style="${nt(this.styles.track)}"
          stroke-dasharray="${this.arc.scaleDasharray} ${this.arc.arcLength}"
          stroke-dashoffset="${this.arc.dashOffset}"
          stroke-width="${this.svg.track.width}"
          transform="rotate(${this.svg.rotate.degrees} ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        <circle id="active-track" class="sak-circslider__active" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          fill="${this.config.fill||"rgba(0, 0, 0, 0)"}"
          style="${nt(this.styles.active)}"
          stroke-dasharray="${this.dashArray}"
          stroke-dashoffset="${this.arc.dashOffset}"
          stroke-width="${this.svg.active.width}"
          transform="rotate(${this.svg.rotate.degrees} ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        ${function(){return B`
        <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}" style="filter:url(#sak-drop-1);overflow:visible;">
          <g style="transform-origin:center;transform-box: fill-box;" >
          <g id="thumb" transform="rotate(${this.arc.currentAngle} ${this.svg.capture.width/2} ${this.svg.capture.height/2})">

            <rect id="capture" class="${St(this.classes.capture)}" x="0" y="0"
              width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}" 
              style="${nt(this.styles.capture)}" 
            />

            <rect id="rect-thumb" class="${St(this.classes.thumb)}" x="${(this.svg.capture.width-this.svg.thumb.width)/2}" y="${(this.svg.capture.height-this.svg.thumb.height)/2}"
              width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
              style="${nt(this.styles.thumb)}"
            />

            </g>
            </g>
        </g>
      `}.call(this)}
        ${function(t){return"thumb"===this.config.position.label.placement&&t?B`
      <text id="label">
        <tspan class="${St(this.classes.label)}" x="${this.svg.label.cx}" y="${this.svg.label.cy}" style="${nt(this.styles.label)}">
        ${void 0===this.renderValue?"":this.renderValue}</tspan>
        ${void 0===this.renderValue?"":this._renderUom()}
        </text>
        `:"position"!==this.config.position.label.placement||t?void 0:B`
          <text id="label" style="transform-origin:center;transform-box: fill-box;">
            <tspan class="${St(this.classes.label)}" data-placement="position" x="${this.svg.label.cx}" y="${this.svg.label.cy}"
            style="${nt(this.styles.label)}">
            ${void 0===this.renderValue?"":this.renderValue}</tspan>
            ${void 0===this.renderValue?"":this._renderUom()}
          </text>
          `}.call(this,!1)}
      </g>

    `}render(){return B`
      <svg xmlns="http://www.w3.org/2000/svg" id="circslider-${this.toolId}" class="circslider__group-outer" overflow="visible"
        touch-action="none" style="touch-action:none;"
      >
        ${this._renderCircSlider()}

      </svg>
    `}}class At extends Tt{constructor(t,e,s){super(t,_t.mergeDeep({position:{cx:50,cy:50,radiusx:50,radiusy:25},classes:{tool:{"sak-ellipse":!0,hover:!0},ellipse:{"sak-ellipse__ellipse":!0}},styles:{tool:{},ellipse:{}}},e),s),this.svg.radiusx=bt.calculateSvgDimension(e.position.radiusx),this.svg.radiusy=bt.calculateSvgDimension(e.position.radiusy),this.classes.tool={},this.classes.ellipse={},this.styles.tool={},this.styles.ellipse={},this.dev.debug&&console.log("EllipseTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_renderEllipse(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.ellipse),this.dev.debug&&console.log("EllipseTool - renderEllipse",this.svg.cx,this.svg.cy,this.svg.radiusx,this.svg.radiusy),B`
      <ellipse class="${St(this.classes.ellipse)}"
        cx="${this.svg.cx}"% cy="${this.svg.cy}"%
        rx="${this.svg.radiusx}" ry="${this.svg.radiusy}"
        style="${nt(this.styles.ellipse)}"/>
      `}render(){return B`
      <g id="ellipse-${this.toolId}"
        class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderEllipse()}
      </g>
    `}}class Vt extends Tt{constructor(t,e,s){super(t,_t.mergeDeep({classes:{tool:{},area:{"sak-area__area":!0,hover:!0}},styles:{tool:{},area:{}}},e),s),this.classes.tool={},this.classes.area={},this.styles.tool={},this.styles.area={},this.dev.debug&&console.log("EntityAreaTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_buildArea(t,e){return e.area||"?"}_renderEntityArea(){this.MergeAnimationClassIfChanged(),this.MergeColorFromState(this.styles.area),this.MergeAnimationStyleIfChanged();const t=this.textEllipsis(this._buildArea(this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]),this.config?.show?.ellipsis);return B`
        <text>
          <tspan class="${St(this.classes.area)}"
          x="${this.svg.cx}" y="${this.svg.cy}" style="${nt(this.styles.area)}">${t}</tspan>
        </text>
      `}render(){return B`
      <g id="area-${this.toolId}"
        class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderEntityArea()}
      </g>
    `}}const Nt="mdi:bookmark",Dt={air_quality:"mdi:air-filter",alert:"mdi:alert",calendar:"mdi:calendar",climate:"mdi:thermostat",configurator:"mdi:cog",conversation:"mdi:microphone-message",counter:"mdi:counter",datetime:"mdi:calendar-clock",date:"mdi:calendar",demo:"mdi:home-assistant",google_assistant:"mdi:google-assistant",group:"mdi:google-circles-communities",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_button:"mdi:gesture-tap-button",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",number:"mdi:ray-vertex",persistent_notification:"mdi:bell",plant:"mdi:Flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:palette",schedule:"mdi:calendar-clock",script:"mdi:script-text",select:"mdi:format-list-bulleted",sensor:"mdi:Eye",simple_alarm:"mdi:bell",siren:"mdi:bullhorn",stt:"mdi:microphone-message",text:"mdi:form-textbox",time:"mdi:clock",timer:"mdi:timer-outline",tts:"mdi:speaker-message",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",zone:"mdi:map-marker-radius"},Pt={apparent_power:"mdi:flash",aqi:"mdi:air-filter",atmospheric_pressure:"mdi:thermometer-lines",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co",current:"mdi:current-ac",data_rate:"mdi:transmission-tower",data_size:"mdi:database",date:"mdi:calendar",distance:"mdi:arrow-left-right",duration:"mdi:progress-clock",energy:"mdi:lightning-bolt",frequency:"mdi:sine-wave",gas:"mdi:meter-gas",humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",irradiance:"mdi:sun-wireless",moisture:"mdi:water-percent",monetary:"mdi:cash",nitrogen_dioxide:"mdi:molecule",nitrogen_monoxide:"mdi:molecule",nitrous_oxide:"mdi:molecule",ozone:"mdi:molecule",pm1:"mdi:molecule",pm10:"mdi:molecule",pm25:"mdi:molecule",power:"mdi:flash",power_factor:"mdi:angle-acute",precipitation:"mdi:weather-rainy",precipitation_intensity:"mdi:weather-pouring",pressure:"mdi:gauge",reactive_power:"mdi:flash",signal_strength:"mdi:wifi",sound_pressure:"mdi:ear-hearing",speed:"mdi:speedometer",sulphur_dioxide:"mdi:molecule",temperature:"mdi:thermometer",timestamp:"mdi:clock",volatile_organic_compounds:"mdi:molecule",volatile_organic_compounds_parts:"mdi:molecule",voltage:"mdi:sine-wave",volume:"mdi:car-coolant-level",water:"mdi:water",weight:"mdi:weight",wind_speed:"mdi:weather-windy"},Ot=t=>t.substr(0,t.indexOf("."));new Set(["fan","input_boolean","light","switch","group","automation","humidifier"]),new Set(["camera","media_player"]);const Rt={10:"mdi:battery-10",20:"mdi:battery-20",30:"mdi:battery-30",40:"mdi:battery-40",50:"mdi:battery-50",60:"mdi:battery-60",70:"mdi:battery-70",80:"mdi:battery-80",90:"mdi:battery-90",100:"mdi:battery"},Lt={10:"mdi:battery-charging-10",20:"mdi:battery-charging-20",30:"mdi:battery-charging-30",40:"mdi:battery-charging-40",50:"mdi:battery-charging-50",60:"mdi:battery-charging-60",70:"mdi:battery-charging-70",80:"mdi:battery-charging-80",90:"mdi:battery-charging-90",100:"mdi:battery-charging"},Ft=(t,e)=>{const s=Number(t);if(isNaN(s))return"off"===t?"mdi:battery":"on"===t?"mdi:battery-alert":"mdi:battery-unknown";const i=10*Math.round(s/10);return e&&s>=10?Lt[i]:e?"mdi:battery-charging-outline":s<=5?"mdi:battery-alert-variant-outline":Rt[i]},zt=t=>{const e=t?.attributes.device_class;if(e&&e in Pt)return Pt[e];if("battery"===e)return t?((t,e)=>{const s=t.state,i=e&&"on"===e.state;return Ft(s,i)})(t):"mdi:battery";const s=t?.attributes.unit_of_measurement;return"°C"===s||"°F"===s?"mdi-thermometer":void 0},Bt=(t,e,s)=>{const i=void 0!==s?s:e?.state;switch(t){case"alarm_control_panel":return(t=>{switch(t){case"armed_away":return"mdi:shield-lock";case"armed_vacation":return"mdi:shield-airplane";case"armed_home":return"mdi:shield-home";case"armed_night":return"mdi:shield-moon";case"armed_custom_bypass":return"mdi:security";case"pending":return"mdi:shield-outline";case"triggered":return"mdi:bell-ring";case"disarmed":return"mdi:shield-off";default:return"mdi:shield"}})(i);case"automation":return"off"===i?"mdi:robot-off":"mdi:robot";case"binary_sensor":return((t,e)=>{const s="off"===t;switch(e?.attributes.device_class){case"battery":return s?"mdi:battery":"mdi:battery-outline";case"battery_charging":return s?"mdi:battery":"mdi:battery-charging";case"carbon_monoxide":return s?"mdi:smoke-detector":"mdi:smoke-detector-alert";case"cold":return s?"mdi:thermometer":"mdi:Snowflake";case"connectivity":return s?"mdi:close-network-outline":"mdi:check-network-outline";case"door":return s?"mdi:door-closed":"mdi:door-open";case"garage_door":return s?"mdi:garage":"mdi:garage-open";case"power":case"plug":return s?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return s?"mdi:check-circle":"mdi:alert-circle";case"smoke":return s?"mdi:smoke-detector-variant":"mdi:smoke-detector-variant-alert";case"heat":return s?"mdi:thermometer":"mdi:fire";case"light":return s?"mdi:brightness-5":"mdi:brightness-7";case"lock":return s?"mdi:lock":"mdi:lock-open";case"moisture":return s?"mdi:water-off":"mdi:water";case"motion":return s?"mdi:motion-sensor-off":"mdi:motion-sensor";case"occupancy":return s?"mdi:home-outline":"mdi:Home";case"opening":return s?"mdi:square":"mdi:square-outline";case"presence":return s?"mdi:home-outline":"mdi:home";case"running":return s?"mdi:stop":"mdi:play";case"sound":return s?"mdi:music-note-off":"mdi:music-note";case"update":return s?"mdi:package":"mdi:package-up";case"vibration":return s?"mdi:crop-portrait":"mdi:vibrate";case"window":return s?"mdi:window-closed":"mdi:window-open";default:return s?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}})(i,e);case"button":switch(e?.attributes.device_class){case"restart":return"mdi:restart";case"update":return"mdi:package-up";default:return"mdi:gesture-tap-button"}case"camera":return"off"===i?"mdi:video-off":"mdi:video";case"cover":return((t,e)=>{const s="closed"!==t;switch(e?.attributes.device_class){case"garage":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdigarage";default:return"mdi:Garage-open"}case"gate":switch(t){case"opening":case"closing":return"mdi:gate-arrow-right";case"closed":return"mdi:gate";default:return"mdi:gate-open"}case"door":return s?"mdi:door-open":"mdi:door-closed";case"damper":return s?"mdi:circle":"mdi:circle-slice-8";case"shutter":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window-shutter";default:return"mdi:window-shutter-open"}case"curtain":switch(t){case"opening":return"mdi:arrow-split-vertical";case"closing":return"mdi:arrow-collapse-horizontal";case"closed":return"mdi:curtains-closed";default:return"mdi:curtains"}case"blind":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:blinds-horizontal-closed";default:return"mdi:blinds-horizontal"}case"shade":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:roller-shade-closed";default:return"mdi:roller-shade"}case"window":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}}switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}})(i,e);case"device_tracker":return"router"===e?.attributes.source_type?"home"===i?"mdi:lan-connect":"mdi:lan-cisconnect":["bluetooth","bluetooth_le"].includes(e?.attributes.source_type)?"home"===i?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===i?"mdi:account-arrow-right":"mdi:account";case"fan":return"off"===i?"mdi:fan-off":"mdi:fan";case"humidifier":return"off"===i?"mdi:air-humidifier-off":"mdi:air-humidifier";case"input_boolean":return"on"===i?"mdi:check-circle-outline":"mdi:close-circle-outline";case"input_datetime":if(!e?.attributes.has_date)return"mdi:clock";if(!e.attributes.has_time)return"mdi:calendar";break;case"lock":switch(i){case"unlocked":return"mdi:lock-open";case"jammed":return"mdi:lock-alert";case"locking":case"unlocking":return"mdi:lock-clock";default:return"mdi:lock"}case"media_player":switch(e?.attributes.device_class){case"speaker":switch(i){case"playing":return"mdi:speaker-play";case"paused":return"mdi:speaker-pause";case"off":return"mdi:speaker-off";default:return"mdi:speaker"}case"tv":switch(i){case"playing":return"mdi:television-play";case"paused":return"mdi:television-pause";case"off":return"mdi:television-off";default:return"mdi:television"}case"receiver":return"off"===i?"mdi:audio-video-off":"mdi:audio-video";default:switch(i){case"playing":case"paused":return"mdi:cast-connected";case"off":return"mdi:cast-off";default:return"mdi:cast"}}case"number":{const t=(t=>{const e=t?.attributes.device_class;if(e&&e in Pt)return Pt[e]})(e);if(t)return t;break}case"person":return"not_home"===i?"mdi:account-arrow-right":"mdi:account";case"switch":switch(e?.attributes.device_class){case"outlet":return"on"===i?"mdi:power-plug":"mdi:power-plug-off";case"switch":return"on"===i?"mdi:toggle-switch-variant":"mdi:toggle-switch-variant-off";default:return"mdi:toggle-switch-variant"}case"sensor":{const t=zt(e);if(t)return t;break}case"sun":return"above_horizon"===e?.state?"mdi:white-balance-sunny":"mdi:weather-night";case"switch_as_x":return"mdi:swap-horizontal";case"threshold":return"mdi:chart-sankey";case"water_heater":return"off"===i?"mdi:water-boiler-off":"mdi:water-boiler"}if(t in Dt)return Dt[t]},Ut=t=>t?((t,e,s)=>{const i=Bt(t,e,s);return i||(console.warn(`Unable to find icon for domain ${t}`),Nt)})(Ot(t.entity_id),t):Nt;class jt extends Tt{constructor(t,e,s){super(t,_t.mergeDeep({classes:{tool:{"sak-icon":!0,hover:!0},icon:{"sak-icon__icon":!0}},styles:{tool:{},icon:{}}},e),s),this.svg.iconSize=this.config.position.icon_size?this.config.position.icon_size:3,this.svg.iconPixels=4*this.svg.iconSize;const i=this.config.position.align?this.config.position.align:"center",o="center"===i?.5:"start"===i?-1:1,a=400/this._card.viewBox.width;this.svg.xpx=this.svg.cx,this.svg.ypx=this.svg.cy,!this._card.isSafari&&!this._card.iOS||this._card.isSafari16?(this.svg.xpx-=this.svg.iconPixels*o,this.svg.ypx=this.svg.ypx-.5*this.svg.iconPixels-.25*this.svg.iconPixels):(this.svg.iconSize*=a,this.svg.xpx=this.svg.xpx*a-this.svg.iconPixels*o*a,this.svg.ypx=this.svg.ypx*a-.5*this.svg.iconPixels*a-.25*this.svg.iconPixels*a),this.classes.tool={},this.classes.icon={},this.styles.tool={},this.styles.icon={},this.dev.debug&&console.log("EntityIconTool constructor coords, dimensions, config",this.coords,this.dimensions,this.config)}static{jt.sakIconCache={}}_buildIcon(t,e,s){return this.activeAnimation?.icon||s||e?.icon||t?.attributes?.icon||Ut(t)}_renderIcon(){this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.icon);const t=this._buildIcon(this._card.entities[this.defaultEntityIndex()],void 0!==this.defaultEntityIndex()?this._card.config.entities[this.defaultEntityIndex()]:void 0,this.config.icon);{this.svg.iconSize=this.config.position.icon_size?this.config.position.icon_size:2,this.svg.iconPixels=4*this.svg.iconSize,this.svg.iconSize=this.config.position.icon_size?this.config.position.icon_size:2,this.svg.iconPixels=bt.calculateSvgDimension(this.svg.iconSize);const t=this.config.position.align?this.config.position.align:"center",e="center"===t?.5:"start"===t?-1:1,s=400/this._card.viewBox.width;this.svg.xpx=this.svg.cx,this.svg.ypx=this.svg.cy,!this._card.isSafari&&!this._card.iOS||this._card.isSafari16?(this.svg.xpx=this.svg.cx-this.svg.iconPixels*e,this.svg.ypx=this.svg.cy-this.svg.iconPixels*e,this.dev.debug&&console.log("EntityIconTool::_renderIcon - svg values =",this.toolId,this.svg,this.config.cx,this.config.cy,t,e)):(this.svg.iconSize*=s,this.svg.iconPixels*=s,this.svg.xpx=this.svg.xpx*s-this.svg.iconPixels*e*s,this.svg.ypx=this.svg.ypx*s-.9*this.svg.iconPixels*s,this.svg.xpx=this.svg.cx*s-this.svg.iconPixels*e*s,this.svg.ypx=this.svg.cy*s-this.svg.iconPixels*e*s)}if(this.alternateColor||(this.alternateColor="rgba(0,0,0,0)"),jt.sakIconCache[t])this.iconSvg=jt.sakIconCache[t];else{const e=this._card.shadowRoot.getElementById("icon-".concat(this.toolId))?.shadowRoot?.querySelectorAll("*");this.iconSvg=e?e[0]?.path:void 0,this.iconSvg&&(jt.sakIconCache[t]=this.iconSvg)}let e;return this.iconSvg?(this.svg.iconSize=this.config.position.icon_size?this.config.position.icon_size:2,this.svg.iconPixels=bt.calculateSvgDimension(this.svg.iconSize),this.svg.x1=this.svg.cx-this.svg.iconPixels/2,this.svg.y1=this.svg.cy-this.svg.iconPixels/2,this.svg.x1=this.svg.cx-.5*this.svg.iconPixels,this.svg.y1=this.svg.cy-.5*this.svg.iconPixels,e=this.svg.iconPixels/24,B`
        <g id="icon-${this.toolId}" class="${St(this.classes.icon)}" style="${nt(this.styles.icon)}" x="${this.svg.x1}px" y="${this.svg.y1}px" transform-origin="${this.svg.cx} ${this.svg.cy}">
          <rect x="${this.svg.x1}" y="${this.svg.y1}" height="${this.svg.iconPixels}px" width="${this.svg.iconPixels}px" stroke-width="0px" fill="rgba(0,0,0,0)"></rect>
          <path d="${this.iconSvg}" transform="translate(${this.svg.x1},${this.svg.y1}) scale(${e})"></path>
        <g>
      `):B`
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
        `}_handleAnimationEvent(t,e){t.stopPropagation(),t.preventDefault(),e.iconSvg=this._card.shadowRoot.getElementById("icon-".concat(this.toolId))?.shadowRoot?.querySelectorAll("*")[0]?.path,e.iconSvg&&e._card.requestUpdate()}firstUpdated(t){}render(){return B`
      <g "" id="icongrp-${this.toolId}" class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)} >

        ${this._renderIcon()}
      </g>
    `}}class Gt extends Tt{constructor(t,e,s){super(t,_t.mergeDeep({classes:{tool:{"sak-name":!0,hover:!0},name:{"sak-name__name":!0}},styles:{tool:{},name:{}}},e),s),this._name={},this.classes.tool={},this.classes.name={},this.styles.tool={},this.styles.name={},this.dev.debug&&console.log("EntityName constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_buildName(t,e){return this.activeAnimation?.name||e.name||t.attributes.friendly_name}_renderEntityName(){this.MergeAnimationClassIfChanged(),this.MergeColorFromState(this.styles.name),this.MergeAnimationStyleIfChanged();const t=this.textEllipsis(this._buildName(this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]),this.config?.show?.ellipsis);return B`
        <text>
          <tspan class="${St(this.classes.name)}" x="${this.svg.cx}" y="${this.svg.cy}" style="${nt(this.styles.name)}">${t}</tspan>
        </text>
      `}render(){return B`
      <g id="name-${this.toolId}"
        class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderEntityName()}
      </g>
    `}}var Ht=function(){return Ht=Object.assign||function(t){for(var e,s=1,i=arguments.length;s<i;s++)for(var o in e=arguments[s])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t},Ht.apply(this,arguments)};var qt,Wt={second:45,minute:45,hour:22,day:5};!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(qt=qt||(qt={}));const Yt=(t,e,s)=>{const i=e?(t=>{switch(t.number_format){case qt.comma_decimal:return["en-US","en"];case qt.decimal_comma:return["de","es","it"];case qt.space_comma:return["fr","sv","cs"];case qt.system:return;default:return t.language}})(e):void 0;if(Number.isNaN=Number.isNaN||function t(e){return"number"==typeof e&&t(e)},e?.number_format!==qt.none&&!Number.isNaN(Number(t))&&Intl)try{return new Intl.NumberFormat(i,Jt(t,s)).format(Number(t))}catch(o){return console.error(o),new Intl.NumberFormat(void 0,Jt(t,s)).format(Number(t))}return!Number.isNaN(Number(t))&&""!==t&&e?.number_format===qt.none&&Intl?new Intl.NumberFormat("en-US",Jt(t,{...s,useGrouping:!1})).format(Number(t)):"string"==typeof t?t:`${((t,e=2)=>Math.round(t*10**e)/10**e)(t,s?.maximumFractionDigits).toString()}${"currency"===s?.style?` ${s.currency}`:""}`},Jt=(t,e)=>{const s={maximumFractionDigits:2,...e};if("string"!=typeof t)return s;if(!e||void 0===e.minimumFractionDigits&&void 0===e.maximumFractionDigits){const e=t.indexOf(".")>-1?t.split(".")[1].length:0;s.minimumFractionDigits=e,s.maximumFractionDigits=e}return s};var Xt=Number.isNaN||function(t){return"number"==typeof t&&t!=t};function Zt(t,e){if(t.length!==e.length)return!1;for(var s=0;s<t.length;s++)if(i=t[s],o=e[s],!(i===o||Xt(i)&&Xt(o)))return!1;var i,o;return!0}function Kt(t,e){void 0===e&&(e=Zt);var s=null;function i(){for(var i=[],o=0;o<arguments.length;o++)i[o]=arguments[o];if(s&&s.lastThis===this&&e(i,s.lastArgs))return s.lastResult;var a=t.apply(this,i);return s={lastResult:a,lastArgs:i,lastThis:this},a}return i.clear=function(){s=null},i}const Qt=Kt((t=>new Intl.DateTimeFormat(t.language,{weekday:"long",month:"long",day:"numeric"}))),te=Kt((t=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric"}))),ee=Kt((t=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"numeric",day:"numeric"}))),se=Kt((t=>new Intl.DateTimeFormat(t.language,{day:"numeric",month:"short"}))),ie=Kt((t=>new Intl.DateTimeFormat(t.language,{month:"long",year:"numeric"}))),oe=Kt((t=>new Intl.DateTimeFormat(t.language,{month:"long"})));Kt((t=>new Intl.DateTimeFormat(t.language,{year:"numeric"})));const ae=Kt((t=>new Intl.DateTimeFormat(t.language,{weekday:"long"}))),re=Kt((t=>new Intl.DateTimeFormat(t.language,{weekday:"short"})));var ne;!function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(ne=ne||(ne={}));const he=Kt((t=>{if(t.time_format===ne.language||t.time_format===ne.system){const e=t.time_format===ne.language?t.language:void 0,s=(new Date).toLocaleString(e);return s.includes("AM")||s.includes("PM")}return t.time_format===ne.am_pm})),le=Kt((t=>new Intl.DateTimeFormat("en"!==t.language||he(t)?t.language:"en-u-hc-h23",{hour:"numeric",minute:"2-digit",hour12:he(t)}))),ce=Kt((t=>new Intl.DateTimeFormat("en"!==t.language||he(t)?t.language:"en-u-hc-h23",{hour:he(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:he(t)}))),de=Kt((t=>new Intl.DateTimeFormat("en"!==t.language||he(t)?t.language:"en-u-hc-h23",{weekday:"long",hour:he(t)?"numeric":"2-digit",minute:"2-digit",hour12:he(t)}))),ge=Kt((()=>new Intl.DateTimeFormat("en-GB",{hour:"numeric",minute:"2-digit",hour12:!1}))),ue=Kt((t=>new Intl.DateTimeFormat("en"!==t.language||he(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:he(t)?"numeric":"2-digit",minute:"2-digit",hour12:he(t)}))),me=Kt((t=>new Intl.DateTimeFormat("en"!==t.language||he(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"short",day:"numeric",hour:he(t)?"numeric":"2-digit",minute:"2-digit",hour12:he(t)}))),pe=Kt((t=>new Intl.DateTimeFormat("en"!==t.language||he(t)?t.language:"en-u-hc-h23",{month:"short",day:"numeric",hour:he(t)?"numeric":"2-digit",minute:"2-digit",hour12:he(t)}))),fe=Kt((t=>new Intl.DateTimeFormat("en"!==t.language||he(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:he(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:he(t)}))),ve=Kt((t=>new Intl.DateTimeFormat("en"!==t.language||he(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",hour12:he(t)}))),ye=(t,e=2)=>{let s=`${t}`;for(let i=1;i<e;i++)s=parseInt(s)<10**i?`0${s}`:s;return s};const _e={ms:1,s:1e3,min:6e4,h:36e5,d:864e5},be=(t,e)=>function(t){const e=Math.floor(t/1e3/3600),s=Math.floor(t/1e3%3600/60),i=Math.floor(t/1e3%3600%60),o=Math.floor(t%1e3);return e>0?`${e}:${ye(s)}:${ye(i)}`:s>0?`${s}:${ye(i)}`:i>0||o>0?`${i}${o>0?`.${ye(o,3)}`:""}`:null}(parseFloat(t)*_e[e])||"0";class we extends Tt{constructor(t,e,s){super(t,_t.mergeDeep({show:{uom:"end"},classes:{tool:{"sak-state":!0,hover:!0},state:{"sak-state__value":!0},uom:{"sak-state__uom":!0}},styles:{tool:{},state:{},uom:{}}},e),s),this.classes.tool={},this.classes.state={},this.classes.uom={},this.styles.tool={},this.styles.state={},this.styles.uom={},this.dev.debug&&console.log("EntityStateTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}static testTimeDate=!1;set value(t){super.value=t}formatStateString(t,e){const s=this._card._hass.selectedLanguage||this._card._hass.language;let i={};if(i.language=s,["relative","total","datetime","datetime-short","datetime-short_with-year","datetime_seconds","datetime-numeric","date","date_month","date_month_year","date-short","date-numeric","date_weekday","date_weekday_day","date_weekday-short","time","time-24h","time_weekday","time_seconds"].includes(e.format)){const a=new Date(t);if(!(a instanceof Date)||isNaN(a.getTime()))return t;let r;switch(e.format){case"relative":const t=function(t,e,s){void 0===e&&(e=Date.now()),void 0===s&&(s={});var i=Ht(Ht({},Wt),s||{}),o=(+t-+e)/1e3;if(Math.abs(o)<i.second)return{value:Math.round(o),unit:"second"};var a=o/60;if(Math.abs(a)<i.minute)return{value:Math.round(a),unit:"minute"};var r=o/3600;if(Math.abs(r)<i.hour)return{value:Math.round(r),unit:"hour"};var n=o/86400;if(Math.abs(n)<i.day)return{value:Math.round(n),unit:"day"};var h=new Date(t),l=new Date(e),c=h.getFullYear()-l.getFullYear();if(Math.round(Math.abs(c))>0)return{value:Math.round(c),unit:"year"};var d=12*c+h.getMonth()-l.getMonth();if(Math.round(Math.abs(d))>0)return{value:Math.round(d),unit:"month"};var g=o/604800;return{value:Math.round(g),unit:"week"}}(a,new Date);r=new Intl.RelativeTimeFormat(s,{numeric:"auto"}).format(t.value,t.unit);break;case"total":case"precision":r="Not Yet Supported";break;case"datetime":r=((t,e)=>ue(e).format(t))(a,i);break;case"datetime-short":r=((t,e)=>pe(e).format(t))(a,i);break;case"datetime-short_with-year":r=((t,e)=>me(e).format(t))(a,i);break;case"datetime_seconds":r=((t,e)=>fe(e).format(t))(a,i);break;case"datetime-numeric":r=((t,e)=>ve(e).format(t))(a,i);break;case"date":r=((t,e)=>te(e).format(t))(a,i);break;case"date_month":r=((t,e)=>oe(e).format(t))(a,i);break;case"date_month_year":r=((t,e)=>ie(e).format(t))(a,i);break;case"date-short":r=((t,e)=>se(e).format(t))(a,i);break;case"date-numeric":r=((t,e)=>ee(e).format(t))(a,i);break;case"date_weekday":r=((t,e)=>ae(e).format(t))(a,i);break;case"date_weekday-short":r=((t,e)=>re(e).format(t))(a,i);break;case"date_weekday_day":r=((t,e)=>Qt(e).format(t))(a,i);break;case"time":r=((t,e)=>le(e).format(t))(a,i);break;case"time-24h":o=a,r=ge().format(o);break;case"time_weekday":r=((t,e)=>de(e).format(t))(a,i);break;case"time_seconds":r=((t,e)=>ce(e).format(t))(a,i)}return r}var o;return isNaN(parseFloat(t))||!isFinite(t)?t:"brightness"===e.format||"brightness_pct"===e.format?`${Math.round(t/255*100)} %`:"duration"===e.format?be(t,"s"):void 0}_renderState(){this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.state);let t=this._stateValue;const e=this._card.entities[this.defaultEntityIndex()];if(void 0===e)return B``;if([void 0,"undefined"].includes(t))return B``;if(void 0===t)return B``;const s=this._card._hass.entities[e.entity_id],i=this._card.config.entities[this.defaultEntityIndex()],o=Ot(this._card.entities[this.defaultEntityIndex()].entity_id),a=this.config.locale_tag?this.config.locale_tag+t.toLowerCase():void 0;if(void 0!==i.format&&void 0!==t&&(t=this.formatStateString(t,i)),(t&&isNaN(t)&&!i.secondary_info||i.attribute)&&(t=a&&this._card._hass.localize(a)||s?.translation_key&&this._card._hass.localize(`component.${s.platform}.entity.${o}.${s.translation_key}.state.${t}`)||s?.attributes?.device_class&&this._card._hass.localize(`component.${o}.entity_component.${s.attributes.device_class}.state.${t}`)||this._card._hass.localize(`component.${o}.entity_component._.state.${t}`)||t,t=this.textEllipsis(t,this.config?.show?.ellipsis)),["undefined","unknown","unavailable","-ua-"].includes(t)&&(t=this._card._hass.localize(`state.default.${t}`)),!isNaN(t)){let e={};e=Jt(t,e),void 0!==this._card.config.entities[this.defaultEntityIndex()].decimals&&(e.maximumFractionDigits=this._card.config.entities[this.defaultEntityIndex()].decimals,e.minimumFractionDigits=e.maximumFractionDigits),t=Yt(t,this._card._hass.locale,e)}return B`
      <tspan class="${St(this.classes.state)}" x="${this.svg.x}" y="${this.svg.y}"
        style="${nt(this.styles.state)}">
        ${this.config?.text?.before?this.config.text.before:""}${t}${this.config?.text?.after?this.config.text.after:""}</tspan>
    `}_renderUom(){if("none"===this.config.show.uom||void 0===this._stateValue)return B``;{this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.uom);let t=this.styles.state["font-size"],e=.5,s="em";const i=t.match(/\D+|\d*\.?\d+/g);2===i.length?(e=.6*Number(i[0]),s=i[1]):console.error("Cannot determine font-size for state/unit",t),t={"font-size":e+s},this.styles.uom=_t.mergeDeep(this.config.styles.uom,this.styles.uom,t);const o=this._card._buildUom(this.derivedEntity,this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]);return"end"===this.config.show.uom?B`
          <tspan class="${St(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${nt(this.styles.uom)}">
            ${o}</tspan>
        `:"bottom"===this.config.show.uom?B`
          <tspan class="${St(this.classes.uom)}" x="${this.svg.x}" dy="1.5em"
            style="${nt(this.styles.uom)}">
            ${o}</tspan>
        `:"top"===this.config.show.uom?B`
          <tspan class="${St(this.classes.uom)}" x="${this.svg.x}" dy="-1.5em"
            style="${nt(this.styles.uom)}">
            ${o}</tspan>
        `:B``}}firstUpdated(t){}updated(t){}render(){return B`
    <svg overflow="visible" id="state-${this.toolId}"
      class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}">
        <text @click=${t=>this.handleTapEvent(t,this.config)}>
          ${this._renderState()}
          ${this._renderUom()}
        </text>
      </svg>
      `}}class xe{constructor(t,e,s,i=24,o=1,a="avg",r="interval",n=!0,h=!1){const l={avg:this._average,median:this._median,max:this._maximum,min:this._minimum,first:this._first,last:this._last,sum:this._sum,delta:this._delta,diff:this._diff};this._history=void 0,this.coords=[],this.width=t,this.height=e,this.margin=s,this._max=0,this._min=0,this.points=o,this.hours=i,this.aggregateFuncName=a,this._calcPoint=l[a]||this._average,this._smoothing=n,this._logarithmic=h,this._groupBy=r,this._endTime=0}get max(){return this._max}set max(t){this._max=t}get min(){return this._min}set min(t){this._min=t}set history(t){this._history=t}update(t=void 0){if(t&&(this._history=t),!this._history)return;this._updateEndTime();const e=this._history.reduce(((t,e)=>this._reducer(t,e)),[]);e[0]&&e[0].length&&(e[0]=[e[0][e[0].length-1]]);const s=Math.ceil(this.hours*this.points);e.length=s,this.coords=this._calcPoints(e),this.min=Math.min(...this.coords.map((t=>Number(t[2])))),this.max=Math.max(...this.coords.map((t=>Number(t[2]))))}_reducer(t,e){const s=(this._endTime-new Date(e.last_changed).getTime())/36e5*this.points-this.hours*this.points,i=s<0?Math.floor(Math.abs(s)):0;return t[i]||(t[i]=[]),t[i].push(e),t}_calcPoints(t){const e=[];let s=this.width/(this.hours*this.points-1);s=Number.isFinite(s)?s:this.width;const i=t.filter(Boolean)[0];let o=[this._calcPoint(i),this._lastValue(i)];const a=(t,i)=>{const a=s*i+this.margin[0];return t&&(o=[this._calcPoint(t),this._lastValue(t)]),e.push([a,0,t?o[0]:o[1]])};for(let r=0;r<t.length;r+=1)a(t[r],r);return e}_calcY(t){const e=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,s=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,i=(e-s)/this.height||1;return t.map((t=>{const e=this._logarithmic?Math.log10(Math.max(1,t[2])):t[2],o=s<0?Math.abs(s):0,a=e>0?this.height-o/i-(e-Math.max(0,s))/i+2*this.margin[1]:this.height-(0-s)/i+2*this.margin[1],r=this.height-(e-s)/i+2*this.margin[1];return console.log("coordY, coordY2",r,a,t[2]),[t[0],r,t[2],a]}))}getPoints(){let t,e,{coords:s}=this;1===s.length&&(s[1]=[this.width+this.margin[0],0,s[0][2]]),s=this._calcY(this.coords);let i=s[0];s.shift();return s.map(((s,o)=>{t=s,e=this._smoothing?this._midPoint(i[0],i[1],t[0],t[1]):t;const a=this._smoothing?(t[2]+i[2])/2:t[2];return i=t,[e[0],e[1],a,o+1]}))}getPath(){let t,e,{coords:s}=this;1===s.length&&(s[1]=[this.width+this.margin[0],0,s[0][2]]),s=this._calcY(this.coords);let i="",o=s[0];return i+=`M${o[0]},${o[1]}`,s.forEach((s=>{t=s,e=this._smoothing?this._midPoint(o[0],o[1],t[0],t[1]):t,i+=` ${e[0]},${e[1]}`,i+=` Q ${t[0]},${t[1]}`,o=t})),i+=` ${t[0]},${t[1]}`,i}computeGradient(t,e){const s=e?Math.log10(Math.max(1,this._max))-Math.log10(Math.max(1,this._min)):this._max-this._min;return t.map(((t,i,o)=>{let a,r;if(t.value>this._max&&o[i+1]){const e=(this._max-o[i+1].value)/(t.value-o[i+1].value);a=Et.getGradientValue(o[i+1].color,t.color,e)}else if(t.value<this._min&&o[i-1]){const e=(o[i-1].value-this._min)/(o[i-1].value-t.value);a=Et.getGradientValue(o[i-1].color,t.color,e)}return r=s<=0?0:e?(Math.log10(Math.max(1,this._max))-Math.log10(Math.max(1,t.value)))*(100/s):(this._max-t.value)*(100/s),{color:a||t.color,offset:r}}))}getFill(t){const e=this.height+4*this.margin[1];let s=t;return s+=` L ${this.width-2*this.margin[0]}, ${e}`,s+=` L ${this.coords[0][0]}, ${e} z`,s}getBars(t,e,s=4){const i=this._calcY(this.coords),o=(this.width-s)/Math.ceil(this.hours*this.points)/e,a=(this._max-this._min)/this.height||1,r=this._min<0?Math.abs(this._min)/a:0;return console.log("getbars, offset ",r),i.map(((i,a)=>({x:o*a*e+o*t+s,y:this._min>0?i[1]:i[3],height:i[2]>0?this.height-r-i[1]+4*this.margin[1]:i[1]-i[3]+4*this.margin[1],width:o-s,value:i[2]})))}_midPoint(t,e,s,i){return[(t-s)/2+s,(e-i)/2+i]}_average(t){return t.reduce(((t,e)=>t+parseFloat(e.state)),0)/t.length}_median(t){const e=[...t].sort(((t,e)=>parseFloat(t)-parseFloat(e))),s=Math.floor((e.length-1)/2);return e.length%2==1?parseFloat(e[s].state):(parseFloat(e[s].state)+parseFloat(e[s+1].state))/2}_maximum(t){return Math.max(...t.map((t=>t.state)))}_minimum(t){return Math.min(...t.map((t=>t.state)))}_first(t){return parseFloat(t[0].state)}_last(t){return parseFloat(t[t.length-1].state)}_sum(t){return t.reduce(((t,e)=>t+parseFloat(e.state)),0)}_delta(t){return this._maximum(t)-this._minimum(t)}_diff(t){return this._last(t)-this._first(t)}_lastValue(t){return["delta","diff"].includes(this.aggregateFuncName)?0:parseFloat(t[t.length-1].state)||0}_updateEndTime(){switch(this._endTime=new Date,this._groupBy){case"month":this._endTime.setMonth(this._endTime.getMonth()+1),this._endTime.setDate(1);break;case"date":this._endTime.setDate(this._endTime.getDate()+1),this._endTime.setHours(0,0,0,0);break;case"hour":this._endTime.setHours(this._endTime.getHours()+1),this._endTime.setMinutes(0,0,0)}}}const $e=(t,e,s="en-US")=>t.toLocaleString(s,{hour:"numeric",minute:"numeric",...e}),Se=t=>3600*t*1e3,ke=["var(--accent-color)","#3498db","#e74c3c","#9b59b6","#f1c40f","#2ecc71","#1abc9c","#34495e","#e67e22","#7f8c8d","#27ae60","#2980b9","#8e44ad"],Ee=(t,e)=>{for(let s=e,i=t.length;s<i;s+=1)if(null!=t[s].value)return s;throw new Error('Error in threshold interpolation: could not find right-nearest valued stop. Do the first and last thresholds have a set "value"?')},Te=(t,e)=>{const s=(t=>{if(!t||!t.length)return t;if(null==t[0].value||null==t[t.length-1].value)throw new Error('The first and last thresholds must have a set "value".\n See xyz manual');let e=0,s=null;return t.map(((i,o)=>{if(null!=i.value)return e=o,{...i};null==s?s=Ee(t,o):o>s&&(e=s,s=Ee(t,o));const a=t[e].value,r=(t[s].value-a)/(s-e);return{color:"string"==typeof i?i:i.color,value:r*o+a}}))})(t);if(s.sort(((t,e)=>e.value-t.value)),"smooth"===e)return s;return[].concat(...s.map(((t,e)=>[t,{value:t.value-1e-4,color:s[e+1]?s[e+1].color:t.color}])))};class Ce extends Tt{constructor(t,e,s){const i={position:{cx:50,cy:50,height:25,width:25,margin:.5},hours_to_show:24,points_per_hour:.5,animate:!1,hour24:!1,font_size:10,aggregate_func:"avg",group_by:"interval",line_color:[...ke],color_thresholds:[],color_thresholds_transition:"smooth",line_width:5,bar_spacing:4,compress:!0,smoothing:!0,state_map:[],cache:!0,value_factor:0,color:"var(--primary-color)",classes:{tool:{"sak-barchart":!0,hover:!0},bar:{},line:{"sak-barchart__line":!0,hover:!0}},styles:{tool:{},line:{},bar:{}},colorstops:[],show:{style:"fixedcolor"}};super(t,_t.mergeDeep(i,e),s),this.svg.margin=bt.calculateSvgDimension(this.config.position.margin);const o="vertical"===this.config.position.orientation?this.svg.width:this.svg.height;this.svg.barWidth=(o-(this.config.hours/this.config.barhours-1)*this.svg.margin)/(this.config.hours/this.config.barhours),this._data=[],this._bars=[],this._scale={},this._needsRendering=!1,this.classes.tool={},this.classes.bar={},this.styles.tool={},this.styles.line={},this.stylesBar={},this.id=this.toolId,this.bound=[0,0],this.boundSecondary=[0,0],this.length=[],this.entity=[],this.line=[],this.bar=[],this.abs=[],this.fill=[],this.points=[],this.gradient=[],this.tooltip={},this.updateQueue=[],this.updating=!1,this.stateChanged=!1,this.initial=!0,this._md5Config=void 0,console.log("SparklineGraphTool::constructor",this.config,this.svg),this.config.width=this.svg.width,this.config.height=this.svg.height,this.svg.line_width=bt.calculateSvgDimension(this.config.line_width),this.config.color_thresholds=Te(this.config.color_thresholds,this.config.color_thresholds_transition),this.svg.graph={},this.svg.graph.height=this.svg.height-this.svg.line_width,this.svg.graph.width=this.config.show.fill?this.svg.width:this.svg.width-this.svg.line_width/2,this.Graph=this.config.entity_indexes.map((t=>new xe(this.svg.graph.width,this.svg.graph.height,[this.config.show.fill?0:this.svg.line_width,this.svg.line_width],this.config.hours_to_show,this.config.points_per_hour,t.aggregate_func||this.config.aggregate_func,this.config.group_by,((...t)=>t.find((t=>void 0!==t)))(t.smoothing,this.config.smoothing,!this._card.config.entities[t.entity_index].entity.startsWith("binary_sensor.")),this.config.logarithmic))),console.log("in constructor, graph",this.Graph),this.dev.debug&&console.log("SparklelineGraph constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}set data(t){}set series(t){if(this.dev&&this.dev.fakeData){console.log("SparklineGraphTool::set series(states)",t);let e=40;for(let s=0;s<t.length;s++)s<t.length/2&&(e-=4*s),s>t.length/2&&(e+=3*s),t[s].state=e}this.Graph[0].update(t),this.updateBounds();let{config:e}=this;if(e.show.graph){let t=0;this._card.entities.forEach(((s,i)=>{if(!s||0===this.Graph[i].coords.length)return;const o="secondary"===this._card.config.entities[i].y_axis?this.boundSecondary:this.bound;if([this.Graph[i].min,this.Graph[i].max]=[o[0],o[1]],"bar"===e.show.graph){const s=this.visibleEntities.length;this.bar[i]=this.Graph[i].getBars(t,s,e.bar_spacing),t+=1,e.color_thresholds.length>0&&!this._card.config.entities[i].color&&(this.gradient[i]=this.Graph[i].computeGradient(e.color_thresholds,this.config.logarithmic))}else{const t=this.Graph[i].getPath();!1!==this._card.config.entities[i].show_line&&(this.line[i]=t),e.show.fill&&!1!==this._card.config.entities[i].show_fill&&(this.fill[i]=this.Graph[i].getFill(t)),e.show.points&&!1!==this._card.config.entities[i].show_points&&(this.points[i]=this.Graph[i].getPoints()),e.color_thresholds.length>0&&!this._card.config.entities[i].color&&(this.gradient[i]=this.Graph[i].computeGradient(e.color_thresholds,this.config.logarithmic))}})),this.line=[...this.line]}this.updating=!1}hasSeries(){return this.defaultEntityIndex()}get visibleEntities(){return console.log("visibleEntities",this._card.config.entities.filter((t=>!1!==t.show_graph))),this._card.config.entities.filter((t=>!1!==t.show_graph))}get primaryYaxisEntities(){return this.visibleEntities.filter((t=>void 0===t.y_axis||"primary"===t.y_axis))}get secondaryYaxisEntities(){return this.visibleEntities.filter((t=>"secondary"===t.y_axis))}get visibleLegends(){return this.visibleEntities.filter((t=>!1!==t.show_legend))}get primaryYaxisSeries(){return console.log("YaxisSERIES",this.primaryYaxisEntities.map(((t,e)=>this.Graph[e]))),this.primaryYaxisEntities.map(((t,e)=>this.Graph[e]))}get secondaryYaxisSeries(){return this.secondaryYaxisEntities.map((t=>this.Graph[t.index]))}getBoundary(t,e,s,i){if(!(t in Math))throw new Error(`The type "${t}" is not present on the Math object`);return void 0===s?Math[t](...e.map((e=>e[t])))||i:"~"!==s[0]?s:Math[t](Number(s.substr(1)),...e.map((e=>e[t])))}getBoundaries(t,e,s,i,o){let a=[this.getBoundary("min",t,e,i[0],o),this.getBoundary("max",t,s,i[1],o)];if(o){const t=Math.abs(a[0]-a[1]),e=parseFloat(o)-t;e>0&&(a=[a[0]-e/2,a[1]+e/2])}return a}updateBounds({config:t}=this){this.bound=this.getBoundaries(this.primaryYaxisSeries,t.lower_bound,t.upper_bound,this.bound,t.min_bound_range),this.boundSecondary=this.getBoundaries(this.secondaryYaxisSeries,t.lower_bound_secondary,t.upper_bound_secondary,this.boundSecondary,t.min_bound_range_secondary)}computeColor(t,e){const{color_thresholds:s,line_color:i}=this.config,o=Number(t)||0,a={color:i[e]||i[0],...s.slice(-1)[0],...s.find((t=>t.value<o))};return this._card.config.entities[e].color||a.color}intColor(t,e){const{color_thresholds:s,line_color:i}=this.config,o=Number(t)||0;let a;if(s.length>0)if("bar"===this.config.show.graph){const{color:t}=s.find((t=>t.value<o))||s.slice(-1)[0];a=t}else{const e=s.findIndex((t=>t.value<o)),i=s[e],r=s[e-1];if(r){const e=(r.value-t)/(r.value-i.value);a=Et.getGradientValue(r.color,i.color,e)}else a=e?s[s.length-1].color:s[0].color}return this._card.config.entities[e].color||a||i[e]||i[0]}getEndDate(){const t=new Date;switch(this.config.group_by){case"date":t.setDate(t.getDate()+1),t.setHours(0,0,0);break;case"hour":t.setHours(t.getHours()+1),t.setMinutes(0,0)}return t}setTooltip(t,e,s,i=null){const{points_per_hour:o,hours_to_show:a,format:r}=this.config,n=a<1&&o<1?o*a:1/o,h=Math.abs(e+1-Math.ceil(a*o)),l=this.getEndDate(),c=1/60;l.setMilliseconds(l.getMilliseconds()-Se(n*h+c));const d=$e(l,r,this._card._hass.language);l.setMilliseconds(l.getMilliseconds()-Se(n-c));const g=$e(l,r,this._card._hass.language);this.tooltip={value:s,id:h,entity:t,time:[g,d],index:e,label:i}}renderSvgAreaMask(t,e){if("dots"===this.config.show.graph)return;if(!t)return;const s="fade"===this.config.show.fill,i=this.length[e]||!1===this._card.config.entities[e].show_line;return B`
    <defs>
      <linearGradient id=${`fill-grad-${this.id}-${e}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='.10'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-${this.id}-${e}`}>
        <rect width="100%" height="100%" fill=${`url(#fill-grad-${this.id}-${e})`} />
      </mask>
    </defs>
    <mask id=${`fill-${this.id}-${e}`}>
      <path class='fill'
        type=${this.config.show.fill}
        .id=${e} anim=${this.config.animate} ?init=${i}
        style="animation-delay: ${this.config.animate?.5*e+"s":"0s"}"
        fill='white'
        mask=${s?`url(#fill-grad-mask-${this.id}-${e})`:""}
        d=${this.fill[e]}
      />
    </mask>`}renderSvgLineMask(t,e){if("dots"===this.config.show.graph)return;if(!t)return;const s=B`
    <path
      class='line'
      .id=${e}
      anim=${this.config.animate} ?init=${this.length[e]}
      style="animation-delay: ${this.config.animate?.5*e+"s":"0s"}"
      fill='none'
      stroke-dasharray=${this.length[e]||"none"} stroke-dashoffset=${this.length[e]||"none"}
      stroke=${"white"}
      stroke-width=${this.svg.line_width}
      d=${this.line[e]}
    />`;return B`
    <mask id=${`line-${this.id}-${e}`}>
      ${s}
    </mask>
  `}renderSvgPoint(t,e){const s=this.gradient[e]?this.computeColor(t[2],e):"inherit";return B`
    <circle
      class='line--point'
      ?inactive=${this.tooltip.index!==t[3]}
      style=${`--mcg-hover: ${s};`}
      stroke=${s}
      fill=${s}
      cx=${t[0]} cy=${t[1]} r=${this.svg.line_width/1.5}
      @mouseover=${()=>this.setTooltip(e,t[3],t[2])}
      @mouseout=${()=>this.tooltip={}}
    />
  `}renderSvgPoints(t,e){if(!t)return;const s=this.computeColor(this._card.entities[e].state,e);return B`
    <g class='line--points'
      ?tooltip=${this.tooltip.entity===e}
      ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
      ?init=${this.length[e]}
      anim=${this.config.animate&&"hover"!==this.config.show.points}
      style="animation-delay: ${this.config.animate?.5*e+.5+"s":"0s"}"
      fill=${s}
      stroke=${s}
      stroke-width=${this.svg.line_width/2}>
      ${t.map((t=>this.renderSvgPoint(t,e)))}
    </g>`}renderSvgGradient(t){if(!t)return;const e=t.map(((t,e)=>{if(t)return B`
      <linearGradient id=${`grad-${this.id}-${e}`} gradientTransform="rotate(90)">
        ${t.map((t=>B`
          <stop stop-color=${t.color} offset=${`${t.offset}%`} />
        `))}
      </linearGradient>`}));return B`${e}`}renderSvgLineBackground(t,e){if("dots"===this.config.show.graph)return;if(!t)return;const s=this.gradient[e]?`url(#grad-${this.id}-${e})`:this.computeColor(this._card.entities[e].state,e);return B`
    <rect class='line--rect'
      ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
      id=${`line-rect-${this.id}-${e}`}
      fill=${s} height="100%" width="100%"
      mask=${`url(#line-${this.id}-${e})`}
    />`}renderSvgAreaBackground(t,e){if(!t)return;const s=this.gradient[e]?`url(#grad-${this.id}-${e})`:this.intColor(this._card.entities[e].state,e);return B`
    <rect class='fill--rect'
      ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
      id=${`fill-rect-${this.id}-${e}`}
      fill=${s} height="100%" width="100%"
      mask=${`url(#fill-${this.id}-${e})`}
    />`}renderSvgBarsMask(t,e){if("dots"===this.config.show.graph)return;if(!t)return;const s=t.map(((t,s)=>{const i=this.config.animate?B`
        <animate attributeName='y' from=${this.config.height} to=${t.y} dur='1s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`:"";return this._min,B` 
      <rect class='bar' x=${t.x} y=${t.y+(t.value>0?-this.svg.line_width/2:this.svg.line_width/2)}
        height=${t.height-this.svg.line_width/1-2} width=${t.width} fill='white' stroke='white'
        stroke-width="${this.svg.line_width?this.svg.line_width:0}"
        @mouseover=${()=>this.setTooltip(e,s,t.value)}
        @mouseout=${()=>this.tooltip={}}>
        ${i}
      </rect>`}));return B`
    <mask id=${`bars-bg-${this.id}-${e}`}>
      ${s}
    </mask>
  `}renderSvgBarsMask2(t,e){if("dots"===this.config.show.graph)return;if(!t)return;this.id;const s=`url(#fill-grad-mask-pos-${this.id}-${e}})`,i=`url(#fill-grad-neg-${this.id}-${e}`,o=`url(#fill-grad-pos-${this.id}-${e}`,a=t.map(((t,s)=>{const a=this.config.animate?B`
        <animate attributeName='y' from=${this.config.height} to=${t.y} dur='1s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`:"";return B` 

      <rect class='bar' x=${t.x} y=${t.y+(t.value>0?-this.svg.line_width/2:this.svg.line_width/2)}
        height=${t.height-this.svg.line_width/1-2} width=${t.width}
        fill=${t.value>0?o:i}
        stroke=${t.value>0?o:i}
        stroke-width="${this.svg.line_width?this.svg.line_width:0}"
        @mouseover=${()=>this.setTooltip(e,s,t.value)}
        @mouseout=${()=>this.tooltip={}}>
        ${a}
      </rect>`}));return B`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${e}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='25%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='60%' stop-opacity='0.0'/>
      </linearGradient>
      <linearGradient id=${`fill-grad-neg-${this.id}-${e}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='40%' stop-opacity='0'/>
        <stop stop-color='white' offset='75%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='100%' stop-opacity='1.0'/>
      </linearGradient>

      <mask id=${`fill-grad-mask-pos-${this.id}-${e}`}>
        <rect width="100%" height="100%" fill=${`url(#fill-grad-pos-${this.id}-${e})`}
      </mask>
    </defs>  
    <mask id=${`bars-bg-${this.id}-${e}`}>
      ${a}
      mask = ${s}
    </mask>
  `}renderSvgBarsBackground(t,e){if("dots"===this.config.show.graph)return;if(!t)return;if("fade"===this.config.show.fill){this.length[e]||this._card.config.entities[e].show_line;const t=this.gradient[e]?`url(#grad-${this.id}-${e})`:this.intColor(this._card.entities[e].state,e);return this.gradient[e]?this.id:this.intColor(this._card.entities[e].state,e),B`
      <defs>
        <linearGradient id=${`fill-grad-${this.id}-${e}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop stop-color='white' offset='0%' stop-opacity='1'/>
          <stop stop-color='white' offset='100%' stop-opacity='.1'/>
        </linearGradient>

        <mask id=${`fill-grad-mask-${this.id}-${e}`}>
          <rect width="100%" height="100%" fill=${`url(#fill-grad-${this.id}-${e})`}
        </mask>
      </defs>

      <g mask = ${`url(#fill-grad-mask-${this.id}-${e})`}>
        <rect class='bars--bg'
          ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
          id=${`bars-bg-${this.id}-${e}`}
          fill=${t} height="100%" width="100%"
          mask=${`url(#bars-bg-${this.id}-${e})`}
        />
      /g>`}{const t=this.gradient[e]?`url(#grad-${this.id}-${e})`:this.computeColor(this._card.entities[e].state,e);return console.log("renderSvgBarsBackground",t,this.gradient[e]),B`
      <rect class='bars--bg'
        ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
        id=${`bars-bg-${this.id}-${e}`}
        fill=${t} height="100%" width="100%"
        mask=${`url(#bars-bg-${this.id}-${e})`}
      />`}}renderSvgBars2(t,e){if(!t)return;const s=t.map(((t,s)=>{const i=this.config.animate?B`
        <animate attributeName='y' from=${this.config.height} to=${t.y} dur='1s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`:"",o=this.computeColor(t.value,e);return B` 
      <defs>
      <linearGradient id=${`fill-grad-${this.id}-${e}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='.1'/>
      </linearGradient>
      
      <mask id=${`fill-grad-mask-${this.id}-${e}`}>
        <rect width="100%" height="100%" fill=${`url(#fill-grad-${this.id}-${e})`}
      </mask>
      </defs>

      <rect class='bar' x=${t.x} y=${t.y}
        height=${t.height} width=${t.width} fill=${o}
        @mouseover=${()=>this.setTooltip(e,s,t.value)}
        @mouseout=${()=>this.tooltip={}}>
        mask = ${`fill-grad-mask-${this.id}-${e}`}
        ${i}
      </rect>`}));return B`<g class='bars' ?anim=${this.config.animate}>${s}</g>`}renderSvgBars(t,e){if(!t)return;const s=t.map(((t,s)=>{const i=this.config.animate?B`
        <animate attributeName='y' from=${this.config.height} to=${t.y} dur='1s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`:"",o=this.computeColor(t.value,e);return B` 
      <rect class='bar' x=${t.x} y=${t.y}
        height=${t.height} width=${t.width} fill=${o}
        @mouseover=${()=>this.setTooltip(e,s,t.value)}
        @mouseout=${()=>this.tooltip={}}>
        ${i}
      </rect>`}));return B`<g class='bars' ?anim=${this.config.animate}>${s}</g>`}renderSvg(){const{height:t}=this.config,{width:e}=this.config;return B`
  <svg width="${e}" height="${t}"
  x="${this.svg.x}" y="${this.svg.y}">
    <g>
        <defs>
          ${this.renderSvgGradient(this.gradient)}
        </defs>
        ${this.fill.map(((t,e)=>this.renderSvgAreaMask(t,e)))}
        ${this.fill.map(((t,e)=>this.renderSvgAreaBackground(t,e)))}
        ${this.line.map(((t,e)=>this.renderSvgLineMask(t,e)))}
        ${this.line.map(((t,e)=>this.renderSvgLineBackground(t,e)))}
        ${this.bar.map(((t,e)=>this.renderSvgBarsMask(t,e)))}
        ${this.bar.map(((t,e)=>this.renderSvgBarsBackground(t,e)))}
      </g>
      ${this.points.map(((t,e)=>this.renderSvgPoints(t,e)))}
    </svg>`}updated(t){console.log("graph - updated"),this.config.animate&&t.has("line")&&(this.length.length<this.entity.length?(this._card.shadowRoot.querySelectorAll("svg path.line").forEach((t=>{this.length[t.id]=t.getTotalLength()})),this.length=[...this.length]):this.length=Array(this.entity.length).fill("none"))}render(){return B`
        <g id="graph-${this.toolId}"
          class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}"
          @click=${t=>this.handleTapEvent(t,this.config)}>
          ${this.renderSvg()}
        </g>
      `}}class Me extends Tt{constructor(t,e,s){super(t,_t.mergeDeep({position:{cx:50,cy:50,radius:45},card_filter:"card--filter-none",horseshoe_scale:{min:0,max:100,width:3,color:"var(--primary-background-color)"},horseshoe_state:{width:6,color:"var(--primary-color)"},show:{horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"}},e),s),this.HORSESHOE_RADIUS_SIZE=180,this.TICKMARKS_RADIUS_SIZE=172,this.HORSESHOE_PATH_LENGTH=520/360*Math.PI*this.HORSESHOE_RADIUS_SIZE,this.config.entity_index=this.config.entity_index?this.config.entity_index:0,this.svg.radius=bt.calculateSvgDimension(this.config.position.radius),this.svg.radius_ticks=bt.calculateSvgDimension(.95*this.config.position.radius),this.svg.horseshoe_scale={},this.svg.horseshoe_scale.width=bt.calculateSvgDimension(this.config.horseshoe_scale.width),this.svg.horseshoe_state={},this.svg.horseshoe_state.width=bt.calculateSvgDimension(this.config.horseshoe_state.width),this.svg.horseshoe_scale.dasharray=52/36*Math.PI*this.svg.radius,this.svg.rotate={},this.svg.rotate.degrees=-220,this.svg.rotate.cx=this.svg.cx,this.svg.rotate.cy=this.svg.cy,this.colorStops={},this.config.color_stops&&Object.keys(this.config.color_stops).forEach((t=>{this.colorStops[t]=this.config.color_stops[t]})),this.sortedStops=Object.keys(this.colorStops).map((t=>Number(t))).sort(((t,e)=>t-e)),this.colorStopsMinMax={},this.colorStopsMinMax[this.config.horseshoe_scale.min]=this.colorStops[this.sortedStops[0]],this.colorStopsMinMax[this.config.horseshoe_scale.max]=this.colorStops[this.sortedStops[this.sortedStops.length-1]],this.color0=this.colorStops[this.sortedStops[0]],this.color1=this.colorStops[this.sortedStops[this.sortedStops.length-1]],this.angleCoords={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},this.color1_offset="0%",this.dev.debug&&console.log("HorseshoeTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}set value(t){if(this._stateValue===t)return;this._stateValuePrev=this._stateValue||t,this._stateValue=t,this._stateValueIsDirty=!0;const e=this.config.horseshoe_scale.min||0,s=this.config.horseshoe_scale.max||100,i=Math.min(bt.calculateValueBetween(e,s,t),1),o=i*this.HORSESHOE_PATH_LENGTH,a=10*this.HORSESHOE_RADIUS_SIZE;this.dashArray=`${o} ${a}`;const r=this.config.show.horseshoe_style;if("fixed"===r)this.stroke_color=this.config.horseshoe_state.color,this.color0=this.config.horseshoe_state.color,this.color1=this.config.horseshoe_state.color,this.color1_offset="0%";else if("autominmax"===r){const e=Et.calculateColor(t,this.colorStopsMinMax,!0);this.color0=e,this.color1=e,this.color1_offset="0%"}else if("colorstop"===r||"colorstopgradient"===r){const e=Et.calculateColor(t,this.colorStops,"colorstopgradient"===r);this.color0=e,this.color1=e,this.color1_offset="0%"}else if("lineargradient"===r){const t={x1:"0%",y1:"0%",x2:"100%",y2:"0%"};this.color1_offset=`${Math.round(100*(1-i))}%`,this.angleCoords=t}this.dev.debug&&console.log("HorseshoeTool set value",this.cardId,t)}_renderTickMarks(){const{config:t}=this;if(!t.show.scale_tickmarks)return;const e=t.horseshoe_scale.color?t.horseshoe_scale.color:"var(--primary-background-color)",s=t.horseshoe_scale.ticksize?t.horseshoe_scale.ticksize:(t.horseshoe_scale.max-t.horseshoe_scale.min)/10,i=t.horseshoe_scale.min%s,o=t.horseshoe_scale.min+(0===i?0:s-i),a=(o-t.horseshoe_scale.min)/(t.horseshoe_scale.max-t.horseshoe_scale.min)*260,r=(t.horseshoe_scale.max-o)/s;let n=Math.floor(r);const h=(260-a)/r;Math.floor(n*s+o)<=t.horseshoe_scale.max&&(n+=1);const l=this.svg.horseshoe_scale.width?this.svg.horseshoe_scale.width/2:3;let c;const d=[];let g;for(g=0;g<n;g++)c=a+(360-g*h-230)*Math.PI/180,d[g]=B`
        <circle cx="${this.svg.cx-Math.sin(c)*this.svg.radius_ticks}"
                cy="${this.svg.cy-Math.cos(c)*this.svg.radius_ticks}" r="${l}"
                fill="${e}">
      `;return B`${d}`}_renderHorseShoe(){if(this.config.show.horseshoe)return B`
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
    `}render(){return B`
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

    `}}class Ie extends Tt{constructor(t,e,s){if(super(t,_t.mergeDeep({position:{orientation:"vertical",length:"10",cx:"50",cy:"50"},classes:{tool:{"sak-line":!0,hover:!0},line:{"sak-line__line":!0}},styles:{tool:{},line:{}}},e),s),!["horizontal","vertical","fromto"].includes(this.config.position.orientation))throw Error("LineTool::constructor - invalid orientation [vertical, horizontal, fromto] = ",this.config.position.orientation);["horizontal","vertical"].includes(this.config.position.orientation)&&(this.svg.length=bt.calculateSvgDimension(e.position.length)),"fromto"===this.config.position.orientation?(this.svg.x1=bt.calculateSvgCoordinate(e.position.x1,this.toolsetPos.cx),this.svg.y1=bt.calculateSvgCoordinate(e.position.y1,this.toolsetPos.cy),this.svg.x2=bt.calculateSvgCoordinate(e.position.x2,this.toolsetPos.cx),this.svg.y2=bt.calculateSvgCoordinate(e.position.y2,this.toolsetPos.cy)):"vertical"===this.config.position.orientation?(this.svg.x1=this.svg.cx,this.svg.y1=this.svg.cy-this.svg.length/2,this.svg.x2=this.svg.cx,this.svg.y2=this.svg.cy+this.svg.length/2):"horizontal"===this.config.position.orientation&&(this.svg.x1=this.svg.cx-this.svg.length/2,this.svg.y1=this.svg.cy,this.svg.x2=this.svg.cx+this.svg.length/2,this.svg.y2=this.svg.cy),this.classes.line={},this.styles.line={},this.dev.debug&&console.log("LineTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_renderLine(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.line),this.dev.debug&&console.log("_renderLine",this.config.position.orientation,this.svg.x1,this.svg.y1,this.svg.x2,this.svg.y2),B`
      <line class="${St(this.classes.line)}"
        x1="${this.svg.x1}"
        y1="${this.svg.y1}"
        x2="${this.svg.x2}"
        y2="${this.svg.y2}"
        style="${nt(this.styles.line)}"/>
      `}render(){return B`
      <g id="line-${this.toolId}"
        class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderLine()}
      </g>
    `}}class Ae extends Tt{constructor(t,e,s){switch(super(t,_t.mergeDeep({descr:"none",position:{cx:50,cy:50,orientation:"horizontal",active:{width:0,height:0,radius:0},track:{width:16,height:7,radius:3.5},thumb:{width:9,height:9,radius:4.5,offset:4.5},label:{placement:"none"}},show:{uom:"end",active:!1},classes:{tool:{"sak-slider":!0,hover:!0},capture:{"sak-slider__capture":!0},active:{"sak-slider__active":!0},track:{"sak-slider__track":!0},thumb:{"sak-slider__thumb":!0},label:{"sak-slider__value":!0},uom:{"sak-slider__uom":!0}},styles:{tool:{},capture:{},active:{},track:{},thumb:{},label:{},uom:{}}},e),s),this.svg.activeTrack={},this.svg.activeTrack.radius=bt.calculateSvgDimension(this.config.position.active.radius),this.svg.activeTrack.height=bt.calculateSvgDimension(this.config.position.active.height),this.svg.activeTrack.width=bt.calculateSvgDimension(this.config.position.active.width),this.svg.track={},this.svg.track.radius=bt.calculateSvgDimension(this.config.position.track.radius),this.svg.thumb={},this.svg.thumb.radius=bt.calculateSvgDimension(this.config.position.thumb.radius),this.svg.thumb.offset=bt.calculateSvgDimension(this.config.position.thumb.offset),this.svg.capture={},this.svg.label={},this.config.position.orientation){case"horizontal":case"vertical":this.svg.capture.width=bt.calculateSvgDimension(this.config.position.capture.width||1.1*this.config.position.track.width),this.svg.capture.height=bt.calculateSvgDimension(this.config.position.capture.height||3*this.config.position.thumb.height),this.svg.track.width=bt.calculateSvgDimension(this.config.position.track.width),this.svg.track.height=bt.calculateSvgDimension(this.config.position.track.height),this.svg.thumb.width=bt.calculateSvgDimension(this.config.position.thumb.width),this.svg.thumb.height=bt.calculateSvgDimension(this.config.position.thumb.height),this.svg.capture.x1=this.svg.cx-this.svg.capture.width/2,this.svg.capture.y1=this.svg.cy-this.svg.capture.height/2,this.svg.track.x1=this.svg.cx-this.svg.track.width/2,this.svg.track.y1=this.svg.cy-this.svg.track.height/2,this.svg.activeTrack.x1="horizontal"===this.config.position.orientation?this.svg.track.x1:this.svg.cx-this.svg.activeTrack.width/2,this.svg.activeTrack.y1=this.svg.cy-this.svg.activeTrack.height/2,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2;break;default:throw console.error("RangeSliderTool - constructor: invalid orientation [vertical, horizontal] = ",this.config.position.orientation),Error("RangeSliderTool::constructor - invalid orientation [vertical, horizontal] = ",this.config.position.orientation)}if("vertical"===this.config.position.orientation)this.svg.track.y2=this.svg.cy+this.svg.track.height/2,this.svg.activeTrack.y2=this.svg.track.y2;switch(this.config.position.label.placement){case"position":this.svg.label.cx=bt.calculateSvgCoordinate(this.config.position.label.cx,0),this.svg.label.cy=bt.calculateSvgCoordinate(this.config.position.label.cy,0);break;case"thumb":this.svg.label.cx=this.svg.cx,this.svg.label.cy=this.svg.cy;break;case"none":break;default:throw console.error("RangeSliderTool - constructor: invalid label placement [none, position, thumb] = ",this.config.position.label.placement),Error("RangeSliderTool::constructor - invalid label placement [none, position, thumb] = ",this.config.position.label.placement)}this.classes.capture={},this.classes.track={},this.classes.thumb={},this.classes.label={},this.classes.uom={},this.styles.capture={},this.styles.track={},this.styles.thumb={},this.styles.label={},this.styles.uom={},this.svg.scale={},this.svg.scale.min=this.valueToSvg(this,this.config.scale.min),this.svg.scale.max=this.valueToSvg(this,this.config.scale.max),this.svg.scale.step=this.config.scale.step,this.dev.debug&&console.log("RangeSliderTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}svgCoordinateToSliderValue(t,e){let s,i,o,a;switch(t.config.position.orientation){case"horizontal":o=e.x-t.svg.track.x1-this.svg.thumb.width/2,i=o/(t.svg.track.width-this.svg.thumb.width);break;case"vertical":a=t.svg.track.y2-this.svg.thumb.height/2-e.y,i=a/(t.svg.track.height-this.svg.thumb.height)}return s=(t.config.scale.max-t.config.scale.min)*i+t.config.scale.min,s=Math.round(s/this.svg.scale.step)*this.svg.scale.step,s=Math.max(Math.min(this.config.scale.max,s),this.config.scale.min),s}valueToSvg(t,e){if("horizontal"===t.config.position.orientation){const s=bt.calculateValueBetween(t.config.scale.min,t.config.scale.max,e)*(t.svg.track.width-this.svg.thumb.width);return t.svg.track.x1+this.svg.thumb.width/2+s}if("vertical"===t.config.position.orientation){const s=bt.calculateValueBetween(t.config.scale.min,t.config.scale.max,e)*(t.svg.track.height-this.svg.thumb.height);return t.svg.track.y2-this.svg.thumb.height/2-s}}updateValue(t,e){this._value=this.svgCoordinateToSliderValue(t,e);Math.abs(0)<.01&&this.rid&&(window.cancelAnimationFrame(this.rid),this.rid=null)}updateThumb(t,e){switch(t.config.position.orientation){default:case"horizontal":if(this.config.position.label.placement,this.dragging){const s="thumb"===this.config.position.label.placement?-50:0,i=`translate(${e.x-this.svg.cx}px , ${s}px)`;t.elements.thumbGroup.style.transform=i}else t.elements.thumbGroup.style.transform=`translate(${e.x-this.svg.cx}px, 0px)`;break;case"vertical":if(this.dragging){const s=`translate(${"thumb"===this.config.position.label.placement?-50:0}px, ${e.y-this.svg.cy}px)`;t.elements.thumbGroup.style.transform=s}else t.elements.thumbGroup.style.transform=`translate(0px, ${e.y-this.svg.cy}px)`}t.updateLabel(t,e)}updateActiveTrack(t,e){if(t.config.show.active)switch(t.config.position.orientation){default:case"horizontal":this.dragging&&t.elements.activeTrack.setAttribute("width",Math.abs(this.svg.activeTrack.x1-e.x+this.svg.cx));break;case"vertical":this.dragging&&(t.elements.activeTrack.setAttribute("y",e.y-this.svg.cy),t.elements.activeTrack.setAttribute("height",Math.abs(t.svg.activeTrack.y2-e.y+this.svg.cx)))}}updateLabel(t,e){this.dev.debug&&console.log("SLIDER - updateLabel start",e,t.config.position.orientation);const s=this._card.config.entities[this.defaultEntityIndex()].decimals||0,i=10**s;t.labelValue2=(Math.round(t.svgCoordinateToSliderValue(t,e)*i)/i).toFixed(s),"none"!==this.config.position.label.placement&&(t.elements.label.textContent=t.labelValue2)}mouseEventToPoint(t){let e=this.elements.svg.createSVGPoint();e.x=t.touches?t.touches[0].clientX:t.clientX,e.y=t.touches?t.touches[0].clientY:t.clientY;const s=this.elements.svg.getScreenCTM().inverse();return e=e.matrixTransform(s),e}callDragService(){void 0!==this.labelValue2&&(this.labelValuePrev!==this.labelValue2&&(this.labelValuePrev=this.labelValue2,this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions.tap_action,this._card.config.entities[this.defaultEntityIndex()]?.entity,this.labelValue2)),this.dragging&&(this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval)))}callTapService(){void 0!==this.labelValue2&&this.labelValuePrev!==this.labelValue2&&(this.labelValuePrev=this.labelValue2,this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions?.tap_action,this._card.config.entities[this.defaultEntityIndex()]?.entity,this.labelValue2))}firstUpdated(t){function e(){this.rid=window.requestAnimationFrame(e),this.updateValue(this,this.m),this.updateThumb(this,this.m),this.updateActiveTrack(this,this.m)}function s(t){let s;if(t.preventDefault(),this.dragging){switch(this.m=this.mouseEventToPoint(t),this.config.position.orientation){case"horizontal":s=this.svgCoordinateToSliderValue(this,this.m),this.m.x=this.valueToSvg(this,s),this.m.x=Math.max(this.svg.scale.min,Math.min(this.m.x,this.svg.scale.max)),this.m.x=Math.round(this.m.x/this.svg.scale.step)*this.svg.scale.step;break;case"vertical":s=this.svgCoordinateToSliderValue(this,this.m),this.m.y=this.valueToSvg(this,s),this.m.y=Math.round(this.m.y/this.svg.scale.step)*this.svg.scale.step}e.call(this)}}function i(t){t.preventDefault(),window.addEventListener("pointermove",s.bind(this),!1),window.addEventListener("pointerup",o.bind(this),!1);const i=this.mouseEventToPoint(t),a=this.svg.thumb.x1+this.svg.thumb.cx;i.x>a-10&&i.x<a+this.svg.thumb.width+10?(kt(window,"haptic","heavy"),this.dragging=!0,this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(this.config.user_actions.drag_action.update_interval>0?this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval):this.timeOutId=null),this.m=this.mouseEventToPoint(t),"horizontal"===this.config.position.orientation?this.m.x=Math.round(this.m.x/this.svg.scale.step)*this.svg.scale.step:this.m.y=Math.round(this.m.y/this.svg.scale.step)*this.svg.scale.step,this.dev.debug&&console.log("pointerDOWN",Math.round(100*this.m.x)/100),e.call(this)):kt(window,"haptic","error")}function o(t){t.preventDefault(),window.removeEventListener("pointermove",s.bind(this),!1),window.removeEventListener("pointerup",o.bind(this),!1),window.removeEventListener("mousemove",s.bind(this),!1),window.removeEventListener("touchmove",s.bind(this),!1),window.removeEventListener("mouseup",o.bind(this),!1),window.removeEventListener("touchend",o.bind(this),!1),this.dragging&&(this.dragging=!1,clearTimeout(this.timeOutId),this.target=0,this.dev.debug&&console.log("pointerUP"),e.call(this),this.callTapService())}this.labelValue=this._stateValue,this.dev.debug&&console.log("slider - firstUpdated"),this.elements={},this.elements.svg=this._card.shadowRoot.getElementById("rangeslider-".concat(this.toolId)),this.elements.capture=this.elements.svg.querySelector("#capture"),this.elements.track=this.elements.svg.querySelector("#rs-track"),this.elements.activeTrack=this.elements.svg.querySelector("#active-track"),this.elements.thumbGroup=this.elements.svg.querySelector("#rs-thumb-group"),this.elements.thumb=this.elements.svg.querySelector("#rs-thumb"),this.elements.label=this.elements.svg.querySelector("#rs-label tspan"),this.dev.debug&&console.log("slider - firstUpdated svg = ",this.elements.svg,"path=",this.elements.path,"thumb=",this.elements.thumb,"label=",this.elements.label,"text=",this.elements.text),this.elements.svg.addEventListener("touchstart",i.bind(this),!1),this.elements.svg.addEventListener("mousedown",i.bind(this),!1)}set value(t){super.value=t,this.dragging||(this.labelValue=this._stateValue)}_renderUom(){if("none"===this.config.show.uom)return B``;{this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.uom);let t=this.styles.label["font-size"],e=.5,s="em";const i=t.match(/\D+|\d*\.?\d+/g);2===i.length?(e=.6*Number(i[0]),s=i[1]):console.error("Cannot determine font-size for state/unit",t),t={"font-size":e+s},this.styles.uom=_t.mergeDeep(this.config.styles.uom,t);const o=this._card._buildUom(this.derivedEntity,this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]);return"end"===this.config.show.uom?B`
          <tspan class="${St(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${nt(this.styles.uom)}">
            ${o}</tspan>
        `:"bottom"===this.config.show.uom?B`
          <tspan class="${St(this.classes.uom)}" x="${this.svg.label.cx}" dy="1.5em"
            style="${nt(this.styles.uom)}">
            ${o}</tspan>
        `:"top"===this.config.show.uom?B`
          <tspan class="${St(this.classes.uom)}" x="${this.svg.label.cx}" dy="-1.5em"
            style="${nt(this.styles.uom)}">
            ${o}</tspan>
        `:B`
          <tspan class="${St(this.classes.uom)}"  dx="-0.1em" dy="-0.35em"
            style="${nt(this.styles.uom)}">
            ERRR</tspan>
        `}}_renderRangeSlider(){let t,e;switch(this.dev.debug&&console.log("slider - _renderRangeSlider"),this.MergeAnimationClassIfChanged(),this.MergeColorFromState(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(),this.renderValue=this._stateValue,this.dragging?this.renderValue=this.labelValue2:this.elements?.label&&(this.elements.label.textContent=this.renderValue),this.config.position.label.placement){case"none":this.styles.label.display="none",this.styles.uom.display="none";break;case"position":t="horizontal"===this.config.position.orientation?this.valueToSvg(this,Number(this.renderValue))-this.svg.cx:0,e="vertical"===this.config.position.orientation?this.valueToSvg(this,Number(this.renderValue))-this.svg.cy:0;break;case"thumb":t="horizontal"===this.config.position.orientation?-this.svg.label.cx+this.valueToSvg(this,Number(this.renderValue)):0,e="vertical"===this.config.position.orientation?this.valueToSvg(this,Number(this.renderValue)):0,this.dragging&&("horizontal"===this.config.position.orientation?e-=50:t-=50);break;default:console.error("_renderRangeSlider(), invalid label placement",this.config.position.label.placement)}function s(t){return"thumb"===this.config.position.label.placement&&t?B`
      <text id="rs-label">
        <tspan class="${St(this.classes.label)}" x="${this.svg.label.cx}" y="${this.svg.label.cy}" style="${nt(this.styles.label)}">
        ${this.renderValue}</tspan>
        ${this._renderUom()}
        </text>
        `:"position"!==this.config.position.label.placement||t?void 0:B`
          <text id="rs-label" style="transform-origin:center;transform-box: fill-box;">
            <tspan class="${St(this.classes.label)}" data-placement="position" x="${this.svg.label.cx}" y="${this.svg.label.cy}"
            style="${nt(this.styles.label)}">${this.renderValue?this.renderValue:""}</tspan>
            ${this.renderValue?this._renderUom():""}
          </text>
          `}this.svg.thumb.cx=t,this.svg.thumb.cy=e;const i=[];return i.push(B`
      <rect id="capture" class="${St(this.classes.capture)}" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}"
      width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.track.radius}"          
      />

      <rect id="rs-track" class="${St(this.classes.track)}" x="${this.svg.track.x1}" y="${this.svg.track.y1}"
        width="${this.svg.track.width}" height="${this.svg.track.height}" rx="${this.svg.track.radius}"
        style="${nt(this.styles.track)}"
      />

      ${function(){return this.config.show.active?"horizontal"===this.config.position.orientation?B`
          <rect id="active-track" class="${St(this.classes.active)}" x="${this.svg.activeTrack.x1}" y="${this.svg.activeTrack.y1}"
            width="${Math.abs(this.svg.thumb.x1-this.svg.activeTrack.x1+t+this.svg.thumb.width/2)}" height="${this.svg.activeTrack.height}" rx="${this.svg.activeTrack.radius}"
            style="${nt(this.styles.active)}" touch-action="none"
          />`:B`
          <rect id="active-track" class="${St(this.classes.active)}" x="${this.svg.activeTrack.x1}" y="${e}"
            height="${Math.abs(this.svg.activeTrack.y1+e-this.svg.thumb.height)}" width="${this.svg.activeTrack.width}" rx="${this.svg.activeTrack.radius}"
            style="${nt(this.styles.active)}"
          />`:B``}.call(this)}
      ${function(){return B`
        <g id="rs-thumb-group" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}" style="transform:translate(${t}px, ${e}px);">
          <g style="transform-origin:center;transform-box: fill-box;">
            <rect id="rs-thumb" class="${St(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
              width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
              style="${nt(this.styles.thumb)}"
            />
            </g>
            ${s.call(this,!0)} 
        </g>
      `}.call(this)}
      ${s.call(this,!1)}


      `),i}render(){return B`
      <svg xmlns="http://www.w3.org/2000/svg" id="rangeslider-${this.toolId}" overflow="visible"
        touch-action="none" style="touch-action:none; pointer-events:none;"
      >
        ${this._renderRangeSlider()}
      </svg>
    `}}class Ve extends Tt{constructor(t,e,s){super(t,_t.mergeDeep({position:{cx:50,cy:50,width:50,height:50,rx:0},classes:{tool:{"sak-rectangle":!0,hover:!0},rectangle:{"sak-rectangle__rectangle":!0}},styles:{rectangle:{}}},e),s),this.svg.rx=e.position.rx?bt.calculateSvgDimension(e.position.rx):0,this.classes.rectangle={},this.styles.rectangle={},this.dev.debug&&console.log("RectangleTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderRectangle(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.rectangle),B`
      <rect class="${St(this.classes.rectangle)}"
        x="${this.svg.x}" y="${this.svg.y}" width="${this.svg.width}" height="${this.svg.height}" rx="${this.svg.rx}"
        style="${nt(this.styles.rectangle)}"/>
      `}render(){return B`
      <g id="rectangle-${this.toolId}" class="${St(this.classes.tool)}" transform-origin="${this.svg.cx}px ${this.svg.cy}px"
        style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderRectangle()}
      </g>
    `}}class Ne extends Tt{constructor(t,e,s){super(t,_t.mergeDeep({position:{cx:50,cy:50,width:50,height:50,radius:{all:0}},classes:{tool:{"sak-rectex":!0,hover:!0},rectex:{"sak-rectex__rectex":!0}},styles:{tool:{},rectex:{}}},e),s),this.classes.tool={},this.classes.rectex={},this.styles.tool={},this.styles.rectex={};const i=Math.min(this.svg.height,this.svg.width)/2;let o=0;o=bt.calculateSvgDimension(this.config.position.radius.all),this.svg.radiusTopLeft=+Math.min(i,Math.max(0,bt.calculateSvgDimension(this.config.position.radius.top_left||this.config.position.radius.left||this.config.position.radius.top||o)))||0,this.svg.radiusTopRight=+Math.min(i,Math.max(0,bt.calculateSvgDimension(this.config.position.radius.top_right||this.config.position.radius.right||this.config.position.radius.top||o)))||0,this.svg.radiusBottomLeft=+Math.min(i,Math.max(0,bt.calculateSvgDimension(this.config.position.radius.bottom_left||this.config.position.radius.left||this.config.position.radius.bottom||o)))||0,this.svg.radiusBottomRight=+Math.min(i,Math.max(0,bt.calculateSvgDimension(this.config.position.radius.bottom_right||this.config.position.radius.right||this.config.position.radius.bottom||o)))||0,this.dev.debug&&console.log("RectangleToolEx constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderRectangleEx(){this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(this.styles),this.MergeAnimationStyleIfChanged(),this.config.hasOwnProperty("csnew")?this.MergeColorFromState2(this.styles.rectex,"rectex"):this.MergeColorFromState(this.styles.rectex),this.counter||(this.counter=0),this.counter+=1;const t=B`
      <g class="${St(this.classes.rectex)}" id="rectex-${this.toolId}">
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
            style="${nt(this.styles.rectex)}"/>
      </g>
      `;return B`${t}`}render(){return B`
      <g id="rectex-${this.toolId}"
        class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderRectangleEx()}
      </g>
    `}}class De extends Tt{constructor(t,e,s){super(t,_t.mergeDeep({position:{cx:50,cy:50,radius:50,side_count:6,side_skip:1,angle_offset:0},classes:{tool:{"sak-polygon":!0,hover:!0},regpoly:{"sak-polygon__regpoly":!0}},styles:{tool:{},regpoly:{}}},e),s),this.svg.radius=bt.calculateSvgDimension(e.position.radius),this.classes.regpoly={},this.styles.regpoly={},this.dev.debug&&console.log("RegPolyTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderRegPoly(){return this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.regpoly),B`
      <path class="${St(this.classes.regpoly)}"
        d="${function(t,e,s,i,o,a){const r=2*Math.PI/t;let n,h,l=i+r,c="";for(let d=0;d<t;d++)l+=e*r,n=o+~~(s*Math.cos(l)),h=a+~~(s*Math.sin(l)),c+=`${(0===d?"M":"L")+n} ${h} `,d*e%t==0&&d>0&&(l+=r,n=o+~~(s*Math.cos(l)),h=a+~~(s*Math.sin(l)),c+=`M${n} ${h} `);return c+="z",c}(this.config.position.side_count,this.config.position.side_skip,this.svg.radius,this.config.position.angle_offset,this.svg.cx,this.svg.cy)}"
        style="${nt(this.styles.regpoly)}"
      />
      `}render(){return B`
      <g "" id="regpoly-${this.toolId}" class="${St(this.classes.tool)}" transform-origin="${this.svg.cx} ${this.svg.cy}"
        style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderRegPoly()}
      </g>
    `}}class Pe extends Tt{constructor(t,e,s){super(t,_t.mergeDeep({position:{cx:50,cy:50,radius:45,width:3,margin:1.5},color:"var(--primary-color)",classes:{tool:{"sak-segarc":!0},foreground:{},background:{}},styles:{tool:{},foreground:{},background:{}},segments:{},colorstops:[],scale:{min:0,max:100,width:2,offset:-3.5},show:{style:"fixedcolor",scale:!1},isScale:!1,animation:{duration:1.5}},e),s),this.dev.performance&&console.time(`--\x3e ${this.toolId} PERFORMANCE SegmentedArcTool::constructor`),this.svg.radius=bt.calculateSvgDimension(e.position.radius),this.svg.radiusX=bt.calculateSvgDimension(e.position.radius_x||e.position.radius),this.svg.radiusY=bt.calculateSvgDimension(e.position.radius_y||e.position.radius),this.svg.segments={},this.svg.segments.gap=bt.calculateSvgDimension(this.config.segments.gap),this.svg.scale_offset=bt.calculateSvgDimension(this.config.scale.offset),this._firstUpdatedCalled=!1,this._stateValue=null,this._stateValuePrev=null,this._stateValueIsDirty=!1,this._renderFrom=null,this._renderTo=null,this.rAFid=null,this.cancelAnimation=!1,this.arcId=null,this._cache=[],this._segmentAngles=[],this._segments={},this._arc={},this._arc.size=Math.abs(this.config.position.end_angle-this.config.position.start_angle),this._arc.clockwise=this.config.position.end_angle>this.config.position.start_angle,this._arc.direction=this._arc.clockwise?1:-1;let i={},o=null;if(this.config.segments.colorlist?.template&&(o=this.config.segments.colorlist,this._card.lovelace.config.sak_user_templates.templates[o.template.name]&&(this.dev.debug&&console.log("SegmentedArcTool::constructor - templates colorlist found",o.template.name),i=wt.replaceVariables2(o.template.variables,this._card.lovelace.config.sak_user_templates.templates[o.template.name]),this.config.segments.colorlist=i)),"fixedcolor"===this.config.show.style);else if("colorlist"===this.config.show.style){this._segments.count=this.config.segments.colorlist.colors.length,this._segments.size=this._arc.size/this._segments.count,this._segments.gap="undefined"!==this.config.segments.colorlist.gap?this.config.segments.colorlist.gap:1,this._segments.sizeList=[];for(var a=0;a<this._segments.count;a++)this._segments.sizeList[a]=this._segments.size;var r=0;for(a=0;a<this._segments.count;a++)this._segmentAngles[a]={boundsStart:this.config.position.start_angle+r*this._arc.direction,boundsEnd:this.config.position.start_angle+(r+this._segments.sizeList[a])*this._arc.direction,drawStart:this.config.position.start_angle+r*this._arc.direction+this._segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(r+this._segments.sizeList[a])*this._arc.direction-this._segments.gap*this._arc.direction},r+=this._segments.sizeList[a];this.dev.debug&&console.log("colorstuff - COLORLIST",this._segments,this._segmentAngles)}else if("colorstops"===this.config.show.style){this._segments.colorStops={},Object.keys(this.config.segments.colorstops.colors).forEach((t=>{t>=this.config.scale.min&&t<=this.config.scale.max&&(this._segments.colorStops[t]=this.config.segments.colorstops.colors[t])})),this._segments.sortedStops=Object.keys(this._segments.colorStops).map((t=>Number(t))).sort(((t,e)=>t-e)),void 0===this._segments.colorStops[this.config.scale.max]&&(this._segments.colorStops[this.config.scale.max]=this._segments.colorStops[this._segments.sortedStops[this._segments.sortedStops.length-1]],this._segments.sortedStops=Object.keys(this._segments.colorStops).map((t=>Number(t))).sort(((t,e)=>t-e))),this._segments.count=this._segments.sortedStops.length-1,this._segments.gap="undefined"!==this.config.segments.colorstops.gap?this.config.segments.colorstops.gap:1;let t=this.config.scale.min;const e=this.config.scale.max-this.config.scale.min;this._segments.sizeList=[];for(a=0;a<this._segments.count;a++){const s=this._segments.sortedStops[a+1]-t;t+=s;const i=s/e*this._arc.size;this._segments.sizeList[a]=i}for(r=0,a=0;a<this._segments.count;a++)this._segmentAngles[a]={boundsStart:this.config.position.start_angle+r*this._arc.direction,boundsEnd:this.config.position.start_angle+(r+this._segments.sizeList[a])*this._arc.direction,drawStart:this.config.position.start_angle+r*this._arc.direction+this._segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(r+this._segments.sizeList[a])*this._arc.direction-this._segments.gap*this._arc.direction},r+=this._segments.sizeList[a],this.dev.debug&&console.log("colorstuff - COLORSTOPS++ segments",r,this._segmentAngles[a]);this.dev.debug&&console.log("colorstuff - COLORSTOPS++",this._segments,this._segmentAngles,this._arc.direction,this._segments.count)}else this.config.show.style;if(this.config.isScale)this._stateValue=this.config.scale.max;else if(this.config.show.scale){const t=_t.mergeDeep(this.config);t.id+="-scale",t.show.scale=!1,t.isScale=!0,t.position.width=this.config.scale.width,t.position.radius=this.config.position.radius-this.config.position.width/2+t.position.width/2+this.config.scale.offset,t.position.radius_x=(this.config.position.radius_x||this.config.position.radius)-this.config.position.width/2+t.position.width/2+this.config.scale.offset,t.position.radius_y=(this.config.position.radius_y||this.config.position.radius)-this.config.position.width/2+t.position.width/2+this.config.scale.offset,this._segmentedArcScale=new Pe(this,t,s)}else this._segmentedArcScale=null;if(this.skipOriginal="colorstops"===this.config.show.style||"colorlist"===this.config.show.style,this.skipOriginal&&(this.config.isScale&&(this._stateValuePrev=this._stateValue),this._initialDraw=!1),this._arc.parts=Math.floor(this._arc.size/Math.abs(this.config.segments.dash)),this._arc.partsPartialSize=this._arc.size-this._arc.parts*this.config.segments.dash,this.skipOriginal)this._arc.parts=this._segmentAngles.length,this._arc.partsPartialSize=0;else{for(a=0;a<this._arc.parts;a++)this._segmentAngles[a]={boundsStart:this.config.position.start_angle+a*this.config.segments.dash*this._arc.direction,boundsEnd:this.config.position.start_angle+(a+1)*this.config.segments.dash*this._arc.direction,drawStart:this.config.position.start_angle+a*this.config.segments.dash*this._arc.direction+this.config.segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(a+1)*this.config.segments.dash*this._arc.direction-this.config.segments.gap*this._arc.direction};this._arc.partsPartialSize>0&&(this._segmentAngles[a]={boundsStart:this.config.position.start_angle+a*this.config.segments.dash*this._arc.direction,boundsEnd:this.config.position.start_angle+(a+0)*this.config.segments.dash*this._arc.direction+this._arc.partsPartialSize*this._arc.direction,drawStart:this.config.position.start_angle+a*this.config.segments.dash*this._arc.direction+this.config.segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(a+0)*this.config.segments.dash*this._arc.direction+this._arc.partsPartialSize*this._arc.direction-this.config.segments.gap*this._arc.direction})}this.starttime=null,this.dev.debug&&console.log("SegmentedArcTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config),this.dev.debug&&console.log("SegmentedArcTool - init",this.toolId,this.config.isScale,this._segmentAngles),this.dev.performance&&console.timeEnd(`--\x3e ${this.toolId} PERFORMANCE SegmentedArcTool::constructor`)}get objectId(){return this.toolId}set value(t){if(this.dev.debug&&console.log("SegmentedArcTool - set value IN"),this.config.isScale)return!1;if(this._stateValue===t)return!1;return super.value=t}firstUpdated(t){this.dev.debug&&console.log("SegmentedArcTool - firstUpdated IN with _arcId/id",this._arcId,this.toolId,this.config.isScale),this._arcId=this._card.shadowRoot.getElementById("arc-".concat(this.toolId)),this._firstUpdatedCalled=!0,this._segmentedArcScale?.firstUpdated(t),this.skipOriginal&&(this.dev.debug&&console.log("RENDERNEW - firstUpdated IN with _arcId/id/isScale/scale/connected",this._arcId,this.toolId,this.config.isScale,this._segmentedArcScale,this._card.connected),this.config.isScale||(this._stateValuePrev=null),this._initialDraw=!0,this._card.requestUpdate())}updated(t){this.dev.debug&&console.log("SegmentedArcTool - updated IN")}render(){return this.dev.debug&&console.log("SegmentedArcTool RENDERNEW - Render IN"),B`
      <g "" id="arc-${this.toolId}"
        class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}"
      >
        <g >
          ${this._renderSegments()}
          </g>
        ${this._renderScale()}
      </g>
    `}_renderScale(){if(this._segmentedArcScale)return this._segmentedArcScale.render()}_renderSegments(){if(this.skipOriginal){let t,e;const s=this.svg.width,i=this.svg.radiusX,o=this.svg.radiusY;let a;this.dev.debug&&console.log("RENDERNEW - IN _arcId, firstUpdatedCalled",this._arcId,this._firstUpdatedCalled);const r=bt.calculateValueBetween(this.config.scale.min,this.config.scale.max,this._stateValue),n=bt.calculateValueBetween(this.config.scale.min,this.config.scale.max,this._stateValuePrev);this.dev.debug&&(this._stateValuePrev||console.log("*****UNDEFINED",this._stateValue,this._stateValuePrev,n)),r!==n&&this.dev.debug&&console.log("RENDERNEW _renderSegments diff value old new",this.toolId,n,r),t=r*this._arc.size*this._arc.direction+this.config.position.start_angle,e=n*this._arc.size*this._arc.direction+this.config.position.start_angle;const h=[];if(!this.config.isScale)for(let l=0;l<this._segmentAngles.length;l++)a=this.buildArcPath(this._segmentAngles[l].drawStart,this._segmentAngles[l].drawEnd,this._arc.clockwise,this.svg.radiusX,this.svg.radiusY,this.svg.width),h.push(B`<path id="arc-segment-bg-${this.toolId}-${l}" class="sak-segarc__background"
                              style="${nt(this.config.styles.background)}"
                              d="${a}"
                              />`);if(this._firstUpdatedCalled){this.dev.debug&&console.log("RENDERNEW _arcId DOES exist",this._arcId,this.toolId,this._firstUpdatedCalled),this._cache.forEach(((t,e)=>{if(a=t,this.config.isScale){let t=this.config.color;"colorlist"===this.config.show.style&&(t=this.config.segments.colorlist.colors[e]),"colorstops"===this.config.show.style&&(t=this._segments.colorStops[this._segments.sortedStops[e]]),this.styles.foreground[e]||(this.styles.foreground[e]=_t.mergeDeep(this.config.styles.foreground)),this.styles.foreground[e].fill=t}h.push(B`<path id="arc-segment-${this.toolId}-${e}" class="sak-segarc__foreground"
                            style="${nt(this.styles.foreground[e])}"
                            d="${a}"
                            />`)}));const c={};function d(t,e){let r,n;t=t||(new Date).getTime();c.startTime||(c.startTime=t,c.runningAngle=c.fromAngle),e.debug&&console.log("RENDERNEW - in animateSegmentsNEW",e.toolId,c);const h=t-c.startTime;var l;c.progress=Math.min(h/c.duration,1),c.progress=(l=c.progress,--l**5+1);const g=e._arc.clockwise?c.toAngle>c.fromAngle:c.fromAngle>c.toAngle;c.frameAngle=c.fromAngle+(c.toAngle-c.fromAngle)*c.progress,r=e._segmentAngles.findIndex(((t,s)=>e._arc.clockwise?c.frameAngle<=t.boundsEnd&&c.frameAngle>=t.boundsStart:c.frameAngle<=t.boundsStart&&c.frameAngle>=t.boundsEnd)),-1===r&&(console.log("RENDERNEW animateSegments frameAngle not found",c,e._segmentAngles),console.log("config",e.config)),n=e._segmentAngles.findIndex(((t,s)=>e._arc.clockwise?c.runningAngle<=t.boundsEnd&&c.runningAngle>=t.boundsStart:c.runningAngle<=t.boundsStart&&c.runningAngle>=t.boundsEnd));do{const t=e._segmentAngles[n].drawStart;var u=e._arc.clockwise?Math.min(e._segmentAngles[n].boundsEnd,c.frameAngle):Math.max(e._segmentAngles[n].boundsEnd,c.frameAngle);const r=e._arc.clockwise?Math.min(e._segmentAngles[n].drawEnd,c.frameAngle):Math.max(e._segmentAngles[n].drawEnd,c.frameAngle);let h;a=e.buildArcPath(t,r,e._arc.clockwise,i,o,s),e.myarc||(e.myarc={}),e.as||(e.as={});const l="arc-segment-".concat(e.toolId).concat("-").concat(n);if(e.as[n]||(e.as[n]=e._card.shadowRoot.getElementById(l)),h=e.as[n],e.myarc[n]=l,h&&(h.setAttribute("d",a),"colorlist"===e.config.show.style&&(h.style.fill=e.config.segments.colorlist.colors[n],e.styles.foreground[n].fill=e.config.segments.colorlist.colors[n]),e.config.show.lastcolor)){var m;const t=e._arc.clockwise?e._segmentAngles[n].drawStart:e._segmentAngles[n].drawEnd,s=e._arc.clockwise?e._segmentAngles[n].drawEnd:e._segmentAngles[n].drawStart,i=Math.min(Math.max(0,(u-t)/(s-t)),1);if("colorstops"===e.config.show.style?m=Et.getGradientValue(e._segments.colorStops[e._segments.sortedStops[n]],e._segments.colorStops[e._segments.sortedStops[n]],i):"colorlist"===e.config.show.style&&(m=e.config.segments.colorlist.colors[n]),e.styles.foreground[0].fill=m,e.as[0].style.fill=m,n>0)for(let o=n;o>=0;o--)e.styles.foreground[o].fill!==m&&(e.styles.foreground[o].fill=m,e.as[o].style.fill=m),e.styles.foreground[o].fill=m,e.as[o].style.fill=m}e._cache[n]=a,c.frameAngle!==u&&(u+=1e-6*e._arc.direction);var p=n;n=e._segmentAngles.findIndex(((t,s)=>e._arc.clockwise?u<=t.boundsEnd&&u>=t.boundsStart:u<=t.boundsStart&&u>=t.boundsEnd)),g||p!==n&&(e.debug&&console.log("RENDERNEW movit - remove path",e.toolId,p),e._arc.clockwise,h.removeAttribute("d"),e._cache[p]=null),c.runningAngle=u,e.debug&&console.log("RENDERNEW - animation loop tween",e.toolId,c,n,p)}while(c.runningAngle!==c.frameAngle);1!==c.progress?e.rAFid=requestAnimationFrame((t=>{d(t,e)})):(c.startTime=null,e.debug&&console.log("RENDERNEW - animation loop ENDING tween",e.toolId,c,n,p))}const g=this;return!0===this._card.connected&&this._renderTo!==this._stateValue&&(this._renderTo=this._stateValue,this.rAFid&&cancelAnimationFrame(this.rAFid),c.fromAngle=e,c.toAngle=t,c.runningAngle=e,c.duration=Math.min(Math.max(this._initialDraw?100:500,this._initialDraw?16:1e3*this.config.animation.duration),5e3),c.startTime=null,this.dev.debug&&console.log("RENDERNEW - tween",this.toolId,c),this.rAFid=requestAnimationFrame((t=>{d(t,g)})),this._initialDraw=!1),B`${h}`}this.dev.debug&&console.log("RENDERNEW _arcId does NOT exist",this._arcId,this.toolId);for(let u=0;u<this._segmentAngles.length;u++){a=this.buildArcPath(this._segmentAngles[u].drawStart,this._segmentAngles[u].drawEnd,this._arc.clockwise,this.svg.radiusX,this.svg.radiusY,this.config.isScale?this.svg.width:0),this._cache[u]=a;let m=this.config.color;if("colorlist"===this.config.show.style&&(m=this.config.segments.colorlist.colors[u]),"colorstops"===this.config.show.style&&(m=this._segments.colorStops[this._segments.sortedStops[u]]),this.styles.foreground||(this.styles.foreground={}),this.styles.foreground[u]||(this.styles.foreground[u]=_t.mergeDeep(this.config.styles.foreground)),this.styles.foreground[u].fill=m,this.config.show.lastcolor&&u>0)for(let p=u-1;p>0;p--)this.styles.foreground[p].fill=m;h.push(B`<path id="arc-segment-${this.toolId}-${u}" class="arc__segment"
                            style="${nt(this.styles.foreground[u])}"
                            d="${a}"
                            />`)}return this.dev.debug&&console.log("RENDERNEW - svgItems",h,this._firstUpdatedCalled),B`${h}`}}polarToCartesian(t,e,s,i,o){const a=(o-90)*Math.PI/180;return{x:t+s*Math.cos(a),y:e+i*Math.sin(a)}}buildArcPath(t,e,s,i,o,a){const r=this.polarToCartesian(this.svg.cx,this.svg.cy,i,o,e),n=this.polarToCartesian(this.svg.cx,this.svg.cy,i,o,t),h=Math.abs(e-t)<=180?"0":"1",l=s?"0":"1",c=i-a,d=o-a,g=this.polarToCartesian(this.svg.cx,this.svg.cy,c,d,e),u=this.polarToCartesian(this.svg.cx,this.svg.cy,c,d,t);return["M",r.x,r.y,"A",i,o,0,h,l,n.x,n.y,"L",u.x,u.y,"A",c,d,0,h,"0"===l?"1":"0",g.x,g.y,"Z"].join(" ")}}class Oe extends Tt{constructor(t,e,s){super(t,_t.mergeDeep({position:{cx:50,cy:50,height:25,width:25,margin:.5,orientation:"vertical"},hours:24,barhours:1,color:"var(--primary-color)",classes:{tool:{"sak-barchart":!0,hover:!0},bar:{},line:{"sak-barchart__line":!0,hover:!0}},styles:{tool:{},line:{},bar:{}},colorstops:[],show:{style:"fixedcolor"}},e),s),this.svg.margin=bt.calculateSvgDimension(this.config.position.margin);const i="vertical"===this.config.position.orientation?this.svg.width:this.svg.height;this.svg.barWidth=(i-(this.config.hours/this.config.barhours-1)*this.svg.margin)/(this.config.hours/this.config.barhours),this._data=[],this._bars=[],this._scale={},this._needsRendering=!1,this.classes.tool={},this.classes.bar={},this.styles.tool={},this.styles.line={},this.stylesBar={},this.dev.debug&&console.log("SparkleBarChart constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}computeMinMax(){let t=this._series[0],e=this._series[0];for(let s=1,i=this._series.length;s<i;s++){const i=this._series[s];t=i<t?i:t,e=i>e?i:e}this._scale.min=t,this._scale.max=e,this._scale.size=e-t,this._scale.size=1.05*(e-t),this._scale.min=e-this._scale.size}set data(t){this._series=Object.assign(t),this.computeBars(),this._needsRendering=!0}set series(t){this._series=Object.assign(t),this.computeBars(),this._needsRendering=!0}hasSeries(){return this.defaultEntityIndex()}computeBars({_bars:t}=this){this.computeMinMax(),"minmaxgradient"===this.config.show.style&&(this.colorStopsMinMax={},this.colorStopsMinMax={[this._scale.min.toString()]:this.config.minmaxgradient.colors.min,[this._scale.max.toString()]:this.config.minmaxgradient.colors.max}),"vertical"===this.config.position.orientation?(this.dev.debug&&console.log("bar is vertical"),this._series.forEach(((e,s)=>{t[s]||(t[s]={}),t[s].length=0===this._scale.size?0:(e-this._scale.min)/this._scale.size*this.svg.height,t[s].x1=this.svg.x+this.svg.barWidth/2+(this.svg.barWidth+this.svg.margin)*s,t[s].x2=t[s].x1,t[s].y1=this.svg.y+this.svg.height,t[s].y2=t[s].y1-this._bars[s].length,t[s].dataLength=this._bars[s].length}))):"horizontal"===this.config.position.orientation?(this.dev.debug&&console.log("bar is horizontal"),this._data.forEach(((e,s)=>{t[s]||(t[s]={}),t[s].length=0===this._scale.size?0:(e-this._scale.min)/this._scale.size*this.svg.width,t[s].y1=this.svg.y+this.svg.barWidth/2+(this.svg.barWidth+this.svg.margin)*s,t[s].y2=t[s].y1,t[s].x1=this.svg.x,t[s].x2=t[s].x1+this._bars[s].length,t[s].dataLength=this._bars[s].length}))):this.dev.debug&&console.log("SparklineBarChartTool - unknown barchart orientation (horizontal or vertical)")}_renderBars(){const t=[];if(0!==this._bars.length)return this.dev.debug&&console.log("_renderBars IN",this.toolId),this._bars.forEach(((e,s)=>{this.dev.debug&&console.log("_renderBars - bars",e,s);const i=this.getColorFromState(this._series[s]);this.stylesBar[s]||(this.stylesBar[s]={...this.config.styles.bar}),this._bars[s].y2||console.log("sparklebarchart y2 invalid",this._bars[s]),t.push(B`
          <line id="line-segment-${this.toolId}-${s}" class="${St(this.config.classes.line)}"
                    style="${nt(this.stylesBar[s])}"
                    x1="${this._bars[s].x1}"
                    x2="${this._bars[s].x2}"
                    y1="${this._bars[s].y1}"
                    y2="${this._bars[s].y2}"
                    data-length="${this._bars[s].dataLength}"
                    stroke="${i}"
                    stroke-width="${this.svg.barWidth}"
                    />
          `)})),this.dev.debug&&console.log("_renderBars OUT",this.toolId),B`${t}`}render(){return B`
        <g id="barchart-${this.toolId}"
          class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}"
          @click=${t=>this.handleTapEvent(t,this.config)}>
          ${this._renderBars()}
        </g>
      `}}class Re extends Tt{constructor(t,e,s){const i={position:{cx:50,cy:50,orientation:"horizontal",track:{width:16,height:7,radius:3.5},thumb:{width:9,height:9,radius:4.5,offset:4.5}},classes:{tool:{"sak-switch":!0,hover:!0},track:{"sak-switch__track":!0},thumb:{"sak-switch__thumb":!0}},styles:{tool:{overflow:"visible"},track:{},thumb:{}}},o={animations:[{state:"on",id:1,styles:{track:{fill:"var(--switch-checked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-checked-button-color)",transform:"translateX(4.5em)","pointer-events":"auto"}}},{state:"off",id:0,styles:{track:{fill:"var(--switch-unchecked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-unchecked-button-color)",transform:"translateX(-4.5em)","pointer-events":"auto"}}}]},a={animations:[{state:"on",id:1,styles:{track:{fill:"var(--switch-checked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-checked-button-color)",transform:"translateY(-4.5em)","pointer-events":"auto"}}},{state:"off",id:0,styles:{track:{fill:"var(--switch-unchecked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-unchecked-button-color)",transform:"translateY(4.5em)","pointer-events":"auto"}}}]};if(super(t,_t.mergeDeep(i,e),s),!["horizontal","vertical"].includes(this.config.position.orientation))throw Error("SwitchTool::constructor - invalid orientation [vertical, horizontal] = ",this.config.position.orientation);switch(this.svg.track={},this.svg.track.radius=bt.calculateSvgDimension(this.config.position.track.radius),this.svg.thumb={},this.svg.thumb.radius=bt.calculateSvgDimension(this.config.position.thumb.radius),this.svg.thumb.offset=bt.calculateSvgDimension(this.config.position.thumb.offset),this.config.position.orientation){default:case"horizontal":this.config=_t.mergeDeep(i,o,e),this.svg.track.width=bt.calculateSvgDimension(this.config.position.track.width),this.svg.track.height=bt.calculateSvgDimension(this.config.position.track.height),this.svg.thumb.width=bt.calculateSvgDimension(this.config.position.thumb.width),this.svg.thumb.height=bt.calculateSvgDimension(this.config.position.thumb.height),this.svg.track.x1=this.svg.cx-this.svg.track.width/2,this.svg.track.y1=this.svg.cy-this.svg.track.height/2,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2;break;case"vertical":this.config=_t.mergeDeep(i,a,e),this.svg.track.width=bt.calculateSvgDimension(this.config.position.track.height),this.svg.track.height=bt.calculateSvgDimension(this.config.position.track.width),this.svg.thumb.width=bt.calculateSvgDimension(this.config.position.thumb.height),this.svg.thumb.height=bt.calculateSvgDimension(this.config.position.thumb.width),this.svg.track.x1=this.svg.cx-this.svg.track.width/2,this.svg.track.y1=this.svg.cy-this.svg.track.height/2,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2}this.classes.track={},this.classes.thumb={},this.styles.track={},this.styles.thumb={},this.dev.debug&&console.log("SwitchTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderSwitch(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(this.styles),B`
      <g>
        <rect class="${St(this.classes.track)}" x="${this.svg.track.x1}" y="${this.svg.track.y1}"
          width="${this.svg.track.width}" height="${this.svg.track.height}" rx="${this.svg.track.radius}"
          style="${nt(this.styles.track)}"
        />
        <rect class="${St(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
          width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
          style="${nt(this.styles.thumb)}"
        />
      </g>
      `}render(){return B`
      <g id="switch-${this.toolId}" transform-origin="${this.svg.cx} ${this.svg.cy}"
        class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderSwitch()}
      </g>
    `}}class Le extends Tt{constructor(t,e,s){super(t,_t.mergeDeep({classes:{tool:{"sak-text":!0},text:{"sak-text__text":!0,hover:!1}},styles:{tool:{},text:{}}},e),s),this.EnableHoverForInteraction(),this.text=this.config.text,this.classes.tool={},this.classes.text={},this.styles.tool={},this.styles.text={},this.dev.debug&&console.log("TextTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_renderText(){return this.MergeAnimationClassIfChanged(),this.MergeColorFromState(this.styles.text),this.MergeAnimationStyleIfChanged(),B`
        <text>
          <tspan class="${St(this.classes.text)}" x="${this.svg.cx}" y="${this.svg.cy}" style="${nt(this.styles.text)}">${this.text}</tspan>
        </text>
      `}render(){return B`
        <g id="text-${this.toolId}"
          class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}"
          @click=${t=>this.handleTapEvent(t,this.config)}>
          ${this._renderText()}
        </g>
      `}}function Fe(t,e,s){if(s||2===arguments.length)for(var i,o=0,a=e.length;o<a;o++)!i&&o in e||(i||(i=Array.prototype.slice.call(e,0,o)),i[o]=e[o]);return t.concat(i||Array.prototype.slice.call(e))}
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */var ze=/; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g,Be=/\\([\u000b\u0020-\u00ff])/g,Ue=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/,je=function(t){if(!t)throw new TypeError("argument string is required");var e="object"==typeof t?function(t){var e;"function"==typeof t.getHeader?e=t.getHeader("content-type"):"object"==typeof t.headers&&(e=t.headers&&t.headers["content-type"]);if("string"!=typeof e)throw new TypeError("content-type header is missing from object");return e}(t):t;if("string"!=typeof e)throw new TypeError("argument string is required to be a string");var s=e.indexOf(";"),i=-1!==s?e.slice(0,s).trim():e.trim();if(!Ue.test(i))throw new TypeError("invalid media type");var o=new Ge(i.toLowerCase());if(-1!==s){var a,r,n;for(ze.lastIndex=s;r=ze.exec(e);){if(r.index!==s)throw new TypeError("invalid parameter format");s+=r[0].length,a=r[1].toLowerCase(),34===(n=r[2]).charCodeAt(0)&&-1!==(n=n.slice(1,-1)).indexOf("\\")&&(n=n.replace(Be,"$1")),o.parameters[a]=n}if(s!==e.length)throw new TypeError("invalid parameter format")}return o};function Ge(t){this.parameters=Object.create(null),this.type=t}var He=new Map,qe=function(t){return t.cloneNode(!0)},We=function(){return"file:"===window.location.protocol},Ye=function(t,e,s){var i=new XMLHttpRequest;i.onreadystatechange=function(){try{if(!/\.svg/i.test(t)&&2===i.readyState){var e=i.getResponseHeader("Content-Type");if(!e)throw new Error("Content type not found");var o=je(e).type;if("image/svg+xml"!==o&&"text/plain"!==o)throw new Error("Invalid content type: ".concat(o))}if(4===i.readyState){if(404===i.status||null===i.responseXML)throw new Error(We()?"Note: SVG injection ajax calls do not work locally without adjusting security settings in your browser. Or consider using a local webserver.":"Unable to load SVG file: "+t);if(!(200===i.status||We()&&0===i.status))throw new Error("There was a problem injecting the SVG: "+i.status+" "+i.statusText);s(null,i)}}catch(a){if(i.abort(),!(a instanceof Error))throw a;s(a,i)}},i.open("GET",t),i.withCredentials=e,i.overrideMimeType&&i.overrideMimeType("text/xml"),i.send()},Je={},Xe=function(t,e){Je[t]=Je[t]||[],Je[t].push(e)},Ze=function(t,e,s){if(He.has(t)){var i=He.get(t);if(void 0===i)return void Xe(t,s);if(i instanceof SVGSVGElement)return void s(null,qe(i))}He.set(t,void 0),Xe(t,s),Ye(t,e,(function(e,s){var i;e?He.set(t,e):(null===(i=s.responseXML)||void 0===i?void 0:i.documentElement)instanceof SVGSVGElement&&He.set(t,s.responseXML.documentElement),function(t){for(var e=function(e,s){setTimeout((function(){if(Array.isArray(Je[t])){var s=He.get(t),i=Je[t][e];s instanceof SVGSVGElement&&i(null,qe(s)),s instanceof Error&&i(s),e===Je[t].length-1&&delete Je[t]}}),0)},s=0,i=Je[t].length;s<i;s++)e(s)}(t)}))},Ke=function(t,e,s){Ye(t,e,(function(t,e){var i;t?s(t):(null===(i=e.responseXML)||void 0===i?void 0:i.documentElement)instanceof SVGSVGElement&&s(null,e.responseXML.documentElement)}))},Qe=0,ts=[],es={},ss="http://www.w3.org/1999/xlink",is=function(t,e,s,i,o,a,r){var n=t.getAttribute("data-src")||t.getAttribute("src");if(n){if(-1!==ts.indexOf(t))return ts.splice(ts.indexOf(t),1),void(t=null);ts.push(t),t.setAttribute("src",""),(i?Ze:Ke)(n,o,(function(i,o){if(!o)return ts.splice(ts.indexOf(t),1),t=null,void r(i);var h=t.getAttribute("id");h&&o.setAttribute("id",h);var l=t.getAttribute("title");l&&o.setAttribute("title",l);var c=t.getAttribute("width");c&&o.setAttribute("width",c);var d=t.getAttribute("height");d&&o.setAttribute("height",d);var g=Array.from(new Set(Fe(Fe(Fe([],(o.getAttribute("class")||"").split(" "),!0),["injected-svg"],!1),(t.getAttribute("class")||"").split(" "),!0))).join(" ").trim();o.setAttribute("class",g);var u=t.getAttribute("style");u&&o.setAttribute("style",u),o.setAttribute("data-src",n);var m=[].filter.call(t.attributes,(function(t){return/^data-\w[\w-]*$/.test(t.name)}));if(Array.prototype.forEach.call(m,(function(t){t.name&&t.value&&o.setAttribute(t.name,t.value)})),s){var p,f,v,y,_,b={clipPath:["clip-path"],"color-profile":["color-profile"],cursor:["cursor"],filter:["filter"],linearGradient:["fill","stroke"],marker:["marker","marker-start","marker-mid","marker-end"],mask:["mask"],path:[],pattern:["fill","stroke"],radialGradient:["fill","stroke"]};Object.keys(b).forEach((function(t){p=t,v=b[t];for(var e=function(t,e){var s;y=f[t].id,_=y+"-"+ ++Qe,Array.prototype.forEach.call(v,(function(t){for(var e=0,i=(s=o.querySelectorAll("["+t+'*="'+y+'"]')).length;e<i;e++){var a=s[e].getAttribute(t);a&&!a.match(new RegExp('url\\("?#'+y+'"?\\)'))||s[e].setAttribute(t,"url(#"+_+")")}}));for(var i=o.querySelectorAll("[*|href]"),a=[],r=0,n=i.length;r<n;r++){var h=i[r].getAttributeNS(ss,"href");h&&h.toString()==="#"+f[t].id&&a.push(i[r])}for(var l=0,c=a.length;l<c;l++)a[l].setAttributeNS(ss,"href","#"+_);f[t].id=_},s=0,i=(f=o.querySelectorAll(p+"[id]")).length;s<i;s++)e(s)}))}o.removeAttribute("xmlns:a");for(var w,x,$=o.querySelectorAll("script"),S=[],k=0,E=$.length;k<E;k++)(x=$[k].getAttribute("type"))&&"application/ecmascript"!==x&&"application/javascript"!==x&&"text/javascript"!==x||((w=$[k].innerText||$[k].textContent)&&S.push(w),o.removeChild($[k]));if(S.length>0&&("always"===e||"once"===e&&!es[n])){for(var T=0,C=S.length;T<C;T++)new Function(S[T])(window);es[n]=!0}var M=o.querySelectorAll("style");if(Array.prototype.forEach.call(M,(function(t){t.textContent+=""})),o.setAttribute("xmlns","http://www.w3.org/2000/svg"),o.setAttribute("xmlns:xlink",ss),a(o),!t.parentNode)return ts.splice(ts.indexOf(t),1),t=null,void r(new Error("Parent node is null"));t.parentNode.replaceChild(o,t),ts.splice(ts.indexOf(t),1),t=null,r(null,o)}))}else r(new Error("Invalid data-src or src attribute"))};class os extends Tt{constructor(t,e,s){if(super(t,_t.mergeDeep({position:{cx:50,cy:50,height:50,width:50},options:{svginject:!0},styles:{usersvg:{},mask:{fill:"white"}}},e),s),this.images={},this.images=Object.assign({},...this.config.images),this.item={},this.item.image="default",this.imageCur="none",this.imagePrev="none",this.classes={},this.classes.tool={},this.classes.usersvg={},this.classes.mask={},this.styles={},this.styles.tool={},this.styles.usersvg={},this.styles.mask={},this.injector={},this.injector.svg=null,this.injector.cache=[],this.clipPath={},this.config.clip_path){this.svg.cp_cx=bt.calculateSvgCoordinate(this.config.clip_path.position.cx||this.config.position.cx,0),this.svg.cp_cy=bt.calculateSvgCoordinate(this.config.clip_path.position.cy||this.config.position.cy,0),this.svg.cp_height=bt.calculateSvgDimension(this.config.clip_path.position.height||this.config.position.height),this.svg.cp_width=bt.calculateSvgDimension(this.config.clip_path.position.width||this.config.position.width);const t=Math.min(this.svg.cp_height,this.svg.cp_width)/2;this.svg.radiusTopLeft=+Math.min(t,Math.max(0,bt.calculateSvgDimension(this.config.clip_path.position.radius.top_left||this.config.clip_path.position.radius.left||this.config.clip_path.position.radius.top||this.config.clip_path.position.radius.all)))||0,this.svg.radiusTopRight=+Math.min(t,Math.max(0,bt.calculateSvgDimension(this.config.clip_path.position.radius.top_right||this.config.clip_path.position.radius.right||this.config.clip_path.position.radius.top||this.config.clip_path.position.radius.all)))||0,this.svg.radiusBottomLeft=+Math.min(t,Math.max(0,bt.calculateSvgDimension(this.config.clip_path.position.radius.bottom_left||this.config.clip_path.position.radius.left||this.config.clip_path.position.radius.bottom||this.config.clip_path.position.radius.all)))||0,this.svg.radiusBottomRight=+Math.min(t,Math.max(0,bt.calculateSvgDimension(this.config.clip_path.position.radius.bottom_right||this.config.clip_path.position.radius.right||this.config.clip_path.position.radius.bottom||this.config.clip_path.position.radius.all)))||0}this.dev.debug&&console.log("UserSvgTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}updated(t){var e=this;this.config.options.svginject&&!this.injector.cache[this.imageCur]&&(this.injector.elementsToInject=this._card.shadowRoot.getElementById("usersvg-".concat(this.toolId)).querySelectorAll("svg[data-src]:not(.injected-svg)"),0!==this.injector.elementsToInject.length&&function(t,e){var s=void 0===e?{}:e,i=s.afterAll,o=void 0===i?function(){}:i,a=s.afterEach,r=void 0===a?function(){}:a,n=s.beforeEach,h=void 0===n?function(){}:n,l=s.cacheRequests,c=void 0===l||l,d=s.evalScripts,g=void 0===d?"never":d,u=s.httpRequestWithCredentials,m=void 0!==u&&u,p=s.renumerateIRIElements,f=void 0===p||p;if(t&&"length"in t)for(var v=0,y=0,_=t.length;y<_;y++)is(t[y],g,f,c,m,h,(function(e,s){r(e,s),t&&"length"in t&&t.length===++v&&o(v)}));else t?is(t,g,f,c,m,h,(function(e,s){r(e,s),o(1),t=null})):o(0)}(this.injector.elementsToInject,{afterAll(t){setTimeout((()=>{e._card.requestUpdate()}),0)},afterEach(t,s){if(t)throw e.injector.error=t,e.config.options.svginject=!1,t;e.injector.error="",e.injector.cache[e.imageCur]=s},beforeEach(t){t.removeAttribute("height"),t.removeAttribute("width")},cacheRequests:!1,evalScripts:"once",httpRequestWithCredentials:!1,renumerateIRIElements:!1}))}_renderUserSvg(){this.MergeAnimationStyleIfChanged();const t=wt.getJsTemplateOrValue(this,this._stateValue,_t.mergeDeep(this.images));if(this.imagePrev=this.imageCur,this.imageCur=t[this.item.image],"none"===t[this.item.image])return B``;let e=this.injector.cache[this.imageCur],s=B``,i="",o="";this.config.clip_path&&(i=`url(#clip-path-${this.toolId})`,o=`url(#mask-${this.toolId})`,s=B`
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
            <use href="#path-${this.toolId}" style="${nt(this.styles.mask)}"/>
          </mask>
        </defs>
        `);const a=t[this.item.image].lastIndexOf(".");return"svg"!==t[this.item.image].substring(-1===a?1/0:a+1)?B`
        <svg class="sak-usersvg__image" x="${this.svg.x}" y="${this.svg.y}"
          style="${nt(this.styles.usersvg)}">
          "${s}"
          <image 
            clip-path="${i}" mask="${o}"
            href="${t[this.item.image]}"
            height="${this.svg.height}" width="${this.svg.width}"
          />
        </svg>
        `:e&&this.config.options.svginject?(e.classList.remove("hidden"),B`
        <svg x="${this.svg.x}" y="${this.svg.y}" style="${nt(this.styles.usersvg)}"
          height="${this.svg.height}" width="${this.svg.width}"
          clip-path="${i}"
          mask="${o}"
        >
          "${s}"
          ${e};
       </svg>
       `):B`
        <svg class="sak-usersvg__image ${this.config.options.svginject?"hidden":""}"
          data-id="usersvg-${this.toolId}" data-src="${t[this.item.image]}"
          x="${this.svg.x}" y="${this.svg.y}"
          style="${this.config.options.svginject?"":nt(this.styles.usersvg)}">
          "${s}"
          <image
            clip-path="${i}"
            mask="${o}"
            href="${t[this.item.image]}"
            height="${this.svg.height}" width="${this.svg.width}"
          />
        </svg>
      `}render(){return B`
      <g id="usersvg-${this.toolId}" overflow="visible"
        class="${St(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderUserSvg()}
      </g>
    `}}class as{constructor(t,e){if(this.toolsetId=Math.random().toString(36).substr(2,9),this._card=t,this.dev={...this._card.dev},this.dev.performance&&console.time(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::constructor`),this.config=e,this.tools=[],this.palette={},this.palette.light={},this.palette.dark={},this.config.palette){const{paletteLight:t,paletteDark:e}=Et.processPalette(this.config.palette);this.palette.light=t,this.palette.dark=e}this.svg={},this.svg.cx=bt.calculateSvgCoordinate(e.position.cx,pt),this.svg.cy=bt.calculateSvgCoordinate(e.position.cy,pt),this.svg.x=this.svg.cx-pt,this.svg.y=this.svg.cy-pt,this.transform={},this.transform.scale={},this.transform.scale.x=this.transform.scale.y=1,this.transform.rotate={},this.transform.rotate.x=this.transform.rotate.y=0,this.transform.skew={},this.transform.skew.x=this.transform.skew.y=0,this.config.position.scale&&(this.transform.scale.x=this.transform.scale.y=this.config.position.scale),this.config.position.rotate&&(this.transform.rotate.x=this.transform.rotate.y=this.config.position.rotate),this.transform.scale.x=this.config.position.scale_x||this.config.position.scale||1,this.transform.scale.y=this.config.position.scale_y||this.config.position.scale||1,this.transform.rotate.x=this.config.position.rotate_x||this.config.position.rotate||0,this.transform.rotate.y=this.config.position.rotate_y||this.config.position.rotate||0,this.dev.debug&&console.log("Toolset::constructor config/svg",this.toolsetId,this.config,this.svg);const s={area:Vt,circslider:It,badge:Ct,bar:Oe,circle:Mt,ellipse:At,graph:Ce,horseshoe:Me,icon:jt,line:Ie,name:Gt,rectangle:Ve,rectex:Ne,regpoly:De,segarc:Pe,state:we,slider:Ae,switch:Re,text:Le,usersvg:os};this.config.tools.map((t=>{const e={...t},i={cx:0,cy:0,scale:this.config.position.scale?this.config.position.scale:1};if(this.dev.debug&&console.log("Toolset::constructor toolConfig",this.toolsetId,e,i),!t.disabled){const o=new s[t.type](this,e,i);this._card.entityHistory.needed|="bar"===t.type,this._card.entityHistory.needed|="graph"===t.type,this.tools.push({type:t.type,index:t.id,tool:o})}return!0})),this.dev.performance&&console.timeEnd(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::constructor`)}updateValues(){this.dev.performance&&console.time(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::updateValues`),this.tools&&this.tools.map(((t,e)=>{if(t.tool.config.hasOwnProperty("entity_index")&&(this.dev.debug&&console.log("Toolset::updateValues",t,e),t.tool.value=this._card.attributesStr[t.tool.config.entity_index]?this._card.attributesStr[t.tool.config.entity_index]:this._card.secondaryInfoStr[t.tool.config.entity_index]?this._card.secondaryInfoStr[t.tool.config.entity_index]:this._card.entitiesStr[t.tool.config.entity_index]),t.tool.config.hasOwnProperty("entity_indexes")){const e=[];for(let s=0;s<t.tool.config.entity_indexes.length;++s)e[s]=this._card.attributesStr[t.tool.config.entity_indexes[s].entity_index]?this._card.attributesStr[t.tool.config.entity_indexes[s].entity_index]:this._card.secondaryInfoStr[t.tool.config.entity_indexes[s].entity_index]?this._card.secondaryInfoStr[t.tool.config.entity_indexes[s].entity_index]:this._card.entitiesStr[t.tool.config.entity_indexes[s].entity_index];t.tool.values=e}return!0})),this.dev.performance&&console.timeEnd(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::updateValues`)}connectedCallback(){this.dev.performance&&console.time(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::connectedCallback`),this.dev.debug&&console.log("*****Event - connectedCallback",this.toolsetId,(new Date).getTime()),this.dev.performance&&console.timeEnd(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::connectedCallback`)}disconnectedCallback(){this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE Toolset::disconnectedCallback`),this.dev.debug&&console.log("*****Event - disconnectedCallback",this.toolsetId,(new Date).getTime()),this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE Toolset::disconnectedCallback`)}firstUpdated(t){this.dev.debug&&console.log("*****Event - Toolset::firstUpdated",this.toolsetId,(new Date).getTime()),this.tools&&this.tools.map((e=>"function"==typeof e.tool.firstUpdated&&(e.tool.firstUpdated(t),!0)))}updated(t){this.dev.debug&&console.log("*****Event - Updated",this.toolsetId,(new Date).getTime()),this.tools&&this.tools.map((e=>"function"==typeof e.tool.updated&&(e.tool.updated(t),!0)))}renderToolset(){this.dev.debug&&console.log("*****Event - renderToolset",this.toolsetId,(new Date).getTime());const t=this.tools.map((t=>B`
          ${t.tool.render()}
      `));return B`${t}`}render(){return!this._card.isSafari&&!this._card.iOS||this._card.isSafari16?B`
        <g id="toolset-${this.toolsetId}" class="toolset__group-outer"
           transform="rotate(${this.transform.rotate.x}) scale(${this.transform.scale.x}, ${this.transform.scale.y})"
           style="transform-origin:center; transform-box:fill-box;">
          <svg style="overflow:visible;">
            <g class="toolset__group" transform="translate(${this.svg.cx}, ${this.svg.cy})"
            style="${nt(this._card.themeIsDarkMode()?this.palette.dark:this.palette.light)}"
            >
              ${this.renderToolset()}
            </g>
            </svg>
        </g>
      `:B`
        <g id="toolset-${this.toolsetId}" class="toolset__group-outer"
           transform="rotate(${this.transform.rotate.x}, ${this.svg.cx}, ${this.svg.cy})
                      scale(${this.transform.scale.x}, ${this.transform.scale.y})
                      "
           style="transform-origin:center; transform-box:fill-box;">
          <svg style="overflow:visible;">
            <g class="toolset__group" transform="translate(${this.svg.cx/this.transform.scale.x}, ${this.svg.cy/this.transform.scale.y})"
            style="${nt(this._card.themeIsDarkMode()?this.palette.dark:this.palette.light)}"
            >
              ${this.renderToolset()}
            </g>
            </svg>
        </g>
      `}}const rs=t=>{const e=Math.round(Math.min(Math.max(t,0),255)).toString(16);return 1===e.length?`0${e}`:e},ns=t=>`#${rs(t[0])}${rs(t[1])}${rs(t[2])}`,hs=t=>{const[e,s,i]=t,o=Math.max(e,s,i),a=o-Math.min(e,s,i),r=a&&(o===e?(s-i)/a:o===s?2+(i-e)/a:4+(e-s)/a);return[60*(r<0?r+6:r),o&&a/o,o]},ls=t=>{const[e,s,i]=t,o=t=>{const o=(t+e/60)%6;return i-i*s*Math.max(Math.min(o,4-o,1),0)};return[o(5),o(3),o(1)]},cs=t=>ls([t[0],t[1],255]),ds=(t,e,s)=>Math.min(Math.max(t,e),s),gs=t=>{if(t<=66)return 255;return ds(329.698727446*(t-60)**-.1332047592,0,255)},us=t=>{let e;return e=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*(t-60)**-.0755148492,ds(e,0,255)},ms=t=>{if(t>=66)return 255;if(t<=19)return 0;const e=138.5177312231*Math.log(t-10)-305.0447927307;return ds(e,0,255)},ps=t=>{const e=t/100;return[gs(e),us(e),ms(e)]},fs=(t,e)=>{const s=Math.max(...t),i=Math.max(...e);let o;return o=0===i?0:s/i,e.map((t=>Math.round(t*o)))},vs=t=>Math.floor(1e6/t),ys=(t,e,s)=>{const[i,o,a,r,n]=t,h=vs(e??2700),l=vs(s??6500),c=h-l;let d;try{d=n/(r+n)}catch(_){d=.5}const g=l+d*c,u=g?(m=g,Math.floor(1e6/m)):0;var m;const[p,f,v]=ps(u),y=Math.max(r,n)/255;return fs([i,o,a,r,n],[i+p*y,o+f*y,a+v*y])};console.info(`%c  SWISS-ARMY-KNIFE-CARD  \n%c      Version ${ut}      `,"color: yellow; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray");class _s extends at{constructor(){if(super(),this.connected=!1,Et.setElement(this),this.cardId=Math.random().toString(36).substr(2,9),this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.secondaryInfoStr=[],this.iconStr=[],this.viewBoxSize=ft,this.viewBox={width:ft,height:ft},this.toolsets=[],this.tools=[],this.styles={},this.styles.card={},this.styles.card.default={},this.styles.card.light={},this.styles.card.dark={},this.entityHistory={},this.entityHistory.needed=!1,this.stateChanged=!0,this.entityHistory.updating=!1,this.entityHistory.update_interval=300,this.dev={},this.dev.debug=!1,this.dev.performance=!1,this.dev.m3=!1,this.configIsSet=!1,this.theme={},this.theme.checked=!1,this.theme.isLoaded=!1,this.theme.modeChanged=!1,this.theme.darkMode=!1,this.theme.light={},this.theme.dark={},this.isSafari=!!window.navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),this.iOS=(/iPad|iPhone|iPod/.test(window.navigator.userAgent)||"MacIntel"===window.navigator.platform&&window.navigator.maxTouchPoints>1)&&!window.MSStream,this.isSafari14=this.isSafari&&/Version\/14\.[0-9]/.test(window.navigator.userAgent),this.isSafari15=this.isSafari&&/Version\/15\.[0-9]/.test(window.navigator.userAgent),this.isSafari16=this.isSafari&&/Version\/16\.[0-9]/.test(window.navigator.userAgent),this.isSafari16=this.isSafari&&/Version\/16\.[0-9]/.test(window.navigator.userAgent),this.isSafari14=this.isSafari14||/os 15.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.isSafari15=this.isSafari15||/os 14.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.isSafari16=this.isSafari16||/os 16.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.lovelace=_s.lovelace,!this.lovelace)throw console.error("card::constructor - Can't get Lovelace panel"),Error("card::constructor - Can't get Lovelace panel");_s.colorCache||(_s.colorCache=[]),this.palette={},this.palette.light={},this.palette.dark={},this.dev.debug&&console.log("*****Event - card - constructor",this.cardId,(new Date).getTime())}static getSystemStyles(){return it`
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

    `}static getUserStyles(){return this.userContent="",_s.lovelace.config.sak_user_templates&&_s.lovelace.config.sak_user_templates.definitions.user_css_definitions&&(this.userContent=_s.lovelace.config.sak_user_templates.definitions.user_css_definitions.reduce(((t,e)=>t+e.content),"")),it`${st(this.userContent)}`}static getSakStyles(){return this.sakContent="",_s.lovelace.config.sak_sys_templates&&_s.lovelace.config.sak_sys_templates.definitions.sak_css_definitions&&(this.sakContent=_s.lovelace.config.sak_sys_templates.definitions.sak_css_definitions.reduce(((t,e)=>t+e.content),"")),it`${st(this.sakContent)}`}static getSakSvgDefinitions(){_s.lovelace.sakSvgContent=null;let t="";_s.lovelace.config.sak_sys_templates&&_s.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions&&(t=_s.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions.reduce(((t,e)=>t+e.content),"")),_s.sakSvgContent=ct(t)}static getUserSvgDefinitions(){_s.lovelace.userSvgContent=null;let t="";_s.lovelace.config.sak_user_templates&&_s.lovelace.config.sak_user_templates.definitions.user_svg_definitions&&(t=_s.lovelace.config.sak_user_templates.definitions.user_svg_definitions.reduce(((t,e)=>t+e.content),"")),_s.userSvgContent=ct(t)}static get styles(){if(_s.lovelace||(_s.lovelace=bt.getLovelace()),!_s.lovelace)throw console.error("SAK - Can't get reference to Lovelace"),Error("card::get styles - Can't get Lovelace panel");if(!_s.lovelace.config.sak_sys_templates)throw console.error(ut," - SAK - System Templates reference NOT defined."),Error(ut," - card::get styles - System Templates reference NOT defined!");return _s.lovelace.config.sak_user_templates||console.warning(ut," - SAK - User Templates reference NOT defined. Did you NOT include them?"),_s.getSakSvgDefinitions(),_s.getUserSvgDefinitions(),it`
      ${_s.getSystemStyles()}
      ${_s.getSakStyles()}
      ${_s.getUserStyles()}
    `}set hass(t){if(this.counter||(this.counter=0),this.counter+=1,this.theme.modeChanged=t.themes.darkMode!==this.theme.darkMode,this.theme.modeChanged&&(this.theme.darkMode=t.themes.darkMode),!this.theme.checked){if(this.theme.checked=!0,this.config.theme&&t.themes.themes[this.config.theme]){const{themeLight:e,themeDark:s}=Et.processTheme(t.themes.themes[this.config.theme]);this.theme.light=e,this.theme.dark=s,this.theme.isLoaded=!0}this.styles.card.light={...this.styles.card.default,...this.theme.light,...this.palette.light},this.styles.card.dark={...this.styles.card.default,...this.theme.dark,...this.palette.dark}}if(this.dev.debug&&console.log("*****Event - card::set hass",this.cardId,(new Date).getTime()),this._hass=t,this.connected||this.dev.debug&&console.log("set hass but NOT connected",this.cardId),!this.config.entities)return;let e,s,i,o,a,r=!1,n=0,h=!1,l=!1,c=!1;for(e of this.config.entities){if(this.entities[n]=t.states[this.config.entities[n].entity],c=void 0===this.entities[n],c&&console.error("SAK - set hass, entity undefined: ",this.config.entities[n].entity),this.config.entities[n].secondary_info&&(h=!0,s=c?void 0:this.entities[n][this.config.entities[n].secondary_info],i=this._buildStateString(s,this.config.entities[n]),i!==this.secondaryInfoStr[n]&&(this.secondaryInfoStr[n]=i,r=!0)),this.config.entities[n].icon||(o=c?void 0:t.states[this.config.entities[n].entity].attributes.icon,o!==this.iconStr[n]&&(this.iconStr[n]=o,r=!0)),this.config.entities[n].attribute){let{attribute:t}=this.config.entities[n],e="",s="";const i=this.config.entities[n].attribute.indexOf("["),o=this.config.entities[n].attribute.indexOf(".");let h=0,c="";-1!==i?(t=this.config.entities[n].attribute.substr(0,i),e=this.config.entities[n].attribute.substr(i,this.config.entities[n].attribute.length-i),h=e[1],c=e.substr(4,e.length-4),s=this.entities[n].attributes[t][h][c]):-1!==o?(t=this.config.entities[n].attribute.substr(0,o),e=this.config.entities[n].attribute.substr(i,this.config.entities[n].attribute.length-i),c=e.substr(1,e.length-1),s=this.entities[n].attributes[t][c],console.log("set hass, attributes with map",this.config.entities[n].attribute,t,e)):s=this.entities[n].attributes[t],a=this._buildStateString(s,this.config.entities[n]),a!==this.attributesStr[n]&&(this.attributesStr[n]=a,r=!0),l=!0}l||h||(a=c?void 0:this._buildStateString(this.entities[n].state,this.config.entities[n]),a!==this.entitiesStr[n]&&(this.entitiesStr[n]=a,r=!0),this.dev.debug&&console.log("set hass - attrSet=false",this.cardId,`${(new Date).getSeconds().toString()}.${(new Date).getMilliseconds().toString()}`,a)),r||=l||h,n+=1,l=!1,h=!1}(r||this.theme.modeChanged)&&(this.toolsets&&this.toolsets.map((t=>(t.updateValues(),!0))),this.requestUpdate(),this.theme.modeChanged=!1,this.counter-=1)}setConfig(t){if(this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE card::setConfig`),this.dev.debug&&console.log("*****Event - setConfig",this.cardId,(new Date).getTime()),(t=JSON.parse(JSON.stringify(t))).dev&&(this.dev={...this.dev,...t.dev}),this.dev.debug&&console.log("setConfig",this.cardId),!t.layout)throw Error("card::setConfig - No layout defined");if(t.entities){if("sensor"!==Ot(t.entities[0].entity)&&t.entities[0].attribute&&!isNaN(t.entities[0].attribute))throw Error("card::setConfig - First entity or attribute must be a numbered sensorvalue, but is NOT")}const e=_t.mergeDeep(t);this.config=e,this.toolset=[];const s=this;function i(t,e){if(e?.template){const t=s.lovelace.config.sak_user_templates.templates[e.template.name];t||console.error("Template not found...",e.template,t);const i=wt.replaceVariables3(e.template.variables,t);return _t.mergeDeep(i)}return"template"===t?(console.log("findTemplate return key=template/value",t,void 0),e):e}const o=JSON.stringify(this.config,i);if(this.config.palette){this.config.palette=JSON.parse(o).palette;const{paletteLight:n,paletteDark:h}=Et.processPalette(this.config.palette);this.palette.light=n,this.palette.dark=h}const a=JSON.parse(o).layout.toolsets;if(this.config.layout.template&&(this.config.layout=JSON.parse(o).layout),this.config.layout.toolsets.map(((t,e)=>{let s=null;this.toolsets||(this.toolsets=[]);{let o=!1,r=[];s=a[e].tools,t.tools&&t.tools.map(((n,h)=>(a[e].tools.map(((r,l)=>(n.id===r.id&&(t.template&&(this.config.layout.toolsets[e].position&&(a[e].position=_t.mergeDeep(this.config.layout.toolsets[e].position)),s[l]=_t.mergeDeep(s[l],n),s[l]=JSON.parse(JSON.stringify(s[l],i)),o=!0),this.dev.debug&&console.log("card::setConfig - got toolsetCfg toolid",n,h,r,l,n)),a[e].tools[l]=wt.getJsTemplateOrValueConfig(a[e].tools[l],_t.mergeDeep(a[e].tools[l])),o))),o||(r=r.concat(t.tools[h])),o))),s=s.concat(r)}t=a[e];const o=new as(this,t);return this.toolsets.push(o),!0})),this.dev.m3&&(console.log("*** M3 - Checking for m3.yaml template to convert..."),this.lovelace.config.sak_user_templates.templates.m3)){const{m3:l}=this.lovelace.config.sak_user_templates.templates;console.log("*** M3 - Found. Material 3 conversion starting...");let c="",d="",g="",u="",m="",p="",f="",v="",y="",_="";const b={},w={},x={};l.entities.map((t=>(["ref.palette","sys.color","sys.color.light","sys.color.dark"].includes(t.category_id)&&(t.tags.includes("alias")||(b[t.id]={value:t.value,tags:t.tags})),"ref.palette"===t.category_id&&(c+=`${t.id}: '${t.value}'\n`,"md.ref.palette.primary40"===t.id&&(p=t.value),"md.ref.palette.primary80"===t.id&&(y=t.value),"md.ref.palette.neutral40"===t.id&&(f=t.value),"md.ref.palette.neutral80"===t.id&&(_=t.value)),"sys.color"===t.category_id&&(d+=`${t.id}: '${t.value}'\n`),"sys.color.light"===t.category_id&&(g+=`${t.id}: '${t.value}'\n`,"md.sys.color.surface.light"===t.id&&(m=t.value)),"sys.color.dark"===t.category_id&&(u+=`${t.id}: '${t.value}'\n`,"md.sys.color.surface.dark"===t.id&&(v=t.value)),!0))),["primary","secondary","tertiary","error","neutral","neutral-variant"].forEach((t=>{[5,15,25,35,45,65,75,85].forEach((e=>{b[`md.ref.palette.${t}${e.toString()}`]={value:Et.getGradientValue(b[`md.ref.palette.${t}${(e-5).toString()}`].value,b[`md.ref.palette.${t}${(e+5).toString()}`].value,.5),tags:[...b[`md.ref.palette.${t}${(e-5).toString()}`].tags]},b[`md.ref.palette.${t}${e.toString()}`].tags[3]=t+e.toString()})),b[`md.ref.palette.${t}7`]={value:Et.getGradientValue(b[`md.ref.palette.${t}5`].value,b[`md.ref.palette.${t}10`].value,.5),tags:[...b[`md.ref.palette.${t}10`].tags]},b[`md.ref.palette.${t}7`].tags[3]=`${t}7`,b[`md.ref.palette.${t}92`]={value:Et.getGradientValue(b[`md.ref.palette.${t}90`].value,b[`md.ref.palette.${t}95`].value,.5),tags:[...b[`md.ref.palette.${t}90`].tags]},b[`md.ref.palette.${t}92`].tags[3]=`${t}92`,b[`md.ref.palette.${t}97`]={value:Et.getGradientValue(b[`md.ref.palette.${t}95`].value,b[`md.ref.palette.${t}99`].value,.5),tags:[...b[`md.ref.palette.${t}90`].tags]},b[`md.ref.palette.${t}97`].tags[3]=`${t}97`}));for(const[Y,J]of Object.entries(b))w[Y]=`theme-${J.tags[1]}-${J.tags[2]}-${J.tags[3]}: rgb(${$(J.value)})`,x[Y]=`theme-${J.tags[1]}-${J.tags[2]}-${J.tags[3]}-rgb: ${$(J.value)}`;function $(t){const e={};e.r=Math.round(parseInt(t.substr(1,2),16)),e.g=Math.round(parseInt(t.substr(3,2),16)),e.b=Math.round(parseInt(t.substr(5,2),16));return`${e.r},${e.g},${e.b}`}function S(t,e,s,i,o){const a={},r={};a.r=Math.round(parseInt(t.substr(1,2),16)),a.g=Math.round(parseInt(t.substr(3,2),16)),a.b=Math.round(parseInt(t.substr(5,2),16)),r.r=Math.round(parseInt(e.substr(1,2),16)),r.g=Math.round(parseInt(e.substr(3,2),16)),r.b=Math.round(parseInt(e.substr(5,2),16));let n,h,l,c="";return s.forEach(((t,e)=>{n=Math.round(t*r.r+(1-t)*a.r),h=Math.round(t*r.g+(1-t)*a.g),l=Math.round(t*r.b+(1-t)*a.b),c+=`${i+(e+1).toString()}-${o}: rgb(${n},${h},${l})\n`,c+=`${i+(e+1).toString()}-${o}-rgb: ${n},${h},${l}\n`})),c}const k=[.03,.05,.08,.11,.15,.19,.24,.29,.35,.4],E=[.05,.08,.11,.15,.19,.24,.29,.35,.4,.45],T=S(m,f,k,"  theme-ref-elevation-surface-neutral","light"),C=b["md.ref.palette.neutral-variant40"].value,M=S(m,C,k,"  theme-ref-elevation-surface-neutral-variant","light"),I=S(m,p,k,"  theme-ref-elevation-surface-primary","light"),A=b["md.ref.palette.secondary40"].value,V=S(m,A,k,"  theme-ref-elevation-surface-secondary","light"),N=b["md.ref.palette.tertiary40"].value,D=S(m,N,k,"  theme-ref-elevation-surface-tertiary","light"),P=b["md.ref.palette.error40"].value,O=S(m,P,k,"  theme-ref-elevation-surface-error","light"),R=S(v,_,E,"  theme-ref-elevation-surface-neutral","dark"),L=b["md.ref.palette.neutral-variant80"].value,F=S(v,L,E,"  theme-ref-elevation-surface-neutral-variant","dark"),z=S(v,y,E,"  theme-ref-elevation-surface-primary","dark"),B=b["md.ref.palette.secondary80"].value,U=S(v,B,E,"  theme-ref-elevation-surface-secondary","dark"),j=b["md.ref.palette.tertiary80"].value,G=S(v,j,E,"  theme-ref-elevation-surface-tertiary","dark"),H=b["md.ref.palette.error80"].value,q=S(v,H,E,"  theme-ref-elevation-surface-error","dark");let W="";for(const[X,Z]of Object.entries(w))"theme-ref"===Z.substring(0,9)&&(W+=`  ${Z}\n`,W+=`  ${x[X]}\n`);console.log(T+M+I+V+D+O+R+F+z+U+G+q+W),console.log("*** M3 - Material 3 conversion DONE. You should copy the above output...")}this.aspectratio=(this.config.layout.aspectratio||this.config.aspectratio||"1/1").trim();const r=this.aspectratio.split("/");this.viewBox||(this.viewBox={}),this.viewBox.width=r[0]*mt,this.viewBox.height=r[1]*mt,this.config.layout.styles?.card&&(this.styles.card.default=this.config.layout.styles.card),this.dev.debug&&console.log("Step 5: toolconfig, list of toolsets",this.toolsets),this.dev.debug&&console.log("debug - setConfig",this.cardId,this.config),this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE card::setConfig`),this.configIsSet=!0}connectedCallback(){this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE card::connectedCallback`),this.dev.debug&&console.log("*****Event - connectedCallback",this.cardId,(new Date).getTime()),this.connected=!0,super.connectedCallback(),this.entityHistory.update_interval&&(this.updateOnInterval(),clearInterval(this.interval),this.interval=setInterval((()=>this.updateOnInterval()),this._hass?1e3*this.entityHistory.update_interval:1e3)),this.dev.debug&&console.log("ConnectedCallback",this.cardId),this.requestUpdate(),this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE card::connectedCallback`)}disconnectedCallback(){this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE card::disconnectedCallback`),this.dev.debug&&console.log("*****Event - disconnectedCallback",this.cardId,(new Date).getTime()),this.interval&&(clearInterval(this.interval),this.interval=0),super.disconnectedCallback(),this.dev.debug&&console.log("disconnectedCallback",this.cardId),this.connected=!1,this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE card::disconnectedCallback`)}firstUpdated(t){this.dev.debug&&console.log("*****Event - card::firstUpdated",this.cardId,(new Date).getTime()),this.toolsets&&this.toolsets.map((async e=>(e.firstUpdated(t),!0)))}updated(t){this.dev.debug&&console.log("*****Event - Updated",this.cardId,(new Date).getTime()),this.toolsets&&this.toolsets.map((async e=>(e.updated(t),!0)))}render(){if(this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE card::render`),this.dev.debug&&console.log("*****Event - render",this.cardId,(new Date).getTime()),!this.connected)return void(this.dev.debug&&console.log("render but NOT connected",this.cardId,(new Date).getTime()));let t;try{t=this.config.disable_card?z`
                  <div class="container" id="container">
                    ${this._renderSvg()}
                  </div>
                  `:z`
                  <ha-card style="${nt(this.styles.card.default)}">
                    <div class="container" id="container" 
                    >
                      ${this._renderSvg()}
                    </div>
                  </ha-card>
                  `}catch(e){console.error(e)}return this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE card::render`),t}_renderSakSvgDefinitions(){return B`
    ${_s.sakSvgContent}
    `}_renderUserSvgDefinitions(){return B`
    ${_s.userSvgContent}
    `}themeIsDarkMode(){return!0===this.theme.darkMode}themeIsLightMode(){return!1===this.theme.darkMode}_RenderToolsets(){return this.dev.debug&&console.log("all the tools in renderTools",this.tools),B`
              <g id="toolsets" class="toolsets__group"
              >
                ${this.toolsets.map((t=>t.render()))}
              </g>

            <defs>
              ${this._renderSakSvgDefinitions()}
              ${this._renderUserSvgDefinitions()}
            </defs>
    `}_renderCardAttributes(){let t;const e=[];this._attributes="";for(let s=0;s<this.entities.length;s++)t=this.attributesStr[s]?this.attributesStr[s]:this.secondaryInfoStr[s]?this.secondaryInfoStr[s]:this.entitiesStr[s],e.push(t);return this._attributes=e,e}_renderSvg(){const t=this.config.card_filter?this.config.card_filter:"card--filter-none",e=[];this._renderCardAttributes();const s=this._RenderToolsets();return e.push(B`
      <svg id="rootsvg" xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
       class="${t}"
       style="${nt(this.themeIsDarkMode()?this.styles.card.dark:this.styles.card.light)}"
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
        <g style="${nt(this.config.layout?.styles?.toolsets)}">
          ${s}
        </g>
      </svg>`),B`${e}`}_buildUom(t,e,s){return t?.unit||s?.unit||e?.attributes.unit_of_measurement||""}toLocale(t,e="unknown"){const s=this._hass.selectedLanguage||this._hass.language,i=this._hass.resources[s];return i&&i[t]?i[t]:e}_buildStateString(t,e){if(void 0===t)return t;if(e.convert){let s,i,o=e.convert.match(/(^\w+)\((\d+)\)/);switch(null===o?s=e.convert:3===o.length&&(s=o[1],i=Number(o[2])),s){case"brightness_pct":t="undefined"===t?"undefined":`${Math.round(t/255*100)}`;break;case"multiply":t=`${Math.round(t*i)}`;break;case"divide":t=`${Math.round(t/i)}`;break;case"rgb_csv":case"rgb_hex":if(e.attribute){let i=this._hass.states[e.entity];switch(i.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(i.attributes.color_temp_kelvin){let e=ps(i.attributes.color_temp_kelvin);const o=hs(e);o[1]<.4&&(o[1]<.1?o[2]=225:o[1]=.4),e=ls(o),e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ns(e)}else t="rgb_csv"===s?"255,255,255":"#ffffff00";break;case"hs":{let e=cs([i.attributes.hs_color[0],i.attributes.hs_color[1]/100]);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ns(e)}break;case"rgb":{const e=hs(this.stateObj.attributes.rgb_color);e[1]<.4&&(e[1]<.1?e[2]=225:e[1]=.4);const i=ls(e);t="rgb_csv"===s?i.toString():ns(i)}break;case"rgbw":{let e=(t=>{const[e,s,i,o]=t;return fs([e,s,i,o],[e+o,s+o,i+o])})(i.attributes.rgbw_color);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ns(e)}break;case"rgbww":{let e=ys(i.attributes.rgbww_color,i.attributes?.min_color_temp_kelvin,i.attributes?.max_color_temp_kelvin);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ns(e)}break;case"xy":if(i.attributes.hs_color){let e=cs([i.attributes.hs_color[0],i.attributes.hs_color[1]/100]);const o=hs(e);o[1]<.4&&(o[1]<.1?o[2]=225:o[1]=.4),e=ls(o),e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ns(e)}else if(i.attributes.color){let e={};e.l=i.attributes.brightness,e.h=i.attributes.color.h||i.attributes.color.hue,e.s=i.attributes.color.s||i.attributes.color.saturation;let{r:o,g:a,b:r}=Et.hslToRgb(e);if("rgb_csv"===s)t=`${o},${a},${r}`;else{t=`#${Et.padZero(o.toString(16))}${Et.padZero(a.toString(16))}${Et.padZero(r.toString(16))}`}}else i.attributes.xy_color}}break;default:console.error(`Unknown converter [${s}] specified for entity [${e.entity}]!`)}}return void 0!==t?Number.isNaN(t)?t:t.toString():void 0}_computeEntity(t){return t.substr(t.indexOf(".")+1)}updateOnInterval(){this._hass?(this.updateData(),this.entityHistory.needed?(window.clearInterval(this.interval),this.interval=setInterval((()=>this.updateOnInterval()),1e3*this.entityHistory.update_interval)):this.interval&&(window.clearInterval(this.interval),this.interval=0)):this.dev.debug&&console.log("UpdateOnInterval - NO hass, returning")}async fetchRecent(t,e,s,i){let o="history/period";return e&&(o+=`/${e.toISOString()}`),o+=`?filter_entity_id=${t}`,s&&(o+=`&end_time=${s.toISOString()}`),i&&(o+="&skip_initial_state"),o+="&minimal_response",this._hass.callApi("GET",o)}async updateData(){this.entityHistory.updating=!0,this.dev.debug&&console.log("card::updateData - ENTRY",this.cardId);const t=[];let e=0;this.toolsets.map(((s,i)=>(s.tools.map(((s,o)=>{if("bar"===s.type||"graph"===s.type){const a=new Date,r=new Date;r.setHours(a.getHours()-s.tool.config.hours);const n=this.config.entities[s.tool.config.entity_index].attribute?this.config.entities[s.tool.config.entity_index].attribute:null;t[e]={tsidx:i,entityIndex:s.tool.config.entity_index,entityId:this.entities[s.tool.config.entity_index].entity_id,attrId:n,start:r,end:a,type:s.type,idx:o},e+=1}return!0})),!0))),this.dev.debug&&console.log("card::updateData - LENGTH",this.cardId,t.length,t),this.stateChanged=!1,this.dev.debug&&console.log("card::updateData, entityList from tools",t);try{const e=t.map(((t,e)=>this.updateEntity(t,e,t.start,t.end)));await Promise.all(e)}finally{this.entityHistory.updating=!1}this.entityHistory.updating=!1}async updateEntity(t,e,s,i){let o=[];const a=s;let r,n=await this.fetchRecent(t.entityId,a,i,!1);n[0]&&n[0].length>0&&(t.attrId&&(r=this.entities[t.entityIndex].attributes[this.config.entities[t.entityIndex].attribute],t.state=r),n=n[0].filter((e=>t.attrId?!isNaN(parseFloat(e.attributes[t.attrId])):!isNaN(parseFloat(e.state)))),n=n.map((e=>({last_changed:e.last_changed,state:t.attrId?Number(e.attributes[t.attrId]):Number(e.state)})))),o=[...o,...n],"graph"===t.type&&(this.toolsets[t.tsidx].tools[t.idx].tool.series=[...o]),this.uppdate(t,o)}uppdate(t,e){if(!e)return;const s=(new Date).getTime();let i=24,o=2;"bar"!==t.type&&"graph"!==t.type||(this.dev.debug&&console.log("entity.type == bar",t),i=this.toolsets[t.tsidx].tools[t.idx].tool.config.hours,o=this.toolsets[t.tsidx].tools[t.idx].tool.config.barhours);const a=e.reduce(((t,e)=>((t,e)=>{const a=(s-new Date(e.last_changed).getTime())/36e5/o-i/o,r=Math.floor(Math.abs(a));return t[r]||(t[r]=[]),t[r].push(e),t})(t,e)),[]);if(a.length=Math.ceil(i/o),0===Object.keys(a).length)return;const r=Object.keys(a)[0];"0"!==r&&(a[0]=[],a[0].push(a[r][0]));for(let h=0;h<i/o;h++)a[h]||(a[h]=[],a[h].push(a[h-1][a[h-1].length-1]));this.coords=a;let n=[];n=[],n=a.map((t=>{return s="state",(e=t).reduce(((t,e)=>t+Number(e[s])),0)/e.length;var e,s})),["bar"].includes(t.type)&&(this.toolsets[t.tsidx].tools[t.idx].tool.series=[...n]),this.requestUpdate()}getCardSize(){return 4}}customElements.define("swiss-army-knife-card",_s);
