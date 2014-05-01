function Tracer() {
  this.enabled  = false;
  this.handlers = [];
}

/*

  facets   an object of strings

    trap   a function that, when called returns
           an object of interest

*/
Tracer.prototype.emit = function emitTrace(facets, trap) {
  if (!this.enabled) return;

  this.handlers.forEach(function (item) {
    var filter  = item.filter;
    var handler = item.handler;

    // filter function determines if we invoke the trap
    var isMatch = filter(facets);

    if (isMatch) handler(facets, trap());
  });
};

/*

   filter   a function that returns true or false
            signature `filter(facets)`

  handler   a handler function
            signature `handler(facets, item)`

*/
Tracer.prototype.onEvent = function onTrace(filter, handler) {
  this.enabled = true;
  this.handlers.push({
    filter  : filter,
    handler : handler,
  });
};

Tracer.prototype.clear = function clear() {
  this.enabled  = false;
  this.handlers = [];
};

module.exports = Tracer;
