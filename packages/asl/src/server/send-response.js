const csv = require('csv-stringify');

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
          return csv(list.filtered, { header: true }, (err, output) => {
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
