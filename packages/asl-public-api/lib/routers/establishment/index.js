const { Router } = require('express');
const { NotFoundError } = require('../../errors');
const { fetchOpenTasks, permissions, validateSchema, whitelist, updateDataAndStatus } = require('../../middleware');

const submit = action => (req, res, next) => {
  const params = {
    model: 'establishment',
    meta: req.body.meta,
    data: {
      ...(req.body.data || req.body)
    },
    id: req.establishment.id,
    action
  };

  return Promise.resolve()
    .then(() => req.workflow.update(params))
    .then(response => {
      res.response = response;
      next();
    })
    .catch(next);
};

const validateEstablishment = (req, res, next) => {
  return validateSchema(req.models.Establishment, {
    ...req.body.data,
    id: req.establishment.id
  })(req, res, next);
};

const router = Router({ mergeParams: true });

router.param('establishment', (req, res, next, id) => {
  const { Establishment } = req.models;

  Promise.resolve()
    .then(() => {
      return Establishment.query()
        .select('establishments.*')
        .count('places.id', {as: 'placesCount'})
        .leftJoin('places', 'places.establishment_id', 'establishments.id')
        .findById(id)
        .eager('[authorisations, roles.profile, asru]')
        .groupBy('establishments.id');
    })
    .then(result => {
      if (!result) {
        throw new NotFoundError();
      }
      req.establishment = result;
      next();
    })
    .catch(next);
});

router.get('/', permissions('establishment.list'), (req, res, next) => {
  let { limit, offset } = req.query;
  const { Establishment } = req.models;
  Promise.all([
    Establishment.count(),
    Establishment.paginate({
      query: Establishment.query(),
      limit,
      offset
    })
  ])
    .then(([total, establishments]) => {
      res.meta.total = total;
      res.meta.count = establishments.total;
      res.response = establishments.results;
      return next();
    })
    .catch(next);
});

router.use('/:establishment', permissions('establishment.read'));

router.get('/:establishment', (req, res, next) => {
  res.response = req.establishment;
  next();
}, fetchOpenTasks);

router.put('/:establishment',
  permissions('establishment.update'),
  whitelist('name', 'address', 'procedure', 'breeding', 'supplying', 'authorisations'),
  validateEstablishment,
  updateDataAndStatus(),
  submit('update')
);

router.put('/:establishment/grant',
  permissions('establishment.update'),
  whitelist(),
  submit('grant')
);

router.use('/:establishment/role(s)?', require('./roles'));
router.use('/:establishment/place(s)?', require('./places'));

router.use('/:establishment/profile(s)?', require('../profile'));

router.use('/:establishment/project(s)?', require('./projects'));
router.use('/:establishment/invite-user', require('./invite-user'));
router.use('/:establishment/invitations', require('./invitations'));
router.use('/:establishment/pil(s)?', require('../profile/pil'));
router.use('/:establishment/billing', require('./billing'));

module.exports = router;
