const jwt = require('jsonwebtoken');

module.exports = settings => {

  return {
    sign: payload => {
      if (!settings.expiry) {
        return jwt.sign(payload, settings.secret);
      }
      return jwt.sign(payload, settings.secret, { expiresIn: settings.expiry });
    },
    verify: token => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, settings.secret, (err, token) => {
          err ? reject(err) : resolve(token);
        });
      });
    }
  };

};
