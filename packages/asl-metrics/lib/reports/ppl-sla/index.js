const { get } = require('lodash');
const dayJs = require('@ukhomeoffice/asl-components/dayjs');

const { STRICT_DATE_FORMATS, formatIsoDate, parseDate } = dayJs;

module.exports = ({ db, query: params }) => {

  const start = (params && params.start) ? formatIsoDate(parseDate(params.start, STRICT_DATE_FORMATS, true)) : null;
  const end = (params && params.end) ? formatIsoDate(parseDate(params.end, STRICT_DATE_FORMATS, true)) : null;

  const query = () => {
    const q = db.flow('cases')
      .whereRaw(`(cases.data->>'deadlinePassed')::boolean = true`)
      .whereRaw(`cases.data->'deadline'->'exemption'->>'isExempt' is null`)
      .whereRaw(`cases.data->>'model' = 'project'`)
      .whereRaw(`cases.data->>'action' = 'grant'`)
      .whereRaw(`cases.data->'modelData'->>'status' = 'inactive'`)
      .where(function () {
        if (start || end) {
          this.whereRaw(`cases.data->>'deadlinePassedDate' is not null`);
          if (start) {
            this.whereRaw(`(cases.data->>'deadlinePassedDate')::date > ?`, [start]);
          }
          if (end) {
            this.whereRaw(`(cases.data->>'deadlinePassedDate')::date <= ?`, [end]);
          }
        }
      });

    if (params.establishment) {
      q.whereRaw(`data->>'establishmentId' = ?`, [params.establishment]);
    }

    return q;

  };

  const parse = record => {
    const deadline = get(record, 'data.deadlinePassedDate');
    const extended = !!get(record, 'data.deadline.isExtended', false);
    return db.asl('projects')
      .select(
        'projects.title',
        'establishments.name',
        'profiles.first_name',
        'profiles.last_name'
      )
      .leftJoin('establishments', 'projects.establishment_id', 'establishments.id')
      .leftJoin('profiles', 'projects.licence_holder_id', 'profiles.id')
      .where({ 'projects.id': record.data.id })
      .first()
      .then(project => {
        return {
          title: project.title,
          establishment: project.name,
          licence_holder: `${project.first_name} ${project.last_name}`,
          submitted: formatIsoDate(dayJs(deadline).subtractWorkingTime(extended ? 55 : 40, 'days')),
          deadline,
          extended,
          task: record.id
        };
      });

  };

  return { query, parse };

};
