var a = require('a');
var foo = a.foo;

mytest.assert(a.foo() == a, 'calling a module member');
mytest.assert(foo() == (function (){return this})(), 'members not implicitly bound');
a.set(10);
mytest.assert(a.get() == 10, 'get and set')
mytest.print('DONE', 'info');
