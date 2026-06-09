import {
  isRichTextFieldType,
  resolveFieldValue,
  resolveVisibleOptions
} from './field-resolution';

export const getComparisonFieldConfig = props => {
  const resolvedType = resolveFieldValue(props.type, props);
  const comparisonType = isRichTextFieldType(resolvedType) ? 'texteditor' : resolvedType;
  const resolvedOptions = Array.isArray(props.options)
    ? resolveVisibleOptions(props.options, props)
    : props.options;

  return {
    resolvedType,
    comparisonType,
    resolvedOptions
  };
};

