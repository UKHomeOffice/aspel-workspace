import React, { Fragment } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Header, Link, Snippet, Tabs } from '@ukhomeoffice/asl-components';
import EstablishmentHeader from '../../common/components/establishment-header';

export default function CategoryELandingPage({ children, activeTab }) {
  const { establishment } = useSelector(state => state.static, shallowEqual);
  const allowedActions = useSelector(state => state.static.allowedActions);
  const canAddCourse = allowedActions.includes('trainingCourse.update');

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
        canAddCourse
          ? <Fragment>
            <p>
              {establishment.trainingCoursesCount === 0 && <><Snippet>landingPage.noCoursesMessage</Snippet>{' '}</>}
              <Snippet optional>landingPage.addCourseDescription</Snippet>
            </p>
            <p>
              <Link className="govuk-button" page="pils.courses.create" label={<Snippet>landingPage.buttons.add</Snippet>} />
            </p>
          </Fragment>
          : <p>
            {establishment.trainingCoursesCount === 0 && <><Snippet>landingPage.noCoursesMessage</Snippet>{' '}</>}
            <Snippet>landingPage.cannotUpdate</Snippet>
          </p>
      }
      <Tabs active={tabs.findIndex(tab => tab.key === activeTab)}>
        {
          tabs.map(tab => <Link key={tab.key} page={tab.page} label={tab.label} />)
        }
      </Tabs>
      { children }
    </>
  );
}
