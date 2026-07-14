/**
 * Determines whether a protocol title should be treated as changed, which drives
 * the title diff/"Changed" highlight (ASL-4862).
 *
 * A title only counts as changed when a change is recorded against it *and* the
 * parent protocol was not itself newly added - otherwise every field of a brand
 * new protocol would be flagged as a change.
 *
 * @param {Object} flags - The pre-computed change/added flags for the title field.
 * @param {boolean} flags.changedFromFirst - Title changed since the first submitted version (grey badge).
 * @param {boolean} flags.changedFromLatest - Title changed since the latest submitted version (pink badge).
 * @param {boolean} flags.changedFromGranted - Title changed since the granted version.
 * @param {boolean} flags.parentAddedFromFirst - Parent protocol was newly added since the first version.
 * @param {boolean} flags.parentAddedFromLatest - Parent protocol was newly added since the latest version.
 * @param {boolean} flags.parentAddedFromGranted - Parent protocol was newly added since the granted version.
 *
 * @returns {boolean} Whether the title is considered changed.
 */
export const isTitleChanged = ({
  changedFromFirst,
  changedFromLatest,
  changedFromGranted,
  parentAddedFromFirst,
  parentAddedFromLatest,
  parentAddedFromGranted
}) => (changedFromFirst && !parentAddedFromFirst)
    || (changedFromLatest && !parentAddedFromLatest)
    || (changedFromGranted && !parentAddedFromGranted);
