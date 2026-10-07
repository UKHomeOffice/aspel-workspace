const dayJs = require('@ukhomeoffice/asl-components/dayjs');
const { DATE_FORMAT } = require('@ukhomeoffice/asl-constants');

const generateExports = () => {
  const earliest = dayJs('2021-05-01');
  const latest = dayJs().subtract(1, 'month').startOf('month');
  let date = earliest;
  const dataExports = [];

  while (date <= latest) {
    dataExports.push({
      type: 'task-metrics',
      key: date.format(DATE_FORMAT.yearMonth),
      ready: false,
      meta: {
        start: date.format(DATE_FORMAT.iso),
        end: dayJs(date).endOf('month').format(DATE_FORMAT.iso)
      }
    });
    date = date.add(1, 'month');
  }

  return dataExports;
};

module.exports = {
  populate: knex => knex('exports').insert(generateExports()),
  delete: knex => knex('exports').del()
};
