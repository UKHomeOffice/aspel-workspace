---
title: Using Artifactory as a private npm registry
order: 30
---

* Table of contents
  {:toc}


## Requirements

This guide makes the following assumptions:

* you have Drone CI set up for your project already
* you are using `node@8` and `npm@5` or later
* you are connected to ACP Kube VPN

## Setting up a local environment

### Login to ACP's Elastic Container Registry

Visit https://hub.acp.homeoffice.gov.uk/identities and store the credentials in the Amazon ECR section in your credentials file (`~/.aws/credentials`):

```
[acp-ecr]
aws_access_key_id=access_id_goes_here
aws_secret_access_key=access_key_goes_here
```

Use the `acp-ecr` profile, and log docker into the registry:

```bash
export AWS_PROFILE="acp-ecr"
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin 340268328991.dkr.ecr.eu-west-2.amazonaws.com
```

### Get your username and API key from artifactory

Visit [https://artifactory.digital.homeoffice.gov.uk/artifactory/webapp/#/profile](https://artifactory.digital.homeoffice.gov.uk/artifactory/webapp/#/profile), make a note of your username, and if you don't already have an API key then generate one.

### base64 encode your API key

```
echo -n <api key> | base64
```

### Create a personal access token in Github

Visit [https://github.com/settings/tokens](https://github.com/settings/tokens), generate a new token with access to the ASL repos.

### Set local environment variables

Copy your encoded password, and set the following environment variables in your bash profile:

```
export ART_AUTH_TOKEN=<base64 encoded api key>
export GITHUB_AUTH_TOKEN=<github token>
export NODE_AUTH_TOKEN=<github token>
```

If you can't generate an `ART_AUTH_TOKEN` that works, ask an existing developer for the key used by the automatic tools. 

You might then need to `source` your profile to load these environment variables.

## Setting up CI in drone

### Request a bot token for artifactory

You can do this through the [ACP Hub](https://hub.acp.homeoffice.gov.uk/help/support/requests/new/artifactory-bot). You'll need to provide a username for the bot when you create it.

One of the ACP team will create a token and send it to you as an encrypted gpg file via email.

Decrypt the token

```
gpg --decrypt ./path/to/file.gpg
```

### Add the token to drone as a secret

First, base64 encode the token:

```
echo -n "<token>" | base64
```

Then add this token to drone as a secret in the Drone settings UI for your repo.

Note: you will need to make the secret available to pull request builds to be able to run npm commands in pull request steps

### Expose credentials to build steps

You will need to configure any steps which use npm to be able to access the credentials. Do this by defining environment variables to those steps as follows:

```yaml
steps:
  - name: install
    image: node:16
    environment:
      ART_AUTH_TOKEN:
        from_secret: art_auth_token
      GITHUB_AUTH_TOKEN:
        from_secret: github_auth_token
```

## Publishing modules to artifactory

It is strongly recommended to use a common namespace to publish your modules under. npm allows namespace specific configuration, which makes it easier to ensure that modules are always installed from artifactory, and will not accidentally try to install a public module with the same name.

### Setting publish registry

Add `publishConfig` to package.json. This ensures that the module can only ever be published to the private registry, and misconfiguration won't accidentally make it public

```json
"publishConfig": {
  "registry": "https://artifactory.digital.homeoffice.gov.uk/artifactory/api/npm/npm-virtual/"
}
```

### Add auth settings

In your project's `.npmrc` file (create one if it does not already exist) add the following lines:

```
registry=https://registry.npmjs.org/

@ukhomeoffice:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_AUTH_TOKEN}

@asl:registry = https://artifactory.digital.homeoffice.gov.uk/artifactory/api/npm/npm-virtual/
//artifactory.digital.homeoffice.gov.uk/artifactory/api/npm/npm-virtual/:_authToken=${ART_AUTH_TOKEN}
//artifactory.digital.homeoffice.gov.uk/artifactory/api/npm/npm-virtual/:always-auth=true
```

The email address can be anything, it just needs to be set.

### Add publish step to drone

Add the following step to your `.drone.yml` file to publish a new version whenever you release a tag.

```yaml
steps:
  - name: publish
    image: node:16
    environment:
      NPM_AUTH_USERNAME:
        from_secret: npm_auth_username
      NPM_AUTH_TOKEN:
        from_secret: npm_auth_token
    commands:
      - npm publish
    when:
      event:
        - tag
```

Now, when you push new tags to github then drone should publish them to the artifactory npm registry automatically.

## Using modules from artifactory as dependencies

### Configure your project to use artifactory

In the project which is has private modules as dependencies, add the following line to `.npmrc` in the root of the project (create this file if it does not exist).

```
@<namespace>:registry = https://artifactory.digital.homeoffice.gov.uk/artifactory/api/npm/npm-virtual/
```

This will ensure that any module under that namespace will only ever install from artifactory, and never from the public registry

If using multiple namespaces then add a line for each namespace.

If the modules you are installing are not namespaced in artifactory, you can add the line with the namespace removed (i.e. `registry = ...`) but this will have a negative impact on install speed.

You should then add the following line to your project's `.npmrc` if they are not already there:

```
//artifactory.digital.homeoffice.gov.uk/artifactory/api/npm/npm-virtual/:username=${NPM_AUTH_USERNAME}
//artifactory.digital.homeoffice.gov.uk/artifactory/api/npm/npm-virtual/:_password=${NPM_AUTH_TOKEN}
```

You should now be able to install modules from artifactory into your local development environment.

## Installing dependencies in docker

If you build a docker image as part of your CI pipeline, you will need to copy the `.npmrc` file into your image before installing there. You will also need to pass the npm credentials as secrets to the `npm ci` command.

Example `Dockerfile`:

```dockerfile
# syntax=docker/dockerfile:1.2
FROM quay.io/ukhomeofficedigital/asl-base:v16

RUN apk upgrade --no-cache
COPY .npmrc /app/.npmrc
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN --mount=type=secret,id=token \
    --mount=type=secret,id=username \
    NPM_AUTH_USERNAME=`cat /run/secrets/username` \
    NPM_AUTH_TOKEN=`cat /run/secrets/token` \
    npm ci --production --no-optional --ignore-scripts

COPY . /app
RUN rm /app/.npmrc
USER 999

CMD node index.js
```

When building the image, you will need to pass the username and token variables into docker with the `--secret` flag.

```
docker build --secret id=token,env=ART_AUTH_TOKEN --secret id=github_token,env=GITHUB_AUTH_TOKEN  .
```
