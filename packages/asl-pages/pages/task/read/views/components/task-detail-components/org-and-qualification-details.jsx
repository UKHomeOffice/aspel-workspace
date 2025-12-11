import React, { Fragment } from 'react';
import * as participantDetails from '../../../../../pil/unscoped/courses/participants/add/content';

export function OrgAndQualificationDetails({ trainingTask, trainingCourse }) {
  const higherEducation = trainingCourse.coursePurpose === 'higherEducation';
  const training = trainingCourse.coursePurpose === 'training';

  return (
    <>
      { trainingTask.organisation &&
        <Fragment>
          <dt>{ participantDetails.fields.organisation.label }</dt>
          <dd>{ trainingTask.organisation }</dd>
        </Fragment>
      }

      { higherEducation &&
        <Fragment>
          <dt>{ participantDetails.fields.qualificationLevelAndSubject.label }</dt>
          <dd>{ trainingTask.qualificationLevelAndSubject }</dd>
        </Fragment>
      }

      { training &&
        <Fragment>
          <dt>{ participantDetails.fields.jobTitleOrQualification.label }</dt>
          <dd>{ trainingTask.jobTitleOrQualification }</dd>

          <dt>{ participantDetails.fields.fieldOfExpertise.label }</dt>
          <dd>{ trainingTask.fieldOfExpertise }</dd>
        </Fragment>
      }
    </>
  );
}
