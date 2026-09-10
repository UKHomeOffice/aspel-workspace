import React from 'react';
import Snippet from './snippet';

// ASL-5054 (WCAG 1.3.1): the upstream radio/checkbox groups render
// `<legend><h2>{label}</h2></legend>` whenever `label` is truthy. ASPeL passes a
// <Snippet> element, which is truthy even when its content resolves to nothing, so
// screens that deliberately blank the legend to avoid a duplicate heading still emit
// an empty <h2>. Snippet drops its `Wrapper` when the content is empty, so render the
// legend through that instead of upstream's hardcoded markup.
// Temporary workaround - ASL-5055 replaces the heading/legend pattern outright.

// Mirrors the upstream markup so a populated label renders exactly as before.
const Legend = ({ children }) => (
    <legend className="govuk-fieldset__legend">
        <h2 className="govuk-fieldset__heading govuk-heading-l">{ children }</h2>
    </legend>
);

// Only Snippet honours `Wrapper`, so any other label is left to upstream.
export default function suppressEmptyLegend(tree, label) {
    if (!React.isValidElement(label) || label.type !== Snippet) {
        return tree;
    }

    const fieldset = React.Children.only(tree.props.children);
    const children = React.Children.map(fieldset.props.children, child =>
        (child && child.type === 'legend')
            ? React.cloneElement(label, { Wrapper: Legend })
            : child
    );

    return React.cloneElement(tree, {}, React.cloneElement(fieldset, {}, children));
}
