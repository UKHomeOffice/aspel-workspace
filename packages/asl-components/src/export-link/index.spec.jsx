import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExportLink } from './';

describe('<ExportLink />', () => {

  test('renders links with pdf and csv format in the query string', () => {
    render(<ExportLink />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '?format=pdf');
    expect(links[1]).toHaveAttribute('href', '?format=csv');
  });

  test('preserves the filter property in the query string', () => {
    render(<ExportLink filter="foo" />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '?filter=foo&format=pdf');
    expect(links[1]).toHaveAttribute('href', '?filter=foo&format=csv');
  });

});
