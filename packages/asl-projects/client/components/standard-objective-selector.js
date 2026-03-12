import React from 'react';
import { Link } from 'react-router-dom';

const StandardObjectiveSelector = ({ ...props }) => {
  const objectives = props.project?.objectives || [];

  return (
    <>
        {props.label && (
          <label className="govuk-label">{props.label}</label>
        )}

        {props.hint && (
          <span className="govuk-hint">{props.hint}</span>
        )}
      {objectives.length > 0 ? (
        <ul className="govuk-list govuk-list--bullet">
          {objectives
            .filter(o => o.title)
            .map(o => (
              <li key={o.id}>{o.title}</li>
            ))}
        </ul>
      ) : (
        <p className="govuk-body">None</p>
      )}
      <Link to="../action-plan">Manage objectives</Link>
    </>
  );
};

export default StandardObjectiveSelector;
