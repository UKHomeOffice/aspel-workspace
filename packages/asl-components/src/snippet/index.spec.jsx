import React from 'react';
import { render } from 'enzyme';
import { Snippet } from './';

const string = '<span>one line</span>';
const list = `<ul class="govuk-list govuk-list--bullet">
<li>one</li>
<li>two</li>
<li>three</li>
</ul>`;
const paragraphs = `<p>one</p>
<p>two</p>`;

describe('<Snippet />', () => {

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
    }
  };

  test('does not include a wrapping element on single line input', () => {
    const wrapper = render(<div><Snippet content={content}>string</Snippet></div>);
    expect(wrapper.find('p').length).toEqual(0);
    expect(wrapper.find('span').length).toEqual(1);
    expect(wrapper.html()).toEqual(string);
  });

  test('includes wrapping elements on list inputs inputs', () => {
    const wrapper = render(<div><Snippet content={content}>list</Snippet></div>);
    expect(wrapper.find('ul').length).toEqual(1);
    expect(wrapper.html()).toEqual(list);
  });

  test('includes wrapping elements on multi-line paragraph inputs', () => {
    const wrapper = render(<div><Snippet content={content}>paragraphs</Snippet></div>);
    expect(wrapper.find('p').length).toEqual(2);
    expect(wrapper.html()).toEqual(paragraphs);
  });

  test('will inject props as template variables', () => {
    const wrapper = render(<div><Snippet content={content} name={"world"}>nested.template</Snippet></div>);
    expect(wrapper.html()).toEqual('<span>Hello world</span>');
  })

  test('can accept single fallback', () => {
    const wrapper = render(<div><Snippet content={content} fallback={'paragraphs'}>non.existent</Snippet></div>);
    expect(wrapper.find('p').length).toEqual(2);
    expect(wrapper.html()).toEqual(paragraphs);
  });

  test('can accept multiple fallbacks', () => {
    const wrapper = render(<div><Snippet content={content} fallback={['non.existent.2', 'paragraphs', 'list']}>non.existent</Snippet></div>);
    expect(wrapper.find('p').length).toEqual(2);
    expect(wrapper.html()).toEqual(paragraphs);
  });

  test('will error if no fallback matches content', () => {
    expect(() => render(<div><Snippet content={content} fallback={['non.existent.2', 'missing']}>non.existent</Snippet></div>))
        .toThrow('Failed to lookup content snippet. Tried keys: ["non.existent","non.existent.2","missing"]');
  });

  test('will return null if no content matches and the snippet is optional', () => {
    const wrapper = render(<div><Snippet content={content} fallback={['non.existent.2', 'missing']} optional>non.existent</Snippet></div>);
    expect(wrapper.html()).toEqual('');
  });

  test('errors if content at the specified key is not a string', () => {
    expect(() => render(<div><Snippet content={content}>nested</Snippet></div>))
        .toThrow('Failed to lookup content snippet. Tried keys: ["nested"]');
  });

  test('renders a fallback if content at the specified key is not a string', () => {
    const wrapper = render(<div><Snippet content={content} fallback={'nested.string'}>nested</Snippet></div>);
    expect(wrapper.html()).toEqual('<span>nested string</span>');
  });

});
