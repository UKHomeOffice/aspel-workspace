import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import DateErrorMessage from './error-message';

describe('<DateErrorMessage /> (GOV.UK date error messages)', () => {
    afterEach(() => cleanup());

    const content = {
        fields: {
            passDate: { label: 'Date awarded', dateLabel: 'Award date' },
            // `issueDate` has NO dateLabel and keeps bespoke required/constraint wording
            issueDate: { label: 'Granted date' }
        },
        errors: {
            passDate: {
                date: { enter: 'Enter the date the certificate was awarded' }
            },
            issueDate: {
                required: 'Enter the granted date',
                validDate: 'Enter a valid date', // generic - should be IGNORED in favour of GDS
                dateIsBefore: 'Granted date cannot be in the future'
            },
            default: {
                required: 'This field is required',
                date: {
                    enter: 'Enter the date',
                    enterLiteral: '{{dateEnter}}',
                    incomplete: '{{dateLabel}} must include {{missingParts}}',
                    yearLength: 'Year must include 4 numbers',
                    realDate: '{{dateLabel}} must be a real date',
                    past: '{{dateLabel}} must be in the past',
                    future: '{{dateLabel}} must be in the future',
                    aspelDataStartDate: 'Aspel data started from 31/07/2019'
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

    // `value` is the internal ISO-ish string the DateInput emits/stores
    // (`year-month-day`), NOT the British display order - so `2024--10` is
    // year 2024, month blank, day 10.

    describe('a field that has opted in with a dateLabel (certificate)', () => {
        test('uses the page override for "enter"', () => {
            const { container } = renderWith({ name: 'passDate', value: '--', errorCode: 'required' });
            expect(container.textContent).toBe('Enter the date the certificate was awarded');
        });

        test('names the missing part using the dateLabel', () => {
            const { container } = renderWith({ name: 'passDate', value: '2024--10', errorCode: 'validDate' });
            expect(container.textContent).toBe('Award date must include a month');
        });

        test('says the year must be four numbers', () => {
            const { container } = renderWith({ name: 'passDate', value: '24-05-10', errorCode: 'validDate' });
            expect(container.textContent).toBe('Year must include 4 numbers');
        });

        test('says a real date for an impossible date', () => {
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
