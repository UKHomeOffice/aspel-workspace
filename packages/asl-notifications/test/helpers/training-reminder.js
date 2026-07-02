const completeDate = '01 Aug 2026';
const establishmentName = 'University of Croydon';

const getTrainingType = roleType => roleType === 'nvs' ? 'NVS module' : 'NACWO mandatory training';

const getTrainingRecordLabel = roleType => roleType === 'nvs' ? 'module' : 'training';

const getTrainingRecordOwner = ({ roleType, isApplicant }) => {
  if (isApplicant) {
    return 'your';
  }
  return roleType === 'nvs' ? 'your' : 'their';
};

const buildTrainingReminderBody = ({ fullName, roleType, isApplicant = false }) => {
  const trainingType = getTrainingType(roleType);
  const trainingRecordLabel = getTrainingRecordLabel(roleType);
  const trainingRecordOwner = getTrainingRecordOwner({ roleType, isApplicant });

  return `${fullName}’s ${trainingType} is due to be completed by ${completeDate}.
Establishment name: ${establishmentName}
Once completed, ensure the ${trainingRecordLabel} is added to ${trainingRecordOwner} training record.`;
};

module.exports = {
  buildTrainingReminderBody,
  completeDate,
  establishmentName,
  getTrainingRecordLabel,
  getTrainingRecordOwner,
  getTrainingType
};
