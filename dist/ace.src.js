/**
 * author: AceMood
 * Email: zmike86@gmail.com
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
   * @param {Array} arr array to be iterated.
   * @param {Function} fn callback to execute on each item
   * @param {Object?} opt_context fn's context
   * @return {!Array}
   */
  map: function (arr, fn, opt_context) {
    var ret = [];
    if (ap.map && arr.map === ap.map) {
      ret = arr.map(fn, opt_context)
    } else if (arr.length === +arr.length) {
      for (var i = 0; i < arr.length; ++i) {
        ret.push(fn.call(opt_context || null, arr[i], i, arr))
      }
    }
    return ret
  },


  /**
   * enhancement for Array.prototype.forEach.
   * @param {Array} arr array to be iterated.
   * @param {Function} fn callback to execute on each item
   * @param {Object?} opt_context fn's context
   */
  forEach: function (arr, fn, opt_context) {
    if (ap.forEach && arr.forEach === ap.forEach) {
      arr.forEach(fn, opt_context)
    } else if (arr.length === +arr.length) {
      for (var i = 0, length = arr.length; i < length; i++) {
        fn.call(opt_context, arr[i], i, arr)
      }
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
   * @return {Element?}
   */
  getAceNode: function () {
    // Chrome 29.0+ and FireFox 4.0+ support the native
    // property of document and can determine the current
    // executing script node.
    // In IE we use script.readyState to know which is the
    // right one.
    // But in older FF(before 4.0) there has no readyState
    // and currentScript, we use script node has `ace.js` in
    // its src attribute but be aware that it can not be fully
    // trusted.
    return document.currentScript || (function () {
      if (utils.interactiveScript &&
        utils.interactiveScript.readyState === 'interactive') {
        return utils.interactiveScript
      }

      var scripts = utils.scripts(),
          script, i,
          len = scripts.length;

      // for older IEs do not support currentScript
      for (i = 0; i < len; ++i) {
        script = scripts[i];
        if (script.readyState === 'interactive') {
          utils.interactiveScript = script;
          return script
        }
      }

      // At last, I check for the src attribute
      for (i = 0; i < len; ++i) {
        script = scripts[i];
        var src = script.getAttribute('src');
        if (/\bace(?:\.(?:src|min))?\.js$/.test(src)) {
          utils.interactiveScript = script;
          return script
        }
      }

      return null

    })();
  }

};


/**
 * Created with JetBrains WebStorm.
 * User: Leo
 * Date: 14-3-1
 * Time: 上午12:40
 * To change this template use File | Settings | File Templates.
 */

var LogLevel = {
  SEVERE: 4,
  INFO: 2,
  SILENT: 1
};


var Log = {
  record: function () {
    if (ace.config.logLevel >= LogLevel.INFO) {

    }
  }
};


/**
 * @fileoverview This module contains utilities for handling and
 * transforming file paths. Almost all these methods perform only
 * string transformations. The file system is not consulted to check
 * whether paths are valid.
 */


var // and a directory file path could be ends with a slash (back slash in window)
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

  // step2: resolve `.` and `..`
  // Here I used to use /\//ig to split string, but unfortunately
  // it has serious bug in IE<9. See for more:
  // `http://blog.stevenlevithan.com/archives/cross-browser-split`.
  p = p.split('/');
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
  // Here I used to use /\//ig to split string, but unfortunately
  // it has serious bug in IE<9. See for more:
  // `http://blog.stevenlevithan.com/archives/cross-browser-split`.
  p = p.split('/');
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

  //todo
  // Here I used to use /\//ig to split string, but unfortunately
  // it has serious bug in IE<9. See for more:
  // `http://blog.stevenlevithan.com/archives/cross-browser-split`.
  url = url.split('/');
  for (var i = 0; i < url.length; ++i) {
    if (url[i] === '.') {
      url.splice(i, 1);
      --i;
    } else if (url[i] === '..' && i > 0 && url[i - 1] != '..') {
      url.splice(i - 1, 2);
      i -= 2;
    }
  }

  return url.join('/')
}


/**
 * represent the module's status.
 * A module here is definitely a common script file.
 * Fetch the script with xhr and execute it could have
 * the module have the five status below.
 *
 * For more about `onreadystatechange` and `readyState`
 * property in xhr object, please check here:
 * `https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest`
 *
 * On another hand, we should execute the module code at proper time.
 * So hold the `COMPLETE` status before the code running.
 *
 * @type {Object.<!Number>}
 */
