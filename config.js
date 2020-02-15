module.exports = {
  DATA_STORE: process.env['DATA_STORE'] || `${__dirname}/data/todoList.json`,
  USER_STORE: process.env['USER_STORE'] || `${__dirname}/data/user.json`
};
