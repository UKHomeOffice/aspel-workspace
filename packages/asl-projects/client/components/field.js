import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { addChange } from '../actions/projects';
import { throwError } from '../actions/messages';
import isUndefined from 'lodash/isUndefined';
import castArray from 'lodash/castArray';
import every from 'lodash/every';
import ReactMarkdown from 'react-markdown';
import { FEATURE_FLAG_STANDARD_PROTOCOLS } from '@asl/service/ui/feature-flag';
// ASL-5081/5082/5108: local field components add aria-describedby (hint AND
// error) to the control/fieldset - upstream associates neither (date) or only
// the hint. Drop-in subclasses; all other behaviour is inherited.
import { CheckboxGroup, DateInput, Input, RadioGroup, Select, TextArea } from '@ukhomeoffice/asl-components';
import RAPlaybackHint from './ra-playback-hint';
import AdditionalAvailability from './additional-availability';
import OtherSpecies from './other-species-selector';
import SpeciesSelector from './species-selector';
import LegacySpeciesSelector from './legacy-species-selector';
import AnimalQuantities from './animal-quantities';
import LocationSelector from './location-selector';
import ObjectiveSelector from './objective-selector';
import EstablishmentSelector from './establishment-selector';
import Duration from './duration';
import Keywords from './keywords';
import TextEditor from './editor';
import Repeater from './repeater-field';

import Fieldset from './fieldset';
import Comments from './comments';

import ErrorBoundary from './error-boundary';
import NtsCheckBoxWithModal from './checkbox';
import without from 'lodash/without';
import {
  coerceChoiceValue,
  findSelectedOption,
  findSelectedOptions,
  resolveFieldValue,
  resolveTemplateContent,
  resolveVisibleOptions
} from '../helpers/field-resolution';

/**
 * Where an option in a checkbox group is marked as exclusive, this handles
 * unchecking other options as appropriate to maintain that property:
 * - If an exclusive option is checked, then all other options are cleared
 * - If a non-exclusive option is checked, then any exclusive checkboxes are
 *   cleared
 *
 * @param {string[]} values           The values checked for the checkbox group
 * @param {string} toggledValue       The checkbox that was clicked by the user
 * @param {(object|string)[]} options The list of options in the checkbox group
 * @return {[string[], boolean]}      The new list of checked items, and a flag
 *                                    that is true if the item was removed
 *
 */
function calculateNewCheckboxValues(values, toggledValue, options) {
  if (values.includes(toggledValue)) {
    return [without(values, toggledValue), true];
  }

  const option = options.find(
    option =>
      (typeof option === 'string' ? option : option.value) === toggledValue
  );

  if (!option) {
    return [values, false];
  }

  if (option.behaviour === 'exclusive') {
    return [[toggledValue], values.length > 0];
  }

  const exclusiveOptions =
    options
      .filter(opt => opt.behaviour === 'exclusive')
      .map(opt => opt.value);

  const withoutExclusives = [...values, toggledValue].filter(value => !exclusiveOptions.includes(value));

  return [withoutExclusives, withoutExclusives.length <= values.length];
}

function renderMarkdownIfNeeded(content) {
  if (typeof content !== 'string') {
    return content;
  }

  const looksLikeMarkdown = (content.includes('[') && content.includes('](')) || content.includes('\n');
  return looksLikeMarkdown ? <ReactMarkdown>{content}</ReactMarkdown> : content;
}

class Field extends Component {

  state = {
    value: this.props.value
  }

  onFieldChange = value => {
    this.setState({ value }, this.save);
  }

  save = () => {
    this.onChange(this.state.value);
  }

  onChange = value => {
    return Promise.resolve()
      .then(() => {
        return this.props.showChanges && this.props.addChange && this.props.addChange(this.props.name);
      })
      .then(() => {
        return this.props.onChange && this.props.onChange(value);
      })
      .catch(err => {
        this.props.throwError(err.message || 'Something went wrong');
      });
  }

