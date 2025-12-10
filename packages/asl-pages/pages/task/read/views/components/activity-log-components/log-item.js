import get from 'lodash/get';
import React from 'react';
import { isDeadlineExtension, isDeadlineReinstate, isDeadlineRemove } from '../../../../../../lib/utils';
import { Comment } from './comment';
import { format } from 'date-fns';
import { dateFormat } from '../../../../../../constants';
import { Action } from './action';
import { versions } from '@ukhomeoffice/asl-constants';
import { Snippet } from '@ukhomeoffice/asl-components';
import { InspectorRecommendation } from './inspector-recommendation';
import { DeadlineDetails } from './deadline-details';
import { AwerbDate } from './awerb-date';
import { Assignment } from './assignment';
import PplDeclarations from '../ppl-declarations';
import { DeclarationMeta } from './declaration-meta';
import { ExtraProjectMeta } from './extra-project-meta';
import { IntentionToRefuse } from './intention-to-refuse';

const showPplDeclarations = (item) => {
  const status = get(item, 'event.status');
  return ['endorsed', 'resubmitted'].includes(status);
};

export function LogItem({ item, task }) {
  let { action } = item;
  const isExtension = isDeadlineExtension(item);
  const isRa = task.data.action === 'grant-ra';
  const isAssignment = item.eventName === 'assign';
  const isIntentionToRefuse = action === 'intention-to-refuse';
  const roleData = task.data.data;
  const { version } = task.data.meta;

  if (action === 'update') {
    if (isExtension) {
      action = 'deadline-extended';
    } else if (isDeadlineRemove(item)) {
      action = 'deadline-removed';
    } else if (isDeadlineReinstate(item)) {
      action = 'deadline-reinstated';
    }
  }
  return (
    <div className="log-item" id={item.id}>
      <span className="date">{format(item.createdAt, dateFormat.long)}</span>
      <Action
        task={task}
        action={action}
        activity={item}
        changedBy={item.changedBy}
      />
      {version === versions.role.NAMED_PERSON_VERSION_ID &&
        item.id === task.activityLog[task.activityLog.length - 1].id && (
        <Snippet fallback="declarations.default">
          {`declarations.${roleData.type}`}
        </Snippet>)
      }
      <InspectorRecommendation item={item} />
      {isExtension && <DeadlineDetails item={item} />}
      {isRa && <AwerbDate item={item} />}
      {isAssignment && <Assignment item={item} />}
      {isIntentionToRefuse && <IntentionToRefuse task={task} />}
      {!isIntentionToRefuse && (
        <Comment changedBy={item.changedBy} comment={item.comment} />
      )}
      {showPplDeclarations(item) && <PplDeclarations task={item.event} />}
      <DeclarationMeta item={item} />
      <ExtraProjectMeta item={item} task={task} />
    </div>
  );
}
