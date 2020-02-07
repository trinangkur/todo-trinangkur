const getClassIfMarked = status => {
  return status ? ' mark' : '';
};

const getImageSrc = status => {
  return status ? 'resource/checked.png' : 'resource/unchecked.png';
};

const isSearchedTitle = (name, searchText) =>
  name.toLowerCase().includes(searchText.toLowerCase());

const getItemsHtml = function(tasks, key) {
  return `<div class="itemClass" >
  <p class="item${getClassIfMarked(tasks[key].status)}" 
  id="${tasks[key].id}" onclick="mark()">
  <img src="${getImageSrc(tasks[key].status)}" class="marker" 
  id="${tasks[key].id}"/>${tasks[key].text}</p>
  <img src="resource/cross.png" class="img" id="${tasks[key].id}"
  onclick="deleteItem()"/></div>`;
};

const getTitleHtml = function(todo, key) {
  return `<div class="heading" onclick="showTitleItems(this)" 
  id="${todo[key].id}">
  <h2 class="todoHeading" id="${todo[key].id}">${todo[key].name}</h2>
  <img src="resource/cross.png" class="img" 
  id="${todo[key].id}" onclick="deleteTitle(this)"/>
  </div>`;
};

const getSearchedTitleHtml = function(todo, searchText, html, key) {
  if (isSearchedTitle(todo[key].name, searchText)) {
    return html + getTitleHtml(todo, key);
  }
  return html;
};

class TodoCollection {
  constructor() {
    this.todo = {};
  }

  update(newTodo) {
    this.todo = newTodo;
  }

  formatItems(titleId) {
    const title = this.todo[titleId];
    const tasks = title.tasks;
    return Object.keys(tasks)
      .map(getItemsHtml.bind(null, tasks))
      .join('');
  }

  formatTitleHtml() {
    const keys = Object.keys(this.todo)
      .slice()
      .reverse();
    return keys.map(getTitleHtml.bind(null, this.todo)).join('');
  }

  formatSearchedTitle(searchText) {
    const keys = Object.keys(this.todo)
      .slice()
      .reverse();
    return keys.reduce(
      getSearchedTitleHtml.bind(null, this.todo, searchText),
      ''
    );
  }
}
