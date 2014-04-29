var assert = require('assert');

function JTrace() {
  this.enabled  = false;
  this.handlers = [];
}

/*

  facets   an array of strings
           the facets of a probe should be fixed,
           and order from general to specific

  values   an array of objects
           the values are opaque to the tracer,
           they are meant to be interpreted and consumed
           by the tracer requesting them

*/
JTrace.prototype.emit = function emitTrace(facets, trap) {
  this.handlers.forEach(function (item) {
    var filter  = item.filter;
    var handler = item.handler;

    // filter function determines if we invoke the trap
    var isMatch = filter(facets);

    if (isMatch) handler(facets, trap());
  });
};

JTrace.prototype.on = function onTrace(filter, handler) {
  this.enabled = true;
  this.handlers.push({
    filter  : filter,
    handler : handler,
  });
};

function Trace() {
  this.module = null;
  this.target = null;

  this.level  = 0;
}

Trace.DIR   = 001;
Trace.LOG   = 002;
Trace.INFO  = 004;
Trace.WARN  = 010;
Trace.ERROR = 020;

Trace.NONE  = 000;
Trace.ALL   = 777;

function Tracer() {
  this.jtrace = null;
  this.module = null;
  this.parent = null;
}

function _facets(tracer, array) {
  array.unshift(tracer.module);
  if (tracer.parent) return _facets(tracer.parent, array);
  else return array;
}

Tracer.prototype.trap = function (level, target, trap) {
  var facets = {
    module : _facets(this, []),
    target : target,
    level  : level
  };

  this.jtrace.emit(facets, trap);
};

Tracer.prototype.trace = function (level, target, value) {
  // stop early when disabled
  if (!this.jtrace.enabled) return;

  var out;

  if (typeof value === 'function') out = value;
  else out = function () { return value };

  this.trap(level, target, out);
};

Tracer.prototype.dir = function dirTrace(target, value) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Trace.DIR, target, value);
};

Tracer.prototype.log = function logTrace(target, value) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Trace.LOG, target, value);
};

Tracer.prototype.info = function infoTrace(target, value) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Trace.INFO, target, value);
};

Tracer.prototype.warn = function warnTrace(target, value) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Trace.WARN, target, value);
};

Tracer.prototype.error = function errorTrace(target, value) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Trace.ERROR, target, value);
};

Tracer.prototype.segment = function segment(name) {
  var tracer = Tracer.New();

  tracer.module = name;
  tracer.parent = this;
  tracer.jtrace = this.jtrace;

  return tracer;
};

Tracer.New = function New() {
  return new Tracer();
};

Tracer.NewJTracer = function NewJTracer(jtrace) {
  var tracer = Tracer.New();

  tracer.jtrace = jtrace;
  tracer.module = '/';

  return tracer;
};

module.exports.JTrace = JTrace;
module.exports.Tracer = Tracer;
