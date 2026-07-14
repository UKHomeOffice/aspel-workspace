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
        errors: {
            heading: 'There is a problem',
            headingPlural: 'There are problems',
            default: {
                required: 'Enter a value'
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

    test('links a date field to the first invalid part (e.g. the month)', () => {
        renderWithStore({
            errors: { passDate: 'required' },
            schema: { passDate: { inputType: 'inputDate' } },
            model: { passDate: '2024-00-10' } // only the month is out of range
        });
        expect(screen.getByRole('link', { name: 'Enter a value' })).toHaveAttribute('href', '#passDate-month');
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
