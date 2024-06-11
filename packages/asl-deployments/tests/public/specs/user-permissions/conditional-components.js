import { roles } from '@ukhomeoffice/asl-constants';
import assert from 'assert';
import _ from 'lodash';

const namedRoles = roles.map(r => r.toUpperCase());

const getTableRows = async() => {
  const rows = [];
  const trs = await browser.$$('table tbody tr');
  for (const tr of trs) {
    const child1 = await tr.$('td:nth-child(1)').getText();
    const child2 = await tr.$('td:nth-child(2)').getText();
    rows.push({
      name: child1,
      roles: child2.split(', ')
    });
  }
  return rows;
};

describe('User permissions', () => {

  describe('conditional components', () => {
    describe('Invite user link', () => {
      it('cannot be seen by basic user', async () => {
        await browser.withUser('basic');
        await browser.url('/establishments/8201/people');
        const link = await browser.$('a=Invite user');
        assert(!await link.isDisplayed());
      });

      it('cannot be seen by read user', async () => {
        await browser.withUser('read');
        await browser.url('/establishments/8201/people');
        const link = await browser.$('a=Invite user');
        assert(!await link.isDisplayed());
      });

      it('can be seen by admin user', async () => {
        await browser.withUser('holc');
        await browser.url('/establishments/8201/people');
        const link = await browser.$('a=Invite user');
        assert(await link.isDisplayed());
      });
    });

    describe('Create place link', () => {
      it('cannot be seen by read user', async () => {
        await browser.withUser('read');
        await browser.url('/establishments/8201/places');
        const link = await browser.$('a=Create approved area');
        assert(!await link.isDisplayed());
      });

      it('can be seen by admin user', async () => {
        await browser.withUser('holc');
        await browser.url('/establishments/8201/places');
        const link = await browser.$('a=Create approved area');
        assert(await link.isDisplayed());
      });
    });

    describe('dashboard links', () => {
      it('doesn\'t show SOP, PIL list or billing', async () => {
        await browser.withUser('basic');
        await browser.url('/establishments/8201');
        const links = await browser.$$('ul.panel-list li');
        assert.equal(links.length, 3);
        assert(await browser.$('a=Establishment details').isDisplayed());
        assert(await browser.$('a=People').isDisplayed());
        assert(await browser.$('a=Projects').isDisplayed());
        assert(!await browser.$('a=Approved areas').isDisplayed());
        assert(!await browser.$('a=Personal licences').isDisplayed());
        assert(!await browser.$('a=Licence fees').isDisplayed());
      });

      it('shows SOP and Personal licences but doesn\'t show licence fees if user is read', async () => {
        await browser.withUser('read');
        await browser.url('/establishments/8201');
        const links = await browser.$$('ul.panel-list li');
        assert.equal(links.length, 5);
        assert(await browser.$('a=Establishment details').isDisplayed());
        assert(await browser.$('a=People').isDisplayed());
        assert(await browser.$('a=Projects').isDisplayed());
        assert(await browser.$('a=Approved areas').isDisplayed());
        assert(await browser.$('a=Personal licences').isDisplayed());
        assert(!await browser.$('a=Licence fees').isDisplayed());
      });

      it('shows all links is user is admin', async () => {
        await browser.withUser('holc');
        await browser.url('/establishments/8201');
        const links = await browser.$$('ul.panel-list li');
        assert.equal(links.length, 7);
        assert(await browser.$('a=Establishment details').isDisplayed());
        assert(await browser.$('a=People').isDisplayed());
        assert(await browser.$('a=Projects').isDisplayed());
        assert(await browser.$('a=Approved areas').isDisplayed());
        assert(await browser.$('a=Personal licences').isDisplayed());
        assert(await browser.$('a=Licence fees').isDisplayed());
        assert(await browser.$('a=Returns of procedures').isDisplayed());
      });
    });
  });

  describe('limited data', () => {
    describe('profiles', () => {
      it('lists only named people and own profile for basic user', async () => {
        await browser.withUser('basic');
        await browser.url('/establishments/8201/people?rows=100');

        const rows = await getTableRows();

        const filtered = rows.filter(row =>
          !row.roles.some(val => namedRoles.includes(val) || val === 'Admin') && row.name !== 'Basic User');

        assert.ok(filtered.length === 0, 'No non-named people should be visible');
      });

      it('lists only the named people at the establishment being viewed', async () => {
        await browser.withUser('basic');
        await browser.url('/establishments/8201/people?rows=100');
        assert(!await browser.$('a=Roberto Patron').isDisplayed(), 'people with named roles only at other establishments should not be visible');
      });

      it('lists all profiles for read only users', async () => {
        await browser.withUser('read');
        await browser.url('/establishments/8201/people?rows=100');
        const rows = await getTableRows();

        const filtered = rows.filter(row =>
          !row.roles.some(val => namedRoles.includes(val) || val === 'Admin'));

        assert(filtered.length > 0);
      });

      it('lists all profiles for ntco users', async () => {
        await browser.withUser('ntco');
        await browser.url('/establishments/8201/people?rows=100');
        const rows = await getTableRows();

        const filtered = rows.filter(row =>
          !row.roles.some(val => namedRoles.includes(val) || val === 'Admin'));

        assert(filtered.length > 0);
      });

      it('lists only named people and own profile for ntco at other establishments', async () => {
        await browser.withUser('ntco');
        await browser.url('/establishments/8202/people?rows=100');
        const rows = await getTableRows();
        assert.ok(rows.length > 0, 'Some people should be visible');

        const filtered = rows.filter(row =>
          !row.roles.some(val => namedRoles.includes(val) || val === 'Admin') && row.name !== 'Neil Down');

        assert.ok(filtered.length === 0, 'No non-named people should be visible');
      });

      it('lists all profiles for admin users', async () => {
        await browser.withUser('holc');
        await browser.url('/establishments/8201/people?rows=100');
        const rows = await getTableRows();

        const filtered = rows.filter(row =>
          !row.roles.some(val => namedRoles.includes(val) || val === 'Admin') && row.name !== 'Neil Down');

        assert.ok(filtered.length > 0, 'At least 1 non-named person should be visible');
      });
    });

    describe('projects', () => {
      it('list only the users projects for basic users', async () => {
        let pplhs;
        await browser.withUser('basic');
        await browser.url('/establishments/8201/projects');
        assert(await browser.$('td=Basic user project').isDisplayed());

        pplhs = await Promise.all(await browser.$$('table tbody tr td.licenceHolder')
          .map(td => td.getText()));

        pplhs.forEach(pplh => assert.equal(pplh, 'Basic User'));

        await browser.$('a=Inactive').click();
        pplhs = await Promise.all(await browser.$$('table tbody tr td.licenceHolder')
          .map(td => td.getText()));

        pplhs.forEach(pplh => assert.equal(pplh, 'Basic User'));
      });

      it('list all projects for read only users', async () => {
        await browser.withUser('read');
        await browser.url('/establishments/8201/projects');

        const pplhs = await Promise.all(await browser.$$('table tbody tr td.licenceHolder')
          .map(td => td.getText()));
        assert.ok(_.uniq(pplhs).length > 1, 'Multiple users projects should be visible');
      });

      it('list all projects for admin users', async () => {
        await browser.withUser('holc');
        await browser.url('/establishments/8201/projects');

        const pplhs = await Promise.all(await browser.$$('table tbody tr td.licenceHolder')
          .map(td => td.getText()));
        assert.ok(_.uniq(pplhs).length > 1, 'Multiple users projects should be visible');
      });
    });
  });
});
