const form = require('@asl/pages/pages/common/routers/form');

module.exports = form({
  configure: (req, res, next) => {
    req.form.schema = {
      start: {},
      end: {},
      establishment: {}
    };
    next();
  },
  getValues: (req, res, next) => {
    if (req.query.establishment === 'all') {
      req.form.values.establishment = '';
      req.session.form[req.model.id].values.establishment = '';
    }
    next();
  },
  process: (req, res, next) => {
    req.form.values.establishment = parseInt(req.form.values.establishment, 10);
    next();
  },
  saveValues: (req, res) => {
    res.redirect(req.originalUrl);
  }
});
