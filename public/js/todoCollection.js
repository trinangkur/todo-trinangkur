class TodoCollection {
  constructor() {
    this.todo = {};
  }
  update(newTodo) {
    this.todo = newTodo;
  }
  get list() {
    return this.todo;
  }
}
