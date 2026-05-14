const { describe, expect, it } = require('@jest/globals');
const getValidationErrors = require('../../../../../../pages/role/named-person-mvp/helpers/skills-and-experience-validation-errors');

describe('skillsAndExperienceValidationErrors', () => {
  it.each([
    ['NACWO', { experience: 'required' }, { experience: 'requiredNacwo' }],
    ['NIO', { experience: 'required' }, { experience: 'requiredNio' }],
    ['NVS', { experience: 'required' }, { experience: 'requiredNvs' }],
    ['PELH', { experience: 'required' }, { experience: 'requiredPelh' }],
    ['SQP', { experience: 'required' }, { experience: 'requiredSqp' }],
    ['NTCO', { experience: 'required', communication: 'required' }, { experience: 'requiredNtco', communication: 'requiredNtco' }]
  ])('maps required errors for %s', (roleType, validationErrors, expected) => {
    expect(getValidationErrors(roleType, validationErrors)).toEqual(expected);
  });

  it('preserves unrelated validation errors', () => {
    const validationErrors = {
      experience: 'lessThanOrEqualToMaxWordCount',
      communication: 'required',
      form: 'invalid'
    };

    expect(getValidationErrors('NVS', validationErrors)).toEqual(validationErrors);
  });

  it('returns validation errors unchanged for roles with no remapping', () => {
    const validationErrors = {
      experience: 'required'
    };

    expect(getValidationErrors('NPRC', validationErrors)).toEqual(validationErrors);
  });
});
