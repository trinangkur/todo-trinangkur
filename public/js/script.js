const highlight = function(item) {
  document.querySelector('.highlight') &&
    document.querySelector('.highlight').classList.remove('highlight');
  item.classList.add('highlight');
};

const showTitleItems = function() {
  const title = event.target;
  highlight(title);
  const allItems = document.getElementsByClassName('item');
  Array.from(allItems).forEach(item => {
    item.classList.add('hide');
  });
  const titleItems = document.getElementsByClassName(title.innerText);
  Array.from(titleItems).forEach(item => {
    item.classList.remove('hide');
  });
};

const elementValue = selector => {
  const title = document.querySelector(selector);
  const name = title.value;
  title.value = '';
  return name;
};

const updateHtml = (selector, html) => {
  const element = document.querySelector(selector);
  // const temp = document.createElement('div');
  // temp.innerHTML = html;
  // element.innerHTML = temp.firstChild;
  element.innerHTML = html;
};

const addTodoTitle = () => {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = function() {
    console.log(this.responseText);
    const response = this.responseText;
    updateHtml('#titleContainer', response);
  };
  httpRequest.open('POST', 'addTodoTitle');
  httpRequest.send(`title=${elementValue('#titleBox')}`);
  // const h2HTML = `<h2 class="todoHeading" onclick="showTitleItems()">${elementValue(
  //   '#titleBox'
  // )}</h2>`;
};

const mark = function() {
  const item = event.target;
  item.classList.value.includes('mark')
    ? item.classList.remove('mark')
    : item.classList.add('mark');
};

const addTodoItem = function() {
  const todoItemDiv = document.querySelector('#todoItems');
  const itemText = document.createElement('p');
  const itemHolder = document.querySelector('#addItem');
  itemText.onclick = mark;
  itemText.innerText = itemHolder.value;
  itemText.classList.add('item');
  itemText.classList.add(document.querySelector('.highlight').innerText);
  itemHolder.value = '';
  todoItemDiv.appendChild(itemText);
};

const main = function() {
  console.log('body loaded');
};
