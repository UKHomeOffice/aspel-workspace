const { get, omit } = require('lodash');
const { format } = require('date-fns');

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
          dob: format(values.dob, 'yyyy-MM-dd')
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
