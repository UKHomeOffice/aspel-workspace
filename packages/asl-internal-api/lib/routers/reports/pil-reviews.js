const dayJs = require('@ukhomeoffice/asl-components/dayjs');

const { formatIsoDate } = dayJs;

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
          reviewDate: formatIsoDate(pil.reviewDate)
        };
      });
    })
    .then(() => next())
    .catch(next);
};
