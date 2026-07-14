const loadTemplate = require('../../lib/dispatcher/load-template');
const { assertNormalisedOutput } = require('../helpers/email-content');
const {
  buildTrainingReminderBody,
  completeDate,
  establishmentName,
  getTrainingRecordLabel,
  getTemplateVars,
  getTrainingType
} = require('../helpers/training-reminder');

const trainingTemplateCases = [
  {
    templateName: 'training-due-reminder',
    roleType: 'nacwo',
    debugEmail: false,
    title: 'training-due-reminder NACWO template'
  },
  {
    templateName: 'training-due-reminder',
    roleType: 'nvs',
    debugEmail: false,
    title: 'training-due-reminder NVS template'
  }
];

// Test layer: direct template rendering only.
// This suite covers dispatcher templates for training notifications.
describe('Dispatcher training templates - direct file rendering', () => {
  trainingTemplateCases.forEach(({ templateName, roleType, debugEmail, title }) => {
    it(`renders template file ${templateName}.js`, async () => {
      const vars = {
        fullName: 'Basic User',
        type: getTrainingType(roleType),
        completeDate,
        name: establishmentName,
        trainingRecordLabel: getTrainingRecordLabel(roleType),
        their: getTemplateVars({ fullName: 'Basic User', roleType, isApplicant: false }).their
      };
      const expected = buildTrainingReminderBody({
        fullName: 'Basic User',
        roleType,
        isApplicant: false
      });
      const result = await loadTemplate(templateName, vars);

      assertNormalisedOutput({
        actual: result,
        expected,
        debugEmail,
        title
      });
    });
  });
});
