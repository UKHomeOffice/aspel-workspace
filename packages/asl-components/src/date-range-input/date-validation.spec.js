const { afterEach, beforeEach, describe, expect, jest, test } = require('@jest/globals');
const { getBoundaryErrorCode } = require('./date-validation');

describe('getBoundaryErrorCode', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-05-29T12:00:00Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('returns null for an invalid date', () => {
        expect(getBoundaryErrorCode('2024-02-31')).toBeNull();
    });

    test('returns dateIsSameOrBefore for a date in the future', () => {
        expect(getBoundaryErrorCode('2024-05-30', { maxDate: 'now' })).toBe('dateIsSameOrBefore');
    });

    test('allows today', () => {
        expect(getBoundaryErrorCode('2024-05-29')).toBeNull();
    });

    test('returns aspelDataStartDate for a date before ASPEL data started', () => {
        expect(getBoundaryErrorCode('2019-07-30', { minDate: '2019-07-31', minDateErrorCode: 'aspelDataStartDate' })).toBe('aspelDataStartDate');
    });

    test('allows the ASPEL data start date', () => {
        expect(getBoundaryErrorCode('2019-07-31', { minDate: '2019-07-31' })).toBeNull();
    });

    test('allows a valid date within the boundaries', () => {
        expect(getBoundaryErrorCode('2024-05-28')).toBeNull();
    });

    test('allows dates outside unconfigured boundaries', () => {
        expect(getBoundaryErrorCode('2019-07-30')).toBeNull();
        expect(getBoundaryErrorCode('2024-05-30')).toBeNull();
    });

    test('uses the generic error for a configured minimum date', () => {
        expect(getBoundaryErrorCode('2019-07-30', { minDate: '2019-07-31' })).toBe('dateIsSameOrAfter');
    });

    test('accepts a configured maximum date', () => {
        expect(getBoundaryErrorCode('2024-05-30', { maxDate: '2024-05-31' })).toBeNull();
        expect(getBoundaryErrorCode('2024-06-01', { maxDate: '2024-05-31' })).toBe('dateIsSameOrBefore');
    });
});
