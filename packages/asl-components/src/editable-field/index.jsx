import React, { useState, useEffect, Fragment } from 'react';
import { TextArea, Button } from '@ukhomeoffice/react-components';
import { Markdown } from '../';

export default function EditableField({
  label,
  original,
  proposed,
  editable = true,
  format,
  name,
  currentLabel,
  proposedLabel,
  deleteProposedWarning = 'Are you sure you want to delete proposed changes?',
  deleteItemWarning = 'Are you sure you want to remove this item?',
  cancelEditingWarning = 'Are you sure you want to cancel editing?',
  setDirty = () => {}
}) {
  original = original || '';
  proposed = proposed === '' ? '' : proposed || original;
  const [editing, setEditing] = useState(false);
  const [proposedContent, setProposedContent] = useState(proposed);

  useEffect(() => {
    setDirty(proposed !== proposedContent);
  }, [proposed, proposedContent]);

  const editLabel = original || proposedContent ? 'Edit' : 'Add';

  function toggleEditing(e) {
    e.preventDefault();
    setEditing(!editing);
  }

  function cancel(e) {
    e.preventDefault();
    if (window.confirm(cancelEditingWarning)) {
      setProposedContent(proposed);
      setEditing(false);
    }
  }

  function remove(e) {
    e.preventDefault();
    const shouldDelete = original && original === proposedContent;
    if (window.confirm(shouldDelete ? deleteItemWarning : deleteProposedWarning)) {
      setProposedContent(shouldDelete ? '' : original);
      setEditing(false);
    }
  }

  function onChange(e) {
    setProposedContent(e.target.value);
  }

  const showDiff = editing || (original && !proposedContent) || original !== proposedContent;

  return (
    <div className="govuk-form-group editable-field">
      <h2>{ label }</h2>
      { showDiff && currentLabel && <h3>{currentLabel}</h3> }
      <Markdown>{ format ? format(original) : original }</Markdown>
      {
        showDiff && (
          <Fragment>
            {
              proposedLabel && <h3>{proposedLabel}</h3>
            }
            {
              editing
                ? (
                  <TextArea
                    label=""
                    name={name}
                    value={proposedContent}
                    onChange={onChange}
                    autoExpand={true}
                  />
                )
                : <Markdown className="highlight">{proposedContent || 'None'}</Markdown>
            }
          </Fragment>
        )
      }
      {
        editable && (
          <p className="control-panel">
            {
              editing && <Button onClick={toggleEditing}>Done</Button>
            }
            <a href="#" onClick={editing ? cancel : toggleEditing}>{editing ? 'Cancel' : editLabel}</a>
            {
              !editing && proposedContent && (original !== proposedContent || original) && <a href="#" onClick={remove}>Remove</a>
            }
            <input type="hidden" name={name} value={proposedContent} />
          </p>
        )
      }
    </div>
  );
}
