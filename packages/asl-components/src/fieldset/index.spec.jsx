import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Fieldset from './index';

// guards against empty legend label> regressions screen readers read them as unlabelled
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

  test('skips the heading if checkbox group label is empty', () => {
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
 //
  test('does not show heading if label is empty', () => {
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
  test('keeps the date error message describing the submitted value while editing', () => {
    const content = {
      errors: {
        default: {
          date: {
            incomplete: '{{dateLabel}} must include {{missingParts}}',
            realDate: '{{dateLabel}} must be a real date'
          }
        }
      }
    };

    const contentStore = configureStore({
      reducer: {
        static: (state = { content }) => state,
        model: (state = {}) => state
      }
    });

    // Submitted with no month, so the message blames the missing month.
    const { container } = render(
      <Provider store={contentStore}>
        <Fieldset
          schema={{
            passDate: {
              inputType: 'inputDate',
              label: 'Date awarded',
              hint: 'For example, 20 8 2020',
              dateLabel: 'Award date',
              validate: ['required', 'validDate']
            }
          }}
          errors={{ passDate: 'validDate' }}
          model={{ passDate: '2024--10' }}
        />
      </Provider>
    );

    expect(screen.getByText('Award date must include a month')).toBeInTheDocument();

    fireEvent.change(container.querySelector('#passDate-month'), { target: { value: '5' } });

    expect(screen.getByText('Award date must include a month')).toBeInTheDocument();
    expect(screen.queryByText('Award date must be a real date')).not.toBeInTheDocument();
  });
});
