# @ukhomeoffice/react-components

A set of react components to build the basic elements described in [GOV.UK Design System](https://design-system.service.gov.uk/).

## Details

This is a fork of [govuk-react-components](https://github.com/lennym/govuk-react-components) which replaces
the older [govuk_frontend_toolkit](https://github.com/alphagov/govuk_frontend_toolkit) with the newer
[govuk-frontend](https://github.com/alphagov/govuk-frontend) styles based on the GOV.UK Design System, and adds some
additional Home Office specific components.

## Using components

[Authenticate with GitHub packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token)

Install the package and any dependencies you have:
```bash
# Install @ukhomeoffice/react-components
npm install --save @ukhomeoffice/react-components

# This project assumes react & prop-types are installed already. If not use the following
npm install --save @ukhomeoffice/react-components react prop-types
```

Components can then be used in the following way:
```jsx
import React from 'react';
import { Input, Button } from '@ukhomeoffice/react-components';

const MyForm = () => (
  <form>
    <Input name="name"
           label="First name"
           hint="Some additional information"
           error="Oh no! You broke it!"
           value="HELLO!"
    />
    <Button>Submit</Button>
  </form>
);

export default MyForm;
```

## Examples

There is a basic example app in `./example`. To run it:

```
$ cd example
$ npm start
$ open http://localhost:8080
```

## Publishing

This is automatically published to the GitHub packages npm repository using GitHub Actions.

When opening a pull request add a label `major`, `minor` or `patch` (or `skip-release`) and the version field in package.json will be updated by the pipeline using `npm version`.

It is published once the pull request is merged if there is no `skip-release` label on the pull request, the SHA is also tagged with the SemVer value at that point.
