import assert from 'assert';

describe('ASRU User Admin', () => {

  describe('as an administrator', () => {

    before(async() => {
      await browser.withUser('asruadmin');
    });
    beforeEach(async() => {
      await browser.url('/');
    });

    it('Can add unaffiliated users to ASRU', async() => {
      await browser.$('a=People').click();
      await browser.$('.search-box input[type="text"]').setValue('unaffiliated user');
      await browser.$('.search-box button').click();

      await browser.$('table:not(.loading)').waitForExist();

      await browser.$('table').$('a=Unaffiliated User').click();

      await browser.$('button=Add user to ASRU').click();

      await browser.waitForSuccess();

      assert(await browser.$('button=Edit').isDisplayed());
      assert(await browser.$('button=Remove user from ASRU').isDisplayed());
    });

    it('Can modify the roles of existing ASRU users', async() => {
      await browser.$('a=Staff directory').click();
      await browser.$('.search-box input[type="text"]').setValue('inspector');
      await browser.$('.search-box button').click();

      await browser.$('table:not(.loading)').waitForExist();

      await browser.$('table').$('a=Inspector Gadget').click();

      const roles = await browser.$$('.asru-roles li')
        .map(li => li.getText());

      assert.deepEqual(roles, ['Inspector']);

      await browser.$('button=Edit').click();
      await browser.$('input[name="roles"][value="asruAdmin"]').click();
      await browser.$('input[name="roles"][value="asruRops"]').click();

      await browser.$('button[type="submit"]').click();

      await browser.waitForSuccess();

      const newRoles = await browser.$$('.asru-roles li')
        .map(li => li.getText());

      assert.deepEqual(newRoles, ['Admin', 'Inspector', 'Returns analyst']);
    });

    it('Cannot modify own permissions', async() => {
      await browser.$('a=Staff directory').click();
      await browser.$('.search-box input[type="text"]').setValue('admin');
      await browser.$('.search-box button').click();

      await browser.$('table:not(.loading)').waitForExist();

      await browser.$('table').$('a=Asru Admin').click();

      const roles = await browser.$$('.asru-roles li')
        .map(li => li.getText());

      assert.deepEqual(roles, ['Admin']);

      assert(!await browser.$('button=Edit').isDisplayed());
      assert(!await browser.$('button=Remove user from ASRU').isDisplayed());
    });

    it('Can remove all permissions', async() => {
      await browser.$('a=Staff directory').click();
      await browser.$('.search-box input[type="text"]').setValue('inspector');
      await browser.$('.search-box button').click();

      await browser.$('table:not(.loading)').waitForExist();

      await browser.$('table').$('a=Inspector Gadget').click();

      const roles = await browser.$$('.asru-roles li')
        .map(li => li.getText());

      assert.deepEqual(roles, ['Admin', 'Inspector', 'Returns analyst']);

      await browser.$('button=Edit').click();
      await browser.$('input[name="roles"][value="asruAdmin"]').click();
      await browser.$('input[name="roles"][value="asruInspector"]').click();
      await browser.$('input[name="roles"][value="asruRops"]').click();

      await browser.$('button[type="submit"]').click();

      await browser.waitForSuccess();

      const newRoles = await browser.$$('.asru-roles li')
        .map(li => li.getText());

      assert.deepEqual(newRoles, []);

      // reset back to original state
      await browser.$('button=Edit').click();
      await browser.$('input[name="roles"][value="asruInspector"]').click();

      await browser.$('button[type="submit"]').click();

    });
  });

  describe('as a non-administrator', () => {

    before(async() => {
      await browser.withUser('licensing');
    });
    beforeEach(async() => {
      await browser.url('/');
    });

    it('Cannot add unaffiliated users to ASRU', async() => {
      await browser.$('a=People').click();
      await browser.$('.search-box input[type="text"]').setValue('unaffiliated user');
      await browser.$('.search-box button').click();

      await browser.$('table:not(.loading)').waitForExist();

      await browser.$('table').$('a=Unaffiliated User').click();

      assert(!await browser.$('button=Add user to ASRU').isDisplayed());
    });

    it('Cannot modify the roles of existing ASRU users', async() => {
      await browser.$('a=Staff directory').click();
      await browser.$('.search-box input[type="text"]').setValue('inspector');
      await browser.$('.search-box button').click();

      await browser.$('table:not(.loading)').waitForExist();

      await browser.$('table').$('a=Inspector Gadget').click();

      assert(!await browser.$('button=Edit').isDisplayed());
      assert(!await browser.$('button=Remove user from ASRU').isDisplayed());
    });
  });

  describe('Former ASRU staff', () => {
    before(async() => {
      await browser.withUser('asruadmin');
    });

    beforeEach(async() => {
      await browser.url('/');
    });

    const asruTemps = ['Asru Temp 1', 'Asru Temp 2', 'Asru Temp 3', 'Asru Temp 4'];

    it('can add some temporary staff to ASRU', async() => {
      for (const name of asruTemps) {
        await browser.$('a=People').click();
        await browser.$('.search-box input[type="text"]').setValue(name);
        await browser.$('.search-box button').click();
        await browser.$('table:not(.loading)').waitForExist();
        await browser.$('table').$(`a=${name}`).click();
        await browser.$('button=Add user to ASRU').click();
        await browser.waitForSuccess();
        await browser.url('/');
      }

      await browser.$('a=Staff directory').click();
      await browser.$('.search-box input[type="text"]').setValue('Asru temp');
      await browser.$('.search-box button').click();
      await browser.$('table:not(.loading)').waitForExist();

      for (const name of asruTemps) {
        assert.ok(await browser.$(`a=${name}`).isDisplayed());
      }
    });

    it('can remove temporary staff from ASRU', async() => {
      for (const name of asruTemps) {
        await browser.$('a=Staff directory').click();
        await browser.$('.search-box input[type="text"]').setValue(name);
        await browser.$('.search-box button').click();
        await browser.$('table:not(.loading)').waitForExist();
        await browser.$('table').$(`a=${name}`).click();
        await browser.$('button=Remove user from ASRU').click();
        await browser.waitForSuccess();
      }

      await browser.$('a=Staff directory').click();
      await browser.$('.search-box input[type="text"]').setValue('Asru temp');
      await browser.$('.search-box button').click();
      await browser.$('table:not(.loading)').waitForExist();

      for (const name of asruTemps) {
        assert.ok(!await browser.$(`a=${name}`).isDisplayed());
      }

      await browser.$('a=Former staff').click();
      await browser.$('table:not(.loading)').waitForExist();

      for (const name of asruTemps) {
        assert.ok(await browser.$(`a=${name}`).isDisplayed());
      }
    });

  });

});
