jest.mock('src/helpers/query-string');
const React = require('react');
const { shallow } = require('enzyme');
const ExportLink = require('views/components/export-link');
const { format } = require('src/helpers/query-string');

describe('<ExportLink />', () => {
  afterEach(() => {
    format.mockClear();
  });

  test('calls format', () => {
    shallow(<ExportLink />);
    expect(format.mock.calls.length).toBe(1);
  });

  test('passes pdf: 1 to format', () => {
    shallow(<ExportLink />);
    const qs = format.mock.calls[0][0];
    expect(qs).toMatchObject({ pdf: 1 });
  });

  test('passes filterBy and filterText to format', () => {
    const props = {
      filterBy: {
        site: [],
        holding: [],
        suitability: []
      },
      filterText: 'Some Text'
    };
    shallow(<ExportLink { ...props } />);
    const qs = format.mock.calls[0][0];
    expect(qs).toMatchObject(props);
  });

  test('renders a link with \'?\' prepended to the result of format as the href', () => {
    format.mockImplementation(() => 'test');
    const wrapper = shallow(<ExportLink />);
    expect(wrapper.find('a').at(0).props().href).toBe('?test');
  });
});
