import { loadDraftTraining } from '../../../../../pages/project-version/middleware/index';

describe('loadDraftTraining', () => {
  const buildReq = status => ({
    establishmentId: 'establishment-1',
    project: { id: 'project-1', licenceHolderId: 'holder-1' },
    version: { status, data: { title: 'Project', training: [{ id: 'stale' }] } },
    api: jest.fn().mockResolvedValue({ json: { data: [{ id: 'current' }] } })
  });

  it('uses the licence holder\'s current training record for a draft', async () => {
    const req = buildReq('draft');
    const next = jest.fn();

    await loadDraftTraining(req, {}, next);

    expect(req.api).toHaveBeenCalledWith(
      '/establishment/establishment-1/profile/holder-1/certificates',
      { query: { projectId: 'project-1' } }
    );
    expect(req.version.data).toEqual({ title: 'Project', training: [{ id: 'current' }] });
    expect(next).toHaveBeenCalledWith();
  });

  it.each(['submitted', 'granted'])('keeps the training snapshot on a %s version', status => {
    const req = buildReq(status);
    const next = jest.fn();

    loadDraftTraining(req, {}, next);

    expect(req.api).not.toHaveBeenCalled();
    expect(req.version.data.training).toEqual([{ id: 'stale' }]);
    expect(next).toHaveBeenCalledWith();
  });
});
