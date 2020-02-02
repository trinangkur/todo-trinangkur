const fs = require('fs');
const querystring = require('querystring');

const CONTENT_TYPES = require('./mimeTypes');
const App = require('./app');

const getPath = function(url) {
  return `${__dirname}/../public/${url}`;
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
  if (!doesFileExist(path)) {
    next();
    return;
  }
  const content = fs.readFileSync(path);
  const contentType = getContentType(req.url);
  res.setHeader('Content-Type', contentType);
  res.end(content);
};

const serveTodoApp = function(req, res) {
  const content = fs.readFileSync('./template/index.html');
  res.setHeader('Content-Type', CONTENT_TYPES.html);
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

const app = new App();
app.use(readBody);
app.get(/^\/$/, serveTodoApp);
app.get('', servePage);
app.get('', serveNotFound);

const requestListener = function(req, res) {
  app.serve(req, res);
};
module.exports = { requestListener };
