/**
 * @overview - of training records comparisons
 * Utility functions for comparing, detecting, and managing training record changes across project versions.
 * These helpers are designed to safely compute added, removed, and changed records,
 * extract record-level differences, and support consistent UI rendering.
 *
 * All functions are pure, side-effect-free, and validated for secure and reusable use across modules.
 */

/**
 * Compare training records across versions and detect additions, removals, and field-level changes.
 *
 * @param {Array<Object>} current - The current list of training records.
 * @param {Array<Object>} trainingHistory - Array of versioned trainingHistory objects.
 * @returns {Object} results - An object containing `added`, `removed`, and `changed` arrays.
 */
export function compareTrainingRecords(current = [], trainingHistory = []) {
  const results = { added: [], removed: [], changed: [] };

  // Early return for invalid or insufficient data
  if (!Array.isArray(trainingHistory) || trainingHistory.length < 2) {
    return results;
  }

  // Safely resolve reference versions
  const currentVersion = trainingHistory.find(v => v?.version === 1) || trainingHistory[0] || {};
  const previousVersion = trainingHistory.find(v => v?.version === 2) || trainingHistory[1] || {};
  const firstVersion = trainingHistory[trainingHistory.length - 1] || {};

  const currentRecords = Array.isArray(currentVersion.trainingRecords) ? currentVersion.trainingRecords : [];
  const prevRecords = Array.isArray(previousVersion.trainingRecords) ? previousVersion.trainingRecords : [];
  const firstRecords = Array.isArray(firstVersion.trainingRecords) ? firstVersion.trainingRecords : [];

  const getIds = arr => (Array.isArray(arr) ? arr.map(r => r.trainingId).filter(Boolean) : []);

  const currentIds = getIds(currentRecords);
  const prevIds = getIds(prevRecords);
  const firstIds = getIds(firstRecords);

  // Added / Removed detection (pink = vs previous, grey = vs first)
  const addedPink = currentIds.filter(id => !prevIds.includes(id));
  const addedGrey = currentIds.filter(id => !firstIds.includes(id));
  const removedPink = prevIds.filter(id => !currentIds.includes(id));
  const removedGrey = firstIds.filter(id => !currentIds.includes(id));

  results.added.push({ color: 'pink', ids: addedPink });
  results.added.push({ color: 'grey', ids: addedGrey });
  results.removed.push({ color: 'pink', ids: removedPink });
  results.removed.push({ color: 'grey', ids: removedGrey });

  /**
   * Helper: find record by ID.
   * @param {Array<Object>} arr - Array of records.
   * @param {string} id - Training ID to locate.
   */
  const findById = (arr, id) => (Array.isArray(arr) ? arr.find(r => r.trainingId === id) : null);

  /**
   * Helper: Detect field-level differences between two training record objects.
   * Returns `null` if identical, or a diff object showing added/removed fields.
   */
  const detectChanges = (cur, old) => {
    if (!cur || !old) return null;

    const diff = {};
    for (const key in cur) {
      if (!Object.prototype.hasOwnProperty.call(cur, key) || key === 'trainingId') continue;

      const a = cur[key];
      const b = old[key];

      if (Array.isArray(a) && Array.isArray(b)) {
        const added = a.filter(x => !b.includes(x));
        const removed = b.filter(x => !a.includes(x));
        if (added.length || removed.length) diff[key] = { added, removed };
      } else if (a !== b) {
        diff[key] = { old: b, new: a };
      }
    }
    return Object.keys(diff).length ? diff : null;
  };

  const changedPink = [];
  const changedGrey = [];
  const changedPinkDetails = {};
  const changedGreyDetails = {};

  currentRecords.forEach(cur => {
    const prev = findById(prevRecords, cur.trainingId);
    const first = findById(firstRecords, cur.trainingId);

    const diffPink = detectChanges(cur, prev);
    const diffGrey = detectChanges(cur, first);

    if (diffPink) {
      changedPink.push(cur.trainingId);
      changedPinkDetails[cur.trainingId] = diffPink;
    }
    if (diffGrey) {
      changedGrey.push(cur.trainingId);
      changedGreyDetails[cur.trainingId] = diffGrey;
    }
  });

  results.changed.push({ color: 'pink', ids: changedPink, details: changedPinkDetails });
  results.changed.push({ color: 'grey', ids: changedGrey, details: changedGreyDetails });

  return results;
}

