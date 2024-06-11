import Drone from '@lennym/drone-node';

const client = new Drone.Client({ url: process.env.DRONE_SERVER, token: process.env.DRONE_TOKEN });
const BUILD_NUMBER = parseInt(process.env.DRONE_BUILD_NUMBER, 10);

const getBuilds = () => {
  return client.getBuilds('ukhomeoffice', 'asl-deployments');
};

const deploy = () => {
  return client.promoteBuild('ukhomeoffice', 'asl-deployments', BUILD_NUMBER, 'dev');
};

Promise.resolve()
  .then(() => getBuilds())
  .then(builds => {
    // look for subsequent master builds
    const running = builds.some(build => build.status === 'running' && build.event === 'push' && build.source === 'master' && build.number > BUILD_NUMBER);

    if (!running) {
      console.log('No active master builds found. Promoting...');
      return deploy();
    }
    console.log('Active master builds found. Deferring promotion.');
    process.exit();
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
