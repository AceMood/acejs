var path = require('path');
var n = path.normalize,
  d = path.normalize;

var
  p0 = '//a/b',
  p1 = 'a/b/c',
  p2 = 'a/b/c/',
  p3 = '/a/b/c',
  p4 = '/a/b/c/',

  p5 = 'a/./b/c',
  p6 = 'a/b/../c',
  p7 = 'a/b/./../c',
  p8 = 'a/b/../../c',
  p9 = 'a/b/././c',

  p10 = 'a//b/c',
  p11 = 'a/b/.././c',
  p12 = 'a/b/c/..',
  p13 = 'a///b/c',
  p15 = 'a//.//b',

  p16 = '../a//.//b',
  p17 = '././a/b',
  p18 = '../../a/b',
  p19 = '/./a/b',
  p20 = 'http://go.example.com/xxx',

  p21 = 'https://go.example.com/',
  p22 = 'file:///D:/Demo/xxx';

console.log(d(p0));
console.log(d(p1));
console.log(d(p2));
console.log(d(p3));
console.log(d(p4));
console.log(d(p5));
console.log(d(p6));
console.log(d(p7));
console.log(d(p8));
console.log(d(p9));
console.log(d(p10));
console.log(d(p11));
console.log(d(p12));
console.log(d(p13));
console.log(d(p15));
console.log(d(p16));
console.log(d(p17));
console.log(d(p18));
console.log(d(p19));
console.log(d(p20));
console.log(d(p21));
console.log(d(p22));