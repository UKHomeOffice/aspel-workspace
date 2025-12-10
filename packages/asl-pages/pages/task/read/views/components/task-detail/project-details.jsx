import { useSelector } from 'react-redux';
import ProjectTitle from './project-title';
import { ProfileLink } from './profile-link';
import { LicenceNumber } from './licence-number';
import { EstablishmentLink } from './establishment-link';
import React from 'react';
import { ROPYear } from './rop-year';

export function ProjectDetails({ task }) {
  const project = useSelector(state => state.static.project) || useSelector(state => state.static.values.project);
  const version = useSelector(state => state.static.version);
  const establishment = useSelector(state => state.static.establishment) || task.data.establishment;
  const isApplication = task.type === 'application';
  const isAmendment = task.type === 'amendment';
  const profileType = isApplication ? 'applicant' : isAmendment ? 'amendment' : 'licenceHolder';

  const profile = isApplication
    ? project.licenceHolder
    : (version ? version.licenceHolder : project.licenceHolder);

  return (
    <dl className="inline-wide">
      <ProjectTitle project={project} establishment={establishment} />
      <ProfileLink profile={profile} establishment={establishment} type={profileType} />
      <LicenceNumber>{project.licenceNumber}</LicenceNumber>
      <EstablishmentLink establishment={establishment} />
      { task.data.model === 'rop' && <ROPYear task={task} /> }
    </dl>
  );
}
