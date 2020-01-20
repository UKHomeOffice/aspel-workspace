import React from 'react';
import { useSelector } from 'react-redux';
import Layout from '@asl/pages/pages/establishment/licence-fees/views';
import { Snippet } from '@asl/components';

export default function Container({ children, tab }) {
  const year = useSelector(state => state.static.fees.year);

  const tabs = [
    {
      page: 'fees.overview',
      key: 'fees.tabs.overview',
      year
    },
    {
      page: 'fees.establishments',
      key: 'fees.tabs.establishments',
      year
    }
  ];

  return (
    <Layout tabs={tabs} tab={tab} subtitle={<Snippet>subtitle</Snippet>}>
      { children }
    </Layout>
  )
}
