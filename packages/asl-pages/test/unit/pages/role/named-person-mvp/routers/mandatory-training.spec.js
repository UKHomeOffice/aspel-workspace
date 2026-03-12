import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockApp = {
  post: jest.fn().mockReturnThis(),
  use: jest.fn().mockReturnThis()
};

const mockRouter = jest.fn(() => mockApp);
const mockForm = jest.fn(() => 'form-middleware');
const mockSchema = jest.fn(() => ({ mandatory: {} }));

jest.mock('express', () => ({
  Router: mockRouter
}));

jest.mock('../../../../../../pages/common/routers', () => ({
  form: mockForm
}));

jest.mock('../../../../../../pages/role/named-person-mvp/schema', () => ({
  mandatoryTraining: mockSchema
}));

describe('named person mvp mandatory-training router', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockApp.post.mockReturnThis();
    mockApp.use.mockReturnThis();
    mockRouter.mockReturnValue(mockApp);
    mockForm.mockReturnValue('form-middleware');
    mockSchema.mockReturnValue({ mandatory: {} });
  });

  test('uses a dedicated form id and reads role data from the select-role step', () => {
    const createRouter = require('../../../../../../pages/role/named-person-mvp/routers/mandatory-training');

    createRouter({ formId: 'new-role-named-person' });

    expect(mockRouter).toHaveBeenCalledWith({ mergeParams: true });
    expect(mockApp.use).toHaveBeenNthCalledWith(2, 'form-middleware');
    expect(mockForm).toHaveBeenCalledWith(
      expect.objectContaining({
        configure: expect.any(Function),
        locals: expect.any(Function)
      })
    );

    const setModelId = mockApp.use.mock.calls[0][0];
    const formConfig = mockForm.mock.calls[0][0];
    const req = {
      form: {},
      model: { id: 'new-role-named-person' },
      profile: {
        id: 'profile-1',
        firstName: 'Test'
      },
      session: {
        form: {
          'new-role-named-person': {
            values: {
              type: 'sqp'
            }
          }
        }
      }
    };
    const res = {
      locals: {
        static: {}
      }
    };
    const next = jest.fn();

    setModelId(req, res, next);
    expect(req.model.id).toBe('profile-1-mandatory-training');
    expect(next).toHaveBeenCalledTimes(1);

    formConfig.configure(req, res, next);
    expect(mockSchema).toHaveBeenCalledWith({ type: 'sqp' });
    expect(req.form.schema).toEqual({ mandatory: {} });
    expect(next).toHaveBeenCalledTimes(2);

    formConfig.locals(req, res, next);
    expect(res.locals.static.profile).toEqual(req.profile);
    expect(res.locals.static.role).toEqual({ type: 'sqp' });
    expect(next).toHaveBeenCalledTimes(3);
  });

  test('routes delay answers to incomplete training and direct answers to confirm', () => {
    const createRouter = require('../../../../../../pages/role/named-person-mvp/routers/mandatory-training');

    createRouter({ formId: 'new-role-named-person' });

    const postHandler = mockApp.post.mock.calls[0][1];
    const confirmReq = {
      buildRoute: jest.fn(() => '/role/named-person-mvp/confirm'),
      form: {
        values: {
          mandatory: 'exemption'
        }
      }
    };
    const confirmRes = { redirect: jest.fn() };

    postHandler(confirmReq, confirmRes);

    expect(confirmReq.buildRoute).toHaveBeenCalledWith('role.namedPersonMvp.confirm');
    expect(confirmRes.redirect).toHaveBeenCalledWith('/role/named-person-mvp/confirm');

    const incompleteReq = {
      buildRoute: jest.fn(() => '/role/named-person-mvp/incomplete-training'),
      form: {
        values: {
          mandatory: ['delay']
        }
      }
    };
    const incompleteRes = { redirect: jest.fn() };

    postHandler(incompleteReq, incompleteRes);

    expect(incompleteReq.buildRoute).toHaveBeenCalledWith('role.namedPersonMvp.incompleteTraining');
    expect(incompleteRes.redirect).toHaveBeenCalledWith('/role/named-person-mvp/incomplete-training');
  });
});