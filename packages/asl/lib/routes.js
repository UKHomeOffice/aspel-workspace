const { pages } = require('@asl/pages');

const dashboard = require('../pages/dashboard');
const invitation = require('../pages/invitation');
const globalProfile = require('../pages/profile');

module.exports = {
  projectVersion: {
    path: '/establishments/:establishmentId/projects/:projectId/versions/:versionId',
    breadcrumb: false,
    router: pages.projectVersion
  },
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
    path: '/establishments/:establishmentId',
    breadcrumb: false,
    router: pages.establishment
  },
  profile: {
    path: '/establishments/:establishmentId/people',
    breadcrumb: false,
    router: pages.profile
  },
  pils: {
    path: '/establishments/:establishmentId/pils',
    router: pages.pils
  },
  globalProfile: {
    path: '/profile/:profileId',
    breadcrumb: false,
    router: globalProfile
  },
  role: {
    path: '/establishments/:establishmentId/people/:profileId/role',
    breadcrumb: false,
    router: pages.role
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
