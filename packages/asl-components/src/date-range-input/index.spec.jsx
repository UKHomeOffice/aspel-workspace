import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, jest, test } from '@jest/globals';
import DateRangeInput from './';

function MockDateErrorMessage(props) {
    return <span id={`${props.name}-error`}>error:{props.name}:{props.errorCode}</span>;
}

jest.mock('../date-input/error-message', () => MockDateErrorMessage);

describe('<DateRangeInput />', () => {
    afterEach(() => {
        cleanup();
    });

    test('renders a fieldset with date from and date to inputs', () => {
        render(<DateRangeInput label="Filter by date granted" />);

        expect(screen.getByRole('heading', { name: 'Filter by date granted' })).toBeInTheDocument();
        expect(screen.getByRole('group', { name: 'Date from' })).toBeInTheDocument();
        expect(screen.getByRole('group', { name: 'Date to' })).toBeInTheDocument();
        expect(screen.getByLabelText('Day', { selector: '#date-from-day' })).toBeInTheDocument();
        expect(screen.getByLabelText('Month', { selector: '#date-to-month' })).toBeInTheDocument();
    });

    test('accepts a label prop', () => {
        render(
            <DateRangeInput
                label="Granted dates"
            />
        );

        expect(screen.getByRole('heading', { name: 'Granted dates' })).toBeInTheDocument();
        expect(screen.getByRole('group', { name: 'Date from' })).toBeInTheDocument();
        expect(screen.getByRole('group', { name: 'Date to' })).toBeInTheDocument();
        expect(screen.getByLabelText('Day', { selector: '#date-from-day' })).toBeInTheDocument();
        expect(screen.getByLabelText('Month', { selector: '#date-to-month' })).toBeInTheDocument();
    });

    test('uses GOV.UK-style hints for each date input', () => {
        render(<DateRangeInput />);

        expect(screen.getByText('For example 1 6 2026')).toBeInTheDocument();
        expect(screen.getByText('For example 30 6 2026')).toBeInTheDocument();
    });

    test('renders the date range hint with GOV.UK hint styling', () => {
        render(<DateRangeInput hint="You can only download data" />);

        expect(screen.getByText('You can only download data').closest('.govuk-hint')).not.toBeNull();
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

    test('only displays validation errors supplied by the server', () => {
        render(
            <DateRangeInput
                values={{ 'date-from': '2024-02-01', 'date-to': '2024-01-01' }}
                errors={{ 'date-to': 'maximumDateRange' }}
            />
        );

        expect(screen.getByText('error:date-to:maximumDateRange')).toBeInTheDocument();
        expect(screen.queryByText('error:date-to:dateIsAfter')).not.toBeInTheDocument();
        expect(screen.queryByText('error:date-from:dateIsBefore')).not.toBeInTheDocument();
    });

    test('emits updated range values when a date part changes', () => {
        const onChange = jest.fn();
        render(<DateRangeInput values={{ 'date-from': '2020-01-01' }} onChange={onChange} />);

        fireEvent.change(screen.getByLabelText('Day', { selector: '#date-from-day' }), { target: { value: '02' } });

        expect(onChange).toHaveBeenCalledWith({ 'date-from': '2020-01-02' });
    });

    test('merges range updates against the latest state', () => {
        const onChange = jest.fn();
        render(<DateRangeInput values={{ 'date-from': '2020-01-01', 'date-to': '2020-02-01' }} onChange={onChange} />);

        fireEvent.change(screen.getByLabelText('Day', { selector: '#date-from-day' }), { target: { value: '02' } });
        fireEvent.change(screen.getByLabelText('Day', { selector: '#date-to-day' }), { target: { value: '03' } });

        expect(onChange).toHaveBeenLastCalledWith({ 'date-from': '2020-01-02', 'date-to': '2020-02-03' });
    });

    test('does not reset the current range on rerender when values is omitted', () => {
        const onChange = jest.fn();
        const { rerender } = render(<DateRangeInput onChange={onChange} />);

        fireEvent.change(screen.getByLabelText('Day', { selector: '#date-from-day' }), { target: { value: '02' } });
        fireEvent.change(screen.getByLabelText('Month', { selector: '#date-from-month' }), { target: { value: '01' } });
        fireEvent.change(screen.getByLabelText('Year', { selector: '#date-from-year' }), { target: { value: '2020' } });
        rerender(<DateRangeInput onChange={onChange} />);

        expect(onChange).toHaveBeenLastCalledWith({ 'date-from': '2020-01-02' });
    });

    test('does not reset the current range when a new values object is provided', () => {
        const onChange = jest.fn();
        const { rerender } = render(
            <DateRangeInput values={{ 'date-from': '2020-01-01' }} onChange={onChange} />
        );

        fireEvent.change(screen.getByLabelText('Day', { selector: '#date-from-day' }), { target: { value: '02' } });
        rerender(
            <DateRangeInput values={{ 'date-from': '2020-01-01' }} onChange={onChange} />
        );

        fireEvent.change(screen.getByLabelText('Day', { selector: '#date-from-day' }), { target: { value: '03' } });

        expect(onChange).toHaveBeenLastCalledWith({ 'date-from': '2020-01-03' });
    });

    test('does not emit changes when only the onChange callback identity changes', () => {
        const onChange = jest.fn();
        const nextOnChange = jest.fn();
        const { rerender } = render(
            <DateRangeInput values={{ 'date-from': '2020-01-01' }} onChange={onChange} />
        );

        rerender(
            <DateRangeInput values={{ 'date-from': '2020-01-01' }} onChange={nextOnChange} />
        );

        expect(onChange).not.toHaveBeenCalled();
        expect(nextOnChange).not.toHaveBeenCalled();
    });

    test('resets the current range when the component remounts with new values', () => {
        const onChange = jest.fn();
        const { rerender } = render(
            <DateRangeInput key="initial" values={{ 'date-from': '2020-01-01' }} onChange={onChange} />
        );

        fireEvent.change(screen.getByLabelText('Day', { selector: '#date-from-day' }), { target: { value: '02' } });
        rerender(
            <DateRangeInput key="reset" values={{ 'date-from': '2020-01-10' }} onChange={onChange} />
        );

        fireEvent.change(screen.getByLabelText('Day', { selector: '#date-from-day' }), { target: { value: '11' } });

        expect(onChange).toHaveBeenLastCalledWith({ 'date-from': '2020-01-11' });
    });
});