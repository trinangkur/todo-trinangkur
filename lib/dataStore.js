const {TodoCollection} = require('./todo.js');

class DataStore {
  constructor(reader, writer, path) {
    this.reader = reader;
    this.writer = writer;
    this.path = path;
  }

  initialize() {
    const allTodo = JSON.parse(this.read() || '{}');
    this.todoCollection = new TodoCollection();
    Object.keys(allTodo).forEach(userId => {
      this.todoCollection.assignUserTodo(userId, allTodo[userId]);
    });
  }

  initializeUser(userId) {
    this.todoCollection.initializeUser(userId);
    this.write();
  }

  assignUserTodo(userId, todo) {
    this.todoCollection.assignUserTodo(userId, todo);
  }

  read() {
    return this.reader(this.path, 'utf8');
  }

  write() {
    this.writer(this.path, this.todoCollection.toJson());
  }

  addTodo(userId, key, title) {
    this.todoCollection.addTodo(userId, key, title);
    this.write();
  }
  editTitle(userId, titleId, title) {
    this.todoCollection.editTitle(userId, titleId, title);
    this.write();
  }

  editItem(userId, titleId, itemId, itemText) {
    this.todoCollection.editItem(userId, titleId, itemId, itemText);
    this.write();
  }

  deleteTodo(userId, titleId) {
    this.todoCollection.deleteTodo(userId, titleId);
    this.write();
  }

  deleteTodoItem(userId, titleId, itemId) {
    this.todoCollection.deleteTodoItem(userId, titleId, itemId);
    this.write();
  }

  addTodoItem(userId, titleId, task) {
    this.todoCollection.addTodoItem(userId, titleId, task);
    this.write();
  }

  toggleItemStatus(userId, titleId, taskId) {
    this.todoCollection.toggleItemStatus(userId, titleId, taskId);
    this.write();
  }

  isTodoPresent(userId, id) {
    return this.todoCollection.checkTodo(userId, id);
  }

  isTaskPresent(userId, titleId, itemId) {
    return this.todoCollection.checkTask(userId, titleId, itemId);
  }

  checkUser(userId) {
    return this.todoCollection.usersTodo[userId] && true;
  }

  nextTodoId(userId) {
    return this.todoCollection.nextTodoId(userId);
  }

  nextItemId(userId, todoId) {
    return this.todoCollection.nextItemId(userId, todoId);
  }

  getTodo(userId) {
    return this.todoCollection.usersTodo[userId];
  }
}

module.exports = DataStore;
