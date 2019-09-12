module.exports = ({ whitelist = [] }) => {

  return (req, res, next) => {
    // destroy the profile cache if updating data
    if (req.method !== 'get' && whitelist.includes(req.path)) {
      req.session.profile = null;
    }
    next();
  };

};
