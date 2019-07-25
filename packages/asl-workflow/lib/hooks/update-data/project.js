const { get, pick, size } = require('lodash');

module.exports = (settings, model) => {
  const declarations = [
    'authority',
    'awerb',
    'ready',
    'authority-pelholder-name',
    'authority-endorsement-date',
    'awerb-review-date',
    'awerb-no-review-reason'
  ];
  const meta = get(model, 'meta.payload.meta', {});
  const updates = pick(meta, declarations);

  const version = get(model, 'meta.payload.meta.version', null);
  const data = get(model, 'data');

  if (size(updates)) {
    Object.assign(data.meta, updates);
  }
  if (version) {
    Object.assign(data.data, { version });
  }

  return model.update(data);
};