  mapOptions(options = []) {
    return resolveVisibleOptions(options, this.props)
      .map(option => {
      if (!option.reveal) {
        return option;
      }
      return {
        ...option,
        reveal: (
          <div className="govuk-inset-text">
            { option.additionalInfo && <ReactMarkdown>{option.additionalInfo}</ReactMarkdown> }
            {
              option.reveal.component
                ? option.reveal.component
                : (
                  <Fieldset
                    {...this.props}
                    fields={castArray(option.reveal)}
                  />
                )
            }
          </div>
        )
      };
    });
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    const { value } = this.state;
    const type = resolveFieldValue(this.props.type, this.props);

    let { label, hint } = this.props.altLabels ? this.props.alt : this.props;

    label = resolveTemplateContent(label, this.props);
    hint = resolveTemplateContent(hint, this.props);
    label = renderMarkdownIfNeeded(label);
    hint = renderMarkdownIfNeeded(hint);

    if (this.props.raPlayback) {
      hint = <RAPlaybackHint {...this.props.raPlayback} hint={hint} />;
    }

    if (this.props.fallbackLink && this.props.options && !this.props.options.length) {
      return <a href={this.props.fallbackLink.url}>{this.props.fallbackLink.label}</a>;
    }
    if (type === 'animal-quantities') {
      return <AnimalQuantities {...this.props} value={value} label={label} hint={hint} />;
    }
    if (type === 'species-selector') {
      return <SpeciesSelector
        {...this.props}
        value={value}
        label={label}
        hint={hint}
        onChange={ this.onFieldChange }
      />;
    }
    if (type === 'establishment-selector') {
      return <EstablishmentSelector {...this.props} value={value} label={label} hint={hint} />;
    }
    if (type === 'additional-availability') {
      return <AdditionalAvailability {...this.props} value={value} label={label} hint={hint} />;
    }
    if (type === 'legacy-species-selector') {
      return <LegacySpeciesSelector {...this.props} value={value} label={label} hint={hint} />;
    }
    if (type === 'location-selector') {
      return <LocationSelector {...this.props} value={value} label={label} hint={hint} />;
    }
    if (type === 'objective-selector') {
      return <ObjectiveSelector {...this.props} value={value} label={label} hint={hint} />;
    }
    if (type === 'other-species-selector') {
      return <OtherSpecies {...this.props} value={value} label={label} hint={hint} />;
    }
    if (type === 'repeater') {
      return <Repeater
        {...this.props}
        type={this.props.name}
        items={value}
        label={label}
        hint={hint}
        noComments={true}
        onSave={val => this.onFieldChange(val)}
      />;
    }
    if (type === 'duration') {
      return <Duration
        name={ this.props.name }
        label={ label }
        hint={ hint }
        error={ this.props.error }
        value={ value }
        onChange={ val => this.onFieldChange(val) }
      />;
    }
    if (type === 'keywords') {
      return <Keywords
        name={ this.props.name }
        label={ label }
        hint={ hint }
        error={ this.props.error }
        value={ value }
        onChange={ val => this.onFieldChange(val) }
      />;
    }
    if (type === 'select') {
      const options = this.mapOptions(this.props.options || []);

      return <Select
        className={ this.props.className }
        label={ label }
        hint={ hint }
        name={ this.props.name }
        options={ options }
        value={ value }
        error={ this.props.error }
        onChange={ e => this.onFieldChange(e.target.value) }
      />;
    }
    if (type === 'paragraph') {
      return (
        <div className={this.props.className}>
          {label && <label className="govuk-label">{label}</label>}
          {hint && <span className="govuk-hint">{hint}</span>}
          {this.props.error && <span className="govuk-error-message">{this.props.error}</span>}
          <TextEditor
            name={ this.props.name }
            value={ value }
            onChange={ this.onFieldChange }
            readOnly={true}
          />
        </div>
      );
    }
    if (type === 'standard-list') {
      const options = this.mapOptions(this.props.options || []);
      const selectedOptions = findSelectedOptions(options, value);

      return (
        <div className={this.props.className}>
          {label && <label className="govuk-label">{label}</label>}
          {hint && <span className="govuk-hint">{hint}</span>}
          {this.props.error && <span className="govuk-error-message">{this.props.error}</span>}

          {selectedOptions.length > 0 ? (
            <ul className="govuk-list govuk-list--bullet">
              {selectedOptions.map((opt, i) => (
                <li key={i}>
                  <strong className="govuk-body">{opt.label}</strong>
                  {opt.hint && (
                    <div className="govuk-hint govuk-!-margin-top-1">{opt.hint}</div>
                  )}
                  {opt.reveal}
                </li>
              ))}
            </ul>
          ) : (
            <p><em>No answer provided</em></p>
          )}
        </div>
      );
    }
    if (type === 'standard-radio') {
      const options = this.mapOptions(this.props.options || []);
      const selectedOption = findSelectedOption(options, value);

      return (
        <div className={this.props.className}>
          {label && <label className="govuk-label">{label}</label>}
          {hint && <span className="govuk-hint">{hint}</span>}
          {this.props.error && <span className="govuk-error-message">{this.props.error}</span>}

          {selectedOption ? (
            <p className="govuk-body">{selectedOption.label}</p>
          ) : (
            <p className="govuk-body"><em>No answer provided</em></p>
          )}

          {selectedOption?.reveal}
        </div>
      );
    }
    if (type === 'date') {
      return <DateInput
        className={ this.props.className }
        label={ label }
        hint={ hint }
        name={ this.props.name }
        value={ value || '' }
        error={ this.props.error }
        onChange={value => this.onFieldChange(value) }
      />;
    }
    if (type === 'radio') {
      const options = this.mapOptions(this.props.options || []);

      return <RadioGroup
        className={ this.props.className }
        label={ label }
        hint={ hint }
        name={ this.props.name }
        options={ options }
        value={ value }
        error={ this.props.error }
        inline={ this.props.inline }
        onChange={ e => {
          this.onFieldChange(coerceChoiceValue(e.target.value));
        }}
      />;
    }
    if (type === 'checkbox' && this.props.name === 'fate-of-animals') {
      const options = this.mapOptions(this.props.options || []);

      return <NtsCheckBoxWithModal
        className={ this.props.className }
        label={ label }
        hint={ hint }
        name={ this.props.name }
        options={ options }
        value={ value }
        error={ this.props.error }
        inline={ this.props.inline }
        project={this.props.project}
        onFieldChange={this.onFieldChange}
      />;
    }
    if (type === 'checkbox' || type === 'permissible-purpose') {
      const options = this.mapOptions(this.props.options || []);

      return <CheckboxGroup
        className={ this.props.className }
        label={ label }
        hint={ hint }
        name={ this.props.name }
        options={ options }
        value={ value }
        error={ this.props.error }
        inline={ this.props.inline }
        onChange={ e => {
          const [newValue, itemRemoved] = calculateNewCheckboxValues(
            [...(value || [])],
            e.target.value,
            options
          );

          if (this.props.confirmRemove && itemRemoved) {
            if (this.props.confirmRemove(this.props.project, e.target.value)) {
              this.onFieldChange(newValue);
            } else {
              e.preventDefault();
              return false;
            }
          }

          this.onFieldChange(newValue);
        }}
      />;
    }
    if (type === 'textarea') {
      return <TextArea
        className={ this.props.className }
        label={ label }
        hint={ hint }
        name={ this.props.name }
        value={ value || '' }
        error={ this.props.error }
        autoExpand={ true }
        onChange={ e => this.onFieldChange(e.target.value) }
      />;
    }
    if (type === 'texteditor') {
      return <TextEditor
        name={ this.props.name }
        label={ label }
        hint={ hint }
        value={ value }
        error={ this.props.error }
        onChange={ this.onFieldChange }
      />;
    }
    if (type === 'declaration') {
      return <CheckboxGroup
        options={[{
          label: this.props.label,
          value: true
        }]}
        label=""
        className="smaller"
        name={this.props.name}
        hint={hint}
        value={value}
        error={this.props.error}
        onChange={ e => this.onFieldChange(e.target.checked) }
      />;
    }
    return <Input
      className={ this.props.className }
      type={ type || 'text' }
      label={ label }
      hint={ hint }
      name={ this.props.name }
      value={ value || '' }
      error={ this.props.error }
      onChange={ e => this.onFieldChange(e.target.value)}
      inputMode={this.props.inputMode}
    />;
  }
}

