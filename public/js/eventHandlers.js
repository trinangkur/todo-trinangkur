const deleteTitle = function(target) {
  sendPostXHR('deleteTodoTitle', loadTitlesAndItem, `titleId=${target.id}`);
};

const deleteItem = function() {
  const requestText = `titleId=${elementId('.highlight')}&itemId=${
    event.target.id
  }`;
  sendPostXHR('deleteItem', loadItems, requestText);
};

const addTodoTitle = () => {
  if (!elementValue('#titleBox')) {
    return;
  }
  const requestText = `title=${elementValue('#titleBox')}`;
  sendPostXHR('addTodoTitle', loadTitlesAndItem, requestText);
  resetValue('#titleBox');
};

const mark = function() {
  const requestText = `titleId=${elementId('.highlight')}&itemId=${
    event.target.id
  }`;
  sendPostXHR('markItem', loadItems, requestText);
};

const addTodoItem = function() {
  if (!elementValue('#addItem')) {
    return;
  }
  const requestText = `titleId=${elementId('.highlight')}&text=${elementValue(
    '#addItem'
  )}`;

  sendPostXHR('addItemToTitle', loadItems, requestText);
  resetValue('#addItem');
};

const changeTitleName = function(target) {
  const requestText = `titleId=${target.id}&titleText=${target.innerText}`;
  sendPostXHR('editTitle', loadTodoCollection, requestText);
};

const changeItemText = function(target) {
  const {id, innerText} = target;
  const requestText = `titleId=${elementId(
    '.highlight'
  )}&itemId=${id}&itemText=${innerText}`;
  sendPostXHR('editItem', loadTodoCollection, requestText);
};

const logout = function() {
  sendPostXHR('logout', () => {
    document.cookie = '_sid=""; expires=Thu, 18 Dec 2013 12:00:00 UTC';
    location.assign('login.html');
  });
};
