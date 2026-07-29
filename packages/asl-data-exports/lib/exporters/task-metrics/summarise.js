module.exports = (summary, task) => {
  if (!task.metrics) {
    return summary;
  }

  let {
    taskType,
    returnedCountInPeriod: returnedCount = 0,
    resubmittedCountInPeriod: resubmittedCount = 0,
    wasSubmittedInPeriod: wasSubmitted,
    isOutstanding,
    firstSubmitToActionDiff: submitToActionDiff,
    resubmittedDiffs = [],
    firstAssignedToActionDiff: assignToActionDiff,
    totalDaysWithAsru,
    totalDaysAssigned,
    resolvedAt
  } = task.metrics;

  if (!taskType || taskType === 'other') {
    return summary;
  }

  if (wasSubmitted) {
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

  summary[taskType].resubmitted += (resubmittedCount || 0);
  summary[taskType].returned += (returnedCount || 0);
  summary[taskType].outstanding += isOutstanding ? 1 : 0;

  if (submitToActionDiff != null) {
    summary[taskType].submitToActionDays.push(submitToActionDiff);
  }

  if (assignToActionDiff != null) {
    summary[taskType].assignToActionDays.push(assignToActionDiff);
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
