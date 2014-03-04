/**
 * Created with JetBrains WebStorm.
 * User: Leo
 * Date: 14-2-17
 * Time: 上午12:04
 * To change this template use File | Settings | File Templates.
 */

exports.add = function() {
  var sum = 0, i = 0, args = arguments, l = args.length;
  while (i < l) {
    sum += args[i++];
  }
  return sum;
};