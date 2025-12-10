import get from 'lodash/get';
import { ProfileLink } from './profile-link';
import { Over18 } from './over-18';
import { LicenceNumber } from './licence-number';
import { Link } from '@ukhomeoffice/asl-components';
import { OrgAndQualificationDetails } from './org-and-qualification-details';
import { EstablishmentLink } from './establishment-link';
import React from 'react';
import useTaskStatic from './useTaskStatic';

export function PilDetails({ task }) {
  const { profile } = useTaskStatic(task);

  const pil = profile.pil;
  const establishment = (pil && pil.establishment) ? pil.establishment : get(task, 'data.establishment');
  const isApplication = task.type === 'application';
  const profileType = isApplication ? 'applicant' : 'licenceHolder';
  const trainingTask = get(task, 'data.data');
  const trainingCourse = get(task, 'data.modelData.trainingCourse');

  return (
    <dl className="inline-wide">
      <ProfileLink profile={profile} establishment={establishment} type={profileType} />
      { isApplication && <Over18 profile={profile} /> }
      { !isApplication && profile.pilLicenceNumber &&
        <LicenceNumber>
          <Link page="pil.read" establishmentId={establishment.id} profileId={profile.id} label={profile.pilLicenceNumber} />
        </LicenceNumber>
      }
      {trainingCourse ? <OrgAndQualificationDetails trainingTask={trainingTask} trainingCourse={trainingCourse}/> : null }

      <EstablishmentLink establishment={establishment} />
    </dl>
  );
}
