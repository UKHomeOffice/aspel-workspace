import { getVersionsForDiff, getTaskForVersion } from '../../../../../pages/project-version/middleware/index';

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

    const buildReq = ({ versionId, openTasks = [], closedTasks = [], establishmentId = ESTABLISHMENT_ID }) => {
      const api = jest.fn(() => Promise.resolve({ json: { data: closedTasks } }));
      return {
        versionId,
        projectId: PROJECT_ID,
        establishmentId,
        project: {
          establishmentId: ESTABLISHMENT_ID,
          openTasks
        },
        api
      };
    };

    it('returns the open task whose version matches the active draft', async () => {
      const activeTask = buildTask('task-active', 'grant', 'active-draft');
      const req = buildReq({
        versionId: 'active-draft',
        openTasks: [activeTask]
      });

      const task = await getTaskForVersion(req);

      expect(task).toBe(activeTask);
      expect(req.api).not.toHaveBeenCalled();
    });

    it('returns undefined for an older draft snapshot of an in-flight amendment', async () => {
      const activeTask = buildTask('task-active', 'grant', 'active-draft');
      const req = buildReq({
        versionId: 'older-snapshot',
        openTasks: [activeTask]
      });

      const task = await getTaskForVersion(req);

      expect(task).toBeUndefined();
    });

    it('falls back to closed tasks for a granted historical version', async () => {
      const closedGrant = buildTask('task-closed', 'grant', 'granted-version');
      const req = buildReq({
        versionId: 'granted-version',
        openTasks: [],
        closedTasks: [closedGrant]
      });

      const task = await getTaskForVersion(req);

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
        versionId: 'granted-version',
        openTasks: [],
        closedTasks: [closedGrant]
      });

      const task = await getTaskForVersion(req);

      expect(task).toBeUndefined();
    });

    it('only matches tasks whose action is in the allowed list', async () => {
      const openTask = buildTask('task-open', 'amend', 'active-draft');
      const req = buildReq({
        versionId: 'active-draft',
        openTasks: [openTask]
      });

      const task = await getTaskForVersion(req);

      expect(task).toBeUndefined();
    });

    it('skips lookup when the project belongs to a different establishment (AA project)', async () => {
      const req = buildReq({
        versionId: 'some-version',
        openTasks: [buildTask('task-open', 'grant', 'some-version')],
        establishmentId: 999
      });

      const task = await getTaskForVersion(req);

      expect(task).toBeUndefined();
      expect(req.api).not.toHaveBeenCalled();
    });
  });
});
