const { versions } = require('@ukhomeoffice/asl-constants');
const { basic } = require('./users');

const publicUrl = 'http://localhost:8080';
const namedPersonId = '8d44d98c-ea1d-4d76-8145-f1685afd1cbd';
const nomineeEmail = 'holc-np@example.com';

const applicationOutcomes = {
  submitted: {
    previous: 'new',
    status: 'with-inspectorate',
    event: 'status:new:with-inspectorate'
  },
  returned: {
    previous: 'with-inspectorate',
    status: 'returned-to-applicant',
    event: 'status:with-inspectorate:returned-to-applicant'
  },
  recalled: {
    previous: 'returned-to-applicant',
    status: 'recalled-by-applicant',
    event: 'status:returned-to-applicant:recalled-by-applicant'
  },
  rejected: {
    previous: 'with-inspectorate',
    status: 'rejected',
    event: 'status:with-inspectorate:rejected'
  },
  refused: {
    previous: 'with-inspectorate',
    status: 'refused',
    event: 'status:with-inspectorate:refused'
  },
  granted: {
    previous: 'with-inspectorate',
    status: 'resolved',
    event: 'status:with-inspectorate:resolved'
  }
};

const removalOutcomes = {
  returned: {
    previous: 'with-inspectorate',
    status: 'returned-to-applicant',
    event: 'status:with-inspectorate:returned-to-applicant'
  },
  refused: {
    previous: 'with-inspectorate',
    status: 'refused',
    event: 'status:with-inspectorate:refused'
  },
  granted: {
    previous: 'with-inspectorate',
    status: 'resolved',
    event: 'status:with-inspectorate:resolved'
  }
};

const buildRoleApplicationTask = ({ roleType = 'holc', outcome = 'refused', roleVersion } = {}) => {
  const config = applicationOutcomes[outcome];
  return {
    id: `role-${roleType}-${outcome}-${roleVersion || 'legacy'}`,
    meta: {
      previous: config.previous,
      next: config.status,
      user: {
        id: 'f4c6fe14-15b4-403b-89e6-7e31913284c1',
        profile: {
          id: basic
        }
      }
    },
    event: config.event,
    status: config.status,
    data: {
      id: `role-${roleType}-${outcome}-${roleVersion || 'legacy'}-task`,
      data: {
        establishmentId: 8201,
        profileId: namedPersonId,
        type: roleType
      },
      meta: roleVersion ? { version: roleVersion } : {},
      model: 'role',
      action: 'create',
      subject: namedPersonId,
      changedBy: basic,
      modelData: {
        id: `role-${roleType}-${outcome}-${roleVersion || 'legacy'}-task`,
        establishmentId: 8201,
        profileId: namedPersonId,
        type: roleType
      },
      establishmentId: 8201
    },
    req: `req-role-${roleType}-${outcome}-${roleVersion || 'legacy'}`
  };
};

const buildRoleRemovalTask = ({ roleType = 'holc', outcome = 'refused' } = {}) => {
  const config = removalOutcomes[outcome];
  return {
    id: `role-removal-${roleType}-${outcome}`,
    meta: {
      previous: config.previous,
      next: config.status,
      user: {
        id: 'f4c6fe14-15b4-403b-89e6-7e31913284c1',
        profile: {
          id: basic
        }
      }
    },
    event: config.event,
    status: config.status,
    data: {
      id: `role-removal-${roleType}-${outcome}-task`,
      data: {
        establishmentId: 8201,
        profileId: namedPersonId,
        type: roleType
      },
      meta: {},
      model: 'role',
      action: 'delete',
      subject: namedPersonId,
      changedBy: basic,
      modelData: {
        id: `role-removal-${roleType}-${outcome}-task`,
        establishmentId: 8201,
        profileId: namedPersonId,
        type: roleType,
        status: 'active'
      },
      establishmentId: 8201
    },
    req: `req-role-removal-${roleType}-${outcome}`
  };
};

module.exports = {
  applicationOutcomes,
  basic,
  buildRoleApplicationTask,
  buildRoleRemovalTask,
  namedPersonId,
  nomineeEmail,
  publicUrl,
  removalOutcomes,
  versions
};
