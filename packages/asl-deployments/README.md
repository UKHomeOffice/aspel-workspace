# asl-deployments

Contains configuration to deploy the ASL stack to various environments.

## versions.yml

`versions.yml` contains the versions of each service which should be deployed. These will normally be updated automatically by the upstream build processes, and should be edited manually _at your peril_.

## Deployments

Any change to master will trigger a dev deployment. The best way to trigger a new dev deployment is to find the latest `master` build in Drone and restart it.

To promote a build, first [set up the Drone CLI](https://github.com/UKHomeOffice/application-container-platform/blob/master/how-to-docs/drone-how-to.md#install-drone-cli).

Then - while connected to the dev VPN - run:

### preprod

```
$ bin/promote preprod
```

### prod

First escalate the permissions for your kube token to allow a deployment. Then run:

```
$ bin/promote prod --token <your kube auth token>
```

### other options

To promote a particular build number:

```
$ bin/promote [env] --build <num>
```

_Note: the build number provided must be a promotable build._

## Configuration

The configuration for each environment can be found in the relevant environment directory.

### Variables

You can add configuration variables to the kube files by creating a file to contain the variables (JSON or YAML) and then adding that to the deploy script with a `--config` parameter.

These variables will then be available in your kube config files by referencing `{{config.<filename>.<variable>}}`. Examples of this can be seen with `versions.yml` and `<env>/urls.yml`.

## Running integration tests locally

To run the integration tests against a local version of the app, you will need an instance of selenium installed
and running in the background:

```
$ npm i -g selenium-standalone
$ selenium-standalone install
$ selenium-standalone start
```

Then in another terminal, run the tests:

```
$ npm run test:integration
```

## Automatic retries of failing tests in dev

The integration tests are currently flaky enough to one or more test to fail most runs. As such a step to re-run only failed tests has been added. This works as follows:

- The integration test step uses `tee` to also save the logs to a file.
- The log file will be checked for failures and removed if all passed, allowing the existence of the log file to be used as a check for if tests need to be re-run.
- The integration test step will nor fail the run if it fails.
- New steps have been added that will:
    - Configure the container for dev deployment
    - Run the database seed and indexing kd jobs
    - Re-run the tests with WDIO_LOG_FILE set
  
  Each of these will first check that the log file still exists before running, so these steps will be skipped if the first set of tests passed.
- `tests/wdio.conf.js` will check for WDIO_LOG_FILE env variable - and if set, extract the failing tests from that file and only run those specs.
- The re-run tests step will then only fail if one of the previously failed tests fails a second time.
- The autoproject step runs as normal, as that is more reliable.
- Screenshots are only pushed to a failures-##### branch if the re-test or autoproject steps fail. 
