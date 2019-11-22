const { pages } = require('@asl/pages');

const dashboard = require('../pages/dashboard');
const invitation = require('../pages/invitation');
const updateVersion = require('../pages/project-versions');

module.exports = {
  dashboard: {
    path: '/',
    router: dashboard
  },
  account: {
    path: '/account',
    breadcrumb: false,
    router: pages.user
  },
  establishment: {
    path: '/e/:establishmentId',
    breadcrumb: false,
    router: pages.establishment
  },
  profile: {
    path: '/e/:establishmentId/people',
    breadcrumb: false,
    router: pages.profile
  },
  role: {
    path: '/e/:establishmentId/people/:profileId/role',
    breadcrumb: false,
    router: pages.role
  },
  project: {
    path: '/e/:establishmentId/projects',
    breadcrumb: false,
    router: pages.project
  },
  projectVersion: {
    path: '/e/:establishmentId/projects/:projectId/versions/:versionId',
    breadcrumb: false,
    router: pages.projectVersion,
    routes: {
      update: {
        path: '/edit',
        breadcrumb: false,
        router: updateVersion
      }
    }
  },
  place: {
    path: '/e/:establishmentId/places',
    breadcrumb: false,
    router: pages.place
  },
  pil: {
    path: '/e/:establishmentId/people/:profileId/pil',
    breadcrumb: false,
    router: pages.pil
  },
  task: {
    path: '/tasks',
    breadcrumb: false,
    router: pages.task
  },
  invitation: {
    path: '/invitation/:token',
    breadcrumb: false,
    router: invitation
  },
  feedback: {
    path: '/feedback',
    router: pages.feedback
  }
};
