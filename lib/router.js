const fs = require('fs');
const express = require('express');
const DataStore = require('./dataStore');
const UserStore = require('./UserStore');
const {DATA_STORE, USER_STORE} = require('../config');

const {
  loginAndAuthorize,
  saveAndLogin,
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
const userRouter = express();

app.locals.userStore = new UserStore(
  fs.readFileSync,
  fs.writeFileSync,
  USER_STORE
);
app.locals.userStore.initialize();

userRouter.locals.dataStore = new DataStore(
  fs.readFileSync,
  fs.writeFileSync,
  DATA_STORE
);
userRouter.locals.dataStore.initialize();

const hasFields = (...fields) => {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.end('bad Request');
  };
};

userRouter.use(express.urlencoded({extended: true}));
userRouter.use(express.static('public'));
userRouter.get('/getTodoList', serveTodoList);
userRouter.post('/addTodoTitle', hasFields('title'), addTodo);
userRouter.post(
  '/addItemToTitle',
  hasFields('titleId', 'text'),
  checkIds,
  addTodoItem
);
userRouter.post('/deleteTodoTitle', hasFields('titleId'), checkIds, deleteTodo);
userRouter.post(
  '/editTitle',
  hasFields('titleId', 'titleText'),
  checkIds,
  editTitle
);
userRouter.post(
  '/markItem',
  hasFields('titleId', 'itemId'),
  checkIds,
  toggleItemStatus
);
userRouter.post(
  '/deleteItem',
  hasFields('titleId', 'itemId'),
  checkIds,
  deleteTodoItem
);
userRouter.post(
  '/editItem',
  hasFields('titleId', 'itemId', 'itemText'),
  checkIds,
  editItem
);

app.use('/user', userRouter);
app.use(express.urlencoded({extended: true}));
app.use(express.static('login'));
app.post('/login', loginAndAuthorize);
app.post('/signUp', saveAndLogin);

module.exports = app;
