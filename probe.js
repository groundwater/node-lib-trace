var assert = require('assert');

// brand  (probe)   these are all probes
// module (http)    the module the probe fires from
// event  (request) the event and object of interest
// order  (begin)   related to the lifecycle of the event
// rank   (0xFF)    the granularity of the event

var PROBE = 'probe';

function Facet() {
  this.brand  = PROBE;
  this.module = null;
  this.event  = null;
  this.order  = null;
  this.rank   = 0x00;
}

Facet.RANK        = {};
Facet.RANK.DIR    = 001;
Facet.RANK.LOG    = 002;
Facet.RANK.INFO   = 004;
Facet.RANK.WARN   = 010;
Facet.RANK.ERROR  = 020;
Facet.RANK.NONE   = 000;
Facet.RANK.ALL    = 777;

Facet.ORDER       = {};
Facet.ORDER.BEGIN = 'begin';
Facet.ORDER.ERROR = 'error';
Facet.ORDER.CLOSE = 'close';
Facet.ORDER.DATA  = 'data';
Facet.ORDER.END   = 'end';

function Probe() {
  this.tracer = null;
  this.module = null;
  this.parent = null;
}

function _trap(probe, rank, event, order, trap) {
  var facet = new Facet();

  facet.module = probe.module;
  facet.event  = event;
  facet.order  = order;
  facet.rank   = rank;

  probe.tracer.emit(facet, trap);
};

function _trace(probe, rank, event, order, value) {
  assert(event);
  assert.equal(typeof event, 'string');

  // stop early when disabled
  if (!probe.tracer.enabled) return;

  var trap;

  if (typeof value === 'function') trap = value;
  else trap = function () { return value };

  _trap(probe, rank, event, order, trap);
};

Probe.prototype.dir = function dirTrace(event, order, value) {
  _trace(this, Facet.RANK.DIR, event, order, value);
};

Probe.prototype.log = function logTrace(event, order, value) {
  _trace(this, Facet.RANK.LOG, event, order, value);
};

Probe.prototype.info = function infoTrace(event, order, value) {
  _trace(this, Facet.RANK.INFO, event, order, value);
};

Probe.prototype.warn = function warnTrace(event, order, value) {
  _trace(this, Facet.RANK.WARN, event, order, value);
};

Probe.prototype.error = function errorTrace(event, order, value) {
  _trace(this, Facet.RANK.ERROR, event, order, value);
};

Probe.prototype.make = function make(name) {
  assert(name, 'new probes need a name');

  var probe = Probe.New();

  probe.module = name;
  probe.tracer = this.tracer;

  return probe;
};

Probe.New = function New() {
  return new Probe();
};

Probe.NewWithTracer = function NewWithTracer(tracer) {
  var probe = Probe.New();

  probe.tracer = tracer;
  probe.module = 'ROOT';

  return probe;
};

module.exports = Probe;
