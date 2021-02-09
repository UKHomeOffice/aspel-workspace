module.exports = query => {
  const { report, initiatedBy } = query;
  const [
    schemaVersion,
    model,
    action
  ] = report.match(/((all|legacy)-)?(project|pil|establishment|role|place)-([a-z-]+)/).slice(2);

  console.log({report, schemaVersion, model, action});

  let filters = {
    model,
    action: ['application', 'amendment'].includes(action) ? 'grant' : action,
    isAmendment: action === 'amendment'
  };

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
