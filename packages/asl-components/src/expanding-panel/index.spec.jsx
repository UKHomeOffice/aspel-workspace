import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpandingPanel from './';
import { expect, jest } from '@jest/globals';

describe('<ExpandingPanel />', () => {
  test('sets open state to false on mount', () => {
    render(<ExpandingPanel isOpen={false} />);
    const content = screen.queryByText('The Content');
    expect(content).not.toBeInTheDocument();
  });

  test('shows only a header if not passed open prop', () => {
    render(<ExpandingPanel title="The Title">The Content</ExpandingPanel>);
    const header = screen.getByText('The Title');
    expect(header).toBeInTheDocument();
    const content = screen.queryByText('The Content');
    expect(content).not.toBeInTheDocument();
  });

  test('renders content if open prop is set to true', () => {
    render(<ExpandingPanel open={true} title="The Title">The Content</ExpandingPanel>);
    const content = screen.getByText('The Content');
    expect(content).toBeVisible();
  });

  describe('methods', () => {
    describe('controlled()', () => {
      test('returns false if props.open is not defined', () => {
        const { container } = render(<ExpandingPanel />);
        expect(container.firstChild).toBeTruthy();
      });

      test('returns false if props.open is not boolean', () => {
        render(<ExpandingPanel open={1} />);
        const content = screen.queryByText('The Content');
        expect(content).not.toBeInTheDocument();
      });

      test('returns true if props.open is true', () => {
        render(<ExpandingPanel open={true} title={'The Content'}/>);
        const content = screen.queryByText('The Content');
        expect(content).toBeVisible();
      });

      test('returns true if props.open is false', () => {
        render(<ExpandingPanel open={false} />);
        const content = screen.queryByText('The Content');
        expect(content).not.toBeInTheDocument();
      });
    });

    describe('toggle()', () => {
      test('calls props.onToggle if controlled', () => {
        const onToggle = jest.fn();
        render(<ExpandingPanel onToggle={onToggle} open={true} title={'The Title'}/>);
        const header = screen.getByText('The Title');
        fireEvent.click(header);
        expect(onToggle).toHaveBeenCalledTimes(1);
      });

      test('toggles state if not controlled', () => {
        render(<ExpandingPanel title="The Title">The Content</ExpandingPanel>);
        const header = screen.getByText('The Title');
        fireEvent.click(header);
        const content = screen.getByText('The Content');
        expect(content).toBeVisible();
        fireEvent.click(header);
        expect(content).not.toBeVisible();
      });
    });

    describe('isOpen()', () => {
      test('returns props.open if controlled', () => {
        render(<ExpandingPanel open={true} title={'The Content'}/>);
        const content = screen.queryByText('The Content');
        expect(content).toBeVisible();
      });

      test('returns state.open if not controlled', () => {
        render(<ExpandingPanel title="The Title">The Content</ExpandingPanel>);
        const header = screen.getByText('The Title');
        fireEvent.click(header);
        const content = screen.getByText('The Content');
        expect(content).toBeVisible();
      });
    });
  });
});
