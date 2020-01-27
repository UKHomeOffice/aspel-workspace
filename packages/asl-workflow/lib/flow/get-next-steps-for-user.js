const { get } = require('lodash');
const flow = require('../flow');
const { recalledByApplicant, discardedByApplicant, discardedByAsru } = require('../flow/status');
const queryBuilder = require('../query-builders');
const { updated } = require('./status');

const userCreatedThisTask = (c, profile) => {
  if (!c.data.changedBy) {
    return false;
  }

  if (typeof c.data.changedBy === 'string') {
    return c.data.changedBy === profile.id;
  }

  return c.data.changedBy.id === profile.id;
};

const userIsEstablishmentAdmin = (c, profile) => {
  const establishmentId = get(c, 'data.establishmentId');
  const establishment = profile.establishments.find(e => e.id === establishmentId);
  return establishment && establishment.role === 'admin';
};

const userIsAsruAdmin = profile => {
  return profile.asruUser && profile.asruAdmin;
};

module.exports = (c, profile) => {
  if (flow.autoForwards(c.status)) {
    return Promise.resolve(flow.getNextSteps(c));
  }

  let nextSteps = [];

  // if the task is outstanding for the current user then they can action it
  return queryBuilder({ profile, progress: 'outstanding' })
    .andWhere('cases.id', c.id)
    .then(cases => cases.results.length > 0)
    .then(taskWithUser => {
      if (taskWithUser) {
        if (c.data.model === 'pil' && c.data.action === 'transfer' && !userCreatedThisTask(c, profile)) {
          nextSteps = flow.getNextSteps(c).filter(step => step.id !== updated.id); // prevent edit and resubmit by receiving admin
        } else {
          nextSteps = flow.getNextSteps(c);
        }
      } else {
        // if the task was created by the current user, or if current user is an admin, then they can recall or discard it
        const canAction = userIsEstablishmentAdmin(c, profile) || userCreatedThisTask(c, profile);
        if (canAction && flow.getNextSteps(c).length > 0) {
          nextSteps = [recalledByApplicant, discardedByApplicant];
        }
      }

      if (userIsAsruAdmin(profile)) {
        nextSteps.push(discardedByAsru);
      }

      return nextSteps;
    });
};
