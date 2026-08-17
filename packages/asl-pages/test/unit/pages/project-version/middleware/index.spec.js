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
          isNew: true,
          isMine: false,
          changedBy: { firstName: 'Granting', lastName: 'Inspector' },
          event: { meta: { payload: { meta: { field: 'title' } } } }
        }
      ],
      activityLog: [
        { eventName: 'status:submitted', createdAt: '2026-06-02T09:00:00.000Z' }
      ]
    });

    const buildReq = ({
      version,
      versions,
      openTasks = [],
      closedTasks = [],
      granted = versions.find(v => v.status === 'granted'),
      projectStatus = 'active',
      fullApplication = false
    }) => {
      const api = jest.fn(url => {
        if (url === '/tasks/related') {
          return Promise.resolve({ json: { data: closedTasks } });
        }
        return Promise.resolve({ json: { data: grantTaskWithComment(url.replace('/tasks/', '')) } });
      });
      return {
        versionId: version.id,
        version,
        fullApplication,
        projectId: PROJECT_ID,
        establishmentId: ESTABLISHMENT_ID,
        project: {
          establishmentId: ESTABLISHMENT_ID,
          status: projectStatus,
          granted,
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

    const CURRENT_GRANTED = { id: 'granted-version', status: 'granted' };
    const SUPERSEDED_GRANTED = { id: 'superseded-version', status: 'granted' };

    it('does not expose comments on the granted licence view', async () => {
      const req = buildReq({
        version: CURRENT_GRANTED,
        versions: [CURRENT_GRANTED],
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
        versions: [submitted, CURRENT_GRANTED],
        openTasks: [{ id: 'task-grant', data: { action: 'grant', data: { version: 'submitted-version' } } }]
      });

      const res = await run(req);

      expect(res.locals.static.comments).toBeDefined();
      expect(res.locals.static.comments.title[0].author).toBe('Granting Inspector');
      expect(req.api).toHaveBeenCalledWith('/tasks/task-grant');
    });

    // ASL-5180 AC02: "view latest submission" on the task screen shows the
    // granted version as an application, where its comments still belong
    it('exposes comments on the full application view of the granted version', async () => {
      const req = buildReq({
        version: CURRENT_GRANTED,
        versions: [CURRENT_GRANTED],
        fullApplication: true,
        closedTasks: [{ id: 'task-grant', data: { action: 'grant', data: { version: 'granted-version' } } }]
      });

      const res = await run(req);

      expect(res.locals.static.comments.title[0].author).toBe('Granting Inspector');
      expect(req.api).toHaveBeenCalledWith('/tasks/task-grant');
    });

    // ASL-5180: hiding comments on *every* granted version broke ASL-5113
    it('exposes comments on a superseded granted version', async () => {
      const req = buildReq({
        version: SUPERSEDED_GRANTED,
        versions: [CURRENT_GRANTED, SUPERSEDED_GRANTED],
        granted: CURRENT_GRANTED,
        closedTasks: [{ id: 'task-superseded', data: { action: 'grant', data: { version: 'superseded-version' } } }]
      });

      const res = await run(req);

      expect(res.locals.static.comments.title[0].author).toBe('Granting Inspector');
      expect(req.api).toHaveBeenCalledWith('/tasks/task-superseded');
    });

    // ASL-5113 AC01a: history is displayed, but doesn't flag as new
    it('does not flag comments from a closed task as new', async () => {
      const req = buildReq({
        version: SUPERSEDED_GRANTED,
        versions: [CURRENT_GRANTED, SUPERSEDED_GRANTED],
        granted: CURRENT_GRANTED,
        closedTasks: [{ id: 'task-superseded', data: { action: 'grant', data: { version: 'superseded-version' } } }]
      });

      const res = await run(req);

      expect(res.locals.static.comments.title[0].isNew).toBe(false);
    });

    it('leaves comments on the version currently under review flagged as new', async () => {
      const submitted = { id: 'submitted-version', status: 'submitted' };
      const req = buildReq({
        version: submitted,
        versions: [submitted, CURRENT_GRANTED],
        openTasks: [{ id: 'task-grant', data: { action: 'grant', data: { version: 'submitted-version' } } }]
      });

      const res = await run(req);

      expect(res.locals.static.comments.title[0].isNew).toBe(true);
      expect(res.locals.static.historicComments).toBe(false);
    });

    // ASL-5113 AC01b: a transferred project has no licence view, its granted
    // version is only reachable from the previous versions list
    it('exposes comments on the granted version of a transferred project', async () => {
      const req = buildReq({
        version: CURRENT_GRANTED,
        versions: [CURRENT_GRANTED],
        projectStatus: 'transferred',
        closedTasks: [{ id: 'task-transfer', data: { action: 'transfer', data: { version: 'granted-version' } } }]
      });

      const res = await run(req);

      expect(res.locals.static.comments.title[0].author).toBe('Granting Inspector');
      expect(req.api).toHaveBeenCalledWith('/tasks/task-transfer');
    });

    // ASL-5113: an application returned to the applicant is forked into a new
    // draft, so the submitted iteration it leaves behind is pointed at by no
    // task at all. v1 and v2 below are those orphaned iterations.
    describe('on a superseded iteration of the same application', () => {
      const V1 = { id: 'v1', status: 'submitted' };
      const V2 = { id: 'v2', status: 'submitted' };
      const V3 = { id: 'v3', status: 'granted' };
      const VERSIONS = [V3, V2, V1]; // newest first

      const GRANT_TASK = { id: 'task-grant', data: { action: 'grant', data: { version: 'v3' } } };

      const buildComment = (id, createdAt, versionId) => ({
        id,
        comment: `comment ${id}`,
        deleted: false,
        createdAt,
        isNew: true,
        isMine: false,
        changedBy: { firstName: 'Granting', lastName: 'Inspector' },
        event: { meta: { payload: { meta: { field: 'title', ...(versionId ? { versionId } : {}) } } } }
      });

      // the task's version pointer as it moved through each iteration
      const logEntry = (eventName, createdAt, version) => ({
        eventName,
        createdAt,
        event: { data: { data: { version } } }
      });

      const TASK_DETAIL = {
        id: 'task-grant',
        comments: [
          buildComment('c1', '2026-01-15T09:00:00.000Z'), // during v1, unstamped (pre-dates versionId)
          buildComment('c2', '2026-03-15T09:00:00.000Z'), // during v2, unstamped
          buildComment('c3', '2026-05-15T09:00:00.000Z', 'v3') // during v3, stamped
        ],
        activityLog: [
          logEntry('status:submitted', '2026-01-01T09:00:00.000Z', 'v1'),
          logEntry('status:returned-to-applicant', '2026-02-01T09:00:00.000Z', 'v1'),
          logEntry('status:resubmitted', '2026-03-01T09:00:00.000Z', 'v2'),
          logEntry('status:returned-to-applicant', '2026-04-01T09:00:00.000Z', 'v2'),
          logEntry('status:resubmitted', '2026-05-01T09:00:00.000Z', 'v3'),
          logEntry('status:granted', '2026-06-01T09:00:00.000Z', 'v3')
        ]
      };

      const buildIterationReq = (version, { fullApplication = false } = {}) => {
        const api = jest.fn(url => {
          if (url === '/tasks/related') {
            return Promise.resolve({ json: { data: [GRANT_TASK] } });
          }
          return Promise.resolve({ json: { data: TASK_DETAIL } });
        });
        return {
          versionId: version.id,
          version,
          fullApplication,
          projectId: PROJECT_ID,
          establishmentId: ESTABLISHMENT_ID,
          project: {
            establishmentId: ESTABLISHMENT_ID,
            status: 'active',
            granted: V3,
            openTasks: [],
            versions: VERSIONS
          },
          api
        };
      };

      const commentIds = res => (res.locals.static.comments.title || []).map(c => c.id).sort();

      it('resolves the owning task for an iteration no task points at', async () => {
        const req = buildIterationReq(V1);

        const res = await run(req);

        expect(req.api).toHaveBeenCalledWith('/tasks/task-grant');
        expect(res.locals.static.comments).toBeDefined();
      });

      it('shows only the comments made while that iteration was under review', async () => {
        expect(commentIds(await run(buildIterationReq(V1)))).toEqual(['c1']);
        expect(commentIds(await run(buildIterationReq(V2)))).toEqual(['c2']);
      });

      it('attributes unstamped comments by the activity log timeline', async () => {
        // c1 and c2 carry no meta.versionId - they are placed by when they were made
        const res = await run(buildIterationReq(V2));

        expect(commentIds(res)).toEqual(['c2']);
        expect(res.locals.static.comments.title[0].comment).toBe('comment c2');
      });

      it('does not flag a superseded iteration\'s comments as new', async () => {
        const res = await run(buildIterationReq(V1));

        expect(res.locals.static.comments.title.every(c => c.isNew === false)).toBe(true);
      });

      it('marks a superseded iteration\'s comments as historic so they still get a count', async () => {
        const res = await run(buildIterationReq(V1));

        expect(res.locals.static.historicComments).toBe(true);
      });

      it('shows the whole conversation on the iteration the task ended on', async () => {
        // v3 is granted, so reachable with comments only via the application view
        const res = await run(buildIterationReq(V3, { fullApplication: true }));

        expect(commentIds(res)).toEqual(['c1', 'c2', 'c3']);
      });

      it('keeps the full history and new flags on the draft returned to the applicant', async () => {
        // the applicant is working on v4, forked when v3 was returned to them, so
        // the task still points back at v3. AC02 needs that draft to keep the whole
        // conversation - it must not be mistaken for a superseded iteration.
        const draft = { id: 'v4', status: 'draft' };
        const underReview = { id: 'v3', status: 'submitted' };
        const openTask = { id: 'task-grant', data: { action: 'grant', data: { version: 'v3' } } };
        const api = jest.fn(url => {
          if (url === '/tasks/related') {
            return Promise.resolve({ json: { data: [] } });
          }
          return Promise.resolve({ json: { data: TASK_DETAIL } });
        });
        const req = {
          versionId: draft.id,
          version: draft,
          fullApplication: false,
          projectId: PROJECT_ID,
          establishmentId: ESTABLISHMENT_ID,
          project: {
            establishmentId: ESTABLISHMENT_ID,
            status: 'inactive',
            openTasks: [openTask],
            versions: [draft, underReview, V2, V1]
          },
          api
        };

        const res = await run(req);

        expect(commentIds(res)).toEqual(['c1', 'c2', 'c3']);
        expect(res.locals.static.comments.title.some(c => c.isNew)).toBe(true);
      });

      it('does not cross into a later amendment cycle', async () => {
        // s1 belongs to the original application, granted as g1. It must resolve to
        // that cycle's task, not the one for the later a1 -> a2 amendment.
        const a2 = { id: 'a2', status: 'granted' };
        const a1 = { id: 'a1', status: 'submitted' };
        const g1 = { id: 'g1', status: 'granted' };
        const s1 = { id: 's1', status: 'submitted' };

        const originalTask = { id: 'task-original', data: { action: 'grant', data: { version: 'g1' } } };
        const amendmentTask = { id: 'task-amendment', data: { action: 'grant', data: { version: 'a2' } } };

        const api = jest.fn(url => {
          if (url === '/tasks/related') {
            return Promise.resolve({ json: { data: [originalTask, amendmentTask] } });
          }
          return Promise.resolve({ json: { data: { ...TASK_DETAIL, id: url.replace('/tasks/', '') } } });
        });

        const req = {
          versionId: s1.id,
          version: s1,
          fullApplication: false,
          projectId: PROJECT_ID,
          establishmentId: ESTABLISHMENT_ID,
          project: {
            establishmentId: ESTABLISHMENT_ID,
            status: 'active',
            granted: a2,
            openTasks: [],
            versions: [a2, a1, g1, s1]
          },
          api
        };

        await run(req);

        expect(req.api).toHaveBeenCalledWith('/tasks/task-original');
        expect(req.api).not.toHaveBeenCalledWith('/tasks/task-amendment');
      });

      it('finds no task for a granted version that has none, rather than an in-flight amendment\'s', async () => {
        const amendmentTask = { id: 'task-amendment', data: { action: 'grant', data: { version: 'v-amendment' } } };
        const api = jest.fn(url => {
          if (url === '/tasks/related') {
            return Promise.resolve({ json: { data: [] } });
          }
          return Promise.resolve({ json: { data: TASK_DETAIL } });
        });
        const req = {
          versionId: V3.id,
          version: V3,
          fullApplication: true,
          projectId: PROJECT_ID,
          establishmentId: ESTABLISHMENT_ID,
          project: {
            establishmentId: ESTABLISHMENT_ID,
            status: 'active',
            granted: V3,
            openTasks: [amendmentTask],
            versions: [{ id: 'v-amendment', status: 'submitted' }, V3, V2, V1]
          },
          api
        };

        const res = await run(req);

        expect(res.locals.static.comments).toBeUndefined();
        expect(req.api).not.toHaveBeenCalledWith('/tasks/task-amendment');
      });
    });

    describe('on the retrospective assessment view', () => {
      // the RA view loads the *granted* project version alongside the RA, so
      // comment visibility must be decided from the RA itself
      const buildRaReq = ({ retrospectiveAssessment, openTasks = [] }) => {
        const api = jest.fn(url => {
          if (url === '/tasks/related') {
            return Promise.resolve({ json: { data: [] } });
          }
          return Promise.resolve({ json: { data: grantTaskWithComment(url.replace('/tasks/', '')) } });
        });
        return {
          retrospectiveAssessment,
          version: { id: 'granted-version', status: 'granted' },
          projectId: PROJECT_ID,
          establishmentId: ESTABLISHMENT_ID,
          project: {
            establishmentId: ESTABLISHMENT_ID,
            openTasks,
            versions: []
          },
          api
        };
      };

      const runRa = req => {
        const res = { locals: { static: {} } };
        return new Promise((resolve, reject) => {
          getComments('grant-ra', 'retrospective-assessments')(req, res, err => (err ? reject(err) : resolve(res)));
        });
      };

      it('exposes comments while the RA is still being worked on', async () => {
        const req = buildRaReq({
          retrospectiveAssessment: { id: 'ra-1', status: 'draft' },
          openTasks: [{ id: 'task-grant-ra', data: { action: 'grant-ra' } }]
        });

        const res = await runRa(req);

        expect(res.locals.static.comments).toBeDefined();
        expect(res.locals.static.comments.title[0].author).toBe('Granting Inspector');
        expect(req.api).toHaveBeenCalledWith('/tasks/task-grant-ra');
      });

      it('does not expose comments once the RA is granted', async () => {
        const req = buildRaReq({
          retrospectiveAssessment: { id: 'ra-1', status: 'granted' },
          openTasks: [{ id: 'task-grant-ra', data: { action: 'grant-ra' } }]
        });

        const res = await runRa(req);

        expect(res.locals.static.comments).toBeUndefined();
        expect(req.api).not.toHaveBeenCalledWith('/tasks/task-grant-ra');
      });
    });
  });
});
