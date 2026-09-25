const { beforeEach, describe, expect, jest, test } = require('@jest/globals');
const {
    getDateBoundaryError,
    hasDateValue,
    isInvalidDateValue,
    parseOptionalDate
} = require('./validation');
const { getAspelDataStart } = require('./business');

describe('date-extend-dayJs validation helpers', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-05-29T12:00:00Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('hasDateValue', () => {
        test('returns false for blank values', () => {
            expect(hasDateValue()).toBe(false);
            expect(hasDateValue('')).toBe(false);
            expect(hasDateValue('   ')).toBe(false);
        });

        test('returns true for non-blank values', () => {
            expect(hasDateValue('2024-05-29')).toBe(true);
        });
    });

    describe('parseOptionalDate', () => {
        test('returns null for blank values', () => {
            expect(parseOptionalDate('')).toBeNull();
            expect(parseOptionalDate('   ')).toBeNull();
        });

        test('returns null for invalid values', () => {
            expect(parseOptionalDate('2024-02-31')).toBeNull();
        });

        test('returns a dayjs instance for valid values', () => {
            expect(parseOptionalDate('2024-05-29')?.format('YYYY-MM-DD')).toBe('2024-05-29');
        });
    });

    describe('isInvalidDateValue', () => {
        test('returns false for blank values', () => {
            expect(isInvalidDateValue('')).toBe(false);
        });

        test('returns true for invalid entered dates', () => {
            expect(isInvalidDateValue('2024-02-31')).toBe(true);
        });

        test('returns false for valid dates', () => {
            expect(isInvalidDateValue('2024-05-29')).toBe(false);
        });
    });

    describe('getDateBoundaryError', () => {
        test('returns null when there is no parsed date', () => {
            expect(getDateBoundaryError({ parsed: null, maxDate: new Date(), maxDateErrorCode: 'dateIsSameOrBefore' })).toBeNull();
        });

        test('returns the min-date error code when before the lower boundary', () => {
            const parsed = parseOptionalDate('2019-07-30');
            expect(getDateBoundaryError({
                parsed,
                minDate: getAspelDataStart(),
                minDateErrorCode: 'aspelDataStartDate'
            })).toBe('aspelDataStartDate');
        });

        test('returns the max-date error code when after the upper boundary', () => {
            const parsed = parseOptionalDate('2024-05-30');
            expect(getDateBoundaryError({
                parsed,
                maxDate: new Date(),
                maxDateErrorCode: 'dateIsSameOrBefore'
            })).toBe('dateIsSameOrBefore');
        });

        test('returns null when inside the boundaries', () => {
            const parsed = parseOptionalDate('2024-05-29');
            expect(getDateBoundaryError({
                parsed,
                minDate: getAspelDataStart(),
                minDateErrorCode: 'aspelDataStartDate',
                maxDate: new Date(),
                maxDateErrorCode: 'dateIsSameOrBefore'
            })).toBeNull();
        });
    });
});

