import React, { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import get from 'lodash/get';
import { dateFormat } from '../../../../../constants';
import experience from '../../../../project/update-licence-holder/schema/experience-fields';
import { schema as projectSchema } from '../../../../project/schema';
import { getAdditionalEstablishments } from '../../../../project-version/helpers/project';
import getRopDue from './project-components/get-rop-due';

// Import all components and hooks
import {
  RetrospectiveAssessment,
  TransferEstablishment,
  TransferWarning,
  TransferRopWarning,
  SubmittedVersion,
  LicenceHolderUpdate,
  ExperienceUpdate,
  GrantedVersion,
  ReopenTask,
  useLicenceHolderFormatter,
  useFormSubmitHandler
} from './project-components';

export default function Project({ task }) {
  const {
    project,
    establishment,
    version,
    ra,
    values,
    isAsru,
    allowedActions,
    url,
    isAdmin,
    isHolc
  } = useSelector(state => state.static, shallowEqual);

  // Use custom hooks
  const { handleFormSubmit, handleReopen } = useFormSubmitHandler();
  const formatters = useLicenceHolderFormatter(establishment);

  const additionalEstablishments = getAdditionalEstablishments(project, version)
    .filter((establishment) => !establishment.deleted);

  const isComplete = !task.isOpen;
  const isDiscarded = task.status === 'discarded-by-applicant';
  const isCorrectVersion = get(project, 'versions[0].id') === get(task, 'data.data.version');
  const isRejected = task.status === 'rejected';
  const canReopenTask = isRejected && isCorrectVersion && allowedActions.includes('project.recoverTask');

  const ropDue = useMemo(() => getRopDue(project, task), [project, task?.data?.rops]);

  return (
    <>
      {/* Retrospective Assessment */}
      {task.data.action === 'grant-ra' && (
        <RetrospectiveAssessment
          task={task}
          project={project}
          ra={ra}
          isAsru={isAsru}
          establishment={establishment}
          dateFormat={dateFormat}
        />
      )}

      {/* Transfer Establishment */}
      {task.data.action === 'transfer' && (
        <TransferEstablishment task={task} />
      )}

      {/* Transfer Warning */}
      {task.data.action === 'transfer' && (isAdmin || isHolc) && project.status !== 'inactive' && (
        <TransferWarning
          isAdmin={isAdmin}
          isHolc={isHolc}
          project={project}
          establishment={establishment}
        />
      )}

      {/* Transfer ROP Warning */}
      {task.data.action === 'transfer' && isAsru && project.status !== 'inactive' && ropDue && (
        <TransferRopWarning ropDue={ropDue} />
      )}

      {/* Submitted Version */}
      {(task.data.action === 'grant' || task.data.action === 'transfer') && (
        <SubmittedVersion
          task={task}
          additionalEstablishments={additionalEstablishments}
          isAsru={isAsru}
          isDiscarded={isDiscarded}
          version={version}
          project={project}
          establishment={establishment}
          dateFormat={dateFormat}
        />
      )}

      {/* Licence Holder Update */}
      {task.data.action === 'update' && (
        <LicenceHolderUpdate
          values={values}
          task={task}
          isComplete={isComplete}
          projectSchema={projectSchema}
          formatters={formatters}
        />
      )}

      {/* Experience Update */}
      {task.data.action === 'update' && (
        <ExperienceUpdate
          version={version}
          task={task}
          project={project}
          experience={experience}
        />
      )}

      {/* Granted Version */}
      {task.data.action === 'update' && project.granted && (
        <GrantedVersion
          project={project}
          establishment={establishment}
        />
      )}

      {/* Reopen Task */}
      {canReopenTask && (
        <ReopenTask
          canReopenTask={canReopenTask}
          url={url}
          onFormSubmit={handleFormSubmit}
          onReopen={handleReopen}
        />
      )}
    </>
  );
}
