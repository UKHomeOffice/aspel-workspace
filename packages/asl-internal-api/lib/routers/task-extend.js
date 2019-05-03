const { Router } = require('express');
const isUUID = require('uuid-validate');
const { NotFoundError, UnauthorisedError } = require('@asl/service/errors');

module.exports = () => {
  const router = Router({ mergeParams: true });

  router.put('/', (req, res, next) => {
    const taskId = req.params.taskId;

    if (!isUUID(taskId)) {
      throw new NotFoundError();
    }

    if (!req.user.profile.asruInspector) {
      throw new UnauthorisedError();
    }

    return req.workflow.task(taskId).extend({ comment: req.body.meta.comment })
      .then(response => {
        res.response = response;
        next();
      })
      .catch(next);
  });

  return router;
};
