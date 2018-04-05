const React = require('react');
const { shallow } = require('enzyme');
const Breadcrumbs = require('views/components/breadcrumbs');

const crumbsList = [
  [],
  ['Licensed premises'],
  [{ href: '/roles', label: 'Named people' }, 'Brian Proudfoot'],
  [{ href: '/roles', label: 'Named people' }, { href: '/roles/brian', label: 'Brian Proudfoot' }, 'Another crumb']
];

describe('<Breadcrumbs />', () => {
  crumbsList.forEach((crumbs, index) => {
    test(`testing ${index} elements rendered`, () => {
      const wrapper = shallow(<Breadcrumbs crumbs={crumbs} />).find('.breadcrumb ol li');
      // if there are more than 0 elements, a home link is prepended.
      expect(wrapper.length).toBe(index === 0 ? 0 : index + 1);
      wrapper.forEach((el, i) => {
        if (i === 0) {
          expect(el.text()).toBe('Home');
        } else {
          const text = crumbsList[index][i - 1];
          expect(el.text()).toBe(typeof text === 'object' ? text.label : text);
        }
      });
    });
  });
});
