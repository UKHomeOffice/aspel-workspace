const actions = require('../../actions');

module.exports = url => {
  return (req, res, next) => {
    const u = url || req.originUrl;
    const establishment = req.user.get('establishment');
    if (!establishment) {
      return next(new Error('No associated establishment'));
    }
    req.api(`/establishment/${establishment}${u}`)
      .then(response => {
        res.store.dispatch(actions.setEstablishment(response.json.meta.establishment));
        res.data = response.json.data;
      })
      .then(() => next())
      .catch(e => next(e));
  };
};
