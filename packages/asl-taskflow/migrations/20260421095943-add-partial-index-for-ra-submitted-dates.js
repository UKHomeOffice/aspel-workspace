/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .raw(
      'DROP INDEX CONCURRENTLY IF EXISTS idx_activity_log_with_inspectorate_case_created_at;'
    )
    .then(() => knex.schema.raw(
      // Keep this partial index alongside the general idx_activity_log_case_id_created_at
      // index for now; this remains selective for with-inspectorate filtered queries.
      `CREATE INDEX CONCURRENTLY idx_activity_log_with_inspectorate_case_created_at
         ON activity_log (case_id, created_at)
         WHERE event->>'status' = 'with-inspectorate';`
    ));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.raw(
    'DROP INDEX CONCURRENTLY IF EXISTS idx_activity_log_with_inspectorate_case_created_at;'
  );
};

exports.config = {
  transaction: false
};
