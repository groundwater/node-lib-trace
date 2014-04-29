var test = require('tap').test;
var jtrace = require('../index.js');

var JTrace = jtrace.JTrace;
var Tracer = jtrace.Tracer;

test(function (t) {
  var jtrace = new JTrace();

  var trace = Tracer.NewJTracer(jtrace);

  t.equals(trace.module, '/');
  t.end();
});

test(function (t) {
  t.plan(1);
  var jtrace = new JTrace();

  jtrace.on([],[],function(a,b,c){
    t.equals(c, 'hello world');
  });

  jtrace.emit([], [], 'hello world')
  t.end();
});

test(function (t) {
  t.plan(1);
  var jtrace = new JTrace();

  jtrace.on(['a','d'],[],function(a,b,c){
    t.equals(c, 'hello world');
  });

  jtrace.emit(['abc','def'], [], 'hello world')
  t.end();
});

test('first arg as facet', function (t) {
  t.plan(1);
  var jtrace = new JTrace();

  jtrace.on(['/'],[],function(a,b,c){
    t.equals(a[1], 'hello world');
  });

  var trace = Tracer.NewJTracer(jtrace);

  trace.dir('hello world');
  t.end();
});

test('dir level', function (t) {
  t.plan(2);
  var jtrace = new JTrace();

  jtrace.on(['/'],[],function(a,b,c){
    t.equals(a[1], 'hello world');
    t.equals(b[0], 0x10);
  });

  var trace = Tracer.NewJTracer(jtrace);

  trace.dir('hello world');
  t.end();
});

test('log level', function (t) {
  t.plan(2);
  var jtrace = new JTrace();

  jtrace.on(['/'],[],function(a,b,c){
    t.equals(a[1], 'hello world');
    t.equals(b[0], 0x20);
  });

  var trace = Tracer.NewJTracer(jtrace);

  trace.log('hello world');
  t.end();
});

test('info level', function (t) {
  t.plan(2);
  var jtrace = new JTrace();

  jtrace.on(['/'],[],function(a,b,c){
    t.equals(a[1], 'hello world');
    t.equals(b[0], 0x30);
  });

  var trace = Tracer.NewJTracer(jtrace);

  trace.info('hello world');
  t.end();
});

test('warn level', function (t) {
  t.plan(2);
  var jtrace = new JTrace();

  jtrace.on(['/'],[],function(a,b,c){
    t.equals(a[1], 'hello world');
    t.equals(b[0], 0x40);
  });

  var trace = Tracer.NewJTracer(jtrace);

  trace.warn('hello world');
  t.end();
});

test('error level', function (t) {
  t.plan(2);
  var jtrace = new JTrace();

  jtrace.on(['/'],[],function(a,b,c){
    t.equals(a[1], 'hello world');
    t.equals(b[0], 0x50);
  });

  var trace = Tracer.NewJTracer(jtrace);

  trace.error('hello world');
  t.end();
});
