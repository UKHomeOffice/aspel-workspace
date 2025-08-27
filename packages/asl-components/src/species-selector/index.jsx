import React, { useState, useEffect, useCallback } from 'react';
import uniq from 'lodash/uniq';
import map from 'lodash/map';
import partition from 'lodash/partition';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import omit from 'lodash/omit';
import intersection from 'lodash/intersection';
import pick from 'lodash/pick';
import { InputWrapper } from '@ukhomeoffice/react-components';
import { MultiInput, Fieldset } from '../';
import PIL_GROUPS from './species';
import { projectSpecies as PROJECT_GROUPS } from '@ukhomeoffice/asl-constants';

const GROUP_LABELS = {
    SA: 'Small animals',
    LA: 'Large animals',
    AQ: 'Fish, reptiles and aquatic species',
    AV: 'Birds',
    DOM: 'Cats, dogs and equidae',
    NHP: 'Non-human primates',
    OTHER: 'Other'
};

const ALL_PIL_SPECIES = flatten(values(PIL_GROUPS).map(g => g.types));

const SpeciesSelector = ({
    presets = [],
    species: propSpecies,
    projectSpecies,
    value: propValue,
    name,
    id,
    fieldName,
    label,
    hint,
    error,
    onChange,
    disabled
}) => {
    const species = propSpecies || (projectSpecies ? omit(PROJECT_GROUPS, 'deprecated') : PIL_GROUPS);
    const initialValue = useCallback(() => {
        let val = propValue;
        if (!projectSpecies) {
            const parts = partition(val, s => ALL_PIL_SPECIES.includes(s));
            val = {
                precoded: parts[0],
                otherSpecies: parts[1]
            };
        }
        return val || { precoded: [], otherSpecies: [] };
    }, [propValue, projectSpecies]);

    const [value, setValue] = useState(initialValue);

    const onOtherChange = useCallback(
        otherSpecies => setValue(prev => ({ ...prev, otherSpecies })),
        []
    );

    useEffect(() => {
        const others = (value.precoded || []).filter(s => s.includes('other-'));
        const keysToPreserve = Object.keys(value).filter(
            k => k === 'precoded' || k === 'otherSpecies' || others.includes(k.replace('species-', ''))
        );
        setValue(prev => pick(prev, keysToPreserve));
    }, [value.precoded]);

    const mapOptions = useCallback(
        option => {
            if (typeof option === 'string') {
                option = { value: option, label: option };
            }
            if (option.value.includes('other')) {
                const fieldName = `${name}-${option.value}`;
                return {
                    ...option,
                    reveal: {
                        [fieldName]: {
                            inputType: 'multiInput',
                            onFieldChange: vals => {
                                setValue(prev => ({
                                    ...prev,
                                    [fieldName]: vals
                                }));
                            },
                            value: []
                        }
                    }
                };
            }
            return {
                ...option,
                disabled: presets.includes(option.value)
            };
        },
        [name, presets]
    );

    const onGroupChange = useCallback(
        key => val => {
            const nopes = projectSpecies
                ? (species[key] || []).map(o => o.value)
                : (species[key].types || []);
            const precoded = uniq(
                value.precoded.filter(item => !nopes.includes(item)).concat(val[`_${name}`])
            );
            setValue(prev => ({ ...prev, precoded }));
        },
        [projectSpecies, species, value.precoded, name]
    );

    const getField = useCallback(
        (options, key) => (
            <Fieldset
                model={{
                    ...value,
                    [`_${name}`]: [...presets, ...value.precoded]
                }}
                onChange={onGroupChange(key)}
                schema={{
                    [`_${name}`]: {
                        inputType: 'checkboxGroup',
                        automapReveals: true,
                        label: false,
                        options: options.map(mapOptions)
                    }
                }}
            />
        ),
        [value, name, presets, onGroupChange, mapOptions]
    );

    const getValue = useCallback(() => {
        if (projectSpecies) {
            return JSON.stringify(value);
        }
        return JSON.stringify([...value.precoded, ...value.otherSpecies]);
    }, [projectSpecies, value]);

    const isSelected = useCallback(
        options =>
            intersection(
                options.map(opt => opt.value || opt),
                [...presets, ...value.precoded]
            ).length > 0,
        [presets, value.precoded]
    );

    return (
        <div className="species-selector">
            <InputWrapper {...{ id, name, fieldName, label, hint, error, onChange, disabled }}>
                {map(omit(species, 'OTHER'), (group, key) => {
                    const options = group.types || group;
                    return (
                        <details key={key} open={isSelected(options)}>
                            <summary>{GROUP_LABELS[key]}</summary>
                            {getField(options, key)}
                        </details>
                    );
                })}
                <details open={value.otherSpecies.length || isSelected(species.OTHER || [])}>
                    <summary>{GROUP_LABELS.OTHER}</summary>
                    {species.OTHER && getField(species.OTHER, 'OTHER')}
                    <MultiInput name="other-species" value={value.otherSpecies} onChange={onOtherChange} />
                </details>
                <input type="hidden" name={name} value={getValue()} />
            </InputWrapper>
        </div>
    );
};

export default SpeciesSelector;
