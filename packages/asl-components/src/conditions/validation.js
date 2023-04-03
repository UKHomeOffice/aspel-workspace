const moment = require('moment');

module.exports = (reminders) => {
    if (!reminders[0]) {
        return 'Please provide a valid date';
    }
    const deadline = reminders[0].deadline;
    // Check date is valid
    if (!deadline.match(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/)) {
        return 'Please provide a valid date';
    }
    // Check date is after today
    if (!moment(deadline, 'YYYY-MM-DD').isAfter(moment())) {
        return 'The date must be in the future';
    }
    return false;
};
