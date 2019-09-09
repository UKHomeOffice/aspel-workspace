module.exports = {
  dashboard: '/',
  account: {
    menu: '/account',
    update: '/account/edit'
  },
  establishment: {
    dashboard: '/e/:establishmentId',
    read: '/e/:establishmentId/details',
    update: '/e/:establishmentId/details/edit'
  },
  role: {
    create: '/e/:establishmentId/people/:profileId/role/apply',
    delete: '/e/:establishmentId/people/:profileId/role/remove'
  },
  profile: {
    list: '/e/:establishmentId/people',
    view: '/e/:establishmentId/people/:profileId',
    invite: '/e/:establishmentId/people/invite',
    invitations: '/e/:establishmentId/people/invitations',
    permission: '/e/:establishmentId/people/:profileId/permission'
  },
  project: {
    list: '/e/:establishmentId/projects',
    read: '/e/:establishmentId/projects/:projectId',
    import: '/e/:establishmentId/projects/import',
    updateLicenceHolder: {
      update: '/e/:establishmentId/projects/:projectId/update-licence-holder',
      confirm: '/e/:establishmentId/projects/:projectId/update-licence-holder/confirm',
      success: '/e/:establishmentId/projects/:projectId/update-licence-holder/success'
    },
    version: {
      list: '/e/:establishmentId/projects/:projectId/versions',
      read: '/e/:establishmentId/projects/:projectId/versions/:versionId',
      pdf: '/e/:establishmentId/projects/:projectId/versions/:versionId/pdf',
      update: '/e/:establishmentId/projects/:projectId/versions/:versionId/edit',
      submit: '/e/:establishmentId/projects/:projectId/versions/:versionId/edit/submit',
      success: '/e/:establishmentId/projects/:projectId/versions/:versionId/edit/success'
    },
    revoke: {
      base: '/e/:establishmentId/projects/:projectId/revoke',
      confirm: '/e/:establishmentId/projects/:projectId/revoke/confirm',
      success: '/e/:establishmentId/projects/:projectId/revoke/success'
    }
  },
  place: {
    list: '/e/:establishmentId/places',
    create: '/e/:establishmentId/places/create',
    delete: '/e/:establishmentId/places/:placeId/delete',
    update: '/e/:establishmentId/places/:placeId/edit'
  },
  pil: {
    base: '/e/:establishmentId/people/:profileId/pil',
    create: '/e/:establishmentId/people/:profileId/pil/create',
    read: '/e/:establishmentId/people/:profileId/pil/:pilId',
    update: '/e/:establishmentId/people/:profileId/pil/:pilId/edit',
    procedures: '/e/:establishmentId/people/:profileId/pil/:pilId/edit/procedures',
    revoke: {
      base: '/e/:establishmentId/people/:profileId/pil/:pilId/revoke',
      confirm: '/e/:establishmentId/people/:profileId/pil/:pilId/revoke/confirm',
      success: '/e/:establishmentId/people/:profileId/pil/:pilId/revoke/success'
    },
    training: {
      exempt: '/e/:establishmentId/people/:profileId/pil/:pilId/edit/training/exempt',
      certificate: '/e/:establishmentId/people/:profileId/pil/:pilId/edit/training',
      modules: '/e/:establishmentId/people/:profileId/pil/:pilId/edit/training/modules'
    },
    exemptions: {
      exempt: '/e/:establishmentId/people/:profileId/pil/:pilId/edit/exemptions',
      modules: '/e/:establishmentId/people/:profileId/pil/:pilId/edit/exemptions/modules'
    },
    success: '/e/:establishmentId/people/:profileId/pil/:pilId/edit/success'
  },
  task: {
    base: '/tasks',
    read: '/tasks/:taskId',
    confirm: '/tasks/:taskId/confirm',
    success: '/tasks/:taskId/success'
  },
  invitation: '/invitation/:token',
  feedback: '/feedback'
};
