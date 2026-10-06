function getNtsRedirectQuery(query) {
  const redirectQuery = new URLSearchParams({ tab: 'nts', validateNtsDates: 'true' });

  ['date-from', 'date-to'].forEach(name => {
    ['day', 'month', 'year'].forEach(part => {
      const key = `${name}-${part}`;
      if (query[key]) {
        redirectQuery.set(key, query[key]);
      }
    });
  });

  if (query.ra !== undefined) {
    redirectQuery.set('ra', query.ra);
  }

  return redirectQuery.toString();
}

module.exports = getNtsRedirectQuery;
