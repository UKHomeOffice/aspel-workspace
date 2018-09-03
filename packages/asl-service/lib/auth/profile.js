const api = require('../api');
const moment = require('moment');

module.exports = (endpoint) => {

  if (!endpoint) {
    return () => Promise.resolve(null);
  }

  const request = api(endpoint);

  return (user, session = {}) => {

    return Promise.resolve()
      .then(() => {
        // check for cached session profile
        if (session.profile) {
          const fresh = Date.now() < session.profile.expiresAt;
          const userId = session.profile.userId;
          if (fresh && userId && userId === user.id) {
            return session.profile;
          }
        }

        const headers = {
          Authorization: `bearer ${user.token}`
        };

        return request(`/me`, { headers })
          .then(response => {
            const p = response.json.data;
            p.expiresAt = moment.utc(moment().add(600, 'seconds')).valueOf();
            return p;
          })
          .catch(() => null);
      })
      .then(profile => {
        session.profile = profile;
        return profile;
      });
  };

};
