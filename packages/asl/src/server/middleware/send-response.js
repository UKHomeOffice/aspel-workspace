const csv = require('csv-stringify');

const { chain, get } = require('lodash');

const flatten = (row, schema) => {
  return chain(row)
    .pick(Object.keys(schema))
    .mapValues((val, key) => get(row, schema[key].accessor || key))
    .mapValues(val => Array.isArray(val) ? val.join() : val)
    .value();
};

const formatDataForCsv = (data, schema) => data.map(r => flatten(r, schema));

module.exports = () => (req, res, next) => {

  res.locals.store = res.store;

  if (res.template) {
    switch (req.query.format) {
      case 'pdf':
        if (res.pdfTemplate) {
          return res.pdf(res.pdfTemplate);
        }
        throw new Error('PDF rendering is not suported for this page');
      case 'csv':
        const list = res.store.getState().list;
        if (list) {
          res.type('application/csv');
          res.attachment(`${res.template}.csv`);
          return csv(formatDataForCsv(list.filtered, list.schema), { header: true, columns: Object.keys(list.schema) }, (err, output) => {
            err ? next(err) : res.send(output);
          });
        }
        throw new Error('CSV rendering is not suported for this page');
      default:
        return res.render(res.template);
    }
  }

  const notfound = new Error('Not found');
  notfound.status = 404;
  next(notfound);

};
