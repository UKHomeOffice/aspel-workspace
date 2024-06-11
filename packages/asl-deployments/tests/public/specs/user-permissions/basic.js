import assert from 'assert';

const ADMIN_ID = '5b7bad13-f34b-4959-bd08-c6067ae2fcdd';
const READ_ID = 'e1ef893c-0766-4ccb-b1f8-d13238deac23';
const BASIC_ID = '304235c0-1a83-49f0-87ca-b11b1ad1e147';
const MIXED_ID = 'f8054102-dbbc-4655-b49e-e17d36a635de';

const EST_1_PLACE_ID = '98688fb2-a4fe-433f-b23c-f5cda2c1a190';
const EST_2_PLACE_ID = 'b0a1563c-3f94-4d26-8711-9db266b588b5';

const BASIC_USER_PROJECT = 'e3310c1a-5fe0-4e59-95b8-6410d8fd8031';
const ADMIN_USER_PROJECT = '6b9b7471-396e-47fe-a98f-da0c76e0a26c';

const runTest = (url, allowed = true, message = 'You do not have permission to access this page') => {
  it(`${allowed ? 'can' : 'cannot'} visit ${url}`, async () => {
    await browser.url(url);
    if (allowed) {
      assert(!await browser.$(`h1*=${message}`).isDisplayed(), 'Page should be accessible');
    } else {
      assert(await browser.$(`h1*=${message}`).isDisplayed(), 'Page should not be accessible');
    }
  });
};

const runTests = tests => {
  for (const test of tests) {
    runTest.apply(null, test);
  }
};

describe('User permissions', () => {
  describe('page access', () => {
    describe('basic', () => {
      before(async () => {
        await browser.withUser('basic');
      });

      const tests = [
        // authorised
        ['/e/8201'],
        ['/e/8201/details'],
        ['/e/8201/people'],
        [`/e/8201/people/${BASIC_ID}`],
        [`/e/8201/people/${ADMIN_ID}`],
        ['/e/8201/projects'],
        [`/e/8201/projects/${BASIC_USER_PROJECT}`],

        ['/e/8202'],
        ['/e/8202/details'],
        ['/e/8202/people'],
        [`/e/8202/people/${BASIC_ID}`],
        [`/e/8202/people/${ADMIN_ID}`],
        ['/e/8202/projects'],

        // unauthorised
        ['/e/8202/details/pdf', false],
        ['/e/8201/places', false],
        ['/e/8201/places/create', false],
        [`/e/8201/places/${EST_1_PLACE_ID}`, false],
        [`/e/8201/places/${EST_1_PLACE_ID}/edit`, false],
        [`/e/8201/places/${EST_1_PLACE_ID}/delete`, false],
        ['/e/8201/people/invite', false],
        [`/e/8201/people/${READ_ID}`, false, 'Page not found'],
        [`/e/8201/people/${MIXED_ID}`, false, 'Page not found'],
        [`/e/8201/projects/${ADMIN_USER_PROJECT}`, false, 'Page not found'],

        ['/e/8202/places', false],
        ['/e/8202/places/create', false],
        [`/e/8202/places/${EST_2_PLACE_ID}`, false],
        [`/e/8202/places/${EST_2_PLACE_ID}/edit`, false],
        [`/e/8202/places/${EST_2_PLACE_ID}/delete`, false],
        ['/e/8202/people/invite', false],
        [`/e/8202/people/${READ_ID}`, false, 'Page not found'],
        [`/e/8202/people/${MIXED_ID}`, false, 'Page not found']
      ];

      runTests(tests);

      it('cannot download PDF document on establishment details page', async () => {
        await browser.url('/e/8201/details');
        assert.ok(!await browser.$('.document-header').$('a=View downloads').isDisplayed(), 'Download options should not appear');
      });

    });

  });
});
