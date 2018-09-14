const assert = require('assert');

const ADMIN_ID = '5b7bad13-f34b-4959-bd08-c6067ae2fcdd';
const READ_ID = 'e1ef893c-0766-4ccb-b1f8-d13238deac23';
const BASIC_ID = '304235c0-1a83-49f0-87ca-b11b1ad1e147';
const MIXED_ID = 'f8054102-dbbc-4655-b49e-e17d36a635de';

const EST_1_PLACE_ID = '98688fb2-a4fe-433f-b23c-f5cda2c1a190';
const EST_2_PLACE_ID = 'b0a1563c-3f94-4d26-8711-9db266b588b5';

const runTest = (url, allowed = true, message = 'Unauthorised') => {
  it(`${allowed ? 'can' : 'cannot'} visit ${url}`, () => {
    browser.url(url);
    const title = browser.getText('h1');
    assert(title.includes(message) !== allowed)
  });
};

const runTests = tests => {
  tests.forEach(test => {
    runTest.apply(null, test);
  });
};

describe('User permissions', () => {
  describe('page access', () => {
    describe('basic', () => {
      beforeEach(() => {
        browser.withUser('basic');
      });

      const tests = [
        // authorised
        ['/e/8201'],
        ['/e/8201/details'],
        ['/e/8201/people'],
        [`/e/8201/people/${BASIC_ID}`],
        [`/e/8201/people/${ADMIN_ID}`],
        ['/e/8201/projects'],

        ['/e/8202'],
        ['/e/8202/details'],
        ['/e/8202/people'],
        [`/e/8201/people/${BASIC_ID}`],
        [`/e/8201/people/${ADMIN_ID}`],
        ['/e/8202/projects'],

        // unauthorised
        ['/e/8201/places', false],
        ['/e/8201/places/create', false],
        [`/e/8201/places/${EST_1_PLACE_ID}`, false],
        [`/e/8201/places/${EST_1_PLACE_ID}/edit`, false],
        [`/e/8201/places/${EST_1_PLACE_ID}/delete`, false],
        ['/e/8201/people/invite', false],
        [`/e/8201/people/${READ_ID}`, false, 'Not found'],
        [`/e/8201/people/${MIXED_ID}`, false, 'Not found'],

        ['/e/8202/places', false],
        ['/e/8202/places/create', false],
        [`/e/8202/places/${EST_2_PLACE_ID}`, false],
        [`/e/8202/places/${EST_2_PLACE_ID}/edit`, false],
        [`/e/8202/places/${EST_2_PLACE_ID}/delete`, false],
        ['/e/8202/people/invite', false],
        [`/e/8202/people/${READ_ID}`, false, 'Not found'],
        [`/e/8202/people/${MIXED_ID}`, false, 'Not found']
      ];

      runTests(tests);
    });

    describe('read', () => {
      beforeEach(() => {
        browser.withUser('read');
      });

      const tests = [
        //authorised
        ['/e/8201'],
        ['/e/8201/details'],
        ['/e/8201/people'],
        [`/e/8201/people/${READ_ID}`],
        [`/e/8201/people/${ADMIN_ID}`],
        [`/e/8201/people/${BASIC_ID}`],
        [`/e/8201/people/${MIXED_ID}`],
        ['/e/8201/projects'],
        ['/e/8201/places'],
        [`/e/8201/places/${EST_1_PLACE_ID}`],

        ['/e/8202'],
        ['/e/8202/details'],
        ['/e/8202/people'],
        [`/e/8202/people/${READ_ID}`],
        [`/e/8202/people/${ADMIN_ID}`],
        [`/e/8202/people/${BASIC_ID}`],
        [`/e/8202/people/${MIXED_ID}`],
        ['/e/8202/projects'],
        ['/e/8202/places'],
        [`/e/8202/places/${EST_2_PLACE_ID}`],

        // unauthorised
        [`/e/8201/places/${EST_1_PLACE_ID}/edit`, false],
        [`/e/8201/places/${EST_1_PLACE_ID}/delete`, false],
        ['/e/8201/places/create', false],
        ['/e/8201/people/invite', false],

        [`/e/8202/places/${EST_2_PLACE_ID}/edit`, false],
        [`/e/8202/places/${EST_2_PLACE_ID}/delete`, false],
        ['/e/8202/places/create', false],
        ['/e/8202/people/invite', false]
      ];

      runTests(tests);
    });

    describe('admin', () => {
      beforeEach(() => {
        browser.withUser('holc');
      });

      const tests = [
        // authorised
        ['/e/8201'],
        ['/e/8201/details'],
        ['/e/8201/people'],
        [`/e/8201/people/${BASIC_ID}`],
        [`/e/8201/people/${READ_ID}`],
        [`/e/8201/people/${MIXED_ID}`],
        [`/e/8201/people/${ADMIN_ID}`],
        ['/e/8201/people/invite'],
        ['/e/8201/projects'],
        ['/e/8201/places'],
        ['/e/8201/places/create'],
        [`/e/8201/places/${EST_1_PLACE_ID}`],
        [`/e/8201/places/${EST_1_PLACE_ID}/edit`],
        [`/e/8201/places/${EST_1_PLACE_ID}/delete`],

        ['/e/8202'],
        ['/e/8202/details'],
        ['/e/8202/people'],
        [`/e/8202/people/${BASIC_ID}`],
        [`/e/8202/people/${READ_ID}`],
        [`/e/8202/people/${MIXED_ID}`],
        [`/e/8202/people/${ADMIN_ID}`],
        ['/e/8202/people/invite'],
        [`/e/8202/people/${ADMIN_ID}`],
        ['/e/8202/projects'],
        ['/e/8202/places'],
        ['/e/8202/places/create'],
        [`/e/8202/places/${EST_2_PLACE_ID}`],
        [`/e/8202/places/${EST_2_PLACE_ID}/edit`],
        [`/e/8202/places/${EST_2_PLACE_ID}/delete`]
      ];

      runTests(tests);
    });
  });

  describe('conditional components', () => {
    describe('Invite user link', () => {
      it('cannot be seen by basic user', () => {
        browser.withUser('basic');
        browser.url('/e/8201/people');
        const link = browser.$('a=Invite user');
        assert(!link.isExisting());
      });

      it('cannot be seen by read user', () => {
        browser.withUser('read');
        browser.url('/e/8201/people');
        const link = browser.$('a=Invite user');
        assert(!link.isExisting());
      });

      it('can be seen by admin user', () => {
        browser.withUser('holc');
        browser.url('/e/8201/people');
        const link = browser.$('a=Invite user');
        assert(link.isExisting());
      });
    });

    describe('Create place link', () => {
      it('cannot be seen by read user', () => {
        browser.withUser('read');
        browser.url('/e/8201/places');
        const link = browser.$('a=Create approved area');
        assert(!link.isExisting());
      });

      it('can be seen by admin user', () => {
        browser.withUser('holc');
        browser.url('/e/8201/places');
        const link = browser.$('a=Create approved area');
        assert(link.isExisting());
      });
    });

    describe('dashboard links', () => {
      it('shows 3 links if user is basic', () => {
        browser.withUser('basic');
        browser.url('/e/8201');
        const links = browser.$$('ul.dashboard li');
        assert.equal(links.length, 3);
        assert(browser.$('a=Establishment details').isExisting())
        assert(browser.$('a=People').isExisting())
        assert(browser.$('a=Projects').isExisting())
        assert(!browser.$('a=Licensed premises').isExisting())
      });

      it('shows 4 links if user is read', () => {
        browser.withUser('read');
        browser.url('/e/8201');
        const links = browser.$$('ul.dashboard li');
        assert.equal(links.length, 4);
        assert(browser.$('a=Establishment details').isExisting())
        assert(browser.$('a=People').isExisting())
        assert(browser.$('a=Projects').isExisting())
        assert(browser.$('a=Licensed premises').isExisting())
      });

      it('shows 4 links if user is holc', () => {
        browser.withUser('holc');
        browser.url('/e/8201');
        const links = browser.$$('ul.dashboard li');
        assert.equal(links.length, 4);
        assert(browser.$('a=Establishment details').isExisting())
        assert(browser.$('a=People').isExisting())
        assert(browser.$('a=Projects').isExisting())
        assert(browser.$('a=Licensed premises').isExisting())
      });
    });
  });

  describe('limited data', () => {
    describe('profiles', () => {
      it('lists only named people and own profile for basic user', () => {
        browser.withUser('basic');
        browser.url('/e/8201/people?rows=100');
        const rows = browser.$$('table tbody tr');
        assert.deepEqual(rows.length, 13);
        assert(browser.$('td=Basic User').isExisting());
        assert(browser.$('td=Leonard Martin').isExisting());
        assert(!browser.$('td=Read Only').isExisting());
      });

      it('lists all profiles for read only users', () => {
        browser.withUser('read');
        browser.url('/e/8201/people?rows=100');
        const rows = browser.$$('table tbody tr');
        assert.deepEqual(rows.length, 95);
        assert(browser.$('td=Read Only').isExisting());
        assert(browser.$('td=Leonard Martin').isExisting());
        assert(browser.$('td=Basic User').isExisting());
      });

      it('lists all profiles for admin users', () => {
        browser.withUser('holc');
        browser.url('/e/8201/people?rows=100');
        const rows = browser.$$('table tbody tr');
        assert.deepEqual(rows.length, 95);
        assert(browser.$('td=Read Only').isExisting());
        assert(browser.$('td=Leonard Martin').isExisting());
        assert(browser.$('td=Basic User').isExisting());
      });
    });

    describe('projects', () => {
      it('list only the users projects for basic users', () => {
        browser.withUser('basic');
        browser.url('/e/8201/projects');
        const rows = browser.$$('table tbody tr');
        assert.deepEqual(rows.length, 1);
        assert(browser.$('td=Basic user project').isExisting());
      });

      it('list all projects for read only users', () => {
        browser.withUser('read');
        browser.url('/e/8201/projects?rows=100');
        const rows = browser.$$('table tbody tr');
        assert.deepEqual(rows.length, 18);
      });

      it('list only the users projects for admin users', () => {
        browser.withUser('holc');
        browser.url('/e/8201/projects?rows=100');
        const rows = browser.$$('table tbody tr');
        assert.deepEqual(rows.length, 18);
      });
    });
  });
});
