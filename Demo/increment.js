/**
 * Created with JetBrains WebStorm.
 * User: Leo
 * Date: 14-2-17
 * Time: 上午12:02
 * To change this template use File | Settings | File Templates.
 */

var add = require('./math').add;
exports.increment = function(val) {
  return add(val, 1);
};