const fs = require('fs');
const querystring = require('querystring');

const CONTENT_TYPES = require('./mimeTypes');
const {Todo} = require('./todo.js');
const DataStore = require('./dataStore');
const DATA_FILE_PATH = require('../config').DATA_STORE;

const dataStore = new DataStore(
  fs.readFileSync,
  fs.writeFileSync,
  DATA_FILE_PATH
);

dataStore.initialize();

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
  res.setHeader('Content-Type', 'application/json');
  res.end(dataStore.toJson());
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
  res.writeHead(404, {'Content-Type': 'text/html'});
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

const methodNotAllowed = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(405);
  res.end('<h1> 405 method not allowed');
};

const addTodo = (req, res) => {
  const {title} = req.body;
  dataStore.addTodo(dataStore.nextTodoId(), new Todo(title));
  res.sendResponse(dataStore.toJson());
};

const addTodoItem = (req, res) => {
  const {titleId, text} = req.body;
  const id = dataStore.nextItemId(titleId);
  dataStore.addTodoItem(titleId, {id, text});
  res.sendResponse(dataStore.toJson());
};

const toggleItemStatus = (req, res) => {
  const {titleId, itemId} = req.body;
  dataStore.toggleItemStatus(titleId, itemId);
  res.sendResponse(dataStore.toJson());
};

const deleteTodo = (req, res) => {
  const {titleId} = req.body;
  dataStore.deleteTodo(titleId);
  res.sendResponse(dataStore.toJson());
};

const deleteTodoItem = (req, res) => {
  const {titleId, itemId} = req.body;
  dataStore.deleteTodoItem(titleId, itemId);
  res.sendResponse(dataStore.toJson());
};

const editTitle = (req, res) => {
  const {titleId, titleText} = req.body;
  dataStore.editTitle(titleId, titleText);
  res.sendResponse(dataStore.toJson());
};

const editItem = (req, res) => {
  const {titleId, itemId, itemText} = req.body;
  dataStore.editItem(titleId, itemId, itemText);
  res.sendResponse(dataStore.toJson());
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
  parseBody,
  methodNotAllowed
};
