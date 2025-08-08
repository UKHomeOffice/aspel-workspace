import React, { useState, useEffect, useCallback } from 'react';
import AccessibleAutocomplete from 'accessible-autocomplete/react';
import { InputWrapper } from '@ukhomeoffice/react-components';
import { getUrl } from '../link';

export default function AutoComplete(props) {
    const [value, setValue] = useState(props.value);
    const defaultValue = props.defaultValue || (props.options.find(opt => opt.value === props.value) || {}).label;
    const apiPath = props.apiPath ? getUrl({ page: props.apiPath }) : null;

    useEffect(() => {
        if (!props.name) {
            return;
        }
        const inputElement = window.document.querySelector(`input#${props.name}`);

        function onBlur(event) {
            const val = event.target.value;
            if (!val) {
                setValue('');
            }
            // this is needed if a new value can be added by the field
            // onConfirm is not fired by autocomplete if option not found
            if (props.allowNewOption) {
                setValue(val);
            }
        }

        inputElement.addEventListener('blur', onBlur);

        return () => {
            inputElement.removeEventListener('blur', onBlur);
        };
    });

    useEffect(() => {
        typeof props.onChange === 'function' && props.onChange({ target: { value } });
    }, [value]);

    const simpleSearch = useCallback((query, syncResults) => {
        syncResults(query
            ? props.options.filter(result => {
                const option = typeof result === 'string' ? result : result.label;
                return option.toLowerCase().includes(query.toLowerCase());
            })
            : []
        );
    }, [props.options]);

    const apiSearch = useCallback((query, syncResults) => {
        if (!query) {
            return syncResults([]);
        }
        window.fetch(`${apiPath}?search=${query}`)
            .then(res => res.json())
            .then(results => {
                syncResults(results || []);
            })
            .catch(err => console.error('Failed to fetch', err));
    }, []);

    const renderLabel = useCallback(item => {
        return typeof item === 'object' ? item.label : item;
    }, []);

    const onConfirm = useCallback(option => {
        console.log('onConfirm', option);
        if (typeof option === 'string') {
            return setValue(option);
        }
        setValue(option ? option.value : '');
    }, [setValue]);

    return (
        <InputWrapper {...props}>
            {
                props.name && <input type="hidden" name={props.name} value={value} />
            }
            <AccessibleAutocomplete
                id={props.name}
                source={props.apiPath ? apiSearch : simpleSearch}
                templates={{
                    inputValue: renderLabel,
                    suggestion: renderLabel
                }}
                onConfirm={onConfirm}
                confirmOnBlur={false}
                defaultValue={defaultValue}
            />
        </InputWrapper>
    );
}
