const fetch = require('r2');
const https = require('https');

module.exports = settings => {
  const pdfIsSecure = settings.pdf.match(/^https:/);
  const agent = pdfIsSecure && new https.Agent({
    rejectUnauthorized: false
  });
  return (req, res, next) => {
    const render = res.render;
    const pdf = (template, locals) => {
      const defaults = {
        pdf: true,
        hostname: 'https://public-ui.notprod.asl.homeoffice.gov.uk'//`${req.protocol}://${req.get('host')}`
      };
      console.log(defaults);
      return render.call(res, template, Object.assign({}, locals, defaults), (err, html) => {
        if (err) return next(err);
        return fetch
          .post(settings.pdf, {
            agent,
            json: {
              template: html,
              pdfOptions: {
                printBackground: true,
                displayHeaderFooter: true,
                headerTemplate: '<p/>',
                footerTemplate: '<p style="font-size:10px;margin-left:40px;position:relative;top:12px;">Page <span class="pageNumber"></span> of <span class="totalPages"></p>',
                margin: {
                  top: 30,
                  left: 30,
                  right: 30,
                  bottom: 40
                }
              }
            }
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
