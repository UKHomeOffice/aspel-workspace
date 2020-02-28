const { get, noop } = require('lodash');
const resolve = require('../hooks/resolve');

module.exports = settings => {
  const resolver = resolve(settings);
  return (req, res, next) => {
    const shouldSkipWorkflow = () => {
      const model = get(req.body, 'model');
      const action = get(req.body, 'action');
      if (model === 'projectVersion' && (action === 'update' || action === 'patch')) {
        return true;
      }
      if (model === 'project' && action === 'create') {
        if (get(req.body, 'data.isLegacyStub', false)) {
          return false; // don't skip workflow for legacy stub creation
        }
        return true;
      }
      return false;
    };
    if (shouldSkipWorkflow()) {
      return resolver({ data: req.body, update: noop, patch: noop })
        .then(result => {
          res.json({ data: { data: result } });
        })
        .catch(next);
    }
    next();
  };
};
