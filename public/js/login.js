const showLogin = function() {
  document.querySelector('#signUpForm').classList.add('hide');
  document.querySelector('#loginForm').classList.remove('hide');
};

const showSignUp = function() {
  document.querySelector('#loginForm').classList.add('hide');
  document.querySelector('#signUpForm').classList.remove('hide');
};
