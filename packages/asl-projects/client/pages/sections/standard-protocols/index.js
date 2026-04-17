import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Details } from '@ukhomeoffice/asl-components';

export default function StandardProtocols() {
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
        history.push('/protocols?addProtocol=true');
        break;

      case 'standard':
        history.push('/ga-breeding', {
          createProtocolType: selection
        });
        break;

      case 'editable':
        history.push('/editable-ga-breeding', {
          createProtocolType: selection
        });
        break;

      default:
        break;
    }
  };

  const onCancel = e => {
    e.preventDefault();
    history.push('/');
  };

  const options = [
    {
      value: 'experimental',
      label: 'Experimental protocol',
    },
    {
      value: 'standard',
      label: 'Standard GA breeding protocol',
      hint: 'Most of the answers are fixed'
    },
    {
      value: 'editable',
      label: 'Non-standard GA breeding protocol (editable template)',
      hint: 'Most of the answers are prefilled, but editable'
    }
  ];

  return (
    <div className="govuk-grid-column-full">

      <h1 className="govuk-heading-l govuk-!-margin-bottom-6">
        Add a protocol
      </h1>

      {/* Intro section */}
      <div className="govuk-!-margin-bottom-8">
        <h2 className="govuk-heading-m">Adding protocols</h2>

        <p className="govuk-body">You will describe:</p>

        <ul className="govuk-list govuk-list--bullet">
          <li>the regulated procedures you may apply within each protocol</li>
          <li>expected adverse effects and their likely incidence</li>
          <li>control measures and humane endpoints to limit suffering</li>
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
        <p className="govuk-body govuk-!-margin-top-4">
          <a
            href="https://assets.publishing.service.gov.uk/media/68947734e7be62b4f06430e1/Guidance_on_the_use_of_Standard_Genetically_Altered_Animal_Protocols.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="govuk-link"
          >
            View the standard protocols (on GOV.UK - opens in a new tab)
          </a>
        </p>
      </div>

      {/* Guidance section */}
      <div className="govuk-!-margin-bottom-8">

        <h2 className="govuk-heading-m">Standard protocols for breeding genetically altered animals</h2>

        <Details
          id="standard-protocols"
          summary="the guidance on ‘Standard protocols for breeding genetically altered animals’"
          dynamicShow={true}
        >
          <div className="govuk-inset-text">

            <p className="govuk-body">
              The standard protocols for breeding genetically altered (GA) animals are intended to cover the needs of
              most users who breed and/or create lines of GA mice, rats or zebrafish.
            </p>

            <p className="govuk-body govuk-!-margin-top-4">
              You can select any of the standard protocols to include directly in your application. They mainly have
              fixed answers and you only need to add details where prompted, for example:
            </p>

            <ul className="govuk-list govuk-list--bullet govuk-!-margin-top-4">
              <li>number of animals</li>
              <li>locations where procedures will be carried out</li>
              <li>adverse effects, control measures and humane endpoints for specific strains in moderate breeding and
                maintenance protocols
              </li>
            </ul>

            <p className="govuk-body govuk-!-margin-top-4">
              For moderate B&M protocols, you will need to replicate adverse effects from experimental protocols using
              these animals, with modifications to reflect any different harms required for experimental use.
            </p>

            <p className="govuk-body">
              There is also a template option with prefilled answers that you can edit. You can use this to create a
              non-standard GA breeding protocol on rare occasions when necessary.
            </p>

            <h3 className="govuk-heading-m govuk-!-margin-top-6">
              When you might need to use an editable template
            </h3>

            <p className="govuk-body">
              Examples of when you might need to create a non-standard GA breeding protocol include:
            </p>

            <ul className="govuk-list govuk-list--bullet govuk-!-margin-top-4">
              <li>using species other than mice, rats or zebrafish</li>
              <li>carrying out non-standard procedures for creation, breeding or maintenance of GA animals</li>
              <li>carrying out breeding/maintenance where animals may experience severe harms</li>
            </ul>

            <p className="govuk-body govuk-!-margin-top-4">
              If you are creating a non-standard GA breeding protocol, you should:
            </p>

            <ul className="govuk-list govuk-list--bullet govuk-!-margin-top-4">
              <li>seek advice from your Named Veterinary Surgeon (NVS)</li>
              <li>still use standard wording where applicable</li>
              <li>ensure you provide scientific justification for any non-standard procedures</li>
            </ul>

            <p className="govuk-body govuk-!-margin-top-4">
              <a
                href="https://assets.publishing.service.gov.uk/media/62bb1608d3bf7f662eea3ac3/Guidance_on_the_use_of_Standard_Genetically_Altered_Animal_Protocols.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="govuk-link"
              >
                Read the guidance on using standard protocols (opens in new tab)
              </a>
            </p>

            <p className="govuk-body govuk-!-margin-top-4">
              <a
                href="https://assets.publishing.service.gov.uk/media/68947734e7be62b4f06430e1/Guidance_on_the_use_of_Standard_Genetically_Altered_Animal_Protocols.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="govuk-link"
              >
                View the standard protocols (on GOV.UK - opens in a new tab)
              </a>
            </p>

          </div>
        </Details>
      </div>

      {/* Form section */}
      <div className="govuk-!-margin-bottom-8">
        <form onSubmit={onContinue}>

          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--m govuk-!-margin-bottom-4">
              What type of protocol do you want to add?
            </legend>

            <div className="govuk-radios">
              {options.map(option => (
                <div className="govuk-radios__item">
                  <input
                    className="govuk-radios__input"
                    type="radio"
                    name="select-protocol-type"
                    id={option.value}
                    value={option.value}
                    checked={selection === option.value}
                    onChange={e => setSelection(e.target.value)}
                    aria-describedby={`${option.value}-hint`}
                  />

                  <label
                    className="govuk-label govuk-radios__label"
                    htmlFor={option.value}
                  >
                    {option.label}
                  </label>

                  {option.hint && (
                    <div
                      className="govuk-hint govuk-radios__hint"
                      id={`${option.value}-hint`}
                    >
                      {option.hint}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </fieldset>

          <div className="govuk-button-group govuk-!-margin-top-8">
            <button
              type="submit"
              className="govuk-button govuk-!-margin-right-4"
            >
              Continue
            </button>

            <a href="#" onClick={onCancel} className="govuk-link">
              List of sections
            </a>
          </div>

        </form>
      </div>

    </div>
  );
}
