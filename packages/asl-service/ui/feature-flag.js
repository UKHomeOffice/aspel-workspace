const { useSelector } = require('react-redux');
const { set } = require('lodash');
const { useCallback } = require('react');

const flags = {
  FEATURE_FLAG_NAMED_PERSON_MVP: 'feature-named-person-mvp',
  FEATURE_FLAG_CAT_E: 'feature-cat-e',
  FEATURE_FLAG_TRAINING_RECORD: 'feature-training-record-highlight'
};

const useFeatureFlags = () => {
  const roles = useSelector(state => state.static.keycloakRoles ?? []);
  return useCallback(flag => roles.includes(flag), [roles]);
};

// noinspection JSUnusedGlobalSymbols
module.exports = {
  middleware(req, res, next) {
    set(res.locals, 'static.keycloakRoles', req.user?.keycloakRoles ?? []);
    req.hasFeatureFlag = (flag) => (req.user.keycloakRoles ?? []).includes(flag);
    next();
  },
  useFeatureFlag(flag) {
    return useFeatureFlags()(flag);
  },
  useFeatureFlags,
  ...flags
};
