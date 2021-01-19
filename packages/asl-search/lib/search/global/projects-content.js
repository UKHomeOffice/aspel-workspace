const sortParams = require('../helpers/sort-params');

const index = 'projects-content';

module.exports = client => async (term = '', query = {}) => {
  const params = {
    index,
    ...sortParams(query, [])
  };

  params.body.query = {
    bool: {}
  };
  params.body.highlight = {
    type: 'plain',
    fragmenter: 'span',
    number_of_fragments: 1,
    pre_tags: '**',
    post_tags: '**',
    fragment_size: 250,
    fields: {
      'content.*': {},
      'title': {
        require_field_match: false
      }
    }
  };

  if (query.filters && query.filters.status && query.filters.status[0]) {
    const filter = { term: {} };
    filter.term.status = query.filters.status[0];
    params.body.query.bool.filter = filter;
  }

  if (!term) {
    return client.search(params);
  }

  // search subset of fields
  const fields = [
    'content.*'
  ];

  params.body.query.bool.minimum_should_match = 1;
  params.body.query.bool.should = [
    {
      multi_match: {
        fields,
        query: term,
        type: 'phrase',
        operator: 'and'
      }
    },
    {
      match: {
        title: {
          query: term,
          boost: 1.5
        }
      }
    }
  ];

  return client.search(params);
};
