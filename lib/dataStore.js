const {TodoCollection} = require('./todo.js');

class DataStore {
  constructor(reader, writer, path) {
    this.reader = reader;
    this.writer = writer;
    this.path = path;
  }
  initialize() {
    this.todoCollection = TodoCollection.load(this.read());
  }

  read() {
    return this.reader(this.path, 'utf8');
  }

  write() {
    this.writer(this.path, this.todoCollection.toJson());
  }

  addTodo(key, title) {
    this.todoCollection.addTodo(key, title);
    this.write();
  }
  editTitle(titleId, title) {
    this.todoCollection.editTitle(titleId, title);
    this.write();
  }

  editItem(titleId, itemId, itemText) {
    this.todoCollection.editItem(titleId, itemId, itemText);
    this.write();
  }

  deleteTodo(titleId) {
    this.todoCollection.deleteTodo(titleId);
    this.write();
  }

  deleteTodoItem(titleId, itemId) {
    this.todoCollection.deleteTodoItem(titleId, itemId);
    this.write();
  }

  addTodoItem(titleId, task) {
    this.todoCollection.addTodoItem(titleId, task);
    this.write();
  }

  toggleItemStatus(titleId, taskId) {
    this.todoCollection.toggleItemStatus(titleId, taskId);
    this.write();
  }

  isTodoPresent(id) {
    return this.todoCollection.checkTodo(id);
  }

  isTaskPresent(titleId, itemId) {
    return this.todoCollection.checkTask(titleId, itemId);
  }

  nextTodoId() {
    return this.todoCollection.nextTodoId();
  }

  nextItemId(todoId) {
    return this.todoCollection.nextItemId(todoId);
  }

  get todo() {
    return this.todoCollection.todo;
  }
}

module.exports = DataStore;
