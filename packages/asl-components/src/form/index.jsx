import mapValues from 'lodash/mapValues';
import { connect } from 'react-redux';
import Form from './form';

const extendSchema = (field, formatter) => {
  if (!formatter) {
    return field;
  }
  return {
    ...field,
    options: formatter.mapOptions ? field.options.map(formatter.mapOptions) : field.options,
    showIf: formatter.showIf
  };
};

const mapStateToProps = ({ static: { schema, errors, csrfToken }, model }, { formatters = {}, model: ownModel, schema: ownSchema }) => {
  schema = ownSchema || schema;
  return {
    model: ownModel || model,
    errors,
    csrfToken,
    schema: mapValues(schema, (field, key) => extendSchema(field, formatters[key]))
  };
};

export default connect(mapStateToProps)(Form);
