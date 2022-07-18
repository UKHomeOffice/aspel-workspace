const { pages } = require('@asl/pages');

const dashboard = require('../pages/dashboard');
const invitation = require('../pages/invitation');
const contactUs = require('../pages/contact');
const confirmEmail = require('../pages/confirm-email');

module.exports = {
  projectVersion: {
    path: '/establishments/:establishmentId/projects/:projectId/versions/:versionId',
    breadcrumb: false,
    router: pages.projectVersion
  },
  retrospectiveAssessment: {
    path: '/establishments/:establishmentId/projects/:projectId/retrospective-assessment/:raId',
    breadcrumb: false,
    router: pages.retrospectiveAssessment
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
  ownTraining: {
    path: '/account/training',
    breadcrumb: false,
    router: pages.training
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
    breadcrumb: false,
    router: pages.unscopedPils
  },
  globalProfile: {
    path: '/profile/:profileId',
    breadcrumb: false,
    router: pages.globalProfile
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
  },
  contactUs: {
    path: '/contact-us',
    router: contactUs
  },
  confirmEmail: {
    path: '/confirm-email',
    router: confirmEmail
  },
  rops: {
    path: '/establishments/:establishmentId/projects/:projectId/rops/:ropId',
    breadcrumb: false,
    router: pages.rops
  },
  reminders: {
    path: '/reminders',
    breadcrumb: false,
    router: pages.reminders
  }
};
