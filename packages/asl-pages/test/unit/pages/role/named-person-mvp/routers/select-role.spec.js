import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockApp = {
  post: jest.fn().mockReturnThis(),
  use: jest.fn().mockReturnThis()
};

const mockRouter = jest.fn(() => mockApp);
const mockForm = jest.fn(() => 'form-middleware');

jest.mock('express', () => ({
  Router: mockRouter
}));

jest.mock('../../../../../../pages/common/routers', () => ({
  form: mockForm
}));

jest.mock('../../../../../../pages/role/helper', () => ({
  PELH_OR_NPRC_ROLES: ['pelh', 'nprc']
}));

describe('named person mvp select-role router', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockApp.post.mockReturnThis();
    mockApp.use.mockReturnThis();
    mockRouter.mockReturnValue(mockApp);
    mockForm.mockReturnValue('form-middleware');
  });

  test('owns the select-role form middleware and redirect', () => {
    const getRoleSchema = jest.fn(() => ({
      type: {},
      rcvsNumber: {}
    }));
    const createRouter = require('../../../../../../pages/role/named-person-mvp/routers/select-role');

    createRouter({ formId: 'new-role-named-person', getRoleSchema });

    expect(mockRouter).toHaveBeenCalledWith({ mergeParams: true });
    expect(mockForm).toHaveBeenCalledWith(
      expect.objectContaining({
        configure: expect.any(Function),
        getValues: expect.any(Function),
        locals: expect.any(Function),
        saveValues: expect.any(Function)
      })
    );
    expect(mockApp.use).toHaveBeenCalledWith('form-middleware');
    expect(mockApp.post).toHaveBeenCalledWith('/', expect.any(Function));

    const formConfig = mockForm.mock.calls[0][0];
    const req = {
      establishment: { name: 'Test Establishment' },
      establishmentId: 'est-1',
      form: { values: {} },
      model: { openTasks: ['warning'] },
      profile: {
        openTasks: [
          {
            id: 'task-1',
            data: {
              model: 'role',
              action: 'create',
              data: { type: 'nio' }
            }
          }
        ],
        rcvsNumber: 'R123',
        roles: [
          { establishmentId: 'est-1', type: 'nacwo' },
          { establishmentId: 'other', type: 'ntco' }
        ]
      },
      profileId: 'profile-1',
      session: {
        form: {
          'new-role-named-person': {
            values: {}
          }
        }
      },
      user: {
        profile: {
          id: 'profile-1'
        }
      }
    };
    const res = {
      locals: {
        static: {
          content: { title: 'Select role' },
          pelhOrNprcTasks: [{ id: 'task-2', type: 'pelh' }]
        }
      },
      redirect: jest.fn()
    };
    const next = jest.fn();

    formConfig.configure(req, res, next);
    expect(getRoleSchema).toHaveBeenCalledWith(
      ['nacwo', 'nio', 'pelh', 'nprc'],
      req.establishment
    );
    expect(req.form.schema).toEqual({ type: {}, rcvsNumber: {} });
    expect(req.model.openTasks).toEqual([]);

    formConfig.getValues(req, res, next);
    expect(req.form.values.rcvsNumber).toBe('R123');
    expect(next).toHaveBeenCalledTimes(2);

    formConfig.locals(req, res, next);
    expect(res.locals.static.schema).toEqual({ type: {} });
    expect(res.locals.static.ownProfile).toBe(true);
    expect(res.locals.pageTitle).toBe('Select role - Test Establishment');
    expect(next).toHaveBeenCalledTimes(3);

    req.form.values = { type: 'nio' };
    formConfig.saveValues(req, res, next);
    expect(req.session.form['new-role-named-person'].values).toEqual({ type: 'nio' });
    expect(next).toHaveBeenCalledTimes(4);

    const postHandler = mockApp.post.mock.calls[0][1];
    const redirectReq = {
      buildRoute: jest.fn(() => '/role/named-person-mvp/before-you-apply')
    };
    const redirectRes = { redirect: jest.fn() };

    postHandler(redirectReq, redirectRes);

    expect(redirectReq.buildRoute).toHaveBeenCalledWith('role.namedPersonMvp', {
      suffix: 'before-you-apply'
    });
    expect(redirectRes.redirect).toHaveBeenCalledWith('/role/named-person-mvp/before-you-apply');
  });
});