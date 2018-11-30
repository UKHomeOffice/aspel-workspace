import React from 'react';
import { shallow } from 'enzyme';
import ExpiryDate from './';
import Snippet from '../snippet';

describe('<ExpiryDate />', () => {

  test('shows an expired message if provided date is in the past', () => {
    const wrapper = shallow(<ExpiryDate date={'2017-01-01'} />);
    expect(wrapper.find(Snippet).length).toBe(1);
    expect(wrapper.find(Snippet).props().children).toEqual('diff.expired');
  });

});
