import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Snippet from './snippet';
import RadioGroup from './radio-group';
import CheckboxGroup from './checkbox-group';

describe('empty legend suppression (ASL-5054)', () => {
    afterEach(() => cleanup());

    const options = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

    // `blank` is a screen that deliberately empties the legend to avoid a duplicate
    // heading; `question` is an ordinary labelled group.
    const content = {
        fields: {
            blank: { label: '' },
            question: { label: 'Do you want to continue?' }
        }
    };

    const groups = [['RadioGroup', RadioGroup], ['CheckboxGroup', CheckboxGroup]];

    const renderWith = (Group, props) => {
        const store = configureStore({
            reducer: {
                static: (state = { content }) => state,
                model: (state = {}) => state,
                datatable: (state = {}) => state
            }
        });
        return render(
            <Provider store={store}>
                <Group name="foo" options={options} {...props} />
            </Provider>
        );
    };

    const snippet = name => <Snippet>{`fields.${name}.label`}</Snippet>;

    groups.forEach(([name, Group]) => {
        describe(name, () => {
            test('renders no legend when the label content is blank', () => {
                const { container } = renderWith(Group, { label: snippet('blank') });

                expect(container.querySelector('legend')).toBeNull();
                expect(container.querySelector('h2')).toBeNull();
            });

            test('renders the legend unchanged when the label has content', () => {
                const { container } = renderWith(Group, { label: snippet('question') });
                const heading = container.querySelector('legend > h2');

                expect(heading.textContent).toBe('Do you want to continue?');
                expect(heading.className).toBe('govuk-fieldset__heading govuk-heading-l');
            });

            test('leaves a plain string label to upstream', () => {
                const { container } = renderWith(Group, { label: 'Plain label' });

                expect(container.querySelector('legend > h2').textContent).toBe('Plain label');
            });

            test('keeps the fieldset described by its hint and error', () => {
                const { container } = renderWith(Group, {
                    label: snippet('blank'),
                    hint: 'A hint',
                    error: 'An error'
                });

                expect(container.querySelector('fieldset').getAttribute('aria-describedby'))
                    .toBe('foo-hint foo-error');
            });
        });
    });
});
