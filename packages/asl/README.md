# asl

## About

Web server serving the establishment facing UI for managing licences

## Usage

To run a local instance:

```
npm run dev
```

To rebuild js and css assets:

```
npm run build
```

## Dependencies

* `@asl/service/ui` provides the common ui boilerplate - auth, sessions, static asset serving, CSP etc.
* `@asl/pages` provides the react components for the pages and layouts

## Configuration

The service can be configured for local development by setting environment variables in a `.env` file.

The following environment variables are required:

* `API_URL` - the hostname of the downstream API service
* `SESSION_SECRET` - an arbitrary string used to sign session data
* `JWT_SECRET` - secret used to sign invitation tokens. Needs to match the same variable in `asl-resolver`.
* `KEYCLOAK_REALM` - the keycloak realm used for authentication
* `KEYCLOAK_URL` - the url of the keycloak server
* `KEYCLOAK_CLIENT` - the client name used to authenticate with keycloak
* `KEYCLOAK_SECRET` - the secret used to authenticate with the keycloak client
* `PERMISSIONS_SERVICE` - the hostname of the downstream permissions service
* `PDF_SERVICE` = the hostname of the html to pdf service
* `ATTACHMENTS_SERVICE` = the hostname of the attachments S3 proxy service
* `BODY_SIZE_LIMIT` = the size limit for body parser (PPL updates only)

The following environment variables can be optionally defined:

* `PORT` - port that the service will listen on - default `8080`
* `REDIS_HOST` - host of the redis server used for session storage - default `localhost`
* `REDIS_PORT` - port of the redis server used for session storage - default `6379`
* `REDIS_PASSWORD` - password of the redis server used for session storage - default `undefined`
* `VERBOSE_ERRORS` - show verbose errors in client. Default `undefined`
* `INTERNAL_URL` - the hostname of the internal facing ui - default `undefined`


## Connected services

### Upstream

None

### Downstream

The following services must be available in order to run:

* `asl-public-api` - to access licence data
* `redis` - to store serialised session data
* `asl-permissions` - to authenticate user tasks

## Development

Very little code actually resides in this repo, so development is most likely to occur on one of the dependent modules.

### Using linked modules

To link a local development version of a dependency - in this example `@asl/pages`:

```bash
# in the module's directory - e.g. ~/dev/asl-pages
npm link

# in this project's directory
npm link @asl/pages
```

This will then use your local version of `@asl/pages` when you `require('@asl/pages')`.

_Note: if you run `npm install [pkg]` then this will undo the linking and revert to the npm registry version, so you will need to re-execute the second command above._

### Watching dependencies

If you are working in a linked version of `@asl/pages` you will likely need to recompile js assets when you make changes. To do this run:

```
npm run build:js -- --watch
```

To force the server to restart on changes watch your linked directory:

```
npm run dev -- -w ../path/to/asl-pages
```

### Testing

To run basic tests including eslint and unit tests:

```
npm test
```

To run the full functional test suite in an automated browser:

```
npm run test:functional:local
```
