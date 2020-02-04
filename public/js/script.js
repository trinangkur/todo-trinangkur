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
  json
    .slice()
    .reverse()
    .map(
      title =>
        `<h2 class="todoHeading" id="${title.id}" onclick="showTitleItems()">${title.name}</h2>`
    )
    .join('');

const formatItems = json => {
  const currentTitle = document.querySelector('.highlight');
  const title = json.find(title => currentTitle.id === title.id);
  return title.tasks
    .map(
      task =>
        `<p class="item ${title.id}" id="${task.id}" onclick=mark()>${task.text}<p/>`
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
  const item = event.target;
  item.classList.value.includes('mark')
    ? item.classList.remove('mark')
    : item.classList.add('mark');
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
