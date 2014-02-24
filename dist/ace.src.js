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


/**
 * @fileoverview This module contains utilities I tend to
 * include all useful functions.
 */

var doc = document;
var op = Object.prototype,
    ap = Array.prototype;

var utils = {

  /**
   * iterate the array and map the value to a delegation
   * function, use the return value replace original item.
   * @param {!Array} arr
   * @param {!Function} fn
   * @return {!Array}
   */
  map: function (arr, fn) {
    for (var i = 0; i < arr.length; ++i) {
      arr[i] = fn(arr[i], i, arr);
    }
    return arr;
  },


  /**
   *
   */
  forEach: function (arr, fn) {
    for (var i = 0; i < arr.length; ++i) {
      fn(arr[i], i, arr);
    }
  },


  /**
   * current executing script node
   * @type {!Element}
   */
  interactiveScript: null,


  /**
   * get all script nodes in current document
   * @return {NodeList}
   */
  scripts: function () {
      return doc.getElementsByTagName('script')
  },


  /**
   * get the script node which point to ace.js
   * @return {!Element}
   */
  getAceNode: function () {
    var self = this;
    return document.currentScript || (function () {
      if (self.interactiveScript &&
        self.interactiveScript.readyState === 'interactive') {
        return self.interactiveScript;
      }

      var scriptNodes = ap.slice.apply(self.scripts());
      var script;
      while (script = scriptNodes.pop()) {
        if (script.readyState === 'interactive') {
          self.interactiveScript = script;
          break;
        }
      }
      return self.interactiveScript;
    })();
  }

};


/**
 * @fileoverview This module contains utilities for handling and
 * transforming file paths. Almost all these methods perform only
 * string transformations. The file system is not consulted to check
 * whether paths are valid.
 */

// as most time, we find file path delimited by slash symbol
var slashRegExp = /\//g,
  // and a directory file path could be ends with a slash (back slash in window)
  dirRegExp = /\/$/g,
  // whether a path to a file with extension
  jsExtRegExp = /\.js$/g;

var loc = global.location;

/**
 * to get current document's directory
 * @return {string}
 */
function getPageDir() {
  return dirname(loc.href)
}


/**
 * Judge if a path is a relative one.
 * In most environment, start with a single/double dot.
 *
 * e.g: ../a/b/c; ./a/b
 *
 * @param {string} p
 * @return {boolean}
 */
function isRelative(p) {
  return !isAbsolute(p) && (/^(\.){1,2}\//.test(p) || p[0] != '/')
}


/**
 * Determine if a path is a absolute one.
 * In most environment, starts with a `http://` or `https://`.
 * In File System, starts with a `file:///` protocol
 *
 * @param {string} p
 * @return {boolean}
 */
function isAbsolute(p) {
  return /:\/\//.test(p)
}


/**
 * Judge if a path is a root path.
 * In most environment, only a single slash.
 * @param {string} p
 * @return {boolean}
 */
function isRoot(p) {
  return p === '/'
}


/**
 * Judge if a path is top-level
 * @param {string} p
 * @return {boolean}
 */
function isTopLevel (p) {
  return isRelative(p) && p[0] != '.';
}


/**
 * Join all arguments together and normalize the resulting path.
 *
 * Arguments must be strings. In v0.8, non-string arguments were
 * silently ignored. In v0.10 and up, an exception is thrown.
 *
 * Example:
 * path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')
 * // returns '/foo/bar/baz/asdf'
 *
 * path.join('foo', {}, 'bar')
 * // throws exception
 * TypeError: Arguments to path.join must be strings
 * @param {string...} var_p
 */
function join(var_p) {
  // convert to array
  var paths = ap.slice.call(arguments, 0);
  return normalize(paths.join('/'))
}


/**
 *
 * @param p
 */
function resolve(p) {

}


/**
 * Normalize a string path, taking care of '..' and '.' parts.
 *
 * When multiple slashes are found, they're replaced by a single one;
 * when the path contains a trailing slash, it is preserved.
 * On Windows backslashes are used in FileSystem.
 *
 * Example:
 * path.normalize('/foo/bar//baz/asdf/quux/..')
 * returns '/foo/bar/baz/asdf'
 *
 * @param {string} p
 */
function normalize(p) {
  // step1: combine multi slashes
  p = p.replace(/(\/)+/g, '/');
  p = p.split(slashRegExp);

  // step2: resolve `.` and `..`
  for (var i = 0; i < p.length; ++i) {
    if (p[i] === '.') {
      p.splice(i, 1);
      --i;
    } else if (p[i] === '..' && i > 0 && p[i - 1] != '..') {
      p.splice(i - 1, 2);
      i -= 2;
    }
  }
  return p.join('/')
}


/**
 * Return the directory name of a path. Similar to the
 * Unix dirname command.
 *
 * Example:
 * path.dirname('/foo/bar/baz/asdf/quux')
 * returns '/foo/bar/baz/asdf'
 *
 * @param {!string} p
 * @return {!string}
 */
function dirname(p) {
  if (dirRegExp.test(p))
    return p.slice(0, -1);
  p = p.split(slashRegExp);
  p.pop();
  return p.join('/')
}


/**
 * Map the identifier for a module to a Internet file
 * path. xhrio can use the path to load module from
 * server.
 *
 * @param {!string} moduleName Always the module's identifier.
 * @param {string?} base A relative baseuri for resolve the
 *   module's absolute file path.
 * @return {!string} absolute file path from Internet
 */
function id2url(moduleName, base) {
  moduleName = normalize(moduleName);
  var conjuction = moduleName[0] == '/' ? '' : '/';
  var url = (base ? dirname(base) : getPageDir()) + conjuction + moduleName;
  if (!jsExtRegExp.test(url))
    url += '.js';
  return url
}


/**
 * represent the module's status.
 * A module here is definitely a common script file.
 * Fetch the script with xhr could have the module have
 * the same status with xhr object.
 *
 * For more about `onreadystatechange` and `readyState`
 * property in xhr object, plz check here:
 * `https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest`
 *
 * On another hand, we should execute the module code at proper time.
 * So hold the `COMPLETE` status before the code running.
 *
 * @type {Object.<!Number>}
 */
var READYSTATE = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4,
  COMPLETE: 5
};


