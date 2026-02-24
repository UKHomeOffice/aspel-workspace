/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.config = { transaction: false }; // CONCURRENTLY can't run inside a transaction

exports.up = async function(knex) {
  await knex.raw(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activity_log_case_id_created_at
    ON activity_log(case_id, created_at DESC)
  `);

  await knex.raw(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activity_log_changed_by_created_at
    ON activity_log(changed_by, created_at DESC)
  `);

  console.log('Activity log indexes optimised');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw('DROP INDEX CONCURRENTLY IF EXISTS idx_activity_log_case_id_created_at');
  await knex.raw('DROP INDEX CONCURRENTLY IF EXISTS idx_activity_log_changed_by_created_at');
  console.log('activity_log Indexes dropped');
};
