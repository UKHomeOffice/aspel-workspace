export function trainingRecordHolder(licenceHolder, projectStatus) {
  if (!licenceHolder) {
    return null;
  }

  return {
    name: `${licenceHolder.firstName} ${licenceHolder.lastName}`,
    status: projectStatus === 'inactive' ? 'Prospective licence holder' : 'Licence holder'
  };
}
