import classnames from 'classnames';
import React, { Fragment } from 'react';
import map from 'lodash/map';
import size from 'lodash/size';
import { connect } from 'react-redux';
import { Snippet } from '../';

const getValue = (value, format, model, nullValue, formatNullValue) => {
  if (!value && !formatNullValue) {
    return nullValue || '-';
  }
  return format ? format(value, model) : value;
};

const ModelSummary = ({ model, schema, formatters = {}, className, formatNullValue }) => {
  let fields = model;
  if (size(schema)) {
    fields = {};
    Object.keys(schema).map(key => {
      if (schema[key].show !== false) {
        fields[key] = model[key];
      }
    });
  }
  return (
    <dl className={classnames('model-summary', 'inline', className)}>
      {
        map(fields, (item, key) =>
          <Fragment key={key}>
            <dt><Snippet>{`fields.${key}.label`}</Snippet></dt>
            <dd>{getValue(model[key], formatters[key] && formatters[key].format, model, schema[key] && schema[key].nullValue, formatNullValue)}</dd>
          </Fragment>
        )
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
