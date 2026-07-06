const assert = require('assert');
const dbHelper = require('../helpers/db');
const {
  logEmailComparison,
  normalise,
  publicTaskUrl,
  renderExpectedEmail
} = require('../helpers/email-content');
const logger = require('../helpers/logger');
const Emailer = require('../../lib/emailer');
const Renderer = require('../../../asl-emailer/lib/renderer');
const {
  buildRoleApplicationTask,
  namedPersonId,
  nomineeEmail,
  publicUrl,
  versions
} = require('../helpers/role-notification-helper');

const viceChancellorEmail = 'vice-chancellor@example.com';
const establishmentName = 'University of Croydon';
const roleName = 'Home Office liaison contact';
const finalEmail = ({ taskId, status, includeStatusLine = false, includeAwaitingDecision = false }) => {
  const statusLine = includeStatusLine ? ' This is a PEL amendment.' : '';
  const body = [
    `The ${roleName} role application for Named Person has been ${status}.${statusLine}`,
    `Establishment name: ${establishmentName}`,
    includeAwaitingDecision ? 'Status: Awaiting decision' : null,
    `You can see more details about this task by visiting ${publicTaskUrl(publicUrl, taskId)}`
  ].filter(Boolean).join('\n\n');

  return renderExpectedEmail({
    recipientName: 'Bruce Banner',
    body
  });
};

const subjectLine = status => `The ${roleName} role application for Named Person has been ${status}`;

/**
 *     debugEmail: false | true
 *     verbose - print the content of the email due to be sent.
 * */
const namedPersonMvpOutcomes = [
  {
    outcome: 'submitted',
    status: 'submitted',
    includeStatusLine: true,
    includeAwaitingDecision: true,
    debugEmail: false
  },
  {
    outcome: 'returned',
    status: 'returned',
    debugEmail: false
  },
  {
    outcome: 'rejected',
    status: 'rejected',
    debugEmail: false
  },
  {
    outcome: 'refused',
    status: 'refused',
    debugEmail: false
  },
  {
    outcome: 'granted',
    status: 'approved',
    includeStatusLine: true,
    debugEmail: false
  }
];

// Test layer: end-to-end notification content for the establishment recipient.
// This suite verifies subject + final rendered email for named-person MVP role
// application outcomes sent to the vice chancellor / establishment contact.
describe('Role notifications - establishment recipient content', () => {

  before(function () {
    this.schema = dbHelper.init();
    this.emailer = Emailer({ publicUrl, schema: this.schema, logger });
    this.render = Renderer();
  });

  beforeEach(function () {
    return dbHelper.reset(this.schema)
      .then(() => dbHelper.loadFixtures(this.schema))
      .then(() => this.schema.Profile.query().insert({
        id: namedPersonId,
        title: 'Dr',
        firstName: 'Named',
        lastName: 'Person',
        dob: '1970-04-23',
        email: nomineeEmail
      }));
  });

  after(function () {
    return this.schema.destroy();
  });

  const sendTaskAndGetNotifications = async function (task, identifier = task.req) {
    await this.emailer(task);
    return this.schema.Notification.query().where({ identifier }).orderBy('to');
  };

  const getRenderedNotification = async function (task, to = viceChancellorEmail) {
    const notifications = await sendTaskAndGetNotifications.call(this, task);
    const notification = notifications.find(row => row.to === to);

    assert(notification, `expected a notification for ${to}`);

    return {
      notification,
      content: normalise(await this.render('custom', notification))
    };
  };

  describe('Named person MVP role applications - final rendered emails', () => {
    namedPersonMvpOutcomes.forEach(({ outcome, status, includeStatusLine, includeAwaitingDecision, debugEmail }) => {
      it(`renders the establishment recipient email when the application is ${outcome}`, async function () {
        const task = buildRoleApplicationTask({
          roleType: 'holc',
          outcome,
          roleVersion: versions.role.NAMED_PERSON_VERSION_ID
        });

        const { notification, content } = await getRenderedNotification.call(this, task);

        const finalExpected = finalEmail({
          taskId: task.id,
          status,
          includeStatusLine,
          includeAwaitingDecision
        });

        logEmailComparison({
          enabled: debugEmail,
          title: `${outcome} named-person-mvp role application`,
          actual: content,
          expected: finalExpected
        });

        assert.equal(notification.subject, subjectLine(status));
        assert.equal(content, finalExpected);
      });
    });

    it('does not send an establishment recipient email when the application is recalled', async function () {
      const task = buildRoleApplicationTask({
        roleType: 'holc',
        outcome: 'recalled',
        roleVersion: versions.role.NAMED_PERSON_VERSION_ID
      });
      const notifications = await sendTaskAndGetNotifications.call(this, task);

      assert.deepEqual(notifications, []);
    });
  });
});
