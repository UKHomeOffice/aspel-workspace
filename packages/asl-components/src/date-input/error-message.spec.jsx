import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import DateErrorMessage from './error-message';

describe('<DateErrorMessage /> (GOV.UK date error messages)', () => {
    afterEach(() => cleanup());

    const content = {
        fields: {
            passDate: { label: 'Date awarded', dateLabel: 'Award date' }
        },
        errors: {
            passDate: {
                date: { enter: 'Enter the date the certificate was awarded' }
            },
            default: {
                date: {
                    enter: 'Enter {{dateLabel}}',
                    incomplete: '{{dateLabel}} must include {{missingParts}}',
                    yearLength: 'Year must include 4 numbers',
                    realDate: '{{dateLabel}} must be a real date',
                    past: '{{dateLabel}} must be in the past'
                }
            }
        }
    };

    const renderWith = (props, contentOverride = content) => {
        const store = configureStore({
            reducer: {
                static: (state = { content: contentOverride }) => state,
                model: (state = {}) => state,
                datatable: (state = {}) => state
            }
        });
        return render(
            <Provider store={store}>
                <DateErrorMessage {...props} />
            </Provider>
        );
    };

    test('uses the page override for "enter"', () => {
        const { container } = renderWith({ name: 'passDate', value: '--', errorCode: 'required' });
        expect(container.textContent).toBe('Enter the date the certificate was awarded');
    });

    // `value` is the internal ISO-ish string the DateInput emits/stores
    // (`year-month-day`), NOT the British display order. splitDateValue reads it
    // as year, month, day - so `2024--10` is year 2024, month blank, day 10.
    test('names the missing part using the field dateLabel', () => {
        const { container } = renderWith({ name: 'passDate', value: '2024--10', errorCode: 'validDate' });
        expect(container.textContent).toBe('Award date must include a month');
    });

    test('says the year must be four numbers', () => {
        const { container } = renderWith({ name: 'passDate', value: '24-05-10', errorCode: 'validDate' });
        expect(container.textContent).toBe('Year must include 4 numbers');
    });

    test('says a real date for an impossible date', () => {
        // year 2024, month 13 (impossible), day 10
        const { container } = renderWith({ name: 'passDate', value: '2024-13-10', errorCode: 'validDate' });
        expect(container.textContent).toBe('Award date must be a real date');
    });

    test('maps dateIsBefore now to "in the past"', () => {
        const { container } = renderWith({
            name: 'passDate', value: '2999-01-01', errorCode: 'dateIsBefore', validate: [{ dateIsBefore: 'now' }]
        });
        expect(container.textContent).toBe('Award date must be in the past');
    });

    test('falls back to the generic error when the label is not a plain string', () => {
        const noLabel = {
            fields: { passDate: {} },
            errors: { passDate: { validDate: 'Enter a valid date' }, default: { validDate: 'x' } }
        };
        const { container } = renderWith(
            { name: 'passDate', value: '2024-13-10', errorCode: 'validDate' },
            noLabel
        );
        expect(container.textContent).toBe('Enter a valid date');
    });
});
