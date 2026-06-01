import React, { useState } from 'react';
import { BuildProtocol } from './build-protocol';
import SectionsLink from '../../../../../components/sections-link';

const ProtocolFormBase = ({
                                      title,
                                      hint,
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

    if (!Object.keys(protocolTemplate.data || {}).length) {
      setError('This protocol template is not available yet');
      return;
    }

    const newProtocol = BuildProtocol(protocolTemplate, project);

    const mergedConditions = [
      ...(project.conditions || []),
      ...(protocolTemplate?.conditions || [])
    ].filter(
      (cond, index, arr) =>
        index === arr.findIndex(c => c.key === cond.key)
    );

    updateProjectAction({
      ...project,
      protocols: [...(project.protocols || []), newProtocol],
      "fate-of-animals": protocolTemplate?.data?.fate ?? project['fate-of-animals'],
      "fate-of-animals-complete": true,
      conditions: mergedConditions
    });

    ajaxSyncAction(['protocols', 'conditions', 'fate-of-animals', 'fate-of-animals-complete']);

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
            <h1 className="govuk-heading-l">{title}</h1>
            {hint && <span className="govuk-hint">{hint}</span>}
          </legend>

          <p className="govuk-body">Select a protocol</p>

          {error && (
            <span className="govuk-error-message">{error}</span>
          )}

          <div className="govuk-radios">
            {(gaBreading.groups || []).map((group, index) => (
              <React.Fragment key={group.title || index}>
                <h2 className={`govuk-heading-m${index > 0 ? ' govuk-!-margin-top-8' : ''}`}>
                  {group.title}
                </h2>
                {(group.protocols || []).map(protocol => {
                  const unavailable = !Object.keys(protocol.data || {}).length;

                  return (
                    <div className="govuk-radios__item" key={protocol.id}>
                      <input
                        className="govuk-radios__input"
                        id={protocol.id}
                        type="radio"
                        name={radioName}
                        value={protocol.value}
                        checked={selectedTemplate === protocol.value}
                        onChange={e => {
                          setSelectedTemplate(e.target.value);
                          setError('');
                        }}
                        disabled={unavailable}
                        aria-describedby={unavailable ? `${protocol.id}-hint` : undefined}
                      />
                      <label className="govuk-label govuk-radios__label" htmlFor={protocol.id}>
                        {protocol.label}
                      </label>
                      {unavailable && (
                        <div className="govuk-hint govuk-radios__hint" id={`${protocol.id}-hint`}>
                          This template is not available yet.
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          <div className="govuk-button-group govuk-!-margin-top-8">
            <button type="submit" className="govuk-button govuk-!-margin-right-4">
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

