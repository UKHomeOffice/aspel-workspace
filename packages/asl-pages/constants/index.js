const { DATE_FORMAT } = require('@ukhomeoffice/asl-components/utils');
function getRopsYears(start) {
  let end = (new Date()).getFullYear();
  // array length should be 1 when start and end are the same
  const years = Array.from({ length: 1 + end - start }, (num, i) => start + i);
  return years.reverse();
}
module.exports = {
  dateFormat: DATE_FORMAT,
  ropsYears: getRopsYears(2021)
};
