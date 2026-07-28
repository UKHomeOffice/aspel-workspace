import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describedByIds } from './aria-describedby';
import Input from './input';
import Select from './select';
import TextArea from './text-area';
import RadioGroup from './radio-group';
import CheckboxGroup from './checkbox-group';

describe('describedByIds', () => {
    test('includes hint and error ids when both present', () => {
        expect(describedByIds('foo', { hint: 'h', error: 'e' })).toBe('foo-hint foo-error');
    });
    test('includes only the parts that exist', () => {
        expect(describedByIds('foo', { hint: 'h' })).toBe('foo-hint');
        expect(describedByIds('foo', { error: 'e' })).toBe('foo-error');
    });
    test('returns null when there is nothing to describe', () => {
        expect(describedByIds('foo', {})).toBeNull();
    });
});

describe('field components wire aria-describedby (ASL-5081/5082)', () => {
    afterEach(() => cleanup());

    const options = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

    const cases = [
        ['Input (text)', props => <Input name="foo" label="Foo" {...props} />, c => c.querySelector('input')],
        ['Select', props => <Select name="foo" label="Foo" options={options} {...props} />, c => c.querySelector('select')],
        ['TextArea', props => <TextArea name="foo" label="Foo" {...props} />, c => c.querySelector('textarea')],
        ['RadioGroup', props => <RadioGroup name="foo" label="Foo" options={options} {...props} />, c => c.querySelector('fieldset')],
        ['CheckboxGroup', props => <CheckboxGroup name="foo" label="Foo" options={options} {...props} />, c => c.querySelector('fieldset')]
    ];

    cases.forEach(([label, renderEl, target]) => {
        describe(label, () => {
            test('points aria-describedby at the hint and error', () => {
                const { container } = render(renderEl({ hint: 'A hint', error: 'An error' }));
                expect(target(container).getAttribute('aria-describedby')).toBe('foo-hint foo-error');
            });

            test('describes only the hint when there is no error', () => {
                const { container } = render(renderEl({ hint: 'A hint' }));
                expect(target(container).getAttribute('aria-describedby')).toBe('foo-hint');
            });

            test('sets no aria-describedby when there is no hint or error', () => {
                const { container } = render(renderEl({}));
                expect(target(container).getAttribute('aria-describedby')).toBeNull();
            });
        });
    });
});
