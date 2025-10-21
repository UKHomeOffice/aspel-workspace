import React from 'react';
import CategoryELandingPage from '../../../components/category-e-landing-page';
import {
  formatCourseTitle,
  formatCourseDateRange,
  formatProfile,
  formatTaskDetails,
  formatTaskStatus,
  formatTaskActions
} from '../../../formatters';
import { useSelector } from 'react-redux';
import { Datatable, Search, Snippet } from '@ukhomeoffice/asl-components';

const formatters = {
  profile: {
    format: (subject, task) => formatProfile(
      subject.profileId,
      subject.firstName,
      subject.lastName,
      task.data.establishmentId
    )
  },
  courseTitle: {
    format: (title, task) => formatCourseTitle(title, task.trainingCourse.id)
  },
  startDate: {
    format: (startDate, task) => formatCourseDateRange(startDate, task.trainingCourse.endDate)
  },
  licenceDetails: {
    format: (_, task) => formatTaskDetails(task)
  },
  status: {
    format: (status, task) => formatTaskStatus(status, task)
  },
  action: {
    format: (_, task) => formatTaskActions(task)
  }
};

export default function CoursesList() {
  const hasData = useSelector(
    state =>
      state.datatable.data.rows.length > 0 ||
      state.datatable.filters?.active?.['*']
  );

  return <CategoryELandingPage activeTab={'licences'}>
    {
      hasData
        ? <>
          <Search label={<Snippet>search.label</Snippet>} />
          <Datatable formatters={formatters} caption='tableCaption' />
        </>
        : <p><Snippet>noLicencesMessage</Snippet></p>
    }
  </CategoryELandingPage>;
}
