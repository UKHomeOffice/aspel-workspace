/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.table('projects', (table) => {
    table.dropColumn('hba_replaced');
  });

  await knex.schema.table('project_versions', (table) => {
    table.jsonb('hba_replaced').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.table('project_versions', (table) => {
    table.dropColumn('hba_replaced');
  });

  // restore column to projects table as last migration expected.
  await knex.schema.table('projects', (table) => {
    table.jsonb('hba_replaced').nullable();
  });
};
