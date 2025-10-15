const cache = {};
let cacheSize = 0;
const MAX_CACHE_SIZE = 10000; // Prevent memory overflow

const clean = () => {
  const now = Date.now();
  Object.keys(cache).forEach(key => {
    if (cache[key].expires < now) {
      delete cache[key];
      cacheSize--;
    }
  });

  // Emergency cleanup if cache grows too large
  if (cacheSize > MAX_CACHE_SIZE) {
    const keys = Object.keys(cache);
    for (let i = 0; i < Math.floor(keys.length / 2); i++) {
      delete cache[keys[i]];
      cacheSize--;
    }
  }
};

const cleanModel = data => data ? data.toJSON() : null;

setInterval(clean, 300000);

module.exports = (settings = {}) => {
  settings.ttl = settings.ttl || 300000;

  const query = (Model, id, columns) => {
    const key = `${Model.tableName}:${id}`;
    if (cache[key] && cache[key].expires > Date.now()) {
      return Promise.resolve(cache[key].result);
    }

    return Model.queryWithDeleted().select(columns || '*').findById(id)
      .then(result => cleanModel(result, columns))
      .then(result => {
        if (cacheSize < MAX_CACHE_SIZE) {
          cache[key] = {
            expires: Date.now() + settings.ttl,
            result
          };
          cacheSize++;
        }
        return result;
      })
      .catch(error => {
        console.error(`Cache query failed for ${key}:`, error.message);
        return null; // Return null instead of failing
      });
  };

  return { query };
};
