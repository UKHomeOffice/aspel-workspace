import React from 'react';
import App from './layouts/app';
import connect from '../src/helpers/connector';
import FilterTable from './components/filter-table';
import Acronym from './components/acronym';
import Join from './components/join';

const joinAcronyms = arr => <Join>{ arr.map(a => <Acronym key={a}>{a}</Acronym>) }</Join>;

export const formatters = {
  suitability: { format: joinAcronyms },
  holding: { format: joinAcronyms },
  nacwo: {
    format: (name, nacwo) => nacwo
      ? <a href={`/profile/${nacwo.profile.id}`}>{ name }</a>
      : '-',
    title: key => <Acronym>{key.toUpperCase()}</Acronym>
  }
};

const Places = ({
  store,
  establishment: { name },
  list: { schema, filtered }
}) => (
  <App
    store={store}
    crumbs={['Licensed premises']}
    scripts={['/public/js/pages/places.js']}
  >
    <h2 className="headline">{name}</h2>
    <h1>Licensed premises</h1>
    <FilterTable schema={schema} formatters={formatters} data={filtered} />
  </App>
);

export default connect(Places, 'list');
