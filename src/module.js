
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
  LOADING: 2,
  LOADED: 3,
  EXECUTING: 4,
  COMPLETE: 5
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
  ace.cache[id] = module;
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
    this.status = READYSTATE.OPENED;
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
    return this.exports;
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
        return match;
      });
    // All deps modules should be initialised at this point
    this.requireModules = utils.map(requireModules, function (url) {
      // the Module with the unique url maybe cached already
      return ace.cache[url] || (ace.cache[url] = new Module(url))
    });

    /**
     * fetch dependencies modules
     * here I decided not to fetch dependency
     * modules at this time. The chance move to
     * execute `require` statement. Because it is
     * a sync require so it dese not matter.
     */
    // this.fetchRequiredModules()
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
    this.status = READYSTATE.FETCHED;
  },


  /**
   * execute this.code;
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
    f.call(this, _require, module, module.exports);
  }

};
