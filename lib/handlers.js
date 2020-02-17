const {Todo} = require('./todo.js');

const loginAndAuthorize = (req, res) => {
  const userStore = req.app.locals.userStore;
  const sessionManager = req.app.locals.sessionManager;
  const cookie = new Date().getTime();
  if (userStore.isValidUser(req.body)) {
    sessionManager.createSession(cookie, req.body.userId);
    res.cookie('_sid', cookie);
    return res.json({isSuccessful: true});
  }
  res.json({isSuccessful: false});
};

const logout = (req, res) => {
  const sessionManager = req.app.locals.sessionManager;
  sessionManager.clearSession(req.cookies._sid);
  res.end();
};

const authorizeUser = (req, res, next) => {
  const sessionManager = req.app.locals.sessionManager;
  if (sessionManager.isSessionAlive(req.cookies._sid)) {
    return next();
  }
  res.redirect('/login.html');
};

const serveTodoList = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const sessionManager = req.app.locals.sessionManager;
  const userId = sessionManager.getUserId(req.cookies._sid);
  res.json(dataStore.getTodo(userId));
};

const addTodo = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const sessionManager = req.app.locals.sessionManager;
  const userId = sessionManager.getUserId(req.cookies._sid);
  const {title} = req.body;
  dataStore.addTodo(userId, dataStore.nextTodoId(userId), new Todo(title));
  res.json(dataStore.getTodo(userId));
};

const saveAndLogin = (req, res) => {
  const userStore = req.app.locals.userStore;
  userStore.addUser(req.body);
  const dataStore = req.app.locals.dataStore;
  dataStore.initializeUser(req.body.userId);
  res.redirect('/login.html');
};

const isUserIdAvailable = (req, res) => {
  const userStore = req.app.locals.userStore;
  if (userStore.isUserIdAvailable(req.body.userId)) {
    return res.json({isSuccessful: false});
  }
  res.json({isSuccessful: true});
};

const addTodoItem = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const sessionManager = req.app.locals.sessionManager;
  const userId = sessionManager.getUserId(req.cookies._sid);
  const {titleId, text} = req.body;
  const id = dataStore.nextItemId(userId, titleId);
  dataStore.addTodoItem(userId, titleId, {id, text});
  res.json(dataStore.getTodo(userId));
};

const toggleItemStatus = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const sessionManager = req.app.locals.sessionManager;
  const userId = sessionManager.getUserId(req.cookies._sid);
  const {titleId, itemId} = req.body;
  dataStore.toggleItemStatus(userId, titleId, itemId);
  res.json(dataStore.getTodo(userId));
};

const deleteTodo = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const sessionManager = req.app.locals.sessionManager;
  const userId = sessionManager.getUserId(req.cookies._sid);
  const {titleId} = req.body;
  dataStore.deleteTodo(userId, titleId);
  res.json(dataStore.getTodo(userId));
};

const deleteTodoItem = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const sessionManager = req.app.locals.sessionManager;
  const userId = sessionManager.getUserId(req.cookies._sid);
  const {titleId, itemId} = req.body;
  dataStore.deleteTodoItem(userId, titleId, itemId);
  res.json(dataStore.getTodo(userId));
};

const editTitle = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const sessionManager = req.app.locals.sessionManager;
  const userId = sessionManager.getUserId(req.cookies._sid);
  const {titleId, titleText} = req.body;
  dataStore.editTitle(userId, titleId, titleText);
  res.json(dataStore.getTodo(userId));
};

const editItem = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const sessionManager = req.app.locals.sessionManager;
  const userId = sessionManager.getUserId(req.cookies._sid);
  const {titleId, itemId, itemText} = req.body;
  dataStore.editItem(userId, titleId, itemId, itemText);
  res.json(dataStore.getTodo(userId));
};

const areIdsPresent = (userId, {titleId, itemId}, dataStore) => {
  let isIdsPresent = dataStore.isTodoPresent(userId, titleId);
  if (itemId) {
    isIdsPresent = dataStore.isTaskPresent(userId, titleId, itemId);
  }
  return isIdsPresent;
};

const checkIds = (req, res, next) => {
  const dataStore = req.app.locals.dataStore;
  const sessionManager = req.app.locals.sessionManager;
  const userId = sessionManager.getUserId(req.cookies._sid);
  if (areIdsPresent(userId, req.body, dataStore)) {
    return next();
  }
  res.status(404).send('<h1> not found</h1>');
};

module.exports = {
  loginAndAuthorize,
  logout,
  isUserIdAvailable,
  authorizeUser,
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
};
