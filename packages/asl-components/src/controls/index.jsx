/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Snippet } from '../';

const Controls = ({
    url,
    item,
    editLabel = 'Change',
    deleteLabel = 'Remove'
}) => (
    <Fragment>
        <a href={`${url}/${item}/edit`}><Snippet>buttons.edit</Snippet></a>
        <a href={`${url}/${item}/delete`}><Snippet>buttons.delete</Snippet></a>
    </Fragment>
);

const mapStateToProps = ({ static: { url } }) => ({ url });

export default connect(mapStateToProps)(Controls);
