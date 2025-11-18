const { Router } = require('express');
const { get, omit } = require('lodash');
const { trainingCourseDuration } = require('@ukhomeoffice/asl-constants');
const { format } = require('date-fns');

const normaliseDate = (dateStr) => {
  return format(dateStr, 'yyyy-MM-dd');
};

const normaliseDates = ({courseDuration, courseDate, startDate, endDate}) => {
  if (courseDuration === trainingCourseDuration.ONE_DAY) {
    return {
      startDate: normaliseDate(courseDate)
    };
  }

  if (courseDuration === trainingCourseDuration.MULTI_DAY) {
    return {
      startDate: normaliseDate(startDate),
      endDate: normaliseDate(endDate)
    };
  }
};

module.exports = () => {
  const app = Router({ mergeParams: true });

  app.get('/', (req, res) => res.sendResponse());

  app.post('/', (req, res, next) => {
    const values = get(req.session, `form[${req.model.id}].values`);
    const params = {
      method: 'POST',
      json: {
        data: {
          ...omit(values, ['id', 'courseDate', 'startDate', 'endDate']),
          ...normaliseDates(values)
        }
      }
    };

    req.api(`/establishment/${req.establishmentId}/training-courses`, params)
      .then(response => {
        delete req.session.form[req.model.id];
        const trainingCourseId = get(response, 'json.data.data.id');
        res.setFlash(
          'Course added',
          'Apply for category E PILs to add participants to the course.',
          'success'
        );

        return res.redirect(req.buildRoute('categoryE.course.read', { trainingCourseId }));
      })
      .catch(next);
  });

  return app;
};
