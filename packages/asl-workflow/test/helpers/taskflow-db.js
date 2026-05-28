const { v4: uuid } = require('uuid');
const Task = require('@ukhomeoffice/asl-taskflow/lib/db/task');
const ActivityLog = require('@ukhomeoffice/asl-taskflow/lib/db/activity-log');
const seeds = require('../data/tasks');
const activitySeeds = require('../data/activity');

module.exports = knex => {
  return {
    reset: () => Promise.resolve()
      .then(() => {
        return Promise.resolve()
          .then(() => ActivityLog.query(knex).delete())
          .then(() => Task.query(knex).delete());
      }),
    seed: (tasks = []) => Promise.resolve()
      .then(() => Task.query(knex).insert(seeds))
      .then(() => ActivityLog.query(knex).insert(activitySeeds))
      .then(() => {
        if (tasks.length) {
          return Task.query(knex).insert(
            tasks.map(t => ({ id: uuid(), ...t }))
          );
        }
      }),
    insert: async (tasks = []) => Task.query(knex).insert(tasks)
  };
};
