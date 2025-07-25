import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { Rops } from './rops';
import { expect } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// Mock the Link component properly
jest.mock('@ukhomeoffice/asl-components/src/link', () => ({
  __esModule: true,
  default: ({ label, ...props }) => {
    // Filter out non-DOM props
    const { ropId, page, step, ...rest } = props;
    return (
      <a
        {...rest}
        data-testid="mock-link"
        data-ropid={ropId}
        data-page={page}
        data-step={step}
      >
        {label}
      </a>
    );
  },
  getUrl: jest.fn().mockImplementation(({ page, ropId, step }) => {
    if (page === 'rops.procedures') return `/rops/${ropId}/procedures`;
    if (page === 'rops.update') return `/rops/${ropId}/update/${step || 'confirm'}`;
    return '#';
  })
}));


describe('<Rops />', () => {
  afterEach(() => {
    cleanup();
  });

  const store = configureStore({
    reducer: {
      static: (state = {}) => state
    },
    preloadedState: {
      static: {
        canAccessRops: true,
        content: {
          rops: {
            title: 'Return of procedures',
            'not-due': 'No returns due',
            read: 'View return for {{year}}',
            continue: 'Continue return for {{year}}',
            start: 'Start return for {{year}}',
            submitted: 'Submitted return for {{year}}',
            incomplete: 'Incomplete return for {{year}}',
            previous: 'Previous returns',
          }
        },
        // These will be overridden by props
        project: { rops: [] },
        ropsYears: [],
      }
    }
  });

  test('renders a rop per year', () => {
    const props = {
      ropsYears: [2021, 2022],
      project: {
        rops: []
      },
      url: 'http://localhost:8080/',
      today: new Date('2022-12-01')
    };

    render(
      <Provider store={store}>
        <Rops {...props} />
      </Provider>
    );
    expect(screen.getAllByTestId('rop').length).toBe(2);
  });

  test('does not render rop for the current year if not past 1st feb', () => {
    const props = {
      ropsYears: [2021, 2022],
      project: {
        expiryDate: new Date('2025-01-31'),
        rops: []
      },
      url: 'http://localhost:8080/',
      today: new Date('2022-01-31')
    };
    render(
      <Provider store={store}><Rops {...props} /></Provider>
    );
    expect(screen.getAllByTestId('rop').length).toBe(1);
  });

  test('renders a rop for the current year if past 1st feb', () => {
    const props = {
      ropsYears: [2021, 2022],
      project: {
        rops: []
      },
      url: 'http://localhost:8080/',
      today: new Date('2022-02-01')
    };
    render(<Provider store={store}><Rops {...props} /></Provider>);
    expect(screen.getAllByTestId('rop').length).toBe(2);
  });

  test('renders rop for the current year if project is expired and not past 1st feb', () => {
    const props = {
      ropsYears: [2021, 2022],
      project: {
        expiryDate: new Date('2022-01-30 23:59:59'),
        rops: []
      },
      url: 'http://localhost:8080/',
      today: new Date('2022-01-31')
    };
    render(<Provider store={store}><Rops {...props} /></Provider>);
    expect(screen.getAllByTestId('rop').length).toBe(2);
  });

  test('renders rop for the current year if project is revoked and not past 1st feb', () => {
    const props = {
      ropsYears: [2021, 2022],
      project: {
        revocationDate: new Date('2022-01-30 23:59:59'),
        rops: []
      },
      url: 'http://localhost:8080/',
      today: new Date('2022-01-31')
    };
    render(<Provider store={store}><Rops {...props} /></Provider>);
    expect(screen.getAllByTestId('rop').length).toBe(2);
  });

  test('renders an active rop per unsubmitted year', () => {
    const ropId = '12345-67890-abcdef';
    const props = {
      ropsYears: [2021, 2022],
      project: {
        rops: [
          { id: ropId, year: 2021, status: 'draft' },
          { id: ropId,year: 2022, status: 'draft' }
        ]
      },
      url: 'http://localhost:8080/',
      today: new Date('2022-02-01')
    };
    render(<Provider store={store}><Rops {...props} /></Provider>);
    const rops = screen.getAllByTestId('rop');
    expect(rops.length).toBe(2);
    expect(rops[0]).toHaveAttribute('data-status', 'draft');
    expect(rops[0]).toHaveAttribute('data-year', '2021');
    expect(rops[0]).toHaveAttribute('data-active', 'true');

    expect(rops[1]).toHaveAttribute('data-status', 'draft');
    expect(rops[1]).toHaveAttribute('data-year', '2022');
    expect(rops[1]).toHaveAttribute('data-active', 'true');
  });

  test('renders an inactive rop per submitted year', () => {
    const props = {
      ropsYears: [2020, 2021, 2022],
      project: {
        rops: [
          { year: 2020, status: 'submitted' },
          { year: 2021, status: 'draft' },
          { year: 2022, status: 'draft' }
        ]
      },
      url: 'http://localhost:8080/',
      today: new Date('2022-02-01')
    };
    render(<Provider store={store}><Rops {...props} /></Provider>);
    const rops = screen.getAllByTestId('rop');
    expect(rops.length).toBe(3);

    expect(rops[0]).toHaveAttribute('data-status', 'draft');
    expect(rops[0]).toHaveAttribute('data-year', '2021');
    expect(rops[0]).toHaveAttribute('data-active', 'true');

    expect(rops[1]).toHaveAttribute('data-status', 'draft');
    expect(rops[1]).toHaveAttribute('data-year', '2022');
    expect(rops[1]).toHaveAttribute('data-active', 'true');

    expect(rops[2]).toHaveAttribute('data-status', 'submitted');
    expect(rops[2]).toHaveAttribute('data-year', '2020');
    expect(rops[2]).not.toHaveAttribute('data-active');
  });

  test('renders an active for last years ROP if in first half of the year', () => {
    const props = {
      ropsYears: [2020, 2021, 2022],
      project: {
        rops: [
          { year: 2020, status: 'submitted' },
          { year: 2021, status: 'submitted' },
          { year: 2022, status: 'draft' }
        ]
      },
      url: 'http://localhost:8080/',
      today: new Date('2022-02-01')
    };
    render(<Provider store={store}><Rops {...props} /></Provider>);
    const rops = screen.getAllByTestId('rop');
    expect(rops.length).toBe(3);

    expect(rops[0]).toHaveAttribute('data-status', 'submitted');
    expect(rops[0]).toHaveAttribute('data-year', '2021');
    expect(rops[0]).toHaveAttribute('data-active', 'true');

    expect(rops[1]).toHaveAttribute('data-status', 'draft');
    expect(rops[1]).toHaveAttribute('data-year', '2022');
    expect(rops[1]).toHaveAttribute('data-active', 'true');

    expect(rops[2]).toHaveAttribute('data-status', 'submitted');
    expect(rops[2]).toHaveAttribute('data-year', '2020');
    expect(rops[2]).not.toHaveAttribute('data-active');
  });

  test('renders an active for last years ROP if in first half of the year', () => {
    const props = {
      ropsYears: [2020, 2021, 2022],
      project: {
        rops: [
          { year: 2020, status: 'submitted' },
          { year: 2021, status: 'submitted' },
          { year: 2022, status: 'draft' }
        ]
      },
      url: 'http://localhost:8080/',
      today: new Date('2022-08-01')
    };
    render(<Provider store={store}><Rops {...props} /></Provider>);
    const rops = screen.getAllByTestId('rop');
    expect(rops.length).toBe(3);

    expect(rops[0]).toHaveAttribute('data-status', 'draft');
    expect(rops[0]).toHaveAttribute('data-year', '2022');
    expect(rops[0]).toHaveAttribute('data-active', 'true');

    expect(rops[1]).toHaveAttribute('data-status', 'submitted');
    expect(rops[1]).toHaveAttribute('data-year', '2020');
    expect(rops[1]).not.toHaveAttribute('data-active');

    expect(rops[2]).toHaveAttribute('data-status', 'submitted');
    expect(rops[2]).toHaveAttribute('data-year', '2021');
    expect(rops[2]).not.toHaveAttribute('data-active');
  });
});
