import React, { Fragment, useMemo } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { ApplyChanges } from '../';
import { changePage } from './actions';

const pagesToShow = (page, totalPages) => {
    if(totalPages <= 1) {
        return [];
    }
    const end = Math.min(totalPages, Math.max(5, page + 3));
    const start = Math.max(0, end - 5);
    return Array.from(Array(totalPages).keys()).slice(start, end);
};

export const Pagination = ({
    totalPages,
    limit,
    page,
    count,
    onPageChange
}) => {
    const links = useMemo(
        () => [
            ...(page > 0
                ? [{
                    ariaLabel: 'Previous page',
                    className: 'prev',
                    label: <Fragment><span aria-hidden="true" role="presentation">&laquo;</span> Previous</Fragment>,
                    target: (page - 1) || 0
                }]
                : []
            ),
            ...pagesToShow(page, totalPages).map(p => ({
                ariaLabel: `Page ${p + 1}`,
                label: p + 1,
                target: p,
                disabled: page === p
            })),
            ...(page < totalPages - 1
                ? [{
                    ariaLabel: 'Next page',
                    className: 'next',
                    label: <Fragment>Next <span aria-hidden="true" role="presentation">&raquo;</span></Fragment>,
                    target: page + 1
                }]
                : []
            )
        ],
        [page, totalPages]
    );
    return (
        <nav className="pagination" role="navigation" aria-label="Pagination">
            <div
                className="pagination-summary">{`Showing ${count ? page * limit + 1 : 0} – ${(page + 1) * limit < count ? (page + 1) * limit : count} of ${count} results`}
            </div>
            <ul>
                {
                    links.map((link, key) =>
                        <li className="pagination-item" key={key}>
                            <ApplyChanges
                                label={link.label}
                                className={classnames('pagination-link', { current: link.disabled }, link.className)}
                                aria-label={link.ariaLabel}
                                query={{
                                    page: link.target + 1
                                }}
                                aria-current={link.target === page}
                                onApply={() => onPageChange(link.target)}
                            />
                        </li>
                    )
                }
            </ul>
        </nav>
    );
};

const mapStateToProps = ({ datatable: { pagination } }) => ({
    ...pagination
});

const mapDispatchToProps = dispatch => ({
    onPageChange: page => dispatch(changePage(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
