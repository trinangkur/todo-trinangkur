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

const serveNotFound = (req, res, next) => {
  if (req.badRequest) {
    next();
  }
  res.writeHead(404, {'Content-Type': 'text/html'});
  res.end(getNoFoundResponse());
};

const serveBadRequest = (req, res) => {
  res.writeHead(400, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify({errMessage: 'bad request'}));
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

const isExpectedFields = function(actualFields, expectedFields) {
  return expectedFields.every(
    field => field in actualFields && actualFields[field] !== undefined
  );
};

const sendJsonResponse = res => {
  res.setHeader('Content-Type', 'application/json');
  res.end(dataStore.toJson());
};

const addTodo = (req, res, next) => {
  if (!isExpectedFields(req.body, ['title'])) {
    req.badRequest = true;
    return next();
  }
  const {title} = req.body;
  dataStore.addTodo(dataStore.nextTodoId(), new Todo(title));
  sendJsonResponse(res);
};

const addTodoItem = (req, res, next) => {
  if (!isExpectedFields(req.body, ['titleId', 'text'])) {
    req.badRequest = true;
    return next();
  }
  const {titleId, text} = req.body;
  const id = dataStore.nextItemId(titleId);
  dataStore.addTodoItem(titleId, {id, text});
  sendJsonResponse(res);
};

const toggleItemStatus = (req, res, next) => {
  if (!isExpectedFields(req.body, ['titleId', 'itemId'])) {
    req.badRequest = true;
    return next();
  }
  const {titleId, itemId} = req.body;
  dataStore.toggleItemStatus(titleId, itemId);
  sendJsonResponse(res);
};

const deleteTodo = (req, res, next) => {
  if (!isExpectedFields(req.body, ['titleId'])) {
    req.badRequest = true;
    return next();
  }
  const {titleId} = req.body;
  dataStore.deleteTodo(titleId);
  sendJsonResponse(res);
};

const deleteTodoItem = (req, res, next) => {
  if (!isExpectedFields(req.body, ['titleId', 'itemId'])) {
    req.badRequest = true;
    return next();
  }
  const {titleId, itemId} = req.body;
  dataStore.deleteTodoItem(titleId, itemId);
  sendJsonResponse(res);
};

const editTitle = (req, res, next) => {
  if (!isExpectedFields(req.body, ['titleId', 'titleText'])) {
    req.badRequest = true;
    return next();
  }
  const {titleId, titleText} = req.body;
  dataStore.editTitle(titleId, titleText);
  sendJsonResponse(res);
};

const editItem = (req, res, next) => {
  if (!isExpectedFields(req.body, ['titleId', 'itemId', 'itemText'])) {
    req.badRequest = true;
    return next();
  }
  const {titleId, itemId, itemText} = req.body;
  dataStore.editItem(titleId, itemId, itemText);
  sendJsonResponse(res);
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
  serveBadRequest,
  methodNotAllowed
};
