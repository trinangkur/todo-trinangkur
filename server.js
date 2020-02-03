const http = require('http');

const { requestListener } = require('./lib/handlers');

const main = (port = 3000) => {
  // const server = new http.Server(requestListener);
  // server.listen(port, () => console.log(`listening at :${port}`));
  console.log('will connect shortly');
};

main(process.argv[2]);
