class Todo {
  constructor(name, id, tasks) {
    this.name = name;
    this.id = id;
    this.tasks = tasks || {};
  }
  addTask(id, text) {
    this.tasks[id] = {id, text, status: false};
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

  addTodo(title) {
    this.todo[title.id] = title;
  }

  static load(content) {
    const todoList = JSON.parse(content || '{}');
    const todo = new TodoCollection();
    Object.keys(todoList).forEach(key => {
      todo.addTodo(
        new Todo(todoList[key].name, todoList[key].id, todoList[key].tasks)
      );
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

  markItem(titleId, taskId) {
    const title = this.todo[titleId];
    title.mark(taskId);
  }

  toJson() {
    return JSON.stringify(this.todo);
  }

  writeTo(writer, path) {
    writer(path, this.toJson());
  }
}

module.exports = {TodoCollection, Todo};
