const pils = require('./pils');

module.exports = {
  read: {
    path: '/',
    router: () => (req, res, next) => next()
  },
  pils: {
    path: '/pils',
    router: pils
  }
};
