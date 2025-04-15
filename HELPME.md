# Troubleshooting

Troubleshooting and general advice for using the `aspel-workspace` monorepo.

## 1. How can we use a common dependency declaration for all workspaces?

Be aware that by doing this, we are saying that all workspaces must install this dependency. A frontend-only dependency reinstalled in the root is now a dependency for backend services as well. This could be mitigated by having multiple workspace roots to separate frontend and backend dependencies. You should not move local dependency declarations using `file:../..` to the root as these are required for CI to test and build source code correctly per package.

### a. Regenerate package-lock.json

You can remove the references from the sub packages and put just one in the root `package.json` file. Then regenerate the `package-lock.json` file:

```diff
// packages/a/package.json
{
  "dependencies": {
-   "react": "^16.9.0"
  }
}
```

```diff
// packages/b/package.json
{
  "dependencies": {
-   "react": "^17.0.0"
  }
}
```

```diff
// package.json
{
  "dependencies": {
+   "react": "^17.0.0"
  }
}
```

```shell
aspel-workspace % rm package-lock.json
aspel-workspace % npm install
```

Without regenerating the lock file, it has been observed that dependencies will often simply default to their original configuration and ignore the new `package.json` references.

This is not guaranteed to produce a stable build because the versions and install locations for all dependencies are recalculated, meaning unrelated files may be affected. It is generally advisable not to delete the `package-lock.json` file unless absolutely necessary.

### b. Reinstall over CLI

You can use the NPM CLI to iteratively reinstall the dependencies. This is the more reliable option because only the specific packages you are targeting will be affected, and the lock file will be modified in place as a result of these commands.

To replicate the example above, first uninstall all the dependencies from each sub package:

```sh
aspel-workspace % npm uninstall -w a react
aspel-workspace % npm uninstall -w b react
```

Then reinstall the dependency at the root of the workspace:

```sh
aspel-workspace % npm install react
```

## 2. How do I update the version for a workspace dependency?

You can try to use `npm update` to update the version for a workspace dependency:

```sh
aspel-workspace % npm update -w a react
```

If this fails or produces an inconsisent build, try to reinstall the package, optionally with your desired version:

```sh
aspel-workspace % npm uninstall -w a react
aspel-workspace % npm install -w a react@19
```

Be mindful of where the dependency has actually been installed once you have done this. Generally, if this version is different from the versions used by other workspaces, then the dependency version installed in the root `node_modules` will remain unchanged. A new version of the dependency will be installed in the `node_modules` local to that workspace. If this workspace had a different version to the common version and now it is the same, then the local version will be removed from `node_modules` and only the root version will remain.

## 3. Why did the Trivy scan fail with a layer cache error?

Layer caching often seems to fail when there are too many concurrent builds in a pipeline. The only solution currently is to run the pipeline again, and try to avoid running too many pipelines at the same time.

## 4. Why did my pull request not trigger a deployment?

### a. Has your build stage been added to the deployset script?

The name of the build stage must be added to the deployset script to be considered for deployment:

```yaml
BUILD_STAGES: asl asl-attachments asl-data-exports ... <your_stage>
```

### b. Does the name of the build stage match the key found in the versions.yml file?

The deployset script will write the name of the build stage and the current commit hash to the versions file as a key-value pair. If this is not a pair that `asl-deployments` is expecting, nothing will be deployed.

### c. Did the source files for the service actually change as a part of the pull request?

The changeset script prevents services from being deployed unless the file contents of their directory, or a directory they depend on, has been changed as a part of the pull request. Changes to external files like `package-lock.json` or `.drone.yml` will have no effect. Changing the version number or simply adding a space to a file will be enough to trigger the deployment for a service.

## 5. Why is my dependency being installed in an unexpected place?

To understand how NPM workspaces resolves the install location for dependencies. Consider this example using a fresh repository with no packages installed.

```
/packages
  /a
    package.json
  /b
    package.json
package.json
package-lock.json
```

If we run:

```sh
aspel-workspace % npm install -w a react@18
```

Then the resultant repository structure will be:

