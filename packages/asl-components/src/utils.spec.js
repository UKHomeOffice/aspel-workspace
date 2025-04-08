const { formatDate, DATE_FORMAT } = require('./utils');

describe('formatDate', () => {
    test('formats a valid date', () => {
        expect(formatDate('2024-01-01', DATE_FORMAT.short)).toBe('1/1/2024');
    });

    test('returns "-" for empty dates', () => {
        expect(formatDate(null, DATE_FORMAT.short)).toBe('-');
        expect(formatDate(undefined, DATE_FORMAT.short)).toBe('-');
        expect(formatDate('', DATE_FORMAT.short)).toBe('-');
    });

    test('returns "Invalid date entered" for invlaid dates', () => {
        expect(formatDate('not a date', DATE_FORMAT.short)).toBe('Invalid date entered');
        expect(formatDate('24-01-01', DATE_FORMAT.short)).toBe('Invalid date entered');
    });
});
