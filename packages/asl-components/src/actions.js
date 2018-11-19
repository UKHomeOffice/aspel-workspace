import fetch from 'r2';

const FETCH_TIMEOUT = 5000;
const NOTIFICATION_DURATION = 5000;
let notificationTimeout;

const requestItems = () => ({
  type: 'REQUEST_ITEMS'
});

const receiveItems = ({ rows, count, totalCount }) => ({
  type: 'RECEIVE_ITEMS',
  rows,
  count,
  totalCount
});

const showError = message => ({
  type: 'SHOW_ERROR',
  message
});

export const hideMessage = () => {
  clearTimeout(notificationTimeout);
  return {
    type: 'HIDE_MESSAGE'
  };
};

export const showErrorNotification = message => (dispatch, getState) => {
  notificationTimeout = setTimeout(() => dispatch(hideMessage()), NOTIFICATION_DURATION);
  return dispatch(showError(message));
};

export const fetchItems = (url, dispatch) => {
  dispatch(requestItems());
  return Promise.resolve()
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'));
        }, FETCH_TIMEOUT);

        fetch(url, {
          credentials: 'include',
          headers: {
            Accept: 'application/json'
          }
        })
          .json
          .then(resolve, reject);
      });
    })
    .then(({ datatable: { data: { rows }, pagination: { count, totalCount } } }) => {
      dispatch(receiveItems({ rows, count, totalCount }));
    })
    .catch(err => dispatch(showErrorNotification(err.message)));
};
