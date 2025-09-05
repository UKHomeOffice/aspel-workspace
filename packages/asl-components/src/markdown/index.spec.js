import React from 'react';
import { render } from '@testing-library/react';
import Markdown from '../markdown';
import { expect } from '@jest/globals';

describe('Markdown with unwrap single line', () => {
  it('renders a single line as a span', async () => {
    const { container } =  render(
      <Markdown unwrapSingleLine>
        {`This is a single line.`}
      </Markdown>
    );

    expect(container.children.length).toBe(1)
    expect(container.firstChild.tagName).toBe('SPAN');
  })

  it('renders a multiple lines as paragraphs', async () => {
    const { container } =  render(
      <Markdown unwrapSingleLine>
        {
`This is the first line.

This is the second.`
        }
      </Markdown>
    );

    expect(container.children.length).toBe(2)
    expect(container.firstChild.tagName).toBe('P');
  })

  it('renders multiple inline elements as a span', async () => {
    const { container } =  render(
      <Markdown unwrapSingleLine>
        {`A ==line== *with* inline <i>formatting</i>`}
      </Markdown>
    );

    expect(container.children.length).toBe(1)
    expect(container.firstChild.tagName).toBe('SPAN');
  })

  it('with significant line breaks, it renders a multiline string as a paragraph', async () => {
    const { container } =  render(
      <Markdown unwrapSingleLine significantLineBreaks>
        {
`This is the first line.
This is the second.`
        }
      </Markdown>
    );

    expect(container.children.length).toBe(1)
    expect(container.firstChild.tagName).toBe('P');
  })
})
