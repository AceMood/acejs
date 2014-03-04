
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
