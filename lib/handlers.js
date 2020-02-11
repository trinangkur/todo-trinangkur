const fs = require('fs');
const querystring = require('querystring');

const CONTENT_TYPES = require('./mimeTypes');
const {TodoCollection, Todo} = require('./todo.js');
const DATA_FILE_PATH = require('../config').DATA_STORE;

const todoCollection = TodoCollection.load(
  fs.readFileSync(DATA_FILE_PATH, 'utf8')
);

const getPath = function(url) {
  return url === '/'
    ? `${__dirname}/../public/index.html`
    : `${__dirname}/../public${url}`;
};

const doesFileExist = function(path) {
  return fs.existsSync(path) && fs.statSync(path).isFile();
};

const getContentType = function(path) {
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  return CONTENT_TYPES[extension];
};

const serveStaticPage = function(req, res, next) {
  const path = getPath(req.url);
  if (!doesFileExist(path)) {
    next();
    return;
  }
  const content = fs.readFileSync(path);
  const contentType = getContentType(path);
  res.setHeader('Content-Type', contentType);
  res.end(content);
};

const serveTodoList = (req, res) => {
  res.end(todoCollection.toJson());
};

const getNoFoundResponse = function() {
  return `<html>
  <head><title>Not Found</title></head>
  <body>
    <h1>404 FILE NOT FOUND</h1>
  </body>
</html>`;
};

const serveNotFound = (req, res) => {
  res.writeHead(404);
  res.end(getNoFoundResponse());
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const parseBody = (req, res, next) => {
  req.body = querystring.parse(req.body);
  next();
};

const addTodo = (req, res) => {
  const {title} = req.body;
  todoCollection.addTodo(todoCollection.nextTodoId(), new Todo(title));
  res.end(todoCollection.toJson());
  todoCollection.writeTo(fs.writeFileSync, DATA_FILE_PATH);
};

const addTodoItem = (req, res) => {
  const {titleId, text} = req.body;
  const id = todoCollection.nextItemId(titleId);
  todoCollection.addTodoItem(titleId, {id, text});
  res.end(todoCollection.toJson());
  todoCollection.writeTo(fs.writeFileSync, DATA_FILE_PATH);
};

const toggleItemStatus = (req, res) => {
  const {titleId, itemId} = req.body;
  todoCollection.toggleItemStatus(titleId, itemId);
  res.end(todoCollection.toJson());
  todoCollection.writeTo(fs.writeFileSync, DATA_FILE_PATH);
};

const deleteTodo = (req, res) => {
  const {titleId} = req.body;
  todoCollection.deleteTodo(titleId);
  res.end(todoCollection.toJson());
  todoCollection.writeTo(fs.writeFileSync, DATA_FILE_PATH);
};

const deleteTodoItem = (req, res) => {
  const {titleId, itemId} = req.body;
  todoCollection.deleteTodoItem(titleId, itemId);
  res.end(todoCollection.toJson());
  todoCollection.writeTo(fs.writeFileSync, DATA_FILE_PATH);
};

const editTitle = (req, res) => {
  const {titleId, titleText} = req.body;
  todoCollection.editTitle(titleId, titleText);
  res.end(todoCollection.toJson());
  todoCollection.writeTo(fs.writeFileSync, DATA_FILE_PATH);
};

const editItem = (req, res) => {
  const {titleId, itemId, itemText} = req.body;
  todoCollection.editItem(titleId, itemId, itemText);
  res.end(todoCollection.toJson());
  todoCollection.writeTo(fs.writeFileSync, DATA_FILE_PATH);
};

module.exports = {
  readBody,
  serveTodoList,
  serveStaticPage,
  serveNotFound,
  addTodo,
  addTodoItem,
  toggleItemStatus,
  deleteTodoItem,
  deleteTodo,
  editItem,
  editTitle,
  parseBody
};
