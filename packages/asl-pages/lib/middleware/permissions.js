module.exports = (task, params) => (req, res, next) => {
  req.user.can(task, { ...(params || req.params), establishment: req.establishmentId })
    .then(allowed => {
      if (allowed) {
        return next();
      }
      const err = new Error('Forbidden');
      err.status = 403;
      throw err;
    })
    .catch(next);
};
