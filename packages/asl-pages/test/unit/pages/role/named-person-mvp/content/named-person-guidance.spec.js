const { describe, expect, test } = require('@jest/globals');

const {
  getBeforeYouApplyRoleGuide,
  getBeforeYouApplySupportingLinks,
  getMandatoryTrainingSupportingLinks
} = require('../../../../../../pages/role/named-person-mvp/content/named-person-guidance');

describe('named person guidance', () => {
  test('normalizes role type when returning before-you-apply role guide metadata', () => {
    expect(getBeforeYouApplyRoleGuide('SQP')).toEqual({
      roleGuideLabel: 'SQP role guide',
      roleGuideUrl: 'https://www.gov.uk/guidance/nominate-someone-for-a-suitably-qualified-person-role'
    });
  });

  test('returns the before-you-apply supporting links for SQP', () => {
    expect(getBeforeYouApplySupportingLinks('SQP')).toEqual([
      {
        href: 'https://www.gov.uk/guidance/nominate-someone-for-a-suitably-qualified-person-role',
        label: 'SQP role guide'
      },
      {
        href: 'https://www.gov.uk/government/publications/conflict-of-interest-declaration-form-aspa-1986',
        label: 'Make a conflict of interest declaration'
      },
      {
        href: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#other-suitably-qualified-person',
        label: 'Guidance on the operation of the Animals (Scientific Procedures) Act 1986'
      }
    ]);
  });

  test('returns the corrected SQP mandatory training supporting links', () => {
    expect(getMandatoryTrainingSupportingLinks('sqp')).toEqual([
      {
        href: 'https://www.gov.uk/guidance/nominate-someone-for-a-suitably-qualified-person-role',
        label: 'Adding a SQP role'
      },
      {
        href: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#other-suitably-qualified-person',
        label: 'Guidance on the operation of the Animals (Scientific Procedures) Act 1986'
      }
    ]);
  });

  test('returns an empty list for unknown roles', () => {
    expect(getBeforeYouApplySupportingLinks('unknown')).toEqual([]);
    expect(getMandatoryTrainingSupportingLinks('unknown')).toEqual([]);
  });
});
