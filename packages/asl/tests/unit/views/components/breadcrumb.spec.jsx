const React = require('react');
const { shallow } = require('enzyme');
const Breadcrumb = require('views/components/breadcrumb');

describe('<Breadcrumb />', () => {
  describe('with a string', () => {
    const crumb = 'A crumb';
    const wrapper = shallow(<Breadcrumb crumb={crumb} />);
    const el = wrapper.find('li');

    test('renders one li', () => {
      expect(el.length).toBe(1);
    });

    test('renders the crumb text', () => {
      expect(el.text()).toBe(crumb);
    });

    test('doesn\'t render a link', () => {
      expect(el.find('a').length).toBe(0);
    });
  });

  describe('with an object', () => {
    const crumb = { href: '/a-link', label: 'A link' };
    const wrapper = shallow(<Breadcrumb crumb={crumb} />);
    const el = wrapper.find('li');

    test('renders one li', () => {
      expect(el.length).toBe(1);
    });

    test('renders the crumb label', () => {
      expect(el.text()).toBe(crumb.label);
    });

    test('renders a link', () => {
      expect(el.find('a').length).toBe(1);
    });

    test('passes the href and label as props', () => {
      expect(el.find('a').props()).toEqual({ children: 'A link', href: '/a-link' });
    });
  });
});
