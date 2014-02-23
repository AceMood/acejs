/**
 * author: AceMood
 * Email: zmike86@gmail.com
 * Date: 14-2-19
 * Time: 上午12:56
 */

/**
 * ==================================================================
 * browser code in development
 *
 * locked into on of these options
 *
 *  1) using a special XHR synchronous script loader and
 *      a) seeing poor error messages with strange line numbering
 *         not corresponding with source code line numbering or
 *      b) using a JavaScript interpreter written in JavaScript
 *         to execute the code retrieved by the XHR. Line numbers
 *         would then correspond to source code line numbers.
 *         (Seems like an extreme solution.)
 *
 *  2) edit-compile-load-test cycle using the code below. Also
 *     strange numbering in error messages that does not match
 *     source files. Tools could make compile automatic but that
 *     means tools are required and that is not the case in
 *     the current browser scripting world.
 *
 *
 * ==================================================================
 * compiled for production in browser
 *
 *
 * library.js
 *
 * var require = (function() {
 *
 * // memoized export objects
 * var exportsObjects = {}
 *
 * // don't want outsider redefining "require" and don't want
 * // to use arguments.callee so name the function here.
 * var require = function(name) {
 *     if (exportsObjects.hasOwnProperty(name)) {
 *         return exportsObjects[name];
 *     }
 *     var exports = {};
 *     // memoize before executing module for cyclic dependencies
 *     exportsObjects[name] = exports;
 *     modules[name](require, exports);
 *     return exports;
 * };
 *
 * return require;
 * })();
 *
 * var run = function(name) {
 *     require(name); // doesn't return exports
 * };
 *
 * var modules = {};
 * //
 * // compiledModules.js
 * //
 * modules["math"] = function(require, exports) {
 *    exports.add = function() {
 *        var sum = 0, i = 0, args = arguments, l = args.length;
 *        while (i < l) {
 *            sum += args[i++];
 *        }
 *        return sum;
 *    };
 * };
 *
 * modules["increment"] = function(require, exports) {
 *    var add = require('math').add;
 *    exports.increment = function(val) {
 *        add(val, 1);
 *    };
 * };
 *
 * modules["program"] = function(require, exports) {
 *    var inc = require('increment').increment;
 *    var a = 1;
 *    inc(a); // 2
 * };
 * //
 * // html in document head
 * //
 * <script src="library.js" type="text/javascript"></script>
 * <script src="compiledModules.js" type="text/javascript"></script>
 * <script type="text/javascript">
 * // You might not use use the window.onload property
 * // but rather addEventListener/attachEvent.
 * window.onload = function() {
 *    run("program");
 * };
 * </script>
 */

(function (global, undefined) {
