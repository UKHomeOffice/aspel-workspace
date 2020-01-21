const { showNotification } = require('./notification/actions');

const FETCH_TIMEOUT = 15000;

const requestItems = () => ({
  type: 'REQUEST_ITEMS'
});

const receiveItems = ({ rows, count, totalCount }) => ({
  type: 'RECEIVE_ITEMS',
  rows,
  count,
  totalCount
});

const requestFailed = () => ({
  type: 'REQUEST_FAILED'
});

const fetchItems = (url, dispatch) => {
  dispatch(requestItems());
  return Promise.resolve()
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'));
        }, FETCH_TIMEOUT);

        window.fetch(url, {
          credentials: 'include',
          headers: {
            Accept: 'application/json'
          }
        })
          .then(response => {
            return response.json()
              .then(json => {
                if (response.status > 399) {
                  const err = new Error(json.message || `Fetch failed with status code: ${response.status}`);
                  err.status = response.status;
                  Object.assign(err, json);
                  throw err;
                }
                return json;
              });
          })
          .then(resolve)
          .catch(reject);
      });
    })
    .then(({ datatable: { data: { rows }, pagination: { count, totalCount } } }) => {
      dispatch(receiveItems({ rows, count, totalCount }));
    })
    .catch(err => {
      dispatch(showNotification({ message: 'Connection error. Please wait a moment and try again.', type: 'error' }));
      dispatch(requestFailed());
      throw err;
    });
};

module.exports = {
  fetchItems
};
