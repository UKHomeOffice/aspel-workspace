import React from 'react';
import { shallow } from 'enzyme';
import { Breadcrumb } from './';
import Snippet from '../snippet';
import Link from '../link';

describe('<Breadcrumb />', () => {

  test('renders one li', () => {
    const wrapper = shallow(<Breadcrumb crumb="dashboard" link={true} />);
    expect(wrapper.find('li').length).toBe(1);
  });

  test('renders a Link component if `link` prop is true', () => {
    const wrapper = shallow(<Breadcrumb crumb="dashboard" link={true} />);
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).last().props().page).toBe('dashboard');
  });

  test('passes a Snippet as the link label', () => {
    const wrapper = shallow(<Breadcrumb crumb="dashboard" link={true} />);
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).at(0).props().label).toEqual(<Snippet>breadcrumbs.dashboard</Snippet>);
  });

  test('does not render a Link component if `link` prop is false', () => {
    const wrapper = shallow(<Breadcrumb crumb="dashboard" link={false} />);
    expect(wrapper.find(Link).length).toBe(0);
  });

  test('renders a Snippet', () => {
    const wrapper = shallow(<Breadcrumb crumb="dashboard" link={false} />);
    expect(wrapper.find(Snippet).length).toBe(1);
    expect(wrapper.find(Snippet).props().children).toEqual('breadcrumbs.dashboard');
  });

});
