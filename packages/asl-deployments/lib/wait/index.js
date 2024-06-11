import Drone from '@lennym/drone-node';

const client = new Drone.Client({ url: process.env.DRONE_SERVER, token: process.env.DRONE_TOKEN });

const getBuilds = () => {
  return client.getBuilds(process.env.DRONE_REPO_OWNER, process.env.DRONE_REPO_NAME);
};

const timeout = Date.now() + 30 * 60 * 1000;

const poll = () => {
  return Promise.resolve()
    .then(() => getBuilds())
    .then(builds => {
      return builds.filter(build => {
        return build.status === 'running' && build.number < parseInt(process.env.DRONE_BUILD_NUMBER, 10);
      });
    })
    .then(builds => {
      return !builds.length;
    })
    .then(ready => {
      if (ready) {
        console.log('No concurrent builds found. Continuing...');
        return process.exit();
      } else if (Date.now() < timeout) {
        console.log('Blocked by concurrent builds... waiting...');
        return setTimeout(poll, 5000);
      } else {
        console.log(`Could not get current build within timeout. Exiting.`);
        process.exit(1);
      }
    })
    .catch(e => {
      console.log(e);
      return setTimeout(poll, 5000);
    });
};

poll();
