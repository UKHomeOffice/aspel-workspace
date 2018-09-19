# asl-constants

Provides a home for any commonly used values shared across the ASL project.


## Usage

Install the package:

```bash
npm install @asl/constants --save-prod
```

Import as necessary:

```js
const { establishmentCountries, establishmentStatuses } = require('@asl/constants');
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
