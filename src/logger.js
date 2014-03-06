
/**
 * Created with JetBrains WebStorm.
 * User: Leo
 * Date: 14-3-1
 * Time: 上午12:40
 * To change this template use File | Settings | File Templates.
 */

var LogLevel = {
  SEVERE: 4,
  INFO: 2,
  SILENT: 1
};


var Log = {
  record: function () {
    if (ace.config.logLevel >= LogLevel.INFO) {

    }
  }
};
