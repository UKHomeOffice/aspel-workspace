import React from 'react';
import { useSelector } from 'react-redux';
import { shallow } from 'enzyme';
import { Datatable, Row } from './';
import TableHeader from './header';

describe('<Datatable />', () => {

  test('renders any class names passed to it', () => {
    const schema = { site: {}, name: {}, number: {} };
    const wrapper = shallow(<Datatable schema={schema} className="foo bar" />);
    const table = wrapper.find('table');
    expect(table.hasClass('foo')).toEqual(true);
    expect(table.hasClass('bar')).toEqual(true);
  });

  test('doesnt render class of "undefined" if no className passed', () => {
    const schema = { site: {}, name: {}, number: {} };
    const wrapper = shallow(<Datatable schema={schema} />);
    const table = wrapper.find('table');
    expect(table.hasClass('undefined')).toEqual(false);
  });

  test('renders a <TableHeader /> element for each column, taken from schema', () => {
    const schema = { site: {}, name: {}, number: {} };
    const wrapper = shallow(<Datatable schema={schema} />);
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders.length).toBe(3);
    Object.keys(schema).forEach((key, index) => {
      expect(tableHeaders.get(index).props.id).toBe(key);
    });
  });

  test('renders a <tr /> element for each row', () => {
    const data = [
      { id: 1, site: 'A Site', name: 'The Name', number: 3 },
      { id: 2, site: 'A Site', name: 'The Name', number: 3 },
      { id: 3, site: 'A Site', name: 'The Name', number: 3 }
    ];
    const wrapper = shallow(<Datatable data={data} schema={schema} />);
    expect(wrapper.find(Row).length).toBe(3);
  });

  describe('<Row />', () => {
    test('renders a <td /> element for each key', () => {
      const schema = { id: {}, site: {}, name: {}, number: {} };
      const row = { id: 1, site: 'A Site', name: 'The Name', number: 3 };
      const wrapper = shallow(<Row row={row} schema={schema} />);
      expect(wrapper.find('td').length).toBe(4);
    });

    test('formats data if format function provided', () => {
      const row = { id: 1, site: 'A Site', name: 'The Name', number: 3 };
      const schema = {
        site: {
          show: true,
          format: text => text.toUpperCase()
        },
        name: { show: true },
        number: { show: true }
      };
      const wrapper = shallow(<Row row={row} schema={schema} />);
      expect(wrapper.find('td').at(0).text()).toBe('A SITE');
    });

    test('passes full row data to format function', () => {
      const row = { id: 1, site: 'A Site', name: 'The Name', number: 3 };
      const schema = {
        site: {
          show: true,
          format: (text, row) => `${text} - ${row.id}`
        },
        name: { show: true },
        number: { show: true }
      };
      const wrapper = shallow(<Row row={row} schema={schema} />);
      expect(wrapper.find('td').at(0).text()).toBe('A Site - 1');
    });

    test('accesses a deeply nested field if accessor provided', () => {
      const row = { id: 1, site: 'A Site', name: 'The Name', number: 3, nacwo: { profile: { name: 'A Name' } } };
      const schema = {
        site: { show: true },
        name: { show: true },
        number: { show: true },
        nacwo: { show: true, accessor: 'nacwo.profile.name' }
      };
      const wrapper = shallow(<Row row={row} schema={schema} />);
      expect(wrapper.find('td').at(3).text()).toBe('A Name');
    });
  });

  describe.only('expandable rows', () => {
    const data = [
      { id: 1, site: 'A Site', name: 'The Name', number: 3 },
      { id: 2, site: 'A Site', name: 'The Name', number: 4 },
      { id: 3, site: 'A Site', name: 'The Name', number: 5 },
      { id: 4, site: 'A Site', name: 'The Name', number: 6 }
    ];

    const schema = {
      site: { show: true },
      name: { show: true },
      number: { show: true }
    };

    function Expandable() {
      return null
    }

    const expands = row => {
      return row.number % 2 === 0;
    }

    function getWrapper(index) {
      return shallow(<Row row={data[index]} schema={schema} expands={expands} Expandable={Expandable} />);
    }

    test('adds expandable classname if expands resolves to true', () => {
      expect(getWrapper(0).find('tr').hasClass('expandable')).toBe(false);
      expect(getWrapper(1).find('tr').hasClass('expandable')).toBe(true);
      expect(getWrapper(2).find('tr').hasClass('expandable')).toBe(false);
      expect(getWrapper(3).find('tr').hasClass('expandable')).toBe(true);
    });

    test('shows expanding content for a row when clicked', () => {
      const wrapper = getWrapper(1);
      wrapper.find('tr.expandable').simulate('click');
      const expanded = wrapper.find('tr.expanded-content');
      expect(expanded.length).toEqual(1);
    });

    test('clicking an open row closes it', () => {
      const wrapper = getWrapper(1);
      wrapper.find('tr.expandable').simulate('click');
      expect(wrapper.find('tr.expanded-content').length).toEqual(1);
      wrapper.find('tr.expandable').first().simulate('click');
      expect(wrapper.find('tr.expanded-content').length).toEqual(0);
    });

  });

});
