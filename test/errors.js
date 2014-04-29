var test = require('tap').test;
var jtrace = require('../index.js');

var JTrace = jtrace.JTrace;
var Tracer = jtrace.Tracer;

test('dir errors', function (t) {
  t.plan(2);
  var jtrace = new JTrace();

  var trace = Tracer.NewJTracer(jtrace);

  t.throws(function(){
    trace.dir()
  });

  t.throws(function(){
    trace.dir({})
  });

  t.end();
});

test('log errors', function (t) {
  t.plan(2);
  var jtrace = new JTrace();

  var trace = Tracer.NewJTracer(jtrace);

  t.throws(function(){
    trace.log()
  });

  t.throws(function(){
    trace.log({})
  });

  t.end();
});

test('info errors', function (t) {
  t.plan(2);
  var jtrace = new JTrace();

  var trace = Tracer.NewJTracer(jtrace);

  t.throws(function(){
    trace.info()
  });

  t.throws(function(){
    trace.info({})
  });

  t.end();
});

test('warn errors', function (t) {
  t.plan(2);
  var jtrace = new JTrace();

  var trace = Tracer.NewJTracer(jtrace);

  t.throws(function(){
    trace.warn()
  });

  t.throws(function(){
    trace.warn({})
  });

  t.end();
});

test('error errors', function (t) {
  t.plan(2);
  var jtrace = new JTrace();

  var trace = Tracer.NewJTracer(jtrace);

  t.throws(function(){
    trace.error()
  });

  t.throws(function(){
    trace.error({})
  });

  t.end();
});
