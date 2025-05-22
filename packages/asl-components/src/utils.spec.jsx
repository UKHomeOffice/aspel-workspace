const { formatDate, DATE_FORMAT, applyFormatters } = require('./utils');
const { render } = require('enzyme');
const React = require('react');
const { expect } = require('@jest/globals');

describe('formatDate', () => {
    test('formats a valid date', () => {
        expect(formatDate('2024-01-01', DATE_FORMAT.short)).toBe('1/1/2024');
    });

    test('returns "-" for empty dates', () => {
        expect(formatDate(null, DATE_FORMAT.short)).toBe('-');
        expect(formatDate(undefined, DATE_FORMAT.short)).toBe('-');
        expect(formatDate('', DATE_FORMAT.short)).toBe('-');
    });

    test('returns "Invalid date entered" for invlaid dates', () => {
        expect(formatDate('not a date', DATE_FORMAT.short)).toBe('Invalid date entered');
        expect(formatDate('24-01-01', DATE_FORMAT.short)).toBe('Invalid date entered');
    });
});

describe('applyFormatters', () => {
    test('formats component props', () => {
        const ExampleComponent = (props) => {
            const {mapped, unchanged, added, formatted} =
              applyFormatters(props);

            return <div>
                <div data-test-id='mapped'>{mapped}</div>
                <div data-test-id='unchanged'>{unchanged}</div>
                <div data-test-id='added'>{added}</div>
                <div data-test-id='formatted'>{formatted}</div>
            </div>
        };

        const formatters = {
            example: {
                propMappers: {
                    mapped: (value) => <p>{value.replace(/original/, 'mapped')}</p>,
                    added: () => 'addedValue',
                    formatted: (_, formatter) => <p>{formatter.renderContext.value}</p>
                },
                renderContext: {
                    value: 'contextualValue',
                }
            }
        }

        const props = {
            name: 'example',
            formatters,
            mapped: 'originalValue',
            unchanged: 'staticValue'
        }

        const wrapper = render(<ExampleComponent {...props} />);

        expect(wrapper.find('div > div[data-test-id=mapped]').html())
          .toEqual('<p>mappedValue</p>');

        expect(wrapper.find('div > div[data-test-id=unchanged]').html())
          .toEqual('staticValue');

        expect(wrapper.find('div > div[data-test-id=added]').html())
          .toEqual('addedValue');

        expect(wrapper.find('div > div[data-test-id=formatted]').html())
          .toEqual('<p>contextualValue</p>');
    })
})
