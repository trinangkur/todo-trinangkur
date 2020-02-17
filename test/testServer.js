const request = require('supertest');
const fs = require('fs');
const sinon = require('sinon');

const userJson = {
  'rey-v@thi': {name: 'revathi', password: '123'},
  'trinangkur@todo': {name: 'trinangkur', password: '123'},
  'ras@gmail.com': {name: 'rashmi', password: '1234'}
};

const todoJson = {
  'rey-v@thi': {
    '1': {name: 'hey', tasks: {'1': {text: 'hi', status: false}}}
  }
};

fs.writeFileSync(`${__dirname}/testTodoList.json`, JSON.stringify(todoJson));

fs.writeFileSync(`${__dirname}/testUser.json`, JSON.stringify(userJson));

const app = require('../lib/app.js');

describe('POST signUp', function() {
  it('should redirect to user url when post login request', function(done) {
    request(app)
      .post('/signUp')
      .set('Accept', '*/*')
      .send('name=tc&userId=t@c&password=123')
      .expect(302, done);
  });
});

describe('POST redirect login', function() {
  before(() => {
    const date = new Date(1581765621982);
    sinon.useFakeTimers(date);
  });
  it('should redirect to user url when post login request', function(done) {
    request(app)
      .post('/login')
      .set('Accept', '*/*')
      .send('userId=rey-v@thi&password=123')
      .expect(200, done)
      .expect(/{"isSuccessful":true}/);
  });
  it('should redirect to login when the user details is not in userStore', function(done) {
    request(app)
      .post('/login')
      .set('Accept', '*/*')
      .send('userId=imNotUser&password=123')
      .expect(200, done)
      .expect(/{"isSuccessful":false}/);
  });
  after(() => {
    sinon.restore();
  });
});

describe('Home Page', function() {
  let fakeDate;
  before(() => {
    const date = new Date(1581765621982);
    fakeDate = sinon.useFakeTimers(date);
  });
  it('should give home page / path', function(done) {
    request(app)
      .get('/')
      .set('Accept', '*/*')
      .set('Cookie', fakeDate.now)
      .expect(302, done);
  });
  after(() => {
    sinon.restore();
  });
});

describe('GET Todo', function() {
  let fakeDate;
  before(() => {
    const date = new Date(1581765621982);
    fakeDate = sinon.useFakeTimers(date);
  });
  it('should give 200 and json', function(done) {
    request(app)
      .get('/getTodoList')
      .set('Accept', '*/*')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .expect(200, done);
  });
  after(() => {
    sinon.restore();
  });
});

describe('GET bad', function() {
  let fakeDate;
  before(() => {
    const date = new Date(1581765621982);
    fakeDate = sinon.useFakeTimers(date);
  });
  it('should give 404', function(done) {
    request(app)
      .get('/bad')
      .set('Accept', '*/*')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .expect(404, done);
  });
  after(() => {
    sinon.restore();
  });
});

describe('POST addTodoTitle', function() {
  let fakeDate;
  beforeEach(() => {
    const date = new Date(1581765621982);
    fakeDate = sinon.useFakeTimers(date);
  });
  it('should give 200 as status code and will give json back', function(done) {
    request(app)
      .post('/addTodoTitle')
      .send('title=hallo')
      .set('Accept', '*/*')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(app)
      .post('/addTodoTitle')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .expect(400, done);
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe('POST mark item', function() {
  let fakeDate;
  beforeEach(() => {
    const date = new Date(1581765621982);
    fakeDate = sinon.useFakeTimers(date);
  });
  it('should give mark one item', function(done) {
    request(app)
      .post('/markItem')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleId=1&itemId=1')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(app)
      .post('/markItem')
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .expect(400, done);
  });
  it('should give status code as 404 for a given wrong id', function(done) {
    request(app)
      .post('/markItem')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleId=1580877440369&itemId=i15')
      .expect(404, done);
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe('POST addItemToTitle', function() {
  let fakeDate;
  beforeEach(() => {
    const date = new Date(1581765621982);
    fakeDate = sinon.useFakeTimers(date);
  });
  it('should give 200 status code', function(done) {
    request(app)
      .post('/addItemToTitle')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleId=1&text=hallo')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(app)
      .post('/addItemToTitle')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .set('Accept', '*/*')
      .send('titleHo=hallo')
      .expect(400, done);
  });
  it('should give status code as 404 for a given wrong id', function(done) {
    request(app)
      .post('/addItemToTitle')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleId=t15809&text=hallo')
      .expect(404, done);
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe('POST editTitle', function() {
  let fakeDate;
  beforeEach(() => {
    const date = new Date(1581765621982);
    fakeDate = sinon.useFakeTimers(date);
  });
  it('should give 200 status code', function(done) {
    request(app)
      .post('/editTitle')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleId=1&titleText=hii')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(app)
      .post('/editTitle')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleHo=hallo')
      .set('Accept', '*/*')
      .expect(400, done);
  });
  it('should give 404 as status code when wrong id is given', function(done) {
    request(app)
      .post('/editTitle')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleId=t157&titleText=hii')
      .expect(404, done);
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe('POST editItem', function() {
  let fakeDate;
  beforeEach(() => {
    const date = new Date(1581765621982);
    fakeDate = sinon.useFakeTimers(date);
  });
  it('should give 200 status code', function(done) {
    request(app)
      .post('/editItem')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleId=1&itemId=1&itemText=drink water')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(app)
      .post('/editItem')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .set('Accept', '*/*')
      .send('titleHo=hallo')
      .expect(400, done);
  });
  it('should give 404 as status code for a given wrong id', function(done) {
    request(app)
      .post('/editItem')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleId=1&itemId=i1580874596&itemText=drink water')
      .expect(404, done);
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe('POST deleteItem', function() {
  let fakeDate;
  beforeEach(() => {
    const date = new Date(1581765621982);
    fakeDate = sinon.useFakeTimers(date);
  });
  it('should give 200 status code', function(done) {
    request(app)
      .post('/deleteItem')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleId=1&itemId=1')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(app)
      .post('/deleteItem')
      .set('Accept', '*/*')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleHo=hallo')
      .expect(400, done);
  });
  it('should give 404 for a given wrong id', function(done) {
    request(app)
      .post('/deleteItem')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleId=1&itemId=i15808774596')
      .expect(404, done);
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe('POST deleteTodoTitle', function() {
  let fakeDate;
  beforeEach(() => {
    const date = new Date(1581765621982);
    fakeDate = sinon.useFakeTimers(date);
  });
  it('should give 200 status code', function(done) {
    request(app)
      .post('/deleteTodoTitle')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleId=1')
      .expect(200, done);
  });
  it('should give 400 as status code and will give json back', function(done) {
    request(app)
      .post('/deleteTodoTitle')
      .set('Accept', '*/*')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleHo=hallo')
      .expect(400, done);
  });
  it('should give 404 for a given wrong id', function(done) {
    request(app)
      .post('/deleteTodoTitle')
      .set('Cookie', `_sid=${fakeDate.now}`)
      .send('titleId=t15808774409')
      .expect(404, done);
  });
  after(() => {
    fs.unlinkSync(`${__dirname}/testTodoList.json`);
    fs.unlinkSync(`${__dirname}/testUser.json`);
    sinon.restore();
  });
});
