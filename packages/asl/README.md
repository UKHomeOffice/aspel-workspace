# asl

## About

The establishment facing UI for managing licences

## Dependencies

* `@asl/service/ui` provides the common ui boilerplate - auth, sessions, static asset serving, CSP etc.
* `@asl/pages` provides the react components for the pages and layouts

## Configuration

The service can be configured for local development by setting environment variables in a `.env` file.

The following environment variables are required:

* `API_URL` - the hostname of the downstream API service
* `SESSION_SECRET` - an arbitrary string used to sign session data
* `KEYCLOAK_REALM` - the keycloak realm used for authentication
* `KEYCLOAK_URL` - the url of the keycloak server
* `KEYCLOAK_CLIENT` - the client name used to authenticate with keycloak
* `KEYCLOAK_SECRET` - the secret used to authenticate with the keycloak client

The following environment variables can be optionally defined:

* `PORT` - port that the service will listen on - default `8080`
* `REDIS_HOST` - host of the redis server used for session storage - default `localhost`
* `REDIS_PORT` - port of the redis server used for session storage - default `6379`
* `REDIS_PASSWORD` - password of the redis server used for session storage - default `undefined`


## Connected services

### Upstream

None

### Downstream

The following services must be available in order to run:

* `asl-public-api` - to access licence data
* `redis` - to store serialised session data
