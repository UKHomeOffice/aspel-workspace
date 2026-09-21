const dayJs = require('@ukhomeoffice/asl-components/src/dayjs.js');

module.exports = () => (req, res, next) => {
  const { PIL } = req.models;
  return Promise.resolve()
    .then(() => {
      return PIL.query()
        .withGraphFetched('[profile,establishment]')
        .where('reviewDate', '<', dayJs().add(3, 'months').toISOString())
        .where({ status: 'active' });
    })
    .then(pils => {
      res.response = pils.map(pil => {
        return {
          licenceNumber: pil.profile.pilLicenceNumber,
          establishment: pil.establishment.name,
          licenceHolder: `${pil.profile.firstName} ${pil.profile.lastName}`,
          reviewDate: dayJs(pil.reviewDate).format('YYYY-MM-DD')
        };
      });
    })
    .then(() => next())
    .catch(next);
};
