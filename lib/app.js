const json = require('./mimeTypes').json;

const sendResponse = function(data) {
  this.setHeader('Content-Type', json);
  this.end(data);
};

class App {
  constructor() {
    this.allRoutes = [];
  }

  insertIntoRouteChain(method, path, handlers) {
    const routes = handlers.map(handler => ({path, handler, method}));
    this.allRoutes.push(...routes);
  }
  get(path, ...handlers) {
    this.insertIntoRouteChain('GET', path, handlers);
  }

  post(path, ...handlers) {
    this.insertIntoRouteChain('POST', path, handlers);
  }

  use(...handlers) {
    this.insertIntoRouteChain(null, null, handlers);
  }

  serve(req, res) {
    console.log(req.method, req.url);
    const matchesRequest = function({method, path}) {
      const isMatchedUrlMethod = req.method === method && req.url.match(path);
      return !method || isMatchedUrlMethod;
    };
    const routes = this.allRoutes.filter(matchesRequest);
    const handlers = routes.map(route => route.handler);
    res.sendResponse = sendResponse;
    const next = function(todo) {
      const handler = handlers.shift();
      handler && handler(req, res, next, todo);
    };
    next();
  }
}

module.exports = App;
