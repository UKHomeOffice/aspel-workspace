import { getVersionsForDiff } from '../../../../../pages/project-version/middleware/index';

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
});
