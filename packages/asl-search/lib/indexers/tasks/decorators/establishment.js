const { get, pick } = require('lodash');

module.exports = aslSchema => {
  const { Establishment } = aslSchema;

  return Establishment.queryWithDeleted().select('id', 'name')
    .then(establishments => {
      // Create Map for O(1) lookups
      const establishmentMap = new Map(
        establishments.map(e => [e.id, pick(e, 'id', 'name')])
      );

      return task => {
        const establishmentId = get(task, 'data.establishmentId');

        if (establishmentId) {
          task.establishment = establishmentMap.get(establishmentId);
        }

        return task;
      };
    })
    .catch(error => {
      console.error('Failed to load establishments:', error);
      // Return a fallback decorator that doesn't fail
      return task => task;
    });
};
