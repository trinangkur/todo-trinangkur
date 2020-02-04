const http = require('http');

process.env['DATA_STORE'] = `${__dirname}/lib/todoList.json`;
const { requestListener } = require('./lib/handlers');

const main = (port = 3000) => {
  const server = new http.Server(requestListener);
  server.listen(port, () => console.log(`listening at :${port}`));
};

main(process.argv[2]);
