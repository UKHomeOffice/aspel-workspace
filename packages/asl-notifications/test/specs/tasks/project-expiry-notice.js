const uuid = require('uuid');
const sinon = require('sinon');
const moment = require('moment');
const assert = require('assert');
const dbHelper = require('../../helpers/db');
const logger = require('../../helpers/logger');
const expiryNotice = require('../../../tasks/project-expiry-notice');
const { basic } = require('../../helpers/users');

const publicUrl = 'http://localhost:8080';

describe('Project expiry', () => {

  before(() => {
    this.schema = dbHelper.init();
  });

  beforeEach(() => {
    this.sendEmail = sinon.stub();
    return dbHelper.reset()
      .then(() => dbHelper.loadFixtures(this.schema));
  });

  after(() => {
    return this.schema.destroy();
  });

  it('adds 12 month notification for a project due to expire in 12 months', () => {
    const project = {
      licenceHolderId: basic,
      expiryDate: moment().add(1, 'year').toISOString(),
      status: 'active',
      establishmentId: 8201,
      licenceNumber: 'XYZ12345'
    };

    return Promise.resolve()
      .then(() => this.schema.Project.query().insert(project))
      .then(() => expiryNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        const expected = [
          'basic.user@example.com',
          'vice-chancellor@example.com',
          'croydon.admin@example.com'
        ];
        const expectedSubject = `Reminder: Project licence ${project.licenceNumber} expires in 12 months`;

        assert.equal(notifications.length, 3);
        assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
        notifications.forEach(notification => {
          assert.equal(notification.subject, expectedSubject);
        });
      });
  });

  it('adds 6 month notification for a project due to expire in 6 months', () => {
    const project = {
      licenceHolderId: basic,
      expiryDate: moment().add(6, 'months').toISOString(),
      status: 'active',
      establishmentId: 8201,
      licenceNumber: 'XYZ12345'
    };

    return Promise.resolve()
      .then(() => this.schema.Project.query().insert(project))
      .then(() => expiryNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        const expected = [
          'basic.user@example.com',
          'vice-chancellor@example.com',
          'croydon.admin@example.com'
        ];
        const expectedSubject = `Reminder: Project licence ${project.licenceNumber} expires in 6 months`;

        assert.equal(notifications.length, 3);
        assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
        notifications.forEach(notification => {
          assert.equal(notification.subject, expectedSubject);
        });
      });
  });

  it('adds 3 month notification for a project due to expire in 3 months', () => {
    const project = {
      licenceHolderId: basic,
      expiryDate: moment().add(3, 'months').toISOString(),
      status: 'active',
      establishmentId: 8201,
      licenceNumber: 'XYZ12345'
    };

    return Promise.resolve()
      .then(() => this.schema.Project.query().insert(project))
      .then(() => expiryNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        const expected = [
          'basic.user@example.com',
          'vice-chancellor@example.com',
          'croydon.admin@example.com'
        ];
        const expectedSubject = `Reminder: Project licence ${project.licenceNumber} expires in 3 months`;

        assert.equal(notifications.length, 3);
        assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
        notifications.forEach(notification => {
          assert.equal(notification.subject, expectedSubject);
        });
      });
  });

  it('adds an expiry notification for a project that has expired in the last month', () => {
    const project = {
      licenceHolderId: basic,
      expiryDate: moment().toISOString(),
      status: 'expired',
      establishmentId: 8201,
      licenceNumber: 'XYZ12345'
    };

    return Promise.resolve()
      .then(() => this.schema.Project.query().insert(project))
      .then(() => expiryNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        const expected = [
          'basic.user@example.com',
          'vice-chancellor@example.com',
          'croydon.admin@example.com'
        ];
        const expectedSubject = `Important: project licence ${project.licenceNumber} has expired - action required`;

        assert.equal(notifications.length, 3);
        assert.deepEqual(notifications.map(n => n.to).sort(), expected.sort());
        notifications.forEach(notification => {
          assert.equal(notification.subject, expectedSubject);
        });
      });
  });

  it('doesn\'t add an expiry notification for a project that has expired over a month ago', () => {
    const project = {
      licenceHolderId: basic,
      expiryDate: moment().subtract(5, 'weeks').toISOString(),
      status: 'expired',
      establishmentId: 8201,
      licenceNumber: 'XYZ12345'
    };

    return Promise.resolve()
      .then(() => this.schema.Project.query().insert(project))
      .then(() => expiryNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        assert.equal(notifications.length, 0);
      });
  });

  it('adds expiry notifications for all projects due to expire, ignoring ones already added', () => {
    const ids = {
      notExpired: uuid(),
      expiringIn12Months: uuid(),
      expiringIn6Months: uuid(),
      expiringIn3Months: uuid(),
      expired: uuid(),
      alreadyNotified: uuid()
    };
    const projects = [
      {
        id: ids.notExpired,
        licenceHolderId: basic,
        expiryDate: moment().add(13, 'months').toISOString(),
        status: 'active',
        establishmentId: 8201,
        licenceNumber: 'XYZ12345'
      },
      {
        id: ids.expiringIn12Months,
        licenceHolderId: basic,
        expiryDate: moment().add(12, 'months').toISOString(),
        status: 'active',
        establishmentId: 8201,
        licenceNumber: 'XYZ12346'
      },
      {
        id: ids.expiringIn6Months,
        licenceHolderId: basic,
        expiryDate: moment().add(6, 'months').toISOString(),
        status: 'active',
        establishmentId: 8201,
        licenceNumber: 'XYZ12347'
      },
      {
        id: ids.expiringIn3Months,
        licenceHolderId: basic,
        expiryDate: moment().add(3, 'months').toISOString(),
        status: 'active',
        establishmentId: 8201,
        licenceNumber: 'XYZ12348'
      },
      {
        id: ids.expired,
        licenceHolderId: basic,
        expiryDate: moment().toISOString(),
        status: 'expired',
        establishmentId: 8201,
        licenceNumber: 'XYZ12349'
      }
    ];

    const alreadyNotified = {
      id: ids.alreadyNotified,
      licenceHolderId: basic,
      expiryDate: moment().add(6, 'months').toISOString(),
      status: 'active',
      establishmentId: 8201,
      licenceNumber: 'XYZ12340'
    };

    return Promise.resolve()
      .then(() => this.schema.Project.query().insert(alreadyNotified))
      .then(() => expiryNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        assert.equal(notifications.length, 3);
      })
      .then(() => this.schema.Project.query().insert(projects))
      .then(() => expiryNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query())
      .then(notifications => {
        assert.equal(notifications.length, 15);
        const ra = new RegExp(ids.notExpired);
        assert.ok(!notifications.find(n => n.identifier.match(ra)), 'No notification expected');
      })
      .then(() => this.schema.Notification.query().where({ identifier: `${ids.alreadyNotified}-project-expiring-6` }))
      .then(notifications => {
        assert.equal(notifications.length, 3, 'Expected only one set of notifications to be added');
      })
      .then(() => this.schema.Notification.query().where({ identifier: `${ids.expiringIn12Months}-project-expiring-12` }))
      .then(notifications => {
        assert.equal(notifications.length, 3, 'Expected 12 month notice to be sent');
      })
      .then(() => this.schema.Notification.query().where({ identifier: `${ids.expiringIn6Months}-project-expiring-6` }))
      .then(notifications => {
        assert.equal(notifications.length, 3, 'Expected 6 month notice to be sent');
      })
      .then(() => this.schema.Notification.query().where({ identifier: `${ids.expiringIn3Months}-project-expiring-3` }))
      .then(notifications => {
        assert.equal(notifications.length, 3, 'Expected 3 month notice to be sent');
      })
      .then(() => this.schema.Notification.query().where({ identifier: `${ids.expired}-project-expired` }))
      .then(notifications => {
        assert.equal(notifications.length, 3, 'Expected expiry notice to be sent');
      })
      .then(() => this.schema.Project.query().findById(ids.expiringIn12Months).patch({ expiryDate: moment().add(6, 'months').toISOString() }))
      .then(() => expiryNotice({ schema: this.schema, logger, publicUrl }))
      .then(() => this.schema.Notification.query().where('identifier', `${ids.expiringIn12Months}-project-expiring-6`))
      .then(notifications => {
        assert.equal(notifications.length, 3, 'expected 6 month expiry to be added');
      });
  });

});
