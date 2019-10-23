import flatten from 'lodash/flatten';
import castArray from 'lodash/castArray';
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import map from 'lodash/map';
import dateFormatter from 'date-fns/format';
import LEGACY_SPECIES from '../constants/legacy-species';

export const formatDate = (date, format) => (date ? dateFormatter(date, format) : '-');

export const getConditions = (values, conditions, project) => {

  // remove any old-style conditions from before the days of types
  const previous = (values.conditions || []).filter(Boolean).filter(c => c.type);

  const editedConditions = previous.filter(c => c.autoAdded && c.edited);

  conditions = map(conditions, (condition, key) => ({ ...condition, key }))

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
}

export const getScrollPos = (elem, offset = 0) => {
  const box = elem.getBoundingClientRect();
  const body = document.body;
  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const clientTop = docEl.clientTop || body.clientTop || 0;

  return Math.round(box.top + scrollTop - clientTop) + offset;
};

export const getNewComments = (comments, user) => {
  const filterNew = field => field.filter(comment => comment.isNew && comment.author !== user && !comment.deleted);
  return pickBy(mapValues(comments, filterNew), filterNew);
}

export const getLegacySpeciesLabel = species => {
  const matched = LEGACY_SPECIES.find(s => s.value === species.speciesId);
  let label = matched && matched.label;
  if (species.speciesId === '28') {
    label = species['other-species-type'];
  }
  return label;
};

export const flattenReveals = (fields, values) => {
  return fields.reduce((arr, item) => {
    const reveals = [];
    if (item.options) {
      item.options.forEach(option => {
        if (option.reveal) {
          if (Array.isArray(values[item.name]) && values[item.name].includes(option.value)) {
            reveals.push(flattenReveals(castArray(option.reveal), values))
          }
          else if (option.value === values[item.name]) {
            reveals.push(flattenReveals(castArray(option.reveal), values))
          }
        }
      })
    }
    return flatten([
      ...arr,
      item,
      flatten(reveals)
    ])
  }, []);
};
