const highlight = function(item) {
  document.querySelector('.highlight').classList.remove('highlight');
  item.classList.add('highlight');
};

const showTitleItems = function() {
  const title = event.target;
  console.log(title);
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

const main = function() {
  console.log('body loaded');
};
