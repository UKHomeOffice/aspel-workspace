import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Snippet } from '@asl/components';

import ManageRoles from './manage-roles';
import ToggleASRU from './toggle-asru';
import ASRURoles from '@asl/pages/pages/global-profile/components/asru-roles';

export default function ASRUAdmin() {
  const { model, static: { canAdmin, roles } } = useSelector(state => state);
  const hasEstablishments = !!(model.establishments || []).length;

  if (hasEstablishments) {
    return null;
  }

  // profile is not an asru user and user cannot make them one
  if (!canAdmin && !model.asruUser) {
    return null;
  }

  return (
    <ul className="panel-list">
      <li>
        <h2><Snippet>asru.title</Snippet></h2>
        <p><Snippet>asru.roles.summary</Snippet></p>
        {
          canAdmin
            ? (
              <Fragment>
                <ManageRoles />
                <ToggleASRU />
              </Fragment>
            )
            : <ASRURoles roles={roles} />
        }
      </li>
    </ul>
  );
}
