let TODO;

const highlight = function(item) {
  document.querySelector('.highlight') &&
    document.querySelector('.highlight').classList.remove('highlight');
  item.classList.add('highlight');
};

const deleteTitle = function(target) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = function() {
    TODO = JSON.parse(this.responseText);
    updateHtml('#titleContainer', formatTitleHtml);
    const firstHeading = document.querySelector('#titleContainer')
      .firstElementChild;
    if (!firstHeading) {
      updateHtml('#rightBar', clearItems);
      return;
    }
    highlight(firstHeading.firstElementChild);
    updateHtml('#todoItems', formatItems);
  };
  httpRequest.open('POST', 'deleteTodoTitle');
  httpRequest.send(`titleId=${target.id}`);
};

const showItemAdder = () =>
  document.querySelector('#itemAdder').classList.remove('hide');

const resetValue = selector => (document.querySelector(selector).value = '');

const elementValue = selector => document.querySelector(selector).value;

const formatTitleHtml = json =>
  Object.keys(json)
    .slice()
    .reverse()
    .map(
      key =>
        `<div class="heading" onclick="showTitleItems(this)" id="${json[key].id}">
          <h2 class="todoHeading" id="${json[key].id}">${json[key].name}</h2>
          <img src="resource/cross.png" class="img" id="${json[key].id}" onclick="deleteTitle(this)">
        </div>`
    )
    .join('');

const getClassIfMarked = status => {
  return status ? ' mark' : '';
};

const formatItems = json => {
  const title = json[document.querySelector('.highlight').id];
  const tasks = title.tasks;
  return Object.keys(tasks)
    .map(
      key =>
        `<p class="item ${title.id}${getClassIfMarked(
          tasks[key].status
        )}" id="${tasks[key].id}" onclick=mark()>${tasks[key].text}<p/>`
    )
    .join('');
};

const clearItems = () => `<div id="todoItems"></div>
<div id="itemAdder" class="hide">
  <input type="text" id="addItem" placeholder="Add Todo Items" />
  <input type="submit" value="Add Item" onclick="addTodoItem()" />
</div>`;

const updateHtml = (selector, formatter) => {
  const element = document.querySelector(selector);
  element.innerHTML = formatter(TODO);
};

const addTodoTitle = () => {
  if (!elementValue('#titleBox')) return;
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = function() {
    TODO = JSON.parse(this.responseText);
    updateHtml('#titleContainer', formatTitleHtml);
    const firstHeading = document.querySelector('#titleContainer')
      .firstElementChild;
    if (!firstHeading) {
      updateHtml('#rightBar', clearItems);
      return;
    }
    highlight(firstHeading.firstElementChild);
    updateHtml('#todoItems', formatItems);
  };
  httpRequest.open('POST', 'addTodoTitle');
  httpRequest.send(`title=${elementValue('#titleBox')}`);
  resetValue('#titleBox');
  showItemAdder();
};

const mark = function() {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = function() {
    TODO = JSON.parse(this.responseText);
    updateHtml('#todoItems', formatItems);
  };
  httpRequest.open('POST', 'markItem');
  httpRequest.send(
    `titleId=${elementId('.highlight')}&itemId=${event.target.id}`
  );
};

const showTitleItems = function(target) {
  highlight(target.firstElementChild);
  updateHtml('#todoItems', formatItems);
};

const elementId = selector => document.querySelector(selector).id;

const addTodoItem = function() {
  if (!elementValue('#addItem')) return;
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = function() {
    TODO = JSON.parse(this.responseText);
    updateHtml('#todoItems', formatItems);
  };
  httpRequest.open('POST', 'addItemToTitle');
  httpRequest.send(
    `titleId=${elementId('.highlight')}&itemText=${elementValue('#addItem')}`
  );
  resetValue('#addItem');
};

const main = function() {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = function() {
    TODO = JSON.parse(this.responseText);
    updateHtml('#titleContainer', formatTitleHtml);
    const firstHeading = document.querySelector('#titleContainer')
      .firstElementChild;
    if (!firstHeading) {
      updateHtml('#rightBar', clearItems);
      return;
    }
    highlight(firstHeading.firstElementChild);
    updateHtml('#todoItems', formatItems);
  };
  httpRequest.open('GET', 'getTodoList');
  httpRequest.send();
};
