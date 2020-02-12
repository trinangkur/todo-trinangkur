const request = require('supertest');
const fs = require('fs');

fs.writeFileSync(
  `${__dirname}/testTodoList.json`,
  `{"t1580877440369":
  {"name":"hey","tasks":
  {"i1580877444596":
  {"text":"how are you?","status":false}}}}`
);
const {requestListener} = require('../lib/router.js');

describe('Home Page', function() {
  it('should give home page / path', function(done) {
    request(requestListener)
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect(/TODO/, done);
  });
});

describe('GET Todo', function() {
  it('should give 200 and json', function(done) {
    request(requestListener)
      .get('/getTodoList')
      .set('Accept', '*/*')
      .expect(200, done);
  });
});

describe('GET bad', function() {
  it('should give 404', function(done) {
    request(requestListener)
      .get('/bad')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe('POST addTodoTitle', function() {
  it('should give 200 as status code and will give json back', function(done) {
    request(requestListener)
      .post('/addTodoTitle')
      .send('title=hallo')
      .set('Accept', '*/*')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(requestListener)
      .post('/addTodoTitle')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
});

describe('POST mark item', function() {
  it('should give mark one item', function(done) {
    request(requestListener)
      .post('/markItem')
      .send('titleId=t1580877440369&itemId=i1580877444596')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(requestListener)
      .post('/markItem')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
});

describe('POST addItemToTitle', function() {
  it('should give 200 status code', function(done) {
    request(requestListener)
      .post('/addItemToTitle')
      .send('titleId=t1580877440369&text=hallo')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(requestListener)
      .post('/addItemToTitle')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
});

describe('POST editTitle', function() {
  it('should give 200 status code', function(done) {
    request(requestListener)
      .post('/editTitle')
      .send('titleId=t1580877440369&titleText=hii')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(requestListener)
      .post('/editTitle')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
});

describe('POST editItem', function() {
  it('should give 200 status code', function(done) {
    request(requestListener)
      .post('/editItem')
      .send('titleId=t1580877440369&itemId=i1580877444596&itemText=drink water')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(requestListener)
      .post('/editItem')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
});

describe('POST deleteItem', function() {
  it('should give 200 status code', function(done) {
    request(requestListener)
      .post('/deleteItem')
      .send('titleId=t1580877440369&itemId=i1580877444596')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(requestListener)
      .post('/deleteItem')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
});

describe('POST deleteTodoTitle', function() {
  it('should give 200 status code', function(done) {
    request(requestListener)
      .post('/deleteTodoTitle')
      .send('titleId=t1580877440369')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(requestListener)
      .post('/deleteTodoTitle')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
  after(() => {
    fs.unlinkSync(`${__dirname}/testTodoList.json`);
  });
});

describe('POST notfound', function() {
  it('should give 404 status code', function(done) {
    request(requestListener)
      .post('/hey hey')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe('PUT method not allowed', function() {
  it('should give 405 as status code', function(done) {
    request(requestListener)
      .put('/deleteTodoTitle')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(405, done);
  });
});
