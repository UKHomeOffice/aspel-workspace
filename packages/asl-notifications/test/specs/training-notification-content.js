const assert = require('assert');
const dbHelper = require('../helpers/db');
const {
  assertNormalisedOutput,
  normalise,
  renderExpectedEmail
} = require('../helpers/email-content');
const {
  buildTrainingReminderBody,
  buildTrainingReminderSubject,
  completeDate,
  establishmentName
} = require('../helpers/training-reminder');
const logger = require('../helpers/logger');
const Emailer = require('../../lib/emailer');
const Renderer = require('../../../asl-emailer/lib/renderer');
const { basic } = require('../helpers/users');

const publicUrl = 'http://localhost:8080';

// Developer note:
// Set debugEmail to true on an individual test when you want to print the
// actual and expected training reminder email for that case only.

const buildTrainingReminderTask = ({ roleType = 'nacwo' } = {}) => ({
  id: `training-due-reminder-${roleType}`,
  event: 'direct-notification',
  req: `req-training-due-reminder-${roleType}`,
  data: {
    id: `training-role-${roleType}`,
    model: 'role',
    action: 'training-due-reminder',
    status: 'training-due-reminder',
    establishmentId: 8201,
    changedBy: basic,
    data: {
      type: roleType,
      firstName: 'Basic',
      lastName: 'User',
      name: establishmentName,
      completeDate
    }
  }
});

const expectedBody = ({ fullName, roleType, isApplicant = false }) => normalise(buildTrainingReminderBody({ fullName, roleType, isApplicant }));

const expectedFinalEmail = ({ recipientName, fullName, roleType, isApplicant = false }) => renderExpectedEmail({
  recipientName,
  body: expectedBody({ fullName, roleType, isApplicant })
});

const trainingReminderIdentifier = `${basic}-${completeDate}-training-due-reminder`;

/**
 *     debugEmail: false | true
 *     verbose - print the content of the email due to be sent.
 * */
const trainingReminderCases = [
  {
    roleType: 'nacwo',
    recipientLabel: 'applicant / trainee',
    to: 'basic.user@example.com',
    title: 'training-due-reminder NACWO applicant',
    fullName: 'Your',
    isApplicant: true,
    debugEmail: false
  },
  {
    roleType: 'nacwo',
    recipientLabel: 'PELh / admin recipient',
    to: 'vice-chancellor@example.com',
    title: 'training-due-reminder NACWO pelh-admin',
    fullName: 'Basic User',
    debugEmail: false
  },
  {
    roleType: 'nacwo',
    recipientLabel: 'NTCO recipient',
    to: 'ntco@example.com',
    title: 'training-due-reminder NACWO ntco',
    fullName: 'Basic User',
    debugEmail: false
  },
  {
    roleType: 'nvs',
    recipientLabel: 'applicant / trainee (NVS)',
    to: 'basic.user@example.com',
    title: 'training-due-reminder NVS applicant',
    fullName: 'Your',
    isApplicant: true,
    debugEmail: false
  },
  {
    roleType: 'nvs',
    recipientLabel: 'PELh / admin recipient (NVS)',
    to: 'vice-chancellor@example.com',
    title: 'training-due-reminder NVS pelh-admin',
    fullName: 'Basic User',
    debugEmail: false
  },
  {
    roleType: 'nvs',
    recipientLabel: 'NTCO recipient (NVS)',
    to: 'ntco@example.com',
    title: 'training-due-reminder NVS ntco',
    fullName: 'Basic User',
    debugEmail: false
  }
];

// Test layer: end-to-end training reminder content through the notification pipeline.
describe('Training notifications - end-to-end rendered emails', () => {
  before(function () {
    this.schema = dbHelper.init();
    this.emailer = Emailer({ publicUrl, schema: this.schema, logger });
    this.render = Renderer();
  });

  beforeEach(function () {
    return dbHelper.reset(this.schema)
      .then(() => dbHelper.loadFixtures(this.schema));
  });

  after(function () {
    return this.schema.destroy();
  });

  const sendTaskAndGetNotifications = async function (task, identifier = trainingReminderIdentifier) {
    await this.emailer(task);
    return this.schema.Notification.query().where({ identifier }).orderBy('to');
  };

  const getRenderedNotification = async function ({ task, to, identifier }) {
    const notifications = await sendTaskAndGetNotifications.call(this, task, identifier);
    const notification = notifications.find(row => row.to === to);

    assert(notification, `expected a stored notification row for ${to}`);

    return {
      notification,
      content: normalise(await this.render('custom', notification))
    };
  };

  const assertEmail = ({ notification, content, subject, html, finalEmail, debugEmail = false, title }) => {
    assert.equal(notification.subject, subject);
    assertNormalisedOutput({
      actual: notification.html,
      expected: html,
      debugEmail,
      title: `${title} stored html`
    });
    assertNormalisedOutput({
      actual: content,
      expected: finalEmail,
      debugEmail,
      title
    });
  };

  describe('training-due-reminder via the notification pipeline', () => {
    it('sends NACWO reminders to applicant, PELh/admin, admin and NTCO recipients', async function () {
      const task = buildTrainingReminderTask({ roleType: 'nacwo' });
      const notifications = await sendTaskAndGetNotifications.call(this, task);

      assert.deepEqual(notifications.map(row => row.to).sort(), [
        'basic.user@example.com',
        'croydon.admin@example.com',
        'ntco@example.com',
        'vice-chancellor@example.com'
      ]);
    });

    it('sends NVS reminders to applicant, PELh/admin, admin and NTCO recipients', async function () {
      const task = buildTrainingReminderTask({ roleType: 'nvs' });
      const notifications = await sendTaskAndGetNotifications.call(this, task);

      assert.deepEqual(notifications.map(row => row.to).sort(), [
        'basic.user@example.com',
        'croydon.admin@example.com',
        'ntco@example.com',
        'vice-chancellor@example.com'
      ]);
    });

    trainingReminderCases.forEach(({ roleType, recipientLabel, to, title, debugEmail, fullName, isApplicant = false }) => {
      it(`renders the reminder email for the ${recipientLabel}`, async function () {
        const task = buildTrainingReminderTask({ roleType });
        const { notification, content } = await getRenderedNotification.call(this, {
          task,
          to,
          identifier: trainingReminderIdentifier
        });

        const subject = buildTrainingReminderSubject({ fullName, roleType, isApplicant });
        const html = expectedBody({ fullName, roleType, isApplicant });
        const finalEmail = expectedFinalEmail({
          recipientName: notification.name,
          fullName,
          roleType,
          isApplicant
        });

        assertEmail({
          notification,
          content,
          subject,
          html,
          finalEmail,
          debugEmail,
          title
        });
      });
    });
  });
});
