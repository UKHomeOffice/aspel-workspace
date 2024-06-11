---
title: Troubleshooting common issues
order: 100
---

* Table of contents
{:toc}

### npm link React version error

When running the app with two or more linked npm packages you may be shown the following error:

```
Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons: 1. You might have mismatching versions of React and the renderer (such as React DOM) 2. You might be breaking the Rules of Hooks 3. You might have more than one copy of React in the same app See https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.
```

This can happen when there are two or more different versions of react present within the apps files.
To fix this, go to the directory where you store the repositories and run `npm init` to create a `package.json` file.
In this file, add the following dependencies and run `npm install` to install the packages.

```
    "process": "^0.11.10",
    "react": "^16.9.0",
    "react-dom": "^16.8.6",
    "react-redux": "^7.1.0",
    "react-router": "^5.1.2",
    "react-router-dom": "^5.0.1"
```

After, run the following command, with the directory your new `package.json` is in. This will delete the specific react files in each of the repositories and instead use the shared versions you just installed in the directory the repositories are stored in.

```
for file in ~/<your directory here>/**/node_modules/(react|react-dom|react-redux|react-router|react-router-dom); do rm -rf $file; done;
```

After this you can run `npm i` in your main directory to download the React packages in your new `package.json` you just set up.

### Integration tests relating to changing password or emails are failing

The test users for those tests likely have their credentials in an unexpected state. Log into the dev keycloak console and ensure the email address for the change email test user is `email-change-before@example.com` or reset the password for the change password test user to the standard test password.

Note: searching the user list for `change` should return the two relevant accounts.

### Database permission errors following a deployment

If a database migration added a new table then it will need to have access permissions set on it.

e.g.

```
grant SELECT on newtable to publicapi;
grant SELECT, INSERT, UPDATE, DELETE on newtable to resolver;
```

### Audit failures not resolvable by `npm audit fix`

If a security advisory in a dependency cannot be automatically resolved, and there is no alternative version available then specific advisories can be ignored using the [`ciaudit` module](https://github.com/lennym/ciaudit) to configure an allowlist.

> [Example implementation](https://github.com/UKHomeOffice/asl-internal-ui/blob/7ae4f32f60e40153c36fe789880eb5d4af36a258/.auditignore)

Note that advisories should only be ignored when they have been reviewed and determined not to represent a security risk in production.

### Slow PPL editing due to embedded images

If a PPL is slow when editing it may be due to the size of the ```data``` column in ```project_versions``` table, and be are result of a lot of embedded images.

There is a utility to migrate embedded images to S3 in the asl-attachments project and can be run from the ```attachments``` container.

Connect to the attachments container

```
kubectl exec -it -c app <attachments_container>
```

Run the migration script for the appropriate project version:
```
node scripts/migrate.js <project_version_id>
```

The output should show the images being saved to S3:  

```
Loading data for versionId: <project_version_id>
Traversing data for versionId: <project_version_id>
Found image...
Saving image type: image/png to S3...
Saved with id: <image_token_id>
...
Saving data for versionId: <project_version_id>
```
