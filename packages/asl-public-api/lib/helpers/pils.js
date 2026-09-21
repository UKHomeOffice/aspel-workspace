const dayJs = require('@ukhomeoffice/asl-components/src/dayjs.js');

const attachReviewDue = (pil, n = 3, unit = 'months') => {
  if (pil.status !== 'active') {
    return pil;
  }
  pil.reviewDate = pil.reviewDate || dayJs(pil.updatedAt).add(5, 'years').toISOString();
  return {
    ...pil,
    reviewDue: dayJs(pil.reviewDate).isBefore(dayJs().add(n, unit)),
    reviewOverdue: dayJs(pil.reviewDate).isBefore(dayJs())
  };
};

module.exports = {
  attachReviewDue
};
