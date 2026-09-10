module.exports = (summary, task) => {
  if (!task.metrics) {
    return summary;
  }

  let {
    taskType,
    returnedCountInPeriod = 0,
    resubmittedCountInPeriod = 0,
    wasSubmittedInPeriod,
    isOutstanding,
    firstSubmitToActionDiff,
    resubmittedDiffs = [],
    firstAssignedToActionDiff,
    totalDaysWithAsru,
    totalDaysAssigned,
    resolvedAt,
    wasFirstActionedInPeriod
  } = task.metrics;

  if (!taskType || taskType === 'other') {
    return summary;
  }

  if (wasSubmittedInPeriod) {
    summary[taskType].submitted++;
  }

  if (resolvedAt) {
    if (task.status === 'resolved') {
      summary[taskType].approved++;
    }
    if (task.status === 'rejected') {
      summary[taskType].rejected++;
    }
  }

  summary[taskType].resubmitted += (resubmittedCountInPeriod || 0);
  summary[taskType].returned += (returnedCountInPeriod || 0);
  summary[taskType].outstanding += isOutstanding ? 1 : 0;

  if (wasFirstActionedInPeriod && firstSubmitToActionDiff != null) {
    summary[taskType].submitToActionDays.push(firstSubmitToActionDiff);
  }

  if (wasFirstActionedInPeriod && firstAssignedToActionDiff != null) {
    summary[taskType].assignToActionDays.push(firstAssignedToActionDiff);
  }

  if (totalDaysWithAsru != null) {
    summary[taskType].totalDaysWithAsru.push(totalDaysWithAsru);
  }

  if (totalDaysAssigned != null) {
    summary[taskType].totalDaysAssigned.push(totalDaysAssigned);
  }

  summary[taskType].resubmitToActionDays.push(...resubmittedDiffs);

  return summary;
};
