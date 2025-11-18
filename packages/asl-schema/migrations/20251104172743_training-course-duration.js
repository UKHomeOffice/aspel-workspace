const { trainingCourseDuration } = require('@ukhomeoffice/asl-constants');

exports.up = function(knex) {
  return knex.schema
    .table('training_courses', (table) => {
      table.enu('course_duration', [...Object.values(trainingCourseDuration)]);
      table.string('end_date');
    });
};

exports.down = function(knex) {
  return knex.schema
    .table('training_courses', (table) => {
      table.dropColumn('course_duration');
      table.dropColumn('end_date');
    });
};
