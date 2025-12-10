import ProjectTitle from './project-title';
import { ProfileLink } from './profile-link';
import { LicenceNumber } from './licence-number';
import { EstablishmentLink } from './establishment-link';
import React from 'react';
import { ROPYear } from './rop-year';
import useTaskStatic from './useTaskStatic';

export function ProjectDetails({ task }) {
  const { project, version, establishment, isApplication, profileType } = useTaskStatic();

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
