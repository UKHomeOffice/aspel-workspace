import React, { Fragment } from 'react';
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
  const hasData = useSelector(state => state.datatable.data.rows.length) > 0;
  const allowedActions = useSelector(state => state.static.allowedActions);
  const canUpdate = allowedActions.includes('trainingCourse.update');

  const tabs = [
    {
      page: 'categoryE.course.list',
      key: 'courses',
      label: <Snippet>landingPage.tabs.courses</Snippet>
    },
    {
      page: 'categoryE.licence.list',
      key: 'licences',
      label: <Snippet>landingPage.tabs.licences</Snippet>
    }
  ];
  return (
    <>
      <Header
        title={<Snippet>landingPage.title</Snippet>}
        subtitle={<EstablishmentHeader establishment={establishment}/>}
      />
      {
        canUpdate && (
          <Fragment>
            <Snippet optional>landingPage.subtitle</Snippet>
            <p>
              <Link className="govuk-button" page="pils.courses.create" label={<Snippet>landingPage.buttons.add</Snippet>} />
            </p>
          </Fragment>
        )
      }
      <Tabs active={tabs.findIndex(tab => tab.key === activeTab)}>
        {
          tabs.map(tab => <Link key={tab.key} page={tab.page} label={tab.label} />)
        }
      </Tabs>
      { children }
      {
        !hasData && !canUpdate && <p><Snippet>landingPage.cannotUpdate</Snippet></p>
      }
    </>
  );
}
