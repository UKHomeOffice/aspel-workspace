import React from 'react';
import classnames from 'classnames';
import { Snippet } from '@asl/components';
import { Warning } from '@ukhomeoffice/react-components';

function SubjectBanner({ enforcementCase, status }) {
  if (!status) {
    return null;
  }

  return (
    <Warning className={classnames('enforcement', status)}>
      <p><Snippet number={enforcementCase.caseNumber}>{`enforcementBanner.subject.${status}`}</Snippet></p>
    </Warning>
  );
}

export default SubjectBanner;
