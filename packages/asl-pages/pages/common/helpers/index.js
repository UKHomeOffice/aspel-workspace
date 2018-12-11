const { get } = require('lodash');

const getEstablishment = req =>
  req.api(`/establishment/${req.establishmentId}`)
    .then(({ json: { data } }) => Promise.resolve(data))
    .catch(err => Promise.reject(err));

const getNacwos = req =>
  req.api(`/establishments/${req.establishmentId}/roles`, { query: { type: 'nacwo' } })
    .then(({ json: { data } }) => Promise.resolve(data))
    .catch(err => Promise.reject(err));

const getNacwoById = (req, id) =>
  getNacwos(req)
    .then(nacwos => Promise.resolve(nacwos.find(n => get(n, 'profile.id') === id)))
    .then(nacwo => nacwo && nacwo.profile)
    .catch(err => Promise.reject(err));

module.exports = {
  getNacwos,
  getNacwoById,
  getEstablishment
};
