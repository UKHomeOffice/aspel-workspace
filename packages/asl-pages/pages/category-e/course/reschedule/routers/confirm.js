const { Router } = require('express');
const { get } = require('lodash');
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

  app.get('/', (req, res) => {
    return res.sendResponse();
  });

  app.post('/', (req, res, next) => {
    const values = get(req.session, `form[${req.model.id}].values`);
    const params = {
      method: 'PUT',
      json: {
        data: {
          ...normaliseDates(values)
        }
      }
    };

    req.api(`/establishment/${req.establishmentId}/training-course/${req.trainingCourseId}/course-dates`, params)
      .then(() => {
        delete req.session.form[req.model.id];
        res.setFlash('Course dates have been updated');

        return res.redirect(req.buildRoute('categoryE.course.read', { trainingCourseId: req.trainingCourseId }));
      })
      .catch((err) => {
        console.log(err, err?.message);
        return next(err);
      });
  });

  return app;
};
