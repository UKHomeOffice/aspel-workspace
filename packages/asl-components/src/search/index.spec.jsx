import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { Search } from './';

describe('<Search />', () => {
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

  test('Creates a .text-filter element containing a govuk Input', () => {
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Adds a label with the label prop provided', () => {
    render(
      <Provider store={store}>
        <Search label="Search by name" />
      </Provider>);
    expect(screen.getByLabelText('Search by name')).toBeInTheDocument();
  });

  test('Sets the value of the input to the filter attr if passed', () => {
    const filter = 'Hi';
    render(
      <Provider store={store}>
        <Search filter={filter} />
      </Provider>);
    expect(screen.getByRole('textbox')).toHaveValue(filter);
  });

  test('Calls the provided onChange method on form submission', () => {
    const onChange = jest.fn();
    render(
      <Provider store={store}>
      <Search onChange={onChange} />
    </Provider>);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'foo' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('foo');
  });
});
