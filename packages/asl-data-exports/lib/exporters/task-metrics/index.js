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
    const runPhase = async (phase, action) => {
      const started = Date.now();
      logger.info(`[phase:start] ${phase}`);
      try {
        const result = await action();
        logger.info(`[phase:done] ${phase} (${Date.now() - started}ms)`);
        return result;
      } catch (err) {
        logger.error(`[phase:error] ${phase} (${Date.now() - started}ms): ${err.message}`);
        throw err;
      }
    };

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

    const actionedTasksRawCSV = csv({
      header: true,
      bom: true,
      columns: [
        'taskId',
        'status',
        'model',
        'modelId',
        'licenceNumber',
        'role',
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
        'deadline',
        'isDeadlineExtended',
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
      logger.info(`starting task-metrics export for job ${job.id} (${start} to ${end})`);

      logger.debug('creating zip stream');
      const zip = archiver('zip', undefined);
      const zipError = new Promise((resolve, reject) => zip.once('error', reject));
      zipError.catch(() => null);

      zip.append(internalDeadlinesCSV, { name: `internal-deadlines_${start}_${end}.csv` });
      zip.append(actionedTasksRawCSV, { name: `actioned-tasks-raw_${start}_${end}.csv` });
      zip.append(actionedTasksSummaryCSV, { name: `actioned-tasks-summary_${start}_${end}.csv` });
      zip.append(actionedSubtasksCSV, { name: `subtasks-${start}_${end}.csv` });

      logger.debug('starting upload stream to s3');
      const uploadPromise = s3Upload({ key: job.id, stream: zip });

      const internalDeadlinesData = await runPhase(
        'metrics internal-deadlines fetch',
        () => metrics(
          '/reports/internal-deadlines',
          { stream: false, query },
          accessToken
        )
      );

      const internalDeadlinesCount = internalDeadlinesData.filter(Boolean).length;
      logger.info(`internal-deadlines fetched: ${internalDeadlinesCount} rows`);

      internalDeadlinesData.filter(Boolean).forEach(row => internalDeadlinesCSV.write(row));
      internalDeadlinesCSV.end();
      logger.debug('internal-deadlines csv completed');

      logger.debug('fetching actioned-tasks stream');

      await runPhase('metrics actioned-tasks stream fetch', async () => {
        const stream = await metrics('/reports/actioned-tasks', { stream: true, query }, accessToken);

        let taskCount = 0;
        let subTaskCount = 0;
        for await (const task of stream) {
          await writeAsync(
            actionedTasksRawCSV,
            {
              ...omit(task, 'data', 'metrics'),
              ...task.data,
              ...omit(task.metrics, 'subtasks')
            }
          );
          taskCount++;

          for (const subTask of (task.metrics?.subtasks ?? [])) {
            await writeAsync(actionedSubtasksCSV, subTask);
            subTaskCount++;
          }

          actionedTasksSummary = summarise(actionedTasksSummary, task);

          if (taskCount % 100 === 0) {
            logger.info(`actioned-tasks progress: ${taskCount} tasks, ${subTaskCount} subtasks`);
          }
        }
      });

      logger.debug('summarising actioned tasks');
      actionedTasksSummary = calculateAverages(actionedTasksSummary);

      Object.keys(actionedTasksSummary).forEach(taskType => {
        actionedTasksSummaryCSV.write({ taskType, ...actionedTasksSummary[taskType] });
      });
      logger.info(`actioned-tasks summary completed: ${Object.keys(actionedTasksSummary).length} task types`);

      actionedTasksRawCSV.end();
      actionedTasksSummaryCSV.end();
      actionedSubtasksCSV.end();
      logger.debug('all csv streams ended');

      await runPhase('zip finalize', () => zip.finalize());

      const result = await runPhase('s3 upload completion', () => Promise.race([uploadPromise, zipError]));
      logger.debug(`upload success, etag: ${result.ETag}`);
      return { ...job.meta, etag: result.ETag };
    } catch (err) {
      console.log(err);
      logger.error(err);
      throw err;
    }

  };
};
