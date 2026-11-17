const reports = require('../../../lib/reports/pil-reviews');

describe.each([
  ['upcoming', reports.pilReviews],
  ['completed', reports.completed]
])('%s PIL reviews', (type, reportProvider) => {
  it.each([
    ['preserves the legacy PIL number', 'LEGACY-123', 'LEGACY-123'],
    ['uses the profile number when the PIL number is null', null, 'I12345678'],
    ['uses the profile number when the PIL number is empty', '', 'I12345678']
  ])('%s', async (description, licenceNumber, expectedNumber) => {
    const pil = {
      licence_number: licenceNumber,
      profile_licence_number: 'I12345678',
      first_name: 'Test',
      last_name: 'Holder',
      establishment: 'Test establishment',
      status: 'active',
      review_date: '2026-12-01T00:00:00.000Z'
    };
    const builder = {
      select: jest.fn().mockReturnThis(),
      join: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(pil)
    };
    const report = reportProvider({ db: { asl: jest.fn().mockReturnValue(builder) } });

    let result;
    if (type === 'completed') {
      result = await report.parse({ pil_id: 'test-pil', updated_at: pil.review_date });
    } else {
      report.query();
      result = report.parse(pil);
    }

    expect(builder.select).toHaveBeenCalledWith('profiles.pil_licence_number AS profile_licence_number');
    expect(result).toEqual({
      licenceNumber: expectedNumber,
      establishment: 'Test establishment',
      licenceHolder: 'Test Holder',
      reviewDate: '2026-12-01',
      ...(type === 'completed' ? { status: 'active' } : {})
    });
  });
});
