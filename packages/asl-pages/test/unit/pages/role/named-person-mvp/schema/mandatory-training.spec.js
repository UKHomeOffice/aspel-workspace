import { describe, expect, test } from '@jest/globals';

const schema = require('../../../../../../pages/role/named-person-mvp/schema/mandatory-training');

describe('named person mvp mandatory training schema', () => {
  test('returns two explicit SQP options without a delay path', () => {
    const options = schema({ type: 'sqp' }).mandatory.options;

    expect(options).toEqual([
      {
        label: 'Yes',
        value: 'yes',
        behaviour: 'exclusive'
      },
      {
        label: 'No, they have requested an exemption from one or more modules',
        value: 'exemption'
      }
    ]);
    expect(options).not.toContain(false);
    expect(options.find((option) => option.value === 'delay')).toBeUndefined();
  });

  test('preserves the NVS delay option and hint', () => {
    const options = schema({ type: 'nvs' }).mandatory.options;

    expect(options).toEqual([
      {
        label: 'Yes',
        value: 'yes',
        behaviour: 'exclusive'
      },
      {
        id: 'divider',
        divider: 'Or select each that applies:',
        className: 'govuk-checkboxes__divider govuk-checkboxes__divider-wide'
      },
      {
        label: 'They have requested an exemption from one or more modules',
        value: 'exemption'
      },
      {
        label: 'They have not yet completed the NVS module',
        value: 'delay',
        hint: 'They will complete it within 12 months of starting the role.'
      }
    ]);
  });
});
