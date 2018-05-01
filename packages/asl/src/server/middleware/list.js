const actions = require('../../actions');
const { setSort } = require('@ukhomeoffice/asl-components/components/datatable');
const { setTextFilter } = require('@ukhomeoffice/asl-components/components/text-filter');

module.exports = ({ schema }) => {

  return (req, res, next) => {
    res.store.dispatch(actions.setSchema(schema));
    res.store.dispatch(actions.setListItems(res.data));
    if (typeof req.query.filter !== 'undefined') {
      res.store.dispatch(setTextFilter(req.query.filter));
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
