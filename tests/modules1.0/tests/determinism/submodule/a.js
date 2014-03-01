var pass = false;
try {
    require('a');
} catch (exception) {
    pass = true;
}
mytest.assert(pass,
  'require does not fall back to relative modules when absolutes are not available.');
