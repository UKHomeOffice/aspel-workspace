import React, { useState, useEffect } from 'react';
import { Button, Input } from '@ukhomeoffice/react-components';

function Item({ value, onRemove, showRemove, onChange }) {
  return (
    <div className="multi-input-item">
      <Input type="text" value={value} onChange={onChange} label="" />
      {
        showRemove && <Button onClick={onRemove}>Remove</Button>
      }
    </div>
  );
}

export default function MultiInput({ value, onChange }) {
  const [items, setItems] = useState(value);

  useEffect(() => {
    onChange(items.filter(Boolean));
  }, [items]);

  if (!items.length) {
    setItems(['']);
  }

  function removeItem(index) {
    return e => {
      e.preventDefault();
      setItems(items.filter((item, i) => i !== index));
    };
  }

  function addItem(e) {
    e.preventDefault();
    setItems([ ...items, '' ]);
  }

  function updateItem(index) {
    return e => {
      setItems(items.map((item, i) => {
        if (index === i) {
          return e.target.value;
        }
        return item;
      }));
    };
  }

  return (
    <div className="multi-input">
      <fieldset>
        {
          items.map((item, index) => (
            <Item
              value={item}
              key={index}
              onRemove={removeItem(index)}
              onChange={updateItem(index)}
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
