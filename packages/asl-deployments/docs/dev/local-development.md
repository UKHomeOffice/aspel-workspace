---
title: Local development
order: 20
---

* Table of contents
{:toc}

A local instance of the entire system can be run using docker compose.

The configuration and tooling for this can be found in the [`asl-conductor`](https://github.com/UKHomeOffice/asl-conductor) repository in GitHub.

This allows individual services from the docker stack to be swapped out with local development versions to allow development and testing of services in the context of a complete application stack. If you are working on modules that are dependencies of these services you will need to [link your local copy using `npm link`](#linked-components).  

The instructions for running the conductor service can be found in the [README](https://github.com/UKHomeOffice/asl-conductor/blob/master/README.md) in that repository.

## Keycloak secrets

Locally running ASPeL services use the acp-notprod Keycloak to authenticate users. For this you will need to populate the Keycloak secrets in .env files. These can be obtained from the Kubernetes secret store in the dev namespace:

KEYCLOAK_SECRET:
```bash
kubectl get secret asl-dev-auth --context=acp-notprod_ASL --namespace=asl-dev -o jsonpath='{.data.secret}' | base64 --decode
```
KEYCLOAK_PASSWORD:
```bash
kubectl get secret keycloak-admin --context=acp-notprod_ASL --namespace=asl-dev -o jsonpath='{.data.password}' | base64 --decode
```
KC_EXPORTS_PASSWORD:
```bash
kubectl get secret keycloak-data-exports --context=acp-notprod_ASL --namespace=asl-dev -o jsonpath='{.data.password}' | base64 --decode
```

## Database seeds and migrations

All data sources can be seeded with a fixed set of development data by running `npm run seed` in the conductor root directory.

This will also apply any schema migrations required.

The data for these seeds is maintained in the [`asl-schema` GitHub repo](https://github.com/UKHomeOffice/asl-schema).

## Linked components

When running local instances with some shared components linked using `npm link` you may see an error message about the "rules of hooks". This is due to different instances of certain React components being used in the top-level service and the `npm link`-ed component.

The solution to this is to remove the locally installed versions of the following react modules and install them in a common parent directory. Note these will need to be the same major versions used by other asl-* modules, i.e. `react@16`, `redux@9`, etc.

* `react`
* `react-redux`
* `react-dom`
* `react-router`
* `react-router-dom`

Once modules are linked using `npm link`, run the following in the shared parent directory to remove installed copies of React, and install them only in the parent directory.

```bash
for file in ./**/node_modules/(react|react-dom|react-redux|react-router|react-router-dom); do rm -rf $file; done; npm i;
```
