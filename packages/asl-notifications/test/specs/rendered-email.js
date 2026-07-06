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
  buildRoleRemovalTask,
  namedPersonId,
  nomineeEmail,
  publicUrl,
  versions
} = require('../helpers/role-notification-helper');

const establishmentName = 'University of Croydon';
const roleName = 'Home Office liaison contact';

// Test layer: end-to-end rendering through the notification pipeline.
// These tests verify subject, stored HTML and final wrapped email for the
// role-specific dispatcher templates as they are sent to real recipients.
describe('Role notifications - end-to-end rendered emails', () => {
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

  const getRenderedNotification = async function ({ task, to }) {
    await this.emailer(task);

    const notification = await this.schema.Notification.query().findOne({
      identifier: task.req,
      to
    });

    assert(notification, `expected a stored notification row for ${to}`);

    return {
      notification,
      content: normalise(await this.render('custom', notification))
    };
  };

  const assertEmail = ({ notification, content, subject, html, finalEmail, debugEmail = false, title }) => {
    logEmailComparison({
      enabled: debugEmail,
      title,
      actual: content,
      expected: finalEmail
    });

    assert.equal(notification.subject, subject);
    assert.equal(normalise(notification.html), normalise(html));
    assert.equal(content, finalEmail);
  };

  describe('Dispatcher role-* templates via the notification pipeline', () => {
    it('renders role-removed for the establishment recipient', async function () {
      const debugEmail = false;
      const task = buildRoleRemovalTask({ roleType: 'holc', outcome: 'granted' });
      const { notification, content } = await getRenderedNotification.call(this, {
        task,
        to: 'vice-chancellor@example.com'
      });

      const expectedHtml = `Named Person has been removed from the role of ${roleName}. This is a PEL amendment.

Establishment name: ${establishmentName}

You can see more details about this task by visiting ${publicTaskUrl(publicUrl, task.id)}`;
      const finalEmail = renderExpectedEmail({
        recipientName: 'Bruce Banner',
        body: expectedHtml
      });

      assertEmail({
        notification,
        content,
        subject: `Named Person has been removed from the role of ${roleName}`,
        html: expectedHtml,
        finalEmail,
        debugEmail,
        title: 'role-removed establishment recipient'
      });
    });

    it('renders role-removed-subject for the named person recipient', async function () {
      const debugEmail = false;
      const task = buildRoleRemovalTask({ roleType: 'holc', outcome: 'granted' });
      const { notification, content } = await getRenderedNotification.call(this, {
        task,
        to: nomineeEmail
      });

      const expectedHtml = `Named Person has been removed from the role of ${roleName}. This is a PEL amendment.

Establishment name: ${establishmentName}`;
      const finalEmail = renderExpectedEmail({
        recipientName: 'Named Person',
        body: expectedHtml
      });

      assertEmail({
        notification,
        content,
        subject: `Named Person has been removed from the role of ${roleName}`,
        html: expectedHtml,
        finalEmail,
        debugEmail,
        title: 'role-removed-subject named person'
      });
    });

    it('renders role-removed-returned for the establishment recipient', async function () {
      const debugEmail = false;
      const task = buildRoleRemovalTask({ roleType: 'holc', outcome: 'returned' });
      const { notification, content } = await getRenderedNotification.call(this, {
        task,
        to: 'vice-chancellor@example.com'
      });

      const expectedHtml = `The request for Named Person to be removed from the role of ${roleName} has been returned.

Establishment name: ${establishmentName}

You can see more details about this task by visiting ${publicTaskUrl(publicUrl, task.id)}`;
      const finalEmail = renderExpectedEmail({
        recipientName: 'Bruce Banner',
        body: expectedHtml
      });

      assertEmail({
        notification,
        content,
        subject: `The request to remove Named Person's ${roleName} role has been returned`,
        html: expectedHtml,
        finalEmail,
        debugEmail,
        title: 'role-removed-returned establishment recipient'
      });
    });

    it('renders role-removed-refused for the establishment recipient', async function () {
      const debugEmail = false;
      const task = buildRoleRemovalTask({ roleType: 'holc', outcome: 'refused' });
      const { notification, content } = await getRenderedNotification.call(this, {
        task,
        to: 'vice-chancellor@example.com'
      });

      const expectedHtml = `The request for Named Person's to be removed from the role of  ${roleName} has been refused.

Establishment name: ${establishmentName}

You can see more details about this task by visiting ${publicTaskUrl(publicUrl, task.id)}`;
      const finalEmail = renderExpectedEmail({
        recipientName: 'Bruce Banner',
        body: expectedHtml
      });

      assertEmail({
        notification,
        content,
        subject: `The request to remove Named Person's ${roleName} role has been refused`,
        html: expectedHtml,
        finalEmail,
        debugEmail,
        title: 'role-removed-refused establishment recipient'
      });
    });

    it('renders role-approved-subject for the named person recipient', async function () {
      const debugEmail = false;
      const task = buildRoleApplicationTask({
        roleType: 'holc',
        outcome: 'granted',
        roleVersion: versions.role.NAMED_PERSON_VERSION_ID
      });
      const { notification, content } = await getRenderedNotification.call(this, {
        task,
        to: nomineeEmail
      });

      const expectedHtml = `The ${roleName} role application for Named Person has been approved. This is a PEL amendment.

Establishment name: ${establishmentName}`;
      const finalEmail = renderExpectedEmail({
        recipientName: 'Named Person',
        body: expectedHtml
      });

      assertEmail({
        notification,
        content,
        subject: `The ${roleName} role application for Named Person has been approved`,
        html: expectedHtml,
        finalEmail,
        debugEmail,
        title: 'role-approved-subject named person'
      });
    });
  });
});
