const { Router } = require('express');
const isUUID = require('uuid-validate');
const { validateSchema } = require('../../middleware');
const { NotFoundError } = require('../../errors');

const router = Router();

const submit = action => (req, res, next) => {
  const params = {
    model: 'certificate'
  };

  return Promise.resolve()
    .then(() => {
      if (action === 'create') {
        return req.workflow.create(req, {
          ...params,
          data: { profileId: req.profileId }
        });
      }
      if (action === 'delete') {
        return req.workflow.delete(req, {
          ...params,
          id: req.certificateId
        });
      }
    })
    .then(response => {
      res.response = response;
      next();
    })
    .catch(next);
};

const validateCertificate = () => (req, res, next) => {
  return validateSchema(req.models.Certificate, {
    ...req.body,
    profileId: req.profileId
  })(req, res, next);
};

router.param('certificate', (req, res, next, certificate) => {
  if (!isUUID(certificate)) {
    throw new NotFoundError();
  }
  req.certificateId = certificate;
  next();
});

router.post('/', validateCertificate(), submit('create'));
router.delete('/:certificate', submit('delete'));

module.exports = router;
