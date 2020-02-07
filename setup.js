const fs = require('fs');
const setupFilePath = function() {
  console.log('hey hye');
  if (!fs.existsSync('data/todoList.json')) {
    fs.mkdirSync('./data');
    fs.writeFileSync('./data/todoList.json', '');
  }
};

module.exports = setupFilePath;
