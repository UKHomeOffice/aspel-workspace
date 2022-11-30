# asl-internal-ui

## About

The internal facing UI service. This is the point of entry for ASRU users and is restricted via an IP whitelist only to the POISE network, or through the ACP Tunnel VPN.

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

## Connected services

### Upstream

None

### Downstream

The following services must be available in order to run:

* `asl-internal-api` - internal API to access licence data
* `asl-public-api` - public API to access licence data
* `redis` - to store serialised session data
* `asl-permissions` - to authenticate user tasks

## Development

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
