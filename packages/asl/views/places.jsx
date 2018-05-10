import React from 'react';
import App from './layouts/app';
import connect from '../src/helpers/connector';
import FilterTable from './components/filter-table';
import Acronym from './components/acronym';
import Join from './components/join';
import dict from '@asl/dictionary';

const joinAcronyms = data => {
  if (Array.isArray(data)) {
    return <Join>{ data.map(a => <Acronym key={a}>{a}</Acronym>) }</Join>;
  }
  return <Acronym key={data}>{data}</Acronym>;
};

const defineValue = val => `${dict[val] || dict[val.toUpperCase()]} (${val})`;

export const formatters = {
  suitability: {
    title: 'Suitability',
    format: joinAcronyms,
    formatFilterItems: defineValue
  },
  holding: {
    title: 'Holding',
    format: joinAcronyms,
    formatFilterItems: defineValue
  },
  nacwo: {
    format: (name, nacwo) => nacwo
      ? <a href={`/profile/${nacwo.profile.id}`}>{ name }</a>
      : '-',
    title: <Acronym>NACWO</Acronym>
  }
};

const Places = ({
  store,
  establishment: { name }
}) => (
  <App
    store={store}
    crumbs={['Licensed premises']}
    scripts={['/public/js/pages/common.js', '/public/js/pages/places.js']}
  >
    <header>
      <h2>{name}</h2>
      <h1>Licensed premises</h1>
    </header>
    <FilterTable formatters={formatters} />
  </App>
);

export default connect(Places);
