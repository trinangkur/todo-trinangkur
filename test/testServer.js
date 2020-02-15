const request = require('supertest');
const fs = require('fs');

fs.writeFileSync(
  `${__dirname}/testTodoList.json`,
  `{"1580877440369":
  {"name":"hey","tasks":
  {"1580877444596":
  {"text":"how are you?","status":false}}}}`
);

fs.writeFileSync(`${__dirname}/testUser.json`, '');

const app = require('../lib/router.js');

describe('Home Page', function() {
  it('should give home page / path', function(done) {
    request(app)
      .get('/user/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=UTF-8')
      .expect(/TODO/, done);
  });
});

describe('GET Todo', function() {
  it('should give 200 and json', function(done) {
    request(app)
      .get('/user/getTodoList')
      .set('Accept', '*/*')
      .expect(200, done);
  });
});

describe('GET bad', function() {
  it('should give 404', function(done) {
    request(app)
      .get('/user/bad')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe('POST addTodoTitle', function() {
  it('should give 200 as status code and will give json back', function(done) {
    request(app)
      .post('/user/addTodoTitle')
      .send('title=hallo')
      .set('Accept', '*/*')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(app)
      .post('/user/addTodoTitle')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
});

describe('POST mark item', function() {
  it('should give mark one item', function(done) {
    request(app)
      .post('/user/markItem')
      .send('titleId=1580877440369&itemId=1580877444596')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(app)
      .post('/user/markItem')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
  it('should give status code as 404 for a given wrong id', function(done) {
    request(app)
      .post('/user/markItem')
      .send('titleId=1580877440369&itemId=i15')
      .expect(404, done);
  });
});

describe('POST addItemToTitle', function() {
  it('should give 200 status code', function(done) {
    request(app)
      .post('/user/addItemToTitle')
      .send('titleId=1580877440369&text=hallo')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(app)
      .post('/user/addItemToTitle')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
  it('should give status code as 404 for a given wrong id', function(done) {
    request(app)
      .post('/user/addItemToTitle')
      .send('titleId=t15809&text=hallo')
      .expect(404, done);
  });
});

describe('POST editTitle', function() {
  it('should give 200 status code', function(done) {
    request(app)
      .post('/user/editTitle')
      .send('titleId=1580877440369&titleText=hii')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(app)
      .post('/user/editTitle')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
  it('should give 404 as status code when wrong id is given', function(done) {
    request(app)
      .post('/user/editTitle')
      .send('titleId=t157&titleText=hii')
      .expect(404, done);
  });
});

describe('POST editItem', function() {
  it('should give 200 status code', function(done) {
    request(app)
      .post('/user/editItem')
      .send('titleId=1580877440369&itemId=1580877444596&itemText=drink water')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(app)
      .post('/user/editItem')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
  it('should give 404 as status code for a given wrong id', function(done) {
    request(app)
      .post('/user/editItem')
      .send('titleId=t158440369&itemId=i1580874596&itemText=drink water')
      .expect(404, done);
  });
});

describe('POST deleteItem', function() {
  it('should give 200 status code', function(done) {
    request(app)
      .post('/user/deleteItem')
      .send('titleId=1580877440369&itemId=1580877444596')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(app)
      .post('/user/deleteItem')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
  it('should give 404 for a given wrong id', function(done) {
    request(app)
      .post('/user/deleteItem')
      .send('titleId=t1580877369&itemId=i15808774596')
      .expect(404, done);
  });
});

describe('POST deleteTodoTitle', function() {
  it('should give 200 status code', function(done) {
    request(app)
      .post('/user/deleteTodoTitle')
      .send('titleId=1580877440369')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(app)
      .post('/user/deleteTodoTitle')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
  it('should give 404 for a given wrong id', function(done) {
    request(app)
      .post('/user/deleteTodoTitle')
      .send('titleId=t15808774409')
      .expect(404, done);
  });
  after(() => {
    fs.unlinkSync(`${__dirname}/testTodoList.json`);
  });
});

describe('POST notfound', function() {
  it('should give 404 status code', function(done) {
    request(app)
      .post('/user/hey hey')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe('POST redirect login', function() {
  it('should redirect to user url when post login request', function(done) {
    request(app)
      .post('/login')
      .set('Accept', '*/*')
      .expect(302, done);
  });
  after(() => {
    fs.unlinkSync(`${__dirname}/testUser.json`);
  });
});
