import assert from 'assert';
import {
  choiceValuesMatch,
  coerceChoiceValue,
  findSelectedOption,
  findSelectedOptions,
  filterVisibleOptions,
  isOptionFieldType,
  isRichTextFieldType,
  normaliseChoiceValue,
  resolveFieldValue,
  resolveVisibleOptions,
  resolveTemplateContent,
  stringifyResolvedValue
} from '../../../../client/helpers/field-resolution';

describe('field resolution helpers', () => {
  describe('resolveFieldValue', () => {
    it('returns literal values unchanged', () => {
      assert.equal(resolveFieldValue('text', {}), 'text');
    });

    it('resolves function values against props', () => {
      assert.equal(resolveFieldValue(props => props.mode, { mode: 'standard' }), 'standard');
    });
  });

  describe('resolveTemplateContent', () => {
    it('renders mustache templates from string content', () => {
      assert.equal(resolveTemplateContent('Hello {{name}}', { name: 'world' }), 'Hello world');
    });

    it('renders mustache templates returned by functions', () => {
      assert.equal(resolveTemplateContent(() => 'Mode: {{mode}}', { mode: 'editable' }), 'Mode: editable');
    });

    it('returns non-string values unchanged', () => {
      assert.equal(resolveTemplateContent(() => true, {}), true);
    });
  });

  describe('stringifyResolvedValue', () => {
    it('stringifies strings numbers and booleans', () => {
      assert.equal(stringifyResolvedValue('test'), 'test');
      assert.equal(stringifyResolvedValue(3), '3');
      assert.equal(stringifyResolvedValue(false), 'false');
    });

    it('returns empty string for unsupported values', () => {
      assert.equal(stringifyResolvedValue({ value: 'x' }), '');
      assert.equal(stringifyResolvedValue(null), '');
    });
  });

  describe('coerceChoiceValue', () => {
    it('coerces boolean-like strings before matching', () => {
      assert.equal(coerceChoiceValue('true'), true);
      assert.equal(coerceChoiceValue('false'), false);
      assert.equal(coerceChoiceValue('mild'), 'mild');
    });
  });

  describe('normaliseChoiceValue', () => {
    it('normalises boolean-like strings', () => {
      assert.equal(normaliseChoiceValue('true'), true);
      assert.equal(normaliseChoiceValue('false'), false);
    });
  });

  describe('choiceValuesMatch', () => {
    it('matches strings case-insensitively and trims whitespace', () => {
      assert.equal(choiceValuesMatch(' Mild ', 'mild'), true);
    });

    it('matches booleans against string booleans', () => {
      assert.equal(choiceValuesMatch(true, 'true'), true);
      assert.equal(choiceValuesMatch(false, 'false'), true);
    });
  });

  describe('filterVisibleOptions', () => {
    it('filters nullish and hidden options', () => {
      const options = [
        null,
        { value: 'a' },
        { value: 'b', show: false },
        { value: 'c', show: values => values.includeC }
      ];

      assert.deepEqual(
        filterVisibleOptions(options, { includeC: true }).map(option => option.value),
        ['a', 'c']
      );
    });
  });

  describe('resolveVisibleOptions', () => {
    const options = [
      { value: 'a', label: props => props.mode === 'standard' ? 'Option A' : 'Editable A' },
      { value: 'b', label: 'Option B', hint: props => `Hint ${props.mode}` },
      'c'
    ];

    it('resolves visible option labels and hints against props', () => {
      assert.deepEqual(
        resolveVisibleOptions(options, { mode: 'standard' }),
        [
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B', hint: 'Hint standard' },
          'c'
        ]
      );
    });
  });

  describe('findSelectedOption', () => {
    const options = [
      { value: 'a', label: props => props.mode === 'standard' ? 'Option A' : 'Editable A' },
      { value: 'b', label: 'Option B', hint: props => `Hint ${props.mode}` },
      'c'
    ];

    it('finds selected options using normalised matching', () => {
      assert.deepEqual(
        findSelectedOption(resolveVisibleOptions(options, { mode: 'standard' }), ' A '),
        { value: 'a', label: 'Option A' }
      );
    });
  });

  describe('findSelectedOptions', () => {
    const options = [
      { value: 'a', label: props => props.mode === 'standard' ? 'Option A' : 'Editable A' },
      { value: 'b', label: 'Option B', hint: props => `Hint ${props.mode}` },
      'c'
    ];

    it('finds multiple selected options and supports string options', () => {
      assert.deepEqual(
        findSelectedOptions(resolveVisibleOptions(options, { mode: 'standard' }), ['b', 'c']),
        [
          { value: 'b', label: 'Option B', hint: 'Hint standard' },
          'c'
        ]
      );
    });
  });

  describe('field type predicates', () => {
    it('identifies option-backed field types', () => {
      assert.equal(isOptionFieldType('radio'), true);
      assert.equal(isOptionFieldType('checkbox'), true);
      assert.equal(isOptionFieldType('texteditor'), false);
    });

    it('identifies rich-text field types', () => {
      assert.equal(isRichTextFieldType('texteditor'), true);
      assert.equal(isRichTextFieldType('paragraph'), true);
      assert.equal(isRichTextFieldType('textarea'), false);
    });
  });
});


