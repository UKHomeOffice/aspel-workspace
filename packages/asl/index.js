const App = require('./lib/app');

const settings = {
  secret: process.env.SESSION_SECRET,
  port: process.env.PORT || 8080
};

const server = App(settings).listen(settings.port, (err, result) => {
  console.log(`Listening on port ${server.address().port}`);
});

process.on('SIGINT', () => {

  if (server.listening) {
    console.log('Attempting to exit gracefully.');
    server.close(() => {
      console.log('Server closed. Quitting.');
      process.exit();
    });
  }

});
