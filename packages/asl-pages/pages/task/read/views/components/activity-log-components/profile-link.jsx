import { Link } from '@ukhomeoffice/asl-components';
import React from 'react';

export function ProfileLink({ id, name, establishmentId, asruUser }) {
  if (establishmentId && !asruUser) {
    return (
      <Link
        page="profile.read"
        profileId={id}
        establishmentId={establishmentId}
        label={name}
      />
    );
  } else {
    return <Link page="globalProfile" profileId={id} label={name} />;
  }
}
