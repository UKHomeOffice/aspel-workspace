import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Snippet } from '../';
import { resolveDateError } from './resolve-error';

// Renders the GOV.UK Design System error message for a date field. GDS is now the
// DEFAULT for every date field (so new date fields get it automatically), driven by
// resolveDateError + the `errors.default.date.*` templates.
//
// Message priority:
//   - `validDate` -> always the GDS state (incomplete / real date / year length),
//     because a single "enter a valid date" is exactly the non-GDS wording we're
//     replacing. A page can still override via `errors.<field>.date.<key>`.
//   - `required` and the dateIs* constraints -> a page's own bespoke
//     `errors.<field>.<code>` message still wins (keeps agreed / e2e-tested wording);
//     GDS is the fallback.
// `{{dateLabel}}` is the field's noun-phrase; defaults to a safe generic "The date".
export const DateErrorMessage = ({ content, name, value, errorCode, validate, dateLabel: dateLabelProp, dateEnter, snippetProps = {} }) => {
    const resolved = resolveDateError({ value, errorCode, validate });

    if (!resolved) {
        // Unknown code - fall back to the field's plain message.
        return (
            <Snippet {...snippetProps} fallback={`errors.default.${errorCode}`}>
                {`errors.${name}.${errorCode}`}
            </Snippet>
        );
    }

    // Noun-phrase for the templates: the schema field's `dateLabel` (works for
    // dynamic fields), then content, then a safe generic.
    const dateLabel = dateLabelProp ?? get(content, `fields.${name}.dateLabel`) ?? 'The date';

    const gdsFieldKey = `errors.${name}.date.${resolved.key}`;
    const gdsDefaultKey = `errors.default.date.${resolved.key}`;
    const pageCodeKey = `errors.${name}.${errorCode}`;
    const legacyDefaultKey = `errors.default.${errorCode}`;

    let keys;
    if (errorCode === 'validDate') {
        // validDate leads with the GDS message (the finer state).
        keys = [gdsFieldKey, gdsDefaultKey, legacyDefaultKey];
    } else if (resolved.key === 'enter') {
        // "Enter ..." : page bespoke -> content override -> a schema-provided literal
        // (`dateEnter`, for dynamic fields with no content slot) -> generic default.
        keys = [
            pageCodeKey,
            gdsFieldKey,
            ...(dateEnter ? ['errors.default.date.enterLiteral'] : []),
            gdsDefaultKey,
            legacyDefaultKey
        ];
    } else {
        // required / constraints: page's own message wins, GDS is the fallback.
        keys = [pageCodeKey, gdsFieldKey, gdsDefaultKey, legacyDefaultKey];
    }

    return (
        <Snippet
            {...snippetProps}
            dateLabel={dateLabel}
            dateEnter={dateEnter}
            {...resolved.context}
            fallback={keys.slice(1)}
        >
            {keys[0]}
        </Snippet>
    );
};

const mapStateToProps = ({ static: { content } = {} }) => ({ content });

export default connect(mapStateToProps)(DateErrorMessage);
