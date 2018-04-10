const React = require('react');
const { shallow } = require('enzyme');
const ExportLink = require('views/components/export-link');

describe('<ExportLink />', () => {

  test('renders links with pdf and csv format in the query string', () => {
    const wrapper = shallow(<ExportLink />);
    const links = wrapper.find('a');
    expect(links.at(0).props().href).toBe('?format=pdf');
    expect(links.at(1).props().href).toBe('?format=csv');
  });

  test('preserves the filter property in the query string', () => {
    const wrapper = shallow(<ExportLink filter="foo" />);
    const links = wrapper.find('a');
    expect(links.at(0).props().href).toBe('?filter=foo&format=pdf');
    expect(links.at(1).props().href).toBe('?filter=foo&format=csv');
  });

});
