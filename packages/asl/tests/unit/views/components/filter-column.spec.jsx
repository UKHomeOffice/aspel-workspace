const React = require('react');
const { render, shallow, mount } = require('enzyme');
const FilterColumn = require('views/components/filter-column');
const MoreLink = require('views/components/more-link');

describe('<FilterColumn />', () => {
  const filter = {
    key: 'An ID',
    title: 'A Title'
  };

  test('doesn\'t show all results by default', () => {
    const wrapper = shallow(<FilterColumn filter={{ ...filter, values: [] }} />);
    expect(wrapper.state().showMore).toBe(false);
  });

  test('toggles showMore when handleClickMore is called', () => {
    const wrapper = shallow(<FilterColumn filter={{ ...filter, values: [] }} />);
    wrapper.instance().handleClickMore();
    expect(wrapper.state().showMore).toBe(true);
  });

  test('renders a single checkbox', () => {
    const values = ['A Filter'];
    const wrapper = render(<FilterColumn filter={{ ...filter, values }} />);
    const el = wrapper.find('input[type=checkbox]');
    expect(el.length).toBe(1);
    expect(el.val()).toBe(values[0]);
  });

  test('renders multiple checkboxes', () => {
    const values = ['1', '2', '3', '4', '5'];
    const wrapper = render(<FilterColumn filter={{ ...filter, values }} />);
    const el = wrapper.find('input[type=checkbox]');
    expect(el.length).toBe(5);
  });

  test('doesn\'t render a more link if there are less than 4 values', () => {
    const values = ['1', '2'];
    const wrapper = mount(<FilterColumn filter={{ ...filter, values }} />);
    const el = wrapper.find(MoreLink);
    expect(el.length).toBe(0);
  });

  test('renders a more link if there are more than 4 values', () => {
    const values = ['1', '2', '3', '4', '5'];
    const wrapper = mount(<FilterColumn filter={{ ...filter, values }} />);
    const el = wrapper.find(MoreLink);
    expect(el.length).toBe(1);
  });

  test('only renders 4 checkboxes if there are more than 4 values', () => {
    const values = ['1', '2', '3', '4', '5'];
    const wrapper = mount(<FilterColumn filter={{ ...filter, values }} />);
    const el = wrapper.find('input[type="checkbox"]');
    expect(el.length).toBe(4);
  });

  test('calls toggleFilters() on change, passing in id and value of filter', () => {
    const values = ['1', '2', '3', '4', '5'];
    const fn = jest.fn();
    const wrapper = mount(<FilterColumn filter={{ ...filter, values }} toggleFilter={ fn } />);
    const el = wrapper.find('input[type="checkbox"][value="1"]');
    el.simulate('change');
    expect(fn.mock.calls[0][0]).toBe(filter.key);
    expect(fn.mock.calls[0][1]).toBe('1');
  });
});
