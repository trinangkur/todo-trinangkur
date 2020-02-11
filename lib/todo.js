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
}

class TodoCollection {
  constructor() {
    this.todo = {};
  }

  addTodo(key, title) {
    this.todo[key] = title;
  }

  static load(content) {
    const todoList = JSON.parse(content || '{}');
    const todo = new TodoCollection();
    Object.keys(todoList).forEach(key => {
      todo.addTodo(key, new Todo(todoList[key].name, todoList[key].tasks));
    });
    return todo;
  }

  editTitle(titleId, title) {
    this.todo[titleId].editTitleName(title);
  }

  editItem(titleId, itemId, itemText) {
    this.todo[titleId].editItemText(itemId, itemText);
  }

  deleteTodo(titleId) {
    delete this.todo[titleId];
  }

  deleteTodoItem(titleId, itemId) {
    this.todo[titleId].deleteItem(itemId);
  }

  addTodoItem(titleId, task) {
    const title = this.todo[titleId];
    title.addTask(task.id, task.text);
  }

  toggleItemStatus(titleId, taskId) {
    const title = this.todo[titleId];
    title.mark(taskId);
  }

  toJson() {
    return JSON.stringify(this.todo);
  }

  writeTo(writer, path) {
    writer(path, this.toJson());
  }

  nextId() {
    const keys = Object.keys(this.todo);
    console.log(this.todo, keys);
    return findGreatest(keys) + 1;
  }
}

module.exports = {TodoCollection, Todo};
