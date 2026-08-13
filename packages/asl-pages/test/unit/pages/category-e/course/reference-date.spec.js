import { formatReferenceDate } from '../../../../../pages/category-e/course/reference-date';

describe('formatReferenceDate', () => {

  test('formats an ISO timestamp from the API the way GDS plays dates back', () => {
    expect(formatReferenceDate('2026-09-19T00:00:00.000Z')).toBe('19 September 2026');
  });

  test('drops the leading zero from single-digit days', () => {
    expect(formatReferenceDate('2026-09-01')).toBe('1 September 2026');
  });

  test('handles the unpadded value the date inputs submit', () => {
    // parseAndSetDate joins the raw day/month/year parts, so "1 9 2026" arrives
    // as "2026-9-1".
    expect(formatReferenceDate('2026-9-1')).toBe('1 September 2026');
  });

  test('accepts a Date', () => {
    expect(formatReferenceDate(new Date('2026-09-19'))).toBe('19 September 2026');
  });

  test.each([
    ['an empty string', ''],
    ['null', null],
    ['undefined', undefined],
    ['a part-filled date', '2026--10'],
    ['a date that is not real', '2026-02-31'],
    ['nonsense', 'not a date']
  ])('returns an empty string for %s so the message does not trail a bad date', (_label, value) => {
    expect(formatReferenceDate(value)).toBe('');
  });
});
