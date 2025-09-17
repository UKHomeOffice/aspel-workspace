import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import FlashBanner from './';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

describe('<FlashBanner />', () => {
  afterEach(() => {
    cleanup();
  });

  // Helper to create a store with optional flash
  const createStoreWithFlash = (flash = null) =>
    configureStore({
      reducer: {
        static: (state = { flash }) => state
      }
    });

  test('renders heading and body when both are provided', () => {
    const store = createStoreWithFlash({
      title: 'Test Heading',
      body: 'Test body content',
      type: 'success'
    });

    render(
      <Provider store={store}>
        <FlashBanner />
      </Provider>
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Heading');
    expect(screen.getByText('Test body content')).toBeInTheDocument();
    const wrapper = screen.getByText('Test body content').closest('.flash-banner--success');
    expect(wrapper).toBeInTheDocument();
  });

  test('renders only body when heading is not provided', () => {
    const store = createStoreWithFlash({
      body: 'Body only',
      type: 'info'
    });

    render(
      <Provider store={store}>
        <FlashBanner />
      </Provider>
    );

    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.getByText('Body only')).toBeInTheDocument();
    const wrapper = screen.getByText('Body only').closest('.flash-banner--info');
    expect(wrapper).toBeInTheDocument();
  });

  test('renders nothing when flash is null', () => {
    const store = createStoreWithFlash(null);

    render(
      <Provider store={store}>
        <FlashBanner />
      </Provider>
    );

    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.queryByText(/./)).toBeNull(); // no text content rendered
  });

  test('applies default class when type is missing', () => {
    const store = createStoreWithFlash({
      title: 'Default type',
      body: 'Body content'
      // type missing
    });

    render(
      <Provider store={store}>
        <FlashBanner />
      </Provider>
    );

    const wrapper = screen.getByText('Body content').closest('.flash-banner--success');
    expect(wrapper).toBeInTheDocument();
  });
});
