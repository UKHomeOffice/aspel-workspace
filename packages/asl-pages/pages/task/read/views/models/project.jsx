import React, {Fragment, useMemo, useState} from 'react';
import { StaticRouter } from 'react-router';
import { useSelector, shallowEqual } from 'react-redux';
import pick from 'lodash/pick';
import get from 'lodash/get';
import { Link, StickyNavAnchor, Snippet, Diff } from '@ukhomeoffice/asl-components';
import EstablishmentLinks from '../components/establishment-links';

// need unconnected ReviewFields component and not default
import { ReviewFields } from '@asl/projects/client/components/review-fields';
import { format, getYear, isBefore } from 'date-fns';
import { dateFormat, ropsYears } from '../../../../../constants';
import PplDeclarations from '../components/ppl-declarations';
import experience from '../../../../project/update-licence-holder/schema/experience-fields';
import { schema as projectSchema } from '../../../../project/schema';
import { getAdditionalEstablishments } from '../../../../project-version/helpers/project';
import {Warning} from '../../../../common/components/warning';

function EstablishmentDiff({ task }) {
  const isComplete = !task.isOpen;
  const { to, from } = task.data.meta.establishment;
  return (
    <table className="govuk-table compare">
      <thead>
        <tr>
          <th>
            {
              isComplete
                ? <Snippet>establishment.previous</Snippet>
                : <Snippet>establishment.current</Snippet>
            }
          </th>
          <th>
            {
              isComplete
                ? <Snippet>establishment.new</Snippet>
                : <Snippet>establishment.proposed</Snippet>
            }
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{from.name}</td>
          <td><span className="highlight">{to.name}</span></td>
        </tr>
      </tbody>
    </table>
  );
}

