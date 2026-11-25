const jwt = require('jsonwebtoken');

module.exports = settings => {

  return {
    // no expiry: used for confirm-email links, which should stay valid until the user confirms
    sign: payload => {
      return jwt.sign({ ...payload }, settings.secret);
    },
    // expiresIn must be a sign option; in the payload it is ignored and no exp claim is set
    signWithExpiry: payload => {
      return jwt.sign({ ...payload }, settings.secret, { expiresIn: settings.expiry || '7 days' });
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
