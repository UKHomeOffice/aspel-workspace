const { setPageTitle, prependPageTitle } = require('../../../../../pages/common/middleware/page-title');

const buildRes = (locals = {}) => ({
  locals: {
    static: { content: {} },
    ...locals
  }
});

describe('setPageTitle', () => {
  it('prepends the content pageTitle to the inherited title', () => {
    const req = {};
    const res = buildRes({
      pageTitle: 'Joe Bloggs - University of Croydon',
      static: { content: { pageTitle: 'Animal types' } }
    });
    const next = jest.fn();

    setPageTitle()(req, res, next);

    expect(res.locals.pageTitle).toBe('Animal types - Joe Bloggs - University of Croydon');
    expect(next).toHaveBeenCalled();
  });

  it('gives each page in a journey a distinct title (WCAG 2.4.2)', () => {
    const inherited = 'Joe Bloggs - University of Croydon';
    const titles = ['Animal types', 'Procedures', 'Training'].map(pageTitle => {
      const res = buildRes({ pageTitle: inherited, static: { content: { pageTitle } } });
      setPageTitle()({}, res, () => {});
      return res.locals.pageTitle;
    });

    expect(new Set(titles).size).toBe(titles.length);
  });

  it('accepts a literal label', () => {
    const res = buildRes({ pageTitle: 'Joe Bloggs' });
    setPageTitle('Revoke personal licence')({}, res, () => {});

    expect(res.locals.pageTitle).toBe('Revoke personal licence - Joe Bloggs');
  });

  it('accepts a function of req and res', () => {
    const req = { model: { status: 'active' } };
    const res = buildRes({
      pageTitle: 'Joe Bloggs',
      static: { content: { pil: { pageTitle: 'Apply', pageTitleAmend: 'Amend' } } }
    });

    setPageTitle((req, res) => req.model.status === 'active'
      ? res.locals.static.content.pil.pageTitleAmend
      : res.locals.static.content.pil.pageTitle
    )(req, res, () => {});

    expect(res.locals.pageTitle).toBe('Amend - Joe Bloggs');
  });

  it('renders mustache templates against static and model', () => {
    const res = buildRes({
      pageTitle: 'Joe Bloggs',
      static: { content: { pageTitle: 'Suspend {{licenceType}} licence' }, licenceType: 'personal' }
    });

    setPageTitle()({}, res, () => {});

    expect(res.locals.pageTitle).toBe('Suspend personal licence - Joe Bloggs');
  });

  it('leaves the inherited title alone when no label is available', () => {
    const res = buildRes({ pageTitle: 'Joe Bloggs - University of Croydon' });
    const next = jest.fn();

    setPageTitle()({}, res, next);

    expect(res.locals.pageTitle).toBe('Joe Bloggs - University of Croydon');
    expect(next).toHaveBeenCalled();
  });

  it('sets the title on pages with no inherited context', () => {
    const res = buildRes({ static: { content: { pageTitle: 'Training courses' } } });
    setPageTitle()({}, res, () => {});

    expect(res.locals.pageTitle).toBe('Training courses');
  });
});

describe('prependPageTitle', () => {
  it('is a no-op for an empty label', () => {
    const res = buildRes({ pageTitle: 'Joe Bloggs' });
    prependPageTitle({}, res, '');

    expect(res.locals.pageTitle).toBe('Joe Bloggs');
  });

  it('composes success-page outcomes ahead of the journey context', () => {
    const res = buildRes({ pageTitle: 'Joe Bloggs - University of Croydon' });
    prependPageTitle({}, res, 'Submitted - Personal licence application');

    expect(res.locals.pageTitle)
      .toBe('Submitted - Personal licence application - Joe Bloggs - University of Croydon');
  });
});
