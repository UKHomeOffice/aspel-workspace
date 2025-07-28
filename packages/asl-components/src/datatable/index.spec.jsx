import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { expect, jest } from '@jest/globals';
import { Datatable, Row } from './';

jest.mock('../snippet', () => (props) => (
  <span data-testid="snippet">{props.children}</span>
));

// Dummy reducers that just return their state
const dummyReducer = (state = {}) => state;
const paginationReducer = (state = {}) => state;

const preloadedState = {
  datatable: {
    sort: {
      column: 'name',
      ascending: true
    },
    data: { rows: [], isFetching: false },
    schema: {},
    filters: { active: null},
    pagination: { hideUI: false },

  },
  pagination: {
    active: 1,
    totalPages: 5,
    pageSize: 10,
    // Add other keys your Pagination might expect here
  }
};

const store = configureStore({
  reducer: {
    datatable: dummyReducer,
    pagination: paginationReducer
  },
  preloadedState
});

const schema = { site: {}, name: {}, number: {} };

describe('<Datatable />', () => {
  test('renders any class names passed to it', () => {
    render(
      <Provider store={store}>
        <Datatable schema={schema} className="foo bar" />
      </Provider>
    );

    const table = screen.getByRole('table'); // find the table element by role

    expect(table).toHaveClass('foo');
    expect(table).toHaveClass('bar');
  });

  test('doesn’t render class "undefined" if no className passed', () => {
    render(
      <Provider store={store}>
        <Datatable schema={schema} />
      </Provider>
    );
    const table = screen.getByRole('table');
    expect(table).not.toHaveClass('undefined');
  });

  test('renders a <TableHeader /> element for each column, taken from schema', () => {
    const schema = {
      site: { show: true },
      name: { show: true },
      number: { show: true }
    };

    const formatters = {
      activeDeadline: { format: jest.fn(), show: true },
      assignedTo: { format: jest.fn(), show: true },
      establishment: { format: jest.fn(), show: true },
      status: { format: jest.fn(), show: true },
      type: { format: jest.fn(), show: true },
      updatedAt: { format: jest.fn(), show: true }
    };

    render(
      <Provider store={store}>
        <Datatable schema={schema} formatters={formatters} />
      </Provider>
    );

    // Combine schema and formatters keys for assertions
    const keys = [...Object.keys(schema), ...Object.keys(formatters)];

    keys.forEach(key => {
      expect(screen.getByTestId(`header-${key}`)).toBeInTheDocument();
    });
  });

  describe('<Row />', () => {
    test('renders a <td /> element for each key', () => {
      const row = { id: 1, site: 'A Site', name: 'The Name', number: 3 };
      render(
        <table>
          <tbody>
            <Row row={row} expands={() => true} schema={{ id: {}, site: {}, name: {}, number: {} }} />
          </tbody>
        </table>);
      const cells = screen.getAllByRole('cell');
      expect(cells).toHaveLength(4);
    });

    test('formats data if format function provided', () => {
      const row = { id: 1, site: 'A Site', name: 'The Name', number: 3 };
      const schema = {
        site: {
          show: true,
          format: text => text.toUpperCase()
        },
        name: { show: true },
        number: { show: true }
      };
      render(
        <table>
          <tbody>
            <Row row={row} expands={() => true} schema={schema} />
          </tbody>
        </table>);
      const cells = screen.getAllByRole('cell');
      expect(cells[0]).toHaveTextContent('A SITE');
    });

    test('passes full row data to format function', () => {
      const row = { id: 1, site: 'A Site', name: 'The Name', number: 3 };
      const schema = {
        site: {
          show: true,
          format: (text, row) => `${text} - ${row.id}`
        },
        name: { show: true },
        number: { show: true }
      };
      render(
        <table>
          <tbody>
            <Row row={row} expands={() => true} schema={schema} />
          </tbody>
        </table>);
      const cells = screen.getAllByRole('cell');
      expect(cells[0]).toHaveTextContent('A Site - 1');
    });

    test('accesses a deeply nested field if accessor provided', () => {
      const row = { id: 1, site: 'A Site', name: 'The Name', number: 3, nacwo: { profile: { name: 'A Name' } } };
      const schema = {
        site: { show: true },
        name: { show: true },
        number: { show: true },
        nacwo: { show: true, accessor: 'nacwo.profile.name' }
      };
      render(
        <table>
          <tbody>
            <Row row={row} expands={() => true} schema={schema} />
          </tbody>
        </table>);
      const cells = screen.getAllByRole('cell');
      expect(cells[3]).toHaveTextContent('A Name');
    });
  });

  describe('expandable rows', () => {
    const data = [
      { id: 1, site: 'A Site', name: 'The Name', number: 3 },
      { id: 2, site: 'A Site', name: 'The Name', number: 4 },
      { id: 3, site: 'A Site', name: 'The Name', number: 5 },
      { id: 4, site: 'A Site', name: 'The Name', number: 6 }
    ];

    const schema = {
      site: { show: true },
      name: { show: true },
      number: { show: true }
    };

    function Expandable() {
      return <div>Expanded</div>;
    }

    const expands = row => row.number % 2 === 0;

    function renderRow(index) {
      return render(
        <table>
          <tbody>
          <Row row={data[index]} schema={schema} expands={expands} Expandable={Expandable} />
          </tbody>
        </table>
      );
    }

    test('adds expandable classname if expands resolves to true', () => {
      const { container: c0 } = renderRow(0);
      expect(c0.querySelector('tr')).not.toHaveClass('expandable');

      const { container: c1 } = renderRow(1);
      expect(c1.querySelector('tr')).toHaveClass('expandable');
    });

    test('shows expanding content for a row when clicked', () => {
      const { container } = renderRow(1);
      const mainRow = container.querySelector('tr.expandable');
      fireEvent.click(mainRow);
      const expanded = container.querySelector('tr.expanded-content');
      expect(expanded).toBeInTheDocument();
      expect(expanded).toHaveTextContent('Expanded');
    });

    test('clicking an open row closes it', () => {
      const { container } = renderRow(1);
      const mainRow = container.querySelector('tr.expandable');
      fireEvent.click(mainRow); // open
      expect(container.querySelector('tr.expanded-content')).toBeInTheDocument();
      fireEvent.click(mainRow); // close
      expect(container.querySelector('tr.expanded-content')).not.toBeInTheDocument();
    });
  });
});
