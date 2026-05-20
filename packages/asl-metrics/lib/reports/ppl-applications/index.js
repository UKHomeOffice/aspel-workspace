const { bankHolidays } = require('@ukhomeoffice/asl-constants');
const moment = require('moment-business-time');
const getDeadline = require('./get-deadline');

// configure bank holidays
moment.updateLocale('en', { holidays: bankHolidays });

const formatTime = time => {
  const day = 24 * 60 * 60 * 1000;
  const days = Math.round(time / day);
  return days;
};

module.exports = ({ db, query: params, flow }) => {

  const query = () => {
    return db.flow('cases')
      .select('cases.*')
      .whereRaw(`cases.data->>'model' = 'project'`)
      .whereRaw(`cases.data->>'action' = 'grant'`)
      .whereRaw(`cases.data->'modelData'->>'status' = 'inactive'`)
      .where('cases.status', 'resolved')
      .orderBy('cases.created_at', 'asc');
  };

  const getActivity = caseId => {
    return db.flow('activity_log')
      .select(
        'activity_log.event_name',
        'activity_log.created_at',
        'activity_log.comment',
        'activity_log.event'
      )
      .where('activity_log.case_id', caseId)
      .where(builder => {
        builder
          .where('activity_log.event_name', 'like', 'status:%')
          .orWhere('activity_log.event_name', 'update');
      })
      .orderBy('activity_log.created_at', 'asc');
  };

  const getProject = projectId => {
    return db.asl('projects')
      .select(
        'projects.id',
        'projects.title',
        'projects.licence_number',
        'projects.created_at',
        'projects.issue_date',
        'establishments.name',
        'profiles.first_name',
        'profiles.last_name'
      )
      .leftJoin('establishments', 'projects.establishment_id', 'establishments.id')
      .leftJoin('profiles', 'projects.licence_holder_id', 'profiles.id')
      .where({ 'projects.id': projectId })
      .where('projects.issue_date', '>', '2019-07-31')
      .first();
  };

  const parse = async record => {
    const [activity, project] = await Promise.all([
      getActivity(record.id),
      getProject(record.data.id)
    ]);

    const statusActivity = activity
      .filter(a => a.event_name.match(/^status:/))
      .sort((a, b) => a.created_at < b.created_at ? -1 : 1); // ascending time order

    const timers = {
      total: 0,
      asru: 0,
      establishment: 0,
      inspector: 0,
      licensing: 0
    };

    let last = moment(record.created_at).valueOf();
    statusActivity.forEach(log => {
      const diff = moment(log.created_at).valueOf() - last;
      const status = log.event_name.split(':')[1];
      if (flow.all[status].withASRU) {
        timers.asru += diff;
      } else {
        timers.establishment += diff;
      }
      if (['with-inspectorate', 'referred-to-inspector'].includes(status)) {
        timers.inspector += diff;
      }
      if (['with-licensing', 'inspector-recommended', 'inspector-rejected'].includes(status)) {
        timers.licensing += diff;
      }
      timers.total += diff;
      last = moment(log.created_at).valueOf();
    });

    // ignore PPLs which have had their issue date changed to pre-aspel
    if (!project) {
      return [];
    }
    const draftingTime = project.created_at ? moment(record.created_at).diff(project.created_at) : 0;

    timers.total += draftingTime;
    timers.establishment += draftingTime;

    const deadline = getDeadline({ ...record, activity });
    const iterations = activity.filter(a => a.event_name && a.event_name.match(/^status:(.)*:returned-to-applicant$/)).length + 1;

    let continuationExpiry = '';
    const isContinuation = !!record.data.continuation;
    if (isContinuation) {
      // get the earliest expiry date if there are multiple
      continuationExpiry = (record.data.continuation || []).map(cont => cont['expiry-date']).sort().shift() || 'Unknown';
    }

    return {
      title: project.title,
      establishment: project.name,
      licenceNumber: project.licence_number,
      licenceHolder: `${project.first_name} ${project.last_name}`,
      created: moment(project.created_at).format('YYYY-MM-DD'),
      submitted: moment(record.created_at).format('YYYY-MM-DD'),
      granted: moment(record.updated_at).format('YYYY-MM-DD'),
      issue_date: moment(project.issue_date).format('YYYY-MM-DD'),
      isContinuation: isContinuation ? 'Yes' : 'No',
      continuationExpiry,
      totalTime: formatTime(timers.total),
      timeDraftingPreSubmission: formatTime(draftingTime),
      timeWithEstablishment: formatTime(timers.establishment),
      timeWithInspector: formatTime(timers.inspector),
      timeWithLicensing: formatTime(timers.licensing),
      timeWithASRU: formatTime(timers.asru),
      timeWithASRUPercentage: `${Math.round(100 * (timers.asru / timers.total))}%`,
      iterations,
      wasExtended: deadline.isExtended ? 'Yes' : 'No',
      extendedReason: deadline.isExtended && deadline.extendedReason
    };

  };

  return { query, parse };

};
