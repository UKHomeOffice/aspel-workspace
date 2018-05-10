const { Router } = require('express');

const actions = require('../../actions');

const api = require('../middleware/api');

module.exports = () => {

  const router = Router();

  router.get('/', api('/'));

  router.get('/', (req, res, next) => {
    res.template = 'details';
    res.store.dispatch(actions.setEstablishment(res.data));
    next();
  });

  return router;

};
