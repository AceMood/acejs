
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
      ret = arr.map(fn, opt_context);
    } else if (arr.length === +arr.length) {
      for (var i = 0; i < arr.length; ++i) {
        ret.push(fn.call(opt_context || null, arr[i], i, arr));
      }
    }
    return ret;
  },


  /**
   * enhancement for Array.prototype.forEach.
   * @param {Array} arr array to be iterated.
   * @param {Function} fn callback to execute on each item
   * @param {Object?} opt_context fn's context
   */
  forEach: function (arr, fn, opt_context) {
    if (ap.forEach && arr.forEach === ap.forEach) {
      arr.forEach(fn, opt_context);
    } else if (arr.length === +arr.length) {
      for (var i = 0, length = arr.length; i < length; i++) {
        if (fn.call(opt_context, arr[i], i, arr) === breaker)
          return;
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
   * @return {!Element}
   */
  getAceNode: function () {
    var self = this;
    return document.currentScript || (function () {
      if (self.interactiveScript &&
        self.interactiveScript.readyState === 'interactive') {
        return self.interactiveScript
      }

      var scriptNodes = [];
      var scripts = self.scripts(),
        len = scripts.length;

      for (var i=0; i<len; ++i) {
        scriptNodes.push(scripts[i])
      }
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
