import React from 'react';
import Snippet from './snippet';

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
