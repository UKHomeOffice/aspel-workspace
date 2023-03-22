# asl-constants

Provides a home for any commonly used values shared across the ASL project.

## Usage

[Authenticate with GitHub packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token)

Install the package:

```bash
npm install @ukhomeoffice/asl-constants --save-prod
```

Import as necessary:

```js
const { establishmentCountries, establishmentStatuses } = require('@ukhomeoffice/asl-constants');
console.log(establishmentCountries);
```

result:
```bash
[
  'england',
  'scotland',
  'wales',
  'ni'
]
```

## Publishing

This is automatically published to the GitHub packages npm repository using GitHub Actions.

When opening a pull request add a label `major`, `minor` or `patch` (or `skip-release`) and the version field in package.json will be updated by the pipeline using `npm version`.

It is published once the pull request is merged if there is no `skip-release` label on the pull request, the SHA is also tagged with the SemVer value at that point.
