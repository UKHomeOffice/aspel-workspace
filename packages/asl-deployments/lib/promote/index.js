import Drone from '@lennym/drone-node';

import usage from './usage.js';

export default (settings) => {

  const client = new Drone.Client({ url: settings.drone_server, token: settings.drone_token });

  settings.env = settings.env || 'dev';

  if (settings.env === 'prod' && !settings.token) {
    return usage()
      .then(() => {
        throw new Error('token is required when deploying to prod');
      });
  }

  const getBuilds = () => {
    return client.getBuilds('ukhomeoffice', 'asl-deployments');
  };

  const getBuild = (number) => {
    return client.getBuild('ukhomeoffice', 'asl-deployments', number);
  };

  const deploy = (build, env) => {
    const params = {};
    if (env === 'prod') {
      params.KUBE_TOKEN = settings.token;
    }
    return client.promoteBuild('ukhomeoffice', 'asl-deployments', build.number, env, params);
  };

  const isPromotable = (build, env) => {
    if (build.status !== 'success') {
      return false;
    }
    if (env === 'dev') {
      return build.event === 'push' && build.target === 'master';
    }
    if (env === 'preprod') {
      return build.event === 'promote' && build.deploy_to === 'dev';
    }
    if (env === 'prod') {
      return build.event === 'promote' && build.deploy_to === 'preprod';
    }
  };

  if (settings.help) {
    return usage();
  }

  return Promise.resolve()
    .then(async () => settings.build ? [await getBuild(settings.build)] : getBuilds())
    .then(builds => builds.find(build => isPromotable(build, settings.env)))
    .then(build => {
      if (!build) {
        throw new Error(`No promotable build could be found matching the parameters provided.`);
      }
      return build;
    })
    .then(build => {
      console.log(`Promoting build ${build.number} to ${settings.env}`);
      return deploy(build, settings.env);
    });

};
