import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';

import { addChange } from '../actions/projects';
import isUndefined from 'lodash/isUndefined';
import castArray from 'lodash/castArray';
import every from 'lodash/every';

import {
  Input,
  Select,
  TextArea,
  RadioGroup,
  CheckboxGroup,
  DateInput
} from '@ukhomeoffice/react-components';

import OtherSpecies from './other-species-selector';
import SpeciesSelector from './species-selector';
import AnimalQuantities from './animal-quantities';
import LocationSelector from './location-selector';
import ObjectiveSelector from './objective-selector';
import Duration from './duration';
import TextEditor from './editor';

import Fieldset from './fieldset';
import Comments from './comments';

class Field extends Component {

  state = {
    value: this.props.value
  }

  onFieldChange = value => {
    this.setState({ value }, this.save)
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
      }
    })
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    const { value } = this.state;

    const { label, hint } = this.props.altLabels ? this.props.alt : this.props;
    if (this.props.fallbackLink && this.props.options && !this.props.options.length) {
      return <a href={this.props.fallbackLink.url}>{this.props.fallbackLink.label}</a>
    }
    if (this.props.type === 'animal-quantities') {
      return <AnimalQuantities {...this.props} label={label} hint={hint} />;
    }
    if (this.props.type === 'species-selector') {
      return <SpeciesSelector {...this.props} label={label} hint={hint} />;
    }
    if (this.props.type === 'location-selector') {
      return <LocationSelector {...this.props} label={label} hint={hint} />;
    }
    if (this.props.type === 'objective-selector') {
      return <ObjectiveSelector {...this.props} label={label} hint={hint} />;
    }
    if (this.props.type === 'other-species-selector') {
      return <OtherSpecies {...this.props} label={label} hint={hint} />;
    }
    if (this.props.type === 'duration') {
      return <Duration
        name={ this.props.name }
        label={ label }
        hint={ hint }
        error={ this.props.error }
        min={ this.props.min }
        max={ this.props.max }
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
      />
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
          this.onFieldChange(val)
        }}
      />;
    }
    if (this.props.type === 'checkbox' || this.props.type === 'permissible-purpose') {
      return <CheckboxGroup
        className={ this.props.className }
        label={ label }
        hint={ hint }
        name={ this.props.name }
        options={ this.mapOptions(this.props.options) }
        value={ value }
        error={ this.props.error }
        inline={ this.props.inline }
        onChange={ e => {
          const values = [ ...(value || []) ];
          if (values.includes(e.target.value)) {
            return this.onFieldChange(values.filter(v => v !== e.target.value));
          }
          this.onFieldChange([ ...values, e.target.value ]);
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
      />
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
    />;
  }
}

const mapStateToProps = ({ project, settings, application }, { name, conditional, optionsFromSettings, options, value }) => {
  options = optionsFromSettings ? settings[optionsFromSettings] : options;

  return {
    options,
    showChanges: application && !application.newApplication,
    value: !isUndefined(value) ? value : project && project[name],
    show: !conditional || every(Object.keys(conditional), key => conditional[key] === project[key])
  };
}

const ConnectedField = connect(mapStateToProps, { addChange })(Field);

const FieldGroup = props => {
  return (
    <Fragment>
      <ConnectedField {...props} />
      {
        !props.noComments && <Comments field={props.name} />
      }
    </Fragment>
  )
}

export default FieldGroup;
