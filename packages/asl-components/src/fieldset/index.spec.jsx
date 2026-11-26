import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Fieldset from './index';

describe('<Fieldset />', () => {
    const store = configureStore({
        reducer: {
            static: (state = {
                content: {
                    errors: {
                        dateRange: {
                            dateIsAfter: 'End date must be after {{date}}'
                        }
                    }
                }
            }) => state
        }
    });

    const renderFieldset = (schema, props = {}) => render(
        <Provider store={store}>
            <Fieldset
                schema={schema}
                model={{ species: [] }}
                {...props}
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

    test('does not show the date range submit button', () => {
        renderFieldset({
            date: {
                inputType: 'inputDateRange',
                label: 'Date range'
            }
        });

        expect(screen.queryByRole('button', { name: 'Apply filter' })).not.toBeInTheDocument();
    });

    test('passes formatter context to inline date range errors', () => {
        renderFieldset(
            { dateRange: { inputType: 'inputDateRange', label: 'Date range' } },
            {
                errors: { dateRange: 'dateIsAfter' },
                formatters: { dateRange: { renderContext: { date: '1 May 2025' } } }
            }
        );

        expect(screen.getByText('End date must be after 1 May 2025')).toBeInTheDocument();
    });
});
