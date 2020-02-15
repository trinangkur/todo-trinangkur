const assert = require('assert');
const {Todo} = require('../lib/todo');
const DataStore = require('../lib/dataStore');

describe('DataStore', function() {
  describe('initialize', function() {
    it('should hve todoCollection in it', function() {
      const reader = () => {
        return '';
      };
      const writer = () => {};
      const dataStore = new DataStore(reader, writer, 'anyPath');
      dataStore.initialize();
      assert.ok('todoCollection' in dataStore);
    });
    it('should hve todoCollection in it while reader returns some data', () => {
      const reader = () => {
        return `{
  "rey-v@thi": {
    "1": {
      "name": "Hello",
      "tasks": {
        "1": {"text": "Hei", "status": false},
        "2": {"text": "Then", "status": true}
      }
    }
  }
}`;
      };
      const writer = () => {};
      const dataStore = new DataStore(reader, writer, 'anyPath');
      dataStore.initialize('hey');
      assert.ok('todoCollection' in dataStore);
    });
  });
  describe('read', function() {
    it('should return expected json', function() {
      const reader = () => {
        return '{"rey-v@thi": {}}';
      };
      const writer = () => {};
      const dataStore = new DataStore(reader, writer, 'anyPath');
      assert.strictEqual(dataStore.read(), '{"rey-v@thi": {}}');
    });
  });
  describe('write', function() {
    it('should write all user data', function() {
      const reader = () => {
        return '{"rey-v@thi": {}}';
      };
      const writer = (path, content) => {
        assert.strictEqual(path, 'anyPath');
        assert.strictEqual(content, '{"rey-v@thi": {}}');
      };
      const dataStore = new DataStore(reader, writer, 'anyPath');
      dataStore.initialize();
    });
  });
  describe('initializeUser', function() {
    it('should initialize for the given userId', function() {
      const reader = () => {
        return '{"rey-v@thi": {}}';
      };
      const writer = (path, content) => {
        assert.strictEqual(path, 'anyPath');
        assert.strictEqual(content, '{"rey-v@thi": {},"tri":{}}');
      };
      const dataStore = new DataStore(reader, writer, 'anyPath');
      dataStore.initialize();
      dataStore.initializeUser('tri');
    });
  });
  describe('addTodo', function() {
    it('should add todo for the given userId', function() {
      const reader = () => {
        return '{"rey-v@thi": {}}';
      };
      const writer = (path, content) => {
        assert.strictEqual(path, 'anyPath');
        assert.strictEqual(
          content,
          '{"rey-v@thi":{"12":{"name":"hello","tasks":{}}}}'
        );
      };
      const dataStore = new DataStore(reader, writer, 'anyPath');
      dataStore.initialize();
      dataStore.addTodo('rey-v@thi', '12', new Todo('hello', {}));
    });
  });
  describe('editTitle', function() {
    it('should edit title for given user', function() {
      const reader = () => {
        return '{"rey-v@thi":{"12":{"name":"hello","tasks":{}}}}';
      };
      const writer = (path, content) => {
        assert.strictEqual(path, 'anyPath');
        assert.strictEqual(
          content,
          '{"rey-v@thi":{"12":{"name":"hell","tasks":{}}}}'
        );
      };
      const dataStore = new DataStore(reader, writer, 'anyPath');
      dataStore.initialize();
      dataStore.editTitle('rey-v@thi', '12', 'hell');
    });
  });
  describe('deleteTodo', function() {
    it('should delete a todo for one user', function() {
      const reader = () => {
        return '{"rey-v@thi":{"12":{"name":"hello","tasks":{}}}}';
      };
      const writer = (path, content) => {
        assert.strictEqual(path, 'anyPath');
        assert.strictEqual(content, '{"rey-v@thi":{}}');
      };
      const dataStore = new DataStore(reader, writer, 'anyPath');
      dataStore.initialize();
      dataStore.addTodo('rey-v@thi', '12');
    });
  });
  describe('addTodoItem', function() {
    it('should delete item of a todo for a given todoId and itemId', () => {
      const reader = () => {
        return '{"rey-v@thi":{"1":{"name":"Hello","tasks":{}}}}';
      };
      const writer = (path, content) => {
        assert.strictEqual(path, 'anyPath');
        assert.strictEqual(
          content,
          '{"rey-v@thi":{"1":{"name":"Hello","tasks":{"1":{"text":"Hei","status":false}}}}}'
        );
      };
      const dataStore = new DataStore(reader, writer, 'anyPath');
      dataStore.initialize();
      dataStore.addTodoItem('rey-v@thi', '1', {id: 1, text: 'Hei'});
    });
  });

  //   describe('editItem', function() {
  //     it('should edit the item of given todoId and itemId', () => {
  //       const json1 = {
  //         12: {
  //           name: 'hey',
  //           tasks: {
  //             21: {
  //               text: 'hey you',
  //               status: false
  //             }
  //           }
  //         }
  //       };
  //       const json2 = {
  //         12: {
  //           name: 'hey',
  //           tasks: {
  //             21: {
  //               text: 'hey me',
  //               status: false
  //             }
  //           }
  //         }
  //       };
  //       const todoList = TodoCollection.load(JSON.stringify(json1));
  //       todoList.editItem('12', '21', 'hey me');
  //       assert.deepStrictEqual(
  //         todoList,
  //         TodoCollection.load(JSON.stringify(json2))
  //       );
  //     });
  //   });
  //   describe('toJson', function() {
  //     it('should return the json stringify of todoObject', function() {
  //       const json1 = {
  //         12: {
  //           name: 'hey',
  //           tasks: {}
  //         }
  //       };
  //       const todoList = TodoCollection.load(JSON.stringify(json1));
  //       assert.strictEqual(todoList.toJson(), JSON.stringify(json1));
  //     });
  //   });
  //   describe('writeTo', function() {
  //     it('should give writer the json stringify of todoObject', function() {
  //       const json1 = {
  //         12: {
  //           name: 'hey',
  //           tasks: {}
  //         }
  //       };
  //       const writer = (path, json) => {
  //         assert.strictEqual(json, JSON.stringify(json1));
  //         assert.strictEqual(path, './data/thisIsThePath');
  //       };
  //       const todoList = TodoCollection.load(JSON.stringify(json1));
  //       todoList.writeTo(writer, './data/thisIsThePath');
  //     });
  //   });
  //   describe('nextTodoId', function() {
  //     it('should edit the item of given todoId and itemId', () => {
  //       const json1 = {
  //         '2': {
  //           name: 'hey',
  //           tasks: {}
  //         },
  //         '1': {
  //           name: 'hey you',
  //           tasks: {}
  //         },
  //         '-1': {
  //           name: 'hey ho',
  //           tasks: {}
  //         }
  //       };
  //       const todoList = TodoCollection.load(JSON.stringify(json1));
  //       assert.strictEqual(todoList.nextTodoId(), 3);
  //     });
  //   });
});
