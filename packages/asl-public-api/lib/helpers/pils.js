const dayJs = require('@ukhomeoffice/asl-components/dayjs');

const attachReviewDue = (pil, n = 3, unit = 'months') => {
  if (pil.status !== 'active') {
    return pil;
  }
  const reviewDate = pil.reviewDate || dayJs(pil.updatedAt).add(5, 'years').toISOString();
  return {
    ...pil,
    reviewDate,
    reviewDue: dayJs(reviewDate).isBefore(dayJs().add(n, unit)),
    reviewOverdue: dayJs(reviewDate).isBefore(dayJs())
  };
};

module.exports = {
  attachReviewDue
};