const mapStateToProps = ({ project, settings, application, static: { keycloakRoles = [] } = {} }, { name, conditional, optionsFromSettings, options, value, onFieldChange }) => {
  options = optionsFromSettings ? settings[optionsFromSettings] : options;
  return {
    options,
    project,
    showChanges: !!onFieldChange && application && !application.newApplication,
    value: !isUndefined(value) ? value : project && project[name],
    show: !conditional || every(Object.keys(conditional), key => conditional[key] === project[key]),
    grantedVersion: application && application.grantedVersion,
    standardProtocolsEnabled: keycloakRoles.includes(FEATURE_FLAG_STANDARD_PROTOCOLS)
  };
};

const ConnectedField = connect(mapStateToProps, { addChange, throwError })(Field);

const FieldGroup = props => {
  const showComments = !props.noComments && props.type !== 'repeater';
  return (
    <Fragment>
      <ConnectedField {...props} />
      {
        showComments && <Comments
          field={props.commentKey ?? props.name}
          additionalCommentFields={props.additionalCommentFields ?? []}
        />
      }
    </Fragment>
  );
};

const SafeField = props => (
  <ErrorBoundary
    details={`Field: ${props.name}`}
  >
    <FieldGroup { ...props } />
  </ErrorBoundary>
);

export default SafeField;
