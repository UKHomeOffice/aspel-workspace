const { pages } = require('@asl/pages');

const dashboard = require('../pages/dashboard');
const dedupe = require('../pages/deduplicate');
const asruAssignment = require('../pages/asru-assignment');
const projectAsruActions = require('../pages/project');
const projectVersionAsruActions = require('./routers/project-version');
const globalProfile = require('../pages/global-profile');
const createEstablishment = require('../pages/create-establishment');
const revokeEstablishment = require('../pages/revoke-establishment');
const search = require('../pages/search');
const reporting = require('../pages/reporting');
const downloads = require('../pages/downloads');
const licenceFees = require('../pages/licence-fees');
const nonTechnicalSummaries = require('../pages/nts');
const nonTechnicalSummariesExperimental = require('../pages/nts-experimental');

module.exports = {
  projectVersion: {
    path: '/establishments/:establishmentId/projects/:projectId/versions/:versionId',
    breadcrumb: false,
    router: pages.projectVersion,
    before: projectVersionAsruActions()
  },
  dashboard: {
    path: '/',
    router: dashboard
  },
  search: {
    path: '/search',
    router: search
  },
  globalProfile: {
    path: '/profile/:profileId',
    breadcrumb: false,
    router: globalProfile,
    routes: {
      dedupe: {
        path: '/dedupe',
        router: dedupe
      }
    }
  },
  account: {
    path: '/account',
    breadcrumb: false,
    router: pages.user
  },
  createEstablishment: {
    path: '/establishments/create',
    router: createEstablishment
  },
  establishment: {
    path: '/establishments/:establishmentId',
    breadcrumb: false,
    router: pages.establishment,
    routes: {
      asru: {
        path: '/asru/:asruUser',
        breadcrumb: false,
        router: asruAssignment
      }
    }
  },
  revokeEstablishment: {
    path: '/establishments/:establishmentId/revoke',
    router: revokeEstablishment,
    permissions: 'establishment.revoke'
  },
  profile: {
    path: '/establishments/:establishmentId/people',
    breadcrumb: false,
    router: pages.profile
  },
  role: {
    path: '/establishments/:establishmentId/people/:profileId/role',
    breadcrumb: false,
    router: pages.role
  },
  projectAsruActions: {
    path: '/establishments/:establishmentId/projects/:projectId',
    breadcrumb: false,
    router: projectAsruActions
  },
  project: {
    path: '/establishments/:establishmentId/projects',
    breadcrumb: false,
    router: pages.project
  },
  place: {
    path: '/establishments/:establishmentId/places',
    breadcrumb: false,
    router: pages.place
  },
  pils: {
    path: '/establishments/:establishmentId/pils',
    router: pages.pils
  },
  pil: {
    path: '/establishments/:establishmentId/people/:profileId/pil',
    breadcrumb: false,
    router: pages.pil
  },
  task: {
    path: '/tasks',
    breadcrumb: false,
    router: pages.task
  },
  feedback: {
    path: '/feedback',
    router: pages.feedback
  },
  reporting: {
    path: '/reporting',
    router: reporting
  },
  downloads: {
    path: '/downloads',
    router: downloads
  },
  fees: {
    path: '/licence-fees',
    router: licenceFees,
    permissions: 'licenceFees'
  },
  nts: {
    path: '/non-technical-summaries',
    router: nonTechnicalSummaries
  },
  ntsExperiments: {
    path: '/nts-experimental',
    breadcrumb: false,
    router: nonTechnicalSummariesExperimental
  }
};
