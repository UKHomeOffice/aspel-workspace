---
title: Overview
order: 0
---

* Table of contents
{:toc}

## Name of the service

Despite the public service being known as ASPeL, the project was referred to through development as ASL, and so most resources are named using `asl` as a prefix.

## Technology stack

The system consists of a number of services running in kubernetes pods in the Home Office's ACP cluster.

The individual services are predominantly Node.js servers, developed using the express framework.

Where the service is a public facing webserver with a browser-based UI, the interfaces are built with React.

### Data stores

Licence data is stored in an AWS RDS Postgres instance. 

There is an additional RDS Postgres instance to store data related to the task processing workflow engine.

An AWS Elasticsearch instance is used to index licence data to provide advanced search capability.

Where a service uses persistent sessions redis is used as a persistence layer for session data. These redis instances are deployed as kubernetes pods as the data is considered to be transient.

#### Database users

In general when deployed into ACP each service connects to the database using its own dedicated login, with minimal permissions. These are normally named according to the service name (without `asl-` prefix, and all one word).

A complete list of database logins can be retrieved from the `dbpasswords` secret in any namespace. e.g.:

```
kubectl get secret dbpasswords --output yaml
```

#### Database schema migrations

The licence database uses the Objection.js ORM to manage database schema migrations.

Migrations are managed through the `knex` library ([see knex documentation for details](http://knexjs.org/guide/migrations.html)) and can be found in [the `asl-schema` repository](https://github.com/UKHomeOffice/asl-schema/tree/master/migrations).

Migrations are automatically applied as part of any deployment.

#### Adding tables

When a new table is created in a migration, by default no users have permissions to perform operations on the table. These permissions will need to be added manually.

To do this, create a shell into the postgres database and grant `select` permissions to any application users that require access to the table, and most likely `insert`, `update`, `delete` permissions to the `resolver` user.

### Deployment

All services are deployed as docker containers into the Home Office ACP kubernetes cluster.

[More information on deployments](./building-and-deploying.html).

## Shared components

Components which are shared across multiple services are published to a private npm registry hosted in the Home Office's Artifactory instance.

[Instructions for configuring access to Artifactory as a private npm registry](./npm-registry.html).

## Services

ASPeL consists of the following service components. Each can be found in a github repo with the same name. With the exception of `asl-resolver` all constitute a webserver behind an nginx reverse proxy that terminates SSL.

Access to UI services is authenticated by an OAuth flow to keycloak. This generates a bearer token which is then used to authenticate with downstream API services.

Most services also include a kubernetes horizontal pod autoscaler to manage fluctuations in load.

### [`asl`](https://github.com/UKHomeOffice/asl)

The public facing UI service. This is the point of entry for all non-ASRU users.

Has an accompanying redis instance to handle persistence of session data.

### [`asl-internal-ui`](https://github.com/UKHomeOffice/asl-internal-ui)

The internal facing UI service. This is the point of entry for ASRU users and is restricted via an IP whitelist only to the POISE network, or through the ACP Tunnel VPN.

Has an accompanying redis instance to handle persistence of session data.

### [`asl-public-api`](https://github.com/UKHomeOffice/asl-public-api)

The primary licence data API for access to establishment scoped data. 

### [`asl-internal-api`](https://github.com/UKHomeOffice/asl-internal-api)

The licence data API for internal users allowing access to data aggregated across establishments, and endpoints for actions restrcited to ASRU users.

Includes a proxy to `asl-public-api` for all establishment scoped requests.

### [`asl-permissions`](https://github.com/UKHomeOffice/asl-permissions)

A microservice to establish permissions for the currently authenticated user. Serves endpoints in the form `/:actionId?params` and responds with a 200 or 403 depending on the users permissions to perform that action.

### [`asl-workflow`](https://github.com/UKHomeOffice/asl-workflow)

Event-driven API for task processing. Contains business rules about the workflows for processing of [tasks]('../usage/tasks.html'). 

When tasks are resolved, pushes the encrypted task data as a message to an AWS SQS queue for processing by `asl-resolver`. To work around limits in SQS message size, the encrypted data is stored temporarily in S3 and a reference passed as the SQS message.

### [`asl-notifications`](https://github.com/UKHomeOffice/asl-notifications)

Receives events from `asl-workflow` and determines which users require email notifications for which events.

Notifications are pushed to a queue in the database for processing. This is so that we have a permanent record of all notifications sent, as well as allowing a way to ensure each event only sends once to each user.

### [`asl-emailer`](https://github.com/UKHomeOffice/asl-emailer)

Wrapper around the GOVUK Notify API for sending emails.

### [`asl-metrics`](https://github.com/UKHomeOffice/asl-metrics)

Aggregates licence and performance data into downloadable reports and API endpoints serving MI data.

### [`asl-search`](https://github.com/UKHomeOffice/asl-search)

API in front of elasticsearch index to perform searching of licence data.

Two instances of this service run, an internal instance with all indexes available - restricted to access only from `asl-internal-api` by a kubernetes network policy - and a public instance with only establishment scoped place data searchable.

### [`pdf-generator`](https://github.com/UKHomeOffice/html-pdf-converter)

An instance of a shared Home Office tool to generate PDF documents from HTML payloads.

### [`asl-resolver`](https://github.com/UKHomeOffice/asl-resolver)

A worker which reads resolved task data from SQS and makes corresponding writes to the database.

There is no inbound network access to this pod allowed by kubernetes network policies.

## Jobs

### Deployment jobs

There are two database schema migration jobs that run on each deployment to an environment.

* `database-migration`
* `workflow-migration`

These both run a knex.js migration script to ensure that the database schemas for the licence and workflow databases are up-to-date.

### Scheduled jobs

#### [`asl-data-exports`](https://github.com/UKHomeOffice/asl-data-exports)

There are a number of reports and data extracts which are too resource intensive to be able to generate on demand. These are instead generated by a worker which runs periodically to find any queued reports in a corresponding table in the licence database and generate the requested assets and stores them in S3. This worker runs every 5 minutes in production.

This repo also contains a monthly job to queue the generation of the previous months tasks processed report.

#### [`asl-workflow`](https://github.com/UKHomeOffice/asl-workflow)

This repo contains two nightly scheduled jobs:

* mark any tasks which have passed their statutory or internal deadlines for processing as having expired
* close any amendment tasks which relate to now expired projects

#### [`asl-search`](https://github.com/UKHomeOffice/asl-search)

Runs a nightly rebuild of all search indexes so that any discrepancies are resolved.

#### [`asl-notifications`](https://github.com/UKHomeOffice/asl-notifications)

Runs a worker every 5 minutes to send queued notifications to the emailer service.

Runs a number of nightly jobs to trigger notifications to users with expiring licences or upcoming requirements such as PIL review or RA submission.
