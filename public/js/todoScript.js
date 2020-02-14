const todoCollection = new TodoCollection();

const stopPropagation = () => {
  event.stopPropagation();
};

const showItemAdder = () =>
  document.querySelector('#itemAdder').classList.remove('hide');

const resetValue = selector => {
  document.querySelector(selector).value = '';
};

const makeUnchecked = selector => {
  document.querySelector(selector).checked = false;
};

const elementId = selector => document.querySelector(selector).id;

const elementValue = selector => document.querySelector(selector).value;

const highlight = function(item) {
  document.querySelector('.highlight') &&
    document.querySelector('.highlight').classList.remove('highlight');
  item.classList.add('highlight');
};

const updateHtml = (selector, html) => {
  const element = document.querySelector(selector);
  element.innerHTML = html;
};

const clearItems = () => `<div id="itemAdder" class="hide">
  <input type="text" id="addItem" placeholder="Add Todo Items" />
  <input type="submit" id="addItemButton" value="Add Item" 
  onclick="addTodoItem()" />
</div>
<div id="todoItems"></div>`;

const getItemsHtml = () =>
  todoCollection.formatSearchedItem(
    elementId('.highlight'),
    elementValue('#taskSearchBar')
  );

const updatePageHtml = function() {
  const firstHeading = document.querySelector('#titleContainer')
    .firstElementChild;
  if (!firstHeading) {
    updateHtml('#rightBar', clearItems());
    return;
  }
  highlight(firstHeading.firstElementChild);
  updateHtml('#todoItems', getItemsHtml());
  showItemAdder();
};

const isBadResponse = function(res) {
  const contentType = res.getResponseHeader('Content-Type');
  return (
    res.status !== 200 || contentType !== 'application/json; charset=utf-8'
  );
};

const loadItems = function() {
  if (isBadResponse(this)) {
    const errorMessage = JSON.parse(this.responseText).errorMessage;
    return updateHtml('body', `<h1>${res.status} ${errorMessage}</h1>`);
  }
  todoCollection.update(JSON.parse(this.responseText));
  updateHtml('#todoItems', todoCollection.formatItems(elementId('.highlight')));
  resetValue('#taskSearchBar');
};

const loadTitlesAndItem = function() {
  if (isBadResponse(this)) {
    const {errMessage} = JSON.parse(this.responseText);
    return updateHtml('body', `<h1>${this.status} ${errMessage}</h1>`);
  }
  todoCollection.update(JSON.parse(this.responseText));
  updateHtml('#titleContainer', todoCollection.formatTitleHtml());
  updatePageHtml();
  resetValue('#titleSearchBox');
  resetValue('#taskSearchBar');
};

const searchTitle = function(searchText) {
  updateHtml(
    '#titleContainer',
    todoCollection.formatSearchedTitle(searchText.value)
  );
  updatePageHtml();
};

const searchTasks = function(searchedItem) {
  updateHtml(
    '#titleContainer',
    todoCollection.formatTitleOn(searchedItem.value)
  );
  updatePageHtml();
};

const clearValue = function(element, searchBox, selector) {
  element.value = '';
  searchTitle(element);
  resetValue(searchBox);
  makeUnchecked(selector);
};

const sendPostXHR = function(url, callback, data) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = callback;
  httpRequest.open('POST', url);
  const contentType = 'application/x-www-form-urlencoded';
  httpRequest.setRequestHeader('Content-Type', contentType);
  httpRequest.send(data);
};

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

const showTitleItems = function(target) {
  highlight(target.firstElementChild);
  updateHtml('#todoItems', getItemsHtml());
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

const loadTodoCollection = function() {
  todoCollection.update(JSON.parse(this.responseText));
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

const sendRequestIfEnter = function(target) {
  if (event.key === 'Enter') {
    target.blur();
  }
};

const main = function() {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = loadTitlesAndItem;
  httpRequest.open('GET', 'getTodoList');
  httpRequest.send();
};
