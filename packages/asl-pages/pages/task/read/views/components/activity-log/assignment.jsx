import { ProfileLink } from '../task-detail/profile-link';
import React from 'react';

export function Assignment({ item }) {
  const assignedTo = item.assignedTo;
  return (
    <p>
      <strong>Assigned to</strong>
      <strong>: </strong>
      {assignedTo ? (
        <ProfileLink
          id={assignedTo.id}
          name={`${assignedTo.firstName} ${assignedTo.lastName}`}
          asruUser={true}
        />
      ) : (
        <em>Unassigned</em>
      )}
    </p>
  );
}
