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

function ModelProperty({ property, model, formatters, specification, formatNullValue }) {
    const snippetProps = formatters[property]?.renderContext ?? {};
    const selectedOption = specification.options?.find(({ value }) => value === model[property]);

    return (
        <Fragment>
            <dt><Snippet {...snippetProps}>{`fields.${property}.label`}</Snippet></dt>
            <dd>
                <Value
                    value={model[property]}
                    format={formatters[property] && formatters[property].format}
                    model={model}
                    nullValue={specification.nullValue}
                    accessor={specification.accessor}
                    formatNullValue={formatNullValue}
                />
            </dd>
            {selectedOption?.reveal &&
                Object.entries(selectedOption.reveal).map(([key, value]) =>
                    <ModelProperty
                        key={key}
                        property={key}
                        model={model}
                        formatters={formatters}
                        specification={value}
                        formatNullValue={formatNullValue}
                    />
                )
            }
        </Fragment>
    );
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
                    return <ModelProperty
                        key={key}
                        property={key}
                        model={model}
                        formatters={formatters}
                        specification={schema[key] || {}}
                        formatNullValue={formatNullValue}
                    />;
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
