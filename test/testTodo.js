const assert = require('assert');
const {Todo, TodoCollection} = require('../lib/todo');

describe('TodoCollection', function() {
  describe('load', function() {
    it('should return empty object, when empty string is given', function() {
      assert.deepStrictEqual(TodoCollection.load(''), new TodoCollection());
    });
    it('should get same object for given same json', function() {
      const json = {
        t1581337001157: {
          name: 'hey',
          id: 't1581337001157',
          tasks: {
            i1581337003892: {
              id: 'i1581337003892',
              text: 'hey you',
              status: false
            }
          }
        }
      };
      assert.deepStrictEqual(
        TodoCollection.load(JSON.stringify(json)),
        TodoCollection.load(JSON.stringify(json))
      );
    });
  });
  describe('addTodo', function() {
    it('should add todo in todoCollection', function() {
      const json = {
        t1581337001157: {
          name: 'hey',
          id: 't1581337001157',
          tasks: {}
        }
      };
      const todoCollection = TodoCollection.load('');
      todoCollection.addTodo(new Todo('hey', 't1581337001157'));
      assert.deepStrictEqual(
        todoCollection,
        TodoCollection.load(JSON.stringify(json))
      );
    });
  });
  describe('addTodoItem', function() {
    it('should add task to given todo', function() {
      const json1 = {
        t1581337001157: {
          name: 'hey',
          id: 't1581337001157',
          tasks: {}
        }
      };
      const json2 = {
        t1581337001157: {
          name: 'hey',
          id: 't1581337001157',
          tasks: {
            i1: {
              id: 'i1',
              text: 'hey hey',
              status: false
            }
          }
        }
      };
      const todoCollection = TodoCollection.load(JSON.stringify(json1));
      todoCollection.addTodoItem('t1581337001157', {text: 'hey hey', id: 'i1'});
      assert.deepStrictEqual(
        todoCollection,
        TodoCollection.load(JSON.stringify(json2))
      );
    });
  });
  describe('toggleItemStatus', function() {
    it('should toggle status of a given item', function() {
      const json1 = {
        t1581337001157: {
          name: 'hey',
          id: 't1581337001157',
          tasks: {
            i1581337003892: {
              id: 'i1581337003892',
              text: 'hey you',
              status: false
            }
          }
        }
      };
      const json2 = {
        t1581337001157: {
          name: 'hey',
          id: 't1581337001157',
          tasks: {
            i1581337003892: {
              id: 'i1581337003892',
              text: 'hey you',
              status: true
            }
          }
        }
      };
      const todoCollection = TodoCollection.load(JSON.stringify(json1));
      todoCollection.toggleItemStatus('t1581337001157', 'i1581337003892');
      assert.deepStrictEqual(
        todoCollection,
        TodoCollection.load(JSON.stringify(json2))
      );
    });
  });
  describe('deleteTodo', function() {
    it('should delete Todo for a given id', function() {
      const json1 = {
        t1581337001157: {
          name: 'hey',
          id: 't1581337001157',
          tasks: {
            i1581337003892: {
              id: 'i1581337003892',
              text: 'hey you',
              status: false
            }
          }
        }
      };
      const todoCollection = TodoCollection.load(JSON.stringify(json1));
      todoCollection.deleteTodo('t1581337001157');
      assert.deepStrictEqual(todoCollection, TodoCollection.load('{}'));
    });
  });
  describe('deleteTodoItem', function() {
    it('should delete item of a todo for a given todoId and itemId', () => {
      const json1 = {
        t1581337001157: {
          name: 'hey',
          id: 't1581337001157',
          tasks: {
            i1581337003892: {
              id: 'i1581337003892',
              text: 'hey you',
              status: false
            }
          }
        }
      };
      const json2 = {
        t1581337001157: {
          name: 'hey',
          id: 't1581337001157',
          tasks: {}
        }
      };
      const todoCollection = TodoCollection.load(JSON.stringify(json1));
      todoCollection.deleteTodoItem('t1581337001157', 'i1581337003892');
      assert.deepStrictEqual(
        todoCollection,
        TodoCollection.load(JSON.stringify(json2))
      );
    });
  });
});
