# ASPeL Toolbox

A docker image to provide developer access and tooling to ASPeL Kubernetes namespaces and AWS resources.

## Deploying the toolbox

There are specifications provided in asl-deployments for deploying an instance of the toolbox to one of the ASPeL
Kubernetes namespaces in ACP. See [Accessing RDS Postgres documentation](
https://ukhomeoffice.github.io/asl-deployments/dev/building-and-deploying.html#accessing-rds-postgres).

## Accessing the database

Scripts are provided in [scripts/db](./scripts/db) that can be used to connect to the ASPeL databases. In Kubernetes
the necessary credential environment variables will be provided from secrets. To run locally copy 
[.env.dist](./.env.dist) to `.env`, and you'll need a copy of the database running. See 
[asl-conductor](https://github.com/UKHomeOffice/asl-conductor) for a standard way to run the ASPeL db in docker.

## Accessing AWS services

The aws-cli tool is available in the image. This section to be updated as we build up knowledge of how we can use this.

## Scripts for repeatable admin tasks

Where there are manual tasks to be run by devs, these can be provided as scripts in this repo.

Existing scripts are:

* [update-protocol-locations](./docs/update-protocol-locations.md)

Node has been set up with access to `@asl-schema`, plus `eslint` and `jest` to help check code quality. Scripts will be
linted and tested by the pipeline that publishes new versions of the `asl-toolbox`.
