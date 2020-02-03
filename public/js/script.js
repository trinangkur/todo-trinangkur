const highlight = function(item) {
  document.querySelector('.highlight').classList.remove('highlight');
  item.classList.add('highlight');
};

const showTitleItems = function() {
  const title = event.target;
  highlight(title);
};

const addTodoTitle = () => {
  const navigationBar = document.querySelector('#navigationBar');
  const h2 = document.createElement('h2');
  const titleHolder = document.getElementById('titleBox');
  h2.addEventListener('click', showTitleItems);
  h2.innerText = titleHolder.value;
  titleHolder.value = '';
  h2.classList.add('todoHeading');
  navigationBar.appendChild(h2);
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
  todoItemDiv.appendChild(document.createElement('hr'));
};

const main = function() {
  console.log('body loaded');
};
