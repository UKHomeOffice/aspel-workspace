const createStore = require('../src/create-store');

module.exports = () => (req, res, next) => {

  res.locals.store = createStore(res.locals);

  if (res.template) {
    if (req.query.pdf) {
      return res.pdf(res.template);
    }
    return res.render(res.template);
  }

  const notfound = new Error('Not found');
  notfound.status = 404;
  next(notfound);

};
