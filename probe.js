var assert = require('assert');

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

function Probe() {
  this.tracer = null;
  this.module = null;
  this.parent = null;
}

function _facets(tracer, array) {
  array.unshift(tracer.module);
  if (tracer.parent) return _facets(tracer.parent, array);
  else return array;
}

Probe.prototype.trap = function (level, target, trap) {
  var facets = {
    module : _facets(this, []),
    target : target,
    level  : level
  };

  this.tracer.emit(facets, trap);
};

Probe.prototype.trace = function (level, target, value) {
  // stop early when disabled
  if (!this.tracer.enabled) return;

  var out;

  if (typeof value === 'function') out = value;
  else out = function () { return value };

  this.trap(level, target, out);
};

Probe.prototype.dir = function dirTrace(target, value) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Trace.DIR, target, value);
};

Probe.prototype.log = function logTrace(target, value) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Trace.LOG, target, value);
};

Probe.prototype.info = function infoTrace(target, value) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Trace.INFO, target, value);
};

Probe.prototype.warn = function warnTrace(target, value) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Trace.WARN, target, value);
};

Probe.prototype.error = function errorTrace(target, value) {
  assert(target);
  assert.equal(typeof target, 'string');

  this.trace(Trace.ERROR, target, value);
};

Probe.prototype.segment = function segment(name) {
  var probe = Probe.New();

  probe.module = name;
  probe.parent = this;
  probe.tracer = this.tracer;

  return probe;
};

Probe.New = function New() {
  return new Probe();
};

Probe.NewWithTracer = function NewWithTracer(tracer) {
  var probe = Probe.New();

  probe.tracer = tracer;
  probe.module = '/';

  return probe;
};

module.exports = Probe;
