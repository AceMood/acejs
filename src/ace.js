
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
    var base = this ? this.id : '';
    var url = id2url(moduleName, base);
    if (ace.cache[url]) {
      if (ace.cache[url].status == READYSTATE.FETCHING)
        throw 'circular deps occured. from ' +
          (currentModule && currentModule.id || '') + ' to ' + url;
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
