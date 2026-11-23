import PropTypes from 'prop-types';
import value from './value';

export default PropTypes.arrayOf(
    PropTypes.oneOfType([
        PropTypes.shape({
            value,
            label: PropTypes.node,
            hint: PropTypes.node,
            disabled: PropTypes.bool,
            additionalContent: PropTypes.string,
        }),
        value,
        PropTypes.shape({
            divider: PropTypes.node,
            className: PropTypes.string,
            additionalContent: PropTypes.string
        })
    ])
);
