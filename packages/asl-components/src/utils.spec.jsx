import React from 'react';
import { render, screen } from '@testing-library/react';
import { formatDate, DATE_FORMAT, applyFormatters } from './utils';

describe('formatDate', () => {
  test('formats a valid date', () => {
    expect(formatDate('2024-01-01', DATE_FORMAT.short)).toBe('1/1/2024');
  });

  test('returns "-" for empty dates', () => {
    expect(formatDate(null, DATE_FORMAT.short)).toBe('-');
    expect(formatDate(undefined, DATE_FORMAT.short)).toBe('-');
    expect(formatDate('', DATE_FORMAT.short)).toBe('-');
  });

  test('returns "Invalid date entered" for invalid dates', () => {
    expect(formatDate('not a date', DATE_FORMAT.short)).toBe('Invalid date entered');
    expect(formatDate('24-01-01', DATE_FORMAT.short)).toBe('Invalid date entered');
  });
});

describe('applyFormatters', () => {
  test('formats component props', () => {
    const ExampleComponent = (props) => {
      const { mapped, unchanged, added, formatted } = applyFormatters(props);

      return (
        <div>
          <div data-testid="mapped">{mapped}</div>
          <div data-testid="unchanged">{unchanged}</div>
          <div data-testid="added">{added}</div>
          <div data-testid="formatted">{formatted}</div>
        </div>
      );
    };

    const formatters = {
      example: {
        propMappers: {
          mapped: (value) => <p>{value.replace(/original/, 'mapped')}</p>,
          added: () => 'addedValue',
          formatted: (_, formatter) => <p>{formatter.renderContext.value}</p>,
        },
        renderContext: {
          value: 'contextualValue',
        },
      },
    };

    const props = {
      name: 'example',
      formatters,
      mapped: 'originalValue',
      unchanged: 'staticValue',
    };

    render(<ExampleComponent {...props} />);

    expect(screen.getByTestId('mapped').innerHTML).toEqual('<p>mappedValue</p>');
    expect(screen.getByTestId('unchanged').textContent).toEqual('staticValue');
    expect(screen.getByTestId('added').textContent).toEqual('addedValue');
    expect(screen.getByTestId('formatted').innerHTML).toEqual('<p>contextualValue</p>');
  });
});
