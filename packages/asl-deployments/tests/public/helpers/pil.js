const completeSpecies = async browser => {
  await browser.$('summary=Small animals').click();
  await browser.$('label=Mice').click();
  await browser.$('label=Rats').click();
  await browser.$('summary=Other').click();
  await browser.$('.multi-input-item input').setValue('Jabu');
  await browser.$('button=Add another').click();
  await browser.$('.multi-input-item:last-of-type input').setValue('Babu');
  await browser.$('button=Continue').click();
};

export {
  completeSpecies
};
