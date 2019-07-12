import React, { Fragment } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { Value } from 'slate';
import { connect } from 'react-redux';
import TextEditor from './editor';
import initialValue from './editor/initial-value.json';
import speciesOptions from '../constants/species';

import Comments from './comments';
import DiffWindow from './diff-window';
import flatten from 'lodash/flatten';
import values from 'lodash/values';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import formatDate from 'date-fns/format';

import { DATE_FORMAT } from '../constants';

class Review extends React.Component {

  replay() {
    let value = this.props.value;
    let options;
    if (['checkbox', 'radio', 'select'].includes(this.props.type)) {
      options = this.props.optionsFromSettings
        ? this.props.settings[this.props.optionsFromSettings]
        : this.props.options;
    }

    if ((this.props.type === 'radio' || this.props.type === 'select') && !isUndefined(value)) {
      value = options.find(option => !isUndefined(option.value) ? option.value === value : option === value)
    }

    if (this.props.type === 'duration') {
      return (
        <dl className="inline">
          <dt>Years</dt>
          <dd>{(value || {}).years || 5}</dd>
          <dt>Months</dt>
          <dd>{(value || {}).months || 0}</dd>
        </dl>
      )
    }

    if (value && this.props.type === 'date') {
      return formatDate(value, DATE_FORMAT.long);
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
    if (this.props.type === 'checkbox' ||
      this.props.type === 'species-selector' ||
      this.props.type === 'location-selector' ||
      this.props.type === 'objective-selector'
    ) {
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
        const v = (options || []).find(option => option.value === value)
        return v
          ? v.label
          : value
      }

      return (
        <ul>
          {
            value.filter(v => options ? options.find(o => o.value === v) : true).map(value => (
              <li key={value}>{getValue(value)}</li>
            ))
          }
        </ul>
      );
    }
    if (this.props.type === 'declaration') {
      return <p>
        {
          this.props.value
            ? 'Yes'
            : 'No'
        }
      </p>
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
          key: s && s.value,
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
      if (this.props.value !== JSON.stringify(Value.fromJSON(initialValue).toJSON())) {
        return <TextEditor {...this.props} readOnly={true} />;
      } else {
        value = null;
      }
    }
    if (!isUndefined(value) && !isNull(value) && value !== '') {
      return <p>{value.review || value.label || value}</p>;
    }
    return (
      <p>
        <em>No answer provided.</em>
      </p>
    );
  }

  changedBadge = () => {
    if (this.props.changedFromLatest) {
      return <span className="badge changed">changed</span>;
    }
    if (this.props.changedFromGranted) {
      return <span className="badge">amended</span>;
    }
    return null;
  }

  render() {
    const { label } = this.props.altLabels ? this.props.alt : this.props;
    return (
      <div className="review">
        <h3>{label}</h3>
        {
          this.changedBadge()
        }
        {
          this.props.readonly && (this.props.changedFromLatest || this.props.changedFromGranted) && (
            <DiffWindow
              {...this.props}
              changedFromLatest={this.props.changedFromLatest}
              changedFromGranted={this.props.changedFromGranted}
              name={`${this.props.prefix}${this.props.name}`}
            />
          )
        }
        {
          this.replay()
        }
        {
          !this.props.noComments && <Comments field={`${this.props.prefix || ''}${this.props.name}`} collapsed={!this.props.readonly} />
        }
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


const mapStateToProps = ({ project, settings, application: { readonly } = {}, changes : { latest = [], granted = [] } = {} }, ownProps) => {
  const key = `${ownProps.prefix || ''}${ownProps.name}`;
  const changedFromGranted = granted.includes(key);
  const changedFromLatest = latest.includes(key);
  return {
    project,
    settings,
    readonly: ownProps.readonly || readonly,
    changedFromLatest,
    changedFromGranted
  };
}

export default connect(mapStateToProps)(Review);
