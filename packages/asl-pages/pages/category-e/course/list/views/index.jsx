import { Datatable } from '@ukhomeoffice/asl-components';
import React from 'react';
import { useSelector } from 'react-redux';
import formatters from '../../../formatters';
import CategoryELandingPage from '../../../components/category-e-landing-page';

export default function CoursesList() {
  const hasData = useSelector(state => state.datatable.data.rows.length) > 0;

  return <CategoryELandingPage activeTab={'courses'}>
    {
      hasData && <Datatable formatters={formatters} caption='tableCaption' />
    }
  </CategoryELandingPage>;
}
