# dynamic tracing library

## install

```bash
npm install --save lib-trace
```

## usage

```javascript
var trace  = require('lib-trace');
var JTrace = trace.JTrace;
var Tracer = trace.Tracer;
var jtrace = new JTrace();

// setup a top level handler
// a null value catches everything
jtrace.on(null, function (facets, values) {

  // log by module
  console.log(facets.module.join(':'), facets.target, values);
});

var root  = Tracer.NewJTracer(jtrace);
var child = root.segment('child1');

root.log('event1', 'hello world');
root.log('event2', 'goodbye');

child.log('event3', 'ahoy hoy');
child.log('event4', function () {
  // some expensive synchronous function
  return 'expensive value'
});
```

This will output

```text
/ event1 hello world
/ event2 goodbye
/:child1 event3 ahoy hoy
/:child1 event4 expensive value
```