var READYSTATE = {
  UNSENT: 0,
  LOADING: 1,
  LOADED: 2,
  EXECUTING: 3,
  COMPLETE: 4
};


/**
 * @type {Module?} current interactive module;
 */
var currentModule;


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
  /** @type {number} default to UNSET */
  this.status = READYSTATE.UNSENT;
  /** @type {string} */
  this.code = ''
}


/**
 * A static method to cache fetched module.
 * Here using its absolute path as key can make it
 * unique all the time.
 *
 * @param {!String} id Absolute file path
 * @param {object} module Module's exports object, which
 *   can be nullable at uninitalization stage.
 */
Module.registerModule = function (id, module) {
  ace.cache[id] = module
};


Module.prototype = {

  /**
   * revise the constructor's name to correct.
   * Or it will be `Object` instead.
   */
  constructor: Module,


  /**
   * load self script file depend on self.id
   */
  fetchSelfModule: function () {
    var xhr = xhrio.createXhr();
    this.status = READYSTATE.LOADING;
    // require self module file
    xhrio.send(xhr, this.id, 'GET', this.resolveRequiredModules, this);
    // execute self's code
    currentModule = this;
    this.execCode();
    // register module to global cache
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
    this.status = READYSTATE.LOADED;
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
      // the Module with the unique url maybe cached already
      return ace.cache[url] || (ace.cache[url] = new Module(url))
    });
  },


  /**
   * we need to fetch all deps modules before execute the module's code.
   *
   * If there has a circular dependency, a->b and b->a, when goes here:
   * b.fetchRequiredModules (from b.resolveRequiredModules), a.status
   * could be `READYSTATE.FETCHING` and a.exports could be plain object
   * as in a initialization stage.
   */
  fetchRequiredModules: function () {
    var self = this;
    this.status = READYSTATE.FETCHING;
    utils.forEach(this.requireModules, function (module) {
      // occurs a circular dependencies
      if (module.status === READYSTATE.FETCHING) {
        if (ace.config.logLevel >= LogLevel.INFO) {
          throw 'circular deps occured. from ' +
            (self && self.id || '') + ' to ' + module.id;
        }
        Module.registerModule(module.id, module);
      } else if (module.status < READYSTATE.COMPLETE) {
        module.fetchSelfModule();
      }
    });
    this.status = READYSTATE.FETCHED
  },


  /**
   * execute module's text-format code;
   */
  execCode: function () {
    var module = {exports: {}};
    var f = new Function('require', 'module', 'exports', this.code);
    var self = this;
    var _require = (function () {
      return function () {
        return ace.require.apply(self, ap.slice.call(arguments));
      }
    }());
    // todo function's context should be another object
    this.exports = module.exports;
    this.status = READYSTATE.EXECUTING;
    f.call(this, _require, module, module.exports)
  }

};


/**
 * This mainly implement the xhr factory object.
 * In the core, we use xhr to fetch JavaScript file
 * in AceJS.
 *
 * @fileoverview
 */


