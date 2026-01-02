import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import { gaBreadingData } from './ga-breading-data';
import { clearProtocolSelection, selectProtocol } from '../../../../actions/protocols';
import SectionsLink from '../../../../components/sections-link';

const GABreedingProtocolForm = ({
                                  onContinue,
                                  onCancel,
                                  selectedProtocol,
                                  projectData,
                                  selectProtocolAction,
                                  clearProtocolSelectionAction,
                                  history,
                                  match
                                }) => {
  const [error, setError] = useState('');
  const [localSelection, setLocalSelection] = useState(selectedProtocol || '');

  useEffect(() => {
    if (selectedProtocol) {
      setLocalSelection(selectedProtocol);
    }
  }, [selectedProtocol]);

  useEffect(() => {
    if (projectData && projectData.protocol && !selectedProtocol) {
      const existingProtocol = projectData.protocol.value;
      setLocalSelection(existingProtocol);
    }
  }, [projectData, selectedProtocol]);

  const handleProtocolChange = (event) => {
    const value = event.target.value;
    setLocalSelection(value);
    setError('');

    const protocolData = gaBreadingData.groups
      .flatMap(group => group.protocols)
      .find(protocol => protocol.value === value)?.data;

    if (protocolData) {
      selectProtocolAction('standard', value, protocolData); // <-- add 'standard' as journey
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    if (!localSelection) {
      setError('Please select a protocol');
      return;
    }

    const protocolTemplate = gaBreadingData.groups
      .flatMap(group => group.protocols)
      .find(protocol => protocol.value === localSelection);

    if (protocolTemplate) {
      const protocolId = uuidv4(); // Generate unique ID

      // Create complete protocol data matching your structure
      const protocolData = {
        ...protocolTemplate.data,
        id: protocolId, // Use UUID, not template value
        complete: false,
        steps: protocolTemplate.data.steps || [{ id: uuidv4() }],
        locations: protocolTemplate.data.locations || [],
        conditions: protocolTemplate.data.conditions || []
      };

      // Store in Redux for Protocols component to pick up
      selectProtocolAction('standard', protocolId, protocolData, true); // isNew = true

      // Call onContinue if parent component needs it
      if (onContinue) {
        onContinue({
          protocolType: 'standard',
          protocolId: protocolId,
          protocolData: protocolData
        });
      }

      // Navigate
      history.push('/protocols');
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    clearProtocolSelectionAction();

    if (onCancel) {
      onCancel();
    } else {
      history.push('/standard-protocol');
    }
  };


  return (
    <div className="govuk-form-group">
      <SectionsLink />
      <form onSubmit={handleSubmit}>
        <fieldset className="govuk-fieldset" aria-describedby="standard-protocols-hint">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
            <h1 className="govuk-fieldset__heading">
              Add a standard GA breeding protocol
            </h1>
          </legend>

          <p className="govuk-body" style={{ marginBottom: 0 }}>
            Select a protocol
          </p>

          {error && (
            <div className="govuk-form-group--error">
                <span className="govuk-error-message govuk-visually-hidden">
                     {error}
                </span>
            </div>
          )}

          {/* First group - Mice and rats */}
          <h2 className="govuk-heading-m">GA breeding protocols for mice and rats</h2>

          <div className="govuk-radios" data-module="govuk-radios">
            {gaBreadingData.groups[0].protocols.map((protocol) => (
              <div className="govuk-radios__item" key={protocol.id}>
                <input
                  className="govuk-radios__input"
                  id={protocol.id}
                  name="standard-protocols"
                  type="radio"
                  value={protocol.value}
                  checked={localSelection === protocol.value}
                  onChange={handleProtocolChange}
                />
                <label
                  className="govuk-label govuk-radios__label"
                  htmlFor={protocol.id}
                >
                  {protocol.label}
                </label>
              </div>
            ))}
          </div>

          {/* Second group - Zebrafish */}
          <h2 className="govuk-heading-m" style={{ marginTop: '30px' }}>GA zebrafish breeding protocols</h2>

          <div className="govuk-radios" data-module="govuk-radios">
            {gaBreadingData.groups[1].protocols.map((protocol) => (
              <div className="govuk-radios__item" key={protocol.id}>
                <input
                  className="govuk-radios__input"
                  id={protocol.id}
                  name="standard-protocols"
                  type="radio"
                  value={protocol.value}
                  checked={localSelection === protocol.value}
                  onChange={handleProtocolChange}
                />
                <label
                  className="govuk-label govuk-radios__label"
                  htmlFor={protocol.id}
                >
                  {protocol.label}
                </label>
              </div>
            ))}
          </div>

          <div className="govuk-button-group govuk-!-margin-top-8">
            <button
              type="submit"
              className="govuk-button govuk-!-margin-right-4 govuk-!-padding-left-4 govuk-!-padding-right-4"
            >
              Continue
            </button>

            <a href='#' onClick={handleCancel}>Cancel</a>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    selectedProtocol: state.protocols?.selectedProtocol || '',
    projectData: state.project?.data || null
  };
};

const mapDispatchToProps = {
  selectProtocolAction: selectProtocol,
  clearProtocolSelectionAction: clearProtocolSelection
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GABreedingProtocolForm);
