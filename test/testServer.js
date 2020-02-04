const request = require('supertest');
const { requestListener } = require('../lib/handlers');

describe('Home Page', function() {
  it('should give home page / path', function(done) {
    request(requestListener)
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html', done)
      .expect(/TODO/);
  });
});
