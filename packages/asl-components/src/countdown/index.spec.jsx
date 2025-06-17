jest.mock('../snippet', () => (props) => (
  <span data-testid="snippet">{props.children}</span>
));

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { endOfTomorrow, addWeeks, addMonths } from 'date-fns';
import Countdown from './';
import { expect, jest } from '@jest/globals';

describe('<Countdown />', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const store = configureStore({
    reducer: {
      dummy: (state = {}) => state  // no-op reducer
    }
  });

  test('shows an expired message if provided date is in the past', () => {
    render(
      <Provider store={store}>
        <Countdown expiry={'2017-01-01'} />
      </Provider>
    );
    expect(screen.getByText('countdown.expired')).toBeInTheDocument();
  });

  test('shows an expires today message if the date is today', () => {
    const today = new Date(2025, 4, 29);
    today.setHours(0, 0, 0, 0); // Normalize to start of the day
    jest.setSystemTime(today);
    render(
      <Provider store={store}>
        <Countdown expiry={today} />
      </Provider>
    );

    const snippet = screen.getByText('countdown.expiresToday');
    expect(snippet).toBeInTheDocument();
    expect(snippet.parentElement).toHaveClass('urgent');
  });

  test('shows urgent 1 day left message if the expiry date is tomorrow', () => {
    render(
      <Provider store={store}>
        <Countdown expiry={endOfTomorrow()} />
      </Provider>
    );
    const snippet = screen.getByText('countdown.singular');
    expect(snippet).toBeInTheDocument();
    expect(snippet.parentElement).toHaveClass('urgent');
  });

  test('shows less than x weeks left if the expiry date is greater than 2 weeks but less than a month', () => {
    render(<Provider store={store}>
      <Countdown expiry={addWeeks(new Date(), 3)} />
    </Provider>
    );
    expect(screen.getByText('countdown.plural')).toBeInTheDocument();
  });

  test('shows less than x months left if the expiry date is greater than 1 month but less than a year', () => {
    render(<Provider store={store}>
      <Countdown expiry={addMonths(new Date(), 9)} />
    </Provider>
    );
    expect(screen.getByText('countdown.plural')).toBeInTheDocument();
  });

  test('does not display if showNotice is less than the current time difference', () => {
    const { container } = render(
      <Provider store={store}>
        <Countdown expiry={addMonths(new Date(), 9)} unit="month" showNotice={7} />
      </Provider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  describe('custom content key', () => {
    test('uses in place of default key if provided', () => {
      render(
        <Provider store={store}>
          <Countdown expiry={'2017-01-01'} contentPrefix="custom" />
        </Provider>
      );
      expect(screen.getByText('custom.expired')).toBeInTheDocument();

      render(
        <Provider store={store}>
          <Countdown expiry={new Date()} contentPrefix="custom" />
        </Provider>
      );
      expect(screen.getByText('custom.expiresToday')).toBeInTheDocument();

      render(
        <Provider store={store}>
          <Countdown expiry={endOfTomorrow()} contentPrefix="custom" />
        </Provider>
      );
      expect(screen.getByText('custom.singular')).toBeInTheDocument();
    });
  });
});
