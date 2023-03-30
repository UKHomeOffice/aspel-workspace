import React from 'react';
import { connect } from 'react-redux';
import { stringify } from 'qs';

export const ExportLink = ({
    label = 'Export as',
    ...props
}) => (
    <p>
        {`${label} `}<a href={`?${stringify({ ...props, format: 'pdf' })}`}>PDF</a> | <a href={`?${stringify({ ...props, format: 'csv' })}`}>CSV</a>
    </p>
);

const mapStateToProps = ({ datatable: { filters, sort } }) => ({ filters, sort });

export default connect(
    mapStateToProps
)(ExportLink);
