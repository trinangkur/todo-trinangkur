class Todo {
  constructor(name, id, tasks) {
    this.name = name;
    this.id = id;
    this.tasks = tasks || {};
  }
  addTask(id, text) {
    this.tasks[id] = { id, text, status: false };
  }
  mark(id) {
    const task = this.tasks[id];
    task.status = !task.status;
  }
  deleteItem(id) {
    delete this.tasks[id];
  }
  editName(name) {
    this.name = name;
  }
}

class TodoCollection {
  constructor() {
    this.todo = {};
  }

  addTodoTitle(title) {
    this.todo[title.id] = title;
  }

  static load(content) {
    const todoList = JSON.parse(content || '{}');
    const todo = new TodoCollection();
    Object.keys(todoList).forEach(key => {
      todo.addTodoTitle(
        new Todo(todoList[key].name, todoList[key].id, todoList[key].tasks)
      );
    });
    return todo;
  }

  editTitle(titleId, title) {
    this.todo[titleId].editName(title);
  }

  deleteTodo(titleId) {
    delete this.todo[titleId];
  }

  deleteTodoItem(titleId, itemId) {
    this.todo[titleId].deleteItem(itemId);
  }

  addTaskToTitle(titleId, task) {
    const title = this.todo[titleId];
    title.addTask(task.id, task.text);
  }

  markItem(titleId, taskId) {
    const title = this.todo[titleId];
    title.mark(taskId);
  }

  get titleJson() {
    return JSON.stringify(this.todo);
  }
}

module.exports = { TodoCollection, Todo };
