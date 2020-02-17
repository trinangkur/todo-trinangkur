const showLogin = function() {
  document.querySelector('#signUpForm').classList.add('hide');
  document.querySelector('#loginForm').classList.remove('hide');
};

const showSignUp = function() {
  document.querySelector('#loginForm').classList.add('hide');
  document.querySelector('#signUpForm').classList.remove('hide');
};

const elementValue = selector => document.querySelector(selector).value;
const sendPostXHR = function(url, callback, data) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = callback;
  httpRequest.open('POST', url);
  const contentType = 'application/x-www-form-urlencoded';
  httpRequest.setRequestHeader('Content-Type', contentType);
  httpRequest.send(data);
};

const showWarning = selector =>
  document.querySelector(selector).classList.remove('hide');

const removeWarning = selector =>
  document.querySelector(selector).classList.add('hide');

const isUserIdAvailable = function() {
  const response = JSON.parse(this.responseText);
  const signUpButton = document.querySelector('#signUp-button');
  if (!response.isSuccessful) {
    signUpButton.classList.add('un-clickable');
    return showWarning('#signUpWarning');
  }
  signUpButton.classList.remove('un-clickable');
  removeWarning('#signUpWarning');
};

const checkUserId = function(userId) {
  sendPostXHR('isUserIdAvailable', isUserIdAvailable, `userId=${userId}`);
};

const loginNewUser = function() {
  const response = JSON.parse(this.responseText);
  if (response.isSuccessful) {
    return location.assign('index.html');
  }
  showWarning('#loginWarning');
};

const login = function() {
  const userId = elementValue('#userId');
  const password = elementValue('#password');
  const requestText = `userId=${userId}&password=${password}`;
  sendPostXHR('login', loginNewUser, requestText);
};
