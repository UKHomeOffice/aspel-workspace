exports.up = function(knex) {
  return knex.schema
    .table('training_courses', (table) => {
      table.string('end_date');
    });
};

exports.down = function(knex) {
  return knex.schema
    .table('training_courses', (table) => {
      table.dropColumn('end_date');
    });
};
