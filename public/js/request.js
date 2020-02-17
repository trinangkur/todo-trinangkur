const sendPostXHR = function(url, callback, data) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = callback;
  httpRequest.open('POST', url);
  const contentType = 'application/x-www-form-urlencoded';
  httpRequest.setRequestHeader('Content-Type', contentType);
  httpRequest.send(data);
};
