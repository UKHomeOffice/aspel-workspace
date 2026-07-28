import React from 'react';
import { render, cleanup } from '@testing-library/react';
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
                    incomplete: '{{dateLabel}} must include {{missingParts}}',
                    yearLength: 'Year must include 4 numbers',
                    realDate: '{{dateLabel}} must be a real date',
                    past: '{{dateLabel}} must be in the past',
                    future: '{{dateLabel}} must be in the future'
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
    });

    describe('GDS is the default even without a dateLabel', () => {
        test('uses the generic "The date" noun-phrase for validDate', () => {
            const { container } = renderWith({ name: 'issueDate', value: '2024--10', errorCode: 'validDate' });
            expect(container.textContent).toBe('The date must include a month');
        });

        test('GDS wins over a page\'s generic validDate message', () => {
            const { container } = renderWith({ name: 'issueDate', value: '2024-13-10', errorCode: 'validDate' });
            expect(container.textContent).toBe('The date must be a real date');
        });
    });

    describe('a page\'s bespoke required / constraint wording still wins', () => {
        test('keeps the page required message over GDS enter', () => {
            const { container } = renderWith({ name: 'issueDate', value: '--', errorCode: 'required' });
            expect(container.textContent).toBe('Enter the granted date');
        });

        test('keeps the page constraint message over GDS past', () => {
            const { container } = renderWith({
                name: 'issueDate', value: '2999-01-01', errorCode: 'dateIsBefore', validate: [{ dateIsBefore: 'now' }]
            });
            expect(container.textContent).toBe('Granted date cannot be in the future');
        });
    });

    test('falls back to the today-relative message for a non-formattable constraint (function param)', () => {
        // no bespoke message + a function param -> "must be in the past", not "before <blank>"
        const { container } = renderWith({
            name: 'passDate', value: '2999-01-01', errorCode: 'dateIsBefore', validate: [{ dateIsBefore: () => 'x' }]
        });
        expect(container.textContent).toBe('Award date must be in the past');
    });
});
