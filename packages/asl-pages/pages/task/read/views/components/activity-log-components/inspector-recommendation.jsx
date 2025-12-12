import get from 'lodash/get';
import { daysSinceDate } from '../../../../../../lib/utils';
import React, { Fragment } from 'react';
import { Snippet } from '@ukhomeoffice/asl-components';

export function InspectorRecommendation({ item }) {
  if (!['inspector-recommended', 'inspector-rejected'].includes(item.status)) {
    return null;
  }

  const deadlineAtTimeOfRecommendation = get(item, 'event.data.deadline');
  let daysSinceDeadline;

  if (deadlineAtTimeOfRecommendation) {
    const isExtended = get(deadlineAtTimeOfRecommendation, 'isExtended', false);
    const deadlineDate = get(
      deadlineAtTimeOfRecommendation,
      isExtended ? 'extended' : 'standard'
    );
    daysSinceDeadline = daysSinceDate(deadlineDate, item.createdAt);
  }

  return (
    <Fragment>
      {daysSinceDeadline > 0 && (
        <p className="deadline-passed">
          <Snippet days={daysSinceDeadline}>{`deadline.lateDecision.${
            daysSinceDeadline > 1 ? 'plural' : 'singular'
          }`}</Snippet>
        </p>
      )}
      <p>
        <Snippet>{`status.${item.status}.recommendation`}</Snippet>
      </p>
    </Fragment>
  );
}
