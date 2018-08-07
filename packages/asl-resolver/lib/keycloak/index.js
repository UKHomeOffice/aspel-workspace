const request = require('r2');
const URLSearchParams = require('url-search-params');

module.exports = settings => {

  const auth = () => {
    return Promise.resolve()
      .then(() => {
        const body = new URLSearchParams();
        body.set('grant_type', 'password');
        body.set('username', settings.username);
        body.set('password', settings.password);
        body.set('client_id', settings.client);
        body.set('client_secret', settings.secret);

        const opts = {
          method: 'POST',
          body
        };
        return request(`${settings.url}/realms/${settings.realm}/protocol/openid-connect/token`, opts);
      })
      .then(response => response.json)
      .then(json => json.access_token);
  };

  const ensureUser = user => {
    return auth()
      .then(token => {
        return Promise.resolve()
          .then(() => {
            const opts = {
              method: 'POST',
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              json: {
                username: user.email,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                enabled: true
              }
            };
            return request(`${settings.url}/admin/realms/${settings.realm}/users`, opts);
          })
          .then(r => r.response)
          .then(r => r.headers.get('location'))
          .then(url => {
            url = url || `${settings.url}/admin/realms/${settings.realm}/users?username=${user.email}`;
            const opts = {
              headers: {
                Authorization: `Bearer ${token}`
              }
            };
            return request(url, opts);
          })
          .then(response => response.json)
          .then(response => {
            if (Array.isArray(response)) {
              return response[0];
            }
            return response;
          });

      });
  };

  return {
    ensureUser
  };

};
