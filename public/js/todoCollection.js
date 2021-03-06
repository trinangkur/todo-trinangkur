const getClassIfMarked = status => {
  return status ? ' mark' : '';
};

const getImageSrc = status => {
  return status ? 'resource/checked.png' : 'resource/unchecked.png';
};

const isSearchedTitle = (name, searchText) =>
  name.toLowerCase().includes(searchText.toLowerCase());

const isSearchedItemInTitle = function(tasks, searchText) {
  return Object.keys(tasks).some(key =>
    isSearchedTitle(tasks[key].text, searchText)
  );
};

const getItemHtml = function(tasks, key) {
  return `<div class="itemClass" >
  <div class="paragraph">
  <img src="${getImageSrc(tasks[key].status)}" 
  class="marker${getClassIfMarked(tasks[key].status)}" 
  id="${key}" onclick="mark()"/>
  <p class="item${getClassIfMarked(tasks[key].status)}" 
  id="${key}" contentEditable="true"
  onkeydown = "sendRequestIfEnter(this)" onblur = "changeItemText(this)">
  ${tasks[key].text}</p></div>
  <img src="resource/bin.png" class="img" id="${key}"
  onclick="deleteItem()"/></div>`;
};

const getTitleHtml = function(todo, key) {
  return `<div class="heading" onclick="showTitleItems(this)" 
  id="${key}">
  <h2 class="todoHeading" id="${key}" 
  contentEditable="true"
  onkeydown = "sendRequestIfEnter(this)"
  onblur = "changeTitleName(this)">${todo[key].name}</h2>
  <img src="resource/bin.png" class="img" 
  id="${key}" onclick="deleteTitle(this)"/>
  </div>`;
};

const getSearchedTitleHtml = function(todo, searchText, html, key) {
  if (isSearchedTitle(todo[key].name, searchText)) {
    return html + getTitleHtml(todo, key);
  }
  return html;
};

const getTitleHtmlOn = function(todo, searchedItem, html, key) {
  if (isSearchedItemInTitle(todo[key].tasks, searchedItem)) {
    return html + getTitleHtml(todo, key);
  }
  return html;
};

const getSearchedItemsHtml = function(tasks, searchedItem, html, key) {
  if (tasks[key].text.includes(searchedItem)) {
    return html + getItemHtml(tasks, key);
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
      .map(getItemHtml.bind(null, tasks))
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

  formatTitleOn(searchedItem) {
    const keys = Object.keys(this.todo)
      .slice()
      .reverse();
    return keys.reduce(getTitleHtmlOn.bind(null, this.todo, searchedItem), '');
  }

  formatSearchedItem(titleId, searchedItem) {
    const title = this.todo[titleId];
    const tasks = title.tasks;
    return Object.keys(tasks).reduce(
      getSearchedItemsHtml.bind(null, tasks, searchedItem),
      ''
    );
  }
}
