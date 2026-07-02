const assert = require('assert');
const dbHelper = require('../helpers/db');
const {
  assertNormalisedOutput,
  normalise,
  renderExpectedEmail
} = require('../helpers/email-content');
const {
  buildTrainingReminderBody,
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
    debugEmail: false,
    subject: 'Reminder: You needs to complete your NACWO mandatory training',
    html: expectedBody({ fullName: 'Your', roleType: 'nacwo', isApplicant: true }),
    finalEmail: expectedFinalEmail({
      recipientName: 'Basic User',
      fullName: 'Your',
      roleType: 'nacwo',
      isApplicant: true
    })
  },
  {
    roleType: 'nacwo',
    recipientLabel: 'NTCO recipient',
    to: 'ntco@example.com',
    title: 'training-due-reminder NACWO ntco',
    debugEmail: false,
    subject: 'Reminder: Basic User needs to complete their NACWO mandatory training',
    html: expectedBody({ fullName: 'Basic User', roleType: 'nacwo' }),
    finalEmail: expectedFinalEmail({
      recipientName: 'Neil Down',
      fullName: 'Basic User',
      roleType: 'nacwo'
    })
  },
  {
    roleType: 'nvs',
    recipientLabel: 'applicant / trainee (NVS)',
    to: 'basic.user@example.com',
    title: 'training-due-reminder NVS applicant',
    debugEmail: false,
    subject: 'Reminder: You needs to complete your NVS module',
    html: expectedBody({ fullName: 'Your', roleType: 'nvs', isApplicant: true }),
    finalEmail: expectedFinalEmail({
      recipientName: 'Basic User',
      fullName: 'Your',
      roleType: 'nvs',
      isApplicant: true
    })
  },
  {
    roleType: 'nvs',
    recipientLabel: 'NTCO recipient (NVS)',
    to: 'ntco@example.com',
    title: 'training-due-reminder NVS ntco',
    debugEmail: true,
    subject: 'Reminder: Basic User needs to complete their NVS module',
    html: expectedBody({ fullName: 'Basic User', roleType: 'nvs' }),
    finalEmail: expectedFinalEmail({
      recipientName: 'Neil Down',
      fullName: 'Basic User',
      roleType: 'nvs'
    })
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

  const getRenderedNotification = async function ({ task, to, identifier }) {
    await this.emailer(task);

    const notification = await this.schema.Notification.query().findOne({
      identifier,
      to
    });

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
    trainingReminderCases.forEach(({ roleType, recipientLabel, to, title, debugEmail, subject, html, finalEmail }) => {
      it(`renders the reminder email for the ${recipientLabel}`, async function () {
        const identifier = `${basic}-${completeDate}-training-due-reminder`;
        const task = buildTrainingReminderTask({ roleType });
        const { notification, content } = await getRenderedNotification.call(this, {
          task,
          to,
          identifier
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
