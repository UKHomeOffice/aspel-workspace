import { calculateProtocolContext } from '../../../../helpers';
import { resolveFieldValue } from '../../../../helpers/field-resolution';

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

export function withProtocolContext(baseField, overrides = {}) {
  const editable = overrides.editable || {};
  const standard = overrides.standard || {};
  const overrideKeys = new Set([
    ...Object.keys(editable),
    ...Object.keys(standard)
  ]);

  const field = { ...baseField };

  overrideKeys.forEach(key => {
    field[key] = values => calculateProtocolContext(
      values,
      resolveFieldValue(baseField[key], values),
      hasOwn(editable, key) ? resolveFieldValue(editable[key], values) : resolveFieldValue(baseField[key], values),
      hasOwn(standard, key) ? resolveFieldValue(standard[key], values) : resolveFieldValue(baseField[key], values)
    );
  });

  return field;
}


