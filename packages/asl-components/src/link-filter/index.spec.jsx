import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LinkFilter, ShowAll } from './';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ApplyChanges } from '../';
import { expect } from '@jest/globals';

describe('<LinkFilter />', () => {
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

  test('renders an \'All\' ShowAll element if no filter is selected', () => {
    const filters = [];
    const expected = 'All';
    render(
      <Provider store={store}>
        <LinkFilter filters={filters} selected={false} />
      </Provider>
    );
    const el = screen.getByText(expected);
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('STRONG');
  });

  test('renders \'All\' as text if filter not selected', () => {
    const expected = 'All';
    render(
      <Provider store={store}>
        <ShowAll label={expected} />
      </Provider>
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  test('renders an ApplyChanges component for each filter', () => {
    const filters = ['a filter', 'b filter', 'c filter'];
    render(
      <Provider store={store}>
        <LinkFilter filters={filters} />
      </Provider>
    );
    const els = screen.getAllByRole('link');
    expect(els).toHaveLength(3);
    expect(els[0]).toHaveTextContent('a filter');
    expect(els[1]).toHaveTextContent('b filter');
    expect(els[2]).toHaveTextContent('c filter');
  });

  // todo: re-enable this test when understood and is fixed
  // test('renders selected filter as text and hides "All"', () => {
    // const filters = ['a filter'];
    // const selected = 'a filter';
    // render(
    //   <Provider store={store}>
    //     <LinkFilter filters={filters} selected={selected} />
    //   </Provider>
    // );
    //
    // // Ensure "All" is not rendered
    // expect(screen.queryByText('All')).not.toBeInTheDocument();
    //
    // // Ensure the selected filter is rendered as <strong>
    // const selectedFilter = screen.getByText(selected);
    // expect(selectedFilter).toBeInTheDocument();
    // expect(selectedFilter.tagName).toBe('STRONG');
  // });

  test('ApplyChanges: All calls onChange with null when onApply is called', () => {
    const onChange = jest.fn();
    const selected = 'a filter';
    render(
      <Provider store={store}>
        <ShowAll selected={selected} onChange={onChange} />
      </Provider>
    );
    const button = screen.getByRole('link');
    fireEvent.click(button);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  test('ApplyChanges: filter calls onChange with filter when onApply is called', () => {
    const onChange = jest.fn();
    const filters = ['a filter'];
    render(
      <Provider store={store}>
        <LinkFilter filters={filters} onChange={onChange} />
      </Provider>
    );
    const button = screen.getByText('a filter');
    fireEvent.click(button);
    expect(onChange).toHaveBeenCalledWith(filters[0]);
  });
});
