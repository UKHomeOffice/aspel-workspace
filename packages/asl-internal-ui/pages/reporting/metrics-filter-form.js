const form = require('@asl/pages/pages/common/routers/form');

const cache = {
  data: null,
  expires: Infinity,
  duration: 60 * 60 * 1000
};

module.exports = (settings = {}) => form({
  configure: (req, res, next) => {
    req.form.schema = {
      start: {},
      end: {},
      establishment: {}
    };
    if (settings.filterEstablishment !== false) {
      if (!cache.data || cache.expires < Date.now()) {
        return req.api('/search/establishments', { query: { limit: 1000 } })
          .then(response => {
            const establishments = response.json.data.map(e => {
              return { value: e.id, label: e.name, status: e.status };
            });
            req.form.schema.establishment.options = establishments;
            cache.data = establishments;
            cache.expires = Date.now() + cache.duration;
          })
          .then(() => next())
          .catch(next);
      }
      req.form.schema.establishment.options = cache.data;
    }
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
