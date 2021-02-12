module.exports = ({ query, log }) => {
  const { report, initiatedBy } = query;
  const [
    schemaVersion,
    model,
    action
  ] = report.match(/((all|legacy)-)?(project|pil|establishment|role|place)-([a-z-]+)/).slice(2);

  log('debug', { matches: {
    schemaVersion,
    model,
    action
  } });

  let filters = { model, action };

  if (['application', 'amendment'].includes(action)) {
    filters.action = 'grant';
    filters.isAmendment = action === 'amendment';
  }

  if (model === 'project') {
    if (schemaVersion === 'all') {
      // don't add a schemaVersion
    } else if (schemaVersion === 'legacy') {
      filters.schemaVersion = 0;
    } else {
      filters.schemaVersion = 1;
    }
  }

  if (initiatedBy) {
    filters.initiatedBy = initiatedBy;
  }

  return filters;
};
