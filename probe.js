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
Facet.ORDER.MARK  = 'mark'; // for non-stateful events
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

  assert(order);
  assert.equal(typeof order, 'string')

  // stop early when disabled
  if (!probe.tracer.enabled) return;

  var trap;

  if (typeof value === 'function') trap = value;
  else trap = function () { return value };

  _trap(probe, rank, event, order, trap);
};

function _mutate(probe, rank, arguments) {
  assert(arguments.length > 0, 'too few arguments');

  var event, order, value;

  event = arguments[0];

  if (arguments.length === 3) {
    order = arguments[1];
    value = arguments[2];
  } else if (arguments.length === 2) {
    order = Facet.ORDER.MARK;
    value = arguments[1];
  } else {
    // value not provided
    order = Facet.ORDER.MARK;
    value = null;
  }

  _trace(probe, rank, event, order, value);
}

Probe.prototype.dir = function dirTrace() {
  _mutate(this, Facet.RANK.DIR, arguments);
};

Probe.prototype.log = function logTrace() {
  _mutate(this, Facet.RANK.LOG, arguments);
};

Probe.prototype.info = function infoTrace() {
  _mutate(this, Facet.RANK.INFO, arguments);
};

Probe.prototype.warn = function warnTrace() {
  _mutate(this, Facet.RANK.WARN, arguments);
};

Probe.prototype.error = function errorTrace() {
  _mutate(this, Facet.RANK.ERROR, arguments);
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
