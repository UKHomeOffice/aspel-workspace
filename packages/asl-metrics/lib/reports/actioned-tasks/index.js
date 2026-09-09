const { get, pick } = require('lodash');
const moment = require('moment-business-time');
const { bankHolidays } = require('@ukhomeoffice/asl-constants');
moment.updateLocale('en', { holidays: bankHolidays });

const getTaskType = require('./get-task-type');

module.exports = ({ db, flow, query: params }) => {

  if (!params.start || moment(params.start).format('YYYY-MM-DD') !== params.start) {
    throw Error('valid start date must be provided');
  }

  if (!params.end || moment(params.end).format('YYYY-MM-DD') !== params.end) {
    throw Error('valid end date must be provided');
  }

  const start = moment(params.start).startOf('day');
  const end = moment(params.end).endOf('day');

  const openStatuses = flow.open;
  const closedStatuses = flow.closed;
  const withAsruStatuses = flow.withAsru;

  const query = () => {
    return db.flow('cases')
      .select([
        'cases.id',
        'cases.status',
        db.flow.raw(
          `JSON_BUILD_OBJECT(
             'model', cases.data->>'model', 
             'action', cases.data->>'action',
             'version', cases.data->>'version',
             'modelData', JSON_BUILD_OBJECT(
               'id', cases.data->'modelData'->>'id',
               'status', cases.data->'modelData'->>'status',
               'licenceNumber', cases.data->'modelData'->>'licenceNumber',
               'role', CASE WHEN cases.data->>'model' = 'role' THEN cases.data->>'type' ELSE NULL END
               'isContinuation', cases.data \\? 'continuation',
               'deadline', cases.data -> 'deadline'
             )
           ) as data`
        ),
        'al.activity'
      ])
      .joinRaw(
        `LEFT JOIN LATERAL (
         SELECT 
           COALESCE(
             JSON_AGG(
               JSON_BUILD_OBJECT(
                 'created_at', activity_log.created_at,
                 'event_name', activity_log.event_name,
                 'event', JSON_BUILD_OBJECT(
                   'status', activity_log.event->>'status',
                   'assignedTo', activity_log.event->>'assignedTo',
                   'version', activity_log.event->'data'->'data'->>'version'
                 ),
                 'name', activity_log.event->'meta'->'user'->'profile'->>'name',
                 'comment', activity_log.comment
               )
               ORDER BY activity_log.created_at ASC
             ),
             '[]'::json
           ) AS activity
         FROM activity_log
         WHERE activity_log.case_id = cases.id
         AND activity_log.created_at <= (:end)::timestamptz
         AND (activity_log.event_name like 'status:%' OR activity_log.event_name IN ('create', 'assign'))
       ) as al ON TRUE`,
        { end: end.toISOString() }
      )
      .where('cases.status', '!=', 'autoresolved')
      .where('cases.created_at', '<=', end.toISOString()) // ignore tasks created after report period
      .where(builder =>
        // ignore tasks closed before the report period
        builder.whereIn('cases.status', openStatuses)
          .orWhere(b =>
            b.whereIn('cases.status', closedStatuses)
              .andWhere('cases.updated_at', '>=', start.toISOString())
          )
      );
  };

  const parse = task => {
    const taskType = getTaskType(task);

    if (taskType === 'other') {
      return null;
    }

    let firstSubmittedAt;
    let firstSubmittedAtInPeriod;
    let lastResubmittedAt;
    let firstAssignedAt;
    let firstAssignedAtInPeriod;
    let lastAssignedAt;
    let firstReturnedAt;
    let firstReturnedAtInPeriod;
    let lastReturnedAt;
    let resolvedAt;
    let returnedCount = 0;
    let returnedCountInPeriod = 0;
    let resubmittedCount = 0;
    let resubmittedCountInPeriod = 0;
    let wasSubmittedInPeriod = false;
    let isOutstanding = false;
    let firstSubmitToActionDiff = null;
    let lastSubmitToActionDiff = null;
    let firstAssignedToActionDiff = null;
    let resubmittedDiffs = [];
    let subtasks = [];

    let previousSubmission = null;
    let previousAssignment = null;
    let totalDaysWithAsru = 0;
    let totalDaysWithAsruInPeriod = 0;
    let totalDaysAssigned = 0;
    let totalDaysAssignedInPeriod = 0;

    let status = task.status;

    const deadline = task.data.modelData?.deadline && task.data.modelData.deadline.isExtended
      ? task.data.modelData.deadline.extended
      : task.data.modelData?.deadline?.standard;

    task.activity
      .filter(Boolean)
      .forEach(activityLog => {
        const eventTime = moment(activityLog.created_at);
        const eventStatus = get(activityLog, 'event.status');
        const isStatusChange = activityLog.event_name.match(/^status:/);
        status = eventStatus || status;

        const isSubmission = isStatusChange && withAsruStatuses.includes(eventStatus) && eventStatus !== 'referred-to-inspector';
        const isResubmission = isStatusChange && isSubmission && !!firstSubmittedAt;
        const isReturn = isStatusChange && activityLog.event_name.match(/:returned-to-applicant$/) && !activityLog.event_name.includes('awaiting-endorsement');
        const isResolution = isStatusChange && (activityLog.event_name.match(/:resolved$/) || activityLog.event_name.match(/:rejected$/));
        const isAction = isStatusChange && (isReturn || isResolution);

        if (isSubmission) {
          previousSubmission = eventTime;

          if (activityLog.event.assignedTo) {
            previousAssignment = eventTime;
          }

          if (!firstSubmittedAt) {
            firstSubmittedAt = eventTime;
          } else {
            lastResubmittedAt = eventTime;
          }

          if (eventTime.isBefore(end)) {
            isOutstanding = true;
          }
        } else {
          if (isAction && previousSubmission?.isSameOrBefore(end) && eventTime.isSameOrAfter(start)) {
            subtasks.push({
              taskId: task.id,
              model: task.data.model,
              modelId: task.data.modelData?.id,
              versionId: activityLog.event?.version,
              licenceNumber: task.data.modelData?.licenceNumber,
              taskType,
              taskAction: task.data.action,
              submitted: previousSubmission?.format('YYYY-MM-DD'),
              assigned: previousAssignment?.format('YYYY-MM-DD'),
              actioned: eventTime?.format('YYYY-MM-DD'),
              inspectorAction: activityLog.event?.status,
              isResubmission: !!lastResubmittedAt,
              inspectorName: activityLog.name,
              comment: activityLog.comment
            });
          }

          if (isAction && previousSubmission) {
            lastSubmitToActionDiff = eventTime.workingDiff(previousSubmission, 'calendarDays');
            totalDaysWithAsru += lastSubmitToActionDiff;
            if (eventTime.isSameOrAfter(start)) {
              totalDaysWithAsruInPeriod += eventTime.workingDiff(moment.max(previousSubmission, start), 'calendarDays');
            }
            previousSubmission = null;
          }

          if (isAction && firstSubmittedAt && firstSubmitToActionDiff == null) {
            firstSubmitToActionDiff = eventTime.workingDiff(firstSubmittedAt, 'calendarDays');
          }

          if (isAction && previousAssignment) {
            totalDaysAssigned += eventTime.workingDiff(previousAssignment, 'calendarDays');
            if (eventTime.isSameOrAfter(start)) {
              totalDaysAssignedInPeriod += eventTime.workingDiff(moment.max(previousAssignment, start), 'calendarDays');
            }
            previousAssignment = null;
          }

          if (isAction && firstAssignedAt && firstAssignedToActionDiff == null) {
            firstAssignedToActionDiff = eventTime.workingDiff(firstAssignedAt, 'calendarDays');
          }
          isOutstanding = false;
        }

        if (activityLog.event_name === 'assign') {
          previousAssignment = moment(eventTime);
          lastAssignedAt = moment(eventTime);

          if (!firstAssignedAt && activityLog.event_name === 'assign') {
            firstAssignedAt = moment(eventTime);
          }

          if (eventTime.isSameOrAfter(start) && eventTime.isSameOrBefore(end) && !firstAssignedAtInPeriod) {
            firstAssignedAtInPeriod = moment(eventTime);
          }

          return;
        }

        if (isReturn) {
          returnedCount++;
          lastReturnedAt = moment(eventTime);

          if (!firstReturnedAt) {
            firstReturnedAt = moment(eventTime);
          }
        }

        if (isAction && lastResubmittedAt) {
          resubmittedDiffs.push(moment(eventTime).workingDiff(lastResubmittedAt, 'calendarDays'));
        }

        if (isResubmission) {
          resubmittedCount++;
        }

        if (isResolution) {
          resolvedAt = moment(eventTime);
        }

        if (eventTime.isSameOrAfter(start) && eventTime.isSameOrBefore(end)) {
          if (isSubmission && !firstSubmittedAtInPeriod) {
            firstSubmittedAtInPeriod = moment(eventTime);
          }

          if (isResubmission) {
            resubmittedCountInPeriod++;
          }

          if (isReturn) {
            returnedCountInPeriod++;

            if (!firstReturnedAtInPeriod) {
              firstReturnedAtInPeriod = moment(eventTime);
            }
          }
        }
      });

    if (!firstSubmittedAt) {
      return null; // task was never with ASRU, ignore
    }

    if (firstSubmittedAt.isSameOrAfter(start) && firstSubmittedAt.isSameOrBefore(end)) {
      wasSubmittedInPeriod = true;
    }

    const firstActionedAt = (firstReturnedAt || resolvedAt);
    const wasFirstActionedInPeriod = firstActionedAt && firstActionedAt.isSameOrAfter(start) && firstActionedAt.isSameOrAfter(end);

    if (previousSubmission !== null) {
      totalDaysWithAsru += end.workingDiff(previousSubmission, 'calendarDays');
      totalDaysWithAsruInPeriod += end.workingDiff(moment.max(start, previousSubmission), 'calendarDays');
    }

    if (previousAssignment !== null) {
      totalDaysAssigned += end.workingDiff(previousAssignment, 'calendarDays');
      totalDaysAssignedInPeriod += end.workingDiff(moment.max(start, previousAssignment), 'calendarDays');
    }

    return {
      taskId: task.id,
      modelId: task.data.modelData?.id,
      licenceNumber: task.data.modelData?.licenceNumber,
      status,
      ...pick(task, ['data.model', 'data.action']),
      isContinuation: task.data.model === 'project' ? task.data.modelData?.isContinuation : null,
      deadline,
      isDeadlineExtended: task.data.modelData?.deadline?.isExtended,
      role: task.data.modelData?.role,
      metrics: {
        taskType,
        firstSubmittedAt: firstSubmittedAt?.format('YYYY-MM-DD'),
        firstSubmittedAtInPeriod: firstSubmittedAtInPeriod?.format('YYYY-MM-DD'),
        lastResubmittedAt: lastResubmittedAt?.format('YYYY-MM-DD'),
        firstReturnedAt: firstReturnedAt?.format('YYYY-MM-DD'),
        firstReturnedAtInPeriod: firstReturnedAtInPeriod?.format('YYYY-MM-DD'),
        lastReturnedAt: lastReturnedAt?.format('YYYY-MM-DD'),
        firstAssignedAt: firstAssignedAt?.format('YYYY-MM-DD'),
        firstAssignedAtInPeriod: firstAssignedAtInPeriod?.format('YYYY-MM-DD'),
        lastAssignedAt: lastAssignedAt?.format('YYYY-MM-DD'),
        resolvedAt: resolvedAt?.format('YYYY-MM-DD'),
        firstActionedAt: firstActionedAt?.format('YYYY-MM-DD'),
        wasFirstActionedInPeriod,
        totalDaysWithAsru,
        totalDaysWithAsruInPeriod,
        totalDaysAssigned,
        totalDaysAssignedInPeriod,
        firstAssignedToActionDiff,
        firstSubmitToActionDiff,
        lastSubmitToActionDiff,
        resubmittedDiffs,
        wasSubmittedInPeriod,
        isOutstanding,
        returnedCount,
        returnedCountInPeriod,
        resubmittedCount,
        resubmittedCountInPeriod,
        subtasks
      }
    };
  };

  return { query, parse };
};
