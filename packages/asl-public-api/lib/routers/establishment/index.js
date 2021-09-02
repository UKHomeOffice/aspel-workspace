const { Router } = require('express');
const { NotFoundError } = require('../../errors');
const { fetchOpenTasks, permissions, validateSchema, whitelist, updateDataAndStatus } = require('../../middleware');
const profileRouter = require('../profile');

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
      res.response = response.json.data;
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

module.exports = (settings) => {
  const router = Router({ mergeParams: true });

  router.param('establishment', (req, res, next, id) => {
    const { Establishment, PIL, Project } = req.models;

    if (isNaN(parseInt(id, 10))) {
      throw new NotFoundError();
    }

    Promise.resolve()
      .then(() => {
        const query = Establishment.query()
          .select('establishments.*')
          .count('places.id', {as: 'placesCount'})
          .leftJoin('places', 'places.establishment_id', 'establishments.id')
          .findById(id)
          .eager('[authorisations, roles.profile, asru]')
          .groupBy('establishments.id');

        if (req.query.activeLicenceCounts) {
          const activePilsQuery = PIL.query()
            .count('pils.id')
            .where('status', 'active')
            .andWhere('establishmentId', id)
            .as('activePilsCount');

          const activeProjectsQuery = Project.query()
            .count('projects.id')
            .where('status', 'active')
            .andWhere('establishmentId', id)
            .as('activeProjectsCount');

          query.select(activePilsQuery, activeProjectsQuery);
        }

        return query;
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
  }, fetchOpenTasks());

  router.put('/:establishment',
    permissions('establishment.update'),
    whitelist('name', 'address', 'country', 'procedure', 'breeding', 'supplying', 'authorisations', 'isTrainingEstablishment'),
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
  router.use('/:establishment/profile(s)?', profileRouter(settings));
  router.use('/:establishment/project(s)?', require('./projects'));
  router.use('/:establishment/invite-user', require('./invite-user'));
  router.use('/:establishment/invitations', require('./invitations'));
  router.use('/:establishment/pils', require('./pils'));
  router.use('/:establishment/billing', require('./billing'));
  router.use('/:establishment/rops', require('./rops-overview'));
  router.use('/:establishment/training-course(s)?', require('./training-courses'));

  return router;
};
