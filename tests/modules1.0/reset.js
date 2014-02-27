/**
 * Created with JetBrains WebStorm.
 * User: Leo
 * Date: 14-2-27
 * Time: 上午12:49
 * To change this template use File | Settings | File Templates.
 */

function reset () {
  var scripts = document.getElementsByTagName("script");
  for (var i = 0; i < scripts.length; ++i) {
    var src = scripts[i].getAttribute("src", 4);
    if (src && src.indexOf("ace.src.js") > 0) {
      document.body.removeChild(scripts[i]);
      break;
    }
  }
}

function addNewTest (id) {
  var script = document.createElement("script");
  script.async = true;
  script.src = "../../dist/ace.src.js?t=" //+ (+new Date());
  script.setAttribute("data-main", id);

  document.body.appendChild(script);
}