const { splitDateValue, getInvalidDateParts } = require('./invalid-parts');

describe('splitDateValue', () => {
    test('splits an ISO year-month-day string', () => {
        expect(splitDateValue('2024-05-10')).toEqual({ year: '2024', month: '05', day: '10' });
    });

    test('handles a blank value', () => {
        expect(splitDateValue('--')).toEqual({ year: '', month: '', day: '' });
        expect(splitDateValue('')).toEqual({ year: '', month: '', day: '' });
    });

    test('drops any time portion', () => {
        expect(splitDateValue('2024-05-10T00:00:00')).toEqual({ year: '2024', month: '05', day: '10' });
    });
});

describe('getInvalidDateParts', () => {
    test('flags only the out-of-range month', () => {
        expect(getInvalidDateParts({ day: '10', month: '00', year: '2024' })).toEqual(['month']);
    });

    test('flags only the out-of-range day', () => {
        expect(getInvalidDateParts({ day: '32', month: '05', year: '2024' })).toEqual(['day']);
    });

    test('flags a non-four-digit year', () => {
        expect(getInvalidDateParts({ day: '10', month: '05', year: '20000' })).toEqual(['year']);
        expect(getInvalidDateParts({ day: '10', month: '05', year: '24' })).toEqual(['year']);
    });

    test('flags empty and non-numeric parts', () => {
        expect(getInvalidDateParts({ day: '', month: 'ab', year: '2024' })).toEqual(['day', 'month']);
    });

    test('returns [] when every part is individually valid (e.g. 31/02)', () => {
        expect(getInvalidDateParts({ day: '31', month: '02', year: '2024' })).toEqual([]);
    });

    test('returns all parts for a fully blank date', () => {
        expect(getInvalidDateParts({ day: '', month: '', year: '' })).toEqual(['day', 'month', 'year']);
    });
});
