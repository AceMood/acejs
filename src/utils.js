
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
          return script;
        }
      }

      // At last, I check for the src attribute
      for (i = 0; i < len; ++i) {
        script = scripts[i];
		var src = script.getAttribute('src');
        if (/\bace(?:\.(?:src|min))?\.js$/.test(src)) {
          utils.interactiveScript = script;
          return script;
        }
      }

      return null;

    })();
  }

};
