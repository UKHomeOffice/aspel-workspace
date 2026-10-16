const { get } = require('lodash');
const dayJs = require('@ukhomeoffice/asl-components/dayjs');
const completeAndCorrect = require('../../decorators/deadline/complete-and-correct');

const { addWorkingDaysIso } = dayJs;

const STANDARD_DEADLINE = 40;
const EXTENDED_DEADLINE = 55;

module.exports = () => {
  return model => {
    const type = get(model, 'data.model');
    const action = get(model, 'data.action');
    const isAmendment = get(model, 'data.modelData.status') !== 'inactive';

    if (type === 'project' && action === 'grant' && !isAmendment && completeAndCorrect(model.data.meta)) {
      const deadline = {
        standard: addWorkingDaysIso(model.updatedAt, STANDARD_DEADLINE),
        extended: addWorkingDaysIso(model.updatedAt, EXTENDED_DEADLINE),
        isExtended: false,
        isExtendable: true
      };

      return model.patch({ deadline });
    }

    return Promise.resolve();
  };
};
