import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import { gaBreadingData } from './ga-breading-data';
import SectionsLink from '../../../../components/sections-link';
import { ajaxSync, updateProject } from '../../../../actions/projects';

const GABreedingProtocolForm = ({
                                  onContinue,
                                  onCancel,
                                  project,
                                  updateProjectAction,
                                  ajaxSyncAction,
                                  history,
                                  match
                                }) => {
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleProtocolChange = (event) => {
    const value = event.target.value;
    setSelectedTemplate(value);
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedTemplate) {
      setError('Please select a protocol');
      return;
    }

    const protocolTemplate = gaBreadingData.groups
      .flatMap(group => group.protocols)
      .find(protocol => protocol.value === selectedTemplate);

    if (protocolTemplate) {
      const protocolId = uuidv4();

      // Create protocol matching your project structure
      const newProtocol = {
        ...protocolTemplate.data,
        id: protocolId,
        title: protocolTemplate.label,
        complete: false,
        steps: protocolTemplate.data.steps || [{ id: uuidv4(), title: 'Step 1', description: '' }],
        locations: protocolTemplate.data.locations || [],
        conditions: protocolTemplate.data.conditions || [],
        animals: protocolTemplate.data.animals || {},
        speciesDetails: protocolTemplate.data.speciesDetails || []
      };

      // Update project with new protocol
      const updatedProject = {
        ...project,
        protocols: [
          ...(project.protocols || []),
          newProtocol
        ]
      };

      // Dispatch to update project state
      updateProjectAction(updatedProject);

      // Trigger sync to save to server
      ajaxSyncAction(['protocols']);

      // Call onContinue if needed
      if (onContinue) {
        onContinue({
          protocolType: 'standard',
          protocolId: protocolId,
          protocolData: newProtocol
        });
      }

      // Navigate to protocols page
      history.push('/protocols');
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();

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
              <span className="govuk-error-message">
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
                  checked={selectedTemplate === protocol.value}
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
                  checked={selectedTemplate === protocol.value}
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

            <a href="#" onClick={handleCancel}>Cancel</a>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    project: state.project
  };
};

const mapDispatchToProps = {
  updateProjectAction: updateProject,
  ajaxSyncAction: ajaxSync
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GABreedingProtocolForm);
