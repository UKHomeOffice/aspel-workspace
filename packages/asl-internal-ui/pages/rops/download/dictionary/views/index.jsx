import React, { Fragment } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import map from 'lodash/map';
import { Header } from '@asl/components';

function Field({ name, field }) {
  return (
    <Fragment>
      <h2>{name}</h2>
      <p>{field.label}</p>
      {
        field.options && (
          <dl>
            {
              map(field.options, (value, key) => (
                <Fragment key={key}>
                  <dt>{key}</dt>
                  <dd>{ value.label || value }</dd>
                </Fragment>
              ))
            }
          </dl>
        )
      }
    </Fragment>
  );
}

export default function Dictionary() {
  const { ropsFields, proceduresFields } = useSelector(state => state.static, shallowEqual);

  return (
    <Fragment>
      <Header
        title="ROPS data dictionary"
      />
      <h1>ROPS</h1>
      {
        map(ropsFields, (field, name) => <Field key={name} field={field} name={name} />)
      }
      <h1>Procedures</h1>
      {
        map(proceduresFields, (field, name) => <Field key={name} field={field} name={name} />)
      }
    </Fragment>
  );
}
