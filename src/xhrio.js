
var xhrio = {

    /**
     * A factory method to create a xhr object xros
     * browsers. More use of it, more memory and resource
     * it take, so consider use `xhrpool` instead in the
     * future.
     *
     * @return {XMLHttpRequest}
     */
    createXhr: function () {
        return new XMLHttpRequest()
    },

    /**
     *
     *
     * @param {XMLHttpRequest} xhr
     * @param {string} url
     * @param {string} opt_method
     * @param {function} callback
     * @param {object?} context
     */
    send: function (xhr, url, opt_method, callback, context) {
        xhr.onreadystatechange = function () {
          if (this.readyState == READYSTATE.DONE) {
            if (this.status == 200)
              callback.call(context, this.responseText);
          }
        };
        xhr.open(opt_method || 'GET', url, false);
        xhr.send(null);
    },

    /**
     * Handle callback when xhr's onreadystatechange event
     * been triggered.
     */
    xhrOnLoad: function () {
      if (this.readyState == READYSTATE.DONE) {
        if (this.status == 200)
          callback.call(context);
      }
    }
};
