var paths = [
  '//a/b',
  'a/b/c',
  'a/b/c/',
  '/a/b/c',
  '/a/b/c/',

  'a/./b/c',
  'a/b/../c',
  'a/b/./../c',
  'a/b/../../c',
  'a/b/././c',

  'a//b/c',
  'a/b/.././c',
  'a/b/c/..',
  'a///b/c',
  'a//.//b',

  '../a//.//b',
  '././a/b',
  '../../a/b',
  '/./a/b',
  'http://go.example.com/xxx',

  'https://go.example.com/',
  'file:///D:/Demo/xxx'];

QUnit.test("path.isAbsolute", function (assert) {
  var expect = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true];

  for (var i = 0; i < paths.length; ++i) {
    assert.equal(isAbsolute(paths[i]), expect[i], 'pass ' +
      (i + 1));
  }
});
QUnit.test("path.isRelative", function (assert) {
  var expect = [
    false,
    true,
    true,
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false];

  for (var i = 0; i < paths.length; ++i) {
    assert.equal(isRelative(paths[i]), expect[i], 'pass ' +
      (i + 1));
  }
});
QUnit.test("path.isTopLevel", function (assert) {
  var expect = [
    false,
    true,
    true,
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false];

  for (var i = 0; i < paths.length; ++i) {
    assert.equal(isTopLevel(paths[i]), expect[i], 'pass ' +
      (i + 1));
  }
});
QUnit.test('path.dirname', function (assert) {
  var expect = [
    '//a',
    'a/b',
    'a/b/c',
    '/a/b',
    '/a/b/c',

    'a/./b',
    'a/b/..',
    'a/b/./..',
    'a/b/../..',
    'a/b/./.',

    'a//b',
    'a/b/../.',
    'a/b/c',
    'a///b',
    'a//./',

    '../a//./',
    '././a',
    '../../a',
    '/./a',
    'http://go.example.com',

    'https://go.example.com',
    'file:///D:/Demo'];

  for (var i = 0; i < paths.length; ++i) {
    assert.equal(dirname(paths[i]), expect[i], 'pass ' +
      (i + 1));
  }
});
QUnit.test('path.normalize', function (assert) {
  var expect = [
    '/a/b',
    'a/b/c',
    'a/b/c/',
    '/a/b/c',
    '/a/b/c/',

    'a/b/c',
    'a/c',
    'a/c',
    'c',
    'a/b/c',

    'a/b/c',
    'a/c',
    'a/b',
    'a/b/c',
    'a/b',

    '../a/b',
    'a/b',
    '../../a/b',
    '/a/b',
    'http:/go.example.com/xxx',

    'https:/go.example.com/',
    'file:/D:/Demo/xxx'];

  for (var i = 0; i < paths.length; ++i) {
    assert.equal(normalize(paths[i]), expect[i], 'pass ' +
      (i + 1));
  }
});
/*QUnit.test("path.resolve", function (assert) {


});*/