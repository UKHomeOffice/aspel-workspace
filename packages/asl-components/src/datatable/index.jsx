import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import map from 'lodash/map';
import merge from 'lodash/merge';
import size from 'lodash/size';
import pickBy from 'lodash/pickBy';
import { connect } from 'react-redux';
import { getValue } from '../utils';
import DatatableHeader from './header';
import { Pagination } from '../';

export class Datatable extends Component {
  constructor(options) {
    super(options);
    this.toggleContent = this.toggleContent.bind(this);
    this.isExpanded = this.isExpanded.bind(this);
  }

  componentDidMount() {
    if (!this.props.expands) {
      return;
    }
    const expanded = this.props.data.reduce((obj, { id }) => {
      return { ...obj, [id]: false };
    }, {});
    this.setState({ expanded });
  }

  toggleContent(id) {
    const { expanded } = this.state;
    expanded[id] = !expanded[id];
    this.setState({ expanded });
  }

  isExpanded(id) {
    if (this.props.expands) {
      if (!this.state) {
        return true;
      }
      return this.state && this.state.expanded[id];
    }
  }

  render() {
    const {
      data = [],
      schema,
      sortable,
      isFetching,
      expands,
      className
    } = this.props;

    return (
      <table className={classnames('govuk-table', 'govuk-react-datatable', className, isFetching && 'loading')}>
        <thead>
          <tr>
            {
              map(schema, (column, key) =>
                <DatatableHeader key={key} id={key} sortable={sortable} { ...column } />
              )
            }
          </tr>
          <tr id="filter-header"></tr>
        </thead>
        <tbody>
          {
            data.map(row => {
              const expansion = expands && expands(row);
              const expandable = !!expansion;
              const expanded = this.isExpanded(row.id);
              return <Fragment key={row.id}>
                <tr
                  onClick={expansion && (() => this.toggleContent(row.id))}
                  className={classnames({ expandable, expanded })}
                >
                  {
                    map(schema, (column, key) => {
                      const datum = getValue({ row, schema: column, key });
                      return <td key={key} className={key}>
                        { column.format ? column.format(datum, row) : datum }
                      </td>;
                    })
                  }
                </tr>
                {
                  expanded && (
                    <tr className='expanded-content' onClick={() => this.toggleContent(row.id)}>
                      <td colSpan={size(schema)}>
                        { expansion }
                      </td>
                    </tr>
                  )
                }
              </Fragment>;

            })
          }
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={size(schema)}>
              <Pagination />
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
}

const mapStateToProps = ({
  static: { schema },
  datatable: { data: { rows, isFetching }, filters, sort }
}, {
  formatters
}) => {
  return {
    sort,
    data: rows,
    isFetching,
    schema: pickBy(merge({}, schema, formatters), (item, key) => item.show)
  };
};

export default connect(
  mapStateToProps
)(Datatable);
