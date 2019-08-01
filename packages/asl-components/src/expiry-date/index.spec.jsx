import React from 'react';
import { shallow } from 'enzyme';
import ExpiryDate from './';
import Snippet from '../snippet';
import endOfTomorrow from 'date-fns/end_of_tomorrow';
import addWeeks from 'date-fns/add_weeks';
import addMonths from 'date-fns/add_months';

describe('<ExpiryDate />', () => {

  test('shows an expired message if provided date is in the past', () => {
    const wrapper = shallow(<ExpiryDate date={'2017-01-01'} />);
    expect(wrapper.find(Snippet).length).toBe(1);
    expect(wrapper.find(Snippet).props().children).toEqual('diff.expired');
  });

  test('shows urgent 1 day left message if the expiry date is tomorrow', () => {
    const wrapper = shallow(<ExpiryDate date={endOfTomorrow()} />);
    expect(wrapper.find(Snippet).length).toBe(1);
    expect(wrapper.find(Snippet).props().children).toEqual('diff.singular');
    expect(wrapper.find('span').props().className).toMatch('urgent');
    expect(wrapper.find(Snippet).props().unit).toEqual('day');
    expect(wrapper.find(Snippet).props().diff).toEqual(1);
  });

  test('shows less than x weeks left if the expiry date is greater than 1 week but less than a month', () => {
    const wrapper = shallow(<ExpiryDate date={addWeeks(new Date(), 3)} />);
    expect(wrapper.find(Snippet).length).toBe(1);
    expect(wrapper.find(Snippet).props().unit).toEqual('week');
    expect(wrapper.find(Snippet).props().diff).toEqual(3);
  });

  test('shows less than x months left if the expiry date is greater than 1 month but less than a year', () => {
    const wrapper = shallow(<ExpiryDate date={addMonths(new Date(), 9)} />);
    expect(wrapper.find(Snippet).length).toBe(1);
    expect(wrapper.find(Snippet).props().unit).toEqual('month');
    expect(wrapper.find(Snippet).props().diff).toEqual(9);
  });

});
