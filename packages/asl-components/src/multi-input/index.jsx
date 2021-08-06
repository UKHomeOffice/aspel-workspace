import { v4 as uuid } from 'uuid';
import React, { useState, useEffect } from 'react';
import { Button, Input } from '@ukhomeoffice/react-components';
import castArray from 'lodash/castArray';

function Item({ item, onRemove, showRemove, onChange, name, disabled }) {
  const isDisabled = disabled.includes(item.id);
  return (
    <div className="multi-input-item">
      <Input type="text" value={item.value} onChange={onChange} label="" name={name} disabled={isDisabled} />
      {
        showRemove && <Button onClick={onRemove} disabled={isDisabled}>Remove</Button>
      }
    </div>
  );
}

export default function MultiInput({ value, onChange, onFieldChange, name, disabled = [], objectItems = false }) {
  const initialValue = (value ? castArray(value) : [])
    .filter(Boolean)
    .map(v => typeof v !== 'object' ? ({ id: uuid(), value: v }) : v);
  const [items, setItems] = useState(initialValue);

  useEffect(() => {
    const rtn = objectItems
      ? items.filter(i => i.value)
      : items.map(obj => obj.value).filter(Boolean);

    onChange(rtn);

    if (onFieldChange) {
      onFieldChange(rtn);
    }
  }, [items]);

  if (!items.length) {
    setItems([{ id: uuid(), value: '' }]);
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
    <div className="multi-input">
      {
        objectItems && <input type="hidden" name={name} value={JSON.stringify(items)} />
      }
      <fieldset>
        {
          items.map(item => (
            <Item
              item={item}
              key={item.id}
              name={!objectItems && name}
              onRemove={removeItem(item.id)}
              onChange={updateItem(item.id)}
              disabled={disabled}
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
