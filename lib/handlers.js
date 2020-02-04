const fs = require('fs');
const querystring = require('querystring');

const CONTENT_TYPES = require('./mimeTypes');
const App = require('./app');
const { TodoCollection, Todo } = require('./todo.js');

const DATA_FILE_PATH = process.env['DATA_STORE'];

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

const servePage = function(req, res, next) {
  const path = getPath(req.url);
  console.log(path);
  if (!doesFileExist(path)) {
    next();
    return;
  }
  const content = fs.readFileSync(path);
  const contentType = getContentType(path);
  res.setHeader('Content-Type', contentType);
  res.end(content);
};

const getTodoList = (req, res) => {
  res.end(todoCollection.titleJson);
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

const addTodoTitle = (req, res) => {
  const body = querystring.parse(req.body);
  todoCollection.addTodoTitle(new Todo(body.title, `t${new Date().getTime()}`));
  res.end(todoCollection.titleJson);
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(todoCollection.todo));
};

const addItemToTitle = (req, res) => {
  const body = querystring.parse(req.body);
  todoCollection.addTaskToTitle(body.titleId, {
    id: `i${new Date().getTime()}`,
    text: body.itemText
  });
  res.end(todoCollection.titleJson);
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(todoCollection.todo));
};

const markItem = (req, res) => {
  const body = querystring.parse(req.body);
  todoCollection.markItem(body.titleId, body.itemId);
  res.end(todoCollection.titleJson);
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(todoCollection.todo));
};

const deleteTodoTitle = (req, res) => {
  const body = querystring.parse(req.body);
  todoCollection.deleteTodo(body.titleId);
  res.end(todoCollection.titleJson);
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(todoCollection.todo));
};

const deleteItem = (req, res) => {
  const body = querystring.parse(req.body);
  todoCollection.deleteTodoItem(body.titleId, body.itemId);
  res.end(todoCollection.titleJson);
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(todoCollection.todo));
};

const app = new App();
app.use(readBody);
app.get('getTodoList', getTodoList);
app.get('', servePage);
app.get('', serveNotFound);
app.post('addTodoTitle', addTodoTitle);
app.post('addItemToTitle', addItemToTitle);
app.post('markItem', markItem);
app.post('deleteItem', deleteItem);
app.post('deleteTodoTitle', deleteTodoTitle);

const requestListener = function(req, res) {
  app.serve(req, res);
};
module.exports = { requestListener };
