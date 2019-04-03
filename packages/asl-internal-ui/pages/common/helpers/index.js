const getInspectors = req =>
  req.api(`/search/profiles`)
    .then(({ json: { data } }) => {
      return data.filter(p => p.asruUser && p.asruInspector);
    })
    .catch(err => Promise.reject(err));

module.exports = {
  getInspectors
};
