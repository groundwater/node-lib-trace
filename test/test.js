var test = require('tap').test;
var jtrace = require('../index.js');

var Tracer = jtrace.Tracer;
var Probe  = jtrace.Probe;

function yes() { return true; }

test('happy path', function (t) {
  t.plan(4);

  var jtrace = new Tracer();
  var trace = Probe.NewWithTracer(jtrace);
  var item = {a: 1};

  jtrace.on(yes, function (facets, values) {
    t.equals(facets.target, 'test');
    t.equals(facets.level, 001);
    t.deepEquals(facets.module, ['/']);
    t.deepEquals(item, values);
  });

  trace.dir('test', item);
  t.end();
});

test('child path', function (t) {
  t.plan(4);

  var jtrace = new Tracer();
  var trace = Probe.NewWithTracer(jtrace).segment('my_module');
  var item = {a: 1};

  jtrace.on(yes, function (facets, values) {
    t.equals(facets.target, 'test');
    t.equals(facets.level, 001);
    t.deepEquals(facets.module, ['/', 'my_module']);
    t.deepEquals(item, values);
  });

  trace.dir('test', item);
  t.end();
});
