export default () => {

  console.log(`
Command:

  bin/deploy <env> [<options>]
  bin/deploy [--env <env>] [<options>]

  Promotes the latest "good" build to the specified environment

Options:

  --env     The environment to deploy to - default "preprod"
  --token   Your kubernetes auth token - required for prod deployments - default process.env.KUBE_TOKEN
  --build   Will promote a particular build number
    `);

  return Promise.resolve();

};
