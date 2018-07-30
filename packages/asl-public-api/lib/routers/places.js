const { Router } = require('express');
const isUUID = require('uuid-validate');
const { NotFoundError } = require('../errors');
const permissions = require('../middleware/permissions');

const submit = (action) => {
  return (req, res, next) => {
    const params = {
      action,
      model: 'place',
      data: { ...req.body, establishment: req.establishment.id },
      id: res.place && res.place.id
    };
    req.workflow(params)
      .then(response => {
        res.response = response;
        next();
      })
      .catch(next);
  };
};

const router = Router({ mergeParams: true });

router.param('id', (req, res, next, id) => {
  if (!isUUID(id)) {
    return next(new NotFoundError());
  }
  const { Role, Place, Profile } = req.models;
  Promise.resolve()
    .then(() => {
      return Place.scope('all').findOne({
        where: {
          id: req.params.id,
          establishmentId: req.establishment.id
        },
        include: {
          model: Role,
          as: 'nacwo',
          include: {
            model: Profile
          }
        }
      });
    })
    .then(place => {
      if (!place) {
        throw new NotFoundError();
      }
      res.place = place;
      next();
    })
    .catch(next);
});

router.get('/', (req, res, next) => {
  let { limit, offset, filters, sort } = req.query;
  const { Place } = req.models;
  limit = parseInt(limit, 10);
  offset = parseInt(offset, 10);

  const page = offset / limit;
  Promise.all([
    Place.getFilterOptions(req.establishment.id),
    Place.count(req.establishment.id),
    Place.filter({
      filters,
      sort,
      establishmentId: req.establishment.id
    })
      .debug()
      .page(page || 0, limit)
  ])
    .then(([filters, total, places]) => {
      res.response = {
        total,
        rows: places.results,
        count: places.total
      }
      req.filters = filters;
      return next();
    })
    .catch(next)
  // Promise.all([
  //   Place.query()
  //     .where({ establishmentId: req.establishment.id })
  //     .exec('getFilterOptions'),
  //   Place.query()
  //     .where({ establishmentId: req.establishment.id })
  //     .exec('count'),
  //   Place.query()
  //     .where({ establishmentId: req.establishment.id })
  //     .where(req.where)
  //     .include(Role, { as: 'nacwo', include: { model: Profile } })
  //     .paginate({ limit, offset })
  //     .order(req.order || [['site', 'ASC'], ['area', 'ASC'], ['name', 'ASC']])
  //     .exec('findAndCountAll')
  // ])
    // .then(([filters, total, result]) => {
    //   req.filters = filters;
    //   res.response = { ...result, total };
    //   next();
    // })
    // .catch(next);
});

router.post('/', permissions('place.create'), submit('create'));

router.get('/:id', (req, res, next) => {
  res.response = res.place;
  next();
});

router.put('/:id', permissions('place.update'), submit('update'));

router.delete('/:id', permissions('place.delete'), submit('delete'));

module.exports = router;
