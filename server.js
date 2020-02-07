const http = require('http');

const setupFilePath = require('./setup');
setupFilePath();

const { requestListener } = require('./lib/handlers');

const main = (port = 3000) => {
  const server = new http.Server(requestListener);
  server.listen(port, () => console.log(`listening at :${port}`));
};

main(process.argv[2]);
