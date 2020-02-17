class SessionManager {
  constructor() {
    this.sessions = {};
  }
  createSession(cookie, userId) {
    this.sessions[cookie] = userId;
  }
  getUserId(cookie) {
    return this.sessions[cookie];
  }

  isSessionAlive(cookie) {
    return Object.keys(this.sessions).includes(cookie);
  }

  clearSession(cookie) {
    delete this.sessions[cookie];
  }
}

module.exports = SessionManager;
