import React, { Children, Fragment, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import { useDispatch } from 'react-redux';
import { Button } from '@ukhomeoffice/react-components';
import { v4 as uuid } from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';
import { throwError } from '../actions/messages';

const noopPromise = () => Promise.resolve();

export default ({
  children,
  type = 'item',
  prefix,
  singular = 'item',
  addOnInit = true,
  addAnother = true,
  addButtonBefore = false,
  addButtonAfter = false,
  addAnotherLabel,
  addAnotherClassname,
  softDelete = false,
  itemProps,
  expanded,
  onSave = noopPromise,
  onBeforeAdd = noopPromise,
  onAfterAdd = noopPromise,
  onBeforeRemove = noopPromise,
  onAfterRemove = noopPromise,
  onBeforeRestore = noopPromise,
  onAfterRestore = noopPromise,
  ...props
}) => {

  const onBeforeDuplicate = useCallback(
    (items, uuid) => props.onBeforeDuplicate ? props.onBeforeDuplicate(items, uuid) : Promise.resolve(items),
    [props.onBeforeDuplicate]
  );

  const onAfterDuplicate = useCallback(
    (item, uuid) => props.onAfterDuplicate ? props.onAfterDuplicate(item, uuid) : Promise.resolve(item),
    [props.onAfterDuplicate]
  );

  const [items, setItems] = React.useState([]);

  const dispatch = useDispatch();
  const dispatchError = useCallback((message) => {
    throwError(message)(dispatch);
  }, []);

  const save = useCallback((newItems) => onSave(newItems ?? items), [onSave]);
  const update = useCallback((newItems) =>
    Promise.resolve()
      .then(() => setItems(newItems))
      .then(() => save(newItems))
      .catch(err => dispatchError(err.message || 'Error updating items')),
  [setItems, save, dispatchError]
  );

  const addItem = useCallback(() => {
    Promise.resolve()
      .then(onBeforeAdd)
      .then(() => update([ items, { id: uuid(), ...(itemProps ?? {}) } ]))
      .then(onAfterAdd)
      .catch(err => dispatchError(err.message || 'Error adding item'));
  }, [onBeforeAdd, update, items, itemProps, onAfterAdd, dispatchError]);

  const updateItem = useCallback((index, updated) =>
    update(items.map((item, i) => index === i
      ? omitBy({ ...item, ...updated }, isUndefined)
      : item
    )), [update, items]);

  const duplicateItem = useCallback((index, event) => {
    if (event) {
      event.preventDefault();
    }

    const item = cloneDeep(items[index]);

    function updateIds(obj) {
      if (obj.id) {
        obj.id = uuid();
      }
      Object.values(obj).forEach(val => {
        if (Array.isArray(val)) {
          val.forEach(updateIds);
        }
      });
    }

    updateIds(item);
    const withDuplicate = [...items.slice(0, index + 1), item, ...items.slice(index + 1)];

    return Promise.resolve()
      .then(() => onBeforeDuplicate(withDuplicate, item.id))
      .then(items => update(items))
      .then(() => onAfterDuplicate(item, item.id))
      .catch(err => dispatchError(err.message || 'Error duplicating item'));
  }, [items, onBeforeDuplicate, update, onAfterDuplicate, dispatchError]);

  const removeItem = useCallback((index, event) => {
    if (event) {
      event.preventDefault();
    }
    return Promise.resolve()
      .then(onBeforeRemove)
      .then(() => {
        if (softDelete && items[index].reusable) {
          return update(items.map((item, i) => {
            if (index === i) {
              return { ...item, deleted: true };
            }
            return item;
          }));
        } else {
          return update(items.filter((item, i) => index !== i));
        }
      })
      .then(onAfterRemove)
      .catch(err => dispatchError(err.message || 'Error removing item'));
  }, [onBeforeRemove, softDelete, items, update, onAfterRemove, dispatchError]);

  const restoreItem = useCallback((index, event) => {
    if (event) {
      event.preventDefault();
    }
    return Promise.resolve()
      .then(onBeforeRestore)
      .then(() => update(items.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            deleted: false
          };
        }
        return item;
      })))
      .then(onAfterRestore)
      .catch(err => dispatchError(err.message || 'Error restoring item'));
  }, [onBeforeRestore, update, items, onAfterRestore, dispatchError]);

  const moveUp = useCallback((index) => {
    if (index > 0) {
      return update([
        ...items.slice(0, index - 1),
        items[index],
        items[index - 1],
        ...items.slice(index + 1)
      ]);
    }
  }, [update, items]);

  const moveDown = useCallback((index) => {
    if (index + 1 < items.length) {
      return update([
        ...items.slice(0, index),
        items[index + 1],
        items[index],
        ...items.slice(index + 2)
      ]);
    }
  }, [update, items]);

  useMemo(() => {
    setItems(props.items ?? []);
  }, [setItems, props.items]);

  useMemo(() => {
    if (addOnInit && !props.items?.length) {
      addItem();
    }
  }, [] /* Only run on first render */);

  const addButton =
    <Button
      className={classnames('block', 'add-another', addAnotherClassname || 'button-secondary')}
      onClick={addItem}>
      {addAnotherLabel || `Add another ${singular}`}
    </Button>;

  return (
    <Fragment>
      {
        addButtonBefore && addAnother && addButton
      }
      {
        items.map((item, index) =>
          Children.map(children, child => {
            return React.cloneElement(child, {
              ...child.props,
              index,
              key: item.id,
              updateItem: (child.updateItem || updateItem).bind(this, index),
              removeItem: e => removeItem(index, e),
              restoreItem: e => restoreItem(index, e),
              duplicateItem: e => duplicateItem(index, e),
              moveUp: () => moveUp(index),
              moveDown: () => moveDown(index),
              values: item,
              prefix: `${prefix ?? ''}${type}.${item.id}.`,
              length: items.length,
              expanded: expanded && expanded[index],
              number: index - (items.slice(0, index).filter(i => i.deleted) || []).length
            });
          })
        )
      }
      {
        (!addButtonBefore || addButtonAfter) && addAnother && addButton
      }
    </Fragment>
  );
};
