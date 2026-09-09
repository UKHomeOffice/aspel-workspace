const { omit } = require('lodash');
const { once } = require('events');
const csv = require('csv-stringify');
const archiver = require('archiver');
const Auth = require('../../clients/auth');
const Metrics = require('../../clients/metrics');
const emptyStats = require('./empty-stats');
const summarise = require('./summarise');
const calculateAverages = require('./calculate-averages');

const writeAsync = async (writable, chunk) => {
  // Write will return false if it wants to apply backpressure, in which case we
  // need to wait for the 'drain' event before continuing to write more data.
  if (!writable.write(chunk)) {
    await once(writable, 'drain');
  }
};

module.exports = settings => {
  const logger = settings.logger;
  const getAccessToken = Auth(settings.auth);
  const metrics = Metrics(settings.metrics);
  const s3Upload = settings.s3Upload;

  return async job => {
    logger.debug('fetching access token from keycloak');
    const accessToken = await getAccessToken();

    const { start, end } = job.meta;
    const query = { start, end };

    const internalDeadlinesCSV = csv({
      header: true,
      bom: true,
      columns: [
        'task_id',
        'project_title',
        'licence_number',
        'type',
        'resubmitted',
        'extended',
        'still_open',
        'target',
        'resolved_at'
      ]
    });

    logger.debug('fetching internal-deadlines report');
    const internalDeadlinesData = await metrics(
      '/reports/internal-deadlines',
      { stream: false, query },
      accessToken
    );

    logger.debug('writing internal-deadlines csv');
    internalDeadlinesData.filter(Boolean).forEach(row => internalDeadlinesCSV.write(row));
    internalDeadlinesCSV.end();

    const actionedTasksRawCSV = csv({
      header: true,
      bom: true,
      columns: [
        'taskId',
        'status',
        'model',
        'modelId',
        'licenceNumber',
        'action',
        'taskType',
        'isContinuation',
        'firstSubmittedAt',
        'firstReturnedAt',
        'firstAssignedAt',
        'firstSubmittedAtInPeriod',
        'firstReturnedAtInPeriod',
        'firstAssignedAtInPeriod',
        'lastResubmittedAt',
        'lastReturnedAt',
        'lastAssignedAt',
        'resolvedAt',
        'dueDate',
        'isDueDateExtended',
        'totalDaysAssigned',
        'totalDaysAssignedInPeriod',
        'firstSubmitToActionDiff',
        'lastSubmitToActionDiff',
        'totalDaysWithAsru',
        'totalDaysWithAsruInPeriod',
        'wasSubmittedInPeriod',
        'isOutstanding',
        'returnedCount',
        'returnedCountInPeriod',
        'resubmittedCount',
        'resubmittedCountInPeriod'
      ]
    });
    let actionedTasksSummary = emptyStats();

    const actionedTasksSummaryCSV = csv({
      header: true,
      bom: true,
      columns: {
        taskType: 'Type',
        submitted: 'Submitted',
        resubmitted: 'Resubmitted',
        returned: 'Returned',
        approved: 'Approved',
        rejected: 'Rejected',
        outstanding: 'Outstanding',
        submitToActionDaysMean: 'Mean submission to action (days)',
        submitToActionDaysMedian: 'Median submission to action (days)',
        resubmitToActionDaysMean: 'Mean resubmission to action (days)',
        resubmitToActionDaysMedian: 'Median resubmission to action (days)',
        assignToActionDaysMean: 'Mean assignment to action (days)',
        assignToActionDaysMedian: 'Median assignment to action (days)'
      }
    });

    const actionedSubtasksCSV = csv({
      header: true,
      bom: true,
      columns: [
        'taskId',
        'model',
        'modelId',
        'licenceNumber',
        'versionId',
        'taskAction',
        'taskType',
        'submitted',
        'isResubmission',
        'assigned',
        'actioned',
        'inspectorAction',
        'inspectorName',
        'comment'
      ]
    });

    try {
      logger.debug('fetching actioned-tasks stream');

      const stream = await metrics('/reports/actioned-tasks', { stream: true, query }, accessToken);

      logger.debug('writing actioned-tasks-raw csv');
      for await (const task of stream) {
        await writeAsync(
          actionedTasksRawCSV,
          {
            ...omit(task, 'data', 'metrics'),
            ...task.data,
            ...omit(task.metrics, 'subtasks')
          }
        );

        for (const subTask of (task.metrics?.subtasks ?? [])) {
          await writeAsync(actionedSubtasksCSV, subTask);
        }

        actionedTasksSummary = summarise(actionedTasksSummary, task);
      }

      logger.debug('summarising actioned tasks');
      actionedTasksSummary = calculateAverages(actionedTasksSummary);

      Object.keys(actionedTasksSummary).forEach(taskType => {
        actionedTasksSummaryCSV.write({ taskType, ...actionedTasksSummary[taskType] });
      });

      actionedTasksRawCSV.end();
      actionedTasksSummaryCSV.end();
      actionedSubtasksCSV.end();

      logger.debug('creating zip file');
      const zip = archiver('zip', undefined);

      zip.on('error', err => {
        throw new Error(err);
      });

      zip.append(internalDeadlinesCSV, { name: `internal-deadlines_${start}_${end}.csv` });
      zip.append(actionedTasksRawCSV, { name: `actioned-tasks-raw_${start}_${end}.csv` });
      zip.append(actionedTasksSummaryCSV, { name: `actioned-tasks-summary_${start}_${end}.csv` });
      zip.append(actionedSubtasksCSV, { name: `subtasks-${start}_${end}.csv` });
      await zip.finalize();

      logger.debug('uploading zip file');

      const result = await s3Upload({ key: job.id, stream: zip });
      logger.debug(`upload success, etag: ${result.ETag}`);
      return { ...job.meta, etag: result.ETag };
    } catch (err) {
      console.log(err);
      logger.error(err);
      throw err;
    }

  };
};
