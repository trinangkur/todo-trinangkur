const loadItems = function() {
  if (isBadResponse(this)) {
    const errorMessage = JSON.parse(this.responseText).errorMessage;
    return updateHtml('body', `<h1>${res.status} ${errorMessage}</h1>`);
  }
  todoCollection.update(JSON.parse(this.responseText));
  updateHtml('#todoItems', todoCollection.formatItems(elementId('.highlight')));
  resetValue('#taskSearchBar');
};

const loadTitlesAndItem = function() {
  if (isBadResponse(this)) {
    const {errMessage} = JSON.parse(this.responseText);
    return updateHtml('body', `<h1>${this.status} ${errMessage}</h1>`);
  }
  todoCollection.update(JSON.parse(this.responseText));
  updateHtml('#titleContainer', todoCollection.formatTitleHtml());
  updatePageHtml();
  resetValue('#titleSearchBox');
  resetValue('#taskSearchBar');
};

const loadTodoCollection = function() {
  todoCollection.update(JSON.parse(this.responseText));
};