/**
 * A module fly into a script file which could be fetched by
 * sync xhr send. Its code will not be executed immediately.
 * Only after all its requiredModules been executed.
 *
 * @param {!String} id
 * @constructor
 */
function Module(id) {
  /** @type {!string} */
  this.id = id;
  /** @type {Array?} */
  this.requireModules = null;
  /** @type {object?} */
  this.exports = null;
  this.status = READYSTATE.UNSENT;
  /** @type {string} */
  this.code = '';
}


/**
 * A static method to cache fetched module.
 * Here using its absolute path as key can make it
 * unique all the time.
 *
 * @param {!string} id File path
 * @param {object} module Module's exports object, which
 *   can be nullable.
 */
Module.registerModule = function (id, module) {
  ace.cache[id] = module.exports
};


Module.prototype = {

  /**
   * revise the constructor's name to normal.
   * Or it will be Object.
   */
  constructor: Module,


  /**
   * load self script file depend on self.id
   */
  fetchSelfModule: function () {
    var xhr = xhrio.createXhr();
    xhrio.send(xhr, this.id, 'GET', this.resolveRequiredModules, this);
    this.status = READYSTATE.DONE;
    this.execCode();
    Module.registerModule(this.id, this);
    this.status = READYSTATE.COMPLETE;
    return this.exports
  },


  /**
   * After fetch self's code, we should resolve the requireModules
   * included in current module and load them in order.
   *
   * @param {!string} code Source code in text-format.
   */
  resolveRequiredModules: function (code) {
    var self = this;
    var requireModules = [];
    // resolve txt-format source code
    this.code = code.replace(commentRegExp, '')
      .replace(requireRegExp, function (match, quote, moduleName) {
        requireModules.push(id2url(moduleName, self.id));
        return match
      });
    // All deps modules should be initialised at this point
    this.requireModules = utils.map(requireModules, function (url) {
      return new Module(url)
    });
    // fetch dependencies modules
    this.fetchRequiredModules()
  },


  /**
   * we need to fetch all deps modules.
   */
  fetchRequiredModules: function () {
    utils.forEach(this.requireModules, function (module) {
      module.fetchSelfModule()
    });
  },


  /**
   * After all, we execute this.code;
   */
  execCode: function () {
    var module = {exports: {}};
    var f = new Function('require', 'module', 'exports', this.code);
    // todo function's context should be another object
    f.call({}, ace.require, module, module.exports);
    this.exports = module.exports
  }

};


var xhrio = {

    /**
     * A factory method to create a xhr object xros
     * browsers. More use of it, more memory and resource
     * it take, so consider use `xhrpool` instead in the
     * future.
     *
     * @return {XMLHttpRequest}
     */
    createXhr: function () {
        return new XMLHttpRequest()
    },

    /**
     *
     *
     * @param {XMLHttpRequest} xhr
     * @param {string} url
     * @param {string} opt_method
     * @param {function} callback
     * @param {object?} context
     */
    send: function (xhr, url, opt_method, callback, context) {
        xhr.onreadystatechange = function () {
          if (this.readyState == READYSTATE.DONE) {
            if (this.status == 200)
              callback.call(context, this.responseText);
          }
        };
        xhr.open(opt_method || 'GET', url, false);
        xhr.send(null);
    },

    /**
     * Handle callback when xhr's onreadystatechange event
     * been triggered.
     */
    xhrOnLoad: function () {
      if (this.readyState == READYSTATE.DONE) {
        if (this.status == 200)
          callback.call(context);
      }
    }
};


// A regexp to filter `require('xxx')`
// A regexp to drop comments in source code
var requireRegExp = /\brequire\s*\(\s*(["'])([^'"\s]+)\1\s*\)/g,
    commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;


var ace = {
  author: 'zmike86',
  version : '0.1',
  /**
   * require function
   * @param {string} moduleName
   * @return {Module}
   */
  require: function (moduleName) {
    var url = id2url(moduleName);
    if (ace.cache[url] /*&& ace.cache[url].status >= READYSTATE.LOADING*/) {
      return ace.cache[url]
    } else {
      var module = ace.cache[url] = new Module(url);
      return module.fetchSelfModule()
    }
  }
};


/**
 * Default configuration object.
 * @type {*|Object}
 */
ace.config = global.aceConfig || {};


/**
 * Need a place store all the modules have been fetched and executed.
 * It is important to cache them, so that reduce resource use for generate
 * xhr and COM/DOM event.
 * @type {Object}
 */
ace.cache = {};

// start load entry module
(function () {
  var entry = utils.getAceNode().getAttribute('data-main');
  entry = id2url(entry);
  var module = ace.cache[entry] = new Module(entry);
  module.fetchSelfModule();
}());

}(this))