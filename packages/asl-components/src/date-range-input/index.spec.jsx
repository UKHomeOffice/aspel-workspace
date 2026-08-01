import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, jest, test } from '@jest/globals';
import DateRangeInput from './';

function MockDateErrorMessage(props) {
    return <span id={`${props.name}-error`}>error:{props.name}:{props.errorCode}</span>;
}

jest.mock('../date-input/error-message', () => MockDateErrorMessage);

describe('<DateRangeInput />', () => {
    afterEach(() => cleanup());

    test('renders a fieldset with date from and date to inputs', () => {
        render(<DateRangeInput legend="Filter by date granted" />);

        expect(screen.getByRole('heading', { name: 'Filter by date granted' })).toBeInTheDocument();
        expect(screen.getByRole('group', { name: 'Date from' })).toBeInTheDocument();
        expect(screen.getByRole('group', { name: 'Date to' })).toBeInTheDocument();
        expect(screen.getByLabelText('Day', { selector: '#date-from-day' })).toBeInTheDocument();
        expect(screen.getByLabelText('Month', { selector: '#date-to-month' })).toBeInTheDocument();
    });

    test('accepts schema-style label and dateRangeFields props', () => {
        render(
            <DateRangeInput
                label="Granted dates"
                name="granted"
                dateRangeFields={{
                    from: {
                        label: 'Granted from'
                    },
                    to: {
                        label: 'Granted to'
                    }
                }}
            />
        );

        expect(screen.getByRole('heading', { name: 'Granted dates' })).toBeInTheDocument();
        expect(screen.getByRole('group', { name: 'Granted from' })).toBeInTheDocument();
        expect(screen.getByRole('group', { name: 'Granted to' })).toBeInTheDocument();
        expect(screen.getByLabelText('Day', { selector: '#granted-from-day' })).toBeInTheDocument();
        expect(screen.getByLabelText('Month', { selector: '#granted-to-month' })).toBeInTheDocument();
    });

    test('uses GOV.UK-style hints for each date input', () => {
        render(<DateRangeInput />);

        expect(screen.getByText('For example 01 01 2020')).toBeInTheDocument();
        expect(screen.getByText('For example 12 12 2020')).toBeInTheDocument();
    });

    test('passes date errors through to each wrapped DateInput', () => {
        const { container } = render(
            <DateRangeInput
                values={{ 'date-from': '2024--10', 'date-to': '2024-02-31' }}
                errors={{ 'date-from': 'validDate', 'date-to': 'validDate' }}
            />
        );

        expect(screen.getByText('error:date-from:validDate')).toBeInTheDocument();
        expect(screen.getByText('error:date-to:validDate')).toBeInTheDocument();
        expect(container.querySelector('#date-from-month').classList).toContain('govuk-input--error');
        expect(container.querySelector('#date-to-day').classList).toContain('govuk-input--error');
    });

    test('shows an error when the from date is not before the to date', () => {
        render(
            <DateRangeInput
                values={{ 'date-from': '2024-02-01', 'date-to': '2024-01-01' }}
            />
        );

        expect(screen.getByText('error:date-from:dateIsBefore')).toBeInTheDocument();
    });

    test('shows an error when the from date is the same as the to date', () => {
        render(
            <DateRangeInput
                values={{ 'date-from': '2024-01-01', 'date-to': '2024-01-01' }}
            />
        );

        expect(screen.getByText('error:date-from:dateIsBefore')).toBeInTheDocument();
    });

    test('shows the range error on the to date when it is the date being changed', () => {
        render(
            <DateRangeInput
                values={{ 'date-from': '2024-02-01', 'date-to': '2024-03-01' }}
            />
        );

        fireEvent.change(screen.getByLabelText('Month', { selector: '#date-to-month' }), { target: { value: '01' } });

        expect(screen.getByText('error:date-to:dateIsAfter')).toBeInTheDocument();
        expect(screen.queryByText('error:date-from:dateIsBefore')).not.toBeInTheDocument();
    });

    test('shows the range error on the from date when it is the date being changed', () => {
        render(
            <DateRangeInput
                values={{ 'date-from': '2024-01-01', 'date-to': '2024-03-01' }}
            />
        );

        fireEvent.change(screen.getByLabelText('Month', { selector: '#date-from-month' }), { target: { value: '04' } });

        expect(screen.getByText('error:date-from:dateIsBefore')).toBeInTheDocument();
        expect(screen.queryByText('error:date-to:dateIsAfter')).not.toBeInTheDocument();
    });

    test('does not show a range error while either date is invalid', () => {
        render(
            <DateRangeInput
                values={{ 'date-from': '2024--01', 'date-to': '2024-01-01' }}
            />
        );

        expect(screen.queryByText('error:date-from:dateIsBefore')).not.toBeInTheDocument();
    });

    test('emits updated range values when a date part changes', () => {
        const onChange = jest.fn();
        render(<DateRangeInput values={{ 'date-from': '2020-01-01' }} onChange={onChange} />);

        fireEvent.change(screen.getByLabelText('Day', { selector: '#date-from-day' }), { target: { value: '02' } });

        expect(onChange).toHaveBeenCalledWith({ 'date-from': '2020-01-02' });
    });

    test('submits the current range using the provided handler', () => {
        const onSubmit = jest.fn();
        render(<DateRangeInput values={{ 'date-from': '2020-01-01' }} onSubmit={onSubmit} />);

        fireEvent.click(screen.getByRole('button', { name: 'Apply filter' }));

        expect(onSubmit).toHaveBeenCalledWith({ 'date-from': '2020-01-01' });
    });

    test('uses secondary button styling for the filter action', () => {
        render(<DateRangeInput />);

        expect(screen.getByRole('button', { name: 'Apply filter' }).classList).toContain('button-secondary');
    });

    test('can render without a form wrapper', () => {
        const { container } = render(<DateRangeInput asForm={false} />);

        expect(container.querySelector('form')).toBeNull();
        expect(screen.getByRole('button', { name: 'Apply filter' })).toBeInTheDocument();
    });
});