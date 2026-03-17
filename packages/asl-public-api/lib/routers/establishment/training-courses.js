const { Router } = require('express');
const { BadRequestError } = require('../../errors');
const { permissions, validateSchema, fetchOpenTasks } = require('../../middleware');
const { omit, pick } = require('lodash');
const moment = require('moment');

const app = Router({ mergeParams: true });

const submit = action => (req, res, next) => {
  const params = {
    model: 'trainingCourse',
    data: {
      ...(req.body.data || req.body),
      establishmentId: req.establishment.id
    }
  };
  return Promise.resolve()
    .then(() => {
      switch (action) {
        case 'create':
          return req.workflow.create(params);
        case 'update':
          return req.workflow.update({ ...params, id: req.trainingCourseId });
        case 'delete':
          return req.workflow.delete({ ...params, id: req.trainingCourseId });
      }
    })
    .then(response => {
      res.response = response.json.data;
      next();
    })
    .catch(next);
};

app.param('trainingCourseId', (req, res, next, id) => {
  const { TrainingCourse } = req.models;

  TrainingCourse.query().findById(id).withGraphFetched('[project, trainingPils]')
    .then(trainingCourse => {
      req.trainingCourseId = id;
      req.trainingCourse = trainingCourse;
      next();
    })
    .catch(next);
});

app.get('/', permissions('trainingCourse.read'), (req, res, next) => {
  const { limit, offset, sort } = req.query;
  const { TrainingCourse } = req.models;
  Promise.all([
    TrainingCourse.count(req.establishment.id),
    TrainingCourse.list({
      establishmentId: req.establishment.id,
      sort,
      limit,
      offset
    })
  ])
    .then(([total, courses]) => {
      res.meta.total = total;
      res.meta.count = courses.total;
      res.response = courses.results;
      next();
    })
    .catch(next);
});

function checkNoLicences(req, res, next) {
  Promise.resolve()
    .then(() => req.trainingCourse.$relatedQuery('trainingPils'))
    .then(pils => {
      if (pils.length) {
        return next(new BadRequestError('Course has participants and can\'t be changed'));
      }
      next();
    })
    .catch(next);
}

function checkCourseNotStarted(req, res, next) {
  const currentStartDate = moment(req.trainingCourse.startDate, 'YYYY-MM-DD');
  if (currentStartDate.isBefore(moment().endOf('day'))) {
    return next(new BadRequestError('Course dates cannot be updated once the course has started'));
  }

  next();
}

function updateDates(req, res, next) {
  req.body.data = {
    ...omit(req.trainingCourse, 'id', 'courseDuration', 'startDate', 'endDate'),
    ...pick(req.body.data ?? req.body, 'courseDuration', 'startDate', 'endDate')
  };

  next();
}

app.post('/',
  permissions('trainingCourse.update'),
  validateSchema('TrainingCourse'),
  submit('create')
);

app.put('/:trainingCourseId',
  permissions('trainingCourse.update'),
  checkNoLicences,
  validateSchema('TrainingCourse'),
  submit('update')
);

app.put('/:trainingCourseId/course-dates',
  permissions('trainingCourse.update'),
  checkCourseNotStarted,
  updateDates,
  validateSchema('TrainingCourse'),
  submit('update')
);

app.delete('/:trainingCourseId',
  permissions('trainingCourse.update'),
  checkNoLicences,
  submit('delete')
);

app.get('/:trainingCourseId', permissions('trainingCourse.read'), (req, res, next) => {
  res.response = req.trainingCourse;
  next();
}, fetchOpenTasks());

app.use('/:trainingCourseId/training-pil(s)?', require('./training-pils'));

module.exports = app;
