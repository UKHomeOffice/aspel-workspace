/**
 * Compare training records across versions and detect new, removals, and changes.
 * Compare current version with previous - pink
 * Compare current version with first/granted - grey
 * badges -
 *  new - newly added record
 *  removed - removed record
 *  changed - changed record
 * @param {Array<Object>} current - Current training records (project.training)
 * @param {Object} trainingHistory - New object-structured trainingHistory
 * @returns {Object} results - { added: [], removed: [], changed: [] }
 */
export function compareTrainingRecords(current = [], trainingHistory = {}) {
  const results = { added: [], removed: [], changed: [] };

  // validate data structure
  if (!trainingHistory || typeof trainingHistory !== 'object') {
    return results;
  }

  // extract record arrays using the NEW data shape
  const currentRecords = Array.isArray(current) ? current : [];
  const prevRecords = Array.isArray(trainingHistory.previous)
    ? trainingHistory.previous
    : [];

  // first = first IF present, OTHERWISE use granted
  const firstRecords =
    Array.isArray(trainingHistory.first) && trainingHistory.first.length
      ? trainingHistory.first
      : Array.isArray(trainingHistory.granted)
        ? trainingHistory.granted
        : [];

  // id extraction helper (supports id OR trainingId)
  const getIds = arr =>
    Array.isArray(arr)
      ? arr
        .map(r => r.id || r.trainingId)
        .filter(Boolean)
      : [];

  const currentIds = getIds(currentRecords);
  const prevIds = getIds(prevRecords);
  const firstIds = getIds(firstRecords);

  // detect add or removed entries
  const addedPink = currentIds.filter(id => !prevIds.includes(id));
  const addedGrey = currentIds.filter(id => !firstIds.includes(id));
  const removedPink = prevIds.filter(id => !currentIds.includes(id));
  const removedGrey = firstIds.length ? firstIds.filter(id => !currentIds.includes(id)) : [];

  // Organise training record ids as per color code
  results.added.push({ color: 'pink', ids: addedPink });
  results.added.push({ color: 'grey', ids: addedGrey });
  results.removed.push({ color: 'pink', ids: removedPink });
  results.removed.push({ color: 'grey', ids: removedGrey });

  const findById = (arr, id) =>
    Array.isArray(arr)
      ? arr.find(r => (r.id || r.trainingId) === id)
      : null;

  const detectChanges = (current, previous) => {
    if (!current || !previous) return null;

    const diff = {};
    for (const key in current) {
      if (!Object.prototype.hasOwnProperty.call(current, key)) continue;
      if (key === 'trainingId' || key === 'id') continue;

      const a = current[key];
      const b = previous[key];

      // array fields (modules, species)
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

  // Detect CHANGED (pink = diff to previous, and first )
  const changedPink = [];
  const changedGrey = [];
  const changedPinkDetails = {};
  const changedGreyDetails = {};

  currentRecords.forEach(cur => {
    const id = cur.id || cur.trainingId;
    const prev = findById(prevRecords, id);
    const first = findById(firstRecords, id);
    const diffPink = detectChanges(cur, prev);
    const diffGrey = detectChanges(cur, first);

    if (diffPink) {
      changedPink.push(id);
      changedPinkDetails[id] = diffPink;
    }

    if (diffGrey) {
      changedGrey.push(id);
      changedGreyDetails[id] = diffGrey;
    }
  });

  results.changed.push({
    color: 'pink',
    ids: changedPink,
    details: changedPinkDetails
  });

  results.changed.push({
    color: 'grey',
    ids: changedGrey,
    details: changedGreyDetails
  });

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
 * @param {boolean} grantedStatus - Indicates whether the application has been granted.
 * @returns {Object|null} - Badge data { label, class } or null if unchanged.
 */
export const getStatus = (record, comparisons = {}, grantedStatus= {}) => {
  if (!record || typeof record !== 'object') return null;

  const { added = [], removed = [], changed = [] } = comparisons;
  const recordId = String(record.trainingId || record.id || '').trim();

  const addedColor = findColor(added, recordId);
  const removedColor = findColor(removed, recordId);
  const changedColor = findColor(changed, recordId);

  // Text level
  const changeLabel =
    grantedStatus === true && changedColor === 'grey'
      ? 'AMENDED'
      : 'CHANGED';
  const newLabel =
    addedColor === 'grey'
      ? 'ADDED'
      : 'NEW';
  const removedLabel = 'REMOVED';

  // Priority: changed > removed > new
  if (changedColor) {
    return { label: changeLabel, class: `badge changed ${changedColor}` };
  }
  if (removedColor) {
    return { label: removedLabel, class: `badge deleted ${removedColor}` };
  }
  if (addedColor) {
    return { label: newLabel, class: `badge created ${addedColor}` };
  }

  return null;
};


/**
 * Retrieve a specific training record from versioned history.
 *
 * @param {Object} project - The project object containing trainingHistory[].
 * @param {Object} record - The record object that contains trainingId or id.
 * @param {'current'|'previous'|'first' | 'granted'} versionType - Which version to fetch from.
 * @param {Object} trainingHistory - The record object that contains trainingId or id.
 * @returns {Object|null}
 */

export const getTrainingRecord = (project = {}, record = {}, versionType = 'current', trainingHistory) => {
  if (!project || !trainingHistory) {
    return {};
  }

  const history = trainingHistory;
  const trainingId = record.id || record.trainingId;

  if (!trainingId) {
    return {};
  }

  // Current training comes directly from project.training
  if (versionType === 'current') {
    return Array.isArray(project.training)
      ? (project.training.find(r => (r.id || r.trainingId) === trainingId) || {})
      : {};
  }

  // Previous = trainingHistory.previous
  if (versionType === 'previous') {
    return Array.isArray(history.previous)
      ? (history.previous.find(r => (r.id || r.trainingId) === trainingId) || {})
      : {};
  }

  // first = trainingHistory.first OR granted
  if (versionType === 'first') {
    if (Array.isArray(history.first) && history.first.length) {
      return history.first.find(r => (r.id || r.trainingId) === trainingId) || {};
    }

  }

  // first = trainingHistory.first OR granted
  if (versionType === 'granted') {
    if (Array.isArray(history.granted) && history.granted.length) {
      return history.granted.find(r => (r.id || r.trainingId) === trainingId) || {};
    }

  }

  return {};
};

/**
 * Collects removed training records from all project versions for display or export.
 *
 * @param {Object} comparisons - The result from compareTrainingRecords().
 * @param {Object} trainingHistory - The project object containing trainingHistory[].
 * @returns {Array<Object>} - List of removed training records merged with previous/first version data.
 */
export const getRemovedTrainingRecords = (comparisons = {}, trainingHistory = []) => {
  if (!comparisons || typeof comparisons !== 'object' || !Array.isArray(trainingHistory)) {
    return [];
  }

  const allRemovedIds = Array.from(
    new Set((comparisons.removed || []).flatMap(r => Array.isArray(r.ids) ? r.ids : []))
  );

  // Get the previous and first versions
  const previousVersion = trainingHistory.find(version => version?.id === 'previous') || {};
  const firstVersion = trainingHistory.find(version => version?.id === 'first') || {};

  // Function to find the record by ID
  const findRecordById = (version, id) => {
    return version?.trainingRecords?.find(record => record.id === id || record.trainingId === id);
  };

  return allRemovedIds
    .map(id => {
      // Find the record in either previous or first versions
      const prevRecord = findRecordById(previousVersion, id);
      const firstRecord = findRecordById(firstVersion, id);

      return prevRecord || firstRecord ? { ...prevRecord || firstRecord, id } : null;
    })
    .filter(Boolean);
};
