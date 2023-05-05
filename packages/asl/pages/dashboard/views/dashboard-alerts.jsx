import React from 'react';
import { useSelector } from 'react-redux';
import { Warning } from '@ukhomeoffice/react-components';
import { Snippet } from '@ukhomeoffice/asl-components';

function PersonalAlert({ alert }) {
  const contentPath = `warnings.personal.${alert.type}.${alert.overdue ? 'overdue' : 'due'}`;

  return (
    <Warning className="info dashboard-alert-personal">
      <p><Snippet alert={alert}>{contentPath}</Snippet></p>
    </Warning>
  );
}

function summaryContentKey(summary) {
  return (summary.overdue && summary.due)
    ? 'both'
    : (summary.overdue ? 'overdue' : 'due');
}

function EstablishmentAlert({ name, summary }) {
  const { pilReview, raDue, ropDue } = summary;
  const showPil = (pilReview.due + pilReview.overdue) > 0;
  const showRa = (raDue.due + raDue.overdue) > 0;
  const showRop = (ropDue.due + ropDue.overdue) > 0;

  const pluralise = (text, summary) => {
    if (summaryContentKey(summary) === 'due') {
      return summary.due === 1 ? text : `${text}s`;
    }

    return summary.overdue === 1 ? text : `${text}s`;
  };

  if (!showPil && !showRa && !showRop) {
    return null;
  }

  return (
    <Warning className="info dashboard-alert-establishment">
      <p><Snippet name={name}>warnings.establishment.has</Snippet></p>
      <ul>
        {
          showPil &&
          <li>
            <Snippet due={pilReview.due} overdue={pilReview.overdue} pilsUrl={pilReview.url} reviews={pluralise('review', pilReview)}>
              {`warnings.establishment.pilReview.${summaryContentKey(pilReview)}`}
            </Snippet>
          </li>
        }

        {
          showRa &&
          <li>
            <Snippet due={raDue.due} overdue={raDue.overdue} rasUrl={raDue.url} assessments={pluralise('assessment', raDue)}>
              {`warnings.establishment.raDue.${summaryContentKey(raDue)}`}
            </Snippet>
          </li>
        }

        {
          showRop &&
          <li>
            <Snippet due={ropDue.due} overdue={ropDue.overdue} ropsUrl={ropDue.url} returns={pluralise('return', ropDue)}>
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

  // if the alerts API call failed then don't crash the dashboard
  if (!alerts) {
    return null;
  }

  return (
    <div className="dashboard-alerts">
      {
        alerts.personal.map((alert, idx) => <PersonalAlert key={idx} alert={alert} />)
      }
      {
        alerts.establishments.map(establishment =>
          <EstablishmentAlert key={establishment.id} name={establishment.name} summary={establishment.summary} />
        )
      }
    </div>
  );
}
