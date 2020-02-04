const fs = require('fs');
const querystring = require('querystring');

const CONTENT_TYPES = require('./mimeTypes');
const App = require('./app');
const { Todo, Title } = require('./todo.js');

const dataFilePath = `${__dirname}/todoList.json`;

const todo = Todo.load(fs.readFileSync(dataFilePath, 'utf8'));

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
  todo.addTodoTitle(new Title(body.title, `t${new Date().getTime()}`));
  res.end(todo.titleJson);
};

const addItemToTitle = (req, res) => {
  const body = querystring.parse(req.body);
  todo.addTaskToTitle(body.titleId, {
    id: `i${new Date().getTime()}`,
    text: body.itemText
  });
  res.end(todo.titleJson);
};

const markItem = (req, res) => {
  const body = querystring.parse(req.body);
  todo.markItem(body.titleId, body.itemId);
  res.end(todo.titleJson);
};

const app = new App();
app.use(readBody);
app.get('', servePage);
app.get('', serveNotFound);
app.post('addTodoTitle', addTodoTitle);
app.post('addItemToTitle', addItemToTitle);
app.post('markItem', markItem);

const requestListener = function(req, res) {
  app.serve(req, res);
};
module.exports = { requestListener };
