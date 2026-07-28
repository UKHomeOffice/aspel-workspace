const React = require('react');

// ASL-5081 / ASL-5082 (WCAG 1.3.1 / 3.3.1): the upstream react-components inputs
// render their hint and error with ids `${id}-hint` / `${id}-error` but never
// point the control at them, so screen-reader users tabbing field-to-field miss
// the instruction and the error. These helpers let a thin subclass add
// `aria-describedby` to the control it wraps without copying the whole render.

// Build the describedby value from the ids the component already renders. Only
// includes a part when that part is actually present, and returns null when
// there is nothing to describe (so we never emit an empty attribute).
function describedByIds(id, { hint, error } = {}) {
    return [
        hint ? `${id}-hint` : null,
        error ? `${id}-error` : null
    ].filter(Boolean).join(' ') || null;
}

function addDescribedBy(element, describedBy) {
    const existing = element.props['aria-describedby'];
    return React.cloneElement(element, {
        'aria-describedby': existing ? `${existing} ${describedBy}` : describedBy
    });
}

// Clone the single child of `tree` (used when the control/fieldset is the only
// child - text input wrapper, radio/checkbox group).
function describeOnlyChild(tree, describedBy) {
    if (!describedBy) {
        return tree;
    }
    const child = React.Children.only(tree.props.children);
    return React.cloneElement(tree, {}, addDescribedBy(child, describedBy));
}

// Clone the first child of `tree` whose DOM type matches (select / textarea sit
// among sibling label / hint / error nodes).
function describeChildOfType(tree, type, describedBy) {
    if (!describedBy) {
        return tree;
    }
    const children = React.Children.map(tree.props.children, child =>
        (child && child.type === type) ? addDescribedBy(child, describedBy) : child
    );
    return React.cloneElement(tree, {}, children);
}

module.exports = { describedByIds, describeOnlyChild, describeChildOfType };
