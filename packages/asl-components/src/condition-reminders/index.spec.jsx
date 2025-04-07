import { shallow, render } from 'enzyme';
import React from 'react';
import ConditionReminders from './index';
import {describe, expect, test} from '@jest/globals'
import {v4 as uuid} from 'uuid'

function reminderWithDeadline(deadline) {
  return {
    id: uuid(),
    deadline
  }
}

describe('ConditionReminders component', () => {
  test('Empty reminders should render nothing', () => {
    for (const reminders of [null, []]) {
      const wrapper = shallow(<ConditionReminders reminders={reminders}/>);
      expect(wrapper.isEmptyRender()).toBe(true);
    }
  })

  test('Reminders without a deadline should be ignored', () => {
    const reminders = [{id: uuid()}]
    const wrapper = shallow(<ConditionReminders reminders={reminders}/>);
    expect(wrapper.isEmptyRender()).toBe(true);
  })

  test('When there is one reminder the copy should be singular', () => {
    const reminders = [reminderWithDeadline("2025-01-01")]
    const wrapper = render(<ConditionReminders reminders={reminders}/>);
    expect(wrapper.text())
      .toContain(
      "A deadline and automated reminders have been set for this condition"
    );
    expect(wrapper.text())
      .toContain("This condition has a deadline set for:");
    expect(wrapper.text())
      .toContain(
      "Licence holders will receive reminders 1 month before," +
      " 1 week before and on the deadline date. ASRU will receive a reminder" +
      " when the deadline has passed."
    );
  })

  test('When there are two reminders the copy should be plural', () => {
    const reminders = [
      reminderWithDeadline("2025-01-01"),
      reminderWithDeadline("2025-02-02")
    ]
    const wrapper = render(<ConditionReminders reminders={reminders}/>);
    expect(wrapper.text())
      .toContain(
        "Deadlines and automated reminders have been set for this condition"
      );
    expect(wrapper.text())
      .toContain("This condition has deadlines set for:");
    expect(wrapper.text())
      .toContain(
      "Licence holders will receive reminders 1 month before, " +
        "1 week before and on each deadline date. ASRU will receive reminders " +
        "when each deadline has passed."
    );
  })
})
