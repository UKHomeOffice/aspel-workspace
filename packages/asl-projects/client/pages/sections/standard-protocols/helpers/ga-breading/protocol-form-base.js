import React, { useEffect, useRef, useState } from 'react';
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
  const errorSummaryRef = useRef(null);
  const protocolTypeRef = useRef(null);

  useEffect(() => {
    if (error) {
      errorSummaryRef.current?.focus();
    }
  }, [error]);

  const focusProtocolType = event => {
    event.preventDefault();
    protocolTypeRef.current?.focus();
  };

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
    <div>
      <SectionsLink />
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            className="govuk-error-summary govuk-!-margin-bottom-6"
            aria-labelledby="error-summary-title"
            role="alert"
            tabIndex="-1"
            ref={errorSummaryRef}
          >
            <h2 className="govuk-error-summary__title" id="error-summary-title">
              There is a problem
            </h2>

            <div className="govuk-error-summary__body">
              <ul className="govuk-list govuk-error-summary__list">
                <li>
                  <a href="#" onClick={focusProtocolType} aria-controls={radioName}>
                    {error}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
          <fieldset className="govuk-fieldset" aria-describedby={error ? `${radioName}-error` : undefined}>
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
              <h1 className="govuk-heading-l">{title}</h1>
              {hint && <span className="govuk-hint">{hint}</span>}
            </legend>

            {error && (
              <span id={`${radioName}-error`} className="govuk-error-message">{error}</span>
            )}

            <div className="govuk-radios" id={radioName}>
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
                        ref={!index && group.protocols?.[0]?.id === protocol.id ? protocolTypeRef : undefined}
                        disabled={unavailable}
                        aria-describedby={[
                          unavailable ? `${protocol.id}-hint` : null,
                          error ? `${radioName}-error` : null
                        ].filter(Boolean).join(' ') || undefined}
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
              Cancel
            </a>
          </div>
          </fieldset>
        </div>
      </form>
    </div>
  );
};

export default ProtocolFormBase;

