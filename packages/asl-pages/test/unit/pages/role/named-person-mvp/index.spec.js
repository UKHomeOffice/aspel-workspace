import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockApp = {
  get: jest.fn().mockReturnThis(),
  post: jest.fn().mockReturnThis(),
  use: jest.fn().mockReturnThis()
};

const mockPage = jest.fn(() => mockApp);
const mockSelectRole = jest.fn(() => 'select-role-router');
const mockBeforeYouApply = jest.fn(() => 'before-you-apply-router');
const mockMandatoryTraining = jest.fn(() => 'mandatory-training-router');

jest.mock('@asl/service/ui', () => ({
  page: mockPage
}));

jest.mock('@asl/service/ui/feature-flag', () => ({
  FEATURE_FLAG_NAMED_PERSON_MVP: 'named-person-mvp'
}));

jest.mock('../../../../../pages/role/named-person-mvp/routers', () => ({
  selectRole: mockSelectRole,
  beforeYouApply: mockBeforeYouApply,
  mandatoryTraining: mockMandatoryTraining
}));

jest.mock('../../../../../pages/role/named-person-mvp/schema', () => ({
  selectRole: jest.fn(() => ({}))
}));

jest.mock('../../../../../lib/utils', () => ({
  buildModel: jest.fn(() => ({}))
}));

jest.mock('../../../../../pages/role/helper', () => ({
  PELH_OR_NPRC_ROLES: []
}));

describe('named person mvp route wiring', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockApp.get.mockReturnThis();
    mockApp.post.mockReturnThis();
    mockApp.use.mockReturnThis();
    mockPage.mockReturnValue(mockApp);
    mockSelectRole.mockReturnValue('select-role-router');
    mockBeforeYouApply.mockReturnValue('before-you-apply-router');
    mockMandatoryTraining.mockReturnValue('mandatory-training-router');
  });

  test('passes select-role dependencies to the child router', () => {
    const createPage = require('../../../../../pages/role/named-person-mvp');

    createPage({});

    expect(mockSelectRole).toHaveBeenCalledWith(
      expect.objectContaining({
        formId: 'new-role-named-person',
        getRoleSchema: expect.any(Function)
      })
    );
    expect(mockApp.use).toHaveBeenCalledWith('/select-role', 'select-role-router');
    expect(mockApp.use).toHaveBeenCalledWith('/before-you-apply', 'before-you-apply-router');
    expect(mockApp.use).toHaveBeenCalledWith('/mandatory-training', 'mandatory-training-router');
  });
});
