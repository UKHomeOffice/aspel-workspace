const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Hello world');
});

server.listen(process.env.PORT || 8080, (err, result) => {
  console.log(`Listening on port ${server.address().port}`);
});

process.on('SIGINT', () => {
  if (server.listening) {
    console.log('Shutting down gracefully... Ctrl+C again to force quit.');
    server.close(() => {
      console.log('Server closed. Exiting.');
      process.exit();
    });
  } else {
    console.log('Force quitting.');
    process.exit();
  }
});
