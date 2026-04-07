import React from 'react';
import { describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Page from '../../../../../../pages/role/named-person-mvp/views/before-you-apply';
import content from '../../../../../../pages/role/named-person-mvp/content/before-you-apply';

const mockSupportingLinks = jest.fn(() => null);

jest.mock('@ukhomeoffice/asl-components', () => {
  const React = require('react');
  const { default: Snippet } = jest.requireActual('@ukhomeoffice/asl-components/src/snippet');

  return {
    Snippet,
    Header: ({ title }) => <div>{title}</div>,
    Form: ({ children }) => <div>{children}</div>,
    SupportingLinks: props => {
      mockSupportingLinks(props);
      return null;
    }
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
  test('renders the profile name caption', () => {
    renderPage('NACWO');

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

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

    expect(screen.getByText('Before you nominate someone for an NVS role')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'NVS role guide' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/guidance/nominate-someone-for-a-named-veterinary-surgeon-role'
    );
  });

  test('renders shared SQP content with the vet availability check and SQP role guide link', () => {
    renderPage('SQP');

    expect(screen.getByText('Before you nominate someone for an SQP role')).toBeInTheDocument();
    expect(screen.getByText('there is no vet available with the right expertise')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'SQP role guide' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/guidance/nominate-someone-for-a-suitably-qualified-person-role'
    );
    expect(screen.getByRole('link', { name: 'training record in ASPeL' })).toHaveAttribute(
      'href',
      '/training/dashboard'
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

  test('renders shared NTCO content without the mandatory training section', () => {
    renderPage('NTCO');

    expect(screen.getByText('Before you nominate someone for an NTCO role')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'NTCO role guide' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/guidance/nominate-someone-for-a-named-training-and-competency-officer-role'
    );
    expect(screen.queryByRole('link', { name: 'training record in ASPeL' })).not.toBeInTheDocument();
  });

  test('renders explicit NPRC content without the shared role guide template', () => {
    renderPage('NPRC');

    expect(screen.getByText('Before you nominate someone for an NPRC role you must ensure:')).toBeInTheDocument();
    expect(screen.getByText('the legally accountable person supports the nomination')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'asrulicensing@homeoffice.gov.uk' })).toHaveAttribute(
      'href',
      'mailto:asrulicensing@homeoffice.gov.uk'
    );
    expect(screen.queryByRole('link', { name: 'NPRC role guide' })).not.toBeInTheDocument();
  });

  test('renders explicit PELH content without the shared role guide template', () => {
    renderPage('PELH');

    expect(screen.getByText('Before you nominate someone for the PEL holder role you must ensure:')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'NACWO role guide' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'NVS role guide' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'SQP role guide' })).not.toBeInTheDocument();
  });

  test('renders explicit HOLC content without the shared role guide template', () => {
    renderPage('HOLC');

    expect(screen.getByText('Before you nominate someone for a HOLC role you must ensure:')).toBeInTheDocument();
    expect(screen.getByText('you can describe why they are suitable for the role')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'HOLC role guide' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'training record in ASPeL' })).not.toBeInTheDocument();
  });

  test('passes role-specific supporting links to SupportingLinks', () => {
    renderPage('NTCO');

    expect(mockSupportingLinks).toHaveBeenCalledWith(expect.objectContaining({
      links: expect.arrayContaining([
        expect.objectContaining({
          label: 'NTCO role guide',
          href: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-training-and-competency-officer-role'
        })
      ])
    }));
  });
});
