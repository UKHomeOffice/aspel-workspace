import classnames from 'classnames';
import React, { Fragment } from 'react';
import map from 'lodash/map';
import pick from 'lodash/pick';
import { connect } from 'react-redux';
import { Snippet } from '../';

const getValue = (value, format) => {
  if (!value) {
    return '-';
  }
  return format ? format(value) : value;
};

const ModelSummary = ({ model, schema, formatters = {}, className }) => {
  if (schema) {
    model = pick(model, Object.keys(schema));
  }
  return (
    <dl className={classnames('inline', className)}>
      {
        map(model, (item, key) =>
          <Fragment key={key}>
            <dt><Snippet>{`fields.${key}.label`}</Snippet></dt>
            <dd>{getValue(model[key], formatters[key] && formatters[key].format)}</dd>
          </Fragment>
        )
      }
    </dl>
  );
};

const mapStateToProps = ({ model, static: { schema } }, { formatters, schema: ownSchema }) => ({
  model,
  formatters,
  schema: ownSchema || schema
});

export default connect(mapStateToProps)(ModelSummary);
