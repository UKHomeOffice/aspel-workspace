const dayJs = require('@ukhomeoffice/asl-components/src/dayjs.js');

const calculateDuration = (inDuration) => {
  const duration = {
    years: Number(inDuration?.years) || 0,
    months: Number(inDuration?.months) || 0,
    days: Number(inDuration?.days) || 0
  };

  const hasExplicitDuration = !!(duration.years || duration.months || duration.days);

  if (duration.years >= 5 || !hasExplicitDuration) {
    return {
      years: 5,
      months: 0,
      days: 0
    };
  }

  if (duration.months > 12) {
    duration.months = 0;
  }

  return duration;
};

const calculateExpiryDate = (issueDate, duration) => {

    const expiryDate = issueDate ? dayJs(issueDate) : dayJs();
    const calculatedDuration = calculateDuration(duration);

    // Subtracting a day for license to expire 1 day before to get correct license duration
    return expiryDate
      .add(calculatedDuration)
      .subtract(1, 'days')
      .endOf('day')
      .utc(true)
      // Subtracting an hour to cater for UTC/BST
      .subtract(1, 'hour')
      .toISOString();
  };

module.exports = calculateExpiryDate;
