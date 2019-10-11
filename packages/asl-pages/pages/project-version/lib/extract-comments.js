const { chain } = require('lodash');

module.exports = task => {
  const statusChanges = task.activityLog.filter(e => e.eventName.match(/^status:/));
  return chain(task.activityLog)
    .filter(e => e.eventName === 'comment')
    .map(activity => {
      const { id, deleted, comment, createdAt, isNew, changedBy: { firstName, lastName } } = activity;
      return {
        id,
        field: activity.event.meta.payload.meta.field,
        comment,
        deleted,
        // we want to show the date of the following status change, not the comment submission.
        createdAt: ([...statusChanges].reverse().find(s => s.createdAt > createdAt) || {}).createdAt,
        author: `${firstName} ${lastName}`,
        isNew
      };
    })
    .groupBy(comment => comment.field)
    .mapValues(comments => {
      return comments.reverse();
    })
    .value();
};
