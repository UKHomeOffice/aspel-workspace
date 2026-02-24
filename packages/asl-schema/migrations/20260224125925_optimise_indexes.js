// migrations/20260224125925_optimise_indexes.js

exports.config = { transaction: false }; // CONCURRENTLY can't run in a transaction

exports.up = async function(knex) {
  console.log('Starting creation of new indexes...');

  const createIndexes = [
    'idx_changelog_message_id_not_deleted ON changelog(message_id) WHERE deleted IS NULL',
    'idx_projects_transfer_project_id ON projects(transfer_project_id)',
    'idx_retrospective_assessments_project_id ON retrospective_assessments(project_id)',
    'idx_procedures_rop_id ON procedures(rop_id)',
    'idx_certificates_profile_id ON certificates(profile_id)',
    'idx_invitations_establishment_id ON invitations(establishment_id)',
    'idx_rops_project_id ON rops(project_id)',
    'idx_places_nacwo_id ON places(nacwo_id)',
    'idx_place_roles_role_id ON place_roles(role_id)',
    'idx_project_profiles_profile_id ON project_profiles(profile_id)',
    'idx_exemptions_profile_id ON exemptions(profile_id)',
    'idx_pil_fee_waivers_waived_by_id ON pil_fee_waivers(waived_by_id)',
    'idx_authorisations_establishment_id ON authorisations(establishment_id)',
    'idx_establishment_merge_log_to_establishment_id ON establishment_merge_log(to_establishment_id)',
    'idx_establishment_merge_log_from_establishment_id ON establishment_merge_log(from_establishment_id)',
    'idx_fee_waivers_profile_id ON fee_waivers(profile_id)',
    'idx_exports_profile_id ON exports(profile_id)',
    'idx_asru_establishment_profile_id ON asru_establishment(profile_id)',
    'idx_reminder_dismissed_profile_id ON reminder_dismissed(profile_id)'
  ];

  for (const idx of createIndexes) {
    console.log(`Creating index: ${idx}`);
    await knex.raw(`CREATE INDEX CONCURRENTLY IF NOT EXISTS ${idx}`);
  }

  console.log('Finished creating new indexes.');

  console.log('Starting to drop unused indexes...');

  const dropIndexes = [
    'idx_changelog_created_at',
    'idx_changelog_modeltype_modelid',
    'idx_notifications_profile_id',
    'attachments_token_index',
    'project_versions_project_id_index',
    'idx_project_versions_project_id_createdat',
    'idx_project_versions_licence_holder_id',
    'pils_revocation_date',
    'pils_deleted',
    'pils_establishment_id_index',
    'pils_issue_date',
    'projects_establishment_id_index',
    'idx_projects_transfer_establishment_id',
    'idx_projects_previous_project_id',
    'idx_projects_previous_establishment_id',
    'idx_invitation_email',
    'places_establishment_id_index',
    'roles_establishment_id_index',
    'pil_transfers_pil_id_index',
    'pil_transfers_from_establishment_id',
    'pil_transfers_deleted',
    'pil_transfers_to_establishment_id',
    'pil_transfers_created_at',
    'profile_merge_log_to_profile_id_index',
    'profile_merge_log_from_profile_id_index',
    'pil_fee_waivers_profile_id_index',
    'pil_fee_waivers_establishment_id_index',
    'pil_fee_waivers_year_index',
    'training_pils_training_course_id_index',
    'project_establishments_status_index',
    'project_establishments_version_id_index',
    'fee_waivers_pil_id_index',
    'fee_waivers_establishment_id_index',
    'fee_waivers_year_index',
    'training_courses_project_id_index',
    'training_courses_establishment_id_index',
    'establishments_revocation_date',
    'establishments_issue_date',
    'enforcement_subjects_profile_id_index',
    'enforcement_subjects_establishment_id_index',
    'enforcement_subjects_case_id_index',
    'enforcement_flags_subject_id_index',
    'enforcement_flags_model_id_index',
    'enforcement_flags_establishment_id_index',
    'idx_asru_establishment',
    'exports_type_index',
    'exports_key_index',
    'reminder_dismissed_reminder_id_profile_id_index',
    'reminders_establishment_id_index',
    'reminders_model_id_index'
  ];

  for (const idx of dropIndexes) {
    console.log(`Dropping index: ${idx}`);
    await knex.raw(`DROP INDEX CONCURRENTLY IF EXISTS ${idx}`);
  }

  console.log('Finished dropping unused indexes.');

  console.log('Updating statistics...');
  await knex.raw('ANALYZE');
  console.log('Migration completed.');
};

exports.down = async function(knex) {
  console.log('Rolling back: dropping newly created indexes...');

  const createIndexes = [
    'idx_changelog_message_id_not_deleted',
    'idx_projects_transfer_project_id',
    'idx_retrospective_assessments_project_id',
    'idx_procedures_rop_id',
    'idx_certificates_profile_id',
    'idx_invitations_establishment_id',
    'idx_rops_project_id',
    'idx_places_nacwo_id',
    'idx_place_roles_role_id',
    'idx_project_profiles_profile_id',
    'idx_exemptions_profile_id',
    'idx_pil_fee_waivers_waived_by_id',
    'idx_authorisations_establishment_id',
    'idx_establishment_merge_log_to_establishment_id',
    'idx_establishment_merge_log_from_establishment_id',
    'idx_fee_waivers_profile_id',
    'idx_exports_profile_id',
    'idx_asru_establishment_profile_id',
    'idx_reminder_dismissed_profile_id'
  ];

  for (const idx of createIndexes) {
    console.log(`Dropping index: ${idx}`);
    await knex.raw(`DROP INDEX CONCURRENTLY IF EXISTS ${idx}`);
  }
};
