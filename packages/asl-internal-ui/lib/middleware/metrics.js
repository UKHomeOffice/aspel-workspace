const querystring = require('querystring');
const ndjson = require('ndjson');

const toBoolean = value => {
  if (value === 'false' || value === false || value === '0' || value === 0) {
    return false;
  }

  return !!value;
};

module.exports = settings => {

  return (req, res, next) => {
    if (typeof req.metrics === 'function') {
      return next();
    }

    const headers = {
      Authorization: `bearer ${req.user.access_token}`,
      'Content-type': 'application/json'
    };
    req.metrics = (path, { stream = true, query = {} } = {}) => {
      const shouldStream = Object.prototype.hasOwnProperty.call(query, 'stream')
        ? toBoolean(query.stream)
        : stream;
      const qs = querystring.stringify({ ...query, stream: shouldStream });

      return fetch(`${settings.metrics}${path}?${qs}`, { headers })
        .then(response => {
          if (response.status > 399) {
            return response.json()
              .then(json => {
                const err = new Error(json.message);
                err.status = response.status;
                Object.assign(err, json);
                throw err;
              });
          }
          if (shouldStream) {
            return response.body.pipe(ndjson.parse());
          } else {
            return response.json();
          }
        });
    };
    next();
  };

};
