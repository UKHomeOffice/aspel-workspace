import classnames from 'classnames';
import React, { Fragment } from 'react';
import map from 'lodash/map';
import size from 'lodash/size';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Snippet } from '../';

function Value({ value, format, model, nullValue, accessor, formatNullValue }) {
    value = accessor ? get(model, accessor) : value;
    if (!value && !formatNullValue) {
        return nullValue || '-';
    }
    return format ? format(value, model) : value;
}

const ModelSummary = ({ model, schema, formatters = {}, className, formatNullValue }) => {
    let fields = model;
    if (size(schema)) {
        fields = {};
        Object.keys(schema).map(key => {
            if (schema[key].show !== false && schema[key].showDiff !== false) {
                fields[key] = model[key];
            }
        });
    }
    return (
        <dl className={classnames('model-summary', 'inline', className)}>
            {
                map(fields, (item, key) => {
                    const options = schema[key] || {};
                    const snippetProps = formatters[key]?.renderContext ?? {};
                    return (
                        <Fragment key={key}>
                            <dt><Snippet {...snippetProps}>{`fields.${key}.label`}</Snippet></dt>
                            <dd>
                                <Value
                                    value={model[key]}
                                    format={formatters[key] && formatters[key].format}
                                    model={model}
                                    nullValue={options.nullValue}
                                    accessor={options.accessor}
                                    formatNullValue={formatNullValue}
                                />
                            </dd>
                        </Fragment>
                    );
                })
            }
        </dl>
    );
};

const mapStateToProps = ({ model, static: { schema } }, { formatters, schema: ownSchema, model: ownModel }) => ({
    model: ownModel || model,
    schema: ownSchema || schema,
    formatters
});

export default connect(mapStateToProps)(ModelSummary);
