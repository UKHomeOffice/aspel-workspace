const ApiClient = require('@asl/service/lib/api');

module.exports = settings => {

  return (req, res, next) => {
    const headers = {
      Authorization: `bearer ${req.user.access_token}`,
      'Content-type': 'application/json'
    };
    req.workflow = ApiClient(settings.workflow, { headers });
    next();
  };

};
