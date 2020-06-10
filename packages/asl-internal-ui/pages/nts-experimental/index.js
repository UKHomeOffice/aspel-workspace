const { page } = require('@asl/service/ui');
const { pipeline } = require('stream');
const through = require('through2');
const archiver = require('archiver');
const { get } = require('lodash');
const filenamify = require('filenamify');
const nts = require('../nts/lib/nts-summary');
const metrics = require('../../lib/middleware/metrics');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(metrics(settings));

  app.get('/:year', (req, res, next) => {
    const archive = archiver('zip');

    res.attachment(`nts-${req.params.year}.zip`);
    archive.pipe(res);

    const writeFile = (project, encoding, callback) => {
      return Promise.resolve()
        .then(() => nts(project))
        .then(doc => {
          const fileName = `${project.isLegacyStub ? `STUB-` : ''}${filenamify(project.title)}-${project.id}.docx`;
          return archive.append(Buffer.from(doc), { name: fileName });
        })
        .catch(e => {
          req.log('error', { message: e.message, stack: e.stack });
          return archive.append(Buffer.from(`${e.stack}`), { name: `ERROR-${filenamify(project.title)}-${project.id}.txt` });
        })
        .then(() => callback());
    };

    req.metrics('/reports/nts', { query: req.params })
      .then(stream => {
        pipeline(
          stream,
          through.obj(writeFile),
          err => {
            if (err) {
              return next(err);
            }
            archive.finalize();
          }
        );
      })
      .catch(next);
  });

  app.get('/', (req, res, next) => {
    const supportedYears = ['2017', '2018', '2019', '2020'];
    req.metrics('/reports/nts', { stream: false })
      .then(counts => {
        res.locals.static.projectCounts = supportedYears.reduce((obj, year) => {
          const count = counts.find(c => c.year.toString() === year);
          return {
            ...obj,
            [year]: count ? count.count : 0 };
        }, {});
      })
      .then(() => next())
      .catch(next);
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
