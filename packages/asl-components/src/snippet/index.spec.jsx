import React from 'react';
import { render } from 'enzyme';
import { Snippet } from './';

const string = '<span>one line</span>';
const list = `<ul>
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

two`
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

});
