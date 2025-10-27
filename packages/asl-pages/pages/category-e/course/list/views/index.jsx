import { Datatable, Snippet } from '@ukhomeoffice/asl-components';
import React from 'react';
import { useSelector } from 'react-redux';
import { formatCourseTitle, formatSpecies, formatCourseDateRange } from '../../../formatters';
import CategoryELandingPage from '../../../components/category-e-landing-page';

const tableFormatters = {
  courseTitle: {
    format: (title, course) => formatCourseTitle(title, course.id)
  },
  species: {
    format: (species) => formatSpecies(species)
  },
  startDate: {
    format: (startDate, course) => formatCourseDateRange(startDate, course.endDate)
  }
};

export default function CoursesList() {
  const hasData = useSelector(state => state.datatable.data.rows.length) > 0;

  return <CategoryELandingPage activeTab={'courses'}>
    {
      hasData
        ? <Datatable
          formatters={tableFormatters}
          caption='tableCaption'
          pagination={{autoUI: true}}
        />
        : <p className='govuk-body'><Snippet>noCoursesMessage</Snippet></p>
    }
  </CategoryELandingPage>;
}
