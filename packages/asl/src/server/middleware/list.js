const actions = require('../../actions');

module.exports = ({ schema }) => {

  return (req, res, next) => {
    res.store.dispatch(actions.setSchema(schema));
    res.store.dispatch(actions.setListItems(res.data));
    res.store.dispatch(actions.setTextFilter(req.query.filter));
    res.store.dispatch(actions.setSort(req.query.sort));
    next();
  };

};
