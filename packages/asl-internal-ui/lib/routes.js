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
const rops = require('../pages/rops');
const downloads = require('../pages/downloads');
const licenceFees = require('../pages/licence-fees');
const asruProfilesList = require('../pages/asru-profiles-list');
const cjsm = require('../pages/cjsm');

module.exports = {
  projectVersion: {
    path: '/establishments/:establishmentId/projects/:projectId/versions/:versionId',
    breadcrumb: false,
    router: pages.projectVersion,
    before: projectVersionAsruActions()
  },
  retrospectiveAssessment: {
    path: '/establishments/:establishmentId/projects/:projectId/retrospective-assessment/:raId',
    breadcrumb: false,
    router: pages.retrospectiveAssessment
  },
  rops: {
    path: '/establishments/:establishmentId/projects/:projectId/rops/:ropId',
    breadcrumb: false,
    router: pages.rops
  },
  dashboard: {
    path: '/',
    router: dashboard
  },
  search: {
    path: '/search/:searchType',
    breadcrumb: false,
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
  asruProfilesList: {
    path: '/asru/profiles',
    router: asruProfilesList
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
      },
      cjsm: {
        path: '/cjsm',
        breadcrumb: false,
        router: cjsm
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
  training: {
    path: '/establishments/:establishmentId/people/:profileId/training',
    breadcrumb: false,
    router: pages.training
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
    breadcrumb: false,
    router: pages.unscopedPils
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
    router: reporting,
    permissions: 'asruReporting'
  },
  ropsReporting: {
    path: '/rops',
    router: rops,
    permissions: 'asruRops'
  },
  downloads: {
    path: '/downloads',
    router: downloads,
    permissions: 'asruReporting'
  },
  fees: {
    path: '/licence-fees',
    router: licenceFees,
    permissions: 'licenceFees'
  }
};
