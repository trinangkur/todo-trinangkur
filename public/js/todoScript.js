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

const updatePageHtml = function() {
  const firstHeading = document.querySelector('#titleContainer')
    .firstElementChild;
  if (!firstHeading) {
    updateHtml('#rightBar', clearItems());
    return;
  }
  highlight(firstHeading.firstElementChild);
  updateHtml(
    '#todoItems',
    todoCollection.formatSearchedItem(
      elementId('.highlight'),
      elementValue('#taskSearchBar')
    )
  );
  showItemAdder();
};

const loadItems = function() {
  todoCollection.update(JSON.parse(this.responseText));
  updateHtml('#todoItems', todoCollection.formatItems(elementId('.highlight')));
  resetValue('#taskSearchBar');
};

const loadTitlesAndItem = function() {
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

const clearTitleValue = function(title) {
  title.value = '';
  searchTitle(title);
  resetValue('#titleSearchBox');
  makeUnchecked('#searchTaskPanel');
};

const clearItemValue = function(item) {
  item.value = '';
  searchTasks(item);
  resetValue('#taskSearchBar');
  makeUnchecked('#searchTodoPanel');
};

const deleteTitle = function(target) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = loadTitlesAndItem;
  httpRequest.open('POST', 'deleteTodoTitle');
  httpRequest.send(`titleId=${target.id}`);
};

const deleteItem = function() {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = loadItems;
  httpRequest.open('POST', 'deleteItem');
  httpRequest.send(
    `titleId=${elementId('.highlight')}&itemId=${event.target.id}`
  );
};

const addTodoTitle = () => {
  if (!elementValue('#titleBox')) {
    return;
  }
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = loadTitlesAndItem;
  httpRequest.open('POST', 'addTodoTitle');
  httpRequest.send(`title=${elementValue('#titleBox')}`);
  resetValue('#titleBox');
};

const mark = function() {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = loadItems;
  httpRequest.open('POST', 'markItem');
  httpRequest.send(
    `titleId=${elementId('.highlight')}&itemId=${event.target.id}`
  );
};

const showTitleItems = function(target) {
  highlight(target.firstElementChild);
  updateHtml(
    '#todoItems',
    todoCollection.formatSearchedItem(
      elementId('.highlight'),
      elementValue('#taskSearchBar')
    )
  );
};

const addTodoItem = function() {
  if (!elementValue('#addItem')) {
    return;
  }
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = loadItems;
  httpRequest.open('POST', 'addItemToTitle');
  httpRequest.send(
    `titleId=${elementId('.highlight')}&itemText=${elementValue('#addItem')}`
  );
  resetValue('#addItem');
};

const changeTitleName = function(target) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = function() {
    todoCollection.update(JSON.parse(this.responseText));
  };
  httpRequest.open('POST', 'editTitle');
  httpRequest.send(`titleId=${target.id}&title=${target.innerText}`);
};

const changeItemText = function(target) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = function() {
    todoCollection.update(JSON.parse(this.responseText));
  };
  httpRequest.open('POST', 'editItem');
  httpRequest.send(
    `titleId=${elementId('.highlight')}&itemId=${target.id}&itemText=${
      target.innerText
    }`
  );
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
