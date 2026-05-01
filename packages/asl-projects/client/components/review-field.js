import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { Link } from '@ukhomeoffice/asl-components';
import TextEditor from './editor';
import { projectSpecies as speciesOptions } from '@ukhomeoffice/asl-constants';
import { getLegacySpeciesLabel, mapSpecies, formatDate } from '../helpers';

import castArray from 'lodash/castArray';
import flatten from 'lodash/flatten';
import values from 'lodash/values';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import isInteger from 'lodash/isInteger';
import get from 'lodash/get';

import EstablishmentSelector from './establishment-selector';

import { DATE_FORMAT } from '../constants';
import ReviewFields from './review-fields';
import { ReviewRepeater } from '../pages/sections/repeater/review';

function RevealChildren({ value, options, values, prefix, diff }) {
  const option = (options || []).find(option => option.value === value);
  if (!option?.reveal || diff) {
    return null;
  }

  return (
    <div className="review-children">
      <ReviewFields
        fields={castArray(option.reveal).map(field => ({ ...field, preserveHierarchy: true }))}
        values={values}
        prefix={prefix}
      />
    </div>
  );
}

class ReviewField extends React.Component {

  render() {
    const resolve = prop => typeof prop === 'function' ? prop(this.props.values) : prop;
    const normaliseBooleanLike = val => {
      if (val === true || val === 'true') {
        return true;
      }
      if (val === false || val === 'false') {
        return false;
      }
      return val;
    };

    const type = resolve(this.props.type);
    const label = resolve(this.props.label);
    const hint = resolve(this.props.hint);

    let value = this.props.value;
    let options;
    let additionalInfo;

    if (type === 'standard-list') {
      // Ensure value is an array
      const valuesArray = castArray(value || []);

      // Map options and resolve label/hint if they are functions
      const resolvedOptions = (this.props.options || []).filter(Boolean).map(opt => ({
        ...opt,
        label: typeof opt.label === 'function' ? opt.label(this.props.values) : opt.label,
        hint: typeof opt.hint === 'function' ? opt.hint(this.props.values) : opt.hint
      }));

      // Filter only selected options
      const selectedOptions = resolvedOptions.filter(opt => valuesArray.includes(opt.value));

      if (!selectedOptions.length) {
        return (
          <p>
            <em>None selected</em>
          </p>
        );
      }

      return (
        <ul className={this.props.className}>
          {selectedOptions.map((opt, i) => (
            <li key={i}>
              <span>{opt.label}</span>
              {opt.hint && (
                <div className="govuk-hint govuk-!-margin-top-1">{opt.hint}</div>
              )}
            </li>
          ))}
        </ul>
      );
    }

    if(type === 'standard-radio') {
      const radioValue = normaliseBooleanLike(value);
      return <p>
        {
          radioValue === true
            ? 'Yes'
            : radioValue === false
              ? 'No'
              : <em>No answer provided</em>
        }
      </p>;
    }

    if (['checkbox', 'radio', 'select', 'permissible-purpose'].includes(type)) {
      options = this.props.optionsFromSettings
        ? this.props.settings[this.props.optionsFromSettings]
        : this.props.options;
    }

    if ((type === 'radio' || type === 'select') && !isUndefined(value)) {
      const inputValue = normaliseBooleanLike(value);
      value = (options || []).find(option => {
        if (isUndefined(option.value)) {
          return option === inputValue || String(option) === String(inputValue);
        }
        return option.value === inputValue || String(option.value) === String(inputValue);
      });
      additionalInfo = value && value.additionalInfo;
    }

    if (type === 'radio') {
      if (value && !isUndefined(value.label)) {
        return (
          <Fragment>
            <p>{value.label}</p>
            {additionalInfo && <ReactMarkdown>{additionalInfo}</ReactMarkdown>}
            {
              this.props.preserveHierarchy && <RevealChildren value={value.value} options={options} {...this.props} />
            }
          </Fragment>
        );
      }

      const radioValue = normaliseBooleanLike(this.props.value);
      if (radioValue === true || radioValue === false) {
        return <p>{radioValue ? 'Yes' : 'No'}</p>;
      }
    }

    if (type === 'duration') {
      let months = get(value, 'months');
      let years = get(value, 'years');
      months = isInteger(months) ? months : 0;
      years = isInteger(years) ? years : 5;

      if (months > 12) {
        months = 0;
      }

      if (years >= 5 || (!months && !years)) {
        years = 5;
        months = 0;
      }
      return (
        <dl className="inline">
          <dt>Years:</dt>
          <dd>{years}</dd>
          <dt>Months:</dt>
          <dd>{months}</dd>
        </dl>
      );
    }

    if (type === 'keywords') {
      return (value || []).length >= 1
        ? (
          <ul>
            {
              value.map((keyword, i) => (
                <li key={i}>{keyword}</li>
              ))
            }
          </ul>
        )
        : <p><em>No answer provided</em></p>;
    }

    if (value && type === 'holder') {
      return (
        <p><Link page="profile.read" profileId={value.licenceHolder.id} establishmentId={value.establishment.id} label={`${value.licenceHolder.firstName} ${value.licenceHolder.lastName}`} /></p>
      );
    }

    if (value && type === 'holder-name') {
      return (
        <p>{value.firstName} {value.lastName}</p>
      );
    }

    if (type === 'establishment-selector') {
      return <EstablishmentSelector {...this.props} review={true} />;
    }

    if (value && type === 'date') {
      return <p>{ formatDate(value, DATE_FORMAT.long) }</p>;
    }

    if (type === 'legacy-species-selector') {
      value = getLegacySpeciesLabel(this.props.values);
    }

    if (type === 'species-selector') {
      value = mapSpecies(this.props.project);
    }

    if (type === 'repeater') {
      const items = this.props.values[this.props.name];
      if (!items || !items.length) {
        return <em>No answer provided</em>;
      }
      return (
        <ReviewRepeater
          singular={this.props.singular}
          fields={this.props.fields}
          name={this.props.name}
          items={items}
          step={this.props.step || 0}
          noComments={true}
          hideChanges={true}
        />
      );
    }

    if (type === 'permissible-purpose') {
      const childrenName = options.find(o => o.reveal).reveal.name;
      const hasChildren = o => o.reveal && this.props.project[o.reveal.name] && this.props.project[o.reveal.name].length;
      if (
        (value && value.length) ||
        (this.props.project[childrenName] && this.props.project[childrenName].length)
      ) {
        return (
          <ul>
            {
              options
                .filter(o => (value || []).includes(o.value) || hasChildren(o))
                .map((o, i) => (
                  <Fragment key={i}>
                    <li>{o.label}</li>
                    {
                      hasChildren(o) && (
                        <ul>
                          {
                            this.props.project[o.reveal.name].map((val, index) => {
                              return <li key={index}>{o.reveal.options.find(opt => opt.value === val).label}</li>;
                            })
                          }
                        </ul>
                      )
                    }
                  </Fragment>
                ))
            }
          </ul>
        );
      }
      return <p><em>None selected</em></p>;
    }

    if (type === 'checkbox' ||
      type === 'species-selector' ||
      type === 'location-selector' ||
      type === 'objective-selector'
    ) {
      value = value || [];
      if (!value.length) {
        return (
          <p>
            <em>None selected</em>
          </p>
        );
      }

      const getValue = value => {
        const v = (options || []).find(option => option.value === value);
        return v
          ? v.label
          : value;
      };

      return (
        <ul>
          {
            value.filter(v => options ? options.find(o => o.value === v) : true).map(value => (
              <li key={value}>
                {
                  getValue(value)
                }
                {
                  this.props.preserveHierarchy && <RevealChildren {...this.props} value={value} options={options} />
                }
              </li>
            ))
          }
        </ul>
      );
    }

    if (type === 'declaration') {
      return <p>
        {
          this.props.value
            ? 'Yes'
            : 'No'
        }
      </p>;
    }

    if (type === 'additional-availability') {
      const item = (this.props.project.establishments || []).find(e => e['establishment-id'] === this.props.value);
      if (item) {
        return <p>{item.name || item['establishment-name']}</p>; // establishment-name is legacy
      }
    }

    if (type === 'animal-quantities') {
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
        };
      });

      if (!species.length) {
        return <p>
          <em>No answer provided.</em>
        </p>;
      }
      return <dl className="inline">
        {
          species.map((s, i) => (
            <Fragment key={i}>
              <dt>{s.title}:</dt>
              <dd>{s.value ? s.value : <em>No answer provided.</em>}</dd>
            </Fragment>
          ))
        }
      </dl>;
    }

    if (type === 'texteditor') {
      return <TextEditor {...this.props} readOnly={true} />;
    }

    if (type === 'paragraph' && typeof value === 'string') {
      // Split into lines and trim
      const lines = value
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
    }

    if (!isUndefined(value) && !isNull(value) && value !== '') {
      return (
        <Fragment>
          <TextEditor
            name={this.props.name}
            value={value}
            readOnly={true}
          />
          {additionalInfo && <ReactMarkdown>{additionalInfo}</ReactMarkdown>}
          {
            this.props.preserveHierarchy && <RevealChildren value={value} options={options} {...this.props} />
          }
        </Fragment>
      );
    }

    return (
      <p>
        <em>{this.props.nullValue || 'No answer provided.'}</em>
      </p>
    );
  }

}

const mapStateToProps = ({ project, settings }, props) => {
  return {
    project: props.project || project,
    settings
  };
};

export default connect(mapStateToProps)(ReviewField);
