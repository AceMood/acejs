
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
