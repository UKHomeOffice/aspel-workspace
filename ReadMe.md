# ASPeL Workspace

Monorepo for the ASPeL project. This repository uses NPM Workspaces to manage multiple packages efficiently and `concurrently` to run scripts across these packages simultaneously.

🚧 Work In Progress 🚧

This repo is currently being converted from a submodule repository to an inline code respository. While the conversion is in progress, check for the 🚧 next to any instructions you read as these may no longer be relevant if the submodule you are developing in has already been converted to inline code.

## Table of Contents

1. [Requirements](#requirements)
2. [Install](#install)
3. [Run](#run)
4. [Useful Commands](#useful-commands)
5. [NPM Workspaces](#npm-workspaces)
6. [Tips and Tricks](#tips-and-tricks)

## Requirements

- Node.js (v14 or later)

## Install

### Credentials

You will need to have some authentication tokens set to install modules from home office repositories. Create an `.env` file which looks like this:

```
GITHUB_AUTH_TOKEN=ghp_oam...
ART_AUTH_TOKEN=eyJ2ZX...
```

The GitHub auth token should be a personal access token with read access on private repositories.

The artefactory auth token should be sourced from a member of the developer team.

### Quick start

```sh
npm run reset
```

### Manually

1. **Clone the repository**:

```sh
git clone --recurse-submodules  https://github.com/UKHomeOffice/aspel-workspace
```

2. **Install dependencies**:

```sh
export $(cat .env) && npm install
```
   
3. **🚧 Working on a ticket 🚧**

Each repo's CI/CD expect package-lock.json, when you are working on a ticket you should commit the changes with package-lock.json for a successful build. If you notice the workspace splits out common dependencies in the root's node_modules folder which is not checked in and not a part of the submodule. When committing code from a repo use

```
  npm install || npm install --package-lock-only
```

4. **InteliJ IDE**

Troubleshoot: After cloning the repo, you will see all the repositories in the packages folder. Check git settings and align manually.

```
  IDE settings => version control => directory mapping => click + Add and add the packages from the aspel-workspace/packages location. 
```

After this, you will see git show in IDE plugins.

## Run

**asl** and **asl-internal-ui** are the services you will typically be running in an IDE environment. You can start these automatically with:

```sh
npm run dev
```

To customise the services which will be run when executing this command, add a space separated environment variable to your `.env` file:

```sh
DEV_SERVICES="asl asl-internal-ui asl-internal-api"
```

Once services have been started, the ideal way so far we discovered is to run the [**asl-conductor**](https://github.com/UKHomeOffice/asl-conductor) with this script:

```sh
npm start -- --local asl --local asl-internal-ui
```

## Useful Commands

- **Install dependencies:** `npm install`
- **Run a script in a specific package:** `npm run <script> -w <package_name>`
- **Run a script in monorepo root:** `npm run <script>`
- **Add a dependency to a specific package:** `npm install <dependency_name> -w <package_name>`
- **🚧 Checkout master/main in all submodules 🚧:** `git submodule foreach 'git checkout main || git checkout master'`
- **🚧 Pull latest changes in all branches 🚧:** `git submodule foreach git pull`

## NPM Workspaces

### Configuration

The workspace configuration is defined in the root `package.json`:

```json
{
  "name": "aspel-workspace",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

### Adding Dependencies

To add a dependency to a specific package:

```sh
npm install <dependency_name> -w <package_name>
```

To add a dependency to the monorepo:

```sh
npm install <dependency_name>
```

This second command should not be used to install dependencies required by our sub packages. Only dependencies used by the monorepo root (for CI/test/scripting e.t.c).

### Removing Dependencies

To remove a dependency from a specific package:

```sh
npm uninstall <dependency_name> -w <package_name>
```

To remove a dependency from the monorepo:

```sh
npm uninstall <dependency_name>
```

This second command will not remove depdencies from sub packages if they are also declared there. Only dependencies in the monorepo root `package.json`.

### Running Scripts

To run a script in a specific package:

```sh
npm run <script> -w <package_name>
```

To run a script for the monorepo:

```sh
npm run <script>
```

This second command will only run scripts declared in the root `package.json`, not in sub packages.

## Tips and Tricks

### ESLint

ESLint relative extends don't work in both the workspace and CI/CD at the same time, as the installation path changes 
between the two. The rules have been moved to `@ukhomeoffice/eslint-config-asl`, so if a module hasn't been updated yet
update the package.json to use `"@ukhomeoffice/eslint-config-asl": "^3.0.0"` and update .eslintrc to 

```yaml
extends:
  - "@ukhomeoffice/asl"
```

You can get ESLint feedback and automatic fixes as you work in IntelliJ. Go to IntelliJ settings > Languages & 
Frameworks > JavaScript > ESLint. Change the radio group to "Automatic ESLint configuration", and check 
"Run eslint --fix on save".

### 🚧 Git Commit | PR 🚧

Please ensure the `package-lock.json` is available when you are committing. Bump up the `package.json` version along with the changes. Once you are happy with the work, always reset the workspace and stash changes to prevent workspace breakage.

To reset the workspace, delete the `node_modules` folder in `packages/*` so that when you re-run the command below, it recreates the dependency tree suitable for the workspace:

```sh
yarn run dev
```
