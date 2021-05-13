try {
  require('dotenv/config');
} catch(e) {
  // ignore
}

const Taskflow = require('@ukhomeoffice/taskflow');
const schema = require('@asl/schema');
const { transaction } = require('objection');
const settings = require('../config');
const { open } = require('../lib/flow');

const discard = async () => {
  const { Project } = schema(settings.db);
  const { Task, db } = Taskflow({ db: settings.taskflowDB });
  const trx = await transaction.start(db);
  try {
    const tasks = await Task.query(trx)
      .whereIn('status', open())
      .whereJsonSupersetOf('data', { model: 'project', action: 'grant' });

    for await (const task of tasks) {
      const project = await Project.query().findById(task.data.id);
      console.log(project.status);
      if (project.status === 'expired') {
        console.log(`Discarding task ${task.id}`);
        const model = await Task.find(task.id, trx);
        await model.status('discarded-by-asru', { payload: { meta: { comment: 'Automatically discarded when project licence expired.' } } });
      }
    }
    await trx.commit();
  } catch (e) {
    await trx.rollback();
    throw e;
  }
};

Promise.resolve()
  .then(() => discard())
  .then(() => process.exit())
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });
