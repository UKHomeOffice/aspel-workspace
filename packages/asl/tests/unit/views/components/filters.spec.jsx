import React from 'react';
import { shallow } from 'enzyme';
import Filters from 'views/components/filters';
import FilterColumn from 'views/containers/filter-column';
import filterSettings from 'src/helpers/filters';

describe('<Filters />', () => {
  test('renders 3 FilterColumn elements dy default', () => {
    const wrapper = shallow(<Filters filters={filterSettings} />);
    expect(wrapper.find(FilterColumn).length).toBe(3);
  });

  test('renders 2 FilterColumn elements if filterSettings contains 2 items', () => {
    const wrapper = shallow(<Filters filters={filterSettings.filter(f => f.key !== 'site')} />);
    expect(wrapper.find(FilterColumn).length).toBe(2);
  });

  test('clearFilters is called on click', () => {
    const fn = jest.fn();
    const wrapper = shallow(<Filters filters={filterSettings} clearFilters={fn} />);
    wrapper.find('.control-bar a').simulate('click', { preventDefault: () => {} });
    expect(fn.mock.calls.length).toBe(1);
  });
});
