import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { merge } from 'lodash';
import { DateErrorMessage } from '@ukhomeoffice/asl-components/src/date-input/error-message';

import commonContent from '../../../../../pages/common/content';
import pageContent from '../../../../../pages/category-e/course/course-details-form/content/base';
import schema from '../../../../../pages/category-e/course/course-details-form/schema';
import { formatReferenceDate } from '../../../../../pages/category-e/course/reference-date';

// Asserts the date messages this screen actually renders against the copy deck:
// "Add course and apply for a category E PIL", row 4.
describe('category E course - date errors', () => {

  // Mirrors how the service builds res.locals.static.content (asl-service ui/page.js).
  const content = merge({}, commonContent, pageContent);

  // The reference dates the messages play back, as the routers set them.
  const project = { formattedExpiryDate: formatReferenceDate('2026-09-01') };
  const formattedStartDate = formatReferenceDate('2026-9-1');

  const store = configureStore({
    reducer: {
      static: (state = { content, project, formattedStartDate }) => state,
      model: (state = {}) => state
    }
  });

  const revealed = (duration) =>
    schema.courseDuration.options.find(opt => opt.value === duration).reveal;

  const fields = {
    courseDate: revealed('one-day').courseDate,
    startDate: revealed('multi-day').startDate,
    endDate: revealed('multi-day').endDate
  };

  const messageFor = (name, { value, errorCode }) => {
    const field = fields[name];
    render(
      <Provider store={store}>
        <DateErrorMessage
          content={content}
          name={name}
          value={value}
          errorCode={errorCode}
          validate={field.validate}
          dateLabel={field.dateLabel}
          dateEnter={field.dateEnter}
        />
      </Provider>
    );
  };

  // The GDS breakdown is built from each field's `dateLabel`, so it is the same
  // shape for all three date fields.
  describe.each([
    ['courseDate', 'Course date', 'Enter a course date'],
    ['startDate', 'Course start date', 'Enter a course start date'],
    ['endDate', 'Course end date', 'Enter a course end date']
  ])('%s', (name, label, enterMessage) => {

    test('no date entered', () => {
      messageFor(name, { value: '', errorCode: 'required' });
      expect(screen.getByText(enterMessage)).toBeInTheDocument();
    });

    test('missing month', () => {
      messageFor(name, { value: '2026--14', errorCode: 'validDate' });
      expect(screen.getByText(`${label} must include a month`)).toBeInTheDocument();
    });

    test('missing day and month', () => {
      messageFor(name, { value: '2026--', errorCode: 'validDate' });
      expect(screen.getByText(`${label} must include a day and month`)).toBeInTheDocument();
    });

    test('impossible date', () => {
      messageFor(name, { value: '2026-06-45', errorCode: 'validDate' });
      expect(screen.getByText(`${label} must be a real date`)).toBeInTheDocument();
    });

    test('year is not 4 digits', () => {
      messageFor(name, { value: '26-06-14', errorCode: 'validDate' });
      expect(screen.getByText('Year must include 4 numbers')).toBeInTheDocument();
    });
  });

  test('course date in the past', () => {
    messageFor('courseDate', { value: '2020-08-14', errorCode: 'dateIsAfter' });
    expect(screen.getByText('Course date must be in the future')).toBeInTheDocument();
  });

  test('course start date in the past', () => {
    messageFor('startDate', { value: '2020-08-14', errorCode: 'dateIsAfter' });
    expect(screen.getByText('Course start date must be in the future')).toBeInTheDocument();
  });

  test('course date after the PPL expiry date plays the expiry date back', () => {
    messageFor('courseDate', { value: '2027-08-14', errorCode: 'dateIsSameOrBefore' });
    expect(
      screen.getByText('Course date must be the same as or before the PPL expiry date 1 September 2026')
    ).toBeInTheDocument();
  });

  test('course end date after the PPL expiry date plays the expiry date back', () => {
    messageFor('endDate', { value: '2027-08-14', errorCode: 'dateIsSameOrBefore' });
    expect(
      screen.getByText('Course end date must be the same as or before the PPL expiry date 1 September 2026')
    ).toBeInTheDocument();
  });

  test('course end date before the start date plays the start date back', () => {
    messageFor('endDate', { value: '2026-08-14', errorCode: 'dateIsAfter' });
    expect(
      screen.getByText('Course end date must be after the start date 1 September 2026')
    ).toBeInTheDocument();
  });

  describe('when the reference date is missing', () => {
    const bareStore = configureStore({
      reducer: {
        static: (state = { content, project: {}, formattedStartDate: '' }) => state,
        model: (state = {}) => state
      }
    });

    const bareMessageFor = (name, errorCode) => render(
      <Provider store={bareStore}>
        <DateErrorMessage
          content={content}
          name={name}
          value="2027-08-14"
          errorCode={errorCode}
          validate={fields[name].validate}
          dateLabel={fields[name].dateLabel}
        />
      </Provider>
    );

    test('the expiry message stops cleanly rather than trailing a blank', () => {
      bareMessageFor('courseDate', 'dateIsSameOrBefore');
      expect(
        screen.getByText('Course date must be the same as or before the PPL expiry date')
      ).toBeInTheDocument();
    });

    test('the start date message stops cleanly rather than trailing a blank', () => {
      bareMessageFor('endDate', 'dateIsAfter');
      expect(
        screen.getByText('Course end date must be after the start date')
      ).toBeInTheDocument();
    });
  });
});
