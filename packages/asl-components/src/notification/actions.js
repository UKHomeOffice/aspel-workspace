const hideNotification = () => ({
    type: 'HIDE_MESSAGE'
});

const showNotification = ({ message, type, timeout }) => ({
    type: 'SHOW_MESSAGE',
    notification: {
        message,
        type,
        timeout
    }
});

module.exports = {
    hideNotification,
    showNotification
};
