import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { merge } from 'lodash';
import { DateErrorMessage } from '@ukhomeoffice/asl-components/src/date-input/error-message';

import commonContent from '../../../../../pages/common/content';
import pageContent from '../../../../../pages/role/named-person-mvp/content/incomplete-training';
import schemaFor from '../../../../../pages/role/named-person-mvp/schema/incomplete-training';

describe('named person - incomplete training date errors', () => {

  // Mirrors how the service builds res.locals.static.content (asl-service ui/page.js).
  const content = merge({}, commonContent, pageContent);

  const store = configureStore({
    reducer: {
      static: (state = { content }) => state,
      model: (state = {}) => state
    }
  });

  const messageFor = (roleType, { value, errorCode }) => {
    const field = schemaFor(roleType).completeDate;
    render(
      <Provider store={store}>
        <DateErrorMessage
          content={content}
          name="completeDate"
          value={value}
          errorCode={errorCode}
          validate={field.validate}
          dateLabel={field.dateLabel}
          dateEnter={field.dateEnter}
        />
      </Provider>
    );
  };

  describe.each([
    ['nacwo', 'Enter a date when all mandatory training will be completed'],
    ['nvs', 'Enter a date when the module will be completed']
  ])('%s', (roleType, enterMessage) => {

    test('no date entered', () => {
      messageFor(roleType, { value: '', errorCode: 'required' });
      expect(screen.getByText(enterMessage)).toBeInTheDocument();
    });

    test('missing month', () => {
      // value is `year-month-day`
      messageFor(roleType, { value: '2027--27', errorCode: 'validDate' });
      expect(screen.getByText('Completion date must include a month')).toBeInTheDocument();
    });

    test('missing day and month', () => {
      messageFor(roleType, { value: '2027--', errorCode: 'validDate' });
      expect(screen.getByText('Completion date must include a day and month')).toBeInTheDocument();
    });

    test('impossible date', () => {
      messageFor(roleType, { value: '2027-06-45', errorCode: 'validDate' });
      expect(screen.getByText('Completion date must be a real date')).toBeInTheDocument();
    });

    test('year is not 4 digits', () => {
      messageFor(roleType, { value: '27-06-03', errorCode: 'validDate' });
      expect(screen.getByText('Year must include 4 numbers')).toBeInTheDocument();
    });

    test('date not in the future', () => {
      messageFor(roleType, { value: '2007-03-27', errorCode: 'dateIsAfter' });
      expect(screen.getByText('Completion date must be in the future')).toBeInTheDocument();
    });
  });

  test('the module checklist error follows the copy deck', () => {
    expect(content.errors.incomplete.required)
      .toBe('Enter which training modules need to be completed');
  });
});
