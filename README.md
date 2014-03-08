AceJS is a module loader for web browser.
It's tightly along with CMD specification and implements module 1.0.
The most convenient point, you can write your code in Node-style.


Usage:

Just import ace.js in your html and indicate the entry point of your
code file using data-main property in the script tag as below.
(It would be treated as a relative path to current document's location)
<code>
    <script type="text/javascript" src="ace.src.js" data-main="app"></script>
</code>


app.js:
In app.js, wrote your code here to start up, require whatever module you
need to.
<code>
    var inc = require('./increment').increment;
    var a = 1;
    console.log(inc(a)); // 2
</code>


increment.js:
As the independent module required by app.js, increment.js provide a utilities of
function set(here only one increment method, note that you can use the exports as
dependency injection object)
<code>
    var add = require('./math').add;
    exports.increment = function(val) {
      return add(val, 1);
    };
</code>


math.js:
As the independent module required by increment.js, math.js provide a utilities of
function set(here only one add method, note that you can use the exports as
dependency injection object)
<code>
    exports.add = function() {
      var sum = 0, i = 0, args = arguments, l = args.length;
      while (i < l) {
        sum += args[i++];
      }
      return sum;
    };
</code>

If you like the way you write code in this style, and you need not
to worry about polluting global variables.


For building such code into one js file and acejs would not interfere
your code in production environment. You can use Browserify (http://browserify.org/)
to do the server side building and compress it with any tools you like.

AceJS is seamlessly contact with Browserify.

Available in:
IE5.5+
Chrome 1.0+
FireFox 3.5+
Safari (to be tested)
Opera (to be tested)