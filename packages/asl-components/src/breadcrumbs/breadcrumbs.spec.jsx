
jest.mock('./', () => {
  const actual = jest.requireActual('./');
  return {
    __esModule: true,
    default: actual.default,
    Breadcrumb: ({ crumb, link }) => (
      <div data-testid="breadcrumb" data-crumb={typeof crumb === 'object' ? crumb.label : crumb} data-link={link ? 'true' : 'false'} />
    ),
  };
});

// Mock Link and Snippet
jest.mock('../link', () => (props) => (
  <a href={`/${props.page}`} data-testid="link">{props.label}</a>
));
jest.mock('../snippet', () => (props) => (
  <span data-testid="snippet">{props.children}</span>
));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import Breadcrumbs from './';

describe('<Breadcrumbs />', () => {
  test('returns null when crumbs undefined', () => {
    const { container } = render(<Breadcrumbs />);
    expect(container.firstChild).toBeNull();
  });

  test('returns null when crumbs is empty array', () => {
    const { container } = render(<Breadcrumbs crumbs={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('returns null when crumbs is not an array', () => {
    const { container } = render(<Breadcrumbs crumbs={'A crumb'} />);
    expect(container.firstChild).toBeNull();
  });

  describe('with one crumb', () => {
    const crumbs = ['dashboard'];

    test('does not render any breadcrumb elements', () => {
      render(<Breadcrumbs crumbs={crumbs} />);
      const items = screen.queryAllByTestId('breadcrumb');
      expect(items.length).toBe(0);
    });
  });

  describe('with many crumbs', () => {
    const store = configureStore({
      reducer: {
        dummy: (state = {}) => state  // no-op reducer
      }
    });

    const crumbs = [
      'dashboard',
      'establishment.dashboard',
      'projects'
    ];

    test('renders 3 <Breadcrumb /> elements', () => {
      render(
        <Provider store={store}>
          <Breadcrumbs crumbs={crumbs} />
        </Provider>
      );
      const items = screen.getAllByTestId('breadcrumb');
      expect(items.length).toBe(3);
    });

    test('passes link="true" to the first 2 <Breadcrumb /> elements', () => {
      render(
        <Provider store={store}>
          <Breadcrumbs crumbs={crumbs} />
        </Provider>
      );
      const items = screen.getAllByTestId('breadcrumb');

      expect(items[0]).toHaveAttribute('data-crumb', 'dashboard');
      expect(items[0]).toHaveAttribute('data-link', 'true');

      expect(items[1]).toHaveAttribute('data-crumb', 'establishment.dashboard');
      expect(items[1]).toHaveAttribute('data-link', 'true');
    });

    test('passes link="false" to the last <Breadcrumb />', () => {
      render(
        <Provider store={store}>
          <Breadcrumbs crumbs={crumbs} />
        </Provider>
      );
      const items = screen.getAllByTestId('breadcrumb');

      expect(items[2]).toHaveAttribute('data-crumb', 'projects');
      expect(items[2]).toHaveAttribute('data-link', 'false');
    });
  });
});
