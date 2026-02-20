import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { addChange } from '../actions/projects';
import { throwError } from '../actions/messages';
import isUndefined from 'lodash/isUndefined';
import castArray from 'lodash/castArray';
import every from 'lodash/every';
import Mustache from 'mustache';

import ReactMarkdown from 'react-markdown';

import { CheckboxGroup, DateInput, Input, RadioGroup, Select, TextArea } from '@ukhomeoffice/react-components';

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
    return options.filter(Boolean).map(option => {
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

    let { label, hint } = this.props.altLabels ? this.props.alt : this.props;

    label = typeof label === 'function' ? label(this.props) : label;
    hint = typeof hint === 'function' ? hint(this.props) : hint;

    // Create enhanced context for Mustache
    const mustacheContext = {
      ...this.props,
      // Flatten values to root level
      ...(this.props.values || {}),
      // Also keep values nested
      values: this.props.values
    };

    // Only render Mustache for strings, preserve other types (React elements, null, etc.)
    if (typeof label === 'string') {
      label = Mustache.render(label, mustacheContext);
    }

    if (typeof hint === 'string') {
      hint = Mustache.render(hint, mustacheContext);
    }

    if (this.props.raPlayback) {
      hint = <RAPlaybackHint {...this.props.raPlayback} hint={hint} />;
    }

    if (this.props.fallbackLink && this.props.options && !this.props.options.length) {
      return <a href={this.props.fallbackLink.url}>{this.props.fallbackLink.label}</a>;
    }
    if (this.props.type === 'animal-quantities') {
      return <AnimalQuantities {...this.props} value={value} label={label} hint={hint} />;
    }

    const getSelectedOptions = (value, options = []) => {
      const values = castArray(value || []);

      return options
        .filter(opt => values.includes(opt.value))
        .map(opt => ({
          ...opt,

          label: typeof opt.label === 'function' ? opt.label(this.props) : opt.label,

          hint: typeof opt.hint === 'function' ? opt.hint(this.props) : opt.hint
        }));
    }
    if (this.props.type === 'standard-list') {
      const options = this.mapOptions(this.props.options || []);
      const selected = getSelectedOptions(value, options);

      return (
        <div className={this.props.className}>
          {label && <label className="govuk-label">{label}</label>}
          {hint && <span className="govuk-hint">{hint}</span>}
          {this.props.error && (
            <span className="govuk-error-message">{this.props.error}</span>
          )}

          {selected.length > 0 && (
            <ul className="govuk-list govuk-list--bullet">
              {selected.map((opt, i) => (
                <li key={i}>
                  <strong className="govuk-body">{opt.label}</strong>

                  {opt.hint && (
                    <div className="govuk-hint govuk-!-margin-top-1">
                      {opt.hint}
                    </div>
                  )}

                  {opt.reveal}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    const renderRichText = (value) => {
      if (!value) return null;

      // Handle arrays as bullet lists
      if (Array.isArray(value)) {
        return (
          <ul className="govuk-list govuk-list--bullet">
            {value.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      }

      let text = '';

      // Flatten rich text into a single string
      if (typeof value === 'string') {
        text = value;
      } else if (value.object === 'document' && value.content) {
        text = value.content
          .map(
            block =>
              block.content?.map(node => node.text).join('') || ''
          )
          .join('\n\n');
      }

      // Split into lines and trim
      const lines = text
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);

      // Separate bullets from regular text
      const bullets = lines
        .filter(line => line.startsWith('•'))
        .map(line => line.replace(/^•\s*/, ''));

      const paragraphs = lines.filter(line => !line.startsWith('•'));

      return (
        <div>
          {paragraphs.map((p, i) => (
            <p key={`p-${i}`} className="govuk-body">
              {p}
            </p>
          ))}

          {bullets.length > 0 && (
            <ul className="govuk-list govuk-list--bullet">
              {bullets.map((b, i) => (
                <li key={`b-${i}`}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      );
    };
    if (this.props.type === 'paragraph') {
      return (
        <div className={this.props.className}>
          {this.props.label && <label className="govuk-label">{this.props.label}</label>}
          {this.props.hint && <span className="govuk-hint">{this.props.hint}</span>}
          {this.props.error && <span className="govuk-error-message">{this.props.error}</span>}
          <p className="govuk-body">{renderRichText(value)}</p>
        </div>
      )
    }

    if (this.props.type === 'species-selector') {
      return <SpeciesSelector
        {...this.props}
        value={value}
        label={label}
        hint={hint}
        onChange={ this.onFieldChange }
      />;
    }

    if (this.props.type === 'establishment-selector') {
      return <EstablishmentSelector {...this.props} value={value} label={label} hint={hint} />;
    }
    if (this.props.type === 'additional-availability') {
      return <AdditionalAvailability {...this.props} value={value} label={label} hint={hint} />;
    }
    if (this.props.type === 'legacy-species-selector') {
      return <LegacySpeciesSelector {...this.props} value={value} label={label} hint={hint} />;
    }
    if (this.props.type === 'location-selector') {
      return <LocationSelector {...this.props} value={value} label={label} hint={hint} />;
    }
    if (this.props.type === 'objective-selector') {
      return <ObjectiveSelector {...this.props} value={value} label={label} hint={hint} />;
    }
    if (this.props.type === 'other-species-selector') {
      return <OtherSpecies {...this.props} value={value} label={label} hint={hint} />;
    }
    if (this.props.type === 'repeater') {
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
    if (this.props.type === 'duration') {
      return <Duration
        name={ this.props.name }
        label={ label }
        hint={ hint }
        error={ this.props.error }
        value={ value }
        onChange={ val => this.onFieldChange(val) }
      />;
    }
    if (this.props.type === 'keywords') {
      return <Keywords
        name={ this.props.name }
        label={ label }
        hint={ hint }
        error={ this.props.error }
        value={ value }
        onChange={ val => this.onFieldChange(val) }
      />;
    }
    if (this.props.type === 'select') {
      return <Select
        className={ this.props.className }
        label={ label }
        hint={ hint }
        name={ this.props.name }
        options={ this.props.options }
        value={ value }
        error={ this.props.error }
        onChange={ e => this.onFieldChange(e.target.value) }
      />;
    }
    if (this.props.type === 'date') {
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
    if (this.props.type === 'radio') {
      return <RadioGroup
        className={ this.props.className }
        label={ label }
        hint={ hint }
        name={ this.props.name }
        options={ this.mapOptions(this.props.options) }
        value={ value }
        error={ this.props.error }
        inline={ this.props.inline }
        onChange={ e => {
          let val = e.target.value;
          if (val === 'true') {
            val = true;
          }
          if (val === 'false') {
            val = false;
          }
          this.onFieldChange(val);
        }}
      />;
    }
    if (this.props.type === 'checkbox' && this.props.name === 'fate-of-animals') {
      return <NtsCheckBoxWithModal
        className={ this.props.className }
        label={ label }
        hint={ hint }
        name={ this.props.name }
        options={ this.mapOptions(this.props.options) }
        value={ value }
        error={ this.props.error }
        inline={ this.props.inline }
        project={this.props.project}
        onFieldChange={this.onFieldChange}
      />;
    }
    if (this.props.type === 'checkbox' || this.props.type === 'permissible-purpose') {
      const options = this.mapOptions(this.props.options);

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
    if (this.props.type === 'textarea') {
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
    if (this.props.type === 'texteditor') {
      return <TextEditor
        name={ this.props.name }
        label={ label }
        hint={ hint }
        value={ value }
        error={ this.props.error }
        onChange={ this.onFieldChange }
      />;
    }
    if (this.props.type === 'declaration') {
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
      type={ this.props.type || 'text' }
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

const mapStateToProps = ({ project, settings, application }, { name, conditional, optionsFromSettings, options, value, onFieldChange }) => {
  options = optionsFromSettings ? settings[optionsFromSettings] : options;
  return {
    options,
    project,
    showChanges: !!onFieldChange && application && !application.newApplication,
    value: !isUndefined(value) ? value : project && project[name],
    show: !conditional || every(Object.keys(conditional), key => conditional[key] === project[key]),
    grantedVersion: application && application.grantedVersion
  };
};

const ConnectedField = connect(mapStateToProps, { addChange, throwError })(Field);

const FieldGroup = props => {
  const showComments = !props.noComments && props.type !== 'repeater';
  return (
    <Fragment>
      <ConnectedField {...props} />
      {
        showComments && <Comments field={props.name} />
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
