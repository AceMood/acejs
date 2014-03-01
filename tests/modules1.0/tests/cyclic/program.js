// require a module
var a = require('a');
// require b module
var b = require('b');

mytest.assert(a.a, 'a exists');
mytest.assert(b.b, 'b exists');
mytest.assert(a.a()/* return b */.b === b.b, 'a gets b');
mytest.assert(b.b()/* return a */.a === a.a, 'b gets a');

mytest.print('DONE', 'info');
