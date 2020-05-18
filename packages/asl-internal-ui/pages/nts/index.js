const { page } = require('@asl/service/ui');
const archiver = require('archiver');
const { get, groupBy } = require('lodash');
const filenamify = require('filenamify');
const nts = require('./lib/nts-summary');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    req.api('/search/projects?limit=1')
      .then(response => {
        return req.api(`/search/projects?limit=${response.json.meta.count}`);
      })
      .then(response => {
        const projects = response.json.data
          .filter(p => p.issueDate)
          // filter out ASRU TEST
          .filter(p => p.establishmentId !== 1502162);
        req.projectsByYear = groupBy(projects, p => p.issueDate.substr(0, 4));
        next();
      })
      .catch(next);
  });

  app.get('/:year', (req, res, next) => {
    const archive = archiver('zip');

    res.attachment(`nts-${req.params.year}.zip`);
    archive.pipe(res);

    return Promise.resolve()
      .then(() => {
        return req.projectsByYear[req.params.year] || [];
      })
      .then(projects => {
        // make an NTS summary document for each project
        return projects.reduce((promise, project) => {
          const url = `/establishment/${project.establishment.id}/project/${project.id}`;
          return promise
            .then(() => req.api(url))
            .then(response => {
              const project = get(response.json, 'data');
              project.title = project.title || 'Untitled Project';

              // for project stubs, use the latest version which might include NTS, otherwise only use the granted version
              const versionId = project.isLegacyStub ? project.versions[0].id : get(project, 'granted.id');

              if (versionId) {
                return req.api(`${url}/project-version/${versionId}`)
                  .then(response => nts(response.json.data))
                  .then(doc => {
                    const fileName = `${project.isLegacyStub ? `STUB-` : ''}${filenamify(project.title)}-${project.id}.docx`;
                    return archive.append(Buffer.from(doc), { name: fileName });
                  });
              }
            })
            .catch(e => {
              req.log('error', { message: e.message, stack: e.stack });
              return archive.append(Buffer.from(`${e.stack}`), { name: `ERROR-${filenamify(project.title)}-${project.id}.txt` });
            });
        }, Promise.resolve());

      })
      .then(() => {
        archive.finalize();
      })
      .catch(err => next(err));
  });

  app.get('/', (req, res, next) => {
    const supportedYears = ['2017', '2018', '2019', '2020'];
    res.locals.static.projectCounts = supportedYears.reduce((obj, year) => {
      return { ...obj, [year]: get(req.projectsByYear, `${year}.length`, 0) };
    }, {});
    next();
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
