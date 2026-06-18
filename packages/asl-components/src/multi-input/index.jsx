import { v4 as uuid } from 'uuid';
import shasum from 'shasum';
import classnames from 'classnames';
import React, { useState, useEffect, Fragment } from 'react';
import { Button, Input, Warning } from '@ukhomeoffice/react-components';
import castArray from 'lodash/castArray';

function getItemLabel(itemLabel, index) {
    return `${itemLabel} ${index + 1}`;
}

function Item({ item, index, itemLabel, onRemove, showRemove, onChange, name, isDisabled, disabledWarning }) {
    return (
        <Fragment>
            <div className="multi-input-item">
                <Input type="text" value={item.value} onChange={onChange} label={getItemLabel(itemLabel, index)} name={name} id={item.id} disabled={isDisabled} />
                {
                    showRemove && (
                        <Button onClick={onRemove} disabled={isDisabled}>
                            Remove {getItemLabel(itemLabel, index)}
                        </Button>
                    )
                }
            </div>
            {
                isDisabled && disabledWarning &&
          <Warning>{disabledWarning}</Warning>
            }
        </Fragment>
    );
}

// generate reproducible seed for consistent uuids between server & client
const getReproducibleUuid = str => {
    const unsignedInts = shasum(str).match(/[\dA-F]{2}/gi).map(s => parseInt(s, 16));
    return uuid({ random: new Uint8Array(unsignedInts) });
};

export default function MultiInput({ value = [], onChange, onFieldChange, name, label, hint, error, disabled = [], disabledWarning, objectItems = false, itemLabel = label || 'Item', addAnotherLabel = 'Add another' }) {
    const initialValue = (value ? castArray(value) : [])
        .filter(Boolean)
        .map((value, idx) => {
            return typeof value === 'object'
                ? value
                : { id: getReproducibleUuid(`${idx}${value}`), value };
        });

    const [items, setItems] = useState(initialValue);

    useEffect(() => {
        if (!items.length) {
            setItems([{ id: uuid(), value: '' }]);
        }
    }, []);

    useEffect(() => {
        const rtn = getItems();

        onChange(rtn);

        if (onFieldChange) {
            onFieldChange(rtn);
        }
    }, [items]);

    function getItems() {
        return objectItems
            ? items.filter(i => i.value)
            : items.map(obj => obj.value).filter(Boolean);
    }

    function removeItem(id) {
        return e => {
            e.preventDefault();
            setItems(items.filter(item => item.id !== id));
        };
    }

    function addItem(e) {
        e.preventDefault();
        setItems([ ...items, { id: uuid(), value: '' } ]);
    }

    function updateItem(id) {
        return e => {
            setItems(items.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        value: e.target.value
                    };
                }
                return item;
            }));
        };
    }

    const describedBy = [
        hint ? `${name}-hint` : null,
        error ? `${name}-error` : null
    ].filter(Boolean).join(' ') || undefined;

    return (
        <div className={classnames('govuk-form-group', 'multi-input', { 'govuk-form-group--error': error })}>
            {
                objectItems && <input type="hidden" name={name} value={JSON.stringify(getItems())} />
            }
            <fieldset id={name} className="govuk-fieldset" aria-describedby={describedBy}>
                {
                    label && (
                        <legend className="govuk-fieldset__legend">
                            <h3 className="govuk-fieldset__heading">{label}</h3>
                        </legend>
                    )
                }
                { hint && <span id={`${name}-hint`} className="govuk-hint">{hint}</span> }
                { error && <span id={`${name}-error`} className="govuk-error-message">{error}</span> }
                {
                    items.map((item, index) => (
                        <Item
                            item={item}
                            index={index}
                            key={item.id}
                            itemLabel={itemLabel}
                            name={`${name}-${item.id}`}
                            onRemove={removeItem(item.id)}
                            onChange={updateItem(item.id)}
                            isDisabled={disabled.includes(item.id)}
                            disabledWarning={disabledWarning}
                            showRemove={items.length > 1}
                        />
                    ))
                }
            </fieldset>
            <Button className="button-secondary" onClick={addItem}>{addAnotherLabel}</Button>
        </div>
    );
}
