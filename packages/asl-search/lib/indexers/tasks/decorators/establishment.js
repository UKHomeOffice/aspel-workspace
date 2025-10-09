const { get, pick } = require('lodash');

module.exports = async aslSchema => {
  const { Establishment } = aslSchema;

  // Preload all establishments once — avoid repeated DB lookups per task
  const establishments = await Establishment.queryWithDeleted().select('id', 'name');
  const establishmentMap = new Map(establishments.map(e => [e.id, e]));

  return task => {
    try {
      const establishmentId = get(task, 'data.establishmentId');
      if (establishmentId) {
        const est = establishmentMap.get(establishmentId);
        if (est) {
          task.establishment = pick(est, ['id', 'name']);
        }
      }
    } catch (err) {
      console.error(`Failed to decorate task ${task.id}: ${err.message}`);
    }
    return task;
  };
};
