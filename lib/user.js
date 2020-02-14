class User {
  constructor() {
    this.users = {};
  }
  static load(content) {
    const userCollection = JSON.parse(content || '{}');
    const user = new User();
    Object.keys(userCollection).forEach(userId => {
      user.addUser(userId, userCollection.name, userCollection.password);
    });
    return user;
  }

  addUser(key, name, password) {
    this.users[key] = {name, password};
  }

  toJson() {
    return JSON.stringify(this.users);
  }
}

module.exports = User;
