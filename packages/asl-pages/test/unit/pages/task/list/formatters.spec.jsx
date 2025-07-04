import React from 'react';
import MockDate from 'mockdate';
import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import formatters from '../../../../../pages/task/list/formatters/index';
import { MockReduxProvider } from '../../../../util/mock-redux';

const RENDERED_DEADLINE = '8 Sep 2023';
const RAW_DEADLINE = '2023-09-08 17:00:00';

const REDUX_STATE = {
  static: {
    content: {
      deadline: {
        none: 'No deadline',
        statutory: '(statutory)',
        due: 'Due today',
        overdue: 'Overdue'
      }
    },
    task: {
      activeDeadline: RAW_DEADLINE
    }
  }
};

jest.mock('@ukhomeoffice/asl-components/src/snippet', () => (props) => {
  if (props.children === 'deadline.due') {
    return <span data-testid="snippet">Due today</span>;
  }
  if (props.children === 'deadline.overdue') {
    return <span data-testid="snippet">Overdue</span>;
  }
  return <span data-testid="snippet">{props.children}</span>;
});

describe('Due and overdue tasks display deadlines based on the calendar day', () => {
  afterEach(() => {
    MockDate.reset();
  });

  function renderDeadline({ deadline, now }) {
    MockDate.set(now);

    const task = {
      withASRU: true,
      activeDeadline: deadline
    };

    render(
      <MockReduxProvider state={REDUX_STATE}>
        {formatters.activeDeadline.format(null, task)}
      </MockReduxProvider>
    );
  }

  function getDeadlineSpan(expectedText) {
    // Flexible matcher to find the element inside the urgent notice
    return screen.getByText((content, element) => {
      return content === expectedText && element.closest('.notice');
    });
  }

  function expectDeadlineMessage({ deadline, now, expectedText, urgent = true, expectedTitle }) {
    renderDeadline({ deadline, now });

    const deadlineSpan = getDeadlineSpan(expectedText);
    expect(deadlineSpan).toBeInTheDocument();

    // Verify if the parent has the 'urgent' class
    const noticeElement = deadlineSpan.closest('.notice');
    if (urgent) {
      expect(noticeElement).toHaveClass('urgent');
    } else {
      expect(noticeElement).not.toHaveClass('urgent');
    }

    if (expectedTitle) {
      expect(deadlineSpan.parentElement).toHaveAttribute('title', expectedTitle);
    }
  }

  test('When the task is not yet due then the due date is displayed', () => {
    expectDeadlineMessage({
      deadline: RAW_DEADLINE,
      now: '2023-08-29 08:00:01',
      expectedText: RENDERED_DEADLINE,
      urgent: false
    });
  });

  test('When the task is almost due then the due date is displayed and the task is urgent', () => {
    expectDeadlineMessage({
      deadline: RAW_DEADLINE,
      now: '2023-09-07 08:00:01',
      expectedText: RENDERED_DEADLINE
    });
  });

  describe('When the task is due on the current calendar day, "Due today" is displayed', () => {
    test('When the time has not passed', () => {
      expectDeadlineMessage({
        deadline: RAW_DEADLINE,
        now: '2023-09-08 08:00:01',
        expectedText: 'Due today',
        expectedTitle: RENDERED_DEADLINE
      });
    });

    test('When the time has passed', () => {
      expectDeadlineMessage({
        deadline: '2023-09-08 08:00:00',
        now: '2023-09-08 17:00:01',
        expectedText: 'Due today',
        expectedTitle: RENDERED_DEADLINE
      });
    });
  });

  test('When the task is overdue on the current calendar day, "Overdue" is displayed', () => {
    expectDeadlineMessage({
      deadline: RAW_DEADLINE,
      now: '2023-09-09 00:00:01',
      expectedText: 'Overdue',
      expectedTitle: RENDERED_DEADLINE
    });
  });
});
