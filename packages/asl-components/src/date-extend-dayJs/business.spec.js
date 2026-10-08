const { afterEach, beforeEach, describe, expect, jest, test } = require('@jest/globals');
const { daysSinceDate, formatIsoDate, todayIso } = require('./business');

describe('date-extend-dayJs business helpers', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-05-29T12:00:00Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('todayIso returns the current date in ISO format', () => {
        expect(todayIso()).toBe('2024-05-29');
    });

    test('formatIsoDate returns undefined for invalid dates', () => {
        expect(formatIsoDate('not-a-date')).toBeUndefined();
    });

    test('daysSinceDate uses the current dayjs date by default', () => {
        expect(daysSinceDate('2024-05-26')).toBe(3);
    });

    test('daysSinceDate supports an explicit comparison date', () => {
        expect(daysSinceDate('2024-05-26', '2024-05-30')).toBe(4);
    });
});

