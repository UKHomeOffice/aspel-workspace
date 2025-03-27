const { get, set, isUndefined } = require('lodash');

module.exports = (settings, model) => {
  const isAsru = get(model, 'meta.user.profile.asruUser');
  const payload = get(model, 'meta.payload.meta', {});

  if (isAsru && !isUndefined(payload.restrictions)) {
    const data = get(model, 'data');
    set(data, 'data.restrictions', payload.restrictions);

    if (isAsru && !isUndefined(payload.conditions)) {
      set(data, 'data.conditions', payload.conditions);
      set(data, 'data.reminder', payload.reminders);
    }

    return model.update(data);
  }

  return Promise.resolve();
};
