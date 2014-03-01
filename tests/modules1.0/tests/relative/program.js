var a = require('submodule/a');
var b = require('submodule/b');

mytest.assert(a.foo == b.foo, 'a and b share foo through a relative require');
mytest.print('DONE', 'info');
