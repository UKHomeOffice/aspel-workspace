import React, { Fragment } from 'react';
import useTaskStatic from './useTaskStatic';
import { Link, Snippet } from '@ukhomeoffice/asl-components';

export function ProfileLink({ profile, establishment, type }) {
  const { isAsru } = useTaskStatic();
  const label = `${profile.firstName} ${profile.lastName}`;

  return (
    <Fragment>
      <dt><Snippet>{`profileLink.${type}`}</Snippet></dt>
      <dd>
        { (type === 'global' || isAsru)
          ? <Link page="globalProfile" profileId={profile.id} label={label} />
          : <Link page="profile.read" establishmentId={establishment.id} profileId={profile.id} label={label} />
        }
      </dd>
    </Fragment>
  );
}
