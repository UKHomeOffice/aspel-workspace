import { useSelector } from 'react-redux';
import { ProfileLink } from './profile-link';
import { Over18 } from './over-18';
import { LicenceNumber } from './licence-number';
import { Link } from '@ukhomeoffice/asl-components';
import { EstablishmentsList } from './establishment-list';
import React from 'react';

export function ProfileDetails({ task }) {
  const profile = useSelector(state => state.static.values);
  const isApplication = task.type === 'application';
  const establishments = profile.establishments;

  return (
    <dl className="inline-wide">
      <ProfileLink profile={profile} type="global" />
      { isApplication && <Over18 profile={profile} /> }
      { !isApplication && profile.pilLicenceNumber && profile.pil &&
        <LicenceNumber>
          <Link page="pil.read" establishmentId={profile.pil.establishmentId} profileId={profile.id} label={profile.pilLicenceNumber} />
        </LicenceNumber>
      }
      <EstablishmentsList establishments={establishments} />
    </dl>
  );
}
