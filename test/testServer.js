const request = require('supertest');
const fs = require('fs');

fs.writeFileSync(
  `${__dirname}/testTodoList.json`,
  '{"t1580877440369":{"name":"hey","id":"t1580877440369","tasks":{"i1580877444596":{"id":"i1580877444596","text":"how are you?","status":false}}}}'
);
const { requestListener } = require('../lib/handlers');

describe('Home Page', function() {
  it('should give home page / path', function(done) {
    request(requestListener)
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '1105')
      .expect(/TODO/, done);
  });
});

describe('GET Todo', function() {
  it('should give home page / path', function(done) {
    request(requestListener)
      .get('/getTodoList')
      .set('Accept', '*/*')
      .expect(200, done);
  });
});

describe('POST addTodoTitle', function() {
  it('should give home page / path', function(done) {
    request(requestListener)
      .post('/addTodoTitle')
      .send(`title=hallo`)
      .set('Accept', '*/*')
      .expect(200, done);
  });
});

describe('funcName', function() {
  it('should give home page / path', function(done) {
    request(requestListener)
      .post('/markItem')
      .send('titleId=t1580877440369&itemId=i1580877444596')
      .expect(200, done);
  });
  after(() => {
    fs.unlinkSync(`${__dirname}/testTodoList.json`);
  });
});

describe('funcName', function() {
  it('should give home page / path', function(done) {
    request(requestListener)
      .post('/deleteItem')
      .send('titleId=t1580877440369&itemId=i1580877444596')
      .expect(200, done);
  });
  after(() => {
    fs.unlinkSync(`${__dirname}/testTodoList.json`);
  });
});
