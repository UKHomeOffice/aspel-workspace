import dayJs from '@ukhomeoffice/asl-components/dayjs';
import React, { Fragment } from 'react';
import { Snippet } from '@ukhomeoffice/asl-components';

const { differenceInYears } = dayJs;

export function Over18({ profile }) {
  const over18 = profile.dob ? differenceInYears(new Date(), new Date(profile.dob)) >= 18 : 'unknown';
  return (
    <Fragment>
      <dt><Snippet>pil.applicant.over18</Snippet></dt>
      <dd>
        { !profile.dob && <Snippet>pil.applicant.missingDob</Snippet> }
        { profile.dob && (over18 ? 'Yes' : 'No') }
      </dd>
    </Fragment>
  );
}
