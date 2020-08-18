import React from 'react';
import { EditableField, Snippet } from '../';

export default function RestrictionsField(props) {
  return <EditableField
    label={<Snippet>fields.restrictions.label</Snippet>}
    currentLabel={<Snippet>fields.restrictions.currentLabel</Snippet>}
    proposedLabel={<Snippet>fields.restrictions.proposedLabel</Snippet>}
    deleteItemWarning="Are you sure you want to remove these restrictions?"
    original={props.model && props.model.restrictions}
    proposed={props.value}
    {...props}
    format={val => val || 'None'}
  />;
}
