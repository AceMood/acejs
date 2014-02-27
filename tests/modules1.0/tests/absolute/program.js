// get a module first
var a = require('submodule/a');
// get b module
var b = require('b');

mytest.assert(a.foo().foo === b.foo, 'require works with absolute identifiers');
mytest.print('DONE', 'info');
