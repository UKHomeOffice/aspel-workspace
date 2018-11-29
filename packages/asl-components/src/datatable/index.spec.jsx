import React from 'react';
import { shallow } from 'enzyme';
import { Datatable } from './';
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
    const schema = { id: {}, site: {}, name: {}, number: {} };
    const data = [
      { id: 1, site: 'A Site', name: 'The Name', number: 3 },
      { id: 2, site: 'A Site', name: 'The Name', number: 3 },
      { id: 3, site: 'A Site', name: 'The Name', number: 3 }
    ];
    const wrapper = shallow(<Datatable data={data} schema={schema} />);
    expect(wrapper.find('tbody tr').length).toBe(3);
  });

  test('renders a <td /> element for each key in each row', () => {
    const schema = { id: {}, site: {}, name: {}, number: {} };
    const data = [
      { id: 1, site: 'A Site', name: 'The Name', number: 3 },
      { id: 2, site: 'A Site', name: 'The Name', number: 3 },
      { id: 3, site: 'A Site', name: 'The Name', number: 3 }
    ];
    const wrapper = shallow(<Datatable data={data} schema={schema} />);
    expect(wrapper.find('tbody tr td').length).toBe(12);
  });

  test('formats data if format function provided', () => {
    const data = [
      { id: 1, site: 'A Site', name: 'The Name', number: 3 }
    ];
    const schema = {
      site: {
        show: true,
        format: text => text.toUpperCase()
      },
      name: { show: true },
      number: { show: true }
    };
    const wrapper = shallow(<Datatable data={data} schema={schema} />);
    expect(wrapper.find('tbody tr td').at(0).text()).toBe('A SITE');
  });

  test('passes full row data to format function', () => {
    const data = [
      { id: 1, site: 'A Site', name: 'The Name', number: 3 }
    ];
    const schema = {
      site: {
        show: true,
        format: (text, row) => `${text} - ${row.id}`
      },
      name: { show: true },
      number: { show: true }
    };
    const wrapper = shallow(<Datatable data={data} schema={schema} />);
    expect(wrapper.find('tbody tr td').at(0).text()).toBe('A Site - 1');
  });

  test('accesses a deeply nested field if accessor provided', () => {
    const data = [
      { id: 1, site: 'A Site', name: 'The Name', number: 3, nacwo: { profile: { name: 'A Name' } } }
    ];
    const schema = {
      site: { show: true },
      name: { show: true },
      number: { show: true },
      nacwo: { show: true, accessor: 'nacwo.profile.name' }
    };
    const wrapper = shallow(<Datatable data={data} schema={schema} />);
    expect(wrapper.find('tbody tr td').at(3).text()).toBe('A Name');
  });

  describe('expandable rows', () => {
    let wrapper;
    let schema;
    let data;

    beforeEach(() => {
      data = [
        { id: 1, site: 'A Site', name: 'The Name', number: 3 }
      ];
      schema = {
        site: { show: true },
        name: { show: true },
        number: { show: true }
      };
      wrapper = shallow(<Datatable data={data} schema={schema} ExpandableRow={() => {}} />);
    });

    test('renders expandable rows if expandable prop is true', () => {
      expect(wrapper.find('tr.expandable').length).toBe(1);
    });

    test('sets state to expanded for the row if clicked', () => {
      wrapper.find('tr.expandable').simulate('click');
      expect(wrapper.instance().state.expanded).toEqual({ '1': true });
    });

  });

});
