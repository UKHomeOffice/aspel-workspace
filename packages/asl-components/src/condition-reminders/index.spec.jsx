import React from 'react';
import { render, screen } from '@testing-library/react';
import ConditionReminders from './index';
import { describe, expect, test } from '@jest/globals';
import { v4 as uuid } from 'uuid';

function reminderWithDeadline(deadline) {
  return {
    id: uuid(),
    deadline
  };
}

describe('ConditionReminders component', () => {
  test('Empty reminders should render nothing', () => {
    for (const reminders of [null, []]) {
      const { container } = render(<ConditionReminders reminders={reminders} />);
      expect(container).toBeEmptyDOMElement();
    }
  });

  test('Reminders without a deadline should be ignored', () => {
    const reminders = [{ id: uuid() }];
    const { container } = render(<ConditionReminders reminders={reminders} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('When there is one reminder the copy should be singular', () => {
    const reminders = [reminderWithDeadline('2025-01-01')];
    render(<ConditionReminders reminders={reminders} />);
    expect(
      screen.getByText('A deadline and automated reminders have been set for this condition')
    ).toBeInTheDocument();
    expect(screen.getByText('This condition has a deadline set for:')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Licence holders will receive reminders 1 month before, 1 week before and on the deadline date. ASRU will receive a reminder when the deadline has passed.'
      )
    ).toBeInTheDocument();
  });

  test('When there are two reminders the copy should be plural', () => {
    const reminders = [
      reminderWithDeadline('2025-01-01'),
      reminderWithDeadline('2025-02-02')
    ];
    render(<ConditionReminders reminders={reminders} />);
    expect(
      screen.getByText('Deadlines and automated reminders have been set for this condition')
    ).toBeInTheDocument();
    expect(screen.getByText('This condition has deadlines set for:')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Licence holders will receive reminders 1 month before, 1 week before and on each deadline date. ASRU will receive reminders when each deadline has passed.'
      )
    ).toBeInTheDocument();
  });
});
