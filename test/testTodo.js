const assert = require('assert');
const {Todo, TodoList} = require('../lib/todo');

describe('todoList', function() {
  describe('load', function() {
    it('should return empty object, when empty string is given', function() {
      assert.deepStrictEqual(TodoList.load(''), new TodoList());
    });
    it('should get same object for given same json', function() {
      const json = {
        t1581337001157: {
          name: 'hey',
          tasks: {
            i1581337003892: {
              text: 'hey you',
              status: false
            }
          }
        }
      };
      assert.deepStrictEqual(
        TodoList.load(JSON.stringify(json)),
        TodoList.load(JSON.stringify(json))
      );
    });
  });
  describe('addTodo', function() {
    it('should add todo in todoList', function() {
      const json = {
        t1581337001157: {
          name: 'hey',
          tasks: {}
        }
      };
      const todoList = TodoList.load('');
      todoList.addTodo('t1581337001157', new Todo('hey'));
      assert.deepStrictEqual(todoList, TodoList.load(JSON.stringify(json)));
    });
  });
  describe('addTodoItem', function() {
    it('should add task to given todo', function() {
      const json1 = {
        t1581337001157: {
          name: 'hey',
          tasks: {}
        }
      };
      const json2 = {
        t1581337001157: {
          name: 'hey',
          tasks: {
            i1: {
              text: 'hey hey',
              status: false
            }
          }
        }
      };
      const todoList = TodoList.load(JSON.stringify(json1));
      todoList.addTodoItem('t1581337001157', {text: 'hey hey', id: 'i1'});
      assert.deepStrictEqual(todoList, TodoList.load(JSON.stringify(json2)));
    });
  });
  describe('toggleItemStatus', function() {
    it('should toggle status of a given item', function() {
      const json1 = {
        t1581337001157: {
          name: 'hey',
          tasks: {
            i1581337003892: {
              text: 'hey you',
              status: false
            }
          }
        }
      };
      const json2 = {
        t1581337001157: {
          name: 'hey',
          tasks: {
            i1581337003892: {
              text: 'hey you',
              status: true
            }
          }
        }
      };
      const todoList = TodoList.load(JSON.stringify(json1));
      todoList.toggleItemStatus('t1581337001157', 'i1581337003892');
      assert.deepStrictEqual(todoList, TodoList.load(JSON.stringify(json2)));
    });
  });
  describe('deleteTodo', function() {
    it('should delete Todo for a given id', function() {
      const json1 = {
        t1581337001157: {
          name: 'hey',
          tasks: {
            i1581337003892: {
              text: 'hey you',
              status: false
            }
          }
        }
      };
      const todoList = TodoList.load(JSON.stringify(json1));
      todoList.deleteTodo('t1581337001157');
      assert.deepStrictEqual(todoList, TodoList.load('{}'));
    });
  });
  describe('deleteTodoItem', function() {
    it('should delete item of a todo for a given todoId and itemId', () => {
      const json1 = {
        t1581337001157: {
          name: 'hey',
          tasks: {
            i1581337003892: {
              text: 'hey you',
              status: false
            }
          }
        }
      };
      const json2 = {
        t1581337001157: {
          name: 'hey',
          tasks: {}
        }
      };
      const todoList = TodoList.load(JSON.stringify(json1));
      todoList.deleteTodoItem('t1581337001157', 'i1581337003892');
      assert.deepStrictEqual(todoList, TodoList.load(JSON.stringify(json2)));
    });
  });
  describe('editTitle', function() {
    it('should edit the title of given todoId', () => {
      const json1 = {
        t1581337001157: {
          name: 'hey',
          tasks: {
            i1581337003892: {
              text: 'hey you',
              status: false
            }
          }
        }
      };
      const json2 = {
        t1581337001157: {
          name: 'hi',
          tasks: {
            i1581337003892: {
              text: 'hey you',
              status: false
            }
          }
        }
      };
      const todoList = TodoList.load(JSON.stringify(json1));
      todoList.editTitle('t1581337001157', 'hi');
      assert.deepStrictEqual(todoList, TodoList.load(JSON.stringify(json2)));
    });
  });
  describe('editItem', function() {
    it('should edit the item of given todoId and itemId', () => {
      const json1 = {
        t1581337001157: {
          name: 'hey',
          tasks: {
            i1581337003892: {
              text: 'hey you',
              status: false
            }
          }
        }
      };
      const json2 = {
        t1581337001157: {
          name: 'hey',
          tasks: {
            i1581337003892: {
              text: 'hey me',
              status: false
            }
          }
        }
      };
      const todoList = TodoList.load(JSON.stringify(json1));
      todoList.editItem('t1581337001157', 'i1581337003892', 'hey me');
      assert.deepStrictEqual(todoList, TodoList.load(JSON.stringify(json2)));
    });
  });
  describe('toJson', function() {
    it('should return the json stringify of todoObject', function() {
      const json1 = {
        t1581337001157: {
          name: 'hey',
          tasks: {}
        }
      };
      const todoList = TodoList.load(JSON.stringify(json1));
      assert.strictEqual(todoList.toJson(), JSON.stringify(json1));
    });
  });
  describe('writeTo', function() {
    it('should give writer the json stringify of todoObject', function() {
      const json1 = {
        t1581337001157: {
          name: 'hey',
          tasks: {}
        }
      };
      const writer = (path, json) => {
        assert.strictEqual(json, JSON.stringify(json1));
        assert.strictEqual(path, './data/thisIsThePath');
      };
      const todoList = TodoList.load(JSON.stringify(json1));
      todoList.writeTo(writer, './data/thisIsThePath');
    });
  });
  describe('nextTodoId', function() {
    it('should edit the item of given todoId and itemId', () => {
      const json1 = {
        '2': {
          name: 'hey',
          tasks: {}
        },
        '1': {
          name: 'hey you',
          tasks: {}
        },
        '-1': {
          name: 'hey ho',
          tasks: {}
        }
      };
      const todoList = TodoList.load(JSON.stringify(json1));
      assert.strictEqual(todoList.nextTodoId(), 3);
    });
  });
});
