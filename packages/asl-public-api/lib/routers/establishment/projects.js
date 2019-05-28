const { get } = require('lodash');
const { Router } = require('express');
const { NotFoundError } = require('../../errors');
const { fetchOpenTasks, permissions } = require('../../middleware');

const perms = task => permissions(task, req => ({ licenceHolderId: req.project.licenceHolderId }));

const router = Router({ mergeParams: true });

const submit = action => (req, res, next) => {
  const params = {
    data: {
      establishmentId: req.establishment.id,
      licenceHolderId: req.user.profile.id
    },
    model: 'project',
    meta: req.body.meta || {}
  };

  if (req.project) {
    const submitted = req.project.versions.find(v => v.status === 'submitted');
    if (submitted) {
      Object.assign(params.meta, { version: submitted.id });
    }
  }

  return Promise.resolve()
    .then(() => {
      switch (action) {
        case 'create':
          return req.workflow.create(params);
        case 'delete':
          return req.workflow.delete({
            ...params,
            id: req.project.id
          });
        case 'fork':
          return req.workflow.update({
            ...params,
            action: 'fork',
            id: req.project.id
          });
        default:
          if (req.action === 'grant') {
            return req.workflow.update({
              ...params,
              action: 'grant',
              id: req.project.id
            });
          }
          if (req.action === 'resubmit') {
            return req.workflow.task(req.taskId).status({ status: 'resubmitted', meta: params.meta });
          }
      }
    })
    .then(response => {
      res.response = response.json.data;
      next();
    })
    .catch(next);
};

router.get('/', (req, res, next) => {
  const { Project } = req.models;
  const { limit, offset, search, sort, status = 'active' } = req.query;

  const projects = Project.scopeToParams({
    licenceHolderId: req.user.profile.id,
    establishmentId: req.establishment.id,
    status,
    search,
    offset,
    limit,
    sort
  });

  Promise.resolve()
    .then(() => req.user.can('project.read.all', req.params))
    .then(allowed => {
      if (allowed) {
        return projects.getAll();
      }
      return Promise.resolve()
        .then(() => req.user.can('project.read.basic', req.params))
        .then(allowed => {
          if (allowed) {
            return projects.getOwn();
          }
          throw new NotFoundError();
        });
    })
    .then(({ total, projects }) => {
      res.meta.count = projects.total;
      res.meta.total = total;
      res.response = projects.results;
      next();
    })
    .catch(next);
});

router.param('id', (req, res, next, id) => {
  const { Project, ProjectVersion } = req.models;
  const { withDeleted } = req.query;
  const queryType = withDeleted ? 'queryWithDeleted' : 'query';

  Promise.resolve()
    .then(() => {
      return Project.query()
        .findById(id)
        .where('establishmentId', req.establishment.id)
        .eager('[licenceHolder]');
    })
    .then(project => {
      if (!project) {
        throw new NotFoundError();
      }
      return ProjectVersion[queryType]()
        .select('id', 'status', 'createdAt')
        .where({ projectId: project.id })
        .orderBy('createdAt', 'desc')
        .then(versions => {
          // if most recent version is a draft, include this.
          const draft = versions && versions[0] && versions[0].status === 'draft' && versions[0];
          // get most recent granted version.
          const granted = versions.find(v => v.status === 'granted');
          req.project = {
            ...project,
            granted,
            draft,
            versions
          };
          next();
        });
    })
    .catch(next);
});

const canFork = (req, res, next) => {
  const version = get(req.project, 'versions[0]');
  if (!version) {
    return next(new NotFoundError());
  }
  // version can be forked, continue
  if (version.status !== 'withdrawn' && version.status !== 'draft') {
    return next();
  }
  // version cannot be forked, get version id
  res.response = {
    data: {
      id: version.id
    }
  };
  return next('route');
};

router.get('/:id',
  perms('project.read.single'),
  (req, res, next) => {
    res.response = req.project;
    next();
  },
  fetchOpenTasks
);

router.post('/',
  permissions('project.apply'),
  submit('create')
);

router.delete('/:id',
  perms('project.update'),
  submit('delete')
);

router.post('/:id/fork',
  perms('project.update'),
  canFork,
  submit('fork')
);

router.post('/:id/grant',
  perms('project.update'),
  (req, res, next) => {
    req.workflow.openTasks(req.project.id)
      .then(({ json: { data } }) => {
        if (!data || !data.length) {
          req.action = 'grant';
          return next();
        }
        req.taskId = data[0].id;
        req.action = 'resubmit';
        return next();
      });
  },
  submit()
);

router.use('/:id/project-version(s)?', require('./project-versions'));

module.exports = router;
