const moment = require('moment');

module.exports = async ({ knex }) => {

  const trainingDueReminder = async () => {
    //     SELECT event -> 'data' -> 'data' ->> 'completeDate' AS complete_date
    // 	FROM public.activity_log
    // -- WHERE (event -> 'data' -> 'data' ->> 'completeDate')::date = CURRENT_DATE + INTERVAL '3 months'
    const task = await knex.raw('SELECT count(*) FROM public.activity_log');
    console.log("🚀 ~ trainingDueReminder ~ task:", task.rows)
  }

  await trainingDueReminder();
};
