# ASPeL Workspace

This repository uses Yarn Workspaces to manage multiple packages efficiently and `concurrently` to run scripts across these packages simultaneously.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Yarn Workspaces](#yarn-workspaces)
5. [Running Scripts Concurrently](#running-scripts-concurrently)
6. [Useful Commands](#useful-commands)
7. [Tips and Tricks](#tips-and-tricks)

## Introduction

This repository is a monorepo that houses multiple packages. It uses Yarn Workspaces to streamline dependency management and the `concurrently` package to run multiple scripts in parallel.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn (v1.22 or later)
- How workspaces works? [Link Here](https://collaboration.homeoffice.gov.uk/display/ASPEL/Setup+local+Environment+ASPeL)
### Installation

***
# Quick start
 ```bash
    ./reset-aspel-workspace.sh
 ````
or
   ```shell
   npm run reset
   ```
***

# Manually
1. Clone the repository:

   ```sh
   git clone --recurse-submodules  https://github.com/UKHomeOffice/aspel-workspace
   ```

2. Install dependencies:

   ```sh
   yarn install
   ```
   
3. Working on a ticket
   Each repo's CI/CD expect package-lock.json, when you are working on a ticket you should commit the changes with package-lock.json for a successful build. If you notice    the workspace splits out common dependencies in the root's node_modules folder which is not checked in and not a part of the submodule. When committing code from a repo use
   ```
     npm install || npm install --package-lock-only
   ```

4. InteliJ IDE
   Troubleshoot: After cloning the repo, you will see all the repositories in the packages folder. Check git settings and align manually.
    
   ```
      IDE settings => version control => directory mapping => click + Add and add the packages from the aspel-workspace/packages location. 
   ```
   After this, you will see git will show in IDE plugins.

## Project Structure

```
aspel-workspace/
│
├── packages/
│   ├── asl/
│   ├── asl-internal-ui/
│   ├── asl-resolver/
│   └── ....
│
├── package.json
└── yarn.lock
```

## Yarn Workspaces

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
cd packages/asl
yarn add package-name
```

To add a dependency to all workspaces:

```sh
yarn add -W package-name
```

### Removing Dependencies

To remove a dependency to a specific package: When it is version conflict or only required in one module.

```sh
cd packages/asl
yarn remove package-name
```

To remove a dependency to all workspaces: When a dependencies are used in multiple modules. 

```sh
yarn remove -W package-name
```

### Running Scripts

To run a script in a specific package:

```sh
yarn workspace asl run script-name
```

To run a script in all workspaces:

```sh
yarn workspaces run script-name
```

## Typical method to run dev server

**asl** and **asl-internal-ui** are the services you will be running in an IDE environment, The ideal way so far we discovered is to run the 

**asl-conductor** with this script:

```sh
npm start -- --local asl --local asl-internal-ui
```
The above script will run asl-conductor container tunnelling **asl** & **asl-internal-ui** to your IDE's local host AKA this workspace. The best way to run the workspace is as follow: 

1 - aspel-workspace/packages/**asl & asl-internal-ui**/package.json => click on the **start button** next to dev.

_Happy coding :)_

## Running Scripts Concurrently

Use the `concurrently` package to run scripts across multiple packages. Add it as a dev dependency if not already installed:

```sh
yarn add concurrently --dev
```

### Example Script

In the root `package.json`, add a script to run multiple dev servers:

```json
{
  "scripts": {
    "dev": "concurrently --kill-others-on-fail \"yarn workspace asl run dev\" \"yarn workspace asl-com run dev\" \"yarn workspace asl-serv run dev\""
  }
}
```

Run the script:

```sh
yarn run dev
```
Here is the revised text in Markdown format:

## Useful Commands

- **Install dependencies:** `yarn install`
- **Run a script in a specific package:** `yarn workspace <package-name> run <script-name>`
- **Run a script in all workspaces:** `yarn workspaces run <script-name>`
- **Add a dependency to a specific package:** `yarn workspace <package-name> add <dependency-name>`
- **Checkout master/main in all submodules:** `git submodule foreach 'git checkout main || git checkout master'`
- **Pull latest changes in all branches** `git submodule foreach git pull`

Feel free to adjust the repository URL and package names as needed!

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

### Git Commit | PR

Please ensure the `package-lock.json` is available when you are committing. Bump up the `package.json` version along with the changes. Once you are happy with the work, always reset the workspace and stash changes to prevent workspace breakage.

To reset the workspace, delete the `node_modules` folder in `packages/*` so that when you re-run the command below, it recreates the dependency tree suitable for the workspace:

```sh
yarn run dev
```
