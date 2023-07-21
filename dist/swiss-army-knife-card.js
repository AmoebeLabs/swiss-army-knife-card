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
/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = typeof window !== 'undefined' &&
    window.customElements != null &&
    window.customElements.polyfillWrapFlushCallback !==
        undefined;
/**
 * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
 * into another container (could be the same container), before `before`. If
 * `before` is null, it appends the nodes to the container.
 */
const reparentNodes = (container, start, end = null, before = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.insertBefore(start, before);
        start = n;
    }
};
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */
const removeNodes = (container, start, end = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.removeChild(start);
        start = n;
    }
};

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
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */
const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */
const boundAttributeSuffix = '$lit$';
/**
 * An updatable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        const nodesToRemove = [];
        const stack = [];
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        // Keeps track of the last index associated with a part. We try to delete
        // unnecessary nodes, but we never want to associate two different parts
        // to the same index. They must have a constant node between.
        let lastPartIndex = 0;
        let index = -1;
        let partIndex = 0;
        const { strings, values: { length } } = result;
        while (partIndex < length) {
            const node = walker.nextNode();
            if (node === null) {
                // We've exhausted the content inside a nested template element.
                // Because we still have parts (the outer for-loop), we know:
                // - There is a template in the stack
                // - The walker will find a nextNode outside the template
                walker.currentNode = stack.pop();
                continue;
            }
            index++;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                if (node.hasAttributes()) {
                    const attributes = node.attributes;
                    const { length } = attributes;
                    // Per
                    // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                    // attributes are not guaranteed to be returned in document order.
                    // In particular, Edge/IE can return them out of order, so we cannot
                    // assume a correspondence between part index and attribute index.
                    let count = 0;
                    for (let i = 0; i < length; i++) {
                        if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                            count++;
                        }
                    }
                    while (count-- > 0) {
                        // Get the template literal section leading up to the first
                        // expression in this attribute
                        const stringForPart = strings[partIndex];
                        // Find the attribute name
                        const name = lastAttributeNameRegex.exec(stringForPart)[2];
                        // Find the corresponding attribute
                        // All bound attributes have had a suffix added in
                        // TemplateResult#getHTML to opt out of special attribute
                        // handling. To look up the attribute value we also need to add
                        // the suffix.
                        const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                        const attributeValue = node.getAttribute(attributeLookupName);
                        node.removeAttribute(attributeLookupName);
                        const statics = attributeValue.split(markerRegex);
                        this.parts.push({ type: 'attribute', index, name, strings: statics });
                        partIndex += statics.length - 1;
                    }
                }
                if (node.tagName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
            }
            else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                const data = node.data;
                if (data.indexOf(marker) >= 0) {
                    const parent = node.parentNode;
                    const strings = data.split(markerRegex);
                    const lastIndex = strings.length - 1;
                    // Generate a new text node for each literal section
                    // These nodes are also used as the markers for node parts
                    for (let i = 0; i < lastIndex; i++) {
                        let insert;
                        let s = strings[i];
                        if (s === '') {
                            insert = createMarker();
                        }
                        else {
                            const match = lastAttributeNameRegex.exec(s);
                            if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                s = s.slice(0, match.index) + match[1] +
                                    match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                            }
                            insert = document.createTextNode(s);
                        }
                        parent.insertBefore(insert, node);
                        this.parts.push({ type: 'node', index: ++index });
                    }
                    // If there's no text, we must insert a comment to mark our place.
                    // Else, we can trust it will stick around after cloning.
                    if (strings[lastIndex] === '') {
                        parent.insertBefore(createMarker(), node);
                        nodesToRemove.push(node);
                    }
                    else {
                        node.data = strings[lastIndex];
                    }
                    // We have a part for each match found
                    partIndex += lastIndex;
                }
            }
            else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                if (node.data === marker) {
                    const parent = node.parentNode;
                    // Add a new marker node to be the startNode of the Part if any of
                    // the following are true:
                    //  * We don't have a previousSibling
                    //  * The previousSibling is already the start of a previous part
                    if (node.previousSibling === null || index === lastPartIndex) {
                        index++;
                        parent.insertBefore(createMarker(), node);
                    }
                    lastPartIndex = index;
                    this.parts.push({ type: 'node', index });
                    // If we don't have a nextSibling, keep this node so we have an end.
                    // Else, we can remove it to save future costs.
                    if (node.nextSibling === null) {
                        node.data = '';
                    }
                    else {
                        nodesToRemove.push(node);
                        index--;
                    }
                    partIndex++;
                }
                else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                        // Comment node has a binding marker inside, make an inactive part
                        // The binding won't work, but subsequent bindings will
                        // TODO (justinfagnani): consider whether it's even worth it to
                        // make bindings in comments work
                        this.parts.push({ type: 'node', index: -1 });
                        partIndex++;
                    }
                }
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
const endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
};
const isTemplatePartActive = (part) => part.index !== -1;
// Allows `document.createComment('')` to be renamed for a
// small manual size-savings.
const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex = 
// eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

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
const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */
function removeNodesFromTemplate(template, nodesToRemove) {
    const { element: { content }, parts } = template;
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let part = parts[partIndex];
    let nodeIndex = -1;
    let removeCount = 0;
    const nodesToRemoveInTemplate = [];
    let currentRemovingNode = null;
    while (walker.nextNode()) {
        nodeIndex++;
        const node = walker.currentNode;
        // End removal if stepped past the removing node
        if (node.previousSibling === currentRemovingNode) {
            currentRemovingNode = null;
        }
        // A node to remove was found in the template
        if (nodesToRemove.has(node)) {
            nodesToRemoveInTemplate.push(node);
            // Track node we're removing
            if (currentRemovingNode === null) {
                currentRemovingNode = node;
            }
        }
        // When removing, increment count by which to adjust subsequent part indices
        if (currentRemovingNode !== null) {
            removeCount++;
        }
        while (part !== undefined && part.index === nodeIndex) {
            // If part is in a removed node deactivate it by setting index to -1 or
            // adjust the index as needed.
            part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
            // go to the next active part.
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
            part = parts[partIndex];
        }
    }
    nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
}
const countNodes = (node) => {
    let count = (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) ? 0 : 1;
    const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
    while (walker.nextNode()) {
        count++;
    }
    return count;
};
const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
    for (let i = startIndex + 1; i < parts.length; i++) {
        const part = parts[i];
        if (isTemplatePartActive(part)) {
            return i;
        }
    }
    return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */
function insertNodeIntoTemplate(template, node, refNode = null) {
    const { element: { content }, parts } = template;
    // If there's no refNode, then put node at end of template.
    // No part indices need to be shifted in this case.
    if (refNode === null || refNode === undefined) {
        content.appendChild(node);
        return;
    }
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let insertCount = 0;
    let walkerIndex = -1;
    while (walker.nextNode()) {
        walkerIndex++;
        const walkerNode = walker.currentNode;
        if (walkerNode === refNode) {
            insertCount = countNodes(node);
            refNode.parentNode.insertBefore(node, refNode);
        }
        while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
            // If we've inserted the node, simply adjust all subsequent parts
            if (insertCount > 0) {
                while (partIndex !== -1) {
                    parts[partIndex].index += insertCount;
                    partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                }
                return;
            }
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }
    }
}

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
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */
const directive = (f) => ((...args) => {
    const d = f(...args);
    directives.set(d, true);
    return d;
});
const isDirective = (o) => {
    return typeof o === 'function' && directives.has(o);
};

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
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */
const nothing = {};

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
/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, processor, options) {
        this.__parts = [];
        this.template = template;
        this.processor = processor;
        this.options = options;
    }
    update(values) {
        let i = 0;
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.setValue(values[i]);
            }
            i++;
        }
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.commit();
            }
        }
    }
    _clone() {
        // There are a number of steps in the lifecycle of a template instance's
        // DOM fragment:
        //  1. Clone - create the instance fragment
        //  2. Adopt - adopt into the main document
        //  3. Process - find part markers and create parts
        //  4. Upgrade - upgrade custom elements
        //  5. Update - set node, attribute, property, etc., values
        //  6. Connect - connect to the document. Optional and outside of this
        //     method.
        //
        // We have a few constraints on the ordering of these steps:
        //  * We need to upgrade before updating, so that property values will pass
        //    through any property setters.
        //  * We would like to process before upgrading so that we're sure that the
        //    cloned fragment is inert and not disturbed by self-modifying DOM.
        //  * We want custom elements to upgrade even in disconnected fragments.
        //
        // Given these constraints, with full custom elements support we would
        // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
        //
        // But Safari does not implement CustomElementRegistry#upgrade, so we
        // can not implement that order and still have upgrade-before-update and
        // upgrade disconnected fragments. So we instead sacrifice the
        // process-before-upgrade constraint, since in Custom Elements v1 elements
        // must not modify their light DOM in the constructor. We still have issues
        // when co-existing with CEv0 elements like Polymer 1, and with polyfills
        // that don't strictly adhere to the no-modification rule because shadow
        // DOM, which may be created in the constructor, is emulated by being placed
        // in the light DOM.
        //
        // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
        // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
        // in one step.
        //
        // The Custom Elements v1 polyfill supports upgrade(), so the order when
        // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
        // Connect.
        const fragment = isCEPolyfill ?
            this.template.element.content.cloneNode(true) :
            document.importNode(this.template.element.content, true);
        const stack = [];
        const parts = this.template.parts;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        let partIndex = 0;
        let nodeIndex = 0;
        let part;
        let node = walker.nextNode();
        // Loop through all the nodes and parts of a template
        while (partIndex < parts.length) {
            part = parts[partIndex];
            if (!isTemplatePartActive(part)) {
                this.__parts.push(undefined);
                partIndex++;
                continue;
            }
            // Progress the tree walker until we find our next part's node.
            // Note that multiple parts may share the same node (attribute parts
            // on a single element), so this loop may not run at all.
            while (nodeIndex < part.index) {
                nodeIndex++;
                if (node.nodeName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
                if ((node = walker.nextNode()) === null) {
                    // We've exhausted the content inside a nested template element.
                    // Because we still have parts (the outer for-loop), we know:
                    // - There is a template in the stack
                    // - The walker will find a nextNode outside the template
                    walker.currentNode = stack.pop();
                    node = walker.nextNode();
                }
            }
            // We've arrived at our part's node.
            if (part.type === 'node') {
                const part = this.processor.handleTextExpression(this.options);
                part.insertAfterNode(node.previousSibling);
                this.__parts.push(part);
            }
            else {
                this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
            }
            partIndex++;
        }
        if (isCEPolyfill) {
            document.adoptNode(fragment);
            customElements.upgrade(fragment);
        }
        return fragment;
    }
}

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
/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
const policy = window.trustedTypes &&
    trustedTypes.createPolicy('lit-html', { createHTML: (s) => s });
const commentMarker = ` ${marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values, type, processor) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isCommentBinding = false;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            // For each binding we want to determine the kind of marker to insert
            // into the template source before it's parsed by the browser's HTML
            // parser. The marker type is based on whether the expression is in an
            // attribute, text, or comment position.
            //   * For node-position bindings we insert a comment with the marker
            //     sentinel as its text content, like <!--{{lit-guid}}-->.
            //   * For attribute bindings we insert just the marker sentinel for the
            //     first binding, so that we support unquoted attribute bindings.
            //     Subsequent bindings can use a comment marker because multi-binding
            //     attributes must be quoted.
            //   * For comment bindings we insert just the marker sentinel so we don't
            //     close the comment.
            //
            // The following code scans the template source, but is *not* an HTML
            // parser. We don't need to track the tree structure of the HTML, only
            // whether a binding is inside a comment, and if not, if it appears to be
            // the first binding in an attribute.
            const commentOpen = s.lastIndexOf('<!--');
            // We're in comment position if we have a comment open with no following
            // comment close. Because <-- can appear in an attribute value there can
            // be false positives.
            isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                s.indexOf('-->', commentOpen + 1) === -1;
            // Check to see if we have an attribute-like sequence preceding the
            // expression. This can match "name=value" like structures in text,
            // comments, and attribute values, so there can be false-positives.
            const attributeMatch = lastAttributeNameRegex.exec(s);
            if (attributeMatch === null) {
                // We're only in this branch if we don't have a attribute-like
                // preceding sequence. For comments, this guards against unusual
                // attribute values like <div foo="<!--${'bar'}">. Cases like
                // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                // below.
                html += s + (isCommentBinding ? commentMarker : nodeMarker);
            }
            else {
                // For attributes we use just a marker sentinel, and also append a
                // $lit$ suffix to the name to opt-out of attribute-specific parsing
                // that IE and Edge do for style and certain SVG attributes.
                html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                    attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
                    marker;
            }
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        let value = this.getHTML();
        if (policy !== undefined) {
            // this is secure because `this.strings` is a TemplateStringsArray.
            // TODO: validate this when
            // https://github.com/tc39/proposal-array-is-template-object is
            // implemented.
            value = policy.createHTML(value);
        }
        template.innerHTML = value;
        return template;
    }
}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */
class SVGTemplateResult extends TemplateResult {
    getHTML() {
        return `<svg>${super.getHTML()}</svg>`;
    }
    getTemplateElement() {
        const template = super.getTemplateElement();
        const content = template.content;
        const svgElement = content.firstChild;
        content.removeChild(svgElement);
        reparentNodes(content, svgElement.firstChild);
        return template;
    }
}

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
const isPrimitive = (value) => {
    return (value === null ||
        !(typeof value === 'object' || typeof value === 'function'));
};
const isIterable = (value) => {
    return Array.isArray(value) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attribute. The value is only set once even if there are multiple parts
 * for an attribute.
 */
class AttributeCommitter {
    constructor(element, name, strings) {
        this.dirty = true;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.parts = [];
        for (let i = 0; i < strings.length - 1; i++) {
            this.parts[i] = this._createPart();
        }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */
    _createPart() {
        return new AttributePart(this);
    }
    _getValue() {
        const strings = this.strings;
        const l = strings.length - 1;
        const parts = this.parts;
        // If we're assigning an attribute via syntax like:
        //    attr="${foo}"  or  attr=${foo}
        // but not
        //    attr="${foo} ${bar}" or attr="${foo} baz"
        // then we don't want to coerce the attribute value into one long
        // string. Instead we want to just return the value itself directly,
        // so that sanitizeDOMValue can get the actual value rather than
        // String(value)
        // The exception is if v is an array, in which case we do want to smash
        // it together into a string without calling String() on the array.
        //
        // This also allows trusted values (when using TrustedTypes) being
        // assigned to DOM sinks without being stringified in the process.
        if (l === 1 && strings[0] === '' && strings[1] === '') {
            const v = parts[0].value;
            if (typeof v === 'symbol') {
                return String(v);
            }
            if (typeof v === 'string' || !isIterable(v)) {
                return v;
            }
        }
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const part = parts[i];
            if (part !== undefined) {
                const v = part.value;
                if (isPrimitive(v) || !isIterable(v)) {
                    text += typeof v === 'string' ? v : String(v);
                }
                else {
                    for (const t of v) {
                        text += typeof t === 'string' ? t : String(t);
                    }
                }
            }
        }
        text += strings[l];
        return text;
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            this.element.setAttribute(this.name, this._getValue());
        }
    }
}
/**
 * A Part that controls all or part of an attribute value.
 */
class AttributePart {
    constructor(committer) {
        this.value = undefined;
        this.committer = committer;
    }
    setValue(value) {
        if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
            this.value = value;
            // If the value is a not a directive, dirty the committer so that it'll
            // call setAttribute. If the value is a directive, it'll dirty the
            // committer if it calls setValue().
            if (!isDirective(value)) {
                this.committer.dirty = true;
            }
        }
    }
    commit() {
        while (isDirective(this.value)) {
            const directive = this.value;
            this.value = noChange;
            directive(this);
        }
        if (this.value === noChange) {
            return;
        }
        this.committer.commit();
    }
}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */
class NodePart {
    constructor(options) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.options = options;
    }
    /**
     * Appends this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendInto(container) {
        this.startNode = container.appendChild(createMarker());
        this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterNode(ref) {
        this.startNode = ref;
        this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part) {
        part.__insert(this.startNode = createMarker());
        part.__insert(this.endNode = createMarker());
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref) {
        ref.__insert(this.startNode = createMarker());
        this.endNode = ref.endNode;
        ref.endNode = this.startNode;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        if (this.startNode.parentNode === null) {
            return;
        }
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        const value = this.__pendingValue;
        if (value === noChange) {
            return;
        }
        if (isPrimitive(value)) {
            if (value !== this.value) {
                this.__commitText(value);
            }
        }
        else if (value instanceof TemplateResult) {
            this.__commitTemplateResult(value);
        }
        else if (value instanceof Node) {
            this.__commitNode(value);
        }
        else if (isIterable(value)) {
            this.__commitIterable(value);
        }
        else if (value === nothing) {
            this.value = nothing;
            this.clear();
        }
        else {
            // Fallback, will render the string representation
            this.__commitText(value);
        }
    }
    __insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    __commitNode(value) {
        if (this.value === value) {
            return;
        }
        this.clear();
        this.__insert(value);
        this.value = value;
    }
    __commitText(value) {
        const node = this.startNode.nextSibling;
        value = value == null ? '' : value;
        // If `value` isn't already a string, we explicitly convert it here in case
        // it can't be implicitly converted - i.e. it's a symbol.
        const valueAsString = typeof value === 'string' ? value : String(value);
        if (node === this.endNode.previousSibling &&
            node.nodeType === 3 /* Node.TEXT_NODE */) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if this.value is primitive?
            node.data = valueAsString;
        }
        else {
            this.__commitNode(document.createTextNode(valueAsString));
        }
        this.value = value;
    }
    __commitTemplateResult(value) {
        const template = this.options.templateFactory(value);
        if (this.value instanceof TemplateInstance &&
            this.value.template === template) {
            this.value.update(value.values);
        }
        else {
            // Make sure we propagate the template processor from the TemplateResult
            // so that we use its syntax extension, etc. The template factory comes
            // from the render function options so that it can control template
            // caching and preprocessing.
            const instance = new TemplateInstance(template, value.processor, this.options);
            const fragment = instance._clone();
            instance.update(value.values);
            this.__commitNode(fragment);
            this.value = instance;
        }
    }
    __commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _value is an array, then the previous render was of an
        // iterable and _value will contain the NodeParts from the previous
        // render. If _value is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this.value)) {
            this.value = [];
            this.clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this.value;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            // Try to reuse an existing part
            itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                itemPart = new NodePart(this.options);
                itemParts.push(itemPart);
                if (partIndex === 0) {
                    itemPart.appendIntoPart(this);
                }
                else {
                    itemPart.insertAfterPart(itemParts[partIndex - 1]);
                }
            }
            itemPart.setValue(item);
            itemPart.commit();
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
            this.clear(itemPart && itemPart.endNode);
        }
    }
    clear(startNode = this.startNode) {
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */
class BooleanAttributePart {
    constructor(element, name, strings) {
        this.value = undefined;
        this.__pendingValue = undefined;
        if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
            throw new Error('Boolean attributes can only contain a single expression');
        }
        this.element = element;
        this.name = name;
        this.strings = strings;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        if (this.__pendingValue === noChange) {
            return;
        }
        const value = !!this.__pendingValue;
        if (this.value !== value) {
            if (value) {
                this.element.setAttribute(this.name, '');
            }
            else {
                this.element.removeAttribute(this.name);
            }
            this.value = value;
        }
        this.__pendingValue = noChange;
    }
}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */
class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
        super(element, name, strings);
        this.single =
            (strings.length === 2 && strings[0] === '' && strings[1] === '');
    }
    _createPart() {
        return new PropertyPart(this);
    }
    _getValue() {
        if (this.single) {
            return this.parts[0].value;
        }
        return super._getValue();
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.element[this.name] = this._getValue();
        }
    }
}
class PropertyPart extends AttributePart {
}
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
let eventOptionsSupported = false;
// Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module
(() => {
    try {
        const options = {
            get capture() {
                eventOptionsSupported = true;
                return false;
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.addEventListener('test', options, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.removeEventListener('test', options, options);
    }
    catch (_e) {
        // event options not supported
    }
})();
class EventPart {
    constructor(element, eventName, eventContext) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.element = element;
        this.eventName = eventName;
        this.eventContext = eventContext;
        this.__boundHandleEvent = (e) => this.handleEvent(e);
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        if (this.__pendingValue === noChange) {
            return;
        }
        const newListener = this.__pendingValue;
        const oldListener = this.value;
        const shouldRemoveListener = newListener == null ||
            oldListener != null &&
                (newListener.capture !== oldListener.capture ||
                    newListener.once !== oldListener.once ||
                    newListener.passive !== oldListener.passive);
        const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        if (shouldAddListener) {
            this.__options = getOptions(newListener);
            this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        this.value = newListener;
        this.__pendingValue = noChange;
    }
    handleEvent(event) {
        if (typeof this.value === 'function') {
            this.value.call(this.eventContext || this.element, event);
        }
        else {
            this.value.handleEvent(event);
        }
    }
}
// We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.
const getOptions = (o) => o &&
    (eventOptionsSupported ?
        { capture: o.capture, passive: o.passive, once: o.once } :
        o.capture);

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
/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content
    const key = result.strings.join(marker);
    // Check if we already have a Template for this key
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        // If we have not seen this key before, create a new Template
        template = new Template(result, result.getTemplateElement());
        // Cache the Template for this key
        templateCache.keyString.set(key, template);
    }
    // Cache all future queries for this TemplateStringsArray
    templateCache.stringsArray.set(result.strings, template);
    return template;
}
const templateCaches = new Map();

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
const parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */
const render$1 = (result, container, options) => {
    let part = parts.get(container);
    if (part === undefined) {
        removeNodes(container, container.firstChild);
        parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
        part.appendInto(container);
    }
    part.setValue(result);
    part.commit();
};

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
/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
        const prefix = name[0];
        if (prefix === '.') {
            const committer = new PropertyCommitter(element, name.slice(1), strings);
            return committer.parts;
        }
        if (prefix === '@') {
            return [new EventPart(element, name.slice(1), options.eventContext)];
        }
        if (prefix === '?') {
            return [new BooleanAttributePart(element, name.slice(1), strings)];
        }
        const committer = new AttributeCommitter(element, name, strings);
        return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */
    handleTextExpression(options) {
        return new NodePart(options);
    }
}
const defaultTemplateProcessor = new DefaultTemplateProcessor();

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
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
if (typeof window !== 'undefined') {
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.4.1');
}
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */
const svg = (strings, ...values) => new SVGTemplateResult(strings, values, 'svg', defaultTemplateProcessor);

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
// Get a key to lookup in `templateCaches`.
const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
let compatibleShadyCSSVersion = true;
if (typeof window.ShadyCSS === 'undefined') {
    compatibleShadyCSSVersion = false;
}
else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn(`Incompatible ShadyCSS version detected. ` +
        `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
        `@webcomponents/shadycss@1.3.1.`);
    compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */
const shadyTemplateFactory = (scopeName) => (result) => {
    const cacheKey = getTemplateCacheKey(result.type, scopeName);
    let templateCache = templateCaches.get(cacheKey);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(cacheKey, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    const key = result.strings.join(marker);
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        const element = result.getTemplateElement();
        if (compatibleShadyCSSVersion) {
            window.ShadyCSS.prepareTemplateDom(element, scopeName);
        }
        template = new Template(result, element);
        templateCache.keyString.set(key, template);
    }
    templateCache.stringsArray.set(result.strings, template);
    return template;
};
const TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */
const removeStylesFromLitTemplates = (scopeName) => {
    TEMPLATE_TYPES.forEach((type) => {
        const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
        if (templates !== undefined) {
            templates.keyString.forEach((template) => {
                const { element: { content } } = template;
                // IE 11 doesn't support the iterable param Set constructor
                const styles = new Set();
                Array.from(content.querySelectorAll('style')).forEach((s) => {
                    styles.add(s);
                });
                removeNodesFromTemplate(template, styles);
            });
        }
    });
};
const shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */
const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
    shadyRenderSet.add(scopeName);
    // If `renderedDOM` is stamped from a Template, then we need to edit that
    // Template's underlying template element. Otherwise, we create one here
    // to give to ShadyCSS, which still requires one while scoping.
    const templateElement = !!template ? template.element : document.createElement('template');
    // Move styles out of rendered DOM and store.
    const styles = renderedDOM.querySelectorAll('style');
    const { length } = styles;
    // If there are no styles, skip unnecessary work
    if (length === 0) {
        // Ensure prepareTemplateStyles is called to support adding
        // styles via `prepareAdoptedCssText` since that requires that
        // `prepareTemplateStyles` is called.
        //
        // ShadyCSS will only update styles containing @apply in the template
        // given to `prepareTemplateStyles`. If no lit Template was given,
        // ShadyCSS will not be able to update uses of @apply in any relevant
        // template. However, this is not a problem because we only create the
        // template for the purpose of supporting `prepareAdoptedCssText`,
        // which doesn't support @apply at all.
        window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
        return;
    }
    const condensedStyle = document.createElement('style');
    // Collect styles into a single style. This helps us make sure ShadyCSS
    // manipulations will not prevent us from being able to fix up template
    // part indices.
    // NOTE: collecting styles is inefficient for browsers but ShadyCSS
    // currently does this anyway. When it does not, this should be changed.
    for (let i = 0; i < length; i++) {
        const style = styles[i];
        style.parentNode.removeChild(style);
        condensedStyle.textContent += style.textContent;
    }
    // Remove styles from nested templates in this scope.
    removeStylesFromLitTemplates(scopeName);
    // And then put the condensed style into the "root" template passed in as
    // `template`.
    const content = templateElement.content;
    if (!!template) {
        insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
    }
    else {
        content.insertBefore(condensedStyle, content.firstChild);
    }
    // Note, it's important that ShadyCSS gets the template that `lit-html`
    // will actually render so that it can update the style inside when
    // needed (e.g. @apply native Shadow DOM case).
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    const style = content.querySelector('style');
    if (window.ShadyCSS.nativeShadow && style !== null) {
        // When in native Shadow DOM, ensure the style created by ShadyCSS is
        // included in initially rendered output (`renderedDOM`).
        renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
    }
    else if (!!template) {
        // When no style is left in the template, parts will be broken as a
        // result. To fix this, we put back the style node ShadyCSS removed
        // and then tell lit to remove that node from the template.
        // There can be no style in the template in 2 cases (1) when Shady DOM
        // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
        // is in use ShadyCSS removes the style if it contains no content.
        // NOTE, ShadyCSS creates its own style so we can safely add/remove
        // `condensedStyle` here.
        content.insertBefore(condensedStyle, content.firstChild);
        const removes = new Set();
        removes.add(condensedStyle);
        removeNodesFromTemplate(template, removes);
    }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */
const render = (result, container, options) => {
    if (!options || typeof options !== 'object' || !options.scopeName) {
        throw new Error('The `scopeName` option is required.');
    }
    const scopeName = options.scopeName;
    const hasRendered = parts.has(container);
    const needsScoping = compatibleShadyCSSVersion &&
        container.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ &&
        !!container.host;
    // Handle first render to a scope specially...
    const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
    // On first scope render, render into a fragment; this cannot be a single
    // fragment that is reused since nested renders can occur synchronously.
    const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
    render$1(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
    // When performing first scope render,
    // (1) We've rendered into a fragment so that there's a chance to
    // `prepareTemplateStyles` before sub-elements hit the DOM
    // (which might cause them to render based on a common pattern of
    // rendering in a custom element's `connectedCallback`);
    // (2) Scope the template with ShadyCSS one time only for this scope.
    // (3) Render the fragment into the container and make sure the
    // container knows its `part` is the one we just rendered. This ensures
    // DOM will be re-used on subsequent renders.
    if (firstScopeRender) {
        const part = parts.get(renderContainer);
        parts.delete(renderContainer);
        // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
        // that should apply to `renderContainer` even if the rendered value is
        // not a TemplateInstance. However, it will only insert scoped styles
        // into the document if `prepareTemplateStyles` has already been called
        // for the given scope name.
        const template = part.value instanceof TemplateInstance ?
            part.value.template :
            undefined;
        prepareTemplateStyles(scopeName, renderContainer, template);
        removeNodes(container, container.firstChild);
        container.appendChild(renderContainer);
        parts.set(container, part);
    }
    // After elements have hit the DOM, update styling if this is the
    // initial render to this container.
    // This is needed whenever dynamic changes are made so it would be
    // safest to do every render; however, this would regress performance
    // so we leave it up to the user to call `ShadyCSS.styleElement`
    // for dynamic changes.
    if (!hasRendered && needsScoping) {
        window.ShadyCSS.styleElement(container.host);
    }
};

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
var _a;
/**
 * Use this module if you want to create your own base class extending
 * [[UpdatingElement]].
 * @packageDocumentation
 */
/*
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
window.JSCompiler_renameProperty =
    (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value ? '' : null;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                return value == null ? value : JSON.stringify(value);
        }
        return value;
    },
    fromAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value !== null;
            case Number:
                return value === null ? null : Number(value);
            case Object:
            case Array:
                // Type assert to adhere to Bazel's "must type assert JSON parse" rule.
                return JSON.parse(value);
        }
        return value;
    }
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual
};
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
/**
 * The Closure JS Compiler doesn't currently have good support for static
 * property semantics where "this" is dynamic (e.g.
 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
 * this hack to bypass any rewriting by the compiler.
 */
const finalized = 'finalized';
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 * @noInheritDoc
 */
class UpdatingElement extends HTMLElement {
    constructor() {
        super();
        this.initialize();
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     */
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're finalized.
        this.finalize();
        const attributes = [];
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this._classProperties.forEach((v, p) => {
            const attr = this._attributeNameForProperty(p, v);
            if (attr !== undefined) {
                this._attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
            }
        });
        return attributes;
    }
    /**
     * Ensures the private `_classProperties` property metadata is created.
     * In addition to `finalize` this is also called in `createProperty` to
     * ensure the `@property` decorator can add property metadata.
     */
    /** @nocollapse */
    static _ensureClassProperties() {
        // ensure private storage for property declarations.
        if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
            this._classProperties = new Map();
            // NOTE: Workaround IE11 not supporting Map constructor argument.
            const superProperties = Object.getPrototypeOf(this)._classProperties;
            if (superProperties !== undefined) {
                superProperties.forEach((v, k) => this._classProperties.set(k, v));
            }
        }
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a PropertyDeclaration for the property with the given options.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     *
     * @nocollapse
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        // Note, since this can be called by the `@property` decorator which
        // is called before `finalize`, we ensure storage exists for property
        // metadata.
        this._ensureClassProperties();
        this._classProperties.set(name, options);
        // Do not generate an accessor if the prototype already has one, since
        // it would be lost otherwise and that would never be the user's intention;
        // Instead, we expect users to call `requestUpdate` themselves from
        // user-defined accessors. Note that if the super has an accessor we will
        // still overwrite it
        if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
            return;
        }
        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
        const descriptor = this.getPropertyDescriptor(name, key, options);
        if (descriptor !== undefined) {
            Object.defineProperty(this.prototype, name, descriptor);
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     *   class MyElement extends LitElement {
     *     static getPropertyDescriptor(name, key, options) {
     *       const defaultDescriptor =
     *           super.getPropertyDescriptor(name, key, options);
     *       const setter = defaultDescriptor.set;
     *       return {
     *         get: defaultDescriptor.get,
     *         set(value) {
     *           setter.call(this, value);
     *           // custom action.
     *         },
     *         configurable: true,
     *         enumerable: true
     *       }
     *     }
     *   }
     *
     * @nocollapse
     */
    static getPropertyDescriptor(name, key, options) {
        return {
            // tslint:disable-next-line:no-any no symbol in index
            get() {
                return this[key];
            },
            set(value) {
                const oldValue = this[name];
                this[key] = value;
                this
                    .requestUpdateInternal(name, oldValue, options);
            },
            configurable: true,
            enumerable: true
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a PropertyDeclaration via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override `createProperty`.
     *
     * @nocollapse
     * @final
     */
    static getPropertyOptions(name) {
        return this._classProperties && this._classProperties.get(name) ||
            defaultPropertyDeclaration;
    }
    /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     * @nocollapse
     */
    static finalize() {
        // finalize any superclasses
        const superCtor = Object.getPrototypeOf(this);
        if (!superCtor.hasOwnProperty(finalized)) {
            superCtor.finalize();
        }
        this[finalized] = true;
        this._ensureClassProperties();
        // initialize Map populated in observedAttributes
        this._attributeToPropertyMap = new Map();
        // make any properties
        // Note, only process "own" properties since this element will inherit
        // any properties defined on the superClass, and finalization ensures
        // the entire prototype chain is finalized.
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            // support symbols in properties (IE11 does not support this)
            const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...(typeof Object.getOwnPropertySymbols === 'function') ?
                    Object.getOwnPropertySymbols(props) :
                    []
            ];
            // This for/of is ok because propKeys is an array
            for (const p of propKeys) {
                // note, use of `any` is due to TypeSript lack of support for symbol in
                // index types
                // tslint:disable-next-line:no-any no symbol in index
                this.createProperty(p, props[p]);
            }
        }
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static _attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false ?
            undefined :
            (typeof attribute === 'string' ?
                attribute :
                (typeof name === 'string' ? name.toLowerCase() : undefined));
    }
    /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     * @nocollapse
     */
    static _valueHasChanged(value, old, hasChanged = notEqual) {
        return hasChanged(value, old);
    }
    /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's
     * `converter` or `converter.fromAttribute` property option.
     * @nocollapse
     */
    static _propertyValueFromAttribute(value, options) {
        const type = options.type;
        const converter = options.converter || defaultConverter;
        const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
        return fromAttribute ? fromAttribute(value, type) : value;
    }
    /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     * @nocollapse
     */
    static _propertyValueToAttribute(value, options) {
        if (options.reflect === undefined) {
            return;
        }
        const type = options.type;
        const converter = options.converter;
        const toAttribute = converter && converter.toAttribute ||
            defaultConverter.toAttribute;
        return toAttribute(value, type);
    }
    /**
     * Performs element initialization. By default captures any pre-set values for
     * registered properties.
     */
    initialize() {
        this._updateState = 0;
        this._updatePromise =
            new Promise((res) => this._enableUpdatingResolver = res);
        this._changedProperties = new Map();
        this._saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this.requestUpdateInternal();
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    _saveInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.constructor
            ._classProperties.forEach((_v, p) => {
            if (this.hasOwnProperty(p)) {
                const value = this[p];
                delete this[p];
                if (!this._instanceProperties) {
                    this._instanceProperties = new Map();
                }
                this._instanceProperties.set(p, value);
            }
        });
    }
    /**
     * Applies previously saved instance properties.
     */
    _applyInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        // tslint:disable-next-line:no-any
        this._instanceProperties.forEach((v, p) => this[p] = v);
        this._instanceProperties = undefined;
    }
    connectedCallback() {
        // Ensure first connection completes an update. Updates cannot complete
        // before connection.
        this.enableUpdating();
    }
    enableUpdating() {
        if (this._enableUpdatingResolver !== undefined) {
            this._enableUpdatingResolver();
            this._enableUpdatingResolver = undefined;
        }
    }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     */
    disconnectedCallback() {
    }
    /**
     * Synchronizes property values when attributes change.
     */
    attributeChangedCallback(name, old, value) {
        if (old !== value) {
            this._attributeToProperty(name, value);
        }
    }
    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
        const ctor = this.constructor;
        const attr = ctor._attributeNameForProperty(name, options);
        if (attr !== undefined) {
            const attrValue = ctor._propertyValueToAttribute(value, options);
            // an undefined value does not change the attribute.
            if (attrValue === undefined) {
                return;
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
        }
    }
    _attributeToProperty(name, value) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
            return;
        }
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        // tslint:disable-next-line:no-unnecessary-type-assertion
        const propName = ctor._attributeToPropertyMap.get(name);
        if (propName !== undefined) {
            const options = ctor.getPropertyOptions(propName);
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
            this[propName] =
                // tslint:disable-next-line:no-any
                ctor._propertyValueFromAttribute(value, options);
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
        }
    }
    /**
     * This protected version of `requestUpdate` does not access or return the
     * `updateComplete` promise. This promise can be overridden and is therefore
     * not free to access.
     */
    requestUpdateInternal(name, oldValue, options) {
        let shouldRequestUpdate = true;
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            const ctor = this.constructor;
            options = options || ctor.getPropertyOptions(name);
            if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                if (!this._changedProperties.has(name)) {
                    this._changedProperties.set(name, oldValue);
                }
                // Add to reflecting properties set.
                // Note, it's important that every change has a chance to add the
                // property to `_reflectingProperties`. This ensures setting
                // attribute + property reflects correctly.
                if (options.reflect === true &&
                    !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
                    if (this._reflectingProperties === undefined) {
                        this._reflectingProperties = new Map();
                    }
                    this._reflectingProperties.set(name, options);
                }
            }
            else {
                // Abort the request if the property should not be considered changed.
                shouldRequestUpdate = false;
            }
        }
        if (!this._hasRequestedUpdate && shouldRequestUpdate) {
            this._updatePromise = this._enqueueUpdate();
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */
    requestUpdate(name, oldValue) {
        this.requestUpdateInternal(name, oldValue);
        return this.updateComplete;
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async _enqueueUpdate() {
        this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this._updatePromise;
        }
        catch (e) {
            // Ignore any previous errors. We only care that the previous cycle is
            // done. Any error should have been handled in the previous update.
        }
        const result = this.performUpdate();
        // If `performUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this._hasRequestedUpdate;
    }
    get _hasRequestedUpdate() {
        return (this._updateState & STATE_UPDATE_REQUESTED);
    }
    get hasUpdated() {
        return (this._updateState & STATE_HAS_UPDATED);
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     */
    performUpdate() {
        // Abort any update if one is not pending when this is called.
        // This can happen if `performUpdate` is called early to "flush"
        // the update.
        if (!this._hasRequestedUpdate) {
            return;
        }
        // Mixin instance properties once, if they exist.
        if (this._instanceProperties) {
            this._applyInstanceProperties();
        }
        let shouldUpdate = false;
        const changedProperties = this._changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.update(changedProperties);
            }
            else {
                this._markUpdated();
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this._markUpdated();
            throw e;
        }
        if (shouldUpdate) {
            if (!(this._updateState & STATE_HAS_UPDATED)) {
                this._updateState = this._updateState | STATE_HAS_UPDATED;
                this.firstUpdated(changedProperties);
            }
            this.updated(changedProperties);
        }
    }
    _markUpdated() {
        this._changedProperties = new Map();
        this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `_getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super._getUpdateComplete()`, then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */
    get updateComplete() {
        return this._getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async _getUpdateComplete() {
     *       await super._getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     * @deprecated Override `getUpdateComplete()` instead for forward
     *     compatibility with `lit-element` 3.0 / `@lit/reactive-element`.
     */
    _getUpdateComplete() {
        return this.getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async getUpdateComplete() {
     *       await super.getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     */
    getUpdateComplete() {
        return this._updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    update(_changedProperties) {
        if (this._reflectingProperties !== undefined &&
            this._reflectingProperties.size > 0) {
            // Use forEach so this works even if for/of loops are compiled to for
            // loops expecting arrays
            this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
            this._reflectingProperties = undefined;
        }
        this._markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    updated(_changedProperties) {
    }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    firstUpdated(_changedProperties) {
    }
}
_a = finalized;
/**
 * Marks class as having finished creating properties.
 */
UpdatingElement[_a] = true;

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
/**
 * Whether the current browser supports `adoptedStyleSheets`.
 */
const supportsAdoptingStyleSheets = (window.ShadowRoot) &&
    (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
    ('adoptedStyleSheets' in Document.prototype) &&
    ('replace' in CSSStyleSheet.prototype);
const constructionToken = Symbol();
class CSSResult {
    constructor(cssText, safeToken) {
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        if (this._styleSheet === undefined) {
            // Note, if `supportsAdoptingStyleSheets` is true then we assume
            // CSSStyleSheet is constructable.
            if (supportsAdoptingStyleSheets) {
                this._styleSheet = new CSSStyleSheet();
                this._styleSheet.replaceSync(this.cssText);
            }
            else {
                this._styleSheet = null;
            }
        }
        return this._styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
/**
 * Wrap a value for interpolation in a [[`css`]] tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */
const unsafeCSS = (value) => {
    return new CSSResult(String(value), constructionToken);
};
const textFromCSSResult = (value) => {
    if (value instanceof CSSResult) {
        return value.cssText;
    }
    else if (typeof value === 'number') {
        return value;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
    }
};
/**
 * Template tag which which can be used with LitElement's [[LitElement.styles |
 * `styles`]] property to set element styles. For security reasons, only literal
 * string values may be used. To incorporate non-literal values [[`unsafeCSS`]]
 * may be used inside a template string part.
 */
const css = (strings, ...values) => {
    const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
};

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
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = []))
    .push('2.5.1');
/**
 * Sentinal value used to avoid calling lit-html's render function when
 * subclasses do not implement `render`
 */
const renderNotImplemented = {};
/**
 * Base element class that manages element properties and attributes, and
 * renders a lit-html template.
 *
 * To define a component, subclass `LitElement` and implement a
 * `render` method to provide the component's template. Define properties
 * using the [[`properties`]] property or the [[`property`]] decorator.
 */
class LitElement extends UpdatingElement {
    /**
     * Return the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * @nocollapse
     */
    static getStyles() {
        return this.styles;
    }
    /** @nocollapse */
    static _getUniqueStyles() {
        // Only gather styles once per class
        if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) {
            return;
        }
        // Take care not to call `this.getStyles()` multiple times since this
        // generates new CSSResults each time.
        // TODO(sorvell): Since we do not cache CSSResults by input, any
        // shared styles will generate new stylesheet objects, which is wasteful.
        // This should be addressed when a browser ships constructable
        // stylesheets.
        const userStyles = this.getStyles();
        if (Array.isArray(userStyles)) {
            // De-duplicate styles preserving the _last_ instance in the set.
            // This is a performance optimization to avoid duplicated styles that can
            // occur especially when composing via subclassing.
            // The last item is kept to try to preserve the cascade order with the
            // assumption that it's most important that last added styles override
            // previous styles.
            const addStyles = (styles, set) => styles.reduceRight((set, s) => 
            // Note: On IE set.add() does not return the set
            Array.isArray(s) ? addStyles(s, set) : (set.add(s), set), set);
            // Array.from does not work on Set in IE, otherwise return
            // Array.from(addStyles(userStyles, new Set<CSSResult>())).reverse()
            const set = addStyles(userStyles, new Set());
            const styles = [];
            set.forEach((v) => styles.unshift(v));
            this._styles = styles;
        }
        else {
            this._styles = userStyles === undefined ? [] : [userStyles];
        }
        // Ensure that there are no invalid CSSStyleSheet instances here. They are
        // invalid in two conditions.
        // (1) the sheet is non-constructible (`sheet` of a HTMLStyleElement), but
        //     this is impossible to check except via .replaceSync or use
        // (2) the ShadyCSS polyfill is enabled (:. supportsAdoptingStyleSheets is
        //     false)
        this._styles = this._styles.map((s) => {
            if (s instanceof CSSStyleSheet && !supportsAdoptingStyleSheets) {
                // Flatten the cssText from the passed constructible stylesheet (or
                // undetectable non-constructible stylesheet). The user might have
                // expected to update their stylesheets over time, but the alternative
                // is a crash.
                const cssText = Array.prototype.slice.call(s.cssRules)
                    .reduce((css, rule) => css + rule.cssText, '');
                return unsafeCSS(cssText);
            }
            return s;
        });
    }
    /**
     * Performs element initialization. By default this calls
     * [[`createRenderRoot`]] to create the element [[`renderRoot`]] node and
     * captures any pre-set values for registered properties.
     */
    initialize() {
        super.initialize();
        this.constructor._getUniqueStyles();
        this.renderRoot = this.createRenderRoot();
        // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
        // element's getRootNode(). While this could be done, we're choosing not to
        // support this now since it would require different logic around de-duping.
        if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
            this.adoptStyles();
        }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */
    createRenderRoot() {
        return this.attachShadow(this.constructor.shadowRootOptions);
    }
    /**
     * Applies styling to the element shadowRoot using the [[`styles`]]
     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
     * available and will fallback otherwise. When Shadow DOM is polyfilled,
     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
     * is available but `adoptedStyleSheets` is not, styles are appended to the
     * end of the `shadowRoot` to [mimic spec
     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
     */
    adoptStyles() {
        const styles = this.constructor._styles;
        if (styles.length === 0) {
            return;
        }
        // There are three separate cases here based on Shadow DOM support.
        // (1) shadowRoot polyfilled: use ShadyCSS
        // (2) shadowRoot.adoptedStyleSheets available: use it
        // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
        // rendering
        if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
            window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map((s) => s.cssText), this.localName);
        }
        else if (supportsAdoptingStyleSheets) {
            this.renderRoot.adoptedStyleSheets =
                styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
        }
        else {
            // This must be done after rendering so the actual style insertion is done
            // in `update`.
            this._needsShimAdoptedStyleSheets = true;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        // Note, first update/render handles styleElement so we only call this if
        // connected after first update.
        if (this.hasUpdated && window.ShadyCSS !== undefined) {
            window.ShadyCSS.styleElement(this);
        }
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param _changedProperties Map of changed properties with old values
     */
    update(changedProperties) {
        // Setting properties in `render` should not trigger an update. Since
        // updates are allowed after super.update, it's important to call `render`
        // before that.
        const templateResult = this.render();
        super.update(changedProperties);
        // If render is not implemented by the component, don't call lit-html render
        if (templateResult !== renderNotImplemented) {
            this.constructor
                .render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
        }
        // When native Shadow DOM is used but adoptedStyles are not supported,
        // insert styling after rendering to ensure adoptedStyles have highest
        // priority.
        if (this._needsShimAdoptedStyleSheets) {
            this._needsShimAdoptedStyleSheets = false;
            this.constructor._styles.forEach((s) => {
                const style = document.createElement('style');
                style.textContent = s.cssText;
                this.renderRoot.appendChild(style);
            });
        }
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's `NodePart` - typically a
     * `TemplateResult`. Setting properties inside this method will *not* trigger
     * the element to update.
     */
    render() {
        return renderNotImplemented;
    }
}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See updating-element.ts for more information.
 */
LitElement['finalized'] = true;
/**
 * Reference to the underlying library method used to render the element's
 * DOM. By default, points to the `render` method from lit-html's shady-render
 * module.
 *
 * **Most users will never need to touch this property.**
 *
 * This  property should not be confused with the `render` instance method,
 * which should be overridden to define a template for the element.
 *
 * Advanced users creating a new base class based on LitElement can override
 * this property to point to a custom render method with a signature that
 * matches [shady-render's `render`
 * method](https://lit-html.polymer-project.org/api/modules/shady_render.html#render).
 *
 * @nocollapse
 */
LitElement.render = render;
/** @nocollapse */
LitElement.shadowRootOptions = { mode: 'open' };

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
/**
 * Stores the StyleInfo object applied to a given AttributePart.
 * Used to unset existing values when a new StyleInfo object is applied.
 */
const previousStylePropertyCache = new WeakMap();
/**
 * A directive that applies CSS properties to an element.
 *
 * `styleMap` can only be used in the `style` attribute and must be the only
 * expression in the attribute. It takes the property names in the `styleInfo`
 * object and adds the property values as CSS properties. Property names with
 * dashes (`-`) are assumed to be valid CSS property names and set on the
 * element's style object using `setProperty()`. Names without dashes are
 * assumed to be camelCased JavaScript property names and set on the element's
 * style object using property assignment, allowing the style object to
 * translate JavaScript-style names to CSS property names.
 *
 * For example `styleMap({backgroundColor: 'red', 'border-top': '5px', '--size':
 * '0'})` sets the `background-color`, `border-top` and `--size` properties.
 *
 * @param styleInfo {StyleInfo}
 */
const styleMap = directive((styleInfo) => (part) => {
    if (!(part instanceof AttributePart) || (part instanceof PropertyPart) ||
        part.committer.name !== 'style' || part.committer.parts.length > 1) {
        throw new Error('The `styleMap` directive must be used in the style attribute ' +
            'and must be the only part in the attribute.');
    }
    const { committer } = part;
    const { style } = committer.element;
    let previousStyleProperties = previousStylePropertyCache.get(part);
    if (previousStyleProperties === undefined) {
        // Write static styles once
        style.cssText = committer.strings.join(' ');
        previousStylePropertyCache.set(part, previousStyleProperties = new Set());
    }
    // Remove old properties that no longer exist in styleInfo
    // We use forEach() instead of for-of so that re don't require down-level
    // iteration.
    previousStyleProperties.forEach((name) => {
        if (!(name in styleInfo)) {
            previousStyleProperties.delete(name);
            if (name.indexOf('-') === -1) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                style[name] = null;
            }
            else {
                style.removeProperty(name);
            }
        }
    });
    // Add or update properties
    for (const name in styleInfo) {
        previousStyleProperties.add(name);
        if (name.indexOf('-') === -1) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style[name] = styleInfo[name];
        }
        else {
            style.setProperty(name, styleInfo[name]);
        }
    }
});

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
// For each part, remember the value that was last rendered to the part by the
// unsafeSVG directive, and the DocumentFragment that was last set as a value.
// The DocumentFragment is used as a unique key to check if the last value
// rendered to the part was with unsafeSVG. If not, we'll always re-render the
// value passed to unsafeSVG.
const previousValues$1 = new WeakMap();
const isIe = window.navigator.userAgent.indexOf('Trident/') > 0;
/**
 * Renders the result as SVG, rather than text.
 *
 * Note, this is unsafe to use with any user-provided input that hasn't been
 * sanitized or escaped, as it may lead to cross-site-scripting
 * vulnerabilities.
 */
const unsafeSVG = directive((value) => (part) => {
    if (!(part instanceof NodePart)) {
        throw new Error('unsafeSVG can only be used in text bindings');
    }
    const previousValue = previousValues$1.get(part);
    if (previousValue !== undefined && isPrimitive(value) &&
        value === previousValue.value && part.value === previousValue.fragment) {
        return;
    }
    const template = document.createElement('template');
    const content = template.content;
    let svgElement;
    if (isIe) {
        // IE can't set innerHTML of an svg element. However, it also doesn't
        // support Trusted Types, so it's ok for us to use a string when setting
        // innerHTML.
        template.innerHTML = `<svg>${value}</svg>`;
        svgElement = content.firstChild;
    }
    else {
        svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        content.appendChild(svgElement);
        svgElement.innerHTML = value;
    }
    content.removeChild(svgElement);
    reparentNodes(content, svgElement.firstChild);
    const fragment = document.importNode(content, true);
    part.setValue(fragment);
    previousValues$1.set(part, { value, fragment });
});

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
const previousValues = new WeakMap();
/**
 * For AttributeParts, sets the attribute if the value is defined and removes
 * the attribute if the value is undefined.
 *
 * For other part types, this directive is a no-op.
 */
const ifDefined = directive((value) => (part) => {
    const previousValue = previousValues.get(part);
    if (value === undefined && part instanceof AttributePart) {
        // If the value is undefined, remove the attribute, but only if the value
        // was previously defined.
        if (previousValue !== undefined || !previousValues.has(part)) {
            const name = part.committer.name;
            part.committer.element.removeAttribute(name);
        }
    }
    else if (value !== previousValue) {
        part.setValue(value);
    }
    previousValues.set(part, value);
});

var version = "2.5.1";

// Set sizes:
// If svg size is changed, change the font size accordingly.
// These two are related ;-) For font-size, 1em = 1%
const SCALE_DIMENSIONS = 2;
const SVG_DEFAULT_DIMENSIONS = 200 * SCALE_DIMENSIONS;
const SVG_DEFAULT_DIMENSIONS_HALF = SVG_DEFAULT_DIMENSIONS / 2;
const SVG_VIEW_BOX = SVG_DEFAULT_DIMENSIONS;
const FONT_SIZE = SVG_DEFAULT_DIMENSIONS / 100;

// Clamp number between two values
const clamp$1 = (min, num, max) => Math.min(Math.max(num, min), max);

// Round to nearest value
const round$1 = (min, num, max) => ((Math.abs(num - min) > Math.abs(max - num)) ? max : min);

// Force angle between 0 and 360, or even more for angle comparisons!
const angle360 = (start, angle, end) => ((start < 0 || end < 0) ? angle + 360 : angle);

// Size or range given by two values
const range = (value1, value2) => Math.abs(value1 - value2);

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation and filtering.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
class Merge {
  static mergeDeep(...objects) {
    const isObject = (obj) => obj && typeof obj === 'object';
    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach((key) => {
        const pVal = prev[key];
        const oVal = obj[key];
        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          /* eslint no-param-reassign: 0 */
          // Only if pVal is empty???

          // #TODO:
          // Should check for .id to match both arrays ?!?!?!?!
          // Only concat if no ID or match found, otherwise mergeDeep ??
          //
          // concatenate and then reduce/merge the array based on id's if present??
          //
          prev[key] = pVal.concat(...oVal);
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = this.mergeDeep(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });
      return prev;
    }, {});
  }
}

/** ***************************************************************************
  * Utils class
  *
  * Summary.
  *
  */

class Utils {
  /**
  * Utils::calculateValueBetween()
  *
  * Summary.
  * Clips the val value between start and end, and returns the between value ;-)
  * Returned value is a fractional value between 0 and 1.
  *
  * Note 1:
  * At start, state values are set to 'null' to make sure it has no value!
  * If such a value is detected, return 0(%) as the relative value.
  * In normal cases, this happens to be the _valuePrev, so 0% is ok!!!!
  *
  * Note 2:
  * !xyz checks for "", null, undefined, false and number 0
  * An extra check for NaN guards the result of this function ;-)
  */

  static calculateValueBetween(argStart, argEnd, argVal) {
    // Check for valid argVal values and return 0 if invalid.
    if (isNaN(argVal)) return 0;
    if (!argVal) return 0;

    // Valid argVal value: calculate fraction between 0 and 1
    return (Math.min(Math.max(argVal, argStart), argEnd) - argStart) / (argEnd - argStart);
  }

  /**
  * Utils::calculateSvgCoordinate()
  *
  * Summary.
  * Calculate own (tool/tool) coordinates relative to centered toolset position.
  * Tool coordinates are %
  *
  * Group is 50,40. Say SVG is 200x200. Group is 100,80 within 200x200.
  * Tool is 10,50. 0.1 * 200 = 20 + (100 - 200/2) = 20 + 0.
  */
  static calculateSvgCoordinate(argOwn, argToolset) {
    return (argOwn / 100) * (SVG_DEFAULT_DIMENSIONS)
            + (argToolset - SVG_DEFAULT_DIMENSIONS_HALF);
  }

  /**
  * Utils::calculateSvgDimension()
  *
  * Summary.
  * Translate tool dimension like length or width to actual SVG dimension.
  */

  static calculateSvgDimension(argDimension) {
    return (argDimension / 100) * (SVG_DEFAULT_DIMENSIONS);
  }

  static getLovelace() {
    let root = window.document.querySelector('home-assistant');
    root = root && root.shadowRoot;
    root = root && root.querySelector('home-assistant-main');
    root = root && root.shadowRoot;
    root = root && root.querySelector('app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver');
    root = (root && root.shadowRoot) || root;
    root = root && root.querySelector('ha-panel-lovelace');
    root = root && root.shadowRoot;
    root = root && root.querySelector('hui-root');
    if (root) {
      const ll = root.lovelace;
      ll.current_view = root.___curView;
      return ll;
    }
    return null;
  }
}

/** ****************************************************************************
  * Templates class
  *
  * Summary.
  *
  */

class Templates {
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
      // eslint-disable-next-line no-new-func
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
      // eslint-disable-next-line no-new-func
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
// IE11 doesn't support classList on SVG elements, so we emulate it with a Set
class ClassList {
    constructor(element) {
        this.classes = new Set();
        this.changed = false;
        this.element = element;
        const classList = (element.getAttribute('class') || '').split(/\s+/);
        for (const cls of classList) {
            this.classes.add(cls);
        }
    }
    add(cls) {
        this.classes.add(cls);
        this.changed = true;
    }
    remove(cls) {
        this.classes.delete(cls);
        this.changed = true;
    }
    commit() {
        if (this.changed) {
            let classString = '';
            this.classes.forEach((cls) => classString += cls + ' ');
            this.element.setAttribute('class', classString);
        }
    }
}
/**
 * Stores the ClassInfo object applied to a given AttributePart.
 * Used to unset existing values when a new ClassInfo object is applied.
 */
const previousClassesCache = new WeakMap();
/**
 * A directive that applies CSS classes. This must be used in the `class`
 * attribute and must be the only part used in the attribute. It takes each
 * property in the `classInfo` argument and adds the property name to the
 * element's `class` if the property value is truthy; if the property value is
 * falsey, the property name is removed from the element's `class`. For example
 * `{foo: bar}` applies the class `foo` if the value of `bar` is truthy.
 * @param classInfo {ClassInfo}
 */
const classMap = directive((classInfo) => (part) => {
    if (!(part instanceof AttributePart) || (part instanceof PropertyPart) ||
        part.committer.name !== 'class' || part.committer.parts.length > 1) {
        throw new Error('The `classMap` directive must be used in the `class` attribute ' +
            'and must be the only part in the attribute.');
    }
    const { committer } = part;
    const { element } = committer;
    let previousClasses = previousClassesCache.get(part);
    if (previousClasses === undefined) {
        // Write static classes once
        // Use setAttribute() because className isn't a string on SVG elements
        element.setAttribute('class', committer.strings.join(' '));
        previousClassesCache.set(part, previousClasses = new Set());
    }
    const classList = (element.classList || new ClassList(element));
    // Remove old classes that no longer apply
    // We use forEach() instead of for-of so that re don't require down-level
    // iteration.
    previousClasses.forEach((name) => {
        if (!(name in classInfo)) {
            classList.remove(name);
            previousClasses.delete(name);
        }
    });
    // Add or remove classes based on their classMap value
    for (const name in classInfo) {
        const value = classInfo[name];
        if (value != previousClasses.has(name)) {
            // We explicitly want a loose truthy check of `value` because it seems
            // more convenient that '' and 0 are skipped.
            if (value) {
                classList.add(name);
                previousClasses.add(name);
            }
            else {
                classList.remove(name);
                previousClasses.delete(name);
            }
        }
    }
    if (typeof classList.commit === 'function') {
        classList.commit();
    }
});

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
const fireEvent = (node, type, detail, options) => {
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

/** ***************************************************************************
  * Colors class
  *
  * Summary.
  *
  */

class Colors {
  /** *****************************************************************************
  * Colors::static properties()
  *
  * @description
  * Declares the static class properties.
  * Needs eslint parserOptions ecmaVersion: 2022
  *
  */
  static {
    Colors.colorCache = {};
    Colors.element = undefined;
  }

  /** *****************************************************************************
  * Colors::static _prefixKeys()
  *
  * @argument argColors - the colors to prefix with '--'
  *
  * @description
  * Prefixes all keys with '--' to make them CSS Variables.
  *
  */
  static _prefixKeys(argColors) {
    let prefixedColors = {};

    Object.keys(argColors).forEach((key) => {
      const prefixedKey = `--${key}`;
      const value = String(argColors[key]);
      prefixedColors[prefixedKey] = `${value}`;
    });
    return prefixedColors;
  }

  /** *****************************************************************************
  * Colors::static processTheme()
  *
  * @argument argTheme - the theme configuration to load
  *
  * @description
  * Loads and processes the theme to be used with dark and light modes.
  *
  * Theme mode is selected based on theme's darkMode boolean.
  */
  static processTheme(argTheme) {
    let combinedLight = {};
    let combinedDark = {};

    let themeLight = {};
    let themeDark = {};

    const { modes, ...themeBase } = argTheme;

    // Apply theme vars for the specific mode if available
    if (modes) {
      combinedDark = { ...themeBase, ...modes.dark };
      combinedLight = { ...themeBase, ...modes.light };
    }

    // Now we have the dark and light mode configuration, iterate over every definition
    // and add the CSS variable prefix '--' to the key (CSS Variable color name)
    themeLight = Colors._prefixKeys(combinedLight);
    themeDark = Colors._prefixKeys(combinedDark);

    // Return the light and dark mode theme parts
    return { themeLight, themeDark };
  }

  /** *****************************************************************************
  * Colors::static processPalette()
  *
  * @argument argPalette - the palette configuration to load
  *
  * @description
  * Loads the swatches defined for the palette and combines them into a single
  * palette with light (default) and dark modes.
  *
  * Palette mode is selected based on theme's darkMode boolean.
  */
  static processPalette(argPalette) {
    let combinedBase = {};
    let combinedLight = {};
    let combinedDark = {};

    let paletteLight = {};
    let paletteDark = {};

    // We are not interested in the individual swatches, so iterate directly over the values
    Object.values(argPalette).forEach((swatch) => {
      // Apply theme vars that are relevant for all modes (but extract the 'modes' section first)
      // See: https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/
      const { modes, ...swatchBase } = swatch;

      // Apply swatch vars for the specific mode if available
      combinedBase = { ...combinedBase, ...swatchBase };
      if (modes) {
        combinedDark = { ...combinedDark, ...swatchBase, ...modes.dark };
        combinedLight = { ...combinedLight, ...swatchBase, ...modes.light };
      }
    });

    // Now we have the dark and light mode configuration, iterate over every definition
    // and add the CSS variable prefix '--' to the key (CSS Variable color name)

    paletteLight = Colors._prefixKeys(combinedLight);
    paletteDark = Colors._prefixKeys(combinedDark);

    // Return the light and dark mode palettes
    return { paletteLight, paletteDark };
  }

  /** *****************************************************************************
  * Colors::setElement()
  *
  * Summary.
  * Sets the HTML element (the custom card) to work with getting colors
  *
  */

  static setElement(argElement) {
    Colors.element = argElement;
  }

  /** *****************************************************************************
  * card::_calculateColor()
  *
  * Summary.
  *
  * #TODO:
  * replace by TinyColor library? Is that possible/feasible??
  *
  */

  static calculateColor(argState, argStops, argIsGradient) {
    const sortedStops = Object.keys(argStops).map((n) => Number(n)).sort((a, b) => a - b);

    let start; let end; let
      val;
    const l = sortedStops.length;

    if (argState <= sortedStops[0]) {
      return argStops[sortedStops[0]];
    } else if (argState >= sortedStops[l - 1]) {
      return argStops[sortedStops[l - 1]];
    } else {
      for (let i = 0; i < l - 1; i++) {
        const s1 = sortedStops[i];
        const s2 = sortedStops[i + 1];
        if (argState >= s1 && argState < s2) {
          [start, end] = [argStops[s1], argStops[s2]];
          if (!argIsGradient) {
            return start;
          }
          val = Colors.calculateValueBetween(s1, s2, argState);
          break;
        }
      }
    }
    return Colors.getGradientValue(start, end, val);
  }

  /** *****************************************************************************
  * card::_calculateColor2()
  *
  * Summary.
  *
  * #TODO:
  * replace by TinyColor library? Is that possible/feasible??
  *
  */

  static calculateColor2(argState, argStops, argPart, argProperty, argIsGradient) {
    const sortedStops = Object.keys(argStops).map((n) => Number(n)).sort((a, b) => a - b);

    let start; let end; let
      val;
    const l = sortedStops.length;

    if (argState <= sortedStops[0]) {
      return argStops[sortedStops[0]];
    } else if (argState >= sortedStops[l - 1]) {
      return argStops[sortedStops[l - 1]];
    } else {
      for (let i = 0; i < l - 1; i++) {
        const s1 = sortedStops[i];
        const s2 = sortedStops[i + 1];
        if (argState >= s1 && argState < s2) {
          // console.log('calculateColor2 ', argStops[s1], argStops[s2]);
          [start, end] = [argStops[s1].styles[argPart][argProperty], argStops[s2].styles[argPart][argProperty]];
          if (!argIsGradient) {
            return start;
          }
          val = Colors.calculateValueBetween(s1, s2, argState);
          break;
        }
      }
    }
    return Colors.getGradientValue(start, end, val);
  }

  /** *****************************************************************************
  * card::_calculateValueBetween()
  *
  * Summary.
  * Clips the argValue value between argStart and argEnd, and returns the between value ;-)
  *
  * Returns NaN if argValue is undefined
  *
  * NOTE: Rename to valueToPercentage ??
  */

  static calculateValueBetween(argStart, argEnd, argValue) {
    return (Math.min(Math.max(argValue, argStart), argEnd) - argStart) / (argEnd - argStart);
  }

  /** *****************************************************************************
  * card::_getColorVariable()
  *
  * Summary.
  * Get value of CSS color variable, specified as var(--color-value)
  * These variables are defined in the Lovelace element so it appears...
  *
  */

  static getColorVariable(argColor) {
    const newColor = argColor.substr(4, argColor.length - 5);

    const returnColor = window.getComputedStyle(Colors.element).getPropertyValue(newColor);
    return returnColor;
  }

  /** *****************************************************************************
  * card::_getGradientValue()
  *
  * Summary.
  * Get gradient value of color as a result of a color_stop.
  * An RGBA value is calculated, so transparency is possible...
  *
  * The colors (colorA and colorB) can be specified as:
  * - a css variable, var(--color-value)
  * - a hex value, #fff or #ffffff
  * - an rgb() or rgba() value
  * - a hsl() or hsla() value
  * - a named css color value, such as white.
  *
  */

  static getGradientValue(argColorA, argColorB, argValue) {
    const resultColorA = Colors.colorToRGBA(argColorA);
    const resultColorB = Colors.colorToRGBA(argColorB);

    // We have a rgba() color array from cache or canvas.
    // Calculate color in between, and return #hex value as a result.
    //

    const v1 = 1 - argValue;
    const v2 = argValue;
    const rDec = Math.floor((resultColorA[0] * v1) + (resultColorB[0] * v2));
    const gDec = Math.floor((resultColorA[1] * v1) + (resultColorB[1] * v2));
    const bDec = Math.floor((resultColorA[2] * v1) + (resultColorB[2] * v2));
    const aDec = Math.floor((resultColorA[3] * v1) + (resultColorB[3] * v2));

    // And convert full RRGGBBAA value to #hex.
    const rHex = Colors.padZero(rDec.toString(16));
    const gHex = Colors.padZero(gDec.toString(16));
    const bHex = Colors.padZero(bDec.toString(16));
    const aHex = Colors.padZero(aDec.toString(16));

    return `#${rHex}${gHex}${bHex}${aHex}`;
  }

  static padZero(argValue) {
    if (argValue.length < 2) {
      argValue = `0${argValue}`;
    }
    return argValue.substr(0, 2);
  }

  /** *****************************************************************************
  * card::_colorToRGBA()
  *
  * Summary.
  * Get RGBA color value of argColor.
  *
  * The argColor can be specified as:
  * - a css variable, var(--color-value)
  * - a hex value, #fff or #ffffff
  * - an rgb() or rgba() value
  * - a hsl() or hsla() value
  * - a named css color value, such as white.
  *
  */

  static colorToRGBA(argColor) {
    // return color if found in colorCache...
    const retColor = Colors.colorCache[argColor];
    if (retColor) return retColor;

    let theColor = argColor;
    // Check for 'var' colors
    const a0 = argColor.substr(0, 3);
    if (a0.valueOf() === 'var') {
      theColor = Colors.getColorVariable(argColor);
    }

    // Get color from canvas. This always returns an rgba() value...
    const canvas = window.document.createElement('canvas');
    // eslint-disable-next-line no-multi-assign
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = theColor;
    ctx.fillRect(0, 0, 1, 1);
    const outColor = [...ctx.getImageData(0, 0, 1, 1).data];

    Colors.colorCache[argColor] = outColor;

    return outColor;
  }

  static hslToRgb(hsl) {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let r;
    let g;
    let b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      // eslint-disable-next-line no-inner-declarations
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    r *= 255;
    g *= 255;
    b *= 255;

    return { r, g, b };
  }
} // END OF CLASS

/** ***************************************************************************
  * BaseTool class
  *
  * Summary.
  *
  */

class BaseTool {
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

    try {
      if (localState !== 'undefined'
        && typeof localState !== 'undefined') if (this._stateValue?.toString().toLowerCase() === localState.toString().toLowerCase()) return;
    } catch (e) {
      console.log('catching something', e, state, this.config);
    }

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
      if (typeof (localStates[index]) !== 'undefined') if (this._stateValues[index]?.toLowerCase() === localStates[index].toLowerCase()) ; else {
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
        case 'fire-dom-event': {
          // Clone action configuration before firing the event
          const domData = { ...actionConfig.actions[i] };
          e = new Event('ll-custom', { composed: true, bubbles: true });
          e.detail = domData;
          node.dispatchEvent(e);
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
    let entityIdx = this.defaultEntityIndex();

    // If no user_actions defined, AND there is an entity_index,
    // define a default 'more-info' tap action
    if ((entityIdx !== undefined) && (!argToolConfig.user_actions)) {
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
    ? this._card.config.entities[entityIdx]?.entity
        : undefined,
      undefined,
    );
  }
} // -- CLASS

/** ****************************************************************************
  * BadgeTool class
  *
  * Summary.
  *
  */

class BadgeTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_BADGE_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        width: 100,
        height: 25,
        radius: 5,
        ratio: 30,
        divider: 30,
      },
      classes: {
        tool: {
          'sak-badge': true,
          hover: true,
        },
        left: {
          'sak-badge__left': true,
        },
        right: {
          'sak-badge__right': true,
        },
      },
      styles: {
        tool: {
        },
        left: {
        },
        right: {
        },
      },
    };
    super(argToolset, Merge.mergeDeep(DEFAULT_BADGE_CONFIG, argConfig), argPos);

    // Coordinates from left and right part.
    this.svg.radius = Utils.calculateSvgDimension(argConfig.position.radius);
    this.svg.leftXpos = this.svg.x;
    this.svg.leftYpos = this.svg.y;
    this.svg.leftWidth = (this.config.position.ratio / 100) * this.svg.width;
    this.svg.arrowSize = (this.svg.height * this.config.position.divider / 100) / 2;
    this.svg.divSize = (this.svg.height * (100 - this.config.position.divider) / 100) / 2;

    this.svg.rightXpos = this.svg.x + this.svg.leftWidth;
    this.svg.rightYpos = this.svg.y;
    this.svg.rightWidth = ((100 - this.config.position.ratio) / 100) * this.svg.width;

    this.classes.tool = {};
    this.classes.left = {};
    this.classes.right = {};

    this.styles.tool = {};
    this.styles.left = {};
    this.styles.right = {};
    if (this.dev.debug) console.log('BadgeTool constructor coords, dimensions', this.svg, this.config);
  }

  /** *****************************************************************************
  * BadgeTool::_renderBadge()
  *
  * Summary.
  * Renders the badge using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the badge
  *
  * Refs for creating the path online:
  * - https://mavo.io/demos/svgpath/
  *
  */

  _renderBadge() {
    let svgItems = [];

    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();

    svgItems = svg`
      <g  id="badge-${this.toolId}">
        <path class="${classMap(this.classes.right)}" d="
            M ${this.svg.rightXpos} ${this.svg.rightYpos}
            h ${this.svg.rightWidth - this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 ${this.svg.radius} ${this.svg.radius}
            v ${this.svg.height - 2 * this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 -${this.svg.radius} ${this.svg.radius}
            h -${this.svg.rightWidth - this.svg.radius}
            v -${this.svg.height - 2 * this.svg.radius}
            z
            "
            style="${styleMap(this.styles.right)}"/>

        <path class="${classMap(this.classes.left)}" d="
            M ${this.svg.leftXpos + this.svg.radius} ${this.svg.leftYpos}
            h ${this.svg.leftWidth - this.svg.radius}
            v ${this.svg.divSize}
            l ${this.svg.arrowSize} ${this.svg.arrowSize}
            l -${this.svg.arrowSize} ${this.svg.arrowSize}
            l 0 ${this.svg.divSize}
            h -${this.svg.leftWidth - this.svg.radius}
            a -${this.svg.radius} -${this.svg.radius} 0 0 1 -${this.svg.radius} -${this.svg.radius}
            v -${this.svg.height - 2 * this.svg.radius}
            a ${this.svg.radius} ${this.svg.radius} 0 0 1 ${this.svg.radius} -${this.svg.radius}
            "
            style="${styleMap(this.styles.left)}"/>
      </g>
      `;

    return svg`${svgItems}`;
  }

  /** *****************************************************************************
  * BadgeTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <g id="badge-${this.toolId}"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderBadge()}
      </g>
    `;
  }
} // END of class

/** ****************************************************************************
  * CircleTool class
  *
  * Summary.
  *
  */

class CircleTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_CIRCLE_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        radius: 50,
      },
      classes: {
        tool: {
          'sak-circle': true,
          hover: true,
        },
        circle: {
          'sak-circle__circle': true,
        },
      },
      styles: {
        tool: {
        },
        circle: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_CIRCLE_CONFIG, argConfig), argPos);
    this.EnableHoverForInteraction();

    this.svg.radius = Utils.calculateSvgDimension(argConfig.position.radius);

    this.classes.tool = {};
    this.classes.circle = {};

    this.styles.tool = {};
    this.styles.circle = {};
    if (this.dev.debug) console.log('CircleTool constructor config, svg', this.toolId, this.config, this.svg);
  }

  /** *****************************************************************************
  * CircleTool::value()
  *
  * Summary.
  * Receive new state data for the entity this circle is linked to. Called from set hass;
  *
  */
  set value(state) {
    super.value = state;
  }

  /** *****************************************************************************
  * CircleTool::_renderCircle()
  *
  * Summary.
  * Renders the circle using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the circle
  *
  */

  _renderCircle() {
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.circle);

    return svg`
      <circle class="${classMap(this.classes.circle)}"
        cx="${this.svg.cx}"% cy="${this.svg.cy}"% r="${this.svg.radius}"
        style="${styleMap(this.styles.circle)}"
      </circle>

      `;
  }

  /** *****************************************************************************
  * CircleTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */

  render() {
    this.styles.tool.overflow = 'visible';
    this.styles['transform-origin'] = `${this.svg.cx} ${this.svg.cy}`;

    return svg`
      <g "" id="circle-${this.toolId}"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderCircle()}
      </g>
    `;
  }
} // END of class

/** ****************************************************************************
  * CircularSliderTool::constructor class
  *
  * Summary.
  *
  */

class CircularSliderTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_ARCSLIDER_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        radius: 45,
        start_angle: 30,
        end_angle: 230,
        track: {
          width: 2,
        },
        active: {
          width: 4,
        },
        thumb: {
          height: 10,
          width: 10,
          radius: 5,
        },
        capture: {
          height: 25,
          width: 25,
          radius: 25,
        },
        label: {
          placement: 'none',
          cx: 10,
          cy: 10,
        },
      },
      show: {
        uom: 'end',
        active: false,
      },
      classes: {
        tool: {
          'sak-circslider': true,
          hover: true,
        },
        capture: {
          'sak-circslider__capture': true,
          hover: true,
        },
        active: {
          'sak-circslider__active': true,
        },
        track: {
          'sak-circslider__track': true,
        },
        thumb: {
          'sak-circslider__thumb': true,
          hover: true,
        },
        label: {
          'sak-circslider__value': true,
        },
        uom: {
          'sak-circslider__uom': true,
        },
      },
      styles: {
        tool: {
        },
        active: {
        },
        capture: {
        },
        track: {
        },
        thumb: {
        },
        label: {
        },
        uom: {
        },
      },
      scale: {
        min: 0,
        max: 100,
        step: 1,
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_ARCSLIDER_CONFIG, argConfig), argPos);

    this.svg.radius = Utils.calculateSvgDimension(this.config.position.radius);

    // Init arc settings
    this.arc = {};
    this.arc.startAngle = this.config.position.start_angle;
    this.arc.endAngle = this.config.position.end_angle;
    this.arc.size = range(this.config.position.end_angle, this.config.position.start_angle);
    this.arc.clockwise = this.config.position.end_angle > this.config.position.start_angle;
    this.arc.direction = this.arc.clockwise ? 1 : -1;
    this.arc.pathLength = 2 * this.arc.size / 360 * Math.PI * this.svg.radius;
    this.arc.arcLength = 2 * Math.PI * this.svg.radius;

    this.arc.startAngle360 = angle360(this.arc.startAngle, this.arc.startAngle, this.arc.endAngle);
    this.arc.endAngle360 = angle360(this.arc.startAngle, this.arc.endAngle, this.arc.endAngle);

    this.arc.startAngleSvgPoint = this.polarToCartesian(this.svg.cx, this.svg.cy, this.svg.radius, this.svg.radius, this.arc.startAngle360);
    this.arc.endAngleSvgPoint = this.polarToCartesian(this.svg.cx, this.svg.cy, this.svg.radius, this.svg.radius, this.arc.endAngle360);

    this.arc.scaleDasharray = 2 * this.arc.size / 360 * Math.PI * this.svg.radius;
    this.arc.dashOffset = this.arc.clockwise ? 0 : -this.arc.scaleDasharray - this.arc.arcLength;

    this.arc.currentAngle = this.arc.startAngle;

    this.svg.startAngle = this.config.position.start_angle;
    this.svg.endAngle = this.config.position.end_angle;
    this.svg.diffAngle = (this.config.position.end_angle - this.config.position.start_angle);

    // this.svg.pathLength = 2 * 260/360 * Math.PI * this.svg.radius;
    this.svg.pathLength = 2 * this.arc.size / 360 * Math.PI * this.svg.radius;
    this.svg.circleLength = 2 * Math.PI * this.svg.radius;

    this.svg.label = {};
    switch (this.config.position.label.placement) {
      case 'position':
        this.svg.label.cx = Utils.calculateSvgCoordinate(this.config.position.label.cx, 0);
        this.svg.label.cy = Utils.calculateSvgCoordinate(this.config.position.label.cy, 0);
        break;

      case 'thumb':
        this.svg.label.cx = this.svg.cx;
        this.svg.label.cy = this.svg.cy;
        break;

      case 'none':
        break;

      default:
        console.error('CircularSliderTool - constructor: invalid label placement [none, position, thumb] = ', this.config.position.label.placement);
        throw Error('CircularSliderTool::constructor - invalid label placement [none, position, thumb] = ', this.config.position.label.placement);
    }

    this.svg.track = {};
    this.svg.track.width = Utils.calculateSvgDimension(this.config.position.track.width);
    this.svg.active = {};
    this.svg.active.width = Utils.calculateSvgDimension(this.config.position.active.width);
    this.svg.thumb = {};
    this.svg.thumb.width = Utils.calculateSvgDimension(this.config.position.thumb.width);
    this.svg.thumb.height = Utils.calculateSvgDimension(this.config.position.thumb.height);
    this.svg.thumb.radius = Utils.calculateSvgDimension(this.config.position.thumb.radius);
    this.svg.thumb.cx = this.svg.cx;
    this.svg.thumb.cy = this.svg.cy;
    this.svg.thumb.x1 = this.svg.cx - this.svg.thumb.width / 2;
    this.svg.thumb.y1 = this.svg.cy - this.svg.thumb.height / 2;

    // This should be a moving capture element, larger than the thumb!!
    this.svg.capture = {};
    this.svg.capture.width = Utils.calculateSvgDimension(Math.max(this.config.position.capture.width, this.config.position.thumb.width * 1.2));
    this.svg.capture.height = Utils.calculateSvgDimension(Math.max(this.config.position.capture.height, this.config.position.thumb.height * 1.2));
    this.svg.capture.radius = Utils.calculateSvgDimension(this.config.position.capture.radius);
    this.svg.capture.x1 = this.svg.cx - this.svg.capture.width / 2;
    this.svg.capture.y1 = this.svg.cy - this.svg.capture.height / 2;

    // The CircularSliderTool is rotated around its svg base point. This is NOT the center of the circle!
    // Adjust x and y positions within the svg viewport to re-center the circle after rotating
    this.svg.rotate = {};
    this.svg.rotate.degrees = this.arc.clockwise ? (-90 + this.arc.startAngle) : (this.arc.endAngle360 - 90);
    this.svg.rotate.cx = this.svg.cx;
    this.svg.rotate.cy = this.svg.cy;

    // Init classes
    this.classes.track = {};
    this.classes.active = {};
    this.classes.thumb = {};
    this.classes.label = {};
    this.classes.uom = {};

    // Init styles
    this.styles.track = {};
    this.styles.active = {};
    this.styles.thumb = {};
    this.styles.label = {};
    this.styles.uom = {};

    // Init scale
    this.svg.scale = {};
    this.svg.scale.min = this.config.scale.min;
    this.svg.scale.max = this.config.scale.max;
    // this.svg.scale.min = myScale.min;
    // this.svg.scale.max = myScale.max;

    this.svg.scale.center = Math.abs(this.svg.scale.max - this.svg.scale.min) / 2 + this.svg.scale.min;
    this.svg.scale.svgPointMin = this.sliderValueToPoint(this.svg.scale.min);
    this.svg.scale.svgPointMax = this.sliderValueToPoint(this.svg.scale.max);
    this.svg.scale.svgPointCenter = this.sliderValueToPoint(this.svg.scale.center);
    this.svg.scale.step = this.config.scale.step;

    this.rid = null;

    // Hmmm. Does not help on safari to get the refresh ok. After data change, everything is ok!!
    this.thumbPos = this.sliderValueToPoint(this.config.scale.min);
    this.svg.thumb.x1 = this.thumbPos.x - this.svg.thumb.width / 2;
    this.svg.thumb.y1 = this.thumbPos.y - this.svg.thumb.height / 2;

    this.svg.capture.x1 = this.thumbPos.x - this.svg.capture.width / 2;
    this.svg.capture.y1 = this.thumbPos.y - this.svg.capture.height / 2;

    if (this.dev.debug) console.log('CircularSliderTool::constructor', this.config, this.svg);
  }

  // From roundSlider... https://github.com/soundar24/roundSlider/blob/master/src/roundslider.js

  // eslint-disable-next-line no-unused-vars
  pointToAngle360(point, center, isDrag) {
    const radian = Math.atan2(point.y - center.y, center.x - point.x);
    let angle = (-radian / (Math.PI / 180));
    // the angle value between -180 to 180.. so convert to a 360 angle
    angle += -90;

    if (angle < 0) angle += 360;

    // With this addition, the clockwise stuff, including passing 0 works. but anti clockwise stopped working!!
    if (this.arc.clockwise) if (angle < this.arc.startAngle360) angle += 360;

    // Yep. Should add another to get this working...
    if (!this.arc.clockwise) if (angle < this.arc.endAngle360) angle += 360;

    return angle;
  }

  isAngle360InBetween(argAngle) {
    let inBetween;
    if (this.arc.clockwise) {
      inBetween = ((argAngle >= this.arc.startAngle360) && (argAngle <= this.arc.endAngle360));
    } else {
      inBetween = ((argAngle <= this.arc.startAngle360) && (argAngle >= this.arc.endAngle360));
    }
    return !!inBetween;
  }

  polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radiusX * Math.cos(angleInRadians)),
      y: centerY + (radiusY * Math.sin(angleInRadians)),
    };
  }

  // SVGPoint deprecated. Use DOMPoint!!
  // DOMPoint.fromPoint(); ??? Or just keep using SVGPoint...
  pointToSliderValue(m) {
    let state;
    let scalePos;

    const center = {};
    center.x = this.svg.cx;
    center.y = this.svg.cy;
    const newAngle = this.pointToAngle360(m, center, true);
    let { myAngle } = this;

    const inBetween = this.isAngle360InBetween(newAngle);
    if (inBetween) {
      this.myAngle = newAngle;
      myAngle = newAngle;
      this.arc.currentAngle = myAngle;
    }

    this.arc.currentAngle = myAngle;
    if (this.arc.clockwise) scalePos = (myAngle - this.arc.startAngle360) / this.arc.size;
    if (!this.arc.clockwise) scalePos = (this.arc.startAngle360 - myAngle) / this.arc.size;

    state = ((this.config.scale.max - this.config.scale.min) * scalePos) + this.config.scale.min;
    state = Math.round(state / this.svg.scale.step) * this.svg.scale.step;
    state = Math.max(Math.min(this.config.scale.max, state), this.config.scale.min);

    this.arc.currentAngle = myAngle;

    if ((this.dragging) && (!inBetween)) {
      // Clip to max or min value
      state = round$1(this.svg.scale.min, state, this.svg.scale.max);
      this.m = this.sliderValueToPoint(state);
    }

    return state;
  }

  sliderValueToPoint(argValue) {
    let state = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, argValue);
    if (isNaN(state)) state = 0;
    let angle;
    if (this.arc.clockwise) {
      angle = (this.arc.size * state) + this.arc.startAngle360;
    } else {
      angle = (this.arc.size * (1 - state)) + this.arc.endAngle360;
    }

    if (angle < 0) angle += 360;
    const svgPoint = this.polarToCartesian(this.svg.cx, this.svg.cy, this.svg.radius, this.svg.radius, angle);

    this.arc.currentAngle = angle;

    return svgPoint;
  }

  updateValue(m) {
    this._value = this.pointToSliderValue(m);
    // set dist to 0 to cancel animation frame
    const dist = 0;
    // improvement
    if (Math.abs(dist) < 0.01) {
      if (this.rid) {
        window.cancelAnimationFrame(this.rid);
        this.rid = null;
      }
    }
  }

  updateThumb(m) {
    if (this.dragging) {
      this.thumbPos = this.sliderValueToPoint(this._value);
      this.svg.thumb.x1 = this.thumbPos.x - this.svg.thumb.width / 2;
      this.svg.thumb.y1 = this.thumbPos.y - this.svg.thumb.height / 2;

      this.svg.capture.x1 = this.thumbPos.x - this.svg.capture.width / 2;
      this.svg.capture.y1 = this.thumbPos.y - this.svg.capture.height / 2;

      const rotateStr = `rotate(${this.arc.currentAngle} ${this.svg.capture.width / 2} ${this.svg.capture.height / 2})`;
      this.elements.thumb.setAttribute('transform', rotateStr);

      this.elements.thumbGroup.setAttribute('x', this.svg.capture.x1);
      this.elements.thumbGroup.setAttribute('y', this.svg.capture.y1);
    }

    this.updateLabel(m);
  }

  // eslint-disable-next-line no-unused-vars
  updateActiveTrack(m) {
    const min = this.config.scale.min || 0;
    const max = this.config.scale.max || 100;
    let val = Utils.calculateValueBetween(min, max, this.labelValue);
    if (isNaN(val)) val = 0;
    const score = val * this.svg.pathLength;
    this.dashArray = `${score} ${this.svg.circleLength}`;

    if (this.dragging) {
      this.elements.activeTrack.setAttribute('stroke-dasharray', this.dashArray);
    }
  }

  updateLabel(m) {
    if (this.dev.debug) console.log('SLIDER - updateLabel start', m, this.config.position.orientation);

    // const dec = (this._card.config.entities[this.config.entity_index].decimals || 0);
    const dec = (this._card.config.entities[this.defaultEntityIndex()].decimals || 0);

    const x = 10 ** dec;
    this.labelValue2 = (Math.round(this.pointToSliderValue(m) * x) / x).toFixed(dec);
    console.log('updateLabel, labelvalue ', this.labelValue2);
    if (this.config.position.label.placement !== 'none') {
      this.elements.label.textContent = this.labelValue2;
    }
  }

  /*
  * mouseEventToPoint
  *
  * Translate mouse/touch client window coordinates to SVG window coordinates
  *
  */
  mouseEventToPoint(e) {
    let p = this.elements.svg.createSVGPoint();
    p.x = e.touches ? e.touches[0].clientX : e.clientX;
    p.y = e.touches ? e.touches[0].clientY : e.clientY;
    const ctm = this.elements.svg.getScreenCTM().inverse();
    p = p.matrixTransform(ctm);
    return p;
  }

  callDragService() {
    if (typeof this.labelValue2 === 'undefined') return;

    if (this.labelValuePrev !== this.labelValue2) {
      this.labelValuePrev = this.labelValue2;

      this._processTapEvent(
        this._card,
        this._card._hass,
        this.config,
        this.config.user_actions.tap_action,
        this._card.config.entities[this.defaultEntityIndex()]?.entity,
        this.labelValue2,
      );
    }
    if (this.dragging)
      this.timeOutId = setTimeout(() => this.callDragService(), this.config.user_actions.drag_action.update_interval);
  }

  callTapService() {
    if (typeof this.labelValue2 === 'undefined') return;

    this._processTapEvent(
      this._card,
      this._card._hass,
      this.config,
      this.config.user_actions?.tap_action,
      this._card.config.entities[this.defaultEntityIndex()]?.entity,
      this.labelValue2,
    );
  }

  // eslint-disable-next-line no-unused-vars
  firstUpdated(changedProperties) {
    this.labelValue = this._stateValue;

    function FrameArc() {
      this.rid = window.requestAnimationFrame(FrameArc);
      this.updateValue(this.m);
      this.updateThumb(this.m);
      this.updateActiveTrack(this.m);
    }

    if (this.dev.debug) console.log('circslider - firstUpdated');
    this.elements = {};
    this.elements.svg = this._card.shadowRoot.getElementById('circslider-'.concat(this.toolId));
    this.elements.track = this.elements.svg.querySelector('#track');
    this.elements.activeTrack = this.elements.svg.querySelector('#active-track');
    this.elements.capture = this.elements.svg.querySelector('#capture');
    this.elements.thumbGroup = this.elements.svg.querySelector('#thumb-group');
    this.elements.thumb = this.elements.svg.querySelector('#thumb');
    this.elements.label = this.elements.svg.querySelector('#label tspan');

    if (this.dev.debug) console.log('circslider - firstUpdated svg = ',
      this.elements.svg, 'activeTrack=', this.elements.activeTrack,
      'thumb=', this.elements.thumb, 'label=', this.elements.label, 'text=', this.elements.text,
    );

    const protectBorderPassing = () => {
      const diffMax = range(this.svg.scale.max, this.labelValue) <= this.rangeMax;
      const diffMin = range(this.svg.scale.min, this.labelValue) <= this.rangeMin;

      // passing borders from max to min...
      const fromMaxToMin = !!(diffMin && this.diffMax);
      const fromMinToMax = !!(diffMax && this.diffMin);
      if (fromMaxToMin) {
        this.labelValue = this.svg.scale.max;
        this.m = this.sliderValueToPoint(this.labelValue);
        this.rangeMax = this.svg.scale.max / 10;
        this.rangeMin = range(this.svg.scale.max, this.svg.scale.min + (this.svg.scale.max / 5));
      } else if (fromMinToMax) {
        this.labelValue = this.svg.scale.min;
        this.m = this.sliderValueToPoint(this.labelValue);
        this.rangeMax = range(this.svg.scale.min, this.svg.scale.max - (this.svg.scale.max / 5));
        this.rangeMin = this.svg.scale.max / 10;
      } else {
        this.diffMax = diffMax;
        this.diffMin = diffMin;
        this.rangeMin = (this.svg.scale.max / 5);
        this.rangeMax = (this.svg.scale.max / 5);
      }
    };

    const pointerMove = (e) => {
      e.preventDefault();

      if (this.dragging) {
        this.m = this.mouseEventToPoint(e);
        this.labelValue = this.pointToSliderValue(this.m);

        protectBorderPassing();

        FrameArc.call(this);
      }
    };

    const pointerDown = (e) => {
      e.preventDefault();

      // User is dragging the thumb of the slider!
      this.dragging = true;

      // NEW:
      // We use mouse stuff for pointerdown, but have to use pointer stuff to make sliding work on Safari. Why??
      window.addEventListener('pointermove', pointerMove, false);
      // eslint-disable-next-line no-use-before-define
      window.addEventListener('pointerup', pointerUp, false);

      // const mousePos = this.mouseEventToPoint(e);
      // console.log("pointerdown", mousePos, this.svg.thumb, this.m);

      // Check for drag_action. If none specified, or update_interval = 0, don't update while dragging...

      if ((this.config.user_actions?.drag_action) && (this.config.user_actions?.drag_action.update_interval)) {
        if (this.config.user_actions.drag_action.update_interval > 0) {
          this.timeOutId = setTimeout(() => this.callDragService(), this.config.user_actions.drag_action.update_interval);
        } else {
          this.timeOutId = null;
        }
      }
      this.m = this.mouseEventToPoint(e);
      this.labelValue = this.pointToSliderValue(this.m);

      protectBorderPassing();

      if (this.dev.debug) console.log('pointerDOWN', Math.round(this.m.x * 100) / 100);
      FrameArc.call(this);
    };

    const pointerUp = (e) => {
      e.preventDefault();
      if (this.dev.debug) console.log('pointerUP');

      window.removeEventListener('pointermove', pointerMove, false);
      window.removeEventListener('pointerup', pointerUp, false);

      window.removeEventListener('mousemove', pointerMove, false);
      window.removeEventListener('touchmove', pointerMove, false);
      window.removeEventListener('mouseup', pointerUp, false);
      window.removeEventListener('touchend', pointerUp, false);

      this.labelValuePrev = this.labelValue;

      // If we were not dragging, do check for passing border stuff!

      if (!this.dragging) {
        protectBorderPassing();
        return;
      }

      this.dragging = false;
      clearTimeout(this.timeOutId);
      this.timeOutId = null;
      this.target = 0;
      this.labelValue2 = this.labelValue;

      FrameArc.call(this);
      this.callTapService();
    };

    const mouseWheel = (e) => {
      e.preventDefault();

      clearTimeout(this.wheelTimeOutId);
      this.dragging = true;
      this.wheelTimeOutId = setTimeout(() => {
        clearTimeout(this.timeOutId);
        this.timeOutId = null;
        this.labelValue2 = this.labelValue;
        this.dragging = false;
        this.callTapService();
      }, 500);

      if ((this.config.user_actions?.drag_action) && (this.config.user_actions?.drag_action.update_interval)) {
        if (this.config.user_actions.drag_action.update_interval > 0) {
          this.timeOutId = setTimeout(() => this.callDragService(), this.config.user_actions.drag_action.update_interval);
        } else {
          this.timeOutId = null;
        }
      }
      const newValue = +this.labelValue + +((e.altKey ? 10 * this.svg.scale.step : this.svg.scale.step) * Math.sign(e.deltaY));

      this.labelValue = clamp$1(this.svg.scale.min, newValue, this.svg.scale.max);
      this.m = this.sliderValueToPoint(this.labelValue);
      this.pointToSliderValue(this.m);

      FrameArc.call(this);

      this.labelValue2 = this.labelValue;
    };
    this.elements.thumbGroup.addEventListener('touchstart', pointerDown, false);
    this.elements.thumbGroup.addEventListener('mousedown', pointerDown, false);

    this.elements.svg.addEventListener('wheel', mouseWheel, false);
  }
  /** *****************************************************************************
  * CircularSliderTool::value()
  *
  * Summary.
  * Sets the value of the CircularSliderTool. Value updated via set hass.
  * Calculate CircularSliderTool settings & colors depending on config and new value.
  *
  */

  set value(state) {
    super.value = state;
    if (!this.dragging) this.labelValue = this._stateValue;

    // Calculate the size of the arc to fill the dasharray with this
    // value. It will fill the CircularSliderTool relative to the state and min/max
    // values given in the configuration.

    if (!this.dragging) {
      const min = this.config.scale.min || 0;
      const max = this.config.scale.max || 100;
      let val = Math.min(Utils.calculateValueBetween(min, max, this._stateValue), 1);

      // Don't display anything, that is NO track, thumb to start...
      if (isNaN(val)) val = 0;
      const score = val * this.svg.pathLength;
      this.dashArray = `${score} ${this.svg.circleLength}`;

      const thumbPos = this.sliderValueToPoint(this._stateValue);
      this.svg.thumb.x1 = thumbPos.x - this.svg.thumb.width / 2;
      this.svg.thumb.y1 = thumbPos.y - this.svg.thumb.height / 2;

      this.svg.capture.x1 = thumbPos.x - this.svg.capture.width / 2;
      this.svg.capture.y1 = thumbPos.y - this.svg.capture.height / 2;
    }
  }

  set values(states) {
    super.values = states;
    if (!this.dragging) this.labelValue = this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())];

    // Calculate the size of the arc to fill the dasharray with this
    // value. It will fill the CircularSliderTool relative to the state and min/max
    // values given in the configuration.

    if (!this.dragging) {
      const min = this.config.scale.min || 0;
      const max = this.config.scale.max || 100;
      let val = Math.min(Utils.calculateValueBetween(min, max, this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]), 1);

      // Don't display anything, that is NO track, thumb to start...
      if (isNaN(val)) val = 0;
      const score = val * this.svg.pathLength;
      this.dashArray = `${score} ${this.svg.circleLength}`;

      const thumbPos = this.sliderValueToPoint(this._stateValues[this.getIndexInEntityIndexes(this.defaultEntityIndex())]);
      this.svg.thumb.x1 = thumbPos.x - this.svg.thumb.width / 2;
      this.svg.thumb.y1 = thumbPos.y - this.svg.thumb.height / 2;

      this.svg.capture.x1 = thumbPos.x - this.svg.capture.width / 2;
      this.svg.capture.y1 = thumbPos.y - this.svg.capture.height / 2;
    }
  }

  _renderUom() {
    if (this.config.show.uom === 'none') {
      return svg``;
    } else {
      this.MergeAnimationStyleIfChanged();
      this.MergeColorFromState(this.styles.uom);

      let fsuomStr = this.styles.label['font-size'];

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
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="1.5em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else if (this.config.show.uom === 'top') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="-1.5em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else {
        return svg`
          <tspan class="${classMap(this.classes.uom)}"  dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ERR</tspan>
        `;
      }
    }
  }

  /** *****************************************************************************
  * CircularSliderTool::_renderCircSlider()
  *
  * Summary.
  * Renders the CircularSliderTool
  *
  * Description.
  * The horseshoes are rendered in a viewbox of 200x200 (SVG_VIEW_BOX).
  * Both are centered with a radius of 45%, ie 200*0.45 = 90.
  *
  * The horseshoes are rotated 220 degrees and are 2 * 26/36 * Math.PI * r in size
  * There you get your value of 408.4070449,180 ;-)
  */

  _renderCircSlider() {
    this.MergeAnimationClassIfChanged();
    this.MergeColorFromState();
    this.MergeAnimationStyleIfChanged();

    // this.MergeColorFromState();
    this.renderValue = this._stateValue;
    // if (this.renderValue === undefined) this.renderValue = 'undefined';
    if (this.dragging) {
      this.renderValue = this.labelValue2;
    } else if (this.elements?.label) this.elements.label.textContent = (this.renderValue === 'undefined') ? '' : this.renderValue;

    function renderLabel(argGroup) {
      if ((this.config.position.label.placement === 'thumb') && argGroup) {
        return svg`
      <text id="label">
        <tspan class="${classMap(this.classes.label)}" x="${this.svg.label.cx}" y="${this.svg.label.cy}" style="${styleMap(this.styles.label)}">
        ${typeof this.renderValue === 'undefined' ? '' : this.renderValue}</tspan>
        ${typeof this.renderValue === 'undefined' ? '' : this._renderUom()}
        </text>
        `;
      }

      if ((this.config.position.label.placement === 'position') && !argGroup) {
        return svg`
          <text id="label" style="transform-origin:center;transform-box: fill-box;">
            <tspan class="${classMap(this.classes.label)}" data-placement="position" x="${this.svg.label.cx}" y="${this.svg.label.cy}"
            style="${styleMap(this.styles.label)}">
            ${typeof this.renderValue === 'undefined' ? '' : this.renderValue}</tspan>
            ${typeof this.renderValue === 'undefined' ? '' : this._renderUom()}
          </text>
          `;
      }
    }

    function renderThumbGroup() {
      // Original version but with SVG.
      // Works in both Chrome and Safari 15.5. But rotate is only on rect... NOT on group!!!!
      //              transform="rotate(${this.arc.currentAngle} ${this.svg.thumb.cx} ${this.svg.thumb.cy})"
      // This one works ...
      return svg`
        <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}" style="filter:url(#sak-drop-1);overflow:visible;">
          <g style="transform-origin:center;transform-box: fill-box;" >
          <g id="thumb" transform="rotate(${this.arc.currentAngle} ${this.svg.capture.width / 2} ${this.svg.capture.height / 2})">

            <rect id="capture" class="${classMap(this.classes.capture)}" x="0" y="0"
              width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}" 
              style="${styleMap(this.styles.capture)}" 
            />

            <rect id="rect-thumb" class="${classMap(this.classes.thumb)}" x="${(this.svg.capture.width - this.svg.thumb.width) / 2}" y="${(this.svg.capture.height - this.svg.thumb.height) / 2}"
              width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
              style="${styleMap(this.styles.thumb)}"
            />

            </g>
            </g>
        </g>
      `;

      // Original version but with SVG.
      // Works in both Chrome and Safari 15.5. But rotate is only on rect... NOT on group!!!!
      //              transform="rotate(${this.arc.currentAngle} ${this.svg.thumb.cx} ${this.svg.thumb.cy})"
      // This one works ... BUT...
      // Now again not after refresh on safari. Ok after udpate. Change is using a style for rotate(xxdeg), instead of transform=rotate()...
      // Works on Safari, not on Chrome. Only change is no extra group level...
      // return svg`
      // <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}">
      // <g style="transform-origin:center;transform-box:fill-box;" transform="rotate(${this.arc.currentAngle} ${this.svg.capture.width/2} ${this.svg.capture.height/2})">
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${(this.svg.capture.width - this.svg.thumb.width)/2}" y="${(this.svg.capture.height - this.svg.thumb.height)/2}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"
      // />

      // <rect id="capture" class="${classMap(this.classes.capture)}" x="0" y="0"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </g>
      // `;

      // Original version but with SVG.
      // Works in both Chrome and Safari 15.5. But rotate is only on rect... NOT on group!!!!
      //              transform="rotate(${this.arc.currentAngle} ${this.svg.thumb.cx} ${this.svg.thumb.cy})"
      // return svg`
      // <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}">
      // <g style="transform-origin:center;transform-box: fill-box;">

      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${(this.svg.capture.width - this.svg.thumb.width)/2}" y="${(this.svg.capture.height - this.svg.thumb.height)/2}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"
      // transform="rotate(${this.arc.currentAngle} 0 0)"
      // />

      // <rect id="capture" class="${classMap(this.classes.capture)}" x="0" y="0"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </g>
      // `;

      // WIP!!!!!!!!!!!
      // Now without tests for Safari and 15.1...
      // Same behaviour in safari: first refresh wrong, then after data ok.
      // return svg`
      // <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}" height="${this.svg.capture.height}" width="${this.svg.capture.width}"
      // style="transform-box: fill-box;">
      // <g style="transform-origin:center;transform-box: fill-box;"
      // transform="rotate(${this.arc.currentAngle})"
      // >
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${(this.svg.capture.width - this.svg.thumb.width)/2}" y="${(this.svg.capture.height - this.svg.thumb.height)/2}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"

      // />
      // <rect id="capture" class="${classMap(this.classes.capture)}" x="0" y="0"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </svg>
      // `;

      // Original version. Working on Chrome and Safari 15.5, NOT on Safari 15.1.
      // But I want grouping to rotate and move all the components, so should be changed anyway...
      // return svg`
      // <g id="thumb-group" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}">
      // <g style="transform-origin:center;transform-box: fill-box;">
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"
      // transform="rotate(${this.arc.currentAngle} ${this.svg.thumb.cx} ${this.svg.thumb.cy})"
      // />
      // <rect id="capture" class="${classMap(this.classes.capture)}" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </g>
      // `;

      // WIP!!!!!!!!!!!
      // This one works on Safari 15.5 and Chrome, but on Safari not on initial refresh, but after data update...
      // Seems the other way around compared to the solution below for 15.1 etc.
      // return svg`
      // <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}" height="${this.svg.capture.height}" width="${this.svg.capture.width}"
      // style="transform-box: fill-box;">
      // <g style="transform-origin:center;transform-box: fill-box;"
      // transform="rotate(${this.arc.currentAngle} ${this._card.isSafari ? (this._card.isSafari15 ? "" : this.svg.capture.width/2) : " 0"}
      // ${this._card.isSafari ? (this._card.isSafari15 ? "" : this.svg.capture.height/2) : " 0"})"
      // >
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${(this.svg.capture.width - this.svg.thumb.width)/2}" y="${(this.svg.capture.height - this.svg.thumb.height)/2}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"

      // />
      // <rect id="capture" class="${classMap(this.classes.capture)}" x="0" y="0"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </svg>
      // `;

      // This version working in all browsers, but has no rotate... So logical...
      // return svg`
      // <g id="thumb-group" style="transform-origin:center;transform-box: fill-box;"  >
      // <g transform="rotate(${this.arc.currentAngle} ${this.svg.cx} ${this.svg.cy})" transform-box="fill-box"
      // >
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"
      // />
      // <rect id="capture" class="${classMap(this.classes.capture)}" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </g>
      // `;

      // This version works on Safari 14, but NOT on Safari 15 and Chrome. The thumb has weird locations...
      // Uses an SVG to position stuff. Rest is relative positions in SVG...
      // Rotate is from center of SVG...
      //
      // Works on Safari 15.5 after refresh, but not when data changes. WHY???????????????????
      // Something seems to ruin stuff when data comes in...
      // return svg`
      // <svg id="thumb-group" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}" >
      // <g style="transform-origin:center;transform-box: fill-box;"
      // transform="rotate(${this.arc.currentAngle} ${this.svg.capture.width/2} ${this.svg.capture.height/2})">
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${(this.svg.capture.width - this.svg.thumb.width)/2}" y="${(this.svg.capture.height - this.svg.thumb.height)/2}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"

      // />
      // <rect id="capture" class="${classMap(this.classes.capture)}" x="0" y="0"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </svg>
      // `;

      // Original version. Working on Chrome and Safari 15.5, NOT on Safari 15.1.
      // But I want grouping to rotate and move all the components, so should be changed anyway...
      // return svg`
      // <g id="thumb-group" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}">
      // <g style="transform-origin:center;transform-box: fill-box;">
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"
      // transform="rotate(${this.arc.currentAngle} ${this.svg.thumb.cx} ${this.svg.thumb.cy})"
      // />
      // <rect id="capture" class="${classMap(this.classes.capture)}" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}"
      // width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.capture.radius}"
      // style="${styleMap(this.styles.capture)}"
      // />
      // </g>
      // </g>
      // `;

      // return svg`
      // <g id="thumb-group" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}" style="transform:translate(${cx}px, ${cy}px);">
      // <g style="transform-origin:center;transform-box: fill-box;">
      // <rect id="thumb" class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
      // width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
      // style="${styleMap(this.styles.thumb)}"
      // />
      // </g>
      // ${renderLabel.call(this, true)}
      // </g>
      // `;
    }

    return svg`
      <g id="circslider__group-inner" class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}">

        <circle id="track" class="sak-circslider__track" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          style="${styleMap(this.styles.track)}"
          stroke-dasharray="${this.arc.scaleDasharray} ${this.arc.arcLength}"
          stroke-dashoffset="${this.arc.dashOffset}"
          stroke-width="${this.svg.track.width}"
          transform="rotate(${this.svg.rotate.degrees} ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        <circle id="active-track" class="sak-circslider__active" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          fill="${this.config.fill || 'rgba(0, 0, 0, 0)'}"
          style="${styleMap(this.styles.active)}"
          stroke-dasharray="${this.dashArray}"
          stroke-dashoffset="${this.arc.dashOffset}"
          stroke-width="${this.svg.active.width}"
          transform="rotate(${this.svg.rotate.degrees} ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        ${renderThumbGroup.call(this)}
        ${renderLabel.call(this, false)}
      </g>

    `;
  }

  /** *****************************************************************************
  * CircularSliderTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" id="circslider-${this.toolId}" class="circslider__group-outer" overflow="visible"
        touch-action="none" style="touch-action:none;"
      >
        ${this._renderCircSlider()}

      </svg>
    `;
  }
} // END of class

/** ****************************************************************************
  * EllipseTool class
  *
  * Summary.
  *
  */

class EllipseTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_ELLIPSE_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        radiusx: 50,
        radiusy: 25,
      },
      classes: {
        tool: {
          'sak-ellipse': true,
          hover: true,
        },
        ellipse: {
          'sak-ellipse__ellipse': true,
        },
      },
      styles: {
        tool: {
        },
        ellipse: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_ELLIPSE_CONFIG, argConfig), argPos);

    this.svg.radiusx = Utils.calculateSvgDimension(argConfig.position.radiusx);
    this.svg.radiusy = Utils.calculateSvgDimension(argConfig.position.radiusy);

    this.classes.tool = {};
    this.classes.ellipse = {};

    this.styles.tool = {};
    this.styles.ellipse = {};

    if (this.dev.debug) console.log('EllipseTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  /** *****************************************************************************
  * EllipseTool::_renderEllipse()
  *
  * Summary.
  * Renders the ellipse using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the ellipse
  *
  */

  _renderEllipse() {
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.ellipse);

    if (this.dev.debug) console.log('EllipseTool - renderEllipse', this.svg.cx, this.svg.cy, this.svg.radiusx, this.svg.radiusy);

    return svg`
      <ellipse class="${classMap(this.classes.ellipse)}"
        cx="${this.svg.cx}"% cy="${this.svg.cy}"%
        rx="${this.svg.radiusx}" ry="${this.svg.radiusy}"
        style="${styleMap(this.styles.ellipse)}"/>
      `;
  }

  /** *****************************************************************************
  * EllipseTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <g id="ellipse-${this.toolId}"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderEllipse()}
      </g>
    `;
  }
} // END of class

/** ****************************************************************************
  * EntityAreaTool class
  *
  * Summary.
  *
  */

class EntityAreaTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_AREA_CONFIG = {
      classes: {
        tool: {
        },
        area: {
          'sak-area__area': true,
          hover: true,
        },
      },
      styles: {
        tool: {
        },
        area: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_AREA_CONFIG, argConfig), argPos);

    // Text is rendered in its own context. No need for SVG coordinates.
    this.classes.tool = {};
    this.classes.area = {};

    this.styles.tool = {};
    this.styles.area = {};
    if (this.dev.debug) console.log('EntityAreaTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  /** *****************************************************************************
  * EntityAreaTool::_buildArea()
  *
  * Summary.
  * Builds the Area string.
  *
  */

  _buildArea(entityState, entityConfig) {
    return (
      entityConfig.area
      || '?'
    );
  }

  /** *****************************************************************************
  * EntityAreaTool::_renderEntityArea()
  *
  * Summary.
  * Renders the entity area using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the area
  *
  */

  _renderEntityArea() {
    this.MergeAnimationClassIfChanged();
    this.MergeColorFromState(this.styles.area);
    this.MergeAnimationStyleIfChanged();

    const area = this.textEllipsis(
      this._buildArea(
        this._card.entities[this.defaultEntityIndex()],
        this._card.config.entities[this.defaultEntityIndex()],
      ),
      this.config?.show?.ellipsis,
    );

    return svg`
        <text>
          <tspan class="${classMap(this.classes.area)}"
          x="${this.svg.cx}" y="${this.svg.cy}" style="${styleMap(this.styles.area)}">${area}</tspan>
        </text>
      `;
  }

  /** *****************************************************************************
  * EntityAreaTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <g id="area-${this.toolId}"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderEntityArea()}
      </g>
    `;
  }
} // END of class

/** Icon to use when no icon specified for domain. */
const DEFAULT_DOMAIN_ICON_NAME = 'mdi:bookmark';

const FIXED_DOMAIN_ICONS_NAME = {
  air_quality: 'mdi:air-filter',
  alert: 'mdi:alert',
  calendar: 'mdi:calendar',
  climate: 'mdi:thermostat',
  configurator: 'mdi:cog',
  conversation: 'mdi:microphone-message',
  counter: 'mdi:counter',
  datetime: 'mdi:calendar-clock',
  date: 'mdi:calendar',
  demo: 'mdi:home-assistant',
  google_assistant: 'mdi:google-assistant',
  group: 'mdi:google-circles-communities',
  homeassistant: 'mdi:home-assistant',
  homekit: 'mdi:home-automation',
  image_processing: 'mdi:image-filter-frames',
  input_button: 'mdi:gesture-tap-button',
  input_datetime: 'mdi:calendar-clock',
  input_number: 'mdi:ray-vertex',
  input_select: 'mdi:format-list-bulleted',
  input_text: 'mdi:form-textbox',
  light: 'mdi:lightbulb',
  mailbox: 'mdi:mailbox',
  notify: 'mdi:comment-alert',
  number: 'mdi:ray-vertex',
  persistent_notification: 'mdi:bell',
  plant: 'mdi:Flower',
  proximity: 'mdi:apple-safari',
  remote: 'mdi:remote',
  scene: 'mdi:palette',
  schedule: 'mdi:calendar-clock',
  script: 'mdi:script-text',
  select: 'mdi:format-list-bulleted',
  sensor: 'mdi:Eye',
  simple_alarm: 'mdi:bell',
  siren: 'mdi:bullhorn',
  stt: 'mdi:microphone-message',
  text: 'mdi:form-textbox',
  time: 'mdi:clock',
  timer: 'mdi:timer-outline',
  tts: 'mdi:speaker-message',
  updater: 'mdi:cloud-upload',
  vacuum: 'mdi:robot-vacuum',
  zone: 'mdi:map-marker-radius',
};

const FIXED_DEVICE_CLASS_ICONS_NAME = {
  apparent_power: 'mdi:flash',
  aqi: 'mdi:air-filter',
  atmospheric_pressure: 'mdi:thermometer-lines',
  // battery: 'mdi:Battery, => not included by design since `sensorIcon()` will dynamically determine the icon
  carbon_dioxide: 'mdi:molecule-co2',
  carbon_monoxide: 'mdi:molecule-co',
  current: 'mdi:current-ac',
  data_rate: 'mdi:transmission-tower',
  data_size: 'mdi:database',
  date: 'mdi:calendar',
  distance: 'mdi:arrow-left-right',
  duration: 'mdi:progress-clock',
  energy: 'mdi:lightning-bolt',
  frequency: 'mdi:sine-wave',
  gas: 'mdi:meter-gas',
  humidity: 'mdi:water-percent',
  illuminance: 'mdi:brightness-5',
  irradiance: 'mdi:sun-wireless',
  moisture: 'mdi:water-percent',
  monetary: 'mdi:cash',
  nitrogen_dioxide: 'mdi:molecule',
  nitrogen_monoxide: 'mdi:molecule',
  nitrous_oxide: 'mdi:molecule',
  ozone: 'mdi:molecule',
  pm1: 'mdi:molecule',
  pm10: 'mdi:molecule',
  pm25: 'mdi:molecule',
  power: 'mdi:flash',
  power_factor: 'mdi:angle-acute',
  precipitation: 'mdi:weather-rainy',
  precipitation_intensity: 'mdi:weather-pouring',
  pressure: 'mdi:gauge',
  reactive_power: 'mdi:flash',
  signal_strength: 'mdi:wifi',
  sound_pressure: 'mdi:ear-hearing',
  speed: 'mdi:speedometer',
  sulphur_dioxide: 'mdi:molecule',
  temperature: 'mdi:thermometer',
  timestamp: 'mdi:clock',
  volatile_organic_compounds: 'mdi:molecule',
  volatile_organic_compounds_parts: 'mdi:molecule',
  voltage: 'mdi:sine-wave',
  volume: 'mdi:car-coolant-level',
  water: 'mdi:water',
  weight: 'mdi:weight',
  wind_speed: 'mdi:weather-windy',
};

// eslint-disable-next-line import/prefer-default-export
const computeDomain = (entityId) => entityId.substr(0, entityId.indexOf('.'));

/** Return an icon representing a alarm panel state. */

// eslint-disable-next-line import/prefer-default-export
const alarmPanelIconName = (state) => {
  switch (state) {
    case 'armed_away':
      return 'mdi:shield-lock';
    case 'armed_vacation':
      return 'mdi:shield-airplane';
    case 'armed_home':
      return 'mdi:shield-home';
    case 'armed_night':
      return 'mdi:shield-moon';
    case 'armed_custom_bypass':
      return 'mdi:security';
    case 'pending':
      return 'mdi:shield-outline';
    case 'triggered':
      return 'mdi:bell-ring';
    case 'disarmed':
      return 'mdi:shield-off';
    default:
      return 'mdi:shield';
  }
};

/** Return an icon representing a binary sensor state. */

// eslint-disable-next-line import/prefer-default-export
const binarySensorIconName = (state, stateObj) => {
  const is_off = state === 'off';
  switch (stateObj?.attributes.device_class) {
    case 'battery':
      return is_off ? 'mdi:battery' : 'mdi:battery-outline';
    case 'battery_charging':
      return is_off ? 'mdi:battery' : 'mdi:battery-charging';
    case 'carbon_monoxide':
      return is_off ? 'mdi:smoke-detector' : 'mdi:smoke-detector-alert';
    case 'cold':
      return is_off ? 'mdi:thermometer' : 'mdi:Snowflake';
    case 'connectivity':
      return is_off ? 'mdi:close-network-outline' : 'mdi:check-network-outline';
    case 'door':
      return is_off ? 'mdi:door-closed' : 'mdi:door-open';
    case 'garage_door':
      return is_off ? 'mdi:garage' : 'mdi:garage-open';
    case 'power':
      return is_off ? 'mdi:power-plug-off' : 'mdi:power-plug';
    case 'gas':
    case 'problem':
    case 'safety':
    case 'tamper':
      return is_off ? 'mdi:check-circle' : 'mdi:alert-circle';
    case 'smoke':
      return is_off ? 'mdi:smoke-detector-variant' : 'mdi:smoke-detector-variant-alert';
    case 'heat':
      return is_off ? 'mdi:thermometer' : 'mdi:fire';
    case 'light':
      return is_off ? 'mdi:brightness-5' : 'mdi:brightness-7';
    case 'lock':
      return is_off ? 'mdi:lock' : 'mdi:lock-open';
    case 'moisture':
      return is_off ? 'mdi:water-off' : 'mdi:water';
    case 'motion':
      return is_off ? 'mdi:motion-sensor-off' : 'mdi:motion-sensor';
    case 'occupancy':
      return is_off ? 'mdi:home-outline' : 'mdi:Home';
    case 'opening':
      return is_off ? 'mdi:square' : 'mdi:square-outline';
    case 'plug':
      return is_off ? 'mdi:power-plug-off' : 'mdi:power-plug';
    case 'presence':
      return is_off ? 'mdi:home-outline' : 'mdi:home';
    case 'running':
      return is_off ? 'mdi:stop' : 'mdi:play';
    case 'sound':
      return is_off ? 'mdi:music-note-off' : 'mdi:music-note';
    case 'update':
      return is_off ? 'mdi:package' : 'mdi:package-up';
    case 'vibration':
      return is_off ? 'mdi:crop-portrait' : 'mdi:vibrate';
    case 'window':
      return is_off ? 'mdi:window-closed' : 'mdi:window-open';
    default:
      return is_off ? 'mdi:radiobox-blank' : 'mdi:checkbox-marked-circle';
  }
};

/** Return an icon representing a cover state. */

const coverIconName = (state, stateObj) => {
  const open = state !== 'closed';

  // eslint-disable-next-line default-case
  switch (stateObj?.attributes.device_class) {
    case 'garage':
      switch (state) {
        case 'opening':
          return 'mdi:arrow-up-box';
        case 'closing':
          return 'mdi:arrow-down-box';
        case 'closed':
          return 'mdigarage';
        default:
          return 'mdi:Garage-open';
      }
    case 'gate':
      switch (state) {
        case 'opening':
        case 'closing':
          return 'mdi:gate-arrow-right';
        case 'closed':
          return 'mdi:gate';
        default:
          return 'mdi:gate-open';
      }
    case 'door':
      return open ? 'mdi:door-open' : 'mdi:door-closed';
    case 'damper':
      return open ? 'mdi:circle' : 'mdi:circle-slice-8';
    case 'shutter':
      switch (state) {
        case 'opening':
          return 'mdi:arrow-up-box';
        case 'closing':
          return 'mdi:arrow-down-box';
        case 'closed':
          return 'mdi:window-shutter';
        default:
          return 'mdi:window-shutter-open';
      }
    case 'curtain':
      switch (state) {
        case 'opening':
          return 'mdi:arrow-split-vertical';
        case 'closing':
          return 'mdi:arrow-collapse-horizontal';
        case 'closed':
          return 'mdi:curtains-closed';
        default:
          return 'mdi:curtains';
      }
    case 'blind':
      switch (state) {
        case 'opening':
          return 'mdi:arrow-up-box';
        case 'closing':
          return 'mdi:arrow-down-box';
        case 'closed':
          return 'mdi:blinds-horizontal-closed';
        default:
          return 'mdi:blinds-horizontal';
      }
    case 'shade':
      switch (state) {
        case 'opening':
          return 'mdi:arrow-up-box';
        case 'closing':
          return 'mdi:arrow-down-box';
        case 'closed':
          return 'mdi:roller-shade-closed';
        default:
          return 'mdi:roller-shade';
      }
    case 'window':
      switch (state) {
        case 'opening':
          return 'mdi:arrow-up-box';
        case 'closing':
          return 'mdi:arrow-down-box';
        case 'closed':
          return 'mdi:window--closed';
        default:
          return 'mdi:window--open';
      }
  }

  switch (state) {
    case 'opening':
      return 'mdi:arrow-up-box';
    case 'closing':
      return 'mdi:arrow-down-box';
    case 'closed':
      return 'mdi:window--closed';
    default:
      return 'mdi:window--open';
  }
};

// eslint-disable-next-line import/prefer-default-export
const numberIconName = (stateObj) => {
  const dclass = stateObj?.attributes.device_class;

  if (dclass && dclass in FIXED_DEVICE_CLASS_ICONS_NAME) {
    return FIXED_DEVICE_CLASS_ICONS_NAME[dclass];
  }

  return undefined;
};

/** Constants to be used in the frontend. */

// import {
//   mdiAirFilter,
//   mdiAlert,
//   mdiAngleAcute,
//   mdiAppleSafari,
//   mdiArrowLeftRight,
//   mdiBell,
//   mdiBookmark,
//   mdiBrightness5,
//   mdiBullhorn,
//   mdiCalendar,
//   mdiCalendarClock,
//   mdiCarCoolantLevel,
//   mdiCash,
//   mdiClock,
//   mdiCloudUpload,
//   mdiCog,
//   mdiCommentAlert,
//   mdiCounter,
//   mdiCurrentAc,
//   mdiDatabase,
//   mdiEarHearing,
//   mdiEye,
//   mdiFlash,
//   mdiFlower,
//   mdiFormatListBulleted,
//   mdiFormTextbox,
//   mdiGauge,
//   mdiGestureTapButton,
//   mdiGoogleAssistant,
//   mdiGoogleCirclesCommunities,
//   mdiHomeAssistant,
//   mdiHomeAutomation,
//   mdiImageFilterFrames,
//   mdiLightbulb,
//   mdiLightningBolt,
//   mdiMailbox,
//   mdiMapMarkerRadius,
//   mdiMeterGas,
//   mdiMicrophoneMessage,
//   mdiMolecule,
//   mdiMoleculeCo,
//   mdiMoleculeCo2,
//   mdiPalette,
//   mdiProgressClock,
//   mdiRayVertex,
//   mdiRemote,
//   mdiRobotVacuum,
//   mdiScriptText,
//   mdiSineWave,
//   mdiSpeakerMessage,
//   mdiSpeedometer,
//   mdiSunWireless,
//   mdiThermometer,
//   mdiThermometerLines,
//   mdiThermostat,
//   mdiTimerOutline,
//   mdiTransmissionTower,
//   mdiWater,
//   mdiWaterPercent,
//   mdiWeatherPouring,
//   mdiWeatherRainy,
//   mdiWeatherWindy,
//   mdiWeight,
//   mdiWifi,
// } from '@mdi/js';

// From https://github.com/home-assistant/frontend/blob/dev/src/data/sensor.ts
const SENSOR_DEVICE_CLASS_BATTERY = 'battery';

/** Domains where we allow toggle in Lovelace. */
new Set([
  'fan',
  'input_boolean',
  'light',
  'switch',
  'group',
  'automation',
  'humidifier',
]);

/** Domains that have a dynamic entity image / picture. */
new Set(['camera', 'media_player']);

/** Temperature units. */
const UNIT_C = '°C';
const UNIT_F = '°F';

/** Return an icon representing a battery state. */

const BATTERY_ICONS_NAME = {
  10: 'mdi:battery-10',
  20: 'mdi:battery-20',
  30: 'mdi:battery-30',
  40: 'mdi:battery-40',
  50: 'mdi:battery-50',
  60: 'mdi:battery-60',
  70: 'mdi:battery-70',
  80: 'mdi:battery-80',
  90: 'mdi:battery-90',
  100: 'mdi:battery',
};
const BATTERY_CHARGING_ICONS_NAME = {
  10: 'mdi:battery-charging-10',
  20: 'mdi:battery-charging-20',
  30: 'mdi:battery-charging-30',
  40: 'mdi:battery-charging-40',
  50: 'mdi:battery-charging-50',
  60: 'mdi:battery-charging-60',
  70: 'mdi:battery-charging-70',
  80: 'mdi:battery-charging-80',
  90: 'mdi:battery-charging-90',
  100: 'mdi:battery-charging',
};

const batteryStateIconName = (batteryState, batteryChargingState) => {
  const battery = batteryState.state;
  const batteryCharging = batteryChargingState && batteryChargingState.state === 'on';

  // eslint-disable-next-line no-use-before-define
  return batteryIconName(battery, batteryCharging);
};

const batteryIconName = (batteryState, batteryCharging) => {
  const batteryValue = Number(batteryState);
  if (isNaN(batteryValue)) {
    if (batteryState === 'off') {
      return 'mdi:battery';
    }
    if (batteryState === 'on') {
      return 'mdi:battery-alert';
    }
    return 'mdi:battery-unknown';
  }

  const batteryRound = Math.round(batteryValue / 10) * 10;
  if (batteryCharging && batteryValue >= 10) {
    return BATTERY_CHARGING_ICONS_NAME[batteryRound];
  }
  if (batteryCharging) {
    return 'mdi:battery-charging-outline';
  }
  if (batteryValue <= 5) {
    return 'mdi:battery-alert-variant-outline';
  }
  return BATTERY_ICONS_NAME[batteryRound];
};

/** Return an icon representing a sensor state. */
// eslint-disable-next-line import/prefer-default-export
const sensorIconName = (stateObj) => {
  const dclass = stateObj?.attributes.device_class;

  if (dclass && dclass in FIXED_DEVICE_CLASS_ICONS_NAME) {
    return FIXED_DEVICE_CLASS_ICONS_NAME[dclass];
  }

  if (dclass === SENSOR_DEVICE_CLASS_BATTERY) {
    return stateObj ? batteryStateIconName(stateObj) : 'mdi:battery';
  }

  const unit = stateObj?.attributes.unit_of_measurement;
  if (unit === UNIT_C || unit === UNIT_F) {
    return 'mdi-thermometer';
  }

  return undefined;
};

// import { weatherIcon } from '../../data/weather';

const domainIconName = (domain, stateObj, state) => {
  // eslint-disable-next-line no-use-before-define
  const icon = domainIconWithoutDefaultName(domain, stateObj, state);
  if (icon) {
    return icon;
  }
  // eslint-disable-next-line
  console.warn(`Unable to find icon for domain ${domain}`);
  return DEFAULT_DOMAIN_ICON_NAME;
};

const domainIconWithoutDefaultName = (domain, stateObj, state) => {
  const compareState = state !== undefined ? state : stateObj?.state;

  // eslint-disable-next-line default-case
  switch (domain) {
    case 'alarm_control_panel':
      return alarmPanelIconName(compareState);

    case 'automation':
      return compareState === 'off' ? 'mdi:robot-off' : 'mdi:robot';

    case 'binary_sensor':
      return binarySensorIconName(compareState, stateObj);

    case 'button':
      switch (stateObj?.attributes.device_class) {
        case 'restart':
          return 'mdi:restart';
        case 'update':
          return 'mdi:package-up';
        default:
          return 'mdi:gesture-tap-button';
      }

    case 'camera':
      return compareState === 'off' ? 'mdi:video-off' : 'mdi:video';

    case 'cover':
      return coverIconName(compareState, stateObj);

    case 'device_tracker':
      if (stateObj?.attributes.source_type === 'router') {
        return compareState === 'home' ? 'mdi:lan-connect' : 'mdi:lan-cisconnect';
      }
      if (
        ['bluetooth', 'bluetooth_le'].includes(stateObj?.attributes.source_type)
      ) {
        return compareState === 'home' ? 'mdi:bluetooth-connect' : 'mdi:bluetooth';
      }
      return compareState === 'not_home' ? 'mdi:account-arrow-right' : 'mdi:account';

    case 'fan':
      return compareState === 'off' ? 'mdi:fan-off' : 'mdi:fan';

    case 'humidifier':
      return compareState === 'off' ? 'mdi:air-humidifier-off' : 'mdi:air-humidifier';

    case 'input_boolean':
      return compareState === 'on'
        ? 'mdi:check-circle-outline'
        : 'mdi:close-circle-outline';

    case 'input_datetime':
      if (!stateObj?.attributes.has_date) {
        return 'mdi:clock';
      }
      if (!stateObj.attributes.has_time) {
        return 'mdi:calendar';
      }
      break;

    case 'lock':
      switch (compareState) {
        case 'unlocked':
          return 'mdi:lock-open';
        case 'jammed':
          return 'mdi:lock-alert';
        case 'locking':
        case 'unlocking':
          return 'mdi:lock-clock';
        default:
          return 'mdi:lock';
      }

    case 'media_player':
      switch (stateObj?.attributes.device_class) {
        case 'speaker':
          switch (compareState) {
            case 'playing':
              return 'mdi:speaker-play';
            case 'paused':
              return 'mdi:speaker-pause';
            case 'off':
              return 'mdi:speaker-off';
            default:
              return 'mdi:speaker';
          }
        case 'tv':
          switch (compareState) {
            case 'playing':
              return 'mdi:television-play';
            case 'paused':
              return 'mdi:television-pause';
            case 'off':
              return 'mdi:television-off';
            default:
              return 'mdi:television';
          }
        case 'receiver':
          switch (compareState) {
            case 'off':
              return 'mdi:audio-video-off';
            default:
              return 'mdi:audio-video';
          }
        default:
          switch (compareState) {
            case 'playing':
            case 'paused':
              return 'mdi:cast-connected';
            case 'off':
              return 'mdi:cast-off';
            default:
              return 'mdi:cast';
          }
      }

    case 'number': {
      const icon = numberIconName(stateObj);
      if (icon) {
        return icon;
      }

      break;
    }

    case 'person':
      return compareState === 'not_home' ? 'mdi:account-arrow-right' : 'mdi:account';

    case 'switch':
      switch (stateObj?.attributes.device_class) {
        case 'outlet':
          return compareState === 'on' ? 'mdi:power-plug' : 'mdi:power-plug-off';
        case 'switch':
          return compareState === 'on'
            ? 'mdi:toggle-switch-variant'
            : 'mdi:toggle-switch-variant-off';
        default:
          return 'mdi:toggle-switch-variant';
      }

    case 'sensor': {
      const icon = sensorIconName(stateObj);
      if (icon) {
        return icon;
      }

      break;
    }

    case 'sun':
      return stateObj?.state === 'above_horizon'
        ? 'mdi:white-balance-sunny'
        : 'mdi:weather-night';

    case 'switch_as_x':
      return 'mdi:swap-horizontal';

    case 'threshold':
      return 'mdi:chart-sankey';

    // case 'update':
    //   return compareState === 'on'
    //     ? updateIsInstalling(stateObj)
    //       ? 'mdi:PackageDown
    //       : 'mdi:PackageUp
    //     : 'mdi:Package;

    case 'water_heater':
      return compareState === 'off' ? 'mdi:water-boiler-off' : 'mdi:water-boiler';

    // case 'weather':
    //   return weatherIcon(stateObj?.state);
  }

  if (domain in FIXED_DOMAIN_ICONS_NAME) {
    return FIXED_DOMAIN_ICONS_NAME[domain];
  }

  return undefined;
};

// eslint-disable-next-line import/prefer-default-export
const stateIconName = (state) => {
  if (!state) {
    return DEFAULT_DOMAIN_ICON_NAME;
  }
  return domainIconName(computeDomain(state.entity_id), state);
};

/** ****************************************************************************
  * EntityIconTool class
  *
  * Summary.
  *
  */

class EntityIconTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_ICON_CONFIG = {
      classes: {
        tool: {
          'sak-icon': true,
          hover: true,
        },
        icon: {
          'sak-icon__icon': true,
        },
      },
      styles: {
        tool: {
        },
        icon: {
        },
      },
    };
    super(argToolset, Merge.mergeDeep(DEFAULT_ICON_CONFIG, argConfig), argPos);

    // from original
    // this.config.entity = this.config.entity ? this.config.entity : 0;

    // get icon size, and calculate the foreignObject position and size. This must match the icon size
    // 1em = FONT_SIZE pixels, so we can calculate the icon size, and x/y positions of the foreignObject
    // the viewport is 200x200, so we can calulate the offset.
    //
    // NOTE:
    // Safari doesn't use the svg viewport for rendering of the foreignObject, but the real clientsize.
    // So positioning an icon doesn't work correctly...

    this.svg.iconSize = this.config.position.icon_size ? this.config.position.icon_size : 3;
    this.svg.iconPixels = this.svg.iconSize * FONT_SIZE;

    const align = this.config.position.align ? this.config.position.align : 'center';
    const adjust = (align === 'center' ? 0.5 : (align === 'start' ? -1 : +1));

    const clientWidth = 400; // testing
    const correction = clientWidth / this._card.viewBox.width;

    this.svg.xpx = this.svg.cx;
    this.svg.ypx = this.svg.cy;

    if (((this._card.isSafari) || (this._card.iOS)) && (!this._card.isSafari16)) {
      this.svg.iconSize *= correction;

      this.svg.xpx = (this.svg.xpx * correction) - (this.svg.iconPixels * adjust * correction);
      this.svg.ypx = (this.svg.ypx * correction) - (this.svg.iconPixels * 0.5 * correction) - (this.svg.iconPixels * 0.25 * correction);// - (iconPixels * 0.25 / 1.86);
    } else {
      // Get x,y in viewbox dimensions and center with half of size of icon.
      // Adjust horizontal for aligning. Can be 1, 0.5 and -1
      // Adjust vertical for half of height... and correct for 0.25em textfont to align.
      this.svg.xpx -= (this.svg.iconPixels * adjust);
      this.svg.ypx = this.svg.ypx - (this.svg.iconPixels * 0.5) - (this.svg.iconPixels * 0.25);
    }
    this.classes.tool = {};
    this.classes.icon = {};

    this.styles.tool = {};
    this.styles.icon = {};

    if (this.dev.debug) console.log('EntityIconTool constructor coords, dimensions, config', this.coords, this.dimensions, this.config);
  }

  /** *****************************************************************************
  * EntityIconTool::static properties()
  *
  * Summary.
  * Declares the static class properties.
  * Needs eslint parserOptions ecmaVersion: 2022
  *
  * Replaces older style declarations in the constructor, such as
  *
  *  if (!EntityIconTool.sakIconCache) {
  *    EntityIconTool.sakIconCache = {};
  *  }
  *
  */
  static {
    EntityIconTool.sakIconCache = {};
  }

  /** *****************************************************************************
  * EntityIconTool::_buildIcon()
  *
  * Summary.
  * Builds the Icon specification name.
  *
  */
  _buildIcon(entityState, entityConfig, toolIcon) {
    return (
      this.activeAnimation?.icon // Icon from animation
      || toolIcon // Defined by tool
      || entityConfig?.icon // Defined by configuration
      || entityState?.attributes?.icon // Using entity icon
      || stateIconName(entityState) // From modified HA files
    );
  }

  /** *****************************************************************************
  * EntityIconTool::_renderIcon()
  *
  * Summary.
  * Renders the icon using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the icon
  *
  * THIS IS THE ONE!!!!
  */

  _renderIcon() {
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.icon);

    const icon = this._buildIcon(
      this._card.entities[this.defaultEntityIndex()],
      (this.defaultEntityIndex() !== undefined) ? this._card.config.entities[this.defaultEntityIndex()] : undefined,
      this.config.icon,
    );

    // eslint-disable-next-line no-constant-condition
    {
      this.svg.iconSize = this.config.position.icon_size ? this.config.position.icon_size : 2;
      this.svg.iconPixels = this.svg.iconSize * FONT_SIZE;

      // NEW NEW NEW Use % for size of icon...
      this.svg.iconSize = this.config.position.icon_size ? this.config.position.icon_size : 2;
      this.svg.iconPixels = Utils.calculateSvgDimension(this.svg.iconSize);

      const align = this.config.position.align ? this.config.position.align : 'center';
      const adjust = (align === 'center' ? 0.5 : (align === 'start' ? -1 : +1));

      const clientWidth = 400;
      const correction = clientWidth / (this._card.viewBox.width);

      this.svg.xpx = this.svg.cx;// (x * this._card.viewBox.width);
      this.svg.ypx = this.svg.cy;// (y * this._card.viewBox.height);

      if (((this._card.isSafari) || (this._card.iOS)) && (!this._card.isSafari16)) {
        // correction = 1; //
        this.svg.iconSize *= correction;
        this.svg.iconPixels *= correction;

        this.svg.xpx = (this.svg.xpx * correction) - (this.svg.iconPixels * adjust * correction);
        this.svg.ypx = (this.svg.ypx * correction) - (this.svg.iconPixels * 0.9 * correction);
        // - (this.svg.iconPixels * 0.25 * correction);// - (iconPixels * 0.25 / 1.86);
        this.svg.xpx = (this.svg.cx * correction) - (this.svg.iconPixels * adjust * correction);
        this.svg.ypx = (this.svg.cy * correction) - (this.svg.iconPixels * adjust * correction);
      } else {
        // Get x,y in viewbox dimensions and center with half of size of icon.
        // Adjust horizontal for aligning. Can be 1, 0.5 and -1

        this.svg.xpx = this.svg.cx - (this.svg.iconPixels * adjust);
        this.svg.ypx = this.svg.cy - (this.svg.iconPixels * adjust);

        if (this.dev.debug) console.log('EntityIconTool::_renderIcon - svg values =', this.toolId, this.svg, this.config.cx, this.config.cy, align, adjust);
      }
    }

    if (!this.alternateColor) { this.alternateColor = 'rgba(0,0,0,0)'; }

    if (!EntityIconTool.sakIconCache[icon]) {
      const theQuery = this._card.shadowRoot.getElementById('icon-'.concat(this.toolId))?.shadowRoot?.querySelectorAll('*');
      if (theQuery) {
        this.iconSvg = theQuery[0]?.path;
      } else {
        this.iconSvg = undefined;
      }

      if (this.iconSvg) {
        EntityIconTool.sakIconCache[icon] = this.iconSvg;
        // console.log('EntityIconTool, cache - Store: ', icon);
      }
    } else {
      this.iconSvg = EntityIconTool.sakIconCache[icon];
      // console.log('EntityIconTool, cache - Fetch: ', icon);
    }

    let scale;

    // NTS@20201.12.24
    // Add (true) to force rendering the Safari like solution for icons.
    // After the above fix, it seems to work for both Chrome and Safari browsers.
    // That is nice. Now animations also work on Chrome...

    if (this.iconSvg) {
      // Use original size, not the corrected one!
      this.svg.iconSize = this.config.position.icon_size ? this.config.position.icon_size : 2;
      this.svg.iconPixels = Utils.calculateSvgDimension(this.svg.iconSize);

      this.svg.x1 = this.svg.cx - this.svg.iconPixels / 2;
      this.svg.y1 = this.svg.cy - this.svg.iconPixels / 2;
      this.svg.x1 = this.svg.cx - (this.svg.iconPixels * 0.5);
      this.svg.y1 = this.svg.cy - (this.svg.iconPixels * 0.5);

      scale = this.svg.iconPixels / 24;
      // scale = 1;
      // Icon is default drawn at 0,0. As there is no separate viewbox, a transform is required
      // to position the icon on its desired location.
      // Icon is also drawn in a default 24x24 viewbox. So scale the icon to the required size using scale()
      return svg`
        <g id="icon-${this.toolId}" class="${classMap(this.classes.icon)}" style="${styleMap(this.styles.icon)}" x="${this.svg.x1}px" y="${this.svg.y1}px" transform-origin="${this.svg.cx} ${this.svg.cy}">
          <rect x="${this.svg.x1}" y="${this.svg.y1}" height="${this.svg.iconPixels}px" width="${this.svg.iconPixels}px" stroke-width="0px" fill="rgba(0,0,0,0)"></rect>
          <path d="${this.iconSvg}" transform="translate(${this.svg.x1},${this.svg.y1}) scale(${scale})"></path>
        <g>
      `;
    } else {
      // Note @2022.06.26
      // overflow="hidden" is ignored by latest and greatest Safari 15.5. Wow. Nice! Good work!
      // So use a fill/color of rgba(0,0,0,0)...
      return svg`
        <foreignObject width="0px" height="0px" x="${this.svg.xpx}" y="${this.svg.ypx}" overflow="hidden">
          <body>
            <div class="div__icon, hover" xmlns="http://www.w3.org/1999/xhtml"
                style="line-height:${this.svg.iconPixels}px;position:relative;border-style:solid;border-width:0px;border-color:${this.alternateColor};fill:${this.alternateColor};color:${this.alternateColor};">
                <ha-icon icon=${icon} id="icon-${this.toolId}"
                @animationstart=${(e) => this._handleAnimationEvent(e, this)}
                @animationiteration=${(e) => this._handleAnimationEvent(e, this)}
                style="animation: flash 0.15s 20;"></ha-icon>
            </div>
          </body>
        </foreignObject>
        `;
    }
  }

  _handleAnimationEvent(argEvent, argThis) {
    argEvent.stopPropagation();
    argEvent.preventDefault();

    argThis.iconSvg = this._card.shadowRoot.getElementById('icon-'.concat(this.toolId))?.shadowRoot?.querySelectorAll('*')[0]?.path;
    if (argThis.iconSvg) {
      argThis._card.requestUpdate();
    }
  }

  // eslint-disable-next-line no-unused-vars
  firstUpdated(changedProperties) {

  }

  /** *****************************************************************************
  * EntityIconTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  * NTS:
  * Adding        <style> div { overflow: hidden;}</style>
  * to the <g group, clips the icon against the ha-card, ie the div.
  * however, on Safari, all icons are clipped, as if they don't fit the room given to be displayed.
  * a bug in rendering the Icon?? Only first time icon is clipped, then displayed normally if a data update
  * from hass is coming in.
  */

  render() {
    return svg`
      <g "" id="icongrp-${this.toolId}" class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)} >

        ${this._renderIcon()}
      </g>
    `;
  }
} // END of class

/** ****************************************************************************
  * EntityNameTool class
  *
  * Summary.
  *
  */

class EntityNameTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_NAME_CONFIG = {
      classes: {
        tool: {
          'sak-name': true,
          hover: true,
        },
        name: {
          'sak-name__name': true,
        },
      },
      styles: {
        tool: {
        },
        name: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_NAME_CONFIG, argConfig), argPos);

    this._name = {};
    // Init classes
    this.classes.tool = {};
    this.classes.name = {};

    // Init styles
    this.styles.tool = {};
    this.styles.name = {};
    if (this.dev.debug) console.log('EntityName constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  /** *****************************************************************************
  * EntityNameTool::_buildName()
  *
  * Summary.
  * Builds the Name string.
  *
  */

  _buildName(entityState, entityConfig) {
    return (
      this.activeAnimation?.name // Name from animation
      || entityConfig.name
      || entityState.attributes.friendly_name
    );
  }

  /** *****************************************************************************
  * EntityNameTool::_renderEntityName()
  *
  * Summary.
  * Renders the entity name using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the name
  *
  */

  _renderEntityName() {
    this.MergeAnimationClassIfChanged();
    this.MergeColorFromState(this.styles.name);
    this.MergeAnimationStyleIfChanged();

    const name = this.textEllipsis(
      this._buildName(
        this._card.entities[this.defaultEntityIndex()],
        this._card.config.entities[this.defaultEntityIndex()],
      ),
      this.config?.show?.ellipsis,
    );

    return svg`
        <text>
          <tspan class="${classMap(this.classes.name)}" x="${this.svg.cx}" y="${this.svg.cy}" style="${styleMap(this.styles.name)}">${name}</tspan>
        </text>
      `;
  }

  /** *****************************************************************************
  * EntityNameTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <g id="name-${this.toolId}"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderEntityName()}
      </g>
    `;
  }
} // END of class

var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var MS_PER_SECOND = 1e3;
var SECS_PER_MIN = 60;
var SECS_PER_HOUR = SECS_PER_MIN * 60;
var SECS_PER_DAY = SECS_PER_HOUR * 24;
var SECS_PER_WEEK = SECS_PER_DAY * 7;
function selectUnit(from, to, thresholds) {
    if (to === void 0) { to = Date.now(); }
    if (thresholds === void 0) { thresholds = {}; }
    var resolvedThresholds = __assign(__assign({}, DEFAULT_THRESHOLDS), (thresholds || {}));
    var secs = (+from - +to) / MS_PER_SECOND;
    if (Math.abs(secs) < resolvedThresholds.second) {
        return {
            value: Math.round(secs),
            unit: 'second',
        };
    }
    var mins = secs / SECS_PER_MIN;
    if (Math.abs(mins) < resolvedThresholds.minute) {
        return {
            value: Math.round(mins),
            unit: 'minute',
        };
    }
    var hours = secs / SECS_PER_HOUR;
    if (Math.abs(hours) < resolvedThresholds.hour) {
        return {
            value: Math.round(hours),
            unit: 'hour',
        };
    }
    var days = secs / SECS_PER_DAY;
    if (Math.abs(days) < resolvedThresholds.day) {
        return {
            value: Math.round(days),
            unit: 'day',
        };
    }
    var fromDate = new Date(from);
    var toDate = new Date(to);
    var years = fromDate.getFullYear() - toDate.getFullYear();
    if (Math.round(Math.abs(years)) > 0) {
        return {
            value: Math.round(years),
            unit: 'year',
        };
    }
    var months = years * 12 + fromDate.getMonth() - toDate.getMonth();
    if (Math.round(Math.abs(months)) > 0) {
        return {
            value: Math.round(months),
            unit: 'month',
        };
    }
    var weeks = secs / SECS_PER_WEEK;
    return {
        value: Math.round(weeks),
        unit: 'week',
    };
}
var DEFAULT_THRESHOLDS = {
    second: 45,
    minute: 45,
    hour: 22,
    day: 5,
};

/* eslint-disable no-use-before-define */
// import { NumberFormat } from '../../data/translation';

var NumberFormat;
// eslint-disable-next-line func-names
(function (NumberFormat) {
    NumberFormat.language = 'language';
    NumberFormat.system = 'system';
    NumberFormat.comma_decimal = 'comma_decimal';
    NumberFormat.decimal_comma = 'decimal_comma';
    NumberFormat.space_comma = 'space_comma';
    NumberFormat.none = 'none';
}(NumberFormat = NumberFormat || (NumberFormat = {})));

const round = (value, precision = 2) => Math.round(value * 10 ** precision) / 10 ** precision;

const numberFormatToLocale = (localeOptions) => {
  switch (localeOptions.number_format) {
    case NumberFormat.comma_decimal:
      return ['en-US', 'en']; // Use United States with fallback to English formatting 1,234,567.89
    case NumberFormat.decimal_comma:
      return ['de', 'es', 'it']; // Use German with fallback to Spanish then Italian formatting 1.234.567,89
    case NumberFormat.space_comma:
      return ['fr', 'sv', 'cs']; // Use French with fallback to Swedish and Czech formatting 1 234 567,89
    case NumberFormat.system:
      return undefined;
    default:
      return localeOptions.language;
  }
};

/**
 * Formats a number based on the user's preference with thousands separator(s) and decimal character for better legibility.
 *
 * @param num The number to format
 * @param localeOptions The user-selected language and formatting, from `hass.locale`
 * @param options Intl.NumberFormatOptions to use
 */
const formatNumber = (num, localeOptions, options) => {
  const locale = localeOptions ? numberFormatToLocale(localeOptions) : undefined;

  // Polyfill for Number.isNaN, which is more reliable than the global isNaN()
  Number.isNaN = Number.isNaN
    || function isNaN(input) {
      return typeof input === 'number' && isNaN(input);
    };

  if (
    localeOptions?.number_format !== NumberFormat.none
    && !Number.isNaN(Number(num))
    && Intl
  ) {
    try {
      return new Intl.NumberFormat(
        locale,
        getDefaultFormatOptions(num, options),
      ).format(Number(num));
    } catch (err) {
      // Don't fail when using "TEST" language
      // eslint-disable-next-line no-console
      console.error(err);
      return new Intl.NumberFormat(
        undefined,
        getDefaultFormatOptions(num, options),
      ).format(Number(num));
    }
  }

  if (
    !Number.isNaN(Number(num))
    && num !== ''
    && localeOptions?.number_format === NumberFormat.none
    && Intl
  ) {
    // If NumberFormat is none, use en-US format without grouping.
    return new Intl.NumberFormat(
      'en-US',
      getDefaultFormatOptions(num, {
        ...options,
        useGrouping: false,
      }),
    ).format(Number(num));
  }

  if (typeof num === 'string') {
    return num;
  }
  return `${round(num, options?.maximumFractionDigits).toString()}${
    options?.style === 'currency' ? ` ${options.currency}` : ''
  }`;
};

/**
 * Generates default options for Intl.NumberFormat
 * @param num The number to be formatted
 * @param options The Intl.NumberFormatOptions that should be included in the returned options
 */
const getDefaultFormatOptions = (num, options) => {
  const defaultOptions = {
    maximumFractionDigits: 2,
    ...options,
  };

  if (typeof num !== 'string') {
    return defaultOptions;
  }

  // Keep decimal trailing zeros if they are present in a string numeric value
  if (
    !options
    || (options.minimumFractionDigits === undefined
      && options.maximumFractionDigits === undefined)
  ) {
    const digits = num.indexOf('.') > -1 ? num.split('.')[1].length : 0;
    defaultOptions.minimumFractionDigits = digits;
    defaultOptions.maximumFractionDigits = digits;
  }

  return defaultOptions;
};

var safeIsNaN = Number.isNaN ||
    function ponyfill(value) {
        return typeof value === 'number' && value !== value;
    };
function isEqual(first, second) {
    if (first === second) {
        return true;
    }
    if (safeIsNaN(first) && safeIsNaN(second)) {
        return true;
    }
    return false;
}
function areInputsEqual(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
        return false;
    }
    for (var i = 0; i < newInputs.length; i++) {
        if (!isEqual(newInputs[i], lastInputs[i])) {
            return false;
        }
    }
    return true;
}

function memoizeOne(resultFn, isEqual) {
    if (isEqual === void 0) { isEqual = areInputsEqual; }
    var cache = null;
    function memoized() {
        var newArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            newArgs[_i] = arguments[_i];
        }
        if (cache && cache.lastThis === this && isEqual(newArgs, cache.lastArgs)) {
            return cache.lastResult;
        }
        var lastResult = resultFn.apply(this, newArgs);
        cache = {
            lastResult: lastResult,
            lastArgs: newArgs,
            lastThis: this,
        };
        return lastResult;
    }
    memoized.clear = function clear() {
        cache = null;
    };
    return memoized;
}

/* eslint-disable no-use-before-define */

// import '../../resources/intl-polyfill';

// Tuesday, August 10
const formatDateWeekdayDay = (dateObj, locale) => formatDateWeekdayDayMem(locale).format(dateObj);

const formatDateWeekdayDayMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }),
);

// August 10, 2021
const formatDate = (dateObj, locale) => formatDateMem(locale).format(dateObj);

const formatDateMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
);

// 10/08/2021
const formatDateNumeric = (dateObj, locale) => formatDateNumericMem(locale).format(dateObj);

const formatDateNumericMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }),
);

// Aug 10
const formatDateShort = (dateObj, locale) => formatDateShortMem(locale).format(dateObj);

const formatDateShortMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      day: 'numeric',
      month: 'short',
    }),
);

// August 2021
const formatDateMonthYear = (dateObj, locale) => formatDateMonthYearMem(locale).format(dateObj);

const formatDateMonthYearMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      month: 'long',
      year: 'numeric',
    }),
);

// August
const formatDateMonth = (dateObj, locale) => formatDateMonthMem(locale).format(dateObj);

const formatDateMonthMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      month: 'long',
    }),
);

memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      year: 'numeric',
    }),
);

// Monday
const formatDateWeekday = (dateObj, locale) => formatDateWeekdayMem(locale).format(dateObj);

const formatDateWeekdayMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      weekday: 'long',
    }),
);

// mo
const formatDateWeekdayShort = (dateObj, locale) => formatDateWeekdayShortMem(locale).format(dateObj);

const formatDateWeekdayShortMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      weekday: 'short',
    }),
);

// import { TimeFormat } from '../../data/translation';

var TimeFormat;
// eslint-disable-next-line func-names
(function (TimeFormat) {
    TimeFormat.language = 'language';
    TimeFormat.system = 'system';
    TimeFormat.am_pm = '12';
    TimeFormat.twenty_four = '24';
}(TimeFormat = TimeFormat || (TimeFormat = {})));

// eslint-disable-next-line import/prefer-default-export
const useAmPm = memoizeOne((locale) => {
  if (
    locale.time_format === TimeFormat.language
    || locale.time_format === TimeFormat.system
  ) {
    const testLanguage = locale.time_format === TimeFormat.language ? locale.language : undefined;
    const test = new Date().toLocaleString(testLanguage);
    return test.includes('AM') || test.includes('PM');
  }

  return locale.time_format === TimeFormat.am_pm;
});

/* eslint-disable no-use-before-define */

// 9:15 PM || 21:15
const formatTime = (dateObj, locale) => formatTimeMem(locale).format(dateObj);

const formatTimeMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        hour: 'numeric',
        minute: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

// 9:15:24 PM || 21:15:24
const formatTimeWithSeconds = (dateObj, locale) => formatTimeWithSecondsMem(locale).format(dateObj);

const formatTimeWithSecondsMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        hour: useAmPm(locale) ? 'numeric' : '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

// Tuesday 7:00 PM || Tuesday 19:00
const formatTimeWeekday = (dateObj, locale) => formatTimeWeekdayMem(locale).format(dateObj);

const formatTimeWeekdayMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        weekday: 'long',
        hour: useAmPm(locale) ? 'numeric' : '2-digit',
        minute: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

// 21:15
const formatTime24h = (dateObj) => formatTime24hMem().format(dateObj);

const formatTime24hMem = memoizeOne(
  () =>
    // en-GB to fix Chrome 24:59 to 0:59 https://stackoverflow.com/a/60898146
    // eslint-disable-next-line implicit-arrow-linebreak
    new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    }),
);

/* eslint-disable no-use-before-define */

// August 9, 2021, 8:23 AM
const formatDateTime = (dateObj, locale) => formatDateTimeMem(locale).format(dateObj);

const formatDateTimeMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: useAmPm(locale) ? 'numeric' : '2-digit',
        minute: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

// Aug 9, 2021, 8:23 AM
const formatShortDateTimeWithYear = (dateObj, locale) => formatShortDateTimeWithYearMem(locale).format(dateObj);

const formatShortDateTimeWithYearMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: useAmPm(locale) ? 'numeric' : '2-digit',
        minute: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

// Aug 9, 8:23 AM
const formatShortDateTime = (dateObj, locale) => formatShortDateTimeMem(locale).format(dateObj);

const formatShortDateTimeMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        month: 'short',
        day: 'numeric',
        hour: useAmPm(locale) ? 'numeric' : '2-digit',
        minute: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

// August 9, 2021, 8:23:15 AM
const formatDateTimeWithSeconds = (dateObj, locale) => formatDateTimeWithSecondsMem(locale).format(dateObj);

const formatDateTimeWithSecondsMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: useAmPm(locale) ? 'numeric' : '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

// 9/8/2021, 8:23 AM
const formatDateTimeNumeric = (dateObj, locale) => formatDateTimeNumericMem(locale).format(dateObj);

const formatDateTimeNumericMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

const leftPad = (num, digits = 2) => {
  let paddedNum = `${num}`;
  for (let i = 1; i < digits; i++) {
    // eslint-disable-next-line radix
    paddedNum = parseInt(paddedNum) < 10 ** i ? `0${paddedNum}` : paddedNum;
  }
  return paddedNum;
};

function millisecondsToDuration(d) {
  const h = Math.floor(d / 1000 / 3600);
  const m = Math.floor(((d / 1000) % 3600) / 60);
  const s = Math.floor(((d / 1000) % 3600) % 60);
  const ms = Math.floor(d % 1000);

  if (h > 0) {
    return `${h}:${leftPad(m)}:${leftPad(s)}`;
  }
  if (m > 0) {
    return `${m}:${leftPad(s)}`;
  }
  if (s > 0 || ms > 0) {
    return `${s}${ms > 0 ? `.${leftPad(ms, 3)}` : ''}`;
  }
  return null;
}

const DAY_IN_MILLISECONDS = 86400000;
const HOUR_IN_MILLISECONDS = 3600000;
const MINUTE_IN_MILLISECONDS = 60000;
const SECOND_IN_MILLISECONDS = 1000;

const UNIT_TO_MILLISECOND_CONVERT = {
  ms: 1,
  s: SECOND_IN_MILLISECONDS,
  min: MINUTE_IN_MILLISECONDS,
  h: HOUR_IN_MILLISECONDS,
  d: DAY_IN_MILLISECONDS,
};

const formatDuration = (duration, units) => millisecondsToDuration(
    parseFloat(duration) * UNIT_TO_MILLISECOND_CONVERT[units],
  ) || '0';

/** ****************************************************************************
  * EntityStateTool class
  *
  * Summary.
  *
  */

class EntityStateTool extends BaseTool {
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
         'time', 'time-24h', 'time_weekday', 'time_seconds'].includes(entityConfig.format)) {
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
        case 'time_weekday':
          retValue = formatTimeWeekday(timestamp, locale);
          break;
        case 'time_seconds':
          retValue = formatTimeWithSeconds(timestamp, locale);
          break;
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
        || (entity?.attributes?.device_class
            && this._card._hass.localize(
            `component.${domain}.entity_component.${entity.attributes.device_class}.state.${inState}`,
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
    {
      return svg`
    <svg overflow="visible" id="state-${this.toolId}"
      class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}">
        <text @click=${(e) => this.handleTapEvent(e, this.config)}>
          ${this._renderState()}
          ${this._renderUom()}
        </text>
      </svg>
      `;
    }
  } // render()
}

const X = 0;
const Y = 1;
const V = 2;
const Y2 = 3;
const RX = 4;
const RY = 5;
const ONE_HOUR = 1000 * 3600;

class SparklineGraph {
  constructor(width, height, margin, startOn, hours = 24, points = 1, aggregateFuncName = 'avg',
              groupBy = 'interval', smoothing = true, logarithmic = false,
              trafficLights = [], buckets = [], stateMap = [], config = {}) {
    this.aggregateFuncMap = {
      avg: this._average,
      median: this._median,
      max: this._maximum,
      min: this._minimum,
      first: this._first,
      last: this._last,
      sum: this._sum,
      delta: this._delta,
      diff: this._diff,
    };

    this.startOn = startOn;
    this.config = config;
    // Just trying to make sense for the graph drawing area
    //
    // @2023.07.02
    // What if there is a margin top/bottom and margin left/right. Then we would be able to create
    // anything that needs some offset for the actual drawing of the graph.
    // The only graph type that is relevant is the line/area graph.
    // - the area below the line goes to the bottom of the graph
    // - the line itself only upto the draw area of the graph, leaving space for the area fill
    // - See examples in Pinterest...
    //
    this.graphArea = {};
    this.graphArea.x = 0;
    this.graphArea.y = 0;
    this.graphArea.width = width - (2 * this.graphArea.x);
    this.graphArea.height = height - (2 * this.graphArea.y);

    this.drawArea = {};
    this.drawArea.x = margin.l;
    this.drawArea.y = margin.t;
    this.drawArea.top = margin.t;
    this.drawArea.bottom = margin.b;
    this.drawArea.width = width - (margin.l + margin.r);
    this.drawArea.height = height - (margin.t + margin.b);

    this._history = undefined;
    this.coords = [];
    this.width = width;
    this.height = height;
    this.margin = margin;
    // Testing
    this._max = 0;
    this._min = 0;
    this.points = points;
    this.hours = hours;
    this.aggregateFuncName = aggregateFuncName;
    this._calcPoint = this.aggregateFuncMap[aggregateFuncName] || this._average;
    this._smoothing = smoothing;
    this._logarithmic = logarithmic;
    this._groupBy = groupBy;
    this._endTime = 0;
    this.valuesPerBucket = 0;
    this.levelCount = 1;
    this.trafficLights = trafficLights;
    this.bucketss = buckets;
    this.stateMap = [...stateMap];
    this.clockWidth = Utils.calculateSvgDimension(this.config?.clock?.size || 5);
  }

  get max() { return this._max; }

  set max(max) { this._max = max; }

  get min() { return this._min; }

  set min(min) { this._min = min; }

  set history(data) { this._history = data; }

  update(history = undefined) {
    if (history) {
      this._history = history;
    }
    if (!this._history) return;
    if (this.history?.length === 0) return;

    this._updateEndTime();

    const histGroups = this._history.reduce((res, item) => this._reducer(res, item), []);

    // drop potential out of bound entry's except one
    if (histGroups[0] && histGroups[0].length) {
      histGroups[0] = [histGroups[0][histGroups[0].length - 1]];
    }

    // extend length to fill missing history.
    let requiredNumOfPoints;
    let date = new Date();
    date.getDate();
    // for now it is ok...
    if (this.startOn === 'today') {
      let hours = date.getHours() + date.getMinutes() / 60;
      requiredNumOfPoints = Math.ceil(hours * this.points);
    } else {
      requiredNumOfPoints = Math.ceil(this.hours * this.points);
    }
    histGroups.length = requiredNumOfPoints;

    if (this.startOn === 'yesterday') {
      console.log('update, yesterday, history = ', this.history, histGroups);
    }
    this.coords = this._calcPoints(histGroups);
    this.min = Math.min(...this.coords.map((item) => Number(item[V])));
    this.max = Math.max(...this.coords.map((item) => Number(item[V])));

    if ((this.config.show.graph === 'line') && (this.config.line?.show_minmax === true)) {
      // Just testing...
      // https://stackoverflow.com/questions/43576241/using-reduce-to-find-min-and-max-values
      const histGroupsMinMax = this._history.reduce((res, item) => this._reducerMinMax(res, item), []);

      // drop potential out of bound entry's except one
      if (histGroupsMinMax[0][0] && histGroupsMinMax[0][0].length) {
        histGroupsMinMax[0][0] = [histGroupsMinMax[0][0][histGroupsMinMax[0][0].length - 1]];
      }
      if (histGroupsMinMax[1][0] && histGroupsMinMax[1][0].length) {
        histGroupsMinMax[1][0] = [histGroupsMinMax[1][0][histGroupsMinMax[1][0].length - 1]];
      }

      // extend length to fill missing history
      // const requiredNumOfPoints = Math.ceil(this.hours * this.points);
      histGroupsMinMax[0].length = requiredNumOfPoints;
      histGroupsMinMax[1].length = requiredNumOfPoints;

      const histGroupsMin = [...histGroups];
      const histGroupsMax = [...histGroups];

      let prevFunction = this._calcPoint;
      this._calcPoint = this.aggregateFuncMap.min;
      this.coordsMin = [];
      this.coordsMin = this._calcPoints(histGroupsMin);
      this._calcPoint = this.aggregateFuncMap.max;
      this.coordsMax = [];
      this.coordsMax = this._calcPoints(histGroupsMax);
      this._calcPoint = prevFunction;

      // Adjust scale in this case...
      this.min = Math.min(...this.coordsMin.map((item) => Number(item[V])));
      this.max = Math.max(...this.coordsMax.map((item) => Number(item[V])));
    }
  }

  // This reducer calculates the min and max in a bucket. This is the REAL min and max
  // The other functions calculate the min and max from the function used (mostly avg)!!
  // This real min/max could be used to show the min/max graph on the background. Some filled
  // graph would be nice. That would mean we calculate each point (per bucket) and connect the
  // first point of the min/max array, and the last point of the min/max array.
  //
  // Array should be changed to [0][key], so we can pass the res[0] to some function to calculate
  // the resulting points. Must in that case also pass the function, ie max or min. Not the default
  // function, as that would give us (again) possible the avg...
  //
  // It could run with a single reducer, if using [0] for the buckets to calculate the function
  // and [1] for min, and [2] for max value in that bucket...

  _reducerMinMax(res, item) {
    const age = this._endTime - new Date(item.last_changed).getTime();
    const interval = (age / ONE_HOUR * this.points) - this.hours * this.points;
    const key = interval < 0 ? Math.floor(Math.abs(interval)) : 0;
    if (!res[0]) res[0] = [];
    if (!res[1]) res[1] = [];
    if (!res[0][key]) { res[0][key] = {}; res[1][key] = {}; }
    // Min value is always 0. So something goes wrong with Number I guess??
    // If item.state invalid, then returns 0 ???
    res[0][key].state = Math.min(res[0][key].state ? res[0][key].state : Number.POSITIVE_INFINITY, item.state);
    // Max seems to be OK!
    res[1][key].state = Math.max(res[1][key].state ? res[0][key].state : Number.NEGATIVE_INFINITY, item.state);
    return res;
  }

  _reducer(res, item) {
    const age = this._endTime - new Date(item.last_changed).getTime();
    const interval = (age / ONE_HOUR * this.points) - this.hours * this.points;
    const key = interval < 0 ? Math.floor(Math.abs(interval)) : 0;
    if (!res[key]) res[key] = [];
    res[key].push(item);
    return res;
  }

  _calcPoints(history) {
    const coords = [];
    let xRatio = this.drawArea.width / (this.hours * this.points - 1);
    xRatio = Number.isFinite(xRatio) ? xRatio : this.drawArea.width;

    const first = history.filter(Boolean)[0];
    let last = [this._calcPoint(first), this._lastValue(first)];
    const getCoords = (item, i) => {
      const x = (xRatio * i) + this.drawArea.x;
      if (item)
        last = [this._calcPoint(item), this._lastValue(item)];
      return coords.push([x, 0, item ? last[0] : last[1]]);
    };

    for (let i = 0; i < history.length; i += 1)
      getCoords(history[i], i);

    return coords;
  }

  _calcY(coords) {
    // account for logarithmic graph
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;

    const yRatio = ((max - min) / (this.drawArea.height)) || 1;
    const coords2 = coords.map((coord) => {
      const val = this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V];

      const offset = (min < 0) ? Math.abs(min) : 0;
      const val0 = (val > 0)
        ? (val - Math.max(0, min))
        : 0;

      this.drawArea.height + this.drawArea.y - val0 / yRatio;

      const coordY2 = (val > 0)
        ? this.drawArea.height + this.drawArea.y * 1 - (offset / yRatio) - ((val - Math.max(0, min)) / yRatio) // - this.margin.y * 2
        : this.drawArea.height + this.drawArea.y * 1 - ((0 - min) / yRatio);// - this.margin.y * 4;
      const coordY = this.drawArea.height + this.drawArea.y * 1 - ((val - (min)) / yRatio); // - this.margin.y * 2;

      return [coord[X], coordY, coord[V], coordY2];
    });
    return coords2;
  }

  _calcLevelY(coord) {
    // account for logarithmic graph
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;

    const yRatio = ((max - min) / (this.drawArea.height)) || 1;
    const offset = (min < 0) ? Math.abs(min) : 0;
    let yStack = [];
    // should be reduce or something... to return an array...
    coord[V].forEach((val, index) => {
      const coordY = (val >= 0)
        ? this.drawArea.height + this.drawArea.y * 1 - (1 * offset / yRatio) - ((val - Math.max(0, min)) / yRatio) // - this.margin.y * 2
        : this.drawArea.height + this.drawArea.y * 1 - ((0 - val) / yRatio);
      yStack.push(coordY);
      return yStack;
    });
    return yStack;
  }

  getPoints() {
    let { coords } = this;
    if (coords.length === 1) {
      coords[1] = [this.width + this.margin.x, 0, coords[0][V]];
    }
    coords = this._calcY(this.coords);
    let next; let Z;
    let last = coords[0];
    coords.shift();
    const coords2 = coords.map((point, i) => {
      next = point;
      Z = this._smoothing ? this._midPoint(last[X], last[Y], next[X], next[Y]) : next;
      const sum = this._smoothing ? (next[V] + last[V]) / 2 : next[V];
      last = next;
      return [Z[X], Z[Y], sum, i + 1];
    });
    return coords2;
  }

  getPath() {
    let { coords } = this;
    if (coords.length === 1) {
      coords[1] = [this.width + this.margin.x, 0, coords[0][V]];
    }
    coords = this._calcY(this.coords);
    let next; let Z;
    let path = '';
    let last = coords[0];
    path += `M${last[X]},${last[Y]}`;

    coords.forEach((point) => {
      next = point;
      Z = this._smoothing ? this._midPoint(last[X], last[Y], next[X], next[Y]) : next;
      path += ` ${Z[X]},${Z[Y]}`;
      path += ` Q ${next[X]},${next[Y]}`;
      last = next;
    });
    path += ` ${next[X]},${next[Y]}`;
    return path;
  }

  getPathMin() {
    let { coordsMin } = this;
    if (coordsMin.length === 1) {
      coordsMin[1] = [this.width + this.margin.x, 0, coordsMin[0][V]];
    }
    coordsMin = this._calcY(this.coordsMin);
    let next; let Z;
    let path = '';
    let last = coordsMin[0];
    path += `M${last[X]},${last[Y]}`;

    coordsMin.forEach((point) => {
      next = point;
      Z = next;
      path += ` ${Z[X]},${Z[Y]}`;
      path += ` Q ${next[X]},${next[Y]}`;
      last = next;
    });
    path += ` ${next[X]},${next[Y]}`;
    return path;
  }

  // Get this in reverse...
  getPathMax() {
    let { coordsMax } = this;
    if (coordsMax.length === 1) {
      coordsMax[1] = [this.width + this.margin.x, 0, coordsMax[0][V]];
    }
    coordsMax = this._calcY(this.coordsMax);
    let next; let Z;
    let path = '';
    // let last = coordsMax[0];
    let last = coordsMax[coordsMax.length - 1];
    // path += `M${last[X]},${last[Y]}`;

    coordsMax.reverse().forEach((point, index, points) => {
      next = point;
      Z = next;
      path += ` ${Z[X]},${Z[Y]}`;
      path += ` Q ${next[X]},${next[Y]}`;
      last = next;
    });
    path += ` ${next[X]},${next[Y]}`;
    path += `M${last[X]},${last[Y]}`;
    return path;
  }

  computeGradient(thresholds, logarithmic) {
    const scale = logarithmic
      ? Math.log10(Math.max(1, this._max)) - Math.log10(Math.max(1, this._min))
      : this._max - this._min;

    return thresholds.map((stop, index, arr) => {
      let color;
      if (stop.value > this._max && arr[index + 1]) {
        const factor = (this._max - arr[index + 1].value) / (stop.value - arr[index + 1].value);
        // color = interpolateColor(arr[index + 1].color, stop.color, factor);
        color = Colors.getGradientValue(arr[index + 1].color, stop.color, factor);
      } else if (stop.value < this._min && arr[index - 1]) {
        const factor = (arr[index - 1].value - this._min) / (arr[index - 1].value - stop.value);
        color = Colors.getGradientValue(arr[index - 1].color, stop.color, factor);
        // color = interpolateColor(arr[index - 1].color, stop.color, factor);
      }
      let offset;
      if (scale <= 0) {
        offset = 0;
      } else if (logarithmic) {
        offset = (Math.log10(Math.max(1, this._max))
          - Math.log10(Math.max(1, stop.value)))
          * (100 / scale);
      } else {
        offset = (this._max - stop.value) * (100 / scale);
      }
      return {
        color: color || stop.color,
        offset,
      };
    });
  }

  // #TODO. Is not right...
  // Weird stuff...
  getFillMinMax(pathMin, pathMax) {
    let fill = pathMin;
    fill += ` L ${this.coordsMax[this.coordsMax.length - 1][X]},
                ${this.coordsMax[this.coordsMax.length - 1][Y]}`;
    fill += pathMax;
    fill += ' z';
    return fill;
  }

  getFill(path) {
    const y_zero = (this._min >= 0) ? this.height
    : this.height + 0 - ((Math.abs(this._min) / ((this._max - this._min)) * this.height));
    const height = y_zero + this.drawArea.y * 1.5; // Should be this.svg.line_width;
    let fill = path;
    // fill += ` L ${this.drawArea.width + this.drawArea.x}, ${height}`;
    // fill += ` L ${this.coords[0][X]}, ${height} z`;
    fill += ` L ${this.coords[this.coords.length - 1][X] + this.drawArea.x}, ${height}`;
    fill += ` L ${this.coords[0][X]}, ${height} z`;
    return fill;
  }

  polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radiusX * Math.cos(angleInRadians)),
      y: centerY + (radiusY * Math.sin(angleInRadians)),
    };
  }

  _calcClockCoords(argStartAngle, argEndAngle, argClockwise, argRadiusX, argRadiusY, argWidth) {
    const cx = this.drawArea.x + this.drawArea.width / 2;
    const cy = this.drawArea.y + this.drawArea.height / 2;
    const start = this.polarToCartesian(cx, cy, argRadiusX, argRadiusY, argEndAngle);
    const end = this.polarToCartesian(cx, cy, argRadiusX, argRadiusY, argStartAngle);
    const largeArcFlag = Math.abs(argEndAngle - argStartAngle) <= 180 ? '0' : '1';

    const sweepFlag = argClockwise ? '0' : '1';

    const cutoutRadiusX = argRadiusX - argWidth;
    const cutoutRadiusY = argRadiusY - argWidth;
    const start2 = this.polarToCartesian(cx, cy, cutoutRadiusX, cutoutRadiusY, argEndAngle);
    const end2 = this.polarToCartesian(cx, cy, cutoutRadiusX, cutoutRadiusY, argStartAngle);
    return {
      start, end, start2, end2, largeArcFlag, sweepFlag,
    };
  }

  _calcClock(coords) {
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;
    const segments = this.hours * this.points;
    const angleSize = 360 / segments;
    const startAngle = 0;
    let runningAngle = startAngle;
    const clockWise = true;
    const wRatio = ((max - min) / this.clockWidth);

    const coords2 = coords.map((coord) => {
      let ringWidth;
      let radius;
      if (this.config.show?.variant === 'sunburst') {
        ringWidth = ((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / wRatio;
        radius = this.drawArea.width / 2 - this.clockWidth + ringWidth;
      } else {
        ringWidth = this.clockWidth;
        radius = this.drawArea.width / 2;
      }
      let newX = [];
      let newY = [];
      let radiusX = [];
      let radiusY = [];
      const {
        start, end, start2, end2, largeArcFlag, sweepFlag,
      } = this._calcClockCoords(
        runningAngle, runningAngle + angleSize, clockWise,
        radius, radius, ringWidth);
      runningAngle += angleSize;
      newX.push(start.x, end.x, start2.x, end2.x);
      newY.push(start.y, end.y, start2.y, end2.y);
      radiusX.push(this.drawArea.width / 2, this.drawArea.width / 2 - this.clockWidth);
      radiusY.push(this.drawArea.height / 2, this.drawArea.height / 2 - this.clockWidth);
      return [newX, newY, coord[V], 0, radiusX, radiusY, largeArcFlag, sweepFlag];
    });
    return coords2;
  }

  getClock(position, total, spacing = 4) {
    const clockCoords = this._calcClock(this.coords);

    return clockCoords.map((coord, i) => ({
      start: { x: coord[X][0], y: coord[Y][0] },
      end: { x: coord[X][1], y: coord[Y][1] },
      start2: { x: coord[X][2], y: coord[Y][2] },
      end2: { x: coord[X][3], y: coord[Y][3] },
      radius: { x: coord[RX][0], y: coord[RY][0] },
      radius2: { x: coord[RX][1], y: coord[RY][1] },
      largeArcFlag: coord[6],
      sweepFlag: coord[7],
      value: coord[V],
    }));
  }

  getClockPaths() {
    const clockPaths = this.clock.map((segment, index) => {
      const d = [
        'M', segment.start.x, segment.start.y,
        'A', segment.radius.x, segment.radius.y, 0, segment.largeArcFlag, segment.sweepFlag, segment.end.x, segment.end.y,
        'L', segment.end2.x, segment.end2.y,
        'A', segment.radius2.x, segment.radius2.y, 0, segment.largeArcFlag, segment.sweepFlag === '0' ? '1' : '0', segment.start2.x, segment.start2.y,
        'Z',
      ].join(' ');
      return d;
    });
    return clockPaths;
  }

  getTimeline(position, total, spacing = 4) {
    const max = this._logarithmic ? Math.log10(Math.max(1, this.max)) : this.max;
    const min = this._logarithmic ? Math.log10(Math.max(1, this.min)) : this.min;

    const coords = this.coords;
    const xRatio = ((this.drawArea.width + spacing) / Math.ceil(this.hours * this.points)) / total;
    const yRatio = ((max - min) / this.drawArea.height) || 1;

    (this.drawArea.height - (this.bucketss.length * 0)) / this.bucketss.length;

    if (this.config.show.variant === 'audio') {
      return coords.map((coord, i) => ({
        x: (xRatio * i * total) + (xRatio * position) + this.drawArea.x,
        y: this.drawArea.height / 2 - (((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / yRatio / 2), // * bucketHeight / 2), // 0,
        height: ((this._logarithmic ? Math.log10(Math.max(1, coord[V])) : coord[V]) - min) / yRatio, // * bucketHeight,
        width: xRatio - spacing,
        value: coord[V],
      }));
    } else {
      return coords.map((coord, i) => ({
        x: (xRatio * i * total) + (xRatio * position) + this.drawArea.x,
        y: 0,
        height: this.drawArea.height,
        width: xRatio - spacing,
        value: coord[V],
      }));
    }
  }

  // Get array of levels. Just levels which draw a little bar at each level once reached
  getEqualizer(position, total, spacing = 4) {
    const xRatio = ((this.drawArea.width + spacing) / Math.ceil(this.hours * this.points)) / total;
    const yRatio = ((this._max - this._min) / this.drawArea.height) || 1;
    this._min < 0 ? (Math.abs(this._min)) / yRatio : 0;

    // Calculate height of each level rectangle
    // we have drawarea.height. We have steprange and spacing.
    // height / steprange = max height rectangle. Minus spacing = height??
    const levelHeight = (this.drawArea.height - (this.levelCount * spacing)) / this.levelCount;

    let stepRange;
    let equalizerCoords = this.coords.map((coord, i) => {
      let newCoord = [];
      const stepMax = Math.trunc(coord[V] / this.valuesPerBucket);
      const stepMin = Math.trunc(this._min / this.valuesPerBucket);
      stepRange = (stepMax - stepMin);

      newCoord[X] = coord[X];
      newCoord[Y] = [];
      newCoord[V] = [];
      for (let i = 0; i < stepRange; i++) {
        newCoord[V][i] = this._min + (i * this.valuesPerBucket);
      }
      newCoord[Y] = this._calcLevelY(newCoord);
      return newCoord;
    });
    return equalizerCoords.map((coord, i) => ({
      x: (xRatio * i * total) + (xRatio * position) + this.drawArea.x, // Remove start spacing + spacing,
      y: coord[Y],
      height: levelHeight, // 1 * (stepRange + 1) / yRatio, // 10, // (yRatio - spacing) / this.levels, // (this.max - this.min) / this.levelCount / yRatio, // coord[V] > 0 ? (this._min < 0 ? coord[V] / yRatio : (coord[V] - this._min) / yRatio)
                          // : coord[Y] - coord[Y2],
      width: xRatio - spacing,
      // value: levelCoords[V],
      value: coord[V],
    }));
  }

  getTrafficLights(position, total, spacing = 4) {
    const xRatio = ((this.drawArea.width + spacing) / Math.ceil(this.hours * this.points)) / total;
    const bucketHeight = (this.drawArea.height - (this.bucketss.length * spacing)) / this.bucketss.length;

    let stepRange;
    let levelCoords = this.coords.map((coord, i) => {
      let newCoord = [];
      const stepMax = this.bucketss.length;
      const stepMin = 0;
      stepRange = (stepMax - stepMin);

      newCoord[X] = coord[X];
      newCoord[Y] = [];
      newCoord[V] = [];
      // Check for buckets, and ranges min/max...
      // i is the bucket index!
      let matchStep = -1;
      let matchBucket = 0;
      // #TODO
      // Both loops can be in one loop, using else if not (yet) in bucket. There MUST be a bucket
      // Is the assumption... Or leave it this way, and assume there might be NO bucket...
      for (let i = 0; i < stepRange; i++) {
        matchBucket = 0;
        for (let j = 0; j < this.bucketss[i].rangeMin.length; j++) {
          if (coord[V] >= this.bucketss[i].rangeMin[j] && coord[V] < this.bucketss[i].rangeMax[j]) {
            matchBucket = j;
            matchStep = i;
          }
        }
      }

      // We have the matching index
      for (let i = 0; i <= matchStep; i++) {
        newCoord[V][i] = this.bucketss[i].length > matchBucket ? this.bucketss[i].rangeMin[matchBucket] : this.bucketss[i].rangeMin[0];
        newCoord[Y][i] = this.drawArea.height - i * (bucketHeight + spacing);
      }
      return newCoord;
    });
    return levelCoords.map((coord, i) => ({
      x: (xRatio * i * total) + (xRatio * position) + this.drawArea.x, // Remove start spacing + spacing,
      y: coord[Y],
      height: bucketHeight,
      width: xRatio - spacing,
      value: coord[V],
    }));
  }

  getBars(position, total, spacing = 4) {
    const coords = this._calcY(this.coords);
    const xRatio = ((this.drawArea.width + spacing) / Math.ceil(this.hours * this.points)) / total;
    const yRatio = ((this._max - this._min) / this.drawArea.height) || 1;
    this._min < 0 ? (Math.abs(this._min)) / yRatio : 0;

    return coords.map((coord, i) => ({
      x: (xRatio * i * total) + (xRatio * position) + this.drawArea.x, // Remove start spacing + spacing,
      y: this._min > 0 ? coord[Y] : coord[Y2],
      height: coord[V] > 0 ? (this._min < 0 ? coord[V] / yRatio : (coord[V] - this._min) / yRatio)
                           : coord[Y] - coord[Y2],
      width: xRatio - spacing,
      value: coord[V],
    }));
  }

  _midPoint(Ax, Ay, Bx, By) {
    const Zx = (Ax - Bx) / 2 + Bx;
    const Zy = (Ay - By) / 2 + By;
    return [Zx, Zy];
  }

  _average(items) {
    return items.reduce((sum, entry) => (sum + parseFloat(entry.state)), 0) / items.length;
  }

  _median(items) {
    const itemsDup = [...items].sort((a, b) => parseFloat(a) - parseFloat(b));
    const mid = Math.floor((itemsDup.length - 1) / 2);
    if (itemsDup.length % 2 === 1)
      return parseFloat(itemsDup[mid].state);
    return (parseFloat(itemsDup[mid].state) + parseFloat(itemsDup[mid + 1].state)) / 2;
  }

  _maximum(items) {
    return Math.max(...items.map((item) => item.state));
  }

  _minimum(items) {
    return Math.min(...items.map((item) => item.state));
  }

  _first(items) {
    return parseFloat(items[0].state);
  }

  _last(items) {
    return parseFloat(items[items.length - 1].state);
  }

  _sum(items) {
    return items.reduce((sum, entry) => sum + parseFloat(entry.state), 0);
  }

  _delta(items) {
    return this._maximum(items) - this._minimum(items);
  }

  _diff(items) {
    return this._last(items) - this._first(items);
  }

  _lastValue(items) {
    if (['delta', 'diff'].includes(this.aggregateFuncName)) {
      return 0;
    } else {
      return parseFloat(items[items.length - 1].state) || 0;
    }
  }

  _updateEndTime() {
    this._endTime = new Date();
    if (this.startOn === 'yesterday') {
      // #TODO:
      // Should account for hours_to_show. Maybe user wants to show the past 48 hours.
      // Now I assume it is just yesterday, ie hours_to_show === 24
      this._endTime.setHours(0, 0, 0, 0);
    } else {
      switch (this._groupBy) {
        case 'month':
          this._endTime.setMonth(this._endTime.getMonth() + 1);
          this._endTime.setDate(1);
          break;
        case 'date':
          this._endTime.setDate(this._endTime.getDate() + 1);
          this._endTime.setHours(0, 0, 0, 0);
          break;
        case 'hour':
          this._endTime.setHours(this._endTime.getHours() + 1);
          this._endTime.setMinutes(0, 0, 0);
          break;
      }
    }
  }
}

const getTime = (date, extra, locale = 'en-US') => date.toLocaleString(locale, { hour: 'numeric', minute: 'numeric', ...extra });
const getMilli = (hours) => hours * 60 ** 2 * 10 ** 3;
const getFirstDefinedItem = (...collection) => collection.find((item) => typeof item !== 'undefined');
const DEFAULT_COLORS = [
  'var(--accent-color)',
  '#3498db',
  '#e74c3c',
  '#9b59b6',
  '#f1c40f',
  '#2ecc71',
  '#1abc9c',
  '#34495e',
  '#e67e22',
  '#7f8c8d',
  '#27ae60',
  '#2980b9',
  '#8e44ad',
];

/**
 * Starting from the given index, increment the index until an array element with a
 * "value" property is found
 *
 * @param {Array} stops
 * @param {number} startIndex
 * @returns {number}
 */
const findFirstValuedIndex = (stops, startIndex) => {
  for (let i = startIndex, l = stops.length; i < l; i += 1) {
    if (stops[i].value != null) {
      return i;
    }
  }
  throw new Error(
    'Error in threshold interpolation: could not find right-nearest valued stop. '
    + 'Do the first and last thresholds have a set "value"?',
  );
};

/**
 * Interpolates the "value" of each stop. Each stop can be a color string or an object of type
 * ```
 * {
 *   color: string
 *   value?: number | null
 * }
 * ```
 * And the values will be interpolated by the nearest valued stops.
 *
 * For example, given values `[ 0, null, null, 4, null, 3]`,
 * the interpolation will output `[ 0, 1.3333, 2.6667, 4, 3.5, 3 ]`
 *
 * Note that values will be interpolated ascending and descending.
 * All that's necessary is that the first and the last elements have values.
 *
 * @param {Array} stops
 * @returns {Array<{ color: string, value: number }>}
 */
const interpolateStops = (stops) => {
  if (!stops || !stops.length) {
    return stops;
  }
  if (stops[0].value == null || stops[stops.length - 1].value == null) {
    throw new Error('The first and last thresholds must have a set "value".\n See xyz manual');
  }

  let leftValuedIndex = 0;
  let rightValuedIndex = null;

  return stops.map((stop, stopIndex) => {
    if (stop.value != null) {
      leftValuedIndex = stopIndex;
      return { ...stop };
    }

    if (rightValuedIndex == null) {
      rightValuedIndex = findFirstValuedIndex(stops, stopIndex);
    } else if (stopIndex > rightValuedIndex) {
      leftValuedIndex = rightValuedIndex;
      rightValuedIndex = findFirstValuedIndex(stops, stopIndex);
    }

    // y = mx + b
    // m = dY/dX
    // x = index in question
    // b = left value

    const leftValue = stops[leftValuedIndex].value;
    const rightValue = stops[rightValuedIndex].value;
    const m = (rightValue - leftValue) / (rightValuedIndex - leftValuedIndex);
    return {
      color: typeof stop === 'string' ? stop : stop.color,
      value: m * stopIndex + leftValue,
    };
  });
};

const computeThresholds = (stops, type) => {
  const valuedStops = interpolateStops(stops);
  valuedStops.sort((a, b) => b.value - a.value);

  if (type === 'smooth') {
    return valuedStops;
  } else {
    const rect = [].concat(...valuedStops.map((stop, i) => ([stop, {
      value: stop.value - 0.0001,
      color: valuedStops[i + 1] ? valuedStops[i + 1].color : stop.color,
    }])));
    return rect;
  }
};

/** ****************************************************************************
  * SparklineBarChartTool class
  *
  * Summary.
  *
  */
class SparklineGraphTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_GRAPH_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        height: 25,
        width: 25,
        margin: 0.5,
      },
      x_axis: {
        hours_to_show: 24,
        bins_per_hour: 0.5,
        group_by: 'interval',
        start_on: 'interval',
      },
      y_axis: {
        logarithmic: false,
        value_factor: 0,
        aggregate_func: 'avg',
        smoothing: true,
      },
      _hours_to_show: 24,
      _points_per_hour: 0.5,
      _bins_per_hour: 0.5,
      _group_by: 'interval',
      _start_on: 'interval',
      _logarithmic: false,
      _value_factor: 0,
      _aggregate_func: 'avg',
      value_buckets: 10,
      animate: true,
      hour24: false,
      font_size: 10,
      line_color: [...DEFAULT_COLORS],
      color_thresholds: [],
      color_thresholds_transition: 'smooth',
      line_width: 5,
      bar_spacing: 4,
      state_map: [],
      cache: true,
      color: 'var(--primary-color)',
      clock: {
        size: 5,
        line_width: 0,
        face: {
          hour_marks_count: 24,
        },
      },
      classes: {
        tool: {
          'sak-graph': true,
          hover: true,
        },
        bar: {
        },
        line: {
          'sak-graph__line': true,
          hover: true,
        },
        clock_face_day_night: {
          'sak-graph__clock-face_day-night': true,
        },
        clock_face_hour_marks: {
          'sak-graph__clock-face_hour-marks': true,
        },
        clock_face_hour_numbers: {
          'sak-graph__clock-face_hour-numbers': true,
        },
      },
      styles: {
        tool: {
        },
        line: {
        },
        bar: {
        },
        clock_face_day_night: {
        },
        clock_face_hour_marks: {
        },
        clock_face_hour_numbers: {
        },
        area_mask_above: {
          fill: 'url(#sak-graph-area-mask-tb-1)',
        },
        area_mask_below: {
          fill: 'url(#sak-graph-area-mask-bt-1)',
        },
        bar_mask_above: {
          fill: 'url(#sak-graph-bar-mask-tb-80)',
        },
        bar_mask_below: {
          fill: 'url(#sak-graph-bar-mask-bt-80)',
        },
      },
      colorstops: [],
      show: { style: 'fixedcolor' },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_GRAPH_CONFIG, argConfig), argPos);

    this.svg.margin = {};
    if (typeof this.config.position.margin === 'object') {
      this.svg.margin.t = Utils.calculateSvgDimension(this.config.position.margin?.t)
          || Utils.calculateSvgDimension(this.config.position.margin?.y);
      this.svg.margin.b = Utils.calculateSvgDimension(this.config.position.margin?.b)
          || Utils.calculateSvgDimension(this.config.position.margin?.y);
      this.svg.margin.r = Utils.calculateSvgDimension(this.config.position.margin?.r)
          || Utils.calculateSvgDimension(this.config.position.margin?.x);
      this.svg.margin.l = Utils.calculateSvgDimension(this.config.position.margin?.l)
          || Utils.calculateSvgDimension(this.config.position.margin?.x);
      this.svg.margin.x = this.svg.margin.l;
      this.svg.margin.y = this.svg.margin.t;
    } else {
      this.svg.margin.x = Utils.calculateSvgDimension(this.config.position.margin);
      this.svg.margin.y = this.svg.margin.x;
      this.svg.margin.t = this.svg.margin.x;
      this.svg.margin.r = this.svg.margin.x;
      this.svg.margin.b = this.svg.margin.x;
      this.svg.margin.l = this.svg.margin.x;
    }

    // Clock face stuff
    this.svg.clockface = {};
    if (this.config?.clock?.face) {
      if (this.config.clock.face?.show_day_night === true)
        this.svg.clockface.dayNightRadius = Utils.calculateSvgDimension(this.config.clock.face.day_night_radius);
      if (this.config.clock.face?.show_hour_marks === true)
        this.svg.clockface.hourMarksRadius = Utils.calculateSvgDimension(this.config.clock.face.hour_marks_radius);
      if (['absolute', 'relative'].includes(this.config.clock.face?.show_hour_numbers))
        this.svg.clockface.hourNumbersRadius = Utils.calculateSvgDimension(this.config.clock.face.hour_numbers_radius);
    }
    // const theWidth = (this.config.position.orientation === 'vertical') ? this.svg.width : this.svg.height;

    // this.svg.barWidth = (theWidth - (((this.config.hours / this.config.barhours) - 1)
    //                               * this.svg.margin)) / (this.config.hours / this.config.barhours);
    this._data = [];
    this._bars = [];
    this._scale = {};
    this._needsRendering = false;

    this.classes.tool = {};
    this.classes.bar = {};
    this.classes.clock_face_day_night = {};
    this.classes.clock_face_hour_marks = {};
    this.classes.clock_face_hour_numbers = {};

    this.classes.timeline = {};
    this.classes.timeline_graph = {};
    this.styles.timeline = {};
    this.styles.timeline_graph = {};

    this.classes.clock = {};
    this.classes.clock_graph = {};
    this.styles.clock = {};
    this.styles.clock_graph = {};

    // Helper lines stuff
    this.classes.helper_line1 = {};
    this.classes.helper_line2 = {};
    this.classes.helper_line3 = {};

    this.styles.helper_line1 = {};
    this.styles.helper_line2 = {};
    this.styles.helper_line3 = {};

    // eslint-disable-next-line dot-notation
    this.styles.tool = {};
    this.styles.bar = {};
    this.styles.line = {};
    this.styles.clock_face_day_night = {};
    this.styles.clock_face_hour_marks = {};
    this.styles.clock_face_hour_numbers = {};
    this.stylesBar = {};

    this.seriesIndex = 0;

    this.id = this.toolId;
    // From MGC
    this.bound = [0, 0];
    this.boundSecondary = [0, 0];
    this.length = [];
    this.entity = [];
    this.line = [];
    this.lineMin = [];
    this.lineMax = [];
    this.bar = [];
    this.equalizer = [];
    this.trafficLight = [];
    this.abs = [];
    this.fill = [];
    this.fillMinMax = [];
    this.points = [];
    this.gradient = [];
    this.tooltip = {};
    this.updateQueue = [];
    this.updating = false;
    this.stateChanged = false;
    this.initial = true;
    this._md5Config = undefined;
    this.clock = [];
    this.timeline = [];

    // Use full widt/height for config
    this.config.width = this.svg.width;
    this.config.height = this.svg.height;

    // Correct x/y pos with line_width to prevent cut-off
    this.svg.line_width = Utils.calculateSvgDimension(this.config.line_width);
    // this.svg.x = this.config.show.fill ? this.svg.x : this.svg.x + this.svg.line_width / 2;
    // this.svg.y += this.svg.line_width / 2;
    // this.svg.height -= this.svg.line_width;
    this.trafficLights = [];
    this.config.color_thresholds.map((value, index) => (
      this.trafficLights[index] = value.value
    ));

    this.buckets = [];
    this.config.color_thresholds.map((value, index) => {
      let bucketIndex;
      bucketIndex = (value.bucket !== undefined) ? value.bucket : index;
      if (!this.buckets[bucketIndex]) {
        this.buckets[bucketIndex] = {};
        this.buckets[bucketIndex].value = [];
        this.buckets[bucketIndex].rangeMin = [];
        this.buckets[bucketIndex].rangeMax = [];
      }
      this.buckets[bucketIndex].bucket = bucketIndex;
      this.buckets[bucketIndex].color = value.color;
      // Assume right order from low to high and that next index is upper range
      //
      let rangeMin = value.value;
      let rangeMax = this.config.color_thresholds[index + 1]?.value || Infinity;
      this.buckets[bucketIndex].value.push(value.value);
      this.buckets[bucketIndex].rangeMin.push(rangeMin);
      this.buckets[bucketIndex].rangeMax.push(rangeMax);
      return true;
    });

    this.config.color_thresholds = computeThresholds(
      this.config.color_thresholds,
      this.config.color_thresholds_transition,
    );

    this.clockWidth = Utils.calculateSvgDimension(this.config?.clock?.size || 5);
    // Graph settings
    this.svg.graph = {};
    this.svg.graph.height = this.svg.height - this.svg.margin.y * 0;
    this.svg.graph.width = this.svg.width - this.svg.margin.x * 0;

    this.config.state_map.forEach((state, i) => {
      // convert string values to objects
      if (typeof state === 'string') this.config.state_map[i] = { value: state, label: state };
      // make sure label is set
      this.config.state_map[i].label = this.config.state_map[i].label || this.config.state_map[i].value;
    });
    // Helper lines
    this.helperLines = [];
    if (typeof this.config.helper_lines === 'object') {
      let j = 0;
      let helpers = Object.keys(this.config.helper_lines);
      helpers.forEach((helperLine) => {
        this.helperLines[j] = {
          id: helperLine,
          zpos: this.config.helper_lines[helperLine]?.zpos || 'above',
          yshift: Utils.calculateSvgDimension(this.config.helper_lines[helperLine]?.yshift) || 0,
        };
        j += 1;
      });
    }
    if (this.helperLines.length > 0)
      console.log('helperLines', this.helperLines);

    // Other lines test
    this.xLines = {};
    this.xLines.lines = [];
    if (typeof this.config.x_lines?.lines === 'object') {
      let j = 0;
      let helpers = this.config.x_lines.lines;
      helpers.forEach((helperLine) => {
        this.xLines.lines[j] = {
          id: helperLine.name,
          zpos: helperLine?.zpos || 'above',
          yshift: Utils.calculateSvgDimension(helperLine?.yshift) || 0,
        };
        j += 1;
      });
    }
    if (this.xLines.lines.length > 0)
      console.log('xAxis.lines', this.xLines.lines);

    // this.xLines.numbers = {};
    if (typeof this.config.x_lines?.numbers === 'object') {
      this.xLines.numbers = { ...this.config.x_lines.numbers };
    }
    if (this.xLines.numbers)
      console.log('xAxis.numbers', this.xLines.numbers);

    let { config } = this;

    // override points per hour to match group_by function
    // switch (this.config.x_axis.group_by) {
    //   case 'week':
    //     this.config.x_axis.bins_per_hour = 1 / (24 * 7);
    //     break;
    //   case 'date':
    //     this.config.x_axis.bins_per_hour = 1 / 24;
    //     break;
    //   case 'hour':
    //     this.config.x_axis.bins_per_hour = 1;
    //     break;
    //   case 'quarterhour':
    //     this.config.x_axis.bins_per_hour = 4;
    //     break;
    //   default:
    //     break;
    // }
    // From MGC
    // if (this.config.points_per_hour)
    //   this.config.x_axis.bins_per_hour = this.config.points_per_hour;
    this.Graph = [];
    this.Graph[0] = new SparklineGraph(
      this.svg.graph.width,
      this.svg.graph.height,
      this.svg.margin,
      this.config.x_axis.start_on,
      this.config.x_axis.hours_to_show,
      this.config.x_axis.bins_per_hour,
      this.config.y_axis.aggregate_func,
      this.config.x_axis.group_by,
      getFirstDefinedItem(
        this.config.y_axis.smoothing,
        !this._card.config.entities[this.defaultEntityIndex()].entity.startsWith('binary_sensor.'),
        // !entity.entity.startsWith('binary_sensor.'), // turn off for binary sensor by default
      ),
      this.config.y_axis.logarithmic,
      this.trafficLights,
      this.buckets,
      this.config.state_map,
      config,
    );
    // this.Graph[0] = new SparklineGraph(
    //   this.svg.graph.width,
    //   this.svg.graph.height,
    //   this.svg.margin,
    //   this.config.x_axis.start_on,
    //   this.config.x_axis.hours_to_show || this.config.hours_to_show,
    //   this.config.x_axis.bins_per_hour || this.config.points_per_hour,
    //   this.config.y_axis.aggregate_func || this.config.aggregate_func,
    //   this.config.y_axis.group_by || this.config.group_by,
    //   getFirstDefinedItem(
    //     this.config.smoothing,
    //     !this._card.config.entities[this.defaultEntityIndex()].entity.startsWith('binary_sensor.'),
    //     // !entity.entity.startsWith('binary_sensor.'), // turn off for binary sensor by default
    //   ),
    //   this.config.y_axis.logarithmic || this.config.y_axis.logarithmic,
    //   this.trafficLights,
    //   this.buckets,
    //   this.config.state_map,
    //   config,
    // );

    // this.Graph[0] = new SparklineGraph(
    //   this.svg.graph.width,
    //   this.svg.graph.height,
    //   this.svg.margin,
    //   this.config?.x_axis?.start_on,
    //   this.config?.x_axis?.hours_to_show || this.config.hours_to_show,
    //   this.config?.x_axis?.bins_per_hour || this.config.x_axis.bins_per_hour,
    //   this.config?.y_axis?.aggregate_func || this.config.aggregate_func,
    //   this.config?.y_axis?.group_by || this.config.group_by,
    //   getFirstDefinedItem(
    //     this.config.smoothing,
    //     !this._card.config.entities[this.defaultEntityIndex()].entity.startsWith('binary_sensor.'),
    //     // !entity.entity.startsWith('binary_sensor.'), // turn off for binary sensor by default
    //   ),
    //   this.config?.y_axis?.logarithmic || this.config.y_axis.logarithmic,
    //   this.trafficLights,
    //   this.buckets,
    //   this.config.state_map,
    //   config,
    // );

    // this.Graph[0] = new SparklineGraph(
    //     this.svg.graph.width,
    //     this.svg.graph.height,
    //     this.svg.margin,
    //     this.config?.start_on,
    //     this.config.hours_to_show,
    //     this.config.x_axis.bins_per_hour,
    //     this.config.aggregate_func,
    //     this.config.group_by,
    //     getFirstDefinedItem(
    //       this.config.smoothing,
    //       !this._card.config.entities[this.defaultEntityIndex()].entity.startsWith('binary_sensor.'),
    //       // !entity.entity.startsWith('binary_sensor.'), // turn off for binary sensor by default
    //     ),
    //     this.config.y_axis.logarithmic,
    //     this.trafficLights,
    //     this.buckets,
    //     this.config.state_map,
    //     config,
    // );
  }

  set value(state) {
    console.log('GraphTool - set value IN', state);

    if (this._stateValue === state) return false;

    const changed = super.value = state;

    // Push realtime data into the history graph for fixed_value...
    // Maybe in future: history is fetched once, and then real time updates add
    // data to the existing history graph, and deletes old data points...
    if (this.config.y_axis.fixed_value === true) {
      let histState = state;
      const stateHistory = [{ state: histState }];
      this.series = stateHistory;
    }
    return changed;
  }

  /** *****************************************************************************
    * SparklineBarChartTool::set series
    *
    * Summary.
    * Sets the timeseries for the barchart tool. Is an array of states.
    * If this is historical data, the caller has taken the time to create this.
    * This tool only displays the result...
    *
    */
  set data(states) {
    // Bit of an hack.
    // Use set data to set the index of the this.Graph[], ie which entity
    // is updating. This is the real entity_index...
    // this.seriesIndex = states;
  }

  set series(states) {
    if ((this.dev) && (this.dev.fakeData)) {
      let z = 40;
      for (let i = 0; i < states.length; i++) {
        if (i < states.length / 2) z -= 4 * i;
        if (i > states.length / 2) z += 3 * i;
        states[i].state = z;
      }
    }
    if (this._card.config.entities[0].fixed_value === true) {
      const last = states[states.length - 1];
      states = [last, last];
    }
    // HACK...
    this.seriesIndex = 0;
    this.Graph[this.seriesIndex].update(states);
    // this.Graph[0].update(states);

    this.updateBounds();

    let { config } = this;
    if (config.show.graph) {
      let graphPos = 0;
      let entity = this._card.config.entities[this.defaultEntityIndex()];
      const i = 0;
      // this._card.entities.forEach((entity, i) => {
      // this.entity.forEach((entity, i) => {
      if (!entity || this.Graph[i].coords.length === 0) return;
        const bound = this._card.config.entities[i].y_axis === 'secondary' ? this.boundSecondary : this.bound;
        [this.Graph[i].min, this.Graph[i].max] = [bound[0], bound[1]];

        // Process each type of graph, including its options...
        const numVisible = this.visibleEntities.length;

        // +++++ Check for 'bar' graph type
        if (config.show.graph === 'bar') {
          this.bar[i] = this.Graph[i].getBars(graphPos, numVisible, config.bar_spacing);
          graphPos += 1;
          // Add the next 4 lines as a hack
          if (config.color_thresholds.length > 0 && !this._card.config.entities[i].color)
            this.gradient[i] = this.Graph[i].computeGradient(
              config.color_thresholds, this.config.y_axis.logarithmic,
            );
        // +++++ Check for 'area' or 'line' graph type
        } else if (['area', 'line'].includes(config.show.graph)) {
          const line = this.Graph[i].getPath();
          if (this._card.config.entities[i].show_line !== false) this.line[i] = line;
        }

        // +++++ Check for 'area' graph type
        if (config.show.graph === 'area') {
          this.fill[i] = this.Graph[i].getFill(this.line[i]);
        }

        // +++++ Line might have set the minmax flag...
        if ((config?.line?.show_minmax)) {
          const lineMin = this.Graph[i].getPathMin();
          const lineMax = this.Graph[i].getPathMax();
          if (!this.lineMin) this.lineMin = [];
          if (!this.lineMax) this.lineMax = [];
          this.lineMin[i] = lineMin;
          this.lineMax[i] = lineMax;
          if (!this.fillMinMax) this.fillMinMax = [];
          this.fillMinMax[i] = this.Graph[i].getFillMinMax(lineMin, lineMax);
        }

        // +++++ Check for 'dots' graph type or if dots are enabled for area or line graph
        if ((config.show.graph === 'dots')
          || (config?.area?.show_dots === true)
          || (config?.line?.show_dots === true)) {
          this.points[i] = this.Graph[i].getPoints();

        // +++++ Check for 'equilizer' graph type
        } else if (this.config.show.graph === 'equalizer') {
          this.Graph[i].levelCount = this.config.value_buckets;
          this.Graph[i].valuesPerBucket = (this.Graph[i].max - this.Graph[i].min) / this.config.value_buckets;
          this.equalizer[i] = this.Graph[i].getEqualizer(0, this.visibleEntities.length, config.bar_spacing);

        // +++++ Check for 'trafficlight' graph type
        } else if (this.config.show.graph === 'trafficlight') {
          this.Graph[i].levelCount = this.config.value_buckets;
          this.Graph[i].valuesPerBucket = (this.Graph[i].max - this.Graph[i].min) / this.config.value_buckets;
          this.trafficLight[i] = this.Graph[i].getTrafficLights(0, this.visibleEntities.length, config.bar_spacing);

        // +++++ Check for 'number' graph type
        } else if (this.config.show.graph === 'clock') {
          this.clock[i] = this.Graph[i].getClock(0, this.visibleEntities.length, 0);
          this.Graph[i].clock = this.clock[i];

        // +++++ Check for 'number' graph type
        } else if (this.config.show.graph === 'timeline') {
          this.timeline[i] = this.Graph[i].getTimeline(0, this.visibleEntities.length, 0);
          this.Graph[i].timeline = this.timeline[i];
        }

        // Add the next 4 lines as a hack
        if (config.color_thresholds.length > 0 && !this._card.config.entities[i].color)
        this.gradient[i] = this.Graph[i].computeGradient(
          config.color_thresholds, this.config.y_axis.logarithmic,
        );

      this.line = [...this.line];
    }
    this.updating = false;
  }

  hasSeries() {
    return this.defaultEntityIndex();
  }

  _convertState(res) {
    const resultIndex = this.config.state_map.findIndex((s) => s.value === res.state);
    if (resultIndex === -1) {
      return;
    }

    res.state = resultIndex;
  }

  processStateMap(history) {
    if (this.config.state_map?.length > 0) {
      history[0].forEach((item, index) => {
        if (this.config.state_map.length > 0)
        // this._history[index].state = this._convertState(item);
        this._convertState(item);
        history[0][index].state = item.state;
      });
    }
    if (this.config.y_axis.value_factor !== 0) {
      history[0].forEach((item, index) => {
        history[0][index].state = item.state * this.config.y_axis.value_factor;
      });
    }
  }

  get visibleEntities() {
    return [1];
  }

  get primaryYaxisEntities() {
    return this.visibleEntities.filter((entity) => entity.y_axis === undefined
      || entity.y_axis === 'primary');
  }

  get secondaryYaxisEntities() {
    return this.visibleEntities.filter((entity) => entity.y_axis === 'secondary');
  }

  get visibleLegends() {
    return this.visibleEntities.filter((entity) => entity.show_legend !== false);
  }

  get primaryYaxisSeries() {
    return this.primaryYaxisEntities.map((entity, index) => this.Graph[index]);
    // return this.primaryYaxisEntities.map((entity) => this.Graph[entity.index]);
  }

  get secondaryYaxisSeries() {
    return this.secondaryYaxisEntities.map((entity) => this.Graph[entity.index]);
  }

  getBoundary(type, series, configVal, fallback) {
    if (!(type in Math)) {
      throw new Error(`The type "${type}" is not present on the Math object`);
    }

    if (configVal === undefined) {
      return Math[type](...series.map((ele) => ele[type])) || fallback;
    }
    if (configVal[0] !== '~') {
      // fixed boundary
      return configVal;
    }
    // soft boundary (respecting out of range values)
    return Math[type](Number(configVal.substr(1)), ...series.map((ele) => ele[type]));
  }

  getBoundaries(series, min, max, fallback, minRange) {
    let boundary = [
      this.getBoundary('min', series, min, fallback[0], minRange),
      this.getBoundary('max', series, max, fallback[1], minRange),
    ];

    if (minRange) {
      const currentRange = Math.abs(boundary[0] - boundary[1]);
      const diff = parseFloat(minRange) - currentRange;

      // Doesn't matter if minBoundRange is NaN because this will be false if so
      if (diff > 0) {
        boundary = [
          boundary[0] - diff / 2,
          boundary[1] + diff / 2,
        ];
      }
    }

    return boundary;
  }

  updateBounds({ config } = this) {
    this.bound = this.getBoundaries(
      this.primaryYaxisSeries,
      config.y_axis.lower_bound,
      config.y_axis.upper_bound,
      this.bound,
      config.y_axis.min_bound_range,
    );

    this.boundSecondary = this.getBoundaries(
      this.secondaryYaxisSeries,
      config.y_axis.lower_bound_secondary,
      config.y_axis.upper_bound_secondary,
      this.boundSecondary,
      config.y_axis.min_bound_range_secondary,
    );
  }

  computeColor(inState, i) {
    const { color_thresholds, line_color } = this.config;
    const state = Number(inState) || 0;
    const threshold = {
      color: line_color[i] || line_color[0],
      ...color_thresholds.slice(-1)[0],
      ...color_thresholds.find((ele) => ele.value < state),
    };
    return this._card.config.entities[i].color || threshold.color;
  }

  intColor(inState, i) {
    const { color_thresholds, line_color } = this.config;
    const state = Number(inState) || 0;

    let intColor;
    if (color_thresholds.length > 0) {
      // HACK. Keep check for 'bar' !!!
      if (this.config.show.graph === 'bar') {
        const { color } = color_thresholds.find((ele) => ele.value < state)
          || color_thresholds.slice(-1)[0];
        intColor = color;
      } else {
        const index = color_thresholds.findIndex((ele) => ele.value < state);
        const c1 = color_thresholds[index];
        const c2 = color_thresholds[index - 1];
        if (c2) {
          const factor = (c2.value - inState) / (c2.value - c1.value);
          intColor = Colors.getGradientValue(c2.color, c1.color, factor);
        } else {
          intColor = index
            ? color_thresholds[color_thresholds.length - 1].color
            : color_thresholds[0].color;
        }
      }
    }

    return this._card.config.entities[i].color || intColor || line_color[i] || line_color[0];
    // return this.config.entities[i].color || intColor || line_color[i] || line_color[0];
  }

  getEndDate() {
    const date = new Date();
    switch (this.config.x_axis.group_by) {
      case 'date':
        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0);
        break;
      case 'hour':
        date.setHours(date.getHours() + 1);
        date.setMinutes(0, 0);
        break;
    }
    switch (this.config.x_axis.start_on) {
      case 'today':
        break;
      case 'yesterday':
        // date.setDate(date.getDate() - 1);
        date.setHours(0, 0, 0, 0);
        break;
    }
    return date;
  }

  setTooltip(entity, index, value, label = null) {
    const {
      bins_per_hour,
      hours_to_show,
      format,
    } = this.config.x_axis;
    const offset = hours_to_show < 1 && bins_per_hour < 1
      ? bins_per_hour * hours_to_show
      : 1 / bins_per_hour;

    const id = Math.abs(index + 1 - Math.ceil(hours_to_show * bins_per_hour));

    const now = this.getEndDate();

    const oneMinInHours = 1 / 60;
    now.setMilliseconds(now.getMilliseconds() - getMilli(offset * id + oneMinInHours));
    const end = getTime(now, format, this._card._hass.language);
    now.setMilliseconds(now.getMilliseconds() - getMilli(offset - oneMinInHours));
    const start = getTime(now, format, this._card._hass.language);

    this.tooltip = {
      value,
      id,
      entity,
      time: [start, end],
      index,
      label,
    };
  }

  renderSvgAreaMask(fill, i) {
  if (this.config.show.graph !== 'area') return;
  if (!fill) return;
  const fade = this.config.show.fill === 'fade';
  const init = this.length[i] || this._card.config.entities[i].show_line === false;
  // Check for zero crossing...
  const y_zero = (this.Graph[i]._min >= 0) ? 0
   : (Math.abs(this.Graph[i]._min) / ((this.Graph[i]._max - this.Graph[i]._min)) * 100);
  return svg`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-pos-${this.id}-${i}`}>
        <rect width="100%" height="${100 - y_zero}%" fill=${this.config.styles.area_mask_above.fill}
         />
      </mask>
      <linearGradient id=${`fill-grad-neg-${this.id}-${i}`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-neg-${this.id}-${i}`}>
        <rect width="100%" y=${100 - y_zero}% height="${y_zero}%" fill=${this.config.styles.area_mask_below.fill}
         />
      </mask>
    </defs>

    <mask id=${`fill-${this.id}-${i}`}>
      <path class='fill'
        type=${this.config.show.fill}
        .id=${i} anim=${this.config.animate} ?init=${init}
        style="animation-delay: ${this.config.animate ? `${i * 0.5}s` : '0s'}"
        fill='white'
        mask=${fade ? `url(#fill-grad-mask-pos-${this.id}-${i})` : ''}
        d=${this.fill[i]}
      />
      ${this.Graph[i]._min < 0
        ? svg`<path class='fill'
            type=${this.config.show.fill}
            .id=${i} anim=${this.config.animate} ?init=${init}
            style="animation-delay: ${this.config.animate ? `${i * 0.5}s` : '0s'}"
            fill='white'
            mask=${fade ? `url(#fill-grad-mask-neg-${this.id}-${i})` : ''}
            d=${this.fill[i]}
          />`
        : ''
      }
    </mask>`;
}

renderSvgAreaMinMaxMask(fill, i) {
  if (this.config.show.graph !== 'line') return;
  if (!fill) return;
  const fade = this.config.show.fill === 'fade';
  const init = this.length[i] || this._card.config.entities[i].show_line === false;
  // Check for zero crossing...
  const y_zero = (this.Graph[i]._min >= 0) ? 0
   : (Math.abs(this.Graph[i]._min) / ((this.Graph[i]._max - this.Graph[i]._min)) * 100);
  return svg`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-pos-${this.id}-${i}`}>
        <rect width="100%" height="${100 - y_zero}%" fill=${this.config.styles.area_mask_above.fill}
         />
      </mask>
      <linearGradient id=${`fill-grad-neg-${this.id}-${i}`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-neg-${this.id}-${i}`}>
        <rect width="100%" y=${100 - y_zero}% height="${y_zero}%" fill=${this.config.styles.area_mask_below.fill}
         />
      </mask>
    </defs>

    <mask id=${`fillMinMax-${this.id}-${i}`}>
      <path class='fill'
        type=${this.config.show.fill}
        .id=${i} anim=${this.config.animate} ?init=${init}
        style="animation-delay: ${this.config.animate ? `${i * 0.5}s` : '0s'}"
        fill='#555555'
        mask=${fade ? `url(#fill-grad-mask-pos-${this.id}-${i})` : ''}
        d=${this.fillMinMax[i]}
      />
      ${this.Graph[i]._min < 0
        ? svg`<path class='fill'
            type=${this.config.show.fill}
            .id=${i} anim=${this.config.animate} ?init=${init}
            style="animation-delay: ${this.config.animate ? `${i * 0.5}s` : '0s'}"
            fill='#444444'
            mask=${fade ? `url(#fill-grad-mask-neg-${this.id}-${i})` : ''}
            d=${this.fillMinMax[i]}
          />`
        : ''
      }
    </mask>`;
}

renderSvgLineMask(line, i) {
  // if (this.config.show.graph !== 'line') return;
  // if (['dots', 'equalizer', 'trafficlight', 'clock'].includes(this.config.show.graph)) return;
  if (!line) return;

  const path = svg`
    <path
      class='line'
      .id=${i}
      anim=${this.config.animate} ?init=${this.length[i]}
      style="animation-delay: ${this.config.animate ? `${i * 0.5}s` : '0s'}"
      fill='none'
      stroke-dasharray=${this.length[i] || 'none'} stroke-dashoffset=${this.length[i] || 'none'}
      stroke=${'white'}
      stroke-width=${this.svg.line_width}
      d=${this.line[i]}
    />`;

  return svg`
    <mask id=${`line-${this.id}-${i}`}>
      ${path}
    </mask>
  `;
}

renderSvgLineMinMaxMask(line, i) {
  if (this.config.show.graph !== 'line') return;
  if (!line) return;

  const path = svg`
    <path
      class='lineMinMax'
      .id=${i}
      anim=${this.config.animate} ?init=${this.length[i]}
      style="animation-delay: ${this.config.animate ? `${i * 0.5}s` : '0s'}"
      fill='none'
      stroke-dasharray=${this.length[i] || 'none'} stroke-dashoffset=${this.length[i] || 'none'}
      stroke=${'white'}
      stroke-width=${this.svg.line_width}
      d=${this.line[i]}
    />`;

  return svg`
    <mask id=${`lineMinMax-${this.id}-${i}`}>
      ${path}
    </mask>
  `;
}

renderSvgPoint(point, i) {
  const color = this.gradient[i] ? this.computeColor(point[V], i) : 'inherit';
  return svg`
    <circle
      class='line--point'
      ?inactive=${this.tooltip.index !== point[3]}
      style=${`--mcg-hover: ${color};`}
      stroke=${color}
      fill=${color}
      cx=${point[X]} cy=${point[Y]} r=${this.svg.line_width / 1.5}
      @mouseover=${() => this.setTooltip(i, point[3], point[V])}
      @mouseout=${() => (this.tooltip = {})}
    />
  `;
}

renderSvgPoints(points, i) {
  if (!points) return;
  const color = this.computeColor(this._card.entities[i].state, i);
  // const color = this.computeColor(this.entity[i].state, i);
  return svg`
    <g class='line--points'
      ?tooltip=${this.tooltip.entity === i}
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      ?init=${this.length[i]}
      anim=${this.config.animate && this.config.show.points !== 'hover'}
      style="animation-delay: ${this.config.animate ? `${i * 0.5 + 0.5}s` : '0s'}"
      fill=${color}
      stroke=${color}
      stroke-width=${this.svg.line_width / 2}>
      ${points.map((point) => this.renderSvgPoint(point, i))}
    </g>`;
}

renderSvgTrafficLight(trafficLight, i) {
  let adjustX = 0;
  let adjustY = 0;
  if (this.config.square === true) {
    const size = Math.min(trafficLight.width, trafficLight.height);
    adjustX = (trafficLight.width - size) / 2;
    adjustY = (trafficLight.height - size) / 2;
  }

  const levelRect = trafficLight.value.map((single, j) => {
    // Computecolor uses the gradient calculations, which use fractions to get the gradient
    // Adjust to get the right color bucket...
    // fill=${color}
    const color = this.computeColor(single + 0.001, 0);
    return svg`
    <rect class='level'
      x=${trafficLight.x + adjustX + this.svg.line_width / 2}
      y=${trafficLight.y[j] - 1 * trafficLight.height - this.svg.line_width / 1}
      height=${Math.max(0, trafficLight.height - 2 * adjustY - this.svg.line_width)}
      width=${Math.max(0, trafficLight.width - 2 * adjustX - this.svg.line_width)}
      fill=${color}
      stroke=${color}
      stroke-width="${this.svg.line_width ? this.svg.line_width : 0}"
      rx="50%"
      @mouseover=${() => this.setTooltip(i, j, single)}
      @mouseout=${() => (this.tooltip = {})}>
    </rect>`;
  });

  return svg`
    ${levelRect}`;
}

renderSvgTrafficLights(trafficLights, i) {
  if (!trafficLights) return;
  const color = this.computeColor(this._card.entities[i].state, i);
  const linesBelow = this.xLines.lines.map((helperLine) => {
    if (helperLine.zpos === 'below') {
      return [svg`
        <line class=${classMap(this.classes[helperLine.id])}) style="${styleMap(this.styles[helperLine.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        pathLength="240"
        >
        </line>
        `];
    } else return [''];
  });
  const linesAbove = this.xLines.lines.map((helperLine) => {
    console.log('linesAbove', helperLine);
    if (helperLine.zpos === 'above') {
      return [svg`
        <line class="${classMap(this.classes[helperLine.id])}"
              style="${styleMap(this.styles[helperLine.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        pathLength="240"
        >
        </line>
        `];
    } else return [''];
  });
  return svg`
    <g class='traffic-lights'
      ?tooltip=${this.tooltip.entity === i}
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      ?init=${this.length[i]}
      anim=${this.config.animate && this.config.show.points !== 'hover'}
      style="animation-delay: ${this.config.animate ? `${i * 0.5 + 0.5}s` : '0s'}"
      fill=${color}
      stroke=${color}
      stroke-width=${this.svg.line_width / 2}>
      ${linesBelow}
      ${trafficLights.map((trafficLight) => this.renderSvgTrafficLight(trafficLight, i))}
      ${linesAbove}
    </g>`;
}

renderSvgGradient(gradients) {
  if (!gradients) return;
  const items = gradients.map((gradient, i) => {
    if (!gradient) return;
    return svg`
      <linearGradient id=${`grad-${this.id}-${i}`} gradientTransform="rotate(90)">
        ${gradient.map((stop) => svg`
          <stop stop-color=${stop.color} offset=${`${stop.offset}%`} />
        `)}
      </linearGradient>`;
  });
  return svg`${items}`;
}

// Render the rectangle with the line color to be used.
// The line itself is a mask, that only shows the colors behind it using 'white'
// as the drawing (fill) color...
renderSvgLineBackground(line, i) {
  if (!line) return;
  const fill = this.gradient[i]
    ? `url(#grad-${this.id}-${i})`
    : this.computeColor(this._card.entities[i].state, i);
  return svg`
    <rect class='line--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`line-rect-${this.id}-${i}`}
      fill=${fill} height="100%" width="100%"
      mask=${`url(#line-${this.id}-${i})`}
    />`;
}

renderSvgLineMinMaxBackground(line, i) {
  // Hack
  if (this.config.show.graph !== 'line') return;
  if (!line) return;
  const fill = this.gradient[i]
    ? `url(#grad-${this.id}-${i})`
    : this.computeColor(this._card.entities[i].state, i);
  return svg`
    <rect class='line--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`line-rect-${this.id}-${i}`}
      fill=${fill} height="100%" width="100%"
      mask=${`url(#lineMinMax-${this.id}-${i})`}
    />`;
}

// Render the area below the line graph.
// Currently called the 'fill', but actually it should be named area, after
// sparkline area graph according to the mighty internet.
renderSvgAreaBackground(fill, i) {
  if (this.config.show.graph !== 'area') return;
  if (!fill) return;
  const svgFill = this.gradient[i]
    ? `url(#grad-${this.id}-${i})`
    : this.intColor(this._card.entities[i].state, i);
    const linesBelow = this.xLines.lines.map((helperLine) => {
      if (helperLine.zpos === 'below') {
        return [svg`
          <line class=${classMap(this.classes[helperLine.id])}) style="${styleMap(this.styles[helperLine.id])}"
          x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
          x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
          pathLength="240"
          >
          </line>
          `];
      } else return [''];
    });
    const linesAbove = this.xLines.lines.map((helperLine) => {
      console.log('linesAbove', helperLine);
      if (helperLine.zpos === 'above') {
        return [svg`
          <line class="${classMap(this.classes[helperLine.id])}"
                style="${styleMap(this.styles[helperLine.id])}"
          x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
          x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
          pathLength="240"
          >
          </line>
          `];
      } else return [''];
    });

    return svg`
    ${linesBelow}
    <rect class='fill--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`fill-rect-${this.id}-${i}`}
      fill=${svgFill} height="100%" width="100%"
      mask=${`url(#fill-${this.id}-${i})`}
    />
    ${linesAbove}
    `;
}

renderSvgAreaMinMaxBackground(fill, i) {
  if (this.config.show.graph !== 'line') return;
  if (!fill) return;
  const svgFill = this.gradient[i]
    ? `url(#grad-${this.id}-${i})`
    : this.intColor(this._card.entities[i].state, i);
  return svg`
    <rect class='fill--rect'
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== i}
      id=${`fill-rect-${this.id}-${i}`}
      fill=${svgFill} height="100%" width="100%"
      mask=${`url(#fillMinMax-${this.id}-${i})`}
    />`;
}

renderSvgEqualizerMask(equalizer, index) {
  if (this.config.show.graph !== 'equalizer') return;

  if (!equalizer) return;
  const fade = this.config.show.fill === 'fade';
  `url(#fill-grad-mask-neg-${this.id}-${index}})`;
  const maskPos = `url(#fill-grad-mask-pos-${this.id}-${index}})`;
  const fillNeg = this.config.styles.bar_mask_below.fill;
  const fillPos = this.config.styles.bar_mask_above.fill;

  const paths = equalizer.map((equalizerPart, i) => {
    const animation = this.config.animate
      ? svg`
        <animate attributeName='y' from=${this.svg.height} to=${equalizerPart.y} dur='1s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
      : '';
    if (this.config.square === true) {
      const size = Math.min(equalizerPart.width, equalizerPart.height);
      equalizerPart.width = size;
      equalizerPart.height = size;
    }
    const equalizerPartRect = equalizerPart.value.map((single, j) => {
      return svg`
      <rect class='level' x=${equalizerPart.x} y=${equalizerPart.y[j] - 1 * equalizerPart.height - this.svg.line_width / 1}
        height=${Math.max(0, equalizerPart.height - this.svg.line_width)} width=${equalizerPart.width}
        fill=${fade ? (equalizerPart.value > 0 ? fillPos : fillNeg) : 'white'}
        stroke=${fade ? (equalizerPart.value > 0 ? fillPos : fillNeg) : 'white'}
        stroke-width="${this.svg.line_width ? this.svg.line_width : 0}"
        rx="0%"
        @mouseover=${() => this.setTooltip(index, j, single)}
        @mouseout=${() => (this.tooltip = {})}>
        ${animation}
      </rect>`;
    });

    return svg`
      ${equalizerPartRect}`;
  });
  return svg`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='25%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='60%' stop-opacity='0.0'/>
      </linearGradient>
      <linearGradient id=${`fill-grad-neg-${this.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='40%' stop-opacity='0'/>
        <stop stop-color='white' offset='75%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='100%' stop-opacity='1.0'/>
      </linearGradient>

      <mask id=${`fill-grad-mask-pos-${this.id}-${index}`}>
        <rect width="100%" height="100%"}
      </mask>
    </defs>  
    <mask id=${`equalizer-bg-${this.id}-${index}`}>
      ${paths}
      mask = ${maskPos}
    </mask>
  `;
}

renderSvgBarsMask(bars, index) {
  if (this.config.show.graph !== 'bar') return;
  // if (this.config.show.graph === 'dots') return;

  if (!bars) return;
  const fade = this.config.show.fill === 'fade';
  `url(#fill-grad-mask-neg-${this.id}-${index}})`;
  const maskPos = `url(#fill-grad-mask-pos-${this.id}-${index}})`;
  // const fillNeg = `url(#fill-grad-neg-${this.id}-${index}`;
  // const fillPos = `url(#fill-grad-pos-${this.id}-${index}`;
  const fillNeg = this.config.styles.bar_mask_below.fill;
  const fillPos = this.config.styles.bar_mask_above.fill;

  const paths = bars.map((bar, i) => {
    const animation = this.config.animate
      ? svg`
        <animate attributeName='y' from=${this.svg.height} to=${bar.y} dur='1s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
      : '';
    return svg` 

      <rect class='bar' x=${bar.x} y=${bar.y + (bar.value > 0 ? +this.svg.line_width / 2 : -this.svg.line_width / 2)}
        height=${Math.max(0, bar.height - this.svg.line_width / 1 - 0)} width=${bar.width}
        fill=${fade ? (bar.value > 0 ? fillPos : fillNeg) : 'white'}
        stroke=${fade ? (bar.value > 0 ? fillPos : fillNeg) : 'white'}
        stroke-width="${this.svg.line_width ? this.svg.line_width : 0}"
        @mouseover=${() => this.setTooltip(index, i, bar.value)}
        @mouseout=${() => (this.tooltip = {})}>
        ${animation}
      </rect>`;
  });
  return svg`
    <defs>
      <linearGradient id=${`fill-grad-pos-${this.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='25%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='60%' stop-opacity='0.0'/>
      </linearGradient>
      <linearGradient id=${`fill-grad-neg-${this.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color='white' offset='40%' stop-opacity='0'/>
        <stop stop-color='white' offset='75%' stop-opacity='0.4'/>
        <stop stop-color='white' offset='100%' stop-opacity='1.0'/>
      </linearGradient>

      <mask id=${`fill-grad-mask-pos-${this.id}-${index}`}>
        <rect width="100%" height="100%"}
      </mask>
    </defs>  
    <mask id=${`bars-bg-${this.id}-${index}`}>
      ${paths}
      mask = ${maskPos}
    </mask>
  `;
}

renderSvgEqualizerBackground(equalizer, index) {
  if (this.config.show.graph !== 'equalizer') return;
  if (!equalizer) return;

  const fade = this.config.show.fill === 'fadenever';
  if (fade) {
  // Is in fact the rendering of the AreaMask... In this case the barsmask.
  // This is incomplete. Need rendering of the background itself too
  // So check AreaBackground too to be complete for the 'fade' functionality of the Area
    this.length[index] || this._card.config.entities[index].show_line === false;
    const svgFill = this.gradient[index]
      ? `url(#grad-${this.id}-${index})`
      : this.intColor(this._card.entities[index].state, index);
    this.gradient[index]
      ? `url(#fill-grad${this.id}-${index})`
      : this.intColor(this._card.entities[index].state, index);

      return svg`
      <defs>
        <linearGradient id=${`fill-grad-${this.id}-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop stop-color='white' offset='0%' stop-opacity='1'/>
          <stop stop-color='white' offset='100%' stop-opacity='.1'/>
        </linearGradient>

        <mask id=${`fill-grad-mask-${this.id}-${index}`}>
          <rect width="100%" height="100%" fill=${`url(#fill-grad-${this.id}-${index})`}
        </mask>
      </defs>

      <g mask = ${`url(#fill-grad-mask-${this.id}-${index})`}>
        <rect class='equalizer--bg'
          ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
          id=${`equalizer-bg-${this.id}-${index}`}
          fill=${svgFill} height="100%" width="100%"
          mask=${`url(#equalizer-bg-${this.id}-${index})`}
        />
      /g>`;
  } else {
    const fill = this.gradient[index]
      ? `url(#grad-${this.id}-${index})`
      : this.computeColor(this._card.entities[index].state, index);
      return svg`
      <rect class='equalizer--bg'
        ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
        id=${`equalizer-bg-${this.id}-${index}`}
        fill=${fill} height="100%" width="100%"
        mask=${`url(#equalizer-bg-${this.id}-${index})`}
      />`;
  }
}

renderSvgBarsBackground(bars, index) {
  if (this.config.show.graph !== 'bar') return;
  // if (this.config.show.graph === 'dots') return;
  if (!bars) return;

  const fade = this.config.show.fill === 'fadenever';
  if (fade) {
  // Is in fact the rendering of the AreaMask... In this case the barsmask.
  // This is incomplete. Need rendering of the background itself too
  // So check AreaBackground too to be complete for the 'fade' functionality of the Area
    this.length[index] || this._card.config.entities[index].show_line === false;
    const svgFill = this.gradient[index]
      ? `url(#grad-${this.id}-${index})`
      : this.intColor(this._card.entities[index].state, index);
    this.gradient[index]
      ? `url(#fill-grad${this.id}-${index})`
      : this.intColor(this._card.entities[index].state, index);

      // mask=${`url(#bars-bg-${this.id}-${index})`}

      return svg`
      <defs>
        <linearGradient id=${`fill-grad-${this.id}-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop stop-color='white' offset='0%' stop-opacity='1'/>
          <stop stop-color='white' offset='100%' stop-opacity='.1'/>
        </linearGradient>

        <mask id=${`fill-grad-mask-${this.id}-${index}`}>
          <rect width="100%" height="100%" fill=${`url(#fill-grad-${this.id}-${index})`}
        </mask>
      </defs>

      <g mask = ${`url(#fill-grad-mask-${this.id}-${index})`}>
        <rect class='bars--bg'
          ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
          id=${`bars-bg-${this.id}-${index}`}
          fill=${svgFill} height="100%" width="100%"
          mask=${`url(#bars-bg-${this.id}-${index})`}
        />
      /g>`;
  } else {
    const fill = this.gradient[index]
      ? `url(#grad-${this.id}-${index})`
      : this.computeColor(this._card.entities[index].state, index);
      return svg`
      <rect class='bars--bg'
        ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
        id=${`bars-bg-${this.id}-${index}`}
        fill=${fill} height="100%" width="100%"
        mask=${`url(#bars-bg-${this.id}-${index})`}
      />`;
  }
}

// This function to use for coloring the full bar depending on colorstop or color
// This depends on the style setting. Don't know which one at this point
renderSvgBars(bars, index) {
  if (!bars) return;
  const items = bars.map((bar, i) => {
    const animation = this.config.animate
      ? svg`
        <animate attributeName='y' from=${this.svg.height} to=${bar.y} dur='1s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
      : '';
    const color = this.computeColor(bar.value, index);
    return svg` 
      <rect class='bar' x=${bar.x} y=${bar.y}
        height=${bar.height} width=${bar.width} fill=${color}
        @mouseover=${() => this.setTooltip(index, i, bar.value)}
        @mouseout=${() => (this.tooltip = {})}>
        ${animation}
      </rect>`;
  });
  return svg`<g class='bars' ?anim=${this.config.animate}>${items}</g>`;
}

renderSvgClockBin(bin, path, index) {
  // const color = this.computeColor(bin.value, 0);
  const color = this.intColor(bin.value, 0);
  return svg`
  <path class="${classMap(this.classes.clock_graph)}"
        style="${styleMap(this.styles.clock_graph)}"
    d=${path}
    fill=${color}
    stroke=${color}
  >
  `;
}

renderSvgClockBackground(radius) {
  const {
    start, end, start2, end2, largeArcFlag, sweepFlag,
  } = this.Graph[0]._calcClockCoords(0, 359.9, true, radius, radius, this.clockWidth);
  const radius2 = { x: radius - this.clockWidth, y: radius - this.clockWidth };

  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y,
    'L', end2.x, end2.y,
    'A', radius2.x, radius2.y, 0, largeArcFlag, sweepFlag === '0' ? '1' : '0', start2.x, start2.y,
    'Z',
  ].join(' ');
  return svg`
    <path class="graph-clock--background"
      d="${d}"
      style="fill: lightgray; stroke-width: 0; opacity: 0.1;"
    />
  `;
}

renderSvgClockFace(radius) {
  if (!this.config?.clock?.face) return svg``;
  const renderDayNight = () => (
    this.config.clock.face?.show_day_night === true
      ? svg`
          <circle pathLength="1"
          class="${classMap(this.classes.clock_face_day_night)}" style="${styleMap(this.styles.clock_face_day_night)}"
          r="${this.svg.clockface.dayNightRadius}" cx=${this.svg.width / 2} cy="${this.svg.height / 2}"
          />
        `
      : ''
  );
  const renderHourMarks = () => (
    this.config.clock.face?.show_hour_marks === true
      ? svg`
        <circle pathLength=${this.config.clock.face.hour_marks_count}
        class="${classMap(this.classes.clock_face_hour_marks)}" style="${styleMap(this.styles.clock_face_hour_marks)}"
        r="${this.svg.clockface.hourMarksRadius}" cx=${this.svg.width / 2} cy="${this.svg.height / 2}"
        />
       `
      : ''
  );
  // alignment-baseline not working on SVG group tag, so all on svg text
  const renderAbsoluteHourNumbers = () => (
    this.config.clock.face?.show_hour_numbers === 'absolute'
      ? svg`
        <g>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${this.svg.width / 2}" y="${(this.svg.height / 2) - (this.svg.clockface.hourNumbersRadius)}"
            >24</text>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${this.svg.width / 2}" y="${(this.svg.height / 2) + (this.svg.clockface.hourNumbersRadius)}"
            >12</text>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${(this.svg.width / 2) + (this.svg.clockface.hourNumbersRadius)}" y="${(this.svg.height / 2)}"
            >6</text>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${(this.svg.width / 2) - (this.svg.clockface.hourNumbersRadius)}" y="${(this.svg.height / 2)}"
            >18</text>
        </g>`
      : ''
  );
  // Note:
  // alignment-baseline not working on SVG group tag, so all on svg text
  const renderRelativeHourNumbers = () => (
    this.config.clock.face?.show_hour_numbers === 'relative'
      ? svg`
        <g>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${this.svg.width / 2}" y="${(this.svg.height / 2) - (this.svg.clockface.hourNumbersRadius)}"
            >0</text>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${this.svg.width / 2}" y="${(this.svg.height / 2) + (this.svg.clockface.hourNumbersRadius)}"
            >-12</text>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${(this.svg.width / 2) + (this.svg.clockface.hourNumbersRadius)}" y="${(this.svg.height / 2)}"
            >-18</text>
          <text class="${classMap(this.classes.clock_face_hour_numbers)}" style="${styleMap(this.styles.clock_face_hour_numbers)}"
            x="${(this.svg.width / 2) - (this.svg.clockface.hourNumbersRadius)}" y="${(this.svg.height / 2)}"
            >-6</text>

        </g>`
      : ''
  );

  return svg`
    ${renderDayNight()}
    ${renderHourMarks()}
    ${renderAbsoluteHourNumbers()}
    ${renderRelativeHourNumbers()}
  `;
}

// See here: https://pro.arcgis.com/en/pro-app/latest/help/analysis/geoprocessing/charts/data-clock.htm
// for nice naming conventions using ring, wedge and bin!
renderSvgClock(clock, index) {
  if (!clock) return;
  const clockPaths = this.Graph[index].getClockPaths();
  return svg`
    <g class='graph-clock'
      ?tooltip=${this.tooltip.entity === index}
      ?inactive=${this.tooltip.entity !== undefined && this.tooltip.entity !== index}
      ?init=${this.length[index]}
      anim=${this.config.animate && this.config.show.points !== 'hover'}
      style="animation-delay: ${this.config.animate ? `${index * 0.5 + 0.5}s` : '0s'}"
      stroke-width=${this.svg.line_width / 2}>
      ${this.renderSvgClockBackground(this.svg.width / 2)}
      ${clock.map(((bin, i) => this.renderSvgClockBin(bin, clockPaths[i], i)))}
      ${this.renderSvgClockFace(this.svg.width / 2 - 2 * 20)}
    </g>`;
}

// Timeline is wrong name for this type of history graph...
// But what?
// Timeline could get:
// - background rect
// - centerline, to go line. Calculated from timeline.length and x coords to start from
// - helper line 1
// - helper line 2
// - with the two helper lines, user can make a sort of x-axis division stuff. Say 1 full
//   line from start to finish, and one line with a dasharray to make vertical dashes...
//   The two helper lines should have some offset from center to position them!
// - The helper lines should be generic for every graph, altough the clock will ignore them!
// - Add number helpers too? Again max 4? Relative and absolute? Relative this time with
//   calculations? That won't be hard to calculate/display just the hour. Not more!!
renderSvgTimeline(timeline, index) {
  if (!timeline) return;

  console.log('rendertimeline, styles = ', this.styles.helper_line1);
  const paths = timeline.map((timelinePart, i) => {
    // const color = this.computeColor(timelinePart.value, 0);
    const color = this.intColor(timelinePart.value, 0);

    const animation = this.config.animate
      ? svg`
        <animate attributeName='y' from=${this.svg.height} to=${timelinePart.y} dur='1s' fill='remove'
          calcMode='spline' keyTimes='0; 1' keySplines='0.215 0.61 0.355 1'>
        </animate>`
      : '';
    return svg` 
      <rect class=${classMap(this.classes.timeline_graph)}) style="${styleMap(this.styles.timeline_graph)}"
        x=${timelinePart.x} y=${timelinePart.y + (timelinePart.value > 0 ? +this.svg.line_width / 2 : -this.svg.line_width / 2)}
        height=${Math.max(1, timelinePart.height - this.svg.line_width)}
        width=${Math.max(timelinePart.width - this.svg.line_width, 1)}
        fill=${color}
        stroke=${color}
        stroke-width="${this.svg.line_width ? this.svg.line_width : 0}"
        @mouseover=${() => this.setTooltip(index, i, timelinePart.value)}
        @mouseout=${() => (this.tooltip = {})}>
        ${animation}
      </rect>`;
  });
  // stroke="lightgray" stroke-dasharray="0.5, 119" stroke-width="${this.svg.graph.height}"

  const linesBelow = this.xLines.lines.map((helperLine) => {
    if (helperLine.zpos === 'below') {
      return [svg`
        <line class=${classMap(this.classes[helperLine.id])}) style="${styleMap(this.styles[helperLine.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        pathLength="240"
        >
        </line>
        `];
    } else return [''];
  });
  const linesAbove = this.xLines.lines.map((helperLine) => {
    console.log('linesAbove', helperLine);
    if (helperLine.zpos === 'above') {
      return [svg`
        <line class="${classMap(this.classes[helperLine.id])}"
              style="${styleMap(this.styles[helperLine.id])}"
        x1="${this.svg.margin.x}" y1="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        x2="${this.svg.graph.width + this.svg.margin.x}" y2="${this.svg.margin.y + this.svg.graph.height / 2 + helperLine.yshift}"
        pathLength="240"
        >
        </line>
        `];
    } else return [''];
  });
  console.log('renderSvgTimeline, lines', this.helperLines, linesAbove, linesBelow);
  return svg`
    ${linesBelow}
    ${paths}
    ${linesAbove}
  `;
}
// pathLength=24"${this.svg.graph.width / 4}">

renderSvg() {
  this.svg.height - this.svg.margin.y * 0; // * 2;
  this.svg.width - this.svg.margin.x * 0; // * 2;
  this.MergeAnimationClassIfChanged();
  this.MergeAnimationStyleIfChanged();

  return svg`
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
        ${this.fill.map((fill, i) => this.renderSvgAreaMask(fill, i))}
        ${this.fill.map((fill, i) => this.renderSvgAreaBackground(fill, i))}
        ${this.fillMinMax.map((fill, i) => this.renderSvgAreaMinMaxMask(fill, i))}
        ${this.fillMinMax.map((fill, i) => this.renderSvgAreaMinMaxBackground(fill, i))}
        ${this.line.map((line, i) => this.renderSvgLineMask(line, i))}
        ${this.line.map((line, i) => this.renderSvgLineBackground(line, i))}
        ${this.bar.map((bars, i) => this.renderSvgBarsMask(bars, i))}
        ${this.bar.map((bars, i) => this.renderSvgBarsBackground(bars, i))}
        ${this.clock.map((clockPart, i) => this.renderSvgClock(clockPart, i))}
        ${this.equalizer.map((equalizer, i) => this.renderSvgEqualizerMask(equalizer, i))}
        ${this.equalizer.map((equalizer, i) => this.renderSvgEqualizerBackground(equalizer, i))}
        ${this.points.map((points, i) => this.renderSvgPoints(points, i))}
        ${this.timeline.map((timelinePart, i) => this.renderSvgTimeline(timelinePart, i))}
        ${this.trafficLight.map((trafficLights, i) => this.renderSvgTrafficLights(trafficLights, i))}
        </svg>
      </g>
    </svg>`;
}

  updated(changedProperties) {
    if (this.config.animate && changedProperties.has('line')) {
      if (this.length.length < this.entity.length) {
        this._card.shadowRoot.querySelectorAll('svg path.line').forEach((ele) => {
          this.length[ele.id] = ele.getTotalLength();
        });
        this.length = [...this.length];
      } else {
        this.length = Array(this.entity.length).fill('none');
      }
    }
  }

  /** *****************************************************************************
    * SparklineBarChartTool::render()
    *
    * Summary.
    * The actual render() function called by the card for each tool.
    *
    */
  render() {
    return svg`
        <g id="graph-${this.toolId}"
          class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
          @click=${(e) => this.handleTapEvent(e, this.config)}>
          ${this.renderSvg()}
        </g>
      `;
  }
}

/** ****************************************************************************
  * HorseshoeTool class
  *
  * Summary.
  *
  */

class HorseshoeTool extends BaseTool {
  // Donut starts at -220 degrees and is 260 degrees in size.
  // zero degrees is at 3 o'clock.

  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_HORSESHOE_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        radius: 45,
      },
      card_filter: 'card--filter-none',
      horseshoe_scale: {
        min: 0,
        max: 100,
        width: 3,
        color: 'var(--primary-background-color)',
      },
      horseshoe_state: {
        width: 6,
        color: 'var(--primary-color)',
      },
      show: {
        horseshoe: true,
        scale_tickmarks: false,
        horseshoe_style: 'fixed',
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_HORSESHOE_CONFIG, argConfig), argPos);

    // Next consts are now variable. Should be calculated!!!!!!
    this.HORSESHOE_RADIUS_SIZE = 0.45 * SVG_VIEW_BOX;
    this.TICKMARKS_RADIUS_SIZE = 0.43 * SVG_VIEW_BOX;
    this.HORSESHOE_PATH_LENGTH = 2 * 260 / 360 * Math.PI * this.HORSESHOE_RADIUS_SIZE;

    // this.config = {...DEFAULT_HORSESHOE_CONFIG};
    // this.config = {...this.config, ...argConfig};

    // if (argConfig.styles) this.config.styles = {...argConfig.styles};
    // this.config.styles = {...DEFAULT_HORSESHOE_CONFIG.styles, ...this.config.styles};

    // //if (argConfig.show) this.config.show = Object.assign(...argConfig.show);
    // this.config.show = {...DEFAULT_HORSESHOE_CONFIG.show, ...this.config.show};

    // //if (argConfig.horseshoe_scale) this.config.horseshoe_scale = Object.assign(...argConfig.horseshoe_scale);
    // this.config.horseshoe_scale = {...DEFAULT_HORSESHOE_CONFIG.horseshoe_scale, ...this.config.horseshoe_scale};

    // // if (argConfig.horseshoe_state) this.config.horseshoe_state = Object.assign(...argConfig.horseshoe_state);
    // this.config.horseshoe_state = {...DEFAULT_HORSESHOE_CONFIG.horseshoe_state, ...this.config.horseshoe_state};

    this.config.entity_index = this.config.entity_index ? this.config.entity_index : 0;

    this.svg.radius = Utils.calculateSvgDimension(this.config.position.radius);
    this.svg.radius_ticks = Utils.calculateSvgDimension(0.95 * this.config.position.radius);

    this.svg.horseshoe_scale = {};
    this.svg.horseshoe_scale.width = Utils.calculateSvgDimension(this.config.horseshoe_scale.width);
    this.svg.horseshoe_state = {};
    this.svg.horseshoe_state.width = Utils.calculateSvgDimension(this.config.horseshoe_state.width);
    this.svg.horseshoe_scale.dasharray = 2 * 26 / 36 * Math.PI * this.svg.radius;

    // The horseshoe is rotated around its svg base point. This is NOT the center of the circle!
    // Adjust x and y positions within the svg viewport to re-center the circle after rotating
    this.svg.rotate = {};
    this.svg.rotate.degrees = -220;
    this.svg.rotate.cx = this.svg.cx;
    this.svg.rotate.cy = this.svg.cy;

    // Get colorstops and make a key/value store...
    this.colorStops = {};
    if (this.config.color_stops) {
      Object.keys(this.config.color_stops).forEach((key) => {
        this.colorStops[key] = this.config.color_stops[key];
      });
    }

    this.sortedStops = Object.keys(this.colorStops).map((n) => Number(n)).sort((a, b) => a - b);

    // Create a colorStopsMinMax list for autominmax color determination
    this.colorStopsMinMax = {};
    this.colorStopsMinMax[this.config.horseshoe_scale.min] = this.colorStops[this.sortedStops[0]];
    this.colorStopsMinMax[this.config.horseshoe_scale.max] = this.colorStops[this.sortedStops[(this.sortedStops.length) - 1]];

    // Now set the color0 and color1 for the gradient used in the horseshoe to the colors
    // Use default for now!!
    this.color0 = this.colorStops[this.sortedStops[0]];
    this.color1 = this.colorStops[this.sortedStops[(this.sortedStops.length) - 1]];

    this.angleCoords = {
      x1: '0%', y1: '0%', x2: '100%', y2: '0%',
    };
    // this.angleCoords = angleCoords;
    this.color1_offset = '0%';

    //= ===================
    // End setConfig part.

    if (this.dev.debug) console.log('HorseshoeTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  /** *****************************************************************************
  * HorseshoeTool::value()
  *
  * Summary.
  * Sets the value of the horseshoe. Value updated via set hass.
  * Calculate horseshoe settings & colors depening on config and new value.
  *
  */

  set value(state) {
    if (this._stateValue === state) return;

    this._stateValuePrev = this._stateValue || state;
    this._stateValue = state;
    this._stateValueIsDirty = true;

    // Calculate the size of the arc to fill the dasharray with this
    // value. It will fill the horseshoe relative to the state and min/max
    // values given in the configuration.

    const min = this.config.horseshoe_scale.min || 0;
    const max = this.config.horseshoe_scale.max || 100;
    const val = Math.min(Utils.calculateValueBetween(min, max, state), 1);
    const score = val * this.HORSESHOE_PATH_LENGTH;
    const total = 10 * this.HORSESHOE_RADIUS_SIZE;
    this.dashArray = `${score} ${total}`;

    // We must draw the horseshoe. Depending on the stroke settings, we draw a fixed color, gradient, autominmax or colorstop
    // #TODO: only if state or attribute has changed.

    const strokeStyle = this.config.show.horseshoe_style;

    if (strokeStyle === 'fixed') {
      this.stroke_color = this.config.horseshoe_state.color;
      this.color0 = this.config.horseshoe_state.color;
      this.color1 = this.config.horseshoe_state.color;
      this.color1_offset = '0%';
      //  We could set the circle attributes, but we do it with a variable as we are using a gradient
      //  to display the horseshoe circle .. <horseshoe circle>.setAttribute('stroke', stroke);
    } else if (strokeStyle === 'autominmax') {
      // Use color0 and color1 for autoranging the color of the horseshoe
      const stroke = Colors.calculateColor(state, this.colorStopsMinMax, true);

      // We now use a gradient for the horseshoe, using two colors
      // Set these colors to the colorstop color...
      this.color0 = stroke;
      this.color1 = stroke;
      this.color1_offset = '0%';
    } else if (strokeStyle === 'colorstop' || strokeStyle === 'colorstopgradient') {
      const stroke = Colors.calculateColor(state, this.colorStops, strokeStyle === 'colorstopgradient');

      // We now use a gradient for the horseshoe, using two colors
      // Set these colors to the colorstop color...
      this.color0 = stroke;
      this.color1 = stroke;
      this.color1_offset = '0%';
    } else if (strokeStyle === 'lineargradient') {
      // This has taken a lot of time to get a satisfying result, and it appeared much simpler than anticipated.
      // I don't understand it, but for a circle, a gradient from left/right with adjusted stop is enough ?!?!?!
      // No calculations to adjust the angle of the gradient, or rotating the gradient itself.
      // Weird, but it works. Not a 100% match, but it is good enough for now...

      // According to stackoverflow, these calculations / adjustments would be needed, but it isn't ;-)
      // Added from https://stackoverflow.com/questions/9025678/how-to-get-a-rotated-linear-gradient-svg-for-use-as-a-background-image
      const angleCoords = {
        x1: '0%', y1: '0%', x2: '100%', y2: '0%',
      };
      this.color1_offset = `${Math.round((1 - val) * 100)}%`;

      this.angleCoords = angleCoords;
    }
    if (this.dev.debug) console.log('HorseshoeTool set value', this.cardId, state);

    // return true;
  }

  /** *****************************************************************************
  * HorseshoeTool::_renderTickMarks()
  *
  * Summary.
  * Renders the tick marks on the scale.
  *
  */

  _renderTickMarks() {
    const { config } = this;
    // if (!config) return;
    // if (!config.show) return;
    if (!config.show.scale_tickmarks) return;

    const stroke = config.horseshoe_scale.color ? config.horseshoe_scale.color : 'var(--primary-background-color)';
    const tickSize = config.horseshoe_scale.ticksize ? config.horseshoe_scale.ticksize
      : (config.horseshoe_scale.max - config.horseshoe_scale.min) / 10;

    // fullScale is 260 degrees. Hard coded for now...
    const fullScale = 260;
    const remainder = config.horseshoe_scale.min % tickSize;
    const startTickValue = config.horseshoe_scale.min + (remainder === 0 ? 0 : (tickSize - remainder));
    const startAngle = ((startTickValue - config.horseshoe_scale.min)
                        / (config.horseshoe_scale.max - config.horseshoe_scale.min)) * fullScale;
    const tickSteps = ((config.horseshoe_scale.max - startTickValue) / tickSize);

    // new
    let steps = Math.floor(tickSteps);
    const angleStepSize = (fullScale - startAngle) / tickSteps;

    // If steps exactly match the max. value/range, add extra step for that max value.
    if ((Math.floor(((steps) * tickSize) + startTickValue)) <= (config.horseshoe_scale.max)) { steps += 1; }

    const radius = this.svg.horseshoe_scale.width ? this.svg.horseshoe_scale.width / 2 : 6 / 2;
    let angle;
    const scaleItems = [];

    // NTS:
    // Value of -230 is weird. Should be -220. Can't find why...
    let i;
    for (i = 0; i < steps; i++) {
      angle = startAngle + ((-230 + (360 - i * angleStepSize)) * Math.PI / 180);
      scaleItems[i] = svg`
        <circle cx="${this.svg.cx - Math.sin(angle) * this.svg.radius_ticks}"
                cy="${this.svg.cy - Math.cos(angle) * this.svg.radius_ticks}" r="${radius}"
                fill="${stroke}">
      `;
    }
    return svg`${scaleItems}`;
  }

  /** *****************************************************************************
  * HorseshoeTool::_renderHorseShoe()
  *
  * Summary.
  * Renders the horseshoe group.
  *
  * Description.
  * The horseshoes are rendered in a viewbox of 200x200 (SVG_VIEW_BOX).
  * Both are centered with a radius of 45%, ie 200*0.45 = 90.
  *
  * The foreground horseshoe is always rendered as a gradient with two colors.
  *
  * The horseshoes are rotated 220 degrees and are 2 * 26/36 * Math.PI * r in size
  * There you get your value of 408.4070449,180 ;-)
  */

  _renderHorseShoe() {
    if (!this.config.show.horseshoe) return;

    return svg`
      <g id="horseshoe__group-inner" class="horseshoe__group-inner">
        <circle id="horseshoe__scale" class="horseshoe__scale" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          fill="${this.fill || 'rgba(0, 0, 0, 0)'}"
          stroke="${this.config.horseshoe_scale.color || '#000000'}"
          stroke-dasharray="${this.svg.horseshoe_scale.dasharray}"
          stroke-width="${this.svg.horseshoe_scale.width}"
          stroke-linecap="square"
          transform="rotate(-220 ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        <circle id="horseshoe__state__value" class="horseshoe__state__value" cx="${this.svg.cx}" cy="${this.svg.cy}" r="${this.svg.radius}"
          fill="${this.config.fill || 'rgba(0, 0, 0, 0)'}"
          stroke="url('#horseshoe__gradient-${this.cardId}')"
          stroke-dasharray="${this.dashArray}"
          stroke-width="${this.svg.horseshoe_state.width}"
          stroke-linecap="square"
          transform="rotate(-220 ${this.svg.rotate.cx} ${this.svg.rotate.cy})"/>

        ${this._renderTickMarks()}
      </g>
    `;
  }

  /** *****************************************************************************
  * HorseshoeTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <g "" id="horseshoe-${this.toolId}" class="horseshoe__group-outer"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderHorseShoe()}
      </g>

      <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
        <linearGradient gradientTransform="rotate(0)" id="horseshoe__gradient-${this.cardId}" x1="${this.angleCoords.x1}", y1="${this.angleCoords.y1}", x2="${this.angleCoords.x2}" y2="${this.angleCoords.y2}">
          <stop offset="${this.color1_offset}" stop-color="${this.color1}" />
          <stop offset="100%" stop-color="${this.color0}" />
        </linearGradient>
      </svg>

    `;
  }
} // END of class

/** ****************************************************************************
  * LineTool class
  *
  * Summary.
  *
  */

class LineTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_LINE_CONFIG = {
      position: {
        orientation: 'vertical',
        length: '10',
        cx: '50',
        cy: '50',
      },
      classes: {
        tool: {
          'sak-line': true,
          hover: true,
        },
        line: {
          'sak-line__line': true,
        },
      },
      styles: {
        tool: {
        },
        line: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_LINE_CONFIG, argConfig), argPos);

    if (!['horizontal', 'vertical', 'fromto'].includes(this.config.position.orientation))
      throw Error('LineTool::constructor - invalid orientation [vertical, horizontal, fromto] = ', this.config.position.orientation);

    if (['horizontal', 'vertical'].includes(this.config.position.orientation))
      this.svg.length = Utils.calculateSvgDimension(argConfig.position.length);

    if (this.config.position.orientation === 'fromto') {
      this.svg.x1 = Utils.calculateSvgCoordinate(argConfig.position.x1, this.toolsetPos.cx);
      this.svg.y1 = Utils.calculateSvgCoordinate(argConfig.position.y1, this.toolsetPos.cy);
      this.svg.x2 = Utils.calculateSvgCoordinate(argConfig.position.x2, this.toolsetPos.cx);
      this.svg.y2 = Utils.calculateSvgCoordinate(argConfig.position.y2, this.toolsetPos.cy);
    } else if (this.config.position.orientation === 'vertical') {
      this.svg.x1 = this.svg.cx;
      this.svg.y1 = this.svg.cy - this.svg.length / 2;
      this.svg.x2 = this.svg.cx;
      this.svg.y2 = this.svg.cy + this.svg.length / 2;
    } else if (this.config.position.orientation === 'horizontal') {
      this.svg.x1 = this.svg.cx - this.svg.length / 2;
      this.svg.y1 = this.svg.cy;
      this.svg.x2 = this.svg.cx + this.svg.length / 2;
      this.svg.y2 = this.svg.cy;
    }

    this.classes.line = {};
    this.styles.line = {};

    if (this.dev.debug) console.log('LineTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  /** *****************************************************************************
  * LineTool::_renderLine()
  *
  * Summary.
  * Renders the line using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the line
  *
  * @returns  {svg} Rendered line
  *
  */

  _renderLine() {
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.line);

    if (this.dev.debug) console.log('_renderLine', this.config.position.orientation, this.svg.x1, this.svg.y1, this.svg.x2, this.svg.y2);
    return svg`
      <line class="${classMap(this.classes.line)}"
        x1="${this.svg.x1}"
        y1="${this.svg.y1}"
        x2="${this.svg.x2}"
        y2="${this.svg.y2}"
        style="${styleMap(this.styles.line)}"/>
      `;
  }

  /** *****************************************************************************
  * LineTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  * @returns  {svg} Rendered line group
  *
  */
  render() {
    return svg`
      <g id="line-${this.toolId}"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderLine()}
      </g>
    `;
  }
} // END of class

/** ***************************************************************************
  * RangeSliderTool::constructor class
  *
  * Summary.
  *
  */

class RangeSliderTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_RANGESLIDER_CONFIG = {
      descr: 'none',
      position: {
        cx: 50,
        cy: 50,
        orientation: 'horizontal',
        active: {
          width: 0,
          height: 0,
          radius: 0,
        },
        track: {
          width: 16,
          height: 7,
          radius: 3.5,
        },
        thumb: {
          width: 9,
          height: 9,
          radius: 4.5,
          offset: 4.5,
        },
        label: {
          placement: 'none',
        },
      },
      show: {
        uom: 'end',
        active: false,
      },
      classes: {
        tool: {
          'sak-slider': true,
          hover: true,
        },
        capture: {
          'sak-slider__capture': true,
        },
        active: {
          'sak-slider__active': true,
        },
        track: {
          'sak-slider__track': true,
        },
        thumb: {
          'sak-slider__thumb': true,
        },
        label: {
          'sak-slider__value': true,
        },
        uom: {
          'sak-slider__uom': true,
        },
      },
      styles: {
        tool: {
        },
        capture: {
        },
        active: {
        },
        track: {
        },
        thumb: {
        },
        label: {
        },
        uom: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_RANGESLIDER_CONFIG, argConfig), argPos);

    this.svg.activeTrack = {};
    this.svg.activeTrack.radius = Utils.calculateSvgDimension(this.config.position.active.radius);
    this.svg.activeTrack.height = Utils.calculateSvgDimension(this.config.position.active.height);
    this.svg.activeTrack.width = Utils.calculateSvgDimension(this.config.position.active.width);

    this.svg.track = {};
    this.svg.track.radius = Utils.calculateSvgDimension(this.config.position.track.radius);

    this.svg.thumb = {};
    this.svg.thumb.radius = Utils.calculateSvgDimension(this.config.position.thumb.radius);
    this.svg.thumb.offset = Utils.calculateSvgDimension(this.config.position.thumb.offset);

    this.svg.capture = {};

    this.svg.label = {};

    switch (this.config.position.orientation) {
      case 'horizontal':
      case 'vertical':
        this.svg.capture.width = Utils.calculateSvgDimension(this.config.position.capture.width || 1.1 * this.config.position.track.width);
        this.svg.capture.height = Utils.calculateSvgDimension(this.config.position.capture.height || 3 * this.config.position.thumb.height);

        this.svg.track.width = Utils.calculateSvgDimension(this.config.position.track.width);
        this.svg.track.height = Utils.calculateSvgDimension(this.config.position.track.height);

        this.svg.thumb.width = Utils.calculateSvgDimension(this.config.position.thumb.width);
        this.svg.thumb.height = Utils.calculateSvgDimension(this.config.position.thumb.height);

        // x1, y1 = topleft corner
        this.svg.capture.x1 = this.svg.cx - this.svg.capture.width / 2;
        this.svg.capture.y1 = this.svg.cy - this.svg.capture.height / 2;

        // x1, y1 = topleft corner
        this.svg.track.x1 = this.svg.cx - this.svg.track.width / 2;
        this.svg.track.y1 = this.svg.cy - this.svg.track.height / 2;

        // x1, y1 = topleft corner
        this.svg.activeTrack.x1 = (this.config.position.orientation === 'horizontal') ? this.svg.track.x1 : this.svg.cx - this.svg.activeTrack.width / 2;
        this.svg.activeTrack.y1 = this.svg.cy - this.svg.activeTrack.height / 2;
        // this.svg.activeTrack.x1 = this.svg.track.x1;

        this.svg.thumb.x1 = this.svg.cx - this.svg.thumb.width / 2;
        this.svg.thumb.y1 = this.svg.cy - this.svg.thumb.height / 2;
        break;

      default:
        console.error('RangeSliderTool - constructor: invalid orientation [vertical, horizontal] = ', this.config.position.orientation);
        throw Error('RangeSliderTool::constructor - invalid orientation [vertical, horizontal] = ', this.config.position.orientation);
    }

    switch (this.config.position.orientation) {
      case 'vertical':
        this.svg.track.y2 = this.svg.cy + this.svg.track.height / 2;
        this.svg.activeTrack.y2 = this.svg.track.y2;
        break;
    }
    switch (this.config.position.label.placement) {
      case 'position':
        this.svg.label.cx = Utils.calculateSvgCoordinate(this.config.position.label.cx, 0);
        this.svg.label.cy = Utils.calculateSvgCoordinate(this.config.position.label.cy, 0);
        break;

      case 'thumb':
        this.svg.label.cx = this.svg.cx;
        this.svg.label.cy = this.svg.cy;
        break;

      case 'none':
        break;

      default:
        console.error('RangeSliderTool - constructor: invalid label placement [none, position, thumb] = ', this.config.position.label.placement);
        throw Error('RangeSliderTool::constructor - invalid label placement [none, position, thumb] = ', this.config.position.label.placement);
    }

    // Init classes
    this.classes.capture = {};
    this.classes.track = {};
    this.classes.thumb = {};
    this.classes.label = {};
    this.classes.uom = {};

    // Init styles
    this.styles.capture = {};
    this.styles.track = {};
    this.styles.thumb = {};
    this.styles.label = {};
    this.styles.uom = {};

    // Init scale
    this.svg.scale = {};
    this.svg.scale.min = this.valueToSvg(this, this.config.scale.min);
    this.svg.scale.max = this.valueToSvg(this, this.config.scale.max);
    this.svg.scale.step = this.config.scale.step;

    if (this.dev.debug) console.log('RangeSliderTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  /** *****************************************************************************
  * RangeSliderTool::svgCoordinateToSliderValue()
  *
  * Summary.
  * @returns {slider value} Translated svg coordinate to actual slider value
  *
  */

  svgCoordinateToSliderValue(argThis, m) {
    let state;
    let scalePos;
    let xpos;
    let ypos;

    switch (argThis.config.position.orientation) {
      case 'horizontal':
        xpos = m.x - argThis.svg.track.x1 - this.svg.thumb.width / 2;
        scalePos = xpos / (argThis.svg.track.width - this.svg.thumb.width);
        break;

      case 'vertical':
        // y is calculated from lower y value. So slider is from bottom to top...
        ypos = argThis.svg.track.y2 - this.svg.thumb.height / 2 - m.y;
        scalePos = ypos / (argThis.svg.track.height - this.svg.thumb.height);
        break;
    }
    state = ((argThis.config.scale.max - argThis.config.scale.min) * scalePos) + argThis.config.scale.min;
    state = Math.round(state / this.svg.scale.step) * this.svg.scale.step;
    state = Math.max(Math.min(this.config.scale.max, state), this.config.scale.min);

    return state;
  }

  valueToSvg(argThis, argValue) {
    if (argThis.config.position.orientation === 'horizontal') {
      const state = Utils.calculateValueBetween(argThis.config.scale.min, argThis.config.scale.max, argValue);

      const xposp = state * (argThis.svg.track.width - this.svg.thumb.width);
      const xpos = argThis.svg.track.x1 + this.svg.thumb.width / 2 + xposp;
      return xpos;
    } else if (argThis.config.position.orientation === 'vertical') {
      const state = Utils.calculateValueBetween(argThis.config.scale.min, argThis.config.scale.max, argValue);

      const yposp = state * (argThis.svg.track.height - this.svg.thumb.height);
      const ypos = argThis.svg.track.y2 - this.svg.thumb.height / 2 - yposp;
      return ypos;
    }
  }

  updateValue(argThis, m) {
    this._value = this.svgCoordinateToSliderValue(argThis, m);
    // set dist to 0 to cancel animation frame
    const dist = 0;
    // improvement
    if (Math.abs(dist) < 0.01) {
      if (this.rid) {
        window.cancelAnimationFrame(this.rid);
        this.rid = null;
      }
    }
  }

  updateThumb(argThis, m) {
    switch (argThis.config.position.orientation) {
      // eslint-disable-next-line default-case-last
      default:
      case 'horizontal':
        // eslint-disable-next-line no-empty
        if (this.config.position.label.placement === 'thumb') ;

        if (this.dragging) {
          const yUp = (this.config.position.label.placement === 'thumb') ? -50 : 0;
          const yUpStr = `translate(${m.x - this.svg.cx}px , ${yUp}px)`;

          argThis.elements.thumbGroup.style.transform = yUpStr;
        } else {
          argThis.elements.thumbGroup.style.transform = `translate(${m.x - this.svg.cx}px, ${0}px)`;
        }
        break;

      case 'vertical':
        if (this.dragging) {
          const xUp = (this.config.position.label.placement === 'thumb') ? -50 : 0;
          const xUpStr = `translate(${xUp}px, ${m.y - this.svg.cy}px)`;
          argThis.elements.thumbGroup.style.transform = xUpStr;
        } else {
          argThis.elements.thumbGroup.style.transform = `translate(${0}px, ${m.y - this.svg.cy}px)`;
        }
        break;
    }

    argThis.updateLabel(argThis, m);
  }

  updateActiveTrack(argThis, m) {
    if (!argThis.config.show.active) return;

    switch (argThis.config.position.orientation) {
      // eslint-disable-next-line default-case-last
      default:
      case 'horizontal':
        if (this.dragging) {
          argThis.elements.activeTrack.setAttribute('width', Math.abs(this.svg.activeTrack.x1 - m.x + this.svg.cx));
        }
        break;

      case 'vertical':
        if (this.dragging) {
          argThis.elements.activeTrack.setAttribute('y', m.y - this.svg.cy);
          argThis.elements.activeTrack.setAttribute('height', Math.abs(argThis.svg.activeTrack.y2 - m.y + this.svg.cx));
        }
        break;
    }
  }

  updateLabel(argThis, m) {
    if (this.dev.debug) console.log('SLIDER - updateLabel start', m, argThis.config.position.orientation);

    const dec = (this._card.config.entities[this.defaultEntityIndex()].decimals || 0);
    const x = 10 ** dec;
    argThis.labelValue2 = (Math.round(argThis.svgCoordinateToSliderValue(argThis, m) * x) / x).toFixed(dec);

    if (this.config.position.label.placement !== 'none') {
      argThis.elements.label.textContent = argThis.labelValue2;
    }
  }

  /*
  * mouseEventToPoint
  *
  * Translate mouse/touch client window coordinates to SVG window coordinates
  *
  */
  // mouseEventToPoint(e) {
  //   var p = this.elements.svg.createSVGPoint();
  //   p.x = e.touches ? e.touches[0].clientX : e.clientX;
  //   p.y = e.touches ? e.touches[0].clientY : e.clientY;
  //   const ctm = this.elements.svg.getScreenCTM().inverse();
  //   var p = p.matrixTransform(ctm);
  //   return p;
  // }
  mouseEventToPoint(e) {
    let p = this.elements.svg.createSVGPoint();
    p.x = e.touches ? e.touches[0].clientX : e.clientX;
    p.y = e.touches ? e.touches[0].clientY : e.clientY;
    const ctm = this.elements.svg.getScreenCTM().inverse();
    p = p.matrixTransform(ctm);
    return p;
  }

  callDragService() {
    if (typeof this.labelValue2 === 'undefined') return;

    if (this.labelValuePrev !== this.labelValue2) {
      this.labelValuePrev = this.labelValue2;

      this._processTapEvent(
        this._card,
        this._card._hass,
        this.config,
        this.config.user_actions.tap_action,
        this._card.config.entities[this.defaultEntityIndex()]?.entity,
        this.labelValue2,
      );
    }
    if (this.dragging)
      this.timeOutId = setTimeout(() => this.callDragService(), this.config.user_actions.drag_action.update_interval);
  }

  callTapService() {
    if (typeof this.labelValue2 === 'undefined') return;

    if (this.labelValuePrev !== this.labelValue2) {
      this.labelValuePrev = this.labelValue2;

      this._processTapEvent(
        this._card,
        this._card._hass,
        this.config,
        this.config.user_actions?.tap_action,
        this._card.config.entities[this.defaultEntityIndex()]?.entity,
        this.labelValue2,
      );
    }
  }

  // eslint-disable-next-line no-unused-vars
  firstUpdated(changedProperties) {
    // const thisValue = this;
    this.labelValue = this._stateValue;

    // function Frame() {
    //   thisValue.rid = window.requestAnimationFrame(Frame);
    //   thisValue.updateValue(thisValue, thisValue.m);
    //   thisValue.updateThumb(thisValue, thisValue.m);
    //   thisValue.updateActiveTrack(thisValue, thisValue.m);
    // }

    function Frame2() {
      this.rid = window.requestAnimationFrame(Frame2);
      this.updateValue(this, this.m);
      this.updateThumb(this, this.m);
      this.updateActiveTrack(this, this.m);
    }

    function pointerMove(e) {
      let scaleValue;

      e.preventDefault();

      if (this.dragging) {
        this.m = this.mouseEventToPoint(e);

        switch (this.config.position.orientation) {
          case 'horizontal':
            scaleValue = this.svgCoordinateToSliderValue(this, this.m);
            this.m.x = this.valueToSvg(this, scaleValue);
            this.m.x = Math.max(this.svg.scale.min, Math.min(this.m.x, this.svg.scale.max));
            this.m.x = (Math.round(this.m.x / this.svg.scale.step) * this.svg.scale.step);
            break;

          case 'vertical':
            scaleValue = this.svgCoordinateToSliderValue(this, this.m);
            this.m.y = this.valueToSvg(this, scaleValue);
            this.m.y = (Math.round(this.m.y / this.svg.scale.step) * this.svg.scale.step);
            break;
        }
        Frame2.call(this);
      }
    }

    if (this.dev.debug) console.log('slider - firstUpdated');
    this.elements = {};
    this.elements.svg = this._card.shadowRoot.getElementById('rangeslider-'.concat(this.toolId));
    this.elements.capture = this.elements.svg.querySelector('#capture');
    this.elements.track = this.elements.svg.querySelector('#rs-track');
    this.elements.activeTrack = this.elements.svg.querySelector('#active-track');
    this.elements.thumbGroup = this.elements.svg.querySelector('#rs-thumb-group');
    this.elements.thumb = this.elements.svg.querySelector('#rs-thumb');
    this.elements.label = this.elements.svg.querySelector('#rs-label tspan');

    if (this.dev.debug) console.log('slider - firstUpdated svg = ', this.elements.svg, 'path=', this.elements.path, 'thumb=', this.elements.thumb, 'label=', this.elements.label, 'text=', this.elements.text);

    function pointerDown(e) {
      e.preventDefault();

      // @NTS: Keep this comment for later!!
      // Safari: We use mouse stuff for pointerdown, but have to use pointer stuff to make sliding work on Safari. WHY??
      window.addEventListener('pointermove', pointerMove.bind(this), false);
      // eslint-disable-next-line no-use-before-define
      window.addEventListener('pointerup', pointerUp.bind(this), false);

      // @NTS: Keep this comment for later!!
      // Below lines prevent slider working on Safari...
      //
      // window.addEventListener('mousemove', pointerMove.bind(this), false);
      // window.addEventListener('touchmove', pointerMove.bind(this), false);
      // window.addEventListener('mouseup', pointerUp.bind(this), false);
      // window.addEventListener('touchend', pointerUp.bind(this), false);

      const mousePos = this.mouseEventToPoint(e);
      const thumbPos = (this.svg.thumb.x1 + this.svg.thumb.cx);
      if ((mousePos.x > (thumbPos - 10)) && (mousePos.x < (thumbPos + this.svg.thumb.width + 10))) {
        fireEvent(window, 'haptic', 'heavy');
      } else {
        fireEvent(window, 'haptic', 'error');
        return;
      }

      // User is dragging the thumb of the slider!
      this.dragging = true;

      // Check for drag_action. If none specified, or update_interval = 0, don't update while dragging...

      if ((this.config.user_actions?.drag_action) && (this.config.user_actions?.drag_action.update_interval)) {
        if (this.config.user_actions.drag_action.update_interval > 0) {
          this.timeOutId = setTimeout(() => this.callDragService(), this.config.user_actions.drag_action.update_interval);
        } else {
          this.timeOutId = null;
        }
      }
      this.m = this.mouseEventToPoint(e);

      if (this.config.position.orientation === 'horizontal') {
        this.m.x = (Math.round(this.m.x / this.svg.scale.step) * this.svg.scale.step);
      } else {
        this.m.y = (Math.round(this.m.y / this.svg.scale.step) * this.svg.scale.step);
      }
      if (this.dev.debug) console.log('pointerDOWN', Math.round(this.m.x * 100) / 100);
      Frame2.call(this);
    }

    function pointerUp(e) {
      e.preventDefault();

      // @NTS: Keep this comment for later!!
      // Safari: Fixes unable to grab pointer
      window.removeEventListener('pointermove', pointerMove.bind(this), false);
      window.removeEventListener('pointerup', pointerUp.bind(this), false);

      window.removeEventListener('mousemove', pointerMove.bind(this), false);
      window.removeEventListener('touchmove', pointerMove.bind(this), false);
      window.removeEventListener('mouseup', pointerUp.bind(this), false);
      window.removeEventListener('touchend', pointerUp.bind(this), false);

      if (!this.dragging) return;

      this.dragging = false;
      clearTimeout(this.timeOutId);
      this.target = 0;
      if (this.dev.debug) console.log('pointerUP');
      Frame2.call(this);
      this.callTapService();
    }

    // @NTS: Keep this comment for later!!
    // For things to work in Safari, we need separate touch and mouse down handlers...
    // DON't ask WHY! The pointerdown method prevents listening on window events later on.
    // ie, we can't move our finger

    // this.elements.svg.addEventListener("pointerdown", pointerDown.bind(this), false);

    this.elements.svg.addEventListener('touchstart', pointerDown.bind(this), false);
    this.elements.svg.addEventListener('mousedown', pointerDown.bind(this), false);
  }

  /** *****************************************************************************
  * RangeSliderTool::value()
  *
  * Summary.
  * Receive new state data for the entity this rangeslider is linked to. Called from set hass;
  * Sets the brightness value of the slider. This is a value 0..255. We display %, so translate
  *
  */
  set value(state) {
    super.value = state;
    if (!this.dragging) this.labelValue = this._stateValue;
  }

  _renderUom() {
    if (this.config.show.uom === 'none') {
      return svg``;
    } else {
      this.MergeAnimationStyleIfChanged();
      this.MergeColorFromState(this.styles.uom);

      let fsuomStr = this.styles.label['font-size'];

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
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="1.5em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else if (this.config.show.uom === 'top') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="-1.5em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else {
        return svg`
          <tspan class="${classMap(this.classes.uom)}"  dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ERRR</tspan>
        `;
      }
    }
  }

  /** *****************************************************************************
  * RangeSliderTool::_renderRangeSlider()
  *
  * Summary.
  * Renders the range slider
  *
  */

  _renderRangeSlider() {
    if (this.dev.debug) console.log('slider - _renderRangeSlider');

    this.MergeAnimationClassIfChanged();
    // this.MergeColorFromState(this.styles);
    // this.MergeAnimationStyleIfChanged(this.styles);
    // this.MergeColorFromState(this.styles);

    this.MergeColorFromState();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState();

    // this.MergeAnimationStyleIfChanged();
    // console.log("renderRangeSlider, styles", this.styles);

    this.renderValue = this._stateValue;
    if (this.dragging) {
      this.renderValue = this.labelValue2;
    } else if (this.elements?.label) this.elements.label.textContent = this.renderValue;

    // Calculate cx and cy: the relative move of the thumb from the center of the track
    let cx; let
      cy;
    switch (this.config.position.label.placement) {
      case 'none':
        this.styles.label.display = 'none';
        this.styles.uom.display = 'none';
        break;
      case 'position':
        cx = (this.config.position.orientation === 'horizontal'
          ? this.valueToSvg(this, Number(this.renderValue)) - this.svg.cx
          : 0);
        cy = (this.config.position.orientation === 'vertical'
          ? this.valueToSvg(this, Number(this.renderValue)) - this.svg.cy
          : 0);
        break;

      case 'thumb':
        cx = (this.config.position.orientation === 'horizontal'
          ? -this.svg.label.cx + this.valueToSvg(this, Number(this.renderValue))
          : 0);
        cy = (this.config.position.orientation === 'vertical'
          ? this.valueToSvg(this, Number(this.renderValue))
          : 0);
        // eslint-disable-next-line no-unused-expressions
        if (this.dragging) { (this.config.position.orientation === 'horizontal') ? cy -= 50 : cx -= 50; }
        break;

      default:
        console.error('_renderRangeSlider(), invalid label placement', this.config.position.label.placement);
    }
    this.svg.thumb.cx = cx;
    this.svg.thumb.cy = cy;

    function renderActiveTrack() {
      if (!this.config.show.active) return svg``;

      if (this.config.position.orientation === 'horizontal') {
        return svg`
          <rect id="active-track" class="${classMap(this.classes.active)}" x="${this.svg.activeTrack.x1}" y="${this.svg.activeTrack.y1}"
            width="${Math.abs(this.svg.thumb.x1 - this.svg.activeTrack.x1 + cx + this.svg.thumb.width / 2)}" height="${this.svg.activeTrack.height}" rx="${this.svg.activeTrack.radius}"
            style="${styleMap(this.styles.active)}" touch-action="none"
          />`;
      } else {
        return svg`
          <rect id="active-track" class="${classMap(this.classes.active)}" x="${this.svg.activeTrack.x1}" y="${cy}"
            height="${Math.abs(this.svg.activeTrack.y1 + cy - this.svg.thumb.height)}" width="${this.svg.activeTrack.width}" rx="${this.svg.activeTrack.radius}"
            style="${styleMap(this.styles.active)}"
          />`;
      }
    }

    function renderLabel(argGroup) {
      if ((this.config.position.label.placement === 'thumb') && argGroup) {
        return svg`
      <text id="rs-label">
        <tspan class="${classMap(this.classes.label)}" x="${this.svg.label.cx}" y="${this.svg.label.cy}" style="${styleMap(this.styles.label)}">
        ${this.renderValue}</tspan>
        ${this._renderUom()}
        </text>
        `;
      }

      if ((this.config.position.label.placement === 'position') && !argGroup) {
        return svg`
          <text id="rs-label" style="transform-origin:center;transform-box: fill-box;">
            <tspan class="${classMap(this.classes.label)}" data-placement="position" x="${this.svg.label.cx}" y="${this.svg.label.cy}"
            style="${styleMap(this.styles.label)}">${this.renderValue ? this.renderValue : ''}</tspan>
            ${this.renderValue ? this._renderUom() : ''}
          </text>
          `;
      }
    }

    function renderThumbGroup() {
      return svg`
        <g id="rs-thumb-group" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}" style="transform:translate(${cx}px, ${cy}px);">
          <g style="transform-origin:center;transform-box: fill-box;">
            <rect id="rs-thumb" class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
              width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
              style="${styleMap(this.styles.thumb)}"
            />
            </g>
            ${renderLabel.call(this, true)} 
        </g>
      `;
    }

    const svgItems = [];
    svgItems.push(svg`
      <rect id="capture" class="${classMap(this.classes.capture)}" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}"
      width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.track.radius}"          
      />

      <rect id="rs-track" class="${classMap(this.classes.track)}" x="${this.svg.track.x1}" y="${this.svg.track.y1}"
        width="${this.svg.track.width}" height="${this.svg.track.height}" rx="${this.svg.track.radius}"
        style="${styleMap(this.styles.track)}"
      />

      ${renderActiveTrack.call(this)}
      ${renderThumbGroup.call(this)}
      ${renderLabel.call(this, false)}


      `);

    return svgItems;
  }

  /** *****************************************************************************
  * RangeSliderTool::render()
  *
  * Summary.
  * The render() function for this object. The conversion of pointer events need
  * an SVG as grouping object!
  *
  * NOTE:
  * It is imperative that the style overflow=visible is set on the svg.
  * The weird thing is that if using an svg as grouping object, AND a class, the overflow=visible
  * seems to be ignored by both chrome and safari. If the overflow=visible is directly set as style,
  * the setting works.
  *
  * Works on svg with direct styling:
  * ---
  *  return svg`
  *    <svg xmlns="http://www.w3.org/2000/svg" id="rangeslider-${this.toolId}"
  *      pointer-events="all" overflow="visible"
  *    >
  *      ${this._renderRangeSlider()}
  *    </svg>
  *  `;
  *
  * Does NOT work on svg with class styling:
  * ---
  *  return svg`
  *    <svg xmlns="http://www.w3.org/2000/svg" id="rangeslider-${this.toolId}" class="${classMap(this.classes.tool)}"
  *    >
  *      ${this._renderRangeSlider()}
  *    </svg>
  *  `;
  * where the class has the overflow=visible setting...
  *
  */
  render() {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" id="rangeslider-${this.toolId}" overflow="visible"
        touch-action="none" style="touch-action:none; pointer-events:none;"
      >
        ${this._renderRangeSlider()}
      </svg>
    `;
  }
} // END of class

/** ****************************************************************************
  * RectangleTool class
  *
  * Summary.
  *
  */

class RectangleTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_RECTANGLE_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        width: 50,
        height: 50,
        rx: 0,
      },
      classes: {
        tool: {
          'sak-rectangle': true,
          hover: true,
        },
        rectangle: {
          'sak-rectangle__rectangle': true,
        },
      },
      styles: {
        rectangle: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_RECTANGLE_CONFIG, argConfig), argPos);
    this.svg.rx = argConfig.position.rx ? Utils.calculateSvgDimension(argConfig.position.rx) : 0;

    this.classes.rectangle = {};
    this.styles.rectangle = {};

    if (this.dev.debug) console.log('RectangleTool constructor config, svg', this.toolId, this.config, this.svg);
  }

  /** *****************************************************************************
  * RectangleTool::value()
  *
  * Summary.
  * Receive new state data for the entity this rectangle is linked to. Called from set hass;
  *
  */
  set value(state) {
    super.value = state;
  }

  /** *****************************************************************************
  * RectangleTool::_renderRectangle()
  *
  * Summary.
  * Renders the circle using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the circle
  *
  */

  _renderRectangle() {
    this.MergeAnimationClassIfChanged();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.rectangle);

    return svg`
      <rect class="${classMap(this.classes.rectangle)}"
        x="${this.svg.x}" y="${this.svg.y}" width="${this.svg.width}" height="${this.svg.height}" rx="${this.svg.rx}"
        style="${styleMap(this.styles.rectangle)}"/>
      `;
  }

  /** *****************************************************************************
  * RectangleTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <g id="rectangle-${this.toolId}" class="${classMap(this.classes.tool)}" transform-origin="${this.svg.cx}px ${this.svg.cy}px"
        style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderRectangle()}
      </g>
    `;
  }
} // END of class

/** ****************************************************************************
  * RectangleToolEx class
  *
  * Summary.
  *
  */

class RectangleToolEx extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_RECTANGLEEX_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        width: 50,
        height: 50,
        radius: {
          all: 0,
        },
      },
      classes: {
        tool: {
          'sak-rectex': true,
          hover: true,
        },
        rectex: {
          'sak-rectex__rectex': true,
        },
      },
      styles: {
        tool: {
        },
        rectex: {
        },
      },
    };
    super(argToolset, Merge.mergeDeep(DEFAULT_RECTANGLEEX_CONFIG, argConfig), argPos);

    this.classes.tool = {};
    this.classes.rectex = {};

    this.styles.tool = {};
    this.styles.rectex = {};

    // #TODO:
    // Verify max radius, or just let it go, and let the user handle that right value.
    // A q can be max height of rectangle, ie both corners added must be less than the height, but also less then the width...

    const maxRadius = Math.min(this.svg.height, this.svg.width) / 2;
    let radius = 0;
    radius = Utils.calculateSvgDimension(this.config.position.radius.all);
    this.svg.radiusTopLeft = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
      this.config.position.radius.top_left || this.config.position.radius.left || this.config.position.radius.top || radius,
    ))) || 0;

    this.svg.radiusTopRight = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
      this.config.position.radius.top_right || this.config.position.radius.right || this.config.position.radius.top || radius,
    ))) || 0;

    this.svg.radiusBottomLeft = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
      this.config.position.radius.bottom_left || this.config.position.radius.left || this.config.position.radius.bottom || radius,
    ))) || 0;

    this.svg.radiusBottomRight = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
      this.config.position.radius.bottom_right || this.config.position.radius.right || this.config.position.radius.bottom || radius,
    ))) || 0;

    if (this.dev.debug) console.log('RectangleToolEx constructor config, svg', this.toolId, this.config, this.svg);
  }

  /** *****************************************************************************
  * RectangleToolEx::value()
  *
  */
  set value(state) {
    super.value = state;
  }

  /** *****************************************************************************
  * RectangleToolEx::_renderRectangleEx()
  *
  * Summary.
  * Renders the rectangle using lines and bezier curves with precalculated coordinates and dimensions.
  *
  * Refs for creating the path online:
  * - https://mavo.io/demos/svgpath/
  *
  */

  _renderRectangleEx() {
    this.MergeAnimationClassIfChanged();

    // WIP
    this.MergeAnimationStyleIfChanged(this.styles);
    this.MergeAnimationStyleIfChanged();
    if (this.config.hasOwnProperty('csnew')) {
      this.MergeColorFromState2(this.styles.rectex, 'rectex');
    } else {
      this.MergeColorFromState(this.styles.rectex);
    }

    if (!this.counter) { this.counter = 0; }
    this.counter += 1;

    const svgItems = svg`
      <g class="${classMap(this.classes.rectex)}" id="rectex-${this.toolId}">
        <path  d="
            M ${this.svg.x + this.svg.radiusTopLeft} ${this.svg.y}
            h ${this.svg.width - this.svg.radiusTopLeft - this.svg.radiusTopRight}
            q ${this.svg.radiusTopRight} 0 ${this.svg.radiusTopRight} ${this.svg.radiusTopRight}
            v ${this.svg.height - this.svg.radiusTopRight - this.svg.radiusBottomRight}
            q 0 ${this.svg.radiusBottomRight} -${this.svg.radiusBottomRight} ${this.svg.radiusBottomRight}
            h -${this.svg.width - this.svg.radiusBottomRight - this.svg.radiusBottomLeft}
            q -${this.svg.radiusBottomLeft} 0 -${this.svg.radiusBottomLeft} -${this.svg.radiusBottomLeft}
            v -${this.svg.height - this.svg.radiusBottomLeft - this.svg.radiusTopLeft}
            q 0 -${this.svg.radiusTopLeft} ${this.svg.radiusTopLeft} -${this.svg.radiusTopLeft}
            "
            counter="${this.counter}" 
            style="${styleMap(this.styles.rectex)}"/>
      </g>
      `;
    return svg`${svgItems}`;
  }

  /** *****************************************************************************
  * RectangleToolEx::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <g id="rectex-${this.toolId}"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderRectangleEx()}
      </g>
    `;
  }
} // END of class

/** ****************************************************************************
  * RegPolyTool class
  *
  * Summary.
  *
  */

class RegPolyTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_REGPOLY_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        radius: 50,
        side_count: 6,
        side_skip: 1,
        angle_offset: 0,
      },
      classes: {
        tool: {
          'sak-polygon': true,
          hover: true,
        },
        regpoly: {
          'sak-polygon__regpoly': true,
        },
      },
      styles: {
        tool: {
        },
        regpoly: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_REGPOLY_CONFIG, argConfig), argPos);

    this.svg.radius = Utils.calculateSvgDimension(argConfig.position.radius);

    this.classes.regpoly = {};
    this.styles.regpoly = {};
    if (this.dev.debug) console.log('RegPolyTool constructor config, svg', this.toolId, this.config, this.svg);
  }

  /** *****************************************************************************
  * RegPolyTool::value()
  *
  * Summary.
  * Receive new state data for the entity this circle is linked to. Called from set hass;
  *
  */
  set value(state) {
    super.value = state;
  }

  /** *****************************************************************************
  * RegPolyTool::_renderRegPoly()
  *
  * Summary.
  * Renders the regular polygon using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the regular polygon
  *
  */

  _renderRegPoly() {
    const generatePoly = function (p, q, r, a, cx, cy) {
      const base_angle = 2 * Math.PI / p;
      let angle = a + base_angle;
      let x; let y; let
        d_attr = '';

      for (let i = 0; i < p; i++) {
        angle += q * base_angle;

        // Use ~~ as it is faster then Math.floor()
        x = cx + ~~(r * Math.cos(angle));
        y = cy + ~~(r * Math.sin(angle));

        d_attr
          += `${((i === 0) ? 'M' : 'L') + x} ${y} `;

        if (i * q % p === 0 && i > 0) {
          angle += base_angle;
          x = cx + ~~(r * Math.cos(angle));
          y = cy + ~~(r * Math.sin(angle));

          d_attr += `M${x} ${y} `;
        }
      }

      d_attr += 'z';
      return d_attr;
    };

    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState(this.styles.regpoly);

    return svg`
      <path class="${classMap(this.classes.regpoly)}"
        d="${generatePoly(this.config.position.side_count, this.config.position.side_skip, this.svg.radius, this.config.position.angle_offset, this.svg.cx, this.svg.cy)}"
        style="${styleMap(this.styles.regpoly)}"
      />
      `;
  }

  /** *****************************************************************************
  * RegPolyTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  //        @click=${e => this._card.handlePopup(e, this._card.entities[this.defaultEntityIndex()])} >

  render() {
    return svg`
      <g "" id="regpoly-${this.toolId}" class="${classMap(this.classes.tool)}" transform-origin="${this.svg.cx} ${this.svg.cy}"
        style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderRegPoly()}
      </g>
    `;
  }
} // END of class

/** *****************************************************************************
  * SegmentedArcTool class
  *
  * Summary.
  *
  */

class SegmentedArcTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_SEGARC_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        radius: 45,
        width: 3,
        margin: 1.5,
      },
      color: 'var(--primary-color)',
      classes: {
        tool: {
          'sak-segarc': true,
        },
        foreground: {
        },
        background: {
        },
      },
      styles: {
        tool: {
        },
        foreground: {
        },
        background: {
        },
      },
      segments: {},
      colorstops: [],
      scale: {
        min: 0,
        max: 100,
        width: 2,
        offset: -3.5,
      },
      show: {
        style: 'fixedcolor',
        scale: false,
      },
      isScale: false,
      animation: {
        duration: 1.5,
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_SEGARC_CONFIG, argConfig), argPos);

    if (this.dev.performance) console.time(`--> ${this.toolId} PERFORMANCE SegmentedArcTool::constructor`);

    this.svg.radius = Utils.calculateSvgDimension(argConfig.position.radius);
    this.svg.radiusX = Utils.calculateSvgDimension(argConfig.position.radius_x || argConfig.position.radius);
    this.svg.radiusY = Utils.calculateSvgDimension(argConfig.position.radius_y || argConfig.position.radius);

    this.svg.segments = {};
    // #TODO:
    // Get gap from colorlist, colorstop or something else. Not from the default segments gap.
    this.svg.segments.gap = Utils.calculateSvgDimension(this.config.segments.gap);
    this.svg.scale_offset = Utils.calculateSvgDimension(this.config.scale.offset);

    // Added for confusion???????
    this._firstUpdatedCalled = false;

    // Remember the values to be able to render from/to
    this._stateValue = null;
    this._stateValuePrev = null;
    this._stateValueIsDirty = false;
    this._renderFrom = null;
    this._renderTo = null;

    this.rAFid = null;
    this.cancelAnimation = false;

    this.arcId = null;

    // Cache path (d= value) of segments drawn in map by segment index (counter). Simple array.
    this._cache = [];

    this._segmentAngles = [];
    this._segments = {};

    // Precalculate segments with start and end angle!
    this._arc = {};
    this._arc.size = Math.abs(this.config.position.end_angle - this.config.position.start_angle);
    this._arc.clockwise = this.config.position.end_angle > this.config.position.start_angle;
    this._arc.direction = this._arc.clockwise ? 1 : -1;

    let tcolorlist = {};
    let colorlist = null;
    // New template testing for colorstops
    if (this.config.segments.colorlist?.template) {
      colorlist = this.config.segments.colorlist;
      if (this._card.lovelace.config.sak_user_templates.templates[colorlist.template.name]) {
        if (this.dev.debug) console.log('SegmentedArcTool::constructor - templates colorlist found', colorlist.template.name);
        tcolorlist = Templates.replaceVariables2(colorlist.template.variables, this._card.lovelace.config.sak_user_templates.templates[colorlist.template.name]);
        this.config.segments.colorlist = tcolorlist;
      }
    }

    // FIXEDCOLOR
    if (this.config.show.style === 'fixedcolor') ; else if (this.config.show.style === 'colorlist') {
      // Get number of segments, and their size in degrees.
      this._segments.count = this.config.segments.colorlist.colors.length;
      this._segments.size = this._arc.size / this._segments.count;
      this._segments.gap = (this.config.segments.colorlist.gap !== 'undefined') ? this.config.segments.colorlist.gap : 1;
      this._segments.sizeList = [];
      for (var i = 0; i < this._segments.count; i++) {
        this._segments.sizeList[i] = this._segments.size;
      }

      // Use a running total for the size of the segments...
      var segmentRunningSize = 0;
      for (var i = 0; i < this._segments.count; i++) {
        this._segmentAngles[i] = {
          boundsStart: this.config.position.start_angle + (segmentRunningSize * this._arc.direction),
          boundsEnd: this.config.position.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction),
          drawStart: this.config.position.start_angle + (segmentRunningSize * this._arc.direction) + (this._segments.gap * this._arc.direction),
          drawEnd: this.config.position.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction) - (this._segments.gap * this._arc.direction),
        };
        segmentRunningSize += this._segments.sizeList[i];
      }

      if (this.dev.debug) console.log('colorstuff - COLORLIST', this._segments, this._segmentAngles);

    // COLORSTOPS
    } else if (this.config.show.style === 'colorstops') {
      // Get colorstops, remove outliers and make a key/value store...

      this._segments.colorStops = {};
      Object.keys(this.config.segments.colorstops.colors).forEach((key) => {
        if ((key >= this.config.scale.min)
              && (key <= this.config.scale.max))
          this._segments.colorStops[key] = this.config.segments.colorstops.colors[key];
      });

      this._segments.sortedStops = Object.keys(this._segments.colorStops).map((n) => Number(n)).sort((a, b) => a - b);

      // Insert extra stopcolor for max scale if not defined. Otherwise color calculations won't work as expected...
      if (typeof (this._segments.colorStops[this.config.scale.max]) === 'undefined') {
        this._segments.colorStops[this.config.scale.max] = this._segments.colorStops[this._segments.sortedStops[this._segments.sortedStops.length - 1]];
        this._segments.sortedStops = Object.keys(this._segments.colorStops).map((n) => Number(n)).sort((a, b) => a - b);
      }

      this._segments.count = this._segments.sortedStops.length - 1;
      this._segments.gap = this.config.segments.colorstops.gap !== 'undefined' ? this.config.segments.colorstops.gap : 1;

      // Now depending on the colorstops and min/max values, calculate the size of each segment relative to the total arc size.
      // First color in the list starts from Min!

      let runningColorStop = this.config.scale.min;
      const scaleRange = this.config.scale.max - this.config.scale.min;
      this._segments.sizeList = [];
      for (var i = 0; i < this._segments.count; i++) {
        const colorSize = this._segments.sortedStops[i + 1] - runningColorStop;
        runningColorStop += colorSize;
        // Calculate fraction [0..1] of colorSize of min/max scale range
        const fraction = colorSize / scaleRange;
        const angleSize = fraction * this._arc.size;
        this._segments.sizeList[i] = angleSize;
      }

      // Use a running total for the size of the segments...
      var segmentRunningSize = 0;
      for (var i = 0; i < this._segments.count; i++) {
        this._segmentAngles[i] = {
          boundsStart: this.config.position.start_angle + (segmentRunningSize * this._arc.direction),
          boundsEnd: this.config.position.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction),
          drawStart: this.config.position.start_angle + (segmentRunningSize * this._arc.direction) + (this._segments.gap * this._arc.direction),
          drawEnd: this.config.position.start_angle + ((segmentRunningSize + this._segments.sizeList[i]) * this._arc.direction) - (this._segments.gap * this._arc.direction),
        };
        segmentRunningSize += this._segments.sizeList[i];
        if (this.dev.debug) console.log('colorstuff - COLORSTOPS++ segments', segmentRunningSize, this._segmentAngles[i]);
      }

      if (this.dev.debug) console.log('colorstuff - COLORSTOPS++', this._segments, this._segmentAngles, this._arc.direction, this._segments.count);

    // SIMPLEGRADIENT
    } else if (this.config.show.style === 'simplegradient') ;

    // Just dump to console for verification. Nothing is used yet of the new calculation method...

    if (this.config.isScale) {
      this._stateValue = this.config.scale.max;
      // this.config.show.scale = false;
    } else {
      // Nope. I'm the main arc. Check if a scale is defined and clone myself with some options...
      if (this.config.show.scale) {
        const scaleConfig = Merge.mergeDeep(this.config);
        scaleConfig.id += '-scale';

        // Cloning done. Now set specific scale options.
        scaleConfig.show.scale = false;
        scaleConfig.isScale = true;
        scaleConfig.position.width = this.config.scale.width;
        scaleConfig.position.radius = this.config.position.radius - (this.config.position.width / 2) + (scaleConfig.position.width / 2) + (this.config.scale.offset);
        scaleConfig.position.radius_x = ((this.config.position.radius_x || this.config.position.radius)) - (this.config.position.width / 2) + (scaleConfig.position.width / 2) + (this.config.scale.offset);
        scaleConfig.position.radius_y = ((this.config.position.radius_y || this.config.position.radius)) - (this.config.position.width / 2) + (scaleConfig.position.width / 2) + (this.config.scale.offset);

        this._segmentedArcScale = new SegmentedArcTool(this, scaleConfig, argPos);
      } else {
        this._segmentedArcScale = null;
      }
    }

    // testing. use below two lines and sckip the calculation of the segmentAngles. Those are done above with different calculation...
    this.skipOriginal = ((this.config.show.style === 'colorstops') || (this.config.show.style === 'colorlist'));

    // Set scale to new value. Never changes of course!!
    if (this.skipOriginal) {
      if (this.config.isScale) this._stateValuePrev = this._stateValue;
      this._initialDraw = false;
    }

    this._arc.parts = Math.floor(this._arc.size / Math.abs(this.config.segments.dash));
    this._arc.partsPartialSize = this._arc.size - (this._arc.parts * this.config.segments.dash);

    if (this.skipOriginal) {
      this._arc.parts = this._segmentAngles.length;
      this._arc.partsPartialSize = 0;
    } else {
      for (var i = 0; i < this._arc.parts; i++) {
        this._segmentAngles[i] = {
          boundsStart: this.config.position.start_angle + (i * this.config.segments.dash * this._arc.direction),
          boundsEnd: this.config.position.start_angle + ((i + 1) * this.config.segments.dash * this._arc.direction),
          drawStart: this.config.position.start_angle + (i * this.config.segments.dash * this._arc.direction) + (this.config.segments.gap * this._arc.direction),
          drawEnd: this.config.position.start_angle + ((i + 1) * this.config.segments.dash * this._arc.direction) - (this.config.segments.gap * this._arc.direction),
        };
      }
      if (this._arc.partsPartialSize > 0) {
        this._segmentAngles[i] = {
          boundsStart: this.config.position.start_angle + (i * this.config.segments.dash * this._arc.direction),
          boundsEnd: this.config.position.start_angle + ((i + 0) * this.config.segments.dash * this._arc.direction)
                                          + (this._arc.partsPartialSize * this._arc.direction),

          drawStart: this.config.position.start_angle + (i * this.config.segments.dash * this._arc.direction) + (this.config.segments.gap * this._arc.direction),
          drawEnd: this.config.position.start_angle + ((i + 0) * this.config.segments.dash * this._arc.direction)
                                          + (this._arc.partsPartialSize * this._arc.direction) - (this.config.segments.gap * this._arc.direction),
        };
      }
    }

    this.starttime = null;

    if (this.dev.debug) console.log('SegmentedArcTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
    if (this.dev.debug) console.log('SegmentedArcTool - init', this.toolId, this.config.isScale, this._segmentAngles);

    if (this.dev.performance) console.timeEnd(`--> ${this.toolId} PERFORMANCE SegmentedArcTool::constructor`);
  }

  // SegmentedArcTool::objectId
  get objectId() {
    return this.toolId;
  }

  // SegmentedArcTool::value
  set value(state) {
    if (this.dev.debug) console.log('SegmentedArcTool - set value IN');

    if (this.config.isScale) return false;

    if (this._stateValue === state) return false;

    const changed = super.value = state;

    return changed;
  }

  // SegmentedArcTool::firstUpdated
  // Me is updated. Get arc id for animations...
  firstUpdated(changedProperties) {
    if (this.dev.debug) console.log('SegmentedArcTool - firstUpdated IN with _arcId/id', this._arcId, this.toolId, this.config.isScale);
    this._arcId = this._card.shadowRoot.getElementById('arc-'.concat(this.toolId));

    this._firstUpdatedCalled = true;

    // Just a try.
    //
    // was this a bug. The scale was never called with updated. Hence always no arcId...
    this._segmentedArcScale?.firstUpdated(changedProperties);

    if (this.skipOriginal) {
      if (this.dev.debug) console.log('RENDERNEW - firstUpdated IN with _arcId/id/isScale/scale/connected', this._arcId, this.toolId, this.config.isScale, this._segmentedArcScale, this._card.connected);
      if (!this.config.isScale) this._stateValuePrev = null;
      this._initialDraw = true;
      this._card.requestUpdate();
    }
  }

  // SegmentedArcTool::updated

  // eslint-disable-next-line no-unused-vars
  updated(changedProperties) {
    if (this.dev.debug) console.log('SegmentedArcTool - updated IN');
  }

  // SegmentedArcTool::render

  render() {
    if (this.dev.debug) console.log('SegmentedArcTool RENDERNEW - Render IN');
    return svg`
      <g "" id="arc-${this.toolId}"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
      >
        <g >
          ${this._renderSegments()}
          </g>
        ${this._renderScale()}
      </g>
    `;
  }

  _renderScale() {
    if (this._segmentedArcScale) return this._segmentedArcScale.render();
  }

  _renderSegments() {
    // migrate to new solution to draw segmented arc...

    if (this.skipOriginal) {
      // Here we can rebuild all needed. Much will be the same I guess...

      let arcEnd;
      let arcEndPrev;
      const arcWidth = this.svg.width;
      const arcRadiusX = this.svg.radiusX;
      const arcRadiusY = this.svg.radiusY;

      let d;

      if (this.dev.debug) console.log('RENDERNEW - IN _arcId, firstUpdatedCalled', this._arcId, this._firstUpdatedCalled);
      // calculate real end angle depending on value set in object and min/max scale
      const val = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, this._stateValue);
      const valPrev = Utils.calculateValueBetween(this.config.scale.min, this.config.scale.max, this._stateValuePrev);
      if (this.dev.debug) if (!this._stateValuePrev) console.log('*****UNDEFINED', this._stateValue, this._stateValuePrev, valPrev);
      if (val !== valPrev) if (this.dev.debug) console.log('RENDERNEW _renderSegments diff value old new', this.toolId, valPrev, val);

      arcEnd = (val * this._arc.size * this._arc.direction) + this.config.position.start_angle;
      arcEndPrev = (valPrev * this._arc.size * this._arc.direction) + this.config.position.start_angle;

      const svgItems = [];

      // NO background needed for drawing scale...
      if (!this.config.isScale) {
        for (let k = 0; k < this._segmentAngles.length; k++) {
          d = this.buildArcPath(
            this._segmentAngles[k].drawStart,
            this._segmentAngles[k].drawEnd,
            this._arc.clockwise,
            this.svg.radiusX,
            this.svg.radiusY,
            this.svg.width,
          );

          svgItems.push(svg`<path id="arc-segment-bg-${this.toolId}-${k}" class="sak-segarc__background"
                              style="${styleMap(this.config.styles.background)}"
                              d="${d}"
                              />`);
        }
      }

      // Check if arcId does exist
      if (this._firstUpdatedCalled) {
        //      if ((this._arcId)) {
        if (this.dev.debug) console.log('RENDERNEW _arcId DOES exist', this._arcId, this.toolId, this._firstUpdatedCalled);

        // Render current from cache
        this._cache.forEach((item, index) => {
          d = item;

          // extra, set color from colorlist as a test
          if (this.config.isScale) {
            let fill = this.config.color;
            if (this.config.show.style === 'colorlist') {
              fill = this.config.segments.colorlist.colors[index];
            }
            if (this.config.show.style === 'colorstops') {
              fill = this._segments.colorStops[this._segments.sortedStops[index]];
              // stroke = this.config.segments.colorstops.stroke ? this._segments.colorStops[this._segments.sortedStops[index]] : '';
            }

            if (!this.styles.foreground[index]) {
              this.styles.foreground[index] = Merge.mergeDeep(this.config.styles.foreground);
            }

            this.styles.foreground[index].fill = fill;
            // this.styles.foreground[index]['stroke'] = stroke;
          }

          svgItems.push(svg`<path id="arc-segment-${this.toolId}-${index}" class="sak-segarc__foreground"
                            style="${styleMap(this.styles.foreground[index])}"
                            d="${d}"
                            />`);
        });

        const tween = {};

        // eslint-disable-next-line no-inner-declarations
        function animateSegmentsNEW(timestamp, thisTool) {
          // eslint-disable-next-line no-plusplus
          const easeOut = (progress) => --progress ** 5 + 1;

          let frameSegment;
          let runningSegment;

          var timestamp = timestamp || new Date().getTime();
          if (!tween.startTime) {
            tween.startTime = timestamp;
            tween.runningAngle = tween.fromAngle;
          }

          if (thisTool.debug) console.log('RENDERNEW - in animateSegmentsNEW', thisTool.toolId, tween);

          const runtime = timestamp - tween.startTime;
          tween.progress = Math.min(runtime / tween.duration, 1);
          tween.progress = easeOut(tween.progress);

          const increase = ((thisTool._arc.clockwise)
            ? (tween.toAngle > tween.fromAngle) : (tween.fromAngle > tween.toAngle));

          // Calculate where the animation angle should be now in this animation frame: angle and segment.
          tween.frameAngle = tween.fromAngle + ((tween.toAngle - tween.fromAngle) * tween.progress);
          frameSegment = thisTool._segmentAngles.findIndex((currentValue, index) => (thisTool._arc.clockwise
            ? ((tween.frameAngle <= currentValue.boundsEnd) && (tween.frameAngle >= currentValue.boundsStart))
            : ((tween.frameAngle <= currentValue.boundsStart) && (tween.frameAngle >= currentValue.boundsEnd))));

          if (frameSegment === -1) {
            /* if (thisTool.debug) */ console.log('RENDERNEW animateSegments frameAngle not found', tween, thisTool._segmentAngles);
            console.log('config', thisTool.config);
          }

          // Check where we actually are now. This might be in a different segment...
          runningSegment = thisTool._segmentAngles.findIndex((currentValue, index) => (thisTool._arc.clockwise
            ? ((tween.runningAngle <= currentValue.boundsEnd) && (tween.runningAngle >= currentValue.boundsStart))
            : ((tween.runningAngle <= currentValue.boundsStart) && (tween.runningAngle >= currentValue.boundsEnd))));

          // Weird stuff. runningSegment is sometimes -1. Ie not FOUND !! WTF??
          // if (runningSegment == -1) runningSegment = 0;

          // Do render segments until the animation angle is at the requested animation frame angle.
          do {
            const aniStartAngle = thisTool._segmentAngles[runningSegment].drawStart;
            var runningSegmentAngle = thisTool._arc.clockwise
              ? Math.min(thisTool._segmentAngles[runningSegment].boundsEnd, tween.frameAngle)
              : Math.max(thisTool._segmentAngles[runningSegment].boundsEnd, tween.frameAngle);
            const aniEndAngle = thisTool._arc.clockwise
              ? Math.min(thisTool._segmentAngles[runningSegment].drawEnd, tween.frameAngle)
              : Math.max(thisTool._segmentAngles[runningSegment].drawEnd, tween.frameAngle);
              // First phase. Just draw and ignore segments...
            d = thisTool.buildArcPath(aniStartAngle, aniEndAngle, thisTool._arc.clockwise, arcRadiusX, arcRadiusY, arcWidth);

            if (!thisTool.myarc) thisTool.myarc = {};
            if (!thisTool.as) thisTool.as = {};

            let as;
            const myarc = 'arc-segment-'.concat(thisTool.toolId).concat('-').concat(runningSegment);
            // as = thisTool._card.shadowRoot.getElementById(myarc);
            if (!thisTool.as[runningSegment])
              thisTool.as[runningSegment] = thisTool._card.shadowRoot.getElementById(myarc);
            as = thisTool.as[runningSegment];
            // Extra. Remember id's and references
            // Quick hack...
            thisTool.myarc[runningSegment] = myarc;
            // thisTool.as[runningSegment] = as;

            if (as) {
              // var e = as.getAttribute("d");
              as.setAttribute('d', d);

              // We also have to set the style fill if the color stops and gradients are implemented
              // As we're using styles, attributes won't work. Must use as.style.fill = 'calculated color'
              // #TODO
              // Can't use gradients probably because of custom path. Conic-gradient would be fine.
              //
              // First try...
              if (thisTool.config.show.style === 'colorlist') {
                as.style.fill = thisTool.config.segments.colorlist.colors[runningSegment];
                thisTool.styles.foreground[runningSegment].fill = thisTool.config.segments.colorlist.colors[runningSegment];
              }
              // #WIP
              // Testing 'lastcolor'
              if (thisTool.config.show.lastcolor) {
                var fill;

                const boundsStart = thisTool._arc.clockwise
                  ? (thisTool._segmentAngles[runningSegment].drawStart)
                  : (thisTool._segmentAngles[runningSegment].drawEnd);
                const boundsEnd = thisTool._arc.clockwise
                  ? (thisTool._segmentAngles[runningSegment].drawEnd)
                  : (thisTool._segmentAngles[runningSegment].drawStart);
                const value = Math.min(Math.max(0, (runningSegmentAngle - boundsStart) / (boundsEnd - boundsStart)), 1);
                // 2022.07.03 Fixing lastcolor for true stop
                if (thisTool.config.show.style === 'colorstops') {
                  fill = Colors.getGradientValue(
                    thisTool._segments.colorStops[thisTool._segments.sortedStops[runningSegment]],
                    thisTool._segments.colorStops[thisTool._segments.sortedStops[runningSegment]],
                    value,
                  );
                } else {
                  // 2022.07.12 Fix bug as this is no colorstops, but a colorlist!!!!
                  if (thisTool.config.show.style === 'colorlist') {
                    fill = thisTool.config.segments.colorlist.colors[runningSegment];
                  }
                }

                thisTool.styles.foreground[0].fill = fill;
                thisTool.as[0].style.fill = fill;

                if (runningSegment > 0) {
                  for (let j = runningSegment; j >= 0; j--) { // +1
                    if (thisTool.styles.foreground[j].fill !== fill) {
                      thisTool.styles.foreground[j].fill = fill;
                      thisTool.as[j].style.fill = fill;
                    }
                    thisTool.styles.foreground[j].fill = fill;
                    thisTool.as[j].style.fill = fill;
                  }
                }
              }
            }
            thisTool._cache[runningSegment] = d;

            // If at end of animation, don't do the add to force going to next segment
            if (tween.frameAngle !== runningSegmentAngle) {
              runningSegmentAngle += (0.000001 * thisTool._arc.direction);
            }

            var runningSegmentPrev = runningSegment;
            runningSegment = thisTool._segmentAngles.findIndex((currentValue, index) => (thisTool._arc.clockwise
              ? ((runningSegmentAngle <= currentValue.boundsEnd) && (runningSegmentAngle >= currentValue.boundsStart))
              : ((runningSegmentAngle <= currentValue.boundsStart) && (runningSegmentAngle >= currentValue.boundsEnd))));

            if (!increase) {
              if (runningSegmentPrev !== runningSegment) {
                if (thisTool.debug) console.log('RENDERNEW movit - remove path', thisTool.toolId, runningSegmentPrev);
                if (thisTool._arc.clockwise) {
                  as.removeAttribute('d');
                  thisTool._cache[runningSegmentPrev] = null;
                } else {
                  as.removeAttribute('d');
                  thisTool._cache[runningSegmentPrev] = null;
                }
              }
            }
            tween.runningAngle = runningSegmentAngle;
            if (thisTool.debug) console.log('RENDERNEW - animation loop tween', thisTool.toolId, tween, runningSegment, runningSegmentPrev);
          } while ((tween.runningAngle !== tween.frameAngle) /* && (runningSegment == runningSegmentPrev) */);

          // NTS @ 2020.10.14
          // In a fast paced animation - say 10msec - multiple segments should be drawn,
          //   while tween.progress already has the value of 1.
          // This means only the first segment is drawn - due to the "&& (runningSegment == runningSegmentPrev)" test above.
          // To fix this:
          // - either remove that test (why was it there????)... Or
          // - add the line "|| (runningSegment != runningSegmentPrev)" to the if() below to make sure another animation frame is requested
          //   although tween.progress == 1.
          if ((tween.progress !== 1) /* || (runningSegment != runningSegmentPrev) */) {
            // eslint-disable-next-line no-undef
            thisTool.rAFid = requestAnimationFrame((timestamp) => {
              animateSegmentsNEW(timestamp, thisTool);
            });
          } else {
            tween.startTime = null;
            if (thisTool.debug) console.log('RENDERNEW - animation loop ENDING tween', thisTool.toolId, tween, runningSegment, runningSegmentPrev);
          }
        } // function animateSegmentsNEW

        const mySelf = this;
        // 2021.10.31
        // Edge case where brightness percentage is set to undefined (attribute is gone) if light is set to off.
        // Now if light is switched on again, the brightness is set to old value, and val and valPrev are the same again, so NO drawing!!!!!
        //
        // Remove test for val/valPrev...

        // Check if values changed and we should animate to another target then previously rendered
        if (/* (val != valPrev) && */ (this._card.connected === true) && (this._renderTo !== this._stateValue)) {
        // if ( (val != valPrev) && (this._card.connected == true) && (this._renderTo != this._stateValue)) {
          this._renderTo = this._stateValue;
          // if (this.dev.debug) console.log('RENDERNEW val != valPrev', val, valPrev, 'prev/end/cur', arcEndPrev, arcEnd, arcCur);

          // If previous animation active, cancel this one before starting a new one...
          if (this.rAFid) {
            // if (this.dev.debug) console.log('RENDERNEW canceling rAFid', this._card.cardId, this.toolId, 'rAFid', this.rAFid);
            // eslint-disable-next-line no-undef
            cancelAnimationFrame(this.rAFid);
          }

          // Start new animation with calculated settings...
          // counter var not defined???
          // if (this.dev.debug) console.log('starting animationframe timer...', this._card.cardId, this.toolId, counter);
          tween.fromAngle = arcEndPrev;
          tween.toAngle = arcEnd;
          tween.runningAngle = arcEndPrev;

          // @2021.10.31
          // Handle edge case where - for some reason - arcEnd and arcEndPrev are equal.
          // Do NOT render anything in this case to prevent errors...

          // The check is removed temporarily. Brightness is again not shown for light. Still the same problem...

          // eslint-disable-next-line no-constant-condition
          {
            // Render like an idiot the first time. Performs MUCH better @first load then having a zillion animations...
            // NOt so heavy on an average PC, but my iPad and iPhone need some more time for this!

            tween.duration = Math.min(Math.max(this._initialDraw ? 100 : 500, this._initialDraw ? 16 : this.config.animation.duration * 1000), 5000);
            tween.startTime = null;
            if (this.dev.debug) console.log('RENDERNEW - tween', this.toolId, tween);
            // this._initialDraw = false;
            // eslint-disable-next-line no-undef
            this.rAFid = requestAnimationFrame((timestamp) => {
              animateSegmentsNEW(timestamp, mySelf);
            });
            this._initialDraw = false;
          }
        }

        return svg`${svgItems}`;
      } else {
        // Initial FIRST draw.
        // What if we 'abuse' the animation to do this, and we just create empty elements.
        // Then we don't have to do difficult things.
        // Just set some values to 0 and 'force' a full animation...
        //
        // Hmm. Stuff is not yet rendered, so DOM objects don't exist yet. How can we abuse the
        // animation function to do the drawing then??
        // --> Can use firstUpdated perhaps?? That was the first render, then do the first actual draw??
        //

        if (this.dev.debug) console.log('RENDERNEW _arcId does NOT exist', this._arcId, this.toolId);

        // Create empty elements, so no problem in animation function. All path's exist...
        // An empty element has a width of 0!
        for (let i = 0; i < this._segmentAngles.length; i++) {
          d = this.buildArcPath(
            this._segmentAngles[i].drawStart,
            this._segmentAngles[i].drawEnd,
            this._arc.clockwise,
            this.svg.radiusX,
            this.svg.radiusY,
            this.config.isScale ? this.svg.width : 0,
          );

          this._cache[i] = d;

          // extra, set color from colorlist as a test
          let fill = this.config.color;
          if (this.config.show.style === 'colorlist') {
            fill = this.config.segments.colorlist.colors[i];
          }
          if (this.config.show.style === 'colorstops') {
            fill = this._segments.colorStops[this._segments.sortedStops[i]];
          }
          //                            style="${styleMap(this.config.styles.foreground)} fill: ${fill};"
          if (!this.styles.foreground) {
            this.styles.foreground = {};
          }
          if (!this.styles.foreground[i]) {
            this.styles.foreground[i] = Merge.mergeDeep(this.config.styles.foreground);
          }
          this.styles.foreground[i].fill = fill;

          // #WIP
          // Testing 'lastcolor'
          if (this.config.show.lastcolor) {
            if (i > 0) {
              for (let j = i - 1; j > 0; j--) {
                this.styles.foreground[j].fill = fill;
              }
            }
          }

          svgItems.push(svg`<path id="arc-segment-${this.toolId}-${i}" class="arc__segment"
                            style="${styleMap(this.styles.foreground[i])}"
                            d="${d}"
                            />`);
        }

        if (this.dev.debug) console.log('RENDERNEW - svgItems', svgItems, this._firstUpdatedCalled);
        return svg`${svgItems}`;
      }

    // END OF NEW METHOD OF RENDERING
    }
  }

  polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radiusX * Math.cos(angleInRadians)),
      y: centerY + (radiusY * Math.sin(angleInRadians)),
    };
  }

  /*
   *
   * start = 10, end = 30, clockwise -> size is 20
   * start = 10, end = 30, anticlockwise -> size is (360 - 20) = 340
   *
   *
   */
  buildArcPath(argStartAngle, argEndAngle, argClockwise, argRadiusX, argRadiusY, argWidth) {
    const start = this.polarToCartesian(this.svg.cx, this.svg.cy, argRadiusX, argRadiusY, argEndAngle);
    const end = this.polarToCartesian(this.svg.cx, this.svg.cy, argRadiusX, argRadiusY, argStartAngle);
    const largeArcFlag = Math.abs(argEndAngle - argStartAngle) <= 180 ? '0' : '1';

    const sweepFlag = argClockwise ? '0' : '1';

    const cutoutRadiusX = argRadiusX - argWidth;
    const cutoutRadiusY = argRadiusY - argWidth;
    const start2 = this.polarToCartesian(this.svg.cx, this.svg.cy, cutoutRadiusX, cutoutRadiusY, argEndAngle);
    const end2 = this.polarToCartesian(this.svg.cx, this.svg.cy, cutoutRadiusX, cutoutRadiusY, argStartAngle);

    const d = [
      'M', start.x, start.y,
      'A', argRadiusX, argRadiusY, 0, largeArcFlag, sweepFlag, end.x, end.y,
      'L', end2.x, end2.y,
      'A', cutoutRadiusX, cutoutRadiusY, 0, largeArcFlag, sweepFlag === '0' ? '1' : '0', start2.x, start2.y,
      'Z',
    ].join(' ');
    return d;
  }
} // END of class

/** ****************************************************************************
  * SparklineBarChartTool class
  *
  * Summary.
  *
  */
class SparklineBarChartTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_BARCHART_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        height: 25,
        width: 25,
        margin: 0.5,
        orientation: 'vertical',
      },
      hours: 24,
      barhours: 1,
      color: 'var(--primary-color)',
      classes: {
        tool: {
          'sak-barchart': true,
          hover: true,
        },
        bar: {
        },
        line: {
          'sak-barchart__line': true,
          hover: true,
        },
      },
      styles: {
        tool: {
        },
        line: {
        },
        bar: {
        },
      },
      colorstops: [],
      show: { style: 'fixedcolor' },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_BARCHART_CONFIG, argConfig), argPos);

    this.svg.margin = Utils.calculateSvgDimension(this.config.position.margin);
    const theWidth = (this.config.position.orientation === 'vertical') ? this.svg.width : this.svg.height;

    this.svg.barWidth = (theWidth - (((this.config.hours / this.config.barhours) - 1)
                                  * this.svg.margin)) / (this.config.hours / this.config.barhours);
    this._data = [];
    this._bars = [];
    this._scale = {};
    this._needsRendering = false;

    this.classes.tool = {};
    this.classes.bar = {};

    this.styles.tool = {};
    this.styles.line = {};
    this.stylesBar = {};

    if (this.dev.debug) console.log('SparkleBarChart constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  /** *****************************************************************************
    * SparklineBarChartTool::computeMinMax()
    *
    * Summary.
    * Compute min/max values of bars to scale them to the maximum amount.
    *
    */
  computeMinMax() {
    let min = this._series[0]; let
      max = this._series[0];

    for (let i = 1, len = this._series.length; i < len; i++) {
      const v = this._series[i];
      min = (v < min) ? v : min;
      max = (v > max) ? v : max;
    }
    this._scale.min = min;
    this._scale.max = max;
    this._scale.size = (max - min);

    // 2020.11.05
    // Add 5% to the size of the scale and adjust the minimum value displayed.
    // So every bar is displayed, instead of the min value having a bar length of zero!
    this._scale.size = (max - min) * 1.05;
    this._scale.min = max - this._scale.size;
  }

  /** *****************************************************************************
    * SparklineBarChartTool::set series
    *
    * Summary.
    * Sets the timeseries for the barchart tool. Is an array of states.
    * If this is historical data, the caller has taken the time to create this.
    * This tool only displays the result...
    *
    */
  set data(states) {
    this._series = Object.assign(states);
    this.computeBars();
    this._needsRendering = true;
  }

  set series(states) {
    this._series = Object.assign(states);
    this.computeBars();
    this._needsRendering = true;
  }

  hasSeries() {
    return this.defaultEntityIndex();
  }

  /** *****************************************************************************
    * SparklineBarChartTool::computeBars()
    *
    * Summary.
    * Compute start and end of bars for easy rendering.
    *
    */
  computeBars({ _bars } = this) {
    this.computeMinMax();

    if (this.config.show.style === 'minmaxgradient') {
      this.colorStopsMinMax = {};
      this.colorStopsMinMax = {
        [this._scale.min.toString()]: this.config.minmaxgradient.colors.min,
        [this._scale.max.toString()]: this.config.minmaxgradient.colors.max,
      };
    }

    // VERTICAL
    if (this.config.position.orientation === 'vertical') {
      if (this.dev.debug) console.log('bar is vertical');
      this._series.forEach((item, index) => {
        if (!_bars[index]) _bars[index] = {};
        _bars[index].length = (this._scale.size === 0) ? 0 : ((item - this._scale.min) / (this._scale.size)) * this.svg.height;
        _bars[index].x1 = this.svg.x + this.svg.barWidth / 2 + ((this.svg.barWidth + this.svg.margin) * index);
        _bars[index].x2 = _bars[index].x1;
        _bars[index].y1 = this.svg.y + this.svg.height;
        _bars[index].y2 = _bars[index].y1 - this._bars[index].length;
        _bars[index].dataLength = this._bars[index].length;
      });
      // HORIZONTAL
    } else if (this.config.position.orientation === 'horizontal') {
      if (this.dev.debug) console.log('bar is horizontal');
      this._data.forEach((item, index) => {
        if (!_bars[index]) _bars[index] = {};
        // if (!item || isNaN(item)) item = this._scale.min;
        _bars[index].length = (this._scale.size === 0) ? 0 : ((item - this._scale.min) / (this._scale.size)) * this.svg.width;
        _bars[index].y1 = this.svg.y + this.svg.barWidth / 2 + ((this.svg.barWidth + this.svg.margin) * index);
        _bars[index].y2 = _bars[index].y1;
        _bars[index].x1 = this.svg.x;
        _bars[index].x2 = _bars[index].x1 + this._bars[index].length;
        _bars[index].dataLength = this._bars[index].length;
      });
    } else if (this.dev.debug) console.log('SparklineBarChartTool - unknown barchart orientation (horizontal or vertical)');
  }

  /** *****************************************************************************
    * SparklineBarChartTool::_renderBars()
    *
    * Summary.
    * Render all the bars. Number of bars depend on hours and barhours settings.
    *
    */
  // _renderBars({ _bars } = this) {
  _renderBars() {
    const svgItems = [];

    if (this._bars.length === 0) return;

    if (this.dev.debug) console.log('_renderBars IN', this.toolId);

    this._bars.forEach((item, index) => {
      if (this.dev.debug) console.log('_renderBars - bars', item, index);

      const stroke = this.getColorFromState(this._series[index]);

      if (!this.stylesBar[index])
        this.stylesBar[index] = { ...this.config.styles.bar };

      // NOTE @ 2021.10.27
      // Lijkt dat this.classes niet gevuld wordt. geen merge enzo. is dat een bug?
      // Nu tijdelijk opgelost door this.config te gebruiken, maar hoort niet natuurlijk als je kijkt
      // naar de andere tools...

      // Safeguard...
      if (!(this._bars[index].y2)) console.log('sparklebarchart y2 invalid', this._bars[index]);
      svgItems.push(svg`
          <line id="line-segment-${this.toolId}-${index}" class="${classMap(this.config.classes.line)}"
                    style="${styleMap(this.stylesBar[index])}"
                    x1="${this._bars[index].x1}"
                    x2="${this._bars[index].x2}"
                    y1="${this._bars[index].y1}"
                    y2="${this._bars[index].y2}"
                    data-length="${this._bars[index].dataLength}"
                    stroke="${stroke}"
                    stroke-width="${this.svg.barWidth}"
                    />
          `);
    });
    if (this.dev.debug) console.log('_renderBars OUT', this.toolId);

    return svg`${svgItems}`;
  }

  /** *****************************************************************************
    * SparklineBarChartTool::render()
    *
    * Summary.
    * The actual render() function called by the card for each tool.
    *
    */
  render() {
    return svg`
        <g id="barchart-${this.toolId}"
          class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
          @click=${(e) => this.handleTapEvent(e, this.config)}>
          ${this._renderBars()}
        </g>
      `;
  }
}

/** ****************************************************************************
  * SwitchTool class
  *
  * Summary.
  *
  *
  * NTS:
  * - .mdc-switch__native-control uses:
  *     - width: 68px, 17em
  *     - height: 48px, 12em
  * - and if checked (.mdc-switch--checked):
  *     - transform: translateX(-20px)
  *
  * .mdc-switch.mdc-switch--checked .mdc-switch__thumb {
  *  background-color: var(--switch-checked-button-color);
  *  border-color: var(--switch-checked-button-color);
  *
  */

class SwitchTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_SWITCH_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        orientation: 'horizontal',
        track: {
          width: 16,
          height: 7,
          radius: 3.5,
        },
        thumb: {
          width: 9,
          height: 9,
          radius: 4.5,
          offset: 4.5,
        },
      },
      classes: {
        tool: {
          'sak-switch': true,
          hover: true,
        },
        track: {
          'sak-switch__track': true,
        },
        thumb: {
          'sak-switch__thumb': true,
        },
      },
      styles: {
        tool: {
          overflow: 'visible',
        },
        track: {
        },
        thumb: {
        },
      },
    };

    const HORIZONTAL_SWITCH_CONFIG = {
      animations: [
        {
          state: 'on',
          id: 1,
          styles: {
            track: {
              fill: 'var(--switch-checked-track-color)',
              'pointer-events': 'auto',
            },
            thumb: {
              fill: 'var(--switch-checked-button-color)',
              transform: 'translateX(4.5em)',
              'pointer-events': 'auto',
            },
          },
        },
        {
          state: 'off',
          id: 0,
          styles: {
            track: {
              fill: 'var(--switch-unchecked-track-color)',
              'pointer-events': 'auto',
            },
            thumb: {
              fill: 'var(--switch-unchecked-button-color)',
              transform: 'translateX(-4.5em)',
              'pointer-events': 'auto',
            },
          },
        },
      ],
    };

    const VERTICAL_SWITCH_CONFIG = {
      animations: [
        {
          state: 'on',
          id: 1,
          styles: {
            track: {
              fill: 'var(--switch-checked-track-color)',
              'pointer-events': 'auto',
            },
            thumb: {
              fill: 'var(--switch-checked-button-color)',
              transform: 'translateY(-4.5em)',
              'pointer-events': 'auto',
            },
          },
        },
        {
          state: 'off',
          id: 0,
          styles: {
            track: {
              fill: 'var(--switch-unchecked-track-color)',
              'pointer-events': 'auto',
            },
            thumb: {
              fill: 'var(--switch-unchecked-button-color)',
              transform: 'translateY(4.5em)',
              'pointer-events': 'auto',
            },
          },
        },
      ],
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_SWITCH_CONFIG, argConfig), argPos);

    if (!['horizontal', 'vertical'].includes(this.config.position.orientation))
      throw Error('SwitchTool::constructor - invalid orientation [vertical, horizontal] = ', this.config.position.orientation);

    this.svg.track = {};
    this.svg.track.radius = Utils.calculateSvgDimension(this.config.position.track.radius);

    this.svg.thumb = {};
    this.svg.thumb.radius = Utils.calculateSvgDimension(this.config.position.thumb.radius);
    this.svg.thumb.offset = Utils.calculateSvgDimension(this.config.position.thumb.offset);

    switch (this.config.position.orientation) {
      // eslint-disable-next-line default-case-last
      default:
      case 'horizontal':
        this.config = Merge.mergeDeep(DEFAULT_SWITCH_CONFIG, HORIZONTAL_SWITCH_CONFIG, argConfig);

        this.svg.track.width = Utils.calculateSvgDimension(this.config.position.track.width);
        this.svg.track.height = Utils.calculateSvgDimension(this.config.position.track.height);
        this.svg.thumb.width = Utils.calculateSvgDimension(this.config.position.thumb.width);
        this.svg.thumb.height = Utils.calculateSvgDimension(this.config.position.thumb.height);

        this.svg.track.x1 = this.svg.cx - this.svg.track.width / 2;
        this.svg.track.y1 = this.svg.cy - this.svg.track.height / 2;

        this.svg.thumb.x1 = this.svg.cx - this.svg.thumb.width / 2;
        this.svg.thumb.y1 = this.svg.cy - this.svg.thumb.height / 2;
        break;

      case 'vertical':
        this.config = Merge.mergeDeep(DEFAULT_SWITCH_CONFIG, VERTICAL_SWITCH_CONFIG, argConfig);

        this.svg.track.width = Utils.calculateSvgDimension(this.config.position.track.height);
        this.svg.track.height = Utils.calculateSvgDimension(this.config.position.track.width);
        this.svg.thumb.width = Utils.calculateSvgDimension(this.config.position.thumb.height);
        this.svg.thumb.height = Utils.calculateSvgDimension(this.config.position.thumb.width);

        this.svg.track.x1 = this.svg.cx - this.svg.track.width / 2;
        this.svg.track.y1 = this.svg.cy - this.svg.track.height / 2;

        this.svg.thumb.x1 = this.svg.cx - this.svg.thumb.width / 2;
        this.svg.thumb.y1 = this.svg.cy - this.svg.thumb.height / 2;
        break;
    }

    this.classes.track = {};
    this.classes.thumb = {};

    this.styles.track = {};
    this.styles.thumb = {};
    if (this.dev.debug) console.log('SwitchTool constructor config, svg', this.toolId, this.config, this.svg);
  }

  /** *****************************************************************************
  * SwitchTool::value()
  *
  * Summary.
  * Receive new state data for the entity this switch is linked to. Called from set hass;
  *
  */
  set value(state) {
    super.value = state;
  }

  /**
  * SwitchTool::_renderSwitch()
  *
  * Summary.
  * Renders the switch using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the switch
  *
  */

  _renderSwitch() {
    this.MergeAnimationClassIfChanged();
    // this.MergeColorFromState(this.styles);
    this.MergeAnimationStyleIfChanged(this.styles);
    // this.MergeAnimationStyleIfChanged(this.styles.thumb);

    return svg`
      <g>
        <rect class="${classMap(this.classes.track)}" x="${this.svg.track.x1}" y="${this.svg.track.y1}"
          width="${this.svg.track.width}" height="${this.svg.track.height}" rx="${this.svg.track.radius}"
          style="${styleMap(this.styles.track)}"
        />
        <rect class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
          width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
          style="${styleMap(this.styles.thumb)}"
        />
      </g>
      `;
  }

  /** *****************************************************************************
  * SwitchTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  * https://codepen.io/joegaffey/pen/vrVZaN
  *
  */

  render() {
    return svg`
      <g id="switch-${this.toolId}" transform-origin="${this.svg.cx} ${this.svg.cy}"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderSwitch()}
      </g>
    `;
  }
} // END of class

/** ****************************************************************************
  * TextTool class
  *
  * Summary.
  *
  */

class TextTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_TEXT_CONFIG = {
      classes: {
        tool: {
          'sak-text': true,
        },
        text: {
          'sak-text__text': true,
          hover: false,
        },
      },
      styles: {
        tool: {
        },
        text: {
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_TEXT_CONFIG, argConfig), argPos);

    this.EnableHoverForInteraction();
    this.text = this.config.text;

    this.classes.tool = {};
    this.classes.text = {};

    this.styles.tool = {};
    this.styles.text = {};
    if (this.dev.debug) console.log('TextTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  /** *****************************************************************************
  * TextTool::_renderText()
  *
  * Summary.
  * Renders the text using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the text
  *
  */

  _renderText() {
    this.MergeAnimationClassIfChanged();
    this.MergeColorFromState(this.styles.text);
    this.MergeAnimationStyleIfChanged();

    return svg`
        <text>
          <tspan class="${classMap(this.classes.text)}" x="${this.svg.cx}" y="${this.svg.cy}" style="${styleMap(this.styles.text)}">${this.text}</tspan>
        </text>
      `;
  }

  /** *****************************************************************************
  * TextTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
        <g id="text-${this.toolId}"
          class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
          @click=${(e) => this.handleTapEvent(e, this.config)}>
          ${this._renderText()}
        </g>
      `;
  }
} // END of class

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * RegExp to match *( ";" parameter ) in RFC 7231 sec 3.1.1.1
 *
 * parameter     = token "=" ( token / quoted-string )
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 * quoted-string = DQUOTE *( qdtext / quoted-pair ) DQUOTE
 * qdtext        = HTAB / SP / %x21 / %x23-5B / %x5D-7E / obs-text
 * obs-text      = %x80-FF
 * quoted-pair   = "\" ( HTAB / SP / VCHAR / obs-text )
 */
var PARAM_REGEXP = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g; // eslint-disable-line no-control-regex

/**
 * RegExp to match quoted-pair in RFC 7230 sec 3.2.6
 *
 * quoted-pair = "\" ( HTAB / SP / VCHAR / obs-text )
 * obs-text    = %x80-FF
 */
var QESC_REGEXP = /\\([\u000b\u0020-\u00ff])/g; // eslint-disable-line no-control-regex

/**
 * RegExp to match type in RFC 7231 sec 3.1.1.1
 *
 * media-type = type "/" subtype
 * type       = token
 * subtype    = token
 */
var TYPE_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
var parse_1 = parse;

/**
 * Parse media type to object.
 *
 * @param {string|object} string
 * @return {Object}
 * @public
 */

function parse (string) {
  if (!string) {
    throw new TypeError('argument string is required')
  }

  // support req/res-like objects as argument
  var header = typeof string === 'object'
    ? getcontenttype(string)
    : string;

  if (typeof header !== 'string') {
    throw new TypeError('argument string is required to be a string')
  }

  var index = header.indexOf(';');
  var type = index !== -1
    ? header.slice(0, index).trim()
    : header.trim();

  if (!TYPE_REGEXP.test(type)) {
    throw new TypeError('invalid media type')
  }

  var obj = new ContentType(type.toLowerCase());

  // parse parameters
  if (index !== -1) {
    var key;
    var match;
    var value;

    PARAM_REGEXP.lastIndex = index;

    while ((match = PARAM_REGEXP.exec(header))) {
      if (match.index !== index) {
        throw new TypeError('invalid parameter format')
      }

      index += match[0].length;
      key = match[1].toLowerCase();
      value = match[2];

      if (value.charCodeAt(0) === 0x22 /* " */) {
        // remove quotes
        value = value.slice(1, -1);

        // remove escapes
        if (value.indexOf('\\') !== -1) {
          value = value.replace(QESC_REGEXP, '$1');
        }
      }

      obj.parameters[key] = value;
    }

    if (index !== header.length) {
      throw new TypeError('invalid parameter format')
    }
  }

  return obj
}

/**
 * Get content-type from req/res objects.
 *
 * @param {object}
 * @return {Object}
 * @private
 */

function getcontenttype (obj) {
  var header;

  if (typeof obj.getHeader === 'function') {
    // res-like
    header = obj.getHeader('content-type');
  } else if (typeof obj.headers === 'object') {
    // req-like
    header = obj.headers && obj.headers['content-type'];
  }

  if (typeof header !== 'string') {
    throw new TypeError('content-type header is missing from object')
  }

  return header
}

/**
 * Class to represent a content type.
 * @private
 */
function ContentType (type) {
  this.parameters = Object.create(null);
  this.type = type;
}

var cache = new Map();

var cloneSvg = function cloneSvg(sourceSvg) {
  return sourceSvg.cloneNode(true);
};

var isLocal = function isLocal() {
  return window.location.protocol === 'file:';
};

var makeAjaxRequest = function makeAjaxRequest(url, httpRequestWithCredentials, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    try {
      if (!/\.svg/i.test(url) && httpRequest.readyState === 2) {
        var contentType = httpRequest.getResponseHeader('Content-Type');
        if (!contentType) {
          throw new Error('Content type not found');
        }
        var type = parse_1(contentType).type;
        if (!(type === 'image/svg+xml' || type === 'text/plain')) {
          throw new Error("Invalid content type: ".concat(type));
        }
      }
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 404 || httpRequest.responseXML === null) {
          throw new Error(isLocal() ? 'Note: SVG injection ajax calls do not work locally without ' + 'adjusting security settings in your browser. Or consider ' + 'using a local webserver.' : 'Unable to load SVG file: ' + url);
        }
        if (httpRequest.status === 200 || isLocal() && httpRequest.status === 0) {
          callback(null, httpRequest);
        } else {
          throw new Error('There was a problem injecting the SVG: ' + httpRequest.status + ' ' + httpRequest.statusText);
        }
      }
    } catch (error) {
      httpRequest.abort();
      if (error instanceof Error) {
        callback(error, httpRequest);
      } else {
        throw error;
      }
    }
  };
  httpRequest.open('GET', url);
  httpRequest.withCredentials = httpRequestWithCredentials;
  if (httpRequest.overrideMimeType) {
    httpRequest.overrideMimeType('text/xml');
  }
  httpRequest.send();
};

var requestQueue = {};
var queueRequest = function queueRequest(url, callback) {
  requestQueue[url] = requestQueue[url] || [];
  requestQueue[url].push(callback);
};
var processRequestQueue = function processRequestQueue(url) {
  var _loop_1 = function _loop_1(i, len) {
    setTimeout(function () {
      if (Array.isArray(requestQueue[url])) {
        var cacheValue = cache.get(url);
        var callback = requestQueue[url][i];
        if (cacheValue instanceof SVGSVGElement) {
          callback(null, cloneSvg(cacheValue));
        }
        if (cacheValue instanceof Error) {
          callback(cacheValue);
        }
        if (i === requestQueue[url].length - 1) {
          delete requestQueue[url];
        }
      }
    }, 0);
  };
  for (var i = 0, len = requestQueue[url].length; i < len; i++) {
    _loop_1(i);
  }
};

var loadSvgCached = function loadSvgCached(url, httpRequestWithCredentials, callback) {
  if (cache.has(url)) {
    var cacheValue = cache.get(url);
    if (cacheValue === undefined) {
      queueRequest(url, callback);
      return;
    }
    if (cacheValue instanceof SVGSVGElement) {
      callback(null, cloneSvg(cacheValue));
      return;
    }
  }
  cache.set(url, undefined);
  queueRequest(url, callback);
  makeAjaxRequest(url, httpRequestWithCredentials, function (error, httpRequest) {
    var _a;
    if (error) {
      cache.set(url, error);
    } else if (((_a = httpRequest.responseXML) === null || _a === void 0 ? void 0 : _a.documentElement) instanceof SVGSVGElement) {
      cache.set(url, httpRequest.responseXML.documentElement);
    }
    processRequestQueue(url);
  });
};

var loadSvgUncached = function loadSvgUncached(url, httpRequestWithCredentials, callback) {
  makeAjaxRequest(url, httpRequestWithCredentials, function (error, httpRequest) {
    var _a;
    if (error) {
      callback(error);
    } else if (((_a = httpRequest.responseXML) === null || _a === void 0 ? void 0 : _a.documentElement) instanceof SVGSVGElement) {
      callback(null, httpRequest.responseXML.documentElement);
    }
  });
};

var idCounter = 0;
var uniqueId = function uniqueId() {
  return ++idCounter;
};

var injectedElements = [];
var ranScripts = {};
var svgNamespace = 'http://www.w3.org/2000/svg';
var xlinkNamespace = 'http://www.w3.org/1999/xlink';
var injectElement = function injectElement(el, evalScripts, renumerateIRIElements, cacheRequests, httpRequestWithCredentials, beforeEach, callback) {
  var elUrl = el.getAttribute('data-src') || el.getAttribute('src');
  if (!elUrl) {
    callback(new Error('Invalid data-src or src attribute'));
    return;
  }
  if (injectedElements.indexOf(el) !== -1) {
    injectedElements.splice(injectedElements.indexOf(el), 1);
    el = null;
    return;
  }
  injectedElements.push(el);
  el.setAttribute('src', '');
  var loadSvg = cacheRequests ? loadSvgCached : loadSvgUncached;
  loadSvg(elUrl, httpRequestWithCredentials, function (error, svg) {
    if (!svg) {
      injectedElements.splice(injectedElements.indexOf(el), 1);
      el = null;
      callback(error);
      return;
    }
    var elId = el.getAttribute('id');
    if (elId) {
      svg.setAttribute('id', elId);
    }
    var elTitle = el.getAttribute('title');
    if (elTitle) {
      svg.setAttribute('title', elTitle);
    }
    var elWidth = el.getAttribute('width');
    if (elWidth) {
      svg.setAttribute('width', elWidth);
    }
    var elHeight = el.getAttribute('height');
    if (elHeight) {
      svg.setAttribute('height', elHeight);
    }
    var mergedClasses = Array.from(new Set(__spreadArray(__spreadArray(__spreadArray([], (svg.getAttribute('class') || '').split(' '), true), ['injected-svg'], false), (el.getAttribute('class') || '').split(' '), true))).join(' ').trim();
    svg.setAttribute('class', mergedClasses);
    var elStyle = el.getAttribute('style');
    if (elStyle) {
      svg.setAttribute('style', elStyle);
    }
    svg.setAttribute('data-src', elUrl);
    var elData = [].filter.call(el.attributes, function (at) {
      return /^data-\w[\w-]*$/.test(at.name);
    });
    Array.prototype.forEach.call(elData, function (dataAttr) {
      if (dataAttr.name && dataAttr.value) {
        svg.setAttribute(dataAttr.name, dataAttr.value);
      }
    });
    if (renumerateIRIElements) {
      var iriElementsAndProperties_1 = {
        clipPath: ['clip-path'],
        'color-profile': ['color-profile'],
        cursor: ['cursor'],
        filter: ['filter'],
        linearGradient: ['fill', 'stroke'],
        marker: ['marker', 'marker-start', 'marker-mid', 'marker-end'],
        mask: ['mask'],
        path: [],
        pattern: ['fill', 'stroke'],
        radialGradient: ['fill', 'stroke']
      };
      var element_1;
      var elements_1;
      var properties_1;
      var currentId_1;
      var newId_1;
      Object.keys(iriElementsAndProperties_1).forEach(function (key) {
        element_1 = key;
        properties_1 = iriElementsAndProperties_1[key];
        elements_1 = svg.querySelectorAll(element_1 + '[id]');
        var _loop_1 = function _loop_1(a, elementsLen) {
          currentId_1 = elements_1[a].id;
          newId_1 = currentId_1 + '-' + uniqueId();
          var referencingElements;
          Array.prototype.forEach.call(properties_1, function (property) {
            referencingElements = svg.querySelectorAll('[' + property + '*="' + currentId_1 + '"]');
            for (var b = 0, referencingElementLen = referencingElements.length; b < referencingElementLen; b++) {
              var attrValue = referencingElements[b].getAttribute(property);
              if (attrValue && !attrValue.match(new RegExp('url\\("?#' + currentId_1 + '"?\\)'))) {
                continue;
              }
              referencingElements[b].setAttribute(property, 'url(#' + newId_1 + ')');
            }
          });
          var allLinks = svg.querySelectorAll('[*|href]');
          var links = [];
          for (var c = 0, allLinksLen = allLinks.length; c < allLinksLen; c++) {
            var href = allLinks[c].getAttributeNS(xlinkNamespace, 'href');
            if (href && href.toString() === '#' + elements_1[a].id) {
              links.push(allLinks[c]);
            }
          }
          for (var d = 0, linksLen = links.length; d < linksLen; d++) {
            links[d].setAttributeNS(xlinkNamespace, 'href', '#' + newId_1);
          }
          elements_1[a].id = newId_1;
        };
        for (var a = 0, elementsLen = elements_1.length; a < elementsLen; a++) {
          _loop_1(a);
        }
      });
    }
    svg.removeAttribute('xmlns:a');
    var scripts = svg.querySelectorAll('script');
    var scriptsToEval = [];
    var script;
    var scriptType;
    for (var i = 0, scriptsLen = scripts.length; i < scriptsLen; i++) {
      scriptType = scripts[i].getAttribute('type');
      if (!scriptType || scriptType === 'application/ecmascript' || scriptType === 'application/javascript' || scriptType === 'text/javascript') {
        script = scripts[i].innerText || scripts[i].textContent;
        if (script) {
          scriptsToEval.push(script);
        }
        svg.removeChild(scripts[i]);
      }
    }
    if (scriptsToEval.length > 0 && (evalScripts === 'always' || evalScripts === 'once' && !ranScripts[elUrl])) {
      for (var l = 0, scriptsToEvalLen = scriptsToEval.length; l < scriptsToEvalLen; l++) {
        new Function(scriptsToEval[l])(window);
      }
      ranScripts[elUrl] = true;
    }
    var styleTags = svg.querySelectorAll('style');
    Array.prototype.forEach.call(styleTags, function (styleTag) {
      styleTag.textContent += '';
    });
    svg.setAttribute('xmlns', svgNamespace);
    svg.setAttribute('xmlns:xlink', xlinkNamespace);
    beforeEach(svg);
    if (!el.parentNode) {
      injectedElements.splice(injectedElements.indexOf(el), 1);
      el = null;
      callback(new Error('Parent node is null'));
      return;
    }
    el.parentNode.replaceChild(svg, el);
    injectedElements.splice(injectedElements.indexOf(el), 1);
    el = null;
    callback(null, svg);
  });
};

var SVGInjector = function SVGInjector(elements, _a) {
  var _b = _a === void 0 ? {} : _a,
    _c = _b.afterAll,
    afterAll = _c === void 0 ? function () {
      return undefined;
    } : _c,
    _d = _b.afterEach,
    afterEach = _d === void 0 ? function () {
      return undefined;
    } : _d,
    _e = _b.beforeEach,
    beforeEach = _e === void 0 ? function () {
      return undefined;
    } : _e,
    _f = _b.cacheRequests,
    cacheRequests = _f === void 0 ? true : _f,
    _g = _b.evalScripts,
    evalScripts = _g === void 0 ? 'never' : _g,
    _h = _b.httpRequestWithCredentials,
    httpRequestWithCredentials = _h === void 0 ? false : _h,
    _j = _b.renumerateIRIElements,
    renumerateIRIElements = _j === void 0 ? true : _j;
  if (elements && 'length' in elements) {
    var elementsLoaded_1 = 0;
    for (var i = 0, j = elements.length; i < j; i++) {
      injectElement(elements[i], evalScripts, renumerateIRIElements, cacheRequests, httpRequestWithCredentials, beforeEach, function (error, svg) {
        afterEach(error, svg);
        if (elements && 'length' in elements && elements.length === ++elementsLoaded_1) {
          afterAll(elementsLoaded_1);
        }
      });
    }
  } else if (elements) {
    injectElement(elements, evalScripts, renumerateIRIElements, cacheRequests, httpRequestWithCredentials, beforeEach, function (error, svg) {
      afterEach(error, svg);
      afterAll(1);
      elements = null;
    });
  } else {
    afterAll(0);
  }
};

/** ****************************************************************************
  * UserSvgTool class, UserSvgTool::constructor
  *
  * Summary.
  * The UserSvg tool can load and display .png, .jpg and .svg images
  *
  */

class UserSvgTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_USERSVG_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
        height: 50,
        width: 50,
      },
      options: {
        svginject: true,
      },
      styles: {
        usersvg: {
        },
        mask: {
          fill: 'white',
        },
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_USERSVG_CONFIG, argConfig), argPos);

    this.images = {};
    this.images = Object.assign({}, ...this.config.images);

    this.item = {};
    this.item.image = 'default';
    // Remember the SVG image to load, as we cache those SVG files
    this.imageCur = 'none';
    this.imagePrev = 'none';

    this.classes = {};
    this.classes.tool = {};
    this.classes.usersvg = {};
    this.classes.mask = {};

    this.styles = {};
    this.styles.tool = {};
    this.styles.usersvg = {};
    this.styles.mask = {};

    this.injector = {};
    this.injector.svg = null;
    this.injector.cache = [];

    this.clipPath = {};

    if (this.config.clip_path) {
      this.svg.cp_cx = Utils.calculateSvgCoordinate(this.config.clip_path.position.cx || this.config.position.cx, 0);
      this.svg.cp_cy = Utils.calculateSvgCoordinate(this.config.clip_path.position.cy || this.config.position.cy, 0);
      this.svg.cp_height = Utils.calculateSvgDimension(this.config.clip_path.position.height || this.config.position.height);
      this.svg.cp_width = Utils.calculateSvgDimension(this.config.clip_path.position.width || this.config.position.width);

      const maxRadius = Math.min(this.svg.cp_height, this.svg.cp_width) / 2;

      this.svg.radiusTopLeft = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
        this.config.clip_path.position.radius.top_left || this.config.clip_path.position.radius.left
                                || this.config.clip_path.position.radius.top || this.config.clip_path.position.radius.all,
      ))) || 0;

      this.svg.radiusTopRight = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
        this.config.clip_path.position.radius.top_right || this.config.clip_path.position.radius.right
                                || this.config.clip_path.position.radius.top || this.config.clip_path.position.radius.all,
      ))) || 0;

      this.svg.radiusBottomLeft = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
        this.config.clip_path.position.radius.bottom_left || this.config.clip_path.position.radius.left
                                || this.config.clip_path.position.radius.bottom || this.config.clip_path.position.radius.all,
      ))) || 0;

      this.svg.radiusBottomRight = +Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(
        this.config.clip_path.position.radius.bottom_right || this.config.clip_path.position.radius.right
                                || this.config.clip_path.position.radius.bottom || this.config.clip_path.position.radius.all,
      ))) || 0;
    }

    if (this.dev.debug) console.log('UserSvgTool constructor config, svg', this.toolId, this.config, this.svg);
  }

  /** *****************************************************************************
  * UserSvgTool::value()
  *
  * Summary.
  * Receive new state data for the entity this usersvg is linked to. Called from set hass;
  *
  */
  set value(state) {
    super.value = state;
  }

  /**
   * Summary.
   * Use firstUpdated(). updated() gives a loop of updates of the SVG if more than one SVG
   * is defined in the card: things start to blink, as each SVG is removed/rendered in a loop
   * so it seems. Either a bug in the Injector, or the UserSvg tool...
   *
   * @param {()} changedProperties
   * @returns
   */
  // eslint-disable-next-line no-unused-vars
  updated(changedProperties) {
    var myThis = this;

    // No need to check SVG injection, if same image, and in cache
    if ((!this.config.options.svginject) || this.injector.cache[this.imageCur]) {
      return;
    }

    this.injector.elementsToInject = this._card.shadowRoot.getElementById(
      'usersvg-'.concat(this.toolId)).querySelectorAll('svg[data-src]:not(.injected-svg)');
    if (this.injector.elementsToInject.length !== 0) {
      SVGInjector(this.injector.elementsToInject, {
      afterAll(elementsLoaded) {
        // After all elements are loaded, request another render to allow the SVG to be
        // rendered at the right location and size from cache.
        //
        // If loading failed, the options.svginject is set to false, so image will be
        // rendered as external image, if possible!
        setTimeout(() => { myThis._card.requestUpdate(); }, 0);
      },
      afterEach(err, svg) {
        if (err) {
          myThis.injector.error = err;
          myThis.config.options.svginject = false;
          throw err;
        } else {
          myThis.injector.error = '';
          myThis.injector.cache[myThis.imageCur] = svg;
        }
      },
      beforeEach(svg) {
        // Remove height and width attributes before injecting
        svg.removeAttribute('height');
        svg.removeAttribute('width');
      },
      cacheRequests: false,
      evalScripts: 'once',
      httpRequestWithCredentials: false,
      renumerateIRIElements: false,
      });
    }
  }

  /** *****************************************************************************
  * UserSvgTool::_renderUserSvg()
  *
  * Summary.
  * Renders the usersvg using precalculated coordinates and dimensions.
  * Only the runtime style is calculated before rendering the usersvg
  *
  */

  _renderUserSvg() {
    this.MergeAnimationStyleIfChanged();

    const images = Templates.getJsTemplateOrValue(this, this._stateValue, Merge.mergeDeep(this.images));
    this.imagePrev = this.imageCur;
    this.imageCur = images[this.item.image];

    // Render nothing if no image found
    if (images[this.item.image] === 'none')
      return svg``;

    let cachedSvg = this.injector.cache[this.imageCur];

    // construct clip path if specified
    let clipPath = svg``;
    // Construct both urls. Firefox can't handle undefined clip paths and masks: it starts to
    // clip images by itself ;-). Of course, that is not what we want!
    let clipPathUrl = '';
    let maskUrl = '';

    if (this.config.clip_path) {
      clipPathUrl = `url(#clip-path-${this.toolId})`;
      maskUrl = `url(#mask-${this.toolId})`;
      clipPath = svg`
        <defs>
          <path  id="path-${this.toolId}"
            d="
              M ${this.svg.cp_cx + this.svg.radiusTopLeft + ((this.svg.width - this.svg.cp_width) / 2)} ${this.svg.cp_cy + ((this.svg.height - this.svg.cp_height) / 2)}
              h ${this.svg.cp_width - this.svg.radiusTopLeft - this.svg.radiusTopRight}
              a ${this.svg.radiusTopRight} ${this.svg.radiusTopRight} 0 0 1 ${this.svg.radiusTopRight} ${this.svg.radiusTopRight}
              v ${this.svg.cp_height - this.svg.radiusTopRight - this.svg.radiusBottomRight}
              a ${this.svg.radiusBottomRight} ${this.svg.radiusBottomRight} 0 0 1 -${this.svg.radiusBottomRight} ${this.svg.radiusBottomRight}
              h -${this.svg.cp_width - this.svg.radiusBottomRight - this.svg.radiusBottomLeft}
              a ${this.svg.radiusBottomLeft} ${this.svg.radiusBottomLeft} 0 0 1 -${this.svg.radiusBottomLeft} -${this.svg.radiusBottomLeft}
              v -${this.svg.cp_height - this.svg.radiusBottomLeft - this.svg.radiusTopLeft}
              a ${this.svg.radiusTopLeft} ${this.svg.radiusTopLeft}  0 0 1 ${this.svg.radiusTopLeft} -${this.svg.radiusTopLeft}
              ">
          </path>
          <clipPath id="clip-path-${this.toolId}">
            <use href="#path-${this.toolId}"/>
          </clipPath>
          <mask id="mask-${this.toolId}">
            <use href="#path-${this.toolId}" style="${styleMap(this.styles.mask)}"/>
          </mask>
        </defs>
        `;
    }

    const dotPosition = images[this.item.image].lastIndexOf('.');
    const imageExtension = images[this.item.image]
                            .substring(dotPosition === -1 ? Infinity : dotPosition + 1);

    // Use default external image renderer if not an SVG extension
    // Image can be any jpg, png or other image like via the HA /api/ (person image)
    if (imageExtension !== 'svg') {
      return svg`
        <svg class="sak-usersvg__image" x="${this.svg.x}" y="${this.svg.y}"
          style="${styleMap(this.styles.usersvg)}">
          "${clipPath}"
          <image 
            clip-path="${clipPathUrl}" mask="${maskUrl}"
            href="${images[this.item.image]}"
            height="${this.svg.height}" width="${this.svg.width}"
          />
        </svg>
        `;
    // Must be svg. Render for the first time, if not in cache...
    // Render injected SVG's as invisible (add hidden class while injecting) and
    // remove that class when rendering from cache...
    } else if ((!cachedSvg) || (!this.config.options.svginject)) {
      return svg`
        <svg class="sak-usersvg__image ${this.config.options.svginject ? 'hidden' : ''}"
          data-id="usersvg-${this.toolId}" data-src="${images[this.item.image]}"
          x="${this.svg.x}" y="${this.svg.y}"
          style="${this.config.options.svginject ? '' : styleMap(this.styles.usersvg)}">
          "${clipPath}"
          <image
            clip-path="${clipPathUrl}"
            mask="${maskUrl}"
            href="${images[this.item.image]}"
            height="${this.svg.height}" width="${this.svg.width}"
          />
        </svg>
      `;
    // Render from cache and pass clip path and mask as reference...
    // Remove hidden class that prevented weird initial renderings
    } else {
      cachedSvg.classList.remove('hidden');
      return svg`
        <svg x="${this.svg.x}" y="${this.svg.y}" style="${styleMap(this.styles.usersvg)}"
          height="${this.svg.height}" width="${this.svg.width}"
          clip-path="${clipPathUrl}"
          mask="${maskUrl}"
        >
          "${clipPath}"
          ${cachedSvg};
       </svg>
       `;
    }
  }

  /** *****************************************************************************
  * UserSvgTool::render()
  *
  * Summary.
  * The render() function for this object.
  *
  */
  render() {
    return svg`
      <g id="usersvg-${this.toolId}" overflow="visible"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderUserSvg()}
      </g>
    `;
  }
} // END of class

/** ***************************************************************************
  * Toolset class
  *
  * Summary.
  *
  */

class Toolset {
  constructor(argCard, argConfig) {
    this.toolsetId = Math.random().toString(36).substr(2, 9);
    this._card = argCard;
    this.dev = { ...this._card.dev };
    if (this.dev.performance) console.time(`--> ${this.toolsetId} PERFORMANCE Toolset::constructor`);

    this.config = argConfig;
    this.tools = [];

    this.palette = {};
    this.palette.light = {};
    this.palette.dark = {};

    if (this.config.palette) {
      const { paletteLight, paletteDark } = Colors.processPalette(this.config.palette);
      this.palette.light = paletteLight;
      this.palette.dark = paletteDark;
    }
    // Get SVG coordinates.
    this.svg = {};
    this.svg.cx = Utils.calculateSvgCoordinate(argConfig.position.cx, SVG_DEFAULT_DIMENSIONS_HALF);
    this.svg.cy = Utils.calculateSvgCoordinate(argConfig.position.cy, SVG_DEFAULT_DIMENSIONS_HALF);

    this.svg.x = (this.svg.cx) - (SVG_DEFAULT_DIMENSIONS_HALF);
    this.svg.y = (this.svg.cy) - (SVG_DEFAULT_DIMENSIONS_HALF);

    // Group scaling experiment. Calc translate values for SVG using the toolset scale value
    this.transform = {};
    this.transform.scale = {};
    // eslint-disable-next-line no-multi-assign
    this.transform.scale.x = this.transform.scale.y = 1;
    this.transform.rotate = {};
    // eslint-disable-next-line no-multi-assign
    this.transform.rotate.x = this.transform.rotate.y = 0;
    this.transform.skew = {};
    // eslint-disable-next-line no-multi-assign
    this.transform.skew.x = this.transform.skew.y = 0;

    if (this.config.position.scale) {
      // eslint-disable-next-line no-multi-assign
      this.transform.scale.x = this.transform.scale.y = this.config.position.scale;
    }
    if (this.config.position.rotate) {
      // eslint-disable-next-line no-multi-assign
      this.transform.rotate.x = this.transform.rotate.y = this.config.position.rotate;
    }

    this.transform.scale.x = this.config.position.scale_x || this.config.position.scale || 1;
    this.transform.scale.y = this.config.position.scale_y || this.config.position.scale || 1;

    this.transform.rotate.x = this.config.position.rotate_x || this.config.position.rotate || 0;
    this.transform.rotate.y = this.config.position.rotate_y || this.config.position.rotate || 0;

    if (this.dev.debug) console.log('Toolset::constructor config/svg', this.toolsetId, this.config, this.svg);

    // Create the tools configured in the toolset list.
    const toolsNew = {
      area: EntityAreaTool,
      circslider: CircularSliderTool,
      badge: BadgeTool,
      bar: SparklineBarChartTool,
      circle: CircleTool,
      ellipse: EllipseTool,
      graph: SparklineGraphTool,
      horseshoe: HorseshoeTool,
      icon: EntityIconTool,
      line: LineTool,
      name: EntityNameTool,
      rectangle: RectangleTool,
      rectex: RectangleToolEx,
      regpoly: RegPolyTool,
      segarc: SegmentedArcTool,
      state: EntityStateTool,
      slider: RangeSliderTool,
      switch: SwitchTool,
      text: TextTool,
      usersvg: UserSvgTool,
    };

    this.config.tools.map((toolConfig) => {
      const newConfig = { ...toolConfig };

      const newPos = {
        cx: 0 / 100 * SVG_DEFAULT_DIMENSIONS,
        cy: 0 / 100 * SVG_DEFAULT_DIMENSIONS,
        scale: this.config.position.scale ? this.config.position.scale : 1,
      };

      if (this.dev.debug) console.log('Toolset::constructor toolConfig', this.toolsetId, newConfig, newPos);

      if (!toolConfig.disabled) {
        const newTool = new toolsNew[toolConfig.type](this, newConfig, newPos);
        // eslint-disable-next-line no-bitwise
        this._card.entityHistory.needed |= (toolConfig.type === 'bar');
        // eslint-disable-next-line no-bitwise
        this._card.entityHistory.needed |= (toolConfig.type === 'graph');
        this.tools.push({ type: toolConfig.type, index: toolConfig.id, tool: newTool });
      }
      return true;
    });

    if (this.dev.performance) console.timeEnd(`--> ${this.toolsetId} PERFORMANCE Toolset::constructor`);
  }

  /** *****************************************************************************
  * Toolset::updateValues()
  *
  * Summary.
  * Called from set hass to update values for tools
  *
  */

  // #TODO:
  // Update only the changed entity_index, not all indexes. Now ALL tools are updated...
  updateValues() {
    if (this.dev.performance) console.time(`--> ${this.toolsetId} PERFORMANCE Toolset::updateValues`);
    if (this.tools) {
      this.tools.map((item, index) => {
        // eslint-disable-next-line no-constant-condition
        {
          if ((item.tool.config.hasOwnProperty('entity_index'))) {
            if (this.dev.debug) console.log('Toolset::updateValues', item, index);
            // if (this.dev.debug) console.log('Toolset::updateValues', typeof item.tool._stateValue);

            // #IDEA @2021.11.20
            // What if for attribute and secondaryinfo the entity state itself is also passsed automatically
            // In that case that state is always present and can be used in animations by default.
            // No need to pass an extra entity_index.
            // A tool using the light brightness can also use the state (on/off) in that case for styling.
            //
            // Test can be done on 'state', 'attr', or 'secinfo' for default entity_index.
            //
            // Should pass a record in here orso as value { state : xx, attr: yy }

            item.tool.value = this._card.attributesStr[item.tool.config.entity_index]
              ? this._card.attributesStr[item.tool.config.entity_index]
              : this._card.secondaryInfoStr[item.tool.config.entity_index]
                ? this._card.secondaryInfoStr[item.tool.config.entity_index]
                : this._card.entitiesStr[item.tool.config.entity_index];
          }

          // Check for multiple entities specified, and pass them to the tool
          if ((item.tool.config.hasOwnProperty('entity_indexes'))) {
            // Update list of entities in single record and pass that to the tool
            // The first entity is used as the state, additional entities can help with animations,
            // (used for formatting classes/styles) or can be used in a derived entity

            const valueList = [];
            for (let i = 0; i < item.tool.config.entity_indexes.length; ++i) {
              valueList[i] = this._card.attributesStr[item.tool.config.entity_indexes[i].entity_index]
                ? this._card.attributesStr[item.tool.config.entity_indexes[i].entity_index]
                : this._card.secondaryInfoStr[item.tool.config.entity_indexes[i].entity_index]
                  ? this._card.secondaryInfoStr[item.tool.config.entity_indexes[i].entity_index]
                  : this._card.entitiesStr[item.tool.config.entity_indexes[i].entity_index];
            }

            item.tool.values = valueList;
          }
        }
        return true;
      });
    }
    if (this.dev.performance) console.timeEnd(`--> ${this.toolsetId} PERFORMANCE Toolset::updateValues`);
  }

  /** *****************************************************************************
  * Toolset::connectedCallback()
  *
  * Summary.
  *
  */
  connectedCallback() {
    if (this.dev.performance) console.time(`--> ${this.toolsetId} PERFORMANCE Toolset::connectedCallback`);

    if (this.dev.debug) console.log('*****Event - connectedCallback', this.toolsetId, new Date().getTime());
    if (this.dev.performance) console.timeEnd(`--> ${this.toolsetId} PERFORMANCE Toolset::connectedCallback`);
  }

  /** *****************************************************************************
  * Toolset::disconnectedCallback()
  *
  * Summary.
  *
  */
  disconnectedCallback() {
    if (this.dev.performance) console.time(`--> ${this.cardId} PERFORMANCE Toolset::disconnectedCallback`);

    if (this.dev.debug) console.log('*****Event - disconnectedCallback', this.toolsetId, new Date().getTime());
    if (this.dev.performance) console.timeEnd(`--> ${this.cardId} PERFORMANCE Toolset::disconnectedCallback`);
  }

  /** *****************************************************************************
  * Toolset::firstUpdated()
  *
  * Summary.
  *
  */
  firstUpdated(changedProperties) {
    if (this.dev.debug) console.log('*****Event - Toolset::firstUpdated', this.toolsetId, new Date().getTime());

    if (this.tools) {
      this.tools.map((item) => {
        if (typeof item.tool.firstUpdated === 'function') {
          item.tool.firstUpdated(changedProperties);
          return true;
        }
        return false;
      });
    }
  }

  /** *****************************************************************************
  * Toolset::updated()
  *
  * Summary.
  *
  */
  updated(changedProperties) {
    if (this.dev.debug) console.log('*****Event - Updated', this.toolsetId, new Date().getTime());

    if (this.tools) {
      this.tools.map((item) => {
        if (typeof item.tool.updated === 'function') {
          item.tool.updated(changedProperties);
          return true;
        }
        return false;
      });
    }
  }

  /** *****************************************************************************
  * Toolset::renderToolset()
  *
  * Summary.
  *
  */
  renderToolset() {
    if (this.dev.debug) console.log('*****Event - renderToolset', this.toolsetId, new Date().getTime());

    const svgItems = this.tools.map((item) => svg`
          ${item.tool.render()}
      `);
    return svg`${svgItems}`;
  }

  /** *****************************************************************************
  * Toolset::render()
  *
  * Summary.
  * The render() function for this toolset renders all the tools within this set.
  *
  * Important notes:
  * - the toolset position is set on the svg. That one accepts x,y
  * - scaling, rotating and skewing (and translating) is done on the parent group.
  *
  * The order of transformations are done from the child's perspective!!
  * So, the child (tools) gets positioned FIRST, and then scaled/rotated.
  *
  * See comments for different render paths for Apple/Safari and any other browser...
  *
  */

  render() {
    // Note:
    // Rotating a card can produce different results on several browsers.
    // A 1:1 card / toolset gives the same results, but other aspect ratio's may give different results.

    if (((this._card.isSafari) || (this._card.iOS)) && (!this._card.isSafari16)) {
      //
      // Render path for Safari if not Safari 16:
      //
      // Safari seems to ignore - although not always - the transform-box:fill-box setting.
      // - It needs the explicit center point when rotating. So this is added to the rotate() command.
      // - scale around center uses the "move object to 0,0 -> scale -> move object back to position" trick,
      //   where the second move takes scaling into account!
      // - Does not apply transforms from the child's point of view.
      //   Transform of toolset_position MUST take scaling of one level higher into account!
      //
      // Note: rotate is done around the defined center (cx,cy) of the toolsets position!
      //
      // More:
      // - Safari NEEDS the overflow:visible on the <svg> element, as it defaults to "svg:{overflow: hidden;}".
      //   Other browsers don't need that, they default to: "svg:not(:root) {overflow: hidden;}"
      //
      //   Without this setting, objects are cut-off or become invisible while scaled!

      return svg`
        <g id="toolset-${this.toolsetId}" class="toolset__group-outer"
           transform="rotate(${this.transform.rotate.x}, ${this.svg.cx}, ${this.svg.cy})
                      scale(${this.transform.scale.x}, ${this.transform.scale.y})
                      "
           style="transform-origin:center; transform-box:fill-box;">
          <svg style="overflow:visible;">
            <g class="toolset__group" transform="translate(${this.svg.cx / this.transform.scale.x}, ${this.svg.cy / this.transform.scale.y})"
            style="${styleMap(this._card.themeIsDarkMode()
              ? this.palette.dark
              : this.palette.light)}"
            >
              ${this.renderToolset()}
            </g>
            </svg>
        </g>
      `;
    } else {
      //
      // Render path for ANY other browser that usually follows the standards:
      //
      // - use transform-box:fill-box to make sure every transform is about the object itself!
      // - applying the rules seen from the child's point of view.
      //   So the transform on the toolset_position is NOT scaled, as the scaling is done one level higher.
      //
      // Note: rotate is done around the center of the bounding box. This might NOT be the toolsets center (cx,cy) position!
      //
      return svg`
        <g id="toolset-${this.toolsetId}" class="toolset__group-outer"
           transform="rotate(${this.transform.rotate.x}) scale(${this.transform.scale.x}, ${this.transform.scale.y})"
           style="transform-origin:center; transform-box:fill-box;">
          <svg style="overflow:visible;">
            <g class="toolset__group" transform="translate(${this.svg.cx}, ${this.svg.cy})"
            style="${styleMap(this._card.themeIsDarkMode()
              ? this.palette.dark
              : this.palette.light)}"
            >
              ${this.renderToolset()}
            </g>
            </svg>
        </g>
      `;
    }
  }
} // END of class

const rgb_hex = (component) => {
  const hex = Math.round(Math.min(Math.max(component, 0), 255)).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

const rgb2hex = (rgb) => `#${rgb_hex(rgb[0])}${rgb_hex(rgb[1])}${rgb_hex(rgb[2])}`;

const rgb2hsv = (rgb) => {
  const [r, g, b] = rgb;
  const v = Math.max(r, g, b);
  const c = v - Math.min(r, g, b);
  const h = c && (v === r ? (g - b) / c : v === g ? 2 + (b - r) / c : 4 + (r - g) / c);
  return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
};

const hsv2rgb = (hsv) => {
  const [h, s, v] = hsv;
  const f = (n) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  };
  return [f(5), f(3), f(1)];
};

const hs2rgb = (hs) => hsv2rgb([hs[0], hs[1], 255]);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const DEFAULT_MIN_KELVIN = 2700;
const DEFAULT_MAX_KELVIN = 6500;

const temperatureRed = (temperature) => {
  if (temperature <= 66) {
    return 255;
  }
  const red = 329.698727446 * (temperature - 60) ** -0.1332047592;
  return clamp(red, 0, 255);
};

const temperatureGreen = (temperature) => {
  let green;
  if (temperature <= 66) {
    green = 99.4708025861 * Math.log(temperature) - 161.1195681661;
  } else {
    green = 288.1221695283 * (temperature - 60) ** -0.0755148492;
  }
  return clamp(green, 0, 255);
};

const temperatureBlue = (temperature) => {
  if (temperature >= 66) {
    return 255;
  }
  if (temperature <= 19) {
    return 0;
  }
  const blue = 138.5177312231 * Math.log(temperature - 10) - 305.0447927307;
  return clamp(blue, 0, 255);
};

const temperature2rgb = (temperature) => {
  const value = temperature / 100;
  return [
    temperatureRed(value),
    temperatureGreen(value),
    temperatureBlue(value),
  ];
};

const matchMaxScale = (inputColors, outputColors) => {
  const maxIn = Math.max(...inputColors);
  const maxOut = Math.max(...outputColors);
  let factor;
  if (maxOut === 0) {
    factor = 0.0;
  } else {
    factor = maxIn / maxOut;
  }
  return outputColors.map((value) => Math.round(value * factor));
};

const mired2kelvin = (miredTemperature) => Math.floor(1000000 / miredTemperature);

const kelvin2mired = (kelvintTemperature) => Math.floor(1000000 / kelvintTemperature);

const rgbww2rgb = (rgbww, minKelvin, maxKelvin) => {
  const [r, g, b, cw, ww] = rgbww;
  // Calculate color temperature of the white channels
  const maxMireds = kelvin2mired(minKelvin ?? DEFAULT_MIN_KELVIN);
  const minMireds = kelvin2mired(maxKelvin ?? DEFAULT_MAX_KELVIN);
  const miredRange = maxMireds - minMireds;
  let ctRatio;
  try {
    ctRatio = ww / (cw + ww);
  } catch (_error) {
    ctRatio = 0.5;
  }
  const colorTempMired = minMireds + ctRatio * miredRange;
  const colorTempKelvin = colorTempMired ? mired2kelvin(colorTempMired) : 0;
  const [wR, wG, wB] = temperature2rgb(colorTempKelvin);
  const whiteLevel = Math.max(cw, ww) / 255;

  // Add the white channels to the rgb channels.
  const rgb = [r + wR * whiteLevel, g + wG * whiteLevel, b + wB * whiteLevel];

  // Match the output maximum value to the input. This ensures the
  // output doesn't overflow.
  return matchMaxScale([r, g, b, cw, ww], rgb);
};

const rgbw2rgb = (rgbw) => {
  const [r, g, b, w] = rgbw;
  const rgb = [r + w, g + w, b + w];
  return matchMaxScale([r, g, b, w], rgb);
};

/*
*
* Card      : swiss-army-knife-card.js
* Project   : Home Assistant
* Repository: https://github.com/AmoebeLabs/swiss-army-knife-card
*
* Author    : Mars @ AmoebeLabs.com
*
* License   : MIT
*
* -----
* Description:
*   The swiss army knife card, a versatile multi-tool custom card for
#   the one and only Home Assistant.
*
* Documentation Refs:
*   - https://swiss-army-knife-card-manual.amoebelabs.com/
*   - https://material3-themes-manual.amoebelabs.com/
*
*******************************************************************************
*/

console.info(
  `%c  SWISS-ARMY-KNIFE-CARD  \n%c      Version ${version}      `,
  'color: yellow; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// https://github.com/d3/d3-selection/blob/master/src/selection/data.js
//

/**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

class SwissArmyKnifeCard extends LitElement {
  // card::constructor
  constructor() {
    super();

    this.connected = false;

    Colors.setElement(this);

    // Get cardId for unique SVG gradient Id
    this.cardId = Math.random().toString(36).substr(2, 9);
    this.entities = [];
    this.entitiesStr = [];
    this.attributesStr = [];
    this.secondaryInfoStr = [];
    this.iconStr = [];
    this.viewBoxSize = SVG_VIEW_BOX;
    this.viewBox = { width: SVG_VIEW_BOX, height: SVG_VIEW_BOX };

    // Create the lists for the toolsets and the tools
    // - toolsets contain a list of toolsets with tools
    // - tools contain the full list of tools!
    this.toolsets = [];
    this.tools = [];

    // 2022.01.24
    // Add card styles functionality
    this.styles = {};
    this.styles.card = {};
    this.styles.card.default = {};
    this.styles.card.light = {};
    this.styles.card.dark = {};

    // For history query interval updates.
    this.entityHistory = {};
    this.entityHistory.needed = false;
    this.stateChanged = true;
    this.entityHistory.updating = false;
    this.entityHistory.update_interval = 300;
    // console.log("SAK Constructor,", this.entityHistory);

    // Development settings
    this.dev = {};
    this.dev.debug = false;
    this.dev.performance = false;
    this.dev.m3 = false;

    this.configIsSet = false;

    // Theme mode support
    this.theme = {};
    // Did not check for theme loading yet!
    this.theme.checked = false;
    this.theme.isLoaded = false;
    this.theme.modeChanged = false;
    this.theme.darkMode = false;
    this.theme.light = {};
    this.theme.dark = {};

    // Safari is the new IE.
    // Check for iOS / iPadOS / Safari to be able to work around some 'features'
    // Some bugs are already 9 years old, and not fixed yet by Apple!
    //
    // However: there is a new SVG engine on its way that might be released in 2023.
    // That should fix a lot of problems, adhere to standards, allow for hardware
    // acceleration and mixing HTML - through the foreignObject - with SVG!
    //
    // The first small fixes are in 16.2-16.4, which is why I have to check for
    // Safari 16, as that version can use the same renderpath as Chrome and Firefox!! WOW!!
    //
    // Detection from: http://jsfiddle.net/jlubean/dL5cLjxt/
    //
    // this.isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    // this.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // See: https://javascriptio.com/view/10924/detect-if-device-is-ios
    // After iOS 13 you should detect iOS devices like this, since iPad will not be detected as iOS devices
    // by old ways (due to new "desktop" options, enabled by default)

    // eslint-disable-next-line no-useless-escape
    this.isSafari = !!window.navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    this.iOS = (/iPad|iPhone|iPod/.test(window.navigator.userAgent)
                || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1))
                && !window.MSStream;
    this.isSafari14 = this.isSafari && /Version\/14\.[0-9]/.test(window.navigator.userAgent);
    this.isSafari15 = this.isSafari && /Version\/15\.[0-9]/.test(window.navigator.userAgent);
    this.isSafari16 = this.isSafari && /Version\/16\.[0-9]/.test(window.navigator.userAgent);
    this.isSafari16 = this.isSafari && /Version\/16\.[0-9]/.test(window.navigator.userAgent);

    // The iOS app does not use a standard agent string...
    // See: https://github.com/home-assistant/iOS/blob/master/Sources/Shared/API/HAAPI.swift
    // It contains strings like "like Safari" and "OS 14_2", and "iOS 14.2.0"

    this.isSafari14 = this.isSafari14 || /os 15.*like safari/.test(window.navigator.userAgent.toLowerCase());
    this.isSafari15 = this.isSafari15 || /os 14.*like safari/.test(window.navigator.userAgent.toLowerCase());
    this.isSafari16 = this.isSafari16 || /os 16.*like safari/.test(window.navigator.userAgent.toLowerCase());

    this.lovelace = SwissArmyKnifeCard.lovelace;

    if (!this.lovelace) {
      console.error("card::constructor - Can't get Lovelace panel");
      throw Error("card::constructor - Can't get Lovelace panel");
    }

    if (!SwissArmyKnifeCard.colorCache) {
      SwissArmyKnifeCard.colorCache = [];
    }

    this.palette = {};
    this.palette.light = {};
    this.palette.dark = {};

    if (this.dev.debug) console.log('*****Event - card - constructor', this.cardId, new Date().getTime());
  }

  static getSystemStyles() {
    return css`
      :host {
        cursor: default;
        font-size: ${FONT_SIZE}px;
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
        font-size: ${FONT_SIZE}px;
        }
      }
      @media screen and (max-width: 466px) {
        :host {
        font-size: ${FONT_SIZE}px;
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

    `;
  }

  /** *****************************************************************************
  * card::getUserStyles()
  *
  * Summary.
  * Returns the user defined CSS styles for the card in sak_user_templates config
  * section in lovelace configuration.
  *
  */

  static getUserStyles() {
    this.userContent = '';

    if ((SwissArmyKnifeCard.lovelace.config.sak_user_templates)
        && (SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_css_definitions)) {
      this.userContent = SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_css_definitions.reduce((accumulator, currentValue) => accumulator + currentValue.content, '');
    }

    return css`${unsafeCSS(this.userContent)}`;
  }

  static getSakStyles() {
    this.sakContent = '';

    if ((SwissArmyKnifeCard.lovelace.config.sak_sys_templates)
        && (SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_css_definitions)) {
      this.sakContent = SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_css_definitions.reduce((accumulator, currentValue) => accumulator + currentValue.content, '');
    }

    return css`${unsafeCSS(this.sakContent)}`;
  }

  static getSakSvgDefinitions() {
    SwissArmyKnifeCard.lovelace.sakSvgContent = null;
    let sakSvgContent = '';

    if ((SwissArmyKnifeCard.lovelace.config.sak_sys_templates)
        && (SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions)) {
      sakSvgContent = SwissArmyKnifeCard.lovelace.config.sak_sys_templates.definitions.sak_svg_definitions.reduce((accumulator, currentValue) => accumulator + currentValue.content, '');
    }
    // Cache result for later use in other cards
    SwissArmyKnifeCard.sakSvgContent = unsafeSVG(sakSvgContent);
  }

  static getUserSvgDefinitions() {
    SwissArmyKnifeCard.lovelace.userSvgContent = null;
    let userSvgContent = '';

    if ((SwissArmyKnifeCard.lovelace.config.sak_user_templates)
        && (SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_svg_definitions)) {
      userSvgContent = SwissArmyKnifeCard.lovelace.config.sak_user_templates.definitions.user_svg_definitions.reduce((accumulator, currentValue) => accumulator + currentValue.content, '');
    }
    // Cache result for later use other cards
    SwissArmyKnifeCard.userSvgContent = unsafeSVG(userSvgContent);
  }

  /** *****************************************************************************
  * card::get styles()
  *
  * Summary.
  * Returns the static CSS styles for the lit-element
  *
  * Note:
  * - The BEM (http://getbem.com/naming/) naming style for CSS is used
  *   Of course, if no mistakes are made ;-)
  *
  * Note2:
  * - get styles is a static function and is called ONCE at initialization.
  *   So, we need to get lovelace here...
  */
  static get styles() {
    // console.log('SAK - get styles');
    if (!SwissArmyKnifeCard.lovelace) SwissArmyKnifeCard.lovelace = Utils.getLovelace();

    if (!SwissArmyKnifeCard.lovelace) {
      console.error("SAK - Can't get reference to Lovelace");
      throw Error("card::get styles - Can't get Lovelace panel");
    }
    if (!SwissArmyKnifeCard.lovelace.config.sak_sys_templates) {
      console.error(version, ' - SAK - System Templates reference NOT defined.');
      throw Error(version, ' - card::get styles - System Templates reference NOT defined!');
    }
    if (!SwissArmyKnifeCard.lovelace.config.sak_user_templates) {
      console.warning(version, ' - SAK - User Templates reference NOT defined. Did you NOT include them?');
    }

    // #TESTING
    // Testing dark/light mode support for future functionality
    // const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    // console.log('get styles', darkModeMediaQuery);
    // darkModeMediaQuery.addListener((e) => {
    // const darkModeOn = e.matches;
    // console.log(`Dark mode is ${darkModeOn ? '🌒 on' : '☀️ off'}.`);
    // });
    // console.log('get styles 2', darkModeMediaQuery);

    // Get - only ONCE - the external SVG definitions for both SAK and UserSvgTool
    // These definitions are cached into the static class of the card
    //
    // Note: If you change a view, and do a refresh (F5) everything is loaded.
    // But after that: HA asks you to refresh the page --> BAM, all Lovelace
    // cached data is gone. So we need a check/reload in a card...

    SwissArmyKnifeCard.getSakSvgDefinitions();
    SwissArmyKnifeCard.getUserSvgDefinitions();

    return css`
      ${SwissArmyKnifeCard.getSystemStyles()}
      ${SwissArmyKnifeCard.getSakStyles()}
      ${SwissArmyKnifeCard.getUserStyles()}
    `;
  }

  /** *****************************************************************************
  * card::set hass()
  *
  * Summary.
  * Updates hass data for the card
  *
  */

  set hass(hass) {
    if (!this.counter) this.counter = 0;
    this.counter += 1;

    // Check for theme mode and theme mode change...
    this.theme.modeChanged = (hass.themes.darkMode !== this.theme.darkMode);
    if (this.theme.modeChanged) {
      this.theme.darkMode = hass.themes.darkMode;
    }

    // Process theme if specified and does exist, otherwise ignore
    // Theme is loaded only once at first call of set hass()
    if (!this.theme.checked) {
      this.theme.checked = true;
      if (this.config.theme && hass.themes.themes[this.config.theme]) {
        const { themeLight, themeDark } = Colors.processTheme(hass.themes.themes[this.config.theme]);
        this.theme.light = themeLight;
        this.theme.dark = themeDark;
        this.theme.isLoaded = true;
      }

      // Independent of theme loaded, adjust full card styles for light and dark mode
      // Load (if present) theme and palette stylings for optimum performance during rendering
      this.styles.card.light = {
         ...this.styles.card.default, ...this.theme.light, ...this.palette.light,
      };
      this.styles.card.dark = {
        ...this.styles.card.default, ...this.theme.dark, ...this.palette.dark,
      };
    }

    // Set ref to hass, use "_"for the name ;-)
    if (this.dev.debug) console.log('*****Event - card::set hass', this.cardId, new Date().getTime());
    this._hass = hass;

    if (!this.connected) {
      if (this.dev.debug) console.log('set hass but NOT connected', this.cardId);
    }

    if (!this.config.entities) {
      return;
    }

    let entityHasChanged = false;

    // Update state strings and check for changes.
    // Only if changed, continue and force render
    let value;
    let index = 0;

    let secInfoSet = false;
    let newSecInfoState;
    let newSecInfoStateStr;

    let newIconStr;

    let attrSet = false;
    let newStateStr;
    let entityIsUndefined = false;
    // eslint-disable-next-line no-restricted-syntax, no-unused-vars
    for (value of this.config.entities) {
      this.entities[index] = hass.states[this.config.entities[index].entity];

      entityIsUndefined = this.entities[index] === undefined;
      if (entityIsUndefined) {
        console.error('SAK - set hass, entity undefined: ', this.config.entities[index].entity);
        // Temp disable throw Error(`Set hass, entity undefined: ${this.config.entities[index].entity}`);
      }

      // Get secondary info state if specified and available
      if (this.config.entities[index].secondary_info) {
        secInfoSet = true;
        newSecInfoState = entityIsUndefined ? undefined : this.entities[index][this.config.entities[index].secondary_info];
        // newSecInfoStateStr = this._buildSecondaryInfo(newSecInfoState, this.config.entities[index]);
        newSecInfoStateStr = this._buildStateString(newSecInfoState, this.config.entities[index]);

        if (newSecInfoStateStr !== this.secondaryInfoStr[index]) {
          this.secondaryInfoStr[index] = newSecInfoStateStr;
          entityHasChanged = true;
        }
      }

      // Check for icon changes. Some icons can change independent of the state (battery) for instance
      // Only monitor this if no fixed icon specified in the configuration
      if (!this.config.entities[index].icon) {
        newIconStr = entityIsUndefined ? undefined : hass.states[this.config.entities[index].entity].attributes.icon;

        if (newIconStr !== this.iconStr[index]) {
          this.iconStr[index] = newIconStr;
          entityHasChanged = true;
        }
      }

      // Get attribute state if specified and available
      if (this.config.entities[index].attribute) {
        // #WIP:
        // Check for indexed or mapped attributes, like weather forecast (array of 5 days with a map containing attributes)....
        //
        // states['weather.home'].attributes['forecast'][0].detailed_description
        // attribute: forecast[0].condition
        //

        let { attribute } = this.config.entities[index];
        let attrMore = '';
        let attributeState = '';

        const arrayPos = this.config.entities[index].attribute.indexOf('[');
        const dotPos = this.config.entities[index].attribute.indexOf('.');
        let arrayIdx = 0;
        let arrayMap = '';

        if (arrayPos !== -1) {
          // We have an array. Split...
          attribute = this.config.entities[index].attribute.substr(0, arrayPos);
          attrMore = this.config.entities[index].attribute.substr(arrayPos, this.config.entities[index].attribute.length - arrayPos);

          // Just hack, assume single digit index...
          arrayIdx = attrMore[1];
          arrayMap = attrMore.substr(4, attrMore.length - 4);

          // Fetch state
          attributeState = this.entities[index].attributes[attribute][arrayIdx][arrayMap];
          // console.log('set hass, attributes with array/map', this.config.entities[index].attribute, attribute, attrMore, arrayIdx, arrayMap, attributeState);
        } else if (dotPos !== -1) {
          // We have a map. Split...
          attribute = this.config.entities[index].attribute.substr(0, dotPos);
          attrMore = this.config.entities[index].attribute.substr(arrayPos, this.config.entities[index].attribute.length - arrayPos);
          arrayMap = attrMore.substr(1, attrMore.length - 1);

          // Fetch state
          attributeState = this.entities[index].attributes[attribute][arrayMap];

          console.log('set hass, attributes with map', this.config.entities[index].attribute, attribute, attrMore);
        } else {
          // default attribute handling...
          attributeState = this.entities[index].attributes[attribute];
        }

        // eslint-disable-next-line no-constant-condition
        { // (typeof attributeState != 'undefined') {
          newStateStr = this._buildStateString(attributeState, this.config.entities[index]);
          if (newStateStr !== this.attributesStr[index]) {
            this.attributesStr[index] = newStateStr;
            entityHasChanged = true;
          }
          attrSet = true;
        }
        // 2021.10.30
        // Due to change in light percentage, check for undefined.
        // If bulb is off, NO percentage is given anymore, so is probably 'undefined'.
        // Any tool should still react to a percentage going from a valid value to undefined!
      }
      if ((!attrSet) && (!secInfoSet)) {
        newStateStr = entityIsUndefined ? undefined : this._buildStateString(this.entities[index].state, this.config.entities[index]);
        if (newStateStr !== this.entitiesStr[index]) {
          this.entitiesStr[index] = newStateStr;
          entityHasChanged = true;
        }
        if (this.dev.debug) console.log('set hass - attrSet=false', this.cardId, `${new Date().getSeconds().toString()}.${new Date().getMilliseconds().toString()}`, newStateStr);
      }

      // Extend a bit for entity changed. Might just help enough...
      entityHasChanged ||= attrSet || secInfoSet;

      index += 1;
      attrSet = false;
      secInfoSet = false;
    }

    if ((!entityHasChanged) && (!this.theme.modeChanged)) {
      // console.timeEnd("--> " + this.cardId + " PERFORMANCE card::hass");
      // I can see 50-60 times this message, without visible updates. So should batch update somehow
      // if no changed detected. Say timer of 200msec?
      // - if change -> cancel timer, and update
      // - if NO change -> start timer, if not yet running, otherwise leave running
      // console.log('set hass, no change detected..., but still updating!');
      // console.log('set hass, no change detected..., returning!');
      return;
    }

    // Either one of the entities has changed, or the theme mode. So update all toolsets with new data.
    if (this.toolsets) {
      this.toolsets.map((item) => {
        item.updateValues();
        return true;
      });
    }

    // Always request update to render the card if any of the states, attributes or theme mode have changed...

    // batch update?
    // set timer to every 1s
    // if change -> update
    // if update but no change --> timer
    this.requestUpdate();

    // An update has been requested to recalculate / redraw the tools, so reset theme mode changed
    this.theme.modeChanged = false;

    this.counter -= 1;

    // console.timeEnd("--> " + this.cardId + " PERFORMANCE card::hass");
  }

  /** *****************************************************************************
  * card::setConfig()
  *
  * Summary.
  * Sets/Updates the card configuration. Rarely called if the doc is right
  *
  */

  setConfig(config) {
    if (this.dev.performance) console.time(`--> ${this.cardId} PERFORMANCE card::setConfig`);

    if (this.dev.debug) console.log('*****Event - setConfig', this.cardId, new Date().getTime());
    config = JSON.parse(JSON.stringify(config));

    if (config.dev) this.dev = { ...this.dev, ...config.dev };

    if (this.dev.debug) console.log('setConfig', this.cardId);

    if (!config.layout) {
      throw Error('card::setConfig - No layout defined');
    }

    // Temp disable for layout template check...
    // if (!config.layout.toolsets) {
    // throw Error('card::setConfig - No toolsets defined');
    // }

    // testing
    if (config.entities) {
      const newdomain = computeDomain(config.entities[0].entity);
      if (newdomain !== 'sensor') {
        // If not a sensor, check if attribute is a number. If so, continue, otherwise Error...
        if (config.entities[0].attribute && !isNaN(config.entities[0].attribute)) {
          throw Error('card::setConfig - First entity or attribute must be a numbered sensorvalue, but is NOT');
        }
      }
    }

    // Copy config, as we must have write access to replace templates!
    const newConfig = Merge.mergeDeep(config);

    // #TODO must be removed after removal of segmented arcs part below
    this.config = newConfig;

    // NEW for ts processing
    this.toolset = [];

    const thisMe = this;
    function findTemplate(key, value) {
      // Filtering out properties
      // console.log("findTemplate, key=", key, "value=", value);
      if (value?.template) {
        const template = thisMe.lovelace.config.sak_user_templates.templates[value.template.name];
        if (!template) {
          console.error('Template not found...', value.template, template);
        }

        const replacedValue = Templates.replaceVariables3(value.template.variables, template);
        // Hmm. cannot add .template var. object is not extensible...
        // replacedValue.template = 'replaced';
        const secondValue = Merge.mergeDeep(replacedValue);
        // secondValue.from_template = 'replaced';

        return secondValue;
      }
      if (key === 'template') {
        // Template is gone via replace!!!! No template anymore, as there is no merge done.
        console.log('findTemplate return key=template/value', key, undefined);

        return value;
      }
      // console.log("findTemplate return key/value", key, value);
      return value;
    }

    // Find & Replace template definitions. This also supports layout templates
    const cfg = JSON.stringify(this.config, findTemplate);

    if (this.config.palette) {
      this.config.palette = JSON.parse(cfg).palette;
      const { paletteLight, paletteDark } = Colors.processPalette(this.config.palette);
      this.palette.light = paletteLight;
      this.palette.dark = paletteDark;
    }
    // To further process toolset templates, get reference to toolsets
    const cfgobj = JSON.parse(cfg).layout.toolsets;

    // Set layout template if found
    if (this.config.layout.template) {
      this.config.layout = JSON.parse(cfg).layout;
    }

    // Continue to check & replace partial toolset templates and overrides
    this.config.layout.toolsets.map((toolsetCfg, toolidx) => {
      let toolList = null;

      if (!this.toolsets) this.toolsets = [];

      // eslint-disable-next-line no-constant-condition
      {
        let found = false;
        let toolAdd = [];

        toolList = cfgobj[toolidx].tools;
        // Check for empty tool list. This can be if template is used. Tools come from template, not from config...
        if (toolsetCfg.tools) {
          toolsetCfg.tools.map((tool, index) => {
            cfgobj[toolidx].tools.map((toolT, indexT) => {
              if (tool.id === toolT.id) {
                if (toolsetCfg.template) {
                  if (this.config.layout.toolsets[toolidx].position)
                    cfgobj[toolidx].position = Merge.mergeDeep(this.config.layout.toolsets[toolidx].position);

                  toolList[indexT] = Merge.mergeDeep(toolList[indexT], tool);

                  // After merging/replacing. We might get some template definitions back!!!!!!
                  toolList[indexT] = JSON.parse(JSON.stringify(toolList[indexT], findTemplate));

                  found = true;
                }
                if (this.dev.debug) console.log('card::setConfig - got toolsetCfg toolid', tool, index, toolT, indexT, tool);
              }
              cfgobj[toolidx].tools[indexT] = Templates.getJsTemplateOrValueConfig(cfgobj[toolidx].tools[indexT], Merge.mergeDeep(cfgobj[toolidx].tools[indexT]));
              return found;
            });
            if (!found) toolAdd = toolAdd.concat(toolsetCfg.tools[index]);
            return found;
          });
        }
        toolList = toolList.concat(toolAdd);
      }

      toolsetCfg = cfgobj[toolidx];
      const newToolset = new Toolset(this, toolsetCfg);
      this.toolsets.push(newToolset);
      return true;
    });

    // Special case. Abuse card for m3 conversion to output
    if (this.dev.m3) {
      console.log('*** M3 - Checking for m3.yaml template to convert...');

      if (this.lovelace.config.sak_user_templates.templates.m3) {
        const { m3 } = this.lovelace.config.sak_user_templates.templates;

        console.log('*** M3 - Found. Material 3 conversion starting...');
        // These variables are used of course, but eslint thinks they are NOT.
        // If I remove them, eslint complains about undefined variables...
        // eslint-disable-next-line no-unused-vars
        let palette = '';
        // eslint-disable-next-line no-unused-vars
        let colordefault = '';
        // eslint-disable-next-line no-unused-vars
        let colorlight = '';
        // eslint-disable-next-line no-unused-vars
        let colordark = '';

        let surfacelight = '';
        let primarylight = '';
        let neutrallight = '';

        let surfacedark = '';
        let primarydark = '';
        let neutraldark = '';

        const colorEntities = {};
        const cssNames = {};
        const cssNamesRgb = {};

        m3.entities.map((entity) => {
          if (['ref.palette', 'sys.color', 'sys.color.light', 'sys.color.dark'].includes(entity.category_id)) {
            if (!entity.tags.includes('alias')) {
              colorEntities[entity.id] = { value: entity.value, tags: entity.tags };
            }
          }

          if (entity.category_id === 'ref.palette') {
            palette += `${entity.id}: '${entity.value}'\n`;

            // test for primary light color...
            if (entity.id === 'md.ref.palette.primary40') {
              primarylight = entity.value;
            }
            // test for primary dark color...
            if (entity.id === 'md.ref.palette.primary80') {
              primarydark = entity.value;
            }

            // test for neutral light color...
            if (entity.id === 'md.ref.palette.neutral40') {
              neutrallight = entity.value;
            }
            // test for neutral light color...
            if (entity.id === 'md.ref.palette.neutral80') {
              neutraldark = entity.value;
            }
          }

          if (entity.category_id === 'sys.color') {
            colordefault += `${entity.id}: '${entity.value}'\n`;
          }

          if (entity.category_id === 'sys.color.light') {
            colorlight += `${entity.id}: '${entity.value}'\n`;

            // test for surface light color...
            if (entity.id === 'md.sys.color.surface.light') {
              surfacelight = entity.value;
            }
          }

          if (entity.category_id === 'sys.color.dark') {
            colordark += `${entity.id}: '${entity.value}'\n`;

            // test for surface light color...
            if (entity.id === 'md.sys.color.surface.dark') {
              surfacedark = entity.value;
            }
          }
          return true;
        });

        ['primary', 'secondary', 'tertiary', 'error', 'neutral', 'neutral-variant'].forEach((paletteName) => {
          [5, 15, 25, 35, 45, 65, 75, 85].forEach((step) => {
            colorEntities[`md.ref.palette.${paletteName}${step.toString()}`] = {
              value: Colors.getGradientValue(
                colorEntities[`md.ref.palette.${paletteName}${(step - 5).toString()}`].value,
                colorEntities[`md.ref.palette.${paletteName}${(step + 5).toString()}`].value,
                0.5,
              ),
              tags: [...colorEntities[`md.ref.palette.${paletteName}${(step - 5).toString()}`].tags],
            };
            colorEntities[`md.ref.palette.${paletteName}${step.toString()}`].tags[3] = paletteName + step.toString();
          });
          colorEntities[`md.ref.palette.${paletteName}7`] = {
            value: Colors.getGradientValue(
              colorEntities[`md.ref.palette.${paletteName}5`].value,
              colorEntities[`md.ref.palette.${paletteName}10`].value,
              0.5,
            ),
            tags: [...colorEntities[`md.ref.palette.${paletteName}10`].tags],
          };
          colorEntities[`md.ref.palette.${paletteName}7`].tags[3] = `${paletteName}7`;

          colorEntities[`md.ref.palette.${paletteName}92`] = {
            value: Colors.getGradientValue(
              colorEntities[`md.ref.palette.${paletteName}90`].value,
              colorEntities[`md.ref.palette.${paletteName}95`].value,
              0.5,
            ),
            tags: [...colorEntities[`md.ref.palette.${paletteName}90`].tags],
          };
          colorEntities[`md.ref.palette.${paletteName}92`].tags[3] = `${paletteName}92`;

          colorEntities[`md.ref.palette.${paletteName}97`] = {
            value: Colors.getGradientValue(
              colorEntities[`md.ref.palette.${paletteName}95`].value,
              colorEntities[`md.ref.palette.${paletteName}99`].value,
              0.5,
            ),
            tags: [...colorEntities[`md.ref.palette.${paletteName}90`].tags],
          };
          colorEntities[`md.ref.palette.${paletteName}97`].tags[3] = `${paletteName}97`;
        });

        // eslint-disable-next-line no-restricted-syntax
        for (const [index, entity] of Object.entries(colorEntities)) {
          // eslint-disable-next-line no-use-before-define
          cssNames[index] = `theme-${entity.tags[1]}-${entity.tags[2]}-${entity.tags[3]}: rgb(${hex2rgb(entity.value)})`;
          // eslint-disable-next-line no-use-before-define
          cssNamesRgb[index] = `theme-${entity.tags[1]}-${entity.tags[2]}-${entity.tags[3]}-rgb: ${hex2rgb(entity.value)}`;
        }

        // https://filosophy.org/code/online-tool-to-lighten-color-without-alpha-channel/

        // eslint-disable-next-line no-inner-declarations
        function hex2rgb(hexColor) {
          const rgbCol = {};

          rgbCol.r = Math.round(parseInt(hexColor.substr(1, 2), 16));
          rgbCol.g = Math.round(parseInt(hexColor.substr(3, 2), 16));
          rgbCol.b = Math.round(parseInt(hexColor.substr(5, 2), 16));

          // const cssRgbColor = "rgb(" + rgbCol.r + "," + rgbCol.g + "," + rgbCol.b + ")";
          const cssRgbColor = `${rgbCol.r},${rgbCol.g},${rgbCol.b}`;
          return cssRgbColor;
        }

        // eslint-disable-next-line no-inner-declarations
        function getSurfaces(surfaceColor, paletteColor, opacities, cssName, mode) {
          const bgCol = {};
          const fgCol = {};

          bgCol.r = Math.round(parseInt(surfaceColor.substr(1, 2), 16));
          bgCol.g = Math.round(parseInt(surfaceColor.substr(3, 2), 16));
          bgCol.b = Math.round(parseInt(surfaceColor.substr(5, 2), 16));

          fgCol.r = Math.round(parseInt(paletteColor.substr(1, 2), 16));
          fgCol.g = Math.round(parseInt(paletteColor.substr(3, 2), 16));
          fgCol.b = Math.round(parseInt(paletteColor.substr(5, 2), 16));

          let surfaceColors = '';
          let r; let g; let b;
          opacities.forEach((opacity, index) => {
            r = Math.round(opacity * fgCol.r + (1 - opacity) * bgCol.r);
            g = Math.round(opacity * fgCol.g + (1 - opacity) * bgCol.g);
            b = Math.round(opacity * fgCol.b + (1 - opacity) * bgCol.b);

            surfaceColors += `${cssName + (index + 1).toString()}-${mode}: rgb(${r},${g},${b})\n`;
            surfaceColors += `${cssName + (index + 1).toString()}-${mode}-rgb: ${r},${g},${b}\n`;
          });

          return surfaceColors;
        }

        // Generate surfaces for dark and light...
        const opacitysurfacelight = [0.03, 0.05, 0.08, 0.11, 0.15, 0.19, 0.24, 0.29, 0.35, 0.4];
        const opacitysurfacedark = [0.05, 0.08, 0.11, 0.15, 0.19, 0.24, 0.29, 0.35, 0.40, 0.45];

        const surfacenL = getSurfaces(surfacelight, neutrallight, opacitysurfacelight, '  theme-ref-elevation-surface-neutral', 'light');

        const neutralvariantlight = colorEntities['md.ref.palette.neutral-variant40'].value;
        const surfacenvL = getSurfaces(surfacelight, neutralvariantlight, opacitysurfacelight, '  theme-ref-elevation-surface-neutral-variant', 'light');

        const surfacepL = getSurfaces(surfacelight, primarylight, opacitysurfacelight, '  theme-ref-elevation-surface-primary', 'light');

        const secondarylight = colorEntities['md.ref.palette.secondary40'].value;
        const surfacesL = getSurfaces(surfacelight, secondarylight, opacitysurfacelight, '  theme-ref-elevation-surface-secondary', 'light');

        const tertiarylight = colorEntities['md.ref.palette.tertiary40'].value;
        const surfacetL = getSurfaces(surfacelight, tertiarylight, opacitysurfacelight, '  theme-ref-elevation-surface-tertiary', 'light');

        const errorlight = colorEntities['md.ref.palette.error40'].value;
        const surfaceeL = getSurfaces(surfacelight, errorlight, opacitysurfacelight, '  theme-ref-elevation-surface-error', 'light');

        // DARK
        const surfacenD = getSurfaces(surfacedark, neutraldark, opacitysurfacedark, '  theme-ref-elevation-surface-neutral', 'dark');

        const neutralvariantdark = colorEntities['md.ref.palette.neutral-variant80'].value;
        const surfacenvD = getSurfaces(surfacedark, neutralvariantdark, opacitysurfacedark, '  theme-ref-elevation-surface-neutral-variant', 'dark');

        const surfacepD = getSurfaces(surfacedark, primarydark, opacitysurfacedark, '  theme-ref-elevation-surface-primary', 'dark');

        const secondarydark = colorEntities['md.ref.palette.secondary80'].value;
        const surfacesD = getSurfaces(surfacedark, secondarydark, opacitysurfacedark, '  theme-ref-elevation-surface-secondary', 'dark');

        const tertiarydark = colorEntities['md.ref.palette.tertiary80'].value;
        const surfacetD = getSurfaces(surfacedark, tertiarydark, opacitysurfacedark, '  theme-ref-elevation-surface-tertiary', 'dark');

        const errordark = colorEntities['md.ref.palette.error80'].value;
        const surfaceeD = getSurfaces(surfacedark, errordark, opacitysurfacedark, '  theme-ref-elevation-surface-error', 'dark');

        let themeDefs = '';
        // eslint-disable-next-line no-restricted-syntax
        for (const [index, cssName] of Object.entries(cssNames)) { // lgtm[js/unused-local-variable]
          if (cssName.substring(0, 9) === 'theme-ref') {
            themeDefs += `  ${cssName}\n`;
            themeDefs += `  ${cssNamesRgb[index]}\n`;
          }
        }
        // Dump full theme contents to console.
        // User should copy this content into the theme definition YAML file.
        console.log(surfacenL + surfacenvL + surfacepL + surfacesL + surfacetL + surfaceeL
                    + surfacenD + surfacenvD + surfacepD + surfacesD + surfacetD + surfaceeD
                    + themeDefs);

        console.log('*** M3 - Material 3 conversion DONE. You should copy the above output...');
      }
    }

    // Get aspectratio. This can be defined at card level or layout level
    this.aspectratio = (this.config.layout.aspectratio || this.config.aspectratio || '1/1').trim();

    const ar = this.aspectratio.split('/');
    if (!this.viewBox) this.viewBox = {};
    this.viewBox.width = ar[0] * SVG_DEFAULT_DIMENSIONS;
    this.viewBox.height = ar[1] * SVG_DEFAULT_DIMENSIONS;

    if (this.config.layout.styles?.card) {
      this.styles.card.default = this.config.layout.styles.card;
    }

    if (this.dev.debug) console.log('Step 5: toolconfig, list of toolsets', this.toolsets);
    if (this.dev.debug) console.log('debug - setConfig', this.cardId, this.config);
    if (this.dev.performance) console.timeEnd(`--> ${this.cardId} PERFORMANCE card::setConfig`);

    this.configIsSet = true;
  }

  /** *****************************************************************************
  * card::connectedCallback()
  *
  * Summary.
  *
  */
  connectedCallback() {
    if (this.dev.performance) console.time(`--> ${this.cardId} PERFORMANCE card::connectedCallback`);

    if (this.dev.debug) console.log('*****Event - connectedCallback', this.cardId, new Date().getTime());
    this.connected = true;
    super.connectedCallback();

    if (this.entityHistory.update_interval) {
      // Fix crash while set hass not yet called, and thus no access to entities!
      this.updateOnInterval();
      // #TODO, modify to total interval
      // Use fast interval at start, and normal interval after that, if _hass is defined...
      clearInterval(this.interval);
      this.interval = setInterval(
        () => this.updateOnInterval(),
        this._hass ? this.entityHistory.update_interval * 1000 : 1000,
      );
    }
    if (this.dev.debug) console.log('ConnectedCallback', this.cardId);

    // MUST request updates again, as no card is displayed otherwise as long as there is no data coming in...
    this.requestUpdate();
    if (this.dev.performance) console.timeEnd(`--> ${this.cardId} PERFORMANCE card::connectedCallback`);
  }

  /** *****************************************************************************
  * card::disconnectedCallback()
  *
  * Summary.
  *
  */
  disconnectedCallback() {
    if (this.dev.performance) console.time(`--> ${this.cardId} PERFORMANCE card::disconnectedCallback`);

    if (this.dev.debug) console.log('*****Event - disconnectedCallback', this.cardId, new Date().getTime());
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = 0;
    }
    super.disconnectedCallback();
    if (this.dev.debug) console.log('disconnectedCallback', this.cardId);
    this.connected = false;
    if (this.dev.performance) console.timeEnd(`--> ${this.cardId} PERFORMANCE card::disconnectedCallback`);
  }

  /** *****************************************************************************
  * card::firstUpdated()
  *
  * Summary.
  * firstUpdated fires after the first time the card hs been updated using its render method,
  * but before the browser has had a chance to paint.
  *
  */

  firstUpdated(changedProperties) {
    if (this.dev.debug) console.log('*****Event - card::firstUpdated', this.cardId, new Date().getTime());

    if (this.toolsets) {
      this.toolsets.map(async (item) => {
        item.firstUpdated(changedProperties);
        return true;
      });
    }
  }

  /** *****************************************************************************
  * card::updated()
  *
  * Summary.
  *
  */
  updated(changedProperties) {
    if (this.dev.debug) console.log('*****Event - Updated', this.cardId, new Date().getTime());

    if (this.toolsets) {
      this.toolsets.map(async (item) => {
        item.updated(changedProperties);
        return true;
      });
    }
  }

  /** *****************************************************************************
  * card::render()
  *
  * Summary.
  * Renders the complete SVG based card according to the specified layout.
  *
  * render ICON TESTING pathh lzwzmegla undefined undefined
  * render ICON TESTING pathh lzwzmegla undefined NodeList [ha-svg-icon]
  * render ICON TESTING pathh lzwzmegla M7,2V13H10V22L17,10H13L17,2H7Z NodeList [ha-svg-icon]
  */

  render() {
    if (this.dev.performance) console.time(`--> ${this.cardId} PERFORMANCE card::render`);
    if (this.dev.debug) console.log('*****Event - render', this.cardId, new Date().getTime());

    if (!this.connected) {
      if (this.dev.debug) console.log('render but NOT connected', this.cardId, new Date().getTime());
      return;
    }

    let myHtml;

    try {
      if (this.config.disable_card) {
        myHtml = html`
                  <div class="container" id="container">
                    ${this._renderSvg()}
                  </div>
                  `;
      } else {
        myHtml = html`
                  <ha-card style="${styleMap(this.styles.card.default)}">
                    <div class="container" id="container" 
                    >
                      ${this._renderSvg()}
                    </div>
                  </ha-card>
                  `;
      }
    } catch (error) {
      console.error(error);
    }
    if (this.dev.performance) console.timeEnd(`--> ${this.cardId} PERFORMANCE card::render`);

    return myHtml;
  }

  _renderSakSvgDefinitions() {
    return svg`
    ${SwissArmyKnifeCard.sakSvgContent}
    `;
  }

  _renderUserSvgDefinitions() {
    return svg`
    ${SwissArmyKnifeCard.userSvgContent}
    `;
  }

  themeIsDarkMode() {
    return (this.theme.darkMode === true);
  }

  themeIsLightMode() {
    return (this.theme.darkMode === false);
  }

  /** *****************************************************************************
  * card::_RenderToolsets()
  *
  * Summary.
  * Renders the toolsets
  *
  */

  _RenderToolsets() {
    if (this.dev.debug) console.log('all the tools in renderTools', this.tools);

    return svg`
              <g id="toolsets" class="toolsets__group"
              >
                ${this.toolsets.map((toolset) => toolset.render())}
              </g>

            <defs>
              ${this._renderSakSvgDefinitions()}
              ${this._renderUserSvgDefinitions()}
            </defs>
    `;
  }

  /** *****************************************************************************
  * card::_renderSvg()
  *
  * Summary.
  * Renders the SVG
  *
  * NTS:
  * If height and width given for svg it equals the viewbox. The card is not scaled
  * anymore to the full dimensions of the card given by hass/lovelace.
  * Card or svg is also placed default at start of viewport (not box), and can be
  * placed at start, center or end of viewport (Use align-self to center it).
  *
  * 1.  If height and width are ommitted, the ha-card/viewport is forced to the x/y
  *     aspect ratio of the viewbox, ie 1:1. EXACTLY WHAT WE WANT!
  * 2.  If height and width are set to 100%, the viewport (or ha-card) forces the
  *     aspect-ratio on the svg. Although GetCardSize is set to 4, it seems the
  *     height is forced to 150px, so part of the viewbox/svg is not shown or
  *     out of proportion!
  *
  */

  _renderCardAttributes() {
    let entityValue;
    const attributes = [];

    this._attributes = '';

    for (let i = 0; i < this.entities.length; i++) {
      entityValue = this.attributesStr[i]
        ? this.attributesStr[i]
        : this.secondaryInfoStr[i]
          ? this.secondaryInfoStr[i]
          : this.entitiesStr[i];
      attributes.push(entityValue);
    }
    this._attributes = attributes;
    return attributes;
  }

  _renderSvg() {
    const cardFilter = this.config.card_filter ? this.config.card_filter : 'card--filter-none';

    const svgItems = [];

    // The extra group is required for Safari to have filters work and updates are rendered.
    // If group omitted, some cards do update, and some not!!!! Don't ask why!
    // style="${styleMap(this.styles.card)}"

    this._renderCardAttributes();

    // @2022.01.26 Timing / Ordering problem:
    // - the _RenderToolsets() function renders tools, which build the this.styles/this.classes maps.
    // - However: this means that higher styles won't render until the next render, ie this.styles.card
    //   won't render, as this variable is already cached as it seems by Polymer.
    // - This is also the case for this.styles.tools/toolsets: they also don't work!
    //
    // Fix for card styles: render toolsets first, and then push the svg data!!

    const toolsetsSvg = this._RenderToolsets();

    svgItems.push(svg`
      <svg id="rootsvg" xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
       class="${cardFilter}"
       style="${styleMap(this.themeIsDarkMode()
          ? this.styles.card.dark
          : this.styles.card.light)}"
       data-entity-0="${this._attributes[0]}"
       data-entity-1="${ifDefined(this._attributes[1])}"
       data-entity-2="${ifDefined(this._attributes[2])}"
       data-entity-3="${ifDefined(this._attributes[3])}"
       data-entity-4="${ifDefined(this._attributes[4])}"
       data-entity-5="${ifDefined(this._attributes[5])}"
       data-entity-6="${ifDefined(this._attributes[6])}"
       data-entity-7="${ifDefined(this._attributes[7])}"
       data-entity-8="${ifDefined(this._attributes[8])}"
       data-entity-9="${ifDefined(this._attributes[9])}"
       viewBox="0 0 ${this.viewBox.width} ${this.viewBox.height}"
      >
        <g style="${styleMap(this.config.layout?.styles?.toolsets)}">
          ${toolsetsSvg}
        </g>
      </svg>`);

    return svg`${svgItems}`;
  }

  /** *****************************************************************************
  * card::_buildUom()
  *
  * Summary.
  * Builds the Unit of Measurement string.
  *
  */

  _buildUom(derivedEntity, entityState, entityConfig) {
    return (
      derivedEntity?.unit
      || entityConfig?.unit
      || entityState?.attributes.unit_of_measurement
      || ''
    );
  }

  toLocale(string, fallback = 'unknown') {
    const lang = this._hass.selectedLanguage || this._hass.language;
    const resources = this._hass.resources[lang];
    return (resources && resources[string] ? resources[string] : fallback);
  }

/** *****************************************************************************
  * card::_buildStateString()
  *
  * Summary.
  * Builds the State string.
  * If state is not a number, the state is returned AS IS, otherwise the state
  * is converted if specified before it is returned as a string
  *
  * IMPORTANT NOTE:
  * - do NOT replace isNaN() by Number.isNaN(). They are INCOMPATIBLE !!!!!!!!!
  */

_buildStateString(inState, entityConfig) {
  // Keep undefined as state. Do NOT change this one!!
  if (typeof inState === 'undefined') return inState;

  // New in v2.5.1: Check for built-in state converters
  if (entityConfig.convert) {
    // Match converter with parameter between ()
    let splitted = entityConfig.convert.match(/(^\w+)\((\d+)\)/);
    let converter;
    let parameter;
    // If no parameters found, just the converter
    if (splitted === null) {
      converter = entityConfig.convert;
    } else if (splitted.length === 3) { // If parameter found, process...
      converter = splitted[1];
      parameter = Number(splitted[2]);
    }
    switch (converter) {
      case 'brightness_pct':
        inState = inState === 'undefined' ? 'undefined' : `${Math.round((inState / 255) * 100)}`;
        break;
      case 'multiply':
        inState = `${Math.round((inState * parameter))}`;
        break;
      case 'divide':
        inState = `${Math.round((inState / parameter))}`;
        break;
      case 'rgb_csv':
      case 'rgb_hex':
        // https://github.com/home-assistant/frontend/blob/1bf03f020e2b2523081d4f03580886b51e970c72/src/dialogs/more-info/components/lights/ha-favorite-color-button.ts#L39
        // https://github.com/home-assistant/frontend/blob/1bf03f020e2b2523081d4f03580886b51e970c72/src/common/color/convert-light-color.ts
        // private get _rgbColor(): [number, number, number] {
        //   if (this.color) {
        //     if ("hs_color" in this.color) {
        //       return hs2rgb([this.color.hs_color[0], this.color.hs_color[1] / 100]);
        //     }
        //     if ("color_temp_kelvin" in this.color) {
        //       return temperature2rgb(this.color.color_temp_kelvin);
        //     }
        //     if ("rgb_color" in this.color) {
        //       return this.color.rgb_color;
        //     }
        //     if ("rgbw_color" in this.color) {
        //       return rgbw2rgb(this.color.rgbw_color);
        //     }
        //     if ("rgbww_color" in this.color) {
        //       return rgbww2rgb(
        //         this.color.rgbww_color,
        //         this.stateObj?.attributes.min_color_temp_kelvin,
        //         this.stateObj?.attributes.max_color_temp_kelvin
        //       );
        //     }
        //   }
        //   return [255, 255, 255];
        // }
        if (entityConfig.attribute) {
          let entity = this._hass.states[entityConfig.entity];
          switch (entity.attributes.color_mode) {
            case 'unknown':
              break;
            case 'onoff':
              break;
            case 'brightness':
                break;
            case 'color_temp':
              if (entity.attributes.color_temp_kelvin) {
                let rgb = temperature2rgb(entity.attributes.color_temp_kelvin);

                const hsvColor = rgb2hsv(rgb);
                // Modify the real rgb color for better contrast
                if (hsvColor[1] < 0.4) {
                  // Special case for very light color (e.g: white)
                  if (hsvColor[1] < 0.1) {
                    hsvColor[2] = 225;
                  } else {
                    hsvColor[1] = 0.4;
                  }
                }
                rgb = hsv2rgb(hsvColor);

                rgb[0] = Math.round(rgb[0]);
                rgb[1] = Math.round(rgb[1]);
                rgb[2] = Math.round(rgb[2]);
                if (converter === 'rgb_csv') {
                  inState = `${rgb[0]},${rgb[1]},${rgb[2]}`;
                } else {
                  inState = rgb2hex(rgb);
                }
              } else {
                if (converter === 'rgb_csv') {
                  inState = `${255},${255},${255}`;
                } else {
                  inState = '#ffffff00';
                }
              }
              break;
            case 'hs': {
                let rgb = hs2rgb([entity.attributes.hs_color[0], entity.attributes.hs_color[1] / 100]);
                rgb[0] = Math.round(rgb[0]);
                rgb[1] = Math.round(rgb[1]);
                rgb[2] = Math.round(rgb[2]);

                if (converter === 'rgb_csv') {
                  inState = `${rgb[0]},${rgb[1]},${rgb[2]}`;
                } else {
                  inState = rgb2hex(rgb);
                }
              }
              break;
            case 'rgb': {
                const hsvColor = rgb2hsv(this.stateObj.attributes.rgb_color);
                // Modify the real rgb color for better contrast
                if (hsvColor[1] < 0.4) {
                  // Special case for very light color (e.g: white)
                  if (hsvColor[1] < 0.1) {
                    hsvColor[2] = 225;
                  } else {
                    hsvColor[1] = 0.4;
                  }
                }
                const rgbColor = hsv2rgb(hsvColor);
                if (converter === 'rgb_csv') {
                  inState = rgbColor.toString();
                } else {
                  inState = rgb2hex(rgbColor);
                }
              }
              break;
            case 'rgbw': {
                let rgb = rgbw2rgb(entity.attributes.rgbw_color);
                rgb[0] = Math.round(rgb[0]);
                rgb[1] = Math.round(rgb[1]);
                rgb[2] = Math.round(rgb[2]);

                if (converter === 'rgb_csv') {
                  inState = `${rgb[0]},${rgb[1]},${rgb[2]}`;
                } else {
                  inState = rgb2hex(rgb);
                }
              }
              break;
            case 'rgbww': {
              let rgb = rgbww2rgb(entity.attributes.rgbww_color,
                                  entity.attributes?.min_color_temp_kelvin,
                                  entity.attributes?.max_color_temp_kelvin);
              rgb[0] = Math.round(rgb[0]);
              rgb[1] = Math.round(rgb[1]);
              rgb[2] = Math.round(rgb[2]);

              if (converter === 'rgb_csv') {
                inState = `${rgb[0]},${rgb[1]},${rgb[2]}`;
              } else {
                inState = rgb2hex(rgb);
              }
            }
            break;
            case 'white':
              break;
            case 'xy':
              if (entity.attributes.hs_color) {
                let rgb = hs2rgb([entity.attributes.hs_color[0], entity.attributes.hs_color[1] / 100]);
// https://github.com/home-assistant/frontend/blob/8580d3f9bf59ffbcbe4187a0d7a58cc23d9822df/src/dialogs/more-info/components/lights/ha-more-info-light-brightness.ts#L76
                // background slider has opacity of 0.2. Looks nice also, yes??
                const hsvColor = rgb2hsv(rgb);
                // Modify the real rgb color for better contrast
                if (hsvColor[1] < 0.4) {
                  // Special case for very light color (e.g: white)
                  if (hsvColor[1] < 0.1) {
                    hsvColor[2] = 225;
                  } else {
                    hsvColor[1] = 0.4;
                  }
                }
                rgb = hsv2rgb(hsvColor);
                rgb[0] = Math.round(rgb[0]);
                rgb[1] = Math.round(rgb[1]);
                rgb[2] = Math.round(rgb[2]);

                if (converter === 'rgb_csv') {
                  inState = `${rgb[0]},${rgb[1]},${rgb[2]}`;
                } else {
                  inState = rgb2hex(rgb);
                }
              } else if (entity.attributes.color) {
                // We should have h and s, including brightness...
                let hsl = {};
                hsl.l = entity.attributes.brightness;
                hsl.h = entity.attributes.color.h || entity.attributes.color.hue;
                hsl.s = entity.attributes.color.s || entity.attributes.color.saturation;
                // Convert HSL value to RGB
                // HERE
                let { r, g, b } = Colors.hslToRgb(hsl);
                if (converter === 'rgb_csv') {
                  inState = `${r},${g},${b}`;
                } else {
                  const rHex = Colors.padZero(r.toString(16));
                  const gHex = Colors.padZero(g.toString(16));
                  const bHex = Colors.padZero(b.toString(16));
                  inState = `#${rHex}${gHex}${bHex}`;
                }
              } else if (entity.attributes.xy_color) ;
              break;
          }
        }
        break;
      default:
        console.error(`Unknown converter [${converter}] specified for entity [${entityConfig.entity}]!`);
        break;
    }
  }
  if (typeof inState === 'undefined') { return undefined; }
  if (Number.isNaN(inState)) {
    return inState;
  }
  return inState.toString();
}

  _computeEntity(entityId) {
    return entityId.substr(entityId.indexOf('.') + 1);
  }

  // 2022.01.25 #TODO
  // Reset interval to 5 minutes: is now short I think after connectedCallback().
  // Only if _hass exists / is set --> set to 5 minutes!
  //
  // BUG: If no history entity, the interval check keeps running. Initially set to 2000ms, and
  // keeps running with that interval. If history present, interval is larger ????????
  //
  // There is no check yet, if history is requested. That is the only reason to have this
  // interval active!
  updateOnInterval() {
    // Only update if hass is already set, this might be not the case the first few calls...
    // console.log("updateOnInterval -> check...");
    if (!this._hass) {
      if (this.dev.debug) console.log('UpdateOnInterval - NO hass, returning');
      return;
    }
    // console.log('updateOnInterval', new Date(Date.now()).toString());
    // eslint-disable-next-line no-constant-condition
    { // (this.stateChanged && !this.entityHistory.updating) {
      // 2020.10.24
      // Leave true, as multiple entities can be fetched. fetch every 5 minutes...
      // this.stateChanged = false;
      // console.log('updateOnInterval - updateData', new Date(Date.now()).toString());
      this.updateData();
      // console.log("*RC* updateOnInterval -> updateData", this.entityHistory);
    }

    if (!this.entityHistory.needed) {
      // console.log("*RC* updateOnInterval -> stop timer", this.entityHistory, this.interval);
      if (this.interval) {
        window.clearInterval(this.interval);
        this.interval = 0;
      }
    } else {
      window.clearInterval(this.interval);
      this.interval = setInterval(
        () => this.updateOnInterval(),
        // 30 * 1000,
        this.entityHistory.update_interval * 1000,
      );
      // console.log("*RC* updateOnInterval -> start timer", this.entityHistory, this.interval);
    }
  }

  async fetchRecent(entityId, start, end, skipInitialState) {
    let url = 'history/period';
    if (start) url += `/${start.toISOString()}`;
    url += `?filter_entity_id=${entityId}`;
    if (end) url += `&end_time=${end.toISOString()}`;
    if (skipInitialState) url += '&skip_initial_state';
    url += '&minimal_response';

    console.log('update, fetchRecent - call is', entityId, start, end, skipInitialState, url);
    return this._hass.callApi('GET', url);
  }

  // async updateData({ config } = this) {
  async updateData() {
    this.entityHistory.updating = true;

    if (this.dev.debug) console.log('card::updateData - ENTRY', this.cardId);

    // We have a list of objects that might need some history update
    // Create list to fetch.
    const entityList = [];
    let j = 0;

    // #TODO
    // Lookup in this.tools for bars, or better tools that need history...
    // get that entity_index for that object
    // add to list...
    this.toolsets.map((toolset, k) => {
      toolset.tools.map((item, i) => {
        if ((item.type === 'bar')
        || (item.type === 'graph')) {
          const end = new Date();
          const start = new Date();
          if (item.tool.config.x_axis?.start_on === 'yesterday') {
            start.setHours(0, 0, 0, 0);
            start.setHours(start.getHours() - 24);
            end.setHours(0, 0, 0, 0);
            console.log('updateData, yesterday, setting hours', start, end);
          } else if ((item.tool.config.today === 'today') || (item.tool.config.x_axis?.start_on === 'today')) {
            start.setHours(0, 0, 0, 0);
          } else {
            start.setHours(end.getHours() - (item.tool.config.x_axis?.hours_to_show || item.tool.config.hours));
          }
          const attr = this.config.entities[item.tool.config.entity_index].attribute ? this.config.entities[item.tool.config.entity_index].attribute : null;

          entityList[j] = ({
            tsidx: k, entityIndex: item.tool.config.entity_index, entityId: this.entities[item.tool.config.entity_index].entity_id, attrId: attr, start, end, type: item.type, idx: i,
            // tsidx: k, entityIndex: item.tool.config.entity_index, entityId: this.entities[item.tool.config.entity_index].entity_id, attrId: attr, start, end, type: 'bar', idx: i,
          });
          j += 1;
        }
        return true;
      });
      return true;
    });

    if (this.dev.debug) console.log('card::updateData - LENGTH', this.cardId, entityList.length, entityList);

    // #TODO
    // Quick hack to block updates if entrylist is empty
    this.stateChanged = false;

    if (this.dev.debug) console.log('card::updateData, entityList from tools', entityList);

    try {
      //      const promise = this.config.layout.vbars.map((item, i) => this.updateEntity(item, entity, i, start, end));
      const promise = entityList.map((item, i) => this.updateEntity(item, i, item.start, item.end));
      await Promise.all(promise);
    } finally {
      this.entityHistory.updating = false;
    }
    this.entityHistory.updating = false;
  }

  async updateEntity(entity, index, initStart, end) {
    let stateHistory = [];
    const start = initStart;
    const skipInitialState = false;

    // Get history for this entity and/or attribute.
    let newStateHistory = await this.fetchRecent(entity.entityId, start, end, skipInitialState);
    console.log('update, updateEntity, newStateHistory', entity.entityId, start, end, newStateHistory);

    // Now we have some history, check if it has valid data and filter out either the entity state or
    // the entity attribute. Ain't that nice!

    // Hack for state mapping...
    if (entity.type === 'graph') {
      // console.log('pushing stateHistory into Graph!!!!', stateHistory);
      this.toolsets[entity.tsidx].tools[entity.idx].tool.processStateMap(newStateHistory);
    }

    let theState;

    if (newStateHistory[0] && newStateHistory[0].length > 0) {
      if (entity.attrId) {
        theState = this.entities[entity.entityIndex].attributes[this.config.entities[entity.entityIndex].attribute];
        entity.state = theState;
      }
      newStateHistory = newStateHistory[0].filter((item) => (entity.attrId ? !isNaN(parseFloat(item.attributes[entity.attrId])) : !isNaN(parseFloat(item.state))));

      newStateHistory = newStateHistory.map((item) => ({
        last_changed: item.last_changed,
        state: entity.attrId ? Number(item.attributes[entity.attrId]) : Number(item.state),
      }));
    }

    stateHistory = [...stateHistory, ...newStateHistory];

    // console.log('Got new stateHistory', entity);
    if (entity.type === 'graph') {
      // console.log('pushing stateHistory into Graph!!!!', stateHistory);
      this.toolsets[entity.tsidx].tools[entity.idx].tool.data = entity.entityIndex;
      this.toolsets[entity.tsidx].tools[entity.idx].tool.series = [...stateHistory];
      this.requestUpdate();
    } else {
      this.uppdate(entity, stateHistory);
    }
  }

  uppdate(entity, hist) {
    if (!hist) return;

    // #LGTM: Unused variable getMin.
    // Keep this one for later use!!!!!!!!!!!!!!!!!
    // const getMin = (arr, val) => arr.reduce((min, p) => (
    // Number(p[val]) < Number(min[val]) ? p : min
    // ), arr[0]);

    const getAvg = (arr, val) => arr.reduce((sum, p) => (
      sum + Number(p[val])
    ), 0) / arr.length;

    const now = new Date().getTime();

    let hours = 24;
    let barhours = 2;

    if ((entity.type === 'bar')
    || (entity.type === 'graph')) {
      if (this.dev.debug) console.log('entity.type == bar', entity);

      hours = this.toolsets[entity.tsidx].tools[entity.idx].tool.config.hours;
      barhours = this.toolsets[entity.tsidx].tools[entity.idx].tool.config.barhours;
    }

    const reduce = (res, item) => {
      const age = now - new Date(item.last_changed).getTime();
      const interval = (age / (1000 * 3600) / barhours) - (hours / barhours);
      const key = Math.floor(Math.abs(interval));
      if (!res[key]) res[key] = [];
      res[key].push(item);
      return res;
    };
    const coords = hist.reduce((res, item) => reduce(res, item), []);
    coords.length = Math.ceil(hours / barhours);

    // If no intervals found, return...
    if (Object.keys(coords).length === 0) {
      return;
    }

    // That STUPID STUPID Math.min/max can't handle empty arrays which are put into it below
    // so add some data to the array, and everything works!!!!!!

    // check if first interval contains data, if not find first in interval and use first entry as value...

    const firstInterval = Object.keys(coords)[0];
    if (firstInterval !== '0') {
      // first index doesn't contain data.
      coords[0] = [];

      coords[0].push(coords[firstInterval][0]);
    }

    for (let i = 0; i < (hours / barhours); i++) {
      if (!coords[i]) {
        coords[i] = [];
        coords[i].push(coords[i - 1][coords[i - 1].length - 1]);
      }
    }
    this.coords = coords;
    let theData = [];
    theData = [];
    theData = coords.map((item) => getAvg(item, 'state'));

    // now push data into object...
    if (['bar'].includes(entity.type)) {
    // if (entity.type === 'bar') {
      this.toolsets[entity.tsidx].tools[entity.idx].tool.series = [...theData];
    }

    // Request a rerender of the card after receiving new data
    this.requestUpdate();
  }

  /** *****************************************************************************
  * card::getCardSize()
  *
  * Summary.
  * Return a fixed value of 4 as the height.
  *
  */

  getCardSize() {
    return (4);
  }
}

/**
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

// Define the custom Swiss Army Knife card, so Lovelace / Lit can find the custom element!
customElements.define('swiss-army-knife-card', SwissArmyKnifeCard);
//# sourceMappingURL=swiss-army-knife-card.js.map
