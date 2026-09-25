
const dayjs = require('../dayjs.js');

const { STRICT_DATE_FORMATS, parseDate } = dayjs;

module.exports = (reminders) => {
    const deadline = reminders[0]?.deadline;

    if (!deadline) {
        return 'Please provide a valid date';
    }

    const parsedDeadline = parseDate(deadline, STRICT_DATE_FORMATS, true);
    if (!parsedDeadline.isValid()) {
        return 'Please provide a valid date';
    }

    if (!parsedDeadline.isAfter(dayjs(), 'day')) {
        return 'The date must be in the future';
    }
    return false;
};
