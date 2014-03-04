/**
 * Created with JetBrains WebStorm.
 * User: Leo
 * Date: 14-2-27
 * Time: 上午12:49
 * To change this template use File | Settings | File Templates.
 */

var head = document.getElementsByTagName("head")[0];

function reset (name) {
  if (window.acejs) {
    acejs.reset();
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; ++i) {
      var src = scripts[i].getAttribute("src", 4);
      if (src && src.indexOf("ace.src.js") > 0) {
        scripts[i].setAttribute("data-main", name);
        break;
      }
    }
    acejs.setup();
  }
}