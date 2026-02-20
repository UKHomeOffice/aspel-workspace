import get from 'lodash/get';
import { useSelector } from 'react-redux';
import { isTrueish } from '../../../../../../lib/utils';
import { Link, Snippet, Utils } from '@ukhomeoffice/asl-components';
import React, { Fragment } from 'react';

const actionPerformedByAdmin = (item) => {
  const establishmentId = get(item, 'event.data.establishmentId');
  const profile = get(item, 'event.meta.user.profile');
  return !!profile.establishments.find(
    (e) => e.id === establishmentId && e.role === 'admin'
  );
};

export function ExtraProjectMeta({ item, task }) {
  const { isAsru } = useSelector((state) => state.static);
  if (task.data.model !== 'project') {
    return null;
  }

  let establishmentId = get(item, 'event.data.modelData.establishmentId');
  let projectId = get(item, 'event.data.modelData.id');
  let versionId = get(item, 'event.data.data.version');

  const status = get(item, 'event.status');
  const isEndorsed = isTrueish(get(item, 'event.data.meta.authority'));
  const isAwerbed = isTrueish(get(item, 'event.data.meta.awerb'));
  const hbaToken = get(item, 'event.data.meta.hbaToken');
  const hbaFilename = get(item, 'event.data.meta.hbaFilename');
  const requiresAdminInteraction =
    !isEndorsed || (!isAwerbed && !actionPerformedByAdmin(item));

  if (!versionId) {
    return null;
  }

  if (status === 'resolved') {
    const transferredProject = useSelector(
      (state) => state.static.transferredProject
    );

    if (transferredProject) {
      // transferredProject is only set if the user has permission to view it
      // otherwise we default to the version at the outgoing establishment
      establishmentId = transferredProject.establishmentId;
      projectId = transferredProject.id;
      versionId = transferredProject.granted.id;
    }

    return (
      <div className="version-links">
        <p>
          <Link
            page="projectVersion"
            versionId={versionId}
            establishmentId={establishmentId}
            projectId={projectId}
            label={
              <Snippet date={Utils.formatDate(item.createdAt, Utils.DATE_FORMAT.long)}>
                view.granted
              </Snippet>
            }
          />
        </p>
        <p>
          <Link
            page="projectVersion.nts"
            versionId={versionId}
            establishmentId={establishmentId}
            projectId={projectId}
            label={
              <Snippet date={Utils.formatDate(item.createdAt, Utils.DATE_FORMAT.long)}>
                view.nts
              </Snippet>
            }
          />
        </p>
        {isAsru && hbaToken && hbaFilename && (
          <p>
            <a href={`/attachment/${hbaToken}`} download={`${hbaFilename}`}>
              <Snippet>view.hba</Snippet>
            </a>
          </p>
        )}
      </div>
    );
  }

  if (
    status === 'endorsed' ||
    (status === 'resubmitted' && !requiresAdminInteraction)
  ) {
    return (
      <Fragment>
        <div className="version-links">
          <p>
            <Link
              page="projectVersion"
              versionId={versionId}
              establishmentId={establishmentId}
              projectId={projectId}
              label={
                <Snippet date={Utils.formatDate(item.createdAt, Utils.DATE_FORMAT.long)}>
                  view.version
                </Snippet>
              }
            />
          </p>
        </div>
      </Fragment>
    );
  }

  return null;
}
