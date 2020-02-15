const {TodoList} = require('./todo.js');

class DataStore {
  constructor(reader, writer, path) {
    this.reader = reader;
    this.writer = writer;
    this.path = path;
  }
  initialize() {
    this.todoList = TodoList.load(this.read());
  }

  read() {
    return this.reader(this.path, 'utf8');
  }

  write() {
    this.writer(this.path, this.todoList.toJson());
  }

  addTodo(key, title) {
    this.todoList.addTodo(key, title);
    this.write();
  }
  editTitle(titleId, title) {
    this.todoList.editTitle(titleId, title);
    this.write();
  }

  editItem(titleId, itemId, itemText) {
    this.todoList.editItem(titleId, itemId, itemText);
    this.write();
  }

  deleteTodo(titleId) {
    this.todoList.deleteTodo(titleId);
    this.write();
  }

  deleteTodoItem(titleId, itemId) {
    this.todoList.deleteTodoItem(titleId, itemId);
    this.write();
  }

  addTodoItem(titleId, task) {
    this.todoList.addTodoItem(titleId, task);
    this.write();
  }

  toggleItemStatus(titleId, taskId) {
    this.todoList.toggleItemStatus(titleId, taskId);
    this.write();
  }

  isTodoPresent(id) {
    return this.todoList.checkTodo(id);
  }

  isTaskPresent(titleId, itemId) {
    return this.todoList.checkTask(titleId, itemId);
  }

  nextTodoId() {
    return this.todoList.nextTodoId();
  }

  nextItemId(todoId) {
    return this.todoList.nextItemId(todoId);
  }

  get todo() {
    return this.todoList.todo;
  }
}

module.exports = DataStore;
