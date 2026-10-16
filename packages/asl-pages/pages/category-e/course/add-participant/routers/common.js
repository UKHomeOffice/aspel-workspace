const { get, omit } = require('lodash');
const dayjs = require('@ukhomeoffice/asl-components/dayjs');
const { DATE_FORMAT } = require('@ukhomeoffice/asl-constants');

module.exports = {
  submitParticipantForm: (messageFn) => (req, res, next) => {
    const values = get(req.session, `form[${req.model.id}].values`);

    const meta = values.comments ? {comments: values.comments} : {};
    delete values.comments;

    const params = {
      method: 'POST',
      json: {
        data: {
          ...omit(values, ['id', 'dob']),
          dob: dayjs(values.dob).format(DATE_FORMAT.iso)
        },
        meta
      }
    };

    req.api(`/establishment/${req.establishmentId}/training-course/${req.trainingCourseId}/training-pils`, params)
      .then(() => {
        const values = req.session.form[req.model.id].values;
        delete req.session.form[req.model.id];

        res.setFlash(...messageFn(values));

        res.redirect(`${req.buildRoute('categoryE.course.read')}`);
      })
      .catch(next);
  },

  canEndorse(req) {
    return req.user?.profile?.roles?.some(
      ({establishmentId, type}) =>
        req.trainingCourse.establishmentId === establishmentId && type === 'ntco'
    ) ?? false;
  }
};
