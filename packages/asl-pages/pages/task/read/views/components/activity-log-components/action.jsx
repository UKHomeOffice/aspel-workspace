import { Snippet } from '@ukhomeoffice/asl-components';
import get from 'lodash/get';
import { ProfileLink } from './profile-link';
import React from 'react';

export function Action({ task, action, activity, changedBy }) {
  const type = task.type;
  const name = `${changedBy.firstName} ${changedBy.lastName}`;
  if (action === 'autoresolved') {
    return (
      <p>
        <strong>
          <Snippet>status.autoresolved.log</Snippet>
        </strong>
      </p>
    );
  }
  if (action === 'discarded-by-asru' && !changedBy.id) {
    return (
      <p>
        <strong>
          <Snippet>status.autodiscarded.log</Snippet>
        </strong>
      </p>
    );
  }
  if (task.data.model === 'rop') {
    action = task.status;
  }

  const establishmentId = get(activity, 'event.data.establishmentId');
  const profile = get(activity, 'event.meta.user.profile');
  const establishment =
    profile.establishments.find((e) => e.id === establishmentId) || {};
  let approvedByMsg = `status.${action}.log.${type}`;

  if (!profile.asruUser && action === 'resolved') {
    const approvedByPELH = profile.roles.find(
      (r) => r.type === 'pelh' && r.establishmentId === establishmentId
    );
    approvedByMsg = approvedByPELH
      ? `status.${action}.by-pelh`
      : `status.${action}.on-behalf-of-pelh`;
  }

  return (
    <p className="gutter">
      <strong>
        <Snippet
          fallback={`status.${action}.log`}
          establishmentName={establishment.name}
        >
          {approvedByMsg}
        </Snippet>
      </strong>
      <strong>: </strong>
      <ProfileLink
        id={changedBy.id}
        name={name}
        establishmentId={establishment.id || task.data.establishmentId}
        asruUser={changedBy.asruUser}
      />
    </p>
  );
}
