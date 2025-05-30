// import React from 'react';
// import { shallow } from 'enzyme';
// import Diff from './';
//
// describe('<Diff />', () => {
//   test('renders a table row for each field', () => {
//     const diff = {
//       name: { oldValue: '', newValue: 'Sterling Archer' },
//       codename: { oldValue: '', newValue: 'Duchess' },
//       age: { oldValue: null, newValue: 36 }
//     };
//     const container = shallow(<Diff diff={diff}/>);
//     expect(container.find('tbody tr').length).toBe(3);
//   });
//
//   test('applies formatters if present', () => {
//     const diff = {
//       name: { oldValue: '', newValue: 'Sterling Archer' }
//     };
//     const formatters = {
//       name: { format: value => value.toUpperCase() }
//     };
//     const container = shallow(<Diff diff={diff} formatters={formatters} />);
//     expect(container.find('tbody tr td').last().text()).toBe('STERLING ARCHER');
//   });
//
//   test('adds a highlight if a value has changed', () => {
//     const diff = {
//       name: { oldValue: '', newValue: 'Sterling Archer' },
//       codename: { oldValue: '', newValue: '' }
//     };
//     const container = shallow(<Diff diff={diff} />);
//     expect(container
//       .find('tbody tr span')
//       .first()
//       .prop('className')
//     ).toBe('highlight');
//     expect(container
//       .find('tbody tr span')
//       .last()
//       .prop('className')
//     ).toBe('');
//   });
//
//   test('renders a hyphen if value is falsy', () => {
//     const diff = {
//       name: { oldValue: null, newValue: '' }
//     };
//     const container = shallow(<Diff diff={diff} />);
//     expect(container.find('tbody tr td').at(1).text()).toBe('-');
//     expect(container.find('tbody tr td').at(2).text()).toBe('-');
//   });
// });

import React from 'react';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Diff from './';
import { expect, jest } from '@jest/globals';

jest.mock('../snippet', () => (props) => (
  <span data-testid="snippet">{props.children}</span>
));

describe('<Diff />', () => {
  const store = configureStore({
    reducer: {
      dummy: (state = {}) => state  // no-op reducer
    }
  });

  test('renders a table row for each field', () => {
    const diff = {
      name: { oldValue: '', newValue: 'Sterling Archer' },
      codename: { oldValue: '', newValue: 'Duchess' },
      age: { oldValue: null, newValue: 36 }
    };
    render(
      <Provider store={store}>
        <Diff diff={diff} />
      </Provider>
    );

    const rows = screen.getAllByRole('row');
    expect(rows.slice(1)).toHaveLength(3);
  });

  test('applies formatters if present', () => {
    const diff = {
      name: { oldValue: '', newValue: 'Sterling Archer' }
    };
    const formatters = {
      name: { format: value => value.toUpperCase() }
    };
    render(<table><tbody><Diff diff={diff} formatters={formatters} /></tbody></table>);

    // Find all cells and check last cell text content
    const cells = screen.getAllByRole('cell');
    expect(cells[cells.length - 1].textContent).toBe('STERLING ARCHER');
  });

  test('adds a highlight if a value has changed', () => {
    const diff = {
      name: { oldValue: '', newValue: 'Sterling Archer' },
      codename: { oldValue: '', newValue: '' }
    };
    render(<table><tbody><Diff diff={diff} /></tbody></table>);

    // Get all spans inside the table
    const spans = screen.getAllByText((content, element) => element.tagName.toLowerCase() === 'span');

    // Check className of first and last span
    expect(spans[0]).toHaveClass('highlight');
    expect(spans[spans.length - 1]).not.toHaveClass('highlight');
  });

  test('renders a hyphen if value is falsy', () => {
    const diff = {
      name: { oldValue: null, newValue: '' }
    };
    render(<table><tbody><Diff diff={diff} /></tbody></table>);

    // Get all cells in the row
    const cells = screen.getAllByRole('cell');

    // The first cell is likely the field name, next are oldValue and newValue
    // So check second and third cells for hyphen
    expect(cells[1].textContent).toBe('-');
    expect(cells[2].textContent).toBe('-');
  });
});
