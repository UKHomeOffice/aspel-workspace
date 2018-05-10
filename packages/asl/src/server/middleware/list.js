const actions = require('../../actions');
const { setSort } = require('@ukhomeoffice/asl-components/components/datatable');
const { setFilters } = require('@ukhomeoffice/asl-components/components/filters');

module.exports = ({ schema }) => {

  return (req, res, next) => {
    res.store.dispatch(actions.setSchema(schema));
    res.store.dispatch(actions.setListItems(res.data));
    if (typeof req.query.filters === 'object') {
      res.store.dispatch(setFilters(req.query.filters));
    }
    if (typeof req.query.sort === 'object') {
      const { column, ascending } = req.query.sort;
      res.store.dispatch(setSort({
        column,
        ascending: ascending === 'true'
      }));
    }
    next();
  };

};
