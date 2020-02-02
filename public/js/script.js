const addTodoTitle = () => {
  const navigationBar = document.querySelector('#navigationBar');
  const h2 = document.createElement('h2');
  const titleHolder = document.getElementById('titleBox');
  h2.innerText = titleHolder.value;
  titleHolder.value = '';
  h2.classList.add('todoHeading');
  navigationBar.appendChild(h2);
};

const main = function() {
  console.log('body loaded');
};
