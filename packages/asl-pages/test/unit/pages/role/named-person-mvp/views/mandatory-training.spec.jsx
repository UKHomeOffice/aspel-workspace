import React from 'react';
import { describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Page from '../../../../../../pages/role/named-person-mvp/views/mandatory-training';
import content from '../../../../../../pages/role/named-person-mvp/content/mandatory-training';

jest.mock('@ukhomeoffice/asl-components', () => {
  const React = require('react');
  const { default: Snippet } = jest.requireActual('@ukhomeoffice/asl-components/src/snippet');

  return {
    Snippet,
    Header: ({ title }) => <h1>{title}</h1>,
    Form: ({ children }) => <div>{children}</div>,
    TrainingSummary: ({ certificates = [] }) => (
      <div>{`Training summary (${certificates.length})`}</div>
    ),
    Details: ({ summary, children, id }) => (
      <section id={id}>
        <div>{summary}</div>
        {children}
      </section>
    ),
    Inset: ({ children }) => <div>{children}</div>,
    SupportingLinks: ({ sectionTitle, links }) => (
      <aside>
        <h2>{sectionTitle}</h2>
        <ul>
          {links.map(link => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </aside>
    ),
    Link: ({ page, label }) => <a href={page}>{label}</a>,
    ErrorSummary: () => null
  };
});

jest.mock('../../../../../../pages/role/component/mandatory-training-requirements', () => ({
  __esModule: true,
  default: ({ roleType }) => <div>{`Requirements for ${roleType}`}</div>
}));

const buildState = roleType => ({
  static: {
    content,
    profile: {
      firstName: 'Jane',
      lastName: 'Doe',
      certificates: [{ id: 1 }, { id: 2 }]
    },
    role: {
      type: roleType
    }
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

describe('Mandatory training page', () => {
  test('renders NACWO specific content, requirements and supporting links', () => {
    renderPage('nacwo');

    expect(screen.getByRole('heading', { name: 'NACWO mandatory training' })).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText(/there is an unavoidable delay/i)).toBeInTheDocument();
    expect(screen.getByText('NACWO mandatory training requirements (opens below)')).toBeInTheDocument();
    expect(screen.getByText('Requirements for nacwo')).toBeInTheDocument();
    expect(screen.getByText('Check Jane\'s training record (opens below)')).toBeInTheDocument();
    expect(screen.getByText('Training summary (2)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Update Jane\'s training record' })).toHaveAttribute('href', 'training.dashboard');
    expect(screen.getByRole('heading', { name: 'Supporting guidance on GOV.UK' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Adding a NACWO role' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/guidance/nominate-someone-for-a-named-animal-care-and-welfare-officer-role'
    );
    expect(screen.getByRole('link', { name: 'Guidance on training and continuous professional development (CPD) under ASPA' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act'
    );
  });

  test('renders the NVS exception text', () => {
    renderPage('nvs');

    expect(screen.getByRole('heading', { name: 'NVS mandatory training' })).toBeInTheDocument();
    expect(screen.getByText(/unless they have grounds for exemption/i)).toBeInTheDocument();
    expect(screen.getByText(/The only exception is the NVS module/i)).toBeInTheDocument();
    expect(screen.getByText('Requirements for nvs')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Adding a NVS role' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/guidance/nominate-someone-for-a-named-veterinary-surgeon-role'
    );
  });

  test('renders SQP content without the NVS exception', () => {
    renderPage('sqp');

    expect(screen.getByRole('heading', { name: 'SQP mandatory training' })).toBeInTheDocument();
    expect(screen.getByText(/unless they have grounds for exemption/i)).toBeInTheDocument();
    expect(screen.queryByText(/The only exception is the NVS module/i)).not.toBeInTheDocument();
    expect(screen.getByText('Requirements for sqp')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Adding a SQP role' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/guidance/nominate-someone-for-a-suitably-qualified-person-role'
    );
    expect(screen.getByRole('link', { name: 'Guidance on the operation of the Animals (Scientific Procedures) Act 1986' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#other-suitably-qualified-person'
    );
  });
});