export default function Project({ task }) {
  const { project, establishment, version, ra, values, isAsru, allowedActions, url, isAdmin, isHolc } = useSelector(state => state.static, shallowEqual);
  const [disabled, setDisabled] = useState(false);

  const additionalEstablishments = getAdditionalEstablishments(project, version).filter((establishment) => !establishment.deleted);

  const isComplete = !task.isOpen;
  const isDiscarded = task.status === 'discarded-by-applicant';

  const isCorrectVersion = get(project, 'versions[0].id') === get(task, 'data.data.version');
  const isRejected = task.status === 'rejected';
  const canReopenTask = isRejected && isCorrectVersion && allowedActions.includes('project.recoverTask');
  const ropDue = useMemo(getRopDue, [project, task.data.rops]);

  function getRopDue() {
    // Draft projects don't need to submit rops
    if (task.data.rops === undefined || !project.issueDate) {
      return '';
    }

    const grantedYear = getYear(project.issueDate);
    const endDate = project.revocationDate ?? project.expiryDate;
    const currentYear = getYear(new Date());
    const thisYearsRopsOverdue = !isBefore(new Date(`${currentYear}-02-01`), new Date());

    return ropsYears
      // Was the project active?
      .filter(year => grantedYear <= year && (endDate ? getYear(endDate) : true))
      // Are rops for the year overdue?
      .filter(year => year < currentYear || (year === currentYear && thisYearsRopsOverdue))
      // Is the rop for this year not submitted
      .filter(year => !task.data.rops.find(ar => ar.year === year))
      .reverse()
      .join(', ')
      // replace last comma with or
      .replace(/,(?=[^,]*$)/, ' or');
  }

  function onReopen(e) {
    if (window.confirm('Are you sure you want to reopen this task?')) {
      return true;
    }
    e.preventDefault();
  }

  const onFormSubmit = e => {
    if (disabled) {
      e.preventDefault();
    }
    e.persist();
    setTimeout(() => setDisabled(true), 0);
  };

  const formatters = {
    licenceHolder: {
      format: licenceHolder => {
        if (!licenceHolder) {
          return '-';
        }

        return (
          <Fragment>
            <Link
              page="profile.read"
              establishmentId={establishment.id}
              profileId={licenceHolder.id}
              label={`${licenceHolder.firstName} ${licenceHolder.lastName}`}
            />
            <br />
            <a href={`mailto:${licenceHolder.email}`}>{licenceHolder.email}</a>
          </Fragment>
        );
      }
    }
  };

  return [
    (
      task.data.action === 'grant-ra' && (
        <StickyNavAnchor id="ra" key="ra">
          <h2><Snippet>sticky-nav.ra</Snippet></h2>
          {
            isAsru
              ? <p><Snippet>ra.content</Snippet></p>
              : <p><Snippet date={format(project.raDate, dateFormat.long)}>ra.due</Snippet></p>
          }
          <Link
            page="retrospectiveAssessment.update"
            className="govuk-button button-secondary gutter"
            label={<Snippet>ra.view</Snippet>}
            raId={ra.id}
            establishmentId={project.establishmentId}
            projectId={project.id}
          />
        </StickyNavAnchor>
      )
    ),

    (
      task.data.action === 'transfer' && (
        <StickyNavAnchor id="establishment" key="establishment">
          <h2><Snippet>sticky-nav.establishment</Snippet></h2>
          <div className="gutter">
            <EstablishmentDiff task={task} />
          </div>
        </StickyNavAnchor>
      )
    ),
    (
      task.data.action === 'transfer' && (isAdmin || isHolc) && project.status !== 'inactive' && (
        <StickyNavAnchor id="establishment" key="establishment">
          <>
            <Warning>
              <Snippet>warning.establishment.move</Snippet>
            </Warning>
            <div className='govuk-warning-text'>
              <strong className='govuk-warning-text__text'>
                <Link page="project.read" establishmentId={project.establishmentId} projectId={project.id} label={<Snippet>warning.establishment.downloadLabel</Snippet>} target='downloads' suffix='#reporting'/>&nbsp;
                <Snippet>warning.establishment.suffix</Snippet>
              </strong>
            </div>
          </>
        </StickyNavAnchor>
      )
    ),
    (
      task.data.action === 'transfer' && isAsru && project.status !== 'inactive' && ropDue && (
        <StickyNavAnchor id="establishment" key="establishment">
          <Warning>
            <Snippet years={ropDue}>warning.establishment.transferRopDue</Snippet>
          </Warning>
        </StickyNavAnchor>
      )
    ),
    (
      (task.data.action === 'grant' || task.data.action === 'transfer') && (
        <StickyNavAnchor id="submitted-version" key="submitted-version">
          <h2><Snippet>sticky-nav.submitted-version</Snippet></h2>
          {
            task.status === 'with-inspectorate' && <PplDeclarations task={task} />
          }
          <div className="gutter">
            {
              !!additionalEstablishments.length && (
                <Fragment>
                  <h3><Snippet>additional-establishments.title</Snippet></h3>
                  <EstablishmentLinks establishments={additionalEstablishments} showLink={isAsru} />
                </Fragment>
              )
            }
            {
              isDiscarded
                ? <p><Snippet date={format(version.deleted, dateFormat.long)}>versions.submitted.discarded</Snippet></p>
                : (
                  <Fragment>
                    <p><Snippet>versions.submitted.text</Snippet></p>
                    <Link
                      page="projectVersion.fullApplication"
                      className="govuk-button button-secondary"
                      versionId={version.id}
                      establishmentId={project.establishmentId}
                      projectId={project.id}
                      label={<Snippet>versions.submitted.label</Snippet>}
                    />
                  </Fragment>
                )
            }

          </div>
        </StickyNavAnchor>
      )
    ),

    (
      task.data.action === 'update' && (
        <StickyNavAnchor id="licence-holder" key="licence-holder">
          <h2><Snippet>sticky-nav.licence-holder</Snippet></h2>
          <Diff
            before={values}
            after={{ licenceHolder: task.data.licenceHolder }}
            schema={pick(projectSchema, 'licenceHolder')}
            formatters={formatters}
            currentLabel={<Snippet>{`diff.${isComplete ? 'previous' : 'current'}`}</Snippet>}
            proposedLabel={<Snippet>{`diff.${isComplete ? 'changed-to' : 'proposed'}`}</Snippet>}
          />
        </StickyNavAnchor>
      )
    ),

    (
      task.data.action === 'update' && (
        <StickyNavAnchor id="experience" key="experience">
          <h2><Snippet>sticky-nav.experience</Snippet></h2>
          <StaticRouter>
            <ReviewFields
              fields={experience(version, project.schemaVersion).fields}
              values={task.data.data}
              project={version.data}
              readonly={true}
              noComments
              altLabels
            />
          </StaticRouter>
        </StickyNavAnchor>
      )
    ),

    (
      task.data.action === 'update' && project.granted && (
        <StickyNavAnchor id="granted" key="granted">
          <h2><Snippet>sticky-nav.granted</Snippet></h2>
          <p><Snippet>versions.granted.info</Snippet></p>
          <p className="gutter">
            <Link
              page="projectVersion"
              className="govuk-button button-secondary"
              versionId={project.granted.id}
              establishmentId={establishment.id}
              projectId={project.id}
              label={<Snippet>versions.granted.label</Snippet>}
            />
          </p>
        </StickyNavAnchor>
      )
    ),

    (
      canReopenTask && (
        <StickyNavAnchor id="reopen" key="reopen">
          <h2><Snippet>sticky-nav.reopen</Snippet></h2>
          <p><Snippet>reopen.content</Snippet></p>
          <form action={`${url}/reopen`} method="POST" onSubmit={onFormSubmit} className="gutter">
            <button className="govuk-button button-secondary" onClick={onReopen}><Snippet>reopen.button</Snippet></button>
          </form>
        </StickyNavAnchor>
      )
    )
  ];
}
