# ASPeL Workspace CI

This document contains a developer guide to the continuous integration process for the ASPeL Workspace using Drone pipelines.

## Table of Contents

1. [Introduction](#introduction)
2. [Pipeline](#pipeline)
3. [Adding Modules](#adding-modules)
4. [Notes](#notes)

## Introduction

ASPeL Workspace is a monorepo containing many distinct node modules for the purposes of deploying live services as containers, and centralising common code so that it may be used by many different dependent modules. This introduces a number of challenges when trying to deploy individual services with automated pipelines in an efficient manner, particularly when using Drone:

### 1. Not all code changes happen in the service directory

A local package containing common code may be updated but dependent services will not be notified of the change. If the Drone pipeline for a service is placed in its service directory it will only run for changes to files which happen in that directory.

### 2. Not all code changes are relevant to every service

A Drone pipeline placed in the root of the repository will run for changes to any file in the repository. This would result in new images being built for all services even when their contents have not changed. There is currently no built-in feature in Drone to only trigger based on changes to certain file paths.

### 3. Not all packages are required to build each service

When building a container for a live service in one of the modules, all dependent sibling modules must also be included in the build. The naive approach of copying across the entire workspace repository to make all packages available results in bloated containers with unnecssary files.

### 4. Dependencies should be shared across all packages but installable per package

We would like to make use of workspace solutions to minimise the number of repeated dependencies installed across all modules, and ensure different modules are using the same versions for each dependency. It should be possible to install an individual module and its depdendencies without also installing dependencies for sibling modules that it does not depend on.

## Pipeline

The workspace repository makes use of a single root file which contains multiple pipelines - one for each module that requires CI functionality. On any code change in the repository every pipeline will begin and follow the same stategy.

### 1. Clone

The default Drone cloning behaviour automatically merges the source or working branch into the target or main branch, making it more difficult to perform diffing logic between them. Our custom clone logic disables this functionality and performs a standard clone of the remote repository instead.

### 2. Changeset

We now have to determine whether the pipeline should actually run or be skipped and exit early. A pipeline should only be allowed to continue if either:

1. The files in the service directory have changed.
2. The files in a module directory that the service depends on have changed.
3. Both of the above.

To calculate the full set of directory paths which need to be checked for file changes for a given module, the `changeset.js` script is run. This script will:

1. Parse the `package.json` file for a module to a get a list of dependencies.
2. Select dependencies which have been declared using local `file:../..` syntax.
3. Resolve the paths to these dependencies from the root of the repository where the pipeline is running.
4. Ensure the dependencies actually exist.
5. Run a diffing function against each collected path to determine if its files have changed.

Whether or not files have changed depends on the context set by the event which triggered the pipeline. The current supported events are:

#### Push

The files in the source code have changed between the current commit and the last commit on this branch.

```
▼
C
|
|
B
|
|
A
```

In this example files are checked between commits C and B.

#### Pull Request

The files in the source code have changed between the current commit and the head of the target branch.

```
   ▼
C  E
|  |
|  |
B  D
| /
|/
A
```

In this example files are checked between commits E and C.

### 3. Export

We export a list of module paths which cover all local dependencies for the module into the Drone environment - this will be used later during the build stage. The list is calculated using the `modulepaths.js` script, which shares most of the same logic with the `changeset.js` script except it does not execute the diffing functions.

### 4. Prepare

The module has been checked for code changes and either its source code or the source code of one of its local dependencies has changed. The pipeline now proceeds to the remaining steps to install, test, audit or otherwise check the validity of code in the module directory.

Since we are using npm workspaces in this project, all npm commands here should include a `--workspace <workspace_name>` argument to prevent unrelated workspace code from being included, thus limiting our expenditure of compute resources.

### 5. Build

For container based services, we need to perform a Docker build of the module. In an npm workspaces environment this can be a challenge because we only want to include a slice of the total available modules which constitute the service. Dockerfiles should be written to minimise the number of extraneous folders copied across to the final app environment:

1. Copy across all module packages to the build folder.
2. Copy the `package.json`, `.npmrc`, and `package-lock.json` files into the app folder. These are needed to enable workspaces, fetch dependencies, and lock them to shared versions used by all workspaces.
3. Copy relevant module packages from the build to the app folder using the Docker argument `MODULE_PATHS`, provided by our earlier export.
4. Run install in the app folder using `npm ci`. This ensures dependencies are locked to the shared version for all workspaces. Extraneous modules will not be installed because their source packages have not been copied across.
5. Provide a fresh Docker layer for the app environment and copy across installed `node_modules` and required packages. This prevents extraneous module source code from ending up in the app environment.

### 6. Deploy

On a push to the main branch, newly generated images are then added to the `asl-deployments` repository versions list via the `deployset` pipeline stage. This stage will:

1. Poll the Drone API to get information about the current build stages.
2. Look for a specified list of build stages which are eligible for the `versions.yml` file.
3. If all steps for a build stage are successful, exiting with code 0 to indicate none were skipped, then it is added to a list of deployable stages for the versions file.
4. If a single stage fails elsewhere in the pipepline, whether in the list or not, the `deployset` will fail.
5. Read the existing versions from the file on GitHub. Update successful builds with the current commit hash. Write the file back to GitHub.

## Adding Modules

When adding new modules to the workspace you should ensure that dependent modules reference them correctly in their `dependencies` so that their pipelines pick up code changes. If we add a new shared module in `packages/shared` for instance, sibling modules that want to use it should declare it like so:

```json
{
    "dependencies": {
        "shared": "file:../shared"
    }
}
```

If you want to create a pipeline for your new module you should use either the [template.service.yml](./template.service.yml) or [template.common.yml](./template.common.yml) templates as a basis, depending on whether your code requires a Docker build. Find and replace all instances of the `<MODULE_NAME>` string with the name of your module before copying it across to the root [.drone.yml](../.drone.yml) file and adding any further additional steps.

If your module deploys a container, you should add its pipeline stage name to the `deployset` stage list of `BUILD_STAGES`:

```yaml
BUILD_STAGES: asl asl-attachments <new-module> ...
```

## Notes

1. Skipped pipelines will still show as completed with green checkmarks, rather than grey with a skipped icon. This is unfortunately a limitation of Drone and cannot be fixed.
