import flatten from 'lodash/flatten';
import values from 'lodash/values';
import castArray from 'lodash/castArray';
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import map from 'lodash/map';
import { format as dateFormatter } from 'date-fns';
import { JSONPath } from 'jsonpath-plus';
import LEGACY_SPECIES from '../constants/legacy-species';
import { projectSpecies as SPECIES } from '@ukhomeoffice/asl-constants';
import CONDITIONS from '../constants/conditions';
import React, { Fragment } from 'react';
import classnames from 'classnames';

export const formatDate = (date, format) => {
  try {
    return date ? dateFormatter(date, format) : '-';
  } catch (err) {
    return `Invalid date entered`;
  }
};

export const getConditions = (values, project) => {
  const isProtocol = !!project;

  // remove any old-style conditions from before the days of types
  const previous = (values.conditions || []).filter(Boolean).filter(c => c.type);

  const editedConditions = previous.filter(c => c.autoAdded && c.edited);

  let conditions = isProtocol
    ? CONDITIONS.protocol
    : CONDITIONS.project;

  conditions = map(conditions, (condition, key) => ({ ...condition, key }));

  const newConditions = conditions.map(condition => {
    const editedCondition = editedConditions.find(c => c.key === condition.key);
    const path = `${condition.key}.versions.${condition.versions.length - 1}`;

    if (editedCondition) {
      return { ...editedCondition };
    } else if (condition.include && condition.include(values, project)) {
      return {
        path,
        key: condition.key,
        type: condition.type,
        autoAdded: true
      };
    }
  }).filter(Boolean);

  return [
    // fully custom conditions
    ...previous.filter(c => !c.autoAdded),
    // edited conditions
    ...newConditions
  ];
};

export function mapPermissiblePurpose(project) {
  const values = project['permissible-purpose'] || [];
  const others = project['translational-research'] || [];
  return [
    ...values,
    ...others
  ];
}

export function mapAnimalQuantities(project, name) {
  const species = []
    .concat(project.species || [])
    .reduce((arr, s) => {
      if (s === 'other' || s?.match(/^other-/)) {
        const others = castArray(project[`species-${s}`]);
        return [ ...arr, ...others ];
      }
      return [ ...arr, s ];
    }, [])
    .concat(castArray(project['species-other'])) //always add 'species-other'
    .filter(Boolean);

  return species
    .reduce((obj, key) => {
      return {
        ...obj,
        [`${name}-${key}`]: project[`${name}-${key}`]
      };
    }, { species });
}

export function animalQuantitiesDiff({ before, value, props, currentValues, isBefore, getLabel, DEFAULT_LABEL }) {
  const safeBefore = before || {};
  const beforeSpecies = safeBefore.species || [];
  const currentSpecies = value?.species || [];

  // union of both to ensure both sides have full species list where necessary
  const allSpecies = Array.from(new Set([...beforeSpecies, ...currentSpecies]));

  return (
    <dl className="inline">
      {allSpecies.map(speciesKey => {
        const label = getLabel(speciesKey);
        const previousQuantity = before?.[`${props.name}-${speciesKey}`] ?? null;
        const currentQuantity = value?.[`${props.name}-${speciesKey}`] ?? null;
        const reductionQuantity = currentValues[`reduction-quantities-${speciesKey}`];
        const isChanged = previousQuantity !== reductionQuantity;

        // left side: Initial submission (isBefore === true)
        if (isBefore) {
          const speciesRemoved = !currentValues.species.includes(speciesKey);
          return (
            <Fragment key={speciesKey}>
              <dt className={classnames({ diff: speciesRemoved, removed: speciesRemoved })}>{label}:</dt>
              <dd>
                {previousQuantity === null
                  ? <em>{DEFAULT_LABEL} </em>
                  : <span className={classnames({ diff: isChanged, removed: isChanged })}>{previousQuantity} </span>}
              </dd>
            </Fragment>
          );
        }

        // right side tab: Proposed version (isBefore === false)
        const speciesAdded = !beforeSpecies.includes(speciesKey);
        if (!currentSpecies.includes(speciesKey)) {
          // Do not show removed species on proposed side
          return null;
        }

        return (
          <Fragment key={speciesKey}>
            <dt className={classnames({ diff: speciesAdded, added: speciesAdded })}>{label}:</dt>
            <dd>
              {currentQuantity === null
                ? <em>{DEFAULT_LABEL}</em>
                : <span className={classnames({ diff: isChanged, added: isChanged })}>{currentQuantity}</span>}
            </dd>
          </Fragment>
        );
      })}
    </dl>
  );
}

export function mapSpecies(project) {
  const species = project.species || [];
  const other = project['species-other'] || [];
  return flatten([
    ...species.map(val => {
      if (val.indexOf('other') > -1) {
        return project[`species-${val}`] || [];
      }
      const item = flatten(values(SPECIES)).find(s => s.value === val);
      return item ? item.label : val;
    }),
    ...other
  ]);
}

