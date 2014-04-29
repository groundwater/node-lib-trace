var test = require('tap').test;
var jtrace = require('../index.js');

var JTrace = jtrace.JTrace;
var Tracer = jtrace.Tracer;

function yes() { return true; }

test('happy path', function (t) {
  t.plan(4);

  var jtrace = new JTrace();
  var trace = Tracer.NewJTracer(jtrace);
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

  var jtrace = new JTrace();
  var trace = Tracer.NewJTracer(jtrace).segment('my_module');
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
