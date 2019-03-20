const Case = require('@ukhomeoffice/taskflow/lib/models/case');

const userHasNamedRole = (role, profile) => profile.roles.some(r => r.type === role);
const userHasPermission = (role, profile) => profile.establishments.some(e => e.role === role);

const applicant = require('./applicant');
const ntco = require('./ntco');
const admin = require('./admin');

const licensing = require('./licensing-officer');
const inspector = require('./inspector');
const asru = require('./asru');

module.exports = ({ profile, sort = { column: 'updatedAt' }, limit, offset, progress = 'outstanding' }) => {

  if (!profile) {
    return Promise.resolve({
      results: [],
      count: 0
    });
  }

  if (!sort.ascending) {
    sort.ascending = progress !== 'completed';
  }

  const userIsNtco = userHasNamedRole('ntco', profile);
  const userIsAdmin = userHasPermission('admin', profile);

  const addQueryClause = (q, type) => {
    if (typeof type[progress] !== 'function') {
      return q;
    }
    return q.orWhere(builder => type[progress](builder, profile));
  };

  let query = Case.query();

  query.where(builder => {

    addQueryClause(builder, applicant);

    if (profile.asruUser) {
      if (profile.asruLicensing) {
        addQueryClause(builder, licensing);
      }
      if (profile.asruInspector) {
        addQueryClause(builder, inspector);
      }
      if (!profile.asruLicensing && !profile.asruInspector) {
        addQueryClause(builder, asru);
      }
    } else {
      if (userIsNtco) {
        addQueryClause(builder, ntco);
      }
      if (userIsAdmin) {
        addQueryClause(builder, admin);
      }
    }

  });

  query = Case.orderBy({ query, sort });
  query = Case.paginate({ query, limit, offset });

  return query;

};
