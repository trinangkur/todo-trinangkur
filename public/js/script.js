let TODO;

const highlight = function(item) {
  document.querySelector('.highlight') &&
    document.querySelector('.highlight').classList.remove('highlight');
  item.classList.add('highlight');
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
        `<h2 class="todoHeading" id="${json[key].id}" onclick="showTitleItems()">${json[key].name}</h2>`
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
    highlight(document.querySelector('#titleContainer').firstChild);
    updateHtml('#todoItems', formatItems);
  };
  httpRequest.open('POST', 'addTodoTitle');
  httpRequest.send(`title=${elementValue('#titleBox')}`);
  resetValue('#titleBox');
  showItemAdder();
};

const mark = function() {
  // const item = event.target;
  // item.classList.value.includes('mark')
  //   ? item.classList.remove('mark')
  //   : item.classList.add('mark');
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

const showTitleItems = function() {
  const title = event.target;
  highlight(title);
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
  console.log('body loaded');
};
