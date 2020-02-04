class Title {
  constructor(name, id, tasks) {
    this.name = name;
    this.id = id;
    this.tasks = tasks || [];
  }
  addTask(id, text) {
    this.tasks.push({ id, text, status: false });
  }
}

class Todo {
  constructor() {
    this.todo = [];
  }

  addTodoTitle(title) {
    this.todo.push(title);
  }

  static load(content) {
    const todoList = JSON.parse(content || '[]');
    const todo = new Todo();
    todoList.forEach(c => {
      todo.addTodoTitle(new Title(c.name, c.id, c.tasks));
    });
    return todo;
  }

  addTaskToTitle(titleId, task) {
    const title = this.todo.find(title => title.id === titleId);
    title.addTask(task.id, task.text);
  }
  get titleJson() {
    return JSON.stringify(this.todo);
  }
}

module.exports = { Todo, Title };
