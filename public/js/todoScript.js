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
  <input type="text" id="addItem" placeholder="Add Todo Task" />
  <input type="submit" id="addItemButton" value="Add Task" 
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
  resetValue(searchBox);
  element.value = '';
  searchTasks(element);
  searchTitle(element);
  makeUnchecked(selector);
};

const showTitleItems = function(target) {
  highlight(target.firstElementChild);
  updateHtml('#todoItems', getItemsHtml());
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
