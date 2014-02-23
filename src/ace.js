
// A regexp to filter `require('xxx')`
// A regexp to drop comments in source code
var requireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
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
