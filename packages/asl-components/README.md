# asl-components

React.js components for the ASL project

## Development

## Testing

To run basic tests including eslint and unit tests:

```
npm test
```

## Publishing a new version after successful master build

* `git checkout master && git pull`
* `npm version major|minor|patch`
* `git push origin master --tags`
