import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Diff from './';
import { expect, jest } from '@jest/globals';

jest.mock('../snippet', () => (props) => (
  <span data-testid="snippet">{props.children}</span>
));

describe('<Diff />', () => {
  afterEach(() => { cleanup(); });

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
    // exclude the header row
    expect(rows.slice(1)).toHaveLength(3);
  });

  test('applies formatters if present', () => {
    const diff = {
      name: { oldValue: '', newValue: 'Sterling Archer' }
    };
    const formatters = {
      name: { format: value => value.toUpperCase() }
    };
    render(<Diff diff={diff} formatters={formatters} />);

    // Find all cells and check last cell text content
    const cells = screen.getAllByRole('cell');
    expect(cells[cells.length - 1].textContent).toBe('STERLING ARCHER');
  });

  test('adds a highlight if a value has changed', () => {
    const diff = {
      name: { oldValue: '', newValue: 'Sterling Archer' },
      codename: { oldValue: '', newValue: '' } // Uncommented codename
    };
    render(
      <Provider store={store}>
        <Diff diff={diff} />
      </Provider>
    );

    const nameSpan = screen.getByText('Sterling Archer');
    expect(nameSpan).toHaveClass('highlight');

    // Use getAllByText to handle multiple elements with the text '-'
    const hyphenElements = screen.getAllByText('-');
    const codenameSpan = hyphenElements.find(
      (el) => el.tagName.toLowerCase() === 'span' && el.className === ''
    );
    expect(codenameSpan).not.toHaveClass('highlight');
  });

  test('renders a hyphen if value is falsy', () => {
    const diff = {
      name: { oldValue: null, newValue: '' }
    };
    render(<Diff diff={diff} />);

    // Get all cells in the row
    const cells = screen.getAllByRole('cell');

    // The first cell is likely the field name, next are oldValue and newValue
    // So check second and third cells for hyphen
    expect(cells[1].textContent).toBe('-');
    expect(cells[2].textContent).toBe('-');
  });
});
