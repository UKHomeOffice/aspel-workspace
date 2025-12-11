/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.raw(
    `CREATE INDEX idx_cases_by_model_action_status
        ON cases (
              (data ->> 'model'),
              (data ->> 'action'),
              (data -> 'modelData' ->> 'status'),
              status,
              created_at
             );`
  )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.raw(
    `DROP INDEX idx_cases_by_model_action_status;`
  )
};
