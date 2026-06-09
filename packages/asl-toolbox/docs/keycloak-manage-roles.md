# Keycloak: Manage Roles Tool

Command line tool for managing feature flag roles in bulk.

## Usage

This can be run in ASPeL namespaces by executing a shell into an asl-toolbox instance.

### Pre-requisites

There needs to be a service client set up in the keycloak realm with the following realm-management roles as Service account roles:

- `query-users` - query all users
- `view-users` - list roles for a user
- `manage-users` - update roles for a user
- `view-realm` - query roles and composite roles
- `manage-realm` - add or update roles and composite roles

The following environment variables must be set:

- `KEYCLOAK_BASE_URL`, the full keycloak instance url e.g. https://acp-sso-admin.notprod.acp.homeoffice.gov.uk
- `KEYCLOAK_REALM`, the realm to manage e.g. asl-dev
- `KEYCLOAK_CLIENT_ID`, the id of the service client e.g. asl-feature-role-management
- `KEYCLOAK_CLIENT_SECRET`, The client secret from keycloak

### CLI interface

```sh
./keycloak-manage-roles.js command [opts]
```

Command can be one of:

- `add-role` - Add the provided role to all users, and to the default roles for new users
- `remove-role` - Remove the provided role from all users, and from the default roles for new users

Options:

| Option                   |                                                                                             |
|--------------------------|---------------------------------------------------------------------------------------------|
| `--role=<string>`        | The role to add or remove. Must be provided for add-role or remove-role commands            |
| `--description=<string>` | If the role does not already exist, this must be provided so that a new role can be created |
| `--filename=<string>`    | Override the name of the output CSV that records what users were affected                   |
