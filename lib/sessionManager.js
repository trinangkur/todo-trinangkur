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
}

module.exports = SessionManager;
