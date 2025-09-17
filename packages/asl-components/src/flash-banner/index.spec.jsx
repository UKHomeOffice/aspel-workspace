import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import FlashBanner from './';
import { expect } from '@jest/globals';

describe('<FlashBanner />', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders heading and body when both are provided', () => {
    render(<FlashBanner heading="Test Heading" body="Test body content" className="custom-class" />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Heading');
    expect(screen.getByText('Test body content')).toBeInTheDocument();
    expect(screen.getByText('Test body content').closest('.custom-class')).toBeInTheDocument();
  });

  test('renders only body when heading is not provided', () => {
    render(<FlashBanner body="Body only" />);
    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.getByText('Body only')).toBeInTheDocument();
  });

  test('applies custom className to Inset wrapper', () => {
    render(<FlashBanner body="With class" className="flash-banner" />);
    const wrapper = screen.getByText('With class').closest('.flash-banner');
    expect(wrapper).toBeInTheDocument();
  });
});
