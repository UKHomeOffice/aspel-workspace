import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { Snippet } from './';
import { expect, jest } from '@jest/globals';

const content = {
  string: 'one line',
  list: `* one
* two
* three`,
  paragraphs: `one

two`,
  nested: {
    string: 'nested string',
    template: 'Hello {{ name }}'
  },
  plural: {
    $pluralisation: {
      countKey: 'pagination.count',
      0: 'No results',
      1: 'One result',
      default: '{{ pagination.count }} results',
    }
  }
};

describe('<Snippet />', () => {
  afterEach(() => {
    cleanup();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('does not include a wrapping element on single line input', () => {
    render(<Snippet content={content}>string</Snippet>);
    expect(screen.queryByText('one line')).toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  test('includes wrapping elements on list inputs', () => {
    render(<Snippet content={content}>list</Snippet>);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
    expect(screen.getByText('three')).toBeInTheDocument();
  });

  test('includes wrapping elements on multi-line paragraph inputs', () => {
    render(<Snippet content={content}>paragraphs</Snippet>);
    const paragraphs = screen.getAllByText(/one|two/);
    expect(paragraphs.length).toBe(2);
  });

  test('will inject props as template variables', () => {
    render(<Snippet content={content} name="world">nested.template</Snippet>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  test('can accept single fallback', () => {
    render(<Snippet content={content} fallback="paragraphs">non.existent</Snippet>);
    const paragraphs = screen.getAllByText(/one|two/);
    expect(paragraphs.length).toBe(2);
  });

  test('can accept multiple fallbacks', () => {
    render(<Snippet content={content} fallback={['non.existent.2', 'paragraphs', 'list']}>non.existent</Snippet>);
    const paragraphs = screen.getAllByText(/one|two/);
    expect(paragraphs.length).toBe(2);
  });

  test('will error if no fallback matches content', () => {
    expect(() =>
      render(<Snippet content={content} fallback={['non.existent.2', 'missing']}>non.existent</Snippet>)
    ).toThrow('Failed to lookup content snippet. Tried keys: ["non.existent","non.existent.2","missing"]');

  });

  test('will return null if no content matches and the snippet is optional', () => {
    const { container } = render(
      <Snippet content={content} fallback={['non.existent.2', 'missing']} optional>non.existent</Snippet>
    );
    expect(container.firstChild).toBeNull();
  });

  test('errors if content at the specified key is not a string', () => {
    expect(() =>
      render(<Snippet content={content}>nested</Snippet>)
    ).toThrow('Failed to lookup content snippet. Tried keys: ["nested"]');
  });

  test('renders a fallback if content at the specified key is not a string', () => {
    render(<Snippet content={content} fallback="nested.string">nested</Snippet>);
    expect(screen.getByText('nested string')).toBeInTheDocument();
  });

  describe('renders plural values', () => {
    const contextForCount = (count) => ({
      pagination: {
        count
      }
    });

    test('renders a singular value', () => {
      render(<Snippet content={content} {...contextForCount(1)}>plural</Snippet>);
      expect(screen.getByText('One result')).toBeInTheDocument();
    });

    test('renders a plural value', () => {
      render(<Snippet content={content} {...contextForCount(3)}>plural</Snippet>);
      expect(screen.getByText('3 results')).toBeInTheDocument();
    });

    test('renders a zero value', () => {
      render(<Snippet content={content} {...contextForCount(0)}>plural</Snippet>);
      expect(screen.getByText('No results')).toBeInTheDocument();
    });
  })
});
