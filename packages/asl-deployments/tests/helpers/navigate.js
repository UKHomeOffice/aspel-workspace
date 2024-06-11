export const viewCase = async (caseId) => {
  const closestTrCell = await browser.$(`td=${caseId}`).closest('tr');
  const viewCaseLink = await closestTrCell.$('a=View case');
  await viewCaseLink.click();
};

export const editEnforcementFlag = async (personName) => {
  const editEnforcementFlagButton = await browser.$(
    `//a[normalize-space(text())="${personName}"]/following::a[span/text()="Edit enforcement flag"]`
  );
  await editEnforcementFlagButton.click();
};
