import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import DateErrorMessage from './error-message';

describe('<DateErrorMessage />', () => {
    afterEach(() => cleanup());

    const content = {
        fields: { passDate: { label: 'Date awarded' } },
        errors: {
            passDate: { validDate: 'Date awarded must be a valid date' },
            default: {
                validDate: 'Enter a valid date',
                validDatePart: '{{fieldLabel}} must be a valid {{datePart}}'
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
                <DateErrorMessage errorCode="validDate" {...props} />
            </Provider>
        );
    };

    test('names the single invalid part', () => {
        const { container } = renderWith({ name: 'passDate', value: '2024-00-10' });
        expect(container.textContent).toBe('Date awarded must be a valid month');
    });

    test('names the day when only the day is invalid', () => {
        const { container } = renderWith({ name: 'passDate', value: '2024-05-32' });
        expect(container.textContent).toBe('Date awarded must be a valid day');
    });

    test('falls back to the general message when several parts are invalid', () => {
        const { container } = renderWith({ name: 'passDate', value: '--' });
        expect(container.textContent).toBe('Date awarded must be a valid date');
    });

    test('falls back to the general message for a whole-date error with valid parts (e.g. 31/02)', () => {
        const { container } = renderWith({ name: 'passDate', value: '2024-02-31' });
        expect(container.textContent).toBe('Date awarded must be a valid date');
    });

    test('falls back to the general message when the label is not a plain string', () => {
        const noLabel = {
            ...content,
            fields: { passDate: {} }
        };
        const { container } = renderWith({ name: 'passDate', value: '2024-00-10' }, noLabel);
        expect(container.textContent).toBe('Date awarded must be a valid date');
    });
});
