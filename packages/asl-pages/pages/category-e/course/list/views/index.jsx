import { Datatable, Link, Snippet } from '@ukhomeoffice/asl-components';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import formatters from '../../formatters';
import { format as formatDate, getYear } from 'date-fns';
import { dateFormat } from '../../../../../constants';
import CategoryELandingPage from '../../../components/category-e-landing-page';

const tableFormatters = {
  ...formatters,
  title: {
    format: (title, model) =>
      <Link
        page="categoryE.course.read"
        trainingCourseId={model.id}
        label={title}
      />
  },
  species: {
    format: species => (species ?? []).sort().join(', ')
  },
  startDate: {
    format: (startDate, {endDate}) => {
      if (!endDate) {
        return formatDate(startDate, dateFormat.medium);
      } else {
        const startDateFormat = getYear(startDate) === getYear(endDate)
          ? 'dd MMM'
          : dateFormat.medium;

        return `${formatDate(startDate, startDateFormat)} - ${formatDate(endDate, dateFormat.medium)}`;
      }
    }
  }
};

export default function CoursesList() {
  const hasData = useSelector(state => state.datatable.data.rows.length) > 0;
  const allowedActions = useSelector(state => state.static.allowedActions);
  const canUpdate = allowedActions.includes('trainingCourse.update');

  return <CategoryELandingPage activeTab={'courses'}>
    {
      canUpdate && (
        <Fragment>
          <Snippet optional>subtitle</Snippet>
          <p>
            <Link className="govuk-button" page="pils.courses.create" label={<Snippet>buttons.add</Snippet>} />
          </p>
        </Fragment>
      )
    }
    {
      hasData && <Datatable formatters={tableFormatters} caption='tableCaption' />
    }
    {
      !hasData && !canUpdate && <p><Snippet>cannotUpdate</Snippet></p>
    }
  </CategoryELandingPage>;
}
