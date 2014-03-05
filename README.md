AceJS is a module loader for web browser.
It's tightly along with CMD specification and implements module1.0 interface.
The most convenient point, you can write your code in NodeJS style.


Usage:

html:
<script type="text/javascript" src="ace.src.js" data-main="app"></script>

app.js:
var inc = require('./increment').increment;
var a = 1;
alert(inc(a)); // 2

increment.js:
var add = require('./math').add;
exports.increment = function(val) {
  return add(val, 1);
};

math.js:
exports.add = function() {
  var sum = 0, i = 0, args = arguments, l = args.length;
  while (i < l) {
    sum += args[i++];
  }
  return sum;
};


If you like the way you write code in this style, and you need not
to worry about polluting global variables.


For building such code into one js file and acejs would not interfere
your code in production environment. You can use Browserify (http://browserify.org/)
to do the server side building and compress it with any tools you like.

AceJS is seamlessly contact with Browserify.

Available in:
IE5.5+
Chrome 1.0+
FireFox (to be tested)
Safari (to be tested)