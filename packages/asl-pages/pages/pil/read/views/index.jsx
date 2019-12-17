import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { dateFormat } from '../../../../constants';
import { formatDate } from '../../../../lib/utils';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import omit from 'lodash/omit';
import schema from '../schema';
import {
  Link,
  Snippet,
  ModelSummary,
  Conditions,
  DownloadHeader
} from '@asl/components';
import LicenceStatusBanner from '../../../common/components/licence-status-banner';
import { Warning } from '@ukhomeoffice/react-components';

const PIL = ({
  pil,
  profile,
  canUpdate,
  allowedActions,
  canDownload,
  openTask,
  correctEstablishment,
  currentPath
}) => {
  const pilSchema = pil.status === 'revoked' ? omit(schema, 'reviewDate', 'updatedAt') : omit(schema, 'revocationDate');

  const canUpdateConditions = allowedActions.includes('pil.updateConditions') && pil.status === 'active';
  const backToProfile = <Link page="profile.read" label={<Snippet>action.backToProfile</Snippet>} />;

  const formatters = {
    issueDate: {
      format: issueDate => formatDate(issueDate, dateFormat.medium)
    },
    updatedAt: {
      format: (updatedAt, pil) => differenceInCalendarDays(updatedAt, pil.issueDate) > 0
        ? formatDate(updatedAt, dateFormat.medium)
        : '-'
    },
    revocationDate: {
      format: revocationDate => formatDate(revocationDate, dateFormat.medium)
    },
    reviewDate: {
      format: reviewDate => formatDate(reviewDate, dateFormat.medium)
    },
    establishmentName: {
      format: name => name || 'This licence is held at another establishment.'
    },
    species: {
      format: pilSpecies => {
        if (!pilSpecies) {
          return '-';
        }
        if (!Array.isArray(pilSpecies)) {
          return;
        }

        return (
          <ul className="species-list">
            { pilSpecies.map(species => <li key={species}>{species}</li>) }
          </ul>
        );
      }
    },
    procedures: {
      format: (procedures, pil) => {
        if (!procedures) {
          return '-';
        }
        return procedures.sort().map(procedure => {
          return (
            <p key={procedure}>
              <strong>{procedure}</strong>: <Snippet>{`procedureDefinitions.${procedure}`}</Snippet>
              {
                procedure === 'F' && (
                  <em>: {pil.notesCatF}</em>
                )
              }
            </p>
          );
        });
      }
    },
    conditions: {
      format: conditions => {
        return (
          <Conditions
            conditions={conditions}
            canUpdate={canUpdateConditions && !openTask}
            label={<Snippet>conditions.hasConditions</Snippet>}
            noConditionsLabel={<Snippet>conditions.noConditions</Snippet>}
          >
            {
              openTask && canUpdateConditions && (
                <Warning>
                  <Snippet>updateInProgress</Snippet>
                  <p><Link page="task.read" taskId={openTask.id} label={<Snippet>view-task</Snippet>} /></p>
                </Warning>
              )
            }
          </Conditions>
        );
      }
    }
  };

  return (
    <Fragment>
      <LicenceStatusBanner licence={pil} licenceType="pil" />

      <h3 className="licence-holder-name">{`${profile.firstName} ${profile.lastName}`}</h3>

      <DownloadHeader
        model={pil}
        licenceType="pil"
        isGranted={pil.status === 'active'}
        showWord={false}
        showPdf={canDownload}
        basename={currentPath}
      />

      <ModelSummary model={pil} formatters={formatters} schema={pilSchema} formatNullValue={true} />

      {
        canUpdate && (
          <Fragment>
            {
              correctEstablishment
                ? (
                  <div className="pil-actions">
                    <section className="amend-licence">
                      <Snippet>action.amend.summary</Snippet>
                      <Link
                        page="pil.update"
                        className="govuk-button button-secondary"
                        label={<Snippet>{`action.${pil.status === 'active' ? 'amend' : 'reapply'}.button`}</Snippet>}
                      />
                    </section>
                    {
                      pil.status === 'active' &&
                        <section className="revoke-licence">
                          <Snippet>action.revoke.summary</Snippet>
                          <Link
                            page="pil.revoke"
                            className="govuk-button button-warning"
                            label={<Snippet>action.revoke.button</Snippet>}
                          />
                        </section>
                    }
                  </div>
                )
                : (
                  <Fragment>
                    <p className="clear"><Snippet>cantUpdate</Snippet></p>
                    { backToProfile }
                  </Fragment>
                )
            }
          </Fragment>
        )
      }
    </Fragment>
  );
};

const mapStateToProps = ({
  static: {
    profile,
    canUpdate,
    canDownload,
    pil,
    openTask,
    allowedActions,
    correctEstablishment,
    currentPath
  }
}) => ({
  pil,
  profile,
  canUpdate,
  canDownload,
  allowedActions,
  openTask,
  correctEstablishment,
  currentPath
});

export default connect(mapStateToProps)(PIL);