```
/node_modules
  /react@18
/packages
  /a
    package.json
  /b
    package.json
package.json
package-lock.json
```

If we now run:

```sh
aspel-workspace % npm install -w b react
```

Then the repository structure will be:

```
/node_modules
  /react@18
/packages
  /a
    package.json
  /b
    /node_modules
      /react@^19
    package.json
package.json
package-lock.json
```

If we then run:

```sh
aspel-workspace % npm uninstall -w a react
```

Then the repository structure will be:

```
/node_modules
/packages
  /a
    package.json
  /b
    /node_modules
      /react@^19
    package.json
package.json
package-lock.json
```

Even if we reinstall all the node modules at this point, `react@^19` will remain in the local node modules folder for package `b`. Finally, if we run:

```sh
aspel-workspace % npm install -w a react
```

Then version `react@^19` will be installed in the root node modules. If we reinstall all the node modules at this point, then the repository structure will be:

```
/node_modules
  /react@^19
/packages
  /a
    package.json
  /b
    package.json
package.json
package-lock.json
```

As you can see, this effectively shifts the location of the installation for package `b` even though we ran no new commands against this workspace. This will only happen if `b` shares the version which is currently in the root, NOT if there is no version in the root at all.

## 6. Why is a script or service complaining about a missing module, or a missing module file?

This is the most difficult to debug as it could have many causes. The reason usually comes down to one of three options:

### a. The module has not actually been installed

Make sure you are not running install with these options `npm install --omit=optional` or `npm install --omit=dev`. Run `npm run rest` and `npm install` again to get a fresh dependency installation. Look in both the `node_modules` local to the consumer package and the root `node_modules` to check that it is there.

If you are not using these options, consider explicitly installing the missing package for the workspace with `npm install -w <workspace_name> <package_name>@<package_version>`. This may be required even if none of your source code actually calls in to this package. Examples have been found of our dependencies not declaring their own required dependencies correctly.

### b. An unexpected version has been installed

This is most likely to happen when the `package-lock.json` file has been regenerated. Look at the module's source code in `node_modules` and confirm that the version matches the one expected by the calling module (or your own code). If the version is mismatched, you can try to reinstall the dependency first at the individual workspace level and then at root level if that fails.

Remember that the first version installed for a dependency will remain in the root until all references to that version have been uninstalled. Different versions will be installed in each local `node_modules` folder until the root version is completely uninstalled, at which point the next installation of the dependency will create the new root version.

### c. The caller is looking in the wrong place

If you run an executable from the root `node_modules`, it will look for all of its dependencies in the root `node_modules`. This is true even if the originating script is from a workspace. If that executable needs a particular module or module version to be available, you must reengineer the dependencies such that it gets installed in the root folder.

Again, remember that the dependency version installed in the root is that which was installed first. To change the root version, the current version must be uninstalled from all workspaces first.

## 7. How can I migrate another submodule into this repository?

First, set up the remote repository as a submodule at the desired directory location and commit the change:

```sh
aspel-workspace % git checkout -B merge-<submodule_name>
aspel-workspace % git submodule add <submodule_url> /packages/<submodule_name>
aspel-workspace % git add .
aspel-workspace % git commit -m "Add submodule <submodule_name>"
```

Now run the submodule rewrite script. It is advisable to output the results to a log for inspection and in case manual resolution of tags is need (you forget to push them):

```sh
aspel-workspace % bash scripts/rewrite-submodule-history.sh /packages/<submodule_name> <target_branch> 2>&1 | tee ../outputs/<submodule_name>-merge-output.txt
```

Note that the target branch defaults to master if not provided. Double check what the default (or desired) branch of your remote repository actually is.

Assuming this completed successfully, the git history will have been rewritten in the submodule folder. You are now free to push these changes and open a PR back to the main branch.

⚠️ Important ⚠️

Any tags which were migrated during the rewrite will remain on your machine until you explicitly push them with:

```sh
aspel-workspace % git push origin --tags
```

Do not do this until you are happy with the changes made and the PR has been merged on to the main branch. If you forget to do this and your local clone is deleted, the new tags will be lost.
