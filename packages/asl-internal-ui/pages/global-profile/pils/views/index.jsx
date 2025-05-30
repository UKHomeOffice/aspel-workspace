import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import sortBy from 'lodash/sortBy';
import { format } from 'date-fns';
import { dateFormat } from '@asl/pages/constants';
import { Conditions, Header, Inset, Link, Markdown, ModelSummary, Snippet } from '@ukhomeoffice/asl-components';
import schema from '@asl/pages/pages/pil/read/schema';

const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'complete';
    case 'revoked':
    case 'expired':
      return 'rejected';
  }
};

const formatDate = date => date ? format(date, dateFormat.long) : '-';

const pilSchema = {
  status: { show: true },
  ...schema,
  pilTransfers: { show: true }
};
const trainingPilSchema = {
  status: { show: true },
  establishment: { show: true, accessor: 'trainingCourse.establishment' },
  issueDate: { show: true },
  revocationDate: { show: true },
  expiryDate: { show: true },
  species: { show: true, accessor: 'trainingCourse.species' },
  trainingNeed: { show: true },
  project: { show: true, accessor: 'trainingCourse.project' }
};

const formatters = {
  status: {
    format: status => <span className={classnames('badge', getStatusClass(status))}>{ status }</span>
  },
  issueDate: {
    format: formatDate
  },
  licenceNumber: {},
  revocationDate: {
    format: formatDate
  },
  reviewDate: {
    format: formatDate
  },
  updatedAt: {
    format: formatDate
  },
  expiryDate: {
    format: formatDate
  },
  establishment: {
    format: establishment => {
      return establishment && establishment.name ? <Link page="establishment.read" establishmentId={establishment.id} label={establishment.name} /> : '-';
    }
  },
  species: {
    format: pilSpecies => {
      if (!pilSpecies) {
        return '-';
      }
      if (!Array.isArray(pilSpecies)) {
        return null;
      }

      return (
        <ul>
          { pilSpecies.map(species => <li key={species}>{species}</li>) }
        </ul>
      );
    }
  },
  procedures: {
    format: (procedures, pil) => {
      if (!procedures || !procedures.length) {
        return '-';
      }
      return <ul>
        {
          procedures.map((procedure) => <li key={ procedure }>
            { procedure }
            {
              procedure === 'D' && <Inset><Markdown>{ pil.notesCatD }</Markdown></Inset>
            }
            {
              (procedure === 'E' || procedure === 'F') && <Inset><Markdown>{ pil.notesCatF }</Markdown></Inset>
            }
          </li>)
        }
      </ul>;
    }
  },
  conditions: {
    format: conditions => {
      return (
        <Conditions
          conditions={conditions}
          canUpdate={false}
          label={<Snippet>conditions.hasConditions</Snippet>}
          noConditionsLabel={<Snippet>conditions.noConditions</Snippet>}
        />
      );
    }
  },
  pilTransfers: {
    format: transfers => {
      if (!transfers.length) {
        return '-';
      }
      return <ul>
        {
          transfers.map(transfer => {
            return <li key={transfer.id}>
              <span>{formatDate(transfer.createdAt)}: </span>
              <Link page="establishment" establishmentId={transfer.fromEstablishmentId} label={transfer.from.name} />
              <span> to </span>
              <Link page="establishment" establishmentId={transfer.toEstablishmentId} label={transfer.to.name} />
            </li>;
          })
        }
      </ul>;
    }
  },
  trainingNeed: {
    format: value => {
      if (!value) {
        return '-';
      }
      return <Markdown>{ value }</Markdown>;
    }
  },
  project: {
    format: project => {
      return <Link page="project.read" establishmentId={project.establishmentId} projectId={project.id} label={project.title} />;
    }
  }
};

const PIL = (pil) => {
  const licenceNumber = useSelector(state => state.model.pilLicenceNumber);
  const pils = useSelector(state => state.model.pils);
  const activePil = pils.filter((item) => item.status === 'active');
  const establishments = useSelector(state => state.model.establishments);

  //finding the user establishment, for the pil issued
  let activePilEstablishment = [];
  if (activePil.length > 0 && establishments.length > 0) {
    activePilEstablishment = establishments.filter((item) => item.id === activePil[0].establishmentId);
  }

  //determining the action
  let action = '';
  if (activePil.length > 0 && pil.status === 'pending') {
    action = 'remove';
  } else if (activePil.length > 0 && activePilEstablishment.length === 0 && pil.status === 'active') {
    action = 'revoke';
  }

  return <section className="profile-section">
    <ModelSummary
      model={{ ...pil, licenceNumber: pil.licenceNumber || licenceNumber }}
      formatters={formatters}
      schema={pilSchema}
    />

    {
      action &&
      <form method="post">
        <input type="hidden" name="establishmentId" value={pil.establishmentId} />
        <input type="hidden" name="pilId" value={pil.id} />
        <input type="hidden" name="action" value={action} />
        <button className="govuk-button button-warning" onClick={(e) => confirmPilAction(action, e)}>{action[0].toUpperCase()}{action.substring(1)} licence</button>
      </form>
    }
  </section>;
};

const confirmPilAction = (action, event) => {
  if (!window.confirm('Are you sure you wish to ' + action + ' this item?')) {
    event.preventDefault();
  }
};

const TrainingPIL = (pil) => {
  return <section className="profile-section">
    <ModelSummary
      model={{ ...pil }}
      formatters={formatters}
      schema={trainingPilSchema}
    />
  </section>;
};

export default function PILsList() {
  const name = useSelector(state => `${state.model.firstName} ${state.model.lastName}`);
  const pils = useSelector(state => sortBy(state.model.pils || [], 'issueDate'));
  const trainingPils = useSelector(state => sortBy(state.model.trainingPils || [], 'issueDate'));

  return (
    <Fragment>
      <Header
        title={name}
        subtitle="Personal Licences"
      />
      { !!pils.length && <h3>All PILs</h3> }
      {
        pils.map(pil => <PIL key={pil.id} {...pil} />)
      }
      { !!trainingPils.length && <h3>Training licences</h3> }
      {
        trainingPils.map(pil => <TrainingPIL key={pil.id} {...pil} />)
      }
    </Fragment>
  );
}
