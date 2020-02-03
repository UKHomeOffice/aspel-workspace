import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import classnames from 'classnames';
import {
  StickyNavPage,
  StickyNavAnchor,
  Snippet,
  Field,
  Inset,
  Link
} from '@asl/components';
import Establishment from './establishment';
import PIL from './pil';
import Place from './place';
import Profile from './profile';
import Project from './project';
import Role from './role';

import ActivityLog from '../components/activity-log';

const models = {
  establishment: Establishment,
  pil: PIL,
  place: Place,
  profile: Profile,
  project: Project,
  role: Role
};

const selector = ({ static: { schema, values } }) => ({ schema, values });

const AsruDiscard = ({ task, showBorder }) => {
  return (
    <details className={classnames('asru-discard-task', { border: showBorder })}>
      <summary><Snippet>asruDiscardTask.summary</Snippet></summary>
      <Inset>
        <p><Snippet>asruDiscardTask.details</Snippet></p>
        <Link
          page="task.read.discard"
          taskId={task.id}
          label={<Snippet>asruDiscardTask.action</Snippet>}
          className="govuk-button button-warning"
        />
      </Inset>
    </details>
  );
};

export default function Model({ task, formFields }) {
  const { schema, values } = useSelector(selector, shallowEqual);
  const Model = models[task.data.model];
  const hasReason = task.data.meta && task.data.meta.reason;

  const hasNextSteps = task.nextSteps.length > 0;
  const hasTaskOptions = schema.status.options.length > 0;
  const canBeDiscardedByAsru = task.nextSteps.find(step => step.id === 'discarded-by-asru');

  return (
    <StickyNavPage>
      <StickyNavAnchor id="activity">
        <ActivityLog task={task} />
      </StickyNavAnchor>
      {
        Model({ task, schema, values })
      }
      {
        hasReason && (
          <StickyNavAnchor id={task.data.action === 'revoke' ? 'revocation' : 'reason'}>
            <Field
              title={<Snippet>{`sticky-nav.${task.data.action === 'revoke' ? 'revocation' : 'reason'}`}</Snippet>}
              content={task.data.meta.reason}
            />
          </StickyNavAnchor>
        )
      }
      {
        hasNextSteps &&
          <StickyNavAnchor id="status">
            <h2><Snippet>sticky-nav.status</Snippet></h2>
            <p><Snippet>make-decision.hint</Snippet></p>
            { hasTaskOptions && formFields }
            {
              canBeDiscardedByAsru && <AsruDiscard task={task} showBorder={hasTaskOptions} />
            }
          </StickyNavAnchor>
      }
    </StickyNavPage>
  );
}
