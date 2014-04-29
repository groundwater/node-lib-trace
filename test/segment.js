var test = require('tap').test;
var jtrace = require('../index.js');

var JTrace = jtrace.JTrace;
var Tracer = jtrace.Tracer;

test('segment', function (t) {
  t.plan(2);
  var jtrace = new JTrace();

  var trace = Tracer.NewJTracer(jtrace);
  var seg = trace.segment('my_module');

  jtrace.on([],[],function(a,b,c){
    t.equals(a[0], '/');
    t.equals(a[1], 'my_module');
  })

  seg.log('hello');
  t.end();
});
