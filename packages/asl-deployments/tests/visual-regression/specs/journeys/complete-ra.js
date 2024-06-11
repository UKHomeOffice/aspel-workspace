module.exports = [
  () => {
    browser.withUser('holc');
    browser.url('/establishments/8201/projects');
    browser.$('a=Inactive').click();
    browser.$('a=RA due').click();
    browser.$('a=RA due nhp').click();
  },
  () => {
    browser.$('button=Start assessment').click();
  },
  () => {
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('a=Project aims').click();
    browser.$('input[name="continue-on-other-licence"][value="false"]').click();
    browser.$('summary=Tips on writing for the public').click();
    browser.$('summary=Show the project\'s projected aims').click();
    browser.$('[name="aims-achieved"]').completeRichText('I achieved my aims');
  },
  () => {
    browser.$('button=Continue').click();
    browser.$('summary=Show the project\'s projected aims').click();
    browser.$('input[name="complete"][value="true"]').click();
  },
  () => {
    browser.$('button=Continue').click();
    browser.$('a=Harms').click();
    browser.$('summary=Show the project\'s projected harms').click();
    browser.$('[name="actual-harms"]').completeRichText('What harms occurred');
  },
  () => {
    browser.$('button=Continue').click();
    browser.$('input[name="complete"][value="true"]').click();
    browser.$('button=Continue').click();
    browser.$('a=Replacement').click();
    browser.$('[name="replacement"]').completeRichText('What replacement occurred');
  },
  () => {
    browser.$('button=Continue').click();
    browser.$('input[name="complete"][value="true"]').click();
    browser.$('button=Continue').click();
    browser.$('a=Reduction').click();
    browser.$('summary=Show the project\'s planned reduction measures').click();
    browser.$('[name="reduction"]').completeRichText('What reduction occurred');
  },
  () => {
    browser.$('button=Continue').click();
    browser.$('input[name="complete"][value="true"]').click();
    browser.$('button=Continue').click();
    browser.$('a=Refinement').click();
    browser.$('summary=Show the project\'s planned refinement measures').click();
    browser.$('[name="refinement"]').completeRichText('What refinement occurred');
  },
  () => {
    browser.$('button=Continue').click();
    browser.$('input[name="complete"][value="true"]').click();
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('button=Continue').click();
  },
  () => {
    browser.$('input[name="ra-awerb-date-day"]').setValue('1');
    browser.$('input[name="ra-awerb-date-month"]').setValue('7');
    browser.$('input[name="ra-awerb-date-year"]').setValue('2021');
    browser.$('button=Endorse and submit now').click();
  }
];
