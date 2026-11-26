import React from 'react'
import { render } from 'enzyme'
import { DateInput } from 'ho-react-components';

describe('DateInput', () => {

  it('should render three input fields', () => {
    const rendered = render(<DateInput label="test" name="date" />);
    expect(rendered.find('input').length).toEqual(3);
    expect(rendered.find('input[name="date-day"]').length).toEqual(1);
    expect(rendered.find('input[name="date-month"]').length).toEqual(1);
    expect(rendered.find('input[name="date-day"]').length).toEqual(1);
  });

  it('populates fields with date provided as `value`', () => {
    const rendered = render(<DateInput label="test" name="date" value="2017-06-28" />);
    expect(rendered.find('input[name="date-day"]').attr('value')).toEqual('28');
    expect(rendered.find('input[name="date-month"]').attr('value')).toEqual('06');
    expect(rendered.find('input[name="date-year"]').attr('value')).toEqual('2017');
  });

  it('populates fields with a full ISO8601 date provided as `value`', () => {
    const rendered = render(<DateInput label="test" name="date" value="2017-06-28T17:53:12.456Z" />);
    expect(rendered.find('input[name="date-day"]').attr('value')).toEqual('28');
    expect(rendered.find('input[name="date-month"]').attr('value')).toEqual('06');
    expect(rendered.find('input[name="date-year"]').attr('value')).toEqual('2017');
  });

});
