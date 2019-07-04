module.exports = {
  dashboard: '/',
  search: '/search(/:searchType)?',
  global: {
    profile: '/profile/:profileId'
  },
  account: {
    menu: '/account',
    edit: '/account/edit'
  },
  establishment: {
    dashboard: '/establishments/:establishmentId',
    read: '/establishments/:establishmentId/details',
    asru: '/establishments/:establishmentId/asru/:asruUser'
  },
  profile: {
    list: '/establishments/:establishmentId/people',
    view: '/establishments/:establishmentId/people/:profileId',
    invite: '/establishments/:establishmentId/people/invite',
    invitations: '/establishments/:establishmentId/people/invitations'
  },
  project: {
    list: '/establishments/:establishmentId/projects',
    read: '/establishments/:establishmentId/projects/:projectId',
    version: {
      read: '/establishments/:establishmentId/projects/:projectId/versions/:versionId',
      update: '/establishments/:establishmentId/projects/:projectId/versions/:versionId',
      pdf: '/establishments/:establishmentId/projects/:projectId/versions/:versionId/pdf'
    }
  },
  place: {
    list: '/establishments/:establishmentId/places',
    create: {
      new: '/establishments/:establishmentId/places/create',
      confirm: '/establishments/:establishmentId/places/create/confirm',
      success: '/establishments/:establishmentId/places/create/success'
    },
    delete: {
      confirm: '/establishments/:establishmentId/places/:placeId/delete/confirm',
      success: '/establishments/:establishmentId/places/:placeId/delete/success'
    },
    update: {
      confirm: '/establishments/:establishmentId/places/:placeId/edit/confirm',
      success: '/establishments/:establishmentId/places/:placeId/edit/success'
    }
  },
  pil: {
    base: '/establishments/:establishmentId/people/:profileId/pil',
    create: '/establishments/:establishmentId/people/:profileId/pil/create',
    read: '/establishments/:establishmentId/people/:profileId/pil/:pilId',
    update: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit',
    procedures: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit/procedures',
    revoke: {
      base: '/establishments/:establishmentId/people/:profileId/pil/:pilId/revoke',
      confirm: '/establishments/:establishmentId/people/:profileId/pil/:pilId/revoke/confirm',
      success: '/establishments/:establishmentId/people/:profileId/pil/:pilId/revoke/success'
    },
    training: {
      exempt: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit/training/exempt',
      certificate: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit/training',
      modules: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit/training/modules'
    },
    exemptions: {
      exempt: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit/exemptions',
      modules: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit/exemptions/modules'
    },
    success: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit/success'
  },
  task: {
    base: '/tasks',
    read: '/tasks/:taskId',
    extend: '/tasks/:taskId/extend',
    confirm: '/tasks/:taskId/confirm',
    success: '/tasks/:taskId/success'
  },
  invitation: '/invitation/:token',
  feedback: '/feedback'
};
