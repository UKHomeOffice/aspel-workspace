const mustache = require('mustache');
const content = require('../../lib/dispatcher/content');

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

const getSubjectPerspective = ({ fullName, isApplicant = false }) => ({
  fullNameInSubject: isApplicant ? 'You' : fullName,
  need: 'needs',
  their: isApplicant ? 'your' : 'their'
});

const getTemplateVars = ({ fullName, roleType, isApplicant = false }) => ({
  fullName,
  type: getTrainingType(roleType),
  completeDate,
  name: establishmentName,
  trainingRecordLabel: getTrainingRecordLabel(roleType),
  trainingRecordOwner: getTrainingRecordOwner({ roleType, isApplicant }),
  ...getSubjectPerspective({ fullName, isApplicant })
});

const buildTrainingReminderBody = ({ fullName, roleType, isApplicant = false }) => {
  const { type, trainingRecordLabel, trainingRecordOwner } = getTemplateVars({ fullName, roleType, isApplicant });

  return `${fullName}’s ${type} is due to be completed by ${completeDate}.
Establishment name: ${establishmentName}
Once completed, ensure the ${trainingRecordLabel} is added to ${trainingRecordOwner} training record.`;
};

const buildTrainingReminderSubject = ({ fullName, roleType, isApplicant = false }) => {
  return mustache.render(
    content.subject['training-due-reminder'],
    getTemplateVars({ fullName, roleType, isApplicant })
  );
};

module.exports = {
  buildTrainingReminderBody,
  buildTrainingReminderSubject,
  completeDate,
  establishmentName,
  getTrainingRecordLabel,
  getTrainingRecordOwner,
  getTrainingType,
  getTemplateVars
};
