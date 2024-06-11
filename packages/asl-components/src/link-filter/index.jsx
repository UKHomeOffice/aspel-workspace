import React from 'react';
import { connect } from 'react-redux';
import { clickLinkFilter } from './actions';
import { ApplyChanges } from '../';

export function ShowAll({ selected, label, prop, onChange }) {
    return selected
        ? <ApplyChanges
            onApply={() => onChange(null)}
            label={label}
            filters={{
                [prop]: []
            }}
        />
        : <strong>{label}</strong>;
}

export const LinkFilter = ({
    filters,
    selected,
    onChange,
    formatter,
    prop,
    label = 'Filter by:',
    showAll = { position: 'before', label: 'All' }
}) => {
    return (
        <div className="link-filter">
            <label>{ label }</label>
            <ul>
                {
                    showAll && showAll.position !== 'after' &&
            <li><ShowAll selected={selected} label={showAll.label} prop={prop} onChange={onChange} /></li>
                }
                {
                    filters.map(f => {
                        const label = formatter ? formatter(f) : f;
                        if (f === selected) {
                            return <li key={ f }><strong>{ label }</strong></li>;
                        }
                        return (
                            <li key={ f }>
                                <ApplyChanges
                                    onApply={() => onChange(f)}
                                    label={ label }
                                    filters={{
                                        [prop]: [f]
                                    }}
                                />
                            </li>
                        );
                    })
                }
                {
                    showAll && showAll.position === 'after' &&
            <li><ShowAll selected={selected} label={showAll.label} prop={prop} onChange={onChange} /></li>
                }
            </ul>
        </div>
    );
};

const mapStateToProps = ({ datatable: { filters: { active, options } } }, { prop, prepend = [], append = [], options: propOptions }) => {
    options = propOptions || options;
    if (options && typeof options[0] === 'object') {
        options = (options.find(opt => opt.key === prop) || {}).values;
    }
    return {
        selected: active[prop] && active[prop][0],
        filters: [ ...prepend, ...options, ...append ]
    };
};

const mapDispatchToProps = (dispatch, { prop }) => {
    return {
        onChange: val => dispatch(clickLinkFilter(prop, val))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkFilter);
