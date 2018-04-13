const { Router } = require('express');
const actions = require('../../actions');

module.exports = ({ template, schema }) => {

  const router = Router();

  router.use((req, res, next) => {
    res.template = template;
    res.store.dispatch(actions.setSchema(schema));
    res.store.dispatch(actions.setListItems(res.data));
    res.store.dispatch(actions.setTextFilter(req.query.filter));
    res.store.dispatch(actions.setSort(req.query.sort));
    next();
  });

  return router;

}
