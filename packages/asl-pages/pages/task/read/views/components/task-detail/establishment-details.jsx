import { EstablishmentLink } from './establishment-link';
import { LicenceNumber } from './licence-number';
import { ProfileLink } from './profile-link';
import React from 'react';
import useTaskStatic from './useTaskStatic';

export function EstablishmentDetails({ task }) {
  const establishment = useTaskStatic();
  const showNprc = establishment.nprc && (!establishment.pelh || establishment.pelh.id !== establishment.nprc.id);

  return (
    <dl className="inline-wide">
      <EstablishmentLink establishment={establishment} />
      <LicenceNumber>{establishment.licenceNumber}</LicenceNumber>
      { establishment.pelh &&
        <ProfileLink profile={establishment.pelh} establishment={establishment} type="pelh" />
      }
      { showNprc &&
        <ProfileLink profile={establishment.nprc} establishment={establishment} type="nprc" />
      }
    </dl>
  );
}
