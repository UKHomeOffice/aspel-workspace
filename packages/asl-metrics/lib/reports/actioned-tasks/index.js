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
               'licenceNumber', cases.data->'modelData'->>'licenceNumber'
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
                 )
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
              .andWhereBetween('cases.updated_at', [start.toISOString(), end.toISOString()])
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
    let totalDaysAssigned = 0;

    let status = task.status;

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
          previousSubmission = moment(eventTime);

          if (activityLog.event.assignedTo) {
            previousAssignment = moment(eventTime);
          }

          if (!firstSubmittedAt) {
            firstSubmittedAt = moment(eventTime);
          } else {
            lastResubmittedAt = moment(eventTime);
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
              licenceNumber: task.data.modelData?.licenceNumber,
              versionId: activityLog.event?.version,
              submitted: previousSubmission?.format('YYYY-MM-DD'),
              assigned: previousAssignment?.format('YYYY-MM-DD'),
              actioned: eventTime?.format('YYYY-MM-DD'),
              action: activityLog.event?.status,
              isResubmission: !!lastResubmittedAt,
              isWithAsru: false
            });
          }

          if (isAction && previousSubmission) {
            lastSubmitToActionDiff = eventTime.workingDiff(previousSubmission, 'calendarDays');
            totalDaysWithAsru += lastSubmitToActionDiff;
            previousSubmission = null;
          }

          if (isAction && firstSubmittedAt && firstSubmitToActionDiff == null) {
            firstSubmitToActionDiff = eventTime.workingDiff(firstSubmittedAt, 'calendarDays');
          }

          if (isAction && previousAssignment) {
            totalDaysAssigned += eventTime.workingDiff(previousAssignment, 'calendarDays');
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

          if (!eventTime.isBefore(start) && !eventTime.isAfter(end) && !firstAssignedAtInPeriod) {
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

        if (!eventTime.isBefore(start) && !eventTime.isAfter(end)) {
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

    if (previousSubmission !== null) {
      totalDaysWithAsru += end.workingDiff(previousSubmission, 'calendarDays');

      subtasks.push({
        taskId: task.id,
        model: task.data.model,
        modelId: task.data.modelData?.id,
        licenceNumber: task.data.modelData?.licenceNumber,
        versionId: task.data?.version,
        submitted: previousSubmission.format('YYYY-MM-DD'),
        assigned: previousAssignment?.format('YYYY-MM-DD'),
        actioned: null,
        action: null,
        isResubmission: !!lastResubmittedAt,
        isWithAsru: true
      });
    }

    if (previousAssignment !== null) {
      totalDaysAssigned += end.workingDiff(previousAssignment, 'calendarDays');
    }

    return {
      taskId: task.id,
      modelId: task.data.modelData?.id,
      licenceNumber: task.data.modelData?.licenceNumber,
      status,
      ...pick(task, ['data.model', 'data.action']),
      metrics: {
        taskType,
        firstSubmittedAt: firstSubmittedAt && firstSubmittedAt.format('YYYY-MM-DD'),
        firstSubmittedAtInPeriod: firstSubmittedAtInPeriod && firstSubmittedAtInPeriod.format('YYYY-MM-DD'),
        lastResubmittedAt: lastResubmittedAt && lastResubmittedAt.format('YYYY-MM-DD'),
        firstReturnedAt: firstReturnedAt && firstReturnedAt.format('YYYY-MM-DD'),
        firstReturnedAtInPeriod: firstReturnedAtInPeriod && firstReturnedAtInPeriod.format('YYYY-MM-DD'),
        lastReturnedAt: lastReturnedAt && lastReturnedAt.format('YYYY-MM-DD'),
        firstAssignedAt: firstAssignedAt && firstAssignedAt.format('YYYY-MM-DD'),
        firstAssignedAtInPeriod: firstAssignedAtInPeriod && firstAssignedAtInPeriod.format('YYYY-MM-DD'),
        lastAssignedAt: lastAssignedAt && lastAssignedAt.format('YYYY-MM-DD'),
        resolvedAt: resolvedAt && resolvedAt.format('YYYY-MM-DD'),
        totalDaysWithAsru,
        totalDaysAssigned,
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
