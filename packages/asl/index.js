const App = require('./lib/app');

const server = App().listen(process.env.PORT || 8080, (err, result) => {
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
