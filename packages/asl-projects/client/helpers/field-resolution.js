import Mustache from 'mustache';

export const resolveFieldValue = (value, props) => {
  let resolved = value;
  let depth = 0;

  while (typeof resolved === 'function' && depth < 10) {
    const next = resolved(props);

    if (next === resolved) {
      break;
    }

    resolved = next;
    depth += 1;
  }

  return resolved;
};

export const resolveTemplateContent = (template, props) => {
  const resolved = resolveFieldValue(template, props);
  return typeof resolved === 'string' ? Mustache.render(resolved, props) : resolved;
};

export const stringifyResolvedValue = value => {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return `${value}`;
  }
  return '';
};

const getOptionValue = option => typeof option === 'string' ? option : option?.value;
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

export const resolveOption = (option, props) => {
  if (typeof option === 'string' || !option) {
    return option;
  }

  return {
    ...option,
    ...(hasOwn(option, 'label') ? { label: resolveFieldValue(option.label, props) } : {}),
    ...(hasOwn(option, 'hint') ? { hint: resolveFieldValue(option.hint, props) } : {})
  };
};

export const normaliseChoiceValue = value => {
  value = coerceChoiceValue(value);
  if (typeof value === 'string') return value.trim().toLowerCase();
  return value;
};

export const choiceValuesMatch = (left, right) => {
  return normaliseChoiceValue(left) === normaliseChoiceValue(right);
};

export const optionIsVisible = (option, values) => {
  if (!option) {
    return false;
  }

  if (typeof option.show === 'function') {
    return option.show(values);
  }

  return option.show === undefined || Boolean(option.show);
};

export const filterVisibleOptions = (options = [], values) => {
  return options.filter(option => optionIsVisible(option, values));
};

export const resolveVisibleOptions = (options = [], values) => {
  return filterVisibleOptions(options, values).map(option => resolveOption(option, values));
};

export const coerceChoiceValue = value => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

export const findSelectedOption = (options = [], value) => {
  return options.find(option => choiceValuesMatch(getOptionValue(option), value));
};

export const findSelectedOptions = (options = [], value) => {
  const selectedValues = Array.isArray(value)
    ? value
    : [value].filter(item => item !== undefined && item !== null);

  return options.filter(option => selectedValues.some(selected => choiceValuesMatch(selected, getOptionValue(option))));
};

export const isOptionFieldType = type => ['checkbox', 'radio', 'select', 'permissible-purpose'].includes(type);

export const isRichTextFieldType = type => ['texteditor', 'paragraph'].includes(type);

