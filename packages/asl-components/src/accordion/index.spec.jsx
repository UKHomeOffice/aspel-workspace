import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Accordion from './';
import { expect } from '@jest/globals';

const renderAccordion = () => render(
  <Accordion>
    {[1, 2, 3].map((el) => (
      <div className="child" key={el}>{el}</div>
    ))}
  </Accordion>
);

describe('<Accordion />', () => {
  test('renders child elements adding onToggle and open props', () => {
    renderAccordion();
    const children = [0, 1, 2].map((el) => screen.getByTestId(`accordion-${el}`));

    children.forEach((child) => {
      expect(child).toHaveAttribute('data-open', 'false');
    });
  });

  test('passes the open state to children', async () => {
    const { container } = render(
      <Accordion>
        {[1, 2, 3].map((el) => (
          <div className="child" key={el} data-testid={`accordion-${el - 1}`}>{el}</div>
        ))}
      </Accordion>
    );

    // Simulate state change by clicking the toggle button
    const toggleButton = container.querySelector('button');
    fireEvent.click(toggleButton); // Open all children

    const children = [0, 1, 2].map((el) => screen.getByTestId(`accordion-${el}`));

    await waitFor(() => {
      expect(children[0]).toHaveAttribute('data-open', 'true');
      expect(children[1]).toHaveAttribute('data-open', 'true');
      expect(children[2]).toHaveAttribute('data-open', 'true');
    });

    fireEvent.click(toggleButton); // Close all children

    await waitFor(() => {
      expect(children[0]).toHaveAttribute('data-open', 'false');
      expect(children[1]).toHaveAttribute('data-open', 'false');
      expect(children[2]).toHaveAttribute('data-open', 'false');
    });
  });
//
//   test('passes the open state to children', () => {
//     const renderAccordion = () => {
//       return render(
//         <Accordion>
//           <div className="accordion" data-testid="accordion-0" open={true}>1</div>
//           <div className="accordion" data-testid="accordion-1" open={false}>2</div>
//           <div className="accordion" data-testid="accordion-2" open={true}>3</div>
//         </Accordion>
//       );
//     }
//     renderAccordion();
//
//
//     const accordion0 = screen.getByTestId('accordion-0');
//     const accordion1 = screen.getByTestId('accordion-1');
//     const accordion2 = screen.getByTestId('accordion-2');
//
//     expect(accordion0).toHaveAttribute('data-open', 'true');
//     expect(accordion1).toHaveAttribute('data-open', 'false');
//     expect(accordion2).toHaveAttribute('data-open', 'true');
//   });
//
//   test('passes the open state to children', () => {
//     const wrapper = renderAccordion();
//     wrapper.instance().setState({ open: [true, false, true] });
//     wrapper.update();
//     const children = wrapper.find('.child');
//     expect(children.at(0).prop('open')).toBe(true);
//     expect(children.at(1).prop('open')).toBe(false);
//     expect(children.at(2).prop('open')).toBe(true);
//   });
});

// describe('<Accordion />', () => {
//
//

  // test('renders a button which calls toggleAll on click', () => {
  //   const wrapper = renderAccordion();
  //   const instance = wrapper.instance();
  //   jest.spyOn(instance, 'toggleAll');
  //   wrapper.find('button').simulate('click');
  //   expect(instance.toggleAll.mock.calls.length).toBe(1);
  // });
  //
  // describe('methods', () => {
  //   test('toggle(i)', () => {
  //     const instance = renderAccordion().instance();
  //     jest.spyOn(instance, 'setState');
  //     instance.toggle(0);
  //     expect(instance.setState.mock.calls[0][0]).toEqual({ open: [true, false, false] });
  //     instance.toggle(0);
  //     instance.toggle(1);
  //     expect(instance.setState.mock.calls[0][0]).toEqual({ open: [false, true, false] });
  //     instance.toggle(0);
  //     instance.toggle(2);
  //     expect(instance.setState.mock.calls[0][0]).toEqual({ open: [true, true, true] });
  //   });
  //
  //   test('allOpen', () => {
  //     const instance = renderAccordion().instance();
  //     expect(instance.allOpen()).toBe(false);
  //     instance.setState({ open: [false, true, true] });
  //     expect(instance.allOpen()).toBe(false);
  //     instance.setState({ open: [true, true, true] });
  //     expect(instance.allOpen()).toBe(true);
  //   });
  //
  //   test('toggleAll', () => {
  //     const instance = renderAccordion().instance();
  //     jest.spyOn(instance, 'setState');
  //     instance.allOpen = jest.fn();
  //     instance.allOpen.mockReturnValue(true);
  //     instance.toggleAll();
  //     expect(instance.setState.mock.calls[0][0]).toEqual({ open: [false, false, false] });
  //     instance.allOpen.mockReturnValue(false);
  //     instance.toggleAll();
  //     expect(instance.setState.mock.calls[1][0]).toEqual({ open: [true, true, true] });
  //   });
  // });
// });


