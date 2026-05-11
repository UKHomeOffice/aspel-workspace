import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Fieldset from './index';

describe('<Fieldset />', () => {
  const store = configureStore({
    reducer: {
      static: (state = {}) => state
    }
  });

  const renderFieldset = schema => render(
    <Provider store={store}>
      <Fieldset
        schema={schema}
        model={{ species: [] }}
      />
    </Provider>
  );

  test('does not render an empty heading when a checkbox group label is false', () => {
    renderFieldset({
      species: {
        inputType: 'checkboxGroup',
        label: false,
        options: [
          {
            value: 'cats',
            label: 'Cats'
          }
        ]
      }
    });

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Cats')).toBeInTheDocument();
  });

  test('does not render an empty heading when a checkbox group label is an empty string', () => {
    renderFieldset({
      species: {
        inputType: 'checkboxGroup',
        label: '',
        options: [
          {
            value: 'dogs',
            label: 'Dogs'
          }
        ]
      }
    });

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Dogs')).toBeInTheDocument();
  });
});
