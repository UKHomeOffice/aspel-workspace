const actions = require('../../actions');

module.exports = () => {
  return (req, res, next) => {
    const url = req.url;
    const establishment = req.user.get('establishment');
    if (!establishment) {
      return next(new Error('No associated establishment'));
    }

    const u = `/establishment/${establishment}${url}`;
    req.api(u)
      .then(response => {
        res.store.dispatch(actions.setEstablishment(response.json.meta.establishment));
        res.data = response.json.data;
      })
      .then(() => next())
      .catch(e => next(e));
  };
};
