import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { TableHeader } from './header';
import { expect, jest } from '@jest/globals';

jest.mock('../snippet', () => (props) => (
  <span data-testid="snippet">{props.children}</span>
));

describe('<TableHeader />', () => {
  afterEach(() => {
    cleanup();
  });

  const store = configureStore({
    reducer: {
      datatable: () => ({
        filters: {
          active: {
            a: [1, 2, 3],
            b: [2, 3, 4],
          },
        },
        sort: {
          ascending: true,
          column: 'test',
        },
        pagination: {
          page: 0,
        },
      }),
    },
  });

  test('renders a <th> element', () => {
    render(
      <Provider store={store}>
        <div>
            <TableHeader id="test" />
        </div>
      </Provider>
  );
    expect(screen.getByRole('columnheader')).toBeInTheDocument();
  });

  test('adds aria-sort="none" to the th if sortable but not current column', () => {
    render(
      <Provider store={store}>
        <TableHeader id="test" column="another" ascending={true} />
      </Provider>
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'none');
  });

  test('adds an <ApplyChanges /> element as a child if sortable', () => {
    render(
      <Provider store={store}>
        <TableHeader id="test" column="another" ascending={true} />
      </Provider>
    );
    expect(screen.getByTestId('apply-changes')).toBeInTheDocument();
  });

  test('adds aria-sort="ascending" to the th if current column and ascending is true', () => {
    render(
      <Provider store={store}>
        <TableHeader id="test" column="test" ascending={true} />
      </Provider>
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending');
  });

  test('adds aria-sort="descending" to the th if current column and ascending is false', () => {
    render(
      <Provider store={store}>
        <TableHeader id="test" column="test" ascending={false} />
      </Provider>
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending');
  });

  test('calls setSortColumn with the current column id if changes applied', () => {
    const mockOnHeaderClick = jest.fn();
    render(
      <Provider store={store}>
        <TableHeader
          id="test"
          column="another"
          ascending={false}
          onHeaderClick={mockOnHeaderClick}
        />
      </Provider>
    );
    fireEvent.click(screen.getByTestId('apply-changes'));
    expect(mockOnHeaderClick).toHaveBeenCalledWith('test');
  });
});
