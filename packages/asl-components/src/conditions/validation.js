const dayjs = require('../dayjs.js');

module.exports = (reminders) => {
    const deadline = reminders[0]?.deadline;

    if (!deadline) {
        return 'Please provide a valid date';
    }

    const parsedDeadline = dayjs(deadline, 'YYYY-MM-DD', true);
    if (!parsedDeadline.isValid()) {
        return 'Please provide a valid date';
    }

    if (!parsedDeadline.isAfter(dayjs(), 'day')) {
        return 'The date must be in the future';
    }
    return false;
};
