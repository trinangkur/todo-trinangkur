const fs = require('fs');
const express = require('express');
const DataStore = require('./dataStore');
const UserStore = require('./UserStore');
const cookie = require('cookie-parser');
const SessionManager = require('./sessionManager.js');

const { DATA_STORE, USER_STORE } = require('../config');

const {
  loginAndAuthorize,
  logout,
  authorizeUser,
  verifyUser,
  isUserIdAvailable,
  signUp,
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

const reader = fs.readFileSync;
const writer = fs.writeFileSync;

app.locals.userStore = new UserStore(reader, writer, USER_STORE);
app.locals.userStore.initialize();
app.locals.dataStore = new DataStore(reader, writer, DATA_STORE);
app.locals.dataStore.initialize();
app.locals.sessionManager = new SessionManager();

const hasFields = (...fields) => {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.end('bad Request');
  };
};

app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.post('/login', loginAndAuthorize);
app.post('/logout', logout);
app.post('/signUp', signUp);
app.post('/isUserIdAvailable', isUserIdAvailable);
app.get('/', (req, res) => res.redirect('/index.html'));
app.get('/index.html', authorizeUser);
app.get('/*', express.static('public'));
app.use(verifyUser);
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
