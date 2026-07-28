import { getComments, getTaskForVersion, getVersionsForDiff } from '../../../../../pages/project-version/middleware/index';

describe('Versions', () => {
  describe('Getting relevant versions for change detection', () => {

    const buildProjectVersionsReq = (versions, currentId) => {
      return {
        versionId: currentId,
        project: { versions }
      };
    };

    it('doesn\'t include any version history for an unrevised licence', () => {
      const versions = [
        { 'id': 'current', 'status': 'granted', createdAt: '2025-12-31T12:34:45.000Z' }
      ];

      const { previous, first, granted } = getVersionsForDiff(
        buildProjectVersionsReq(versions, 'current')
      );

      expect(previous).toBeUndefined();
      expect(first).toBeUndefined();
      expect(granted).toBeUndefined();
    });

    it('can find the correct of two versions before a project is granted', () => {
      const versions = [
        { 'id': 'current', 'status': 'draft', createdAt: '2025-12-31T12:34:45.000Z' },
        { 'id': 'previous', 'status': 'submitted', createdAt: '2025-12-30T12:34:45.000Z' }
      ];

      const { previous, first, granted } = getVersionsForDiff(
        buildProjectVersionsReq(versions, 'current')
      );

      expect(previous).toBe(versions[1]);
      expect(first).toBeUndefined();
      expect(granted).toBeUndefined();
    });

    it('can find the correct of four versions before a project is granted', () => {
      const versions = [
        { 'id': 'current', 'status': 'draft', createdAt: '2025-12-31T12:34:45.000Z' },
        { 'id': 'previous', 'status': 'submitted', createdAt: '2025-12-30T12:34:45.000Z' },
        { 'id': 'older', 'status': 'submitted', createdAt: '2025-12-29T12:34:45.000Z' },
        { 'id': 'first', 'status': 'submitted', createdAt: '2025-12-28T12:34:45.000Z' }
      ];

      const { previous, first, granted } = getVersionsForDiff(
        buildProjectVersionsReq(versions, 'current')
      );

      expect(previous).toBe(versions[1]);
      expect(first).toBe(versions[3]);
      expect(granted).toBeUndefined();
    });

    it('can find the correct versions once a project is granted', () => {
      const versions = [
        { 'id': 'current', 'status': 'granted', createdAt: '2025-12-31T12:34:45.000Z' },
        { 'id': 'previous', 'status': 'submitted', createdAt: '2025-12-30T12:34:45.000Z' },
        { 'id': 'older', 'status': 'submitted', createdAt: '2025-12-29T12:34:45.000Z' },
        { 'id': 'first', 'status': 'submitted', createdAt: '2025-12-28T12:34:45.000Z' }
      ];

      const { previous, first, granted } = getVersionsForDiff(
        buildProjectVersionsReq(versions, 'current')
      );

      expect(previous).toBe(versions[1]);
      expect(first).toBe(versions[3]);
      expect(granted).toBeUndefined();
    });

    it('can find the correct versions for a draft amendment', () => {
      const versions = [
        { 'id': 'current', 'status': 'draft', createdAt: '2025-12-31T12:34:45.000Z' },
        { 'id': 'previous', 'status': 'submitted', createdAt: '2025-12-30T12:34:45.000Z' },
        { 'id': 'previous-granted', 'status': 'granted', createdAt: '2025-12-29T12:34:45.000Z' },
        { 'id': 'first', 'status': 'submitted', createdAt: '2025-12-28T12:34:45.000Z' }
      ];

      const { previous, first, granted } = getVersionsForDiff(
        buildProjectVersionsReq(versions, 'current')
      );

      expect(previous).toBe(versions[1]);
      expect(first).toBeUndefined();
      expect(granted).toBe(versions[2]);
    });

    it('can find the correct versions for a granted amendment', () => {
      const versions = [
        { 'id': 'current', 'status': 'granted', createdAt: '2025-12-31T12:34:45.000Z' },
        { 'id': 'previous', 'status': 'submitted', createdAt: '2025-12-30T12:34:45.000Z' },
        { 'id': 'previous-granted', 'status': 'granted', createdAt: '2025-12-29T12:34:45.000Z' },
        { 'id': 'first', 'status': 'submitted', createdAt: '2025-12-28T12:34:45.000Z' }
      ];

      const { previous, first, granted } = getVersionsForDiff(
        buildProjectVersionsReq(versions, 'current')
      );

      expect(previous).toBe(versions[1]);
      expect(first).toBeUndefined();
      expect(granted).toBe(versions[2]);
    });

    it('can find the correct versions for a granted amendment without revisions', () => {
      const versions = [
        { 'id': 'current', 'status': 'granted', createdAt: '2025-12-31T12:34:45.000Z' },
        { 'id': 'previous', 'status': 'granted', createdAt: '2025-12-29T12:34:45.000Z' },
        { 'id': 'first', 'status': 'granted', createdAt: '2025-12-28T12:34:45.000Z' }
      ];

      const { previous, first, granted } = getVersionsForDiff(
        buildProjectVersionsReq(versions, 'current')
      );

      expect(previous).toBe(versions[1]);
      expect(first).toBeUndefined();
      expect(granted).toBe(versions[1]);
    });

    it('can find the correct versions for an archived task once a project is granted', () => {
      const versions = [
        { 'id': 'newer-granted', 'status': 'granted', createdAt: '2026-01-02T12:34:45.000Z' },
        { 'id': 'newer-submitted', 'status': 'submitted', createdAt: '2026-01-01T12:34:45.000Z' },
        { 'id': 'current', 'status': 'granted', createdAt: '2025-12-31T12:34:45.000Z' },
        { 'id': 'previous', 'status': 'submitted', createdAt: '2025-12-30T12:34:45.000Z' },
        { 'id': 'older', 'status': 'submitted', createdAt: '2025-12-29T12:34:45.000Z' },
        { 'id': 'first', 'status': 'submitted', createdAt: '2025-12-28T12:34:45.000Z' }
      ];

      const { previous, first, granted } = getVersionsForDiff(
        buildProjectVersionsReq(versions, 'current')
      );

      expect(previous).toBe(versions[3]);
      expect(first).toBe(versions[5]);
      expect(granted).toBeUndefined();
    });

    it('can find the correct versions for an archived task once an amendment is granted', () => {
      const versions = [
        { 'id': 'newer-granted', 'status': 'granted', createdAt: '2026-01-02T12:34:45.000Z' },
        { 'id': 'newer-submitted', 'status': 'submitted', createdAt: '2026-01-01T12:34:45.000Z' },
        { 'id': 'current', 'status': 'granted', createdAt: '2025-12-31T12:34:45.000Z' },
        { 'id': 'previous', 'status': 'submitted', createdAt: '2025-12-30T12:34:45.000Z' },
        { 'id': 'previous-granted', 'status': 'granted', createdAt: '2025-12-29T12:34:45.000Z' },
        { 'id': 'first', 'status': 'submitted', createdAt: '2025-12-28T12:34:45.000Z' }
      ];

      const { previous, first, granted } = getVersionsForDiff(
        buildProjectVersionsReq(versions, 'current')
      );

      expect(previous).toBe(versions[3]);
      expect(first).toBeUndefined();
      expect(granted).toBe(versions[4]);
    });
  });

  describe('getTaskForVersion', () => {
    const ESTABLISHMENT_ID = 100;
    const PROJECT_ID = 'project-1';

    const buildTask = (id, action, versionId, extra = {}) => ({
      id,
      data: { action, data: { version: versionId } },
      ...extra
    });

    const buildReq = ({
      versionId,
      versions = [{ id: versionId, status: 'submitted' }],
      openTasks = [],
      closedTasks = [],
      establishmentId = ESTABLISHMENT_ID
    }) => {
      const api = jest.fn(() => Promise.resolve({ json: { data: closedTasks } }));
      return {
        versionId,
        version: versions.find(v => v.id === versionId),
        projectId: PROJECT_ID,
        establishmentId,
        project: {
          establishmentId: ESTABLISHMENT_ID,
          openTasks,
          versions
        },
        api
      };
    };

    const buildVersion = (id, status) => ({ id, status });

    const ACTIVE_SUBMITTED_ID = 'active-submitted';
    const ACTIVE_SUBMITTED_VERSION = buildVersion(ACTIVE_SUBMITTED_ID, 'submitted');

    const GRANTED_ID = 'granted-version';
    const GRANTED_VERSION = buildVersion(GRANTED_ID, 'granted');

    it('returns the open task whose version matches the active draft', async () => {
      const activeTask = buildTask('task-active', 'grant', ACTIVE_SUBMITTED_ID);
      const req = buildReq({
        versionId: ACTIVE_SUBMITTED_ID,
        versions: [ACTIVE_SUBMITTED_VERSION],
        openTasks: [activeTask]
      });

      const task = await getTaskForVersion(req, ACTIVE_SUBMITTED_ID);

      expect(task).toBe(activeTask);
      expect(req.api).not.toHaveBeenCalled();
    });

    it('returns undefined for an older draft snapshot of an in-flight amendment', async () => {
      const activeTask = buildTask('task-active', 'grant', ACTIVE_SUBMITTED_ID);
      const req = buildReq({
        versionId: GRANTED_ID,
        versions: [ACTIVE_SUBMITTED_VERSION, GRANTED_VERSION],
        openTasks: [activeTask]
      });

      const task = await getTaskForVersion(req, GRANTED_ID);

      expect(task).toBeUndefined();
    });

    it('falls back to closed tasks for a granted historical version', async () => {
      const closedGrant = buildTask('task-closed', 'grant', GRANTED_ID);
      const req = buildReq({
        versionId: GRANTED_ID,
        versions: [GRANTED_VERSION],
        openTasks: [],
        closedTasks: [closedGrant]
      });

      const task = await getTaskForVersion(req, GRANTED_ID);

      expect(task).toBe(closedGrant);
      expect(req.api).toHaveBeenCalledWith('/tasks/related', {
        query: {
          model: 'project',
          modelId: PROJECT_ID,
          establishmentId: ESTABLISHMENT_ID,
          onlyClosed: true
        }
      });
    });

    it('ignores closed tasks for a different version', async () => {
      const closedGrant = buildTask('task-closed', 'grant', 'other-version');
      const req = buildReq({
        versionId: GRANTED_ID,
        versions: [GRANTED_VERSION, buildVersion('other-version', 'granted')],
        openTasks: [],
        closedTasks: [closedGrant]
      });

      const task = await getTaskForVersion(req, GRANTED_ID);

      expect(task).toBeUndefined();
    });

    it('only matches tasks whose action is in the allowed list', async () => {
      const openTask = buildTask('task-open', 'other', ACTIVE_SUBMITTED_ID);
      const req = buildReq({
        versionId: ACTIVE_SUBMITTED_ID,
        openTasks: [openTask]
      });

      const task = await getTaskForVersion(req, ACTIVE_SUBMITTED_ID);

      expect(task).toBeUndefined();
    });

    it('skips lookup when the project belongs to a different establishment (AA project)', async () => {
      const req = buildReq({
        versionId: GRANTED_ID,
        openTasks: [buildTask('task-open', 'grant', GRANTED_ID)],
        establishmentId: 999
      });

      const task = await getTaskForVersion(req, GRANTED_ID);

      expect(task).toBeUndefined();
      expect(req.api).not.toHaveBeenCalled();
    });

    it('Tries the previously submitted version for drafts', async () => {
      const req = buildReq({
        versionId: 'active-draft',
        versions: [buildVersion('active-draft', 'draft'), ACTIVE_SUBMITTED_VERSION, GRANTED_VERSION],
        openTasks: [buildTask('task-open', 'grant', ACTIVE_SUBMITTED_ID)],
        closedTasks: [buildTask('task-closed', 'grant', GRANTED_ID)]
      });

      const task = await getTaskForVersion(req, 'active-draft');

      expect(task?.id).toBe('task-open');
      expect(req.api).toHaveBeenCalledWith('/tasks/related', {
        query: {
          model: 'project',
          modelId: PROJECT_ID,
          establishmentId: ESTABLISHMENT_ID,
          onlyClosed: true
        }
      });
    });

    it('Doesn\'t include granted version for new drafts', async () => {
      const req = buildReq({
        versionId: GRANTED_ID,
        versions: [buildVersion('active-draft', 'draft'), GRANTED_VERSION],
        openTasks: [],
        closedTasks: [buildTask('task-closed', 'grant', GRANTED_ID)]
      });

      const task = await getTaskForVersion(req, 'active-draft');

      expect(task).toBeUndefined();
      expect(req.api).toHaveBeenCalledWith('/tasks/related', {
        query: {
          model: 'project',
          modelId: PROJECT_ID,
          establishmentId: ESTABLISHMENT_ID,
          onlyClosed: true
        }
      });
    });

    it('Doesn\'t lookup closed tasks more than once', async () => {
      const req = buildReq({
        versionId: 'active-draft',
        versions: [
          buildVersion('active-draft', 'draft'),
          ACTIVE_SUBMITTED_VERSION,
          buildVersion('prev-submitted', 'submitted'),
          GRANTED_VERSION
        ],
        openTasks: [],
        closedTasks: [buildTask('task-closed', 'grant', GRANTED_ID)]
      });

      const task = await getTaskForVersion(req, 'active-draft');

      expect(task).toBeUndefined();
      expect(req.api).toHaveBeenCalledTimes(1);
    });
  });

  describe('getComments (ASL-5161)', () => {
    const ESTABLISHMENT_ID = 100;
    const PROJECT_ID = 'project-1';

    const grantTaskWithComment = id => ({
      id,
      comments: [
        {
          id: 'comment-1',
          comment: 'Private inspector note',
          deleted: false,
          createdAt: '2026-06-01T09:00:00.000Z',
          isNew: false,
          isMine: false,
          changedBy: { firstName: 'Granting', lastName: 'Inspector' },
          event: { meta: { payload: { meta: { field: 'title' } } } }
        }
      ],
      activityLog: [
        { eventName: 'status:submitted', createdAt: '2026-06-02T09:00:00.000Z' }
      ]
    });

    const buildReq = ({ version, versions, openTasks = [], closedTasks = [] }) => {
      const api = jest.fn(url => {
        if (url === '/tasks/related') {
          return Promise.resolve({ json: { data: closedTasks } });
        }
        return Promise.resolve({ json: { data: grantTaskWithComment(url.replace('/tasks/', '')) } });
      });
      return {
        versionId: version.id,
        version,
        projectId: PROJECT_ID,
        establishmentId: ESTABLISHMENT_ID,
        project: {
          establishmentId: ESTABLISHMENT_ID,
          openTasks,
          versions
        },
        api
      };
    };

    const run = req => {
      const res = { locals: { static: {} } };
      return new Promise((resolve, reject) => {
        getComments()(req, res, err => (err ? reject(err) : resolve(res)));
      });
    };

    it('does not expose comments on the granted licence view', async () => {
      const granted = { id: 'granted-version', status: 'granted' };
      const req = buildReq({
        version: granted,
        versions: [granted],
        closedTasks: [{ id: 'task-grant', data: { action: 'grant', data: { version: 'granted-version' } } }]
      });

      const res = await run(req);

      expect(res.locals.static.comments).toBeUndefined();
      // the grant task's full detail (which carries the private comments) is never fetched
      expect(req.api).not.toHaveBeenCalledWith('/tasks/task-grant');
    });

    it('exposes comments on a previous, non-granted version', async () => {
      const submitted = { id: 'submitted-version', status: 'submitted' };
      const req = buildReq({
        version: submitted,
        versions: [submitted],
        openTasks: [{ id: 'task-grant', data: { action: 'grant', data: { version: 'submitted-version' } } }]
      });

      const res = await run(req);

      expect(res.locals.static.comments).toBeDefined();
      expect(res.locals.static.comments.title[0].author).toBe('Granting Inspector');
      expect(req.api).toHaveBeenCalledWith('/tasks/task-grant');
    });
  });
});
