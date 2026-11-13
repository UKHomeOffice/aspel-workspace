const { afterEach, beforeEach, describe, expect, jest, test } = require('@jest/globals');
const validateReminders = require('./validation');

describe('conditions validation', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-05-29T12:00:00Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('requires at least one reminder', () => {
        expect(validateReminders([])).toBe('Please provide a valid date');
    });

    test('requires a date in YYYY-M-D shape', () => {
        expect(validateReminders([{ deadline: '29/05/2024' }])).toBe('Please provide a valid date');
    });

    test('rejects impossible dates', () => {
        expect(validateReminders([{ deadline: '2024-02-31' }])).toBe('Please provide a valid date');
    });

    test('requires the date to be after today', () => {
        expect(validateReminders([{ deadline: '2024-05-29' }])).toBe('The date must be in the future');
    });

    test('accepts a future date', () => {
        expect(validateReminders([{ deadline: '2024-05-30' }])).toBe(false);
    });
});

