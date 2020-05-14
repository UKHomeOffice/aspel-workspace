const assert = require('assert');
const sinon = require('sinon');
const { NotifyClient } = require('notifications-node-client');

const emailer = require('../lib/emailer');

describe('emailer', () => {
  beforeEach(() => {
    sinon.stub(NotifyClient.prototype, 'sendEmail').resolves();
    this.emailer = emailer({
      email: {
        apiKey: 'abc',
        template: 'def'
      }
    });
  });

  afterEach(() => {
    NotifyClient.prototype.sendEmail.restore();
  });

  it('sends a single email', () => {
    return this.emailer({ to: 'test@example.com' })
      .then(() => {
        assert.ok(NotifyClient.prototype.sendEmail.calledOnce);
        assert.ok(NotifyClient.prototype.sendEmail.calledWith('def', 'test@example.com'));
      });
  });

  it('sends multiple emails', () => {
    return this.emailer({ to: 'test1@example.com,test2@example.com' })
      .then(() => {
        assert.ok(NotifyClient.prototype.sendEmail.calledTwice);
        assert.ok(NotifyClient.prototype.sendEmail.calledWith('def', 'test1@example.com'));
        assert.ok(NotifyClient.prototype.sendEmail.calledWith('def', 'test2@example.com'));
      });
  });
});
