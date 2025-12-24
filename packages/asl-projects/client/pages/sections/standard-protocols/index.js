import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function StandardProtocols({ onProgress, step, ...props }) {
  const history = useHistory();
  const [selection, setSelection] = useState('');

  const onContinue = e => {
    e.preventDefault();

    if (!selection) {
      alert('Please select a protocol type');
      return;
    }

    switch (selection) {
      case 'experimental':
        history.push('/protocols');
        break;
      case 'standard':
        // stay on this page or advance wizard step
        onProgress?.(step + 1);
        break;
      case 'editable':
        history.push('/protocols');
        break;
    }
  };

  return (
    <div className="govuk-grid-column-full">
      <h1 className="govuk-heading-l">Add a protocol</h1>
      <h2 className="govuk-heading-m">Adding protocols</h2>
      <div className="general-constraints-details-style" style={{ marginLeft: 30, marginTop: 30 }}>
        <p className="govuk-body">You will describe:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>the regulated procedures you may apply within each protocol</li>
          <li>the expected adverse effects of these procedures on the animals, and their likely incidence</li>
          <li>the control measures and humane endpoints you will use to limit severity of suffering</li>
        </ul>
        <p className="govuk-body">
          <a href="https://www.gov.uk/guidance/animal-research-technical-advice#guidance-notes-for-project-licence-applications" target="_blank" className="govuk-link">
            Read the guidance on writing protocols (opens in new tab)
          </a>
        </p>
      </div>

      <form onSubmit={onContinue}>
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
            What kind of protocol do you want to add?
          </legend>
          <div className="govuk-radios">
            {['experimental', 'standard', 'editable'].map(value => (
              <div key={value} className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  type="radio"
                  name="protocol-kind"
                  id={value}
                  value={value}
                  checked={selection === value}
                  onChange={e => setSelection(e.target.value)}
                />
                <label className="govuk-label govuk-radios__label" htmlFor={value}>
                  {value === 'experimental' && 'Experimental protocol'}
                  {value === 'standard' && 'Standard GA breeding protocol'}
                  {value === 'editable' && 'Editable GA breeding protocol template'}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="govuk-button-group">
          <button type="submit" className="govuk-button">Continue</button>
        </div>
      </form>
    </div>
  );
}
