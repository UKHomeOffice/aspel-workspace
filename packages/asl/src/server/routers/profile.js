const { Router } = require('express');

const actions = require('../../actions');
const Tables = require('../../schema');

const api = require('../middleware/api');
const list = require('../middleware/list');

module.exports = () => {

  const router = Router();

  router.get('/:id', api());

  router.get('/:id', (req, res, next) => {
    res.template = 'profile';
    res.store.dispatch(actions.setSchema(Tables.places));
    res.store.dispatch(actions.setProfile(res.data));
    next();
  });

  return router;

};
