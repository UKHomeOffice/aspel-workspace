import React from 'react';
import { describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Page from '../../../../../../pages/role/named-person-mvp/views/before-you-apply';
import content from '../../../../../../pages/role/named-person-mvp/content/before-you-apply';

jest.mock('@ukhomeoffice/asl-components', () => {
  const React = require('react');
  const { default: Snippet } = jest.requireActual('@ukhomeoffice/asl-components/src/snippet');

  return {
    Snippet,
    Header: ({ title }) => <div>{title}</div>,
    Form: ({ children }) => <div>{children}</div>,
    SupportingLinks: () => null
  };
});

const buildState = roleType => ({
  static: {
    content,
    profile: {
      firstName: 'Jane',
      lastName: 'Doe'
    },
    roleType,
    trainingDashboardUrl: '/training/dashboard'
  }
});

const renderPage = roleType => {
  const store = createStore(() => buildState(roleType));

  return render(
    <Provider store={store}>
      <Page />
    </Provider>
  );
};

describe('Before you apply page', () => {
  test('renders shared NACWO content with the NACWO role guide link', () => {
    renderPage('NACWO');

    expect(screen.getByText('Before you nominate someone for a NACWO role')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'NACWO role guide' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/guidance/nominate-someone-for-a-named-animal-care-and-welfare-officer-role'
    );
    expect(screen.getByRole('link', { name: 'training record in ASPeL' })).toHaveAttribute(
      'href',
      '/training/dashboard'
    );
  });

  test('renders shared NVS content with the NVS role guide link', () => {
    renderPage('NVS');

    expect(screen.getByText('Before you nominate someone for a NVS role')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'NVS role guide' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/guidance/nominate-someone-for-a-named-veterinary-surgeon-role'
    );
  });

  test('renders shared NIO content with the NIO role guide link', () => {
    renderPage('NIO');

    expect(screen.getByText('Before you nominate someone for an NIO role')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'NIO role guide' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/guidance/nominate-someone-for-a-named-information-officer-role'
    );
  });

  test('renders explicit PELH content without the shared role guide template', () => {
    renderPage('PELH');

    expect(screen.getByRole('heading', { name: 'Before you nominate someone for the PEL holder role you must ensure:' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'NACWO role guide' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'NVS role guide' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'SQP role guide' })).not.toBeInTheDocument();
  });
});
