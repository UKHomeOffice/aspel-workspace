import React from 'react';
import MockDate from 'mockdate';
import { render, screen } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Deadline from '../../../../../../../pages/task/read/views/components/deadline';
import { MockComponent } from '../../../../../../util/mock-component';
import { expect, jest } from '@jest/globals';

// // mock any deeply nested components that aren't being tested
jest.mock('@asl/projects/client/components/review-fields', () => ({
  ReviewFields: (props) => {
    const Component = MockComponent;
    return <Component {...props} />;
  }
}));

describe('Deadline component', () => {
  afterEach(() => {
    MockDate.reset();
  });

  const initialState = {
    static: {
      isAsru: true,
      isInspector: false,
      version: 1,
      content: {
        deadline: {
          processBy: 'Process by: {{date}}',
          internal: 'Internal deadline',
          today: '(Deadline is today)',
          passed: {
            singular: '(Deadline passed {{days}} day ago)',
            plural: '(Deadline passed {{days}} days ago)'
          }
        }
      }
    }
  };

  const mockStore = createStore(() => initialState);

  function renderDeadline({ date }) {
    const task = {
      data: {
        internalDeadline: {
          standard: date
        }
      },
      activeDeadline: date
    };

    return render(
      <Provider store={mockStore}>
        <Deadline task={task} />
      </Provider>
    );
  }

  test('When the task is not yet due, no notice is displayed', () => {
    MockDate.set('2023-09-07 08:00:00');
    renderDeadline({ date: '2023-09-08' });

    expect(screen.getByText('8 September 2023')).toBeInTheDocument();
    expect(screen.queryByText('(Deadline is today)')).not.toBeInTheDocument();
    expect(screen.queryByText('(Deadline passed 1 day ago)')).not.toBeInTheDocument();
  });

  test('When the task is due today, a due notice is displayed', () => {
    MockDate.set('2023-09-08 08:00:00');
    renderDeadline({ date: '2023-09-08' });

    expect(screen.getByText('8 September 2023')).toBeInTheDocument();
    expect(screen.getByText('(Deadline is today)')).toBeInTheDocument();
  });

  test('When the task is overdue by a minute, a deadline passed notice is displayed', () => {
    MockDate.set('2023-09-09 00:01:00');
    renderDeadline({ date: '2023-09-08' });

    expect(screen.getByText('8 September 2023')).toBeInTheDocument();
    expect(screen.getByText('(Deadline passed 1 day ago)')).toBeInTheDocument();
  });

  test('When the task is overdue by almost two days, a deadline passed notice is displayed', () => {
    MockDate.set('2023-09-09 23:59:59');
    renderDeadline({ date: '2023-09-08' });

    expect(screen.getByText('8 September 2023')).toBeInTheDocument();
    expect(screen.getByText('(Deadline passed 1 day ago)')).toBeInTheDocument();
  });

  test('When the task is overdue by multiple days, a deadline passed notice is displayed', () => {
    MockDate.set('2023-09-11 23:59:59');
    renderDeadline({ date: '2023-09-08' });

    expect(screen.getByText('8 September 2023')).toBeInTheDocument();
    expect(screen.getByText('(Deadline passed 3 days ago)')).toBeInTheDocument();
  });
});
