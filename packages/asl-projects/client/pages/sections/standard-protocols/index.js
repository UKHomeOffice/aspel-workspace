import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import SectionsLink from '../../../components/sections-link';

export default function StandardProtocols({ ...props }) {
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
        history.push('/protocols', {
        });
        break;

      case 'standard':
        history.push('/ga-breeding',{
          createProtocolType: selection
        });

        break;
      case 'editable':
        history.push('/protocols', {
          createProtocolType: selection
        });
        break;
      default:
    }
  };

  const onCancel = e => {
    e.preventDefault();
    // Navigate to home which shows the List of sections
    history.push('/');
  };

  return (
    <div className="govuk-grid-column-full">
      <SectionsLink />
      <h1 className="govuk-heading-l govuk-!-margin-bottom-6">Add a protocol</h1>

      <div className="govuk-!-margin-bottom-8">
        <h2 className="govuk-heading-m">Adding protocols</h2>
        <div className="playback general-constraints-details-style govuk-!-margin-top-4 govuk-!-margin-bottom-6" style={{ paddingLeft: '30px' }}>
          <p className="govuk-body">You will describe:</p>
          <ul className="govuk-list govuk-list--bullet">
            <li>the regulated procedures you may apply within each protocol</li>
            <li>the expected adverse effects of these procedures on the animals, and their likely incidence</li>
            <li>the control measures and humane endpoints you will use to limit severity of suffering</li>
          </ul>
          <p className="govuk-body govuk-!-margin-top-4">
            <a
              href="https://www.gov.uk/guidance/animal-research-technical-advice#guidance-notes-for-project-licence-applications"
              target="_blank"
              rel="noopener noreferrer"
              className="govuk-link"
            >
              Read the guidance on writing protocols (opens in new tab)
            </a>
          </p>
        </div>
      </div>

      <div className="govuk-!-margin-bottom-8">
        <h2 className="govuk-heading-m">
          Standard protocols for breeding genetically altered animals
        </h2>

        <div className="playback general-constraints-details-style govuk-!-margin-top-4 govuk-!-margin-bottom-6">
          <p className="govuk-body">
            The standard protocols for breeding genetically altered (GA) animals
            are intended to cover the needs of most users who breed established
            lines of GA mice, rats or zebrafish, or create new lines.
          </p>

          <p className="govuk-body govuk-!-margin-top-4">You can select a protocol to include directly in your application:</p>

          <ul className="govuk-list govuk-list--bullet govuk-!-margin-top-4">
            <li>The fixed versions should be usable in most cases</li>
            <li>
              You only need to add details about how you will be using the
              standard protocol in your project
            </li>
            <li>
              Additional information is needed for the moderate and severe
              breeding and maintenance protocols
            </li>
          </ul>

          <p className="govuk-body govuk-!-margin-top-4">
            In some scenarios you may need to use an editable template to create
            a non-standard GA breeding protocol.
          </p>
        </div>
      </div>

      <div className="govuk-!-margin-bottom-8">
        <h3 className="govuk-heading-s">
          When you might need to use an editable template
        </h3>

        <div className="playback general-constraints-details-style govuk-!-margin-top-4 govuk-!-margin-bottom-6">
          <p className="govuk-body">Examples of when you may need to create a non-standard GA breeding protocol using an editable template include scenarios where you are:</p>
          <ul className="govuk-list govuk-list--bullet govuk-!-margin-top-4">
            <li>carrying out non-standard breeding or maintenance procedures</li>
            <li>phenotyping prior to experimental procedures</li>
            <li>using species other than mice, rats or zebrafish</li>
            <li>using a different reproductive model</li>
            <li>behavioural tests with no welfare implications</li>
          </ul>
        </div>

        <p className="govuk-body">
          <a
            href="https://assets.publishing.service.gov.uk/media/62bb1608d3bf7f662eea3ac3/Guidance_on_the_use_of_Standard_Genetically_Altered_Animal_Protocols.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="govuk-link"
          >
            Read the guidance on using standard protocols (opens in a new tab)
          </a>
        </p>
      </div>

      <div className="govuk-!-margin-bottom-8">
        <form onSubmit={onContinue}>
          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--m govuk-!-margin-bottom-4">
              What kind of protocol do you want to add?
            </legend>
            <div className="govuk-radios" data-module="govuk-radios">
              {['experimental', 'standard', 'editable'].map(value => (
                <div key={value} className="govuk-radios__item govuk-!-margin-bottom-3">
                  <input
                    className="govuk-radios__input"
                    type="radio"
                    name="select-protocol-type"
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

          <div className="govuk-button-group govuk-!-margin-top-8">
            <button
              type="submit"
              className="govuk-button govuk-!-margin-right-4 govuk-!-padding-left-4 govuk-!-padding-right-4"
            >
              Continue
            </button>
            <a href='#' onClick={onCancel}>List of sections</a>
          </div>
        </form>
      </div>
    </div>
  );
}
