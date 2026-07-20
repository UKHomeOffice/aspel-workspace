const { resolveDateError } = require('./resolve-error');

// value is the emitted ISO-ish `year-month-day` string.
describe('resolveDateError', () => {
    test('nothing entered -> enter', () => {
        expect(resolveDateError({ errorCode: 'required', value: '--' }))
            .toEqual({ key: 'enter', context: {} });
    });

    describe('validDate', () => {
        test('a missing part -> incomplete naming that part', () => {
            expect(resolveDateError({ errorCode: 'validDate', value: '2024--10' }))
                .toEqual({ key: 'incomplete', context: { missingParts: 'a month' } });
        });

        test('two missing parts are listed with "and"', () => {
            // year present, day and month missing
            expect(resolveDateError({ errorCode: 'validDate', value: '2024--' }))
                .toEqual({ key: 'incomplete', context: { missingParts: 'a day and month' } });
        });

        test('all three missing -> comma + and', () => {
            expect(resolveDateError({ errorCode: 'validDate', value: '--' }))
                .toEqual({ key: 'incomplete', context: { missingParts: 'a day, month and year' } });
        });

        test('year not four digits (all parts present) -> yearLength', () => {
            expect(resolveDateError({ errorCode: 'validDate', value: '24-05-10' }))
                .toEqual({ key: 'yearLength', context: {} });
        });

        test('out-of-range part with everything present -> real date', () => {
            expect(resolveDateError({ errorCode: 'validDate', value: '2024-13-10' }))
                .toEqual({ key: 'realDate', context: {} });
        });

        test('impossible combination (31 Feb) -> real date', () => {
            expect(resolveDateError({ errorCode: 'validDate', value: '2024-02-31' }))
                .toEqual({ key: 'realDate', context: {} });
        });
    });

    describe('constraints against "now"', () => {
        const cases = [
            ['dateIsBefore', 'past'],
            ['dateIsAfter', 'future'],
            ['dateIsSameOrBefore', 'todayOrPast'],
            ['dateIsSameOrAfter', 'todayOrFuture']
        ];
        cases.forEach(([code, key]) => {
            test(`${code}: now -> ${key}`, () => {
                expect(resolveDateError({ errorCode: code, value: '2024-05-10', validate: [{ [code]: 'now' }] }))
                    .toEqual({ key, context: {} });
            });
        });

        test('treats a missing rule param as "now"', () => {
            expect(resolveDateError({ errorCode: 'dateIsBefore', value: '2024-05-10' }))
                .toEqual({ key: 'past', context: {} });
        });
    });

    describe('constraints against a specific date', () => {
        test('formats the reference date in British long form', () => {
            expect(resolveDateError({
                errorCode: 'dateIsAfter',
                value: '2024-05-10',
                validate: [{ dateIsAfter: '2017-09-01' }]
            })).toEqual({ key: 'after', context: { date: '1 September 2017' } });
        });
    });

    test('unknown code -> null (caller falls back to generic message)', () => {
        expect(resolveDateError({ errorCode: 'somethingElse', value: '2024-05-10' })).toBeNull();
    });
});
