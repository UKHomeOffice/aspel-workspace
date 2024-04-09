import React from 'react';
import { shallow } from 'enzyme';
import { addWeeks } from 'date-fns';
import ExpiryDate from './';
import Countdown from '../countdown';

describe('<ExpiryDate />', () => {

  test('shows a message if provided date is in the past', () => {
    const wrapper = shallow(<ExpiryDate date={'2017-01-01'} />);
    expect(wrapper.find(Countdown).length).toBe(1);
  });

  test('does not show the countdown if showNotice is false', () => {
    const wrapper = shallow(<ExpiryDate date={addWeeks(new Date(), 1)} showNotice={false} />);
    expect(wrapper.find(Countdown).length).toBe(0);
  });

});
