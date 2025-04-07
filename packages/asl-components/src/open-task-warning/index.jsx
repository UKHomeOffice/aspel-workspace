import React from 'react';
import { useSelector } from 'react-redux';
import { Warning } from '@ukhomeoffice/react-components';
import { Snippet } from '../';

export default function OpenTaskWarning({ openTasks }) {
    openTasks = openTasks || useSelector(state => state.model.openTasks);

    if (!openTasks || !openTasks.length) {
        return null;
    }

    return <Warning><Snippet>warnings.openTask</Snippet></Warning>;
}
