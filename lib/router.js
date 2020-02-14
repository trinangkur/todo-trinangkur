const fs = require('fs');
const express = require('express');
const DataStore = require('./dataStore');
const DATA_FILE_PATH = require('../config').DATA_STORE;

const {
  serveTodoList,
  addTodo,
  addTodoItem,
  toggleItemStatus,
  deleteTodoItem,
  deleteTodo,
  editItem,
  editTitle,
  checkIds
} = require('./handlers');

const app = express();

app.locals.dataStore = new DataStore(
  fs.readFileSync,
  fs.writeFileSync,
  DATA_FILE_PATH
);
app.locals.dataStore.initialize();

const hasFields = (...fields) => {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.end('bad Request');
  };
};

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.get('/getTodoList', serveTodoList);
app.post('/addTodoTitle', hasFields('title'), addTodo);
app.post(
  '/addItemToTitle',
  hasFields('titleId', 'text'),
  checkIds,
  addTodoItem
);
app.post('/deleteTodoTitle', hasFields('titleId'), checkIds, deleteTodo);
app.post('/editTitle', hasFields('titleId', 'titleText'), checkIds, editTitle);
app.post(
  '/markItem',
  hasFields('titleId', 'itemId'),
  checkIds,
  toggleItemStatus
);
app.post(
  '/deleteItem',
  hasFields('titleId', 'itemId'),
  checkIds,
  deleteTodoItem
);
app.post(
  '/editItem',
  hasFields('titleId', 'itemId', 'itemText'),
  checkIds,
  editItem
);

module.exports = app;
