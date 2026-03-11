const { buildModel } = require('../../../../lib/utils');
const { omit } = require('lodash');

function getFormDates(trainingCourse) {
  if (trainingCourse?.courseDuration === 'one-day') {
    return {
      courseDate: trainingCourse.startDate,
      startDate: null,
      endDate: null
    };
  }

  if (trainingCourse?.courseDuration === 'multi-day') {
    return {
      courseDate: null,
      startDate: trainingCourse.startDate,
      endDate: trainingCourse.endDate
    };
  }

  return { courseDate: null, startDate: null, endDate: null };
}

module.exports = {
  modelFromCourse: (schema) => (req, res, next) => {
    req.model =
      req.trainingCourse
        ? {
          ...omit(req.trainingCourse, 'startDate', 'endDate'),
          ...getFormDates(req.trainingCourse)
        }
        : {
          id: 'new-category-e-course',
          ...buildModel(schema)
        };

    next();
  }
};
