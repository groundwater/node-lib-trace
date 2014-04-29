'use strict';

var assert = require('assert');

function JTrace() {
  this.handlers = [];
}

/*

  facets   an array of strings
           the facets of a probe should be fixed,
           and order from general to specific

  vector   an array of numbers
           the vector provides a partial ordering over the
           values of a particular probe

  values   an array of objects
           the values are opaque to the tracer,
           they are meant to be interpreted and consumed
           by the tracer requesting them

*/
JTrace.prototype.emit = function emitTrace(facets, vector, values) {
  this.handlers.forEach(function (item) {
    var facetMask  = item.facetMask;
    var vectorMask = item.vectorMask; // unused
    var handler    = item.handler;

    var isMatch = true;

    // can filter against facets only
    if (facetMask) isMatch = match(facetMask, facets);

    if (isMatch) handler(facets, vector, values);
  });
};

JTrace.prototype.on = function onTrace(facetMask, vectorMask, handler) {
  this.handlers.push({
    facetMask  : facetMask,
    vectorMask : vectorMask,
    handler    : handler,
  });
};

function match(pattern, value) {
  var i, val, item;

  for (i in pattern) {
    item = pattern[i];
    val  = value[i];

    // under-specified patterns match automatically
    if (item === undefined)    return true;

    // under-specified values don't match
    if (val  === undefined)    return false;

    // empty strings are like wild cards
    if (item === '')           continue;

    // the pattern must partially match
    if (val.indexOf(item) < 0) return false;

    i++;
  };
  return true;
}

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

Tracer.DIR   = 0x10;
Tracer.LOG   = 0x20;
Tracer.INFO  = 0x30;
Tracer.WARN  = 0x40;
Tracer.ERROR = 0x50;

Tracer.prototype.trace = function (level, args) {
  // from http://goo.gl/WaH2L
  var values = Array.prototype.slice.call(args);
  var facets = _facets(this, []);

  // the first argument is a facet
  var target = values.shift()

  facets.push(target);

  this.jtrace.emit(facets, [level], values);
};

Tracer.prototype.dir = function dirTrace(target) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Tracer.DIR, arguments);
};

Tracer.prototype.log = function logTrace(target) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Tracer.LOG, arguments);
};

Tracer.prototype.info = function infoTrace(target) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Tracer.INFO, arguments);
};

Tracer.prototype.warn = function warnTrace(target) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Tracer.WARN, arguments);
};

Tracer.prototype.error = function errorTrace(target) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Tracer.ERROR, arguments);
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
