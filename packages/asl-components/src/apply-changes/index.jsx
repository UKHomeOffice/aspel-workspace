import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { stringify } from 'qs';
import omit from 'lodash/omit';

export const ApplyChanges = ({
  id,
  type,
  label,
  onApply,
  children,
  query,
  action,
  method = 'GET',
  ...rest
}) => {
  return (
    <Fragment>
      {
        type === 'link' && (
          <a href={`?${stringify(query)}`} onClick={e => { e.preventDefault(); onApply(e); }} {...omit(rest, 'dispatch')}>{label}</a>
        )
      }
      {
        type === 'form' && (
          <form id={id} action={action} method={method} onSubmit={e => { e.preventDefault(); onApply(e); }}>
            <input type="hidden" name="props" value={stringify(query)} {...omit(rest, 'dispatch')}/>
            { children }
          </form>
        )
      }
    </Fragment>
  );
};

ApplyChanges.defaultProps = {
  type: 'link',
  label: 'Submit',
  onApply: e => e.target.submit(),
  query: {}
};

const mapStateToProps = ({
  datatable: { filters: { active: basefilters }, sort, pagination: { page } }
}, {
  query = {},
  filters = {}
}) => ({
  query: {
    filters: {
      ...basefilters,
      ...filters
    },
    sort,
    page: page + 1,
    ...query
  }
});

export default connect(mapStateToProps)(ApplyChanges);
