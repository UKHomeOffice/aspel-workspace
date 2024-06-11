import moment from 'moment';
import fetch from 'r2';
import { stringify } from 'querystring';

const RECENT_EMAIL_MAX_SECONDS = 2;

function flushEmails(browser) {
  return browser.call(() => {
    return fetch(`${process.env.EMAILER_SERVICE}/flush`).response;
  });
}

function getRecentEmails(browser, maxAge = moment().subtract(RECENT_EMAIL_MAX_SECONDS, 'seconds')) {
  return browser.call(() => {
    return fetch(`${process.env.EMAILER_SERVICE}/requests`).response
      .then(res => res.json())
      .then(emails => emails.filter(email => {
        return moment(email.timestamp).isAfter(maxAge);
      }));
  });
}

function getNotifications(browser, field, value) {
  return browser.call(() => {
    const query = stringify({ field, value });
    return fetch(`${process.env.EMAILER_SERVICE}/notifications?${query}`).response
      .then(res => res.json());
  });
}

async function getRecentEmailsFor(browser, user, type, maxAge) {
  const emails = await getRecentEmails(browser, maxAge);
  return emails.filter(email => {
    return email.body.to === user && (!type || email.path.match(type));
  });
}

async function usersWereNotified(browser, users, subjectType) {
  const emails = await getNotifications(browser, 'to', users);
  const subjects = {
    'task-action': 'Action required',
    'task-change': 'Status change',
    'task-outgoing': 'Status change'
  };
  return users.every(expected => {
    return emails.some(email => {
      if (email.to !== expected) {
        return false;
      }
      if (subjectType && !email.subject.includes(subjects[subjectType])) {
        return false;
      }
      return true;
    });
  });
}

async function findInPagination(selector, nextPageSelector = 'a.pagination-link.next') {
  while (!await browser.$(selector).isExisting()) {
    await browser.$(nextPageSelector).click();
  }
}

export {
  flushEmails,
  getRecentEmails,
  getRecentEmailsFor,
  usersWereNotified,
  findInPagination
};
