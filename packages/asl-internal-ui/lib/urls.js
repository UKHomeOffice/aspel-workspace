module.exports = {
  dashboard: '/',
  search: '/search(/:searchType)?',
  global: {
    profile: '/profile/:profileId',
    dedupe: '/profile/:profileId/dedupe'
  },
  account: {
    menu: '/account',
    update: '/account/edit',
    updateEmail: {
      base: '/account/update-email',
      confirm: '/account/update-email/confirm',
      success: '/account/update-email/success'
    }
  },
  establishment: {
    base: '/establishments',
    create: '/establishments/create',
    search: '/search/establishments',
    dashboard: '/establishments/:establishmentId',
    read: '/establishments/:establishmentId/details',
    asru: '/establishments/:establishmentId/asru/:asruUser',
    update: '/establishments/:establishmentId/details/edit'
  },
  profile: {
    list: '/establishments/:establishmentId/people',
    view: '/establishments/:establishmentId/people/:profileId',
    invite: '/establishments/:establishmentId/people/invite',
    permission: '/establishments/:establishmentId/people/:profileId/permission',
    invitations: '/establishments/:establishmentId/people/invitations',
    dedupe: '/establishments/:establishmentId/people/:profileId/dedupe'
  },
  role: {
    create: '/establishments/:establishmentId/people/:profileId/role/apply',
    delete: '/establishments/:establishmentId/people/:profileId/role/remove'
  },
  project: {
    list: '/establishments/:establishmentId/projects',
    read: '/establishments/:establishmentId/projects/:projectId',
    version: {
      read: '/establishments/:establishmentId/projects/:projectId/versions/:versionId',
      update: '/establishments/:establishmentId/projects/:projectId/versions/:versionId',
      pdf: '/establishments/:establishmentId/projects/:projectId/versions/:versionId/pdf'
    },
    revoke: {
      base: '/establishments/:establishmentId/projects/:projectId/revoke',
      confirm: '/establishments/:establishmentId/projects/:projectId/revoke/confirm',
      success: '/establishments/:establishmentId/projects/:projectId/revoke/success'
    }
  },
  place: {
    list: '/establishments/:establishmentId/places',
    create: '/establishments/:establishmentId/places/create',
    delete: '/establishments/:establishmentId/places/:placeId/delete',
    update: '/establishments/:establishmentId/places/:placeId/edit'
  },
  pil: {
    base: '/establishments/:establishmentId/people/:profileId/pil',
    create: '/establishments/:establishmentId/people/:profileId/pil/create',
    read: '/establishments/:establishmentId/people/:profileId/pil/:pilId',
    update: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit',
    procedures: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit/procedures',
    species: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit/animal-types',
    revoke: {
      base: '/establishments/:establishmentId/people/:profileId/pil/:pilId/revoke',
      confirm: '/establishments/:establishmentId/people/:profileId/pil/:pilId/revoke/confirm',
      success: '/establishments/:establishmentId/people/:profileId/pil/:pilId/revoke/success'
    },
    training: {
      exempt: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit/training/exempt',
      certificate: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit/training',
      modules: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit/training/modules',
      species: '/establishments/:establishmentId/people/:profileId/pil/:pilId/edit/training/species'
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
