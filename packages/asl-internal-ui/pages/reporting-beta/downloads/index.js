const { Router } = require('express');
const tasksByWeek = require('./tasks-by-week');

module.exports = settings => {
  const router = Router();

  router.get('/', tasksByWeek(settings));

  return router;
};
