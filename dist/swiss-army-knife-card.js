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
const t="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,e=(t,e,s=null,i=null)=>{for(;e!==s;){const s=e.nextSibling;t.insertBefore(e,i),e=s}},s=(t,e,s=null)=>{for(;e!==s;){const s=e.nextSibling;t.removeChild(e),e=s}},i=`{{lit-${String(Math.random()).slice(2)}}}`,a=`\x3c!--${i}--\x3e`,o=new RegExp(`${i}|${a}`),r="$lit$";class n{constructor(t,e){this.parts=[],this.element=e;const s=[],a=[],n=document.createTreeWalker(e.content,133,null,!1);let l=0,g=-1,u=0;const{strings:m,values:{length:p}}=t;for(;u<p;){const t=n.nextNode();if(null!==t){if(g++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:s}=e;let i=0;for(let t=0;t<s;t++)h(e[t].name,r)&&i++;for(;i-- >0;){const e=m[u],s=d.exec(e)[2],i=s.toLowerCase()+r,a=t.getAttribute(i);t.removeAttribute(i);const n=a.split(o);this.parts.push({type:"attribute",index:g,name:s,strings:n}),u+=n.length-1}}"TEMPLATE"===t.tagName&&(a.push(t),n.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(i)>=0){const i=t.parentNode,a=e.split(o),n=a.length-1;for(let e=0;e<n;e++){let s,o=a[e];if(""===o)s=c();else{const t=d.exec(o);null!==t&&h(t[2],r)&&(o=o.slice(0,t.index)+t[1]+t[2].slice(0,-5)+t[3]),s=document.createTextNode(o)}i.insertBefore(s,t),this.parts.push({type:"node",index:++g})}""===a[n]?(i.insertBefore(c(),t),s.push(t)):t.data=a[n],u+=n}}else if(8===t.nodeType)if(t.data===i){const e=t.parentNode;null!==t.previousSibling&&g!==l||(g++,e.insertBefore(c(),t)),l=g,this.parts.push({type:"node",index:g}),null===t.nextSibling?t.data="":(s.push(t),g--),u++}else{let e=-1;for(;-1!==(e=t.data.indexOf(i,e+1));)this.parts.push({type:"node",index:-1}),u++}}else n.currentNode=a.pop()}for(const i of s)i.parentNode.removeChild(i)}}const h=(t,e)=>{const s=t.length-e.length;return s>=0&&t.slice(s)===e},l=t=>-1!==t.index,c=()=>document.createComment(""),d=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function g(t,e){const{element:{content:s},parts:i}=t,a=document.createTreeWalker(s,133,null,!1);let o=m(i),r=i[o],n=-1,h=0;const l=[];let c=null;for(;a.nextNode();){n++;const t=a.currentNode;for(t.previousSibling===c&&(c=null),e.has(t)&&(l.push(t),null===c&&(c=t)),null!==c&&h++;void 0!==r&&r.index===n;)r.index=null!==c?-1:r.index-h,o=m(i,o),r=i[o]}l.forEach((t=>t.parentNode.removeChild(t)))}const u=t=>{let e=11===t.nodeType?0:1;const s=document.createTreeWalker(t,133,null,!1);for(;s.nextNode();)e++;return e},m=(t,e=-1)=>{for(let s=e+1;s<t.length;s++){const e=t[s];if(l(e))return s}return-1};
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
const p=new WeakMap,f=t=>(...e)=>{const s=t(...e);return p.set(s,!0),s},v=t=>"function"==typeof t&&p.has(t),_={},y={};
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
class b{constructor(t,e,s){this.__parts=[],this.template=t,this.processor=e,this.options=s}update(t){let e=0;for(const s of this.__parts)void 0!==s&&s.setValue(t[e]),e++;for(const s of this.__parts)void 0!==s&&s.commit()}_clone(){const e=t?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),s=[],i=this.template.parts,a=document.createTreeWalker(e,133,null,!1);let o,r=0,n=0,h=a.nextNode();for(;r<i.length;)if(o=i[r],l(o)){for(;n<o.index;)n++,"TEMPLATE"===h.nodeName&&(s.push(h),a.currentNode=h.content),null===(h=a.nextNode())&&(a.currentNode=s.pop(),h=a.nextNode());if("node"===o.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(h.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(h,o.name,o.strings,this.options));r++}else this.__parts.push(void 0),r++;return t&&(document.adoptNode(e),customElements.upgrade(e)),e}}
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
 */const w=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:t=>t}),x=` ${i} `;class ${constructor(t,e,s,i){this.strings=t,this.values=e,this.type=s,this.processor=i}getHTML(){const t=this.strings.length-1;let e="",s=!1;for(let o=0;o<t;o++){const t=this.strings[o],n=t.lastIndexOf("\x3c!--");s=(n>-1||s)&&-1===t.indexOf("--\x3e",n+1);const h=d.exec(t);e+=null===h?t+(s?x:a):t.substr(0,h.index)+h[1]+h[2]+r+h[3]+i}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");let e=this.getHTML();return void 0!==w&&(e=w.createHTML(e)),t.innerHTML=e,t}}class k extends ${getHTML(){return`<svg>${super.getHTML()}</svg>`}getTemplateElement(){const t=super.getTemplateElement(),s=t.content,i=s.firstChild;return s.removeChild(i),e(s,i.firstChild),t}}
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
 */const S=t=>null===t||!("object"==typeof t||"function"==typeof t),M=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class A{constructor(t,e,s){this.dirty=!0,this.element=t,this.name=e,this.strings=s,this.parts=[];for(let i=0;i<s.length-1;i++)this.parts[i]=this._createPart()}_createPart(){return new C(this)}_getValue(){const t=this.strings,e=t.length-1,s=this.parts;if(1===e&&""===t[0]&&""===t[1]){const t=s[0].value;if("symbol"==typeof t)return String(t);if("string"==typeof t||!M(t))return t}let i="";for(let a=0;a<e;a++){i+=t[a];const e=s[a];if(void 0!==e){const t=e.value;if(S(t)||!M(t))i+="string"==typeof t?t:String(t);else for(const e of t)i+="string"==typeof e?e:String(e)}}return i+=t[e],i}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class C{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===_||S(t)&&t===this.value||(this.value=t,v(t)||(this.committer.dirty=!0))}commit(){for(;v(this.value);){const t=this.value;this.value=_,t(this)}this.value!==_&&this.committer.commit()}}class E{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(c()),this.endNode=t.appendChild(c())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=c()),t.__insert(this.endNode=c())}insertAfterPart(t){t.__insert(this.startNode=c()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(null===this.startNode.parentNode)return;for(;v(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=_,t(this)}const t=this.__pendingValue;t!==_&&(S(t)?t!==this.value&&this.__commitText(t):t instanceof $?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):M(t)?this.__commitIterable(t):t===y?(this.value=y,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,s="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=s:this.__commitNode(document.createTextNode(s)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof b&&this.value.template===e)this.value.update(t.values);else{const s=new b(e,t.processor,this.options),i=s._clone();s.update(t.values),this.__commitNode(i),this.value=s}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let s,i=0;for(const a of t)s=e[i],void 0===s&&(s=new E(this.options),e.push(s),0===i?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(a),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){s(this.startNode.parentNode,t.nextSibling,this.endNode)}}class T{constructor(t,e,s){if(this.value=void 0,this.__pendingValue=void 0,2!==s.length||""!==s[0]||""!==s[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=s}setValue(t){this.__pendingValue=t}commit(){for(;v(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=_,t(this)}if(this.__pendingValue===_)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=_}}class I extends A{constructor(t,e,s){super(t,e,s),this.single=2===s.length&&""===s[0]&&""===s[1]}_createPart(){return new N(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class N extends C{}let D=!1;(()=>{try{const t={get capture(){return D=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}})();class V{constructor(t,e,s){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=s,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;v(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=_,t(this)}if(this.__pendingValue===_)return;const t=this.__pendingValue,e=this.value,s=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),i=null!=t&&(null==e||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),i&&(this.__options=P(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=_}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const P=t=>t&&(D?{capture:t.capture,passive:t.passive,once:t.once}:t.capture)
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
 */;function R(t){let e=L.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},L.set(t.type,e));let s=e.stringsArray.get(t.strings);if(void 0!==s)return s;const a=t.strings.join(i);return s=e.keyString.get(a),void 0===s&&(s=new n(t,t.getTemplateElement()),e.keyString.set(a,s)),e.stringsArray.set(t.strings,s),s}const L=new Map,O=new WeakMap;
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
 */const B=new
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
class{handleAttributeExpressions(t,e,s,i){const a=e[0];if("."===a){return new I(t,e.slice(1),s).parts}if("@"===a)return[new V(t,e.slice(1),i.eventContext)];if("?"===a)return[new T(t,e.slice(1),s)];return new A(t,e,s).parts}handleTextExpression(t){return new E(t)}};
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
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");const z=(t,...e)=>new $(t,e,"html",B),F=(t,...e)=>new k(t,e,"svg",B)
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
 */,G=(t,e)=>`${t}--${e}`;let U=!0;void 0===window.ShadyCSS?U=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),U=!1);const q=t=>e=>{const s=G(e.type,t);let a=L.get(s);void 0===a&&(a={stringsArray:new WeakMap,keyString:new Map},L.set(s,a));let o=a.stringsArray.get(e.strings);if(void 0!==o)return o;const r=e.strings.join(i);if(o=a.keyString.get(r),void 0===o){const s=e.getTemplateElement();U&&window.ShadyCSS.prepareTemplateDom(s,t),o=new n(e,s),a.keyString.set(r,o)}return a.stringsArray.set(e.strings,o),o},j=["html","svg"],H=new Set,W=(t,e,s)=>{H.add(t);const i=s?s.element:document.createElement("template"),a=e.querySelectorAll("style"),{length:o}=a;if(0===o)return void window.ShadyCSS.prepareTemplateStyles(i,t);const r=document.createElement("style");for(let l=0;l<o;l++){const t=a[l];t.parentNode.removeChild(t),r.textContent+=t.textContent}(t=>{j.forEach((e=>{const s=L.get(G(e,t));void 0!==s&&s.keyString.forEach((t=>{const{element:{content:e}}=t,s=new Set;Array.from(e.querySelectorAll("style")).forEach((t=>{s.add(t)})),g(t,s)}))}))})(t);const n=i.content;s?function(t,e,s=null){const{element:{content:i},parts:a}=t;if(null==s)return void i.appendChild(e);const o=document.createTreeWalker(i,133,null,!1);let r=m(a),n=0,h=-1;for(;o.nextNode();)for(h++,o.currentNode===s&&(n=u(e),s.parentNode.insertBefore(e,s));-1!==r&&a[r].index===h;){if(n>0){for(;-1!==r;)a[r].index+=n,r=m(a,r);return}r=m(a,r)}}(s,r,n.firstChild):n.insertBefore(r,n.firstChild),window.ShadyCSS.prepareTemplateStyles(i,t);const h=n.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==h)e.insertBefore(h.cloneNode(!0),e.firstChild);else if(s){n.insertBefore(r,n.firstChild);const t=new Set;t.add(r),g(s,t)}};window.JSCompiler_renameProperty=(t,e)=>t;const Y={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},J=(t,e)=>e!==t&&(e==e||t==t),X={attribute:!0,type:String,converter:Y,reflect:!1,hasChanged:J},Z="finalized";class K extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach(((e,s)=>{const i=this._attributeNameForProperty(s,e);void 0!==i&&(this._attributeToPropertyMap.set(i,s),t.push(i))})),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach(((t,e)=>this._classProperties.set(e,t)))}}static createProperty(t,e=X){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const s="symbol"==typeof t?Symbol():`__${t}`,i=this.getPropertyDescriptor(t,s,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}static getPropertyDescriptor(t,e,s){return{get(){return this[e]},set(i){const a=this[t];this[e]=i,this.requestUpdateInternal(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||X}static finalize(){const t=Object.getPrototypeOf(this);if(t.hasOwnProperty(Z)||t.finalize(),this[Z]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const s of e)this.createProperty(s,t[s])}}static _attributeNameForProperty(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,s=J){return s(t,e)}static _propertyValueFromAttribute(t,e){const s=e.type,i=e.converter||Y,a="function"==typeof i?i:i.fromAttribute;return a?a(t,s):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const s=e.type,i=e.converter;return(i&&i.toAttribute||Y.toAttribute)(t,s)}initialize(){this._updateState=0,this._updatePromise=new Promise((t=>this._enableUpdatingResolver=t)),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach(((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}}))}_applyInstanceProperties(){this._instanceProperties.forEach(((t,e)=>this[e]=t)),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,s){e!==s&&this._attributeToProperty(t,s)}_propertyToAttribute(t,e,s=X){const i=this.constructor,a=i._attributeNameForProperty(t,s);if(void 0!==a){const t=i._propertyValueToAttribute(e,s);if(void 0===t)return;this._updateState=8|this._updateState,null==t?this.removeAttribute(a):this.setAttribute(a,t),this._updateState=-9&this._updateState}}_attributeToProperty(t,e){if(8&this._updateState)return;const s=this.constructor,i=s._attributeToPropertyMap.get(t);if(void 0!==i){const t=s.getPropertyOptions(i);this._updateState=16|this._updateState,this[i]=s._propertyValueFromAttribute(e,t),this._updateState=-17&this._updateState}}requestUpdateInternal(t,e,s){let i=!0;if(void 0!==t){const a=this.constructor;s=s||a.getPropertyOptions(t),a._valueHasChanged(this[t],e,s.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==s.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,s))):i=!1}!this._hasRequestedUpdate&&i&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(e){}const t=this.performUpdate();return null!=t&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(s){throw t=!1,this._markUpdated(),s}t&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach(((t,e)=>this._propertyToAttribute(e,this[e],t))),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}}K[Z]=!0;
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
(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");const at={};class ot extends K{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const t=this.getStyles();if(Array.isArray(t)){const e=(t,s)=>t.reduceRight(((t,s)=>Array.isArray(s)?e(s,t):(t.add(s),t)),s),s=e(t,new Set),i=[];s.forEach((t=>i.unshift(t))),this._styles=i}else this._styles=void 0===t?[]:[t];this._styles=this._styles.map((t=>{if(t instanceof CSSStyleSheet&&!Q){const e=Array.prototype.slice.call(t.cssRules).reduce(((t,e)=>t+e.cssText),"");return st(e)}return t}))}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?Q?this.renderRoot.adoptedStyleSheets=t.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map((t=>t.cssText)),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){const e=this.render();super.update(t),e!==at&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach((t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)})))}render(){return at}}ot.finalized=!0,ot.render=(t,e,i)=>{if(!i||"object"!=typeof i||!i.scopeName)throw new Error("The `scopeName` option is required.");const a=i.scopeName,o=O.has(e),r=U&&11===e.nodeType&&!!e.host,n=r&&!H.has(a),h=n?document.createDocumentFragment():e;if(((t,e,i)=>{let a=O.get(e);void 0===a&&(s(e,e.firstChild),O.set(e,a=new E(Object.assign({templateFactory:R},i))),a.appendInto(e)),a.setValue(t),a.commit()})(t,h,Object.assign({templateFactory:q(a)},i)),n){const t=O.get(h);O.delete(h);const i=t.value instanceof b?t.value.template:void 0;W(a,h,i),s(e,e.firstChild),e.appendChild(h),O.set(e,t)}!o&&r&&window.ShadyCSS.styleElement(e.host)},ot.shadowRootOptions={mode:"open"};
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
const rt=new WeakMap,nt=f((t=>e=>{if(!(e instanceof C)||e instanceof N||"style"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `styleMap` directive must be used in the style attribute and must be the only part in the attribute.");const{committer:s}=e,{style:i}=s.element;let a=rt.get(e);void 0===a&&(i.cssText=s.strings.join(" "),rt.set(e,a=new Set)),a.forEach((e=>{e in t||(a.delete(e),-1===e.indexOf("-")?i[e]=null:i.removeProperty(e))}));for(const o in t)a.add(o),-1===o.indexOf("-")?i[o]=t[o]:i.setProperty(o,t[o])})),ht=new WeakMap,lt=window.navigator.userAgent.indexOf("Trident/")>0,ct=f((t=>s=>{if(!(s instanceof E))throw new Error("unsafeSVG can only be used in text bindings");const i=ht.get(s);if(void 0!==i&&S(t)&&t===i.value&&s.value===i.fragment)return;const a=document.createElement("template"),o=a.content;let r;lt?(a.innerHTML=`<svg>${t}</svg>`,r=o.firstChild):(r=document.createElementNS("http://www.w3.org/2000/svg","svg"),o.appendChild(r),r.innerHTML=t),o.removeChild(r),e(o,r.firstChild);const n=document.importNode(o,!0);s.setValue(n),ht.set(s,{value:t,fragment:n})})),dt=new WeakMap,gt=f((t=>e=>{const s=dt.get(e);if(void 0===t&&e instanceof C){if(void 0!==s||!dt.has(e)){const t=e.committer.name;e.committer.element.removeAttribute(t)}}else t!==s&&e.setValue(t);dt.set(e,t)}));var ut="2.5.1";const mt=400,pt=200,ft=mt,vt=(t,e,s)=>t<0||s<0?e+360:e,_t=(t,e)=>Math.abs(t-e);class yt{static mergeDeep(...t){const e=t=>t&&"object"==typeof t;return t.reduce(((t,s)=>(Object.keys(s).forEach((i=>{const a=t[i],o=s[i];Array.isArray(a)&&Array.isArray(o)?t[i]=a.concat(...o):e(a)&&e(o)?t[i]=this.mergeDeep(a,o):t[i]=o})),t)),{})}}class bt{static calculateValueBetween(t,e,s){return isNaN(s)?0:s?(Math.min(Math.max(s,t),e)-t)/(e-t):0}static calculateSvgCoordinate(t,e){return t/100*mt+(e-pt)}static calculateSvgDimension(t){return t/100*mt}static getLovelace(){let t=window.document.querySelector("home-assistant");if(t=t&&t.shadowRoot,t=t&&t.querySelector("home-assistant-main"),t=t&&t.shadowRoot,t=t&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),t=t&&t.shadowRoot||t,t=t&&t.querySelector("ha-panel-lovelace"),t=t&&t.shadowRoot,t=t&&t.querySelector("hui-root"),t){const e=t.lovelace;return e.current_view=t.___curView,e}return null}}class wt{static replaceVariables3(t,e){if(!t&&!e.template.defaults)return e[e.template.type];let s=t?.slice(0)??[];e.template.defaults&&(s=s.concat(e.template.defaults));let i=JSON.stringify(e[e.template.type]);return s.forEach((t=>{const e=Object.keys(t)[0],s=Object.values(t)[0];if("number"==typeof s||"boolean"==typeof s){const t=new RegExp(`"\\[\\[${e}\\]\\]"`,"gm");i=i.replace(t,s)}if("object"==typeof s){const t=new RegExp(`"\\[\\[${e}\\]\\]"`,"gm"),a=JSON.stringify(s);i=i.replace(t,a)}else{const t=new RegExp(`\\[\\[${e}\\]\\]`,"gm");i=i.replace(t,s)}})),JSON.parse(i)}static getJsTemplateOrValueConfig(t,e,s){if(!s)return s;if(["number","boolean","bigint","symbol"].includes(typeof s))return s;if("object"==typeof s)return Object.keys(s).forEach((i=>{s[i]=wt.getJsTemplateOrValueConfig(t,e,s[i])})),s;const i=s.trim();return"[[[["===i.substring(0,4)&&"]]]]"===i.slice(-4)?wt.evaluateJsTemplateConfig(t,e,i.slice(4,-4)):s}static evaluateJsTemplateConfig(t,e,s){try{return new Function("tool_config","entities_config",`'use strict'; ${s}`).call(this,t,e)}catch(i){throw i.name="Sak-evaluateJsTemplateConfig-Error",i}}static evaluateJsTemplate(t,e,s){try{return new Function("state","states","entity","user","hass","tool_config","entity_config",`'use strict'; ${s}`).call(this,e,t._card._hass.states,t.config.hasOwnProperty("entity_index")?t._card.entities[t.config.entity_index]:void 0,t._card._hass.user,t._card._hass,t.config,t.config.hasOwnProperty("entity_index")?t._card.config.entities[t.config.entity_index]:void 0)}catch(i){throw i.name="Sak-evaluateJsTemplate-Error",i}}static getJsTemplateOrValue(t,e,s){if(!s)return s;if(["number","boolean","bigint","symbol"].includes(typeof s))return s;if("object"==typeof s)return Object.keys(s).forEach((i=>{s[i]=wt.getJsTemplateOrValue(t,e,s[i])})),s;const i=s.trim();return"[[["===i.substring(0,3)&&"]]]"===i.slice(-3)?wt.evaluateJsTemplate(t,e,i.slice(3,-3)):s}}
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
 */class xt{constructor(t){this.classes=new Set,this.changed=!1,this.element=t;const e=(t.getAttribute("class")||"").split(/\s+/);for(const s of e)this.classes.add(s)}add(t){this.classes.add(t),this.changed=!0}remove(t){this.classes.delete(t),this.changed=!0}commit(){if(this.changed){let t="";this.classes.forEach((e=>t+=e+" ")),this.element.setAttribute("class",t)}}}const $t=new WeakMap,kt=f((t=>e=>{if(!(e instanceof C)||e instanceof N||"class"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `classMap` directive must be used in the `class` attribute and must be the only part in the attribute.");const{committer:s}=e,{element:i}=s;let a=$t.get(e);void 0===a&&(i.setAttribute("class",s.strings.join(" ")),$t.set(e,a=new Set));const o=i.classList||new xt(i);a.forEach((e=>{e in t||(o.remove(e),a.delete(e))}));for(const r in t){const e=t[r];e!=a.has(r)&&(e?(o.add(r),a.add(r)):(o.remove(r),a.delete(r)))}"function"==typeof o.commit&&o.commit()})),St=(t,e,s,i)=>{i=i||{},s=null==s?{}:s;const a=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return a.detail=s,t.dispatchEvent(a),a};class Mt{static{Mt.colorCache={},Mt.element=void 0}static _prefixKeys(t){let e={};return Object.keys(t).forEach((s=>{const i=`--${s}`,a=String(t[s]);e[i]=`${a}`})),e}static processTheme(t){let e={},s={},i={},a={};const{modes:o,...r}=t;return o&&(s={...r,...o.dark},e={...r,...o.light}),i=Mt._prefixKeys(e),a=Mt._prefixKeys(s),{themeLight:i,themeDark:a}}static processPalette(t){let e={},s={},i={},a={},o={};return Object.values(t).forEach((t=>{const{modes:a,...o}=t;e={...e,...o},a&&(i={...i,...o,...a.dark},s={...s,...o,...a.light})})),a=Mt._prefixKeys(s),o=Mt._prefixKeys(i),{paletteLight:a,paletteDark:o}}static setElement(t){Mt.element=t}static calculateColor(t,e,s){const i=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let a,o,r;const n=i.length;if(t<=i[0])return e[i[0]];if(t>=i[n-1])return e[i[n-1]];for(let h=0;h<n-1;h++){const n=i[h],l=i[h+1];if(t>=n&&t<l){if([a,o]=[e[n],e[l]],!s)return a;r=Mt.calculateValueBetween(n,l,t);break}}return Mt.getGradientValue(a,o,r)}static calculateColor2(t,e,s,i,a){const o=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let r,n,h;const l=o.length;if(t<=o[0])return e[o[0]];if(t>=o[l-1])return e[o[l-1]];for(let c=0;c<l-1;c++){const l=o[c],d=o[c+1];if(t>=l&&t<d){if([r,n]=[e[l].styles[s][i],e[d].styles[s][i]],!a)return r;h=Mt.calculateValueBetween(l,d,t);break}}return Mt.getGradientValue(r,n,h)}static calculateValueBetween(t,e,s){return(Math.min(Math.max(s,t),e)-t)/(e-t)}static getColorVariable(t){const e=t.substr(4,t.length-5);return window.getComputedStyle(Mt.element).getPropertyValue(e)}static getGradientValue(t,e,s){const i=Mt.colorToRGBA(t),a=Mt.colorToRGBA(e),o=1-s,r=s,n=Math.floor(i[0]*o+a[0]*r),h=Math.floor(i[1]*o+a[1]*r),l=Math.floor(i[2]*o+a[2]*r),c=Math.floor(i[3]*o+a[3]*r);return`#${Mt.padZero(n.toString(16))}${Mt.padZero(h.toString(16))}${Mt.padZero(l.toString(16))}${Mt.padZero(c.toString(16))}`}static padZero(t){return t.length<2&&(t=`0${t}`),t.substr(0,2)}static colorToRGBA(t){const e=Mt.colorCache[t];if(e)return e;let s=t;"var"===t.substr(0,3).valueOf()&&(s=Mt.getColorVariable(t));const i=window.document.createElement("canvas");i.width=i.height=1;const a=i.getContext("2d");a.clearRect(0,0,1,1),a.fillStyle=s,a.fillRect(0,0,1,1);const o=[...a.getImageData(0,0,1,1).data];return Mt.colorCache[t]=o,o}static hslToRgb(t){const e=t.h/360,s=t.s/100,i=t.l/100;let a,o,r;if(0===s)a=o=r=i;else{function n(t,e,s){return s<0&&(s+=1),s>1&&(s-=1),s<1/6?t+6*(e-t)*s:s<.5?e:s<2/3?t+(e-t)*(2/3-s)*6:t}const h=i<.5?i*(1+s):i+s-i*s,l=2*i-h;a=n(l,h,e+1/3),o=n(l,h,e),r=n(l,h,e-1/3)}return a*=255,o*=255,r*=255,{r:a,g:o,b:r}}}class At{constructor(t,e,s){this.toolId=Math.random().toString(36).substr(2,9),this.toolset=t,this._card=this.toolset._card,this.config=e,this.dev={...this._card.dev},this.toolsetPos=s,this.svg={},this.svg.cx=bt.calculateSvgCoordinate(e.position.cx,0),this.svg.cy=bt.calculateSvgCoordinate(e.position.cy,0),this.svg.height=e.position.height?bt.calculateSvgDimension(e.position.height):0,this.svg.width=e.position.width?bt.calculateSvgDimension(e.position.width):0,this.svg.x=this.svg.cx-this.svg.width/2,this.svg.y=this.svg.cy-this.svg.height/2,this.classes={},this.classes.card={},this.classes.toolset={},this.classes.tool={},this.styles={},this.styles.card={},this.styles.toolset={},this.styles.tool={},this.animationClass={},this.animationClassHasChanged=!0,this.animationStyle={},this.animationStyleHasChanged=!0,this.config?.show?.style||(this.config.show||(this.config.show={}),this.config.show.style="default"),this.colorStops={},this.config.colorstops&&this.config.colorstops.colors&&Object.keys(this.config.colorstops.colors).forEach((t=>{this.colorStops[t]=this.config.colorstops.colors[t]})),"colorstop"===this.config.show.style&&this.config?.colorstops.colors&&(this.sortedColorStops=Object.keys(this.config.colorstops.colors).map((t=>Number(t))).sort(((t,e)=>t-e))),this.csnew={},this.config.csnew&&this.config.csnew.colors&&(this.config.csnew.colors.forEach(((t,e)=>{this.csnew[t.stop]=this.config.csnew.colors[e]})),this.sortedcsnew=Object.keys(this.csnew).map((t=>Number(t))).sort(((t,e)=>t-e)))}textEllipsis(t,e){return e&&e<t.length?t.slice(0,e-1).concat("..."):t}defaultEntityIndex(){return this.default||(this.default={},this.config.hasOwnProperty("entity_indexes")?this.default.entity_index=this.config.entity_indexes[0].entity_index:this.default.entity_index=this.config.entity_index),this.default.entity_index}set value(t){let e=t;this.dev.debug&&console.log("BaseTool set value(state)",e);try{if("undefined"!==e&&void 0!==e&&this._stateValue?.toString().toLowerCase()===e.toString().toLowerCase())return}catch(i){console.log("catching something",i,t,this.config)}this.derivedEntity=null,this.config.derived_entity&&(this.derivedEntity=wt.getJsTemplateOrValue(this,t,yt.mergeDeep(this.config.derived_entity)),e=this.derivedEntity.state?.toString()),this._stateValuePrev=this._stateValue||e,this._stateValue=e,this._stateValueIsDirty=!0;let s=!1;this.activeAnimation=null,this.config.animations&&Object.keys(this.config.animations).map((t=>{const e=JSON.parse(JSON.stringify(this.config.animations[t])),i=wt.getJsTemplateOrValue(this,this._stateValue,yt.mergeDeep(e));if(s)return!0;switch(i.operator?i.operator:"=="){case"==":s=void 0===this._stateValue?void 0===i.state||"undefined"===i.state.toLowerCase():this._stateValue.toLowerCase()===i.state.toLowerCase();break;case"!=":s=void 0===this._stateValue?"undefined"!==i.state.toLowerCase():this._stateValue.toLowerCase()!==i.state.toLowerCase();break;case">":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())>Number(i.state.toLowerCase()));break;case"<":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())<Number(i.state.toLowerCase()));break;case">=":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())>=Number(i.state.toLowerCase()));break;case"<=":void 0!==this._stateValue&&(s=Number(this._stateValue.toLowerCase())<=Number(i.state.toLowerCase()));break;default:s=!1}return this.dev.debug&&console.log("BaseTool, animation, match, value, config, operator",s,this._stateValue,i.state,i.operator),!s||(this.animationClass&&i.reuse||(this.animationClass={}),i.classes&&(this.animationClass=yt.mergeDeep(this.animationClass,i.classes)),this.animationStyle&&i.reuse||(this.animationStyle={}),i.styles&&(this.animationStyle=yt.mergeDeep(this.animationStyle,i.styles)),this.animationStyleHasChanged=!0,this.item=i,this.activeAnimation=i,s)}))}getEntityIndexFromAnimation(t){return t.hasOwnProperty("entity_index")?t.entity_index:this.config.hasOwnProperty("entity_index")?this.config.entity_index:this.config.entity_indexes?this.config.entity_indexes[0].entity_index:void 0}getIndexInEntityIndexes(t){return this.config.entity_indexes.findIndex((e=>e.entity_index===t))}stateIsMatch(t,e){let s;const i=JSON.parse(JSON.stringify(t)),a=wt.getJsTemplateOrValue(this,e,yt.mergeDeep(i));switch(a.operator?a.operator:"=="){case"==":s=void 0===e?void 0===a.state||"undefined"===a.state?.toLowerCase():e.toLowerCase()===a.state.toLowerCase();break;case"!=":s=void 0===e?void 0!==a.state||"undefined"!==a.state?.toLowerCase():e.toLowerCase()!==a.state.toLowerCase();break;case">":void 0!==e&&(s=Number(e.toLowerCase())>Number(a.state.toLowerCase()));break;case"<":void 0!==e&&(s=Number(e.toLowerCase())<Number(a.state.toLowerCase()));break;case">=":void 0!==e&&(s=Number(e.toLowerCase())>=Number(a.state.toLowerCase()));break;case"<=":void 0!==e&&(s=Number(e.toLowerCase())<=Number(a.state.toLowerCase()));break;default:s=!1}return s}mergeAnimationData(t){this.animationClass&&t.reuse||(this.animationClass={}),t.classes&&(this.animationClass=yt.mergeDeep(this.animationClass,t.classes)),this.animationStyle&&t.reuse||(this.animationStyle={}),t.styles&&(this.animationStyle=yt.mergeDeep(this.animationStyle,t.styles)),this.animationStyleHasChanged=!0,this.item||(this.item={}),this.item=yt.mergeDeep(this.item,t),this.activeAnimation={...t}}set values(t){this._lastStateValues||(this._lastStateValues=[]),this._stateValues||(this._stateValues=[]);const e=[...t];this.dev.debug&&console.log("BaseTool set values(state)",e);for(let s=0;s<t.length;++s){void 0!==e[s]&&(this._stateValues[s]?.toLowerCase()===e[s].toLowerCase()||this.config.derived_entities&&(this.derivedEntities[s]=wt.getJsTemplateOrValue(this,t[s],yt.mergeDeep(this.config.derived_entities[s])),e[s]=this.derivedEntities[s].state?.toString())),this._lastStateValues[s]=this._stateValues[s]||e[s],this._stateValues[s]=e[s],this._stateValueIsDirty=!0;let i=!1;this.activeAnimation=null,this.config.animations&&Object.keys(this.config.animations.map(((e,a)=>{const o=this.getIndexInEntityIndexes(this.getEntityIndexFromAnimation(e)),r=JSON.parse(JSON.stringify(e));let n=wt.getJsTemplateOrValue(this,t[s],yt.mergeDeep(r));return i=this.stateIsMatch(n,t[o]),e.debug&&console.log("set values, item, aniKey",n,t,i,this.config.animations),!!i&&(this.mergeAnimationData(n),!0)})))}this._stateValue=this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())],this._stateValuePrev=this._lastStateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]}EnableHoverForInteraction(){const t=this.config.hasOwnProperty("entity_index")||this.config?.user_actions?.tap_action;this.classes.tool.hover=!!t}MergeAnimationStyleIfChanged(t){this.animationStyleHasChanged&&(this.animationStyleHasChanged=!1,this.styles=t?yt.mergeDeep(t,this.config.styles,this.animationStyle):yt.mergeDeep(this.config.styles,this.animationStyle),this.styles.card&&0!==Object.keys(this.styles.card).length&&(this._card.styles.card=yt.mergeDeep(this.styles.card)))}MergeAnimationClassIfChanged(t){this.animationClassHasChanged=!0,this.animationClassHasChanged&&(this.animationClassHasChanged=!1,this.classes=t?yt.mergeDeep(t,this.config.classes,this.animationClass):yt.mergeDeep(this.config.classes,this.animationClass))}MergeColorFromState(t){if(this.config.hasOwnProperty("entity_index")){const e=this.getColorFromState(this._stateValue);""!==e&&this.config?.show?.style&&t&&(t.fill=this.config[this.config.show.style].fill?e:"",t.stroke=this.config[this.config.show.style].stroke?e:"")}}MergeColorFromState2(t,e){if(this.config.hasOwnProperty("entity_index")){const s=this.config[this.config.show.style].fill?this.getColorFromState2(this._stateValue,e,"fill"):"",i=this.config[this.config.show.style].stroke?this.getColorFromState2(this._stateValue,e,"stroke"):"";""!==s&&(t.fill=s),""!==i&&(t.stroke=i)}}getColorFromState(t){let e="";switch(this.config.show.style){case"default":break;case"fixedcolor":e=this.config.color;break;case"colorstop":case"colorstops":case"colorstopgradient":e=Mt.calculateColor(t,this.colorStops,"colorstopgradient"===this.config.show.style);break;case"minmaxgradient":e=Mt.calculateColor(t,this.colorStopsMinMax,!0)}return e}getColorFromState2(t,e,s){let i="";switch(this.config.show.style){case"colorstop":case"colorstops":case"colorstopgradient":i=Mt.calculateColor2(t,this.csnew,e,s,"colorstopgradient"===this.config.show.style);break;case"minmaxgradient":i=Mt.calculateColor2(t,this.colorStopsMinMax,e,s,!0)}return i}_processTapEvent(t,e,s,i,a,o){let r;if(i){St(t,"haptic",i.haptic||"medium"),this.dev.debug&&console.log("_processTapEvent",s,i,a,o);for(let s=0;s<i.actions.length;s++)switch(i.actions[s].action){case"more-info":void 0!==a&&(r=new Event("hass-more-info",{composed:!0}),r.detail={entityId:a},t.dispatchEvent(r));break;case"navigate":if(!i.actions[s].navigation_path)return;window.history.pushState(null,"",i.actions[s].navigation_path),r=new Event("location-changed",{composed:!0}),r.detail={replace:!1},window.dispatchEvent(r);break;case"call-service":{if(!i.actions[s].service)return;const[t,r]=i.actions[s].service.split(".",2),n={...i.actions[s].service_data};n.entity_id||(n.entity_id=a),i.actions[s].parameter&&(n[i.actions[s].parameter]=o),e.callService(t,r,n);break}case"fire-dom-event":{const e={...i.actions[s]};r=new Event("ll-custom",{composed:!0,bubbles:!0}),r.detail=e,t.dispatchEvent(r);break}default:console.error("Unknown Event definition",i)}}}handleTapEvent(t,e){let s;t.stopPropagation(),t.preventDefault();let i=this.defaultEntityIndex();s=void 0===i||e.user_actions?e.user_actions?.tap_action:{haptic:"light",actions:[{action:"more-info"}]},s&&this._processTapEvent(this._card,this._card._hass,this.config,s,this._card.config.hasOwnProperty("entities")?this._card.config.entities[i]?.entity:void 0,void 0)}}class Ct extends At{constructor(t,e,s){super(t,yt.mergeDeep({position:{cx:50,cy:50,width:100,height:25,radius:5,ratio:30,divider:30},classes:{tool:{"sak-badge":!0,hover:!0},left:{"sak-badge__left":!0},right:{"sak-badge__right":!0}},styles:{tool:{},left:{},right:{}}},e),s),this.svg.radius=bt.calculateSvgDimension(e.position.radius),this.svg.leftXpos=this.svg.x,this.svg.leftYpos=this.svg.y,this.svg.leftWidth=this.config.position.ratio/100*this.svg.width,this.svg.arrowSize=this.svg.height*this.config.position.divider/100/2,this.svg.divSize=this.svg.height*(100-this.config.position.divider)/100/2,this.svg.rightXpos=this.svg.x+this.svg.leftWidth,this.svg.rightYpos=this.svg.y,this.svg.rightWidth=(100-this.config.position.ratio)/100*this.svg.width,this.classes.tool={},this.classes.left={},this.classes.right={},this.styles.tool={},this.styles.left={},this.styles.right={},this.dev.debug&&console.log("BadgeTool constructor coords, dimensions",this.svg,this.config)}_renderBadge(){let t=[];return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),t=F`
      <g  id="badge-${this.toolId}">
        <path class="${kt(this.classes.right)}" d="
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

        <path class="${kt(this.classes.left)}" d="
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
      `,F`${t}`}render(){return F`
      <g id="badge-${this.toolId}"
        class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderBadge()}
      </g>
    `}}class Et extends At{constructor(t,e,s){super(t,yt.mergeDeep({position:{cx:50,cy:50,radius:50},classes:{tool:{"sak-circle":!0,hover:!0},circle:{"sak-circle__circle":!0}},styles:{tool:{},circle:{}}},e),s),this.EnableHoverForInteraction(),this.svg.radius=bt.calculateSvgDimension(e.position.radius),this.classes.tool={},this.classes.circle={},this.styles.tool={},this.styles.circle={},this.dev.debug&&console.log("CircleTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderCircle(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.circle),F`
      <circle class="${kt(this.classes.circle)}"
        cx="${this.svg.cx}"% cy="${this.svg.cy}"% r="${this.svg.radius}"
        style="${nt(this.styles.circle)}"
      </circle>

      `}render(){return this.styles.tool.overflow="visible",this.styles["transform-origin"]=`${this.svg.cx} ${this.svg.cy}`,F`
      <g "" id="circle-${this.toolId}"
        class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderCircle()}
      </g>
    `}}class Tt extends At{constructor(t,e,s){switch(super(t,yt.mergeDeep({position:{cx:50,cy:50,radius:45,start_angle:30,end_angle:230,track:{width:2},active:{width:4},thumb:{height:10,width:10,radius:5},capture:{height:25,width:25,radius:25},label:{placement:"none",cx:10,cy:10}},show:{uom:"end",active:!1},classes:{tool:{"sak-circslider":!0,hover:!0},capture:{"sak-circslider__capture":!0,hover:!0},active:{"sak-circslider__active":!0},track:{"sak-circslider__track":!0},thumb:{"sak-circslider__thumb":!0,hover:!0},label:{"sak-circslider__value":!0},uom:{"sak-circslider__uom":!0}},styles:{tool:{},active:{},capture:{},track:{},thumb:{},label:{},uom:{}},scale:{min:0,max:100,step:1}},e),s),this.svg.radius=bt.calculateSvgDimension(this.config.position.radius),this.arc={},this.arc.startAngle=this.config.position.start_angle,this.arc.endAngle=this.config.position.end_angle,this.arc.size=_t(this.config.position.end_angle,this.config.position.start_angle),this.arc.clockwise=this.config.position.end_angle>this.config.position.start_angle,this.arc.direction=this.arc.clockwise?1:-1,this.arc.pathLength=2*this.arc.size/360*Math.PI*this.svg.radius,this.arc.arcLength=2*Math.PI*this.svg.radius,this.arc.startAngle360=vt(this.arc.startAngle,this.arc.startAngle,this.arc.endAngle),this.arc.endAngle360=vt(this.arc.startAngle,this.arc.endAngle,this.arc.endAngle),this.arc.startAngleSvgPoint=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,this.arc.startAngle360),this.arc.endAngleSvgPoint=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,this.arc.endAngle360),this.arc.scaleDasharray=2*this.arc.size/360*Math.PI*this.svg.radius,this.arc.dashOffset=this.arc.clockwise?0:-this.arc.scaleDasharray-this.arc.arcLength,this.arc.currentAngle=this.arc.startAngle,this.svg.startAngle=this.config.position.start_angle,this.svg.endAngle=this.config.position.end_angle,this.svg.diffAngle=this.config.position.end_angle-this.config.position.start_angle,this.svg.pathLength=2*this.arc.size/360*Math.PI*this.svg.radius,this.svg.circleLength=2*Math.PI*this.svg.radius,this.svg.label={},this.config.position.label.placement){case"position":this.svg.label.cx=bt.calculateSvgCoordinate(this.config.position.label.cx,0),this.svg.label.cy=bt.calculateSvgCoordinate(this.config.position.label.cy,0);break;case"thumb":this.svg.label.cx=this.svg.cx,this.svg.label.cy=this.svg.cy;break;case"none":break;default:throw console.error("CircularSliderTool - constructor: invalid label placement [none, position, thumb] = ",this.config.position.label.placement),Error("CircularSliderTool::constructor - invalid label placement [none, position, thumb] = ",this.config.position.label.placement)}this.svg.track={},this.svg.track.width=bt.calculateSvgDimension(this.config.position.track.width),this.svg.active={},this.svg.active.width=bt.calculateSvgDimension(this.config.position.active.width),this.svg.thumb={},this.svg.thumb.width=bt.calculateSvgDimension(this.config.position.thumb.width),this.svg.thumb.height=bt.calculateSvgDimension(this.config.position.thumb.height),this.svg.thumb.radius=bt.calculateSvgDimension(this.config.position.thumb.radius),this.svg.thumb.cx=this.svg.cx,this.svg.thumb.cy=this.svg.cy,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2,this.svg.capture={},this.svg.capture.width=bt.calculateSvgDimension(Math.max(this.config.position.capture.width,1.2*this.config.position.thumb.width)),this.svg.capture.height=bt.calculateSvgDimension(Math.max(this.config.position.capture.height,1.2*this.config.position.thumb.height)),this.svg.capture.radius=bt.calculateSvgDimension(this.config.position.capture.radius),this.svg.capture.x1=this.svg.cx-this.svg.capture.width/2,this.svg.capture.y1=this.svg.cy-this.svg.capture.height/2,this.svg.rotate={},this.svg.rotate.degrees=this.arc.clockwise?-90+this.arc.startAngle:this.arc.endAngle360-90,this.svg.rotate.cx=this.svg.cx,this.svg.rotate.cy=this.svg.cy,this.classes.track={},this.classes.active={},this.classes.thumb={},this.classes.label={},this.classes.uom={},this.styles.track={},this.styles.active={},this.styles.thumb={},this.styles.label={},this.styles.uom={},this.svg.scale={},this.svg.scale.min=this.config.scale.min,this.svg.scale.max=this.config.scale.max,this.svg.scale.center=Math.abs(this.svg.scale.max-this.svg.scale.min)/2+this.svg.scale.min,this.svg.scale.svgPointMin=this.sliderValueToPoint(this.svg.scale.min),this.svg.scale.svgPointMax=this.sliderValueToPoint(this.svg.scale.max),this.svg.scale.svgPointCenter=this.sliderValueToPoint(this.svg.scale.center),this.svg.scale.step=this.config.scale.step,this.rid=null,this.thumbPos=this.sliderValueToPoint(this.config.scale.min),this.svg.thumb.x1=this.thumbPos.x-this.svg.thumb.width/2,this.svg.thumb.y1=this.thumbPos.y-this.svg.thumb.height/2,this.svg.capture.x1=this.thumbPos.x-this.svg.capture.width/2,this.svg.capture.y1=this.thumbPos.y-this.svg.capture.height/2,this.dev.debug&&console.log("CircularSliderTool::constructor",this.config,this.svg)}pointToAngle360(t,e,s){let i=-Math.atan2(t.y-e.y,e.x-t.x)/(Math.PI/180);return i+=-90,i<0&&(i+=360),this.arc.clockwise&&i<this.arc.startAngle360&&(i+=360),this.arc.clockwise||i<this.arc.endAngle360&&(i+=360),i}isAngle360InBetween(t){let e;return e=this.arc.clockwise?t>=this.arc.startAngle360&&t<=this.arc.endAngle360:t<=this.arc.startAngle360&&t>=this.arc.endAngle360,!!e}polarToCartesian(t,e,s,i,a){const o=(a-90)*Math.PI/180;return{x:t+s*Math.cos(o),y:e+i*Math.sin(o)}}pointToSliderValue(t){let e,s;const i={};i.x=this.svg.cx,i.y=this.svg.cy;const a=this.pointToAngle360(t,i,!0);let{myAngle:o}=this;const r=this.isAngle360InBetween(a);var n,h,l;return r&&(this.myAngle=a,o=a,this.arc.currentAngle=o),this.arc.currentAngle=o,this.arc.clockwise&&(s=(o-this.arc.startAngle360)/this.arc.size),this.arc.clockwise||(s=(this.arc.startAngle360-o)/this.arc.size),e=(this.config.scale.max-this.config.scale.min)*s+this.config.scale.min,e=Math.round(e/this.svg.scale.step)*this.svg.scale.step,e=Math.max(Math.min(this.config.scale.max,e),this.config.scale.min),this.arc.currentAngle=o,this.dragging&&!r&&(n=this.svg.scale.min,h=e,l=this.svg.scale.max,e=Math.abs(h-n)>Math.abs(l-h)?l:n,this.m=this.sliderValueToPoint(e)),e}sliderValueToPoint(t){let e,s=bt.calculateValueBetween(this.config.scale.min,this.config.scale.max,t);isNaN(s)&&(s=0),e=this.arc.clockwise?this.arc.size*s+this.arc.startAngle360:this.arc.size*(1-s)+this.arc.endAngle360,e<0&&(e+=360);const i=this.polarToCartesian(this.svg.cx,this.svg.cy,this.svg.radius,this.svg.radius,e);return this.arc.currentAngle=e,i}updateValue(t){this._value=this.pointToSliderValue(t);Math.abs(0)<.01&&this.rid&&(window.cancelAnimationFrame(this.rid),this.rid=null)}updateThumb(t){if(this.dragging){this.thumbPos=this.sliderValueToPoint(this._value),this.svg.thumb.x1=this.thumbPos.x-this.svg.thumb.width/2,this.svg.thumb.y1=this.thumbPos.y-this.svg.thumb.height/2,this.svg.capture.x1=this.thumbPos.x-this.svg.capture.width/2,this.svg.capture.y1=this.thumbPos.y-this.svg.capture.height/2;const t=`rotate(${this.arc.currentAngle} ${this.svg.capture.width/2} ${this.svg.capture.height/2})`;this.elements.thumb.setAttribute("transform",t),this.elements.thumbGroup.setAttribute("x",this.svg.capture.x1),this.elements.thumbGroup.setAttribute("y",this.svg.capture.y1)}this.updateLabel(t)}updateActiveTrack(t){const e=this.config.scale.min||0,s=this.config.scale.max||100;let i=bt.calculateValueBetween(e,s,this.labelValue);isNaN(i)&&(i=0);const a=i*this.svg.pathLength;this.dashArray=`${a} ${this.svg.circleLength}`,this.dragging&&this.elements.activeTrack.setAttribute("stroke-dasharray",this.dashArray)}updateLabel(t){this.dev.debug&&console.log("SLIDER - updateLabel start",t,this.config.position.orientation);const e=this._card.config.entities[this.defaultEntityIndex()].decimals||0,s=10**e;this.labelValue2=(Math.round(this.pointToSliderValue(t)*s)/s).toFixed(e),console.log("updateLabel, labelvalue ",this.labelValue2),"none"!==this.config.position.label.placement&&(this.elements.label.textContent=this.labelValue2)}mouseEventToPoint(t){let e=this.elements.svg.createSVGPoint();e.x=t.touches?t.touches[0].clientX:t.clientX,e.y=t.touches?t.touches[0].clientY:t.clientY;const s=this.elements.svg.getScreenCTM().inverse();return e=e.matrixTransform(s),e}callDragService(){void 0!==this.labelValue2&&(this.labelValuePrev!==this.labelValue2&&(this.labelValuePrev=this.labelValue2,this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions.tap_action,this._card.config.entities[this.defaultEntityIndex()]?.entity,this.labelValue2)),this.dragging&&(this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval)))}callTapService(){void 0!==this.labelValue2&&this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions?.tap_action,this._card.config.entities[this.defaultEntityIndex()]?.entity,this.labelValue2)}firstUpdated(t){function e(){this.rid=window.requestAnimationFrame(e),this.updateValue(this.m),this.updateThumb(this.m),this.updateActiveTrack(this.m)}this.labelValue=this._stateValue,this.dev.debug&&console.log("circslider - firstUpdated"),this.elements={},this.elements.svg=this._card.shadowRoot.getElementById("circslider-".concat(this.toolId)),this.elements.track=this.elements.svg.querySelector("#track"),this.elements.activeTrack=this.elements.svg.querySelector("#active-track"),this.elements.capture=this.elements.svg.querySelector("#capture"),this.elements.thumbGroup=this.elements.svg.querySelector("#thumb-group"),this.elements.thumb=this.elements.svg.querySelector("#thumb"),this.elements.label=this.elements.svg.querySelector("#label tspan"),this.dev.debug&&console.log("circslider - firstUpdated svg = ",this.elements.svg,"activeTrack=",this.elements.activeTrack,"thumb=",this.elements.thumb,"label=",this.elements.label,"text=",this.elements.text);const s=()=>{const t=_t(this.svg.scale.max,this.labelValue)<=this.rangeMax,e=_t(this.svg.scale.min,this.labelValue)<=this.rangeMin,s=!(!e||!this.diffMax),i=!(!t||!this.diffMin);s?(this.labelValue=this.svg.scale.max,this.m=this.sliderValueToPoint(this.labelValue),this.rangeMax=this.svg.scale.max/10,this.rangeMin=_t(this.svg.scale.max,this.svg.scale.min+this.svg.scale.max/5)):i?(this.labelValue=this.svg.scale.min,this.m=this.sliderValueToPoint(this.labelValue),this.rangeMax=_t(this.svg.scale.min,this.svg.scale.max-this.svg.scale.max/5),this.rangeMin=this.svg.scale.max/10):(this.diffMax=t,this.diffMin=e,this.rangeMin=this.svg.scale.max/5,this.rangeMax=this.svg.scale.max/5)},i=t=>{t.preventDefault(),this.dragging&&(this.m=this.mouseEventToPoint(t),this.labelValue=this.pointToSliderValue(this.m),s(),e.call(this))},a=t=>{t.preventDefault(),this.dragging=!0,window.addEventListener("pointermove",i,!1),window.addEventListener("pointerup",o,!1),this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(this.config.user_actions.drag_action.update_interval>0?this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval):this.timeOutId=null),this.m=this.mouseEventToPoint(t),this.labelValue=this.pointToSliderValue(this.m),s(),this.dev.debug&&console.log("pointerDOWN",Math.round(100*this.m.x)/100),e.call(this)},o=t=>{t.preventDefault(),this.dev.debug&&console.log("pointerUP"),window.removeEventListener("pointermove",i,!1),window.removeEventListener("pointerup",o,!1),window.removeEventListener("mousemove",i,!1),window.removeEventListener("touchmove",i,!1),window.removeEventListener("mouseup",o,!1),window.removeEventListener("touchend",o,!1),this.labelValuePrev=this.labelValue,this.dragging?(this.dragging=!1,clearTimeout(this.timeOutId),this.timeOutId=null,this.target=0,this.labelValue2=this.labelValue,e.call(this),this.callTapService()):s()};this.elements.thumbGroup.addEventListener("touchstart",a,!1),this.elements.thumbGroup.addEventListener("mousedown",a,!1),this.elements.svg.addEventListener("wheel",(t=>{t.preventDefault(),clearTimeout(this.wheelTimeOutId),this.dragging=!0,this.wheelTimeOutId=setTimeout((()=>{clearTimeout(this.timeOutId),this.timeOutId=null,this.labelValue2=this.labelValue,this.dragging=!1,this.callTapService()}),500),this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(this.config.user_actions.drag_action.update_interval>0?this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval):this.timeOutId=null);const s=+this.labelValue+ +(t.altKey?10*this.svg.scale.step:this.svg.scale.step)*Math.sign(t.deltaY);var i,a,o;this.labelValue=(i=this.svg.scale.min,a=s,o=this.svg.scale.max,Math.min(Math.max(a,i),o)),this.m=this.sliderValueToPoint(this.labelValue),this.pointToSliderValue(this.m),e.call(this),this.labelValue2=this.labelValue}),!1)}set value(t){if(super.value=t,this.dragging||(this.labelValue=this._stateValue),!this.dragging){const t=this.config.scale.min||0,e=this.config.scale.max||100;let s=Math.min(bt.calculateValueBetween(t,e,this._stateValue),1);isNaN(s)&&(s=0);const i=s*this.svg.pathLength;this.dashArray=`${i} ${this.svg.circleLength}`;const a=this.sliderValueToPoint(this._stateValue);this.svg.thumb.x1=a.x-this.svg.thumb.width/2,this.svg.thumb.y1=a.y-this.svg.thumb.height/2,this.svg.capture.x1=a.x-this.svg.capture.width/2,this.svg.capture.y1=a.y-this.svg.capture.height/2}}set values(t){if(super.values=t,this.dragging||(this.labelValue=this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]),!this.dragging){const t=this.config.scale.min||0,e=this.config.scale.max||100;let s=Math.min(bt.calculateValueBetween(t,e,this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]),1);isNaN(s)&&(s=0);const i=s*this.svg.pathLength;this.dashArray=`${i} ${this.svg.circleLength}`;const a=this.sliderValueToPoint(this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]);this.svg.thumb.x1=a.x-this.svg.thumb.width/2,this.svg.thumb.y1=a.y-this.svg.thumb.height/2,this.svg.capture.x1=a.x-this.svg.capture.width/2,this.svg.capture.y1=a.y-this.svg.capture.height/2}}_renderUom(){if("none"===this.config.show.uom)return F``;{this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.uom);let t=this.styles.label["font-size"],e=.5,s="em";const i=t.match(/\D+|\d*\.?\d+/g);2===i.length?(e=.6*Number(i[0]),s=i[1]):console.error("Cannot determine font-size for state/unit",t),t={"font-size":e+s},this.styles.uom=yt.mergeDeep(this.config.styles.uom,t);const a=this._card._buildUom(this.derivedEntity,this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]);return"end"===this.config.show.uom?F`
          <tspan class="${kt(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${nt(this.styles.uom)}">
            ${a}</tspan>
        `:"bottom"===this.config.show.uom?F`
          <tspan class="${kt(this.classes.uom)}" x="${this.svg.label.cx}" dy="1.5em"
            style="${nt(this.styles.uom)}">
            ${a}</tspan>
        `:"top"===this.config.show.uom?F`
          <tspan class="${kt(this.classes.uom)}" x="${this.svg.label.cx}" dy="-1.5em"
            style="${nt(this.styles.uom)}">
            ${a}</tspan>
        `:F`
          <tspan class="${kt(this.classes.uom)}"  dx="-0.1em" dy="-0.35em"
            style="${nt(this.styles.uom)}">
            ERR</tspan>
        `}}_renderCircSlider(){return this.MergeAnimationClassIfChanged(),this.MergeColorFromState(),this.MergeAnimationStyleIfChanged(),this.renderValue=this._stateValue,this.dragging?this.renderValue=this.labelValue2:this.elements?.label&&(this.elements.label.textContent="undefined"===this.renderValue?"":this.renderValue),F`
      <g id="circslider__group-inner" class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}">

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

        ${function(){return F`
        <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}" style="filter:url(#sak-drop-1);overflow:visible;">
          <g style="transform-origin:center;transform-box: fill-box;" >
          <g id="thumb" transform="rotate(${this.arc.currentAngle} ${this.svg.capture.width/2} ${this.svg.capture.height/2})">

            <rect id="capture" class="${kt(this.classes.capture)}" x="0" y="0"
              width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}" 
              style="${nt(this.styles.capture)}" 
            />

            <rect id="rect-thumb" class="${kt(this.classes.thumb)}" x="${(this.svg.capture.width-this.svg.thumb.width)/2}" y="${(this.svg.capture.height-this.svg.thumb.height)/2}"
              width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
              style="${nt(this.styles.thumb)}"
            />

            </g>
            </g>
        </g>
      `}.call(this)}
        ${function(t){return"thumb"===this.config.position.label.placement&&t?F`
      <text id="label">
        <tspan class="${kt(this.classes.label)}" x="${this.svg.label.cx}" y="${this.svg.label.cy}" style="${nt(this.styles.label)}">
        ${void 0===this.renderValue?"":this.renderValue}</tspan>
        ${void 0===this.renderValue?"":this._renderUom()}
        </text>
        `:"position"!==this.config.position.label.placement||t?void 0:F`
          <text id="label" style="transform-origin:center;transform-box: fill-box;">
            <tspan class="${kt(this.classes.label)}" data-placement="position" x="${this.svg.label.cx}" y="${this.svg.label.cy}"
            style="${nt(this.styles.label)}">
            ${void 0===this.renderValue?"":this.renderValue}</tspan>
            ${void 0===this.renderValue?"":this._renderUom()}
          </text>
          `}.call(this,!1)}
      </g>

    `}render(){return F`
      <svg xmlns="http://www.w3.org/2000/svg" id="circslider-${this.toolId}" class="circslider__group-outer" overflow="visible"
        touch-action="none" style="touch-action:none;"
      >
        ${this._renderCircSlider()}

      </svg>
    `}}class It extends At{constructor(t,e,s){super(t,yt.mergeDeep({position:{cx:50,cy:50,radiusx:50,radiusy:25},classes:{tool:{"sak-ellipse":!0,hover:!0},ellipse:{"sak-ellipse__ellipse":!0}},styles:{tool:{},ellipse:{}}},e),s),this.svg.radiusx=bt.calculateSvgDimension(e.position.radiusx),this.svg.radiusy=bt.calculateSvgDimension(e.position.radiusy),this.classes.tool={},this.classes.ellipse={},this.styles.tool={},this.styles.ellipse={},this.dev.debug&&console.log("EllipseTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_renderEllipse(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.ellipse),this.dev.debug&&console.log("EllipseTool - renderEllipse",this.svg.cx,this.svg.cy,this.svg.radiusx,this.svg.radiusy),F`
      <ellipse class="${kt(this.classes.ellipse)}"
        cx="${this.svg.cx}"% cy="${this.svg.cy}"%
        rx="${this.svg.radiusx}" ry="${this.svg.radiusy}"
        style="${nt(this.styles.ellipse)}"/>
      `}render(){return F`
      <g id="ellipse-${this.toolId}"
        class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderEllipse()}
      </g>
    `}}class Nt extends At{constructor(t,e,s){super(t,yt.mergeDeep({classes:{tool:{},area:{"sak-area__area":!0,hover:!0}},styles:{tool:{},area:{}}},e),s),this.classes.tool={},this.classes.area={},this.styles.tool={},this.styles.area={},this.dev.debug&&console.log("EntityAreaTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_buildArea(t,e){return e.area||"?"}_renderEntityArea(){this.MergeAnimationClassIfChanged(),this.MergeColorFromState(this.styles.area),this.MergeAnimationStyleIfChanged();const t=this.textEllipsis(this._buildArea(this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]),this.config?.show?.ellipsis);return F`
        <text>
          <tspan class="${kt(this.classes.area)}"
          x="${this.svg.cx}" y="${this.svg.cy}" style="${nt(this.styles.area)}">${t}</tspan>
        </text>
      `}render(){return F`
      <g id="area-${this.toolId}"
        class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderEntityArea()}
      </g>
    `}}const Dt="mdi:bookmark",Vt={air_quality:"mdi:air-filter",alert:"mdi:alert",calendar:"mdi:calendar",climate:"mdi:thermostat",configurator:"mdi:cog",conversation:"mdi:microphone-message",counter:"mdi:counter",datetime:"mdi:calendar-clock",date:"mdi:calendar",demo:"mdi:home-assistant",google_assistant:"mdi:google-assistant",group:"mdi:google-circles-communities",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_button:"mdi:gesture-tap-button",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",number:"mdi:ray-vertex",persistent_notification:"mdi:bell",plant:"mdi:Flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:palette",schedule:"mdi:calendar-clock",script:"mdi:script-text",select:"mdi:format-list-bulleted",sensor:"mdi:Eye",simple_alarm:"mdi:bell",siren:"mdi:bullhorn",stt:"mdi:microphone-message",text:"mdi:form-textbox",time:"mdi:clock",timer:"mdi:timer-outline",tts:"mdi:speaker-message",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",zone:"mdi:map-marker-radius"},Pt={apparent_power:"mdi:flash",aqi:"mdi:air-filter",atmospheric_pressure:"mdi:thermometer-lines",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co",current:"mdi:current-ac",data_rate:"mdi:transmission-tower",data_size:"mdi:database",date:"mdi:calendar",distance:"mdi:arrow-left-right",duration:"mdi:progress-clock",energy:"mdi:lightning-bolt",frequency:"mdi:sine-wave",gas:"mdi:meter-gas",humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",irradiance:"mdi:sun-wireless",moisture:"mdi:water-percent",monetary:"mdi:cash",nitrogen_dioxide:"mdi:molecule",nitrogen_monoxide:"mdi:molecule",nitrous_oxide:"mdi:molecule",ozone:"mdi:molecule",pm1:"mdi:molecule",pm10:"mdi:molecule",pm25:"mdi:molecule",power:"mdi:flash",power_factor:"mdi:angle-acute",precipitation:"mdi:weather-rainy",precipitation_intensity:"mdi:weather-pouring",pressure:"mdi:gauge",reactive_power:"mdi:flash",signal_strength:"mdi:wifi",sound_pressure:"mdi:ear-hearing",speed:"mdi:speedometer",sulphur_dioxide:"mdi:molecule",temperature:"mdi:thermometer",timestamp:"mdi:clock",volatile_organic_compounds:"mdi:molecule",volatile_organic_compounds_parts:"mdi:molecule",voltage:"mdi:sine-wave",volume:"mdi:car-coolant-level",water:"mdi:water",weight:"mdi:weight",wind_speed:"mdi:weather-windy"},Rt=t=>t.substr(0,t.indexOf("."));new Set(["fan","input_boolean","light","switch","group","automation","humidifier"]),new Set(["camera","media_player"]);const Lt={10:"mdi:battery-10",20:"mdi:battery-20",30:"mdi:battery-30",40:"mdi:battery-40",50:"mdi:battery-50",60:"mdi:battery-60",70:"mdi:battery-70",80:"mdi:battery-80",90:"mdi:battery-90",100:"mdi:battery"},Ot={10:"mdi:battery-charging-10",20:"mdi:battery-charging-20",30:"mdi:battery-charging-30",40:"mdi:battery-charging-40",50:"mdi:battery-charging-50",60:"mdi:battery-charging-60",70:"mdi:battery-charging-70",80:"mdi:battery-charging-80",90:"mdi:battery-charging-90",100:"mdi:battery-charging"},Bt=(t,e)=>{const s=Number(t);if(isNaN(s))return"off"===t?"mdi:battery":"on"===t?"mdi:battery-alert":"mdi:battery-unknown";const i=10*Math.round(s/10);return e&&s>=10?Ot[i]:e?"mdi:battery-charging-outline":s<=5?"mdi:battery-alert-variant-outline":Lt[i]},zt=t=>{const e=t?.attributes.device_class;if(e&&e in Pt)return Pt[e];if("battery"===e)return t?((t,e)=>{const s=t.state,i=e&&"on"===e.state;return Bt(s,i)})(t):"mdi:battery";const s=t?.attributes.unit_of_measurement;return"°C"===s||"°F"===s?"mdi-thermometer":void 0},Ft=(t,e,s)=>{const i=void 0!==s?s:e?.state;switch(t){case"alarm_control_panel":return(t=>{switch(t){case"armed_away":return"mdi:shield-lock";case"armed_vacation":return"mdi:shield-airplane";case"armed_home":return"mdi:shield-home";case"armed_night":return"mdi:shield-moon";case"armed_custom_bypass":return"mdi:security";case"pending":return"mdi:shield-outline";case"triggered":return"mdi:bell-ring";case"disarmed":return"mdi:shield-off";default:return"mdi:shield"}})(i);case"automation":return"off"===i?"mdi:robot-off":"mdi:robot";case"binary_sensor":return((t,e)=>{const s="off"===t;switch(e?.attributes.device_class){case"battery":return s?"mdi:battery":"mdi:battery-outline";case"battery_charging":return s?"mdi:battery":"mdi:battery-charging";case"carbon_monoxide":return s?"mdi:smoke-detector":"mdi:smoke-detector-alert";case"cold":return s?"mdi:thermometer":"mdi:Snowflake";case"connectivity":return s?"mdi:close-network-outline":"mdi:check-network-outline";case"door":return s?"mdi:door-closed":"mdi:door-open";case"garage_door":return s?"mdi:garage":"mdi:garage-open";case"power":case"plug":return s?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return s?"mdi:check-circle":"mdi:alert-circle";case"smoke":return s?"mdi:smoke-detector-variant":"mdi:smoke-detector-variant-alert";case"heat":return s?"mdi:thermometer":"mdi:fire";case"light":return s?"mdi:brightness-5":"mdi:brightness-7";case"lock":return s?"mdi:lock":"mdi:lock-open";case"moisture":return s?"mdi:water-off":"mdi:water";case"motion":return s?"mdi:motion-sensor-off":"mdi:motion-sensor";case"occupancy":return s?"mdi:home-outline":"mdi:Home";case"opening":return s?"mdi:square":"mdi:square-outline";case"presence":return s?"mdi:home-outline":"mdi:home";case"running":return s?"mdi:stop":"mdi:play";case"sound":return s?"mdi:music-note-off":"mdi:music-note";case"update":return s?"mdi:package":"mdi:package-up";case"vibration":return s?"mdi:crop-portrait":"mdi:vibrate";case"window":return s?"mdi:window-closed":"mdi:window-open";default:return s?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}})(i,e);case"button":switch(e?.attributes.device_class){case"restart":return"mdi:restart";case"update":return"mdi:package-up";default:return"mdi:gesture-tap-button"}case"camera":return"off"===i?"mdi:video-off":"mdi:video";case"cover":return((t,e)=>{const s="closed"!==t;switch(e?.attributes.device_class){case"garage":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdigarage";default:return"mdi:Garage-open"}case"gate":switch(t){case"opening":case"closing":return"mdi:gate-arrow-right";case"closed":return"mdi:gate";default:return"mdi:gate-open"}case"door":return s?"mdi:door-open":"mdi:door-closed";case"damper":return s?"mdi:circle":"mdi:circle-slice-8";case"shutter":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window-shutter";default:return"mdi:window-shutter-open"}case"curtain":switch(t){case"opening":return"mdi:arrow-split-vertical";case"closing":return"mdi:arrow-collapse-horizontal";case"closed":return"mdi:curtains-closed";default:return"mdi:curtains"}case"blind":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:blinds-horizontal-closed";default:return"mdi:blinds-horizontal"}case"shade":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:roller-shade-closed";default:return"mdi:roller-shade"}case"window":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}}switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}})(i,e);case"device_tracker":return"router"===e?.attributes.source_type?"home"===i?"mdi:lan-connect":"mdi:lan-cisconnect":["bluetooth","bluetooth_le"].includes(e?.attributes.source_type)?"home"===i?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===i?"mdi:account-arrow-right":"mdi:account";case"fan":return"off"===i?"mdi:fan-off":"mdi:fan";case"humidifier":return"off"===i?"mdi:air-humidifier-off":"mdi:air-humidifier";case"input_boolean":return"on"===i?"mdi:check-circle-outline":"mdi:close-circle-outline";case"input_datetime":if(!e?.attributes.has_date)return"mdi:clock";if(!e.attributes.has_time)return"mdi:calendar";break;case"lock":switch(i){case"unlocked":return"mdi:lock-open";case"jammed":return"mdi:lock-alert";case"locking":case"unlocking":return"mdi:lock-clock";default:return"mdi:lock"}case"media_player":switch(e?.attributes.device_class){case"speaker":switch(i){case"playing":return"mdi:speaker-play";case"paused":return"mdi:speaker-pause";case"off":return"mdi:speaker-off";default:return"mdi:speaker"}case"tv":switch(i){case"playing":return"mdi:television-play";case"paused":return"mdi:television-pause";case"off":return"mdi:television-off";default:return"mdi:television"}case"receiver":return"off"===i?"mdi:audio-video-off":"mdi:audio-video";default:switch(i){case"playing":case"paused":return"mdi:cast-connected";case"off":return"mdi:cast-off";default:return"mdi:cast"}}case"number":{const t=(t=>{const e=t?.attributes.device_class;if(e&&e in Pt)return Pt[e]})(e);if(t)return t;break}case"person":return"not_home"===i?"mdi:account-arrow-right":"mdi:account";case"switch":switch(e?.attributes.device_class){case"outlet":return"on"===i?"mdi:power-plug":"mdi:power-plug-off";case"switch":return"on"===i?"mdi:toggle-switch-variant":"mdi:toggle-switch-variant-off";default:return"mdi:toggle-switch-variant"}case"sensor":{const t=zt(e);if(t)return t;break}case"sun":return"above_horizon"===e?.state?"mdi:white-balance-sunny":"mdi:weather-night";case"switch_as_x":return"mdi:swap-horizontal";case"threshold":return"mdi:chart-sankey";case"water_heater":return"off"===i?"mdi:water-boiler-off":"mdi:water-boiler"}if(t in Vt)return Vt[t]},Gt=t=>t?((t,e,s)=>{const i=Ft(t,e,s);return i||(console.warn(`Unable to find icon for domain ${t}`),Dt)})(Rt(t.entity_id),t):Dt;class Ut extends At{constructor(t,e,s){super(t,yt.mergeDeep({classes:{tool:{"sak-icon":!0,hover:!0},icon:{"sak-icon__icon":!0}},styles:{tool:{},icon:{}}},e),s),this.svg.iconSize=this.config.position.icon_size?this.config.position.icon_size:3,this.svg.iconPixels=4*this.svg.iconSize;const i=this.config.position.align?this.config.position.align:"center",a="center"===i?.5:"start"===i?-1:1,o=400/this._card.viewBox.width;this.svg.xpx=this.svg.cx,this.svg.ypx=this.svg.cy,!this._card.isSafari&&!this._card.iOS||this._card.isSafari16?(this.svg.xpx-=this.svg.iconPixels*a,this.svg.ypx=this.svg.ypx-.5*this.svg.iconPixels-.25*this.svg.iconPixels):(this.svg.iconSize*=o,this.svg.xpx=this.svg.xpx*o-this.svg.iconPixels*a*o,this.svg.ypx=this.svg.ypx*o-.5*this.svg.iconPixels*o-.25*this.svg.iconPixels*o),this.classes.tool={},this.classes.icon={},this.styles.tool={},this.styles.icon={},this.dev.debug&&console.log("EntityIconTool constructor coords, dimensions, config",this.coords,this.dimensions,this.config)}static{Ut.sakIconCache={}}_buildIcon(t,e,s){return this.activeAnimation?.icon||s||e?.icon||t?.attributes?.icon||Gt(t)}_renderIcon(){const t=this._buildIcon(this._card.entities[this.defaultEntityIndex()],void 0!==this.defaultEntityIndex()?this._card.config.entities[this.defaultEntityIndex()]:void 0,this.config.icon);{this.svg.iconSize=this.config.position.icon_size?this.config.position.icon_size:2,this.svg.iconPixels=4*this.svg.iconSize,this.svg.iconSize=this.config.position.icon_size?this.config.position.icon_size:2,this.svg.iconPixels=bt.calculateSvgDimension(this.svg.iconSize);const t=this.config.position.align?this.config.position.align:"center",e="center"===t?.5:"start"===t?-1:1,s=400/this._card.viewBox.width;this.svg.xpx=this.svg.cx,this.svg.ypx=this.svg.cy,!this._card.isSafari&&!this._card.iOS||this._card.isSafari16?(this.svg.xpx=this.svg.cx-this.svg.iconPixels*e,this.svg.ypx=this.svg.cy-this.svg.iconPixels*e,this.dev.debug&&console.log("EntityIconTool::_renderIcon - svg values =",this.toolId,this.svg,this.config.cx,this.config.cy,t,e)):(this.svg.iconSize*=s,this.svg.iconPixels*=s,this.svg.xpx=this.svg.xpx*s-this.svg.iconPixels*e*s,this.svg.ypx=this.svg.ypx*s-.9*this.svg.iconPixels*s,this.svg.xpx=this.svg.cx*s-this.svg.iconPixels*e*s,this.svg.ypx=this.svg.cy*s-this.svg.iconPixels*e*s)}if(this.alternateColor||(this.alternateColor="rgba(0,0,0,0)"),Ut.sakIconCache[t])this.iconSvg=Ut.sakIconCache[t];else{const e=this._card.shadowRoot.getElementById("icon-".concat(this.toolId))?.shadowRoot?.querySelectorAll("*");this.iconSvg=e?e[0]?.path:void 0,this.iconSvg&&(Ut.sakIconCache[t]=this.iconSvg)}let e;return this.iconSvg?(this.svg.iconSize=this.config.position.icon_size?this.config.position.icon_size:2,this.svg.iconPixels=bt.calculateSvgDimension(this.svg.iconSize),this.svg.x1=this.svg.cx-this.svg.iconPixels/2,this.svg.y1=this.svg.cy-this.svg.iconPixels/2,this.svg.x1=this.svg.cx-.5*this.svg.iconPixels,this.svg.y1=this.svg.cy-.5*this.svg.iconPixels,e=this.svg.iconPixels/24,F`
        <g id="icon-${this.toolId}" class="${kt(this.classes.icon)}" style="${nt(this.styles.icon)}" x="${this.svg.x1}px" y="${this.svg.y1}px" transform-origin="${this.svg.cx} ${this.svg.cy}">
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
        `}_handleAnimationEvent(t,e){t.stopPropagation(),t.preventDefault(),e.iconSvg=this._card.shadowRoot.getElementById("icon-".concat(this.toolId))?.shadowRoot?.querySelectorAll("*")[0]?.path,e.iconSvg&&e._card.requestUpdate()}firstUpdated(t){}render(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.icon),F`
      <g "" id="icongrp-${this.toolId}" class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)} >

        ${this._renderIcon()}
      </g>
    `}}class qt extends At{constructor(t,e,s){super(t,yt.mergeDeep({classes:{tool:{"sak-name":!0,hover:!0},name:{"sak-name__name":!0}},styles:{tool:{},name:{}}},e),s),this._name={},this.classes.tool={},this.classes.name={},this.styles.tool={},this.styles.name={},this.dev.debug&&console.log("EntityName constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_buildName(t,e){return this.activeAnimation?.name||e.name||t.attributes.friendly_name}_renderEntityName(){this.MergeAnimationClassIfChanged(),this.MergeColorFromState(this.styles.name),this.MergeAnimationStyleIfChanged();const t=this.textEllipsis(this._buildName(this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]),this.config?.show?.ellipsis);return F`
        <text>
          <tspan class="${kt(this.classes.name)}" x="${this.svg.cx}" y="${this.svg.cy}" style="${nt(this.styles.name)}">${t}</tspan>
        </text>
      `}render(){return F`
      <g id="name-${this.toolId}"
        class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderEntityName()}
      </g>
    `}}var jt=function(){return jt=Object.assign||function(t){for(var e,s=1,i=arguments.length;s<i;s++)for(var a in e=arguments[s])Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t},jt.apply(this,arguments)};function Ht(t,e,s){void 0===e&&(e=Date.now()),void 0===s&&(s={});var i=jt(jt({},Yt),s||{}),a=(+t-+e)/1e3;if(Math.abs(a)<i.second)return{value:Math.round(a),unit:"second"};var o=a/60;if(Math.abs(o)<i.minute)return{value:Math.round(o),unit:"minute"};var r=a/3600;if(Math.abs(r)<i.hour)return{value:Math.round(r),unit:"hour"};var n=a/86400;if(Math.abs(n)<i.day)return{value:Math.round(n),unit:"day"};var h=new Date(t),l=new Date(e),c=h.getFullYear()-l.getFullYear();if(Math.round(Math.abs(c))>0)return{value:Math.round(c),unit:"year"};var d=12*c+h.getMonth()-l.getMonth();if(Math.round(Math.abs(d))>0)return{value:Math.round(d),unit:"month"};var g=a/604800;return{value:Math.round(g),unit:"week"}}var Wt,Yt={second:45,minute:45,hour:22,day:5};!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(Wt=Wt||(Wt={}));const Jt=(t,e,s)=>{const i=e?(t=>{switch(t.number_format){case Wt.comma_decimal:return["en-US","en"];case Wt.decimal_comma:return["de","es","it"];case Wt.space_comma:return["fr","sv","cs"];case Wt.system:return;default:return t.language}})(e):void 0;if(Number.isNaN=Number.isNaN||function t(e){return"number"==typeof e&&t(e)},e?.number_format!==Wt.none&&!Number.isNaN(Number(t))&&Intl)try{return new Intl.NumberFormat(i,Xt(t,s)).format(Number(t))}catch(a){return console.error(a),new Intl.NumberFormat(void 0,Xt(t,s)).format(Number(t))}return!Number.isNaN(Number(t))&&""!==t&&e?.number_format===Wt.none&&Intl?new Intl.NumberFormat("en-US",Xt(t,{...s,useGrouping:!1})).format(Number(t)):"string"==typeof t?t:`${((t,e=2)=>Math.round(t*10**e)/10**e)(t,s?.maximumFractionDigits).toString()}${"currency"===s?.style?` ${s.currency}`:""}`},Xt=(t,e)=>{const s={maximumFractionDigits:2,...e};if("string"!=typeof t)return s;if(!e||void 0===e.minimumFractionDigits&&void 0===e.maximumFractionDigits){const e=t.indexOf(".")>-1?t.split(".")[1].length:0;s.minimumFractionDigits=e,s.maximumFractionDigits=e}return s};var Zt=Number.isNaN||function(t){return"number"==typeof t&&t!=t};function Kt(t,e){if(t.length!==e.length)return!1;for(var s=0;s<t.length;s++)if(i=t[s],a=e[s],!(i===a||Zt(i)&&Zt(a)))return!1;var i,a;return!0}function Qt(t,e){void 0===e&&(e=Kt);var s=null;function i(){for(var i=[],a=0;a<arguments.length;a++)i[a]=arguments[a];if(s&&s.lastThis===this&&e(i,s.lastArgs))return s.lastResult;var o=t.apply(this,i);return s={lastResult:o,lastArgs:i,lastThis:this},o}return i.clear=function(){s=null},i}const te=Qt((t=>new Intl.DateTimeFormat(t.language,{weekday:"long",month:"long",day:"numeric"}))),ee=Qt((t=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric"}))),se=Qt((t=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"numeric",day:"numeric"}))),ie=(t,e)=>ae(e).format(t),ae=Qt((t=>new Intl.DateTimeFormat(t.language,{day:"numeric",month:"short"}))),oe=Qt((t=>new Intl.DateTimeFormat(t.language,{month:"long",year:"numeric"}))),re=Qt((t=>new Intl.DateTimeFormat(t.language,{month:"long"})));Qt((t=>new Intl.DateTimeFormat(t.language,{year:"numeric"})));const ne=Qt((t=>new Intl.DateTimeFormat(t.language,{weekday:"long"}))),he=Qt((t=>new Intl.DateTimeFormat(t.language,{weekday:"short"})));var le;!function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(le=le||(le={}));const ce=Qt((t=>{if(t.time_format===le.language||t.time_format===le.system){const e=t.time_format===le.language?t.language:void 0,s=(new Date).toLocaleString(e);return s.includes("AM")||s.includes("PM")}return t.time_format===le.am_pm})),de=Qt((t=>new Intl.DateTimeFormat("en"!==t.language||ce(t)?t.language:"en-u-hc-h23",{hour:"numeric",minute:"2-digit",hour12:ce(t)}))),ge=Qt((t=>new Intl.DateTimeFormat("en"!==t.language||ce(t)?t.language:"en-u-hc-h23",{hour:ce(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:ce(t)}))),ue=Qt((t=>new Intl.DateTimeFormat("en"!==t.language||ce(t)?t.language:"en-u-hc-h23",{weekday:"long",hour:ce(t)?"numeric":"2-digit",minute:"2-digit",hour12:ce(t)}))),me=t=>pe().format(t),pe=Qt((()=>new Intl.DateTimeFormat("en-GB",{hour:"numeric",minute:"2-digit",hour12:!1}))),fe=Qt((t=>new Intl.DateTimeFormat("en"!==t.language||ce(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:ce(t)?"numeric":"2-digit",minute:"2-digit",hour12:ce(t)}))),ve=Qt((t=>new Intl.DateTimeFormat("en"!==t.language||ce(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"short",day:"numeric",hour:ce(t)?"numeric":"2-digit",minute:"2-digit",hour12:ce(t)}))),_e=Qt((t=>new Intl.DateTimeFormat("en"!==t.language||ce(t)?t.language:"en-u-hc-h23",{month:"short",day:"numeric",hour:ce(t)?"numeric":"2-digit",minute:"2-digit",hour12:ce(t)}))),ye=Qt((t=>new Intl.DateTimeFormat("en"!==t.language||ce(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:ce(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:ce(t)}))),be=Qt((t=>new Intl.DateTimeFormat("en"!==t.language||ce(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",hour12:ce(t)}))),we=(t,e=2)=>{let s=`${t}`;for(let i=1;i<e;i++)s=parseInt(s)<10**i?`0${s}`:s;return s};const xe={ms:1,s:1e3,min:6e4,h:36e5,d:864e5},$e=(t,e)=>function(t){const e=Math.floor(t/1e3/3600),s=Math.floor(t/1e3%3600/60),i=Math.floor(t/1e3%3600%60),a=Math.floor(t%1e3);return e>0?`${e}:${we(s)}:${we(i)}`:s>0?`${s}:${we(i)}`:i>0||a>0?`${i}${a>0?`.${we(a,3)}`:""}`:null}(parseFloat(t)*xe[e])||"0";class ke extends At{constructor(t,e,s){super(t,yt.mergeDeep({show:{uom:"end"},classes:{tool:{"sak-state":!0,hover:!0},state:{"sak-state__value":!0},uom:{"sak-state__uom":!0}},styles:{tool:{},state:{},uom:{}}},e),s),this.classes.tool={},this.classes.state={},this.classes.uom={},this.styles.tool={},this.styles.state={},this.styles.uom={},this.dev.debug&&console.log("EntityStateTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}static testTimeDate=!1;set value(t){super.value=t}formatStateString(t,e){const s=this._card._hass.selectedLanguage||this._card._hass.language;let i={};if(i.language=s,["relative","total","datetime","datetime-short","datetime-short_with-year","datetime_seconds","datetime-numeric","date","date_month","date_month_year","date-short","date-numeric","date_weekday","date_weekday_day","date_weekday-short","time","time-24h","time-24h_date-short","time_weekday","time_seconds"].includes(e.format)){const a=new Date(t);if(!(a instanceof Date)||isNaN(a.getTime()))return t;let o;switch(e.format){case"relative":const t=Ht(a,new Date);o=new Intl.RelativeTimeFormat(s,{numeric:"auto"}).format(t.value,t.unit);break;case"total":case"precision":o="Not Yet Supported";break;case"datetime":o=((t,e)=>fe(e).format(t))(a,i);break;case"datetime-short":o=((t,e)=>_e(e).format(t))(a,i);break;case"datetime-short_with-year":o=((t,e)=>ve(e).format(t))(a,i);break;case"datetime_seconds":o=((t,e)=>ye(e).format(t))(a,i);break;case"datetime-numeric":o=((t,e)=>be(e).format(t))(a,i);break;case"date":o=((t,e)=>ee(e).format(t))(a,i);break;case"date_month":o=((t,e)=>re(e).format(t))(a,i);break;case"date_month_year":o=((t,e)=>oe(e).format(t))(a,i);break;case"date-short":o=ie(a,i);break;case"date-numeric":o=((t,e)=>se(e).format(t))(a,i);break;case"date_weekday":o=((t,e)=>ne(e).format(t))(a,i);break;case"date_weekday-short":o=((t,e)=>he(e).format(t))(a,i);break;case"date_weekday_day":o=((t,e)=>te(e).format(t))(a,i);break;case"time":o=((t,e)=>de(e).format(t))(a,i);break;case"time-24h":o=me(a);break;case"time-24h_date-short":const e=Ht(a,new Date);o=["second","minute","hour"].includes(e.unit)?me(a):ie(a,i);break;case"time_weekday":o=((t,e)=>ue(e).format(t))(a,i);break;case"time_seconds":o=((t,e)=>ge(e).format(t))(a,i)}return o}return isNaN(parseFloat(t))||!isFinite(t)?t:"brightness"===e.format||"brightness_pct"===e.format?`${Math.round(t/255*100)} %`:"duration"===e.format?$e(t,"s"):void 0}_renderState(){this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.state);let t=this._stateValue;const e=this._card.entities[this.defaultEntityIndex()];if(void 0===e)return F``;if([void 0,"undefined"].includes(t))return F``;if(void 0===t)return F``;const s=this._card._hass.entities[e.entity_id],i=this._card._hass.states[e.entity_id],a=this._card.config.entities[this.defaultEntityIndex()],o=Rt(this._card.entities[this.defaultEntityIndex()].entity_id),r=this.config.locale_tag?this.config.locale_tag+t.toLowerCase():void 0;if(void 0!==a.format&&void 0!==t&&(t=this.formatStateString(t,a)),(t&&isNaN(t)&&!a.secondary_info||a.attribute)&&(t=r&&this._card._hass.localize(r)||s?.translation_key&&this._card._hass.localize(`component.${s.platform}.entity.${o}.${s.translation_key}.state.${t}`)||i?.attributes?.device_class&&this._card._hass.localize(`component.${o}.entity_component.${i.attributes.device_class}.state.${t}`)||this._card._hass.localize(`component.${o}.entity_component._.state.${t}`)||t,t=this.textEllipsis(t,this.config?.show?.ellipsis)),["undefined","unknown","unavailable","-ua-"].includes(t)&&(t=this._card._hass.localize(`state.default.${t}`)),!isNaN(t)){let e={};e=Xt(t,e),void 0!==this._card.config.entities[this.defaultEntityIndex()].decimals&&(e.maximumFractionDigits=this._card.config.entities[this.defaultEntityIndex()].decimals,e.minimumFractionDigits=e.maximumFractionDigits),t=Jt(t,this._card._hass.locale,e)}return F`
      <tspan class="${kt(this.classes.state)}" x="${this.svg.x}" y="${this.svg.y}"
        style="${nt(this.styles.state)}">
        ${this.config?.text?.before?this.config.text.before:""}${t}${this.config?.text?.after?this.config.text.after:""}</tspan>
    `}_renderUom(){if("none"===this.config.show.uom||void 0===this._stateValue)return F``;{this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.uom);let t=this.styles.state["font-size"],e=.5,s="em";const i=t.match(/\D+|\d*\.?\d+/g);2===i.length?(e=.6*Number(i[0]),s=i[1]):console.error("Cannot determine font-size for state/unit",t),t={"font-size":e+s},this.styles.uom=yt.mergeDeep(this.config.styles.uom,this.styles.uom,t);const a=this._card._buildUom(this.derivedEntity,this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]);return"end"===this.config.show.uom?F`
          <tspan class="${kt(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${nt(this.styles.uom)}">
            ${a}</tspan>
        `:"bottom"===this.config.show.uom?F`
          <tspan class="${kt(this.classes.uom)}" x="${this.svg.x}" dy="1.5em"
            style="${nt(this.styles.uom)}">
            ${a}</tspan>
        `:"top"===this.config.show.uom?F`
          <tspan class="${kt(this.classes.uom)}" x="${this.svg.x}" dy="-1.5em"
            style="${nt(this.styles.uom)}">
            ${a}</tspan>
        `:F``}}firstUpdated(t){}updated(t){}render(){return F`
    <svg overflow="visible" id="state-${this.toolId}"
      class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}">
        <text @click=${t=>this.handleTapEvent(t,this.config)}>
          ${this._renderState()}
          ${this._renderUom()}
        </text>
      </svg>
      `}}const Se=36e5;class Me{constructor(t,e,s,i,a=[],o=[],r={}){this.aggregateFuncMap={avg:this._average,median:this._median,max:this._maximum,min:this._minimum,first:this._first,last:this._last,sum:this._sum,delta:this._delta,diff:this._diff},this.config=i,this.graphArea={},this.graphArea.x=0,this.graphArea.y=0,this.graphArea.width=t-2*this.graphArea.x,this.graphArea.height=e-2*this.graphArea.y,this.drawArea={},this.drawArea.x=s.l,this.drawArea.y=s.t,this.drawArea.top=s.t,this.drawArea.bottom=s.b,this.drawArea.width=t-(s.l+s.r),this.drawArea.height=e-(s.t+s.b),this._history=void 0,this.coords=[],this.width=t,this.height=e,this.margin=s,this._max=0,this._min=0,this.points=this.config.period?.calendar?.bins?.per_hour||this.config.period?.rolling_window?.bins?.per_hour||1,this.hours=this.config.period?.calendar?.duration?.hour||this.config.period?.rolling_window?.duration?.hour||24,this.aggregateFuncName=this.config.state_values.aggregate_func,this._calcPoint=this.aggregateFuncMap[this.aggregateFuncName]||this._average,this._smoothing=this.config.state_values?.smoothing,this._logarithmic=this.config.state_values?.logarithmic,this._groupBy=this.config.period.groupBy,this._endTime=0,this.valuesPerBucket=0,this.levelCount=1,this.gradeValues=a,this.gradeRanks=o,this.stateMap={...r},this.radialBarcodeSize=bt.calculateSvgDimension(this.config?.radial_barcode?.size||5)}get max(){return this._max}set max(t){this._max=t}get min(){return this._min}set min(t){this._min=t}set history(t){this._history=t}update(t=void 0){if(t&&(this._history=t),!this._history)return;if(0===this._history?.length)return;this._updateEndTime();let e=new Date;e.getDate(),this.offsetHours=0,"day"===this.config.period?.calendar?.period&&(e.getHours(),e.getMinutes(),e.getSeconds(),this.offsetHours=Math.abs(24*this.config.period.calendar.offset));const s=this._history.reduce(((t,e)=>this._reducer(t,e)),[]);let i;switch(s[0]&&s[0].length&&(s[0]=[s[0][s[0].length-1]]),this.offsetHours=0,this.config.period.type){case"real_time":i=1,this.hours=1;break;case"calendar":if("day"===this.config.period?.calendar?.period){let t=this.hours;0===this.config.period.calendar.offset?t=e.getHours()+e.getMinutes()/60:this.offsetHours=Math.abs(24*this.config.period.calendar.offset),i=Math.ceil(t*this.points)}break;case"rolling_window":i=Math.ceil(this.hours*this.points)}s.length=i;try{this.coords=this._calcPoints(s)}catch(a){console.log("error in calcpoints")}if(this.min=Math.min(...this.coords.map((t=>Number(t[2])))),this.max=Math.max(...this.coords.map((t=>Number(t[2])))),["line","area"].includes(this.config.show.chart_type)&&(!0===this.config.line?.show_minmax||!0===this.config.area?.show_minmax)){const t=this._history.reduce(((t,e)=>this._reducerMinMax(t,e)),[]);t[0][0]&&t[0][0].length&&(t[0][0]=[t[0][0][t[0][0].length-1]]),t[1][0]&&t[1][0].length&&(t[1][0]=[t[1][0][t[1][0].length-1]]),t[0].length=i,t[1].length=i;const e=[...s],a=[...s];let o=this._calcPoint;this._calcPoint=this.aggregateFuncMap.min,this.coordsMin=[],this.coordsMin=this._calcPoints(e),this._calcPoint=this.aggregateFuncMap.max,this.coordsMax=[],this.coordsMax=this._calcPoints(a),this._calcPoint=o,this.min=Math.min(...this.coordsMin.map((t=>Number(t[2])))),this.max=Math.max(...this.coordsMax.map((t=>Number(t[2]))))}}_reducerMinMax(t,e){const s=(this._endTime-new Date(e.last_changed).getTime())/Se*this.points-this.hours*this.points,i=s<0?Math.floor(Math.abs(s)):0;return t[0]||(t[0]=[]),t[1]||(t[1]=[]),t[0][i]||(t[0][i]={},t[1][i]={}),t[0][i].state=Math.min(t[0][i].state?t[0][i].state:Number.POSITIVE_INFINITY,e.state),t[0][i].haState=Math.min(t[0][i].haState?t[0][i].haState:Number.POSITIVE_INFINITY,e.haState),t[1][i].state=Math.max(t[1][i].state?t[0][i].state:Number.NEGATIVE_INFINITY,e.state),t[1][i].haState=Math.max(t[1][i].haState?t[0][i].haState:Number.NEGATIVE_INFINITY,e.haState),t}_reducer(t,e){const s="day"===this.config.period?.calendar?.period?0===this.config.period.calendar.offset?(new Date).getHours()+(new Date).getMinutes()/60:24:this.hours,i=(this._endTime-new Date(e.last_changed).getTime())/Se*this.points-s*this.points,a=i<0?Math.floor(Math.abs(i)):0;return t[a]||(t[a]=[]),t[a].push(e),t}_calcPoints(t){const e=[];let s=this.drawArea.width/(this.hours*this.points-1);s=Number.isFinite(s)?s:this.drawArea.width;const i=t.filter(Boolean)[0];let a=[this._calcPoint(i),this._lastValue(i)];const o=(t,i)=>{const o=s*i+this.drawArea.x;return t&&(a=[this._calcPoint(t),this._lastValue(t)]),e.push([o,0,t?a[0]:a[1]])};for(let r=0;r<t.length;r+=1)o(t[r],r);return e}_calcY(t){const e=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,s=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,i=(e-s)/this.drawArea.height||1;return t.map((t=>{const e=this._logarithmic?Math.log10(Math.max(1,t[2])):t[2],a=s<0?Math.abs(s):0;e>0&&Math.max(0,s);this.drawArea.height,this.drawArea.y;const o=e>0?this.drawArea.height+1*this.drawArea.top-a/i-(e-Math.max(0,s))/i:this.drawArea.height+1*this.drawArea.top-(0-s)/i,r=this.drawArea.height+1*this.drawArea.y-(e-s)/i;return[t[0],r,t[2],o]}))}_calcLevelY(t){const e=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,s=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,i=(e-s)/this.drawArea.height||1,a=s<0?Math.abs(s):0;let o=[];return t[2].forEach(((t,e)=>{const r=t>=0?this.drawArea.height+1*this.drawArea.top-1*a/i-(t-Math.max(0,s))/i:this.drawArea.height+1*this.drawArea.top-(0-t)/i;return o.push(r),o})),o}getPoints(){let t,e,{coords:s}=this;1===s.length&&(s[1]=[this.width+this.margin.x,0,s[0][2]]),s=this._calcY(this.coords);let i=s[0];s.shift();return s.map(((s,a)=>{t=s,e=this._smoothing?this._midPoint(i[0],i[1],t[0],t[1]):t;const o=this._smoothing?(t[2]+i[2])/2:t[2];return i=t,[e[0],e[1],o,a+1]}))}getPath(){let t,e,{coords:s}=this;1===s.length&&(s[1]=[this.width+this.margin.x,0,s[0][2]]),s=this._calcY(this.coords);let i="",a=s[0];return i+=`M${a[0]},${a[1]}`,s.forEach((s=>{t=s,e=this._smoothing?this._midPoint(a[0],a[1],t[0],t[1]):t,i+=` ${e[0]},${e[1]}`,i+=` Q ${t[0]},${t[1]}`,a=t})),i+=` ${t[0]},${t[1]}`,i}getPathMin(){let t,e,{coordsMin:s}=this;1===s.length&&(s[1]=[this.width+this.margin.x,0,s[0][2]]),s=this._calcY(this.coordsMin);let i="",a=s[0];return i+=`M${a[0]},${a[1]}`,s.forEach((s=>{t=s,e=t,i+=` ${e[0]},${e[1]}`,i+=` Q ${t[0]},${t[1]}`,a=t})),i+=` ${t[0]},${t[1]}`,i}getPathMax(){let t,e,{coordsMax:s}=this;1===s.length&&(s[1]=[this.width+this.margin.x,0,s[0][2]]),s=this._calcY(this.coordsMax);let i="",a=s[s.length-1];return s.reverse().forEach(((s,o,r)=>{t=s,e=t,i+=` ${e[0]},${e[1]}`,i+=` Q ${t[0]},${t[1]}`,a=t})),i+=` ${t[0]},${t[1]}`,i+=`M${a[0]},${a[1]}`,i}computeGradient(t,e){const s=e?Math.log10(Math.max(1,this._max))-Math.log10(Math.max(1,this._min)):this._max-this._min,i=s/(this.graphArea.height-this.margin.b)*this.graphArea.height-s;return t.map(((t,a,o)=>{let r,n;if(t.value>this._max&&o[a+1]){const e=(this._max-o[a+1].value)/(t.value-o[a+1].value);r=Mt.getGradientValue(o[a+1].color,t.color,e)}else if(t.value<this._min&&o[a-1]){const e=(o[a-1].value-this._min)/(o[a-1].value-t.value);r=Mt.getGradientValue(o[a-1].color,t.color,e)}return n=s<=0?0:e?(Math.log10(Math.max(1,this._max))-Math.log10(Math.max(1,t.value)))*(100/s):(this._max-t.value)*(100/(s+i)),{color:r||t.color,offset:n}}))}getAreaMinMax(t,e){let s=t;return s+=` L ${this.coordsMax[this.coordsMax.length-1][0]},\n                ${this.coordsMax[this.coordsMax.length-1][1]}`,s+=e,s+=" z",s}getArea(t){const e=(this._min>=0?this.height:this.height+0-Math.abs(this._min)/(this._max-this._min)*this.height)+1.5*this.drawArea.y;let s=t;return s+=` L ${this.coords[this.coords.length-1][0]+this.drawArea.x}, ${e}`,s+=` L ${this.coords[0][0]}, ${e} z`,s}polarToCartesian(t,e,s,i,a){const o=(a-90)*Math.PI/180;return{x:t+s*Math.cos(o),y:e+i*Math.sin(o)}}_calcRadialBarcodeCoords(t,e,s,i,a,o){const r=this.drawArea.x+this.drawArea.width/2,n=this.drawArea.y+this.drawArea.height/2,h=this.polarToCartesian(r,n,i,a,e),l=this.polarToCartesian(r,n,i,a,t),c=Math.abs(e-t)<=180?"0":"1",d=s?"0":"1",g=i-o,u=a-o;return{start:h,end:l,start2:this.polarToCartesian(r,n,g,u,e),end2:this.polarToCartesian(r,n,g,u,t),largeArcFlag:c,sweepFlag:d}}_calcRadialBarcode(t,e=!1,s=4,i=4){const a=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,o=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,r=this.hours*this.points,n=360/r;let h=0;const l=(a-o)/this.radialBarcodeSize,c=t.map((t=>{const i=e?this.max:t[2];let a,r;switch(this.config.show?.chart_variant){case"sunburst":case"sunburst_centered":a=((this._logarithmic?Math.log10(Math.max(1,i)):i)-o)/l,r=(this.drawArea.width-this.radialBarcodeSize+a)/2;break;case"sunburst_outward":a=((this._logarithmic?Math.log10(Math.max(1,i)):i)-o)/l,r=this.drawArea.width/2-this.radialBarcodeSize+a;break;case"sunburst_inward":a=((this._logarithmic?Math.log10(Math.max(1,i)):i)-o)/l,r=this.drawArea.width/2;break;default:a=this.radialBarcodeSize,r=this.drawArea.width/2}let c=[],d=[],g=[],u=[];const{start:m,end:p,start2:f,end2:v,largeArcFlag:_,sweepFlag:y}=this._calcRadialBarcodeCoords(h+s,h+n-s,true,r,r,a);return h+=n,c.push(m.x,p.x,f.x,v.x),d.push(m.y,p.y,f.y,v.y),g.push(this.drawArea.width/2,this.drawArea.width/2-this.radialBarcodeSize),u.push(this.drawArea.height/2,this.drawArea.height/2-this.radialBarcodeSize),[c,d,i,0,g,u,_,y]}));if(e&&t.length!==r){let e,i;const d=this.max;switch(this.config.show?.chart_variant){case"sunburst":case"sunburst_centered":e=((this._logarithmic?Math.log10(Math.max(1,d)):d)-o)/l,i=(this.drawArea.width-this.radialBarcodeSize+e)/2;break;case"sunburst_outward":e=((this._logarithmic?Math.log10(Math.max(1,d)):d)-o)/l,i=this.drawArea.width/2-this.radialBarcodeSize+e;break;case"sunburst_inward":e=((this._logarithmic?Math.log10(Math.max(1,d)):d)-o)/l,i=this.drawArea.width/2;break;default:e=this.radialBarcodeSize,i=this.drawArea.width/2}let g=[];for(let o=t.length;o<r;o++){g[o]={},g[o][0]=o,g[o][1]=0,g[o][2]=a;let t=[],r=[],l=[],u=[];const{start:m,end:p,start2:f,end2:v,largeArcFlag:_,sweepFlag:y}=this._calcRadialBarcodeCoords(h+s,h+n-s,true,i,i,e);h+=n,t.push(m.x,p.x,f.x,v.x),r.push(m.y,p.y,f.y,v.y),l.push(this.drawArea.width/2,this.drawArea.width/2-this.radialBarcodeSize),u.push(this.drawArea.height/2,this.drawArea.height/2-this.radialBarcodeSize),c.push([t,r,d,0,l,u,_,y])}}return c}getRadialBarcodeBackground(t,e,s=4,i=4){this.backgroundCoords=[],this.backgroundCoords=[...this.coords];return this._calcRadialBarcode(this.backgroundCoords,!0,s,i).map(((t,e)=>({start:{x:t[0][0],y:t[1][0]},end:{x:t[0][1],y:t[1][1]},start2:{x:t[0][2],y:t[1][2]},end2:{x:t[0][3],y:t[1][3]},radius:{x:t[4][0],y:t[5][0]},radius2:{x:t[4][1],y:t[5][1]},largeArcFlag:t[6],sweepFlag:t[7],value:t[2]})))}getRadialBarcodeBackgroundPaths(){return this.radialBarcodeBackground.map(((t,e)=>{let s,i,a,o,r="0";if(["flower2","flower","rice_grain"].includes(this.config.show?.chart_viz)){if("flower"===this.config.show.chart_viz&&"sunburst_inward"===this.config.show.chart_variant)s=t.radius.x,i=t.radius.y;else{const e=Math.abs(t.start.x-t.end.x),a=Math.abs(t.start.y-t.end.y);s=Math.sqrt(e*e+a*a)/2,i=s}if("flower"===this.config.show.chart_viz&&"sunburst_outward"===this.config.show.chart_variant)a=t.radius2.x,o=t.radius2.y;else{const e=Math.abs(t.start2.x-t.end2.x),s=Math.abs(t.start2.y-t.end2.y);a=Math.sqrt(e*e+s*s)/2,o=a,r=["rice_grain","flower"].includes(this.config.show.chart_viz)?"1":"0"}}else s=t.radius.x,i=t.radius.y,a=t.radius2.x,o=t.radius2.y;return["M",t.start.x,t.start.y,"A",s,i,0,t.largeArcFlag,t.sweepFlag,t.end.x,t.end.y,"L",t.end2.x,t.end2.y,"A",a,o,0,t.largeArcFlag,t.sweepFlag===r?"1":"0",t.start2.x,t.start2.y,"Z"].join(" ")}))}getRadialBarcode(t,e,s=4,i=4){return this._calcRadialBarcode(this.coords,!1,s,i).map(((t,e)=>({start:{x:t[0][0],y:t[1][0]},end:{x:t[0][1],y:t[1][1]},start2:{x:t[0][2],y:t[1][2]},end2:{x:t[0][3],y:t[1][3]},radius:{x:t[4][0],y:t[5][0]},radius2:{x:t[4][1],y:t[5][1]},largeArcFlag:t[6],sweepFlag:t[7],value:t[2]})))}getRadialBarcodePaths(){return this.radialBarcode.map(((t,e)=>{let s,i,a,o,r="0";if(["flower2","flower","rice_grain"].includes(this.config.show?.chart_viz)){if("flower"===this.config.show.chart_viz&&"sunburst_inward"===this.config.show.chart_variant)s=t.radius.x,i=t.radius.y;else{const e=Math.abs(t.start.x-t.end.x),a=Math.abs(t.start.y-t.end.y);s=Math.sqrt(e*e+a*a)/2,i=s}if("flower"===this.config.show.chart_viz&&"sunburst_outward"===this.config.show.chart_variant)a=t.radius2.x,o=t.radius2.y;else{const e=Math.abs(t.start2.x-t.end2.x),s=Math.abs(t.start2.y-t.end2.y);a=Math.sqrt(e*e+s*s)/2,o=a,r=["rice_grain","flower"].includes(this.config.show.chart_viz)?"1":"0"}}else s=t.radius.x,i=t.radius.y,a=t.radius2.x,o=t.radius2.y;return["M",t.start.x,t.start.y,"A",s,i,0,t.largeArcFlag,t.sweepFlag,t.end.x,t.end.y,"L",t.end2.x,t.end2.y,"A",a,o,0,t.largeArcFlag,t.sweepFlag===r?"1":"0",t.start2.x,t.start2.y,"Z"].join(" ")}))}getBarcode(t,e,s=4,i=4){const a=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,o=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,r=this.coords,n=(this.drawArea.width+s)/Math.ceil(this.hours*this.points)/e,h=(a-o)/this.drawArea.height||1;switch(this.config.show.chart_variant){case"audio":return r.map(((i,a)=>({x:n*a*e+n*t+this.drawArea.x,y:this.drawArea.height/2-((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-o)/h/2,height:((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-o)/h,width:n-s/2,value:i[2]})));case"audio_top":return r.map(((i,a)=>({x:n*a*e+n*t+this.drawArea.x,y:0,height:((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-o)/h,width:n-s/2,value:i[2]})));case"audio_bottom":return r.map(((i,a)=>({x:n*a*e+n*t+this.drawArea.x,y:this.drawArea.height/1-((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-o)/h,height:((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-o)/h,width:n-s/2,value:i[2]})));default:return r.map(((i,a)=>({x:n*a*e+n*t+this.drawArea.x,y:0,height:this.drawArea.height,width:n-s/2,value:i[2]})))}}getEqualizer(t,e,s=4,i=4){const a=(this.drawArea.width+s)/Math.ceil(this.hours*this.points)/e;this._max,this._min,this.drawArea.height;this._min<0&&Math.abs(this._min);const o=(this.drawArea.height-this.levelCount*i)/this.levelCount;let r;return this.coords.map(((t,e)=>{let s=[];const i=Math.trunc(t[2]/this.valuesPerBucket),a=Math.trunc(this._min/this.valuesPerBucket);r=i-a,s[0]=t[0],s[1]=[],s[2]=[];for(let o=0;o<r;o++)s[2][o]=this._min+o*this.valuesPerBucket;return s[1]=this._calcLevelY(s),s})).map(((i,r)=>({x:a*r*e+a*t+this.drawArea.x,y:i[1],height:o,width:a-s,value:i[2]})))}getGrades(t,e,s=4,i=4){const a=(this.drawArea.width+s)/Math.ceil(this.hours*this.points)/e,o=(this.drawArea.height-(this.gradeRanks.length-1)*i)/this.gradeRanks.length;let r;return this.coords.map(((t,e)=>{let s=[];const a=this.gradeRanks.length;r=a-0,s[0]=t[0],s[1]=[],s[2]=[];let n=-1,h=0;for(let i=0;i<r;i++){h=0;for(let e=0;e<this.gradeRanks[i].rangeMin.length;e++)t[2]>=this.gradeRanks[i].rangeMin[e]&&t[2]<this.gradeRanks[i].rangeMax[e]&&(h=e,n=i)}for(let l=0;l<=r;l++)l<=n&&(s[2][l]=this.gradeRanks[l].length>h?this.gradeRanks[l].rangeMin[h]:this.gradeRanks[l].rangeMin[0]),s[1][l]=this.drawArea.height+this.margin.t-l*(o+i);return s})).map(((i,r)=>({x:a*r*e+a*t+this.drawArea.x,y:i[1],height:o,width:a-s,value:i[2]})))}getBars(t,e,s=4,i=4){const a=this._calcY(this.coords),o=(this.drawArea.width+s)/Math.ceil(this.hours*this.points)/e,r=(this._max-this._min)/this.drawArea.height||1;return this._min<0&&Math.abs(this._min),a.map(((i,a)=>({x:o*a*e+o*t+this.drawArea.x,y:this._min>0?i[1]:i[3],height:i[2]>0?this._min<0?i[2]/r:(i[2]-this._min)/r:i[1]-i[3],width:o-s,value:i[2]})))}_midPoint(t,e,s,i){return[(t-s)/2+s,(e-i)/2+i]}_average(t){return t.reduce(((t,e)=>t+parseFloat(e.state)),0)/t.length}_median(t){const e=[...t].sort(((t,e)=>parseFloat(t)-parseFloat(e))),s=Math.floor((e.length-1)/2);return e.length%2==1?parseFloat(e[s].state):(parseFloat(e[s].state)+parseFloat(e[s+1].state))/2}_maximum(t){return Math.max(...t.map((t=>t.state)))}_minimum(t){return Math.min(...t.map((t=>t.state)))}_first(t){return parseFloat(t[0].state)}_last(t){return parseFloat(t[t.length-1].state)}_sum(t){return t.reduce(((t,e)=>t+parseFloat(e.state)),0)}_delta(t){return this._maximum(t)-this._minimum(t)}_diff(t){return this._last(t)-this._first(t)}_lastValue(t){return["delta","diff"].includes(this.aggregateFuncName)?0:parseFloat(t[t.length-1].state)||0}_updateEndTime(){if(this._endTime=new Date,"calendar"===this.config.period.type)"day"===this.config.period.calendar.period&&0!==this.config.period.calendar.offset&&(this._endTime.setHours(0,0,0,0),this.hours=24);else switch(this._groupBy){case"month":this._endTime.setMonth(this._endTime.getMonth()+1),this._endTime.setDate(1);break;case"date":this._endTime.setDate(this._endTime.getDate()+1),this._endTime.setHours(0,0,0,0);break;case"hour":this._endTime.setHours(this._endTime.getHours()+1),this._endTime.setMinutes(0,0,0)}}}const Ae=["var(--theme-sys-color-primary)","#3498db","#e74c3c","#9b59b6","#f1c40f","#2ecc71","#1abc9c","#34495e","#e67e22","#7f8c8d","#27ae60","#2980b9","#8e44ad"],Ce=(t,e)=>{for(let s=e,i=t.length;s<i;s+=1)if(null!=t[s].value)return s;throw new Error('Error in threshold interpolation: could not find right-nearest valued stop. Do the first and last thresholds have a set "value"?')},Ee=(t,e)=>{const s=(t=>{if(!t||!t.length)return t;if(null==t[0].value||null==t[t.length-1].value)throw new Error('The first and last thresholds must have a set "value".\n See xyz manual');let e=0,s=null;return t.map(((i,a)=>{if(null!=i.value)return e=a,{...i};null==s?s=Ce(t,a):a>s&&(e=s,s=Ce(t,a));const o=t[e].value,r=(t[s].value-o)/(s-e);return{color:"string"==typeof i?i:i.color,value:r*a+o}}))})(t);try{s.sort(((t,e)=>e.value-t.value))}catch(i){console.log("computeThresholds, error",i,s)}if("smooth"===e)return s;return[].concat(...s.map(((t,e)=>[t,{value:t.value-1e-4,color:s[e+1]?s[e+1].color:t.color}])))};class Te extends At{constructor(t,e,s){const i={position:{cx:50,cy:50,height:25,width:25,margin:.5},period:{type:"unknown",real_time:!1,group_by:"interval"},state_values:{logarithmic:!1,value_factor:0,aggregate_func:"avg",smoothing:!0},value_buckets:10,animate:!0,hour24:!1,font_size:10,line_color:[...Ae],colorstops:{colors:[]},colorstops_transition:"smooth",state_map:{map:[]},cache:!0,color:"var(--primary-color)",radial_barcode:{size:5,line_width:0,face:{hour_marks_count:24}},classes:{tool:{"sak-sparkline":!0,hover:!0},bar:{},line:{"sak-sparkline__line":!0,hover:!0},graded_background:{},graded_foreground:{},radial_barcode_background:{"sak-sparkline__radial_barcode__background":!0},radial_barcode_face_day_night:{"sak-sparkline__radial_barcode-face_day-night":!0},radial_barcode_face_hour_marks:{"sak-sparkline__radial_barcode-face_hour-marks":!0},radial_barcode_face_hour_numbers:{"sak-sparkline__radial_barcode-face_hour-numbers":!0}},styles:{tool:{},line:{},bar:{},graded_background:{},graded_foreground:{},radial_barcode_background:{},radial_barcode_face_day_night:{},radial_barcode_face_hour_marks:{},radial_barcode_face_hour_numbers:{},area_mask_above:{fill:"url(#sak-sparkline-area-mask-tb-1)"},area_mask_below:{fill:"url(#sak-sparkline-area-mask-bt-1)"},bar_mask_above:{fill:"url(#sak-sparkline-bar-mask-tb-80)"},bar_mask_below:{fill:"url(#sak-sparkline-bar-mask-bt-80)"}},show:{style:"fixedcolor"}},a={calendar:{period:"day",offset:0,duration:{hour:24},bins:{per_hour:1}}},o={rolling_window:{duration:{hour:24},bins:{per_hour:1}}};if(super(t,yt.mergeDeep(i,e),s),this.config.period.real_time?this.config.period.type="real_time":this.config.period?.calendar?(this.config.period.type="calendar",this.config.period=yt.mergeDeep(a,this.config.period)):this.config.period?.rolling_window&&(this.config.period.type="rolling_window",this.config.period=yt.mergeDeep(o,this.config.period)),this.svg.margin={},"object"==typeof this.config.position.margin?(this.svg.margin.t=bt.calculateSvgDimension(this.config.position.margin?.t)||bt.calculateSvgDimension(this.config.position.margin?.y),this.svg.margin.b=bt.calculateSvgDimension(this.config.position.margin?.b)||bt.calculateSvgDimension(this.config.position.margin?.y),this.svg.margin.r=bt.calculateSvgDimension(this.config.position.margin?.r)||bt.calculateSvgDimension(this.config.position.margin?.x),this.svg.margin.l=bt.calculateSvgDimension(this.config.position.margin?.l)||bt.calculateSvgDimension(this.config.position.margin?.x),this.svg.margin.x=this.svg.margin.l,this.svg.margin.y=this.svg.margin.t):(this.svg.margin.x=bt.calculateSvgDimension(this.config.position.margin),this.svg.margin.y=this.svg.margin.x,this.svg.margin.t=this.svg.margin.x,this.svg.margin.r=this.svg.margin.x,this.svg.margin.b=this.svg.margin.x,this.svg.margin.l=this.svg.margin.x),this.svg.clockface={},this.config?.radial_barcode?.face&&(!0===this.config.radial_barcode.face?.show_day_night&&(this.svg.clockface.dayNightRadius=bt.calculateSvgDimension(this.config.radial_barcode.face.day_night_radius)),!0===this.config.radial_barcode.face?.show_hour_marks&&(this.svg.clockface.hourMarksRadius=bt.calculateSvgDimension(this.config.radial_barcode.face.hour_marks_radius)),["absolute","relative"].includes(this.config.radial_barcode.face?.show_hour_numbers)&&(this.svg.clockface.hourNumbersRadius=bt.calculateSvgDimension(this.config.radial_barcode.face.hour_numbers_radius))),this._data=[],this._bars=[],this._scale={},this._needsRendering=!1,this.classes.tool={},this.classes.bar={},this.classes.radial_barcode_face_day_night={},this.classes.radial_barcode_face_hour_marks={},this.classes.radial_barcode_face_hour_numbers={},this.classes.barcode={},this.classes.barcode_graph={},this.styles.barcode={},this.styles.barcode_graph={},this.classes.traffic_light={},this.classes.graded_background={},this.styles.graded_background={},this.classes.graded_foreground={},this.styles.graded_foreground={},this.classes.equalizer_part={},this.styles.equalizer_part={},this.classes.radial_barcode={},this.classes.radial_barcode_background={},this.classes.radial_barcode_graph={},this.styles.radial_barcode={},this.styles.radial_barcode_background={},this.styles.radial_barcode_graph={},this.classes.helper_line1={},this.classes.helper_line2={},this.classes.helper_line3={},this.styles.helper_line1={},this.styles.helper_line2={},this.styles.helper_line3={},this.styles.tool={},this.styles.bar={},this.styles.line={},this.styles.radial_barcode_face_day_night={},this.styles.radial_barcode_face_hour_marks={},this.styles.radial_barcode_face_hour_numbers={},this.stylesBar={},this.seriesIndex=0,this.id=this.toolId,this.bound=[0,0],this.boundSecondary=[0,0],this.length=[],this.entity=[],this.line=[],this.lineMin=[],this.lineMax=[],this.bar=[],this.equalizer=[],this.graded=[],this.abs=[],this.area=[],this.areaMinMax=[],this.points=[],this.gradient=[],this.tooltip={},this.updateQueue=[],this.updating=!1,this.stateChanged=!1,this.initial=!0,this._md5Config=void 0,this.radialBarcodeChart=[],this.radialBarcodeChartBackground=[],this.barcodeChart=[],this.config.width=this.svg.width,this.config.height=this.svg.height,this.svg.line_width=bt.calculateSvgDimension(this.config[this.config.show.chart_type]?.line_width||this.config.line_width||0),this.svg.column_spacing=bt.calculateSvgDimension(this.config[this.config.show.chart_type]?.column_spacing||this.config.bar_spacing||1),this.svg.row_spacing=bt.calculateSvgDimension(this.config[this.config.show.chart_type]?.row_spacing||this.config.bar_spacing||1),this.gradeValues=[],this.config.colorstops.colors.map(((t,e)=>this.gradeValues[e]=t.value)),this.stops=yt.mergeDeep(...this.config.colorstops.colors),this.gradeRanks=[],this.config.colorstops.colors.map(((t,e)=>{let s;s="rank_order"===this.config.show?.chart_variant&&void 0!==t.rank?t.rank:e,this.gradeRanks[s]||(this.gradeRanks[s]={},this.gradeRanks[s].value=[],this.gradeRanks[s].rangeMin=[],this.gradeRanks[s].rangeMax=[]),this.gradeRanks[s].rank=s,this.gradeRanks[s].color=t.color;let i=t.value,a=this.config.colorstops.colors[e+1]?.value||1/0;return this.gradeRanks[s].value.push(t.value),this.gradeRanks[s].rangeMin.push(i),this.gradeRanks[s].rangeMax.push(a),!0})),this.config.colorstops.colors=Ee(this.config.colorstops.colors,this.config.colorstops_transition),this.radialBarcodeChartWidth=bt.calculateSvgDimension(this.config?.radial_barcode?.size||5),this.svg.graph={},this.svg.graph.height=this.svg.height-0*this.svg.margin.y,this.svg.graph.width=this.svg.width-0*this.svg.margin.x,this.config.state_map.map.forEach(((t,e)=>{"string"==typeof t&&(this.config.state_map.map[e]={value:t,label:t}),this.config.state_map.map[e].label=this.config.state_map.map[e].label||this.config.state_map.map[e].value})),this.xLines={},this.xLines.lines=[],"object"==typeof this.config.x_lines?.lines){let t=0;this.config.x_lines.lines.forEach((e=>{this.xLines.lines[t]={id:e.name,zpos:e?.zpos||"above",yshift:bt.calculateSvgDimension(e?.yshift)||0},t+=1}))}"object"==typeof this.config.x_lines?.numbers&&(this.xLines.numbers={...this.config.x_lines.numbers}),this.config.state_values.smoothing=((...t)=>t.find((t=>void 0!==t)))(this.config.state_values.smoothing,!this._card.config.entities[this.defaultEntityIndex()].entity.startsWith("binary_sensor.")),this.Graph=[],this.Graph[0]=new Me(this.svg.graph.width,this.svg.graph.height,this.svg.margin,this.config,this.gradeValues,this.gradeRanks,this.config.state_map),this._firstDataReceived=!1}set value(t){if(this._stateValue===t)return!1;const e=super.value=t;if("real_time"===this.config.period.type){const e=[{state:t}];this.series=e}return e}set data(t){}set series(t){if(this.dev&&this.dev.fakeData){let e=40;for(let s=0;s<t.length;s++)s<t.length/2&&(e-=4*s),s>t.length/2&&(e+=3*s),t[s].state=e}if(!0===this._card.config.entities[0].fixed_value){const e=t[t.length-1];t=[e,e]}this.seriesIndex=0,this.Graph[this.seriesIndex].update(t),this.updateBounds();let{config:e}=this;if(e.show.chart_type){let t=0;const s=0;if(!this._card.config.entities[this.defaultEntityIndex()]||0===this.Graph[s].coords.length)return;const i="secondary"===this._card.config.entities[s].states?this.boundSecondary:this.bound;[this.Graph[s].min,this.Graph[s].max]=[i[0],i[1]];const a=this.visibleEntities.length;if("bar"===e.show.chart_type)this.bar[s]=this.Graph[s].getBars(t,a,this.svg.colomn_spacing),t+=1,e.colorstops.colors.length>0&&!this._card.config.entities[s].color&&(this.gradient[s]=this.Graph[s].computeGradient(e.colorstops.colors,this.config.state_values.logarithmic));else if(["area","line"].includes(e.show.chart_type)){const t=this.Graph[s].getPath();!1!==this._card.config.entities[s].show_line&&(this.line[s]=t)}if("area"===e.show.chart_type&&(this.area[s]=this.Graph[s].getArea(this.line[s])),e?.line?.show_minmax||e?.area?.show_minmax){const t=this.Graph[s].getPathMin(),e=this.Graph[s].getPathMax();this.lineMin[s]=t,this.lineMax[s]=e,this.areaMinMax[s]=this.Graph[s].getAreaMinMax(t,e)}"dots"===e.show.chart_type||!0===e?.area?.show_dots||!0===e?.line?.show_dots?this.points[s]=this.Graph[s].getPoints():"equalizer"===this.config.show.chart_type?(this.Graph[s].levelCount=this.config.value_buckets,this.Graph[s].valuesPerBucket=(this.Graph[s].max-this.Graph[s].min)/this.config.value_buckets,this.equalizer[s]=this.Graph[s].getEqualizer(0,this.visibleEntities.length,this.svg.column_spacing,this.svg.row_spacing)):"graded"===this.config.show.chart_type?(this.Graph[s].levelCount=this.config.value_buckets,this.Graph[s].valuesPerBucket=(this.Graph[s].max-this.Graph[s].min)/this.config.value_buckets,this.graded[s]=this.Graph[s].getGrades(0,this.visibleEntities.length,this.svg.column_spacing,this.svg.row_spacing)):"radial_barcode"===this.config.show.chart_type?(this.radialBarcodeChartBackground[s]=this.Graph[s].getRadialBarcodeBackground(0,this.visibleEntities.length,this.svg.column_spacing,this.svg.row_spacing),this.radialBarcodeChart[s]=this.Graph[s].getRadialBarcode(0,this.visibleEntities.length,this.svg.column_spacing,this.svg.row_spacing),this.Graph[s].radialBarcodeBackground=this.radialBarcodeChartBackground[s],this.Graph[s].radialBarcode=this.radialBarcodeChart[s]):"barcode"===this.config.show.chart_type&&(this.barcodeChart[s]=this.Graph[s].getBarcode(0,this.visibleEntities.length,this.svg.column_spacing,this.svg.row_spacing),this.Graph[s].barcodeChart=this.barcodeChart[s]),e.colorstops.colors.length>0&&!this._card.config.entities[s].color&&(this.gradient[s]=this.Graph[s].computeGradient(e.colorstops.colors,this.config.state_values.logarithmic)),this.line=[...this.line]}this.updating=!1,this._firstUpdatedCalled?(this._firstUpdatedCalled=!1,this._firstDataReceived=!0):(this._firstUpdatedCalled=!0,this._firstDataReceived=!1)}hasSeries(){return this.defaultEntityIndex()}_convertState(t){const e=this.config.state_map.map.findIndex((e=>e.value===t.state));-1!==e&&(t.state=e)}processStateMap(t){this.config.state_map?.map?.length>0&&t[0].forEach(((e,s)=>{this.config.state_map.map.length>0&&(t[0][s].haState=e.state),this._convertState(e),t[0][s].state=e.state})),"bin"===this.config.state_values?.use_value&&t[0].forEach(((e,s)=>{let i=-1,a=!1;a=!1;for(let t=0;t<this.gradeRanks.length;t++)for(let s=0;s<this.gradeRanks[t].rangeMin.length;s++)e.state>=this.gradeRanks[t].rangeMin[s]&&e.state<this.gradeRanks[t].rangeMax[s]&&(a=!0,i=t);a||console.log("processStateMap - ILLEGAL value",e,s);const o=this.gradeRanks[i].rank;t[0][s].haState=e.state,t[0][s].state=o})),0!==this.config.state_values.value_factor&&t[0].forEach(((e,s)=>{t[0][s].haState=e.state,t[0][s].state=e.state*this.config.state_values.value_factor}))}get visibleEntities(){return[1]}get primaryYaxisEntities(){return this.visibleEntities.filter((t=>void 0===t.states||"primary"===t.states))}get secondaryYaxisEntities(){return this.visibleEntities.filter((t=>"secondary"===t.states))}get visibleLegends(){return this.visibleEntities.filter((t=>!1!==t.show_legend))}get primaryYaxisSeries(){return this.primaryYaxisEntities.map(((t,e)=>this.Graph[e]))}get secondaryYaxisSeries(){return this.secondaryYaxisEntities.map((t=>this.Graph[t.index]))}getBoundary(t,e,s,i){if(!(t in Math))throw new Error(`The type "${t}" is not present on the Math object`);return void 0===s?Math[t](...e.map((e=>e[t])))||i:"~"!==s[0]?s:Math[t](Number(s.substr(1)),...e.map((e=>e[t])))}getBoundaries(t,e,s,i,a){let o=[this.getBoundary("min",t,e,i[0],a),this.getBoundary("max",t,s,i[1],a)];if(a){const t=Math.abs(o[0]-o[1]),e=parseFloat(a)-t;e>0&&(o=[o[0]-e/2,o[1]+e/2])}return o}updateBounds({config:t}=this){this.bound=this.getBoundaries(this.primaryYaxisSeries,t.state_values.lower_bound,t.state_values.upper_bound,this.bound,t.state_values.min_bound_range),this.boundSecondary=this.getBoundaries(this.secondaryYaxisSeries,t.state_values.lower_bound_secondary,t.state_values.upper_bound_secondary,this.boundSecondary,t.state_values.min_bound_range_secondary)}computeColor(t,e){const{colorstops:s,line_color:i}=this.config,a=Number(t)||0,o={color:i[e]||i[0],...s.colors.slice(-1)[0],...s.colors.find((t=>t.value<a))};return this._card.config.entities[e].color||o.color}intColor(t,e){const{colorstops:s,line_color:i}=this.config,a=Number(t)||0;let o;if(s.colors.length>0)if("bar"===this.config.show.chart_type){const{color:t}=s.colors.find((t=>t.value<a))||s.colors.slice(-1)[0];o=t}else{const e=s.colors.findIndex((t=>t.value<a)),i=s.colors[e],r=s.colors[e-1];if(r){const e=(r.value-t)/(r.value-i.value);o=Mt.getGradientValue(r.color,i.color,e)}else o=e?s.colors[s.colors.length-1].color:s.colors[0].color}return this._card.config.entities[e].color||o||i[e]||i[0]}getEndDate(){const t=new Date;switch(this.config.period?.group_by){case"date":t.setDate(t.getDate()+1),t.setHours(0,0,0);break;case"hour":t.setHours(t.getHours()+1),t.setMinutes(0,0)}if("day"===this.config.period?.calendar?.period)t.setHours(0,0,0,0);return t}setTooltip(t,e,s,i=null){}renderSvgAreaMask(t,e){if("area"!==this.config.show.chart_type)return;if(!t)return;const s="fade"===this.config.show.fill,i=this.length[e]||!1===this._card.config.entities[e].show_line,a=this.Graph[e]._min>=0?0:Math.abs(this.Graph[e]._min)/(this.Graph[e]._max-this.Graph[e]._min)*100;return F`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${e}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-pos-${this.id}-${e}`}>
        <rect width="100%" height="${100-a}%" fill=${this.config.styles.area_mask_above.fill}
         />
      </mask>
      <linearGradient id=${`fill-grad-neg-${this.id}-${e}`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-neg-${this.id}-${e}`}>
        <rect width="100%" y=${100-a}% height="${a}%" fill=${this.config.styles.area_mask_below.fill}
         />
      </mask>
    </defs>

    <mask id=${`fill-${this.id}-${e}`}>
      <path class='fill'
        type=${this.config.show.fill}
        .id=${e} anim=${this.config.animate} ?init=${i}
        style="animation-delay: ${this.config.animate?.5*e+"s":"0s"}"
        fill='white'
        mask=${s?`url(#fill-grad-mask-pos-${this.id}-${e})`:""}
        d=${this.area[e]}
      />
      ${this.Graph[e]._min<0?F`<path class='fill'
            type=${this.config.show.fill}
            .id=${e} anim=${this.config.animate} ?init=${i}
            style="animation-delay: ${this.config.animate?.5*e+"s":"0s"}"
            fill='white'
            mask=${s?`url(#fill-grad-mask-neg-${this.id}-${e})`:""}
            d=${this.area[e]}
          />`:""}
    </mask>`}renderSvgAreaMinMaxMask(t,e){if(!["area","line"].includes(this.config.show.chart_type))return;if(!t)return;const s="fade"===this.config.show.fill,i=this.length[e]||!1===this._card.config.entities[e].show_line,a=this.Graph[e]._min>=0?0:Math.abs(this.Graph[e]._min)/(this.Graph[e]._max-this.Graph[e]._min)*100;return F`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${e}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-pos-${this.id}-${e}`}>
        <rect width="100%" height="${100-a}%" fill=${this.config.styles.area_mask_above.fill}
         />
      </mask>
      <linearGradient id=${`fill-grad-neg-${this.id}-${e}`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-neg-${this.id}-${e}`}>
        <rect width="100%" y=${100-a}% height="${a}%" fill=${this.config.styles.area_mask_below.fill}
         />
      </mask>
    </defs>

    <mask id=${`fillMinMax-${this.id}-${e}`}>
      <path class='fill'
        type=${this.config.show.fill}
        .id=${e} anim=${this.config.animate} ?init=${i}
        style="animation-delay: ${this.config.animate?.5*e+"s":"0s"}"
        fill='#555555'
        mask=${s?`url(#fill-grad-mask-pos-${this.id}-${e})`:""}
        d=${this.areaMinMax[e]}
      />
      ${this.Graph[e]._min<0?F`<path class='fill'
            type=${this.config.show.fill}
            .id=${e} anim=${this.config.animate} ?init=${i}
            style="animation-delay: ${this.config.animate?.5*e+"s":"0s"}"
            fill='#444444'
            mask=${s?`url(#fill-grad-mask-neg-${this.id}-${e})`:""}
            d=${this.areaMinMax[e]}
          />`:""}
    </mask>`}renderSvgLineMask(t,e){if(!t)return;const s=F`
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
    />`;return F`
    <mask id=${`line-${this.id}-${e}`}>
      ${s}
    </mask>
  `}renderSvgLineMinMaxMask(t,e){if("line"!==this.config.show.chart_type)return;if(!t)return;const s=F`
    <path
      class='lineMinMax'
      .id=${e}
      anim=${this.config.animate} ?init=${this.length[e]}
      style="animation-delay: ${this.config.animate?.5*e+"s":"0s"}"
      fill='none'
      stroke-dasharray=${this.length[e]||"none"} stroke-dashoffset=${this.length[e]||"none"}
      stroke=${"white"}
      stroke-width=${this.svg.line_width}
      d=${this.line[e]}
    />`;return F`
    <mask id=${`lineMinMax-${this.id}-${e}`}>
      ${s}
    </mask>
  `}renderSvgPoint(t,e){const s=this.gradient[e]?this.computeColor(t[2],e):"inherit";return F`
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
  `}renderSvgPoints(t,e){if(!t)return;const s=this.computeColor(this._card.entities[e].state,e);return F`
    <g class='line--points'
      ?tooltip=${this.tooltip.entity===e}
      ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
      ?init=${this.length[e]}
      anim=${this.config.animate&&"hover"!==this.config.show.points}
      style="animation-delay: ${this.config.animate?.5*e+.5+"s":"0s"}"
      fill=${s}
      stroke=${s}
      stroke-width=${this.svg.line_width/2}
      >
      ${t.map((t=>this.renderSvgPoint(t,e)))}
    </g>`}renderSvgTrafficLight(t,e){let s;if(!0===this.config.square&&(s=Math.min(t.width,t.height),s<t.height)){let e=(this.svg.graph.height-this.gradeRanks.length*s)/(this.gradeRanks.length-1);for(let i=0;i<this.gradeRanks.length;i++)t.y[i]=this.svg.graph.height+this.svg.margin.y-i*(s+e);t.height=s,t.width=s}const i=this.gradeRanks.map(((e,s)=>{const i=void 0!==t.value[s],a=i?this.classes.graded_foreground:this.classes.graded_background,o=i?this.styles.graded_foreground:this.styles.graded_background,r=i?this.computeColor(t.value[s]+.001,0):"var(--theme-sys-elevation-surface-neutral4)",n=i?this.styles.graded_foreground?.rx||0:this.styles.graded_background?.rx||0,h=i?this.styles.graded_foreground?.ry||n:this.styles.graded_background?.ry||n;return F`
    <rect class="${kt(a)}" style="${nt(o)}"
      x=${t.x+this.svg.line_width/2}
      y=${t.y[s]-1*t.height+this.svg.line_width/2}
      height=${Math.max(1,t.height-this.svg.line_width)}
      width=${Math.max(1,t.width-this.svg.line_width)}
      stroke-width="${this.svg.line_width?this.svg.line_width:0}"
      fill=${r}
      stroke=${r}
      pathLength="10"
      rx=${n}
      ry=${h}
      >
    </rect>`}));return F`
    ${i}
    `}renderSvgGraded(t,e){if(!t)return;const s=this.computeColor(this._card.entities[e].state,e),i=this.xLines.lines.map((t=>"below"===t.zpos?[F`
        <line class=${kt(this.classes[t.id])}) style="${nt(this.styles[t.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
        x2="${this.svg.graph.width+this.svg.margin.x}" y2="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
        pathLength="240"
        >
        </line>
        `]:[""])),a=this.xLines.lines.map((t=>"above"===t.zpos?[F`
        <line class="${kt(this.classes[t.id])}"
              style="${nt(this.styles[t.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
        x2="${this.svg.graph.width+this.svg.margin.x}" y2="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
        pathLength="240"
        >
        </line>
        `]:[""]));return F`
    <g class='traffic-lights'
      ?tooltip=${this.tooltip.entity===e}
      ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
      ?init=${this.length[e]}
      anim=${this.config.animate&&"hover"!==this.config.show.points}
      style="animation-delay: ${this.config.animate?.5*e+.5+"s":"0s"}"
      fill=${s}
      stroke=${s}
      stroke-width=${this.svg.line_width/2}
      >
      ${i}
      ${t.map((t=>this.renderSvgTrafficLight(t,e)))}
      ${a}
    </g>`}renderSvgGradient(t){if(!t)return;const e=t.map(((t,e)=>{if(t)return F`
      <linearGradient id=${`grad-${this.id}-${e}`} gradientTransform="rotate(90)">
        ${t.map((t=>F`
          <stop stop-color=${t.color} offset=${`${t.offset}%`} />
        `))}
      </linearGradient>`}));return F`${e}`}renderSvgLineBackground(t,e){if(!t)return;const s=this.gradient[e]?`url(#grad-${this.id}-${e})`:this.computeColor(this._card.entities[e].state,e),i=this.xLines.lines.map((t=>"below"===t.zpos?[F`
        <line class=${kt(this.classes[t.id])}) style="${nt(this.styles[t.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
        x2="${this.svg.graph.width+this.svg.margin.x}" y2="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
        pathLength="240"
        >
        </line>
        `]:[""])),a=this.xLines.lines.map((t=>"above"===t.zpos?[F`
        <line class="${kt(this.classes[t.id])}"
              style="${nt(this.styles[t.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
        x2="${this.svg.graph.width+this.svg.margin.x}" y2="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
        pathLength="240"
        >
        </line>
        `]:[""]));return F`
    ${i}
    <rect class='line--rect'
      ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
      id=${`line-rect-${this.id}-${e}`}
      fill=${s} height="100%" width="100%"
      mask=${`url(#line-${this.id}-${e})`}
    />
    ${a}
    `}renderSvgLineMinMaxBackground(t,e){if("line"!==this.config.show.chart_type)return;if(!t)return;const s=this.gradient[e]?`url(#grad-${this.id}-${e})`:this.computeColor(this._card.entities[e].state,e);return F`
    <rect class='line--rect'
      ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
      id=${`line-rect-${this.id}-${e}`}
      fill=${s} height="100%" width="100%"
      mask=${`url(#lineMinMax-${this.id}-${e})`}
    />`}renderSvgAreaBackground(t,e){if("area"!==this.config.show.chart_type)return;if(!t)return;const s=this.gradient[e]?`url(#grad-${this.id}-${e})`:this.intColor(this._card.entities[e].state,e),i=this.xLines.lines.map((t=>"below"===t.zpos?[F`
          <line class=${kt(this.classes[t.id])}) style="${nt(this.styles[t.id])}"
          x1="${this.svg.margin.x}" y1="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
          x2="${this.svg.graph.width+this.svg.margin.x}" y2="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
          pathLength="240"
          >
          </line>
          `]:[""])),a=this.xLines.lines.map((t=>"above"===t.zpos?[F`
          <line class="${kt(this.classes[t.id])}"
                style="${nt(this.styles[t.id])}"
          x1="${this.svg.margin.x}" y1="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
          x2="${this.svg.graph.width+this.svg.margin.x}" y2="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
          pathLength="240"
          >
          </line>
          `]:[""]));return F`
    ${i}
    <rect class='fill--rect'
      ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
      id=${`fill-rect-${this.id}-${e}`}
      fill=${s} height="100%" width="100%"
      mask=${`url(#fill-${this.id}-${e})`}
    />
    ${a}
    `}renderSvgAreaMinMaxBackground(t,e){if(!["area","line"].includes(this.config.show.chart_type))return;if(!t)return;const s=this.gradient[e]?`url(#grad-${this.id}-${e})`:this.intColor(this._card.entities[e].state,e);return F`
    <rect class='fill--rect'
      ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
      id=${`fill-rect-${this.id}-${e}`}
      fill=${s} height="100%" width="100%"
      mask=${`url(#fillMinMax-${this.id}-${e})`}
    />`}renderSvgEqualizerMask(t,e){if("equalizer"!==this.config.show.chart_type)return;if(!t)return;const s="fade"===this.config.show.fill;this.id;const i=`url(#fill-grad-mask-pos-${this.id}-${e}})`,a=this.config.styles.bar_mask_below.fill,o=this.config.styles.bar_mask_above.fill;let r;if(!0===this.config.square&&(r=Math.min(t[0].width,t[0].height),r<t[0].height)){let e=(this.svg.height-this.config.value_buckets*r)/(this.config.value_buckets-1),s=t.map(((t,s)=>{let i={...t};for(let a=0;a<t.y.length;a++)i.y[a]=this.svg.height-a*(r+e);return i.width=r,i.height=r,i}));t=[...s]}const n=t.map(((t,i)=>{const n=t.value.map(((i,n)=>{const h=this.config.animate?F`
        <animate attributeName='y'
          from=${this.svg.height} to=${t.y[n]-1*t.height-this.svg.line_width}
          begin='0s' dur='2s' fill='remove' restart='whenNotActive' repeatCount='1'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`:"";return F`
      <rect class="${kt(this.classes.equalizer_part)}"
            style="${nt(this.styles.equalizer_part)}"
        data-size=${r}
        x=${t.x}
        y=${t.y[n]-t.height-this.svg.line_width/1e5}
        height=${Math.max(1,t.height-this.svg.line_width)}
        width=${Math.max(1,t.width-this.svg.line_width)}
        fill=${s?t.value>0?o:a:"white"}
        stroke=${s?t.value>0?o:a:"white"}
        stroke-width="${this.svg.line_width?this.svg.line_width:0}"
        rx="0%"
        style="transition: fill 5s ease;"
        @mouseover=${()=>this.setTooltip(e,n,i)}
        @mouseout=${()=>this.tooltip={}}>
        ${this._firstUpdatedCalled?h:""}
      </rect>`}));return F`
      ${n}`}));return F`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${e}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='25%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='60%' stop-opacity='0.0'/>
      </linearGradient>
      <linearGradient id=${`fill-grad-neg-${this.id}-${e}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='40%' stop-opacity='0'/>
        <stop stop-color='white' offset='75%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='100%' stop-opacity='1.0'/>
      </linearGradient>

      <mask id=${`fill-grad-mask-pos-${this.id}-${e}`}>
        <rect width="100%" height="100%"}
      </mask>
    </defs>  
    <mask id=${`equalizer-bg-${this.id}-${e}`}>
      ${n}
      mask = ${i}
    </mask>
  `}renderSvgBarsMask(t,e){if("bar"!==this.config.show.chart_type)return;if(!t)return;const s="fade"===this.config.show.fill;this.id;const i=`url(#fill-grad-mask-pos-${this.id}-${e}})`,a=this.config.styles.bar_mask_below.fill,o=this.config.styles.bar_mask_above.fill,r=t.map(((t,i)=>{const r=this.config.animate?F`
        <animate attributeName='y' from=${this.svg.height} to=${t.y} dur='2s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`:"";return F` 

      <rect class='bar' x=${t.x} y=${t.y+(t.value>0?+this.svg.line_width/2:-this.svg.line_width/2)}
        height=${Math.max(1,t.height-this.svg.line_width/1-0)} width=${t.width}
        fill=${s?t.value>0?o:a:"white"}
        stroke=${s?t.value>0?o:a:"white"}
        stroke-width="${this.svg.line_width?this.svg.line_width:0}"
        @mouseover=${()=>this.setTooltip(e,i,t.value)}
        @mouseout=${()=>this.tooltip={}}>
        ${this._firstUpdatedCalled?r:""}
      </rect>`}));return F`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${e}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='25%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='60%' stop-opacity='0.0'/>
      </linearGradient>
      <linearGradient id=${`fill-grad-neg-${this.id}-${e}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='40%' stop-opacity='0'/>
        <stop stop-color='white' offset='75%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='100%' stop-opacity='1.0'/>
      </linearGradient>

      <mask id=${`fill-grad-mask-pos-${this.id}-${e}`}>
        <rect width="100%" height="100%"}
      </mask>
    </defs>  
    <mask id=${`bars-bg-${this.id}-${e}`}>
      ${r}
      mask = ${i}
    </mask>
  `}renderSvgEqualizerBackground(t,e){if("equalizer"!==this.config.show.chart_type)return;if(!t)return;if("fadenever"===this.config.show.fill){this.length[e]||this._card.config.entities[e].show_line;const t=this.gradient[e]?`url(#grad-${this.id}-${e})`:this.intColor(this._card.entities[e].state,e);return this.gradient[e]?this.id:this.intColor(this._card.entities[e].state,e),F`
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
        <rect class='equalizer--bg'
          ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
          id=${`equalizer-bg-${this.id}-${e}`}
          fill=${t} height="100%" width="100%"
          mask=${`url(#equalizer-bg-${this.id}-${e})`}
        />
      /g>`}{const t=this.gradient[e]?`url(#grad-${this.id}-${e})`:this.computeColor(this._card.entities[e].state,e),s=this.xLines.lines.map((t=>"below"===t.zpos?[F`
            <line class=${kt(this.classes[t.id])}) style="${nt(this.styles[t.id])}"
            x1="${this.svg.margin.x}" y1="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
            x2="${this.svg.graph.width+this.svg.margin.x}" y2="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
            pathLength="240"
            >
            </line>
            `]:[""])),i=this.xLines.lines.map((t=>"above"===t.zpos?[F`
            <line class="${kt(this.classes[t.id])}"
                  style="${nt(this.styles[t.id])}"
            x1="${this.svg.margin.x}" y1="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
            x2="${this.svg.graph.width+this.svg.margin.x}" y2="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
            pathLength="240"
            >
            </line>
            `]:[""]));return F`
      ${s}
      <rect class='equalizer--bg'
        ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
        id=${`equalizer-bg-${this.id}-${e}`}
        fill=${t} height="100%" width="100%"
        mask=${`url(#equalizer-bg-${this.id}-${e})`}
      />
      ${i}
      `}}renderSvgBarsBackground(t,e){if("bar"!==this.config.show.chart_type)return;if(!t)return;if("fadenever"===this.config.show.fill){this.length[e]||this._card.config.entities[e].show_line;const t=this.gradient[e]?`url(#grad-${this.id}-${e})`:this.intColor(this._card.entities[e].state,e);return this.gradient[e]?this.id:this.intColor(this._card.entities[e].state,e),F`
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
      /g>`}{const t=this.gradient[e]?`url(#grad-${this.id}-${e})`:this.computeColor(this._card.entities[e].state,e);return F`
      <rect class='bars--bg'
        ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
        id=${`bars-bg-${this.id}-${e}`}
        fill=${t} height="100%" width="100%"
        mask=${`url(#bars-bg-${this.id}-${e})`}
      />`}}renderSvgBars(t,e){if(!t)return;const s=t.map(((t,s)=>{const i=this.config.animate?F`
        <animate attributeName='y' from=${this.svg.height} to=${t.y} dur='2s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`:"",a=this.computeColor(t.value,e);return F` 
      <rect class='bar' x=${t.x} y=${t.y}
        height=${t.height} width=${t.width} fill=${a}
        @mouseover=${()=>this.setTooltip(e,s,t.value)}
        @mouseout=${()=>this.tooltip={}}>
        ${this._firstUpdatedCalled?i:""}
      </rect>`}));return F`<g class='bars' ?anim=${this.config.animate}>${s}</g>`}renderSvgRadialBarcodeBin(t,e,s){const i=this.intColor(t.value,0);return F`
  <path class="${kt(this.classes.clock_graph)}"
        style="${nt(this.styles.clock_graph)}"
    d=${e}
    fill=${i}
    stroke=${i}
  >
  `}renderSvgRadialBarcodeBackgroundBin(t,e,s){return F`
  <path class="${kt(this.classes.radial_barcode_background)}"
        style="${nt(this.styles.radial_barcode_background)}"
    d=${e}
  >
  `}renderSvgRadialBarcodeBackground(t){const{start:e,end:s,start2:i,end2:a,largeArcFlag:o,sweepFlag:r}=this.Graph[0]._calcRadialBarcodeCoords(0,359.9,!0,t,t,this.radialBarcodeChartWidth),n={x:t-this.radialBarcodeChartWidth,y:t-this.radialBarcodeChartWidth},h=["M",e.x,e.y,"A",t,t,0,o,r,s.x,s.y,"L",a.x,a.y,"A",n.x,n.y,0,o,"0"===r?"1":"0",i.x,i.y,"Z"].join(" ");return F`
    <path
      style="fill: lightgray; opacity: 0.4"
      d="${h}"
    />
  `}renderSvgRadialBarcodeFace(t){if(!this.config?.clock?.face)return F``;return F`
    ${(()=>!0===this.config.radial_barcode.face?.show_day_night?F`
          <circle pathLength="1"
          class="${kt(this.classes.radial_barcode_face_day_night)}" style="${nt(this.styles.radial_barcode_face_day_night)}"
          r="${this.svg.clockface.dayNightRadius}" cx=${this.svg.width/2} cy="${this.svg.height/2}"
          />
        `:"")()}
    ${(()=>!0===this.config.radial_barcode.face?.show_hour_marks?F`
        <circle pathLength=${this.config.radial_barcode.face.hour_marks_count}
        class="${kt(this.classes.radial_barcode_face_hour_marks)}" style="${nt(this.styles.radial_barcode_face_hour_marks)}"
        r="${this.svg.clockface.hourMarksRadius}" cx=${this.svg.width/2} cy="${this.svg.height/2}"
        />
       `:"")()}
    ${(()=>"absolute"===this.config.radial_barcode.face?.show_hour_numbers?F`
        <g>
          <text class="${kt(this.classes.radial_barcode_face_hour_numbers)}" style="${nt(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width/2}" y="${this.svg.height/2-this.svg.clockface.hourNumbersRadius}"
            >24</text>
          <text class="${kt(this.classes.radial_barcode_face_hour_numbers)}" style="${nt(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width/2}" y="${this.svg.height/2+this.svg.clockface.hourNumbersRadius}"
            >12</text>
          <text class="${kt(this.classes.radial_barcode_face_hour_numbers)}" style="${nt(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width/2+this.svg.clockface.hourNumbersRadius}" y="${this.svg.height/2}"
            >6</text>
          <text class="${kt(this.classes.radial_barcode_face_hour_numbers)}" style="${nt(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width/2-this.svg.clockface.hourNumbersRadius}" y="${this.svg.height/2}"
            >18</text>
        </g>`:"")()}
    ${(()=>"relative"===this.config.radial_barcode.face?.show_hour_numbers?F`
        <g>
          <text class="${kt(this.classes.radial_barcode_face_hour_numbers)}" style="${nt(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width/2}" y="${this.svg.height/2-this.svg.clockface.hourNumbersRadius}"
            >0</text>
          <text class="${kt(this.classes.radial_barcode_face_hour_numbers)}" style="${nt(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width/2}" y="${this.svg.height/2+this.svg.clockface.hourNumbersRadius}"
            >-12</text>
          <text class="${kt(this.classes.radial_barcode_face_hour_numbers)}" style="${nt(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width/2+this.svg.clockface.hourNumbersRadius}" y="${this.svg.height/2}"
            >-18</text>
          <text class="${kt(this.classes.radial_barcode_face_hour_numbers)}" style="${nt(this.styles.radial_barcode_face_hour_numbers)}"
            x="${this.svg.width/2-this.svg.clockface.hourNumbersRadius}" y="${this.svg.height/2}"
            >-6</text>

        </g>`:"")()}
  `}renderSvgRadialBarcode(t,e){if(!t)return;const s=this.Graph[e].getRadialBarcodePaths(),i=this.Graph[e].getRadialBarcodeBackgroundPaths();return F`
    <g class='graph-clock'
      ?tooltip=${this.tooltip.entity===e}
      ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
      ?init=${this.length[e]}
      anim=${this.config.animate&&"hover"!==this.config.show.points}
      style="animation-delay: ${this.config.animate?.5*e+.5+"s":"0s"}"
      stroke-width=${this.svg.line_width/2}>
      ${this.radialBarcodeChartBackground[e].map(((t,e)=>this.renderSvgRadialBarcodeBackgroundBin(t,i[e],e)))}
      ${t.map(((t,e)=>this.renderSvgRadialBarcodeBin(t,s[e],e)))}
      ${this.renderSvgRadialBarcodeFace(this.svg.width/2-40)}
    </g>`}renderSvgBarcode(t,e){if(!t)return;const s=t.map(((t,s)=>{let i;if("bin"===this.config.state_values?.use_value){const e=Math.floor(t.value);if(this.gradeRanks[e]?.value){const s=this.gradeRanks[e].value[0]+(this.gradeRanks[e].rangeMax[0]-this.gradeRanks[e].rangeMin[0])*(t.value-e);i=this.intColor(s,0)}else console.log("renderbarcode, illegal value",t.value)}else i=this.intColor(t.value,0);const a=this.config.animate?F`
        <animate attributeName='x' from=${this.svg.margin.x} to=${t.x} dur='3s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`:"",o=this.styles.barcode_graph?.rx||0,r=this.styles.barcode_graph?.ry||o;return F` 
      <rect class=${kt(this.classes.barcode_graph)}
            style="${nt(this.styles.barcode_graph)}"
        x=${t.x}
        y=${t.y+this.svg.margin.t+(t.value>0?+this.svg.line_width/2:-this.svg.line_width/2)}
        height=${Math.max(1,t.height-this.svg.margin.t-this.svg.margin.b-this.svg.line_width)}
        width=${Math.max(t.width,1)}
        fill=${i}
        stroke=${i}
        stroke-width="${this.svg.line_width?this.svg.line_width:0}"
        rx="${o}"
        ry="${r}"
        @mouseover=${()=>this.setTooltip(e,s,t.value)}
        @mouseout=${()=>this.tooltip={}}>
        ${this._firstUpdatedCalled?a:""}
      </rect>`})),i=this.xLines.lines.map((t=>"below"===t.zpos?[F`
        <line class=${kt(this.classes[t.id])} style="${nt(this.styles[t.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
        x2="${this.svg.graph.width+this.svg.margin.x}" y2="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
        pathLength="240"
        >
        </line>
        `]:[""])),a=this.xLines.lines.map((t=>"above"===t.zpos?[F`
        <line class="${kt(this.classes[t.id])}"
              style="${nt(this.styles[t.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
        x2="${this.svg.graph.width+this.svg.margin.x}" y2="${this.svg.margin.y+this.svg.graph.height/2+t.yshift}"
        pathLength="240"
        >
        </line>
        `]:[""]));return F`
    <g id="linesBelow">
      ${i}
    </g>
    <g id="rects">
      ${s}
    </g>
    <g id="linesAbove">
      ${a}
    </g>
  `}renderSvg(){return this.config.colorstops.colors.length>0&&!this._card.config.entities[0].color&&(this.gradient[0]=this.Graph[0].computeGradient(this.config.colorstops.colors,this.config.state_values.logarithmic)),this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),F`
  <svg width="${this.svg.width}" height="${this.svg.height}" overflow="visible"
    x="${this.svg.x}" y="${this.svg.y}"
    >
    <g>
        <defs>
          ${this.renderSvgGradient(this.gradient)}
        </defs>
        <svg viewbox="0 0 ${this.svg.width} ${this.svg.height}"
         overflow="visible"
        >
        ${this.area.map(((t,e)=>this.renderSvgAreaMask(t,e)))}
        ${this.area.map(((t,e)=>this.renderSvgAreaBackground(t,e)))}
        ${this.areaMinMax.map(((t,e)=>this.renderSvgAreaMinMaxMask(t,e)))}
        ${this.areaMinMax.map(((t,e)=>this.renderSvgAreaMinMaxBackground(t,e)))}
        ${this.line.map(((t,e)=>this.renderSvgLineMask(t,e)))}
        ${this.line.map(((t,e)=>this.renderSvgLineBackground(t,e)))}
        ${this.bar.map(((t,e)=>this.renderSvgBarsMask(t,e)))}
        ${this.bar.map(((t,e)=>this.renderSvgBarsBackground(t,e)))}
        ${this.equalizer.map(((t,e)=>this.renderSvgEqualizerMask(t,e)))}
        ${this.equalizer.map(((t,e)=>this.renderSvgEqualizerBackground(t,e)))}
        ${this.points.map(((t,e)=>this.renderSvgPoints(t,e)))}
        ${this.barcodeChart.map(((t,e)=>this.renderSvgBarcode(t,e)))}
        ${this.radialBarcodeChart.map(((t,e)=>this.renderSvgRadialBarcode(t,e)))}
        ${this.graded.map(((t,e)=>this.renderSvgGraded(t,e)))}
        </svg>
      </g>
    </svg>`}updated(t){this.config.animate&&t.has("line")&&(this.length.length<this.entity.length?(this._card.shadowRoot.querySelectorAll("svg path.line").forEach((t=>{this.length[t.id]=t.getTotalLength()})),this.length=[...this.length]):this.length=Array(this.entity.length).fill("none"))}render(){return F`
        <g id="graph-${this.toolId}"
          class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}"
          @click=${t=>this.handleTapEvent(t,this.config)}>
          ${this.renderSvg()}
        </g>
      `}}class Ie extends At{constructor(t,e,s){super(t,yt.mergeDeep({position:{cx:50,cy:50,radius:45},card_filter:"card--filter-none",horseshoe_scale:{min:0,max:100,width:3,color:"var(--primary-background-color)"},horseshoe_state:{width:6,color:"var(--primary-color)"},show:{horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"}},e),s),this.HORSESHOE_RADIUS_SIZE=180,this.TICKMARKS_RADIUS_SIZE=172,this.HORSESHOE_PATH_LENGTH=520/360*Math.PI*this.HORSESHOE_RADIUS_SIZE,this.config.entity_index=this.config.entity_index?this.config.entity_index:0,this.svg.radius=bt.calculateSvgDimension(this.config.position.radius),this.svg.radius_ticks=bt.calculateSvgDimension(.95*this.config.position.radius),this.svg.horseshoe_scale={},this.svg.horseshoe_scale.width=bt.calculateSvgDimension(this.config.horseshoe_scale.width),this.svg.horseshoe_state={},this.svg.horseshoe_state.width=bt.calculateSvgDimension(this.config.horseshoe_state.width),this.svg.horseshoe_scale.dasharray=52/36*Math.PI*this.svg.radius,this.svg.rotate={},this.svg.rotate.degrees=-220,this.svg.rotate.cx=this.svg.cx,this.svg.rotate.cy=this.svg.cy,this.colorStops={},this.config.color_stops&&Object.keys(this.config.color_stops).forEach((t=>{this.colorStops[t]=this.config.color_stops[t]})),this.sortedStops=Object.keys(this.colorStops).map((t=>Number(t))).sort(((t,e)=>t-e)),this.colorStopsMinMax={},this.colorStopsMinMax[this.config.horseshoe_scale.min]=this.colorStops[this.sortedStops[0]],this.colorStopsMinMax[this.config.horseshoe_scale.max]=this.colorStops[this.sortedStops[this.sortedStops.length-1]],this.color0=this.colorStops[this.sortedStops[0]],this.color1=this.colorStops[this.sortedStops[this.sortedStops.length-1]],this.angleCoords={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},this.color1_offset="0%",this.dev.debug&&console.log("HorseshoeTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}set value(t){if(this._stateValue===t)return;this._stateValuePrev=this._stateValue||t,this._stateValue=t,this._stateValueIsDirty=!0;const e=this.config.horseshoe_scale.min||0,s=this.config.horseshoe_scale.max||100,i=Math.min(bt.calculateValueBetween(e,s,t),1),a=i*this.HORSESHOE_PATH_LENGTH,o=10*this.HORSESHOE_RADIUS_SIZE;this.dashArray=`${a} ${o}`;const r=this.config.show.horseshoe_style;if("fixed"===r)this.stroke_color=this.config.horseshoe_state.color,this.color0=this.config.horseshoe_state.color,this.color1=this.config.horseshoe_state.color,this.color1_offset="0%";else if("autominmax"===r){const e=Mt.calculateColor(t,this.colorStopsMinMax,!0);this.color0=e,this.color1=e,this.color1_offset="0%"}else if("colorstop"===r||"colorstopgradient"===r){const e=Mt.calculateColor(t,this.colorStops,"colorstopgradient"===r);this.color0=e,this.color1=e,this.color1_offset="0%"}else if("lineargradient"===r){const t={x1:"0%",y1:"0%",x2:"100%",y2:"0%"};this.color1_offset=`${Math.round(100*(1-i))}%`,this.angleCoords=t}this.dev.debug&&console.log("HorseshoeTool set value",this.cardId,t)}_renderTickMarks(){const{config:t}=this;if(!t.show.scale_tickmarks)return;const e=t.horseshoe_scale.color?t.horseshoe_scale.color:"var(--primary-background-color)",s=t.horseshoe_scale.ticksize?t.horseshoe_scale.ticksize:(t.horseshoe_scale.max-t.horseshoe_scale.min)/10,i=t.horseshoe_scale.min%s,a=t.horseshoe_scale.min+(0===i?0:s-i),o=(a-t.horseshoe_scale.min)/(t.horseshoe_scale.max-t.horseshoe_scale.min)*260,r=(t.horseshoe_scale.max-a)/s;let n=Math.floor(r);const h=(260-o)/r;Math.floor(n*s+a)<=t.horseshoe_scale.max&&(n+=1);const l=this.svg.horseshoe_scale.width?this.svg.horseshoe_scale.width/2:3;let c;const d=[];let g;for(g=0;g<n;g++)c=o+(360-g*h-230)*Math.PI/180,d[g]=F`
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

    `}}class Ne extends At{constructor(t,e,s){if(super(t,yt.mergeDeep({position:{orientation:"vertical",length:"10",cx:"50",cy:"50"},classes:{tool:{"sak-line":!0,hover:!0},line:{"sak-line__line":!0}},styles:{tool:{},line:{}}},e),s),!["horizontal","vertical","fromto"].includes(this.config.position.orientation))throw Error("LineTool::constructor - invalid orientation [vertical, horizontal, fromto] = ",this.config.position.orientation);["horizontal","vertical"].includes(this.config.position.orientation)&&(this.svg.length=bt.calculateSvgDimension(e.position.length)),"fromto"===this.config.position.orientation?(this.svg.x1=bt.calculateSvgCoordinate(e.position.x1,this.toolsetPos.cx),this.svg.y1=bt.calculateSvgCoordinate(e.position.y1,this.toolsetPos.cy),this.svg.x2=bt.calculateSvgCoordinate(e.position.x2,this.toolsetPos.cx),this.svg.y2=bt.calculateSvgCoordinate(e.position.y2,this.toolsetPos.cy)):"vertical"===this.config.position.orientation?(this.svg.x1=this.svg.cx,this.svg.y1=this.svg.cy-this.svg.length/2,this.svg.x2=this.svg.cx,this.svg.y2=this.svg.cy+this.svg.length/2):"horizontal"===this.config.position.orientation&&(this.svg.x1=this.svg.cx-this.svg.length/2,this.svg.y1=this.svg.cy,this.svg.x2=this.svg.cx+this.svg.length/2,this.svg.y2=this.svg.cy),this.classes.line={},this.styles.line={},this.dev.debug&&console.log("LineTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_renderLine(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.line),this.dev.debug&&console.log("_renderLine",this.config.position.orientation,this.svg.x1,this.svg.y1,this.svg.x2,this.svg.y2),F`
      <line class="${kt(this.classes.line)}"
        x1="${this.svg.x1}"
        y1="${this.svg.y1}"
        x2="${this.svg.x2}"
        y2="${this.svg.y2}"
        style="${nt(this.styles.line)}"/>
      `}render(){return F`
      <g id="line-${this.toolId}"
        class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderLine()}
      </g>
    `}}class De extends At{constructor(t,e,s){switch(super(t,yt.mergeDeep({descr:"none",position:{cx:50,cy:50,orientation:"horizontal",active:{width:0,height:0,radius:0},track:{width:16,height:7,radius:3.5},thumb:{width:9,height:9,radius:4.5,offset:4.5},label:{placement:"none"}},show:{uom:"end",active:!1},classes:{tool:{"sak-slider":!0,hover:!0},capture:{"sak-slider__capture":!0},active:{"sak-slider__active":!0},track:{"sak-slider__track":!0},thumb:{"sak-slider__thumb":!0},label:{"sak-slider__value":!0},uom:{"sak-slider__uom":!0}},styles:{tool:{},capture:{},active:{},track:{},thumb:{},label:{},uom:{}}},e),s),this.svg.activeTrack={},this.svg.activeTrack.radius=bt.calculateSvgDimension(this.config.position.active.radius),this.svg.activeTrack.height=bt.calculateSvgDimension(this.config.position.active.height),this.svg.activeTrack.width=bt.calculateSvgDimension(this.config.position.active.width),this.svg.track={},this.svg.track.radius=bt.calculateSvgDimension(this.config.position.track.radius),this.svg.thumb={},this.svg.thumb.radius=bt.calculateSvgDimension(this.config.position.thumb.radius),this.svg.thumb.offset=bt.calculateSvgDimension(this.config.position.thumb.offset),this.svg.capture={},this.svg.label={},this.config.position.orientation){case"horizontal":case"vertical":this.svg.capture.width=bt.calculateSvgDimension(this.config.position.capture.width||1.1*this.config.position.track.width),this.svg.capture.height=bt.calculateSvgDimension(this.config.position.capture.height||3*this.config.position.thumb.height),this.svg.track.width=bt.calculateSvgDimension(this.config.position.track.width),this.svg.track.height=bt.calculateSvgDimension(this.config.position.track.height),this.svg.thumb.width=bt.calculateSvgDimension(this.config.position.thumb.width),this.svg.thumb.height=bt.calculateSvgDimension(this.config.position.thumb.height),this.svg.capture.x1=this.svg.cx-this.svg.capture.width/2,this.svg.capture.y1=this.svg.cy-this.svg.capture.height/2,this.svg.track.x1=this.svg.cx-this.svg.track.width/2,this.svg.track.y1=this.svg.cy-this.svg.track.height/2,this.svg.activeTrack.x1="horizontal"===this.config.position.orientation?this.svg.track.x1:this.svg.cx-this.svg.activeTrack.width/2,this.svg.activeTrack.y1=this.svg.cy-this.svg.activeTrack.height/2,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2;break;default:throw console.error("RangeSliderTool - constructor: invalid orientation [vertical, horizontal] = ",this.config.position.orientation),Error("RangeSliderTool::constructor - invalid orientation [vertical, horizontal] = ",this.config.position.orientation)}if("vertical"===this.config.position.orientation)this.svg.track.y2=this.svg.cy+this.svg.track.height/2,this.svg.activeTrack.y2=this.svg.track.y2;switch(this.config.position.label.placement){case"position":this.svg.label.cx=bt.calculateSvgCoordinate(this.config.position.label.cx,0),this.svg.label.cy=bt.calculateSvgCoordinate(this.config.position.label.cy,0);break;case"thumb":this.svg.label.cx=this.svg.cx,this.svg.label.cy=this.svg.cy;break;case"none":break;default:throw console.error("RangeSliderTool - constructor: invalid label placement [none, position, thumb] = ",this.config.position.label.placement),Error("RangeSliderTool::constructor - invalid label placement [none, position, thumb] = ",this.config.position.label.placement)}this.classes.capture={},this.classes.track={},this.classes.thumb={},this.classes.label={},this.classes.uom={},this.styles.capture={},this.styles.track={},this.styles.thumb={},this.styles.label={},this.styles.uom={},this.svg.scale={},this.svg.scale.min=this.valueToSvg(this,this.config.scale.min),this.svg.scale.max=this.valueToSvg(this,this.config.scale.max),this.svg.scale.step=this.config.scale.step,this.dev.debug&&console.log("RangeSliderTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}svgCoordinateToSliderValue(t,e){let s,i,a,o;switch(t.config.position.orientation){case"horizontal":a=e.x-t.svg.track.x1-this.svg.thumb.width/2,i=a/(t.svg.track.width-this.svg.thumb.width);break;case"vertical":o=t.svg.track.y2-this.svg.thumb.height/2-e.y,i=o/(t.svg.track.height-this.svg.thumb.height)}return s=(t.config.scale.max-t.config.scale.min)*i+t.config.scale.min,s=Math.round(s/this.svg.scale.step)*this.svg.scale.step,s=Math.max(Math.min(this.config.scale.max,s),this.config.scale.min),s}valueToSvg(t,e){if("horizontal"===t.config.position.orientation){const s=bt.calculateValueBetween(t.config.scale.min,t.config.scale.max,e)*(t.svg.track.width-this.svg.thumb.width);return t.svg.track.x1+this.svg.thumb.width/2+s}if("vertical"===t.config.position.orientation){const s=bt.calculateValueBetween(t.config.scale.min,t.config.scale.max,e)*(t.svg.track.height-this.svg.thumb.height);return t.svg.track.y2-this.svg.thumb.height/2-s}}updateValue(t,e){this._value=this.svgCoordinateToSliderValue(t,e);Math.abs(0)<.01&&this.rid&&(window.cancelAnimationFrame(this.rid),this.rid=null)}updateThumb(t,e){switch(t.config.position.orientation){default:case"horizontal":if(this.config.position.label.placement,this.dragging){const s="thumb"===this.config.position.label.placement?-50:0,i=`translate(${e.x-this.svg.cx}px , ${s}px)`;t.elements.thumbGroup.style.transform=i}else t.elements.thumbGroup.style.transform=`translate(${e.x-this.svg.cx}px, 0px)`;break;case"vertical":if(this.dragging){const s=`translate(${"thumb"===this.config.position.label.placement?-50:0}px, ${e.y-this.svg.cy}px)`;t.elements.thumbGroup.style.transform=s}else t.elements.thumbGroup.style.transform=`translate(0px, ${e.y-this.svg.cy}px)`}t.updateLabel(t,e)}updateActiveTrack(t,e){if(t.config.show.active)switch(t.config.position.orientation){default:case"horizontal":this.dragging&&t.elements.activeTrack.setAttribute("width",Math.abs(this.svg.activeTrack.x1-e.x+this.svg.cx));break;case"vertical":this.dragging&&(t.elements.activeTrack.setAttribute("y",e.y-this.svg.cy),t.elements.activeTrack.setAttribute("height",Math.abs(t.svg.activeTrack.y2-e.y+this.svg.cx)))}}updateLabel(t,e){this.dev.debug&&console.log("SLIDER - updateLabel start",e,t.config.position.orientation);const s=this._card.config.entities[this.defaultEntityIndex()].decimals||0,i=10**s;t.labelValue2=(Math.round(t.svgCoordinateToSliderValue(t,e)*i)/i).toFixed(s),"none"!==this.config.position.label.placement&&(t.elements.label.textContent=t.labelValue2)}mouseEventToPoint(t){let e=this.elements.svg.createSVGPoint();e.x=t.touches?t.touches[0].clientX:t.clientX,e.y=t.touches?t.touches[0].clientY:t.clientY;const s=this.elements.svg.getScreenCTM().inverse();return e=e.matrixTransform(s),e}callDragService(){void 0!==this.labelValue2&&(this.labelValuePrev!==this.labelValue2&&(this.labelValuePrev=this.labelValue2,this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions.tap_action,this._card.config.entities[this.defaultEntityIndex()]?.entity,this.labelValue2)),this.dragging&&(this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval)))}callTapService(){void 0!==this.labelValue2&&this.labelValuePrev!==this.labelValue2&&(this.labelValuePrev=this.labelValue2,this._processTapEvent(this._card,this._card._hass,this.config,this.config.user_actions?.tap_action,this._card.config.entities[this.defaultEntityIndex()]?.entity,this.labelValue2))}firstUpdated(t){function e(){this.rid=window.requestAnimationFrame(e),this.updateValue(this,this.m),this.updateThumb(this,this.m),this.updateActiveTrack(this,this.m)}function s(t){let s;if(t.preventDefault(),this.dragging){switch(this.m=this.mouseEventToPoint(t),this.config.position.orientation){case"horizontal":s=this.svgCoordinateToSliderValue(this,this.m),this.m.x=this.valueToSvg(this,s),this.m.x=Math.max(this.svg.scale.min,Math.min(this.m.x,this.svg.scale.max)),this.m.x=Math.round(this.m.x/this.svg.scale.step)*this.svg.scale.step;break;case"vertical":s=this.svgCoordinateToSliderValue(this,this.m),this.m.y=this.valueToSvg(this,s),this.m.y=Math.round(this.m.y/this.svg.scale.step)*this.svg.scale.step}e.call(this)}}function i(t){t.preventDefault(),window.addEventListener("pointermove",s.bind(this),!1),window.addEventListener("pointerup",a.bind(this),!1);const i=this.mouseEventToPoint(t),o=this.svg.thumb.x1+this.svg.thumb.cx;i.x>o-10&&i.x<o+this.svg.thumb.width+10?(St(window,"haptic","heavy"),this.dragging=!0,this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(this.config.user_actions.drag_action.update_interval>0?this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval):this.timeOutId=null),this.m=this.mouseEventToPoint(t),"horizontal"===this.config.position.orientation?this.m.x=Math.round(this.m.x/this.svg.scale.step)*this.svg.scale.step:this.m.y=Math.round(this.m.y/this.svg.scale.step)*this.svg.scale.step,this.dev.debug&&console.log("pointerDOWN",Math.round(100*this.m.x)/100),e.call(this)):St(window,"haptic","error")}function a(t){t.preventDefault(),window.removeEventListener("pointermove",s.bind(this),!1),window.removeEventListener("pointerup",a.bind(this),!1),window.removeEventListener("mousemove",s.bind(this),!1),window.removeEventListener("touchmove",s.bind(this),!1),window.removeEventListener("mouseup",a.bind(this),!1),window.removeEventListener("touchend",a.bind(this),!1),this.dragging&&(this.dragging=!1,clearTimeout(this.timeOutId),this.target=0,this.dev.debug&&console.log("pointerUP"),e.call(this),this.callTapService())}this.labelValue=this._stateValue,this.dev.debug&&console.log("slider - firstUpdated"),this.elements={},this.elements.svg=this._card.shadowRoot.getElementById("rangeslider-".concat(this.toolId)),this.elements.capture=this.elements.svg.querySelector("#capture"),this.elements.track=this.elements.svg.querySelector("#rs-track"),this.elements.activeTrack=this.elements.svg.querySelector("#active-track"),this.elements.thumbGroup=this.elements.svg.querySelector("#rs-thumb-group"),this.elements.thumb=this.elements.svg.querySelector("#rs-thumb"),this.elements.label=this.elements.svg.querySelector("#rs-label tspan"),this.dev.debug&&console.log("slider - firstUpdated svg = ",this.elements.svg,"path=",this.elements.path,"thumb=",this.elements.thumb,"label=",this.elements.label,"text=",this.elements.text),this.elements.svg.addEventListener("touchstart",i.bind(this),!1),this.elements.svg.addEventListener("mousedown",i.bind(this),!1)}set value(t){super.value=t,this.dragging||(this.labelValue=this._stateValue)}_renderUom(){if("none"===this.config.show.uom)return F``;{this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.uom);let t=this.styles.label["font-size"],e=.5,s="em";const i=t.match(/\D+|\d*\.?\d+/g);2===i.length?(e=.6*Number(i[0]),s=i[1]):console.error("Cannot determine font-size for state/unit",t),t={"font-size":e+s},this.styles.uom=yt.mergeDeep(this.config.styles.uom,t);const a=this._card._buildUom(this.derivedEntity,this._card.entities[this.defaultEntityIndex()],this._card.config.entities[this.defaultEntityIndex()]);return"end"===this.config.show.uom?F`
          <tspan class="${kt(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${nt(this.styles.uom)}">
            ${a}</tspan>
        `:"bottom"===this.config.show.uom?F`
          <tspan class="${kt(this.classes.uom)}" x="${this.svg.label.cx}" dy="1.5em"
            style="${nt(this.styles.uom)}">
            ${a}</tspan>
        `:"top"===this.config.show.uom?F`
          <tspan class="${kt(this.classes.uom)}" x="${this.svg.label.cx}" dy="-1.5em"
            style="${nt(this.styles.uom)}">
            ${a}</tspan>
        `:F`
          <tspan class="${kt(this.classes.uom)}"  dx="-0.1em" dy="-0.35em"
            style="${nt(this.styles.uom)}">
            ERRR</tspan>
        `}}_renderRangeSlider(){let t,e;switch(this.dev.debug&&console.log("slider - _renderRangeSlider"),this.MergeAnimationClassIfChanged(),this.MergeColorFromState(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(),this.renderValue=this._stateValue,this.dragging?this.renderValue=this.labelValue2:this.elements?.label&&(this.elements.label.textContent=this.renderValue),this.config.position.label.placement){case"none":this.styles.label.display="none",this.styles.uom.display="none";break;case"position":t="horizontal"===this.config.position.orientation?this.valueToSvg(this,Number(this.renderValue))-this.svg.cx:0,e="vertical"===this.config.position.orientation?this.valueToSvg(this,Number(this.renderValue))-this.svg.cy:0;break;case"thumb":t="horizontal"===this.config.position.orientation?-this.svg.label.cx+this.valueToSvg(this,Number(this.renderValue)):0,e="vertical"===this.config.position.orientation?this.valueToSvg(this,Number(this.renderValue)):0,this.dragging&&("horizontal"===this.config.position.orientation?e-=50:t-=50);break;default:console.error("_renderRangeSlider(), invalid label placement",this.config.position.label.placement)}function s(t){return"thumb"===this.config.position.label.placement&&t?F`
      <text id="rs-label">
        <tspan class="${kt(this.classes.label)}" x="${this.svg.label.cx}" y="${this.svg.label.cy}" style="${nt(this.styles.label)}">
        ${this.renderValue}</tspan>
        ${this._renderUom()}
        </text>
        `:"position"!==this.config.position.label.placement||t?void 0:F`
          <text id="rs-label" style="transform-origin:center;transform-box: fill-box;">
            <tspan class="${kt(this.classes.label)}" data-placement="position" x="${this.svg.label.cx}" y="${this.svg.label.cy}"
            style="${nt(this.styles.label)}">${this.renderValue?this.renderValue:""}</tspan>
            ${this.renderValue?this._renderUom():""}
          </text>
          `}this.svg.thumb.cx=t,this.svg.thumb.cy=e;const i=[];return i.push(F`
      <rect id="capture" class="${kt(this.classes.capture)}" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}"
      width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.track.radius}"          
      />

      <rect id="rs-track" class="${kt(this.classes.track)}" x="${this.svg.track.x1}" y="${this.svg.track.y1}"
        width="${this.svg.track.width}" height="${this.svg.track.height}" rx="${this.svg.track.radius}"
        style="${nt(this.styles.track)}"
      />

      ${function(){return this.config.show.active?"horizontal"===this.config.position.orientation?F`
          <rect id="active-track" class="${kt(this.classes.active)}" x="${this.svg.activeTrack.x1}" y="${this.svg.activeTrack.y1}"
            width="${Math.abs(this.svg.thumb.x1-this.svg.activeTrack.x1+t+this.svg.thumb.width/2)}" height="${this.svg.activeTrack.height}" rx="${this.svg.activeTrack.radius}"
            style="${nt(this.styles.active)}" touch-action="none"
          />`:F`
          <rect id="active-track" class="${kt(this.classes.active)}" x="${this.svg.activeTrack.x1}" y="${e}"
            height="${Math.abs(this.svg.activeTrack.y1+e-this.svg.thumb.height)}" width="${this.svg.activeTrack.width}" rx="${this.svg.activeTrack.radius}"
            style="${nt(this.styles.active)}"
          />`:F``}.call(this)}
      ${function(){return F`
        <g id="rs-thumb-group" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}" style="transform:translate(${t}px, ${e}px);">
          <g style="transform-origin:center;transform-box: fill-box;">
            <rect id="rs-thumb" class="${kt(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
              width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
              style="${nt(this.styles.thumb)}"
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
    `}}class Ve extends At{constructor(t,e,s){super(t,yt.mergeDeep({position:{cx:50,cy:50,width:50,height:50,rx:0},classes:{tool:{"sak-rectangle":!0,hover:!0},rectangle:{"sak-rectangle__rectangle":!0}},styles:{rectangle:{}}},e),s),this.svg.rx=e.position.rx?bt.calculateSvgDimension(e.position.rx):0,this.classes.rectangle={},this.styles.rectangle={},this.dev.debug&&console.log("RectangleTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderRectangle(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.rectangle),F`
      <rect class="${kt(this.classes.rectangle)}"
        x="${this.svg.x}" y="${this.svg.y}" width="${this.svg.width}" height="${this.svg.height}" rx="${this.svg.rx}"
        style="${nt(this.styles.rectangle)}"/>
      `}render(){return F`
      <g id="rectangle-${this.toolId}" class="${kt(this.classes.tool)}" transform-origin="${this.svg.cx}px ${this.svg.cy}px"
        style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderRectangle()}
      </g>
    `}}class Pe extends At{constructor(t,e,s){super(t,yt.mergeDeep({position:{cx:50,cy:50,width:50,height:50,radius:{all:0}},classes:{tool:{"sak-rectex":!0,hover:!0},rectex:{"sak-rectex__rectex":!0}},styles:{tool:{},rectex:{}}},e),s),this.classes.tool={},this.classes.rectex={},this.styles.tool={},this.styles.rectex={};const i=Math.min(this.svg.height,this.svg.width)/2;let a=0;a=bt.calculateSvgDimension(this.config.position.radius.all),this.svg.radiusTopLeft=+Math.min(i,Math.max(0,bt.calculateSvgDimension(this.config.position.radius.top_left||this.config.position.radius.left||this.config.position.radius.top||a)))||0,this.svg.radiusTopRight=+Math.min(i,Math.max(0,bt.calculateSvgDimension(this.config.position.radius.top_right||this.config.position.radius.right||this.config.position.radius.top||a)))||0,this.svg.radiusBottomLeft=+Math.min(i,Math.max(0,bt.calculateSvgDimension(this.config.position.radius.bottom_left||this.config.position.radius.left||this.config.position.radius.bottom||a)))||0,this.svg.radiusBottomRight=+Math.min(i,Math.max(0,bt.calculateSvgDimension(this.config.position.radius.bottom_right||this.config.position.radius.right||this.config.position.radius.bottom||a)))||0,this.dev.debug&&console.log("RectangleToolEx constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderRectangleEx(){this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(this.styles),this.MergeAnimationStyleIfChanged(),this.config.hasOwnProperty("csnew")?this.MergeColorFromState2(this.styles.rectex,"rectex"):this.MergeColorFromState(this.styles.rectex),this.counter||(this.counter=0),this.counter+=1;const t=F`
      <g class="${kt(this.classes.rectex)}" id="rectex-${this.toolId}">
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
      `;return F`${t}`}render(){return F`
      <g id="rectex-${this.toolId}"
        class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderRectangleEx()}
      </g>
    `}}class Re extends At{constructor(t,e,s){super(t,yt.mergeDeep({position:{cx:50,cy:50,radius:50,side_count:6,side_skip:1,angle_offset:0},classes:{tool:{"sak-polygon":!0,hover:!0},regpoly:{"sak-polygon__regpoly":!0}},styles:{tool:{},regpoly:{}}},e),s),this.svg.radius=bt.calculateSvgDimension(e.position.radius),this.classes.regpoly={},this.styles.regpoly={},this.dev.debug&&console.log("RegPolyTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderRegPoly(){return this.MergeAnimationStyleIfChanged(),this.MergeColorFromState(this.styles.regpoly),F`
      <path class="${kt(this.classes.regpoly)}"
        d="${function(t,e,s,i,a,o){const r=2*Math.PI/t;let n,h,l=i+r,c="";for(let d=0;d<t;d++)l+=e*r,n=a+~~(s*Math.cos(l)),h=o+~~(s*Math.sin(l)),c+=`${(0===d?"M":"L")+n} ${h} `,d*e%t==0&&d>0&&(l+=r,n=a+~~(s*Math.cos(l)),h=o+~~(s*Math.sin(l)),c+=`M${n} ${h} `);return c+="z",c}(this.config.position.side_count,this.config.position.side_skip,this.svg.radius,this.config.position.angle_offset,this.svg.cx,this.svg.cy)}"
        style="${nt(this.styles.regpoly)}"
      />
      `}render(){return F`
      <g "" id="regpoly-${this.toolId}" class="${kt(this.classes.tool)}" transform-origin="${this.svg.cx} ${this.svg.cy}"
        style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderRegPoly()}
      </g>
    `}}class Le extends At{constructor(t,e,s){super(t,yt.mergeDeep({position:{cx:50,cy:50,radius:45,width:3,margin:1.5},color:"var(--primary-color)",classes:{tool:{"sak-segarc":!0},foreground:{},background:{}},styles:{tool:{},foreground:{},background:{}},segments:{},colorstops:[],scale:{min:0,max:100,width:2,offset:-3.5},show:{style:"fixedcolor",scale:!1},isScale:!1,animation:{duration:1.5}},e),s),this.dev.performance&&console.time(`--\x3e ${this.toolId} PERFORMANCE SegmentedArcTool::constructor`),this.svg.radius=bt.calculateSvgDimension(e.position.radius),this.svg.radiusX=bt.calculateSvgDimension(e.position.radius_x||e.position.radius),this.svg.radiusY=bt.calculateSvgDimension(e.position.radius_y||e.position.radius),this.svg.segments={},this.svg.segments.gap=bt.calculateSvgDimension(this.config.segments.gap),this.svg.scale_offset=bt.calculateSvgDimension(this.config.scale.offset),this._firstUpdatedCalled=!1,this._stateValue=null,this._stateValuePrev=null,this._stateValueIsDirty=!1,this._renderFrom=null,this._renderTo=null,this.rAFid=null,this.cancelAnimation=!1,this.arcId=null,this._cache=[],this._segmentAngles=[],this._segments={},this._arc={},this._arc.size=Math.abs(this.config.position.end_angle-this.config.position.start_angle),this._arc.clockwise=this.config.position.end_angle>this.config.position.start_angle,this._arc.direction=this._arc.clockwise?1:-1;let i={},a=null;if(this.config.segments.colorlist?.template&&(a=this.config.segments.colorlist,this._card.lovelace.config.sak_user_templates.templates[a.template.name]&&(this.dev.debug&&console.log("SegmentedArcTool::constructor - templates colorlist found",a.template.name),i=wt.replaceVariables2(a.template.variables,this._card.lovelace.config.sak_user_templates.templates[a.template.name]),this.config.segments.colorlist=i)),"fixedcolor"===this.config.show.style);else if("colorlist"===this.config.show.style){this._segments.count=this.config.segments.colorlist.colors.length,this._segments.size=this._arc.size/this._segments.count,this._segments.gap="undefined"!==this.config.segments.colorlist.gap?this.config.segments.colorlist.gap:1,this._segments.sizeList=[];for(var o=0;o<this._segments.count;o++)this._segments.sizeList[o]=this._segments.size;var r=0;for(o=0;o<this._segments.count;o++)this._segmentAngles[o]={boundsStart:this.config.position.start_angle+r*this._arc.direction,boundsEnd:this.config.position.start_angle+(r+this._segments.sizeList[o])*this._arc.direction,drawStart:this.config.position.start_angle+r*this._arc.direction+this._segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(r+this._segments.sizeList[o])*this._arc.direction-this._segments.gap*this._arc.direction},r+=this._segments.sizeList[o];this.dev.debug&&console.log("colorstuff - COLORLIST",this._segments,this._segmentAngles)}else if("colorstops"===this.config.show.style){this._segments.colorStops={},Object.keys(this.config.segments.colorstops.colors).forEach((t=>{t>=this.config.scale.min&&t<=this.config.scale.max&&(this._segments.colorStops[t]=this.config.segments.colorstops.colors[t])})),this._segments.sortedStops=Object.keys(this._segments.colorStops).map((t=>Number(t))).sort(((t,e)=>t-e)),void 0===this._segments.colorStops[this.config.scale.max]&&(this._segments.colorStops[this.config.scale.max]=this._segments.colorStops[this._segments.sortedStops[this._segments.sortedStops.length-1]],this._segments.sortedStops=Object.keys(this._segments.colorStops).map((t=>Number(t))).sort(((t,e)=>t-e))),this._segments.count=this._segments.sortedStops.length-1,this._segments.gap="undefined"!==this.config.segments.colorstops.gap?this.config.segments.colorstops.gap:1;let t=this.config.scale.min;const e=this.config.scale.max-this.config.scale.min;this._segments.sizeList=[];for(o=0;o<this._segments.count;o++){const s=this._segments.sortedStops[o+1]-t;t+=s;const i=s/e*this._arc.size;this._segments.sizeList[o]=i}for(r=0,o=0;o<this._segments.count;o++)this._segmentAngles[o]={boundsStart:this.config.position.start_angle+r*this._arc.direction,boundsEnd:this.config.position.start_angle+(r+this._segments.sizeList[o])*this._arc.direction,drawStart:this.config.position.start_angle+r*this._arc.direction+this._segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(r+this._segments.sizeList[o])*this._arc.direction-this._segments.gap*this._arc.direction},r+=this._segments.sizeList[o],this.dev.debug&&console.log("colorstuff - COLORSTOPS++ segments",r,this._segmentAngles[o]);this.dev.debug&&console.log("colorstuff - COLORSTOPS++",this._segments,this._segmentAngles,this._arc.direction,this._segments.count)}else this.config.show.style;if(this.config.isScale)this._stateValue=this.config.scale.max;else if(this.config.show.scale){const t=yt.mergeDeep(this.config);t.id+="-scale",t.show.scale=!1,t.isScale=!0,t.position.width=this.config.scale.width,t.position.radius=this.config.position.radius-this.config.position.width/2+t.position.width/2+this.config.scale.offset,t.position.radius_x=(this.config.position.radius_x||this.config.position.radius)-this.config.position.width/2+t.position.width/2+this.config.scale.offset,t.position.radius_y=(this.config.position.radius_y||this.config.position.radius)-this.config.position.width/2+t.position.width/2+this.config.scale.offset,this._segmentedArcScale=new Le(this,t,s)}else this._segmentedArcScale=null;if(this.skipOriginal="colorstops"===this.config.show.style||"colorlist"===this.config.show.style,this.skipOriginal&&(this.config.isScale&&(this._stateValuePrev=this._stateValue),this._initialDraw=!1),this._arc.parts=Math.floor(this._arc.size/Math.abs(this.config.segments.dash)),this._arc.partsPartialSize=this._arc.size-this._arc.parts*this.config.segments.dash,this.skipOriginal)this._arc.parts=this._segmentAngles.length,this._arc.partsPartialSize=0;else{for(o=0;o<this._arc.parts;o++)this._segmentAngles[o]={boundsStart:this.config.position.start_angle+o*this.config.segments.dash*this._arc.direction,boundsEnd:this.config.position.start_angle+(o+1)*this.config.segments.dash*this._arc.direction,drawStart:this.config.position.start_angle+o*this.config.segments.dash*this._arc.direction+this.config.segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(o+1)*this.config.segments.dash*this._arc.direction-this.config.segments.gap*this._arc.direction};this._arc.partsPartialSize>0&&(this._segmentAngles[o]={boundsStart:this.config.position.start_angle+o*this.config.segments.dash*this._arc.direction,boundsEnd:this.config.position.start_angle+(o+0)*this.config.segments.dash*this._arc.direction+this._arc.partsPartialSize*this._arc.direction,drawStart:this.config.position.start_angle+o*this.config.segments.dash*this._arc.direction+this.config.segments.gap*this._arc.direction,drawEnd:this.config.position.start_angle+(o+0)*this.config.segments.dash*this._arc.direction+this._arc.partsPartialSize*this._arc.direction-this.config.segments.gap*this._arc.direction})}this.starttime=null,this.dev.debug&&console.log("SegmentedArcTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config),this.dev.debug&&console.log("SegmentedArcTool - init",this.toolId,this.config.isScale,this._segmentAngles),this.dev.performance&&console.timeEnd(`--\x3e ${this.toolId} PERFORMANCE SegmentedArcTool::constructor`)}get objectId(){return this.toolId}set value(t){if(this.dev.debug&&console.log("SegmentedArcTool - set value IN"),this.config.isScale)return!1;if(this._stateValue===t)return!1;return super.value=t}firstUpdated(t){this.dev.debug&&console.log("SegmentedArcTool - firstUpdated IN with _arcId/id",this._arcId,this.toolId,this.config.isScale),this._arcId=this._card.shadowRoot.getElementById("arc-".concat(this.toolId)),this._firstUpdatedCalled=!0,this._segmentedArcScale?.firstUpdated(t),this.skipOriginal&&(this.dev.debug&&console.log("RENDERNEW - firstUpdated IN with _arcId/id/isScale/scale/connected",this._arcId,this.toolId,this.config.isScale,this._segmentedArcScale,this._card.connected),this.config.isScale||(this._stateValuePrev=null),this._initialDraw=!0,this._card.requestUpdate())}updated(t){this.dev.debug&&console.log("SegmentedArcTool - updated IN")}render(){return this.dev.debug&&console.log("SegmentedArcTool RENDERNEW - Render IN"),F`
      <g "" id="arc-${this.toolId}"
        class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}"
      >
        <g >
          ${this._renderSegments()}
          </g>
        ${this._renderScale()}
      </g>
    `}_renderScale(){if(this._segmentedArcScale)return this._segmentedArcScale.render()}_renderSegments(){if(this.skipOriginal){let t,e;const s=this.svg.width,i=this.svg.radiusX,a=this.svg.radiusY;let o;this.dev.debug&&console.log("RENDERNEW - IN _arcId, firstUpdatedCalled",this._arcId,this._firstUpdatedCalled);const r=bt.calculateValueBetween(this.config.scale.min,this.config.scale.max,this._stateValue),n=bt.calculateValueBetween(this.config.scale.min,this.config.scale.max,this._stateValuePrev);this.dev.debug&&(this._stateValuePrev||console.log("*****UNDEFINED",this._stateValue,this._stateValuePrev,n)),r!==n&&this.dev.debug&&console.log("RENDERNEW _renderSegments diff value old new",this.toolId,n,r),t=r*this._arc.size*this._arc.direction+this.config.position.start_angle,e=n*this._arc.size*this._arc.direction+this.config.position.start_angle;const h=[];if(!this.config.isScale)for(let l=0;l<this._segmentAngles.length;l++)o=this.buildArcPath(this._segmentAngles[l].drawStart,this._segmentAngles[l].drawEnd,this._arc.clockwise,this.svg.radiusX,this.svg.radiusY,this.svg.width),h.push(F`<path id="arc-segment-bg-${this.toolId}-${l}" class="sak-segarc__background"
                              style="${nt(this.config.styles.background)}"
                              d="${o}"
                              />`);if(this._firstUpdatedCalled){this.dev.debug&&console.log("RENDERNEW _arcId DOES exist",this._arcId,this.toolId,this._firstUpdatedCalled),this._cache.forEach(((t,e)=>{if(o=t,this.config.isScale){let t=this.config.color;"colorlist"===this.config.show.style&&(t=this.config.segments.colorlist.colors[e]),"colorstops"===this.config.show.style&&(t=this._segments.colorStops[this._segments.sortedStops[e]]),this.styles.foreground[e]||(this.styles.foreground[e]=yt.mergeDeep(this.config.styles.foreground)),this.styles.foreground[e].fill=t}h.push(F`<path id="arc-segment-${this.toolId}-${e}" class="sak-segarc__foreground"
                            style="${nt(this.styles.foreground[e])}"
                            d="${o}"
                            />`)}));const c={};function d(t,e){let r,n;t=t||(new Date).getTime();c.startTime||(c.startTime=t,c.runningAngle=c.fromAngle),e.debug&&console.log("RENDERNEW - in animateSegmentsNEW",e.toolId,c);const h=t-c.startTime;var l;c.progress=Math.min(h/c.duration,1),c.progress=(l=c.progress,--l**5+1);const g=e._arc.clockwise?c.toAngle>c.fromAngle:c.fromAngle>c.toAngle;c.frameAngle=c.fromAngle+(c.toAngle-c.fromAngle)*c.progress,r=e._segmentAngles.findIndex(((t,s)=>e._arc.clockwise?c.frameAngle<=t.boundsEnd&&c.frameAngle>=t.boundsStart:c.frameAngle<=t.boundsStart&&c.frameAngle>=t.boundsEnd)),-1===r&&(console.log("RENDERNEW animateSegments frameAngle not found",c,e._segmentAngles),console.log("config",e.config)),n=e._segmentAngles.findIndex(((t,s)=>e._arc.clockwise?c.runningAngle<=t.boundsEnd&&c.runningAngle>=t.boundsStart:c.runningAngle<=t.boundsStart&&c.runningAngle>=t.boundsEnd));do{const t=e._segmentAngles[n].drawStart;var u=e._arc.clockwise?Math.min(e._segmentAngles[n].boundsEnd,c.frameAngle):Math.max(e._segmentAngles[n].boundsEnd,c.frameAngle);const r=e._arc.clockwise?Math.min(e._segmentAngles[n].drawEnd,c.frameAngle):Math.max(e._segmentAngles[n].drawEnd,c.frameAngle);let h;o=e.buildArcPath(t,r,e._arc.clockwise,i,a,s),e.myarc||(e.myarc={}),e.as||(e.as={});const l="arc-segment-".concat(e.toolId).concat("-").concat(n);if(e.as[n]||(e.as[n]=e._card.shadowRoot.getElementById(l)),h=e.as[n],e.myarc[n]=l,h&&(h.setAttribute("d",o),"colorlist"===e.config.show.style&&(h.style.fill=e.config.segments.colorlist.colors[n],e.styles.foreground[n].fill=e.config.segments.colorlist.colors[n]),e.config.show.lastcolor)){var m;const t=e._arc.clockwise?e._segmentAngles[n].drawStart:e._segmentAngles[n].drawEnd,s=e._arc.clockwise?e._segmentAngles[n].drawEnd:e._segmentAngles[n].drawStart,i=Math.min(Math.max(0,(u-t)/(s-t)),1);if("colorstops"===e.config.show.style?m=Mt.getGradientValue(e._segments.colorStops[e._segments.sortedStops[n]],e._segments.colorStops[e._segments.sortedStops[n]],i):"colorlist"===e.config.show.style&&(m=e.config.segments.colorlist.colors[n]),e.styles.foreground[0].fill=m,e.as[0].style.fill=m,n>0)for(let a=n;a>=0;a--)e.styles.foreground[a].fill!==m&&(e.styles.foreground[a].fill=m,e.as[a].style.fill=m),e.styles.foreground[a].fill=m,e.as[a].style.fill=m}e._cache[n]=o,c.frameAngle!==u&&(u+=1e-6*e._arc.direction);var p=n;n=e._segmentAngles.findIndex(((t,s)=>e._arc.clockwise?u<=t.boundsEnd&&u>=t.boundsStart:u<=t.boundsStart&&u>=t.boundsEnd)),g||p!==n&&(e.debug&&console.log("RENDERNEW movit - remove path",e.toolId,p),e._arc.clockwise,h.removeAttribute("d"),e._cache[p]=null),c.runningAngle=u,e.debug&&console.log("RENDERNEW - animation loop tween",e.toolId,c,n,p)}while(c.runningAngle!==c.frameAngle);1!==c.progress?e.rAFid=requestAnimationFrame((t=>{d(t,e)})):(c.startTime=null,e.debug&&console.log("RENDERNEW - animation loop ENDING tween",e.toolId,c,n,p))}const g=this;return!0===this._card.connected&&this._renderTo!==this._stateValue&&(this._renderTo=this._stateValue,this.rAFid&&cancelAnimationFrame(this.rAFid),c.fromAngle=e,c.toAngle=t,c.runningAngle=e,c.duration=Math.min(Math.max(this._initialDraw?100:500,this._initialDraw?16:1e3*this.config.animation.duration),5e3),c.startTime=null,this.dev.debug&&console.log("RENDERNEW - tween",this.toolId,c),this.rAFid=requestAnimationFrame((t=>{d(t,g)})),this._initialDraw=!1),F`${h}`}this.dev.debug&&console.log("RENDERNEW _arcId does NOT exist",this._arcId,this.toolId);for(let u=0;u<this._segmentAngles.length;u++){o=this.buildArcPath(this._segmentAngles[u].drawStart,this._segmentAngles[u].drawEnd,this._arc.clockwise,this.svg.radiusX,this.svg.radiusY,this.config.isScale?this.svg.width:0),this._cache[u]=o;let m=this.config.color;if("colorlist"===this.config.show.style&&(m=this.config.segments.colorlist.colors[u]),"colorstops"===this.config.show.style&&(m=this._segments.colorStops[this._segments.sortedStops[u]]),this.styles.foreground||(this.styles.foreground={}),this.styles.foreground[u]||(this.styles.foreground[u]=yt.mergeDeep(this.config.styles.foreground)),this.styles.foreground[u].fill=m,this.config.show.lastcolor&&u>0)for(let p=u-1;p>0;p--)this.styles.foreground[p].fill=m;h.push(F`<path id="arc-segment-${this.toolId}-${u}" class="arc__segment"
                            style="${nt(this.styles.foreground[u])}"
                            d="${o}"
                            />`)}return this.dev.debug&&console.log("RENDERNEW - svgItems",h,this._firstUpdatedCalled),F`${h}`}}polarToCartesian(t,e,s,i,a){const o=(a-90)*Math.PI/180;return{x:t+s*Math.cos(o),y:e+i*Math.sin(o)}}buildArcPath(t,e,s,i,a,o){const r=this.polarToCartesian(this.svg.cx,this.svg.cy,i,a,e),n=this.polarToCartesian(this.svg.cx,this.svg.cy,i,a,t),h=Math.abs(e-t)<=180?"0":"1",l=s?"0":"1",c=i-o,d=a-o,g=this.polarToCartesian(this.svg.cx,this.svg.cy,c,d,e),u=this.polarToCartesian(this.svg.cx,this.svg.cy,c,d,t);return["M",r.x,r.y,"A",i,a,0,h,l,n.x,n.y,"L",u.x,u.y,"A",c,d,0,h,"0"===l?"1":"0",g.x,g.y,"Z"].join(" ")}}class Oe extends At{constructor(t,e,s){super(t,yt.mergeDeep({position:{cx:50,cy:50,height:25,width:25,margin:.5,orientation:"vertical"},hours:24,barhours:1,color:"var(--primary-color)",classes:{tool:{"sak-barchart":!0,hover:!0},bar:{},line:{"sak-barchart__line":!0,hover:!0}},styles:{tool:{},line:{},bar:{}},colorstops:[],show:{style:"fixedcolor"}},e),s),this.svg.margin=bt.calculateSvgDimension(this.config.position.margin);const i="vertical"===this.config.position.orientation?this.svg.width:this.svg.height;this.svg.barWidth=(i-(this.config.hours/this.config.barhours-1)*this.svg.margin)/(this.config.hours/this.config.barhours),this._data=[],this._bars=[],this._scale={},this._needsRendering=!1,this.classes.tool={},this.classes.bar={},this.styles.tool={},this.styles.line={},this.stylesBar={},this.dev.debug&&console.log("SparkleBarChart constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}computeMinMax(){let t=this._series[0],e=this._series[0];for(let s=1,i=this._series.length;s<i;s++){const i=this._series[s];t=i<t?i:t,e=i>e?i:e}this._scale.min=t,this._scale.max=e,this._scale.size=e-t,this._scale.size=1.05*(e-t),this._scale.min=e-this._scale.size}set data(t){this._series=Object.assign(t),this.computeBars(),this._needsRendering=!0}set series(t){this._series=Object.assign(t),this.computeBars(),this._needsRendering=!0}hasSeries(){return this.defaultEntityIndex()}computeBars({_bars:t}=this){this.computeMinMax(),"minmaxgradient"===this.config.show.style&&(this.colorStopsMinMax={},this.colorStopsMinMax={[this._scale.min.toString()]:this.config.minmaxgradient.colors.min,[this._scale.max.toString()]:this.config.minmaxgradient.colors.max}),"vertical"===this.config.position.orientation?(this.dev.debug&&console.log("bar is vertical"),this._series.forEach(((e,s)=>{t[s]||(t[s]={}),t[s].length=0===this._scale.size?0:(e-this._scale.min)/this._scale.size*this.svg.height,t[s].x1=this.svg.x+this.svg.barWidth/2+(this.svg.barWidth+this.svg.margin)*s,t[s].x2=t[s].x1,t[s].y1=this.svg.y+this.svg.height,t[s].y2=t[s].y1-this._bars[s].length,t[s].dataLength=this._bars[s].length}))):"horizontal"===this.config.position.orientation?(this.dev.debug&&console.log("bar is horizontal"),this._data.forEach(((e,s)=>{t[s]||(t[s]={}),t[s].length=0===this._scale.size?0:(e-this._scale.min)/this._scale.size*this.svg.width,t[s].y1=this.svg.y+this.svg.barWidth/2+(this.svg.barWidth+this.svg.margin)*s,t[s].y2=t[s].y1,t[s].x1=this.svg.x,t[s].x2=t[s].x1+this._bars[s].length,t[s].dataLength=this._bars[s].length}))):this.dev.debug&&console.log("SparklineBarChartTool - unknown barchart orientation (horizontal or vertical)")}_renderBars(){const t=[];if(0!==this._bars.length)return this.dev.debug&&console.log("_renderBars IN",this.toolId),this._bars.forEach(((e,s)=>{this.dev.debug&&console.log("_renderBars - bars",e,s);const i=this.getColorFromState(this._series[s]);this.stylesBar[s]||(this.stylesBar[s]={...this.config.styles.bar}),this._bars[s].y2||console.log("sparklebarchart y2 invalid",this._bars[s]),t.push(F`
          <line id="line-segment-${this.toolId}-${s}" class="${kt(this.config.classes.line)}"
                    style="${nt(this.stylesBar[s])}"
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
          class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}"
          @click=${t=>this.handleTapEvent(t,this.config)}>
          ${this._renderBars()}
        </g>
      `}}class Be extends At{constructor(t,e,s){const i={position:{cx:50,cy:50,orientation:"horizontal",track:{width:16,height:7,radius:3.5},thumb:{width:9,height:9,radius:4.5,offset:4.5}},classes:{tool:{"sak-switch":!0,hover:!0},track:{"sak-switch__track":!0},thumb:{"sak-switch__thumb":!0}},styles:{tool:{overflow:"visible"},track:{},thumb:{}}},a={animations:[{state:"on",id:1,styles:{track:{fill:"var(--switch-checked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-checked-button-color)",transform:"translateX(4.5em)","pointer-events":"auto"}}},{state:"off",id:0,styles:{track:{fill:"var(--switch-unchecked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-unchecked-button-color)",transform:"translateX(-4.5em)","pointer-events":"auto"}}}]},o={animations:[{state:"on",id:1,styles:{track:{fill:"var(--switch-checked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-checked-button-color)",transform:"translateY(-4.5em)","pointer-events":"auto"}}},{state:"off",id:0,styles:{track:{fill:"var(--switch-unchecked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-unchecked-button-color)",transform:"translateY(4.5em)","pointer-events":"auto"}}}]};if(super(t,yt.mergeDeep(i,e),s),!["horizontal","vertical"].includes(this.config.position.orientation))throw Error("SwitchTool::constructor - invalid orientation [vertical, horizontal] = ",this.config.position.orientation);switch(this.svg.track={},this.svg.track.radius=bt.calculateSvgDimension(this.config.position.track.radius),this.svg.thumb={},this.svg.thumb.radius=bt.calculateSvgDimension(this.config.position.thumb.radius),this.svg.thumb.offset=bt.calculateSvgDimension(this.config.position.thumb.offset),this.config.position.orientation){default:case"horizontal":this.config=yt.mergeDeep(i,a,e),this.svg.track.width=bt.calculateSvgDimension(this.config.position.track.width),this.svg.track.height=bt.calculateSvgDimension(this.config.position.track.height),this.svg.thumb.width=bt.calculateSvgDimension(this.config.position.thumb.width),this.svg.thumb.height=bt.calculateSvgDimension(this.config.position.thumb.height),this.svg.track.x1=this.svg.cx-this.svg.track.width/2,this.svg.track.y1=this.svg.cy-this.svg.track.height/2,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2;break;case"vertical":this.config=yt.mergeDeep(i,o,e),this.svg.track.width=bt.calculateSvgDimension(this.config.position.track.height),this.svg.track.height=bt.calculateSvgDimension(this.config.position.track.width),this.svg.thumb.width=bt.calculateSvgDimension(this.config.position.thumb.height),this.svg.thumb.height=bt.calculateSvgDimension(this.config.position.thumb.width),this.svg.track.x1=this.svg.cx-this.svg.track.width/2,this.svg.track.y1=this.svg.cy-this.svg.track.height/2,this.svg.thumb.x1=this.svg.cx-this.svg.thumb.width/2,this.svg.thumb.y1=this.svg.cy-this.svg.thumb.height/2}this.classes.track={},this.classes.thumb={},this.styles.track={},this.styles.thumb={},this.dev.debug&&console.log("SwitchTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}_renderSwitch(){return this.MergeAnimationClassIfChanged(),this.MergeAnimationStyleIfChanged(this.styles),F`
      <g>
        <rect class="${kt(this.classes.track)}" x="${this.svg.track.x1}" y="${this.svg.track.y1}"
          width="${this.svg.track.width}" height="${this.svg.track.height}" rx="${this.svg.track.radius}"
          style="${nt(this.styles.track)}"
        />
        <rect class="${kt(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
          width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
          style="${nt(this.styles.thumb)}"
        />
      </g>
      `}render(){return F`
      <g id="switch-${this.toolId}" transform-origin="${this.svg.cx} ${this.svg.cy}"
        class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderSwitch()}
      </g>
    `}}class ze extends At{constructor(t,e,s){super(t,yt.mergeDeep({classes:{tool:{"sak-text":!0},text:{"sak-text__text":!0,hover:!1}},styles:{tool:{},text:{}}},e),s),this.EnableHoverForInteraction(),this.text=this.config.text,this.classes.tool={},this.classes.text={},this.styles.tool={},this.styles.text={},this.dev.debug&&console.log("TextTool constructor coords, dimensions",this.coords,this.dimensions,this.svg,this.config)}_renderText(){return this.MergeAnimationClassIfChanged(),this.MergeColorFromState(this.styles.text),this.MergeAnimationStyleIfChanged(),F`
        <text>
          <tspan class="${kt(this.classes.text)}" x="${this.svg.cx}" y="${this.svg.cy}" style="${nt(this.styles.text)}">${this.text}</tspan>
        </text>
      `}render(){return F`
        <g id="text-${this.toolId}"
          class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}"
          @click=${t=>this.handleTapEvent(t,this.config)}>
          ${this._renderText()}
        </g>
      `}}function Fe(t,e,s){if(s||2===arguments.length)for(var i,a=0,o=e.length;a<o;a++)!i&&a in e||(i||(i=Array.prototype.slice.call(e,0,a)),i[a]=e[a]);return t.concat(i||Array.prototype.slice.call(e))}
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */var Ge=/; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g,Ue=/\\([\u000b\u0020-\u00ff])/g,qe=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/,je=function(t){if(!t)throw new TypeError("argument string is required");var e="object"==typeof t?function(t){var e;"function"==typeof t.getHeader?e=t.getHeader("content-type"):"object"==typeof t.headers&&(e=t.headers&&t.headers["content-type"]);if("string"!=typeof e)throw new TypeError("content-type header is missing from object");return e}(t):t;if("string"!=typeof e)throw new TypeError("argument string is required to be a string");var s=e.indexOf(";"),i=-1!==s?e.slice(0,s).trim():e.trim();if(!qe.test(i))throw new TypeError("invalid media type");var a=new He(i.toLowerCase());if(-1!==s){var o,r,n;for(Ge.lastIndex=s;r=Ge.exec(e);){if(r.index!==s)throw new TypeError("invalid parameter format");s+=r[0].length,o=r[1].toLowerCase(),34===(n=r[2]).charCodeAt(0)&&-1!==(n=n.slice(1,-1)).indexOf("\\")&&(n=n.replace(Ue,"$1")),a.parameters[o]=n}if(s!==e.length)throw new TypeError("invalid parameter format")}return a};function He(t){this.parameters=Object.create(null),this.type=t}var We=new Map,Ye=function(t){return t.cloneNode(!0)},Je=function(){return"file:"===window.location.protocol},Xe=function(t,e,s){var i=new XMLHttpRequest;i.onreadystatechange=function(){try{if(!/\.svg/i.test(t)&&2===i.readyState){var e=i.getResponseHeader("Content-Type");if(!e)throw new Error("Content type not found");var a=je(e).type;if("image/svg+xml"!==a&&"text/plain"!==a)throw new Error("Invalid content type: ".concat(a))}if(4===i.readyState){if(404===i.status||null===i.responseXML)throw new Error(Je()?"Note: SVG injection ajax calls do not work locally without adjusting security settings in your browser. Or consider using a local webserver.":"Unable to load SVG file: "+t);if(!(200===i.status||Je()&&0===i.status))throw new Error("There was a problem injecting the SVG: "+i.status+" "+i.statusText);s(null,i)}}catch(o){if(i.abort(),!(o instanceof Error))throw o;s(o,i)}},i.open("GET",t),i.withCredentials=e,i.overrideMimeType&&i.overrideMimeType("text/xml"),i.send()},Ze={},Ke=function(t,e){Ze[t]=Ze[t]||[],Ze[t].push(e)},Qe=function(t,e,s){if(We.has(t)){var i=We.get(t);if(void 0===i)return void Ke(t,s);if(i instanceof SVGSVGElement)return void s(null,Ye(i))}We.set(t,void 0),Ke(t,s),Xe(t,e,(function(e,s){var i;e?We.set(t,e):(null===(i=s.responseXML)||void 0===i?void 0:i.documentElement)instanceof SVGSVGElement&&We.set(t,s.responseXML.documentElement),function(t){for(var e=function(e,s){setTimeout((function(){if(Array.isArray(Ze[t])){var s=We.get(t),i=Ze[t][e];s instanceof SVGSVGElement&&i(null,Ye(s)),s instanceof Error&&i(s),e===Ze[t].length-1&&delete Ze[t]}}),0)},s=0,i=Ze[t].length;s<i;s++)e(s)}(t)}))},ts=function(t,e,s){Xe(t,e,(function(t,e){var i;t?s(t):(null===(i=e.responseXML)||void 0===i?void 0:i.documentElement)instanceof SVGSVGElement&&s(null,e.responseXML.documentElement)}))},es=0,ss=[],is={},as="http://www.w3.org/1999/xlink",os=function(t,e,s,i,a,o,r){var n=t.getAttribute("data-src")||t.getAttribute("src");if(n){if(-1!==ss.indexOf(t))return ss.splice(ss.indexOf(t),1),void(t=null);ss.push(t),t.setAttribute("src",""),(i?Qe:ts)(n,a,(function(i,a){if(!a)return ss.splice(ss.indexOf(t),1),t=null,void r(i);var h=t.getAttribute("id");h&&a.setAttribute("id",h);var l=t.getAttribute("title");l&&a.setAttribute("title",l);var c=t.getAttribute("width");c&&a.setAttribute("width",c);var d=t.getAttribute("height");d&&a.setAttribute("height",d);var g=Array.from(new Set(Fe(Fe(Fe([],(a.getAttribute("class")||"").split(" "),!0),["injected-svg"],!1),(t.getAttribute("class")||"").split(" "),!0))).join(" ").trim();a.setAttribute("class",g);var u=t.getAttribute("style");u&&a.setAttribute("style",u),a.setAttribute("data-src",n);var m=[].filter.call(t.attributes,(function(t){return/^data-\w[\w-]*$/.test(t.name)}));if(Array.prototype.forEach.call(m,(function(t){t.name&&t.value&&a.setAttribute(t.name,t.value)})),s){var p,f,v,_,y,b={clipPath:["clip-path"],"color-profile":["color-profile"],cursor:["cursor"],filter:["filter"],linearGradient:["fill","stroke"],marker:["marker","marker-start","marker-mid","marker-end"],mask:["mask"],path:[],pattern:["fill","stroke"],radialGradient:["fill","stroke"]};Object.keys(b).forEach((function(t){p=t,v=b[t];for(var e=function(t,e){var s;_=f[t].id,y=_+"-"+ ++es,Array.prototype.forEach.call(v,(function(t){for(var e=0,i=(s=a.querySelectorAll("["+t+'*="'+_+'"]')).length;e<i;e++){var o=s[e].getAttribute(t);o&&!o.match(new RegExp('url\\("?#'+_+'"?\\)'))||s[e].setAttribute(t,"url(#"+y+")")}}));for(var i=a.querySelectorAll("[*|href]"),o=[],r=0,n=i.length;r<n;r++){var h=i[r].getAttributeNS(as,"href");h&&h.toString()==="#"+f[t].id&&o.push(i[r])}for(var l=0,c=o.length;l<c;l++)o[l].setAttributeNS(as,"href","#"+y);f[t].id=y},s=0,i=(f=a.querySelectorAll(p+"[id]")).length;s<i;s++)e(s)}))}a.removeAttribute("xmlns:a");for(var w,x,$=a.querySelectorAll("script"),k=[],S=0,M=$.length;S<M;S++)(x=$[S].getAttribute("type"))&&"application/ecmascript"!==x&&"application/javascript"!==x&&"text/javascript"!==x||((w=$[S].innerText||$[S].textContent)&&k.push(w),a.removeChild($[S]));if(k.length>0&&("always"===e||"once"===e&&!is[n])){for(var A=0,C=k.length;A<C;A++)new Function(k[A])(window);is[n]=!0}var E=a.querySelectorAll("style");if(Array.prototype.forEach.call(E,(function(t){t.textContent+=""})),a.setAttribute("xmlns","http://www.w3.org/2000/svg"),a.setAttribute("xmlns:xlink",as),o(a),!t.parentNode)return ss.splice(ss.indexOf(t),1),t=null,void r(new Error("Parent node is null"));t.parentNode.replaceChild(a,t),ss.splice(ss.indexOf(t),1),t=null,r(null,a)}))}else r(new Error("Invalid data-src or src attribute"))};class rs extends At{constructor(t,e,s){if(super(t,yt.mergeDeep({position:{cx:50,cy:50,height:50,width:50},options:{svginject:!0},styles:{usersvg:{},mask:{fill:"white"}}},e),s),this.images={},this.images=Object.assign({},...this.config.images),this.item={},this.item.image="default",this.imageCur="none",this.imagePrev="none",this.classes={},this.classes.tool={},this.classes.usersvg={},this.classes.mask={},this.styles={},this.styles.tool={},this.styles.usersvg={},this.styles.mask={},this.injector={},this.injector.svg=null,this.injector.cache=[],this.clipPath={},this.config.clip_path){this.svg.cp_cx=bt.calculateSvgCoordinate(this.config.clip_path.position.cx||this.config.position.cx,0),this.svg.cp_cy=bt.calculateSvgCoordinate(this.config.clip_path.position.cy||this.config.position.cy,0),this.svg.cp_height=bt.calculateSvgDimension(this.config.clip_path.position.height||this.config.position.height),this.svg.cp_width=bt.calculateSvgDimension(this.config.clip_path.position.width||this.config.position.width);const t=Math.min(this.svg.cp_height,this.svg.cp_width)/2;this.svg.radiusTopLeft=+Math.min(t,Math.max(0,bt.calculateSvgDimension(this.config.clip_path.position.radius.top_left||this.config.clip_path.position.radius.left||this.config.clip_path.position.radius.top||this.config.clip_path.position.radius.all)))||0,this.svg.radiusTopRight=+Math.min(t,Math.max(0,bt.calculateSvgDimension(this.config.clip_path.position.radius.top_right||this.config.clip_path.position.radius.right||this.config.clip_path.position.radius.top||this.config.clip_path.position.radius.all)))||0,this.svg.radiusBottomLeft=+Math.min(t,Math.max(0,bt.calculateSvgDimension(this.config.clip_path.position.radius.bottom_left||this.config.clip_path.position.radius.left||this.config.clip_path.position.radius.bottom||this.config.clip_path.position.radius.all)))||0,this.svg.radiusBottomRight=+Math.min(t,Math.max(0,bt.calculateSvgDimension(this.config.clip_path.position.radius.bottom_right||this.config.clip_path.position.radius.right||this.config.clip_path.position.radius.bottom||this.config.clip_path.position.radius.all)))||0}this.dev.debug&&console.log("UserSvgTool constructor config, svg",this.toolId,this.config,this.svg)}set value(t){super.value=t}updated(t){var e=this;this.config.options.svginject&&!this.injector.cache[this.imageCur]&&(this.injector.elementsToInject=this._card.shadowRoot.getElementById("usersvg-".concat(this.toolId)).querySelectorAll("svg[data-src]:not(.injected-svg)"),0!==this.injector.elementsToInject.length&&function(t,e){var s=void 0===e?{}:e,i=s.afterAll,a=void 0===i?function(){}:i,o=s.afterEach,r=void 0===o?function(){}:o,n=s.beforeEach,h=void 0===n?function(){}:n,l=s.cacheRequests,c=void 0===l||l,d=s.evalScripts,g=void 0===d?"never":d,u=s.httpRequestWithCredentials,m=void 0!==u&&u,p=s.renumerateIRIElements,f=void 0===p||p;if(t&&"length"in t)for(var v=0,_=0,y=t.length;_<y;_++)os(t[_],g,f,c,m,h,(function(e,s){r(e,s),t&&"length"in t&&t.length===++v&&a(v)}));else t?os(t,g,f,c,m,h,(function(e,s){r(e,s),a(1),t=null})):a(0)}(this.injector.elementsToInject,{afterAll(t){setTimeout((()=>{e._card.requestUpdate()}),0)},afterEach(t,s){if(t)throw e.injector.error=t,e.config.options.svginject=!1,t;e.injector.error="",e.injector.cache[e.imageCur]=s},beforeEach(t){t.removeAttribute("height"),t.removeAttribute("width")},cacheRequests:!1,evalScripts:"once",httpRequestWithCredentials:!1,renumerateIRIElements:!1}))}_renderUserSvg(){this.MergeAnimationStyleIfChanged();const t=wt.getJsTemplateOrValue(this,this._stateValue,yt.mergeDeep(this.images));if(this.imagePrev=this.imageCur,this.imageCur=t[this.item.image],"none"===t[this.item.image])return F``;let e=this.injector.cache[this.imageCur],s=F``,i="",a="";this.config.clip_path&&(i=`url(#clip-path-${this.toolId})`,a=`url(#mask-${this.toolId})`,s=F`
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
        `);const o=t[this.item.image].lastIndexOf(".");return"svg"!==t[this.item.image].substring(-1===o?1/0:o+1)?F`
        <svg class="sak-usersvg__image" x="${this.svg.x}" y="${this.svg.y}"
          style="${nt(this.styles.usersvg)}">
          "${s}"
          <image 
            clip-path="${i}" mask="${a}"
            href="${t[this.item.image]}"
            height="${this.svg.height}" width="${this.svg.width}"
          />
        </svg>
        `:e&&this.config.options.svginject?(e.classList.remove("hidden"),F`
        <svg x="${this.svg.x}" y="${this.svg.y}" style="${nt(this.styles.usersvg)}"
          height="${this.svg.height}" width="${this.svg.width}"
          clip-path="${i}"
          mask="${a}"
        >
          "${s}"
          ${e};
       </svg>
       `):F`
        <svg class="sak-usersvg__image ${this.config.options.svginject?"hidden":""}"
          data-id="usersvg-${this.toolId}" data-src="${t[this.item.image]}"
          x="${this.svg.x}" y="${this.svg.y}"
          style="${this.config.options.svginject?"":nt(this.styles.usersvg)}">
          "${s}"
          <image
            clip-path="${i}"
            mask="${a}"
            href="${t[this.item.image]}"
            height="${this.svg.height}" width="${this.svg.width}"
          />
        </svg>
      `}render(){return F`
      <g id="usersvg-${this.toolId}" overflow="visible"
        class="${kt(this.classes.tool)}" style="${nt(this.styles.tool)}"
        @click=${t=>this.handleTapEvent(t,this.config)}>
        ${this._renderUserSvg()}
      </g>
    `}}class ns{constructor(t,e){if(this.toolsetId=Math.random().toString(36).substr(2,9),this._card=t,this.dev={...this._card.dev},this.dev.performance&&console.time(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::constructor`),this.config=e,this.tools=[],this.palette={},this.palette.light={},this.palette.dark={},this.config.palette){const{paletteLight:t,paletteDark:e}=Mt.processPalette(this.config.palette);this.palette.light=t,this.palette.dark=e}this.svg={},this.svg.cx=bt.calculateSvgCoordinate(e.position.cx,pt),this.svg.cy=bt.calculateSvgCoordinate(e.position.cy,pt),this.svg.x=this.svg.cx-pt,this.svg.y=this.svg.cy-pt,this.transform={},this.transform.scale={},this.transform.scale.x=this.transform.scale.y=1,this.transform.rotate={},this.transform.rotate.x=this.transform.rotate.y=0,this.transform.skew={},this.transform.skew.x=this.transform.skew.y=0,this.config.position.scale&&(this.transform.scale.x=this.transform.scale.y=this.config.position.scale),this.config.position.rotate&&(this.transform.rotate.x=this.transform.rotate.y=this.config.position.rotate),this.transform.scale.x=this.config.position.scale_x||this.config.position.scale||1,this.transform.scale.y=this.config.position.scale_y||this.config.position.scale||1,this.transform.rotate.x=this.config.position.rotate_x||this.config.position.rotate||0,this.transform.rotate.y=this.config.position.rotate_y||this.config.position.rotate||0,this.dev.debug&&console.log("Toolset::constructor config/svg",this.toolsetId,this.config,this.svg);const s={area:Nt,circslider:Tt,badge:Ct,bar:Oe,circle:Et,ellipse:It,sparkline:Te,horseshoe:Ie,icon:Ut,line:Ne,name:qt,rectangle:Ve,rectex:Pe,regpoly:Re,segarc:Le,state:ke,slider:De,switch:Be,text:ze,usersvg:rs};this.config.tools.map((t=>{const e={...t},i={cx:0,cy:0,scale:this.config.position.scale?this.config.position.scale:1};if(this.dev.debug&&console.log("Toolset::constructor toolConfig",this.toolsetId,e,i),!t.disabled){const a=new s[t.type](this,e,i);this._card.entityHistory.needed|="bar"===t.type,this._card.entityHistory.needed|="sparkline"===t.type,this.tools.push({type:t.type,index:t.id,tool:a})}return!0})),this.dev.performance&&console.timeEnd(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::constructor`)}updateValues(){this.dev.performance&&console.time(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::updateValues`),this.tools&&this.tools.map(((t,e)=>{if(t.tool.config.hasOwnProperty("entity_index")&&(this.dev.debug&&console.log("Toolset::updateValues",t,e),t.tool.value=this._card.attributesStr[t.tool.config.entity_index]?this._card.attributesStr[t.tool.config.entity_index]:this._card.secondaryInfoStr[t.tool.config.entity_index]?this._card.secondaryInfoStr[t.tool.config.entity_index]:this._card.entitiesStr[t.tool.config.entity_index]),t.tool.config.hasOwnProperty("entity_indexes")){const e=[];for(let s=0;s<t.tool.config.entity_indexes.length;++s)e[s]=this._card.attributesStr[t.tool.config.entity_indexes[s].entity_index]?this._card.attributesStr[t.tool.config.entity_indexes[s].entity_index]:this._card.secondaryInfoStr[t.tool.config.entity_indexes[s].entity_index]?this._card.secondaryInfoStr[t.tool.config.entity_indexes[s].entity_index]:this._card.entitiesStr[t.tool.config.entity_indexes[s].entity_index];t.tool.values=e}return!0})),this.dev.performance&&console.timeEnd(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::updateValues`)}connectedCallback(){this.dev.performance&&console.time(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::connectedCallback`),this.dev.debug&&console.log("*****Event - connectedCallback",this.toolsetId,(new Date).getTime()),this.dev.performance&&console.timeEnd(`--\x3e ${this.toolsetId} PERFORMANCE Toolset::connectedCallback`)}disconnectedCallback(){this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE Toolset::disconnectedCallback`),this.dev.debug&&console.log("*****Event - disconnectedCallback",this.toolsetId,(new Date).getTime()),this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE Toolset::disconnectedCallback`)}firstUpdated(t){this.dev.debug&&console.log("*****Event - Toolset::firstUpdated",this.toolsetId,(new Date).getTime()),this.tools&&this.tools.map((e=>"function"==typeof e.tool.firstUpdated&&(e.tool.firstUpdated(t),!0)))}updated(t){this.dev.debug&&console.log("*****Event - Updated",this.toolsetId,(new Date).getTime()),this.tools&&this.tools.map((e=>"function"==typeof e.tool.updated&&(e.tool.updated(t),!0)))}renderToolset(){this.dev.debug&&console.log("*****Event - renderToolset",this.toolsetId,(new Date).getTime());const t=this.tools.map((t=>F`
          ${t.tool.render()}
      `));return F`${t}`}render(){return!this._card.isSafari&&!this._card.iOS||this._card.isSafari16?F`
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
      `:F`
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
      `}}const hs=t=>{const e=Math.round(Math.min(Math.max(t,0),255)).toString(16);return 1===e.length?`0${e}`:e},ls=t=>`#${hs(t[0])}${hs(t[1])}${hs(t[2])}`,cs=t=>{const[e,s,i]=t,a=Math.max(e,s,i),o=a-Math.min(e,s,i),r=o&&(a===e?(s-i)/o:a===s?2+(i-e)/o:4+(e-s)/o);return[60*(r<0?r+6:r),a&&o/a,a]},ds=t=>{const[e,s,i]=t,a=t=>{const a=(t+e/60)%6;return i-i*s*Math.max(Math.min(a,4-a,1),0)};return[a(5),a(3),a(1)]},gs=t=>ds([t[0],t[1],255]),us=(t,e,s)=>Math.min(Math.max(t,e),s),ms=t=>{if(t<=66)return 255;return us(329.698727446*(t-60)**-.1332047592,0,255)},ps=t=>{let e;return e=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*(t-60)**-.0755148492,us(e,0,255)},fs=t=>{if(t>=66)return 255;if(t<=19)return 0;const e=138.5177312231*Math.log(t-10)-305.0447927307;return us(e,0,255)},vs=t=>{const e=t/100;return[ms(e),ps(e),fs(e)]},_s=(t,e)=>{const s=Math.max(...t),i=Math.max(...e);let a;return a=0===i?0:s/i,e.map((t=>Math.round(t*a)))},ys=t=>Math.floor(1e6/t),bs=(t,e,s)=>{const[i,a,o,r,n]=t,h=ys(e??2700),l=ys(s??6500),c=h-l;let d;try{d=n/(r+n)}catch(y){d=.5}const g=l+d*c,u=g?(m=g,Math.floor(1e6/m)):0;var m;const[p,f,v]=vs(u),_=Math.max(r,n)/255;return _s([i,a,o,r,n],[i+p*_,a+f*_,o+v*_])};console.info(`%c  SWISS-ARMY-KNIFE-CARD  \n%c      Version ${ut}      `,"color: yellow; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray");class ws extends ot{constructor(){if(super(),this.connected=!1,Mt.setElement(this),this.cardId=Math.random().toString(36).substr(2,9),this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.secondaryInfoStr=[],this.iconStr=[],this.viewBoxSize=ft,this.viewBox={width:ft,height:ft},this.toolsets=[],this.tools=[],this.styles={},this.styles.card={},this.styles.card.default={},this.styles.card.light={},this.styles.card.dark={},this.entityHistory={},this.entityHistory.needed=!1,this.stateChanged=!0,this.entityHistory.updating=!1,this.entityHistory.update_interval=300,this.dev={},this.dev.debug=!1,this.dev.performance=!1,this.dev.m3=!1,this.configIsSet=!1,this.theme={},this.theme.checked=!1,this.theme.isLoaded=!1,this.theme.modeChanged=!1,this.theme.darkMode=!1,this.theme.light={},this.theme.dark={},this.isSafari=!!window.navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),this.iOS=(/iPad|iPhone|iPod/.test(window.navigator.userAgent)||"MacIntel"===window.navigator.platform&&window.navigator.maxTouchPoints>1)&&!window.MSStream,this.isSafari14=this.isSafari&&/Version\/14\.[0-9]/.test(window.navigator.userAgent),this.isSafari15=this.isSafari&&/Version\/15\.[0-9]/.test(window.navigator.userAgent),this.isSafari16=this.isSafari&&/Version\/16\.[0-9]/.test(window.navigator.userAgent),this.isSafari16=this.isSafari&&/Version\/16\.[0-9]/.test(window.navigator.userAgent),this.isSafari14=this.isSafari14||/os 15.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.isSafari15=this.isSafari15||/os 14.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.isSafari16=this.isSafari16||/os 16.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.lovelace=ws.lovelace,!this.lovelace)throw console.error("card::constructor - Can't get Lovelace panel"),Error("card::constructor - Can't get Lovelace panel");ws.colorCache||(ws.colorCache=[]),this.palette={},this.palette.light={},this.palette.dark={},this.dev.debug&&console.log("*****Event - card - constructor",this.cardId,(new Date).getTime())}static getSystemStyles(){return it`
      :host {
        cursor: default;
        font-size: ${4}px;
        --sak-ref-palette-gray-platinum: #e9e9ea;
        --sak-ref-palette-gray-french-gray: #d1d1d6;
        --sak-ref-palette-gray-taupe-gray: #8e8e93;
        --sak-ref-palette-gray-cool-gray: #919bb4;

        --sak-ref-palette-yellow-sunglow: #F7ce46;
        --sak-ref-palette-yellow-jonquil: #ffcc01;
        --sak-ref-palette-yellow-Amber: #f6b90b;

        --sak-ref-palette-orange-xanthous: #F3b530;
        --sak-ref-palette-orange-princeton-orange: #ff9500;
        --sak-ref-palette-orange-orange : #F46c36;

        --sak-ref-palette-red-indian-red: #ed5254;
        --sak-ref-palette-red-japser: #d85140;
        --sak-ref-palette-red-cinnabar: #ff3b2f;

        --sak-ref-palette-purple-amethyst: #Af52de;
        --sak-ref-palette-purple-tropical-indigo: #8d82ef;
        --sak-ref-palette-purple-slate-blue: #5f5dd1;
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

    `}static getUserStyles(){return this.userContent="",ws.lovelace.config.sak_user_templates&&ws.lovelace.config.sak_user_templates.definitions.user_css_definitions&&(this.userContent=ws.lovelace.config.sak_user_templates.definitions.user_css_definitions.reduce(((t,e)=>t+e.content),"")),it`${st(this.userContent)}`}static getSakStyles(){return this.sakContent="",ws.lovelace.config.sak_sys_templates&&ws.lovelace.config.sak_sys_templates.definitions.sak_css_definitions&&(this.sakContent=ws.lovelace.config.sak_sys_templates.definitions.sak_css_definitions.reduce(((t,e)=>t+e.content),"")),it`${st(this.sakContent)}`}static getSakSvgDefinitions(){ws.lovelace.sakSvgContent=null;let t="";ws.lovelace.config.sak_sys_templates&&ws.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions&&(t=ws.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions.reduce(((t,e)=>t+e.content),"")),ws.sakSvgContent=ct(t)}static getUserSvgDefinitions(){ws.lovelace.userSvgContent=null;let t="";ws.lovelace.config.sak_user_templates&&ws.lovelace.config.sak_user_templates.definitions.user_svg_definitions&&(t=ws.lovelace.config.sak_user_templates.definitions.user_svg_definitions.reduce(((t,e)=>t+e.content),"")),ws.userSvgContent=ct(t)}static get styles(){if(ws.lovelace||(ws.lovelace=bt.getLovelace()),!ws.lovelace)throw console.error("SAK - Can't get reference to Lovelace"),Error("card::get styles - Can't get Lovelace panel");if(!ws.lovelace.config.sak_sys_templates)throw console.error(ut," - SAK - System Templates reference NOT defined."),Error(ut," - card::get styles - System Templates reference NOT defined!");return ws.lovelace.config.sak_user_templates||console.warning(ut," - SAK - User Templates reference NOT defined. Did you NOT include them?"),ws.getSakSvgDefinitions(),ws.getUserSvgDefinitions(),it`
      ${ws.getSystemStyles()}
      ${ws.getSakStyles()}
      ${ws.getUserStyles()}
    `}set hass(t){if(this.counter||(this.counter=0),this.counter+=1,this.theme.modeChanged=t.themes.darkMode!==this.theme.darkMode,this.theme.modeChanged&&(this.theme.darkMode=t.themes.darkMode,Mt.colorCache={}),!this.theme.checked){if(this.theme.checked=!0,this.config.theme&&t.themes.themes[this.config.theme]){const{themeLight:e,themeDark:s}=Mt.processTheme(t.themes.themes[this.config.theme]);this.theme.light=e,this.theme.dark=s,this.theme.isLoaded=!0}this.styles.card.light={...this.styles.card.default,...this.theme.light,...this.palette.light},this.styles.card.dark={...this.styles.card.default,...this.theme.dark,...this.palette.dark}}if(this.dev.debug&&console.log("*****Event - card::set hass",this.cardId,(new Date).getTime()),this._hass=t,this.connected||this.dev.debug&&console.log("set hass but NOT connected",this.cardId),!this.config.entities)return;let e,s,i,a,o,r=!1,n=0,h=!1,l=!1,c=!1;for(e of this.config.entities){if(this.entities[n]=t.states[this.config.entities[n].entity],c=void 0===this.entities[n],c&&console.error("SAK - set hass, entity undefined: ",this.config.entities[n].entity),this.config.entities[n].secondary_info&&(h=!0,s=c?void 0:this.entities[n][this.config.entities[n].secondary_info],i=this._buildStateString(s,this.config.entities[n]),i!==this.secondaryInfoStr[n]&&(this.secondaryInfoStr[n]=i,r=!0)),this.config.entities[n].icon||(a=c?void 0:t.states[this.config.entities[n].entity].attributes.icon,a!==this.iconStr[n]&&(this.iconStr[n]=a,r=!0)),this.config.entities[n].attribute){let{attribute:t}=this.config.entities[n],e="",s="";const i=this.config.entities[n].attribute.indexOf("["),a=this.config.entities[n].attribute.indexOf(".");let h=0,c="";-1!==i?(t=this.config.entities[n].attribute.substr(0,i),e=this.config.entities[n].attribute.substr(i,this.config.entities[n].attribute.length-i),h=e[1],c=e.substr(4,e.length-4),s=this.entities[n].attributes[t][h][c]):-1!==a?(t=this.config.entities[n].attribute.substr(0,a),e=this.config.entities[n].attribute.substr(i,this.config.entities[n].attribute.length-i),c=e.substr(1,e.length-1),s=this.entities[n].attributes[t][c],console.log("set hass, attributes with map",this.config.entities[n].attribute,t,e)):s=this.entities[n].attributes[t],o=this._buildStateString(s,this.config.entities[n]),o!==this.attributesStr[n]&&(this.attributesStr[n]=o,r=!0),l=!0}l||h||(o=c?void 0:this._buildStateString(this.entities[n].state,this.config.entities[n]),o!==this.entitiesStr[n]&&(this.entitiesStr[n]=o,r=!0),this.dev.debug&&console.log("set hass - attrSet=false",this.cardId,`${(new Date).getSeconds().toString()}.${(new Date).getMilliseconds().toString()}`,o)),r||=l||h,n+=1,l=!1,h=!1}(r||this.theme.modeChanged)&&(this.toolsets&&this.toolsets.map((t=>(t.updateValues(),!0))),this.requestUpdate(),this.theme.modeChanged=!1,this.counter-=1)}setConfig(t){if(this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE card::setConfig`),this.dev.debug&&console.log("*****Event - setConfig",this.cardId,(new Date).getTime()),(t=JSON.parse(JSON.stringify(t))).dev&&(this.dev={...this.dev,...t.dev}),this.dev.debug&&console.log("setConfig",this.cardId),!t.layout)throw Error("card::setConfig - No layout defined");if(t.entities){if("sensor"!==Rt(t.entities[0].entity)&&t.entities[0].attribute&&!isNaN(t.entities[0].attribute))throw Error("card::setConfig - First entity or attribute must be a numbered sensorvalue, but is NOT")}const e=yt.mergeDeep(t);this.config=e,this.toolset=[];const s=this;function i(t,e){if(e?.template){const t=s.lovelace.config.sak_user_templates.templates[e.template.name];t||console.error("Template not found...",e.template,t);const i=wt.replaceVariables3(e.template.variables,t);return yt.mergeDeep(i)}return"template"===t?(console.log("findTemplate return key=template/value",t,void 0),e):e}const a=JSON.stringify(this.config,i);if(this.config.palette){this.config.palette=JSON.parse(a).palette;const{paletteLight:n,paletteDark:h}=Mt.processPalette(this.config.palette);this.palette.light=n,this.palette.dark=h}const o=JSON.parse(a).layout.toolsets;if(this.config.layout.template&&(this.config.layout=JSON.parse(a).layout),this.config.layout.toolsets.map(((t,e)=>{let s=null;this.toolsets||(this.toolsets=[]);{let a=!1,r=[];s=o[e].tools,t.tools&&t.tools.map(((n,h)=>(o[e].tools.map(((r,l)=>(n.id===r.id&&(t.template&&(this.config.layout.toolsets[e].position&&(o[e].position=yt.mergeDeep(this.config.layout.toolsets[e].position)),s[l]=yt.mergeDeep(s[l],n),s[l]=JSON.parse(JSON.stringify(s[l],i)),a=!0),this.dev.debug&&console.log("card::setConfig - got toolsetCfg toolid",n,h,r,l,n)),o[e].tools[l]=wt.getJsTemplateOrValueConfig(o[e].tools[l],this.config.entities,yt.mergeDeep(o[e].tools[l])),a))),a||(r=r.concat(t.tools[h])),a))),s=s.concat(r)}t=o[e];const a=new ns(this,t);return this.toolsets.push(a),!0})),this.dev.m3&&(console.log("*** M3 - Checking for m3.yaml template to convert..."),this.lovelace.config.sak_user_templates.templates.m3)){const{m3:l}=this.lovelace.config.sak_user_templates.templates;console.log("*** M3 - Found. Material 3 conversion starting...");let c="",d="",g="",u="",m="",p="",f="",v="",_="",y="";const b={},w={},x={};l.entities.map((t=>(["ref.palette","sys.color","sys.color.light","sys.color.dark"].includes(t.category_id)&&(t.tags.includes("alias")||(b[t.id]={value:t.value,tags:t.tags})),"ref.palette"===t.category_id&&(c+=`${t.id}: '${t.value}'\n`,"md.ref.palette.primary40"===t.id&&(p=t.value),"md.ref.palette.primary80"===t.id&&(_=t.value),"md.ref.palette.neutral40"===t.id&&(f=t.value),"md.ref.palette.neutral80"===t.id&&(y=t.value)),"sys.color"===t.category_id&&(d+=`${t.id}: '${t.value}'\n`),"sys.color.light"===t.category_id&&(g+=`${t.id}: '${t.value}'\n`,"md.sys.color.surface.light"===t.id&&(m=t.value)),"sys.color.dark"===t.category_id&&(u+=`${t.id}: '${t.value}'\n`,"md.sys.color.surface.dark"===t.id&&(v=t.value)),!0))),["primary","secondary","tertiary","error","neutral","neutral-variant"].forEach((t=>{[5,15,25,35,45,65,75,85].forEach((e=>{b[`md.ref.palette.${t}${e.toString()}`]={value:Mt.getGradientValue(b[`md.ref.palette.${t}${(e-5).toString()}`].value,b[`md.ref.palette.${t}${(e+5).toString()}`].value,.5),tags:[...b[`md.ref.palette.${t}${(e-5).toString()}`].tags]},b[`md.ref.palette.${t}${e.toString()}`].tags[3]=t+e.toString()})),b[`md.ref.palette.${t}7`]={value:Mt.getGradientValue(b[`md.ref.palette.${t}5`].value,b[`md.ref.palette.${t}10`].value,.5),tags:[...b[`md.ref.palette.${t}10`].tags]},b[`md.ref.palette.${t}7`].tags[3]=`${t}7`,b[`md.ref.palette.${t}92`]={value:Mt.getGradientValue(b[`md.ref.palette.${t}90`].value,b[`md.ref.palette.${t}95`].value,.5),tags:[...b[`md.ref.palette.${t}90`].tags]},b[`md.ref.palette.${t}92`].tags[3]=`${t}92`,b[`md.ref.palette.${t}97`]={value:Mt.getGradientValue(b[`md.ref.palette.${t}95`].value,b[`md.ref.palette.${t}99`].value,.5),tags:[...b[`md.ref.palette.${t}90`].tags]},b[`md.ref.palette.${t}97`].tags[3]=`${t}97`}));for(const[Y,J]of Object.entries(b))w[Y]=`theme-${J.tags[1]}-${J.tags[2]}-${J.tags[3]}: rgb(${$(J.value)})`,x[Y]=`theme-${J.tags[1]}-${J.tags[2]}-${J.tags[3]}-rgb: ${$(J.value)}`;function $(t){const e={};e.r=Math.round(parseInt(t.substr(1,2),16)),e.g=Math.round(parseInt(t.substr(3,2),16)),e.b=Math.round(parseInt(t.substr(5,2),16));return`${e.r},${e.g},${e.b}`}function k(t,e,s,i,a){const o={},r={};o.r=Math.round(parseInt(t.substr(1,2),16)),o.g=Math.round(parseInt(t.substr(3,2),16)),o.b=Math.round(parseInt(t.substr(5,2),16)),r.r=Math.round(parseInt(e.substr(1,2),16)),r.g=Math.round(parseInt(e.substr(3,2),16)),r.b=Math.round(parseInt(e.substr(5,2),16));let n,h,l,c="";return s.forEach(((t,e)=>{n=Math.round(t*r.r+(1-t)*o.r),h=Math.round(t*r.g+(1-t)*o.g),l=Math.round(t*r.b+(1-t)*o.b),c+=`${i+(e+1).toString()}-${a}: rgb(${n},${h},${l})\n`,c+=`${i+(e+1).toString()}-${a}-rgb: ${n},${h},${l}\n`})),c}const S=[.03,.05,.08,.11,.15,.19,.24,.29,.35,.4],M=[.05,.08,.11,.15,.19,.24,.29,.35,.4,.45],A=k(m,f,S,"  theme-ref-elevation-surface-neutral","light"),C=b["md.ref.palette.neutral-variant40"].value,E=k(m,C,S,"  theme-ref-elevation-surface-neutral-variant","light"),T=k(m,p,S,"  theme-ref-elevation-surface-primary","light"),I=b["md.ref.palette.secondary40"].value,N=k(m,I,S,"  theme-ref-elevation-surface-secondary","light"),D=b["md.ref.palette.tertiary40"].value,V=k(m,D,S,"  theme-ref-elevation-surface-tertiary","light"),P=b["md.ref.palette.error40"].value,R=k(m,P,S,"  theme-ref-elevation-surface-error","light"),L=k(v,y,M,"  theme-ref-elevation-surface-neutral","dark"),O=b["md.ref.palette.neutral-variant80"].value,B=k(v,O,M,"  theme-ref-elevation-surface-neutral-variant","dark"),z=k(v,_,M,"  theme-ref-elevation-surface-primary","dark"),F=b["md.ref.palette.secondary80"].value,G=k(v,F,M,"  theme-ref-elevation-surface-secondary","dark"),U=b["md.ref.palette.tertiary80"].value,q=k(v,U,M,"  theme-ref-elevation-surface-tertiary","dark"),j=b["md.ref.palette.error80"].value,H=k(v,j,M,"  theme-ref-elevation-surface-error","dark");let W="";for(const[X,Z]of Object.entries(w))"theme-ref"===Z.substring(0,9)&&(W+=`  ${Z}\n`,W+=`  ${x[X]}\n`);console.log(A+E+T+N+V+R+L+B+z+G+q+H+W),console.log("*** M3 - Material 3 conversion DONE. You should copy the above output...")}this.aspectratio=(this.config.layout.aspectratio||this.config.aspectratio||"1/1").trim();const r=this.aspectratio.split("/");this.viewBox||(this.viewBox={}),this.viewBox.width=r[0]*mt,this.viewBox.height=r[1]*mt,this.config.layout.styles?.card&&(this.styles.card.default=this.config.layout.styles.card),this.dev.debug&&console.log("Step 5: toolconfig, list of toolsets",this.toolsets),this.dev.debug&&console.log("debug - setConfig",this.cardId,this.config),this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE card::setConfig`),this.configIsSet=!0}connectedCallback(){this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE card::connectedCallback`),this.dev.debug&&console.log("*****Event - connectedCallback",this.cardId,(new Date).getTime()),this.connected=!0,super.connectedCallback(),this.entityHistory.update_interval&&(this.updateOnInterval(),clearInterval(this.interval),this.interval=setInterval((()=>this.updateOnInterval()),this._hass?1e3*this.entityHistory.update_interval:100)),this.dev.debug&&console.log("ConnectedCallback",this.cardId),this.requestUpdate(),this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE card::connectedCallback`)}disconnectedCallback(){this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE card::disconnectedCallback`),this.dev.debug&&console.log("*****Event - disconnectedCallback",this.cardId,(new Date).getTime()),this.interval&&(clearInterval(this.interval),this.interval=0),super.disconnectedCallback(),this.dev.debug&&console.log("disconnectedCallback",this.cardId),this.connected=!1,this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE card::disconnectedCallback`)}firstUpdated(t){this.dev.debug&&console.log("*****Event - card::firstUpdated",this.cardId,(new Date).getTime()),this.toolsets&&this.toolsets.map((async e=>(e.firstUpdated(t),!0)))}updated(t){this.dev.debug&&console.log("*****Event - Updated",this.cardId,(new Date).getTime()),this.toolsets&&this.toolsets.map((async e=>(e.updated(t),!0)))}render(){if(this.dev.performance&&console.time(`--\x3e ${this.cardId} PERFORMANCE card::render`),this.dev.debug&&console.log("*****Event - render",this.cardId,(new Date).getTime()),!this.connected)return void(this.dev.debug&&console.log("render but NOT connected",this.cardId,(new Date).getTime()));let t;try{t=this.config.disable_card?z`
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
                  `}catch(e){console.error(e)}return this.dev.performance&&console.timeEnd(`--\x3e ${this.cardId} PERFORMANCE card::render`),t}_renderSakSvgDefinitions(){return F`
    ${ws.sakSvgContent}
    `}_renderUserSvgDefinitions(){return F`
    ${ws.userSvgContent}
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
      </svg>`),F`${e}`}_buildUom(t,e,s){return t?.unit||s?.unit||e?.attributes.unit_of_measurement||""}toLocale(t,e="unknown"){const s=this._hass.selectedLanguage||this._hass.language,i=this._hass.resources[s];return i&&i[t]?i[t]:e}_buildStateString(t,e){if(void 0===t)return t;if(e.convert){let s,i,a=e.convert.match(/(^\w+)\((\d+)\)/);switch(null===a?s=e.convert:3===a.length&&(s=a[1],i=Number(a[2])),s){case"brightness_pct":t="undefined"===t?"undefined":`${Math.round(t/255*100)}`;break;case"multiply":t=`${Math.round(t*i)}`;break;case"divide":t=`${Math.round(t/i)}`;break;case"rgb_csv":case"rgb_hex":if(e.attribute){let i=this._hass.states[e.entity];switch(i.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(i.attributes.color_temp_kelvin){let e=vs(i.attributes.color_temp_kelvin);const a=cs(e);a[1]<.4&&(a[1]<.1?a[2]=225:a[1]=.4),e=ds(a),e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ls(e)}else t="rgb_csv"===s?"255,255,255":"#ffffff00";break;case"hs":{let e=gs([i.attributes.hs_color[0],i.attributes.hs_color[1]/100]);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ls(e)}break;case"rgb":{const e=cs(this.stateObj.attributes.rgb_color);e[1]<.4&&(e[1]<.1?e[2]=225:e[1]=.4);const i=ds(e);t="rgb_csv"===s?i.toString():ls(i)}break;case"rgbw":{let e=(t=>{const[e,s,i,a]=t;return _s([e,s,i,a],[e+a,s+a,i+a])})(i.attributes.rgbw_color);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ls(e)}break;case"rgbww":{let e=bs(i.attributes.rgbww_color,i.attributes?.min_color_temp_kelvin,i.attributes?.max_color_temp_kelvin);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ls(e)}break;case"xy":if(i.attributes.hs_color){let e=gs([i.attributes.hs_color[0],i.attributes.hs_color[1]/100]);const a=cs(e);a[1]<.4&&(a[1]<.1?a[2]=225:a[1]=.4),e=ds(a),e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ls(e)}else if(i.attributes.color){let e={};e.l=i.attributes.brightness,e.h=i.attributes.color.h||i.attributes.color.hue,e.s=i.attributes.color.s||i.attributes.color.saturation;let{r:a,g:o,b:r}=Mt.hslToRgb(e);if("rgb_csv"===s)t=`${a},${o},${r}`;else{t=`#${Mt.padZero(a.toString(16))}${Mt.padZero(o.toString(16))}${Mt.padZero(r.toString(16))}`}}else i.attributes.xy_color}}break;default:console.error(`Unknown converter [${s}] specified for entity [${e.entity}]!`)}}return void 0!==t?Number.isNaN(t)?t:t.toString():void 0}_computeEntity(t){return t.substr(t.indexOf(".")+1)}updateOnInterval(){this._hass?(this.updateData(),this.entityHistory.needed?(window.clearInterval(this.interval),this.interval=setInterval((()=>this.updateOnInterval()),1e3*this.entityHistory.update_interval)):this.interval&&(window.clearInterval(this.interval),this.interval=0)):this.dev.debug&&console.log("UpdateOnInterval - NO hass, returning")}async fetchRecent(t,e,s,i){let a="history/period";return e&&(a+=`/${e.toISOString()}`),a+=`?filter_entity_id=${t}`,s&&(a+=`&end_time=${s.toISOString()}`),i&&(a+="&skip_initial_state"),a+="&minimal_response",this._hass.callApi("GET",a)}async updateData(){this.entityHistory.updating=!0,this.dev.debug&&console.log("card::updateData - ENTRY",this.cardId);const t=[];let e=0;this.toolsets.map(((s,i)=>(s.tools.map(((s,a)=>{if("bar"===s.type||"sparkline"===s.type){if("real_time"===s.tool.config?.period?.type)return!0;const o=new Date,r=new Date;"day"===s.tool.config.period?.calendar?.period?(r.setHours(0,0,0,0),r.setHours(r.getHours()+24*s.tool.config.period.calendar.offset),0!==s.tool.config.period.calendar.offset&&o.setHours(0,0,0,0)):r.setHours(o.getHours()-(s.tool.config.period?.rolling_window?.duration?.hour||s.tool.config.hours));const n=this.config.entities[s.tool.config.entity_index].attribute?this.config.entities[s.tool.config.entity_index].attribute:null;t[e]={tsidx:i,entityIndex:s.tool.config.entity_index,entityId:this.entities[s.tool.config.entity_index].entity_id,attrId:n,start:r,end:o,type:s.type,idx:a},e+=1}return!0})),!0))),this.dev.debug&&console.log("card::updateData - LENGTH",this.cardId,t.length,t),this.stateChanged=!1,this.dev.debug&&console.log("card::updateData, entityList from tools",t);try{const e=t.map(((t,e)=>this.updateEntity(t,e,t.start,t.end)));await Promise.all(e)}finally{this.entityHistory.updating=!1}this.entityHistory.updating=!1}async updateEntity(t,e,s,i){let a=[];const o=s;let r,n=await this.fetchRecent(t.entityId,o,i,!1);"sparkline"===t.type&&this.toolsets[t.tsidx].tools[t.idx].tool.processStateMap(n),n[0]&&n[0].length>0&&(t.attrId&&(r=this.entities[t.entityIndex].attributes[this.config.entities[t.entityIndex].attribute],t.state=r),n=n[0].filter((e=>t.attrId?!isNaN(parseFloat(e.attributes[t.attrId])):!isNaN(parseFloat(e.state)))),n=n.map((e=>({last_changed:e.last_changed,state:t.attrId?Number(e.attributes[t.attrId]):Number(e.state)})))),a=[...a,...n],"sparkline"===t.type?(this.toolsets[t.tsidx].tools[t.idx].tool.data=t.entityIndex,this.toolsets[t.tsidx].tools[t.idx].tool.series=[...a],this.requestUpdate()):this.uppdate(t,a)}uppdate(t,e){if(!e)return;const s=(new Date).getTime();let i=24,a=2;"bar"!==t.type&&"sparkline"!==t.type||(this.dev.debug&&console.log("entity.type == bar",t),i=this.toolsets[t.tsidx].tools[t.idx].tool.config.hours,a=this.toolsets[t.tsidx].tools[t.idx].tool.config.barhours);const o=e.reduce(((t,e)=>((t,e)=>{const o=(s-new Date(e.last_changed).getTime())/36e5/a-i/a,r=Math.floor(Math.abs(o));return t[r]||(t[r]=[]),t[r].push(e),t})(t,e)),[]);if(o.length=Math.ceil(i/a),0===Object.keys(o).length)return;const r=Object.keys(o)[0];"0"!==r&&(o[0]=[],o[0].push(o[r][0]));for(let h=0;h<i/a;h++)o[h]||(o[h]=[],o[h].push(o[h-1][o[h-1].length-1]));this.coords=o;let n=[];n=[],n=o.map((t=>{return s="state",(e=t).reduce(((t,e)=>t+Number(e[s])),0)/e.length;var e,s})),["bar"].includes(t.type)&&(this.toolsets[t.tsidx].tools[t.idx].tool.series=[...n]),this.requestUpdate()}getCardSize(){return 4}}customElements.define("swiss-army-knife-card",ws);
