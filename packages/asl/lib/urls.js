module.exports = {
  dashboard: '/',
  account: {
    menu: '/account',
    edit: '/account/edit'
  },
  establishment: {
    dashboard: '/e/:establishmentId',
    read: '/e/:establishmentId/details',
    update: {
      base: '/e/:establishmentId/details/edit',
      confirm: '/e/:establishmentId/details/edit/confirm',
      success: '/e/:establishmentId/details/edit/success'
    }
  },
  profile: {
    list: '/e/:establishmentId/people',
    view: '/e/:establishmentId/people/:profileId',
    invite: '/e/:establishmentId/people/invite',
    invitations: '/e/:establishmentId/people/invitations',
    permission: '/e/:establishmentId/people/:profileId/permission',
    role: {
      apply: {
        base: '/e/:establishmentId/people/:profileId/role/apply',
        confirm: '/e/:establishmentId/people/:profileId/role/apply/confirm',
        success: '/e/:establishmentId/people/:profileId/role/apply/success'
      },
      remove: {
        base: '/e/:establishmentId/people/:profileId/role/remove',
        confirm: '/e/:establishmentId/people/:profileId/role/remove/confirm',
        success: '/e/:establishmentId/people/:profileId/role/remove/success'
      }
    }
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
    create: {
      new: '/e/:establishmentId/places/create',
      confirm: '/e/:establishmentId/places/create/confirm',
      success: '/e/:establishmentId/places/create/success'
    },
    delete: {
      confirm: '/e/:establishmentId/places/:placeId/delete/confirm',
      success: '/e/:establishmentId/places/:placeId/delete/success'
    },
    update: '/e/:establishmentId/places/:placeId/edit/'
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
