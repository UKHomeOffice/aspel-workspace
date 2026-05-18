/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.raw(
    `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activity_log_case_id_created_at
       ON activity_log (case_id, created_at);`
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.raw(
    'DROP INDEX CONCURRENTLY IF EXISTS idx_activity_log_case_id_created_at;'
  );
};

exports.config = {
  transaction: false
};
