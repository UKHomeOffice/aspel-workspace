import React, { Component } from 'react';
import { connect } from 'react-redux';

import castArray from 'lodash/castArray';
import every from 'lodash/every';
import without from 'lodash/without';

import { Input, Select, TextArea, RadioGroup, CheckboxGroup } from '@ukhomeoffice/react-components';

import OtherSpecies from './other-species-selector';
import SpeciesSelector from './species-selector';
import AnimalQuantities from './animal-quantities';
import LocationSelector from './location-selector';
import ObjectiveSelector from './objective-selector';
import Duration from './duration';
import { TextEditor } from './editor';

import Fieldset from './fieldset';

class Field extends Component {

  onChange(value) {
    return this.props.onChange && this.props.onChange(value);
  }

  onSave(value) {
    return this.props.onSave && this.props.onSave(value);
  }

  mapOptions = (options = []) => {
    return options.filter(Boolean).map(option => {
      if (!option.reveal) {
        return option;
      }
      return {
        ...option,
        reveal: (
          <div className="govuk-inset-text">
            <Fieldset
              {...this.props}
              fields={castArray(option.reveal)}
            />
          </div>
        )
      }
    })
  }

  shouldComponentUpdate(newProps) {
    return JSON.stringify(this.props.value) !== JSON.stringify(newProps.value);
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    if (this.props.fallbackLink && this.props.options && !this.props.options.length) {
      return <a href={this.props.fallbackLink.url}>{this.props.fallbackLink.label}</a>
    }
    if (this.props.type === 'animal-quantities') {
      return <AnimalQuantities {...this.props} />;
    }
    if (this.props.type === 'species-selector') {
      return <SpeciesSelector {...this.props} />;
    }
    if (this.props.type === 'location-selector') {
      return <LocationSelector {...this.props} />;
    }
    if (this.props.type === 'objective-selector') {
      return <ObjectiveSelector {...this.props} />;
    }
    if (this.props.type === 'other-species-selector') {
      return <OtherSpecies {...this.props} />;
    }
    if (this.props.type === 'duration') {
      return <Duration
        name={ this.props.name }
        label={ this.props.label }
        hint={ this.props.hint }
        error={ this.props.error }
        min={ this.props.min }
        max={ this.props.max }
        value={ this.props.value }
        onChange={ val => this.onChange(val) }
      />;
    }
    if (this.props.type === 'select') {
      return <Select
        className={ this.props.className }
        hint={ this.props.hint }
        name={ this.props.name }
        label={ this.props.label }
        options={ this.props.options }
        value={ this.props.value }
        error={ this.props.error }
        onChange={ e => this.onChange(e.target.value) }
      />;
    }
    if (this.props.type === 'radio') {
      return <RadioGroup
        className={ this.props.className }
        hint={ this.props.hint }
        name={ this.props.name }
        label={ this.props.label }
        options={ this.mapOptions(this.props.options) }
        value={ this.props.value }
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
          this.onChange(val)
        }}
      />;
    }
    if (this.props.type === 'checkbox') {
      return <CheckboxGroup
        className={ this.props.className }
        hint={ this.props.hint }
        name={ this.props.name }
        label={ this.props.label }
        options={ this.mapOptions(this.props.options) }
        value={ this.props.value }
        error={ this.props.error }
        inline={ this.props.inline }
        onChange={ e => {
          const values = [ ...(this.props.value || []) ];
          if (values.includes(e.target.value)) {
            return this.onChange(values.filter(v => v !== e.target.value));
          }
          this.onChange([ ...values, e.target.value ]);
        }}
      />;
    }
    if (this.props.type === 'textarea') {
      return <TextArea
        className={ this.props.className }
        hint={ this.props.hint }
        name={ this.props.name }
        label={ this.props.label }
        value={ this.props.value || '' }
        error={ this.props.error }
        onChange={ e => this.onChange(e.target.value) }
      />;
    }
    if (this.props.type === 'texteditor') {
      return <TextEditor
        name={ this.props.name }
        label={ this.props.label }
        hint={ this.props.hint }
        value={ this.props.value }
        error={ this.props.error }
        onSave={ value => this.onSave(value) }
      />;
    }
    return <Input
      className={ this.props.className }
      type={ this.props.type || 'text' }
      hint={ this.props.hint }
      name={ this.props.name }
      label={ this.props.label }
      value={ this.props.value || '' }
      error={ this.props.error }
      onChange={ e => this.onChange(e.target.value) }
    />;
  }
}

const mapStateToProps = ({ project, settings }, { name, conditional, optionsFromSettings, options, without: withoutField, value }) => {
  options = optionsFromSettings ? settings[optionsFromSettings] : options;

  if (withoutField) {
    options = without(options, project[withoutField]);
  }

  return {
    options,
    value: value || project[name],
    show: !conditional || every(Object.keys(conditional), key => conditional[key] === project[key])
  };
}

export default connect(mapStateToProps)(Field);
