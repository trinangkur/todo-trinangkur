const setupDataStore = require('./setup');
setupDataStore();

const app = require('./lib/app.js');

const main = (port = 3000) => {
  app.listen(port, () => console.log(`listening on ${port}`));
};

main(process.argv[2]);
