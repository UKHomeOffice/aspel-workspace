import React from 'react';
import { shallow } from 'enzyme';
import { Search } from './';
import { ApplyChanges } from '../';

describe('<Search />', () => {
  test('Creates a .text-filter element containing a govuk Input', () => {
    const wrapper = shallow(<Search />);
    expect(wrapper.find('.search-box input').length).toEqual(1);
  });

  test('Adds a label with the label prop provided', () => {
    const wrapper = shallow(<Search label="Search by name"/>);
    expect(wrapper.find('.search-box label').text()).toEqual('Search by name');
  });

  test('Sets the value of the input to the filter attr if passed', () => {
    const filter = 'Hi';
    const wrapper = shallow(<Search filter={ filter } />);
    expect(wrapper.find('input').prop('value')).toBe(filter);
  });

  test('Calls the provided onChange method on form submission', () => {
    const onChange = jest.fn();
    const wrapper = shallow(<Search onChange={ onChange } />);
    wrapper.find('input').prop('onChange')({ target: { value: 'foo' } });
    wrapper.find(ApplyChanges).prop('onApply')();
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0]).toEqual('foo');
  });
});
