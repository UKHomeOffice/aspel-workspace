const ntsDateKeys = ['date-from', 'date-to'].flatMap(name => ['day', 'month', 'year'].map(part => `${name}-${part}`));

function getNtsFormValues(query) {
  return Object.fromEntries(
    [...ntsDateKeys, 'ra']
      .filter(key => typeof query[key] === 'string')
      .map(key => [key, query[key]])
  );
}

module.exports = getNtsFormValues;
