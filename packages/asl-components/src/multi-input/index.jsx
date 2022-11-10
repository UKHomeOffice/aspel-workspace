import { v4 as uuid } from 'uuid';
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

const getBytes = (str, numBytes = 16) => {
  let source = str.toLowerCase().replace(/[^0-9a-z]/g, '');

  while (source.length < numBytes / 2) {
    source += source; // repeat the input string until we have enough chars
  }

  let bytes = [];
  let i = 0;

  while (bytes.length < numBytes) {
    const char = source.charCodeAt(i);
    bytes.push(char >>> 8, char & 0xFF);
    i++;
  }

  return bytes;
};

export default function MultiInput({ value, onChange, onFieldChange, name, label, hint, error, disabled = [], disabledWarning, objectItems = false }) {
  const initialValue = (value ? castArray(value) : [])
    .filter(Boolean)
    .map((value, idx) => {
      return typeof value === 'object'
        ? value
        : { id: uuid({ random: getBytes(`${idx}${value}`) }), value }; // use reproducible seed for consistent uuids between server & client
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
    setItems([{ id: uuid({ random: getBytes('emptylist') }), value: '' }]);
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
              name={!objectItems && name}
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