export function durationDiffDisplay({ before, value, isBefore, DEFAULT_LABEL }) {
  const safeBefore = before || {};
  const safeValue = value || {};
  const hasNoData = !safeValue || (safeValue.years === undefined && safeValue.months === undefined);

  if (hasNoData) {
    return <p><em>{DEFAULT_LABEL}</em></p>;
  }

  const diffClass = isBefore ? 'diff removed' : 'diff added';

  const renderDuration = (label, durationValue) => {
    return durationValue !== undefined && (
      <>
        <dt>{label}:</dt>
        <dd>
          <span className={diffClass}>{durationValue}</span>
        </dd>
      </>
    );
  };

  return (
    <dl className="inline">
      {isBefore ? (
        <>
          {renderDuration('Years', safeBefore.years)}
          {renderDuration('Months', safeBefore.months)}
        </>
      ) : (
        <>
          {renderDuration('Years', safeValue.years)}
          {renderDuration('Months', safeValue.months)}
        </>
      )}
    </dl>
  );
}

export function additionalAvailabilityDiff({ value, props, isBefore, DEFAULT_LABEL }) {
  let beforeValue = value != null ? value : DEFAULT_LABEL;
  let afterValue = props?.values?.name != null ? props.values.name : DEFAULT_LABEL;

  const beforeId = (beforeValue !== null && beforeValue !== DEFAULT_LABEL) ? String(beforeValue) : null;
  const afterId = (afterValue !== null && afterValue !== DEFAULT_LABEL) ? String(afterValue) : null;

  const hasChanged = beforeId !== afterId;

  if (isBefore) {
    return (
      <p>
        {beforeId
          ? <span className={classnames('diff', { removed: hasChanged })}>{beforeValue}</span>
          : <em>{DEFAULT_LABEL}</em>}
      </p>
    );
  }

  return (
    <p>
      {afterId
        ? <span className={classnames('diff', { added: hasChanged })}>{afterValue}</span>
        : <em>{DEFAULT_LABEL}</em>}
    </p>
  );
}

export function checkboxDiffDisplay({ before = [], value = [], isBefore, DEFAULT_LABEL }) {
  const removed = before.filter(item => !value.includes(item));
  const added = value.filter(item => !before.includes(item));

  const renderList = (items, changedItems, type) => {
    return (
      <dl className="inline">
        {items.map((item, i) => {
          const isChanged = changedItems.includes(item);
          const className = isChanged ? `diff ${type}` : null;
          return (
            <dd key={i}>
              <span className={className}>{String(item)}</span>
            </dd>
          );
        })}
      </dl>
    );
  };

  if (isBefore) {
    return before.length ? renderList(before, removed, 'removed') : <p><em>{DEFAULT_LABEL}</em></p>;
  }

  return value.length ? renderList(value, added, 'added') : <p><em>{DEFAULT_LABEL}</em></p>;
}
export const getScrollPos = (elem, offset = 0) => {
  const box = elem.getBoundingClientRect();
  const body = document.body;
  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const clientTop = docEl.clientTop || body.clientTop || 0;

  return Math.round(box.top + scrollTop - clientTop) + offset;
};

function mapReusableStepsToReferringSteps(project) {
  return (project.protocols ?? []).flatMap(
    (protocol) =>
      (protocol?.steps ?? [])
        .filter(step => step?.reusableStepId)
        .map(
          step => ({
            source: `reusableSteps.${step.reusableStepId}`,
            target: `protocols.${protocol.id}.steps.${step.id}`
          })
        )
  ).reduce((acc, {source, target}) => ({
    ...acc,
    [source]: [...(acc[source] ?? []), target]
  }), {});
}

function aliasReusableStepCommentsToReferringSteps(newComments, reusableStepMapping) {
  const reusableStepKeys = [...Object.keys(reusableStepMapping)];

  return Object.entries(newComments)
    .flatMap(
      ([field, comments]) => {
        let matchedKey = reusableStepKeys.find(key => field.startsWith(key));
        return matchedKey
          ? reusableStepMapping[matchedKey].map(target => [field.replace(matchedKey, target), comments])
          : [[field, comments]];
      }
    )
    .reduce(
      (acc, [field, comments]) => ({
        ...acc,
        [field]: [...(acc[field] ?? []), ...comments]
      }),
      {}
    );
}

/**
 * Filter comments to only those flagged as new that are from other users.
 * @param comments
 * @param user
 * @param project Optional - if provided any reusable step comments will be aliased to the steps that reference them
 * @return A record of field paths mapped to comments that apply to that field
 */
