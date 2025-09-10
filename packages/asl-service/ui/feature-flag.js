const { useSelector } = require('react-redux');
const { set } = require('lodash');
const { featureFlags } = require('@ukhomeoffice/asl-constants');
const { useCallback } = require('react');

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
  ...featureFlags
};
