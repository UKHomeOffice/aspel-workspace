import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import ErrorSummary from './';

describe('<ErrorSummary />', () => {
    afterEach(() => {
        cleanup();
    });

    const content = {
        fields: {
            passDate: { label: 'Date awarded', dateLabel: 'Award date' }
        },
        errors: {
            heading: 'There is a problem',
            headingPlural: 'There are problems',
            default: {
                required: 'Enter a value',
                validDate: 'Enter a valid date',
                date: {
                    incomplete: '{{dateLabel}} must include {{missingParts}}'
                }
            }
        }
    };

    const createStore = ({ errors = {}, schema = {}, model = {} }) =>
        configureStore({
            reducer: {
                static: (state = { errors, schema, content }) => state,
                model: (state = model) => state,
                datatable: (state = {}) => state
            }
        });

    const renderWithStore = (storeState) => {
        const store = createStore(storeState);
        return render(
            <Provider store={store}>
                <ErrorSummary />
            </Provider>
        );
    };

    test('renders nothing when there are no errors', () => {
        const { container } = renderWithStore({ errors: {} });
        expect(container.querySelector('.govuk-error-summary')).toBeNull();
    });

    test('links a non-date field directly to its field name', () => {
        renderWithStore({
            errors: { title: 'required' },
            schema: { title: { inputType: 'inputText' } }
        });
        expect(screen.getByRole('link', { name: 'Enter a value' })).toHaveAttribute('href', '#title');
    });

    test('links a date field to its first input (Day) so focus lands inside the fieldset', () => {
        renderWithStore({
            errors: { dob: 'required' },
            schema: { dob: { inputType: 'inputDate' } }
        });
        expect(screen.getByRole('link', { name: 'Enter a value' })).toHaveAttribute('href', '#dob-day');
    });

    test('links a date field to the first invalid part and names it in the message', () => {
        renderWithStore({
            errors: { passDate: 'validDate' },
            schema: { passDate: { inputType: 'inputDate' } },
            model: { passDate: '2024--10' } // month missing
        });
        const link = screen.getByRole('link', { name: 'Award date must include a month' });
        expect(link).toHaveAttribute('href', '#passDate-month');
    });

    test('links a radio/checkbox field to its first option input', () => {
        renderWithStore({
            errors: { confirm: 'required' },
            schema: {
                confirm: {
                    inputType: 'radioGroup',
                    options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
                }
            }
        });
        // matches react-components optionId for value "yes": `${name}-yes-<charcodes>`
        expect(screen.getByRole('link', { name: 'Enter a value' }))
            .toHaveAttribute('href', '#confirm-yes-121101115');
    });

    test('finds date fields nested inside reveals', () => {
        renderWithStore({
            errors: { courseDate: 'required' },
            schema: {
                courseDuration: {
                    inputType: 'radioGroup',
                    options: [
                        {
                            value: 'one-day',
                            reveal: {
                                courseDate: { inputType: 'inputDate' }
                            }
                        }
                    ]
                }
            }
        });
        expect(screen.getByRole('link', { name: 'Enter a value' })).toHaveAttribute('href', '#courseDate-day');
    });
});
