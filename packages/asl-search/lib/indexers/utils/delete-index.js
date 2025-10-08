const { get } = require('lodash');

const wait = (t = 30000) => new Promise(resolve => setTimeout(resolve, t));

const reset = async (client, index, options = {}) => {
  try {
    await client.indices.delete({ index });
  } catch (e) {
    const type = get(e, 'body.error.type');
    if (type === 'index_not_found_exception') return;
    if (type === 'snapshot_in_progress_exception' && !options.retry) {
      await wait(30000);
      return reset(client, index, { retry: true });
    }
    throw e;
  }
};

module.exports = reset;
