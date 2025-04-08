# Troubleshooting

Troubleshooting and general advice for using the `aspel-workspace` monorepo.

## 1. How can we use a common dependency declaration for all workspaces?

Be aware that by doing this, we are saying that all workspaces must install this dependency. A frontend-only dependency reinstalled in the root is now a dependency for backend services as well. This could be mitigated by having multiple workspaces to separate frontend and backend dependencies. You should not move local dependency declarations using `file:../...` to the root as these are required for CI to test and build source code correctly per package.

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

Be mindful of where the dependency has actually been installed once you have done this. Generally, if this version is different from the versions used by other workspaces, then the dependency version installed in the root `node_modules` will remain unchanged. A new version of the dependency will be installed in the `node_modules` local to that workspace. If this workspace had a different version to the common version and now it is the same, then the local version will be remove from `node_modules` and only the root version will remain.

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

## 5. Why is a script or service complaining about a missing module, or a missing module file?

This is the most difficult to debug as it could have many causes. The reason usually comes down to one of three options:

### a. The module has not actually been installed

Run `npm run rest` and `npm install` again to get a fresh dependency installation. Look in both the `node_modules` local to the consumer package and the root `node_modules` to check that it is there.

If it is not there, make sure you are not running with `npm install --omit=optional` or `npm install --omit=dev`.

If you are not using these options, consider explicitly installing the missing package for the workspace with `npm install -w <workspace_name> <package_name>@<package_version>`. This may be required even if none of your source code actually calls in to this package. Examples have been found of our dependencies not declaring their own required dependencies correctly.

### b. An unexpected version has been installed

This is most likely to happen when the `package-lock.json` file has been regenerated. Look at the module's source code in `node_modules` and confirm that the version matches the one expected by the calling module (or your own code). If the version is mismatched, you can try to reinstall the dependency first at the individual workspace level and then at root level if that fails.

Remember that the first version installed for a dependency will remain in the root until all references to that version have been uninstalled. Different versions will be installed in each local `node_modules` folder until the root version is completely uninstalled, at which point the next installation of the dependency will create the new root version.

### c. The caller is looking in the wrong place

If you run an executable from the root `node_modules`, it will look for all of its dependencies in the root `node_modules`. This is true even if the originating script is from a workspace. If that executable needs a particular module or module version to be available, you must reengineer the dependencies such that it gets installed in the root folder.

Again, remember that the dependency version installed in the root is that which was installed first. To change the root version, the current version must be uninstalled from all workspaces first.
