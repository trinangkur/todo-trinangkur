class User {
  constructor() {
    this.users = {};
  }
  static load(content) {
    const userCollection = JSON.parse(content || '{}');
    const user = new User();
    Object.keys(userCollection).forEach(userId => {
      const name = userCollection[userId].name;
      const password = userCollection[userId].password;
      user.addUser(userId, name, password);
    });
    return user;
  }

  addUser(key, name, password) {
    this.users[key] = {name, password};
  }

  toJson() {
    return JSON.stringify(this.users);
  }
  isValidUser(id, password) {
    return this.users[id] && this.users[id].password === password;
  }
  isUserIdAvailable(id) {
    return this.users[id] && true;
  }
}

module.exports = User;
