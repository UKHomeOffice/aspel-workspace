const { Router } = require('express');
const taskRouter = require('./task');
const Task = require('../models/task');
const tasksRouter = require('./tasks');

module.exports = ({ hooks, responder }) => {
  const router = Router();

  router.param('taskId', (req, res, next, taskId) => {
    Task.find(taskId)
      .then(model => {
        // we don't want the full Task model when fetching, just the values
        req.task = req.method === 'GET' ? model.toJSON() : model;
        next();
      })
      .catch(next);
  });

  router.use((req, res, next) => {
    const send = responder(req, res);
    res.respondWith = (data, meta) => send(data, meta);
    next();
  });

  router.get('/', tasksRouter());

  router.use('/:taskId', taskRouter({ hooks }));

  router.post('/', (req, res, next) => {
    return Promise.resolve()
      .then(() => {
        return Task.create(req.body, { hooks, user: req.user, payload: req.body });
      })
      .then(result => {
        return Task.find(result.id);
      })
      .then(data => {
        return res.respondWith(data);
      })
      .catch(next);
  });

  return router;
};
