const App = require('./src/server/app');
const settings = require('./config');

const server = App(settings).listen(settings.port, (err, result) => {
  if (err) {
    return console.error(err);
  }
  console.log(`Listening on port ${server.address().port}`);
});
