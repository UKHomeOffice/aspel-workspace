import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { doSearch } from './actions';
import { ApplyChanges } from '../';

export const Search = ({ filter, name = 'filter', label, hint, action, query, labelledBy, onChange }) => {
    const [value, setValue] = useState(filter);

    useEffect(() => {
        setValue(filter);
    }, [filter]);

    const emitChange = () => {
        onChange(value);
    };

    const onApply = action
        ? (e) => e.target.submit()
        : () => emitChange();

    return (
        <ApplyChanges type="form" action={action} onApply={onApply} query={query}>
            <div className="govuk-form-group search-box">
                {label && <label className="govuk-label" htmlFor={name}>{label}</label>}
                {hint && <span className="govuk-hint">{hint}</span>}
                <input
                    className="govuk-input"
                    id={name}
                    name={name}
                    type="text"
                    aria-labelledby={labelledBy}
                    value={value ? value : ''}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button type="submit" className="govuk-button" aria-label="Search"></button>
            </div>
        </ApplyChanges>
    );
};

const mapStateToProps = ({ datatable: { filters } }, { value }) => ({
    filter: value || (filters.active['*'] ? filters.active['*'][0] : '')
});

export default connect(
    mapStateToProps,
    { onChange: (value) => doSearch(value) }
)(Search);
