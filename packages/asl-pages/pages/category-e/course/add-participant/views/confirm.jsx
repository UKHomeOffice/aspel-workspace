import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Details, FormLayout, Header, Inset, Link, ModelSummary, Snippet } from '@ukhomeoffice/asl-components';
import CourseSummary from '../components/course-summary';
import { isBefore, isSameDay, addYears } from 'date-fns';

function isOver18AtStartOfCourse(dob, trainingCourse) {
  const eighteenthBirthday = addYears(dob, 18);
  return isBefore(eighteenthBirthday, trainingCourse.startDate) ||
    isSameDay(eighteenthBirthday, trainingCourse.startDate);
}

export default function Confirm() {
  const { trainingCourse, modelSchema } = useSelector(state => state.static);

  const formatters = useMemo(
    () => ({
      dob: {
        format: (dob) => isOver18AtStartOfCourse(dob, trainingCourse) ? 'Yes' : 'No'
      }
    }),
    [trainingCourse.startDate]
  );

  return (
    <FormLayout cancelLink="categoryE.course.read">
      <Header
        title={<Snippet>title</Snippet>}
        subtitle={trainingCourse.title}
      />
      <Details summary={<Snippet>courseDetailsSummary</Snippet>}>
        <Inset>
          <CourseSummary course={trainingCourse} />
        </Inset>
        <hr />
      </Details>
      <br />
      <ModelSummary schema={modelSchema} formatters={formatters} />
      <p>
        <Link page='categoryE.course.addParticipant' suffix='/details'>
          <Snippet>buttons.change</Snippet>
        </Link>
      </p>
    </FormLayout>
  );
}
