import React from 'react';
import { describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Page from '../../../../../../pages/role/named-person-mvp/views/select-role';

jest.mock('@ukhomeoffice/asl-components', () => {
  const React = require('react');

  return {
    Snippet: ({ children }) => <>{children}</>,
    Link: ({ page, label, className }) => (
      <a href={page} className={className}>{label}</a>
    ),
    FormLayout: ({ children, cancelLink, formatters }) => (
      <div data-testid="form-layout">
        <div data-testid="cancel-link">{cancelLink}</div>
        <div data-testid="additional-content">{formatters?.type?.additionalContent}</div>
        {children}
      </div>
    )
  };
});

jest.mock('../../../../../../pages/role/component/open-tasks', () => ({
  __esModule: true,
  default: ({ roleTasks = [] }) => <div data-testid="open-tasks">{`Open tasks (${roleTasks.length})`}</div>
}));

const buildState = ({ schema, addRoleTasks = [{ id: 'task-1', type: 'nvs' }] } = {}) => ({
  static: {
    addRoleTasks,
    schema,
    profile: {
      firstName: 'Jane',
      lastName: 'Doe'
    }
  }
});

const renderPage = state => {
  const store = createStore(() => buildState(state));

  return render(
    <Provider store={store}>
      <Page />
    </Provider>
  );
};

describe('Select role page', () => {
  test('renders the fallback task view when there are no available role options', () => {
    renderPage({ schema: { type: { options: [] } } });

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.queryByTestId('form-layout')).not.toBeInTheDocument();
    expect(screen.getByTestId('open-tasks')).toHaveTextContent('Open tasks (1)');
    expect(screen.getByRole('link', { name: 'buttons.cancel' })).toHaveAttribute('href', 'profile.read');
    expect(screen.getByRole('link', { name: 'buttons.cancel' })).toHaveClass('govuk-button');
  });

  test('treats a missing schema as having no available role options', () => {
    renderPage();

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.queryByTestId('form-layout')).not.toBeInTheDocument();
    expect(screen.getByTestId('open-tasks')).toHaveTextContent('Open tasks (1)');
  });

  test('renders the form layout with open tasks as additional content when role options exist', () => {
    renderPage({
      schema: {
        type: {
          options: [
            { label: 'NVS', value: 'nvs' },
            { label: 'NACWO', value: 'nacwo' }
          ]
        }
      },
      addRoleTasks: [
        { id: 'task-1', type: 'nvs' },
        { id: 'task-2', type: 'nacwo' }
      ]
    });

    expect(screen.getByTestId('form-layout')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByTestId('additional-content')).toHaveTextContent('Open tasks (2)');
    expect(screen.getByRole('link', { name: 'buttons.cancel' })).toHaveAttribute('href', 'profile.read');
    expect(screen.getByRole('link', { name: 'buttons.cancel' })).not.toHaveClass('govuk-button');
  });
});
