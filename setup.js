const fs = require('fs');

const creatFile = function(path) {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '');
  }
};

const setupDataStore = function() {
  if (!fs.existsSync('data/')) {
    fs.mkdirSync('./data');
  }
  creatFile('./data/todoList.json');
  creatFile('./data/user.json');
};

module.exports = setupDataStore;
