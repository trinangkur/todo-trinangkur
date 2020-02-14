const {Todo} = require('./todo.js');
const redirectUser = (req, res) => {
  res.redirect('user');
};

const serveTodoList = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  res.json(dataStore.todo);
};

const addTodo = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const {title} = req.body;
  dataStore.addTodo(dataStore.nextTodoId(), new Todo(title));
  res.json(dataStore.todo);
};

const saveAndLogin = (req, res) => {
  const userStore = req.app.locals.userStore;
  userStore.addUser(req.body);
  res.redirect('/');
};

const addTodoItem = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const {titleId, text} = req.body;
  const id = dataStore.nextItemId(titleId);
  dataStore.addTodoItem(titleId, {id, text});
  res.json(dataStore.todo);
};

const toggleItemStatus = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const {titleId, itemId} = req.body;
  dataStore.toggleItemStatus(titleId, itemId);
  res.json(dataStore.todo);
};

const deleteTodo = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const {titleId} = req.body;
  dataStore.deleteTodo(titleId);
  res.json(dataStore.todo);
};

const deleteTodoItem = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const {titleId, itemId} = req.body;
  dataStore.deleteTodoItem(titleId, itemId);
  res.json(dataStore.todo);
};

const editTitle = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const {titleId, titleText} = req.body;
  dataStore.editTitle(titleId, titleText);
  res.json(dataStore.todo);
};

const editItem = (req, res) => {
  const dataStore = req.app.locals.dataStore;
  const {titleId, itemId, itemText} = req.body;
  dataStore.editItem(titleId, itemId, itemText);
  res.json(dataStore.todo);
};

const areIdsPresent = ({titleId, itemId}, dataStore) => {
  let isIdsPresent = dataStore.isTodoPresent(titleId);
  if (itemId) {
    isIdsPresent = dataStore.isTaskPresent(titleId, itemId);
  }
  return isIdsPresent;
};

const checkIds = (req, res, next) => {
  const dataStore = req.app.locals.dataStore;
  if (areIdsPresent(req.body, dataStore)) {
    return next();
  }
  res.status(404).send('<h1> not found</h1>');
};

module.exports = {
  redirectUser,
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
