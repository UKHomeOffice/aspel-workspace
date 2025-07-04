import React from 'react';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { Pagination } from './';
import { expect, jest } from '@jest/globals';

describe('<Pagination />', () => {
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
          total: 10,
          Pages: 10,
          limit: 10,
          count: 96,
        },
      }),
    },
  });

  test('renders 1-5 page links with the first selected when on page 1', () => {
    const props = {
      totalPages: 10,
      limit: 10,
      page: 0,
      count: 96,
      onPageChange: jest.fn(),
    };

    render(
      <Provider store={store}>
        <Pagination {...props} />
      </Provider>);

    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveTextContent('1');
    expect(links[1]).toHaveTextContent('2');
    expect(links[2]).toHaveTextContent('3');
    expect(links[3]).toHaveTextContent('4');
    expect(links[4]).toHaveTextContent('5');
    expect(links[0]).toHaveClass('current'); // Corrected index
    expect(links[1]).not.toHaveClass('current');
    expect(links[2]).not.toHaveClass('current');
    expect(links[3]).not.toHaveClass('current');
    expect(links[4]).not.toHaveClass('current');
  });

  test('renders 3-7 page links with the middle page selected when on page 5 of 10', () => {
    const props = {
      page: 4,
      totalPages: 10,
      limit: 10,
      count: 96,
      onPageChange: jest.fn()
    };

    render(
      <Provider store={store}>
        <Pagination {...props} />
      </Provider>
    );

    const links = screen.getAllByRole('link');
    expect(links[1]).toHaveTextContent('3');
    expect(links[2]).toHaveTextContent('4');
    expect(links[3]).toHaveTextContent('5');
    expect(links[4]).toHaveTextContent('6');
    expect(links[5]).toHaveTextContent('7');
    expect(links[1]).not.toHaveClass('current');
    expect(links[2]).not.toHaveClass('current');
    expect(links[3]).toHaveClass('current');
    expect(links[4]).not.toHaveClass('current');
    expect(links[5]).not.toHaveClass('current');
  });

  test('renders 6-10 page links with the last page selected when on page 10 of 10', () => {
    const props = {
      page: 9,
      totalPages: 10,
      limit: 10,
      count: 96,
      onPageChange: jest.fn()
    };

    render(
      <Provider store={store}>
        <Pagination {...props} />
      </Provider>
    );

    const links = screen.getAllByRole('link');
    expect(links[1]).toHaveTextContent('6');
    expect(links[2]).toHaveTextContent('7');
    expect(links[3]).toHaveTextContent('8');
    expect(links[4]).toHaveTextContent('9');
    expect(links[5]).toHaveTextContent('10');
    expect(links[1]).not.toHaveClass('current');
    expect(links[2]).not.toHaveClass('current');
    expect(links[3]).not.toHaveClass('current');
    expect(links[4]).not.toHaveClass('current');
    expect(links[5]).toHaveClass('current');
  });
});
