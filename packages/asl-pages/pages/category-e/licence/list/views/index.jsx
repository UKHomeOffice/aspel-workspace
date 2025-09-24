import React from 'react';
import CategoryELandingPage from '../../../components/category-e-landing-page';
import baseFormatters from '../../../formatters';
import { useSelector } from 'react-redux';
import { Datatable } from '@ukhomeoffice/asl-components';
import get from 'lodash/get';

const lens = (formatter, path) => ({
  ...formatter,
  format: (value, model) => formatter.format(value, get(model, path))
});

const formatters = {
  ...baseFormatters,
  courseTitle: lens(baseFormatters.courseTitle, 'trainingCourse'),
  startDate: lens(baseFormatters.startDate, 'trainingCourse')
};

export default function CoursesList() {
  const hasData = useSelector(state => state.datatable.data.rows.length) > 0;

  return <CategoryELandingPage activeTab={'licences'}>
    {
      hasData && <Datatable formatters={formatters} caption='tableCaption' />
    }
  </CategoryELandingPage>;
}
