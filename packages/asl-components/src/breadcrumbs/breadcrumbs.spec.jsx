import React from 'react';
import { shallow } from 'enzyme';
import Breadcrumbs, { Breadcrumb } from './';

describe('<Breadcrumbs />', () => {
  test('returns null when crumbs undefined', () => {
    const wrapper = shallow(<Breadcrumbs />);
    expect(wrapper.html()).toBe(null);
  });

  test('returns null when crumbs is empty array', () => {
    const wrapper = shallow(<Breadcrumbs crumbs={[]} />);
    expect(wrapper.html()).toBe(null);
  });

  test('returns null when crumbs is not an array', () => {
    const wrapper = shallow(<Breadcrumbs crumbs={'A crumb'} />);
    expect(wrapper.html()).toBe(null);
  });

  describe('with one crumb', () => {
    const crumbs = ['dashboard'];
    const wrapper = shallow(<Breadcrumbs crumbs={crumbs} />);

    test('doesn\'t render any elements', () => {
      expect(wrapper.find(Breadcrumb).length).toBe(0);
    });
  });

  describe('with many crumbs', () => {
    const crumbs = [
      'dashboard',
      'establishment.dashboard',
      'projects'
    ];
    const wrapper = shallow(<Breadcrumbs crumbs={crumbs} />);

    test('renders 3 <Breadcrumb /> elements', () => {
      expect(wrapper.find(Breadcrumb).length).toBe(3);
    });

    test('passes links to the first 2 <Breadcrumb /> elements', () => {
      const el0 = wrapper.find(Breadcrumb).at(0);
      expect(el0.props().crumb).toEqual('dashboard');
      expect(el0.props().link).toEqual(true);
      const el1 = wrapper.find(Breadcrumb).at(1);
      expect(el1.props().crumb).toEqual('establishment.dashboard');
      expect(el1.props().link).toEqual(true);
    });

    test('does not link the last <Breadcrumb />', () => {
      const el = wrapper.find(Breadcrumb).last();
      expect(el.props().crumb).toEqual('projects');
      expect(el.props().link).toEqual(false);
    });

  });
});
