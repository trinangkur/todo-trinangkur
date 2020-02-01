const fs = require('fs');
const querystring = require('querystring');

const CONTENT_TYPES = require('./mimeTypes');
const App = require('./app');

const requestListener = function(req, res) {
  app.serve(req, res);
};
module.exports = { requestListener };
