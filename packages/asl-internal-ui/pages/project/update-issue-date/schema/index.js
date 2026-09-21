const dayJs = require('@ukhomeoffice/asl-components/src/dayjs.js');

module.exports = {
  newIssueDate: {
    inputType: 'inputDate',
    // Used by the GDS validDate messages; required/dateIsBefore keep their bespoke
    // content so the e2e-asserted "Date granted cannot be in the future" is unchanged.
    dateLabel: 'New date granted',
    validate: [
      'required',
      'validDate',
      { dateIsBefore: () => dayJs().endOf('day') }
    ]
  }
};
