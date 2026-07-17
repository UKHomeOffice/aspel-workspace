import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import DateInput from './';

describe('<DateInput />', () => {
    afterEach(() => {
        cleanup();
    });

    const renderInput = props =>
        render(<DateInput name="passDate" label="Date awarded" onChange={() => {}} {...props} />);

    test('renders the day, month and year inputs keyed off the field name', () => {
        const { container } = renderInput();
        ['day', 'month', 'year'].forEach(part => {
            expect(container.querySelector(`#passDate-${part}`)).not.toBeNull();
            expect(container.querySelector(`[name="passDate-${part}"]`)).not.toBeNull();
        });
    });

    test('gives the fieldset an id matching the field name', () => {
        const { container } = renderInput();
        expect(container.querySelector('fieldset').id).toBe('passDate');
    });

    test('associates only the hint when there is no error', () => {
        const { container } = renderInput({ hint: 'For example, 20/8/2020.' });
        expect(container.querySelector('fieldset').getAttribute('aria-describedby')).toBe('passDate-hint');
    });

    test('associates both the hint and the error via aria-describedby', () => {
        const { container } = renderInput({
            hint: 'For example, 20/8/2020.',
            error: 'Date awarded must be a valid date'
        });
        const describedBy = container.querySelector('fieldset').getAttribute('aria-describedby');
        expect(describedBy).toBe('passDate-hint passDate-error');
        expect(container.querySelector('#passDate-error')).not.toBeNull();
    });

    test('applies the error modifier class to the form group when in error', () => {
        const { container } = renderInput({ error: 'Date awarded must be a valid date' });
        expect(container.querySelector('.govuk-form-group--error')).not.toBeNull();
    });

    test('highlights only the individually-invalid part', () => {
        // 10/00/2024 - only the month is out of range
        const { container } = renderInput({
            value: '2024-00-10',
            error: 'Date awarded must be a valid date'
        });
        expect(container.querySelector('#passDate-month').classList).toContain('govuk-input--error');
        expect(container.querySelector('#passDate-day').classList).not.toContain('govuk-input--error');
        expect(container.querySelector('#passDate-year').classList).not.toContain('govuk-input--error');
    });

    test('highlights all inputs when no single part can be blamed', () => {
        // 31/02/2024 - each part is individually in range but the date is invalid
        const { container } = renderInput({
            value: '2024-02-31',
            error: 'Date awarded must be a valid date'
        });
        ['day', 'month', 'year'].forEach(part => {
            expect(container.querySelector(`#passDate-${part}`).classList).toContain('govuk-input--error');
        });
    });

    test('does not highlight inputs when there is no error', () => {
        const { container } = renderInput({ value: '2024-05-10' });
        ['day', 'month', 'year'].forEach(part => {
            expect(container.querySelector(`#passDate-${part}`).classList).not.toContain('govuk-input--error');
        });
    });

    test('emits an ISO yyyy-mm-dd value when parts change', () => {
        const onChange = jest.fn();
        const { container } = render(
            <DateInput name="passDate" label="Date awarded" value="2020-08-20" onChange={onChange} />
        );

        fireEvent.change(container.querySelector('#passDate-day'), { target: { value: '21' } });

        expect(onChange).toHaveBeenCalledWith('2020-08-21');
    });
});
