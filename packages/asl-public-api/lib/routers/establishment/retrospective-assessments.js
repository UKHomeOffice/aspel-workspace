const { Router } = require('express');
const { permissions, fetchOpenTasks } = require('../../middleware');
const shasum = require('shasum');
const { BadRequestError } = require('../../errors');

const submit = action => (req, res, next) => {
  const params = {
    model: 'retrospectiveAssessment',
    meta: req.body.meta,
    data: req.body.data
  };

  return Promise.resolve()
    .then(() => req.workflow.update({
      ...params,
      id: req.params.raId,
      action: req.params.action || action
    }))
    .then(response => {
      res.response = response;
      next();
    })
    .catch(next);
};

const app = Router({ mergeParams: true });

app.param('raId', (req, res, next, raId) => {
  const { RetrospectiveAssessment } = req.models;
  return Promise.resolve()
    .then(() => RetrospectiveAssessment.query().findById(raId))
    .then(ra => {
      req.ra = ra;
      req.ra.project = req.project;
      next();
    })
    .catch(next);
});

const canUpdate = (req, res, next) => {
  if (req.ra.status !== 'draft') {
    return next(new BadRequestError());
  }
  return next();
};

const validateAction = (req, res, next) => {
  const allowed = ['update', 'patch'];

  if (allowed.includes(req.params.action)) {
    return next();
  }
  return next(new BadRequestError());
};

app.put('/:raId/:action',
  permissions('retrospectiveAssessment.update'),
  validateAction,
  canUpdate,
  submit(),
  (req, res, next) => {
    const { RetrospectiveAssessment } = req.models;
    RetrospectiveAssessment.query()
      .eager('[project, project.licenceHolder]')
      .findById(req.ra.id)
      .then(ra => {
        res.response = ra;
        res.meta.checksum = shasum(res.response.data);
      })
      .then(() => next())
      .catch(e => next(e));
  }
);

app.get('/:raId', permissions('retrospectiveAssessment.read'), (req, res, next) => {
  res.response = req.ra;
  next();
}, fetchOpenTasks(req => req.ra.projectId));

module.exports = app;
