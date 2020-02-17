const User = require('./user');

class UserStore {
  constructor(reader, writer, path) {
    this.reader = reader;
    this.writer = writer;
    this.path = path;
  }

  initialize() {
    this.user = User.load(this.read());
  }

  read() {
    return this.reader(this.path, 'utf8');
  }

  write() {
    this.writer(this.path, this.user.toJson());
  }

  addUser(userDetails) {
    const {userId, name, password} = userDetails;
    this.user.addUser(userId, name, password);
    this.write();
  }
  isValidUser(user) {
    const {userId, password} = user;
    return this.user.isValidUser(userId, password);
  }

  isUserIdAvailable(userId) {
    return this.user.isUserIdAvailable(userId);
  }
}

module.exports = UserStore;