var xhrio = {

  /**
   * Highly recommend to read the definition:
   * `http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html`
   */
  STATUSCODE: {
    OK: 200,
    REDIRECT: 302,
    FORBIDDEN: 403,
    NOTFOUND: 404
  },


  /**
   * A factory method to create a xhr object accross
   * browsers. More use of it, more memory and resource
   * it take, so consider use `xhrpool` instead in the
   * future.
   *
   * @return {XMLHttpRequest}
   */
  createXhr: function () {
    var ieProgId_ = '';
    // The following blog post describes what PROG IDs to use to create the
    // XMLHTTP object in Internet Explorer:
    // http://blogs.msdn.com/xmlteam/archive/2006/10/23/
    // using-the-right-version-of-msxml-in-internet-explorer.aspx
    // However we do not (yet) fully trust that this will be OK for old versions
    // of IE on Win9x so we therefore keep the last 2.
    if (typeof XMLHttpRequest == 'undefined' &&
      typeof ActiveXObject != 'undefined') {
      // Candidate Active X types.
      var ACTIVE_X_IDENTS = [
        'MSXML2.XMLHTTP.6.0',
        'MSXML2.XMLHTTP.3.0',
        'MSXML2.XMLHTTP',
        'Microsoft.XMLHTTP'
      ];
      for (var i = 0; i < ACTIVE_X_IDENTS.length; i++) {
        var candidate = ACTIVE_X_IDENTS[i];
        try {
          new ActiveXObject(candidate);
          // NOTE(user): cannot assign progid and return candidate in one line
          // because JSCompiler complaings: BUG 658126
          ieProgId_ = candidate;
        } catch (e) {
          // do nothing; try next choice
        }
      }
      if (!ieProgId_)
        // couldn't find any matches
        throw Error('Could not create ActiveXObject. ActiveX might be disabled,' +
          ' or MSXML might not be installed');
    }

    if (ieProgId_) {
      return new ActiveXObject(ieProgId_);
    } else {
      return new XMLHttpRequest();
    }
  },


  /**
   * Send a http request to get the specified module
   * with a xhr.
   *
   * @param {XMLHttpRequest} xhr
   * @param {string} url
   * @param {string} opt_method
   * @param {function} callback
   * @param {object?} context
   */
  send: function (xhr, url, opt_method, callback, context) {
    xhr.open(opt_method || 'GET', url, false);
    try {
      xhr.send(null);
    } catch (ex) {}

    if (xhr.status === xhrio.STATUSCODE.OK) {
      callback.call(context, xhr.responseText)
    } else {
      throw Error('failed fetch module at: ' + url + ' ' + xhr.statusText);
    }
  }

};


// A regexp to filter `require('xxx')`
var requireRegExp = /\brequire\s*\(\s*(["'])([^'"\s]+)\1\s*\)/g,
// A regexp to drop comments in source code
  commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;


var ace = {

  author: 'zmike86@gmail.com',
  version : '0.4',
  node: utils.getAceNode(),


  /**
   * Import a module and synchronously returns a exports
   * object stand for the module.
   * @param {string} moduleName
   * @return {Object|Module}
   */
  require: function (moduleName) {
    var base = this ? this.id : '';
    var url = id2url(moduleName, base);
    // seems like a module requires itself,
    // this seldom happen but once happen we throw
    // an indicated error.
    if (url === this.id) {
      throw 'module at ' + url + ' requires itself.'
    }

    if (ace.cache[url]) {
      // If there has a circular dependency, a->b and b->a, when goes here:
      // require('a') (from b), a.status could be `READYSTATE.EXECUTING`
      // and a.exports could be plain object as in a initialization stage.
      if (ace.cache[url].status == READYSTATE.EXECUTING) {
        if (ace.config.logLevel >= LogLevel.INFO) {
          throw 'circular deps occured. from ' +
            (this && this.id || '') + ' to ' + url;
        } else {
          return ace.cache[url].exports;
        }
      // only resolved by foreign module and has been
      // recorded in the global cache but not export anything.
      } else if (ace.cache[url].status < READYSTATE.COMPLETE) {
        return ace.cache[url].fetchSelfModule();
      }
      return ace.cache[url].exports;
    } else {
      var module = ace.cache[url] = new Module(url);
      return module.fetchSelfModule();
    }
  },


  /**
   * This method provided for test. It clear all
   * cached modules and reset the ace.config object.
   */
  reset: function () {
    ace.cache = {};
  },


  /**
   * start the entire app from this entry.
   */
  setup: function () {
    var entry = ace.node.getAttribute('data-main');
    entry = id2url(entry);
    var module = ace.cache[entry] = new Module(entry);
    module.fetchSelfModule()
  }

};


/**
 * Default configuration object.
 * @type {*|Object}
 */
ace.config = {
  logLevel: LogLevel.SILENT,
  root: getPageDir(),
  testable: ace.node.getAttribute("debug") || false
};


/**
 * Need a place store all the modules have been fetched and executed.
 * It is important to cache them, so that reduce resource use for generate
 * xhr and COM/DOM event.
 * @type {Object}
 */
ace.cache = {};


if (ace.config.testable) {
  // do not setup. depend on user's action to invoke setup method
  // manually
  global.acejs = ace;
} else {
  // start load entry module when self executing.
  ace.setup();
}

}(this))