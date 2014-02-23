
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
      .replace(requireRegExp, function (match, moduleName) {
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
