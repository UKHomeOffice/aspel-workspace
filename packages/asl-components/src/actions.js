const FETCH_TIMEOUT = 5000;

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
    .catch(err => {
      dispatch(requestFailed(err));
    });
};
