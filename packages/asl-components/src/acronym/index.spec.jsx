import React from 'react';
import { render } from 'enzyme';
import Acronym from './';
import dictionary from '@ukhomeoffice/asl-dictionary';

describe('Acronym component', () => {
  Object.entries(dictionary)
      .filter(([,definition]) => typeof definition === "string")
      .forEach(([key, definition]) => {
    test(`handles input ${key}`, () => {
      const wrapper = render(<Acronym>{key}</Acronym>);
      expect(wrapper.attr('title')).toBe(definition);
      expect(wrapper.text()).toBe(key);
      expect(wrapper.get(0).tagName).toBe('abbr');
    });
  });

  Object.entries(dictionary.plural)
      .filter(([,definition]) => typeof definition === "string")
      .forEach(([key, definition]) => {
    test(`handles input ${key} and outputs a plural definition`, () => {
      const wrapper = render(<Acronym usePlural>{key}</Acronym>);
      expect(wrapper.attr('title')).toBe(definition);
      expect(wrapper.text()).toBe(key);
      expect(wrapper.get(0).tagName).toBe('abbr');
    });
  });

  Object.entries(dictionary)
      .filter(([key,definition]) => typeof definition === "string" && dictionary.plural[key] === undefined)
      .forEach(([key, definition]) => {
    test(`handles input ${key} and fallsback to singular when no plural defined`, () => {
      const wrapper = render(<Acronym usePlural>{key}</Acronym>);
      expect(wrapper.attr('title')).toBe(definition);
      expect(wrapper.text()).toBe(key);
      expect(wrapper.get(0).tagName).toBe('abbr');
    });
  });
});
