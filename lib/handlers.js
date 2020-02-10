const fs = require('fs');
const querystring = require('querystring');

const CONTENT_TYPES = require('./mimeTypes');
const App = require('./app');
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

const addTodo = (req, res) => {
  const body = querystring.parse(req.body);
  todoCollection.addTodoTitle(new Todo(body.title, `t${new Date().getTime()}`));
  res.end(todoCollection.toJson());
  todoCollection.writeTo(fs.writeFileSync, DATA_FILE_PATH);
};

const addTodoItem = (req, res) => {
  const body = querystring.parse(req.body);
  todoCollection.addTaskToTitle(body.titleId, {
    id: `i${new Date().getTime()}`,
    text: body.itemText
  });
  res.end(todoCollection.toJson());
  todoCollection.writeTo(fs.writeFileSync, DATA_FILE_PATH);
};

const toggleItemStatus = (req, res) => {
  const body = querystring.parse(req.body);
  todoCollection.markItem(body.titleId, body.itemId);
  res.end(todoCollection.toJson());
  todoCollection.writeTo(fs.writeFileSync, DATA_FILE_PATH);
};

const deleteTodo = (req, res) => {
  const body = querystring.parse(req.body);
  todoCollection.deleteTodo(body.titleId);
  res.end(todoCollection.toJson());
  todoCollection.writeTo(fs.writeFileSync, DATA_FILE_PATH);
};

const deleteTodoItem = (req, res) => {
  const body = querystring.parse(req.body);
  todoCollection.deleteTodoItem(body.titleId, body.itemId);
  res.end(todoCollection.toJson());
  todoCollection.writeTo(fs.writeFileSync, DATA_FILE_PATH);
};

const editTitle = (req, res) => {
  const body = querystring.parse(req.body);
  todoCollection.editTitle(body.titleId, body.title);
  res.end(todoCollection.toJson());
  todoCollection.writeTo(fs.writeFileSync, DATA_FILE_PATH);
};

const editItem = (req, res) => {
  const body = querystring.parse(req.body);
  todoCollection.editItem(body.titleId, body.itemId, body.itemText);
  res.end(todoCollection.toJson());
  todoCollection.writeTo(fs.writeFileSync, DATA_FILE_PATH);
};

const app = new App();
app.use(readBody);
app.get('getTodoList', serveTodoList);
app.get('', serveStaticPage);
app.get('', serveNotFound);
app.post('addTodoTitle', addTodo);
app.post('addItemToTitle', addTodoItem);
app.post('markItem', toggleItemStatus);
app.post('deleteItem', deleteTodoItem);
app.post('deleteTodoTitle', deleteTodo);
app.post('editItem', editItem);
app.post('editTitle', editTitle);

const requestListener = function(req, res) {
  app.serve(req, res);
};
module.exports = {requestListener};
