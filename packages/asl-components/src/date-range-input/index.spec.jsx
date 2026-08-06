import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import DateRangeInput from './';

function MockDateErrorMessage(props) {
    return <span id={`${props.name}-error`}>error:{props.name}:{props.errorCode}</span>;
}

jest.mock('../date-input/error-message', () => MockDateErrorMessage);

describe('<DateRangeInput />', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-05-29T12:00:00Z'));
    });

    afterEach(() => {
        cleanup();
        jest.useRealTimers();
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

    test('does not show an error when the from date is the same as the to date', () => {
        render(
            <DateRangeInput
                values={{ 'date-from': '2024-01-01', 'date-to': '2024-01-01' }}
            />
        );

        expect(screen.queryByText('error:date-from:dateIsBefore')).not.toBeInTheDocument();
        expect(screen.queryByText('error:date-to:dateIsAfter')).not.toBeInTheDocument();
    });

    test('shows an error when either date is in the future', () => {
        render(
            <DateRangeInput
                values={{ 'date-from': '2024-05-30', 'date-to': '2024-05-30' }}
            />
        );

        expect(screen.getByText('error:date-from:dateIsSameOrBefore')).toBeInTheDocument();
        expect(screen.getByText('error:date-to:dateIsSameOrBefore')).toBeInTheDocument();
    });

    test('allows either date to be today', () => {
        render(
            <DateRangeInput
                values={{ 'date-from': '2024-05-29', 'date-to': '2024-05-29' }}
            />
        );

        expect(screen.queryByText('error:date-from:dateIsSameOrBefore')).not.toBeInTheDocument();
        expect(screen.queryByText('error:date-to:dateIsSameOrBefore')).not.toBeInTheDocument();
    });

    test('shows an error when date from is before ASPEL data started', () => {
        render(
            <DateRangeInput
                values={{ 'date-from': '2019-07-30', 'date-to': '2019-07-31' }}
            />
        );

        expect(screen.getByText('error:date-from:aspelDataStartDate')).toBeInTheDocument();
    });

    test('allows date from to be the day ASPEL data started', () => {
        render(
            <DateRangeInput
                values={{ 'date-from': '2019-07-31', 'date-to': '2019-07-31' }}
            />
        );

        expect(screen.queryByText('error:date-from:aspelDataStartDate')).not.toBeInTheDocument();
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

    test('does not show a range error while the other date has a future-date boundary error', () => {
        render(
            <DateRangeInput
                values={{ 'date-from': '2024-06-20', 'date-to': '2024-06-21' }}
            />
        );

        fireEvent.change(screen.getByLabelText('Month', { selector: '#date-to-month' }), { target: { value: '05' } });

        expect(screen.getByText('error:date-from:dateIsSameOrBefore')).toBeInTheDocument();
        expect(screen.queryByText('error:date-to:dateIsAfter')).not.toBeInTheDocument();
    });

    test('does not show a range error while date from has an ASPEL-start boundary error', () => {
        render(
            <DateRangeInput
                values={{ 'date-from': '2019-08-01', 'date-to': '2019-08-10' }}
            />
        );

        fireEvent.change(screen.getByLabelText('Month', { selector: '#date-from-month' }), { target: { value: '07' } });

        expect(screen.getByText('error:date-from:aspelDataStartDate')).toBeInTheDocument();
        expect(screen.queryByText('error:date-from:dateIsBefore')).not.toBeInTheDocument();
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