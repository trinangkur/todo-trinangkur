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
      todoCollection.addTodoTitle(new Todo('hey', 't1581337001157'));
      assert.deepStrictEqual(
        todoCollection,
        TodoCollection.load(JSON.stringify(json))
      );
    });
  });
});
