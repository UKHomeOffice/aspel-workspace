const dayJs = require('@ukhomeoffice/asl-components/dayjs');

const generateExports = () => {
  const earliest = dayJs('2021-05-01');
  const latest = dayJs().subtract(1, 'month').startOf('month');
  let date = earliest;
  const dataExports = [];

  // eslint-disable-next-line no-unmodified-loop-condition
  while (date <= latest) {
    dataExports.push({
      type: 'task-metrics',
      key: date.format('YYYY-MM'),
      ready: false,
      meta: {
        start: date.format('YYYY-MM-DD'),
        end: dayJs(date).endOf('month').format('YYYY-MM-DD')
      }
    });
    date.add(1, 'month');
  }

  return dataExports;
};

module.exports = {
  populate: knex => knex('exports').insert(generateExports()),
  delete: knex => knex('exports').del()
};
