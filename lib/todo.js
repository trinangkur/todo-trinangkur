const findGreatest = keys => {
  return keys.reduce((currentId, nextId) => {
    return currentId > nextId ? currentId : nextId;
  }, 0);
};

class Todo {
  constructor(name, tasks) {
    this.name = name;
    this.tasks = tasks || {};
  }
  addTask(id, text) {
    this.tasks[id] = {text, status: false};
  }
  mark(id) {
    const task = this.tasks[id];
    task.status = !task.status;
  }
  deleteItem(id) {
    delete this.tasks[id];
  }
  editTitleName(name) {
    this.name = name;
  }
  editItemText(itemId, itemText) {
    this.tasks[itemId].text = itemText;
  }
  nextId() {
    const keys = Object.keys(this.tasks);
    return +findGreatest(keys) + 1;
  }

  hasTask(itemId) {
    return this.tasks[itemId] && true;
  }
}

class TodoCollection {
  constructor() {
    this.usersTodo = {};
  }

  initializeUser(userId) {
    this.usersTodo[userId] = {};
  }

  assignUserTodo(userId, todo) {
    this.usersTodo[userId] = {};
    Object.keys(todo).forEach(id => {
      this.usersTodo[userId][id] = new Todo(todo[id].name, todo[id].tasks);
    });
  }

  addTodo(userId, key, title) {
    this.usersTodo[userId][key] = title;
  }

  editTitle(userId, titleId, title) {
    const todoList = this.usersTodo[userId];
    todoList[titleId].editTitleName(title);
  }

  editItem(userId, titleId, itemId, itemText) {
    const todoList = this.usersTodo[userId];
    todoList[titleId].editItemText(itemId, itemText);
  }

  deleteTodo(userId, titleId) {
    const todo = this.usersTodo[userId];
    delete todo[titleId];
  }

  deleteTodoItem(userId, titleId, itemId) {
    const todoList = this.usersTodo[userId];
    todoList[titleId].deleteItem(itemId);
  }

  addTodoItem(userId, titleId, task) {
    const todoList = this.usersTodo[userId];
    todoList[titleId].addTask(task.id, task.text);
  }

  toggleItemStatus(userId, titleId, taskId) {
    const todoList = this.usersTodo[userId];
    const title = todoList[titleId];
    title.mark(taskId);
  }

  toJson() {
    return JSON.stringify(this.usersTodo);
  }

  nextTodoId(userId) {
    const todo = this.usersTodo[userId];
    const keys = Object.keys(todo);
    return +findGreatest(keys) + 1;
  }

  nextItemId(userId, todoId) {
    const todoList = this.usersTodo[userId];
    const tasks = todoList[todoId];
    return tasks.nextId();
  }

  checkTodo(userId, id) {
    const todo = this.usersTodo[userId];
    return todo[id] && true;
  }

  checkTask(userId, titleId, itemId) {
    const todo = this.usersTodo[userId];
    return todo[titleId] && todo[titleId].hasTask(itemId);
  }
}

module.exports = {Todo, TodoCollection};
