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
    title: () => <Acronym>NACWO</Acronym>
  }
};

const Places = ({
  store,
  establishment: { name },
}) => (
  <App
    store={store}
    crumbs={['Licensed premises']}
    scripts={['/public/js/pages/places.js']}
  >
    <header>
      <h2>{name}</h2>
      <h1>Licensed premises</h1>
    </header>
    <FilterTable formatters={formatters} />
  </App>
);

export default connect(Places);
