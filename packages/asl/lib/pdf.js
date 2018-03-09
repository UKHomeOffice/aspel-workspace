const fetch = require('r2');

module.exports = settings => {
  return (req, res, next) => {
    const render = res.render;
    const pdf = (template, locals) => {
      return render.call(res, template, Object.assign({}, locals, { pdf: true }), (err, html) => {
        if (err) return next(err);
        return fetch
          .post(settings.pdf, {
            json: { template: html }
          }).response
          .then(response => response.buffer())
          .then(data => {
            res.type('application/pdf');
            res.send(data);
          })
          .catch(next);
      });
    };
    res.render = (template, locals, cb) => {
      if (req.query.pdf) {
        return pdf(template, locals);
      }
      return render.call(res, template, locals, cb);
    };
    next();
  };
};
