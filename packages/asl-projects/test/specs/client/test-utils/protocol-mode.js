export const experimentalValues = {};

export const editableValues = {
  isStandardProtocol: false,
  standardProtocolType: 'editable'
};

export const standardValues = {
  isStandardProtocol: true,
  standardProtocolType: 'standard'
};

export const standardDisabledProps = {
  values: standardValues,
  standardProtocolsEnabled: false
};

export const sectionPropsFor = values => ({
  values,
  standardProtocolsEnabled: true
});

export const resolveFieldValue = (value, context) => {
  return typeof value === 'function'
    ? value(context)
    : value;
};

export const getFieldState = (field, context) => ({
  label: resolveFieldValue(field.label, context),
  hint: resolveFieldValue(field.hint, context),
  type: resolveFieldValue(field.type, context)
});

