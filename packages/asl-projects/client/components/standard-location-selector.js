import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import getLocations from '../helpers/get-locations';

const StandardLocationSelector = (props) => {
  const project = useSelector(state => state.project);
  const { establishment } = useSelector(state => state.application);
  const locations = getLocations(project, establishment);

  // Selected values passed via props
  const selected = props.value || [];

  return (
    <div className={`location-selector ${props.className || ''}`}>
      {props.label && (
        <label className="govuk-label">{props.label}</label>
      )}

      {props.hint && (
        <span className="govuk-hint">{props.hint}</span>
      )}

      {locations.length > 0 ? (
        <ul className="govuk-list govuk-list--bullet">
          {locations.map((location, index) => (
            <li key={location.value || index}>
              {location.label || location}
            </li>
          ))}
        </ul>
      ) : (
        <p className="govuk-body">None</p>
      )}

      <Link to="../establishments">Manage establishments</Link>
      <br />
      <Link to="../poles">Manage POLEs</Link>
    </div>
  );
};

export default StandardLocationSelector;
