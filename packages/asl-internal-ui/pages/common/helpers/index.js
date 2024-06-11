const getInspectors = req =>
  req
    .api('/asru/inspectors')
    .then(({ json: { data } }) => {
      return data.filter(p => p.asruUser && p.asruInspector);
    })
    .catch(err => Promise.reject(err));

const getSpocs = req =>
  req
    .api('/asru/spocs')
    .then(({ json: { data } }) => {
      return data.filter(p => p.asruUser && p.asruLicensing);
    })
    .catch(err => Promise.reject(err));

module.exports = {
  getInspectors,
  getSpocs
};
