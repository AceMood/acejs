
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
