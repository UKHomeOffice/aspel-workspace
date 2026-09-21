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
                    todayOrPast: '{{dateLabel}} must be today or in the past',
                    todayOrFuture: '{{dateLabel}} must be today or in the future',
                    before: '{{dateLabel}} must be before {{date}}',
                    after: '{{dateLabel}} must be after {{date}}',
                    sameOrBefore: '{{dateLabel}} must be the same as or before {{date}}',
                    sameOrAfter: '{{dateLabel}} must be the same as or after {{date}}',
                    aspelDataStartDate: 'ASPeL data starts from 31/07/2019'
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

    describe('a field without a dateLabel (granted date)', () => {
        test('uses page-required wording over generic date enter', () => {
            const { container } = renderWith({ name: 'issueDate', value: '--', errorCode: 'required' });
            expect(container.textContent).toBe('Enter the granted date');
        });

        test('uses page constraint wording over generic date constraint', () => {
            const { container } = renderWith({
                name: 'issueDate',
                value: '2999-01-01',
                errorCode: 'dateIsBefore',
                validate: [{ dateIsBefore: 'now' }]
            });
            expect(container.textContent).toBe('Granted date cannot be in the future');
        });
    });

    describe('dateEnter literal fallback', () => {
        test('uses dateEnter when field-specific and generic date-enter keys are absent', () => {
            const dynamicContent = {
                fields: {
                    dynamicDate: { label: 'Dynamic date' }
                },
                errors: {
                    default: {
                        date: {
                            enterLiteral: '{{dateEnter}}'
                        }
                    }
                }
            };

            const { container } = renderWith(
                {
                    name: 'dynamicDate',
                    value: '--',
                    errorCode: 'required',
                    dateEnter: 'Enter the date AWERB approved'
                },
                dynamicContent
            );

            expect(container.textContent).toBe('Enter the date AWERB approved');
        });
    });

    describe('NTS download date wording', () => {
        const fromDateLabel = 'The \'From\' date';
        const toDateLabel = 'The \'To\' date';

        const ntsContent = {
            errors: {
                startDate: {
                    required: 'Enter a \'From\' date',
                    aspelDataStartDate: 'The \'From\' date must be the same as or after 31 July 2019, when ASPeL came into use'
                },
                endDate: {
                    required: 'Enter a \'To\' date',
                    aspelDataStartDate: 'The \'To\' date must be the same as or after 31 July 2019, when ASPeL came into use',
                    date: {
                        after: 'The \'To\' date must be the same as or after {{date}}, the \'From\' date'
                    }
                },
                default: content.errors.default
            }
        };

        test('renders the requested From date messages', () => {
            expect(renderWith({ name: 'startDate', value: '--', errorCode: 'required', dateLabel: fromDateLabel }, ntsContent).container.textContent)
                .toBe('Enter a \'From\' date');
            cleanup();

            expect(renderWith({ name: 'startDate', value: '2024--10', errorCode: 'validDate', dateLabel: fromDateLabel }, ntsContent).container.textContent)
                .toBe('The \'From\' date must include a month');
            cleanup();

            expect(renderWith({ name: 'startDate', value: '24-05-10', errorCode: 'validDate', dateLabel: fromDateLabel }, ntsContent).container.textContent)
                .toBe('Year must include 4 numbers');
            cleanup();

            expect(renderWith({ name: 'startDate', value: '2024-13-10', errorCode: 'validDate', dateLabel: fromDateLabel }, ntsContent).container.textContent)
                .toBe('The \'From\' date must be a real date');
            cleanup();

            expect(renderWith({ name: 'startDate', value: '2999-01-01', errorCode: 'dateIsSameOrBefore', validate: [{ dateIsSameOrBefore: 'now' }], dateLabel: fromDateLabel }, ntsContent).container.textContent)
                .toBe('The \'From\' date must be today or in the past');
            cleanup();

            expect(renderWith({ name: 'startDate', value: '2019-07-30', errorCode: 'aspelDataStartDate', dateLabel: fromDateLabel }, ntsContent).container.textContent)
                .toBe('The \'From\' date must be the same as or after 31 July 2019, when ASPeL came into use');
        });

        test('renders the requested To date messages', () => {
            expect(renderWith({ name: 'endDate', value: '--', errorCode: 'required', dateLabel: toDateLabel }, ntsContent).container.textContent)
                .toBe('Enter a \'To\' date');
            cleanup();

            expect(renderWith({ name: 'endDate', value: '2024--', errorCode: 'validDate', dateLabel: toDateLabel }, ntsContent).container.textContent)
                .toBe('The \'To\' date must include a day and month');
            cleanup();

            expect(renderWith({ name: 'endDate', value: '2999-01-01', errorCode: 'dateIsSameOrBefore', validate: [{ dateIsSameOrBefore: 'now' }], dateLabel: toDateLabel }, ntsContent).container.textContent)
                .toBe('The \'To\' date must be today or in the past');
            cleanup();

            expect(renderWith({ name: 'endDate', value: '2019-07-30', errorCode: 'aspelDataStartDate', dateLabel: toDateLabel }, ntsContent).container.textContent)
                .toBe('The \'To\' date must be the same as or after 31 July 2019, when ASPeL came into use');
            cleanup();

            expect(renderWith({ name: 'endDate', value: '2024-01-01', errorCode: 'dateIsAfter', validate: [{ dateIsAfter: '2024-02-01' }], dateLabel: toDateLabel }, ntsContent).container.textContent)
                .toBe('The \'To\' date must be the same as or after 1 February 2024, the \'From\' date');
        });
    });
});
