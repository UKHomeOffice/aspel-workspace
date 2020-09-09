import React, { useState, useEffect } from 'react';
import map from 'lodash/map';
import partition from 'lodash/partition';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import intersection from 'lodash/intersection';
import { InputWrapper, CheckboxGroup } from '@ukhomeoffice/react-components';
import { MultiInput } from '../';
import groups from './species';

const ALL_SPECIES = flatten(values(groups).map(g => g.types));

export default function SpeciesSelector(props) {
  const parts = partition(props.value, s => ALL_SPECIES.includes(s));
  const [value, setValue] = useState(props.value || []);
  const [presetSpecies, setPresetSpecies] = useState(parts[0]);
  const [otherSpecies, setOtherSpecies] = useState(parts[1]);

  function onPresetChange(e) {
    const value = e.target.value;
    if (presetSpecies.includes(value)) {
      return setPresetSpecies(presetSpecies.filter(s => s !== value));
    }
    setPresetSpecies([ ...presetSpecies, value ]);
  }

  function onOtherChange(otherVals) {
    setOtherSpecies(otherVals);
  }

  useEffect(() => {
    setValue([
      ...presetSpecies,
      ...otherSpecies
    ]);
  }, [presetSpecies, otherSpecies]);

  return (
    <div className="species-selector">
      <InputWrapper {...props}>
        {
          map(groups, (group, key) => (
            <details key={key} open={intersection(group.types, presetSpecies).length}>
              <summary>{group.label}</summary>
              <CheckboxGroup
                options={group.types}
                className="smaller"
                onChange={onPresetChange}
                value={presetSpecies}
              />
            </details>
          ))
        }
        <details open={otherSpecies.length}>
          <summary>Other</summary>
          <MultiInput
            value={otherSpecies}
            onChange={onOtherChange}
          />
        </details>
        {
          value.map((v, i) => <input key={i} type="hidden" name={props.name} value={v} />)
        }
      </InputWrapper>
    </div>
  );
}

SpeciesSelector.defaultProps = {
  value: []
};
