export const hideNotification = () => ({
  type: 'HIDE_MESSAGE'
});

export const showNotification = ({ message, type, timeout }) => ({
  type: 'SHOW_MESSAGE',
  notification: {
    message,
    type,
    timeout
  }
});
