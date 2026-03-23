const ROLE_TYPES = Object.freeze({
  nacwo: 'nacwo',
  nvs: 'nvs',
  sqp: 'sqp',
  nio: 'nio',
  ntco: 'ntco',
  nprc: 'nprc',
  pelh: 'pelh',
  holc: 'holc'
});

const MANDATORY_TRAINING_ROLE_TYPES = Object.freeze([
  ROLE_TYPES.nacwo,
  ROLE_TYPES.nvs,
  ROLE_TYPES.sqp
]);

const SHARED_TRAINING_INTRO_ROLE_TYPES = Object.freeze([
  ROLE_TYPES.nvs,
  ROLE_TYPES.sqp
]);

const MANDATORY_TRAINING_HINT_ROLE_TYPES = Object.freeze([
  ROLE_TYPES.nvs,
  ROLE_TYPES.nacwo
]);

const EXCLUDED_ROLE_TYPES_BY_CORPORATE_STATUS = Object.freeze({
  corporate: Object.freeze([ROLE_TYPES.pelh]),
  'non-profit': Object.freeze([ROLE_TYPES.nprc])
});

const normalizeRoleType = roleType => (roleType || '').toLowerCase();

module.exports = {
  ROLE_TYPES,
  MANDATORY_TRAINING_ROLE_TYPES,
  SHARED_TRAINING_INTRO_ROLE_TYPES,
  MANDATORY_TRAINING_HINT_ROLE_TYPES,
  EXCLUDED_ROLE_TYPES_BY_CORPORATE_STATUS,
  normalizeRoleType
};

module.exports.default = module.exports;
