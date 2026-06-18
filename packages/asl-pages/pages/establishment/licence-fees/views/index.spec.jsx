import React from 'react';
import { expect } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import Fees from './index';

jest.mock('@ukhomeoffice/asl-components', () => {
  const React = require('react');
  const content = {
    'fees.title': 'Estimated licence fees',
    'fees.period': 'Covering the financial year:',
    'fees.disclaimer': 'These projections are based on the number of billable licences held and may differ from the final numbers.',
    'fees.details.summary': 'How these fees are calculated',
    'fees.details.content': 'Fees are calculated from billable licences.',
    'title': 'Overview'
  };

  function Snippet({ children }) {
    return content[children] || children || null;
  }

  return {
    Details: ({ children }) => <div>{children}</div>,
    ErrorSummary: () => null,
    Header: ({ title, subtitle }) => (
      <div>
        <div>{subtitle}</div>
        <h1>{title}</h1>
      </div>
    ),
    Inset: ({ children }) => <div>{children}</div>,
    Link: ({ label }) => <a href="/">{label}</a>,
    Snippet,
    Tabs: ({ children }) => <div>{children}</div>,
    WidthContainer: ({ children }) => <div>{children}</div>
  };
});

jest.mock('@ukhomeoffice/asl-components/src/link', () => ({
  getUrl: jest.fn().mockReturnValue('/licence-fees/2024')
}));

jest.mock('@ukhomeoffice/react-components', () => ({
  Warning: ({ children }) => <div>{children}</div>,
  Select: ({ name, label, options, value, onChange, className }) => (
    <div className={`govuk-form-group ${className || ''}`.trim()}>
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} value={value} onChange={onChange}>
        {
          options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))
        }
      </select>
    </div>
  )
}));

jest.mock('../../../common/components/establishment-header', () => (
  function EstablishmentHeader({ establishment }) {
    return <span>{establishment.name}</span>;
  }
));

describe('<Fees />', () => {
  test('renders a named year selector for screen readers', () => {
    const store = configureStore({
      reducer: {
        static: (state = {}) => state
      },
      preloadedState: {
        static: {
          establishment: {
            name: 'University of Croydon'
          },
          year: 2024,
          fees: {
            years: [2024]
          }
        }
      }
    });

    render(
      <Provider store={store}>
        <Fees tab={0}>
          <div>Tab content</div>
        </Fees>
      </Provider>
    );

    expect(screen.getByRole('combobox', { name: 'Covering the financial year:' })).toBeInTheDocument();
  });
});
