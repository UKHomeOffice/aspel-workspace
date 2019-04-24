const { page } = require('@asl/service/ui');
const archiver = require('archiver');
const { get } = require('lodash');
const filenamify = require('filenamify');

const nts = require('./lib/nts-summary');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/:year', (req, res, next) => {
    const archive = archiver('zip');

    res.attachment(`nts-${req.params.year}.zip`);
    archive.pipe(res);

    req.api('/search/projects?limit=1')
      .then(response => {
        return req.api(`/search/projects?limit=${response.json.meta.count}`);
      })
      .then(response => {
        return response.json.data.filter(project => {
          return project.issueDate && project.issueDate.substr(0, 4) === req.params.year;
        });
      })
      .then(projects => {
        // make an NTS summary document for each project
        return projects.reduce((promise, project) => {
          const url = `/establishment/${project.establishment.id}/project/${project.id}`;
          return promise
            .then(() => req.api(url))
            .then(response => {
              const grantedId = get(response.json, 'data.granted.id');
              if (grantedId) {
                return req.api(`${url}/project-version/${grantedId}`)
                  .then(response => nts(response.json.data))
                  .then(doc => {
                    return archive.append(Buffer.from(doc), { name: `${filenamify(project.title)}-${project.id}.docx` });
                  });
              }
            })
            .catch(e => req.log('error', { message: e.message, stack: e.stack }));
        }, Promise.resolve());

      })
      .then(() => {
        archive.finalize();
      })
      .catch(err => next(err));
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