export const getNewComments = (comments, user, project) => {
  const filterNew = field => field.filter(comment => comment.isNew && comment.author !== user && !comment.deleted);
  const newComments = pickBy(mapValues(comments, filterNew), filterNew);

  if (project?.reusableSteps) {
    const reusableStepMapping = mapReusableStepsToReferringSteps(project);
    return aliasReusableStepCommentsToReferringSteps(newComments, reusableStepMapping);
  } else {
    return newComments;
  }
};

export const getLegacySpeciesLabel = species => {
  const matched = LEGACY_SPECIES.find(s => s.value === species.speciesId);
  let label = matched && matched.label;
  if (species.speciesId === '28') {
    label = species['other-species-type'];
  }
  return label;
};

/**
 * Where a radio/checkbox group field has nested fields revealed for certain
 * options, flatten that field into a list of the field and relevant revealed
 * fields.
 *
 * There are two use cases for this function, controlled by
 * `ignorePreserveHierarchy`.
 *
 * * Rendering the nested fields as a list of answers. In this case
 *   `ignorePreserveHierarchy` should be false to allow the schema to control
 *   if the answers should be rendered nested within the option or not
 * * Querying relevant fields, e.g. for comment badges. In this case
 *   `ignorePreserveHierarchy` should be true so that all fields are included
 *   regardless of the resulting display hierarchy.
 *
 * @param {object[]} fields the list of fields to be flattened
 * @param {object} values the field values, to determine which reveals are active
 * @param {boolean} ignorePreserveHierarchy whether to respect the schema's preserveHierarchy flag
 * @return {object[]}
 */
export const flattenReveals = (fields, values, ignorePreserveHierarchy = false) => {
  // noinspection JSValidateTypes https://youtrack.jetbrains.com/issue/IDEA-384329/
  return fields.reduce((arr, item) => {
    const reveals = [];
    if (item.options && (ignorePreserveHierarchy || !item.preserveHierarchy)) {
      item.options.forEach(option => {
        if (option.reveal) {
          // fixes ASL-4119 where the user has already clicked the hidden checkbox
          if (option.value === 'translational-research') {
            return null;
          }
          if (Array.isArray(values[item.name]) && values[item.name].includes(option.value)) {
            reveals.push(flattenReveals(castArray(option.reveal), values));
          } else if (option.value === values[item.name]) {
            reveals.push(flattenReveals(castArray(option.reveal), values));
          }
        }
      });
    }
    return flatten([
      ...arr,
      item,
      flatten(reveals)
    ]);
  }, []);
};

export function getFields(section, includeReveals = false) {
  if (section.name === 'protocols') {
    return flatten(flatten(Object.values(section.sections).concat(section.fields).map(getFields))
      .map(field => {
        if (includeReveals) {
          return getRevealFields(field);
        } else {
          return { ...field, name: `protocols.*.${field.name}` };
        }
      }));
  }
  if (section.fields && section.fields.length) {
    return section.fields.map(field => {
      if (field.repeats) {
        return {
          ...field,
          name: `${section.repeats}.*.${field.name}`
        };
      }
      return field;
    });
  } else if (section.steps) {
    return flatten(section.steps.map(getFields));
  } else return [];
}

export function getRevealFields(field) {
  const result = [...new Set(JSONPath({path: '$..reveal..name', json: field}))];
  if (result && result.length > 0) {
    return result.reduce(
      (pv, cv) => [...pv, { name: `protocols.*.${cv}` }],
      [{ name: `protocols.*.${field.name}` }]
    );
  } else {
    return { name: `protocols.*.${field.name}` };
  }
}

/* eslint-disable no-control-regex */
export const stripInvalidXmlChars = text => {
  if (typeof text !== 'string') {
    return text;
  }
  return text.replace(/([^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFC\u{10000}-\u{10FFFF}])/ug, '');
};

export const isTrainingLicence = values => {
  return values['training-licence'] || (values['permissible-purpose'] || []).includes('higher-education');
};

export const getCurrentURLForFateOfAnimals = () => {
  if (typeof window === 'undefined') return null;

  const href = window.location.href;
  const splitter = ['/edit/', '/full-application/'].find(urlPart => href.includes(urlPart));
  if (!splitter) {
    return null;
  }

  return typeof window !== 'undefined' ? window.location.href.split(splitter)[0] + `${splitter}fate-of-animals` : null;
};

export const markdownLink = (linkText, url) => {
  return url ? `[${linkText}](${url})` : linkText;
};

export const calculateProtocolContext = (
  values = {},
  defaultValue,
  editableProtocol,
  standardProtocol
) => {
  // Normalize protocol context
  const context =
    values.isStandardProtocol ? values : values.values

  const isStandard = context?.isStandardProtocol;
  const typeOfProtocol = context?.standardProtocolType;

  if (isStandard === true && typeOfProtocol === 'standard-ga-breeding') {
    return standardProtocol;
  }

  if (isStandard === false && typeOfProtocol === 'editable-ga-breeding') {
    return editableProtocol;
  }

  return defaultValue;
};

