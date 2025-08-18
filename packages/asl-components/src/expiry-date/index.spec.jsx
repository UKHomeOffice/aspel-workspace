jest.mock('../snippet', () => (props) => (
  <span data-testid="snippet">{props.children}</span>
));

import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { addWeeks } from 'date-fns';
import { expect, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import ExpiryDate from './';

describe('<ExpiryDate />', () => {
  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const store = configureStore({
    reducer: {
      dummy: (state = {}) => state  // no-op reducer
    }
  });

  test('shows a message if provided date is in the past', () => {
    render(
      <Provider store={store}>
        <ExpiryDate date={'2017-01-01'} />
    </Provider>);

    expect(screen.getByText(/2017/i)).toBeInTheDocument();
    expect(screen.getByTestId('snippet')).toBeInTheDocument();
    expect(screen.getByText('countdown.expired')).toBeInTheDocument();
    expect(screen.getByText('countdown.expired').parentElement).toHaveClass("notice urgent");
  });

  test('does not show the countdown if showNotice is false', () => {
    render(<ExpiryDate date={addWeeks(new Date(), 1)} showNotice={false} />);
    expect(screen.queryByTestId('countdown')).not.toBeInTheDocument();
  });
});
