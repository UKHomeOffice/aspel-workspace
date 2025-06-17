import React from 'react';
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from './';
import { expect, jest } from '@jest/globals';

// Mock Link and Snippet
jest.mock('../link', () => (props) => (
  <a href={`/${props.page}`} data-testid="link">{props.label}</a>
));
jest.mock('../snippet', () => (props) => (
  <span data-testid="snippet">{props.children}</span>
));

describe('<Breadcrumb />', () => {

  test('renders one li', () => {
    render(<Breadcrumb crumb="dashboard" link={true} />);
    const listItem = screen.getByRole('listitem');
    expect(listItem).toBeInTheDocument();
  });

  test('renders a Link component with correct props if `link` prop is true', () => {
    render(<Breadcrumb crumb="dashboard" link={true} />);
    const link = screen.getByTestId('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dashboard');

    const snippet = screen.getByTestId('snippet');
    expect(snippet).toHaveTextContent('breadcrumbs.dashboard');
  });

  test('renders a Snippet with correct props if `link` prop is false', () => {
    render(<Breadcrumb crumb="dashboard" link={false} />);
    const snippet = screen.getByTestId('snippet');
    expect(snippet).toBeInTheDocument();
    expect(snippet).toHaveTextContent('breadcrumbs.dashboard');
  });

  test('does not render a Link component if `link` prop is false', () => {
    render(<Breadcrumb crumb="dashboard" link={false} />);
    const link = screen.queryByTestId('link');
    expect(link).not.toBeInTheDocument();
  });

  test('renders a Snippet', () => {
    render(<Breadcrumb crumb="dashboard" link={false} />);
    const snippet = screen.getByTestId('snippet');
    expect(snippet).toBeInTheDocument();
  });

});
