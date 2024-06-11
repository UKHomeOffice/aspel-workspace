const querystring = require('querystring');
const ndjson = require('ndjson');

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
      const qs = querystring.stringify({ stream, ...query });
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
          if (stream) {
            return response.body.pipe(ndjson.parse());
          } else {
            return response.json();
          }
        });
    };
    next();
  };

};
