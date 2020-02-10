const assert = require('assert');
const {TodoCollection} = require('../lib/todo');

describe('TodoCollection', function() {
  describe('load', function() {
    it('should return empty object, when empty string is given', function() {
      assert.deepStrictEqual(TodoCollection.load(''), new TodoCollection());
    });
    it('should ')
  });
});
