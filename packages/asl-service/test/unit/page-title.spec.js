const assert = require('assert');
const path = require('path');
const express = require('express');
const page = require('../../ui/page');
const { setPageTitle, prependPageTitle } = require('../../ui/page-title');

const buildRes = (locals = {}) => ({
  locals: {
    static: { content: {} },
    ...locals
  }
});

describe('prependPageTitle', () => {
  it('prepends the label to the inherited title', () => {
    const res = buildRes({ pageTitle: 'Joe Bloggs - University of Croydon' });
    prependPageTitle({}, res, 'Animal types');

    assert.equal(res.locals.pageTitle, 'Animal types - Joe Bloggs - University of Croydon');
  });

  it('sets the title on pages with no inherited context', () => {
    const res = buildRes();
    prependPageTitle({}, res, 'Training courses');

    assert.equal(res.locals.pageTitle, 'Training courses');
  });

  it('renders mustache templates against static, model and profile', () => {
    const res = buildRes({ pageTitle: 'Joe Bloggs', static: { content: {}, licenceType: 'personal' } });
    prependPageTitle({ model: { title: 'Course A' } }, res, 'Suspend {{licenceType}} licence - {{model.title}}');

    assert.equal(res.locals.pageTitle, 'Suspend personal licence - Course A - Joe Bloggs');
  });

  it('is a no-op for an empty or non-string label', () => {
    ['', undefined, { default: 'Not a string' }].forEach(label => {
      const res = buildRes({ pageTitle: 'Joe Bloggs' });
      prependPageTitle({}, res, label);

      assert.equal(res.locals.pageTitle, 'Joe Bloggs');
    });
  });
});

describe('setPageTitle', () => {
  it('accepts a literal label', () => {
    const res = buildRes({ pageTitle: 'Joe Bloggs' });
    let called = false;
    setPageTitle('Revoke personal licence')({}, res, () => { called = true; });

    assert.equal(res.locals.pageTitle, 'Revoke personal licence - Joe Bloggs');
    assert.ok(called);
  });

  it('accepts a function of req and res', () => {
    const res = buildRes({ pageTitle: 'Joe Bloggs' });
    setPageTitle(req => req.model.status === 'active' ? 'Amend' : 'Apply')({ model: { status: 'active' } }, res, () => {});

    assert.equal(res.locals.pageTitle, 'Amend - Joe Bloggs');
  });
});

describe('page() titles', () => {
  let server;
  let baseUrl;

  before(done => {
    const app = express();
    // stands in for a parent router (e.g. profile) that sets shared title context
    app.use((req, res, next) => {
      res.locals.static = { content: {}, licenceType: 'personal' };
      res.locals.pageTitle = req.query.inherited;
      next();
    });
    const titled = page({
      root: path.resolve(__dirname, '../fixtures/titled-page'),
      paths: ['/confirm', '/success']
    });
    titled.use((req, res) => res.json({ pageTitle: res.locals.pageTitle ?? null }));
    app.use('/page', titled);

    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}/page`;
      done();
    });
  });

  after(done => server.close(done));

  const titleFor = async url => (await (await fetch(`${baseUrl}${url}`)).json()).pageTitle;

  it('prepends content.pageTitle to a title set by a parent router', async () => {
    assert.equal(
      await titleFor('/?inherited=Joe%20Bloggs%20-%20University%20of%20Croydon'),
      'Revoke personal licence - Joe Bloggs - University of Croydon'
    );
  });

  it('uses content.pageTitle on its own when nothing is inherited', async () => {
    assert.equal(await titleFor('/'), 'Revoke personal licence');
  });

  it('resolves per-path content and renders mustache', async () => {
    assert.equal(
      await titleFor('/confirm?inherited=Joe%20Bloggs'),
      'Confirm personal licence revocation - Joe Bloggs'
    );
  });

  it('does not carry the index page title onto paths without their own content', async () => {
    assert.equal(await titleFor('/success?inherited=Joe%20Bloggs'), 'Joe Bloggs');
  });
});
