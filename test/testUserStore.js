const UserStore = require('../lib/userStore');
const assert = require('assert');

describe('userStore', function() {
  describe('initialize', function() {
    it('should initialize all the users', function() {
      const reader = () => {
        return '{"rey-v@thi":{"name":"revathi","password":"123"}}';
      };
      const writer = () => {};
      const userStore = new UserStore(reader, writer, 'anyPath');
      assert.ok(userStore.initialize());
    });
    it('should initialize with empty object,when no user has sign up', function() {
      const reader = () => {
        return '';
      };
      const writer = () => {};
      const userStore = new UserStore(reader, writer, 'anyPath');
      assert.ok(userStore.initialize());
    });
  });
  describe('read', function() {
    it('should return whatever content reader gives', function() {
      const reader = () => {
        return '';
      };
      const writer = () => {};
      const userStore = new UserStore(reader, writer, 'anyPath');
      assert.strictEqual(userStore.read(), '');
    });
  });
  describe('write', function() {
    it('should have readers content as parameter', function() {
      const reader = () => {
        return '';
      };
      const writer = (path, data) => {
        assert.strictEqual(path, 'anyPath');
        assert.strictEqual(data, '{}');
      };
      const userStore = new UserStore(reader, writer, 'anyPath');
      userStore.initialize();
      userStore.write();
    });
  });
  describe('addUser', function() {
    it('should add new user', function() {
      const reader = () => {
        return '';
      };
      const writer = (path, data) => {
        assert.strictEqual(path, 'anyPath');
        assert.strictEqual(
          data,
          '{"rev@todo":{"name":"revathi","password":"123"}}'
        );
      };
      const userStore = new UserStore(reader, writer, 'anyPath');
      userStore.initialize();
      userStore.addUser({userId: 'rev@todo', name: 'revathi', password: '123'});
    });
  });
  describe('isValidUser', function() {
    it('should check whether given userId and password are right', function() {
      const reader = () => {
        return '{"rev@todo":{"name":"revathi","password":"123"}}';
      };
      const writer = () => {};
      const userStore = new UserStore(reader, writer, 'anyPath');
      userStore.initialize();
      assert.ok(userStore.isValidUser({userId: 'rev@todo', password: '123'}));
      assert.ok(!userStore.isValidUser({userId: 'rev@todo', password: '1234'}));
    });
  });
  describe('isUserIdAvailable', function() {
    it('should check whether given userId and password are right', function() {
      const reader = () => {
        return '{"rev@todo":{"name":"revathi","password":"123"}}';
      };
      const writer = () => {};
      const userStore = new UserStore(reader, writer, 'anyPath');
      userStore.initialize();
      assert.ok(userStore.isUserIdAvailable('rev@todo'));
      assert.ok(!userStore.isUserIdAvailable('rev@tod'));
    });
  });
});
