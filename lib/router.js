const App = require('./app');
const {
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
  methodNotAllowed,
  checkIds
} = require('./handlers');

const hasFields = (...fields) => {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.end('bad Request');
  };
};

const app = new App();
app.use(readBody);
app.use(parseBody);
app.get('getTodoList', serveTodoList);
app.get('', serveStaticPage);
app.get('', serveNotFound);
app.post('addTodoTitle', hasFields('title'), addTodo);
app.post('addItemToTitle', hasFields('titleId', 'text'), checkIds, addTodoItem);
app.post('deleteTodoTitle', hasFields('titleId'), checkIds, deleteTodo);
app.post('editTitle', hasFields('titleId', 'titleText'), checkIds, editTitle);

app.post(
  'markItem',
  hasFields('titleId', 'itemId'),
  checkIds,
  toggleItemStatus
);

app.post(
  'deleteItem',
  hasFields('titleId', 'itemId'),
  checkIds,
  deleteTodoItem
);

app.post(
  'editItem',
  hasFields('titleId', 'itemId', 'itemText'),
  checkIds,
  editItem
);

app.post('', serveNotFound);
app.use(methodNotAllowed);

const requestListener = function(req, res) {
  app.serve(req, res);
};

module.exports = {requestListener};
