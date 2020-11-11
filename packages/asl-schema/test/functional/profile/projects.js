const uuid = require('uuid/v4');
const assert = require('assert');
const db = require('../helpers/db');

const ids = {
  profile: {
    regular: uuid(),
    additional: uuid()
  },
  project: {
    draftAdditional: uuid(),
    grantedAdditional: uuid(),
    regular: uuid()
  },
  version: {
    granted: uuid(),
    draftAdditional: uuid(),
    grantedAdditional: uuid()
  }
};

describe('Profile Projects', () => {

  before(() => {
    this.models = db.init();
  });

  before(() => {
    return Promise.resolve()
      .then(() => db.clean(this.models))
      .then(() => this.models.Establishment.query().insert([
        {
          id: 111,
          name: 'An establishment'
        },
        {
          id: 222,
          name: 'Another establishment'
        }
      ]))
      .then(() => this.models.Profile.query().insert([
        {
          id: ids.profile.regular,
          firstName: 'Project',
          lastName: 'Holder',
          email: 'ph@example.com'
        },
        {
          id: ids.profile.additional,
          firstName: 'Additional',
          lastName: 'Holder',
          email: 'ah@example.com'
        }
      ]))
      .then(() => this.models.Permission.query().insert([
        {
          profileId: ids.profile.regular,
          establishmentId: 111,
          role: 'basic'
        },
        {
          profileId: ids.profile.regular,
          establishmentId: 222,
          role: 'basic'
        },
        {
          profileId: ids.profile.additional,
          establishmentId: 111,
          role: 'basic'
        },
        {
          profileId: ids.profile.additional,
          establishmentId: 222,
          role: 'basic'
        }
      ]).returning('*'))
      .then(() => this.models.Project.query().insertGraph([
        {
          id: ids.project.regular,
          licenceHolderId: ids.profile.regular,
          establishmentId: 111,
          title: 'Ordinary project',
          status: 'active'
        },
        {
          id: ids.project.draftAdditional,
          licenceHolderId: ids.profile.additional,
          establishmentId: 111,
          title: 'Draft additional project',
          status: 'active',
          version: [
            {
              id: ids.version.granted,
              status: 'granted'
            },
            {
              id: ids.version.draftAdditional,
              status: 'draft'
            }
          ]
        },
        {
          id: ids.project.grantedAdditional,
          licenceHolderId: ids.profile.additional,
          establishmentId: 222,
          title: 'Granted additional project',
          status: 'active',
          version: [
            {
              id: ids.version.grantedAdditional,
              status: 'granted'
            }
          ]
        }
      ]))
      .then(() => this.models.ProjectEstablishment.query().insert([
        {
          projectId: ids.project.draftAdditional,
          establishmentId: 222,
          versionId: ids.version.draftAdditional,
          status: 'draft'
        },
        {
          projectId: ids.project.grantedAdditional,
          establishmentId: 111,
          versionId: ids.version.grantedAdditional,
          status: 'active'
        }
      ]));
  });

  after(() => {
    return db.clean(this.models);
  });

  after(() => {
    return this.models.destroy();
  });

  it('shows projects held at the scoped establishment', () => {
    return this.models.Profile.get({ establishmentId: 111, id: ids.profile.regular })
      .then(profile => {
        assert.deepEqual(profile.projects.map(p => p.title), ['Ordinary project']);
      });
  });

  it('does not show projects held other than at the scoped establishment', () => {
    return this.models.Profile.get({ establishmentId: 222, id: ids.profile.regular })
      .then(profile => {
        assert.deepEqual(profile.projects.map(p => p.title), []);
      });
  });

  it('shows projects with additional availability at the scoped establishment', () => {
    return this.models.Profile.get({ establishmentId: 111, id: ids.profile.additional })
      .then(profile => {
        assert.deepEqual(profile.projects.map(p => p.title), [
          'Draft additional project',
          'Granted additional project'
        ]);
      });
  });

  it('does not show projects with draft amendments to add additional availability', () => {
    return this.models.Profile.get({ establishmentId: 222, id: ids.profile.additional })
      .then(profile => {
        assert.deepEqual(profile.projects.map(p => p.title), [
          'Granted additional project'
        ]);
      });
  });

});
