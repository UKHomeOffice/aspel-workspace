import React from 'react';
import { useSelector } from 'react-redux';
import { Warning } from '@ukhomeoffice/react-components';
import { Snippet } from '@asl/components';

function PersonalAlert({ alert }) {
  const contentPath = `warnings.personal.${alert.type}.${alert.overdue ? 'overdue' : 'due'}`;

  return (
    <Warning className="info dashboard-alert">
      <p><Snippet alert={alert}>{contentPath}</Snippet></p>
    </Warning>
  );
}

function summaryContentKey(summary) {
  return (summary.overdue && summary.due)
    ? 'both'
    : (summary.overdue ? 'overdue' : 'due');
}

function EstablishmentAlert({ id, name, summary }) {
  const { pilReview, raDue, ropDue } = summary;
  const showPil = (pilReview.due + pilReview.overdue) > 0;
  const showRa = (raDue.due + raDue.overdue) > 0;
  const showRop = (ropDue.due + ropDue.overdue) > 0;

  if (!showPil && !showRa && !showRop) {
    return null;
  }

  return (
    <Warning className="info dashboard-alert">
      <p>{name} has: </p>
      <ul>
        {
          showPil &&
          <li>
            <Snippet due={pilReview.due} overdue={pilReview.overdue}>
              {`warnings.establishment.pilReview.${summaryContentKey(pilReview)}`}
            </Snippet>
          </li>
        }

        {
          showRa &&
          <li>
            <Snippet due={raDue.due} overdue={raDue.overdue}>
              {`warnings.establishment.raDue.${summaryContentKey(raDue)}`}
            </Snippet>
          </li>
        }

        {
          showRop &&
          <li>
            <Snippet due={ropDue.due} overdue={ropDue.overdue}>
              {`warnings.establishment.ropDue.${summaryContentKey(ropDue)}`}
            </Snippet>
          </li>
        }
      </ul>
    </Warning>
  );
}

export default function DashboardAlerts() {
  const { alerts } = useSelector(state => state.static);

  return (
    <div className="dashboard-alerts">
      {
        alerts.personal.map((alert, idx) => <PersonalAlert key={idx} alert={alert} />)
      }
      {
        alerts.establishments.map(establishment =>
          <EstablishmentAlert
            key={establishment.id}
            id={establishment.id}
            name={establishment.name}
            summary={establishment.summary}
          />
        )
      }
    </div>
  );
}
