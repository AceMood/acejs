
/**
 * @fileoverview This module contains utilities for handling and
 * transforming file paths. Almost all these methods perform only
 * string transformations. The file system is not consulted to check
 * whether paths are valid.
 */


var // and a directory file path could be ends with a slash (back slash in window)
  dirRegExp = /\/$/g,
  // whether a path to a file with extension
  jsExtRegExp = /\.js$/g;

var loc = global.location;


/**
 * to get current document's directory
 * @return {string}
 */
function getPageDir() {
  return dirname(loc.href)
}


/**
 * Judge if a path is a relative one.
 * In most environment, start with a single/double dot.
 *
 * e.g: ../a/b/c; ./a/b
 *
 * @param {string} p
 * @return {boolean}
 */
function isRelative(p) {
  return !isAbsolute(p) && (/^(\.){1,2}\//.test(p) || p[0] != '/')
}


/**
 * Determine if a path is a absolute one.
 * In most environment, starts with a `http://` or `https://`.
 * In File System, starts with a `file:///` protocol
 *
 * @param {string} p
 * @return {boolean}
 */
function isAbsolute(p) {
  return /:\/\//.test(p)
}


/**
 * Judge if a path is a root path.
 * In most environment, only a single slash.
 * @param {string} p
 * @return {boolean}
 */
function isRoot(p) {
  return p === '/'
}


/**
 * Judge if a path is top-level
 * @param {string} p
 * @return {boolean}
 */
function isTopLevel (p) {
  return isRelative(p) && p[0] != '.';
}


/**
 * Join all arguments together and normalize the resulting path.
 *
 * Arguments must be strings. In v0.8, non-string arguments were
 * silently ignored. In v0.10 and up, an exception is thrown.
 *
 * Example:
 * path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')
 * // returns '/foo/bar/baz/asdf'
 *
 * path.join('foo', {}, 'bar')
 * // throws exception
 * TypeError: Arguments to path.join must be strings
 * @param {string...} var_p
 */
function join(var_p) {
  // convert to array
  var paths = ap.slice.call(arguments, 0);
  return normalize(paths.join('/'))
}


/**
 * Normalize a string path, taking care of '..' and '.' parts.
 *
 * When multiple slashes are found, they're replaced by a single one;
 * when the path contains a trailing slash, it is preserved.
 * On Windows backslashes are used in FileSystem.
 *
 * Example:
 * path.normalize('/foo/bar//baz/asdf/quux/..')
 * returns '/foo/bar/baz/asdf'
 *
 * @param {string} p
 */
function normalize(p) {
  // step1: combine multi slashes
  p = p.replace(/(\/)+/g, '/');

  // step2: resolve `.` and `..`
  // Here I used to use /\//ig to split string, but unfortunately
  // it has serious bug in IE<9. See for more:
  // `http://blog.stevenlevithan.com/archives/cross-browser-split`.
  p = p.split('/');
  for (var i = 0; i < p.length; ++i) {
    if (p[i] === '.') {
      p.splice(i, 1);
      --i;
    } else if (p[i] === '..' && i > 0 && p[i - 1] != '..') {
      p.splice(i - 1, 2);
      i -= 2;
    }
  }
  return p.join('/')
}


/**
 * Return the directory name of a path. Similar to the
 * Unix dirname command.
 *
 * Example:
 * path.dirname('/foo/bar/baz/asdf/quux')
 * returns '/foo/bar/baz/asdf'
 *
 * @param {!string} p
 * @return {!string}
 */
function dirname(p) {
  if (dirRegExp.test(p))
    return p.slice(0, -1);
  // Here I used to use /\//ig to split string, but unfortunately
  // it has serious bug in IE<9. See for more:
  // `http://blog.stevenlevithan.com/archives/cross-browser-split`.
  p = p.split('/');
  p.pop();
  return p.join('/')
}


/**
 * Map the identifier for a module to a Internet file
 * path. xhrio can use the path to load module from
 * server.
 *
 * @param {!string} moduleName Always the module's identifier.
 * @param {string?} base A relative baseuri for resolve the
 *   module's absolute file path.
 * @return {!string} absolute file path from Internet
 */
function id2url(moduleName, base) {
  moduleName = normalize(moduleName);
  var conjuction = moduleName[0] == '/' ? '' : '/';
  var url = (base ? dirname(base) : getPageDir()) + conjuction + moduleName;

  if (!jsExtRegExp.test(url))
    url += '.js';

  //todo
  // Here I used to use /\//ig to split string, but unfortunately
  // it has serious bug in IE<9. See for more:
  // `http://blog.stevenlevithan.com/archives/cross-browser-split`.
  url = url.split('/');
  for (var i = 0; i < url.length; ++i) {
    if (url[i] === '.') {
      url.splice(i, 1);
      --i;
    } else if (url[i] === '..' && i > 0 && url[i - 1] != '..') {
      url.splice(i - 1, 2);
      i -= 2;
    }
  }

  return url.join('/')
}
