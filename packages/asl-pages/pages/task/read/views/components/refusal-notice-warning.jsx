import React from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import { Warning } from '@ukhomeoffice/react-components';
import { Snippet, Utils } from '@ukhomeoffice/asl-components';

export default function RefusalNoticeWarning({ task }) {
  const { isAsru } = useSelector(state => state.static);
  const intentionToRefuse = get(task, 'data.intentionToRefuse');
  const today = Utils.formatDate(new Date(), 'yyyy-MM-dd');

  if (task.status === 'refused' || !intentionToRefuse || !intentionToRefuse.deadline) {
    return null;
  }

  if (intentionToRefuse.deadline < today) {
    return (
      <Warning>
        <Snippet>{`status.intention-to-refuse.warning.${isAsru ? 'passedAsru' : 'passed'}`}</Snippet>
      </Warning>
    );
  }

  const respondBy = Utils.formatDate(intentionToRefuse.deadline, Utils.DATE_FORMAT.long);

  return (
    <Warning>
      <Snippet respondBy={respondBy}>{`status.intention-to-refuse.warning.${isAsru ? 'futureAsru' : 'future'}`}</Snippet>
    </Warning>
  );
}
