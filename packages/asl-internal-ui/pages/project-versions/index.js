const { Router } = require('express');
const read = require('./read');

module.exports = () => {
  const app = Router();

  app.use(read());

  app.use((req, res) => res.sendResponse());

  return app;
};
