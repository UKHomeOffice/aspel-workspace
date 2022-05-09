const start = process.hrtime();
const App = require('./lib/app');
const settings = require('./config');

const server = App(settings).listen(settings.port, (err, result) => {
  if (err) {
    return console.error(err);
  }
  const end = process.hrtime(start);
  console.log(`Listening on port ${server.address().port} after ${end[0]} seconds`);
});
