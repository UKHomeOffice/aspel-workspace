---
title: Test, build and deploy pipelines
order: 40
---

* Table of contents
{:toc}

## Service pipelines

Each service runs its own [Drone CI](https://drone-gh.acp.homeoffice.gov.uk/) pipeline to perform basic testing, build a docker image, and push the image to quay.io.

### Docker images

The individual service images extend a common base image which is found in the [`asl-docker-base` github repo](https://github.com/UKHomeOffice/asl-docker-base).

This in turn extends the `node:16-alpine` image with some basic configuration to create directories and users.

### ESLint

All code is run through ESLint to identify obvious runtime errors, and to maintain common coding standards.

### Unit testing

Some services and components will also perform additional unit testing at build time. The tooling used for this varies depending on the requirements of the repo, but may include use of `jest` and `mocha` test frameworks and `nyc` code coverage library.

### npm audit

All top level services have `npm audit` applied in order to detect possibly security vulnerabilities.

Audit is generally configured to ignore advisories below `high` in severity.

Tooling around `npm audit` to facilitate analysing and whitelisting particular advisories is currently immature, but [this module](https://github.com/lennym/ciaudit) represents our current best attempts at doing this, and is in use in some repos where there are high severity advisories without currently available fixes that have been analysed and determined to represent a tolerable risk.

### Versioning services

The top-level services end their build pipelines by updating a [central version manifest](https://github.com/UKHomeOffice/asl-deployments/blob/master/versions.yml) with the newly tagged version id. This is done by the [asl-deploy-bot image](https://github.com/UKHomeOffice/asl-deploy-bot) which is used across all service pipelines.

## Upgrading internal npm packages

Some of ASPeL dependencies are bundled as internal npm packages (e.g. [asl-projects](https://github.com/UKHomeOffice/asl-projects) and [asl-pages](https://github.com/UKHomeOffice/asl-pages)).
To make changes to these npm packages:
* Make code changes in a git branch
* In the same branch, increment package version by running `npm version <new_version>`; then `git push`
* Raise a PR and get it merged into main branch (`master`)
* Switch to `master` and push the created tag: `git push --tags`. This will trigger a CI/CD job responsible for publishing the new version of the npm package to internal npm registry (Artifactory)

The new version of the npm package published above can now be used by other npm projects.

## Deployments

When the version manifest is updated this triggers a deployment of the complete stack to the development namespace. By tying the deployment to a version controlled artefact we can ensure that each deployment represents a reproducible horizontal slice of the complete application stack.

Deployment configuration and integration tests are found in the [`asl-deployments` github repo](https://github.com/UKHomeOffice/asl-deployments).

### Namespaces

There are three namespaces within the ACP cluster into which the service is deployed.

* `asl-dev`
* `asl-preprod`
* `asl-prod`

The dev and preprod namespace are in the ACP "notprod" cluster, and the prod namespace in the ACP "prod" cluster.

### Kubernetes config templates

The configuration for the deployment of the service is generated from a set of templates maintained in the [`asl-kube-templates` repository](https://github.com/UKHomeOffice/asl-kube-templates). This allows a reduction in the repetitive nature of the configuration, and allows each service to be reresented by the minimal amount of configuration required.

Guidance on the usage of the templates can be found in the repository README.

Of particular note is the concept of "internal services" which are not accessible on the public internet and define a list of allowed clients to define a kubernetes network policy to restrict access to only those pods within the namespace as defined in this list.

#### Building configuration

The templates can be built into complete kubernetes configuration by running `npm run configure:<env>` where `<env>` is one of `dev`, `preprod` or `prod`.

This will create a complete set of kubernetes config yaml files in the `./deploy` directory.

### Integration testing

There are a large number of functional integration tests which run following a successful deployment to the dev namespace.

In order to provide a reliable and reproducible start state for these tests, all data sources are reset to a fixed state by running kubernetes jobs to seed the databases as part of a dev deployment.

Integration tests fit into 4 suites:

* public - tests which only access the public facing UI service
* internal - tests which only access the internal facing UI service
* mixed - tests which access both public facing and internal UI services
* "autoproject" - full journey end-to-end tests for a number of key journeys [^1]

#### Failure screenshots

If any of the tests in the first three test suites described above fail then screenshots are automatically saved of the failure state, and are pushed into a branch[^2] of the `asl-deployments` github repo where they can be reviewed.

When running tests locally these are saved into the `./tests/actual` directory.

#### Running tests locally

Running the integration tests locally requires a selenium instance to be running on port 4444.

The easiest way to do this with the `selenium-standalone` module from npm.

##### Note on `wdio` in node > 14

The async code handling used to by wdio to run the integration tests is no longer compatible with node at versions > 14 sue to changes in the V8 engine.

This means that the integration test must be run using node 14. In Drone this means that the image version should be fixed at `node:14`. For development locally a `Dockerfile` is provided to build a test runtime so the tests can be run locally independently of the node version on the development machine (recommended to be 16 at time of writing).

To build and run this docker image, run `npm run docker:test` from the `asl-deployments` repo.

The local test directories will be mounted into the container as shared volumes.

#### Test users

A number of test users are available for testing on dev and preprod. 

Usernames are available in the [TEST_USERS.md](https://github.com/UKHomeOffice/asl-deployments/blob/master/TEST_USERS.md) in asl-deployments github repo.

### Promoting builds

#### Preprod

Once a dev build is succesfully deployed and tested, it is available for promotion. To promote a build you must be connected to a VPN that allows access to Drone. Promoting will deploy the version corresponding to the most recent successful build in the promoted environment.

You will also need to set the `DRONE_SERVER` and `DRONE_TOKEN` environment variables. You can get these from [https://drone-gh.acp.homeoffice.gov.uk/account](https://drone-gh.acp.homeoffice.gov.uk/account).

To promote a successful dev build to preprod run from the root of the `asl-deployments` repo:

```
bin/promote preprod
```

Following a promotion to preprod, a subset of the "autoproject" test suites that do not require data to be seeded are run in order to validate the promotion.

#### Prod

To promote a preprod build to prod, you will need to escalate your privileges for the `asl` project in the [ACP Hub](https://hub.acp.homeoffice.gov.uk/projects/detail/asl) (or have a project admin do so) and then run:

```
bin/promote prod --token <token>
```

where `<token>` is the value of the kube user token with escalated privileges.

#### Promoting a specific build

To promote a specific build which is not the most recent, an additional flag can be passed with the build number of the specific build to be promoted.

Example:

```
bin/promote preprod --build 123
```

This would promote Drone build number 123 to preprod. The build to be promoted must be a promotable build - that is it must be a deployment to the correct upstream environment and must have completed successfully.

## Accessing RDS Postgres

There is a k8s configuration file for a preconfigured postgres client to connect to the licence database in each namespace in [the `./admin` directory of `./asl-deployments`](https://github.com/UKHomeOffice/asl-deployments/tree/master/admin).

You may need to create the client pod. To do so run (with the file path set appropriately per environment):

```
kubectl create -f ./admin/dev/postgres.yaml
```

Then you can connect to the database by running:

```
kubectl exec -it postgres-client -- psql
```

Note that you will need to be connected to an appropriate VPN to access the cluster, and for prod access will also need to have escalated permissions in the [ACP Hub](https://hub.acp.homeoffice.gov.uk/projects/detail/asl).

### Accessing RDS workflow database

To access the workflow database, first open a shell in the `postgres-client` pod:

```
kubectl exec -it postgres-client -- sh
```

Then run `psql` with the workflow credentials passed as environment variables:

```
PGUSER=$WORKFLOW_USERNAME PGHOST=$WORKFLOW_HOST PGPASSWORD=$WORKFLOW_PASSWORD PGDATABASE=$WORKFLOW_DATABASE psql
```

## Notes

[^1]: "autoproject" is no longer limited in scope to only projects and also includes PILs and PELs, but the name stuck
[^2]: there is a nightly Drone task that deletes any of these branches that are more than a week old
