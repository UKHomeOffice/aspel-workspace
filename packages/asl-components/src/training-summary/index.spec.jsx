import React from 'react';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { describe, expect, jest, test } from '@jest/globals';
import TrainingSummary from './';

jest.mock('../', () => ({
    Snippet: ({ children }) => <span>{children}</span>,
    Link: ({ label }) => <a href="#">{label}</a>,
    ApplyChanges: ({ children }) => <form>{children}</form>
}));

jest.mock('../link', () => ({
    getUrl: () => '/remove'
}));

const renderSummary = certificates => {
    const store = configureStore({
        reducer: { static: (state = {}) => state },
        preloadedState: { static: { isPdf: false } }
    });

    return render(
        <Provider store={store}>
            <TrainingSummary certificates={certificates} />
        </Provider>
    );
};

describe('<TrainingSummary />', () => {
    test('renders the date an exemption was added', () => {
        renderSummary([
            {
                id: 'exemption-1',
                isExemption: true,
                modules: ['PILA'],
                species: ['Mice'],
                exemptionReason: 'Previously trained abroad',
                createdAt: '2026-03-14T10:30:00.000Z'
            }
        ]);

        expect(screen.getByText('Previously trained abroad')).toBeInTheDocument();
        expect(screen.getByText('Added on:')).toBeInTheDocument();
        expect(screen.getByText('14 March 2026')).toBeInTheDocument();
    });

    test('renders a dash when an exemption has no created date', () => {
        renderSummary([
            {
                id: 'exemption-1',
                isExemption: true,
                modules: ['PILA'],
                species: [],
                exemptionReason: 'Legacy exemption'
            }
        ]);

        expect(screen.getByText('Added on:').nextSibling).toHaveTextContent('-');
    });

    test('does not render an added date for training certificates', () => {
        renderSummary([
            {
                id: 'cert-1',
                isExemption: false,
                modules: ['PILA'],
                species: ['Mice'],
                certificateNumber: 'ABC123',
                passDate: '2025-01-01',
                accreditingBody: 'RSPCA',
                createdAt: '2026-03-14T10:30:00.000Z'
            }
        ]);

        expect(screen.getByText('ABC123')).toBeInTheDocument();
        expect(screen.queryByText('Added on:')).not.toBeInTheDocument();
    });
});
