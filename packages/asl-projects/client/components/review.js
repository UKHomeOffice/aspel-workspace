import React, { Fragment } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { connect } from 'react-redux';

import { ReviewTextEditor } from './editor';
import speciesOptions from '../constants/species';

import Comments from './comments';
import flatten from 'lodash/flatten';
import values from 'lodash/values';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import { LATEST, GRANTED } from '../constants/change';

class Review extends React.Component {
  replay() {
    let value = this.props.value;
    let options;
    if (this.props.type === 'checkbox' || this.props.type === 'radio') {
      options = this.props.optionsFromSettings
        ? this.props.settings[this.props.optionsFromSettings]
        : this.props.options;
    }

    if (this.props.type === 'radio' && !isUndefined(value)) {
      value = options.find(option => !isUndefined(option.value) ? option.value === value : option === value)
    }

    if (value && this.props.type === 'duration') {
      return (
        <dl className="inline">
          <dt>Years</dt>
          <dd>{value.years || 0}</dd>
          <dt>Months</dt>
          <dd>{value.months || 0}</dd>
        </dl>
      )
    }
    if (this.props.type === 'species-selector') {
      const project = this.props.project;
      const other = project[`${this.props.name}-other`] || [];
      value = value || [];
      value = flatten([
        ...value.map(val => {
          if (val.indexOf('other') > -1) {
            return project[`${this.props.name}-${val}`];
          }
          return val;
        }),
        ...other
      ]);
    }
    if (this.props.type === 'checkbox' || this.props.type === 'species-selector') {
      value = value || [];
      if (!value.length) {
        return (
          <p>
            <em>None selected</em>
          </p>
        );
      }

      if (this.props.type === 'species-selector') {
        options = flatten(values(speciesOptions))
      }

      const getValue = value => {
        const v = options.find(option => option.value === value)
        return v
          ? v.label
          : value
      }

      return (
        <ul>
          {value.map(value => (
            <li key={value}>{getValue(value)}</li>
          ))}
        </ul>
      );
    }
    if (this.props.type === 'animal-quantities') {
      const species = [
        ...flatten((this.props.project.species || []).map(s => {
          if (s.indexOf('other') > -1) {
            return this.props.project[`species-${s}`];
          }
          return s;
        })),
        ...(this.props.project['species-other'] || [])
      ].map(s => {
        const opt = flatten(values(speciesOptions)).find(species => species.value === s);
        return {
          key: species && species.value,
          title: opt ? opt.label : s,
          value: this.props.project[`${this.props.name}-${s}`]
        }
      });

      if (!species.length) {
        return <p>
          <em>No answer provided.</em>
        </p>
      }
      return <dl className="inline">
        {
          species.map(s => (
            <Fragment key={s.key}>
              <dt>{s.title}:</dt>
              <dd>{s.value ? s.value : <em>No answer provided.</em>}</dd>
            </Fragment>
          ))
        }
      </dl>
    }
    if (this.props.type === 'texteditor' && this.props.value) {
      return <ReviewTextEditor {...this.props} />;
    }
    if (!isUndefined(value) && !isNull(value) && value !== '') {
      return <p>{value.label || value}</p>;
    }
    return (
      <p>
        <em>No answer provided.</em>
      </p>
    );
  }

  changed = (key) => {

    if (this.props.latest.includes(key)) {
      return LATEST;
    }
    else if (this.props.granted.includes(key)) {
      return GRANTED;
    }
  }

  changedBadge = change => {
    switch (change) {
      case LATEST:
        return <span className="badge changed">changed</span>;
      case GRANTED:
        return <span className="badge">amended</span>;
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="review">
        <h3>{this.props.label}</h3>
        {
          this.changedBadge(this.changed(`${this.props.prefix || ''}${this.props.name}`))
        }
        {this.replay()}
        <Comments field={`${this.props.prefix || ''}${this.props.name}`} collapsed={!this.props.readonly} />
        {
          !this.props.readonly && (
            <Fragment>
              <p>
                <Link
                  to={this.props.editLink || `#${this.props.name}`}
                  onClick={e => this.props.onEdit && this.props.onEdit(e, this.props.name)}
                  >Edit</Link>
              </p>
              <hr />
            </Fragment>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = ({ project, settings, application: { readonly }, changes : {latest, granted} }) => ({ project, settings, readonly, latest, granted });

export default connect(mapStateToProps)(Review);
