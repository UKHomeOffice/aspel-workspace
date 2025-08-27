import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import Accordion from './';
import { expect } from '@jest/globals';

const renderAccordion = () => render(
  <Accordion>
    {[1, 2, 3].map((el) => (
      <div className="child" key={el} data-testid={`accordion-${el - 1}`}>{el}</div>
    ))}
  </Accordion>
);

const getAccordionChildren = () => [0, 1, 2].map((index) => screen.getByTestId(`accordion-${index}`));

describe('<Accordion />', () => {

  afterEach(() => {
    cleanup();
  });

  test('renders child elements with correct initial props', () => {
    renderAccordion();
    const children = getAccordionChildren();

    children.forEach((child) => {
      expect(child).toHaveAttribute('data-open', 'false');
    });
  });

  test('toggles the open state of all children', async () => {
    renderAccordion();
    const toggleButton = screen.getByRole('button', { name: /open all/i });
    const children = getAccordionChildren();

    // Open all children
    fireEvent.click(toggleButton);

    await waitFor(() => {
      children.forEach((child) => {
        expect(child).toHaveAttribute('data-open', 'true');
      });
    });

    // Close all children
    fireEvent.click(toggleButton);

    await waitFor(() => {
      children.forEach((child) => {
        expect(child).toHaveAttribute('data-open', 'false');
      });
    });
  });

  test('renders child elements with correct initial props', () => {
    renderAccordion();
    const children = [0, 1, 2].map((index) => screen.getByTestId(`accordion-${index}`));

    children.forEach((child) => {
      expect(child).toHaveAttribute('data-open', 'false');
    });
  });

  test('Accordion respects initial isOpen state from children', () => {
    const DummyPanel = ({ children, ...props }) => {
      const { isOpen, ...validProps } = props;
      return <div className="child" {...validProps}>{children}</div>;
    };

    render(
      <Accordion>
        <DummyPanel>Child 0</DummyPanel>
        <DummyPanel isOpen={true}>Child 1</DummyPanel>
        <DummyPanel>Child 2</DummyPanel>
      </Accordion>
    );

    expect(screen.getByTestId('accordion-0')).toHaveAttribute('data-open', 'false');
    expect(screen.getByTestId('accordion-1')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('accordion-2')).toHaveAttribute('data-open', 'false');
  });

});
