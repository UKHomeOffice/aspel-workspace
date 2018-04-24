const actions = require('../../actions');
const { setSort } = require('govuk-react-components/components/datatable');

module.exports = ({ schema }) => {

  return (req, res, next) => {
    res.store.dispatch(actions.setSchema(schema));
    res.store.dispatch(actions.setListItems(res.data));
    res.store.dispatch(actions.setTextFilter(req.query.filter));
    if (typeof req.query.sort === 'object') {
      const { column, ascending } = req.query.sort;
      res.store.dispatch(setSort({
        column,
        ascending: JSON.parse(ascending)
      }));
    }
    next();
  };

};
