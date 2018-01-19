const App = require('./lib/app');

const settings = {
  secret: process.env.SESSION_SECRET,
  port: process.env.PORT || 8080,
  auth: {
    realm: process.env.KEYCLOAK_REALM,
    url: process.env.KEYCLOAK_URL,
    client: process.env.KEYCLOAK_CLIENT,
    secret: process.env.KEYCLOAK_SECRET
  }
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
