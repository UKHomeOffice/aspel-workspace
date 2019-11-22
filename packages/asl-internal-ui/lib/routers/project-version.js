const { Router } = require('express');
const bodyParser = require('body-parser');

module.exports = () => {
  const app = Router({ mergeParams: true });

  app.put('/conditions', bodyParser.json(), (req, res, next) => {
    const opts = {
      method: 'PUT',
      json: {
        data: req.body
      }
    };
    req.api(`/project-versions/${req.versionId}/conditions`, opts)
      .then(() => res.json({}))
      .catch(next);
  });

  return app;
};
