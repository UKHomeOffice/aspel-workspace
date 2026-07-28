import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { RadioGroup, CheckboxGroup } from '@ukhomeoffice/react-components';
import { firstOptionHref, optionId } from './first-option-id';

describe('firstOptionHref', () => {
    afterEach(() => cleanup());

    test('targets the first option of a group', () => {
        const field = { options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] };
        expect(firstOptionHref('confirm', field)).toBe(`#${optionId('confirm', field.options[0])}`);
    });

    test('honours an explicit option id', () => {
        const field = { options: [{ value: 'yes', label: 'Yes', id: 'custom-id' }] };
        expect(firstOptionHref('confirm', field)).toBe('#custom-id');
    });

    test('handles string options', () => {
        expect(firstOptionHref('species', { options: ['Mouse', 'Rat'] })).toBe(`#${optionId('species', 'Mouse')}`);
    });

    test('falls back to the field name when there are no options', () => {
        expect(firstOptionHref('confirm', { options: [] })).toBe('#confirm');
        expect(firstOptionHref('confirm', {})).toBe('#confirm');
    });

    // DRIFT GUARD: our id must match what react-components actually renders. If
    // upstream changes its optionId algorithm this fails loudly instead of the
    // summary link silently focusing nothing.
    describe('matches the real rendered option id', () => {
        const options = [{ value: 'Yes, I confirm!', label: 'Yes' }, { value: 'No', label: 'No' }];

        test('RadioGroup', () => {
            const { container } = render(
                <RadioGroup name="confirm" label="Confirm" options={options} value="" />
            );
            const firstInputId = container.querySelector('input').id;
            expect(firstOptionHref('confirm', { options })).toBe(`#${firstInputId}`);
        });

        test('CheckboxGroup', () => {
            const { container } = render(
                <CheckboxGroup name="confirm" label="Confirm" options={options} value={[]} />
            );
            const firstInputId = container.querySelector('input').id;
            expect(firstOptionHref('confirm', { options })).toBe(`#${firstInputId}`);
        });
    });
});
