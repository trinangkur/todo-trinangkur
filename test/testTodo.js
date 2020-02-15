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
  describe('toggleItemStatus', function() {
    it('should toggle the status of a todo item for a given user', () => {
      const reader = () => {
        return '{"rey-v@thi":{"1":{"name":"Hello","tasks":{"1":{"text":"Hei","status":false}}}}}';
      };
      const writer = (path, content) => {
        assert.strictEqual(path, 'anyPath');
        assert.strictEqual(
          content,
          '{"rey-v@thi":{"1":{"name":"Hello","tasks":{"1":{"text":"Hei","status":true}}}}}'
        );
      };
      const dataStore = new DataStore(reader, writer, 'anyPath');
      dataStore.initialize();
      dataStore.toggleItemStatus('rey-v@thi', '1', '1');
    });
  });
  describe('deleteTodoItem', function() {
    it('should delete a todo item for a given user', () => {
      const reader = () => {
        return '{"rey-v@thi":{"1":{"name":"Hello","tasks":{"1":{"text":"Hei","status":false}}}}}';
      };
      const writer = (path, content) => {
        assert.strictEqual(path, 'anyPath');
        assert.strictEqual(
          content,
          '{"rey-v@thi":{"1":{"name":"Hello","tasks":{}}}}'
        );
      };
      const dataStore = new DataStore(reader, writer, 'anyPath');
      dataStore.initialize();
      dataStore.deleteTodoItem('rey-v@thi', '1', '1');
    });
  });
  describe('editItem', function() {
    it('should edit the item of a given todoId and itemId for a given user', () => {
      const reader = () => {
        return '{"rey-v@thi":{"1":{"name":"Hello","tasks":{"1":{"text":"Hei","status":false}}}}}';
      };
      const writer = (path, content) => {
        assert.strictEqual(path, 'anyPath');
        assert.strictEqual(
          content,
          '{"rey-v@thi":{"1":{"name":"Hello","tasks":{"1":{"text":"Hoi","status":false}}}}}'
        );
      };
      const dataStore = new DataStore(reader, writer, 'anyPath');
      dataStore.initialize();
      dataStore.editItem('rey-v@thi', '1', '1', 'Hoi');
    });
  });
  describe('isTodoPresent ', function() {
    it('should return true when the given id is present', () => {
      const reader = () => {
        return '{"rey-v@thi":{"1":{"name":"Hello","tasks":{"1":{"text":"Hei","status":false}}}}}';
      };
      const dataStore = new DataStore(reader);
      dataStore.initialize();
      assert.ok(dataStore.isTodoPresent('rey-v@thi', '1'));
    });
    it('should return false when the given id is not present', () => {
      const reader = () => {
        return '{"rey-v@thi":{"1":{"name":"Hello","tasks":{"1":{"text":"Hei","status":false}}}}}';
      };
      const dataStore = new DataStore(reader);
      dataStore.initialize();
      assert.ok(!dataStore.isTodoPresent('rey-v@thi', '2'));
    });
  });
  describe('isTaskPresent ', function() {
    it('should return true when the given task id is present', () => {
      const reader = () => {
        return '{"rey-v@thi":{"1":{"name":"Hello","tasks":{"1":{"text":"Hei","status":false}}}}}';
      };
      const dataStore = new DataStore(reader);
      dataStore.initialize();
      assert.ok(dataStore.isTaskPresent('rey-v@thi', '1', '1'));
    });
    it('should return false when the given task id is not present', () => {
      const reader = () => {
        return '{"rey-v@thi":{"1":{"name":"Hello","tasks":{"1":{"text":"Hei","status":false}}}}}';
      };
      const dataStore = new DataStore(reader);
      dataStore.initialize();
      assert.ok(!dataStore.isTaskPresent('rey-v@thi', '1', '3'));
    });
  });
  describe('checkUser', function() {
    it('should return true when user id is present', () => {
      const reader = () => {
        return '{"rey-v@thi":{"1":{"name":"Hello","tasks":{"1":{"text":"Hei","status":false}}}}}';
      };
      const dataStore = new DataStore(reader);
      dataStore.initialize();
      assert.ok(dataStore.checkUser('rey-v@thi'));
    });
    it('should return false when user id is not present', () => {
      const reader = () => {
        return '{"rey-v@thi":{"1":{"name":"Hello","tasks":{"1":{"text":"Hei","status":false}}}}}';
      };
      const dataStore = new DataStore(reader);
      dataStore.initialize();
      assert.ok(!dataStore.checkUser('tri'));
    });
  });
});
