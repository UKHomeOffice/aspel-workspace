import { v4 as uuid } from 'uuid';
import shasum from 'shasum';
import classnames from 'classnames';
import React, { useState, useEffect, Fragment } from 'react';
import { Button, Input, Warning } from '@ukhomeoffice/react-components';
import castArray from 'lodash/castArray';

function Item({ item, onRemove, showRemove, onChange, name, isDisabled, disabledWarning }) {
  return (
    <Fragment>
      <div className="multi-input-item">
        <Input type="text" value={item.value} onChange={onChange} label="" name={name} id={item.id} disabled={isDisabled} />
        {
          showRemove && <Button onClick={onRemove} disabled={isDisabled}>Remove</Button>
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

export default function MultiInput({ value, onChange, onFieldChange, name, label, hint, error, disabled = [], disabledWarning, objectItems = false }) {
  const initialValue = (value ? castArray(value) : [])
    .filter(Boolean)
    .map((value, idx) => {
      return typeof value === 'object'
        ? value
        : { id: getReproducibleUuid(`${idx}${value}`), value };
    });

  const [items, setItems] = useState(initialValue);

  useEffect(() => {
    const rtn = getItems();

    onChange(rtn);

    if (onFieldChange) {
      onFieldChange(rtn);
    }
  }, [items]);

  if (!items.length) {
    setItems([{ id: getReproducibleUuid(name), value: '' }]);
  }

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

  return (
    <div className={classnames('govuk-form-group', 'multi-input', { 'govuk-form-group--error': error })}>
      {
        objectItems && <input type="hidden" name={name} value={JSON.stringify(getItems())} />
      }
      <label className="govuk-label" htmlFor={name}>{label}</label>
      { hint && <span id={`${name}-hint`} className="govuk-hint">{hint}</span> }
      { error && <span id={`${name}-error`} className="govuk-error-message">{error}</span> }
      <fieldset id={name}>
        {
          items.map(item => (
            <Item
              item={item}
              key={item.id}
              name={objectItems ? `${name}-${item.id}` : name}
              onRemove={removeItem(item.id)}
              onChange={updateItem(item.id)}
              isDisabled={disabled.includes(item.id)}
              disabledWarning={disabledWarning}
              showRemove={items.length > 1}
            />
          ))
        }
      </fieldset>
      <Button className="button-secondary" onClick={addItem}>Add another</Button>
    </div>
  );
}

MultiInput.defaultProps = {
  value: []
};
