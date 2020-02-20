const setupDataStore = require('./setup');
setupDataStore();

const app = require('./lib/app.js');
const port = process.env.PORT || 3000;

const main = port => {
  app.listen(port, () => console.log(`listening on ${port}`));
};

main(port);
