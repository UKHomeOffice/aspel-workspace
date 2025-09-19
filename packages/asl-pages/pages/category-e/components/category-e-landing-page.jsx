import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import {
  Link,
  Snippet,
  Header,
  Tabs
} from '@ukhomeoffice/asl-components';
import EstablishmentHeader from '../../common/components/establishment-header';

export default function CategoryELandingPage({ children, activeTab }) {
  const { establishment } = useSelector(state => state.static, shallowEqual);
  const tabs = [
    {
      page: 'categoryE.course.list',
      key: 'courses',
      label: <Snippet>tabs.landingPage.courses</Snippet>
    },
    {
      page: 'categoryE.licence.list',
      key: 'licences',
      label: <Snippet>tabs.landingPage.licences</Snippet>
    }
  ];
  return (
    <>
      <Header
        title={<Snippet>title</Snippet>}
        subtitle={<EstablishmentHeader establishment={establishment}/>}
      />
      <Tabs active={tabs.findIndex(tab => tab.key === activeTab)}>
        {
          tabs.map(tab => <Link key={tab.key} page={tab.page} label={tab.label} />)
        }
      </Tabs>
      { children }
    </>
  );
}
