const { pages } = require('@asl/pages');

const dashboard = require('../pages/dashboard');
const dedupe = require('../pages/deduplicate');
const asruAssignment = require('../pages/asru-assignment');
const globalProfile = require('../pages/profile');
const projectAsruActions = require('../pages/project');
const projectVersionAsruActions = require('./routers/project-version');
const createEstablishment = require('../pages/create-establishment');
const search = require('../pages/search');
const reporting = require('../pages/reporting');

module.exports = {
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
  projectVersion: {
    path: '/establishments/:establishmentId/projects/:projectId/versions/:versionId',
    breadcrumb: false,
    router: pages.projectVersion,
    before: projectVersionAsruActions()
  },
  place: {
    path: '/establishments/:establishmentId/places',
    breadcrumb: false,
    router: pages.place
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
  }
};
