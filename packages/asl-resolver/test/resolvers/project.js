const assert = require('assert');
const moment = require('moment');
const { project } = require('../../lib/resolvers');
const db = require('../helpers/db');

const profileId = 'f0835b01-00a0-4c7f-954c-13ed2ef7efd9';
const projectId = '1da9b8b7-b12b-49f3-98be-745d286949a7';
const projectId2 = 'd01588c4-cdca-461f-95de-f2bc2b95c9b0';

const establishmentId = 8201;

describe('Project resolver', () => {

  before(() => {
    this.models = db.init();
    this.project = project({ models: this.models });
  });

  beforeEach(() => {
    return db.clean(this.models)
      .then(() => this.models.Establishment.query().insert({
        id: 8201,
        name: 'Univerty of Croydon'
      }))
      .then(() => this.models.Profile.query().insert({
        id: profileId,
        userId: 'abc123',
        title: 'Dr',
        firstName: 'Linford',
        lastName: 'Christie',
        address: '1 Some Road',
        postcode: 'A1 1AA',
        email: 'test1@example.com',
        telephone: '01234567890'
      }));
  });

  afterEach(() => db.clean(this.models));

  after(() => this.models.destroy());

  describe('delete amendments', () => {
    beforeEach(() => {
      return Promise.resolve()
        .then(() => this.models.Project.query().insert([
          {
            id: projectId,
            status: 'active',
            title: 'Hypoxy and angiogenesis in cancer therapy',
            issueDate: new Date('2019-07-11').toISOString(),
            expiryDate: new Date('2022-07-11').toISOString(),
            licenceNumber: 'PP-627808',
            establishmentId: 8201,
            licenceHolderId: profileId
          }
        ]))
        .then(() => this.models.ProjectVersion.query().insert([
          {
            id: '8fb05730-f2ec-4d8f-8085-bbdc86937c54',
            projectId,
            data: {},
            status: 'draft',
            createdAt: new Date('2019-07-04').toISOString()
          },
          {
            id: '68d79bb1-3573-4402-ac08-7ac27dcbb39e',
            projectId,
            data: {},
            status: 'submitted',
            createdAt: new Date('2019-07-03').toISOString()
          },
          {
            id: 'ee871d64-cc87-470a-82d9-4a326c9c08dc',
            projectId,
            data: {},
            status: 'draft',
            createdAt: new Date('2019-07-02').toISOString()
          },
          {
            id: '574266e5-ef34-4e34-bf75-7b6201357e75',
            projectId,
            data: {},
            status: 'granted',
            createdAt: new Date('2019-07-01').toISOString()
          },
          {
            id: 'b497b05a-f1e0-4596-8b02-60e129e2ab49',
            projectId,
            data: {},
            status: 'submitted',
            createdAt: new Date('2019-06-04').toISOString()
          },
          {
            id: '71e25eca-e0aa-4555-b09b-62f55b83e890',
            projectId,
            data: {},
            status: 'granted',
            createdAt: new Date('2019-06-03').toISOString()
          }
        ]));
    });

    it('only soft deletes versions since the most recent granted version', () => {
      const opts = {
        action: 'delete-amendments',
        id: projectId
      };
      return Promise.resolve()
        .then(() => this.project(opts))
        .then(() => this.models.ProjectVersion.queryWithDeleted())
        .then(versions => {
          versions.map(version => {
            if ([
              '8fb05730-f2ec-4d8f-8085-bbdc86937c54',
              '68d79bb1-3573-4402-ac08-7ac27dcbb39e',
              'ee871d64-cc87-470a-82d9-4a326c9c08dc'
            ].includes(version.id)) {
              assert(version.deleted);
              assert(moment(version.deleted).isValid(), 'version was soft deleted');
            }

            if ([
              '574266e5-ef34-4e34-bf75-7b6201357e75',
              'b497b05a-f1e0-4596-8b02-60e129e2ab49',
              '71e25eca-e0aa-4555-b09b-62f55b83e890'
            ].includes(version.id)) {
              assert(!version.deleted, 'version was not deleted');
            }
          });
        });
    });
  });

  describe('grant', () => {
    beforeEach(() => {
      return Promise.resolve()
        .then(() => this.models.Project.query().insert([
          {
            id: projectId,
            status: 'inactive',
            title: 'New project',
            establishmentId: 8201,
            licenceHolderId: profileId
          },
          {
            id: projectId2,
            status: 'active',
            title: 'Active project to be updated',
            issueDate: new Date('2019-07-11').toISOString(),
            expiryDate: new Date('2022-07-11').toISOString(),
            establishmentId: 8201,
            licenceHolderId: profileId
          }
        ]));
    });

    it('grants a new project updating the issue date, expiry date, title, and status', () => {
      const opts = {
        action: 'grant',
        id: projectId
      };
      const version = {
        projectId,
        status: 'submitted',
        data: {
          title: 'title of the newly granted project'
        }
      };
      return Promise.resolve()
        .then(() => this.models.ProjectVersion.query().insert(version))
        .then(() => this.project(opts))
        .then(() => this.models.Project.query().findById(projectId))
        .then(project => {
          const expiryDate = moment(project.issueDate).add({ years: 5, months: 0 }).toISOString();
          assert.ok(project.licenceNumber, 'licence number was not generated');
          assert.equal(project.expiryDate, expiryDate, 'expiry date was not set to default 5 years');
          assert.equal(project.title, version.data.title, 'title was not updated');
          assert.equal(project.status, 'active', 'project was not activated');

          return this.models.ProjectVersion.query().findOne({ projectId, status: 'granted' })
            .then(version => {
              assert.ok(version, 'project version status not updated to granted');
            });
        });
    });

    it('grants a new project updating the expiry date based on duration', () => {
      const opts = {
        action: 'grant',
        id: projectId
      };
      const version = {
        projectId,
        status: 'submitted',
        data: {
          title: 'title of the newly granted project',
          duration: {
            years: 3,
            months: 3
          }
        }
      };
      return Promise.resolve()
        .then(() => this.models.ProjectVersion.query().insert(version))
        .then(() => this.project(opts))
        .then(() => this.models.Project.query().findById(projectId))
        .then(project => {
          const expiryDate = moment(project.issueDate).add(version.data.duration).toISOString();
          assert.equal(project.expiryDate, expiryDate, 'expiry date was not set from duration');
        });
    });

    it('allows a maximum of 5 years from issue date', () => {
      const opts = {
        action: 'grant',
        id: projectId
      };
      const version = {
        projectId,
        status: 'submitted',
        data: {
          title: 'title of the newly granted project',
          duration: {
            years: 7,
            months: 6
          }
        }
      };
      return Promise.resolve()
        .then(() => this.models.ProjectVersion.query().insert(version))
        .then(() => this.project(opts))
        .then(() => this.models.Project.query().findById(projectId))
        .then(project => {
          const expiryDate = moment(project.issueDate).add({ years: 5, months: 0 }).toISOString();
          assert.equal(project.expiryDate, expiryDate, 'maximum duration of 5 years not honoured');
        });
    });

    it('Updates active project ignoring expiry as not changed since granted', () => {
      const opts = {
        action: 'grant',
        id: projectId2
      };
      const versions = [
        {
          projectId: projectId2,
          status: 'granted',
          data: {
            title: 'New title for updated project',
            duration: {
              years: 5,
              months: 0
            }
          }
        },
        {
          projectId: projectId2,
          status: 'submitted',
          data: {
            duration: {
              years: 5,
              months: 0
            }
          }
        }
      ];
      return Promise.resolve()
        .then(() => this.models.ProjectVersion.query().insert(versions))
        .then(() => this.models.Project.query().findById(projectId2))
        .then(previous => {
          return Promise.resolve()
            .then(() => this.project(opts))
            .then(() => this.models.Project.query().findById(projectId2))
            .then(project => {
              assert.equal(project.expiryDate, previous.expiryDate, 'Expiry date was updated');
            });
        });
    });

    it('Updates expiry date if duration changed', () => {
      const opts = {
        action: 'grant',
        id: projectId2
      };
      const versions = [
        {
          projectId: projectId2,
          status: 'granted',
          data: {
            title: 'New title for updated project',
            duration: {
              years: 3,
              months: 0
            }
          }
        },
        {
          projectId: projectId2,
          status: 'submitted',
          data: {
            duration: {
              years: 5,
              months: 0
            }
          }
        }
      ];
      return Promise.resolve()
        .then(() => this.models.ProjectVersion.query().insert(versions))
        .then(() => this.models.Project.query().findById(projectId2))
        .then(previous => {
          return Promise.resolve()
            .then(() => this.project(opts))
            .then(() => this.models.Project.query().findById(projectId2))
            .then(project => {
              const expiryDate = moment(previous.issueDate).add(versions[1].data.duration).toISOString();
              assert.equal(project.expiryDate, expiryDate, 'Expiry date not updated');
            });
        });
    });
  });

  describe('create', () => {
    it('creates a new project with an empty project version if called without a version param', () => {
      const opts = {
        action: 'create',
        data: {
          establishmentId,
          licenceHolderId: profileId
        }
      };
      return Promise.resolve()
        .then(() => this.project(opts))
        .then(() => this.models.Project.query())
        .then(projects => {
          assert.equal(projects.length, 1, '1 project exists in table');
          return this.models.ProjectVersion.query().where({ projectId: projects[0].id })
            .then(versions => {
              assert(versions.length === 1, 'version not added');
              assert.deepEqual(versions[0].data, null, 'empty version not added');
            });
        });
    });

    it('creates a new project and passes version data to a new version', () => {
      const data = {
        a: 1,
        b: 2,
        c: null,
        d: false,
        e: true,
        title: 'This is the title'
      };

      const opts = {
        action: 'create',
        data: {
          establishmentId,
          licenceHolderId: profileId,
          version: {
            data
          }
        }
      };
      return Promise.resolve()
        .then(() => this.project(opts))
        .then(() => this.models.Project.query())
        .then(projects => {
          assert(projects.length === 1, 'project not added');
          assert.equal(projects[0].title, data.title, 'title not added to project');
          return this.models.ProjectVersion.query().where({ projectId: projects[0].id })
            .then(versions => {
              assert(versions.length === 1, 'version not added');
              assert.deepEqual(versions[0].data, data, 'data not added to version');
            });
        });
    });
  });

});