/**
 * Safely find the highlight colour for a record ID within a group of change arrays.
 *
 * @param {Array<Object>} groups - Array of change groups (added/removed/changed).
 * @param {string|number} id - Training record ID.
 * @returns {string|null} - The matching highlight colour (e.g., "pink" or "grey").
 */
export const findColor = (groups = [], id) => {
  if (!id || !Array.isArray(groups)) return null;
  const idStr = String(id).trim();

  const group = groups.find(g =>
    Array.isArray(g?.ids) && g.ids.some(x => String(x).trim() === idStr)
  );

  return group?.color || null;
};

/**
 * Returns status metadata for rendering training record change badges.
 *
 * @param {Object} record - The training record object (with `trainingId` or `id`).
 * @param {Object} comparisons - The comparison result object (from compareTrainingRecords()).
 * @returns {Object|null} - Badge data { label, class } or null if unchanged.
 */
export const getStatus = (record, comparisons = {}) => {
  if (!record || typeof record !== 'object') return null;

  const { added = [], removed = [], changed = [] } = comparisons;
  const recordId = String(record.trainingId || record.id || '').trim();

  const addedColor = findColor(added, recordId);
  const removedColor = findColor(removed, recordId);
  const changedColor = findColor(changed, recordId);

  // Priority: changed > removed > added
  if (changedColor) {
    return { label: 'CHANGED', class: `badge changed ${changedColor}` };
  }
  if (removedColor) {
    return { label: 'REMOVED', class: `badge deleted ${removedColor}` };
  }
  if (addedColor) {
    return { label: 'NEW', class: `badge created ${addedColor}` };
  }

  return null;
};

/**
 * Retrieve a specific training record from versioned history.
 *
 * @param {Array<Object>} data - Array of version objects (each containing trainingRecords[]).
 * @param {string} trainingId - ID of the record to locate.
 * @param {'current'|'previous'|'first'} versionType - Which version to fetch from.
 * @returns {Object|null} - The training record object, or null if not found.
 */
export const getTrainingRecord = (data = [], trainingId, versionType = 'current') => {
  if (!Array.isArray(data) || !trainingId) return null;

  const versionsWithRecord = data.filter(
    v => Array.isArray(v.trainingRecords) &&
      v.trainingRecords.some(r => r.trainingId === trainingId)
  );

  if (!versionsWithRecord.length) return null;

  let targetVersion;
  switch (versionType.toLowerCase()) {
    case 'first':
      targetVersion = versionsWithRecord[versionsWithRecord.length - 1];
      break;
    case 'previous':
      targetVersion = versionsWithRecord.length > 1 ? versionsWithRecord[1] : versionsWithRecord[0];
      break;
    default:
      targetVersion = versionsWithRecord[0];
  }

  return targetVersion.trainingRecords.find(r => r.trainingId === trainingId) || null;
};

/**
 * Collects removed training records from all project versions for display or export.
 *
 * @param {Object} comparisons - The result from compareTrainingRecords().
 * @param {Object} project - The project object containing trainingHistory[].
 * @returns {Array<Object>} - List of removed training records merged with previous/first version data.
 */
export const getRemovedTrainingRecords = (comparisons = {}, project = {}) => {
  if (!comparisons || typeof comparisons !== 'object' || !Array.isArray(project?.trainingHistory)) {
    return [];
  }

  const allRemovedIds = Array.from(
    new Set((comparisons.removed || []).flatMap(r => Array.isArray(r.ids) ? r.ids : []))
  );

  return allRemovedIds
    .map(id => {
      const allVersions = Array.isArray(project.trainingHistory) ? project.trainingHistory : [];
      const previousVersion = allVersions[1] || allVersions[0] || {};
      const firstVersion = allVersions[allVersions.length - 1] || {};

      const prevRecord =
        previousVersion?.trainingRecords?.find(r => r.trainingId === id) ||
        firstVersion?.trainingRecords?.find(r => r.trainingId === id);

      return prevRecord ? { ...prevRecord, id } : null;
    })
    .filter(Boolean);
};
