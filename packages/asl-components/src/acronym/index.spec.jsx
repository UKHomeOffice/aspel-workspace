import React from 'react';
import { render, screen } from '@testing-library/react';
import Acronym from './';
import dictionary from '@ukhomeoffice/asl-dictionary';

describe('Acronym component', () => {
  Object.entries(dictionary)
    .filter(([, definition]) => typeof definition === 'string')
    .forEach(([key, definition]) => {
      test(`handles input ${key}`, () => {
        render(<Acronym>{key}</Acronym>);
        const element = screen.getByText(key);
        expect(element).toHaveAttribute('title', definition);
        expect(element.tagName).toBe('ABBR');
      });
    });

  Object.entries(dictionary.plural)
    .filter(([, definition]) => typeof definition === 'string')
    .forEach(([key, definition]) => {
      test(`handles input ${key} and outputs a plural definition`, () => {
        render(<Acronym usePlural>{key}</Acronym>);
        const element = screen.getByText(key);
        expect(element).toHaveAttribute('title', definition);
        expect(element.tagName).toBe('ABBR');
      });
    });

  Object.entries(dictionary)
    .filter(([key, definition]) => typeof definition === 'string' && dictionary.plural[key] === undefined)
    .forEach(([key, definition]) => {
      test(`handles input ${key} and falls back to singular when no plural defined`, () => {
        render(<Acronym usePlural>{key}</Acronym>);
        const element = screen.getByText(key);
        expect(element).toHaveAttribute('title', definition);
        expect(element.tagName).toBe('ABBR');
      });
    });
});
