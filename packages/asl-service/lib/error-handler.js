const StatsD = require('hot-shots');
const stats = new StatsD();

module.exports = settings => {
  return (error, req, res, next) => {
    const status = error.status || 500;
    res.status(status);
    if (req.log && status > 499) {
      req.log('error', {
        ...error,
        status,
        message: error.message,
        stack: error.stack,
        method: req.method,
        url: req.originalUrl
      });
    }
    if (settings.errorEvent) {
      const event = `${settings.errorEvent}.${status}`;
      console.log(`Logging event "${event}" to statsd`);
      stats.increment(event);
    }

    if (!settings.verboseErrors && status > 499) {
      error.message = 'Something went wrong';
      error.stack = null;
    }

    if (req.accepts('html') && settings.template) {
      const Component = error.template || settings.template;
      return res.render(res.layout || settings.layout || 'layout', {
        Component: Component.default || Component,
        scripts: [],
        error
      });
    }
    // Error thrown in AJAX call
    res.json({ message: error.message });
  };
};
