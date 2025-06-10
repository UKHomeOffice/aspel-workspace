import React from 'react';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { expect, jest } from '@jest/globals';
import PIL from './pil';

jest.mock('@ukhomeoffice/asl-components', () => ({
  Snippet: (props) => <span data-testid="snippet">{props.children || props.id}</span>,
  StickyNavAnchor: (props) => <div data-testid="sticky-nav-anchor">{props.children}</div>,
  Link: (props) => <a href={props.page}>{props.label}</a>,
  DiffText: (props) => (
    <div data-testid="diff-text">
      {props.currentLabel} {props.oldValue} {props.newValue} {props.proposedLabel}
    </div>
  ),
  TrainingSummary: () => <div data-testid="training-summary">Mocked TrainingSummary</div>
}));

jest.mock('../../../../pil/procedures/views/diff', () => () => <div data-testid="procedures-diff">Mocked ProceduresDiff</div>);
jest.mock('../../../../pil/species/views/diff', () => () => <div data-testid="species-diff">Mocked SpeciesDiff</div>);

describe('<PIL />', () => {
  const initialState = { static: {} };

  const store = configureStore({
    reducer: {
      dummy: (state = initialState) => state // no-op reducer
    }
  });

  test('renders correctly for transfer task', () => {
    const props = {
      task: {
        type: 'transfer',
        data: {
          data: {
            establishment: {
              from: {
                id: 'est1',
                name: 'Current Establishment'
              },
              to: {
                id: 'est2',
                name: 'New Establishment'
              }
            },
            procedures: [{ key: 'A' }, { key: 'B' }],
            species: [{ name: 'Mouse' }]
          },
          modelData: {}
        },
        isOpen: true
      }
    };

    const { container } = render(
      <Provider store={store}>
        <PIL {...props} />
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });

  test('renders correctly for update-conditions action', () => {
    const props = {
      task: {
        data: {
          action: 'update-conditions',
          data: {
            conditions: 'new-conditions'
          }
        },
        isOpen: false
      },
      values: {
        conditions: 'old-conditions'
      }
    };

    const { container } = render(
      <Provider store={store}>
        <PIL {...props} />
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });

  test('renders correctly for default task with procedures and species', () => {
    const props = {
      task: {
        type: 'default',
        data: {
          data: {
            procedures: [{ key: 'A' }, { key: 'B' }],
            species: [{ name: 'Mouse' }]
          },
          modelData: {
            procedures: [{ key: 'A' }],
            species: [{ name: 'Rat' }]
          }
        },
        isOpen: true
      }
    };

    const { container } = render(
      <Provider store={store}>
        <PIL {...props} />
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });
});
