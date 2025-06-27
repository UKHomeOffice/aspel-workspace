import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ApplyChanges } from './';
import { jest, expect } from '@jest/globals';

describe('<ApplyChanges />', () => {
  afterEach(() => cleanup());

  describe('defaults', () => {
    test('renders a link with \'Submit\' label by default', () => {
      render(<ApplyChanges />);
      const link = screen.getByRole('link', { name: 'Submit' });
      expect(link).toBeInTheDocument();
      expect(screen.queryByRole('form')).not.toBeInTheDocument();
    });
  });

  describe('link', () => {
    test('adds the label passed as a prop', () => {
      const label = 'A Label';
      render(<ApplyChanges label={label} />);
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    });

    test('creates a stringified href from superfluous props', () => {
      const props = {
        query: {
          filters: {
            a: [1, 2, 3],
            b: [2, 3, 4]
          },
          sort: {
            ascending: true,
            column: 'test'
          }
        }
      };
      const expected = '?filters%5Ba%5D%5B0%5D=1&filters%5Ba%5D%5B1%5D=2&filters%5Ba%5D%5B2%5D=3&filters%5Bb%5D%5B0%5D=2&filters%5Bb%5D%5B1%5D=3&filters%5Bb%5D%5B2%5D=4&sort%5Bascending%5D=true&sort%5Bcolumn%5D=test';
      render(<ApplyChanges {...props} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', expected);
    });

    test('calls onApply and prevents default on link click', () => {
      const fn = jest.fn();

      render(<ApplyChanges onApply={fn} />);
      const link = screen.getByRole('link');

      // Create a synthetic event and spy on preventDefault
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'preventDefault', {
        value: jest.fn(),
        writable: true
      });

      link.dispatchEvent(event);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });


  });

  describe('form', () => {
    const id = 'apply-change-test';

    test('renders children', () => {
      const child = <div data-testid="child" />;
      render(<ApplyChanges type="form">{child}</ApplyChanges>);
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    test('accepts id', () => {
      render(<ApplyChanges type="form" id={id} />);
      const form = screen.getByTestId(id);
      expect(form).toHaveAttribute('id', id);
    });

    test('adds a hidden input with stringified superfluous props', () => {
      const props = {
        query: {
          filters: {
            a: [1, 2, 3],
            b: [2, 3, 4]
          },
          sort: {
            ascending: true,
            column: 'test'
          }
        }
      };
      const expected = 'filters%5Ba%5D%5B0%5D=1&filters%5Ba%5D%5B1%5D=2&filters%5Ba%5D%5B2%5D=3&filters%5Bb%5D%5B0%5D=2&filters%5Bb%5D%5B1%5D=3&filters%5Bb%5D%5B2%5D=4&sort%5Bascending%5D=true&sort%5Bcolumn%5D=test';
      render(<ApplyChanges type="form" {...props} />);
      const input = screen.getByDisplayValue(expected);
      expect(input).toHaveAttribute('type', 'hidden');
      expect(input).toHaveAttribute('name', 'props');
    });

    test('prevents default and calls onApply on submit', () => {
      const fn = jest.fn();
      const preventDefault = jest.spyOn(Event.prototype, 'preventDefault');

      render(<ApplyChanges type="form" id={id} onApply={fn} />);
      const form = screen.getByTestId(id);

      fireEvent.submit(form, { preventDefault });

      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledTimes(1);
      // Restore the spy, clean up.
      preventDefault.mockRestore();
    });
  });
});
