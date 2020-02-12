const fs = require('fs');
const setupFilePath = function() {
  if (!fs.existsSync('data/todoList.json')) {
    fs.mkdirSync('./data');
    fs.writeFileSync('./data/todoList.json', '');
  }
};

module.exports = setupFilePath;
