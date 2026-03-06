import React, { useState } from 'react';
import { BuildProtocol } from './build-protocol';
import SectionsLink from '../../../../../components/sections-link';

const ProtocolFormBase = ({
                                      title,
                                      radioName,
                                      gaBreading,
                                      project,
                                      updateProjectAction,
                                      ajaxSyncAction,
                                      onContinue,
                                      onCancel,
                                      history,
                                      cancelPath
                                    }) => {
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedTemplate) {
      setError('Please select a protocol');
      return;
    }

    const protocolTemplate = gaBreading.groups
      .flatMap(group => group.protocols)
      .find(protocol => protocol.value === selectedTemplate);

    if (!protocolTemplate) return;

    const newProtocol = BuildProtocol(protocolTemplate, project);

    updateProjectAction({
      ...project,
      protocols: [...(project.protocols || []), newProtocol]
    });

    ajaxSyncAction(['protocols']);

    onContinue?.({
      protocolType: 'standard',
      protocolId: newProtocol.id,
      protocolData: newProtocol
    });

    history.push('/protocols');
  };

  return (
    <div className="govuk-form-group">
      <SectionsLink />
      <form onSubmit={handleSubmit}>
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
            <h1 className="govuk-fieldset__heading">{title}</h1>
          </legend>

          <p className="govuk-body">Select a protocol</p>

          {error && (
            <span className="govuk-error-message">{error}</span>
          )}

          <h2 className="govuk-heading-m">
            GA breeding protocols for mice and rats
          </h2>

          <div className="govuk-radios">
            {gaBreading.groups[0].protocols.map(protocol => (
              <div className="govuk-radios__item" key={protocol.id}>
                <input
                  className="govuk-radios__input"
                  type="radio"
                  name={radioName}
                  value={protocol.value}
                  checked={selectedTemplate === protocol.value}
                  onChange={e => setSelectedTemplate(e.target.value)}
                />
                <label className="govuk-label govuk-radios__label">
                  {protocol.label}
                </label>
              </div>
            ))}
          </div>

          <div className="govuk-button-group govuk-!-margin-top-8">
            <button type="submit" className="govuk-button">
              Continue
            </button>
            <a href="#" onClick={onCancel ?? (() => history.push(cancelPath))}>
              List of sections
            </a>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default ProtocolFormBase;
